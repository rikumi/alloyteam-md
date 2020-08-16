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

    var data = $('body').data(), // data has properties house and mouse
       house = data.house,
       mouse = data.mouse;

以及在 node.js 中用 ES5 是这样：

    var jsonMiddleware = require('body-parser').jsonMiddleware ;
    var body = req.body, // body has username and password
       username = body.username,
       password = body.password;  

在 ES6，我们可以使用这些语句代替上面的 ES5 代码：

    var { house, mouse} = $('body').data(); // we'll get house and mouse variables
    var {jsonMiddleware} = require('body-parser');
    var {username, password} = req.body;

这个同样也适用于数组，非常赞的用法：

    var [col1, col2]  = $('.column'),
       [line1, line2, line3, , line5] = file.split('n');

我们可能需要一些时间来习惯解构赋值语法的使用，但是它确实能给我们带来许多意外的收获。

5.Enhanced Object Literals （增强的对象字面量）in ES6  

* * *

使用对象文本可以做许多让人意想不到的事情！通过 ES6，我们可以把 ES5 中的 JSON 变得更加接近于一个类。

下面是一个典型 ES5 对象文本，里面有一些方法和属性：

```javascript
var serviceBase = { port: 3000, url: "azat.co" },
    getAccounts = function () {
        return [1, 2, 3];
    };
var accountServiceES5 = {
    port: serviceBase.port,
    url: serviceBase.url,
    getAccounts: getAccounts,
    toString: function () {
        return JSON.stringify(this.valueOf());
    },
    getUrl: function () {
        return "http://" + this.url + ":" + this.port;
    },
    valueOf_1_2_3: getAccounts(),
};
```

如果我们想让它更有意思，我们可以用 Object.create 从 serviceBase 继承原型的方法：

```javascript
var accountServiceES5ObjectCreate = Object.create(serviceBase);
var accountServiceES5ObjectCreate = {
    getAccounts: getAccounts,
    toString: function () {
        return JSON.stringify(this.valueOf());
    },
    getUrl: function () {
        return "http://" + this.url + ":" + this.port;
    },
    valueOf_1_2_3: getAccounts(),
};
```

我们知道，accountServiceES5ObjectCreate  和 accountServiceES5  并不是完全一致的，因为一个对象 (accountServiceES5) 在\_\_proto\_\_对象中将有下面这些属性：

