---
title: 一种简单通用的单例实现
date: 2012-08-22
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2012/08/a-simple-generic-singleton-implementation/
---

<!-- {% raw %} - for jekyll -->

在 javascript 中，一个原生的 json 对象实际上就是一个单例。我们现在讨论另外一种.

假设现在在写一个小功能，点击按钮的时候需要弹出一个遮罩层.

```javascript
var createMask = function () {
    return document.body.appendChild(document.createElement("div"));
};
$("button").click(function () {
    var mask = createMask();
    mask.show();
});
```

但是这个遮罩层是全局唯一的，不可能同时在页面出现 2 个。这样写的话每次都会创建一个新的 div. 显然是浪费资源

那么改一下，页面一开始就创建好这个 div, 然后用一个变量保存它.

```javascript
var mask = document.body.appendChild(document.createElement("div"));
$("button").click(function () {
    mask.show();
});
```

问题随之又来了，也许我们永远都不会点击这个按钮。那这个 div 又被浪费掉了.

好吧， 我需要用借一个变量来判断是否已经创建过 div.

```javascript
var createMask = (function () {
    var mask;
    return function () {
        return (
            mask ||
            (mask = document.body.appendChild(document.createElement("div")))
        );
    };
})();
```

到这里就大功告成了。只是多了一个变量，就实现了一个 “漂亮” 的单例.

哦，假如页面有很多功能相似的函数，也许我下次是需要一个单例的 script 标签，在 jsonp 请求的时候用.  
也许下下次我又需要一个单例的 iframe. 用来跨什么域什么的。我需要每次都写一个这样丑陋的闭包么。有没有一劳永逸的办法？

javascript 有个同门师兄叫 Io language. 同样也是基于原型的函数式语言. Io 里面的单例实现或许是我看到过的最简洁的.  
跟 javascript 一样，Io 里面也没有类的概念，所有的数据都是对象。每个对象都有一个 clone 方法，用来克隆自己的副本，而 Io 里面的所有对象都是通过克隆另一个对象来实现的.

因为这个特性，它的单例实现就一句话  
createMask clone := createMask.

把自己的克隆函数指向自己，所以通过自己克隆的副本永远是自己.

当然在 javascript 里，因为没有类似的语法支持，我们做不到像 Io 一样从语法的层面来实现单例，但我们可以稍微加一点点糖，从此不希望比 Io 多写一行代码.

真正的实现其实相当相当简单.

```javascript
var singleton = function (fn) {
    var old_fn = fn,
        result;
    return function () {
        return (
            result ||
            (result = old_fn.apply(
                this,
                Array.prototype.slice.call(arguments, 0)
            ))
        );
    };
};
var createMask = singleton(createMask);
```

我们用一个新的函数来代替旧的函数，同时用一个私有变量来保存第一次的返回值，在以后的请求里，优先返回这个值.

用了这个简单的函数之后，所有具有返回值的函数都会变成单例的.

值得注意的是，由于使用了对象冒充 (apply), 这个办法并不适用于带有 prototype 的构造函数。旧的函数的 prototype 实际上会被丢弃.

不过这应该不是问题 . javascript 里创建对象的方式有无数种，如果要用到函数的 prototype, 绝大部分时候都是为了共享不同对象之间的原型链而提高性能。既然需要不同的对象，这种时候实在不应该使用单例.

好吧，如果你偏要这么做，那也只需要把新函数的 prototype 绑到旧函数的 prototype 上就可以了.


<!-- {% endraw %} - for jekyll -->