---
title: Nodejs 原生支持的 ES6 特性
date: 2016-07-04
author: TAT.李强
source_link: http://www.alloyteam.com/2016/07/nodejs-native-support-of-the-es6-features/
---

随着 React 的风靡，配合 Webpack 以及 Babel 等技术，越来越多的前端同学将 ECMAScript 2015 (ES6) 的特性运用在项目中，import、export、class、箭头函数、块级作用域等特性屡试不爽。而对于 Node.js 实现的后台代码来说，我们也同样希望使用这些 ES6 特性，下面将以 v4.4.4 (LTS version) 长期支持版本为例展开话题，从兼容性以及性能两方面着手分析 Node.js 对 ES6 的支持情况。

# 兼容性

随着 io.js 的引入，新版的 Node.js 开始原生支持部分 ES6 的特性，既然 ES6 在浏览器端使用需要通过 babel 等编译，在 Node.js 总可以放心使用了吧，然而事实并非如此。

所有的 ES6 特性被划分为三个级别：

1.  shipping：已经分发并默认开启的特性；
2.  staged：已经分发，但需要使用 –harmony 参数开启的特性；
3.  in progress：开发中，还不稳定或者未实现的特性，不推荐使用；

Nodejs 各个版本对 ES6 特性的兼容列表见：<http://node.green/>

## 【shipping】

| ES6 特性                    | Nodejs 兼容性  |
| ------------------------- | ----------- |
| let,const, 块              | strict 模式支持 |
| class 类                   | strict 模式支持 |
| Map，Set 和 WeakMap，WeakSet | 支持          |
| generators                | 支持          |
| 进制转换                      | 支持          |
| 对象字面量扩展                   | 支持          |
| promise                   | 支持          |
| String 对象新 API            | 支持          |
| symbols                   | 支持          |
| 字符串模板                     | 支持          |

这些都是 Node.js 原生支持的特性，除了前两个特性需要在代码前面添加 'use strict'。

## 【staged】

-   Symbol.toStringTag
-   Array.prototype.includes
-   Rest Parameters
-   ......

可通过 node --v8-options | findstr harmony 进行查看。在执行带有这些特性的 js 代码时，需要加上 --harmony 参数，例如：node --harmony app.js。

## 【in progress】

-   harmony_modules (enable "harmony modules")
-   harmony_array_includes (enable "harmony Array.prototype.includes")
-   harmony_regexps (enable "harmony regular expression extensions")
-   harmony_new_target (enable "harmony new.target")
-   ......

可通过 node --v8-options | findstr "in progress" 进行查看。这些特性是那些将要支持（但具体时间未知）的特性，不建议使用。

## Node.js 6.x 已经支持 93% 的 ES6 特性

从上面分析可以看到，Node.js 4.x 版本对 ES6 特性的原生支持并不好，但是好消息是，Node.js 6.x LTS version 将要发布了，带来了性能的大幅提升、更好的测试、更完善的文档、更好的安全性，并广泛支持了 ES6。

在 Node.js 5.0 发布了 6 个月以后，6.0 的时代马上就来了，目标是替换 4.x，计划在 2016 年 10 月成为下一个 LTS version（长期支持的版本），5.0 只是一个过渡版本。考虑到产品的稳定性，建议大家目前还是继续使用 Node.js 4.x，直到 10 月份。

Node.js 6.x 的一项重要改进是使用了 V8 5.0 引擎，支持了 93% 以上的 ES6，包括 destructuring、rest 参数、class 和 super 关键字，ES6 还没有被覆盖到的只剩下一小部分，包括 direct、mutual recursion、iterator closing 等。

让我们一起期待吧！

# 性能

ES6 是大势所趋，尽管目前 Node 下使用 ES6 仍然存在很多问题，这里还是有必要对 ES6 的原生性能做一下对比测试，好让大家有个量化的概念。

环境描述：

CPU：Intel(R) Core(TM)i7-4790 CPU @ 3.60GHz

RAM：16.0GB

操作系统：64bit

node 版本：v4.4.4

## 1. 块级作用域

测试代码如下：

**ES5：**

```javascript
var i = 0;
var start = +new Date(),
    duration;
while (i++ < 1000000) {
    var a = 1;
    var b = "1";
    var c = true;
    var d = {};
    var e = [];
}
duration = +new Date() - start;
console.log(duration);
```

输出结果为 45ms。

**ES6：**

```javascript
"use strict";
let i = 0;
let start = +new Date(),
    duration;
while (i++ < 1000000) {
    const a = 1;
    const b = "1";
    const c = true;
    const d = {};
    const e = [];
}
duration = +new Date() - start;
console.log(duration);
```

输出结果为 29ms。

可见，使用 let，const 声明变量的速度比 var 快了约 55% 左右。

## 2.class

测试代码如下：

**ES5：**

```javascript
var i = 0;
var start = +new Date(),
    duration;
function A() {
    this.name = "小强";
}
A.prototype.getName = function () {
    return this.name;
};
while (i++ < 100000) {
    var a = new A();
    a.getName();
}
duration = +new Date() - start;
console.log(duration);
```

输出结果为 2ms。

**ES6：**

```javascript
"use strict";
let i = 0;
let start = +new Date(),
    duration;
class A {
    constructor() {
        this.name = "小强";
    }
    getName() {
        return this.name;
    }
}
while (i++ < 100000) {
    const a = new A();
    a.getName();
}
duration = +new Date() - start;
console.log(duration);
```

输出结果为 974ms。

可见，class 没有丝毫优势，function 真是快的不得了。

## 3.Map

测试代码如下：

**ES5：**

```javascript
var i = 0;
var start = +new Date(),
    duration;
while (i++ < 1000000) {
    var map = {};
    map["key"] = "value";
}
duration = +new Date() - start;
console.log(duration);
```

输出结果为 11ms。

**ES6：**

```javascript
"use strict";
let i = 0;
let start = +new Date(),
    duration;
while (i++ < 1000000) {
    let map = new Map();
    map.set("key", "value");
}
duration = +new Date() - start;
console.log(duration);
```

输出结果为 151ms。

建议如果不是必须情况，不要使用 Map 等复杂类型。

## 4. 字符串模板

测试代码如下：

**ES5：**

```javascript
var i = 0;
var start = +new Date(),
    duration;
var vars = {
    name: "haha",
    address: "tencent",
};
while (i++ < 1000000) {
    var str = "string text " + vars.name + "string " + vars.address;
}
duration = +new Date() - start;
console.log(duration);
```

输出结果为 8ms。

**ES6：**

```javascript
"use strict";
let i = 0;
let start = +new Date(),
    duration;
let vars = {
    name: "haha",
    address: "tencent",
};
while (i++ < 1000000) {
    let str = `string text ${vars.name} string ${vars.address}`;
}
duration = +new Date() - start;
console.log(duration);
```

输出结果为 50ms。

字符串模板在执行时由于会首先找出其中的模板变量，所以性能也是大不如 ES5 的字符串拼接。

其他特性有兴趣的同学可以一一做测试。

# 总结

对于 ES6 来说，我们不仅要了解其特性的兼容性，也要从性能上做到心中有数，从上面的测试结果可以看到，大部分 ES6 新特性相对 ES5 原生方法要慢得多，但是我依然坚信，ES6 是未来的趋势，随着 Node 版本的更新，相信这些兼容性以及性能问题在不久的将来都将迎刃而解。