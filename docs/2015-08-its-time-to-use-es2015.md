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


<!-- {% endraw %} - for jekyll -->