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
let randomNum = Math.random();
var html = ReacDOMServer.renderToString(<Wrapper randomNum={randomNum} />);
```

### 5. 平台区分

当前后端共用一套代码的时候，像前端特有的 Window 对象，Ajax 请求 在后端是无法使用上的，后端需要去掉这些前端特有的对象逻辑或使用对应的后端方案，如后端可以使用 http.request 替代 Ajax 请求，所以需要进行平台区分，主要有以下几种方式

1. 代码使用前后端通用的模块，如 isomorphic-fetch  
2. 前后端通过 webpack 配置 resolve.alias 对应不同的文件，如  
客户端使用 /browser/request.js 来做 ajax 请求

```javascript
resolve: {
    alias: {
        'request': path.join(pathConfig.src, '/browser/request'),
    }
}
```

服务端 webpack 上使用 /server/request.js 以 http.request 替代 ajax 请求

```javascript
resolve: {
    alias: {
        'request': path.join(pathConfig.src, '/server/request'),
    }
}
```

3. 使用 webpack.DefinePlugin 在构建时添加一个平台区分的值，这种方式的在 webpack UglifyJsPlugin 编译后，非当前平台 (不可达代码) 的代码将会被去掉，不会增加文件大小。如  
在服务端的 webpack 加上下面配置

```javascript
new webpack.DefinePlugin({
    "__ISOMORPHIC__": true
}),
```

在 JS 逻辑上做判断

```c
if(__ISOMORPHIC__){
    // do server thing
} else {
    // do browser thing
}
```

4.window 是浏览器上特有的对象，所以也可以用来做平台区分

```javascript
var isNode = typeof window === "undefined";
if (isNode) {
    // do server thing
} else {
    // do browser thing
}
```

### 6. 只直出首屏页面可视内容，其他在客户端上延迟处理

这是为了减少服务端的负担，也是加快首屏展示时间，如在手 Q 家校群列表中存在 “我发布的” 和 “ 全部” 两个 tab，内容都为作业列表，此次实践在服务端上只处理首屏可视内容，即只输出 “ 我发布的” 的完整 HTML，另外一个 tab 的内容在客户端上通过 react 的 dom diff 机制来动态挂载，无页面刷新的感知。

[![default](https://cloud.githubusercontent.com/assets/10385585/15846264/ea6735d4-2cad-11e6-85af-416c9e803bbb.png)](https://cloud.githubusercontent.com/assets/10385585/15846264/ea6735d4-2cad-11e6-85af-416c9e803bbb.png)

### 7. componentWillReceiveProps 中，依赖数据变化的方法，需考虑在 componentDidMount 做兼容

举个例子，identity 默认为 UNKOWN，从后台拉取到数据后，更新其值，从而触发 setButton 方法

```javascript
componentWillReceiveProps(nextProps) {
    if (nextProps.role.get('identity') !== UNKOWN &&
        nextProps.role.get('identity')  !== this.props.role.get('identity'))) {
        this.setButton();
    }
}
```

同构时，由于服务端上已做了第一次数据拉取，所以上面代码在客户端上将由于 identity 已存在而导致永不执行 setButton 方法，解决方式可在 componentDidMount 做兼容处理

```javascript
componentDidMount() {
    // .. 判断是否为同构 
    if (identity !== UNKOWN) {
        this.setButton(identity);
    }
}  
```

### 8. redux 在服务端上的使用方式 (redux)

下图为其中一种形式，先进行数据请求，再将请求到的数据 dispatch 一个 action，通过在 reducer 将数据进行 redux 的 state 化。还有其他方式，如直接 dispatch 一个 action，在 action 里面去做数据请求，后续是一样的，不过这样就要求请求数据的模块是 isomorphism 即前后端通用的。  
[![default](https://cloud.githubusercontent.com/assets/10385585/15856812/996ecf24-2cea-11e6-87e2-401cf4cccbc4.png)](https://cloud.githubusercontent.com/assets/10385585/15856812/996ecf24-2cea-11e6-87e2-401cf4cccbc4.png)

### 9. 设计好 store state (redux)

设计好 store state 是使用 redux 的关键，而在服务端上，合理的扁平化 state 能在其被序列化时，减少 CPU 消耗

### 10. 两个 action 在同个 component 中数据存在依赖关系时，考虑 setState 的异步问题 (redux)

客户端上，由于 react 中 setState 的异步机制，所以在同个 component 中触发多个 action，会出现一种情况是：第一个 action 对 state 的改变还没来得及更新 component 时，第二个 action 便开始执行，即第二个 action 将使用到未更新的值。  
而在同构中，如果第一个 action（如下的 fetchData）是在服务端执行了，第二个 action 在客户端执行时将使用到的是第一个 action 对 state 改变后的值，即更新后的值。这时，同构需要做兼容处理。

    fetchData() {
        this.props.setCourse(lastCourseId, lastCourseName);
    }
    render() {
        this.props.updateTab(TAB);
    }

### 11. immutable 在同构上的姿势 (immutable/redux)

手 Q 家校群上使用了 immutable 来保证数据的不可变，提高数据对比速度，而在同构时需要注意两点  
1. 服务端上，从 store 中拿到的 state 为 immutable 对象，需转成 string 再同 HTML 返回  
2. 客户端上，从服务端注入到 HTML 上的 state 数据，需要将其转成 immutable 对象，再放到 configureStore 中，如

```javascript
var __serverData__ = Immutable.fromJS(window.__serverData__);
var store = configureStore(__serverData__);
```

### 12. 使用 webpack 去做 ES6 语法兼容 (webpack)

实际上，如果是一个单独的服务的话，可以使用 babel 提供的方式来让 node 环境兼容好 E6

```javascript
require("babel-register")({
    extensions: [".jsx"],
    presets: ["react"],
});
require("babel-polyfill");
```

但如果是以同一个直出服务器，多个项目的直出代码都放在这个服务上，那么，还是建议使用 webpack 的方式去兼容 ES6，减少 babel 对全局环境的影响。使用 webpack 的话，在项目完成后，可将 es6 代码编译成 es5 再放到真正的 server 上，这样也可以减少动态编译耗时。

### 13. 不使用 webpack 的 css in js 的方式

使用 webpack 时，默认是将 css 文件以 css in js 的方式打包起来，这种情况将增加服务端运行耗时，通过将 css 外链，或在 webpack 打包成独立的 css 文件后再 inline 进去，可以减少服务端的处理耗时及负荷。

### 14. UglifyJsPlugin 在服务端编译时慎用

上面提及使用 webpack 编译后的代码放到真正的 server 上去跑，在前端发布前一般会进行代码 uglify，而后端实际上没多大必要，在实际应用中发现，使用 UglifyJsPlugin 后运行服务端会报错，需慎用。

### 15. 纠正 \_\_dirname 与 \_\_filename 的值 (webpack)

当服务端代码需要使用到 \_\_dirname 时，需在 webpack.config.js 配置 target 为 node，并在 node 中声明\_\_filename 和\_\_dirname 为 true，否则拿不到准确值，如在服务端代码上添加 console.log (\_\_dirname); 和 console.log (\_\_filenam );   
在服务端使用的 webpack 上指定 target 为 node，如下

```javascript
target: 'node', 
node: {
    __filename: true,
    __dirname: true
}
```

经 webpack 编译后输出如下代码，可看出 \_\_dirname 和 \_\_filename 将正确输出  
[![node](https://cloud.githubusercontent.com/assets/10385585/15851481/89e43398-2ccf-11e6-98bf-c8da79c957b1.png)](https://cloud.githubusercontent.com/assets/10385585/15851481/89e43398-2ccf-11e6-98bf-c8da79c957b1.png)

而不在 webpack 上配置时，\_\_dirname 则为 / ，\_\_filename 则为文件名，这是不正确的  
[![target node](https://cloud.githubusercontent.com/assets/10385585/15851509/aa7d4fae-2ccf-11e6-8e10-f707ef6b84d0.png)](https://cloud.githubusercontent.com/assets/10385585/15851509/aa7d4fae-2ccf-11e6-8e10-f707ef6b84d0.png)

### 16. 将 webpack 编译后的文件暴露出来 (webpack)

使用 webpack 将一个模块编译后将形成一个立即执行函数，函数中返回对象。如果需要将编译后的代码也作为一个模块供其他地方使用时，那么需要重新将该模块暴露出去 ( 如当业务上的直出代码只是作为直出服务器的其中一个任务时，那么需要将编译后的代码作为一个模块 exports 出去，即在编译后代码前重新加上 **module.exports =**，从而直出服务将能够使用到这个编译后的模块代码 )。写了一个 webpack 插件来自动添加 module.exports，比较简单，有兴趣的欢迎使用 [webpack-add-module-expors](https://github.com/joeyguo/webpack-add-module-exports)，效果如下

编译前  
[![222222222](https://cloud.githubusercontent.com/assets/10385585/15857589/b968f026-2cee-11e6-9105-892a4d3f5fff.png)](https://cloud.githubusercontent.com/assets/10385585/15857589/b968f026-2cee-11e6-9105-892a4d3f5fff.png)

编译后  
[![exports](https://cloud.githubusercontent.com/assets/10385585/16036325/f328bac6-324d-11e6-8cea-70f96fe35112.png)](https://cloud.githubusercontent.com/assets/10385585/16036325/f328bac6-324d-11e6-8cea-70f96fe35112.png)

使用 [webpack-add-module-expors](https://github.com/joeyguo/webpack-add-module-exports) 编译后将带上 module.exports  
[![3331](https://cloud.githubusercontent.com/assets/10385585/15857814/e356beda-2cef-11e6-9b0a-0d4784599ede.png)](https://cloud.githubusercontent.com/assets/10385585/15857814/e356beda-2cef-11e6-9b0a-0d4784599ede.png)

### 17. 去掉 index.scss 和浏览器专用模块 (webpack)

当服务端上不想处理样式模块或一些浏览器才需要的模块 (如前端上报) 时，需要在服务端上将其忽略。尝试 webpack 自带的 webpack.IgnorePlugin 插件后出现一些奇奇怪怪的问题，重温  [如何开发一个 Webpack Loader (一)](https://github.com/joeyguo/blog/issues/4)  时想起 webpack 在执行时会将原文件经 webpack loaders 进行转换，如 jsx 转成 js 等。所以想法是将在服务端上需要忽略的模块，在 loader 前执行前就将其忽略。写了个 [ignored-loader](https://github.com/joeyguo/ignored-loader)，可以将需要忽略的模块在 loader 执行前直接返回空，所以后续就不再做其他处理，简单但也满足现有需求。

优化成果  

* * *

服务端上的耗时增加了，但整体上的首屏渲染完成时间大大减少

### 服务端上增加的耗时

服务端渲染方案将数据的拉取和模板的渲染从客户端移到了服务端，由于服务端的环境以及数据拉取存在优势 (详见 [Node 直出理论与实践总结](https://github.com/joeyguo/blog/issues/8))，所以在相比下，这块耗时大大减少，但确实存在，这两块耗时是服务端渲染相比于客户端渲染在服务端上多出来。所以本次也做了耗时的数据统计，如下图

[![default](https://cloud.githubusercontent.com/assets/10385585/15848674/f04152a6-2cc0-11e6-9e01-486d81e38858.png)](https://cloud.githubusercontent.com/assets/10385585/15848674/f04152a6-2cc0-11e6-9e01-486d81e38858.png)

从统计的数据上看，服务端上数据拉取的时间约 61.75 ms，服务端 render 耗时为 16.32 ms，这两块时间的和为 78 ms，这耗时还是比较大。所以此次在**同构耗时在计算上包含了服务端数据拉取与模板渲染的时间**

###  

### 首屏渲染完成时间对比

服务端渲染时由于不需要等待 JS 加载和 数据请求 (详见 [Node 直出理论与实践总结](https://github.com/joeyguo/blog/issues/8))，在首屏展示时间耗时上将大大减少，此次在手 Q 家校群列表页首屏渲染完成时间上，优化前平均耗时约 1643.914 ms，而同构优化后平均耗时为 696.62 ms，有了 **947ms 的优化**，提升约 **57.5%**  的性能，秒开搓搓有余！

[![default](https://cloud.githubusercontent.com/assets/10385585/16036246/98525f26-324d-11e6-8d52-4b48e80a2b6c.png)](https://cloud.githubusercontent.com/assets/10385585/16036246/98525f26-324d-11e6-8d52-4b48e80a2b6c.png)

[![default](https://cloud.githubusercontent.com/assets/10385585/16036236/8e5c8ae6-324d-11e6-94f4-bc60517e460a.png)](https://cloud.githubusercontent.com/assets/10385585/16036236/8e5c8ae6-324d-11e6-94f4-bc60517e460a.png)

### 优化前与优化后的页面展示情况对比

1. 优化前  
[![predata](https://cloud.githubusercontent.com/assets/10385585/15852386/43ea10e8-2cd3-11e6-9864-863b2a5f55db.png)](https://cloud.githubusercontent.com/assets/10385585/15852386/43ea10e8-2cd3-11e6-9864-863b2a5f55db.png)

2. 优化后（同构直出）  
[![iso](https://cloud.githubusercontent.com/assets/10385585/15852400/56f713c0-2cd3-11e6-81fa-07521fa7f52b.png)](https://cloud.githubusercontent.com/assets/10385585/15852400/56f713c0-2cd3-11e6-81fa-07521fa7f52b.png)

可明显看出同构直出后，白屏时间大大减少，可交互时间也得到了提前，产品体验将变得更好。

总结  

=====

服务端渲染的方式能够很好的减少首屏展示时间，React 同构的方式让前后端模板、类库、以及数据模型上共用，大大减少的服务端渲染的工作量。  
由于在服务端上渲染模板，render 时过多的调用栈增加了服务端负载，也增加了 CPU 的压力，所以可以只直出首屏可视区域，减少 Component 层级，减少调用栈，最后，做好容灾方案，如真的服务端挂了 (虽然情况比较少)，可以直接切换到普通的客户端渲染方案，保证用户体验。

以上，便是近期在 React 同构上的实践总结，如有不妥，恳请斧正，谢谢。


<!-- {% endraw %} - for jekyll -->