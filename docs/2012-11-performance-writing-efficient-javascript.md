---
title: 【译】编写高性能 JavaScript
date: 2012-11-20
author: TAT.JohnnyAddy Osmani
source_link: http://www.alloyteam.com/2012/11/performance-writing-efficient-javascript/
---

<!-- {% raw %} - for jekyll -->

原文：<http://coding.smashingmagazine.com/2012/11/05/writing-fast-memory-efficient-javascript/>

作者：[Addy Osmani](http://coding.smashingmagazine.com/author/addy-osmani/?rel=author "Posts by Addy Osmani")

译者按：本人第一次翻译外文，言语难免有些晦涩，但尽量表达了作者的原意，未经过多的润色，欢迎批评指正。另本文篇幅较长、信息量大，可能难以消化，欢迎留言探讨细节问题。本文主要关注 V8 的性能优化，部分内容并不适用于所有 JS 引擎。最后，转载请注明出处: )

\\======================== 译文分割线 ===========================

很多 JavaScript 引擎，如 Google 的 [V8](http://code.google.com/p/v8/) 引擎（被 Chrome 和 Node 所用），是专门为需要[快速执行](http://www.html5rocks.com/en/tutorials/speed/v8/)的大型 JavaScript 应用所设计的。如果你是一个开发者，并且关心内存使用情况与页面性能，你应该了解用户浏览器中的 JavaScript 引擎是如何运作的。无论是 V8，[SpiderMonkey](https://developer.mozilla.org/en-US/docs/SpiderMonkey) 的（Firefox）的 [Carakan](http://my.opera.com/ODIN/blog/carakan-faq)（Opera），[Chakra](http://en.wikipedia.org/wiki/Chakra_(JScript_engine))（IE）或其他引擎，这样做可以帮助你**更好地优化你的应用程序**。这并不是说应该专门为某一浏览器或引擎做优化，千万别这么做。

但是，你应该问自己几个问题：

-   在我的代码里，是否可以使代码更高效一些
-   主流的 JavaScript 引擎都做了哪些优化
-   什么是引擎无法优化的，垃圾回收器（GC）是否能回收我所期望的东西

[![fast_memory](http://www.alloyteam.com/wp-content/uploads/2012/11/fast_memory.jpg)](http://www.alloyteam.com/wp-content/uploads/2012/11/fast_memory.jpg)

_加载\_\_快速的网站就像是一辆快速的跑车，需要用到特别定制的零件。图片来源: [dHybridcars](http://dhybridcars.com/toyota-hybrid/2013-scion-fr-s-sexy-sport-car/media/2013-scion-fr-s-speed-gauge-img-8/)._

编写高性能代码时有一些常见的陷阱，在这篇文章中，我们将展示一些经过验证的、更好的编写代码方式。

## **那么，JavaScript 在 V8 里是如何工作的？**

如果你对 JS 引擎没有较深的了解，开发一个大型 Web 应用也没啥问题，就好比会开车的人也只是看过引擎盖而没有看过车盖内的引擎一样。鉴于 Chrome 是我的浏览器首选，所以谈一下它的 JavaScript 引擎。V8 是由以下几个核心部分组成：

-   **一个基本的编译器**，它会在代码执行前解析 JavaScript 代码并生成本地机器码，而不是执行字节码或简单地解释它。这些代码最开始并不是高度优化的。
-   V8 将对象构建为**对象模型**。在 JavaScript 中对象表现为关联数组，但是在 V8 中对象被看作是隐藏的类，一个为了优化查询的内部类型系统。
-   **运行时分析器**监视正在运行的系统，并标识了 “hot” 的函数（例如花费很长时间运行的代码）。
-   **优化编译器**重新编译和优化那些被运行时分析器标识为 “hot” 的代码，并进行 “内联” 等优化（例如用被调用者的主体替换函数调用的位置）。
-   V8 支持**去优化**，这意味着优化编译器如果发现对于代码优化的假设过于乐观，它会舍弃优化过的代码。
-   V8 有个**垃圾收集器**，了解它是如何工作的和优化 JavaScript 一样重要。

## **垃圾回收**

垃圾回收是**内存管理的一种形式**，其实就是一个收集器的概念，尝试回收不再被使用的对象所占用的内存。在 JavaScript 这种垃圾回收语言中，应用程序中仍在被引用的对象不会被清除。

手动消除对象引用在大多数情况下是没有必要的。通过简单地把变量放在需要它们的地方（理想情况下，尽可能是局部作用域，即它们被使用的函数里而不是函数外层），一切将运作地很好。

[![robot-cleaner](http://www.alloyteam.com/wp-content/uploads/2012/11/robot-cleaner.jpg)](http://www.alloyteam.com/wp-content/uploads/2012/11/robot-cleaner.jpg)

_垃圾回收器尝试回收内存。图片来源: [Valtteri Mäki](http://www.flickr.com/photos/26817893@N05/2864644153/)._

在 JavaScript 中，是不可能强制进行垃圾回收的。你不应该这么做，因为垃圾收集过程是由运行时控制的，它知道什么是最好的清理时机。

### **“消除引用” 的误解**

网上有许多关于 JavaScript 内存回收的讨论都谈到 delete 这个关键字，虽然它可以被用来删除对象（map）中的属性（key），但有部分开发者认为它可以用来强制 “消除引用”。建议尽可能避免使用 delete，在下面的例子中 `delete o.x 的弊大于利，因为它改变了 o 的隐藏类，并使它成为一个 "慢对象"。`

```javascript
var o = { x: 1 };
delete o.x; // true
o.x; // undefined
```

你会很容易地在流行的 JS 库中找到引用删除 —— 这是具有语言目的性的。这里需要注意的是避免在运行时修改 "hot" 对象的结构。JavaScript 引擎可以检测出这种 “hot” 的对象，并尝试对其进行优化。如果对象在生命周期中其结构没有较大的改变，引擎将会更容易优化对象，而 delete 操作实际上会触发这种较大的结构改变，因此不利于引擎的优化。

对于 null 是如何工作也是有误解的。将一个对象引用设置为 null，并没有使对象变 “空”，只是将它的引用设置为空而已。使用 o.x= null 比使用 delete 会更好些，但可能也不是很必要。

```javascript
var o = { x: 1 };
o = null;
o; // null
o.x; // TypeError
```

如果此引用是当前对象的最后引用，那么该对象将被作为垃圾回收。如果此引用不是当前对象的最后引用，则该对象是可访问的且不会被垃圾回收。

另外需要注意的是，全局变量在页面的生命周期里是不被垃圾回收器清理的。无论页面打开多久，JavaScript 运行时全局对象作用域中的变量会一直存在。

```javascript
var myGlobalNamespace = {};
```

全局对象只会在刷新页面、导航到其他页面、关闭标签页或退出浏览器时才会被清理。函数作用域的变量将在超出作用域时被清理，即退出函数时，已经没有任何引用，这样的变量就被清理了。

### 经验法则

为了使垃圾回收器尽早收集尽可能多的对象，**不要 hold 着不再使用的对象**。这里有几件事需要记住：

-   正如前面提到的，在合适的范围内使用变量是手动消除引用的更好选择。即一个变量只在一个函数作用域中使用，就不要在全局作用域声明它。这意味着更干净省心的代码。
-   确保解绑那些不再需要的事件监听器，尤其是那些即将被销毁的 DOM 对象所绑定的事件监听器。
-   如果使用的数据缓存在本地，确保清理一下缓存或使用老化机制，以避免大量不被重用的数据被存储。

### 函数

接下来，我们谈谈函数。正如我们已经说过，垃圾收集的工作原理，是通过回收不再是访问的内存块（对象）。为了更好地说明这一点，这里有一些例子。

```javascript
function foo() {
    var bar = new LargeObject();
    bar.someCall
```


<!-- {% endraw %} - for jekyll -->