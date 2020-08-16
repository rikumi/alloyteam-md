---
title: "[翻译] Andoird 中事件驱动编程 - Event-driven programming for Android (1)"
date: 2015-07-07
author: TAT.iptton
source_link: http://www.alloyteam.com/2015/07/fan-yi-andoird-zhong-shi-jian-qu-dong-bian-cheng-event-driven-programming-for-android/
---

<!-- {% raw %} - for jekyll -->

**Event-driven programming for Android**

**Andoird 中事件驱动编程**

<https://medium.com/google-developer-experts/event-driven-programming-for-android-part-i-f5ea4a3c4eab>

(This is the first article in a three-part series) (本文是系列文章中的一部分)

Although Android includes some event-driven features in its development, it is far away from being a pure event-driven architecture. Is this something good or bad? As in every issue with software development the answer is not easy: it depends.

虽然 Android 已经包含了若干事件驱动特性，但其离纯正的事件驱动架构还有一定的距离。这到底是好事还是坏事呢？和多数软件开发问题的答案一样：看情况。

First, let’s establish a definition for event-driven development. This is a programming paradigm where the flow of execution is determined by events triggered by actions (such user interaction, messaging from other threads, etc). In this sense, Android is partially event-driven: we all can think of the onClick listeners or the Activity lifecycle, which are events able to trigger actions in an application. Why I said it is not a pure event-driven system? By default, each event is bound to a particular controller, and it is difficult to operate besides it (for example, the onClick events are defined for a view, having a limited scope).

我们先来为 “事件驱动开发” 做个定义：事件驱动开发指的事一种编程模式，在此模式下所有的程序流程都决定于事件 (event)，而事件又是由行为 (action) 来触发（如用户交互，来自其他线程的消息等等）。从这方面来看，Android 是部分驱动开发的：我们都能想到 onClick 监听函数或 Activity 的生命周期函数，这些都是由应用里的行为来驱动的事件，那么为什么我们还是说 Android 不是纯粹的事件驱动系统呢？因为，默认情况下，所有的事件都是绑定在各自的控件器里，你很难从外部去操作触发它（例如：onClick 事件是在 view 中定义的，有指定的上下文范围）。

Wait, you are talking about a new programming paradigm. Adopting frameworks or methodologies has always a cost, could this bring any advantage? I say yes, and to show it I want to present some limitations with traditional Android development.

等等等等，你是在说一个新的编程模式？移植框架是有代价的，这个新模式能带来什么好处吗？ 我的答案是：可以，为了证明其好处，我要先说下现有的编程模式的几个局限性。

In many scenarios it will be easy to end up with a structure as the following diagram is showing:

在多数情况下，我们很容易设计出这样一个代码框架：

![](https://d262ilb51hltx0.cloudfront.net/max/800/1*E8LdhGivILj-DZntgtctrg.png)

Activities can communicate with Fragments, Fragments can send messages to another Fragments and Services. There is a tight coupling of components, and applying changes can be expensive(\*). This leads frequently to boilerplate code, interfaces that implement functions that need to callback and propagate through different layers… you probably know where I want to go. As the amount of code increases, the maintainability and good software engineering practices are decreasing.

Activiy 可以与 Fragment 通信，Fragment 可以发消息给其它 Fragment 或 Services。这是一种紧耦合的组件关系，在其中做修改是比较昂贵的 (作者后文标注：I deliberately like to use the word “expensive” when referring to “lot of time”. Thinking in economical terms is frequently more effective.)。这种设计会导致大量的同一格式的代码，所实现的接口需要在不同的层次里进行回调和传递 (you probably know where I want to go)... 随着代码的增加，整个工程的可维护性及良好的工程实践都会降低。

How does event-driven programming apply here? Let’s represent another system proposal:

那么，在事件驱动编程模式下会怎么处理这种情况呢？请看以下的系统结构图：

![](https://d262ilb51hltx0.cloudfront.net/max/1576/1*8WqRoVCAdoc8c5Tfu5myWQ.png)![](https://d262ilb51hltx0.cloudfront.net/max/800/1*uw1QaSKhDc_J_zDTMH24ow.png)

![](https://d262ilb51hltx0.cloudfront.net/max/1544/1*4FFuBtsHh1OFtm-lts4OSA.png)

Conceptually, the represented system have an event bus. There are different entities subscribed to the Event Bus, and posting events or listening to events — being respectively a producer or a consumer. Any subscriber can perform an action without knowing the logic. Think about it. Think about particular possibilities: a Fragment could render again and update its screen without knowing the logic behind any operation, just knowing that an event took place. Think about the possibilities of decoupling code and having a clean, compartmentalized architecture.

上图中增加了一个概念：事件总线 (event bus)。不同的实例会订阅 (发送或监听) 事件总线，这里称之为生产者 (producer) 和消费者 (consumer)。如此，可以想到，Fragment 可以在不知道背后任何逻辑和操作的情况下进行渲染，更新屏幕展示，代码充分解耦，而架构也是非常清晰，系统模块划分非常明确。

Is this paradigm supported in Android? Well, partially. As mentioned, the SDK offers natively a reduced set of event handling techniques, but we we want to go further. There are some names I want to mention here:

上图展示的结构 Android 支持吗？嗯... 部分支持。上文已提到，Android SDK 提供了一些事件处理功能，但我们希望有更完整的实现。这里想提一提以下开源库：

EventBus, from greenrobot. This library has been optimized for Android, and has some advanced features like delivery threads and subscriber priorities. Otto, from Square. Originally a fork from Guava, it has evolved and being refined to the Android platform. Having tried both I prefer EventBus over Otto. Greenrobot claims that EventBus is significantly better at performing than its pair, and provides an extra amount of features.

EventBus，来自 greenrobot。这个库已为 Android 做优化，具有一些高级功能，如：分必线程，订阅者优先级等。 Otto，来自 Square。源于 Guava ，为 Android 平台做了重新的封装改进。

尝试过两个后，我个人比较喜欢 EventBus。Greenrobot 宣称 EventBus 明显高效于其它竞争对手，并且额外提供了相当多的特性。

The next article will explore how to implement basic functions in EventBus

下一篇会展示如何使用 EventBus。


<!-- {% endraw %} - for jekyll -->