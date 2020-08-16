---
title: 【译】为什么我们要创造 React？【React 系列文章】
date: 2014-11-13
author: TAT.gctang
source_link: http://www.alloyteam.com/2014/11/whydidwebuildreact/
---

<!-- {% raw %} - for jekyll -->

目前已经有很多 JavaScript MVC 框架了。为什么我们还要创造 React 而为什么你会想使用它呢？

## React 不是一个 MVC 框架

React 是一个用来构建可拼装化的 UI 界面的 js 库。它鼓励创造可复用性的 UI 组件，这些组件的特点之一是当前数据会随着时间发生改变。

## React 不使用模版

习惯上，web 应用的 UI 界面是通过模版或 HTML 指令来搭建的。你可以使用这一整套将页面抽象化了的模版来构造你的 UI 界面。

React 在处理构建 UI 界面的不同之处在于它是以组件形式将 UI 界面阻断。这意味着 React 用的是一门真实的，全能的编程语言去渲染视图（View 层），同时我们也看到了比采用模版更优秀的一些原因:

-   **JavaScript 是一门灵活的强大的，并且有能力构建各种抽象的编程语言**。这一点在大型的应用中是非常重要的。
-   通过将你的标识和它们相关联的 View 层的逻辑统一起来，React 实际上就可以让 View 层**更容易扩展和维护**。
-   通过将对标记元素和内容的理解融入 JavaScript 之中，**没有手动添加的字符串拼接**，因此很少有引发 XSS 漏洞的地方。

此外，我们也创造了**[JSX](http://facebook.github.io/react/docs/jsx-in-depth.html "JSX")**，一种可选的语法扩展，如果相对于原生 JavaScript，你更喜欢 HTML 的可读性，那么你将会爱上它。

## 简单到要命的响应式更新

当你的数据是动态变化时，React 真的是好用到爆了。

在一般的 JavaScript 应用中，你需要关注数据的变化还有与之相关的 DOM 的更新。即使是 AngularJS 也一样，它只是通过指令和数据绑定（[这需要一个关联函数手动地更新 DOM 节点](https://code.angularjs.org/1.0.8/docs/guide/directive#reasonsbehindthecompilelinkseparation)）来提供一个声明接口。

React 采用了不同的方法。

当你的组件第一次被初始化时，render 方法将被调用，继而生成一个轻量级的 View 层的展示层。对于这个展示层，它产生了一连串的标识，另外它也被注入到 document 之中了。当你的数据变化时，这个 render 方法将再次被调用。为了尽可能高效地执行更新，我们对先前调用的 render 方法的返回值与新的值进行差异对比，由此生成最小的变化集合来应用到 DOM 的更新上面。

>  _从 render 方法返回的数据既不是一个字符串又不是一个 DOM 节点 —— 它是一个轻量级的关于 DOM 应该是什么样的描述。_ 

我们称这个过程叫做**[reconciliation](http://facebook.github.io/react/docs/reconciliation.html)(调节)。** 点击[这个 jsFiddle](http://jsfiddle.net/fv6RD/3/) 去看看一个采用 reconciliation 跑起来的例子。

因为这个重新渲染是非常快的（对于 TodoMVC 只花了大概 1 毫秒），所以开发者并不需要明确地指定数据的绑定。我们发现这个方式可以让构建应用程序变得更加容易。

## HTML 仅仅是个开始。

因为 React 拥有自己的轻量的 document 展示层，所以我们可以用这个来做一些很酷的东西：

-   Facebook 有用<canvas> 而不是 HTML 来渲染的动态图表。
-   Instagram 是一个完全采用 React 和 [Backbone.Router](http://backbonejs.org/#Router "backbone.Router") 构建的单页应用。设计者会定期地贡献使用 JSX 编写的 React 代码。
-   我们已经构建了在一个 web worker 中运行 React 应用程序的内部原型还有使用 React 通过 Objective-C 的桥接接口来操纵**原生的 iOS 视图层** 
-   为了 SEO、性能、共享代码还有项目整体的灵活性，你可以[在服务器端运行 React](https://github.com/petehunt/react-server-rendering-example)。
-   事件在全部现代浏览器 (包括 IE8) 下表现一致性还有符合标准化，同时也自动地采用了[事件委托](http://davidwalsh.name/event-delegate "event-delegate") 。

赶紧到 [facebook.github.io/react](http://facebook.github.io/react) 去看看我们已经构建好了的项目吧。

我们的文档是面向使用这个框架来构建应用的，但如果你有兴趣了解具体细节的话，就[联系我们](http://facebook.github.io/react/support.html)吧。

感谢阅读完本文！

原文地址：[Why did we build React?](http://facebook.github.io/react/blog/2013/06/05/why-react.html "Why did we build React?")

译者注：作为【React 系列文章】的开盘菜，还是有必要把官方的自白先引过来，

随后的文章里面将会对 React 的使用与原理进行剖析，并横向地与 Angular 进行关联对比。

敬请期待。

<!-- {% endraw %} - for jekyll -->