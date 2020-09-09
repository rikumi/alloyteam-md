---
title: React 移动 web 极致优化
date: 2016-05-30
author: TAT.heyli
source_link: http://www.alloyteam.com/2016/05/react-mobile-web-optimization/
---

<!-- {% raw %} - for jekyll -->

[原文地址](https://github.com/lcxfs1991/blog/issues/8)

最近一个季度，我们都在为手 Q 家校群做重构优化，将原有那套问题不断的框架换掉。经过一些斟酌，决定使用 react 进行重构。选择 react，其实也主要是因为它具有下面的三大特性。

React 的特性  

* * *

### 1. Learn once, write anywhere

学习 React 的好处就是，学了一遍之后，能够写 web, node 直出，以及 native，能够适应各种纷繁复杂的业务。需要轻量快捷的，直接可以用 Reactjs；需要提升首屏时间的，可以结合 React Server Render；需要更好的性能的，可以上 React Native。

但是，这其实暗示学习的曲线非常陡峭。单单是 Webpack+ React + Redux 就已够一个入门者够呛，更何况还要兼顾直出和手机客户端。不是一般人能 hold 住所有端。

### 2. Virtual Dom

Virtual Dom（下称 vd）算是 React 的一个重大的特色，因为 Facebook 宣称由于 vd 的帮助，React 能够达到很好的性能。是的，Facebook 说的没错，但只说了一半，它说漏的一半是：“除非你能正确的采用一系列优化手段”。

### 3. 组件化

另一个被大家所推崇的 React 优势在于，它能令到你的代码组织更清晰，维护起来更容易。我们在写的时候也有同感，但那是直到我们踩了一些坑，并且渐渐熟悉 React+ Redux 所推崇的那套代码组织规范之后。

### 那么？

上面的描述不免有些先扬后抑的感觉，那是因为往往作为 React 的刚入门者，都会像我们初入的时候一样，对 React 满怀希望，指意它帮我们做好一切，但随着了解的深入，发现需要做一些额外的事情来达到我们的期待。

对 React 的期待  

* * *

初学者对 React 可能满怀期待，觉得 React 可能完爆其它一切框架，甚至不切实际地认为 React 可能连原生的渲染都能完爆 —— 对框架的狂热确实会出现这样的不切实际的期待。让我们来看看 React 的官方是怎么说的。React 官方文档在 Advanced Performanec 这一节，这样写道：

    One of the first questions people ask when considering React for a project is whether their application will be as fast and responsive as an equivalent non-React version

显然 React 自己也其实只是想尽量达到跟非 React 版本相若的性能。React 在减少重复渲染方面确实是有一套独特的处理办法，那就是 vd，但显示在首次渲染的时候 React 绝无可能超越原生的速度，或者一定能将其它的框架比下去。因此，我们在做优化的时候，可的期待的东西有：

-   首屏时间可能会比较原生的慢一些，但可以尝试用 React Server Render (又称 Isomorphic) 去提高效率
-   用户进行交互的时候，有可能会比原生的响应快一些，前提是你做了一些优化避免了浪费性能的重复渲染。

以手 Q 家校群功能页 React 重构优化为例  

* * *

手 Q 家校群功能页主要由三个页面构成，分别是列表页、布置页和详情页。列表页已经重构完成并已发布，布置页已重构完毕准备提测，详情页正在重构。与此同时我们已完成对列表页的同构直出优化，并已正在做 React Native 优化的铺垫。

这三个页面的重构其实覆盖了不少页面的案例，所以还是蛮有代表性的，我们会将重构之中遇到的一些经验穿插在文章里论述。

在手 Q 家校群重构之前，其实我们已经做了一版 PC 家校群。当时将 native 的页面全部 web 化，直接就采用了 React 比较常用的全家桶套装：

-   构建工具 => gulp + webpack
-   开发效率提升 => redux-dev-tools + hot-reload
-   统一数据管理 => redux
-   性能提升 => immutable + purerender
-   路由控制器 => react-router (手 Q 暂时没采用)

为什么我们在优化的时候主要讲手 Q 呢？毕竟 PC 的性能在大部份情况下已经很好，在 PC 上一些存在的问题都被 PC 良好的性能掩盖下去。手机的性能不如 PC，因此有更多有价值的东西深挖。开发的时候我就跟同事开玩笑说：“ 没做过手机 web 优化的都真不好意思说自己做过性能优化啊 “。

构建针对 React 做的优化  

* * *

我在《性能优化三部曲之一 —— 构建篇》提出，“通过构建，我们可以达成开发效率的提升，以及对项目最基本的优化”。在进行 React 重构优化的过程中，构建对项目的优化作用必不可少。在本文暂时不赘述，我另外开辟了一篇 [《webpack 使用优化（react 篇）》](https://github.com/lcxfs1991/blog/issues/7)进行具体论述。

开发效率提升工具  

* * *

![](https://segmentfault.com/image?src=https://cloud.githubusercontent.com/assets/3348398/15649370/ab4db266-26a3-11e6-909d-958c3c795975.png&objectId=1190000005599249&token=2571e1b37a91d86108e4bd6b99d73cb1)

在 PC 端使用 Redux 的时候，我们都很喜欢使用 Redux-Devtools 来查看 Redux 触发的 action，以及对应的数据变化。PC 端使用的时候，我们习惯摆在右边。但移动端的屏幕较少，因此家校群项目使用的时候放在底部，而且由于性能问题，我们在 constant 里设一个 debug 参数，然后在 chrome 调试时打开，移动端非必须的时候关闭。否则，它会导致移动 web 的渲染比较低下。

数据管理及性能优化  

* * *

### Redux 统一管理数据

这一部份算是重头戏吧。React 作为 View 层的框架，已经通过 vd 帮助我们解决重复渲染的问题。但 vd 是通过看数据的前后差异去判断是否要重复渲染的，但 React 并没有帮助我们去做这层比较。因此我们需要使用一整套数据管理工具及对应的优化方法去达成。在这方法，我们选择了 Redux。

Redux 整个数据流大体可以用下图来描述：

![](https://segmentfault.com/image?src=https://cloud.githubusercontent.com/assets/3348398/15649583/41f46b46-26a5-11e6-9da9-71d90b2b4e04.png&objectId=1190000005599249&token=7f4de6271c436c2a8659f5786bc0ca99)

Redux 这个框架的好处在于能够统一在自己定义的 reducer 函数里面去进行数据处理，在 View 层中只需要通过事件去处触发一些 action 就可以改变地应的数据，这样能够使数据处理和 dom 渲染更好地分离，而避免手动地去设置 state。

在重构的时候，我们倾向于将功能类似的数据归类到一起，并建立对应的 reducer 文件对数据进行处理。如下图，是手 Q 家校群布置页的数据结构。有些大型的 SPA 项目可能会将初始数据分开在不同的 reducer 文件里，但这里我们倾向于归到一个 store 文件，这样能够清晰地知道整个文件的数据结构，也符合 Redux 想统一管理数据的想法。然后数据的每个层级与 reducer 文件都是一一对应的关系。

![](https://segmentfault.com/image?src=https://cloud.githubusercontent.com/assets/3348398/15649727/4fa31034-26a6-11e6-9e9a-3220eed40bab.png&objectId=1190000005599249&token=d7ba3c8ef589acad01de73b28cc6208a)

### 重复渲染导致卡顿

这套 React + Redux 的东西在 PC 家校群页面上用得很欢乐， 以至于不用怎么写 shouldComponentUpdate 都没遇到过什么性能问题。但放到移动端上，我们在列表页重构的时候就马上遇到卡顿的问题了。

什么原因呢？是重复渲染导致的！！！！！！

说好的 React vd 可以减少重复渲染呢？！！！

请别忘记前提条件！！！！

你可以在每个 component 的 render 里，放一个 console.log ("xxx component")。然后触发一个 action，在优化之前，几乎全部的 component 都打出这个 log，表明都重复渲染了。

### React 性能的救星 Immutablejs

![](https://sf-static.b0.upaiyun.com/v-57481e79/global/img/squares.svg) (网图，引用的文章太多以致于不知道哪篇才是出处)

上图是 React 的生命周期，还没熟悉的同学可以去熟悉一下。因为其中的 shouldComponentUpdate 是优化的关键。React 的重复渲染优化的核心其实就是在 shouldComponentUpdate 里面做数据比较。在优化之前，shouldComponentUpdate 是默认返回 true 的，这导致任何时候触发任何的数据变化都会使 component 重新渲染。这必然会导致资源的浪费和性能的低下 —— 你可能会感觉比较原生的响应更慢。

这时你开始怀疑这世界 —— 是不是 Facebook 在骗我。

当时遇到这个问题我的开始翻阅文档，也是在 Facebook 的 Advanced Performance 一节中找到答案：Immutablejs。这个框架已被吹了有一年多了吧，吹这些框架的人理解它的原理，但不一定实践过 —— 因为作为一线移动端开发者，打开它的 github 主页看 dist 文件，50kb，我就已经打退堂鼓了。只是遇到了性能问题，我们才再认真地去了解一遍。

Immutable 这个的意思就是不可变，Immutablejs 就是一个生成数据不可变的框架。一开始你并不理解不可变有什么用。最开始的时候 Immutable 这种数据结构是为了解决数据锁的问题，而对于 js，就可以借用来解决前后数据比较的问题 —— 因为同时 Immutablejs 还提供了很好的数据比较方法 ——Immutable.is ()。小结一下就是：

-   Immutablejs 本身就能生成不可变数据，这样就不需要开发者自己去做数据深拷贝，可以直接拿 prevProps/prevState 和 nextProps/nextState 来比较。
-   Immutable 本身还提供了数据的比较方法，这样开发者也不用自己去写数据深比较的方法。

说到这里，已万事俱备了。那东风呢？我们还欠的东风就是应该在哪里写这个比较。答案就是 shouldComponentUpdate。这个生命周期会传入 nextProps 和 nextState，可以跟 component 当前的 props 和 state 直接比较。这个就可以参考 pure-render 的做法，去重写 shouldComponentUpdate，在里面写数据比较的逻辑。

其中一位同事 polarjiang 利用 Immutablejs 的 is 方法，参考 pure-render-decorator 写了一个 [immutable-pure-render-decorator](https://github.com/lcxfs1991/pure-render-deepCompare-decorator/blob/master/src/immutable-pure-render-decorator)。

那具体怎么使用 immutable + pure-render 呢？

对于 immutable，我们需要改写一下 reducer functions 里面的处理逻辑，一律换成 Immutable 的 api。

至于 pure-render，若是 es5 写法，可以用使 mixin；若是 es6/es7 写法，需要使用 decorator，在 js 的 babel loader 里面，新增 plugins: \[‘transform-decorators-legacy’]。其 es6 的写法是


<!-- {% endraw %} - for jekyll -->