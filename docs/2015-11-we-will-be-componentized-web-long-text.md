---
title: 致我们终将组件化的 Web
date: 2015-11-24
author: TAT.bizai
source_link: http://www.alloyteam.com/2015/11/we-will-be-componentized-web-long-text/
---

<!-- {% raw %} - for jekyll -->

这篇文章将从两年前的一次技术争论开始。争论的聚焦就是下图的两个目录分层结构。我说按模块划分好，他说你傻逼啊，当然是按资源划分。

[![mulu_left](http://www.alloyteam.com/wp-content/uploads/2015/11/mulu_left.png)](http://www.alloyteam.com/wp-content/uploads/2015/11/mulu_left.png) 《=》[![mulu_right](http://www.alloyteam.com/wp-content/uploads/2015/11/mulu_right.png)](http://www.alloyteam.com/wp-content/uploads/2015/11/mulu_right.png)

” 按模块划分 “目录结构，把当前模块下的所有逻辑和资源都放一起了，这对于多人独自开发和维护个人模块不是很好吗？当然了，那争论的结果是我乖乖地改回主流的” 按资源划分 “ 的目录结构。因为，没有做到 JS 模块化和资源模块化，仅仅物理位置上的模块划分是没有意义的，只会增加构建的成本而已。

虽然他说得好有道理我无言以对，但是我心不甘，等待他日前端组件化成熟了，再来一战！

而今天就是我重申正义的日子！只是当年那个跟你撕逼的人不在。

**##   模块化的不足**

     模块一般指能够独立拆分且通用的代码单元。由于 JavaScript 语言本身没有内置的模块机制（ES6 有了！！），我们一般会使用 CMD 或 ADM 建立起模块机制。现在大部分稍微大型一点的项目，都会使用 requirejs 或者 seajs 来实现 JS 的模块化。多人分工合作开发，其各自定义依赖和暴露接口，维护功能模块间独立性，对于项目的开发效率和项目后期扩展和维护，都是是有很大的帮助作用。

     但，麻烦大家稍微略读一下下面的代码

```javascript
require([
    "Tmpl!../tmpl/list.html",
    "lib/qqapi",
    "module/position",
    "module/refresh",
    "module/page",
    "module/net",
], function (listTmpl, QQapi, Position, Refresh, Page, NET) {
    var foo = "",
        bar = [];
    QQapi.report();
    Position.getLocaiton(function (data) {
        //...
    });
    var init = function () {
        bind();
        NET.get("/cgi-bin/xxx/xxx", function (data) {
            renderA(data.banner);
            renderB(data.list);
        });
    };
    var processData = function () {};
    var bind = function () {};
    var renderA = function () {};
    var renderB = function (data) {
        listTmpl.render("#listContent", processData(data));
    };
    var refresh = function () {
        Page.refresh();
    }; // app start
    init();
});
```

上面是具体某个页面的主 js，已经封装了像 Position，NET，Refresh 等功能模块，但页面的主逻辑依旧是” 面向过程 “的代码结构。所谓面向过程，是指根据页面的渲染过程来编写代码结构。像：init -> getData -> processData -> bindevent -> report -> xxx 。 方法之间线性跳转，你大概也能感受这样代码弊端。随着页面逻辑越来越复杂，这条” 过程线 “ 也会越来越长，并且越来越绕。加之缺少规范约束，其他项目成员根据各自需要，在” 过程线 “ 加插各自逻辑，最终这个页面的逻辑变得难以维护。

[![go_die](http://www.alloyteam.com/wp-content/uploads/2015/11/go_die.png)](http://www.alloyteam.com/wp-content/uploads/2015/11/go_die.png)

开发需要小心翼翼，生怕影响 “过程线” 后面正常逻辑。并且每一次加插或修改都是 bug 泛滥，无不令产品相关人员个个提心吊胆。

**## 页面结构模块化**

基于上面的面向过程的问题，行业内也有不少解决方案，而我们团队也总结出一套成熟的解决方案：[Abstractjs](http://www.dorsywang.com/Abstract.js/#doc)，页面结构模块化。我们可以把我们的页面想象为一个乐高机器人，需要不同零件组装，如下图，假设页面划分为 tabContainer，listContainer 和 imgsContainer 三个模块。最终把这些模块 add 到最终的 pageModel 里面，最终使用 rock 方法让页面启动起来。

[![process_code](http://www.alloyteam.com/wp-content/uploads/2015/11/process_code.png)](http://www.alloyteam.com/wp-content/uploads/2015/11/process_code.png)  
（原过程线示例图）

[![mode_code](http://www.alloyteam.com/wp-content/uploads/2015/11/mode_code.png)](http://www.alloyteam.com/wp-content/uploads/2015/11/mode_code.png)  
（页面结构化示例图）

下面是伪代码的实现

```javascript
require([
    "Tmpl!../tmpl/list.html",
    "Tmpl!../tmpl/imgs.html",
    "lib/qqapi",
    "module/refresh",
    "module/page",
], function (listTmpl, imgsTmpl, QQapi, Refresh, Page) {
    var tabContainer = new RenderModel({
        renderContainer: "#tabWrap",
        data: {},
        renderTmpl: "<li soda-repeat='item in data.tabs'>{{item}}</li>",
        event: function () {
            // tab's event
        },
    });
    var listContainer = new ScrollModel({
        scrollEl: $.os.ios ? $("#Page") : window,
        renderContainer: "#listWrap",
        renderTmpl: listTmpl,
        cgiName: "/cgi-bin/index-list?num=1",
        processData: function (data) {
            //...
        },
        event: function () {
            // listElement's event
        },
        error: function (data) {
            Page.show("数据返回异常[" + data.retcode + "]");
        },
    });
    var imgsContainer = new renderModel({
        renderContainer: "#imgsWrap",
        renderTmpl: listTmpl,
        cgiName: "/cgi-bin/getPics",
        processData: function (data) {
            //...
        },
        event: function () {
            // imgsElement's event
        },
        complete: function (data) {
            QQapi.report();
        },
    });
    var page = new PageModel();
    page.add([tabContainer, listContainer, imgsContainer]);
    page.rock();
});
```

我们把这些常用的请求 CGI，处理数据，事件绑定，上报，容错处理等一系列逻辑方法，以页面块为单位封装成一个 Model 模块。

这样的一个抽象层 Model，我们可以清晰地看到该页面块，请求的 CGI 是什么，绑定了什么事件，做了什么上报，出错怎么处理。新增的代码就应该放置在相应的模块上相应的状态方法（preload，process，event，complete...），杜绝了以往的无规则乱增代码的行文。并且，根据不同业务逻辑封装不同类型的 Model，如列表滚动的 ScrollModel，滑块功能的 SliderModel 等等，可以进行高度封装，集中优化。

现在基于 Model 的页面结构开发，已经带有一点” 组件化 “的味道。每个 Model 都带有各自的数据，模板，逻辑。已经算是一个完整的功能单元。但距离真正的 WebComponent 还是有一段距离，至少满足不了我的” 理想目录结构 “。

**## WebComponents 标准**

我们回顾一下使用一个 datapicker 的 jquery 的插件，所需要的步奏：

1. 引入插件 js

2. 引入插件所需的 css（如果有）

3. copy 组件的所需的 html 片段

4. 添加代码触发组件启动

现阶段的 “组件” 基本上只能达到是某个功能单元上的集合。他的资源都是松散地分散在三种资源文件中，而且组件作用域暴露在全局作用域下，缺乏内聚性很容易就会跟其他组件产生冲突，如最简单的 css 命名冲突。对于这种 “ 组件”，还不如上面的页面结构模块化。

于是 W3C 按耐不住了，制定一个 [WebComponents 标准](http://w3c.github.io/webcomponents/explainer/)，为组件化的未来指引了明路。

下面以较为简洁的方式介绍这份标准，力求大家能够快速了解实现组件化的内容。（对这部分了解的同学，可以跳过这一小节）

**1. <template> 模板能力**

模板这东西大家最熟悉不过了，前些年见的较多的模板性能大战 artTemplate，juicer，tmpl，underscoretemplate 等等。而现在又有 [mustachejs](https://github.com/janl/mustache.js/) 无逻辑模板引擎等新入选手。可是大家有没有想过，这么基础的能力，原生 HTML5 是不支持的（T_T）。

而今天 WebComponent 将要提供原生的模板能力

```html
<template id="datapcikerTmpl">
    <div>我是原生的模板</div>
</template>;
```

template 标签内定义了 datapcikerTmpl 的模板，需要使用的时候就要 `innerHTML= document.querySelector('#datapcikerTmpl').content`；可以看出这个原生的模板够原始，模板占位符等功能都没有，对于动态数据渲染模板只能自力更新。

**2. ShadowDom 封装组件独立的内部结构**

ShadowDom 可以理解为一份有独立作用域的 html 片段。这些 html 片段的 CSS 环境和主文档隔离的，各自保持内部的独立性。也正是 ShadowDom 的独立特性，使得组件化成为了可能。

```javascript
var wrap = document.querySelector("#wrap");
var shadow = wrap.createShadowRoot();
shadow.innerHTML = "<p>you can not see me </p>";
```

在具体 dom 节点上使用 createShadowRoot 方法即可生成其 ShadowDom。就像在整份 Html 的屋子里面，新建了一个 shadow 的房间。房间外的人都不知道房间内有什么，保持 shadowDom 的独立性。

**3. 自定义原生标签**

初次接触 [Angularjs](https://angularjs.org/) 的 directive 指令功能，设定好组件的逻辑后，一个<Datepicker /> 就能引入整个组件。如此狂炫酷炸碉堡天的功能，实在令人拍手称快，跃地三尺。

```javascript
var tmpl = document.querySelector("#datapickerTmpl");
var datapickerProto = Object.create(HTMLElement.prototype);
// 设置把我们模板内容我们的shadowDom
datapickerProto.createdCallback = function () {
    var root = this.createShadowRoot();
    root.appendChild(document.importNode(tmpl.content, true));
};
var datapicker = docuemnt.registerElement("datapicker", {
    prototype: datapickerProto,
});
```

Object.create 方式继承 HTMLElement.prototype，得到一个新的 prototype。当解析器发现我们在文档中标记它将检查是否一个名为 createdCallback 的方法。如果找到这个方法它将立即运行它，所以我们把克隆模板的内容来创建的 ShadowDom。

最后，registerElement 的方法传递我们的 prototype 来注册自定义标签。

上面的代码开始略显复杂了，把前面两个能力 “模板”“shadowDom” 结合，形成组件的内部逻辑。最后通过 registerElement 的方式注册组件。之后可以愉快地<datapicker></datapicker> 的使用。

**4. imports 解决组件间的依赖**

```html
<link rel="import" href="datapciker.html">
```

这个类 php 最常用的 html 导入功能，HTML 原生也能支持了。

WebComponents 标准内容大概到这里，是的，我这里没有什么 Demo，也没有实践经验分享。由于 webComponents 新特性，基本上除了高版本的 Chrome 支持外，其他浏览器的支持度甚少。虽然有 polymer 帮忙推动 webcompoents 的库存在，但是 polymer 自身的要求版本也是非常高（IE10+）。所以今天的主角并不是他。

我们简单来回顾一下 WebCompoents 的四部分功能：

1 .<template> 定义组件的 HTML 模板能力

2. Shadow Dom 封装组件的内部结构，并且保持其独立性

3. Custom Element 对外提供组件的标签，实现自定义标签

4. import 解决组件结合和依赖加载

**## 组件化实践方案**

官方的标准看完了，我们思考一下。一份真正成熟可靠的组件化方案，需要具备的能力。

“资源高内聚”—— 组件资源内部高内聚，组件资源由自身加载控制

“作用域独立”—— 内部结构密封，不与全局或其他组件产生影响 

“自定义标签”—— 定义组件的使用方式

“可相互组合”—— 组件正在强大的地方，组件间组装整合

“接口规范化”—— 组件接口有统一规范，或者是生命周期的管理

个人认为，模板能力是基础能力，跟是否组件化没有强联系，所以没有提出一个大点。

既然是实践，现阶段 WebComponent 的支持度还不成熟，不能作为方案的手段。而另外一套以高性能虚拟 Dom 为切入点的组件框架 React，在 facebook 的造势下，社区得到了大力发展。另外一名主角 Webpack，负责解决组件资源内聚，同时跟 React 极度切合形成互补。

所以**[【Webpack】](http://webpack.github.io/)+[【React】](https://facebook.github.io/react/)**将会是这套方案的核心技术。

不知道你现在是 “又是 react+webpack” 感到失望[![f1086af848f17c8c033f4847c16c339c](http://www.alloyteam.com/wp-content/uploads/2015/11/f1086af848f17c8c033f4847c16c339c.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/11/f1086af848f17c8c033f4847c16c339c.jpg)，还是 “太好了是 react+webpack” 不用再学一次新框架的高兴[![dd57e48b489e172cb8bd1a7eb08311c1](http://www.alloyteam.com/wp-content/uploads/2015/11/dd57e48b489e172cb8bd1a7eb08311c1.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/11/dd57e48b489e172cb8bd1a7eb08311c1.jpg)。无论如何下面的内容不会让你失望的。

**### 一，组件生命周期**

[![comp](http://www.alloyteam.com/wp-content/uploads/2015/11/comp.png)](http://www.alloyteam.com/wp-content/uploads/2015/11/comp.png)

React 天生就是强制性组件化的，所以可以从根本性上解决面向过程代码所带来的麻烦。React 组件自身有生命周期方法，能够满足 “接口规范化” 能力点。并且跟 “ 页面结构模块化” 的所封装抽离的几个方法能一一对应。另外 react 的 jsx 自带模板功能，把 html 页面片直接写在 render 方法内，组件内聚性更加紧密。

由于 React 编写的 JSX 是会先生成虚拟 Dom 的，需要时机才真正插入到 Dom 树。使用 React 必须要清楚组件的生命周期，其生命周期三个状态：

`Mount`： 插入 Dom

`Update`： 更新 Dom

`Unmount`： 拔出 Dom

mount 这单词翻译增加，嵌入等。我倒是建议 “插入” 更好理解。插入！拔出！插入！拔出！默念三次，懂了没？别少看黄段子的力量，

[![smile](http://www.alloyteam.com/wp-content/uploads/2015/11/smile1.gif)](http://www.alloyteam.com/wp-content/uploads/2015/11/smile1.gif)

组件状态就是： 插入 -> 更新 -> 拔出。 

然后每个组件状态会有两种处理函数，一前一后，will 函数和 did 函数。

`componentWillMount()`   准备插入前

`componentDidlMount()`   插入后

`componentWillUpdate()` 准备更新前

`componentDidUpdate()`   更新后

`componentWillUnmount()` 准备拔出前

因为拔出后基本都是贤者形态（我说的是组件），所以没有 DidUnmount 这个方法。

另外 React 另外一个核心：数据模型 props 和 state，对应着也有自个状态方法

`getInitialState()`     获取初始化 state。

`getDefaultProps()` 获取默认 props。对于那些没有父组件传递的 props，通过该方法设置默认的 props

`componentWillReceiveProps()`   已插入的组件收到新的 props 时调用

还有一个特殊状态的处理函数，用于优化处理

`shouldComponentUpdate()`：判断组件是否需要 update 调用

加上最重要的 render 方法，React 自身带的方法刚刚好 10 个。对于初学者来说是比较难以消化。但其实 `getInitialState`，`componentDidMount`，`render` 三个状态方法都能完成大部分组件，不必望而却步。

回到组件化的主题。

一个页面结构模块化的组件，能独立封装整个组件的过程线

[![func_line](http://www.alloyteam.com/wp-content/uploads/2015/11/func_line.png)](http://www.alloyteam.com/wp-content/uploads/2015/11/func_line.png)

我们换算成 React 生命周期方法：

[![line_comp](http://www.alloyteam.com/wp-content/uploads/2015/11/line_comp.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/11/line_comp.jpg)

组件的状态方法流中，有两点需要特殊说明：

**1，二次渲染：**

由于 React 的虚拟 Dom 特性，组件的 render 函数不需自己触发，根据 props 和 state 的改变自个通过差异算法，得出最优的渲染。

请求 CGI 一般都是异步，所以必定带来二次渲染。只是空数据渲染的时候，有可能会被 React 优化掉。当数据回来，通过 setState，触发二次 render

**2，componentWiillMount 与 componentDidMount 的差别**

和大多数 React 的教程文章不一样，ajax 请求我建议在 WillMount 的方法内执行，而不是组件初始化成功之后的 DidMount。这样能在 “空数据渲染” 阶段之前请求数据，尽早地减少二次渲染的时间。

`willMount` 只会执行一次，非常适合做 init 的事情。

`didMount` 也只会执行一次，并且这时候真实的 Dom 已经形成，非常适合事件绑定和 complete 类的逻辑。

**### 二，JSX 很丑，但是组件内聚的关键！**

WebComponents 的标准之一，需要模板能力。本是以为是我们熟悉的模板能力，但 React 中的 JSX 这样的怪胎还是令人议论纷纷。React 还没有火起来的时候，大家就已经在微博上狠狠地吐槽了 “JSX 写的代码这 TM 的丑”。这其实只是 Demo 阶段 JSX，等到实战的大型项目中的 JSX，包含多状态多数据多事件的时候，你会发现.............JSX 写的代码还是很丑。

[![jsx_bad](http://www.alloyteam.com/wp-content/uploads/2015/11/jsx_bad.png)](http://www.alloyteam.com/wp-content/uploads/2015/11/jsx_bad.png)  
（即使用 sublime-babel 等插件高亮，逻辑和渲染耦合一起，阅读性还是略差）

为什么我们会觉得丑？因为我们早已经对 “视图 - 样式 - 逻辑” 分离的做法潜移默化。

基于维护性和可读性，甚至性能，我们都不建议直接在 Dom 上面绑定事件或者直接写 style 属性。我们会在 JS 写事件代理，在 CSS 上写上 classname，html 上的就是清晰的 Dom 结构。我们很好地维护着 MVC 的设计模式，一切安好。直到 JSX 把他们都糅合在一起，所守护的技术栈受到侵略，难免有所抵制。

但是从组件化的目的来看，这种高内聚的做法未尝不可。

下面的代码，之前的 “逻辑视图分离” 模式，我们需要去找相应的 js 文件，相应的 event 函数体内，找到 td-info 的 class 所绑定的事件。

对比起 JSX 的高度内聚，所有事件逻辑就是在本身 jsx 文件内，绑定的就是自身的 showInfo 方法。组件化的特性能立马体现出来。

```javascript
<p className="td-info" onClick={this.showInfo}>
    {obj.info}
</p>;
```

（注意：虽然写法上我们好像是 HTML 的内联事件处理器，但是在 React 底层并没有实际赋值类似 onClick 属性，内层还是使用类似事件代理的方式，高效地维护着事件处理器）

再来看一段 style 的 jsx。其实 jsx 没有对样式有硬性规定，我们完全可遵循之前的定义 class 的逻辑。任何一段样式都应该用 class 来定义。在 jsx 你也完全可以这样做。但是出于组件的独立性，我建议一些只有 “一次性” 的样式直接使用 style 赋值更好。减少冗余的 class。

```javascript
<div className="list" style={{ background: "#ddd" }}>
       {list_html}
</div>;
```

或许 JSX 内部有负责繁琐的逻辑样式，可 JSX 的自定义标签能力，组件的黑盒性立马能体验出来，是不是瞬间美好了很多。

```c
render: function(){
    return (
      <div>
         <Menus bannerNums={this.state.list.length}></Menus>
         <TableList data={this.state.list}></TableList>
      </div>
   );
}
```

虽然 JSX 本质上是为了虚拟 Dom 而准备的，但这种逻辑和视图高度合一对于组件化未尝不是一件好事。

学习完 React 这个组件化框架后，看看组件化能力点的完成情况

“资源高内聚”——（33%） html 与 js 内聚

“作用域独立”——（50%） js 的作用域独立

“自定义标签”——（100%）jsx

“可相互组合”——（50%）  可组合，但缺乏有效的加载方式

“接口规范化”——（100%）组件生命周期方法

**### Webpack 资源组件化**

对于组件化的资源独立性，一般的模块加载工具和构建流程视乎变得吃力。组件化的构建工程化，不再是之前我们常见的，css 合二，js 合三，而是体验在组件间的依赖于加载关系。webpack 正好符合需求点，一方面填补组件化能力点，另一方帮助我们完善组件化的整体构建环境。

首先要申明一点是，webpack 是一个模块加载打包工具，用于管理你的模块资源依赖打包问题。这跟我们熟悉的 requirejs 模块加载工具，和 grunt/gulp 构建工具的概念，多多少少有些出入又有些雷同。

[![webpack](http://www.alloyteam.com/wp-content/uploads/2015/11/webpack.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/11/webpack.jpg)

首先 webpak 对于 CommonJS 与 AMD 同时支持，满足我们模块 / 组件的加载方式。

```javascript
require("module");
require("../file.js");
exports.doStuff = function () {};
module.exports = someValue;
```

```javascript
define("mymodule", ["dep1", "dep2"], function (d1, d2) {
    return someExportedValue;
});
```

当然最强大的，最突出的，当然是模块打包功能。这正是这一功能，补充了组件化资源依赖，以及整体工程化的能力

根据 webpack 的设计理念，所有资源都是 “模块”，webpack 内部实现了一套资源加载机制，可以把想 css，图片等资源等有依赖关系的 “ 模块” 加载。这跟我们使用 requirejs 这种仅仅处理 js 大大不同。而这套加载机制，通过一个个 loader 来实现。

```javascript
// webpack.config.js
module.exports = {
    entry: {
    	entry: './index.jsx',
    },
    output: {
        path: __dirname,
        filename: '[name].min.js'
    }，
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style!css' },
            {test: /\.(jsx|js)?$/, loader: 'jsx?harmony', exclude: /node_modules/},
            {test: /\.(png|jpg|jpeg)$/, loader: 'url-loader?limit=10240'}
        ]
    }
};
```

上面一份简单的 webpack 配置文件，留意 loaders 的配置，数组内一个 object 配置为一种模块资源的加载机制。test 的正则为匹配文件规则，loader 的为匹配到文件将由什么加载器处理，多个处理器之间用`！`分隔，处理顺序从右到左。

如 `style!css`，css 文件通过 css-loader（处理 css）, 再到 style-loader（inline 到 html）的加工处理流。

jsx 文件通过 jsx-loader 编译，‘？’ 开启加载参数，harmony 支持 ES6 的语法。

图片资源通过 url-loader 加载器，配置参数 limit，控制少于 10KB 的图片将会 base64 化。

**#### 资源文件如何被 require？**

```javascript
// 加载组件自身css
require("./slider.css");
// 加载组件依赖的模块
var Clip = require("./clipitem.js");
// 加载图片资源
var spinnerImg = require("./loading.png");
```

在 webpack 的 js 文件中我们除了 require 我们正常的 js 文件，css 和 png 等静态文件也可以被 require 进来。我们通过 webpack 命令，编译之后，看看输出结果如何：

```javascript
webpackJsonp([0], {
/* 0 */
/***/ function(module, exports, __webpack_require__) {
          // 加载组件自身css
          __webpack_require__(1);
          // 加载组件依赖的模块
          var Clip = __webpack_require__(5);
          // 加载图片资源
          var spinnerImg = __webpack_require__(6);
/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {
 
/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {
          exports = module.exports = __webpack_require__(3)();
          exports.push([module.id, ".slider-wrap{\r\n position: relative;\r\n width: 100%;\r\n margin: 50px;\r\n background: #fff;\r\n}\r\n\r\n.slider-wrap li{\r\n text-align: center;\r\n line-height: 20px;\r\n}", ""]);
 
/***/ },
/* 3 */
/***/ function(module, exports) {
 
/***/ },
 
/* 4 */
/***/ function(module, exports, __webpack_require__) {
/***/ },
 
/* 5 */
/***/ function(module, exports) {
          console.log('hello, here is clipitem.js') ;
/***/ },
/* 6 */
/***/ function(module, exports) {
          module.exports = "data:image/png;base64,iVBORw0KGg......"
/***/ }
]);
```

webpack 编译之后，输出文件视乎乱糟糟的，但其实每一个资源都被封装在一个函数体内，并且以编号的形式标记（注释）。这些模块，由 webpack 的\_\_webpack_require\_\_内部方法加载。入口文件为编号 0 的函数 index.js，可以看到\_\_webpack_require\_\_加载其他编号的模块。

css 文件在编号 1，由于使用 css-loader 和 style-loader，编号 1-4 都是处理 css。其中编号 2 我们可以看我们的 css 的 string 体。最终会以内联的方式插入到 html 中。

图片文件在编号 6，可以看出 exports 出 base64 化的图片。

**#### 组件一体输出**

```javascript
// 加载组件自身css
require("./slider.css");
// 加载组件依赖的模块
var React = require("react");
var Clip = require("../ui/clipitem.jsx");
// 加载图片资源
var spinnerImg = require("./loading.png");
var Slider = React.createClass({
    getInitialState: function () {
        // ...
    },
    componentDidMount: function () {
        // ...
    },
    render: function () {
        return (
            <div>
                               <Clip data={this.props.imgs} />
                               <img className="loading" src={spinnerImg} />
                            
            </div>
        );
    },
});
module.exports = Slider;
```

如果说，react 使到 html 和 js 合为一体。

那么加上 webpack，两者结合一起的话。js，css，png (base64)，html 所有 web 资源都能合成一个 JS 文件。这正是这套方案的核心所在：**组件独立一体化**。如果要引用一个组件，仅仅 `require('./slider.js')` 即可完成。

加入 webpack 的模块加载器之后，我们组件的加载问题，内聚问题也都成功地解决掉

“资源高内聚”——（100%）所有资源可以一 js 输出

“可相互组合”——（100%）  可组合可依赖加载

**### CSS 模块化实践**

      很高兴，你能阅读到这里。目前我们的组件完成度非常的高，资源内聚，易于组合，作用域独立互不污染。。。。等等[![eee](http://www.alloyteam.com/wp-content/uploads/2015/11/eee.gif)](http://www.alloyteam.com/wp-content/uploads/2015/11/eee.gif)，视乎 CSS 模块的完成度有欠缺。

      那么目前组件完成度来看，CSS 作用域其实是全局性的，并非组件内部独立。下一步，我们要做得就是如何让我们组件内部的 CSS 作用域独立。

      这时可能有人立马跳出，大喊一句 “德玛西亚！”，哦不，应该是 “ 用 sass 啊傻逼！”。可是**项目组件化之后，组件的内部封装已经很好了，其内部 dom 结构和 css 趋向简单，独立，甚至是破碎的**。LESS 和 SASS 的一体式样式框架的设计，他的嵌套，变量，include，函数等丰富的功能对于整体大型项目的样式管理非常有效。但对于一个功能单一组件内部样式，视乎就变的有点格格不入。“不能为了框架而框架，合适才是最好的”。视乎原生的 css 能力已经满足组件的样式需求，唯独就是上面的 css 作用域问题。

      这里我给出思考的方案： classname 随便写，保持原生的方式。编译阶段，根据组件在项目路径的唯一性，由【组件 classname + 组件唯一路径】打成 md5，生成全局唯一性 classname。正当我要写一个 loader 实现我的想法的时候，发现歪果仁已经早在先走一步了。。。。

      这里具体方案参考我之前博客的译文：<http://www.alloyteam.com/2015/10/8536/>

       之前我们讨论过 JS 的模块。现在通过 Webpack 被加载的 CSS 资源叫做 “CSS 模块”？我觉得还是有问题的。现在 style-loader 插件的实现本质上只是创建 link\[rel=stylesheet] 元素插入到 document 中。这种行为和通常引入 JS 模块非常不同。引入另一个 JS 模块是调用它所提供的接口，但引入一个 CSS 却并不 “调用” CSS。所以引入 CSS 本身对于 JS 程序来说并不存在 “ 模块化” 意义，纯粹只是表达了一种资源依赖 —— 即该组件所要完成的功能还需要某些 asset。

    因此，那位歪果仁还扩展了 “CSS 模块化” 的概念，除了上面的我们需要局部作用域外，还有很多功能，这里不详述。具体参考原文 <http://glenmaddern.com/articles/css-modules>

非常赞的一点，就是 cssmodules 已经被 css-loader 收纳。所以我们不需要依赖额外的 loader，基本的 css-loader 开启参数 modules 即可

```javascript
//webpack.config.js
...  
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style!css?modules&localIdentName=[local]__[name]_[hash:base64:5]' },
        ]  
    }
....
```

modules 参数代表开启 css-modules 功能，loaclIdentName 为设置我们编译后的 css 名字，为了方便 debug，我们把 classname（local）和组件名字（name）输出。当然可以在最后输出的版本为了节省提交，仅仅使用 hash 值即可。另外在 react 中的用法大概如下。

```javascript
var styles = require('./banner.css');
var Banner = new React.createClass({
    ...
    render: function(){
        return (
            <div>
                <div className={styles.classA}></div>
            </div>
        )
    }
});
```

最后这里关于出于对 CSS 一些思考，

关于 css-modules 的其它功能，我并不打算使用。在内部分享【我们竭尽所能地让 CSS 变得复杂】中提及：

 我们项目中大部分的 CSS 都不会像 boostrap 那样需要变量来设置，身为一线开发者的我们大概能够感受到：设计师们改版 UI，绝对不是简单的换个色或改个间距，而是面目全非的全新 UI，这绝对不是一个变量所能解决的” 维护性 “。

 反而项目实战过程中，真正要解决的是：在版本迭代过程中那些淘汰掉的过期 CSS，大量地堆积在项目当中。我们像极了家中的欧巴酱不舍得丢掉没用的东西，因为这可是我们使用 sass 或 less 编写出具有高度的可维护性的，肯定有复用的一天。

 这些堆积的过期 CSS（or sass）之间又有部分依赖，一部分过期没用了，一部分又被新的样式复用了，导致没人敢动那些历史样式。结果现网项目迭代还带着大量两年前没用的样式文件。

组件化之后，css 的格局同样被革新了。可能 [postcss](https://github.com/postcss/postcss) 才是你现在手上最适合的工具，而不在是 sass。

到这里，我们终于把组件化最后一个问题也解决了。

“作用域独立”——（100%）如同 shadowDom 作用域独立

到这里，我们可以开一瓶 82 年的雪碧，好好庆祝一下。不是吗？

[![bdecf63e-febe-4370-b1ae-ec5d9e88fa45](http://www.alloyteam.com/wp-content/uploads/2015/11/bdecf63e-febe-4370-b1ae-ec5d9e88fa45.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/11/bdecf63e-febe-4370-b1ae-ec5d9e88fa45.jpg)

**### 组件化之路还在继续**

webpack 和 react 还有很多新非常重要的特性和功能，介于本文仅仅围绕着组件化的为核心，没有一一阐述。另外，配搭 **gulp/grunt 补充 webpack 构建能力，webpack 的 codeSplitting，react 的组件通信问题，开发与生产环境配置等等，都是整套大型项目方案的所必须的**，限于篇幅问题。可以等等我更新下篇，或大家可以自行查阅。

但是，不得不再安利一下 react-hotloader 神器。热加载的开发模式绝对是下一代前端开发必备。严格说，**如果没有了热加载，我会很果断地放弃这套方案**，即使这套方案再怎么优秀，我都讨厌 react 需要 5~6s 的编译时间。但是 hotloader 可以在我不刷新页面的情况下，动态修改代码，而且不单单是样式，连逻辑也是即时生效。

[![hot-loader-done](http://www.alloyteam.com/wp-content/uploads/2015/11/hot-loader-done.gif)](http://www.alloyteam.com/wp-content/uploads/2015/11/hot-loader-done.gif)

如上在 form 表单内。使用热加载，表单不需要重新填写，修改 submit 的逻辑立刻生效。这样的开发效率真不是提高仅仅一个档次。必须安利一下。

或许你发现，使用组件化方案之后，整个技术栈都被更新了一番。学习成本也不少，并且可以预知到，基于组件化的前端还会很多不足的问题，例如性能优化方案需要重新思考，甚至最基本的组件可复用性不一定高。后面很长一段时间，需要我们不断磨练与优化，探求最优的前端组件化之道。

至少我们可以想象，不再担心自己写的代码跟某个谁谁冲突，不再为找某段逻辑在多个文件和方法间穿梭，不再 copy 一片片逻辑然后改改。我们每次编写都是可重用，可组合，独立且内聚的组件。而每个页面将会由一个个嵌套组合的组件，相互独立却相互作用。

对于这样的前端未来，有所期待，不是很好吗

至此，感谢你的阅读。

<!-- {% endraw %} - for jekyll -->