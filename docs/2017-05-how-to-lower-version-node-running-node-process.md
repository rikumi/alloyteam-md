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
  'node', // 可执行文件
  ['child.js', 'a', 'b'], // 传递给命令的参数
  {},
  (err, stdout, stderr) => {
    if (err) {
      // err.code 是进程退出时的 exit code，非 0 都被认为错误
      // err.signal 是结束进程时发送给它的信号值
      console.log('err:', err, err.code, err.signal);
    }
    console.log('
```


<!-- {% endraw %} - for jekyll -->