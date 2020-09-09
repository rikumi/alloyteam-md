---
title: Hey async, await me
date: 2015-12-18
author: TAT.云中飞扬
source_link: http://www.alloyteam.com/2015/12/hey-async-await-me/
---

<!-- {% raw %} - for jekyll -->

### 背景

笔者在前面的文章介绍过[如何使用 generator 来解决 callback hell](http://www.alloyteam.com/2015/04/solve-callback-hell-with-generator/)，尽管现在多数浏览器特别是移动端浏览器还不支持该 ES2015 新特性，但你可以通过 [Babel](https://babeljs.io/) 等转换工具转化成 ES5 兼容的等效代码，从而在生产环境使用。

不过使用 generator 来解决 callback hell 似乎有点不务正业，毕竟 generator 是生成器，属于 Iterator 的一种，设计之初是用来生成一种特殊的迭代器的。

另外还有两点也可以算是 generator 解决 callback hell 问题的缺陷：

1.  generator 需要从 generator function 执行得到，而 generator function 执行之后只会返回一个 generator，不管里面是怎样的代码，与我们通常对函数的认知存在差异
2.  如果想执行 generator function 的函数体，需要不断调用返回的 generator 的 next 方法，这样就决定了必须依赖 [co](https://github.com/tj/co) 或 [bluebird.coroutine](http://bluebirdjs.com/docs/api/promise.coroutine.html) 等其他辅助代码或者手动执行 next，来保证 generator 不断 next 下去

> Tips：文章 [ES6 Generator 介绍](http://www.alloyteam.com/2015/03/es6-generator-introduction/)有介绍 generator 和 generator function，以及它们之间的关系和区别。

众所周知，ES2015 来的太晚了，而现在，TC39 决定加快脚步，也许每年都会有新版本发布，明年可能会发布 ES2016。ES2016 终于给 JS 带来了 async/await 原生支持，而其他语言如 C#、Python 等更早就支持上了。

而 async/await 正是本文要重点介绍的用来解决 callback hell 问题的终极大杀器。 虽然离浏览器或 nodejs 支持 ES2016 还有很久很久，但依靠 babel 任然可以转换出当前环境就支持的代码。

本文的最后还将分享笔者在生产环境使用 async/await 的经验，对，就是生产环境。

### async/await 语法

函数声明

```javascript
async function asyncFunc() {}
```

函数表达式

```javascript
const asyncFunc = async function () {};
```

匿名函数

```javascript
async function() {}
```

箭头函数

```javascript
async () => {};
```

类方法

    Class someClass {
        async asyncFunc() {}
    }

没什么特别的，就在我们通常的写法前加上关键字 async 就行了，就像 generator function 仅仅比普通 function 多了一个\*。

function 前面加上 async 关键字，表示该 function 需要执行异步代码。 async function 函数体内可以使用 await 关键字，且 await 关键字只能出现在 async function 函数体内，这一点和 generator function 跟 yield 的关系一样。

```javascript
async function asyncFunc() {
    await anything;
}
```

await 关键字可以跟在任意变量或者表达式之前，从字面很好理解该关键字有等待的意思，所以更有价值的用法是 await 后面跟一个异步过程，通常是 Promise，

```javascript
async function asyncFunc() {
    await somePromise;
}
```

如果用 generator 来解决 callback hell，必须配合使用 yield 关键字和 next 方法，而理解清楚 yield 的作用和返回值以及 next 的参数作用就够消化两天了，await 关键字不像 yield 关键字和 next 方法这么难以理解，它的意思就是等待，作用也是等待，而且一个关键字就够了。

> Tips：[前文](http://www.alloyteam.com/2015/03/es6-generator-introduction/)介绍 yield 的时候还提到了 yield\*，其实 ES2016 草案里面也提到了 await\*，不过它不是标准的一部分，草案并不要求必须实现，而且草案并不建议使用，不过后文还是会提到 await\*的用法。

### 做正确的事

用 generator 来解决异步函数回调问题始终觉得有些别扭，现在就让它做回本职工作吧，回调问题就交由 async/await 来解决 —— 做正确的事。

先来回顾一下 generator 配合 co 来解决异步回调问题的方法，首先 yy 一个场景，见注释

```javascript
co(*() => {
    try {
        // 获取用户名
        const name = yield $.ajax('get_my_name');
```


<!-- {% endraw %} - for jekyll -->