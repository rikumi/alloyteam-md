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

```javascript
var MyController = function ($scope, $http) {
    $scope.test = 1;
    $http.get("");
};
```

上面这段代码在原来的基础上增加了 http, 那么问题就来了，angular 在调用 controller 的时候怎么知道我需要 scope 还是 http 还是两个都需要呢，这就牵着到了 angular 里的依赖注入，那么我们来模拟一下。

假设没有 angular 的情况下，我们：

```javascript
var MyController = function ($scope, $http) {
    $scope.test = 1;
    $http.get("");
};
MyController(); //undefined
```

肯定会报错的，然后我们来修改下我们的 inject：

```javascript
var inject = {
    dependencies: {},
    register: function (key, value) {
        this.dependencies[key] = value;
    },
    resolve: function (deps, func, scope) {
        var arr = [];
        for (var i = 0; i < deps.length; i++) {
            if (this.dependencies.hasOwnProperty(deps[i])) {
                arr.push(this.dependencies[deps[i]]);
            }
        }
        console.log(arr);
        return function () {
            func.apply(scope || {}, arr);
        };
    },
};
```

这里解释一下，我们用了 dependencies 来存储所有的依赖，register 来实现注册依赖，resolve 方法来实现注入。

然后我们模仿 angular 来预先注册几个模块：

```javascript
inject.register("$http", {
    get: function () {
        console.log("get");
    },
});
inject.register("$scope", { test: "" });
inject.register("$location", {
    hash: function () {
        console.log("hash");
    },
});
```

然后我们就可以注入了：

```javascript
MyController = inject.resolve(['$http','$scope'],MyController)；
MyController();
```

我们只需要 http 和 scope，所以我们只传了两个，虽然这样看似解决了依赖注入，但是还有很多问题，比如我要交换两个参数的位置就不行了。

于是翻看了 angularjs 的源码，找到了：

```javascript
var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
 
    .....
    function annotate(fn) {
      .....
      fnText = fn.toString().replace(STRIP_COMMENTS, '');
      argDecl = fnText.match(FN_ARGS);
      .....
    }
```

我们忽略掉一些细节代码，只看我们需要的。annotate 方法和我们的 resolve 方法很像。它转换传递过去的 func 为字符串，删除掉注释代码，然后抽取其中的参数。让我们看下它的执行结果，修改一下 resolve 方法：

```javascript
resolve: function(deps, func, scope) {
 
                var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
                var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
                var fnText = func.toString().replace(STRIP_COMMENTS, '');
                var argDecl = fnText.match(FN_ARGS);
                console.log(argDecl);
 
 
            }
```

打印出 argDecl：

```javascript
["function ($scope,$http)", "$scope,$http", index: 0, input: "function ($scope,$http){↵                $scope.test = 1;↵                $http.get('');↵        }"]
```

可以看到，这个数组拿到了 func 的参数，argDecl［1］ = “$scope,$http”;

根据这个，我们来修改 resolve：

```javascript
resolve: function(func, scope) {
 
                var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
                var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
                var fnText = func.toString().replace(STRIP_COMMENTS, '');
                var argDecl = fnText.match(FN_ARGS);
                console.log(argDecl);
                var deps = argDecl[1].split(',');
                var arr = [];
                for (var i = 0 ; i < deps.length ; i++) {
                    if (this.dependencies.hasOwnProperty(deps[i])) {
                       arr.push(this.dependencies[deps[i]])
                    }
                }
                return function(){
                    func.apply(scope || {}, arr);
                }
 
            }
```

OK，这次我们不用在意参数的顺序了，但是 angular 远比我们要想的多，大多数情况下，我们的 js 都是要压缩的，所以 function 的实参会被替换，如果是那样的话，我们这个方法的 argDecl［1］ = “$scope,$http”; 就会是 argDecl［1］ = “r,t”; 类似这样的变量，那么又该怎么解决呢？

angular 官方有这样的解释：

为了克服压缩引起的问题，只要在控制器函数里面给 $inject 属性赋值一个依赖服务标识符的数组，就像：

```javascript
var MyController = ["$scope", "$http", function ($scope, $http) {}];
```

那么，用到我们这个方法里面又该怎么实现呢？那我们在看看 angular 的源码吧：

```javascript
....
} else if (isArray(fn)) {
    last = fn.length - 1;
    assertArgFn(fn[last], 'fn')
    $inject = fn.slice(0, last);
  } else {
....
```

看到了吧，之所以用到数组也是有原因的，把需要的依赖写在方法的前面，于是，应用到我们的 reslove 方法：

```javascript
resolve: function(func, scope) {
                if (isArray(func)) {
                    var last = func.length - 1;
                    var deps = func.slice(0, last);
                    func = func[last]
                } else {
                    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
                    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
                    var fnText = func.toString().replace(STRIP_COMMENTS, '');
                    var argDecl = fnText.match(FN_ARGS);
                    var deps = argDecl[1].split(',');
                }
 
                var arr = [];
                for (var i = 0 ; i < deps.length ; i++) {
                    if (this.dependencies.hasOwnProperty(deps[i])) {
                       arr.push(this.dependencies[deps[i]])
                    }
                }
                return function(){
                    func.apply(scope || {}, arr);
                }
 
            }
```

OK，到这里，便可以用我们的 inject 来模拟 angular 的依赖注入了，当然，真正 angular 的依赖注入还有很多东西，这里就不在详细描述了。

以上观点都是我的个人见解，如有错误欢迎指正！

参考资料：[关于 anjularjs 双向绑定的研究](http://www.nihaoshijie.com.cn/index.php/archives/306)


<!-- {% endraw %} - for jekyll -->