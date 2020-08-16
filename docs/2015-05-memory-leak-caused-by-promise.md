---
title: 关于 Promise 内存泄漏的问题
date: 2015-05-30
author: TAT.云中飞扬
source_link: http://www.alloyteam.com/2015/05/memory-leak-caused-by-promise/
---

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
    resolve(run());

嵌套的 Prosise 形成了一个 Promise 状态链，外层 Promise 等待内层 Promise 调用 resolve 或者 reject，因为 V8 原生的 Promise 实现存在缺陷，这样使用之后会积累一大坨 Promise，无法被释放，所以就造成了内存泄漏。

有趣的是，将代码稍作修改，将第 5 行的 return 去掉，却不会出现内存泄漏的问题

```javascript
(function () {
    // 记录Promise链的长度
    var i = 0;
    function run() {
        // 去掉return
        new Promise(function (resolve) {
            // 每增加10000个Promise打印一次内存使用情况
            if (i % 10000 === 0) console.log(process.memoryUsage());
            i++; // 模拟一个异步操作
            setImmediate(function () {
                // 100000个Promise之后退出
                if (i === 10000 * 10) return resolve(); // 如果resolve的参数是一个Promise，外层Promise将接管这个Promise的状态，构成嵌套Promise
                resolve(run());
            });
        }).then(function () {});
    }
    run();
})();
```

输出：

    { rss: 18636800, heapTotal: 12359168, heapUsed: 5261760 }
    { rss: 26435584, heapTotal: 18550784, heapUsed: 8178720 }
    { rss: 26472448, heapTotal: 18550784, heapUsed: 6725168 }
    { rss: 26472448, heapTotal: 18550784, heapUsed: 9352496 }
    { rss: 26472448, heapTotal: 18550784, heapUsed: 7852088 }
    { rss: 26472448, heapTotal: 18550784, heapUsed: 6351640 }
    { rss: 26472448, heapTotal: 18550784, heapUsed: 8977488 }
    { rss: 26472448, heapTotal: 18550784, heapUsed: 7477072 }
    { rss: 26472448, heapTotal: 18550784, heapUsed: 5976560 }
    { rss: 26476544, heapTotal: 18550784, heapUsed: 8602336 }

究其原因是没构成嵌套 Promise，run 返回了 undefined，不是一个 Promise。

为了证明 V8 的实现确实存在问题，我们来看看 [bluebird](https://github.com/petkaantonov/bluebird) 的实现，bluebird 是众多 Promise polyfill 中的一个。

使用 bluebird 来解决这个问题非常简单，只用将 Promise 替换成 bluebird 的实现，同时为每个 Promise 调用 done，关于为什么 Prosime 需要 done，请看[这里](http://bahmutov.calepin.co/why-promises-need-to-be-done.html)

```javascript
var Promise = require("bluebird");
(function () {
    // 记录Promise链的长度
    var i = 0;
    function run() {
        return new Promise(function (resolve) {
            // 每增加10000个Promise打印一次内存使用情况
            if (i % 10000 === 0) console.log(process.memoryUsage());
            i++; // 模拟一个异步操作
            setImmediate(function () {
                // 100000个Promise之后退出
                if (i === 10000 * 10) return resolve(); // 如果resolve的参数是一个Promise，外层Promise将接管这个Promise的状态，构成嵌套Promise
                resolve(run());
            });
        })
            .then(function () {})
            .done();
    }
    run();
})();
```

    { rss: 22421504, heapTotal: 14423040, heapUsed: 6167664 }
    { rss: 27738112, heapTotal: 18550784, heapUsed: 8497792 }
    { rss: 27770880, heapTotal: 18550784, heapUsed: 7449536 }
    { rss: 27774976, heapTotal: 18550784, heapUsed: 10486392 }
    { rss: 27774976, heapTotal: 18550784, heapUsed: 9395416 }
    { rss: 27774976, heapTotal: 18550784, heapUsed: 8304040 }
    { rss: 27779072, heapTotal: 18550784, heapUsed: 7212688 }
    { rss: 27779072, heapTotal: 18550784, heapUsed: 10247776 }
    { rss: 27787264, heapTotal: 18550784, heapUsed: 9177776 }
    { rss: 27803648, heapTotal: 18550784, heapUsed: 8088968 }

done 的作用是告诉引擎没有任何地方需要等 Promise resolve 或者 reject 了，可以 gc 掉了，因为状态已转移到内层 Promise 去了，只用保留最内层 Promise 即可。

到目前为止 V8 引擎还没实现原生的 Promise.done。

总结一下  

=======

-   随着 ES6/ES7 的快速发展，Promise 显得日益重要，今后将会有大量基于 Promise 的 API 出现
-   嵌套 Promise 应该属于反模式了吧，尽量避免写出这种代码
-   确保每一个 Promise 都会调用 done，引擎不存在这种缺陷的情况除外
-   相信 Promise 会越来越好用，各个 js 引擎也会对 Promise 进行优化

以上纯属基于简单技术模型的研究，实际中遇到 Promise 内存泄漏往往很不好排查问题，如发现文章中有不足之处还望在留言中指出。