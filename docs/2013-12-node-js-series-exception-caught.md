---
title: Node.js 异常捕获的一些实践
date: 2013-12-31
author: TAT.dmyang
source_link: http://www.alloyteam.com/2013/12/node-js-series-exception-caught/
---

<!-- {% raw %} - for jekyll -->

本文 [github 地址](https://github.com/chemdemo/chemdemo.github.io/blob/master/blogs/exception_catch.md)

本篇谈谈 Node.js 捕获异常的一些探索。

采用事件轮训、异步 IO 等机制使得 Node.js 能够从容应对无阻塞高并发场景，令工程师很困扰的几个理解 Node.js 的地方除了它的事件（回调）机制，还有一个同样头痛的是异常代码的捕获。

### [](http://www.alloyteam.com/2013/12/node-js-series-exception-caught/#trycatch%E4%B9%8B%E7%97%9B)try/catch 之痛

一般情况下，我们会将有可能出错的代码放到 `try/catch` 块里。但是到了 Node.js，由于 `try/catch` 无法捕捉异步回调里的异常，Node.js 原生提供 `uncaughtException` 事件挂到 `process` 对象上，用于捕获所有未处理的异常：

```javascript
process.on("uncaughtException", function (err) {
    console.error("Error caught in uncaughtException event:", err);
});
try {
    process.nextTick(function () {
        fs.readFile("non_existent.js", function (err, str) {
            if (err) throw err;
            else console.log(str);
        });
    });
} catch (e) {
    console.error("Error caught by catch block:", e);
}
```

执行的结果是代码进到了 uncaughtException 的回调里而不是 catch 块。 uncaughtException 虽然能够捕获异常，但是此时错误的上下文已经丢失，即使看到错误也不知道哪儿报的错，定位问题非常的不利。而且一旦 uncaughtException 事件触发，整个 node 进程将 crash 掉，如果不做一些善后处理的话会导致整个服务挂掉，这对于线上的服务来说将是非常不好的。

### [](http://www.alloyteam.com/2013/12/node-js-series-exception-caught/#%E4%BD%BF%E7%94%A8domain%E6%A8%A1%E5%9D%97%E6%8D%95%E6%8D%89%E5%BC%82%E5%B8%B8)使用 domain 模块捕捉异常

随 Node.js v0.8 版本发布了一个 [domain](http://nodejs.org/api/domain.html)（域）模块，专门用于处理异步回调的异常，使用 `domain` 我们将很轻松的捕获异步异常：

运行上面的代码，我们会看到错误被 domain 捕获到，并且 uncaughtException 回调并不会执行，事情似乎变得稍微容易些了。

但是如果研究 domain 模块的 API 很快我们会发现，domain 提供了好几个方法，理解起来似乎不是那么直观（其实为啥这个模块叫 “域 (domain)” 呢，总感觉些许别扭），这里简单解释下：

```javascript
process.on("uncaughtException", function (err) {
    console.error("Error caught in uncaughtException event:", err);
});
var d = domain.create();
d.on("error", function (err) {
    console.error("Error caught by domain:", err);
});
d.run(function () {
    process.nextTick(function () {
        fs.readFile("non_existent.js", function (err, str) {
            if (err) throw err;
            else console.log(str);
        });
    });
});
```

首先，关于 domain 模块，我们看到它的稳定性是 2，也就是不稳定，API 可能会变更。

默认情况下，domain 模块是不被引入的，当 `domain.create()`创建一个 domain 之后，调用 `enter()`方法即可 “激活” 这个 domain，具体表现为全局的进程（`process`）对象上会有一个 domain 属性指向之前创建的这个的 domain 实例，同时，domain 模块上有个 `active` 属性也指向这个的 domain 实例。、

结合 [should](https://github.com/visionmedia/should.js) 断言库测试下上面说的：


<!-- {% endraw %} - for jekyll -->