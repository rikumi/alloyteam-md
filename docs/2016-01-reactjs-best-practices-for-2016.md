---
title: React.js 2016 最佳实践
date: 2016-01-23
author: TAT.Johnny
source_link: http://www.alloyteam.com/2016/01/reactjs-best-practices-for-2016/
---

<!-- {% raw %} - for jekyll -->

原文：<https://blog.risingstack.com/react-js-best-practices-for-2016/>

作者：[Péter Márton](https://blog.risingstack.com/author/peter-marton/)

译者按：近几个月 React 相关话题依旧火热，相信越来越多的开发者在尝试这样一项技术，我们团队也在 PC 和移动端不断总结经验。2016 来了，这应该是 React 走向成熟的一年，不管你是新手，还是已经对 React 有所了解，是时候总结一下最佳实践了，让我们看看国外的开发者总结了哪些好的实践吧～![wink](http://www.alloyteam.com/wp-content/plugins/ckeditor-for-wordpress/ckeditor/plugins/smiley/images/wink_smile.png "wink")

\\======================== 译文分割线 ===========================

2015 可以算是 React 之年了，关于其版本发布和开发者大会的话题遍布全球。关于去年 React 的发展里程碑详情，可以查看我们整理的 [React 2015 这一年](https://blog.risingstack.com/react-in-2015/)。

2016 年最有趣的问题可能是，我们该如何编写一个应用呢，有什么推荐的库或框架？

> 作为一个长时间使用 React.js 的开发者，我已经有自己的答案和最佳实践了，但你可能不会同意我说的所有点。我对你的想法和意见很感兴趣，请留言进行讨论。

![React.js logo - Best Practices for 2016](https://risingstack-blog.s3.amazonaws.com/2016/Jan/react_best_practices-1453211146748.png)

如果你只是刚开始接触 React.js，请阅读 [React.js 教程](https://blog.risingstack.com/the-react-way-getting-started-tutorial/)，或 Pete Hunt 的 [React howto](https://github.com/petehunt/react-howto)。

数据处理  

=======

在 React.js 应用中处理数据超级简单的，但同时还是有些挑战。

这是因为你可以使用多种方式，来给一个 React 组件传递属性数据，从而构建出渲染树。但这种方式并不总是能明显地看出，你是否应该更新某些视图。

2015 开始涌现出一批具有更强功能和响应式解决方案的 Flux 库，让我们一起看看：

Flux  

* * *

根据我们的经验，Flux 通常被过度使用了（就是大家在不需使用的场景下，还是使用了）。

Flux 提供了一种清爽的方式存储和管理应用的状态，并在需要的时候触发渲染。

Flux 对于那些**应用的全局 state（译者注：为了对应 React 中的 state 概念，本文将不对 state 进行翻译）特别有用**，比如：管理登录用户的状态、路由状态，或是活跃账号状态。如果使用临时变量或者本地数据来处理这些状态，会非常让人头疼。

我们不建议使用 Flux 来管理路由相关的数据，比如 /items/:itemId。应该只是获取它并存在组件的 state 中，这种情况下，它会在组件销毁时一起被销毁。

如果需要 Flux 的更多信息，建议阅读 [The Evolution of Flux Frameworks](https://medium.com/@dan_abramov/the-evolution-of-flux-frameworks-6c16ad26bb31#.90lamiv5l)。

### 使用 Redux

Redux 是一个 JavaScript app 的可预测 state 容器。

如果你觉得需要 Flux 或者相似的解决方案，你应该了解一下 [redux](https://github.com/rackt/redux)，并学习 [Dan Abramov](https://twitter.com/dan_abramov) 的 [redux 入门指南](https://egghead.io/series/getting-started-with-redux)，来强化你的开发技能。

Rudux 发展了 Flux 的思想，同时降低了其复杂度。

### 扁平化 state

API 通常会返回嵌套的资源，这让 Flux 或 Redux 架构很难处理。我们推荐使用 [normalizr](https://github.com/gaearon/normalizr) 这类库来**尽可能地扁平化 state**。

像这样：

```javascript
const data = normalize(response, arrayOf(schema.user));
state = _.merge(state, data.entities);
```

（我们使用_[isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch) 与 API 进行通信_）

使用 immutable state  

* * *

共享的可变数据是罪恶的根源 ——_Pete Hunt, React.js Conf 2015_

![Immutable logo for React.js Best Practices 2016](https://risingstack-blog.s3.amazonaws.com/2016/Jan/immutable_logo_for_react_js_best_practices-1453211749818.png)

[不可变对象](https://en.wikipedia.org/wiki/Immutable_object)是指在创建后不可再被修改的对象。

不可变对象可以减少那些让我们头痛的工作，并且通过引用级的比对检查来**提升渲染性能**。比如在 shouldComponentUpdate 中：

```javascript
shouldComponentUpdate(nexProps) {  
 // 不进行对象的深度对比
 return this.props.immutableFoo !== nexProps.immutableFoo
}
```

### 如何在 JavaScript 中实现不可变

比较麻烦的方式是，小心地编写下面的例子，总是需要使用 [deep-freeze-node](https://www.npmjs.com/package/deep-freeze-node)（在变动前进行冻结，结束后验证结果）进行单元测试。

    return {  
      ...state,
      foo
    }
     
    return arr1.concat(arr2)

相信我，这是最明显的例子了。

更简单自然的方式，就是使用 [Immutable.js](https://facebook.github.io/immutable-js/)。

    import { fromJS } from 


<!-- {% endraw %} - for jekyll -->