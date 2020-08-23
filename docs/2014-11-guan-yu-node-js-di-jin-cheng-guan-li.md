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


<!-- {% endraw %} - for jekyll -->