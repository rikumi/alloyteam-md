---
title: React 同构直出优化总结
date: 2016-06-14
author: TAT.joeyguo
source_link: http://www.alloyteam.com/2016/06/react-isomorphic/
---

<!-- {% raw %} - for jekyll -->

[原文地址](https://github.com/joeyguo/blog/issues/9)

React 的实践从去年在 PC QQ 家校群开始，由于 PC 上的网络及环境都相当好，所以在使用时可谓一帆风顺，偶尔遇到点小磕绊，也能够快速地填补磨平。而最近一段时间，我们将手 Q 的家校群重构成 React，除了原有框架上存在明显问题的原因外，选择 React 也是因为它确实有足够的吸引力以及优势，加之在 PC 家校群上的实践经验，斟酌下便开始了，到现在已有页面在线上正常跑起。

由于移动端上的网络及环境迥异，性能偏差。所以在移动端上用 React 时，遇到了不少的坑点，也花了一些力气在上面。关于在移动端上的优化，可看我们团队的另一篇文章的 [React 移动端 web 极致优化](http://www.alloyteam.com/2016/05/react-mobile-web-optimization/)

**一提到优化，不得不提直出**  
关于这块可以查看 [Node 直出理论与实践总结](https://github.com/joeyguo/blog/issues/8)，这篇文章较详细的分析直出的概念及一步步优化，也结合了 手 Q 家校群使用快速的**数据直出**方式来优化性能的总结与性能数据分析

**一提到 React，不得不提同构**  
同构基于服务端渲染，却不止是服务端渲染。

服务端渲染到同构的这一路  

===============

### 后台包办

服务端渲染的方案早在后台程序前后端包办的时代上就有了，那时候使用 JSP、PHP 等动态语言将数据与页面模版整合后输出给浏览器，一步到位

[![22](https://cloud.githubusercontent.com/assets/10385585/15822781/7122b71c-2c2a-11e6-946a-bb7912759395.png)](https://cloud.githubusercontent.com/assets/10385585/15822781/7122b71c-2c2a-11e6-946a-bb7912759395.png)

这个时候，前端开发跟后端揉为一体，项目小的时候，前后端的开发和调试还真可以称为一步到位。但当项目庞大起来的时候，无论是修改某个样式要起一个庞大服务的尴尬，还是前后端糅合的地带变得越来越难以维护，都很难过。

### 前后分离

前后端分离后，服务端渲染的模式就开始被淡化了。这时候的服务端渲染比较尴尬，由于前后端的编码语言不同，连页面模板都不能复用，只能让在前后端开发完成后，再将前端代码改为给后端使用的页面模板，增大了工作量。最终也还是跟后台包办殊途同归。

### 语言变通

Node 驾着祥云腾空而来，谷歌 V8 引擎给力支持，众前端拿着看家本领 (JavaScript) 开始涉足服务端，于是服务端渲染上又一步进阶

[![33](https://cloud.githubusercontent.com/assets/10385585/15822809/9658984e-2c2a-11e6-980e-bca200655749.png)](https://cloud.githubusercontent.com/assets/10385585/15822809/9658984e-2c2a-11e6-980e-bca200655749.png)

由于前后端时候的相同的语言，所以前后端在代码的共用上达到了新的高度，页面模版、node modules 都可以做成前后通用。同构的雏形，只是共用的代码还是有局限。

### 前后同构

有了 Node 后，前端便有了更多的想象空间。前端框架开始考虑兼容服务端渲染，提供更方便的 API，前后端共用一套代码的方案，让服务端渲染越来越便捷。当然，不只是 React 做了这件事，但 React 将这种思想推向高潮，同构的概念也开始广为人传。

[![55](https://cloud.githubusercontent.com/assets/10385585/15822951/1f550bc8-2c2b-11e6-9551-d143d5cc1992.png)](https://cloud.githubusercontent.com/assets/10385585/15822951/1f550bc8-2c2b-11e6-9551-d143d5cc1992.png)

关于 React 网上已有大多教程，可以查看阮老师的 [react-demos](https://github.com/ruanyf/react-demos)。关于 React 上的数据流管理方案，现在最为火热的 Redux 应该是首选，具体可以查看另一篇文章 [React 数据流管理架构之 Redux](https://github.com/joeyguo/blog/issues/9)，此篇就不再赘述，下面讲讲 React 同构的理论与在手 Q 家校群上的具体实践总结。

React 同构  

===========

React 虚拟 Dom  

* * *

React 的虚拟 Dom 以对象树的形式保存在内存中，并存在前后端两种展露原型的形式

[![rendertype](https://cloud.githubusercontent.com/assets/10385585/15844706/fc3854be-2c9e-11e6-8de9-2ba5f9e5a9fb.png)](https://cloud.githubusercontent.com/assets/10385585/15844706/fc3854be-2c9e-11e6-8de9-2ba5f9e5a9fb.png)

1.  客户端上，虚拟 Dom 通过 ReactDOM 的 Render 方法渲染到页面中
2.  服务端上，React 提供的另外两个方法：ReactDOMServer.renderToString 和 ReactDOMServer.renderToStaticMarkup 可将其渲染为 HTML 字符串。

React 同构的关键要素  

* * *

完善的 Compponent 属性及生命周期与客户端的 render 时机是 React 同构的关键。

**DOM 的一致性**  
在前后端渲染相同的 Compponent，将输出一致的 Dom 结构。

**不同的生命周期**  
在服务端上 Component 生命周期只会到 componentWillMount，客户端则是完整的。

**客户端 render 时机**  
同构时，服务端结合数据将 Component 渲染成完整的 HTML 字符串并将数据状态返回给客户端，客户端会判断是否可以直接使用或需要重新挂载。

以上便是 React 在同构 / 服务端渲染的提供的基础条件。在实际项目应用中，还需要考虑其他边角问题，例如服务器端没有 window 对象，需要做不同处理等。下面将通过在手 Q 家校群上的具体实践，分享一些同构的 Tips 及优化成果

以手 Q 家校群 React 同构实践为例  

========================

手 Q 家校群使用 React + Redux + Webpack 的架构

同构实践 Tips  

* * *

### 1. renderToString 和 renderToStaticMarkup

ReactDOMServer 提供 renderToString 和 renderToStaticMarkup 的方法，大多数情况使用 **renderToString**，这样会为组件增加 checksum

[![checknum](https://cloud.githubusercontent.com/assets/10385585/15844528/a8adcc9e-2c9d-11e6-94b9-3bb273f48e53.png)](https://cloud.githubusercontent.com/assets/10385585/15844528/a8adcc9e-2c9d-11e6-94b9-3bb273f48e53.png)

React 在客户端通过 checksum 判断是否需要重新 render  
**相同**则不重新 render，省略创建 DOM 和挂载 DOM 的过程，接着触发 componentDidMount 等事件来处理服务端上的未尽事宜 (事件绑定等)，从而加快了交互时间；**不同**时，组件将客户端上被重新挂载 render。

**renderToStaticMarkup**  则不会生成与 react 相关的 data-\*，也不存在 checksum，输出的 html 如下

[![3333](https://cloud.githubusercontent.com/assets/10385585/15845314/7085895e-2ca4-11e6-97e7-772d817a892c.png)](https://cloud.githubusercontent.com/assets/10385585/15845314/7085895e-2ca4-11e6-97e7-772d817a892c.png)

在客户端时组件会被重新挂载，客户端重新挂载不生成 checknum (也没这个必要)，所以该方法只当服务端上所渲染的组件在客户端不需要时才使用

[![checknum](https://cloud.githubusercontent.com/assets/10385585/15845159/cfc6d0c8-2ca2-11e6-9cbc-45b8318b33dc.png)](https://cloud.githubusercontent.com/assets/10385585/15845159/cfc6d0c8-2ca2-11e6-9cbc-45b8318b33dc.png)

### 2. 服务端上的数据状态与同步给客户端

服务端上的产生的数据需要随着页面一同返回，客户端使用该数据去 render，从而保持状态一致。服务端上使用 renderToString 而在客户端上依然重新挂载组件的情况大多是因为在返回 HTML 的时候没有将服务端上的数据一同返回，或者是返回的数据格式不对导致，开发时可以留意 chrome 上的提示如

[![noti](https://cloud.githubusercontent.com/assets/10385585/15846321/a270a976-2cae-11e6-9044-ec7bdac63e9f.png)](https://cloud.githubusercontent.com/assets/10385585/15846321/a270a976-2cae-11e6-9044-ec7bdac63e9f.png)

### 3. 服务端需提前拉取数据，客户端则在 componentDidMount 调用

**平台上的差异**，服务端渲染只会执行到 compnentWillMount 上，所以为了达到同构的目的，可以把拉取数据的逻辑写到 React Class 的静态方法上，一方面服务端上可以通过直接操作静态方法来提前拉取数据再根据数据生成 HTML，另一方面客户端可以在 componentDidMount 时去调用该静态方法拉取数据

### 4. 保持数据的确定性

这里指影响组件 render 结果的数据，举个例子，下面的组件由于在服务端与客户端渲染上会因为组件上产生不同随机数的原因而导致客户端将重新渲染。

```javascript
Class Wrapper extends Component {
  render() {
    return (<h1>{Math.random()}</h1>);
  }
};
```

可以将 Math.random () 封装至 Component 的 props 中，在服务端上生成随机数并传入到这个 component 中，从而保证随机数在客户端和服务端一致。如

```javascript
Class Wrapper extends Component {
  render() {
    return (<h1>{this.props.randomNum}</h1>);
  }
};
```

服务端上传入 randomNum

```javascript
let randomNum = Math.random()
var html = ReacDOMServer.renderToString(<Wrapper randomNum=
```


<!-- {% endraw %} - for jekyll -->