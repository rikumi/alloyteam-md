---
title: websocket 探索其与语音、图片的能力
date: 2015-12-25
author: TAT.vorshen
source_link: http://www.alloyteam.com/2015/12/websockets-ability-to-explore-it-with-voice-pictures/
---

<!-- {% raw %} - for jekyll -->

说到 websocket 想比大家不会陌生，如果陌生的话也没关系，一句话概括

**“WebSocket protocol 是 HTML5 一种新的协议。它实现了浏览器与服务器全双工通信”**

WebSocket 相比较传统那些服务器推技术简直好了太多，我们可以挥手向 comet 和长轮询这些技术说拜拜啦，庆幸我们生活在拥有 HTML5 的时代～

这篇文章我们将分三部分探索 websocket

首先是 websocket 的常见使用，其次是完全自己打造服务器端 websocket，最终是重点介绍利用 websocket 制作的两个 demo，传输图片和在线语音聊天室，let's go

**一、websocket 常见用法**

这里介绍三种我认为常见的 websocket 实现……（**注意：本文建立在 node 上下文环境**）

**1、socket.io**

先给 demo

```javascript
var http = require('http');
var io = require('socket.io');
 
var server = http.createServer(function(req, res) {
    res.writeHeader(200, {'content-type': 'text/html;charset="utf-8"'});
    res.end();
}).listen(8888);
 
var socket =.io.listen(server);
 
socket.sockets.on('connection', function(socket) {
    socket.emit('xxx', {options});
 
    socket.on('xxx', function(data) {
        // do someting
    });
});
```

相信知道 websocket 的同学不可能不知道 socket.io，因为 socket.io 太出名了，也很棒，它本身对超时、握手等都做了处理。我猜测这也是实现 websocket 使用最多的方式。socket.io 最最最优秀的一点就是优雅降级，当浏览器不支持 websocket 时，它会在内部优雅降级为长轮询等，用户和开发者是不需要关心具体实现的，很方便。

不过事情是有两面性的，socket.io 因为它的全面也带来了坑的地方，最重要的就是臃肿，它的封装也给数据带来了较多的通讯冗余，而且优雅降级这一优点，也伴随浏览器标准化的进行慢慢失去了光辉

<table><tbody><tr><td><p>Chrome</p></td><td><p>Supported in version 4+</p></td></tr><tr><td><p>Firefox</p></td><td><p>Supported in version 4+</p></td></tr><tr><td><p>Internet Explorer</p></td><td><p>Supported in version 10+</p></td></tr><tr><td><p>Opera</p></td><td><p>Supported in version 10+</p></td></tr><tr><td><p>Safari</p></td><td><p>Supported in version 5+</p></td></tr></tbody></table>

在这里不是指责说 socket.io 不好，已经被淘汰了，而是有时候我们也可以考虑一些其他的实现～

**2、http 模块**

刚刚说了 socket.io 臃肿，那现在就来说说便捷的，首先 demo

```javascript
var http = require(‘http’);
var server = http.createServer();
server.on(‘upgrade’, function(req) {
	console.log(req.headers);
});
server.listen(8888);
```


<!-- {% endraw %} - for jekyll -->