[![图片 1](http://www.alloyteam.com/wp-content/uploads/2016/03/图片1.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/图片1.png)

为了方便举例，我们将考虑它们的相似处。所以在 ES6 的对象文本中，既可以直接分配 getAccounts: getAccounts, 也可以只需用一个 getAccounts，此外，我们在这里通过\_\_proto\_\_（并不是通过’proto’）设置属性，如下所示：

```javascript
var serviceBase = {port: 3000, url: 'azat.co'},
getAccounts = function(){return [1,2,3]};
var accountService = {
    __proto__: serviceBase,
    getAccounts,
```

另外，我们可以调用 super 防范，以及使用动态 key 值 (valueOf_1_2_3):

```javascript
    toString() {
     return JSON.stringify((super.valueOf()));
    },
    getUrl() {return "http://" + this.url + ':' + this.port},
    [ 'valueOf_' + getAccounts().join('_') ]: getAccounts()
};
console.log(accountService)
```

[![图片 3](http://www.alloyteam.com/wp-content/uploads/2016/03/图片3.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/图片3.png)

ES6 对象文本是一个很大的进步对于旧版的对象文本来说。

6\.**Arrow Functions in（箭头函数） ES6**  

* * *

这是我迫不及待想讲的一个特征，CoffeeScript  就是因为它丰富的箭头函数让很多开发者喜爱。在 ES6 中，也有了丰富的箭头函数。这些丰富的箭头是令人惊讶的因为它们将使许多操作变成现实，比如，

以前我们使用闭包，this 总是预期之外地产生改变，而箭头函数的迷人之处在于，现在你的 this 可以按照你的预期使用了，身处箭头函数里面，this 还是原来的 this。

有了箭头函数在 ES6 中，  我们就不必用 that = this 或 self =  this   或 \_this = this   或.bind (this)。例如，下面的代码用 ES5 就不是很优雅：

```javascript
var _this = this;
$(".btn").click(function (event) {
    _this.sendData();
});
```

在 ES6 中就不需要用 \_this = this：

    $('.btn').click((event) =>{
      this.sendData();
    })

不幸的是，ES6 委员会决定，以前的 function 的传递方式也是一个很好的方案，所以它们仍然保留了以前的功能。

下面这是一个另外的例子，我们通过 call 传递文本给 logUpperCase ()  函数在 ES5 中：

```javascript
var logUpperCase = function () {
    var _this = this;
    this.string = this.string.toUpperCase();
    return function () {
        return console.log(_this.string);
    };
};
logUpperCase.call({ string: "ES6 rocks" })();
```

而在 ES6，我们并不需要用\_this 浪费时间：

```javascript
var logUpperCase = function () {
    this.string = this.string.toUpperCase();
    return () => console.log(this.string);
};
logUpperCase.call({ string: "ES6 rocks" })();
```

请注意，只要你愿意，在 ES6 中 => 可以混合和匹配老的函数一起使用。当在一行代码中用了箭头函数，它就变成了一个表达式。它将暗地里返回单个语句的结果。如果你超过了一行，将需要明确使用 return。

这是用 ES5 代码创建一个消息数组：

    var ids = ['5632953c4e345e145fdf2df8','563295464e345e145fdf2df9'];
    var messages = ids.map(function (value) {
      return "ID is " + value; // explicit return
    });

用 ES6 是这样：

    var ids = ['5632953c4e345e145fdf2df8','563295464e345e145fdf2df9'];
    var messages = ids.map(value => `ID is ${value}`); // implicit return

请注意，这里用了字符串模板。

在箭头函数中，对于单个参数，括号 () 是可选的，但当你超过一个参数的时候你就需要他们。

在 ES5 代码有明确的返回功能：

    var ids = ['5632953c4e345e145fdf2df8', '563295464e345e145fdf2df9'];
    var messages = ids.map(function (value, index, list) {
      return 'ID of ' + index + ' element is ' + value + ' '; // explicit return
    });

在 ES6 中有更加严谨的版本，参数需要被包含在括号里并且它是隐式的返回：

    var ids = ['5632953c4e345e145fdf2df8','563295464e345e145fdf2df9'];
    var messages = ids.map((value, index, list) => `ID of ${index} element is ${value} `); // implicit return

7. Promises in ES6  

* * *

Promises  是一个有争议的话题。因此有许多略微不同的 promise  实现语法。Q，bluebird，deferred.js，vow, avow, jquery  一些可以列出名字的。也有人说我们不需要 promises，仅仅使用异步，生成器，回调等就够了。但令人高兴的是，在 ES6 中有标准的 Promise 实现。

下面是一个简单的用 setTimeout () 实现的异步延迟加载函数:

```javascript
setTimeout(function () {
    console.log("Yay!");
}, 1000);
```

在 ES6 中，我们可以用 promise 重写:

```javascript
var wait1000 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 1000);
}).then(function () {
    console.log("Yay!");
});
```

或者用 ES6 的箭头函数：

```javascript
var wait1000 = new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
}).then(() => {
    console.log("Yay!");
});
```

到目前为止，代码的行数从三行增加到五行，并没有任何明显的好处。确实，如果我们有更多的嵌套逻辑在 setTimeout () 回调函数中，我们将发现更多好处：

```javascript
setTimeout(function () {
    console.log("Yay!");
    setTimeout(function () {
        console.log("Wheeyee!");
    }, 1000);
}, 1000);
```

在 ES6 中我们可以用 promises 重写：

```javascript
var wait1000 = () =>
    new Promise((resolve, reject) => {
        setTimeout(resolve, 1000);
    });
wait1000()
    .then(function () {
        console.log("Yay!");
        return wait1000();
    })
    .then(function () {
        console.log("Wheeyee!");
    });
```

还是不确信 Promises  比普通回调更好？其实我也不确信，我认为一旦你有回调的想法，那么就没有必要额外增加 promises 的复杂性。

虽然，ES6  有让人崇拜的 Promises 。Promises  是一个有利有弊的回调但是确实是一个好的特性，更多详细的信息关于 promise:[Introduction to ES6 Promises](http://jamesknelson.com/grokking-es6-promises-the-four-functions-you-need-to-avoid-callback-hell).

**8.Block-Scoped Constructs Let and Const（块作用域和构造 let 和 const）**  

* * *

在 ES6 代码中，你可能已经看到那熟悉的身影 let。在 ES6 里 let 并不是一个花俏的特性，它是更复杂的。Let 是一种新的变量申明方式，它允许你把变量作用域控制在块级里面。我们用大括号定义代码块，在 ES5 中，块级作用域起不了任何作用：

```javascript
function calculateTotalAmount(vip) {
    var amount = 0;
    if (vip) {
        var amount = 1;
    }
    {
        // more crazy blocks!
        var amount = 100;
        {
            var amount = 1000;
        }
    }
    return amount;
}
console.log(calculateTotalAmount(true));
```

结果将返回 1000，这真是一个 bug。在 ES6 中，我们用 let 限制块级作用域。而 var 是限制函数作用域。

```javascript
function calculateTotalAmount(vip) {
    var amount = 0; // probably should also be let, but you can mix var and let
    if (vip) {
        let amount = 1; // first amount is still 0
    }
    {
        // more crazy blocks!
        let amount = 100; // first amount is still 0
        {
            let amount = 1000; // first amount is still 0
        }
    }
    return amount;
}
console.log(calculateTotalAmount(true));
```

这个结果将会是 0，因为块作用域中有了 let。如果（amount=1）. 那么这个表达式将返回 1。谈到 const，就更加容易了；它就是一个不变量，也是块级作用域就像 let 一样。下面是一个演示，这里有一堆常量，它们互不影响，因为它们属于不同的块级作用域:

```javascript
function calculateTotalAmount(vip) {
    const amount = 0;
    if (vip) {
        const amount = 1;
    }
    {
        // more crazy blocks!
        const amount = 100;
        {
            const amount = 1000;
        }
    }
    return amount;
}
console.log(calculateTotalAmount(true));
```

从我个人看来，let  和 const 使这个语言变复杂了。没有它们的话，我们只需考虑一种方式，现在有许多种场景需要考虑。

9. Classes （类）in ES6  

* * *

如果你喜欢面向对象编程（OOP），那么你将喜爱这个特性。以后写一个类和继承将变得跟在 facebook 上写一个评论那么容易。

类的创建和使用真是一件令人头疼的事情在过去的 ES5 中，因为没有一个关键字 class （它被保留，但是什么也不能做）。在此之上，大量的继承模型像 [pseudo classical](http://javascript.info/tutorial/pseudo-classical-pattern), [classical](http://www.crockford.com/javascript/inheritance.html), [functional](http://javascript.info/tutorial/factory-constructor-pattern)  更加增加了混乱，JavaScript  之间的宗教战争只会更加火上浇油。

用 ES5 写一个类，有很多种方法，这里就先不说了。现在就来看看如何用 ES6 写一个类吧。ES6 没有用函数，而是使用原型实现类。我们创建一个类 baseModel ，并且在这个类里定义了一个 constructor  和一个 getName () 方法：

```css
class baseModel {
    constructor(options, data) {
        // class constructor，node.js 5.6暂时不支持options = {}, data = []这样传参
        this.name = "Base";
        this.url = "http://azat.co/api";
        this.data = data;
        this.options = options;
    }
    getName() {
        // class method
        console.log(`Class name: ${this.name}`);
    }
}
```

注意我们对 options  和 data 使用了默认参数值。此外方法名也不需要加 function 关键字，而且冒号 (：) 也不需要了。另外一个大的区别就是你不需要分配属性 this。现在设置一个属性的值，只需简单的在构造函数中分配。

AccountModel  从类 baseModel  中继承而来:

```javascript
class AccountModel extends baseModel {
    constructor(options, data) {
```

为了调用父级构造函数，可以毫不费力的唤起 super () 用参数传递：

```css
           super({private: true}, ['32113123123', '524214691']); //call the parent method with super
       this.name = 'Account Model';
       this.url +='/accounts/';
    }
```

如果你想做些更好玩的，你可以把 accountData 设置成一个属性：

        get accountsData() { //calculated attribute getter
        // ... make XHR
            return this.data;
        }
    }

那么，你如何调用他们呢？它是非常容易的：

```javascript
let accounts = new AccountModel(5);
accounts.getName();
console.log("Data is %s", accounts.accountsData);
```

结果令人惊讶，输出是：

Class name: Account Model

Data is  32113123123,524214691

10. Modules （模块）in ES6  

* * *

众所周知，在 ES6 以前 JavaScript 并不支持本地的模块。人们想出了 AMD，RequireJS，CommonJS 以及其它解决方法。现在 ES6 中可以用模块 import  和 export  操作了。 

在 ES5 中，你可以在 <script> 中直接写可以运行的代码（简称 IIFE），或者一些库像 AMD。然而在 ES6 中，你可以用 export 导入你的类。下面举个例子，在 ES5 中，module.js 有 port 变量和 getAccounts  方法:

```javascript
module.exports = {
  port: 3000,
  getAccounts: function() {
    ...
  }
}
```

在 ES5 中，main.js 需要依赖 require ('module')  导入 module.js：

```javascript
var service = require("module.js");
console.log(service.port); // 3000
```

但在 ES6 中，我们将用 export and import。例如，这是我们用 ES6  写的 module.js 文件库：

    export var port = 3000;
    export function getAccounts(url) {
      ...
    }

如果用 ES6 来导入到文件 main.js 中，我们需用 import {name} from 'my-module' 语法，例如：

```javascript
import { port, getAccounts } from "module";
console.log(port); // 3000
```

或者我们可以在 main.js 中把整个模块导入，并命名为 service：

```javascript
import * as service from "module";
console.log(service.port); // 3000
```

从我个人角度来说，我觉得 ES6 模块是让人困惑的。但可以肯定的事，它们使语言更加灵活了。

并不是所有的浏览器都支持 ES6 模块，所以你需要使用一些像 jspm 去支持 ES6 模块。

更多的信息和例子关于 ES6 模块，请看 [this text](http://exploringjs.com/es6/ch_modules.html)。不管怎样，请写模块化的 JavaScript。

如何使用 ES6  (Babel)  

* * *

ES6 已经敲定，但并不是所有的浏览器都完全支持，详见：<http://kangax.github.io/compat-table/es6/>。要使用 ES6，需要一个编译器例如：babel。你可以把它作为一个独立的工具使用，也可以把它放在构建中。grunt，gulp 和 webpack 中都有可以支持 babel 的插件。

[![图片 2](http://www.alloyteam.com/wp-content/uploads/2016/03/图片2-300x222.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/图片2.png)

这是一个 gulp 案列，安装 gulp-babel 插件：

    $ npm install --save-dev gulp-babel

在 gulpfile.js 中，定义一个任务 build，放入 src/app.js，并且编译它进入构建文件中。

    var gulp = require('gulp'),
      babel = require('gulp-babel');
    gulp.task('build', function () {
      return gulp.src('src/app.js')
        .pipe(babel())
        .pipe(gulp.dest('build'));
    })

Node.js and ES6  

* * *

在 nodejs 中，你可以用构建工具或者独立的 Babel 模块 babel-core 来编译你的 Node.js 文件。安装如下：

    $ npm install --save-dev babel-core

然后在 node.js 中，你可以调用这个函数：

    require("babel-core").transform(ES5Code, options);

ES6 总结  

* * *

这里还有许多 ES6 的其它特性你可能会使用到，排名不分先后：

1、全新的 Math, Number, String, Array  和 Object  方法

2、二进制和八进制数据类型

3、默认参数不定参数扩展运算符

4、Symbols 符号

5、tail 调用

6、Generators (生成器)

7、New data structures like Map and Set (新的数据构造对像 MAP 和 set)

参考文献：  

* * *

1.  [ES6 Cheatsheet](https://github.com/azat-co/cheatsheets/tree/master/es6) ([FREE PDF](https://gum.co/LDwVU/git-1CC81D40))
2.  [http://webapplog.com/ES6/comment-page-1/](http://webapplog.com/es6/comment-page-1/)
3.  [Understanding ECMAScript 6 by Nicolas Zakas book](https://leanpub.com/understandinges6)
4.  [http://ES6-features.org/#DateTimeFormatting](http://www.alloyteam.com/2016/03/es6-front-end-developers-will-have-to-know-the-top-ten-properties/#DateTimeFormatting)
5.  IIFE：立刻运行的函数表达式

最后感谢大家阅读，感谢小龙、教授、高工的指正建议，欢迎大家指出探讨![laugh](http://www.alloyteam.com/wp-content/plugins/ckeditor-for-wordpress/ckeditor/plugins/smiley/images/teeth_smile.png "laugh")  

=======================================================================================================================================================================


<!-- {% endraw %} - for jekyll -->