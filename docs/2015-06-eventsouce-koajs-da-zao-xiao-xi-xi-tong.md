---
title: eventsouce + koajs 打造消息系统
date: 2015-06-30
author: TAT.heyli
source_link: http://www.alloyteam.com/2015/06/eventsouce-koajs-da-zao-xiao-xi-xi-tong/
---

<!-- {% raw %} - for jekyll -->

之前写过两篇文章，分别是 [《前端抢后端饭碗 — Node.js + Socket.io 制作简易聊天室》](http://www.alloyteam.com/2015/04/qian-duan-qiang-hou-duan-fan-wan-node-js-socket-io-zhi-zuo-jian-yi-liao-tian-shi/) 和 [《koa + socket.io 制作简易聊天室》](http://www.alloyteam.com/2015/04/koa-socket-io-zhi-zuo-jian-yi-liao-tian-shi/)，实质上都是利用了浏览器的 websocket 属性进去前后端的消息交流。今天我们要介绍另外一种比较新但更为简洁的消息传输方式，eventsource。

下面是关于 eventsource 的浏览器支持情况。除了 IE 和 Opera Mini 之后，其它浏览器的支持情况良好。除了浏览器的兼容性问题之外，eventsource 其实 写起来更为简洁方便。

[![eventsource](http://www.alloyteam.com/wp-content/uploads/2015/06/eventsource.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/eventsource.png)

首先是前端的代码：

```javascript
var evtSource = new EventSource("xxxxxxxxxx");
evtSource.onmessage = function (e) {
    var res = JSON.parse(e.data); // 其它操作
};
```

前端代码只需要通过 onmessage 事件就可以获得后台传过来的数据。或者，可以监听其它的事件，如下：

```javascript
evtSource.addEventListener(
    "ping",
    function (e) {
        //其它操作
    },
    false
);
```

至于后台的代码，网上流传是大部份是 php 的版本。甚至连 MDN 上的都是。我们 AlloyTeam 的 [iPresst](http://ipresst.com/) 则使用了 koajs 开发，因此也使用 js 开发我们的消息系统。将 status 设为 200 是必不可少的，另外也需要设置 content-type, connection, cache-control 的字段。access-control-allow-origin 是可选的，规定什么地址的请求会被允许。

```javascript
exports.msg = function* () {
    const response = {
        retcode: 0,
        count: 0,
    }; // 数据库操作
    this.status = 200;
    this.set("Content-Type", "text/event-stream");
    this.set("Connection", "keep-alive");
    this.set("Cache-Control", "no-cache");
    this.set("Access-Control-Allow-Origin", "*"); // 延迟10秒
    let r = "retry: 10000\n";
    r += 'data: {"count": ' + JSON.stringify(response.count) + "}\n\n";
    this.body = r;
};
```

后台传回来的消息就需要如下的格式:

```javascript
id: 1;
event: ping;
data: {
    count: 0;
}
retrey: 10000;
```

### 字段 (参考 [《使用服务器发送事件》](https://developer.mozilla.org/zh-CN/docs/Server-sent_events/Using_server-sent_events))

规范中规定了下面这些字段:

`event`

事件类型。如果指定了该字段，则在客户端接收到该条消息时，会在当前的 `EventSource` 对象上触发一个事件，事件类型就是该字段的字段值，你可以使用 `addEventListener () 方法在当前 EventSource` 对象上监听任意类型的命名事件，如果该条消息没有 `event` 字段，则会触发 `onmessage 属性上的事件处理函数`.

`data`

消息的数据字段。如果该条消息包含多个 `data` 字段，则客户端会用换行符把它们连接成一个字符串来作为字段值.

`id`

事件 ID, 会成为当前 `EventSource` 对象的内部属性 "最后一个事件 ID" 的属性值.

`retry`

一个整数值，指定了重新连接的时间 (单位为毫秒), 如果该字段值不是整数，则会被忽略.  **也就是说，你希望后台每几毫秒给前台传消息，那就填多少毫秒。**

<!-- {% endraw %} - for jekyll -->