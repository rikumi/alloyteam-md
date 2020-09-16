---
title: 谈谈函数式编程
date: 2016-09-20
author: TAT.joeyguo
source_link: http://www.alloyteam.com/2016/09/talk-about-functional-programming/
---

<!-- {% raw %} - for jekyll -->

[原文地址](https://github.com/joeyguo/blog/issues/10)

函数式编程 (Functional Programming) 是一种以函数为基础的编程方式和代码组织方式，能够带来更好的代码调试及项目维护的优势。[本篇](https://github.com/joeyguo/blog/issues/10)主要结合笔者在实际项目开发中的一些应用，简要谈谈函数式编程。

函数  

* * *

在函数式编程中，任何代码可以都是函数，且要求具有返回值，如下示例

```javascript
// 非函数式
var title = "Functional Programming";
var saying = "This is not";
console.log(saying + title); // => This is not Functional Programming
```

```javascript
// 函数式
var say = (title) => "This is " + title;
var text = say("Functional Programming"); // => This is Functional Programming
```

纯函数  

* * *

纯函数在这里指函数内外间是 “无” 关联的。主要有下面两点

-   没有副作用（side effect）  
    不会涉及到外部变量的使用或修改
-   引用透明  
    函数内只会依赖传入参数，在任何时候对函数输入相同的参数时，总能输出相同的结果

```javascript
// 非纯函数（函数内依赖函数外的变量值）
var title = "Functional Programming";
var say = () => "This is not" + title; // <= 依赖了全局变量 title
```

```javascript
// 纯函数
var say = (title) => "This is " + title; // <= 依赖了以参数 title 传入
say("Functional Programming");
```

不可变数据（immutable）  

* * *

这里主要是指变量值的不可变。当需要基于原变量值改变时，可通过产生新的变量来确保原变量的不变性，如下

```javascript
// 可变数据
 
var arr = ["Functional", "Programming"];
arr[0] = "Other"; // <= 修改了arr[0]的值
console.log(a
```


<!-- {% endraw %} - for jekyll -->