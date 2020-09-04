---
title: JavaScript 定时器与执行机制解析
date: 2016-05-15
author: TAT.云中飞扬
source_link: http://www.alloyteam.com/2016/05/javascript-timer/
---

<!-- {% raw %} - for jekyll -->

[![Timer](http://www.alloyteam.com/wp-content/uploads/2016/05/timer.jpg)](http://www.alloyteam.com/wp-content/uploads/2016/05/timer.jpg)

从 JS 执行机制说起  

==============

浏览器（或者说 JS 引擎）执行 JS 的机制是基于事件循环。

由于 JS 是单线程，所以同一时间只能执行一个任务，其他任务就得排队，后续任务必须等到前一个任务结束才能开始执行。

为了避免因为某些长时间任务造成的无意义等待，JS 引入了异步的概念，用另一个线程来管理异步任务。

同步任务直接在主线程队列中顺序执行，而异步任务会进入另一个任务队列，不会阻塞主线程。等到主线程队列空了（执行完了）的时候，就会去异步队列查询是否有可执行的异步任务了（异步任务通常进入异步队列之后还要等一些条件才能执行，如 ajax 请求、文件读写），如果某个异步任务可以执行了便加入主线程队列，以此循环。

JS 定时器  

=========

JS 的定时器目前有三个：setTimeout、setInterval 和 setImmediate。

定时器也是一种异步任务，通常浏览器都有一个独立的定时器模块，定时器的延迟时间就由定时器模块来管理，当某个定时器到了可执行状态，就会被加入主线程队列。

JS 定时器非常实用，做动画的肯定都用到过，也是最常用的异步模型之一。

有时候一些奇奇怪怪的问题，加一个 setTimeout (fn, 0)（以下简写 setTimeout (0)）就解决了。不过，如果对定时器本身不熟悉，也会产生一些奇奇怪怪的问题。

### setTimeout

setTimeout (fn, x) 表示延迟 x 毫秒之后执行 fn。

使用的时候千万不要太相信预期，延迟的时间严格来说总是大于 x 毫秒的，至于大多少就要看当时 JS 的执行情况了。

另外，多个定时器如不及时清除（clearTimeout），会存在干扰，使延迟时间更加捉摸不透。所以，不管定时器有没有执行完，及时清除已经不需要的定时器是个好习惯。

HTML5 规范规定最小延迟时间不能小于 4ms，即 x 如果小于 4，会被当做 4 来处理。 不过不同浏览器的实现不一样，比如，Chrome 可以设置 1ms，IE11/Edge 是 4ms。

setTimeout 注册的函数 fn 会交给浏览器的定时器模块来管理，延迟时间到了就将 fn 加入主进程执行队列，如果队列前面还有没有执行完的代码，则又需要花一点时间等待才能执行到 fn，所以实际的延迟时间会比设置的长。如在 fn 之前正好有一个超级大循环，那延迟时间就不是一丁点了。

```javascript
(function testSetTimeout() {
    const label = "setTimeout";
    console.time(label);
    setTimeout(() => {
        console.timeEnd(label);
    }, 10);
    for (let i = 0; i < 100000000; i++) {}
})();
```

结果是：setTimeout: 335.187ms，远远不止 10ms。

### setInterval

setInterval 的实现机制跟 setTimeout 类似，只不过 setInterval 是重复执行的。

对于 setInterval (fn, 100) 容易产生一个误区：并不是上一次 fn 执行完了之后再过 100ms 才开始执行下一次 fn。 事实上，setInterval 并不管上一次 fn 的执行结果，而是每隔 100ms 就将 fn 放入主线程队列，而两次 fn 之间具体间隔多久就不一定了，跟 setTimeout 实际延迟时间类似，和 JS 执行情况有关。

```javascript
(function testSetInterval() {
    let i = 0;
    const start = Date.now();
    const timer = setInterval(() => {
        i += 1;
        i === 5 && clearInterval(timer);
        console.log(`第${i}次开始`, Date.now() - start);
        for(let i = 0; i < 
```


<!-- {% endraw %} - for jekyll -->