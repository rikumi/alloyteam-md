---
title: 前端开发者不得不知的 ES6 十大特性
date: 2016-03-07
author: TAT.sheran
source_link: http://www.alloyteam.com/2016/03/es6-front-end-developers-will-have-to-know-the-top-ten-properties/
---

<!-- {% raw %} - for jekyll -->

        [![2](http://www.alloyteam.com/wp-content/uploads/2016/03/2-300x240.jpg)](http://www.alloyteam.com/wp-content/uploads/2016/03/2.jpg)

ES6（ECMAScript2015）的出现，无疑给前端开发人员带来了新的惊喜，它包含了一些很棒的新特性，可以更加方便的实现很多复杂的操作，提高开发人员的效率。

  本文主要针对 ES6 做一个简要介绍。  主要译自：  [http://webapplog.com/ES6/comment-page-1/](http://webapplog.com/es6/comment-page-1/)。也许你还不知道 ES6 是什么，实际上，它是一种新的 javascript 规范。在这个大家都很忙碌的时代，如果你想对 ES6 有一个快速的了解，那么请继续往下读，去了解当今最流行的编程语言 JavaScript 最新一代的十大特性。

以下是 ES6 排名前十的最佳特性列表（排名不分先后）：

1.  Default Parameters（默认参数） in ES6
2.  Template Literals （模板文本）in ES6
3.  Multi-line Strings （多行字符串）in ES6
4.  Destructuring Assignment （解构赋值）in ES6
5.  Enhanced Object Literals （增强的对象文本）in ES6
6.  Arrow Functions （箭头函数）in ES6
7.  Promises in ES6
8.  Block-Scoped Constructs Let and Const（块作用域构造 Let and Const）
9.  Classes（类） in ES6
10. Modules（模块） in ES6

声明：这些列表仅是个人主观意见。它绝不是为了削弱 ES6 其它功能，这里只列出了 10 条比较常用的特性。

首先回顾一下 JavaScript 的历史，不清楚历史的人，很难理解 JavaScript 为什么会这样发展。下面就是一个简单的 JavaScript 发展时间轴：

1、1995：JavaScript 诞生，它的初始名叫 LiveScript。

2、1997：ECMAScript 标准确立。

3、1999：ES3 出现，与此同时 IE5 风靡一时。

4、2000–2005： XMLHttpRequest 又名 AJAX，  在 Outlook Web Access (2000)、Oddpost (2002)，Gmail (2004) 和 Google Maps (2005) 大受重用。

5、2009： ES5 出现，（就是我们大多数人现在使用的）例如 foreach，Object.keys，Object.create 和 JSON 标准。

6、2015：ES6/ECMAScript2015 出现。

历史回顾就先到此，现让我们进入正题。

1.Default Parameters（默认参数） in ES6  

* * *

还记得我们以前不得不通过下面方式来定义默认参数：

```css
var link = function (height, color, url) {
    var height = height || 50;
    var color = color || 'red';
    var url = url || 'http://azat.co';
    ...
}
```

一切工作都是正常的，直到参数值是 0 后，就有问题了，因为在 JavaScript 中，0 表示 fasly，它是默认被 hard-coded 的值，而不能变成参数本身的值。当然，如果你非要用 0 作为值，我们可以忽略这一缺陷并且使用逻辑 OR 就行了！但在 ES6，我们可以直接把默认值放在函数申明里：

```javascript
var link = function(height = 50, color = 'red', url = 'http://azat.co') {
  ...
}
```

顺便说一句，这个语法类似于 Ruby！

2.Template Literals（模板对象） in ES6  

* * *

在其它语言中，使用模板和插入值是在字符串里面输出变量的一种方式。因此，在 ES5，我们可以这样组合一个字符串：

```css
var name = "Your name is " + first + " " + last + ".";
var url = "http://localhost:3000/api/messages/" + id;
```

幸运的是，在 ES6 中，我们可以使用新的语法 $ {NAME}，并把它放在反引号里：

```css
var name = `Your name is ${first} ${last}. `;
var url = `http://localhost:3000/api/messages/${id}`;
```

3.Multi-line Strings （多行字符串）in ES6  

* * *

ES6 的多行字符串是一个非常实用的功能。在 ES5 中，我们不得不使用以下方法来表示多行字符串：

    var roadPoem = 'Then took the other, as just as fair,nt'
        + 'And having perhaps the better claimnt'
        + 'Because it was grassy and wanted wear,nt'
        + 'Though as for that the passing therent'
        + 'Had worn them really about the same,nt';
    var fourAgreements = 'You have the right to be you.n
        You can only be you when you do your best.';

然而在 ES6 中，仅仅用反引号就可以解决了：

    var roadPoem = `Then took the other, as just as fair,
        And having perhaps the better claim
        Because it was grassy and wanted wear,
        Though as for that the passing there
        Had worn them really about the same,`;
    var fourAgreements = `You have the right to be you.
        You can only be you when you do your best.`;

4.Destructuring Assignment （解构赋值）in ES6  

* * *

解构可能是一个比较难以掌握的概念。先从一个简单的赋值讲起，其中 house  和 mouse 是 key，同时 house  和 mouse 也是一个变量，在 ES5 中是这样：


<!-- {% endraw %} - for jekyll -->