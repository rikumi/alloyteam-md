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
    for (var i = 
```


<!-- {% endraw %} - for jekyll -->