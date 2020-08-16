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

```javascript
import { fromJS } from "immutable";
const state = fromJS({ bar: "biz" });
const newState = foo.set("bar", "baz");
```

Immutable.js 非常快，其背后的思想也非常美妙。就算没准备使用它，还是推荐你去看看 [Lee Byron](https://twitter.com/leeb) 的视频 [Immutable Data and React](https://www.youtube.com/watch?v=I7IdS-PbEgI)，可以了解到它内部的实现原理。

### Observables and reactive 解决方案

如果你不喜欢 Flux/Redux，或者想要更加 reactive，不用失望！还有很多方案供你选择，这里是你可能需要的：

-   [cycle.js](http://cycle.js.org/)（“一个更清爽的 reactive 框架”）
-   [rx-flux](https://github.com/fdecampredon/rx-flux)（“Flux 与 Rxjs 结合的产物”）
-   [redux-rx](https://github.com/acdlite/redux-rx)（“Redux 的 Rxjs 工具库”）
-   [mobservable](https://mweststrate.github.io/mobservable/)（“可观测的数据，reactive 的功能，简洁的代码”）

路由  

=====

现在几乎所有 app 都有路由功能。如果你在浏览器中使用 React.js，你将会接触到这个点，并为其选择一个库。

我们选择的是出自优秀 [rackt](https://github.com/rackt) 社区的 [react-router](https://github.com/rackt/react-router)，这个社区总是能为 React.js 爱好者们带来高质量的资源。

要使用 [react-router](https://github.com/rackt/react-router) 需要查看它的[文档](https://github.com/rackt/react-router/tree/master/docs)，但更重要的是：如果你使用 Flux/Redux，我们推荐你将**路由 state** 与 store 或全局 state **保持同步**。

同步路由 state 可以让 Flux/Redux 来控制路由行为，并让组件读取到路由信息。

Redux 的用户可以使用 [redux-simple-router](https://github.com/rackt/redux-simple-router) 来省点事儿。

代码分割，懒加载  

* * *

只有一小部分 webpack 的用户知道，应用代码是可以分割成多个 js 包的。

```javascript
require.ensure([], () => {
    const Profile = require("./Profile.js");
    this.setState({
        currentComponent: Profile,
    });
});
```

这对于大型应用十分有用，因为用户浏览器**不用下载那些很少会使用到的代码**，比如 Profile 页。

多 js 包会导致额外的 HTTP 请求数，但对于 [HTTP/2 的多路复用](https://http2.github.io/faq/#why-is-http2-multiplexed)，完全不是问题。

与 [chunk hashing](https://christianalfoni.github.io/react-webpack-cookbook/Optimizing-caching.html)  结合可以优化缓存命中率。

下个版本的 react-router 将会对代码分隔做更多支持。

对于 react-router 的未来规划，可以去看博文 [Ryan Florence](https://twitter.com/ryanflorence): [Welcome to Future of Web Application Delivery](https://medium.com/@ryanflorence/welcome-to-future-of-web-application-delivery-9750b7564d9f#.vuf3e1nqi)。

组件  

=====

很多人都在抱怨 JSX，但首先要知道，它只是 React 中可选的一项能力。

最后，它们都会被 Babel 编译成 JavaScript。你可以继续使用 JavaScript 编写代码，但是在处理 HTML 时使用 JSX 会感觉更自然。特别是对于那些不懂 js 的人，他们可以只修改 HTML 相关的部分。

> JSX 是一个类似于 XML 的 JavaScript 扩展，可以配合一个简单的语法编译工具来使用它。—— [深入浅出 JSX](https://facebook.github.io/react/docs/jsx-in-depth.html)

如果你想了解更多 JSX 的内容，查看文章 [JSX Looks Like An Abomination - But it’s Good for You](https://medium.com/javascript-scene/jsx-looks-like-an-abomination-1c1ec351a918#.ca28nvee6)。

使用类  

* * *

React 中可以顺畅地使用 ES2015 的 Class 语法。

```javascript
class HelloMessage extends React.Component {
    render() {
        return <div>Hello {this.props.name}</div>;
    }
}
```

我们在高阶组件和 mixins 之间更看重前者，所以抛弃 createClass 更像是一个语法问题，而不是技术问题。（译者注：在 Class 语法中，React 组件的 mixins 方法将无法使用。）我们认为使用 createClass 和 React.Component 没有对错之分。

属性类型（PropType）  

* * *

如果你以前不检查 props 的类型，那么 2016 你应该开始改正了。它会帮你节省未来很多时间，相信我。

    MyComponent.propTypes = {  
      isLoading: PropTypes.bool.isRequired,
      items: ImmutablePropTypes.listOf(
        ImmutablePropTypes.contains({
          name: PropTypes.string.isRequired,
        })
      ).isRequired
    }

是的，同时也尽可能使用 [react-immutable-proptypes](https://www.npmjs.com/package/react-immutable-proptypes) 检查 Immutable.js 的 props。

高阶组件（Higher order components）  

* * *

[mixins 将死](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)，ES6 的 Class 将不对其进行支持，我们需要寻找新的方法。

**什么是高阶组件？**

    PassData({ foo: 'bar' })(MyComponent)  

简单地，你创建一个从原生组件继承下来的组件，并且扩展了原始组件的行为。你可以在多种场景来使用它，比如鉴权：requireAuth ({role: 'admin'})(MyComponent)（在高阶组件中检查用户权限，如果还没有登录就进行跳转），或者将组件与 Flux/Redux 的 store 相连通。

在 RisingStack，我们也喜欢分离数据拉取和 controller 类的逻辑到高阶组件中，这样可以尽可能地保持 view 层的简单。

测试  

=====

好的代码覆盖测试是开发周期中的重要一环。幸运的是，React.js 社区有很多这样的库来帮助我们。

组件测试  

* * *

我们最喜爱的组件测试库是 AirBnb 的 [enzyme](https://github.com/airbnb/enzyme)。有了它的浅渲染特性，可以对组件的逻辑和渲染结果进行测试，非常棒对不对？它现在还不能替代 selenium 测试，但是将前端测试提升到了一个新高度。

```javascript
it("simulates click events", () => {
    const onButtonClick = sinon.spy();
    const wrapper = shallow(<Foo onButtonClick={onButtonClick} />);
    wrapper.find("button").simulate("click");
    expect(onButtonClick.calledOnce).to.be.true;
});
```

看起来很清爽，不是吗？

你使用 chai 来作为断言库吗？你会喜欢 [chai-enyzime](https://github.com/producthunt/chai-enzyme) 的。

Redux 测试  

* * *

**测试一个 reducer** 非常简单，它响应 actions 然后将原来的 state 转为新的 state：

```javascript
it("should set token", () => {
    const nextState = reducer(undefined, {
        type: USER_SET_TOKEN,
        token: "my-token",
    }); // immutable.js state output
    expect(nextState.toJS()).to.be.eql({
        token: "my-token",
    });
});
```

**测试 actions** 也很简单，但是异步 actions 就不一样了。测试异步的 redux actions 我们推荐 [redux-mock-store](https://www.npmjs.com/package/redux-mock-store)，它能帮不少忙。

```javascript
it("should dispatch action", (done) => {
    const getState = {};
    const action = { type: "ADD_TODO" };
    const expectedActions = [action];
    const store = mockStore(getState, expectedActions, done);
    store.dispatch(action);
});
```

关于更深入的 [redux 测试](http://rackt.org/redux/docs/recipes/WritingTests.html)，请参考官方文档。

使用 npm  

* * *

虽然 React.js 并不依赖代码构建工具，我们推荐 [Webpack](https://webpack.github.io/) 和 [Browserify](http://browserify.org/)，它们都具有 npm 出色的能力。Npm 有很多 React.js 的 package，还可以帮助你优雅地管理依赖。

（请不要忘记复用你自己的组件，这是优化代码的绝佳方式。）

包大小（Bundle size）  

* * *

这本身不是一个 React 相关的问题，但多数人都会对其 React 进行打包，所以我在这里提一下。

当你对源代码进行构建时，要保持对包大小的关注。要将其**控制在最小体积**，你需要思考如何 require/import 依赖。

查看下面的代码片段，有两种方式可以对输出产生重大影响：

    import { concat, sortBy, map, sample } from 'lodash'
     
    // vs.
    import concat from 'lodash/concat';  
    import sortBy from 'lodash/sortBy';  
    import map from 'lodash/map';  
    import sample from 'lodash/sample';  

查看 [Reduce Your bundle.js File Size By Doing This One Thing](https://lacke.mn/reduce-your-bundle-js-file-size/)，获取更多详情。

我们喜欢将代码分隔到 vendors.js 和 app.js，因为第三方代码的更新频率比我们自己带吗低很多。

对输出文件进行 hash 命名（_WebPack 中的 chunk hash_），并使用长缓存，我们可以显著地减少访问用户需要下载的代码。结合代码懒加载，优化效果可想而知。

如果你对 _WebPack 还很陌生，可以去看超赞的 [React webpack 指南](https://christianalfoni.github.io/react-webpack-cookbook)。_

组件级的 hot reload  

* * *

如果你曾使用 livereload 写过单页面应用，你可能知道当在处理一些与状态相关的事情，一点代码保存整个页面就刷新了，这种体验有多烦人。你需要逐步点击操作到刚才的环节，然后在这样的重复中奔溃。

在 React 开发中，是可以 reload 一个组件，同时保持它的 state 不变 —— 耶，从此无需苦恼！

搭建 hot reload，可参考 [react-transform-boilerplate](https://github.com/gaearon/react-transform-boilerplate)。

使用 ES2015  

* * *

前面提到过，在 React.js 中使用的 JSX，最终会被 [Babel.js](https://babeljs.io/) 进行编译。

![Babel logo in React.js Best Practices 2016](https://risingstack-blog.s3.amazonaws.com/2016/Jan/babel_logo_in_react_js_best_practices_2016-1453212218011.png)

Babel 的能力还不止这些，它可以让我们在浏览器中放心地使用 ES6/ES2015。在 RisingStack，我们在服务器端和客户端都使用了 ES2015 的特性，ES2015 已经可以在最新的 LTS Node.js 版本中使用了。

代码检查（Linters）  

* * *

也许你已经对你的代码制定了代码规范，但是你知道 React 的各种代码规范吗？我们建议你选择一个代码规范，然后照着下面说的来做。

在 RisingStack，我们强制将 linters 运行在持续集成（CI）系统，已经 git push 功能上。查看 [pre-push](https://www.npmjs.com/package/pre-push) 和 [pre-commit](https://www.npmjs.com/package/pre-commit)。

我们使用标准的 JavaScript 代码风格，并使用 [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react) 来检查 React.js 代码。

（是的，我们已经不再使用分号了）

GraphQL 和 Relay  

* * *

GraphQL 和 Relay 是相关的新技术。在 RisingStack，我们不在生产环境使用它们，暂时保持关注。

我们写了一个 Relay 的 MongoDB ORM，叫做 [graffiti](https://github.com/risingstack/graffiti)，可以使用你已有的 mongoose models 来创建 GraphQL server。

如果你想学习这些新技术，我们建议你去看看这个库，然后写几个 demo 玩玩。

这些 React.js 最佳实践的核心点  

=======================

有些优秀的技术和库其实跟 React 都没什么关系，关键在于要关注社区都在做些什么。2015 这一年，React 社区被 [Elm 架构](https://github.com/evancz/elm-architecture-tutorial/)启发了很多。

如果你知道其他 2016 年大家应该使用的 React.js 工具，请留言告诉我们。

<!-- {% endraw %} - for jekyll -->