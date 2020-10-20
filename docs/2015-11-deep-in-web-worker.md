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

主线程与子线程数据通信方式有多种，通信内容，可以是文本，也可以是对象。需要注意的是，这种通信是拷贝关系，即是传值而不是地址，子线程对通信内容的修改，不会影响到主线程。事实上，浏览器内部的运行机制是，先将通信内容串行化，然后把串行化后的字符串发给子线程，后者再将它还原。

主线程与子线程之间也可以交换二进制数据，比如 File、Blob、ArrayBuffer 等对象，也可以在线程之间发送。但是，用拷贝方式发送二进制数据，会造成性能问题。比如，主线程向子线程发送一个 50MB 文件，默认情况下浏览器会生成一个原文件的拷贝。为了解决这个问题，JavaScript 允许主线程把二进制数据直接转移给子线程，转移后主线程无法再使用这些数据，这是为了防止出现多个线程同时修改数据的问题，这种转移数据的方法，叫做 Transferable Objects。

```javascript
// Create a 32MB "file" and fill it.
var uInt8Array = new Uint8Array(1024 * 1024 * 32); // 32MB
for (var i = 0; i &lt; uInt8Array.length; ++i) {
    uInt8Array[i] = i;
}
worker.postMessage(uInt8Array.buffer, [uInt8Array.buffer]);
```

1.4  API 进阶

在 worker 线程中，可以获得下列对象

1)     navigator 对象

2)     location 对象，只读

3)     XMLHttpRequest 对象

4)     setTimeout/setInterval 方法

5)     Application Cache

6)     通过 importScripts () 方法加载其他脚本

7)     创建新的 Web Worker

worker 线程不能获得下列对象

1)     DOM 对象

2)     window 对象

3)     document 对象

4)     parent 对象

上述的规范，限制了在 worker 线程中获得主线程页面相关对象的能力，所以在 worker 线程中，不能进行 dom 元素的更新。

**2. 似曾相识 worker 模型**

我在学习 Web Worker 过程中，总有一种似曾相似的感觉。在以往的学习经验中，了解过 Java Swing GUI 库中的 Swing Worker，我们可以看看 worker 模型在 Swing 中的应用。

2.1 Swing 事件分发模型

同 Winform/WPF 等其他 GUI 库一样，Swing 是一个基于事件队列的单线程编程模型。Swing 将 GUI 请求放入一个事件队列 EventQueue  中等待执行，EventQueue 的派发机制由单独的一个线程管理，这个线程称为事件派发线程（EventDispatchThread），负责 GUI 组件的绘制和更新。这一事件分发模型如下图所示：

