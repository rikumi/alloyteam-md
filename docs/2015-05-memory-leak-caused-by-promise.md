---
title: 关于 Promise 内存泄漏的问题
date: 2015-05-30
author: TAT.云中飞扬
source_link: http://www.alloyteam.com/2015/05/memory-leak-caused-by-promise/
---

<!-- {% raw %} - for jekyll -->

[![Promise](https://camo.githubusercontent.com/936320d9d13426d9631ff49d817b5d542e135d10/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031352f30352f515125453625383825414125453525394225424532303135303533303230313332382e706e67)](http://www.alloyteam.com/wp-content/uploads/2015/05/QQ%E6%88%AA%E5%9B%BE20150530201328.png)

[Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)  

======================================================================================================

Promise 是 ES6 的新特性，在 ES6 之前各大浏览器、各种 polyfill 和各种 js 执行环境都针对 Promise 进行了自己的实现，不过实现上大同小异。

V8 Promise 内存泄漏  

==================

不过 V8 对 Promise 的实现存在内存泄漏问题，当一个 promise 无法 resolve 也无法 reject 的时候，就会发生内存泄漏。

一个很容易造成 Promise 内存泄漏的场景便是递归 Promise 或者嵌套 Promise。

为方便观察内存使用情况，下面是一段在 Nodejs 里面运行的代码

```javascript
(function () {
    // 记录Promise链的长度
    var i = 0;
    function run() {
        return new Promise(function (resolve) {
            // 每增加10000个Promise打印一次内存使用情况
            if (i % 10000 === 0) console.log(i);
            i++; // 模拟一个异步操作
            setTimeout(function () {
                // 100000个Promise之后退出
                if (i === 10000 * 10) return resolve(); // 如果resolve的参数是一个Promise，外层Promise将接管这个Promise的状态，构成嵌套Promise
                resolve(run());
            }, 0);
        }).then(function () {});
    }
    run();
})();
```

在我的电脑上输出：

    { rss: 18649088, heapTotal: 12359168, heapUsed: 5261784 }
    { rss: 47480832, heapTotal: 54668544, heapUsed: 23838080 }
    { rss: 78712832, heapTotal: 69115648, heapUsed: 38977672 }
    { rss: 96018432, heapTotal: 84594688, heapUsed: 56701128 }
    { rss: 112631808, heapTotal: 101105664, heapUsed: 72469704 }
    { rss: 129875968, heapTotal: 118648576, heapUsed: 88569232 }
    { rss: 147075072, heapTotal: 135159552, heapUsed: 104614336 }
    { rss: 164286464, heapTotal: 151670528, heapUsed: 120667096 }
    { rss: 181628928, heapTotal: 169213440, heapUsed: 136718144 }
    { rss: 193110016, heapTotal: 180564736, heapUsed: 157979448 }

关键代码就是这一行

    // 如果resolve的参数是一个Promise，外层Promise将接管这个Promise的状态，构成嵌套Promise


<!-- {% endraw %} - for jekyll -->