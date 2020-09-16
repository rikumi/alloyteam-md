---
title: AngularJs 依赖注入的研究
date: 2015-09-01
author: TAT.tennylv
source_link: http://www.alloyteam.com/2015/09/angularjs-study-of-dependency-injection/
---

<!-- {% raw %} - for jekyll -->

什么是依赖注入呢，我的理解，简单点就是说我的东西我自己并不像来拿着，我想要我依赖的那个人来帮我拿着，当我需要的时候，他给我就行了。当然这只是简单的理解，还是用代码解释比较清楚一些。

这里有一个 function，很简单。

```javascript
var a = function (name) {
    console.log(name);
};
```

我们调用它：

    a('abc')；//abc

那么，就像我上面说的，我能不能自己不传参数呢，例如：

```javascript
a(); //undefined
```

如何才能实现让别人帮我们注入这个参数呢：

```javascript
var inject = function (name, callback) {
    return function () {
        callback(name);
    };
};
```

像这样，我们在定义参数的时候这样传：

    a = inject('abc',a)

我们再调用 a 方法：

    a()；//abc

这其实就是最简单的依赖注入了，当然这么简单是不行的，其实这是很无意义的，下面我们来看一下高深的 angularjs：

```javascript
var MyController = function ($scope) {
    $scope.test = 1;
};
```

上面这段代码定义了 angularjs 的 controller 里面用到了 scope，这样还看不出问题，在看下面：


<!-- {% endraw %} - for jekyll -->