[![2](http://www.alloyteam.com/wp-content/uploads/2015/11/2.png)](http://www.alloyteam.com/wp-content/uploads/2015/11/2.png)

Swing 单线程模型的一个问题是，如果在 “事件派发线程” 上执行的运算太多，那么 GUI 界面就会停住，系统响应和运算就会非常缓慢。

既然事件派发线程是为了处理 GUI 事件而设的，那么，我们只应该把 GUI 事件处理相关的代码，放在事件派发线程中执行。其他与界面无关的代码，应该放在 Java 其他的线程中执行。这样，我们在 Swing 的事件处理中，仍然使用 Swing 的单线程编程模型，而其他业务操作均使用多线程编程模型，这就可以大大提高 Swing 程序的响应和运行速度，充分运用 Java 多线程编程的优势。

2.2 Swing Worker

Java SE 6 提供了 javax.swing.SwingWorker 类，Swing Worker  设计用于需要在后台线程中运行长时间运行任务的情况，并可在完成后或者在处理过程中向 UI 提供更新。

假定我们在 UI 界面点击一次下载按钮，在按钮的事件处理函数中，需要去加载一张 Icon 图片，图片加载完成后，将 icon 在 UI 界面展示出来。

```javascript
SwingWorker testWorker = new SwingWorker&lt;Icon , Void>(){  
      @Override  
       protected Icon doInBackground() throws Exception {  
        Icon icon = retrieveImage(strImageUrl);   
            return icon;   
       }   
  
       protected void done(){   
            Icon icon= get();  
            lblImage.setIcon(icon); //lblImage可通过构造函数传入  
      }             
}  
testWorker.execute();
```

上述代码中，我们在按钮的事件处理函数中，创建了一个 swingworker 实例对象。调用构造函数时，指定第一个泛型参数为 Icon，这是一个自定义类型，这里代表一个 Icon 图片对象。指定这一泛型参数，是为了指定 doInBackground () 方法的返回值，并在 done () 方法中获取。

doInBackground 方法作为工作线程的一部分执行，它负责完成线程的基本任务，并以返回值来作为线程的执行结果。在 doInBackground 方法完成之后，SwingWorker 调用 done 方法。如果任务需要在完成后，使用工作线程执行结果来更新 GUI 组件或者做些清理工作，可覆盖 done 方法来完成它们。使用 SwingWorker 的 get 方法可以获取 doInBackground 方法的结果，done 方法是调用 get 方法的最好地方，因为此时已知道线程任务完成了，SwingWorker 在 EDT 上激活 done 方法，因此可以在此方法内安全地和任何 GUI 组件交互。execute 方法是异步执行，它立即返回到调用者。在 execute 方法执行后，EDT 立即继续执行。

2.3 WebWorker vs SwingWorker

Swing Worker 还有一些其他的方法，这里不再讨论。我们可以结合 Web Worker，对比看看两者异同。

两者编程模型相同，都是在主线程中，将耗时工作交由工作线程去异步的完成，从而避免主线程的阻塞。

两者线程通信机制不同，Web Worker 线程通信限制严格，仅能通过 postMessage 方法通信，而且参数传递均为值传递，没有引用传递；Swing Worker 参数传递灵活，上述事例中，testWorker 的 doInBackground 方法直接引用了 strImageUrl 变量，不过这一方式并不推荐，而是应当定义一个新类继承自 SwingWorker，并在构造函数中传入 imgUrl 变量，然后在实例化 worker 线程中传入变量。

两者对 UI 界面的更新限制不同，Web Worker 禁止在 worker 线程中操作 dom 元素，所以不能在 worker 中更新 UI；Swing Worker 允许在 done 方法中更新 UI，这里并没有违背 Swing 的事件分发模型，因为最终还是在 EDT 上激活的 done 方法，依然遵循着事件分发模型。

**3. Web Worker 带来了什么**

最后来总结 Web Worker 为 javascript 带来了什么，学习过程中，看到一些文章认为 Web Worker 为 Javascript 带来了多线程编程能力，我不认可这种观点。

3.1 Web Worker 带来后台计算能力

Web Worker 自身是由 webkit 多线程实现，但它并没有为 Javasctipt 语言带来多线程编程特性，我们现在仍然不能在 Javascript 代码中创建并管理一个线程，或者主动控制线程间的同步与锁等特性。

在我看来，Web Worker 是 worker 编程模型在浏览器端 Javascript 语言中的应用。浏览器的运行时，同其他 GUI 程序类似，核心逻辑像是下面这个无限循环: 

    while(true){  
        1 更新数据和对象状态  
        2 渲染可视化UI  
    }

在 Web Worker 之前，Javascript 执行引擎只能在一个单线程环境中完成这两项任务。而在其他典型 GUI 框架，如前文 Swing 库中，早已引入了 Swing Worker 来解决大量计算对 UI 渲染的阻塞问题。Web Worker 的引入，是借鉴了 worker 编程模型，给单线程的 Javascript 带来了后台计算的能力。

3.2 Web Worker 典型应用场景

既然 Web Worker 为浏览器端 Javascript 带来了后台计算能力，我们便可利用这一能力，将无限循环中第一项 “更新数据和对象状态” 的耗时部分交由 Web Worker 执行，提升页面性能。

部分典型的应用场景如下

1）  使用专用线程进行数学运算

Web Worker 最简单的应用就是用来做后台计算，而这种计算并不会中断前台用户的操作

2）  图像处理

通过使用从&lt;canvas> 或者&lt;video> 元素中获取的数据，可以把图像分割成几个不同的区域并且把它们推送给并行的不同 Workers 来做计算

3）  大量数据的检索

当需要在调用 ajax 后处理大量的数据，如果处理这些数据所需的时间长短非常重要，可以在 Web Worker 中来做这些，避免冻结 UI 线程。

4）  背景数据分析

由于在使用 Web Worker 的时候，我们有更多潜在的 CPU 可用时间，我们现在可以考虑一下 JavaScript 中的新应用场景。例如，我们可以想像在不影响 UI 体验的情况下实时处理用户输入。利用这样一种可能，我们可以想像一个像 Word（Office Web Apps 套装）一样的应用：当用户打字时后台在词典中进行查找，帮助用户自动纠错等等。

参考文章

1.The Basics of Web Workers

<http://www.html5rocks.com/en/tutorials/workers/basics/>

2. 深入 HTML5 Web Worker 应用实践：多线程编程

<http://www.ibm.com/developerworks/cn/web/1112_sunch_webworker/index.html>

3. JavaScript 工作线程实现方式

[http://www.ibm.com/developerworks/cn/web/1105\\\_chengfu\\\_jsworker/index.html](http://www.ibm.com/developerworks/cn/web/1105/_chengfu/_jsworker/index.html)

4.HTML5 与 ” 性工能 “ 障碍

<http://fins.iteye.com/blog/1747321>

5.Web Worker 在 WebKit 中的实现机制

<http://blog.csdn.net/codigger/article/details/40581343>

6. SwingWorker 的用法

[http://blog.csdn.net/vking\\\_wang/article/details/8994882](http://blog.csdn.net/vking/_wang/article/details/8994882)


<!-- {% endraw %} - for jekyll -->