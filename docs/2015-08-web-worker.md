---
title: "[译文] web workers 到底有多快？"
date: 2015-08-02
author: TAT.joeyguo
source_link: http://www.alloyteam.com/2015/08/web-worker/
---

<!-- {% raw %} - for jekyll -->

##### 来源：[How fast are web workers?](https://hacks.mozilla.org/2015/07/how-fast-are-web-workers/)

下一版本的 Firefox OS 移动操作系统将通过使用其多核处理器来充分利用设备的性能，JavaScript 虽然在单线程上执行，但通过使用 web workers 可以实现代码的并行执行，这样将释放浏览器中任何可能阻塞主线程的程序，UI 动画也将因此更顺畅的执行。

### [](https://github.com/JoeyGoo/doc/tree/master/web%20workers#web-workers-简介)web workers 简介

有几种类型的 web workers：

-   [Web workers](https://hacks.mozilla.org/2015/07/how-fast-are-web-workers/)
-   [Shared workers](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker)
-   [Service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

他们各自拥有不同特性，但有着相似的设计形式，worker 中代码将在自己开辟的独立线程上执行，与主线程及其他 worker 并行执行，不同类型的 workers 维护着一个共同的接口。

#### [](https://github.com/JoeyGoo/doc/tree/master/web%20workers#web-workers)web workers

专用的 web workers 将在主线程上被实例化，并且其他 worker 将只能通过它来进行通信

#### [](https://github.com/JoeyGoo/doc/tree/master/web%20workers#shared-workers)Shared workers

Shared workers 允许同源中的所有页面或脚本 (包含不同的浏览器标签，iframes 或者其他 shared workers) 之间进行通信.

#### [](https://github.com/JoeyGoo/doc/tree/master/web%20workers#service-workers)Service workers

近期，Service workers 得到了大量的关注，他可以作为 web 代理服务器 (开发者能够对页面请求进行控制) 将内容传递给请求者 (如主线程)。不仅如此，它还能够支持离线应用。Service workers 是一个非常新的 API，现在仍没有兼容所有的浏览器，本文将不对其详细介绍。

为了验证 web workers 让 Firefox OS 运行得更快，我们通过对其进行基准测试来验证他的速度。

### [](https://github.com/JoeyGoo/doc/tree/master/web%20workers#创建web-workers的开销)创建 web workers 的开销

本文主要针对 Firefox OS。所有的数据都在 Flame 手机上所测量。 第一组测试是创建 web workers 所花费的时间，为此，我们创建一个 script 文件，该 script 文件实例化了一个 web worker 并发送一个最小的消息。发现 web worker 快速对其回复。当主线程接收到响应后，我们将得到这个过程所花费的时间。 然后销毁 web worker 并对上面所述的实验进行多次重复操作，我们将能够得到创建 web worker 所花费的平均时间，可以通过如下代码简单地实例化一个 web worker

```javascript
// Start a worker.
var worker = new Worker("worker-script.js");
// Terminate a worker.
worker.terminate();
```

同样的方式来创建广播通道

```javascript
// Open a broadcast channel.
var channel = new window.BroadcastChannel("channel-name");
// Close a broadcast channel.
channel.close();
```

Shared workers 无法在这里进行基准测试，因为他们一旦被创建，开发者将不能够销毁他们，它们将由浏览器接管。鉴于此，我们不能通过创建和销毁 Shared workers 来得到有意义的基准测试。

Web workers 大约使用 40 毫秒被实例化。这个时间相当稳定的，波动只有几毫秒。创建一个 broadcast channel 通常是在 1 毫秒内完成。

正常情况下，浏览器的刷新频率为 60 帧 / 秒 (fps)，这意味着没有 JavaScript 代码运行应该超过一帧所需时间，即 16.66 毫秒 (60 帧 / 秒)。否则页面的渲染就会出现卡顿效果，也就是常说的 jankiness。

实例化 web workers 非常高效的，但是仍可能不适合单帧所用的时间。这就是为什么要创造尽可能少的 web workers 并且重用它们的重要原因。

### [](https://github.com/JoeyGoo/doc/tree/master/web%20workers#消息延迟)消息延迟

web workers 的关键之一，是它能够在主线程及 workers 之间进行快速通信，以下列出主线程与 web worker 之间两种不同的通信方式。

#### [](https://github.com/JoeyGoo/doc/tree/master/web%20workers#postmessage)postMessage

这个 API 是默认及首选的，用来 web worker 发送和接收消息。如下:  

```javascript
// Send a message to the worker.
worker.postMessage(myMessage);
// Listen to messages from the worker.
worker.onmessage = (evt) => {
    var message = evt.data;
};
```

#### [](https://github.com/JoeyGoo/doc/tree/master/web%20workers#broadcast-channel)Broadcast Channel

这是一个新的 API, 现在只能在 Firefox 中使用。Broadcast Channel 能够所有同源的上下文进行广播消息。包含同源的页面，iframes, 或 workers 都能够发送和接收消息:

```javascript
// Send a message to the broadcast channel.
channel.postMessage(myMessage);
// Listen to messages from the broadcast channel.
channel.onmessage = (evt) => {
    var message = evt.data;
};
```

这里的基准测试，我们使用类似于上述代码，不同之处在于 web worker 将不被销毁，并在每一个操作都重复使用它。所以，得到的往返响应时间应除以 2。 可能你已想到，简单的 postMessage 是很快的，它通常只需要在 0 至 1 毫秒来发送一个消息，不管是对一个 web 还是 shared worker。Broadcast channel 的 API 大约需要 1 至 2 毫秒。

在正常情况下，workers 之间通信很快，你不需要担心这里的通信速度，当然，发送更大的消息将会使用较长的时间。

#### [](https://github.com/JoeyGoo/doc/tree/master/web%20workers#消息的大小)消息的大小

有两种形式能够给 web workers 发送消息

-   Copying the message
-   Transferring the message

在第一种情况下，该消息将被序列化，复制然后发送。在后者，数据将被传送，这意味着消息发送出去后，发送者将不再使用它。数据传送几乎是瞬时的，所以不能基准测试。然而，只有 ArrayBuffer 是可传送的。

正如预期，序列化、复制和反序列化数据对消息传输增加了显著的开销。消息越大，时间越长。

在这个基准测试中，我们发送一个 typed array 给 web worker。 它的大小在每个迭代中逐步增加。传送消息的大小跟传输时间呈线性相关。对于每次测量，我们可以把数据大小（kb）除以时间（ms）来得到传输速度（kb/ms）。

通常，在 Flame 手机中，postMessage 的传输速度在 80 kB/ms，而 broadcast channel 则为 12kB/ms，这意味着，如果你想你的消息适应单个帧，那么当使用 postMessage 时，让消息的大小保持在 1300kB 内；在使用 broadcast channel 时，使其大小小于 200kB。否则，可能会出现丢帧的情况。

在这个基准测试中，我们使用 typed array，因为它使我们能够以千字节为单位确定其大小。你也可以传输 JavaScript 对象，但由于序列化的过程，他们需要更长的时间去发送。对于小的对象，这其实并不重要，但如果你需要发送巨大的对象，你不妨将其序列化成二进制格式。并且使用类似于协议缓冲区的方式。

#### [](https://github.com/JoeyGoo/doc/tree/master/web%20workers#正常使用下web-workers相当快)正常使用下 Web workers 相当快

以下是在 Flame 手机中对 web workers 的各种基准测试的总结:

\*\* 操作 \*\* -》\*\* 值 \*\*

-   实例化一个 web worker -》40 ms
-   实例化一个 broadcast channel -》1 ms
-   postMessage 的通信延迟 -》0.5 ms
-   broadcast channel 的通信延迟 -》1.5 ms
-   postMessage 的通信速度 -》80 kB/ms
-   broadcast channel 的通信速度 -》12 kB/ms
-   postMessage 的最大传输数据大小 -》1,300 kB
-   broadcast channel 的最大传输数据大小 -》200 kB

基准测试用来确保你所使用的解决方案是非常快的。这个过程将大量的猜测从 web 开发中消除。

<!-- {% endraw %} - for jekyll -->