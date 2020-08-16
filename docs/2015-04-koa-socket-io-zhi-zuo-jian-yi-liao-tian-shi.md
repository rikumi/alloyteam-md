---
title: koa + socket.io 制作简易聊天室
date: 2015-04-29
author: TAT.heyli
source_link: http://www.alloyteam.com/2015/04/koa-socket-io-zhi-zuo-jian-yi-liao-tian-shi/
---

**前言**

上期，本菜在 [《](http://www.alloyteam.com/2015/04/qian-duan-qiang-hou-duan-fan-wan-node-js-socket-io-zhi-zuo-jian-yi-liao-tian-shi/)[前端抢后端饭碗 — Node.js + Socket.io 制作简易聊天室》](http://www.alloyteam.com/2015/04/qian-duan-qiang-hou-duan-fan-wan-node-js-socket-io-zhi-zuo-jian-yi-liao-tian-shi/)一文中谈到如何用 node.js 中的 express 框架。如要阅读此文，请先阅读前文。

虽然时至今日，express 框架依然是时下 node.js 网页开发的主流，但后起之秀 koa 大有赶超之势。他融合了 ES6 的一些新特性，列如 generator, promise 等。利用这些新特性能很好地解决传统 javascript 中的多层回调噩梦。

我们 AlloyTeam 旗下[iPresst](http://www.ipresst.com/)会在 5 月底 6 月初的版本中发布用 koa 重构的版本，敬请期待！

**Koa 里 Generator 的作用**

有关回调的基础知识，可以阅读我的同事 JJ 的两篇博文：

[《ES6 Generator 介绍》](http://www.alloyteam.com/2015/03/es6-generator-introduction/)

[《使用 Generator 解决回调地狱》](http://www.alloyteam.com/2015/04/solve-callback-hell-with-generator/)

Generator 究竟在 koa 中发挥什么作用呢？我从 koa 官网搞来这幅图（已经了解 koa 的同学可以略过）。这个 gif 展示了这种函数写法运行的步骤:

![](https://github.com/koajs/koa/raw/master/docs/middleware.gif)

1.  创建 date 记录花费时间
2.  将控制 Yield 到下一个 middleware
3.  创建另外 date 记录响应时间
4.  将控制 Yield 到下一个 middleware
5.  立刻 Yield 控制，因为 contentLength  只对 response 起作用
6.  将 upstream Yield 到 Koa 的 空 middleware.
7.  如果请求路径不是 "/", 则跳过设置 body.
8.  设置响应为 "Hello World"
9.  如果有 body 则设置 Content-Length
10. 设置头部字段
11. 输出 log
12. 发送响应前设置 X-Response-Time  头字段
13. 转会 Koa, Koa 负责发送 response

[中文翻译来源：http://koa.rednode.cn/](http://koa.rednode.cn/)

简而言之，yield 的这种写法就是让运行点从一个函数跳到另一个函数。想像一下，回调实质上就是一堆函数调用来调用去，然后这堆函数堆在一起，相当不优雅。而 Generator 则通过 yield 去切换到调用的函数来使代码变得更优雅。

这种例子可以用于校验函数（例校验邮箱、用户名格式等）和 View 函数（主要接收服务器分发的请求然后进行回复）等有层级关系的表达。通过这样的搭配，koa 能使服务器请求自动通过校验函数再到 View 函数处去合格的请求。例如下面的代码：

```c
app.user(function* validate(next) {
	// validate input
	yield next;
});
 
app.user(function* indexPage() {
	// process request
	//render views for response
});
```

**Koa 如何启动服务器**

Generator 很好用，但我们最终还是需要一些模块将服务器请求通过路由函数分发到不同的 View 函数去处理。例如，一般的 Koa 应用都要用到下面的依赖库：

1.  [koa](https://github.com/koajs/koa)，koa 的最核心代码
2.  [koa-mount](https://github.com/koajs/mount)，koa 帮助协助路由分发库  
    [koa-route](https://github.com/alexmingoia/koa-router)，koa 的路由分发库  
    [koa-s](https://github.com/koajs/static-cache)[wig](https://www.npmjs.com/package/koa-swig)，koa 的 html 模版处理库  
    [koa-bodyparser](https://github.com/koajs/bodyparser)，koa 的请求处理库  
    [koa-logger](https://github.com/koajs/logger)，koa 日志库

利用好这些库，能够帮你快捷地用熟悉简易的办法搭建一个 koa 应用。请看下面的代码及注释。

```javascript
var koa = require("koa");
var mount = require("koa-mount");
var router = require("koa-router");
var logger = require("koa-logger");
var render = require("koa-swig");
var app = koa();
//指向静态文件夹
app.context.render = render({
    root: "/Users/lcxfs1991/web/koa/public/",
    autoescape: true,
    cache: false,
    ext: "html",
});
//使用router路由
app.use(router(app));
//使用logger日志库
app.use(logger());
//首页校验函数
var validate = function* (next) {
    console.log("validate");
    console.log(this.request);
    yield next;
};
// 首页处理函数
var index = function* () {
    yield* this.render("omg"); // this.body = 'omg'
};
//路由处理，首页指定用index函数处理，但需要先经过validate函数校验
var APIv1 = new router();
APIv1.get("", validate, index);
app.use(mount("/", APIv1.middleware()));
// 监听3000端口
app.listen(3000);
```

**如何接入 socket.io**

然后就来到最后一步，如何用 koa 接入 socket.io。

上文的介绍只是用来帮你更好地理解 koa. 接入 socket.io 的时候实质上并不需要这么复杂的代码。如下：

```javascript
var koa = require("koa");
var app = koa();
var serve = require("koa-static");
//main processing file
var chat = require("./routes/chat");
// 指向静态文件文件夹
app.use(serve("./public"));
// 必须放在在所有app.user()之后
var server = require("http").Server(app.callback());
chat.initialize(server);
server.listen(3000);
```

由于 io 需要监听 http 返回的一个 server object。因此，koa 并不能像上面的用法一样，通过路由去分发请求。只好通过传入 app.callback 到 node.js 的 http 对像里面。至于 chat 模块里面的写法，请参考 [《](http://www.alloyteam.com/2015/04/qian-duan-qiang-hou-duan-fan-wan-node-js-socket-io-zhi-zuo-jian-yi-liao-tian-shi/)[前端抢后端饭碗 — Node.js + Socket.io 制作简易聊天室》](http://www.alloyteam.com/2015/04/qian-duan-qiang-hou-duan-fan-wan-node-js-socket-io-zhi-zuo-jian-yi-liao-tian-shi/)一文。里面的代码（包括前端后台）可以保持原样使用。

以上是本菜的处理办法。原代码在这里：<https://github.com/lcxfs1991/koa-socket.io>

另外，kosjs 团队融合 socket.io 弄了一个 [koa.io](https://github.com/koajs/koa.io) 的库，也相当好用。有兴趣可以点击直接前往其 github 页面。