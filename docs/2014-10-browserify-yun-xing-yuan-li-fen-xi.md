---
title: browserify 运行原理分析
date: 2014-10-21
author: TAT.Cson
source_link: http://www.alloyteam.com/2014/10/browserify-yun-xing-yuan-li-fen-xi/
---

<!-- {% raw %} - for jekyll -->

目前对于前端工程师而言，如果只针对浏览器编写代码，那么很简单，只需要在页面的 script 脚本中引入所用 js 就可以了。

但是某些情况下，我们可能需要在服务端也跑一套类似的逻辑代码，考虑如下这些情景（以 node 作为后端为例）：

1.spa 的应用，需要同时支持服务端直出页面以及客户端 pjax 拉取数据渲染，客户端和服务器公用一套渲染模板并执行大部分类似的逻辑。

2. 一个通过 websocket 对战的游戏，客户端和服务端可能需要进行类似的逻辑计算，两套代码分别用于对用户客户端的展示以及服务端实际数值的计算。

这些情况下，很可能希望我们客户端代码的逻辑能够同时无缝运行在服务端。

**解决方法 1：UMD**

一种解决方法是使用 UMD 的方式，前端使用 requirejs，同时兼容 nodejs 的情况，例如：

```javascript
(function (window, factory) {
    if (typeod exports === 'object') {
 
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
 
        define(factory);
    } else {
 
        window.eventUtil = factory();
    }
})(this, function () {
    //module ...
});
```

**解决方案 2：使用 browserify，使代码能同时运行于服务端和浏览器端。**

**什么是 browserify？**

Browserify 可以让你使用类似于 node 的 require () 的方式来组织浏览器端的 Javascript 代码，通过预编译让前端 Javascript 可以直接使用 Node NPM 安装的一些库。

例如我们可以这样写 js，同时运行在服务端和浏览器中：  
mo2.js:  

```javascript
exports.write2 = function () {
    //write2
};
```

mo.js:

```javascript
var t = require("./mo2.js");
exports.write = function () {
    t.write2();
};
```

test.js:

```javascript
var mo = require("./mo.js");
mo.write();
```

代码可以完全以 node 的形式编写。

**原理分析：**

总体过程其实可以分为以下几个步骤：

**阶段 1：预编译阶段**

1. 从入口模块开始，分析代码中 require 函数的调用

2. 生成 AST

3. 根据 AST 找到每个模块 require 的模块名

4. 得到每个模块的依赖关系，生成一个依赖字典

5. 包装每个模块（传入依赖字典以及自己实现的 export 和 require 函数），生成用于执行的 js

**阶段 2：执行阶段**

从入口模块开始执行，递归执行所 require 的模块，得到依赖对象。

具体步骤分析：

1. 从入口模块开始，分析代码中 require 函数的调用

由于浏览器端并没有原生的 require 函数，所以所有 require 函数都是需要我们自己实现的。因此第一步我们需要知道一个模块的代码中，哪些地方用了 require 函数，依赖了什么模块。

browerify 实现的原理是为代码文件生成 AST，然后根据 AST 找到 require 函数依赖的模块。

2. 生成 AST

文件代码：

```javascript
var t = require("b");
t.write();
```

生成的 js 描述的 AST 为：


<!-- {% endraw %} - for jekyll -->