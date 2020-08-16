---
title: 在 JS 中实现 DI 和 AOP
date: 2014-12-21
author: TAT.Fujun
source_link: http://www.alloyteam.com/2014/12/di-aop-in-js/
---

<!-- {% raw %} - for jekyll -->

前些时候有使用过 AngularJS 一些时间，最大的感受就是 Angular 完全颠覆了我们开发 Web 应用的方式，自己被其许多耳目一新的设计思想所折服。

首先想说的就是依赖注入（DI），这也意味着，你在使用某一个模块时，不需要去手动 require () 一下，你需要的模块会自己注入到的函数所在的作用域中，如：

```javascript
app.service("PersonService", function ($http) {
    this.addPerson = function () {
        return $http.post("url/addPersonAction", { name: "name" });
    };
});
```

上面的代码中，直接使用了 $http 的 post () 方法。那么问题来了：为什么可以这样？我们知道 JS 函数在调用时，其形参如果没有赋值就会是 undefined。能直接使用 $http 的 post () 方法，就说明 $http 是有对应的实参与之对应的。这是怎么发生的呢？下面，就让我们一起来揭开其中的秘密。

**一： 如何在 JS 中实现 DI**

在这之前，我们先回顾一下 toString 方法。在 JS 中，除了 null 和 undefined，其它所有的一切值都是有 toString () 方法的。函数也不例外，而且函数的 toString () 方法，是可以拿到函数定义的全部代码，甚至是注释。有了这一前提，我们可以实现一个获取函数形参的方法。

```javascript
/**
 * 以数组的形式返回函数的参数名字字符串。没有参数时返回空数组
 * @param {Function} fn - 要获取参数的函数
 * @returns {Array}
 */
function argumentNames(fn) {
    var ret,
        methodCode = fn.toString();
    methodCode.replace(/\((.*?)\)/, function (match, g1) {
        var argStr = g1.replace(/\s/g, "");
        ret = argStr.length ? argStr.split(",") : [];
    });
    return ret;
}
// 使用：
argumentNames(function (arg1, arg2) {}); // ["arg1", "arg2"];
```

有了这个方法，我们要实现参数的 DI，还需要两步：  
1. 函数运行拦截它  
2. 把对应的模块传给函数的上下文

对于第一步，JS 原生没有提供对应方法。但我们可以参照 defined (), require () 的做法。你定义模块时，必须使用我给的方式去定义。类比 Angular 是

    angularModule.service('serviceID', function (dependencyModuleA [, dependencyModuleB...]) {
    	// do something
    });

呵呵，既然你使用了我的方法去定义模块，那么我就可以对你传入的函数为所欲为了...。可能你已经想到了，我们要对其传入的函数所做的第一件事就是获取其参数列表，然后再把这个模块保存下来。有了这个参数列表，就知道要注入多少个依赖。再接着，把对应的依赖传作为实参传过去。那么，如何拿到对应的依赖？在我们给的定义方法中，已经让传入了一个 ID，这个 ID 就是获取对应模块的关键。

要注入的模块 === 模块仓库 \[模块 ID];

```javascript
// DI的完整实现：
(function (widnow) {
    window.DI = {
        serviceCache: {},
        _argumentNames: function (fn) {
            var ret,
                methodCode = fn.toString();
            methodCode.replace(/\((.*?)\)/, function (match, g1) {
                var argStr = g1.replace(/\s/g, "");
                ret = argStr.length ? argStr.split(",") : [];
            });
            return ret;
        },
        service: function (serviceID, serviceFactory) {
            this.serviceCache[serviceID] = new serviceFactory();
            return this;
        },
        controller: function (controllerID, controllerCb) {
            var controllerCbArgs = this._argumentNames(controllerCb);
            var dependencies = [],
                i = 0; // 根据controllerCbArgs有序填充依赖
            while (controllerCbArgs[i]) {
                dependencies.push(this.serviceCache[controllerCbArgs[i]]);
                i++;
            }
            controllerCb.apply({}, dependencies);
            return this;
        },
    };
})(this);
// 使用方法：
DI.service("AT", function () {
    this.name = "Alloy Team";
    this.concatUs = function () {
        document.body.innerHTML = "Email: AlloyTeam@tencent.com";
    };
}).controller("c", function (AT) {
    AT.concatUs();
});
```

到此，我们已经简单实现了依赖注入。当然，这个实现是有很多问题的，比如 JS 混淆后不能正常工作，定义一个模块就立即 new 也是不恰当的。有兴趣的话可以尝试去完善这个 DI，这里就不继续下去了。

**二： 如何在 JS 中实现 AOP**

提到 DI，我就想到了 AOP。有 Java 基础的同学都知道 Ioc 和 AOP 是 Spring 的两大特性。在 JS 中，要实现 AOP 也很简单，但方式却显得唯一：重写原来的函数定义。如下是 AOP 一个实现：

```javascript
(function (window) {
    window.AOP = {
        before: function (ns, fnName, beforefn) {
            var ori = ns[fnName];
            ns[fnName] = function () {
                beforefn();
                ori();
            };
        },
    };
})(this);
// 使用
var ns = {
    foo: function () {
        console.log("foo...");
    },
};
var bar = function () {
    console.log("bar...");
};
// 现在使用AOP在ns.foo函数执行前，切入新逻辑bar()
AOP.before(ns, "foo", bar);
// 执行ns.foo
ns.foo();
/* 
打印：
	bar...
	foo...
*/
```

虽然上面 AOP 的实现比较丑陋，但目前要想在 JS 中实现 AOP，核心原理都是重写函数定义。期望有一天能像操作 XMLHttpRequest 对象那样，在每个函数对象上，也有一个类似 readyState 的属性，这时，再结合 Object.observe，相信那时 JS 中的 AOP 实现将会非常优雅，AOP 也会在 JS 中得到更好的使用。更多 AOP 的使用场景可以参考文章：[用 AOP 改善 javascript 代码](http://www.alloyteam.com/author/svenzeng/ "用 AOP 改善 javascript 代码")

小结：  
1. 在 JS 中实现 DI：利用函数的 toString 方法  
2. 在 JS 中实现 AOP：重写原函数

<!-- {% endraw %} - for jekyll -->