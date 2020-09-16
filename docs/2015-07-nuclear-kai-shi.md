---
title: Nuclear 开始
date: 2015-07-12
author: TAT.dnt
source_link: http://www.alloyteam.com/2015/07/nuclear-kai-shi/
---

<!-- {% raw %} - for jekyll -->

## 为什么 Nuclear

这里列举 Nuclear 在竞品中的优势：

-   借助浏览器本身的机制，无任何代码约定和入侵
-   放心使用 HTML+CSS+JS
-   observejs 替代 EventLoop、requestAnimationFrame、Ticker 等定时循环
-   解决 MV\*无法构建复杂特效的难题，随意构建超复杂交互特效，自由地大展拳脚
-   支持 Dom 和 Canvas 组件，未来支持 SVG 和 WebGL.
-   SVG 库 Sword 已经整装待发：<https://github.com/AlloyTeam/Sword>
-   WebGL 库 pixeljs 正在全力推进 <https://github.com/kmdjs/pixeljs>

## 获取 Nuclear

Nuclear 网站 <http://alloyteam.github.io/Nuclear/>.

Github <https://github.com/AlloyTeam/Nuclear>

你也可以通过 npm 安装 Nuclear

    npm install alloynuclear

## 使用 Nuclear

js 文件可以在这里找到最新版的: [nuclear.js](https://raw.githubusercontent.com/AlloyTeam/Nuclear/master/dist/nuclear.js) or [nuclear.min.js](https://raw.githubusercontent.com/AlloyTeam/Nuclear/master/dist/nuclear.min.js)

你可以直接在页面引用

````html

```html
<script src="nuclear.js"></script>
````

;

````

也可在 AMD 环境同步 require

```javascript
define(function (require) {
    var Nuclear = require("nuclear");
});
````

或者异步 require：

```javascript
require(["nuclear"], function (Nuclear) {});
```

在 CommonJS 环境：

```javascript
var Nuclear = require("nuclear");
```

## Nuclear 直接暴露

下面是暴露给 AMD/CommonJS 和 Root 的代码。

```javascript
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
```


<!-- {% endraw %} - for jekyll -->