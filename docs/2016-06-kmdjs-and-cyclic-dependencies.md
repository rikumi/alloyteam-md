---
title: kmdjs 和循环依赖
date: 2016-06-13
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/06/kmdjs-and-cyclic-dependencies/
---

<!-- {% raw %} - for jekyll -->

### 循环依赖

循环依赖是非常必要的，有的程序写着写着就循环依赖了，可以提取出一个对象来共同依赖解决循环依赖，但是有时会破坏程序的逻辑自封闭和高内聚。所以没解决好循环依赖的模块化库、框架、编译器都不是一个好库、框架、编译器。

kmdjs 的本质就是 {}，从 {} 扩展出的 tree。从很早的版本就开始，是支持循环依赖的。比如下面的代码：

```javascript
define("namespace1.A", ["namespace2"], {
    ctor: function () {
        this.b = new B();
    },
});
define("namespace2.B", ["namespace1"], {
    ctor: function () {},
    xx: function () {
        var a = new A();
    },
});
```

会被 kmdjs 编译成：

```javascript
var namespace1 = {};
var namespace2 = {};
namespace1.A = Class.extend({
    ctor: function () {
        this.b = new namespace2.B();
    },
});
namespace2.B = Class.extend({
    ctor: function () {},
    xx: function () {
        var a = new namespace1.A();
    },
});
```

要支持循环依赖其实有个要求，就是 **lazy using**。**不是 lazy using 的循环依赖是无解的循环依赖**。  
怎么理解上面这句话呢？看上面的代码，Class.extend 执行完之后，各自依赖的东西是不会被调用的。  
A 代码里的 new namespace2.B () 要在 new namespace1.A 的时候才会被调


<!-- {% endraw %} - for jekyll -->