---
title: 【转向 Javascript 系列】深入理解 Web Worker
date: 2015-11-26
author: TAT.ronnie
source_link: http://www.alloyteam.com/2015/11/deep-in-web-worker/
---

<!-- {% raw %} - for jekyll -->

上一篇文章 [《从 setTimeout 说事件循环模型》](http://www.alloyteam.com/2015/10/turning-to-javascript-series-from-settimeout-said-the-event-loop-model/)从 setTimeout 入手，探讨了 Javascript 的事件循环模型。有别于 Java/C# 等编程语言，Javascript 运行在一个单线程环境中，对 setTimeout/setInterval、ajax 和 dom 事件的异步处理是依赖事件循环实现的。作为一个转向 Javascript 的开发人员，很自然的产生一个疑问，如何实现 Javascript 多线程编程呢？随着学习的深入，我了解到 HTML5 Web Worker，本文将分析 Web Worker 为 Javascript 带来了什么，同时带大家看看 worker 模型在其他语言的应用。

**1.Web Worker 是什么**

Web Worker 是 HTML5 标准的一部分，这一规范定义了一套 API，它允许一段 JavaScript 程序运行在主线程之外的另外一个线程中。Web Worker 规范中定义了两类工作线程，分别是专用线程 Dedicated Worker 和共享线程 Shared Worker，其中，Dedicated Worker 只能为一个页面所使用，而 Shared Worker 则可以被多个页面所共享，本文示例为专用线程 Dedicated Worker。

1.1 API 快速上手

使用 Dedicated Worker 的主页面代码 main.js

```javascript
var worker = new Worker("task.js");
worker.postMessage({
    id: 1,
    msg: "Hello World",
});
worker.onmessage = function (message) {
    var data = message.data;
    console.log(JSON.stringify(data));
    worker.terminate();
};
worker.onerror = function (error) {
    console.log(error.filename, error.lineno, error.message);
};
```

Dedicated Worker 所执行的代码 task.js

```javascript
onmessage = function (message) {
    var data = message.data;
    data.msg = "Hi from task.js";
    postMessage(data);
};
```

在 main.js 代码中，首先通过调用构造函数，传入了 worker 脚本文件名，新建了一个 worker 对象，在我的理解中，这一对象是新创建的工作线程在主线程的引用。随后调用 worker.postMessage () 方法，与新创建的工作线程通信，这里传入了一个 json 对象。随后分别定义了 worker 对象的 onmessage 事件和 onerror 事件的回调处理函数，当 woker 线程返回数据时，onmessage 回调函数执行，数据封装在 message 参数的 data 属性中，调用 worker 的 terminate () 方法可以终止 worker 线程的运行；当 worker 线程执行出错时，onerror 回调函数执行，error 参数中封装了错误对象的文件名、出错行号和具体错误信息。

在 task.js 代码中，定义了 onmessage 事件处理函数，由主线程传入的数据，封装在 message 对象的 data 属性中，数据处理完成后，通过 postMessage 方法完成与主线程通信。在工作线程代码中，onmessage 事件和 postMessage 方法在其全局作用域可以访问。

1.2  worker 线程执行流程

通过查阅资料，webKit 加载并执行 worker 线程的流程如下图所示

[![1](http://www.alloyteam.com/wp-content/uploads/2015/11/1.png)](http://www.alloyteam.com/wp-content/uploads/2015/11/1.png)

1)     worker 线程的创建的是异步的

代码执行到 "var worker = new Worker (task.js')“ 时，在内核中构造 WebCore::JSWorker 对象（JSBbindings 层）以及对应的 WebCore::Worker 对象（WebCore 模块)，根据初始化的 url 地址"task.js" 发起异步加载的流程；主线程代码不会阻塞在这里等待 worker 线程去加载、执行指定的脚本文件，而是会立即向下继续执行后面代码。

2)     postMessage 消息交互由内核调度

main.js 中，在创建 woker 线程后，立即调用了 postMessage 方法传递了数据，在 worker 线程还没创建完成时，main.js 中发出的消息，会先存储在一个临时消息队列中，当异步创建 worker 线程完成，临时消息队列中的消息数据复制到 woker 对应的 WorkerRunLoop 的消息队列中，worker 线程开始处理消息。在经过一轮消息来回后，继续通信时， 这个时候因为 worker 线程已经创建，所以消息会直接添加到 WorkerRunLoop 的消息队列中；

1.3 worker 线程数据通讯方式

主线程与子线程数据通信方式有多种，通信内容，可以是文本，也可以是对象。需要注意的是，这种通信是拷贝关系，即


<!-- {% endraw %} - for jekyll -->