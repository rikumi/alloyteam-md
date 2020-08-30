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

[前文](http://www.alloyteam.com/2015/03/es6-generator-introduction)介绍过生成器的运行原理和 yield、yield\*、next 等的用法，那么怎么用生成器写出异步执行的同步代码呢？

CO  

* * *

串行的 “同步代码”  

* * *

首先看看下面的代码

串行化执行异步函数

```javascript
co(function* () {
    var a = yield asyncFun1();
    var b = yield asyncFun2(a);
    var c = yield asyncFun3(b); // do somethin with c
})();
```

我知道你有疑问，co 是个什么鬼？co 是一个基于 Generator（生成器）的异步流控制器，可以完美实现写出非阻塞的 “同步代码” 的目的。不解释更多... 直接上 [github](https://github.com/tj/co)，TJ 大神的作品。 源代码算上大把注释也才 200 多行，为了帮助你理解，根据 [co](https://github.com/tj/co) 的思想，我写了个最简单最初级的 co

```javascript
function co(genFun) {
    // 通过调用生成器函数得到一个生成器
    var gen = genFun();
    return function (fn) {
        next();
        function next(err, res) {
            if (err) return fn(err); // 将res传给next，作为上一个yield的返回值
            var ret = gen.next(res); // 如果函数还没迭代玩，就继续迭代
            if (!ret.done) return ret.value(next); // 返回函数最后的值
            fn && fn(null, res);
        }
    };
}
```

结合 yield 和 next 的用法（如果你还不清楚，强烈推荐先看 [ES6 Generator 介绍](http://www.alloyteam.com/2015/03/es6-generator-introduction)），不难理解（才怪，文字上不好解释，希望读者细心体会）为什么可以写出同步的代码，而且确实是异步执行的。

并行的 “同步代码”  

* * *

并行化执行异步函数

普通写法

```javascript
function parallel(callback) {
    var processed = 0;
    var res = [];
    asyncFun1(function (err, a) {
        if (err) return callback(err);
        processed += 1;
        res[0] = a;
        if (processed === 3) callback(null, res);
    });
    asyncFun2(function (err, b) {
        if (err) return callback(err);
        processed += 1;
        res[1] = b;
        if (processed === 3) callback(null, res);
    });
    asyncFun3(function (err, c) {
        if (err) return callback(err);
        processed += 1;
        res[2] = c;
        if (processed === 3) callback(null, res);
    });
}
```

使用 co 的写法

```javascript
co(function* () {
    var res = yield [asyncFun1(), asyncFun2(), asyncFun3()]; // do something with res
})();
```

不能简单得更多了。 友情提示：请使用官方版 [co](https://github.com/tj/co)，前文的简单版 co 不支持并行。 co 不仅支持数组，还支持对象

```javascript
co(function* () {
    var res = yield {
        a: asyncFun1(),
        b: asyncFun2(),
        c: asyncFun3(),
    }; // do something with res
})();
```

这种方式也是并行执行的。

CO API  

* * *

简单看看 co 的最新 API，已改成内部使用 Promise 的方式，不过思想上还是一样的。

### co(fn\*).then( val => )

> Returns a promise that resolves a generator, generator function, or any function that returns a generator.

```javascript
co(function* () {
    return yield Promise.resolve(true);
}).then(
    function (val) {
        console.log(val);
    },
    function (err) {
        console.error(err.stack);
    }
);
```

### var fn = co.wrap(fn\*)

> ```javascript
> var fn = co.wrap(function* (val) {
>     return yield Promise.resolve(val);
> });
> fn(true).then(function (val) {});
> ```

### co.wrap 的使用场景

要想写出 “同步代码”，必须要有一个 Generator Function，可是当前 JS 的很多 API 接受的 callback 都是普通函数，如数组的 forEach、map、reduce 等，更广泛的 Nodejs 本身的 API 的 callback 绝大多数都是普通函数，这时候 co.wrap 就起作用了

```javascript
var newArr = arr.map(
    co.wrap(function* (item) {
        return yield asyncFun(item);
    })
);
```

再来看一个处理事件的

```javascript
stream.on(
    "data",
    co.wrap(function* () {
        yield asyncFun(item);
    })
);
```

可以看到，有了 co.wrap，可以将生成器函数转换成普通函数，从而可以用在任何以普通函数作为 callback 的地方，继续方便的写 “同步代码”。

谁在用 co  

* * *

co 的优点让人无法抗拒，而基于 co 的[第三方库](https://github.com/tj/co/wiki)更是多得受不了。 将 co 用到极致的是 TJ 的另一个作品 [Koa](https://github.com/koajs/koa)... 不解释更多了，谁用谁知道，上手 CO 最快的方法就是写一个基于 Koa 的服务端程序。


<!-- {% endraw %} - for jekyll -->