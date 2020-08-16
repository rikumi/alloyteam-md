---
title: React Native 之 JSBridge
date: 2015-05-10
author: TAT.simplehuang
source_link: http://www.alloyteam.com/2015/05/react-native-zhi-jsbridge/
---

<!-- {% raw %} - for jekyll -->

**React Native 综述：**

在 React Native 中，JavaScript 跟 Object-C 均有一个对应的中间件负责交互，源码中称为 bridge，它们通过 callback 的形式进行传参，通过参数配置来触发 OC 的控件，从而达到以 JavaScript 来控制 Native 的目的。

React Native 的设计理念：**既拥有 Native 的用户体验、又保留 React 的开发效率。**

React Native 的口号：_Learn Once,Write Anywhere._

**交互细节：**

![](http://www.alloyteam.com/wp-content/uploads/2015/05/react_native_pic2.png)

1.  双方均维护一套相同的模块配置表，而这份表是由 OC 遍历 OC 模块中带了暴露标记的方法以及 JS 中配置的模块方法而得到的，该操作是由 React Native 自动完成的。
2.  在 JS 调用 OC 方法时，中间件会将该调用做一些格式化操作，在 react native 中格式化为 \[ModuleID,MethodID,params (包含 CallbackID)]，并将其放在等待 OC 调用的队列中，而 CallbackID  则缓存在 JS 中间件上等待回调。
3.  在用户触发了各种事件启动事件，触摸事件，timer 事件，系统事件，回调事件时，OC 会去调用 JS 模块配置表中 JS 模块的方法，此时 JS 会连同等待 OC 调用的队列一起传回 OC 中执行。

**JSBridge：**

前面说过，在 React Native 中，JS 与 OC 共同遵循一个模块配置 json, 并以此为基础来相交传参及调用，而这个 json 中哪里来呢？我们从源头开始吧，下面代码中我们可以看到，OC 将一个名为\_\_fbBatchedBridgeConfig 的变量插入到了 js 当中。而这个变量则是包含了两份配置的对象，这个对象中有两个属性，分别是 remoteModules 与 localModules,remoteModules 源于 IOS 中暴露出来的模块，提供给 JS 调用，而另一份 localModules 则为 JS 的模块配置，来源于 React Native 中 JS 暴露出来供 OC 调用的模块。

_React/Base/RCTBridge.m_

![](http://www.alloyteam.com/wp-content/uploads/2015/05/react_native_pic3.png)

好了，数据源找到了，那么 JS 会在什么地方调用这份数据，又会用这份数据来做什么呢？下列这份代码中，我们可以看到，BatchedBridge.js 直接从\_\_fbBatchedBridgeConfig 中拿到了模块配置表，并将其转传进 BatchedBridgeFactory 内：

_Libraries/BatchedBridge/BatchingImplementation/BatchedBridge.js_

![](http://www.alloyteam.com/wp-content/uploads/2015/05/react_native_pi4.png)

BatchedBridgeFactory 作为一个工厂类，在 React Native 流程中起了统一加工改造的作用，这边我们先看下 MessageQueue 函数，MessageQueue 中文译为消息队列，是 JSBridge 中的一个消息队列类，用于管理等待传给 OC 的已格式化的模块及模块回调，这些模块在各自调用的时候是以 (ModulesName,MethodName,Params) 形式出来的，而经过 MessageQueue 格式化后这些参数名将被转存为（moduleID,methodID,params）的形式，前面是 String 形式，而后面则是 Int 形式，那么，MessageQueue 究竟做了哪些事呢？上代码：

_Libraries/Utilities/MessageQueue.js_

![](http://www.alloyteam.com/wp-content/uploads/2015/05/react_native_pic5.png)

在这里 MessageQueue 把 ModuleName,MethodName,Params  这些字符串转化为整形的 ID，参数及回调的 suceess,fail 函数被放进 param 中，并传递进\_pushRequestToOutgoingItems 里面运行，

\_pushRequestToOutgoingItem 同属 MessageQueue，是其中的一个函数，主要操作一个开放给 Native 调用的数组：

![](http://www.alloyteam.com/wp-content/uploads/2015/05/react_native_pic6.png)

![](http://www.alloyteam.com/wp-content/uploads/2015/05/react_native_pic11.jpg)

\_outgoingItems 里面存放的都是等待 native 调用的 moduleID,methodID,params，这些值分别在在 3 个数组存放，分别是 moduleID：\_REQUEST_MODULE_IDS,mothodID ： REQUEST_METHOD_IDS，params：REQUEST_PARAMSS;

格式为：

```javascript
_outgoingItems: [
    [moduleID1, moduleID2],
    [methodID1, methodID2],
    [params1, params2],
];
```

好了，JSBridge 的前因后果如上所述，那么我们回头看下 JSBridge 主体是干什么的？

_Libraries/BatchedBridge/BatchingImplementation/BatchedBridgeFactory .js_

![](http://www.alloyteam.com/wp-content/uploads/2015/05/react_native_pic7.png)

当 Native 中的事件触发触发 ReactComponent 的动作时，,ReactComponent 将再次使用 JSBridge 中 mapObject 的回调 function 将结果放入 MessageQueue 中等待 Native 调用；

这里大致把 JSBridge 交互过程整理如下：

![](http://www.alloyteam.com/wp-content/uploads/2015/05/react_native_pic8.png) 

我们来看下 ios 模块配置表跟 js 本地模块配置表的内容：

JS 暴露的模块：

![](http://www.alloyteam.com/wp-content/uploads/2015/05/react_native_pic9.jpg)

IOS 暴露的模块：

![](http://www.alloyteam.com/wp-content/uploads/2015/05/react_native_pic10.jpg)

基于 JSBrige 的工作流程及原理如上所述，下期将讲解 React Native 中 JSX 的解析及 Component 的生成。

<!-- {% endraw %} - for jekyll -->