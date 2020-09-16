---
title: 剖析 Babel——Babel 总览
date: 2017-04-06
author: TAT.dorsywang
source_link: http://www.alloyteam.com/2017/04/analysis-of-babel-babel-overview/
---

<!-- {% raw %} - for jekyll -->

**名词解释**

**AST：**Abstract Syntax Tree, 抽象语法树

**DI:** Dependency Injection, 依赖注入

\\===============================================================

## Babel 的解析引擎

Babel 使用的引擎是 babylon，babylon 并非由 babel 团队自己开发的，而是 fork 的 acorn 项目，acorn 的项目本人在很早之前在兴趣部落 1.0 在构建中使用，为了是做一些代码的转换，是很不错的一款引擎，不过 acorn 引擎只提供基本的解析 ast 的能力，遍历还需要配套的 acorn-travesal, 替换节点需要使用 acorn-，而这些开发，在 Babel 的插件体系开发下，变得一体化了

## Babel 的工作过程

Babel 会将源码转换 AST 之后，通过便利 AST 树，对树做一些修改，然后再将 AST 转成 code，即成源码。  
![](http://www.alloyteam.com/wp-content/uploads/2017/04/1490858489_75_w920_h326.png)

上面提到 Babel 是 fork acon 项目，我们先来看一个来自兴趣部落项目的，简单的 ACON 示例

## 一个简单的 ACON 转换示例

解决的问题

将

```javascript
Model.task("getData", function ($scope, dbService) {});
```

转换成

```javascript
Model.task("getData", ["$scope", "dbService", function ($scope, dbService) {}]);
```

熟悉 angular 的同学都能看到这段代码做的是对 DI 的自动提取功能，使用 ACON 手动撸代码

```javascript
var code = 'let a = 1; // ....';
 
var acorn = require("acorn");
var traverse =
```


<!-- {% endraw %} - for jekyll -->