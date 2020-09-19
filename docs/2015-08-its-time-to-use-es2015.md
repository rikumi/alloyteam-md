---
title: 是时候使用 ES 2015 了
date: 2015-08-31
author: TAT.云中飞扬
source_link: http://www.alloyteam.com/2015/08/its-time-to-use-es2015/
---

<!-- {% raw %} - for jekyll -->

在 Web 中使用 ES 2015  

====================

想要在浏览器端使用 ES 2015 最新语法，其实很简单，只需要一个转换器即可，[Babel](https://babeljs.io/) 是 ES 2015 最流行的转换器之一，Babel 加上各种插件和 polyfill 能基本上支持绝大部分新语法。

在你的构建中，插入一步使用 Babel 将 ES 2015 的代码转换成完全兼容 ES5 的代码的任务，你甚至都不必了解 Babel 的具体用法，就可以爽爽的开始写 ES 2015 代码了。

使用 gulp-babel 在需要的地方转换一下即可。

```javascript
var gulp = require("gulp");
var babel = require("gulp-babel");
gulp.task("babel", function () {
    return gulp.src("src/js/*.js").pipe(babel()).pipe(gulp.dest("dist"));
});
```

笔者在实际生产中已使用到一些 ES 2015 新特性，通过 Babel 转换成完全兼容 ES5 的语法，然后发布到正式环境，大大提高了开发体验。下面将一部分使用的较多，能改善编码体验的点列出来，当然也有一些坑，希望读者能尽早熟悉尽早投入 ES 2015 的怀抱。

### 最基本的：let 和 const

```javascript
let a = 1;
const A = 2;
```

转换成

```javascript
var a = 1;
var A = 2;
```

Babel 只是单纯将 let 和 const 转换成了 var，并没有真正实现块作用域和常量的功能，也没有消除变量提升的问题，这样避免了引入一些额外的代码，而且也已经完全与 ES5 兼容了。

### 模板字符串

```javascript
const name = "Jarvis";
const template = `My name is ${name}`;
```

转换成

```javascript
var name = "Jarvis";
var template = "My name is " + name;
```

模板字符串（两个反丿号）是 ES 2015 的一个重要的新功能，允许模板字符串里面通过 ${variable} 的方式直接嵌变量，可以替代老旧的字符串拼接方法，而且里面可以任意使用单双引号。

这个改进很实用，现在就可以用起来了，再也不用担心单双引号谁该写在谁的外面了。

模板字符串还直接支持多行文本，如：

```javascript
const tmpl = `text line 1,
    text line 2,
    textline 3`;
```

在拼接 html 的时候特别有用。

### 箭头函数

箭头函数语法：

```javascript
const fn = () => {
    console.log("hello world");
};
```

转换成

```javascript
var fn = function () {
    console.log("hello world");
};
```

箭头函数通常比匿名函数还要简洁，几乎可以取代所有使用 function 的地方，不过用起来别太嗨了，下面有这个坑还是值得注意。

箭头函数最大的特点在于 this 关键字在声明或者定义箭头函数的时候就已经被绑定好了，而且不会改变，这个特性用来解决 setTimeout 等一些异步函数 this 会改变的问题很爽，但下面这个却是个大问题：

```javascript
$("#selector").on("tap", () => {
    $(this).addClass("new");
});
```

将会转换成

```javascript
var _this = this;
$("#selector").on("tap", function () {
    $(_this).addClass("new");
});
```

看出问题了吧，相当于箭头函数是在事件监听器外面就先定义好了，这时候的 this 指向的全局变量，并非我们期望中的那个 dom 元素。

这时候就不适合用箭头函数了，除非你明确知道 this 指向的谁或者根本用不上 this。

### ...args

我在前面的文章介绍过 V8 新的 [Strong Mode](http://www.alloyteam.com/2015/06/strong-mode-jie-shao/) 已经不允许使用 arguments 关键字了，取而代之是...args。

```javascript
function (...args) {
    console.log(args);
}
```

这里的 args 是个真正的数组了，使用到 arguments 的地方推荐都换成...args 吧，还能避免一些意想不到的坑，比如下面这个。

箭头函数里面是获取不到 argunents 变量的，如果你这样写

```javascript
const fn = () => {
    console.log(arguments);
};
```

将被转换成

```javascript
var _arguments = arguments;
var fn = function () {
    console.log(_arguments);
};
```

这时候的 arguments 映射的是外层函数的 arguments，如果使用...args 就不会有这个问题。

### 默认参数

默认函数参数我想用处非常大了，从此再也不用写一大堆参数判断的代码了。

```javascript
function fn(params = {}, options = {}, callback = () => {}) {
    // TODO
}
```

再也不用去费力判断哪一个参数才是 callback 了。 Babel 已经完全支持默认参数一些强大的语法，如

```javascript
function f([x, y] = [1, 2], { z: z } = { z: 3 }) {
    return x + y + z;
}
```

### 对象属性缩写

```javascript
const url = "http://www.alloyteam.com";
const type = "GET";
const timeout = 10000;
$.ajax({
    url,
    type,
    timeout,
});
```

转换成

```javascript
var url = "http://www.alloyteam.com";
var type = "GET";
var timeout = 10000;
$.ajax({
    url: url,
    type: type,
    timeout: timeout,
});
```

属性缩写还可与解构赋值搭配使用

```javascript
// options: {url: url, type: type, timeout: timeout}
const { url, type } = options;
const opt = { url, type };
```

这样轻松就能让 opt 成为 options 的一个子集了，在做字段过滤和参数白名单过滤的时候很有用。

好了，时间已经很晚了，本期就先写到这里了。


<!-- {% endraw %} - for jekyll -->