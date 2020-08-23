---
title: 【转向 Javascript 系列】深入理解 Generators
date: 2016-02-18
author: TAT.ronnie
source_link: http://www.alloyteam.com/2016/02/generators-in-depth/
---

<!-- {% raw %} - for jekyll -->

随着 Javascript 语言的发展，ES6 规范为我们带来了许多新的内容，其中生成器 Generators 是一项重要的特性。利用这一特性，我们可以简化迭代器的创建，更加令人兴奋的，是 Generators 允许我们在函数执行过程中暂停、并在将来某一时刻恢复执行。这一特性改变了以往函数必须执行完成才返回的特点，将这一特性应用到异步代码编写中，可以有效的简化异步方法的写法，同时避免陷入回调地狱。

本文将对 Generators 进行简单介绍，然后结合笔者在 C# 上的一点经验，重点探讨 Generators 运行机制及在 ES5 的实现原理。

**1.Generators 简单介绍**

一个简单的 Generator 函数示例

```c
function* example() {
  yield 1;
  yield 2;
  yield 3;
}
var iter=example();
iter.next();//{value:1，done:false}
iter.next();//{value:2，done:false}
iter.next();//{value:3，done:false}
iter.next();//{value:undefined，done:true}
```

上述代码中定义了一个生成器函数，当调用生成器函数 example () 时，并非立即执行该函数，而是返回一个生成器对象。每当调用生成器对象的.next () 方法时，函数将运行到下一个 yield 表达式，返回表达式结果并暂停自身。当抵达生成器函数的末尾时，返回结果中 done 的值为 true，value 的值为 undefined。我们将上述 example () 函数称之为生成器函数，与普通函数相比二者有如下区别

-   普通函数使用 function 声明，生成器函数用 function\*声明
-   普通函数使用 return 返回值，生成器函数使用 yield 返回值
-   普通函数是 run to completion 模式，即普通函数开始执行后，会一直执行到该函数所有语句完成，在此期间别的代码语句是不会被执行的；生成器函数是 run-pause-run 模式，即生成器函数可以在函数运行中被暂停一次或多次，并且在后面再恢复执行，在暂停期间允许其他代码语句被执行

对于 Generators 的使用，本文不再多做介绍，如需了解更多内容推荐阅读下面系列文章，[《ES6 Generators: Complete Series》](https://davidwalsh.name/es6-generators)或者 [《深入掌握 ECMAScript 6 异步编程》](http://www.ruanyifeng.com/blog/2015/04/generator.html)系列文章

**2.Generators in C#**

生成器不是一个新的概念，我最初接触这一概念是在学习使用 C# 时。C# 从 2.0 版本便引入了 yield 关键字，使得我们可以更简单的创建枚举数和可枚举类型。不同的是 C# 中未将其命名为生成器 Generators，而将其称之为迭代器。

本文不会介绍 C# 中可枚举类 IEnumerable 和枚举数 IEnumerator 内容，如需了解推荐阅读《C#4.0 图解教程》相关章节。

2.1 C# 迭代器介绍

让我们先看一个示例，下面方法声明实现了一个产生和返回枚举数的迭代器

```c
public IEnumerable <int> Example()
{
		yield return 1;
		yield return 2;
		yield return 3;
}
```

方法定义与 ES6 Generators 定义很接近，定义中声明返回了一个 int 类型的泛型可枚举类型，方法体内通过 yield return 语句返回值并将自身暂停执行。

使用迭代器来创建可枚举类型的类

```javascript
class YieldClass
{
    public IEnumerable<int> Example()//迭代器
    {
	yield return 1;
	yield return 
```


<!-- {% endraw %} - for jekyll -->