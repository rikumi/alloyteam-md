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
        for (let i = 0; i < 100000000; i++) {}
        console.log(`第${i}次结束`, Date.now() - start);
    }, 100);
})();
```

输出

    第1次开始 100
    第1次结束 1089
    第2次开始 1091
    第2次结束 1396
    第3次开始 1396
    第3次结束 1701
    第4次开始 1701
    第4次结束 2004
    第5次开始 2004
    第5次结束 2307

可见，虽然每次 fn 执行时间都很长，但下一次并不是等上一次执行完了再过 100ms 才开始执行的，实际上早就已经等在队列里了。

另外可以看出，当 setInterval 的回调函数执行时间超过了延迟时间，已经完全看不出有时间间隔了。

如果 setTimeout 和 setInterval 都在延迟 100ms 之后执行，那么谁先注册谁就先执行回调函数。

### setImmediate

这算一个比较新的定时器，目前 IE11/Edge 支持、Nodejs 支持，Chrome 不支持，其他浏览器未测试。

从 API 名字来看很容易联想到 setTimeout (0)，不过 setImmediate 应该算是 setTimeout (0) 的替代版。

在 IE11/Edge 中，setImmediate 延迟可以在 1ms 以内，而 setTimeout 有最低 4ms 的延迟，所以 setImmediate 比 setTimeout (0) 更早执行回调函数。不过在 Nodejs 中，两者谁先执行都有可能，原因是 Nodejs 的事件循环和浏览器的略有差异。

```javascript
(function testSetImmediate() {
    const label = "setImmediate";
    console.time(label);
    setImmediate(() => {
        console.timeEnd(label);
    });
})();
```

Edge 输出：setImmediate: 0.555 毫秒

很明显，setImmediate 设计来是为保证让代码在下一次事件循环执行，以前 setTimeout (0) 这种不可靠的方式可以丢掉了。

其他常用异步模型  

===========

### requestAnimationFrame

requestAnimationFrame 并不是定时器，但和 setTimeout 很相似，在没有 requestAnimationFrame 的浏览器一般都是用 setTimeout 模拟。

requestAnimationFrame 跟屏幕刷新同步，大多数屏幕的刷新频率都是 60Hz，对应的 requestAnimationFrame 大概每隔 16.7ms 触发一次，如果屏幕刷新频率更高，requestAnimationFrame 也会更快触发。基于这点，在支持 requestAnimationFrame 的浏览器还使用 setTimeout 做动画显然是不明智的。

在不支持 requestAnimationFrame 的浏览器，如果使用 setTimeout/setInterval 来做动画，最佳延迟时间也是 16.7ms。 如果太小，很可能连续两次或者多次修改 dom 才一次屏幕刷新，这样就会丢帧，动画就会卡；如果太大，显而易见也会有卡顿的感觉。

有趣的是，第一次触发 requestAnimationFrame 的时机在不同浏览器也存在差异，Edge 中，大概 16.7ms 之后触发，而 Chrome 则立即触发，跟 setImmediate 差不多。按理说 Edge 的实现似乎更符合常理。

```javascript
(function testRequestAnimationFrame() {
    const label = "requestAnimationFrame";
    console.time(label);
    requestAnimationFrame(() => {
        console.timeEnd(label);
    });
})();
```

Edge 输出：requestAnimationFrame: 16.66 毫秒

Chrome 输出：requestAnimationFrame: 0.698ms

但相邻两次 requestAnimationFrame 的时间间隔大概都是 16.7ms，这一点是一致的。当然也不是绝对的，如果页面本身性能就比较低，相隔的时间可能会变大，这就意味着页面达不到 60fps。

### Promise

Promise 是很常用的一种异步模型，如果我们想让代码在下一个事件循环执行，可以选择使用 setTimeout (0)、setImmediate、requestAnimationFrame (Chrome) 和 Promise。

而且 Promise 的延迟比 setImmediate 更低，意味着 Promise 比 setImmediate 先执行。

```javascript
function testSetImmediate() {
    const label = "setImmediate";
    console.time(label);
    setImmediate(() => {
        console.timeEnd(label);
    });
}
function testPromise() {
    const label = "Promise";
    console.time(label);
    new Promise((resolve, reject) => {
        resolve();
    }).then(() => {
        console.timeEnd(label);
    });
}
testSetImmediate();
testPromise();
```

Edge 输出：Promise: 0.33 毫秒 setImmediate: 1.66 毫秒

尽管 setImmediate 的回调函数比 Promise 先注册，但还是 Promise 先执行。

可以肯定的是，在各 JS 环境中，Promise 都是最先执行的，setTimeout (0)、setImmediate 和 requestAnimationFrame 顺序不确定。

### process.nextTick

process.nextTick 是 Nodejs 的 API，比 Promise 更早执行。

事实上，process.nextTick 是不会进入异步队列的，而是直接在主线程队列尾强插一个任务，虽然不会阻塞主线程，但是会阻塞异步任务的执行，如果有嵌套的 process.nextTick，那异步任务就永远没机会被执行到了。

使用的时候要格外小心，除非你的代码明确要在本次事件循环结束之前执行，否则使用 setImmediate 或者 Promise 更保险。


<!-- {% endraw %} - for jekyll -->