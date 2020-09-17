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
cluster.on('exit', function(worker, code, signal) {
    console.log('worker %d died (%s). restarting...',
        worker.process.pid, signal || code);
    cluster.fork();
```


<!-- {% endraw %} - for jekyll -->