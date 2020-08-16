---
title: 如何在低版本 node 运行高版本 node 子进程
date: 2017-05-15
author: burlin
source_link: http://www.alloyteam.com/2017/05/how-to-lower-version-node-running-node-process/
---

<!-- {% raw %} - for jekyll -->

# 如何在低版本 node 运行高版本 node 子进程

-   如何在低版本 node 运行高版本 node 子进程
    -   前言：四个创建子进程的函数
    -   exec / execFile
    -   spawn
    -   fork
    -   总结
    -   如何在 node 低版本运行高版本 node 子进程
    -   nvm 介绍
    -   nvm 好处
    -   nvm 具体原理
        -   download 资源管理
        -   shell 切换环境变量（3 个）
    -   结合 nvm 切换构建子进程环境变量
        -   注入环境变量
    -   子进程函数选择
    -   node -c 运行生成代码
    -   进程和信号量
    -   用于优雅的检测 fis grunt 退出错误

最近在使用 Node 的子进程模块实现一些功能，对相关知识进行了一个系统的学习总结，这篇文章将会简要介绍我总结的 Node 中和进程有关的内容。包括：四个创建子进程的函数、如何在 node 低版本运行高版本 node 子进程、进程以及信号量检测。有不当之处欢迎提出，一起交流。

## 四个创建子进程的函数

在 Node 中，大体上有三种创建进程的方法：

-   exec / execFile
-   spawn
-   fork

### exec / execFile

`exec(command, options, callback)` 和 `execFile(file, args, options, callback)` 比较类似，会使用一个 `Buffer` 来存储进程执行后的标准输出结果，们可以一次性在 `callback` 里面获取到。不太适合输出数据量大的场景。

需要注意的是，`exec` 会首先创建一个新的 shell 进程出来，然后执行 `command`；`execFile` 则是直接将可执行的 `file` 创建为新进程执行。所以，`execfile` 会比 `exec` 高效一些。

`exec` 比较适合用来执行 shell 命令，然后获取输出（比如：`exec('ps aux | grep "node"')`），但是 `execFile` 却没办法这么用，因为它实际上只接受一个可执行的命令，然后执行（没法使用 shell 里面的管道之类的东西）。

```javascript
// child.js
console.log("child argv: ", process.argv);
```

```javascript
// parent.js
const child_process = require("child_process");
const p = child_process.exec(
    "node child.js a b", // 执行的命令
    {},
    (err, stdout, stderr) => {
        if (err) {
            // err.code 是进程退出时的 exit code，非 0 都被认为错误
            // err.signal 是结束进程时发送给它的信号值
            console.log("err:", err, err.code, err.signal);
        }
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);
    }
);
console.log("child pid:", p.pid);
```

```javascript
// parent.js
const p = child_process.execFile(
    "node", // 可执行文件
    ["child.js", "a", "b"], // 传递给命令的参数
    {},
    (err, stdout, stderr) => {
        if (err) {
            // err.code 是进程退出时的 exit code，非 0 都被认为错误
            // err.signal 是结束进程时发送给它的信号值
            console.log("err:", err, err.code, err.signal);
        }
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);
    }
);
console.log("child pid:", p.pid);
```

两个方法还可以传递一些配置项，如下所示：

```javascript
{
    // 可以指定命令在哪个目录执行
    'cwd': null,
    // 传递环境变量，node 脚本可以通过 process.env 获取到         
    'env': {},
    // 指定 stdout 输出的编码，默认用 utf8 编码为字符串（如果指定为 buffer，那 callback 的 stdout 参数将会是 Buffer）       
    'encoding': 'utf8',
    // 指定执行命令的 shell，默认是 /bin/sh（unix） 或者 cmd.exe（windows）
    'shell': '',
    // kill 进程时发送的信号量
    'killSignal': 'SIGTERM',
    // 子进程超时未执行完，向其发送 killSignal 指定的值来 kill 掉进程
    'timeout': 0,
    // stdout、stderr 允许的最大输出大小（以 byte 为单位），如果超过了，子进程将被 kill 掉（发送 killSignal 值）
    'maxBuffer': 200 * 1024,
    // 指定用户 id
    'uid': 0,
    // 指定组 id
    'gid': 0
}
 
```

这里可以看到，我们直接传入的是个回调函数，而不是返回 steam 对象，这样的我们获取的日志是个字符串，这里就会被限制字符串长度 导致进程提前退出。

### spawn

`spawn(command, args, options)` 适合用在进程的输入、输出数据量比较大的情况（因为它支持以 stream 的使用方式），可以用于任何命令。

