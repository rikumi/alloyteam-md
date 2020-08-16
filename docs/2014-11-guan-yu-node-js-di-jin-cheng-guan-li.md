---
title: 关于 node.js 的进程管理
date: 2014-11-03
author: TAT.Cson
source_link: http://www.alloyteam.com/2014/11/guan-yu-node-js-di-jin-cheng-guan-li/
---

<!-- {% raw %} - for jekyll -->

如果是单纯的运行一个 node 进程，那会比较简单，例如：

    node ./example.js

但是一般来说，当我们运行一个 node 进程之后，我们可能希望对这个进程进行更多的管理，例如，当 node 程序是一个 server 服务时，我们就有更多的需求。

例如：

1. 服务挂掉的时候自动重启。

2. 列出所有服务，包括服务的信息。

3. 能够重启 / 终止某个服务。

4. 为服务的运行记录日志。

1. 服务挂掉的时候自动重启。

对于这个需求，我们需要做的是把服务进程当做一个子进程来运行，当子进程不幸挂了，父进程将其重启，例如：

```javascript
var spawn = require("child_process").spawn;
var cp = spawn(process.execPath, ["./example.js"]);
cp.on("exit", function () {
    //restart
});
```

假设父进程程序名为 pro_a, 那么通过父进程启动一个子程序会是这样：

    pro_a ./example.js

 

传入子程序名，由父程序执行。

这样相当于 pro_a 程序管理子程序的执行：

![](http://images.cnblogs.com/cnblogs_com/Cson/290336/o_94CE18F4-4D3C-4BAC-930C-8CB6DD68FBF4.png)

2. 列出所有服务，包括服务的信息。

假设我们执行 example.js 之后，还有多个程序需要执行，每个程序都使用 pro_a 程序来启动：

    pro_a ./example.js
    pro_a ./server.js
    pro_a ./other.js
     
    情况变成这样：

![](http://images.cnblogs.com/cnblogs_com/Cson/290336/o_2.png)

如上图，多个 pro_a 进程对应开启的多个不同子程序的进程。

这时候问题来了，我们希望知道所有用 pro_a 启动的子进程的进程信息，要怎么做呢？

例如：

    pro_a -l //列出所有子进程信息

这时候需求就转变成：新的 pro_a 进程需要和其他 pro_a 进程通信，并获取其他 pro_a 进程运行的子进程的信息。

对于 UNIX 的跨进程通信，有几种方式，由于这里不同进程在同一个机器中，因此我们这里采用 UNIX domain socket 的方式（不用经过网卡），让在不同 pro_a 进程间进行通信。

使用这种方式，我们需要做的是 pro_a 进程每次创建子进程的时候，启用一个 server，并监听对应的 sock 文件，那么当心的 pro_a 进程启动之后，就可以通过遍历所有 sock 文件并对有效 sock 文件进行连接，从而能够和不同 pro_a 进程之间进行消息的通信。

例如：

创建子进程的 pro_a:

```javascript
var net = require("net");
//使用UNIX domain socket
var server = net.createServer(function (socket) {
    socket.setEncoding("UTF8");
    socket.on("data", function () {
        //收到消息后，向请求方发送子进程相关信息
        socket.write(
            JSON.stringify({
                pid: child_process.pid, //...
            })
        );
    });
});
server.listen(socketPath + "resume_" + Date.now() + ".sock");
```

这样每个 pro_a 进程创建子进程之后，都会对应产生一个 sock 文件：

![](http://images.cnblogs.com/cnblogs_com/Cson/290336/o_3.png)

对于新的 pro_a 进程，第一步是获取所有 sock 文件，并进行连接：

```javascript
var getAllSocketFiles = function () {
    var socketFiles;
    try {
        socketFiles = fs.readdirSync(socketPath);
    } catch (ex) {
        if (ex.code == "ENOENT") {
            fs.mkdirSync(socketPath);
        }
        socketFiles = fs.readdirSync(socketPath);
    }
    return socketFiles;
};
```

针对每个 sock 文件，创建 socket 进行连接，并发送消息请求：

```javascript
var socket = new net.Socket();
socket.setEncoding("UTF8");
socket.connect(this.socketName, function () {
    socket.write(
        JSON.stringify({
            //请求对应的子进程信息
        })
    );
});
socket.on("data", function () {
    data = JSON.parse(data); //获得对应子进程信息
});
```

![](http://images.cnblogs.com/cnblogs_com/Cson/290336/o_5.png)

这样 pro_a 进程就能从其他 pro\_进程中获取到信息。

3. 能够重启 / 终止某个服务。

由于我们设置了子程序在挂掉后会自动重启，因此我们需要增加一个命令让程序在需要时能正常关闭，例如：

    pro_a -s 1140 //强制终止掉进程号为1140的子进程

此时该 pro_a 进程需要连接所有其他 pro_a 进程并获取他们的子进程信息（就像上面 - l 那样），然后筛选出 pid 未 1140 的子进程，再次通过 socket 发送关闭指令，对应的 server 接收到关闭指令后把其子进程 kill 掉。

![](http://images.cnblogs.com/cnblogs_com/Cson/290336/o_4.png)

4. 为服务的运行记录日志。

这个只需要 pro_a 监听子进程的事件，并实时写入 log 文件就 ok 了。并且我们可以通过命令让心的 pro_a 进程能够查看某个其他 pro_a 进程中子进程的 log，例如：

    pro_a -L 1130 // 查看1130的子进程的log

原理和 3 相似，获取所有 pro_a 进程信息，筛选出 pid 为 1130 的子进程，socket 发送获取 log 的指令，对应 server 把 log 信息返回。

我把以上 pro_a 的功能以及更多其他功能封装成一个叫 Resume.js 的程序放倒 github 上，有兴趣的同学可以看看：

[https://github.com/csonlai/Resume.js](https://github.com/csonlai/Resume.js "https&#x3A;//github.com/csonlai/Resume.js")

其中包含了上面功能的实现源码。我们可以通过 Resume.js 进行简单的 node 进程管理。

此文同步更新在 [http://www.cnblogs.com/Cson/p/4069868.html](http://www.cnblogs.com/Cson/p/4069868.html "http&#x3A;//www.cnblogs.com/Cson/p/4069868.html")

<!-- {% endraw %} - for jekyll -->