---
title: 【Javascript 设计模式 1】- 单例模式
date: 2012-10-24
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2012/10/common-javascript-design-patterns/
---

<!-- {% raw %} - for jekyll -->

《parctical common lisp》的作者曾说，如果你需要一种模式，那一定是哪里出了问题。他所说的问题是指因为语言的天生缺陷，不得不去寻求和总结一种通用的解决方案。

不管是弱类型或强类型，静态或动态语言，命令式或说明式语言、每种语言都有天生的优缺点。一个牙买加运动员， 在短跑甚至拳击方面有一些优势，在练瑜伽上就欠缺一些。

术士和暗影牧师很容易成为一个出色的辅助，而一个背着梅肯满地图飞的敌法就会略显尴尬。 换到程序中，静态语言里可能需要花很多功夫来实现装饰者，而 js 由于能随时往对象上面扔方法，以至于装饰者模式在 js 里成了鸡肋。

讲 javascript 设计模式的书还比较少. Pro javaScript Design Patterns. 是比较经典的一本，但是它里面的例子举得比较啰嗦，所以结合我在工作中写过的代码，把我的理解总结一下。如果我的理解出现了偏差，请不吝指正。

**一 单例模式**

单例模式的定义是产生一个类的唯一实例，但 js 本身是一种 “无类” 语言。很多讲 js 设计模式的文章把 {} 当成一个单例来使用也勉强说得通。因为 js 生成对象的方式有很多种，我们来看下另一种更有意义的单例。

有这样一个常见的需求，点击某个按钮的时候需要在页面弹出一个遮罩层。比如 web.qq.com 点击登录的时候.

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/图片11.jpg "图片 1")](http://www.alloyteam.com/wp-content/uploads/2012/10/图片11.jpg)

这个生成灰色背景遮罩层的代码是很好写的.

```javascript
var createMask = function () {
    return document.body.appendChild(document.createElement(div));
};
```

```javascript
$( 'button' ).click( function(){
 
   Var mask  = createMask();
 
   mask.show();
 
})
```

问题是，这个遮罩层是全局唯一的，那么每次调用 createMask 都会创建一个新的 div, 虽然可以在隐藏遮罩层的把它 remove 掉。但显然这样做不合理.

再看下第二种方案，在页面的一开始就创建好这个 div. 然后用一个变量引用它.

```javascript
var mask = document.body.appendChild( document.createElement( ''div' ) );
 
$( ''button' ).click( function(){
 
   mask.show();
 
} )
```

这样确实在页面只会创建一个遮罩层 div, 但是另外一个问题随之而来，也许我们永远都不需要这个遮罩层，那又浪费掉一个 div, 对 dom 节点的任何操作都应该非常吝啬.

如果可以借助一个变量。来判断是否已经创建过 div 呢？

```javascript
var mask;
var createMask = function () {
    if (mask) return mask;
    else {
        (mask = document), body.appendChild(document.createElement(div));
        return mask;
    }
};
```

看起来不错，到这里的确完成了一个产生单列对象的函数。我们再仔细看这段代码有什么不妥.

首先这个函数是存在一定副作用的，函数体内改变了外界变量 mask 的引用，在多人协作的项目中，createMask 是个不安全的函数。另一方面，mask 这个全局变量�


<!-- {% endraw %} - for jekyll -->