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

首先这个函数是存在一定副作用的，函数体内改变了外界变量 mask 的引用，在多人协作的项目中，createMask 是个不安全的函数。另一方面，mask 这个全局变量并不是非需不可。再来改进一下.

```javascript
var createMask = (function () {
    var mask;
    return function () {
        return (
            mask ||
            (mask = document.body.appendChild(document.createElement("div")))
        );
    };
})();
```

用了个简单的闭包把变量 mask 包起来，至少对于 createMask 函数来讲，它是封闭的.

可能看到这里，会觉得单例模式也太简单了。的确一些设计模式都是非常简单的，即使从没关注过设计模式的概念，在平时的代码中也不知不觉用到了一些设计模式。就像多年前我明白老汉推车是什么回事的时候也想过尼玛原来这就是老汉推车.

GOF 里的 23 种设计模式，也是在软件开发中早就存在并反复使用的模式。如果程序员没有明确意识到他使用过某些模式，那么下次他也许会错过更合适的设计 (这段话来自《松本行弘的程序世界》).

再回来正题，前面那个单例还是有缺点。它只能用于创建遮罩层。假如我又需要写一个函数，用来创建一个唯一的 xhr 对象呢？能不能找到一个通用的 singleton 包装器.

js 中函数是第一型，意味着函数也可以当参数传递。看看最终的代码.

```javascript
var singleton = function (fn) {
    var result;
    return function () {
        return result || (result = fn.apply(this, arguments));
    };
};
var createMask = singleton(function () {
    return document.body.appendChild(document.createElement("div"));
});
```

用一个变量来保存第一次的返回值，如果它已经被赋值过，那么在以后的调用中优先返回该变量。而真正创建遮罩层的代码是通过回调函数的方式传人到 singleton 包装器中的。这种方式其实叫桥接模式。关于桥接模式，放在后面一点点来说.

然而 singleton 函数也不是完美的，它始终还是需要一个变量 result 来寄存 div 的引用。遗憾的是 js 的函数式特性还不足以完全的消除声明和语句.

## \[目录]

-   [单例模式](http://www.alloyteam.com/2012/10/common-javascript-design-patterns/ "单例模式")
-   [简单工厂模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-simple-factory-pattern/ "简单工厂模式")
-   [观察者模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-pattern-observer-mode/ "观察者模式")
-   [适配器模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-adapter-mode/ "适配器模式")
-   [代理模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-proxy-mode/ "代理模式")
-   [桥接模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-mode-bridge-mode/ "桥接模式")
-   [外观模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-appearance-mode/ "外观模式")
-   [访问者模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-the-visitor-pattern/ "访问者模式")
-   [策略模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-strategy-mode/ "策略模式")
-   [模版方法模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-template-method-pattern/ "模版方法模式")
-   [中介者模式](http://www.alloyteam.com/2012/10/javascript-design-pattern-intermediary-model/ "中介者模式")
-   [迭代器模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-iterator-mode/ "迭代器模式")
-   [组合模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-combined-mode/ "组合模式")
-   [备忘录模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-memorandum-mode/ "备忘录模式")
-   [职责链模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-duty-chain/ "职责链模式")
-   [享元模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-flyweight/ "享元模式")
-   [状态模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-state-mode/ "状态模式")

<!-- {% endraw %} - for jekyll -->