---
title: ES6 Generator 介绍
date: 2015-03-30
author: TAT.云中飞扬
source_link: http://www.alloyteam.com/2015/03/es6-generator-introduction/
---

<!-- {% raw %} - for jekyll -->

```c
function* generateNaturalNumber() {
    var i = 0;
    while(i &lt;= 100) {
        yield i;
        i++;
    }
}
```

## 写在前面

文章中的所有代码均可在 chrome 中启用实验性 javascript 功能之后运行 `chrome://flags/#enable-javascript-harmony`。

Generator Function（生成器函数）和 Generator（生成器）是 ES6 引入的新特性，该特性早就出现在了 Python、C# 等其他语言中。

生成器本质上是一种特殊的[迭代器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/The_Iterator_protocol)。

> ES6 里的迭代器并不是一种新的语法或者是新的内置对象 (构造函数)，而是一种协议 (protocol)。所有遵循了这个协议的对象都可以称之为迭代器对象。—— 摘自 MDN 根据迭代器协议可以很容易写出产生 100 以内自然数的迭代器

```javascript
function createNaturalNumber() {
    var i = 0;
    return {
        next: function next() {
            return { done: i >= 100, value: i++ };
        },
    };
}
```

这种迭代器，每次迭代的值都跟上一次的值有关系，此时就需要使用闭包来维护内部状态。

文章开头是一个产生 100 以内自然数的生成器函数，可以看到相比普通函数减少了内部状态的维护，迭代也十分简单，可通过以下方式迭代

```javascript
for (var i of generateNaturalNumber()) {
    console.log(i);
}
```

## 生成器的语法

生成器函数也是一种函数，语法上仅比普通 function 多了个星号\* ，即 function\* ，在其函数体内部可以使用 yield 和 yield\* 关键字。

不过生成器函数的运行原理却和普通函数大不相同， 在 generateNaturalNumber 内部增加一些 log，以便观察其内部运行原理

```javascript
function* generateNaturalNumber() {
    console.log("function start");
    var i = 0; // 为了便于观察log，将循环减小到5
    while (i &lt;= 5) {
        console.log("yield start");
        yield i;
        console.log("yield end");
        i++;
    }
    console.log("function end");
}
var result = generateNaturalNumber();
```

运行以上代码发现什么 log 都没打印出来，继续打印 result 会得到类似这样的输出

    generateNaturalNumber {[[GeneratorStatus]]: "suspended", [[GeneratorFunction]]: function, [[GeneratorReceiver]]: Window}

## 生成器的原理

事实上 result 就是一个生成器，所以调用生成器函数必定会返回一个生成器，同时不会执行内部的任何代码。 那么问题来了，生成器函数内的代码啥时候才执行呢？答案是调用生成器的 next 方法。

直接上结果

![运行结果](http://www.alloyteam.com/wp-content/uploads/2015/03/QQ截图20150330155008.png)

输出的结果和使用普通函数的结果完全一样，只要 done 的值不是 true 就可以一直调用 next。

很直观的可以看到调用 next 返回一个 object，包含两个属性 done 和 value，符合迭代器协议。

同时注意 log，调用第一次 next 打印了 `function start` 和 `yield start`，

后续调用打印了 `yield end` 和 `yield start`，

最后一次调用 next 打印了 `yield end` 和 `function end`，

最后一次 next 是指 done 为 false。

所以运行原理上是这样的

调用第一次 next，从函数开头开始运行，直到遇到第一个 yield，如果没有 yield，就直接运行完整个函数。

遇到 yield 则暂停运行，将 yield 后面的表达式求值之后返回，当作调用 next 返回的 value 属性值。

调用第二次 next，从上一次暂停处继续运行，直到遇到下一个 yield，又暂停，以此循环，直到运行到 return 或者函数结尾，最后退出函数。

## next

上面讲了 next 的返回值，其实 next 也可以接受一个任意参数，该参数将作为上一个 yield 的返回值。

什么？yield 也有返回值？有点绕？很正常。

yield 作为一个关键字，也有返回值，其返回值就是下一次调用 next 传入的参数。

假设在产生自然数的时候，我想跳过某些值或者控制下一次开始的值

```javascript
function* generateNaturalNumber() {
    var i = 0;
    while (i &lt;= 100) {
        var j = yield i;
        j && (i = j);
        i++;
    }
}
```

![next 传参](http://www.alloyteam.com/wp-content/uploads/2015/03/QQ截图20150330144105.png)

生成器的这个特性非常重要，利用该特性可以用同步的方式写出异步执行的代码，从而解决回调地狱（Callback Hell）的问题，笔者会在下一篇文章详细讲述。

## yield 和 yield\*

```c
function* genFun1() {
    yield 2;
    yield 3;
    yield 4;
}
function* genFun2() {
    yield 1;
    yield* genFun1();
    yield 5;
}
for(var i of genFun2()) {
    console.log(i);
}
```

运行以上代码会连续输出 1，2，3，4，5

注意 genFun2 的第二行不可写成 `yield genFun1`、`yield genFun1()`和 `yield* genFun1`，

前两种写法会和预期运行结果不一致，最后一种写法会报错。

再看代码

```javascript
function* genFun2() {
    yield 1;
    yield* [2, 3, 4];
    yield 5;
}
for (var i of genFun2()) {
    console.log(i);
}
```

也会连续输出 1，2，3，4，5

yield 后面可以跟任何表达式，表达式的值将作为调用 next 返回值的 value 属性值。

yield\* 后面只能跟迭代器，所以 `yield* genFun1` 会因为 genFun1 不是一个迭代器而报错。

yield\* 的官方名字叫做 [Delegating yield](http://wiki.ecmascript.org/doku.php?id=harmony:generators)。

yield\* 的功能是将迭代控制权交给后面的迭代器，达到递归迭代的目的，就好比将 genFun1 的代码直接写在 genFun2 里面一样。


<!-- {% endraw %} - for jekyll -->