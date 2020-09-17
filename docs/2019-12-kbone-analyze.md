---
title: 小程序同构方案 kbone 分析与适配
date: 2019-12-03
author: flyfu wang
source_link: http://www.alloyteam.com/2019/12/kbone-analyze/
---

<!-- {% raw %} - for jekyll -->

在微信小程序的开发的过程中，我们会存在小程序和 H5 页面共存的场景，而让小程序原生和 web h5 独立开发，往往会遇到需要两套人力去维护。对开发者而言，加大了工作量成本，对于产品而言，容易出现展示形态同步不及时问题。在这种情况下，我们急需要找到一个既能平衡性能，也能满足快速迭代的方案。

## 主流的小程序同构方案

### web-view 组件

web-view 组件是一个承载网页的容器，最简单的方案就是使用原 h5 的代码，通过 web-view 组件进行展示。其优点是业务逻辑无需额外开发与适配，只需要处理小程序特有的逻辑，然后通过 jssdk 与原生小程序通信。

使用 webview 加载 h5 的问题也非常明显，首先是体验问题，用户见到页面会经过以下环节：加载小程序包，初始化小程序，再加载 webview 中的 html 页面，然后加载相关资源，渲染 h5 页面，最后进行展示。最终导致的结果是打开体验非常差。另外其他缺点是小程序对 web-view 部分特性有限制，比如组件会自动铺满整个小程序页面，不支持自定义导航效果等。

