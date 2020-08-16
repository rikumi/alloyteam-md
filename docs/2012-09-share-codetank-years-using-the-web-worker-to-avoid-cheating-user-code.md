---
title: 使用 Web Worker 提高 CodeTank 性能并防止用户代码作弊
date: 2012-09-19
author: TAT.Cson
source_link: http://www.alloyteam.com/2012/09/share-codetank-years-using-the-web-worker-to-avoid-cheating-user-code/
---

<!-- {% raw %} - for jekyll -->

**【场景】：**

由于 CodeTank 是一个 JS 的编程游戏，所以用户的代码都可以在 CodeTank 平台上执行，从而控制 tank 的个性化行为。

在 CodeTank 设计之初，主要需要实现的目标如下：

1.  自定义的坦克可以调用公用的 API，例如 fire，ahead 等控制坦克行为的 API。
2.  自定义的坦克可以实现自己的事件处理程序，在特定事件触发时提供自己的响应。
3.  自定义坦克管理属于自己的状态队列。

因此使用了继承的方法去实现坦克的设计：

[![](http://www.alloyteam.com/wp-content/uploads/2012/09/base-3.png "base (3)")](http://www.alloyteam.com/wp-content/uploads/2012/09/base-3.png)

把基础 API 放在坦克的基类中，每个用户坦克作为子类继承基类，并实现自己的事件处理程序以及维护自己的状态队列。用户调用一个父类的 API（例如 ahead），直接把 ahead 状态添加到机器人的状态队列，一切都工作得很好。

**【问题】**

这样的设计能够满足游戏的需求，通过代码控制自己的坦克，但是问题也是显而易见的，作弊实在是太容易了！玩家可以通过对任意 API 进行重写，修改自己的属性，甚至写一个死循环，把浏览器卡死。

以下是游戏发布不久后，一些 CodeTank 玩家使用的作弊方法：

1. 瞬间废掉其他坦克武功：

[![](http://www.alloyteam.com/wp-content/uploads/2012/09/zb11.jpg "zb1")](http://www.alloyteam.com/wp-content/uploads/2012/09/zb11.jpg)

2. 无敌坦克诞生：

[![](http://www.alloyteam.com/wp-content/uploads/2012/09/zb2.jpg "zb2")](http://www.alloyteam.com/wp-content/uploads/2012/09/zb2.jpg)

虽然各种创新的作弊方式另游戏变得非常有趣味性，但是为了公平，我们还是需要找到有效防止用户作弊的方法。

让我们回顾刚才说的三种作弊方式：

1.  更改自己的属性。
2.  重写 API。
3.  卡死浏览器，或者对 UI 线程有骚扰的操作。

第一点还是比较容易避免的，我们可以把用户的属性私有化，并只提供 get 接口获取属性的值，避免用户代码对属性的修改。

但是对于第二和第三点，乍一看下去，感觉传统的编程模型并不能进行完全的规避。既然用户能获取 API 的接口并调用，用户也能获取并重写。用户代码和其他代码运行在同一个线程中，任何阻塞都能影响到其他代码的执行。

**【解决方法】**

HTML5 里提供了 JS 多线程的机制，使用 web worker，可以使不同用户的代码在各自的线程中执行，和主线程上逻辑代码分离，通过消息的发送和接收实现主线程和各个用户线程之间的交互，**感谢 [P 爷](http://www.alloyteam.com/author/iptton/ "P 爷")提供的思路**~

关于 worker 的参考文章：

<http://www.ibm.com/developerworks/cn/web/1112_sunch_webworker/>

<http://www.html5rocks.com/en/tutorials/workers/basics/>

由于 Codetank 已经上线，因此提供给用户的接口并不能修改，让我们来看看如何在保持外部接口不变的前提下向 CodeTank 加入 worker 机制：

**1. 主线程和用户线程维护各自的坦克类**

首先，用户实现的坦克代码被分离到自己的线程当中执行，主线程保留之前的坦克类，并负责游戏逻辑，维护每个坦克的状态，和用户线程交互，以及事件的通知。

用户线程里，存在另一个坦克类。用户继承的仅仅是用户线程里坦克类，该类的 API 不再是直接更改坦克的状态，而是发送消息，通知主线程上的坦克类去更改坦克的状态。

这样的话，用户所调用的所有 API 仅仅是消息的通知，即使用户重写这些 API，也不能影响其他线程里其他坦克的行为，因为用户所作修改的影响范围只有在自己的线程里。

**2.API 使用消息发送的形式**

在用户的线程里面，所有 set 类的 API（例如 setUI），和其他添加坦克行为的 API（例如 fire），改造成使用消息发送的形式（之后会说明为什么不是所有 API 都改成消息发送的形式）。

以 fire 的 API 为例：

[![](http://www.alloyteam.com/wp-content/uploads/2012/09/fire.jpg "fire")](http://www.alloyteam.com/wp-content/uploads/2012/09/fire.jpg)

所有具体的操作都在主线程上完成，worker 里的 fire API 仅仅是发送一个通知。

主线程收到通知，调用主线程上对应的坦克对象执行实质的 fire 操作：

[![](http://www.alloyteam.com/wp-content/uploads/2012/09/fire21.jpg "fire2")](http://www.alloyteam.com/wp-content/uploads/2012/09/fire21.jpg)

**3. 为用户线程维护自己的一份数据副本**

回到之前的问题，为什么不能把所有的 API 都修改为发送消息的形式？原因很简单，因为有些 API 不能使用发送消息的形式。

之前我们都是发送消息，让主线程的坦克对象收到消息后进行相应状态更新，但是一些 get 类的 API (例如 getEnergy)，获取自身属性的 API，并不能通过发送消息去获取：

[![](http://www.alloyteam.com/wp-content/uploads/2012/09/get.jpg "get")](http://www.alloyteam.com/wp-content/uploads/2012/09/get.jpg)

用户需要立刻获得 energy 的值，并在下一步进行处理，由于消息是异步的，所以使用发送消息的方法并不能立刻获得 energy 的值。

因此，唯一的解决方法就是在用户线程里维护一份数据的副本，使用户能立刻获取数据。采用这种方法，即使用户执行之前说的一些直接修改自己属性的恶意行为（例如修改自己的能量），也不会影响主线程，因为它仅仅是修改了自己线程里的数据副本，该副本并不作为游戏逻辑里判断的依据。

由于坦克的数据每帧都在变化，所以用户线程里使用的数据必须是实时更新的，所以主线程上的坦克在每次 update 后，都需要把数据信息同步到用户线程中。

**4. 事件消息通知**

由于游戏逻辑都在主线程中实现，因此当事件触发时，就需要发送消息通知用户线程里的坦克，坦克收到通知后，在自己的线程里执行自己实现的事件处理程序。

修改后流程图：

[![](http://www.alloyteam.com/wp-content/uploads/2012/09/base2-3.png "base2 (3)")](http://www.alloyteam.com/wp-content/uploads/2012/09/base2-3.png)

**【其他问题以及解决方案】**

1.worker 里不能使用 window，document 等对象。

由于用户代码里使用了 JX 框架，而 JX 的框架内部使用了 window 对象，因此并不能直接把 JX 框架引入 worker，而需要把一个去掉 JX 里 window 对象的 “残缺” JX 引入 worker。

2.worker 里不能使用 debugger 断点。

worker 里会直接把断点忽略，这样的话会给用户对自己坦克的调试带来困难，解决方法是开发模式下仍然使用之前直接调用坦克代码的方法，而其他模式下则使用 worker 的方法，换言之，用户只能在开发模式下调试自己的坦克。

3.Blob 方法的兼容。

由于 worker 里需要使用 Blob 方法来把字符串的代码片段加入 worker，但是 Blob 方法只在高版本的浏览器中支持，其他较低版本的浏览器则需要使用 BlobBuilder，甚至 WebKitBlobBuilder 等。

兼容低版本浏览器的 Blob 的使用：

[![](http://www.alloyteam.com/wp-content/uploads/2012/09/Blob.jpg "Blob")](http://www.alloyteam.com/wp-content/uploads/2012/09/Blob.jpg)

<!-- {% endraw %} - for jekyll -->