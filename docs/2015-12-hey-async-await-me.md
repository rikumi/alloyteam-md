---
title: Hey async, await me
date: 2015-12-18
author: TAT.云中飞扬
source_link: http://www.alloyteam.com/2015/12/hey-async-await-me/
---

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
        // 根据用户名获取个人信息
        const info = yield $.ajax(`get_my_info_by_name'?name=${name}`);
        // 打印个人信息
        console.log(info);
    } catch(err) {
        console.error(err);
    }
});
```

再来看看 async/await 的解决方式

```javascript
(async () => {
    try {
        // 获取用户名
        const name = await $.ajax("get_my_name"); // 根据用户名获取个人信息
        const info = await $.ajax(`get_my_info_by_name'?name=${name}`); // 打印个人信息
        console.log(info);
    } catch (err) {
        console.error(err);
    }
})();
```

> Tips：代码片中用到了一些 ES2015 的新语法，不要介意，随便查一些文档就能看懂。

可以看到两种方法在代码的写法上非常相似，不严格的说，仅仅将 function\*换成 async function，同时将函数体里面的 yield 关键字换成 await 关键字即可，顺便还可以把 co 等辅助工具抛弃了。

那么代价，哦不，好处是什么？

1.  更接近自然语言，async/await 比 function\*/yield 更好理解，需要异步执行的函数加一个标记 async，调用的时候在前面加一个 await，表示需要等到异步函数返回了才执行下面的语句
2.  无需依赖其他辅助代码，js 原生能力支持
3.  event listener、大量函数的 callback 等，不支持 generator function，但是支持 async function（所有支持普通 function 的地方都支持 async function），无需 co.wrap 等辅助代码来包装
4.  在某些 JS 引擎执行 generator function 的 bind 方法，会返回一个普通 function，尽管这是引擎的问题，async function 不存在这样的问题，bind 之后还是返回一个 async function，从而可以避免一些意想不到的问题

### async function 的返回值

值得注意的是，和 generator function 固定会返回一个 generator 类似，async function 固定会返回一个 promise，不管函数体里面有没有显示调用 return。

如果有 return，return 后面的值都会被包装成一个 promise，所以 return 'hello world' 和 return Promise.resolve ('hello world') 其实是一样的效果。

由于 async function 返回一个 promise，我们可以跟在 await 后面，类似这样

```javascript
async function asyncFun1() {}
async function asyncFun2() {
    await asyncFun1();
}
async function asyncFun3() {
    await asyncFun2();
}
asyncFun3();
```

其实和下面的代码是一样的效果

```javascript
async function asyncFun1() {}
async function asyncFun2() {}
async function asyncFun3() {
    await asyncFun1();
    await asyncFun2();
}
asyncFun3();
```

这样就达到多个异步函数串行执行的目的了，看起来就跟同步函数一样。

### await\*

多个异步函数，有了串行执行的能力，自然也需要有并行执行的能力。

generator 的方式

    yield [promise1, promise2, ..., promisen]

> Tips：不是 yield\*

async 的方式

    await* [promise1, promise2, ..., promisen]

等效于

    await Promise.all([promise1, promise2, ..., promisen])

不过草案并不推荐 await\*，以后的浏览器也不一定会实现这种语法，还是推荐使用 Promise.all 的方式，不过 babel 等转换工具是支持 await\*的。

### 在 React 中使用 async/await

前文提过，笔者已在生产环境用过 async function 了， 当前 React 正火的不要不要的，前段时间正好借此机会用 React 搭了个内部使用的系统， 以展示个人信息（info）组件为例

个人信息需要发起后台请求才能得到，一般的做法是在 getInitialState 的时候返回一个初始值 info，然后在 componentDidMount 里发起网络请求，得到 info，再更新 state，重新渲染组件。

```javascript
React.createClass({
    getInitialState() {
        return { info: {} };
    },
    componentDidMount() {
        // 获取用户名
        $.ajax("get_my_name")
            .then((name) => {
                // 根据用户名获取个人信息
                // 链式Promise
                return $.ajax(`get_my_info_by_name'?name=${name}`);
            })
            .then((info) => {
                this.setSate({ info });
            })
            .catch((err) => {
                console.error(err);
            });
    },
    render() {
        // render info
    },
});
```

> Tips：使用箭头函数可以避免 this 错乱的问题，你肯定写过下面这样的代码

```javascript
componentDidMount() {
    const self = this;
    // 获取用户名
    $.ajax('get_my_name')
    .then(name => {
        // 根据用户名获取个人信息
        // 链式Promise
        return $.ajax(`get_my_info_by_name'?name=${name}`);
    }).then(function(info) {
        self.setSate({info});
    }).catch(function(err) => {
        console.error(err);
    });
}
```

虽然 async function 的返回值一定是一个 promise，然而我们并不关心 componentDidMount 的返回值，所以可以将一个 async function 赋值给 componentDidMount，一切都会按照预期执行。

```javascript
async componentDidMount() {
    try {
        // 获取用户名
        const name = await $.ajax('get_my_name');
        // 根据用户名获取个人信息
        const info = await $.ajax(`get_my_info_by_name'?name=${name}`);
        this.setSate({info});
    } catch(err) {
        console.error(err);
    }
}
```

> Tips：没有闭包，没有作用域变化，可以放心使用 this，错误处理直接使用 try/catch

##### 最后一步

使用 babel（配合构建工具或者单独使用 babel-cli）将代码转换成兼容 ES5 的等效代码，本文不讲怎么使用 [babel](https://babeljs.io/)，官网有详尽的教程。

如你所愿，在 React 中使用 async/await 就这么简单。

### 总结

-   async/await 才是解决异步回调的最佳实践，终于可以放归 generator 了
-   async/await 只是一套语法糖，其他语言的 async/await 可能是协程或者多线程编程的语法糖，JS 本身是单线程的，async/await 与传统的 callback 或者 promise 执行起来并无两样
-   当下的 JS 引擎还没有原生支持 async/await 的，不过现在就可以使用 babel 转换成 ES5 等效代码，你甚至可以在生产环境中使用
-   虽然 async/await 是 ES2016 才支持的新特性，目前尚处于草案状态，不过其作用和用法基本不会变了，一些其他语言已实现该特性，看来确实是大势所趋