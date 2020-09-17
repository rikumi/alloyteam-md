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
        serviceCache:{},
        _argumentNames: function (fn) {
```


<!-- {% endraw %} - for jekyll -->