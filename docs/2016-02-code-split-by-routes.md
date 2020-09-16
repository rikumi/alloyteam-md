---
title: 在 Webpack 中使用 Code Splitting 实现按需加载
date: 2016-02-24
author: he, terence
source_link: http://www.alloyteam.com/2016/02/code-split-by-routes/
---

<!-- {% raw %} - for jekyll -->

随着移动设备的升级、网络速度的提高，用户对于 web 应用的要求越来越高，web 应用要提供的功能越来越。功能的增加导致的最直观的后果就是资源文件越来越大。为了维护越来越庞大的客户端代码，提出了模块化的概念来组织代码。webpack 作为一种模块化打包工具，随着 react 的流行也越来越流行。

webpack 在官方文档上解释为什么又做一个模块打包工具的时候，是这样说的：

> The most pressing reason for developing another module bundler was Code Splitting and that static assets should fit seamlessly together through modularization.

开发一个新的模块打包工具最重要的原因就是 Code Splitting，并且还要保证静态资源也可以无缝集成到模块化中。其中 Code Splitting 是 webpack 提供的一个重要功能，通过这个功能可以实现按需加载，减少首次加载时间。

Code Splitting  

* * *

翻译一下官方文档对于 Code Splitting 的介绍：

> 对于大型的 web 应用而言，把所有的代码放到一个文件的做法效率很差，特别是在加载了一些只有在特定环境下才会使用到的阻塞的代码的时候。Webpack 有个功能会把你的代码分离成 Chunk，后者可以按需加载。这个功能就是 Code Spliiting

Code Spliting 的具体做法就是一个分离点，在分离点中依赖的模块会被打包到一起，可以异步加载。一个分离点会产生一个打包文件。 

例如下面使用 CommonJS 风格的 require.ensure 作为分离点的代码：

```javascript
// 第一个参数是依赖列表，webpack会加载模块，但不会执行
// 第二个参数是一个回调，在其中可以使用require载入模块
// 下面的代码会把module-a，module-b，module-c打包一个文件中，虽然module-c没有在依赖列表里，但是在回调里调用了，一样会被打包进来
require.ensure(["module-a", "module-b"], function (require) {
    var a = require("module-a");
    var b = require("module-b");
    var c = require("module-c");
});
```

除了这样的写法，还可以在配置文件中使用 [CommonChunkPlugin](http://webpack.github.io/docs/code-splitting.html#split-app-and-vendor-code) 合并文件

问题  

* * *

现在进入正题，本文不会针对 React 或者 Vue 做示例，因为这两个框架有很成熟的按需加载方案。   
下面这个例子用 Backbone Router 做路由，但是其中提到的按需加载方式可以用到大多数路由系统中。 

假设应用有三个路由：

-   主页
-   关于
-   支付

开始时的代码 (index.js)：

```javascript
import Backbone from 'backbone'
import $ from 'jquery'
var Route = export default Backbone.Router.extend({
   routes: {
       '': 'home',
       'about': 'about',
       'pay': 'pay'
   },
    home() {
        $('#app').html('it is home');
    },
    about() {
        $('#app').html('it is about');
    },
    pay() {
        $('#app').html('it is pay');
    }
});
new Route();
Backbone.history.start();
```

这里有三个 url 路径：index, about, pay，对应了三个很简单的 handler。这样的代码量的时候，这样写是没问题的。   
但是随着功能的增加，handler 里的内容会越来越多，所以要先把 handler 分离到不同的模块里。

逻辑分离  

* * *

把 about 的 handler 放在新的目录下 (about/index.js):

```javascript
import $ from "jquery";
export default () => {
    $("#app").html("it is about");
};
```


<!-- {% endraw %} - for jekyll -->