![](http://www.alloyteam.com/wp-content/uploads/2019/12/屏幕快照-2019-12-03-下午7.45.42.png)

### 静态编译兼容

静态编译是最为主流的小程序同构方案，类似的有 taro, mpvue 等。其思路是在构建打包过程，把一种结构化语言，转换成另一种结构化语言。比如，taro 把 jsx 在构建时进行词法分析，解析代码获取 AST，然后将 AST 递归遍历生成 wxml 目标代码。

![](http://www.alloyteam.com/wp-content/uploads/2019/12/bianyi.png)

静态编译的好处是非常明显，一套代码，通过编译分别转 h5 和小程序，兼具性能与跨平台。另一方面，随着这种方案的流行，大家也感受到了其明显的问题，首先，由于小程序本身的限制，比如无法 dom 操作，js 与 webview 双线程通信等，导致静态编译语法转换，不能做到彻底的兼容，开发体验受制于框架本身的支持程度，相信踩过坑的同学应该非常有痛的感悟。其次，静态编译转换逻辑需要与小程序最新的特性保持同步，不断升级。

## 小程序运行时兼容方案

静态编译的方案实现了同构，但它只是以一种中间态的结构化语法去编码，非真正的 web，牺牲了大量的灵活性。我们来看下另外一种更灵活的方案 ——— 运行时兼容。

我们回到小程序本身的限制上来。由于小程序采用双线程机制，内部通过一个 webview 用于承载页面渲染，但小程序屏蔽了它原本的 DOM/BOM 接口，自己定义了一套组件规范；另一方面，使用独立的 js-core 负责对 javascript 代码进行解析，让页面和 js-core 之间进行相互通信（setData），从而达到执行与渲染的分离。而浏览器的 DOM 接口是大量 web 得以显示的底层依赖，这也是 h5 代码无法直接在小程序中运行的主要原因。

那么如何突破小程序对 DOM 接口的屏蔽呢？ 最直接的思路就是用 JS 实现和仿造一层浏览器环境 DOM 相关的标准接口，让用户的 JS 代码可以无感知的自由操作 DOM。通过仿造的底层 DOM 接口，web 代码执行完后，最终生成一层仿造的 DOM 树，然后将这棵 DOM 树转换成小程序的 wxml 构成的 DOM 树，最后由小程序原生去负责正确的渲染出来。

![](http://www.alloyteam.com/wp-content/uploads/2019/12/0.png)

### kbone

kbone 是微信官方出一套小程序运行时兼容方案，目前已经接入的小程序有小程序官方社区，及腾讯课堂新人礼包等。并且有专人维护，反馈及时～～。

kbone 方案核心主要有两大模块，第一是 miniprogram-render 实现了对浏览器环境下 dom/bom 的仿造，构建 dom 树，及模拟 web 事件机制。第二个模块是 miniprogram-element 是原生小程序渲染入口，主要监听仿造 dom 树的变化，生成对应的小程序的 dom 树，另外一个功能是监听原生小程序事件，派发到仿造的事件中心处理。

![](http://www.alloyteam.com/wp-content/uploads/2019/12/0-1.png)

### DOM/BOM 仿造层

DOM、BOM 相关的接口模拟，主要是按照 web 标准构建 widow、document、node 节点等相关 api，思路比较清晰，我们简单看下其流程。

首先在用户层有一个配置文件 miniprogram.config，里面有必要信息 origin、entry 等需要配置。在 miniprogram-render 的入口文件 createPage 方法中，配置会初始化到一个全局 cache 对象中，然后根据配置初始化 Window 和 Document 这两个重要的对象。Location、Navigator、Screen、History 等 BOM 实例都是在 window 初始化过程中完成。DOM 节点相关 api 都是在 Document 类中初始化。所有生成的节点和对象都会通过全局的 pageMap 管理，在各个流程中都能获取到。

![](http://www.alloyteam.com/wp-content/uploads/2019/12/0-2.png)

### 小程序渲染层

miniprogram-element 负责监听仿造 DOM 仿造的变化，然后生成对应小程序组件。由于小程序中提供的组件和 web 标准并不完全一样，而我们通过 html 生成的 dom 树结构千差万别，如和保证任意的 html dom 树可以映射到小程序渲染的 dom 树上呢？kbone 通过小程序自定义组件去做了这件事情。

简单说下什么是自定义组件，既将特定的代码抽象成一个模块，可以组装和复用。以 react 为例，div、span 等标签是原生组件，通过 react.Component 将 div 和 span 组合成一个特定的 react 组件，在小程序中用自带的 view、image 等标签通过 Component 写法就能组合成小程序自定义组件。

和大部分 web 框架的自定义组件类似，小程序自定义组件也能够自己递归地调用自己，通过将伪造的 dom 结构数据传给自定义组件作为子组件，然后再递归的调用，直到没有子节点为止，这样就完成了一个小程序 dom 树的生成。

![](http://www.alloyteam.com/wp-content/uploads/2019/12/0-3.png)

![](http://www.alloyteam.com/wp-content/uploads/2019/12/0-4.png)

![](http://www.alloyteam.com/wp-content/uploads/2019/12/0-5.png)

## 性能问题

### 多层 dom 组合

大量小程序自定义组件会有额外的性能损耗，kbone 在实现时提供了一些优化。其中最基本的一个优化是将多层小程序原生标签作为一个自定义组件。dom 子树作为自定义组件渲染的层级数是可以通过配置传入，理论上层级越多，使用自定义组件数量越少，性能也就越好。

![](http://www.alloyteam.com/wp-content/uploads/2019/12/0-6.png)  
![](http://www.alloyteam.com/wp-content/uploads/2019/12/0-7.png)  
![](http://www.alloyteam.com/wp-content/uploads/2019/12/0-8.png)

以上逻辑就是通过 DOM_SUB_TREE_LEVEL 层级数对节点过滤，更新后，检测是否还有节点，再触发更新。

### 节点缓存

在页面 onUnload 卸载的过程中，kbone 会将当前节点放入缓存池中，方便下次初始化的时候优先从缓存中读取。

![](http://www.alloyteam.com/wp-content/uploads/2019/12/0-9.png)  
![](http://www.alloyteam.com/wp-content/uploads/2019/12/0-8.png)

## kbone 接入与适配

kbone 作为一种运行时兼容方案，适配成本相对于静态编译方案而言会低很多，总体来说对原代码侵入性非常少，目前接入过程比较顺利（期间遇到的坑，感谢 作者 june 第一时间帮忙更新发布 \[玫瑰]）

### svg 资源适配

小程序不支持 svg，对于使用 svg 标签作为图片资源的应用而言，需要从底层适配。在一开始我们想到的方案有通过 肝王的 cax 进行兼容，但评估后不太靠谱，cax 通过 解析 svg 绘制成 canvas，大量 icon 会面临比较严重的性能问题。那么最直接暴力的办法就是使用 webpack 构建过程直接把 svg 转 png？后面一位给力的小伙伴想到通过把 svg 标签转成 Data URI 作为背景图显示，最终实践验证非常可靠，具体可以参考 [kbone svg 适配](http://www.alloyteam.com/2019/11/14073/ "kbone svg 适配")。

### 网络层适配 /cookie

微信小程序环境拥有自己定义的一套 wx.request API， web 中的 XMLHttpRequest 对象是无法直接使用。由于我们代码中使用了 axios，所以在预言阶段直接简单通过 axios-miniprogram-adapter 进行适配器，后面发现部分业务没有使用 axios，兼容并不够彻底。于是直接从底层构建了一个 XMLHttpRequest 模块，将 web 网络请求适配到 wx.request。同时做了 cookie 的自动存取逻辑适配（小程序网络请求默认不带 cookie）。这一层等完善好了看是否能 pull request 到 kbone 代码仓库中。

### 差异性 DOM/BOM API 适配

部分 web 中的接口在小程序无法完全获得模拟，比如 getBoundingClientRect 在小程序中只能通过异步的方式实现。类似的有 removeProperty、stopImmediatePropagation

等接口在 kbone 中没有实现，performance 等 web 特有的全局变量的需要兼容。这些扩展 API 可以通过 kbone 对外暴露的 dom/bom 扩展 API 进行适配。

![](http://www.alloyteam.com/wp-content/uploads/2019/12/0-11.png)

### getBoundingClientRect

对于元素的的高度 height \\offsetHeight 获取，我们只能通过 $getBoundingClientRect 异步接口，如果是 body scroll-view 实现的，getBoundingClientRect 返回的是 scrollHeight。

### 滚动

web 的全局滚动事件默认是无法触发，需要通过配置 windowScroll 来监听，启用这个特性会影响性能。

```javascript
global: {
    windowScroll: true
},
```

### 样式适配

#### 标签选择器

kbone 样式有一个坑，就是它会将标签选择器转换成类选择器去适配小程序环境，比如

    span { } =>  .h5-span{  }

这样带来的副作用就是选择器的权重会被自动提升，对选择器权重依赖的标签样式需要去手动调整兼容。

#### 其他适配点

注意使用标准的 style 属性，比如有 webkit-transform 会不支持，及小程序样式和 web 差异性兼容等。

```javascript
  style: {
      'WebkitTransform': 'translate(' + x + 'px, 0)' // 正确
     // '-webkit-transform': 'translate(' + x + 'px, 0)' 报错
  }
```

### 路由适配

在初始化路由阶段，曾经遇到过 Redux 更新 dom 后偶现节点销毁，最终定位到是 kbone 对 Location 等 BOM 实例化过晚，最终在 june 帮忙及时调整了顺序，更新了一个版本，现最新本所有 BOM 对象会在业务执行前准备好。

```javascript
//初始化dom
this.window.$$miniprogram.init()
...
//初始化业务
init(this.window, this.document)
```

### 隐式全局变量兼容

在模拟 XMLHttpRequest 模块的过程中遇到一个问题，什么时候初始化这个对象，我们可以选择在网络请求库初始化前引入它，挂载在仿造的 window 对象下。但仍然会出现一个问题，第三放库直接使用的是 XMLHttpRequest 对象，而非通过 window 访问。

```javascript
var request = new XMLHttpRequest();
```


<!-- {% endraw %} - for jekyll -->