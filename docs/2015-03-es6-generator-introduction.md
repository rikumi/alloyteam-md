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
    while(i <= 100) {
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
    console.log('function start');
    var i =
```


<!-- {% endraw %} - for jekyll -->