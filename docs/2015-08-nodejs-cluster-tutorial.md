---
title: 解读 Node.js 的 cluster 模块
date: 2015-08-31
author: TAT.yunsheng
source_link: http://www.alloyteam.com/2015/08/nodejs-cluster-tutorial/
---

<!-- {% raw %} - for jekyll -->

        在如今机器的 CPU 都是多核的背景下，Node 的单线程设计已经没法更充分的 "压榨" 机器性能了。所以从 v0.8 开始，Node 新增了一个内置模块 ——“cluster”，故名思议，它可以通过一个父进程管理一坨子进程的方式来实现集群的功能。

快速上手  

* * *

使用十分的简单，如下

```javascript
var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length; // 获取CPU的个数
 
if (cluster.isMaster) {
    for (var i = 0; i &lt; numCPUs; i++) {
        cluster.fork();
    }
 
    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    http.createServer(function(req, res) {
        res.writeHead(200);
        res.end("hello world\n");
    }).listen(8000);
}
```

稍微解释下，通过 isMaster 属性，判断是否 Master 进程，是则 fork 子进程，否则启动一个 server。每个 HTTP server 都能监听到同一个端口。

但是在实际项目中，我们的启动代码一般都已经封装在了 app.js 中，要把整块启动逻辑嵌在上面的 if else 中实在不优雅。 所以，我们可以这样：

```javascript
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
 
if (cluster.isMaster) {
    for (var i = 0; i &lt; numCPUs; i++) {
        cluster.fork();
    }
    // 其它代码
    
} else {
    require("./app.js");
}
```

简单之处就在于原本的应用逻辑根本不需要知道自己是在集群还是单边。（当然，如果应用在内存中维护了某些状态，比如 session，就需要运用某些机制来共享了，这里不详说）

常用 API  

* * *

cluster 模块提供了一大坨事件和方法，这里挑一些常用的说明下，详细的请参考官方文档。

### cluster.setupMaster(\[settings])

setupMaster 用来改变默认设置，只能被调用一次，调用后，配置会存在且冻结在 cluster.settings 里。配置只会影响 fork 时的行为，实际上这些选项就是传给 fork 用的，有兴趣的同学可以去对照 child_process.fork () 的参数。

具体有如下选项：

-   execArgv Node 执行时的变量数组，传递给 node（默认为 process.execArgv）。
-   exec 执行的文件，配置后就不需要像最开始的例子，在代码里 require 目标文件了（默认为 process.argv\[1]）。
-   args 传递给 worker 的变量数组（默认为 process.argv.slice (2))）。
-   silent 是否禁止打印内容（默认为 false）。
-   uid 设置进程的用户 ID。
-   gid 设置进程的组 ID。

### Event: fork 和 online

当一个新的 worker 被 fork 时就会触发 fork 事件，而在 worker 启动时才会触发 online 事件，所以 fork 先触发，online 后触发。

可以在这两个事件的 callback 里做些初始化的逻辑，也可以在这时向 master 报告：“我起来了！”。

### Event: exit

当任何一个 worker 停掉都会触发 exit 事件，可以在回调里增加 fork 动作重启。

通过 worker.suicide 来判断，worker 是意外中断还是主动停止的（在 worker 中调用 kill 和 disconnect 方法，视作 suide。）。

```javascript
cluster.on("exit", function (worker, code, signal) {
    console.log(
        "worker %d died (%s). restarting...",
        worker.process.pid,
        signal || code
    );
    cluster.fork();
});
```

### cluster.worker 和 cluster.workers

前者是一份 worker 对象的引用，只能在 worker 里使用。

后者是 master 下对当前可用 worker 的一个 Object，key 为 worker id，注意，当 worker 已经 exit 或 disconnect 后就不会在这个 object 里了。

### Event: message