```javascript
// child.js
console.log("child argv: ", process.argv);
process.stdin.pipe(process.stdout);
```

```javascript
// parent.js
const p = child_process.spawn(
    "node", // 需要执行的命令
    ["child.js", "a", "b"], // 传递的参数
    {}
);
console.log("child pid:", p.pid);
p.on("exit", (code) => {
    console.log("exit:", code);
});
// 父进程的输入直接 pipe 给子进程（子进程可以通过 process.stdin 拿到）
process.stdin.pipe(p.stdin);
// 子进程的输出 pipe 给父进程的输出
p.stdout.pipe(process.stdout);
/* 或者通过监听 data 事件来获取结果
var all = '';
p.stdout.on('data', data => {
    all += data; 
});
p.stdout.on('close', code => {
    console.log('close:', code);
    console.log('data:', all);
});
*/
// 子进程的错误输出 pipe 给父进程的错误输出
p.stderr.pipe(process.stderr);
```

我们可以执行 `cat bigdata.txt | node parent.js` 来进行测试，bigdata.txt 文件的内容将被打印到终端。

`spawn` 方法的配置（options）如下：

```javascript
{
    // 可以指定命令在哪个目录执行
    'cwd': null,
    // 传递环境变量，node 脚本可以通过 process.env 获取到         
    'env': {},
    // 配置子进程的 IO
    'stdio': 'pipe',
    // 为子进程独立运行做好准备
    'detached': false,
    // 指定用户 id
    'uid': 0,
    // 指定组 id
    'gid': 0
}
 
```

我们这里主要介绍下 `detached` 和 `stdio` 这两个配置。

#### stdio

`stdio` 用来配置子进程和父进程之间的 IO 通道，可以传递一个数组或者字符串。比如，`['pipe', 'pipe', 'pipe']`，分别配置：标准输入、标准输出、标准错误。如果传递字符串，则三者将被配置成一样的值。我们简要介绍其中三个可以取的值：

-   pipe（默认）：父子进程间建立 pipe 通道，可以通过 stream 的方式来操作 IO
-   inherit：子进程直接使用父进程的 IO
-   ignore：不建立 pipe 通道，不能 pipe、不能监听 data 事件、IO 全被忽略

比如上面的代码如果改写成下面这样，效果完全一样（子进程直接使用了父进程的 IO）：

```javascript
const p = child_process.spawn("node", ["child.js", "a", "b"], {
    // 'stdio': ['inherit', 'inherit', 'inherit']
    stdio: "inherit",
});
console.log("child pid:", p.pid);
p.on("exit", (code) => {
    console.log("exit:", code);
});
```

#### detached

`detached` 配置主要用来创建常驻的 “后台” 进程，比如下面的代码：

```javascript
// child.js
setInterval(() => {
    console.log("child");
}, 1000);
```

```javascript
// parent.js
const p = child_process.spawn("node", ["child.js", "a", "b"], {
    stdio: "ignore", // 父子进程间不建立通道
    detached: true, // 让子进程能在父进程退出后继续运行
});
// 默认情况，父进程会等子进程，这个方法可以让子进程完全独立运行
p.unref();
console.log("child pid:", p.pid);
p.on("exit", (code) => {
    console.log("exit:", code);
});
```

这样就实现了常驻的后台进程，父进程退出了、shell 关掉了，子进程都会一直运行，直到手动将它 `kill` 掉。

### fork

`fork(modulePath, args, options)` 实际上是 `spawn` 的一个 “特例”，会创建一个新的 V8 实例，新创建的进程只能用来运行 Node 脚本，不能运行其他命令。并且会在父子进程间建立 IPC 通道，从而实现进程间通信。

```javascript
// child.js
console.log("child argv: ", process.argv);
process.stdin.pipe(process.stdout);
```

```javascript
// parent.js
const p = child_process.fork(
    "child.js", // 需要执行的脚本路径
    ["a", "b"], // 传递的参数
    {}
);
console.log("child pid:", p.pid);
p.on("exit", (code) => {
    console.log("exit:", code);
});
```

上面代码的效果和使用 `spawn` 并配置 `stdio: inherit` 的效果是一致的。我们看下该方法的配置（options）就知道原因了：

```javascript
{
    // 可以指定命令在哪个目录执行
    'cwd': null,
    // 传递环境变量，node 脚本可以通过 process.env 获取到         
    'env': {},
    // 创建子进程使用的 node 的执行路径（默认是：process.execPath）
    'execPath': '',
    // 创建子进程时，传递给执行程序的参数（默认是：process.execArgv）
    'execArgv': [],
    // 设置为 true 时，父子间将建立 IO 的 pipe 通道（pipie）；设置为 false 时（默认），子进程直接使用父进程的 IO（inherit）
    'silent': false,
    // 指定用户 id
    'uid': 0,
    // 指定组 id
    'gid': 0
}
 
```

