---
title: 是时候使用 JavaScript 严谨模式 (Strict Mode) 提升团队开发效率
date: 2012-06-27
author: TAT.Kinvix
source_link: http://www.alloyteam.com/2012/06/it-is-time-to-use-the-javascript-strict-mode-strict-mode-to-enhance-the-efficiency-of-team-development/
---

<!-- {% raw %} - for jekyll -->

随着 WebApp 突飞猛进的发展，Javascript 写的 WebApp 规模越来越庞大，比如典型的代表产品[腾讯 WebQQ](http://web.qq.com/)、HTML5 游戏等等，Javascript 越来越需要大量的开发人员多多人协作开发。同时 HTML5、CSS3 等新技术和 NodeJs 项目的高速发展，这几年 JavaScript 语言借着各种新 API 陆续被运用到从移动设备到服务器的多个” 新领域” 中。

但 JavaScript 语言自身由于 ECMAScript 第四版被放弃而一直没有多少改进。和借 HTML5 之名过度宣传的各种新 API 相比，语法层面通过严格模式 (Strict Mode) 进行的改进几乎可以用不为人知来形容。学习了解严格模式之后，就算不马上进行实践，也会让我们对 JavaScript 中坏气味的一方面有更清晰的认识，从而帮助我们写出更好的代码。  
下面的内容翻译自 [It’s time to start using JavaScript strict mode](http://www.nczonline.net/blog/2012/03/13/its-time-to-start-using-javascript-strict-mode/), 作者 Nicholas C.Zakas 参与了 YUI 框架的开发，并撰写了多本前端技术书籍，在我看过关于 JavaScript 严格模式的入门介绍文章中，这篇是写得最好的。

ECMAScript5 中引入的严格模式，通过让 JavaScript 运行环境对一些开发过程中最常见和不易发现的错误做出和当前不同的处理，来让开发者拥有一个” 更好” 的 JavaScript 语言。很长一段时间内，由于只有 Firefox 支持严格模式，我曾对严格模式表示怀疑。但到了今天，所有主流的浏览器都在他们的最新版本中支持了严格模式 (包括 IE10,Opera12 和 Android4,IOS5) 是时候开始使用严格模式了。

## 严格模式能起到什么作用？

严格模式为 JavaScript 引入了很多变化，我把他们分为两类 (明显的和细微的)。细微改进的目标是修复当前 JavaScript 中的一些细节问题，对于这些问题我不在这里进行深入介绍；如果你有兴趣，请阅读 Dmitry Soshnikov 撰写的精彩文档 [ECMA-262-5 in Detail Chapter 2 Strict Mode](http://dmitrysoshnikov.com/ecmascript/es5-chapter-2-strict-mode/)。 我在这里主要介绍严格模式引入的明显变化，那些在你使用严格模式前应该知道的概念和那些对你帮助最大的改变。

在开始学习具体特性前，请记住**严格模式的一大目标是让你能更快更方便的调试**。运行环境在发现问题时显性的抛出错误比默不做声的失败或怪异行事 (未开启严格模式的 JavaScript 运行环境经常这样) 要好。严格模式会抛出更多错误，但这是好事，因为这些错误会唤起你注意并修复很多以前很难被发现的潜在问题。

### 去除 with 关键词

首先，严格模式中去除了 with 语句，包含 with 语句的代码在严格模式中会抛出异常。所以使用严格模式的第一步：确保你的代码中没有使用 with。

    // 在严格模式中以下JavaScript代码会抛出错误
    with (location) {
        alert(href);
    }

### 防止意外为全局变量赋值

其次，局部变量在赋值前必须先进行申明。在启用严格模式之前，为一个未申明的局部变量复制时会自动创建一个同名全局变量。这是 Javacript 程序中最容易出现的错误之一，在严格模式中尝试这么做时会有显性的异常抛出。

```javascript
// 严格模式下会抛出异常
(function () {
    someUndeclaredVar = "foo";
})();
```

### 函数中的 this 不再默认指向全局

严格模式中另一个重要的变化是函数中未被定义或为空 (null or undefined) 的 this 不在默认指向全局环境 (global)。这会造成一些依赖函数中默认 this 行为的代码执行出错，例如:

```javascript
window.color = "red";
function sayColor() {
    alert(this.color);
}
// 在strict模式中会报错, 如果不在严格模式中则提示 “red"
sayColor();
// 在strict模式中会报错, 如果不在严格模式中则提示 “red"
sayColor.call(null);
```

this 在被赋值之前会一直保持为 undefined, 这意味着当一个构造函数在执行时，如果之前没有明确的 new 关键词，会抛出异常。

```javascript
function Person(name) {
    this.name = name;
}
//在严格模式中会报错
var me = Person("Nicholas");
```

在上面的代码中，Person 构造函数运行时因为之前没有 new, 函数中的 this 会保留为 undefined, 由于你不能为 undefined 设置属性，上面的代码会抛出错误。 在非 strict 模式环境中，没有被复制的 this 会默认指向 window 全局变量，运行的结果将是意外的为 window 全局变量设置 name 属性。

### 防止重名

当编写大量代码时，对象属性和函数参数很容易一不小心被设置成一个重复的名字。严格模式在这种情况下会显性的抛出错误

```javascript
//重复的变量名,在严格模式下会报错
function doSomething(value1, value2, value1) {
    //code
}
//重复的对象属性名,在严格模式下会报错:
var object = {
    foo: "bar",
    foo: "baz",
};
```

以上的代码在严格模式中都会被认为是语法错误而在执行前就让你能得到提示。

### 安全的 eval ()

虽然 eval () 语句最终没有被移除，但在严格模式中仍然对它进行了一些改进。最大的改变是在 eval () 中执行的变量和函数申明不会直接在当前作用域中创建相应变量或函数，例如:

```javascript
(function() {
```


<!-- {% endraw %} - for jekyll -->