message 事件可以用来做 master 和 worker 的通信机制。 这里是个[例子](https://github.com/sitepoint-editors/node-cluster-tutorial/blob/master/communication.js) 。

利用这套机制，可以用来实现不间断重启，[代码](https://github.com/sitepoint-editors/node-cluster-tutorial/blob/master/zero_downtime.js)。

文章最开始的例子有个问题，尤其是运行在生产环境还不够健壮：如果某个 worker 因为意外 “宕机” 了，代码并没有任何处理，这时如果我们重启应用又会造成服务中断。利用这些 API 就可以利用事件监听的方式做相应处理。

原理  

* * *

每个 worker 进程通过使用 child_process.fork () 函数，基于 IPC（Inter-Process Communication，进程间通信），实现与 master 进程间通信。

什么是 fork，Linux API 给了如下解释

> fork() creates a new process by duplicating the calling process. The new process is referred to as the child process. The calling process is referred to as the parent process.
>
> The child process and the parent process run in separate memory spaces. At the time of fork() both memory spaces have the same content. Memory writes, file mappings (mmap(2)), and unmappings (munmap(2)) performed by one of the processes do not affect the other.

我们可以看到，fork 出的子进程拥有和父进程一致的数据空间、堆、栈等资源（fork 当时），但是是独立的，也就是说二者不能共享这些存储空间。 那我们直接用 fork 自己实现不就行了，干嘛需要 cluster 呢。

> “这样的方式仅仅实现了多进程。多进程运行还涉及父子进程通信，子进程管理，以及负载均衡等问题，这些特性 cluster 帮你实现了。”

这里再说下 cluster 的负载均衡。Node.js v0.11.2 + 的 cluster 模块使用了 [round-robin](https://en.wikipedia.org/wiki/Round-robin_scheduling) 调度算法做负载均衡，新连接由主进程接受，然后由它选择一个可用的 worker 把连接交出去，说白了就是轮转法。算法很简单，但据官方说法，实测很高效。

注意：在 windows 平台，默认使用的是 [IOCP](https://msdn.microsoft.com/en-us/library/aa365198(VS.85).aspx)，官方文档说一旦解决了分发 handle 对象的性能问题，就会改为 RR 算法（没有时间表。。）

如果想用操作系统指定的算法，可以在 fork 新 worker 之前或者 setupMaster () 之前指定如下代码：

```go
cluster.schedulingPolicy = cluster.SCHED_NONE;
```

或者通过环境变量的方式改变

```c
$ export NODE_CLUSTER_SCHED_POLICY="none" # "rr" is round-robin
$ node app.js
```

或在启动 Node 时指定

```c
$ env NODE_CLUSTER_SCHED_POLICY="none" node app.js
```

使用 pm2 实现 cluster  

* * *

[pm2](https://github.com/Unitech/pm2) 是一个现网进程管理的工具，可以做到不间断重启、负载均衡、集群管理等，比 forever 更强大。利用 pm2 可以做到 **no code but just config** 实现应用的 cluster。

安装 pm2 什么的这里就不赘述了。用 pm2 启动时，通过 - i 指定 worker 的数量即可。如果 worker 挂了，pm2 会自动立刻重启，各种简单省心。

    $ pm2 start app.js -i 4

[![pm5-port-release](http://www.alloyteam.com/wp-content/uploads/2015/08/pm5-port-release.png)](http://www.alloyteam.com/wp-content/uploads/2015/08/pm5-port-release.png)

也可以在应用运行时，改变 worker 的数量，如下图

[![probe8](http://www.alloyteam.com/wp-content/uploads/2015/08/probe8.png)](http://www.alloyteam.com/wp-content/uploads/2015/08/probe8.png)

更多的使用方法，可以去 github 上慢慢看（说句题外话，如果有类似 PM2，甚至更好的 PM 工具，欢迎在评论里回复 ^\_^）。

多机器集群  

* * *

cluster 适用于在单台机器上，如果应用的流量巨大，多机器是必然的。这时，反向代理就派上用场了，我们可以用 node 来写反向代理的服务（比如用 [http-proxy](https://github.com/nodejitsu/node-http-proxy)），好处是可以保持工程师技术栈的统一，不过生产环境，我们用的更多的还是 nginx，这里就不多介绍了。

参考文章  

* * *

-   [What’s New in Node.js v0.12: Cluster Round-Robin Load Balancing](https://strongloop.com/strongblog/whats-new-in-node-js-v0-12-cluster-round-robin-load-balancing/)
-   [Node.js clustering made easy with PM2](https://keymetrics.io/2015/03/26/pm2-clustering-made-easy/)
-   [Cluster in Node.js tutorial](https://codeforgeek.com/2014/12/cluster-node-js-performance/)
-   [How to Create a Node.js Cluster for Speeding Up Your Apps](http://www.sitepoint.com/how-to-create-a-node-js-cluster-for-speeding-up-your-apps/)


<!-- {% endraw %} - for jekyll -->