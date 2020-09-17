---
title: JavaScript Promise 启示录
date: 2014-05-04
author: TAT.dmyang
source_link: http://www.alloyteam.com/2014/05/javascript-promise-mode/
---

<!-- {% raw %} - for jekyll -->

本篇，主要普及 promise 的用法。

一直以来，JavaScript 处理异步都是以 callback 的方式，在前端开发领域 callback 机制几乎深入人心。在设计 API 的时候，不管是浏览器厂商还是 SDK 开发商亦或是各种类库的作者，基本上都已经遵循着 callback 的套路。

近几年随着 JavaScript 开发模式的逐渐成熟，CommonJS 规范顺势而生，其中就包括提出了 Promise 规范，Promise 完全改变了 js 异步编程的写法，让异步编程变得十分的易于理解。

在 callback 的模型里边，我们假设需要执行一个异步队列，代码看起来可能像这样：

```javascript
loadImg("a.jpg", function () {
    loadImg("b.jpg", function () {
        loadImg("c.jpg", function () {
            console.log("all done!");
        });
    });
});
```

这也就是我们常说的回调金字塔，当异步的任务很多的时候，维护大量的 callback 将是一场灾难。当今 Node.js 大热，好像很多团队都要用它来做点东西以沾沾 “洋气”，曾经跟一个运维的同学聊天，他们也是打算使用 Node.js 做一些事情，可是一想到 js 的层层回调就望而却步。

好，扯淡完毕，下面进入正题。

Promise 可能大家都不陌生，因为 Promise 规范已经出来好一段时间了，同时 Promise 也已经纳入了 ES6，而且高版本的 chrome、firefox 浏览器都已经原生实现了 Promise，只不过和现如今流行的类 Promise 类库相比少些 API。

所谓 Promise，字面上可以理解为 “承诺”，就是说 A 调用 B，B 返回一个 “承诺” 给 A，然后 A 就可以在写计划的时候这么写：当 B 返回结果给我的时候，A 执行方案 S1，反之如果 B 因为什么原因没有给到 A 想要的结果，那么 A 执行应急方案 S2，这样一来，所有的潜在风险都在 A 的可控范围之内了。

上面这句话，翻译成代码类似：

```javascript
var resB = B();
var runA = function () {
    resB.then(execS1, execS2);
};
runA();
```

只看上面这行代码，好像看不出什么特别之处。但现实情况可能比这个复杂许多，A 要完成一件事，可能要依赖不止 B 一个人的响应，可能需要同时向多个人询问，当收到所有的应答之后再执行下一步的方案。最终翻译成代码可能像这样：

```javascript
var resB = B();
var resC = C();
...
 
var runA = function() {
    reqB
        .then(resC, execS2)
        .then(resD, execS3)
        .then(resE, execS4)
        ...
        .then(execS1);
};
 
runA();
```

在这里，当每一个被询问者做出不符合预期的应答时都用了不同的处理机制。事实上，Promise 规范没有要求这样做，你甚至可以不做任何的处理（即不传入 then 的第二个参数）或者统一处理。

好了，下面我们来认识下 [Promise/A + 规范](http://promises-aplus.github.io/promises-spec/)：

-   一个 promise 可能有三种状态：等待（pending）、已完成（fulfilled）、已拒绝（rejected）
-   一个 promise 的状态只可能从 “等待” 转到 “完成” 态或者 “拒绝” 态，不能逆向转换，同时 “完成” 态和 “拒绝” 态不能相互转换
-   promise 必须实现 `then` 方法（可以说，then 就是 promise 的核心），而且 then 必须返回一个 promise，同一个 promise 的 then 可以调用多次，并且回调的执行顺序跟它们被定义时的顺序一致
-   then 方法接受两个参数，第一个参数是成功时的回调，在 promise 由 “等待” 态转换到 “完成” 态时调用，另一个是失败时的回调，在 promise 由 “等待” 态转换到 “拒绝” 态时调用。同时，then 可以接受另一个 promise 传入，也接受一个 “类 then” 的对象或方法，即 thenable 对象。

可以看到，Promise 规范的内容并不算多，大家可以试着自己实现以下 Promise。

以下是笔者自己在参考许多类 Promise 库之后简单实现的一个 Promise，代码请移步 [promiseA](https://github.com/chemdemo/promiseA/blob/master/lib/Promise.js)。

简单分析下思路：

构造函数 Promise 接受一个函数 `resolver`，可以理解为传入一个异步任务，resolver 接受两个参数，一个是成功时的回调，一个是失败时的回调，这两参数和通过 then 传入的参数是对等的。

其次是 then 的实现，由于 Promise 要求 then 必须返回一个 promise，所以在 then 调用的时候会新生成一个 promise，挂在当前 promise 的`_next` 上，同一个 promise 多次调用都只会返回之前生成的`_next`。

由于 then 方法接受的两个参数都是可选的，而且类型也没限制，可以是函数，也可以是一个具体的值，还可以是另一个 promise。下面是 then 的具体实现：


<!-- {% endraw %} - for jekyll -->