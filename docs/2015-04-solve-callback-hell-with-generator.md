---
title: 使用 Generator 解决回调地狱
date: 2015-04-23
author: TAT.云中飞扬
source_link: http://www.alloyteam.com/2015/04/solve-callback-hell-with-generator/
---

<!-- {% raw %} - for jekyll -->

[![callback hell](https://camo.githubusercontent.com/406dc1d925e99d9a5602ae99a569af5c9ab40935/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031352f30332f6e6f64652d6a732d63616c6c6261636b2d68656c6c2e6a7067)](https://camo.githubusercontent.com/406dc1d925e99d9a5602ae99a569af5c9ab40935/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031352f30332f6e6f64652d6a732d63616c6c6261636b2d68656c6c2e6a7067)

（图片来源于互联网）

回调地狱  

* * *

相信每一个 JS 程序员都曾被或者正在被回调地狱所折磨，特别是写过 Nodejs 代码的程序员。

```javascript
asyncFun1(function (err, a) {
    // do something with a in function 1
    asyncFun2(function (err, b) {
        // do something with b in function 2
        asyncFun3(function (err, c) {
            // do something with c in function 3
        });
    });
});
```

JS 的后续传递风格（回调）是这门语言的优点也是这门语言的缺点，优点之一是我们可以很轻易的写出异步执行的代码，而缺点也是由异步引起的，当太多的异步步骤需要一步一步执行，或者一个函数里有太多的异步操作，这时候就会产生大量嵌套的回调，使代码嵌套太深而难以阅读和维护，即所谓的回调地狱。

解决方案  

* * *

随着 JS 这门语言的发展，出现了很多处理回调地狱的解决方案。

具名函数  

* * *

如最基本的，使用具名函数并保持代码层级不要太深

```javascript
function fun3(err, c) {
    // do something with a in function 3
}
function fun2(err, b) {
    // do something with b in function 2
    asyncFun3(fun3);
}
function fun1(err, a) {
    // do something with a in function 1
    asyncFun2(fun2);
}
asyncFun1(fun1);
```

Promise  

* * *

进阶一级的使用 Promise 或者链式 Promise，但是还是需要不少的回调，虽然没有了嵌套

```javascript
asyncFun1()
    .then(function (a) {
        // do something with a in function 1
        asyncFun2();
    })
    .then(function (b) {
        // do something with b in function 2
        asyncFun3();
    })
    .then(function (c) {
        // do somethin with c in function 3
    });
```

Anync  

* * *

使用 async 等辅助库，代价是需要引入额外的库，而且代码上也不够直观

```javascript
async.series(
    [
        function (callback) {
            // do some stuff ...
            callback(null, "one");
        },
        function (callback) {
            // do some more stuff ...
            callback(null, "two");
        },
    ],
    // optional callback
    function (err, results) {
        // results is now equal to ['one', 'two']
    }
);
```

Generator  

* * *

现在，ES6 来了，ES6 带来了新一代解决回调地狱的神器 ——Generator，如果你不知道 Generator 是什么，可以看我之前写的 [ES6 Generator 介绍](http://www.alloyteam.com/2015/03/es6-generator-introduction)。

Generator 本意上应该是一种方便按照某种规则生成元素的迭代器，不过鉴于其特殊的语法和运行原理，可以通过某种神奇的方式写出同步化的异步代码，从而避免回调，使代码更易阅读。

[前文](http://www.alloyteam.com/2015/03/es6-generator-introduction)介绍过生成器的运行原理和 yield、yield\*、next 等的用法，那么怎么用生成器写�


<!-- {% endraw %} - for jekyll -->