---
title: 【Javascript 设计模式 2】- 简单工厂模式
date: 2012-10-24
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-simple-factory-pattern/
---

<!-- {% raw %} - for jekyll -->

简单工厂模式是由一个方法来决定到底要创建哪个类的实例，而这些实例经常都拥有相同的接口。这种模式主要用在所实例化的类型在编译期并不能确定， 而是在执行期决定的情况。 说的通俗点，就像公司茶水间的饮料机，要咖啡还是牛奶取决于你按哪个按钮。

简单工厂模式在创建 ajax 对象的时候也非常有用.

之前我写了一个处理 ajax 异步嵌套的库，地址在 <https://github.com/AlloyTeam/DanceRequest>  

这个库里提供了几种 ajax 请求的方式，包括 xhr 对象的 get, post, 也包括跨域用的 jsonp 和 iframe. 为了方便使用，这几种方式都抽象到了同一个接口里面.

```javascript
var request1 = Request('cgi.xx.com/xxx' , ''get' );
 
request1.start();
 
request1.done( fn );
 
var request2 = Request('cgi.xx.com/xxx' , ''jsonp' );
 
request2.start();
 
request2.done( fn );
```

Request 实际上就是一个工厂方法，至于到底是产生 xhr 的实例，还是 jsonp 的实例。是由后来的代码决定的。

实际上在 js 里面，所谓的构造函数也是一个简单工厂。只是批了一件 new 的衣服。我们扒掉这件衣服看看里面。

通过这段代码，在 firefox, chrome 等浏览器里，可以完美模拟 new.

```javascript
function A(name) {
    this.name = name;
}
function ObjectFactory() {
    var obj = {},
        Constructor = Array.prototype.shift.call(arguments);
    obj.__proto__ =
        typeof Constructor.prototype === "number"
            ? Object.prototype
            : Constructor.prototype;
    var ret = Constructor.apply(obj, arguments);
    return typeof ret === "object" ? ret : obj;
}
var a = ObjectFactory(A, "svenzeng");
alert(a.name); //svenzeng
```

这段代码来自 es5 的 new 和构造器的相关说明， 可以看到，所谓的 new， 本身只是一个对象的复制和改写过程， 而具体会生成什么是由调用 ObjectFactory 时传进去的参数所决定的。

## \[目录]

-   [单例模式](http://www.alloyteam.com/2012/10/common-javascript-design-patterns/ "单例模式")
-   [简单工厂模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-simple-factory-pattern/ "简单工厂模式")
-   [观察者模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-pattern-observer-mode/ "观察者模式")
-   [适配器模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-adapter-mode/ "适配器模式")
-   [代理模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-proxy-mode/ "代理模式")
-   [桥接模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-mode-bridge-mode/ "桥接模式")
-   [外观模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-appearance-mode/ "外观模式")


<!-- {% endraw %} - for jekyll -->