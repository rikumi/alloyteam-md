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
console.log(arr); // => ["Other", "Programming"] // 变量arr值已经被修改
```

```javascript
// 不可变数据
var arr = ["Functional", "Programming"];
// 得到新的变量，不修改了原来的值
var newArr = arr.map((item) => {
    if (item === "Functional") {
        return "Other";
    } else {
        return item;
    }
});
console.log(arr); // => ["Functional", "Programming"] 变量arr值不变
console.log(newArr); // => ["Other", "Programming"]  产生新的变量newArr
```

之所以使用这种不变值，除了更好的函数式编程外，还能够维持线程安全可靠，落地在业务中，实际上也能让代码更加清晰。  
设想，如果你定义了一个变量 A，A 在其他地方被其他人修改了，这样是不方便定位 A 的当前值的。关于定义多个变量引发的内存等问题，可以通过重用结构或部分引用的方式来减轻，可参考 immutable.js

使用 map, reduce 等数据处理函数  

* * *

强大的 JavaScript 有着越来越多的高能处理数据函数，其中包含了 map、 reduce、 filter 等。

map 能够对原数组中的值进行逐个处理并产生新的数组，一个简单例子


<!-- {% endraw %} - for jekyll -->