### 总结

-   exec /execFile：使用 Buffer 来存储进程的输出，可以在回调里面获取输出结果，不太适合数据量大的情况；可以执行任何命令；不创建 V8 实例
-   spawn：支持 stream 方式操作输入输出，适合数据量大的情况；可以执行任何命令；不创建 V8 实例；可以创建常驻的后台进程
-   fork：spawn 的一个特例；只能执行 Node 脚本；会创建一个 V8 实例；会建立父子进程的 IPC 通道，能够进行通信
-   spawn 是最原始的创建子进程的函数，其他三个都是对 spawn 不同程度的封装

## 如何在 node 低版本运行高版本 node 子进程

#### nvm 介绍

目前主流的 node 版本管理工具有两种，nvm 和 n。两者差异挺大的，具体分析可以参考一下淘宝 FED 团队的一篇文章：

[管理 node 版本，选择 nvm 还是 n？](http://taobaofed.org/blog/2015/11/17/nvm-or-n/)

总的来说，nvm 有点类似于 Python 的 virtualenv 或者 Ruby 的 rvm，每个 node 版本的模块都会被安装在各自版本的沙箱里面（因此切换版本后模块需重新安装）

### 使用 nvm 轻松切换 node 版本

在介绍使用方法前，简单说明一下 nvm 的工作原理：

按照官方安装方法之后，nvm 会将各个版本的 node 安装在`~/.nvm/versions/node` 目录下，我们可以打开这个目录看看有些什么东西：

    ➜  ~  ls -a ~/.nvm/versions/node
    .      ..     v4.1.0 v7.9.0
     

事实上 `v4.1.0` 和 `v5.5.0` 这两个目录分别存放 node 的 binary 档，nvm 会在 `$PATH` 前面安插指定版本的目录，透过这种方式在使用 node 命令时就会用指定版本的 node 来运行了。

可以确认实际的 `$PATH` 看看：

```javascript
➜  ~  echo $PATH
/Users/***/.nvm/versions/node/v7.9.0/bin:...
 
```

`.../v7.9.0/bin` 这个就是我们当前使用的 node 版本（还可通过 `nvm ls` 命令查看当前已安装的所有 node 版本）。

**所以它的实现原理就是在一个目录下存放多个版本的目录，在切换时候将相应的版本路径加入 PATH 中**，从而实现版本的切换。

### 结合 nvm 切换构建子进程环境变量

那么我们如何结合 nvm 来进行在低版本 node 里边跑高版本 node 子进程

首先讲一下背景，node 发展非常快，我们三年前的写的程序现在还跑在线上，但是还在添加新功能，有时候需要跑指定版本的 node 进行构建任务，而构建可能还需要跑多个 shell 命令，所以无法使用 fork，只能用 exec/swawn 跑子进程。那么我们怎么吧进程的环境变量指向 我们所需的 node 版本，只需要修改传入的 `process.env`，也就是子进程调用的参数 `env`。直接运行以下代码，修改子进程的环境变量 `NVM_BIN`,`NVM_PATH` 等。

#### 注入环境变量

```javascript
//../libs/modify_nvm_env.js
var _ = require("lodash");
var env = process.env;
var obj = {
    MANPATH: env.MANPATH,
    NVM_BIN: env.NVM_BIN,
    PATH: env.PATH,
    NVM_PATH: env.NVM_PATH,
};
module.exports = function (version) {
    if (!/v(\d+\.)?(\d+\.)?(\*|\d+)/g.test(version)) {
        console.log("version number is unavailable, just use like v6.2.0");
        console.log(env);
        return env;
    }
    var objNew = _.extend({}, obj);
    Object.keys(objNew).forEach(function (key) {
        objNew[key] = (objNew[key] || "").replace(
            /(node(\\|\/))v(\d+\.)?(\d+\.)?(\*|\d+)/g,
            "$1" + version
        );
    });
    console.log(objNew);
    objNew = _.extend({}, env, objNew);
    return objNew;
};
```

```javascript
var modifyNvmEnv = require("../libs/modify_nvm_env");
var exec = require("child_process").exec;
exec(
    'node -e "console.log(process.version)"',
    {
        // shell: '/root/.nvm/versions/node/v7.9.0/bin/node',
    },
    console.log
);
var data = {
    nodeVersion: "v7.9.0",
};
var nodeVersion = data.nodeVersion;
var extraExecOption = {};
if (/v(\d+\.)?(\d+\.)?(\*|\d+)/g.test(nodeVersion)) {
    extraExecOption.env = modifyNvmEnv(nodeVersion);
}
const codeString = "console.log(process.version)";
exec("node -e '" + codeString + "'", extraExecOption, console.log);
```

运行子进程，输出 `process.version` 即为我们所需的 node 版本 `V7.9.0`

```ruby
[root@TENCENT64 /data/frontend/install/alloydist_oa_com]# node experimental_code/exec_specify_node_version.js 
{ MANPATH: '/root/.nvm/versions/node/v7.9.0/share/man:/usr/local/share/man:/usr/share/man/overrides:/usr/share/man',
  NVM_BIN: '/root/.nvm/versions/node/v7.9.0/bin',
  PATH: '/root/.nvm/versions/node/v7.9.0/bin:/usr/local/bin/ruby:/usr/local/mongodb/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin',
  NVM_PATH: '/root/.nvm/versions/node/v7.9.0/lib/node' }
null 'v7.9.0\n' ''
null 'v0.12.14\n' ''
 
```

#### 直接运行 node 代码

有时候，我们需要直接运行生成的高版本 node 代码，我们可以这样子，使用

    node -e "your code"
     

node - 存在的问题，你需要手动编码下代码字符串中的引号。

    codeString.replace(/"/g, "'")
     

最后讲一下

## 进程及信号量

我们和进程通信，是通过发送一种叫做信号量的 “消息” 来告知进程某些事件发生了。一般会使用 `kill [sid] [pid]` 命令来发送信号量，一些常见的信号量如下：

| kill \[sid]\[pid]               | process.on(evt)       | 说明                    |
| ------------------------------- | --------------------- | --------------------- |
| kill -1 / kill -HUP             | process.on('SIGHUP')  | 一般表示进程需要重新加载配置        |
| kill -2 / kill -SIGINT / ctrl+c | process.on('SIGINT')  | 退出进程                  |
| kill -15 / kill -TERM           | process.on('SIGTERM') | 停止进程（kill 的默认信号）      |
| kill -9 / kill -KILL            | 监听不到                  | kernel 直接停掉进程，并且不通知进程 |

实际上 `process` 还可以监听 `exit` 事件，监听 `exit` 事件和监听信号量事件是不一样的。`exit` 事件只有在执行 `process.exit()` 或者进程结束时才会触发。

所以，一个 “优雅” 的进程一般会绑定 `exit`、`SIGINT`、`SIGTERM` 事件，在 `exit` 事件中处理进程的清理工作，然后在 `SIGTERM`、`SIGINT` 事件中调用 `process.exit()` 来让进程真正退出。（如果你想耍流氓，可以绑定 `SIGTERM`、`SIGINT` 事件，然后啥也不做，这样除非使用 `kill -9`，你的进程将永远不会退出......）

除了通过 `kill` 命令发送信号量，我们也可以使用子进程的 `.kill(sig)` 方法来发送信号，比如：`p.kill('SIGINT')`；或者 `process` 的 `process.kill(pid, 'SIGINT')`。

那么我们的子进程如果报错了退出，我们也可以通过监听上述事件来做处理。

```javascript
const exec = require("child_process").exec;
const ps = exec("node -h");
ps.on("SIGTERM", () => {
    console.log("parent catch SIGTERM");
});
ps.on("SIGINT", () => {
    console.log("parent catch SIGTERM");
});
ps.on("SIGKILL", () => {
    console.log("parent catch SIGTERM");
});
ps.on("message", console.log);
ps.on("exit", function (code, signal) {
    console.log("Child exited:", code, signal);
    if (arguments && arguments[1] == "SIGTERM") {
        //子进程退出不正常，反馈给前台
        console.log(140);
    } else if (arguments && arguments[0] !== 0) {
        //子进程退出不正常，反馈给前台
        console.log(140);
    }
});
```

用于检测 fis、grunt、以及各种自研程序退出错误，尤其是 fis 这种开了 verbose 也打不出什么有用信息的，grunt 无论异常与否都是 finish，输出信息根本判断不了是不是异常退出的奇葩。就不再需要我们繁琐的检测各种错误退出的日志可能。

## 总结

最后，我们总结下如何在 node 低版本运行高版本 node 子进程。

-   四个创建子进程的函数
-   结合 nvm 切换构建子进程环境变量
-   进程和信号量，进程异常退出的检测好方法


<!-- {% endraw %} - for jekyll -->