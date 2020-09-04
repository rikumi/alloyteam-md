---
title: babel 到底将代码转换成什么鸟样？
date: 2016-05-15
author: TAT.heyli
source_link: http://www.alloyteam.com/2016/05/babel-code-into-a-bird-like/
---

<!-- {% raw %} - for jekyll -->

[原文链接](https://github.com/lcxfs1991/blog/issues/9)

前言  

* * *

将 babel 捧作前端一个划时代的工具一定也不为过，它的出现让许多程序员幸福地用上了 es6 新语法。但你就这么放心地让 babel 跑在外网？反正我是不放心，我就曾经过被坑过，于是萌生了研究 babel 代码转换的想法。本文不是分析 babel 源码，仅仅是看看 babel 转换的最终产物。

es6 在 babel 中又称为 es2015。由于 es2015 语法众多，本文仅挑选了较为常用的一些语法点，而且主要是分析 babel-preset-2015 这个插件（react 开发的时候，常在 webpack 中用到这个 preset）。

babel-preset-2015  

* * *

打开 babel-preset2015 插件一看，一共 20 个插件。熟悉 es2015 语法的同志一看，多多少少能从字面意思知道某个插件是用于哪种语法的转换

-   babel-plugin-transform-es2015-template-literals => es2015 模板
-   babel-plugin-transform-es2015-literals
-   babel-plugin-transform-es2015-function-name => 函数 name 属性
-   babel-plugin-transform-es2015-arrow-functions => 箭头函数
-   babel-plugin-transform-es2015-block-scoped-functions => 函数块级作用域
-   babel-plugin-transform-es2015-classes => class 类
-   babel-plugin-transform-es2015-object-super => super 提供了调用 prototype 的方式
-   babel-plugin-transform-es2015-shorthand-properties => 对象属性的快捷定义，如 obj = {x, y}
-   babel-plugin-transform-es2015-computed-properties => 对象中括号属性，如 obj = {\['x]: 1}
-   babel-plugin-transform-es2015-for-of => 对象 for of 遍历
-   babel-plugin-transform-es2015-sticky-regex
-   babel-plugin-transform-es2015-unicode-regex
-   babel-plugin-check-es2015-constants => const 常量
-   babel-plugin-transform-es2015-spread => 对象扩展运算符属性，如...foobar
-   babel-plugin-transform-es2015-parameters => 函数参数默认值及扩展运算符
-   babel-plugin-transform-es2015-destructuring => 赋值解构
-   babel-plugin-transform-es2015-block-scoping => let 和 const 块级作用域
-   babel-plugin-transform-es2015-typeof-symbol => symbol 特性
-   babel-plugin-transform-es2015-modules-commonjs => commonjs 模块加载
-   babel-plugin-transform-regenerator => generator 特性

var, const and let  

* * *

const 和 let 现在一律转换成 var。那 const 到底如何保证不变呢？如果你在源码中第二次修改 const 常量的值，babel 编译会直接报错。  
转换前

```javascript
var a = 1;
let b = 2;
const c = 3;
```

转换后：

```javascript
var a = 1;
var b = 2;
var c = 3;
```

那 let 的块级作用怎么体现呢？来看看下面例子，实质就是在块级作用改变一下变量名，使之与外层不同。  
转换前：

```javascript
let a1 = 1;
let a2 = 6;
{
    let a1 = 2;
    let a2 = 5;
    {
        let a1 = 4;
        let a2 = 5;
    }
}
a1 = 3;
```

转换后：

```javascript
var a1 = 1;
var a2 = 6;
{
    var _a = 2;
    var _a2 = 5;
    {
        var _a3 = 4;
        var _a4 = 5;
    }
}
a1 = 3;
```

赋值解构  

* * *

写 react 的时候，我们使用负值解构去取对象的值，用起来非常爽，像这样：

```javascript
var props = {
    name: "heyli",
    getName: function () {},
    setName: function () {},
};
let { name, getName, setName } = this.props;
```

我们来看看转换的结果：

```javascript
var props = {
    name: "heyli",
    getName: function getName() {},
    setName: function setName() {},
};
var name = props.name;
var getName = props.getName;
var setName = props.setName;
```

至于数组呢？如果是一个匿名数组，则 babel 会帮你先定义一个变量存放这个数组，然后再对需要赋值的变量进行赋值。  
转换前：

    var [ a1, a2 ] = [1, 2, 3];

转换后：

```javascript
var _ref = [1, 2, 3];
var a1 = _ref;
```


<!-- {% endraw %} - for jekyll -->