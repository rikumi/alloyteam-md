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
A 代码里的 new namespace2.B () 要在 new namespace1.A 的时候才会被调用。  
B 代码里的 new namespace1.A () 要 var a = new namespace1.A;a.xx () 之后被调用后才会被执行。  
所以在初始化阶段，这样的循环依赖是被允许的，因为都是 **lazy using**。只要满足 **lazy using**，执行顺序就不重要了，如果不是 lazy using（如静态属性方法的设置），执行顺序就必须把依赖的项先执行。  
如上面所说，不是所有的循环依赖都能够解决的，比如看 C# 里面的无解的循环依赖的例子：

```javascript
namespace Project1
{
    public class A
    {
        public static B b = new B();
    }
}
 
namespace Project1
{
    public class B
    {
        public static A a = new A();
    }
}
```

上面的代码编译时候就会报错。怎么改成有解，那么就要 lazy using：

```javascript
namespace Project1
{
    public class A
    {
        public static B b = new B();
    }
}
 
namespace Project1
{
    public class B
    {
        public int testMethod()
        {
            A a = new A();
            return 1;
        }
    }
}
```

这样的依赖编译器是可以解决的。

### kmdjs 0.1.4

kmd 的意思是 kernel module definition。该版本和以前的主要变化如下：

1.  kmdjs 文件大小从以前的一万多行代码变成了一百多行代码
2.  从以前的 namespace+class 组织项目变成 namespace+module 组织项目

### kmdjs API

**kmdjs.config**  
用于配置 namespace + module 和文件路径的 mapping

    kmdjs.config({
        'util.bom':'js/util/bom.js',
        'app.Ball':'js/ball.js',
        'util.dom':'js/util/dom.js',
        'util.dom.test':'js/util/test.js',
        'main': 'js/main.js'
    });

**kmdjs.main**  
程序的入口代码。  
**kmdjs.define**  
定义模块

```javascript
kmdjs.define(
    "main",
    ["util.bom", "app.Ball", "util.dom.test"],
    function (bom, Ball, test) {
        var ball = new Ball(0, 0, 28, 1, -2, "kmdjs");
        alert(test.m(3, 3));
        var vp = bom.getViewport();
        setInterval(function () {
            ball.tick();
            (ball.x + ball.r * 2 > vp[2] || ball.x < 0) && (ball.vx *= -1);
            (ball.y + ball.r * 2 > vp[3] || ball.y < 0) && (ball.vy *= -1);
        }, 15);
    }
);
```

如果只传两个参数，代表不依赖任何模块。这里和 AMD 一样，在 factory 的回调里把依赖注入到里面。  
但是也直接在代码里把 namespace 写进去访问，如下所示：

```javascript
kmdjs.define("main", ["util.bom", "app.Ball"], function () {
    var ball = new app.Ball(0, 0, 28, 1, -2, "kmdjs");
    var vp = util.bom.getViewport();
    setInterval(function () {
        ball.tick();
        (ball.x + ball.r * 2 > vp[2] || ball.x < 0) && (ball.vx *= -1);
        (ball.y + ball.r * 2 > vp[3] || ball.y < 0) && (ball.vy *= -1);
    }, 15);
});
```

而有的时候必须使用上面这种方式用来解决循环依赖导致执行顺序问题带来的注入 undefined：如：

```javascript
kmdjs.define("util.dom", ["util.bom"], function (bom) {
    var Dom = {};
    Dom.add = function (a, b) {
        //循环依赖导致的bom undefined，所以这里写上namespace
        return util.bom.sub(a, b);
    };
    return Dom;
});
```

和

```javascript
kmdjs.define("util.bom", ["util.dom"], function (dom) {
    var Bom = {};
    Bom.getViewport = function () {
        alert(dom.add(1, 4));
    };
    Bom.sub = function (a, b) {
        return a - b;
    };
    return Bom;
});
```

**bundler**

可以通过 main 传入回调函数，在回调函数中拿到编辑打包好的字符串。

```javascript
kmdjs.main(function (bundler) {
    alert(bundler);
});
```

如上面的例子打包出来的代码：

```javascript
var util = {};
var app = {};
util.dom = {};
var main = {};
util.dom = (function (bom) {
    var Dom = {};
    Dom.add = function (a, b) {
        return util.bom.sub(a, b);
    };
    return Dom;
})(util.bom);
app.Ball = (function () {
    var Ball = function (x, y, r, vx, vy, text) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.d = 2 * r;
        this.vx = vx;
        this.vy = vy;
        this.element = document.createElement("div");
        this.element.innerHTML = text;
        this.element.style.cssText =
            "text-align:center;position:absolute; -moz-border-radius:" +
            this.d +
            "px; border-radius: " +
            this.d +
            "px; width: " +
            this.d +
            "px; height: " +
            this.d +
            "px;background-color:green;line-height:" +
            this.d +
            "px;color:white;";
        document.body.appendChild(this.element);
    };
    Ball.prototype.tick = function () {
        this.x += this.vx;
        this.y += this.vy;
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
    };
    return Ball;
})();
util.dom.test = (function () {
    var Element = {};
    Element.m = function (a, b) {
        return a * b;
    };
    return Element;
})();
util.bom = (function (dom) {
    var Bom = {};
    Bom.getViewport = function () {
        alert(dom.add(1, 4));
        var d = document.documentElement,
            b = document.body,
            w = window,
            div = document.createElement("div");
        div.innerHTML = "  <div></div>";
        var lt = !(div.firstChild.nodeType === 3)
            ? {
                  left: b.scrollLeft || d.scrollLeft,
                  top: b.scrollTop || d.scrollTop,
              }
            : { left: w.pageXOffset, top: w.pageYOffset };
        var wh = w.innerWidth
            ? { width: w.innerWidth, height: w.innerHeight }
            : d && d.clientWidth && d.clientWidth != 0
            ? { width: d.clientWidth, height: d.clientHeight }
            : { width: b.clientWidth, height: b.clientHeight };
        return [lt.left, lt.top, wh.width, wh.height];
    };
    Bom.sub = function (a, b) {
        return a - b;
    };
    return Bom;
})(util.dom);
main = (function (bom, Ball, test) {
    var ball = new Ball(0, 0, 28, 1, -2, "kmdjs");
    alert(test.m(3, 3));
    var vp = bom.getViewport();
    setInterval(function () {
        ball.tick();
        (ball.x + ball.r * 2 > vp[2] || ball.x < 0) && (ball.vx *= -1);
        (ball.y + ball.r * 2 > vp[3] || ball.y < 0) && (ball.vy *= -1);
    }, 15);
})(util.bom, app.Ball, util.dom.test);
```

### Github

<https://github.com/kmdjs/kmdjs>


<!-- {% endraw %} - for jekyll -->