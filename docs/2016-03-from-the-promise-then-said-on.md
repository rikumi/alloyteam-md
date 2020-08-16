---
title: 从 Promise 的 Then 说起
date: 2016-03-25
author: TAT.dorsywang
source_link: http://www.alloyteam.com/2016/03/from-the-promise-then-said-on/
---

<!-- {% raw %} - for jekyll -->

**Promise 让代码变得更人性化**

曾经我一直在思考，为什么代码会比较难读。后来发现，我们平时要阅读的所有媒体：报纸、书、新闻，我们在阅读的时候，都是从上到下一直读下去的，然而，我们的在读代码的时候，经常要跳着去读，这种阅读方式其实是反人类的，如果我们能在读代码的时候，也可以从上往下一直读下去，那么，代码就会变得可读性提高很多。

对比 JS 中，callback 是让我们跳来跳去读代码最大的罪魁祸首，它让我们的流程变得混乱，Promise 正是为了解决这一问题而产生的。我们来对比一下这个过程

```javascript
var render = function (data) {};
var getData = function (callback) {
    $.ajax({
        success: function () {
            callback(data);
        },
    });
};
var init = function () {
    getData(function (data) {
        render(data);
        getData(function (data) {
            render(data);
        });
    });
};
init();
```

使用 Promise 之后

```javascript
var init = function () {
    getData({})
        .then(function (data) {
            render(data);
            return getData({});
        })
        .then(function (data) {
            render(data);
        });
};
```

很明显看出，代码就变成线性的了，逻辑也变得更加清晰可读

**Promise 流程再优化**

promse 出来之后，大家都有很多的想法，在 Promise 之上再封装一层，使用异步流程更清晰可读。下面是 Abstract-fence 2.0 (开发中) 的一种解决方案 (规范)

Abstract-fence 中，function 会被分解为多个 task

```javascript
Model.task("getData", function (scope, next, { $, util }) {
    $.ajax({
        success: function (data) {
            next();
        },
    });
});
Model.task("render", ["getData"], function (scope) {
    var data = scope.data; // 使用data进行渲染
});
Model.task("init", [render].then(render));
Model.runWorkflow(init);
```

其中， init 是 task render 执行后再执行 render， 而 render 任务又是由 getData 任务执行后再渲染组成，其中每个 task 的定义 function 的参数使用依赖注入传递，全局属性使用 {} 包裹

但是在使用 Promise.all 的过程中，遇到了一个 Promise 奇怪的问题

**Array.prototype.then 与 Promise.all**

很简单的一段代码

```javascript
var p = new Promise(function (rs, rj) {
    setTimeout(rs, 1000);
});
Promise.all([p]).then(function () {
    console.log(2);
});
console.log(1);
```

毫无疑问，这段代码在浏览器运行会先打印 1，然后再输出 2 但如果在前面增加对 then 方法的定义，如下代码

```javascript
Array.prototype.then = function () {};
var p = new Promise(function (rs, rj) {
    setTimeout(rs, 1000);
});
Promise.all([p]).then(function () {
    console.log(2);
});
console.log(1);
```

那么这段代码只会打印出 1， 2 却永远不会运行

**查了很多资料，确认 promise.all 的参数只能接收数组 (类数组)** 

比如如下代码就会报错

```javascript
var p = new Promise(function (rs) {});
Promise.all(p); // 报错
Promise.all([p]); // ok
```

所以，Promise.all 接收一个 Iterator 可遍历对象

**对数组的 prototype.then 定义为什么会影响到 Promise 的行为呢？**

**Promise A + 规范**

Promise A + 规范看起来还是有点绕，这里省略掉一些具体的实现细节，将 Promise A + 更直白的阐述如下

1. Promise then 方法需要 return 一个新的 Promise 出来，如下  

 

```javascript
.then = function(rsFunc, rjFunc){
 
    var promise2 = new Promise();
    return promise2;
};
```

2. 如果 promise 本身状态变更到 fulfilled 之后，调用 rsFunc，rsFunc 的解析值 x, 与新的 promise2 进行 promise 的解析过程 \[\[Resolve]](promise2, x), x 的取值不同，有不同的情况

3. 若 x 为一个 promise，则 x 完成的最后，再 fufill promise2, 对应如下代码

```javascript
new Promise(function(rs, rj){
  rs();
 
}).then(function(data){
    // 对应于x的返回值
    return new Promise(rs, rj){
    });
});
```

4. 若 x 为一个对象或者函数，如果有 then 方法，将会执行 then 方法，then 方法 this 指向 x 本身，如下

```javascript
new Promise(function (rs, rj) {
    rs();
})
    .then(function (data) {
        // 对应于x的返回值
        return {
            a: 1,
            then: function (rs, rj) {
                console.log(this.a);
                rs({ a: 2 });
            },
        };
    })
    .then(function (data) {
        console.log(data.a);
    });
```

5. 如果 x 没有 then 方法，那么，x 将会做为值来 满足 promise2

```javascript
new Promise(function (rs, rj) {
    rs();
})
    .then(function (data) {
        // 对应于x的返回值
        return {
            a: 1,
        };
    })
    .then(function (data) {
        console.log(data.a);
    });
```

Promise A + 给出了一些具体的执行细节，保证了 then 的顺序执行，但在规范中，并未提到 Promise.all 方法的执行方式

为此，查看 bluebird 的 Promise.all 实现方法

**BlueBird 关于 Promise.all 实现方法解析**

首先，promise 中引用 promise_array 代码如下 (已略去一些无关代码）

```javascript
var INTERNAL = function () {};
var apiRejection = function (msg) {
    return Promise.reject(new TypeError(msg));
};
function Proxyable() {}
var tryConvertToPromise = require("./thenables")(Promise, INTERNAL);
var PromiseArray = require("./promise_array")(
    Promise,
    INTERNAL,
    tryConvertToPromise,
    apiRejection,
    Proxyable
);
```

promise.all 的实现也很简单

```javascript
Promise.all = function (promises) {
    return new PromiseArray(promises).promise();
};
```

可见，具体的细节在 promise_array 中的实现

```javascript
function PromiseArray(values) {
    var promise = (this._promise = new Promise(INTERNAL));
    if (values instanceof Promise) {
        promise._propagateFrom(values, 3);
    }
    promise._setOnCancel(this);
    this._values = values;
    this._length = 0;
    this._totalResolved = 0; // 初始化
    this._init(undefined, -2);
}
```

PromiseArray 的构造方法中，将参数赋值给 this.\_values，待\_init 方法中使用

```javascript
PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
    var values = tryConvertToPromise(this._values, this._promise); // 如果values可以转化为promise对象，那么根据不同的状态，会提前return
    if (values instanceof Promise) {
        values = values._target();
        var bitField = values._bitField;
        this._values = values; // 这个状态是pending的状态
        if ((bitField & 50397184) === 0) {
            this._promise._setAsyncGuaranteed(); // Promise，将会等Promise对象本身状态改变后再次
            return values._then(
                init,
                this._reject,
                undefined,
                this,
                resolveValueIfEmpty
            ); // FULFILLED, 并没有提前return， 继续进行
        } else if ((bitField & 33554432) !== 0) {
            values = values._value(); // rejected的状态，提前终止
        } else if ((bitField & 16777216) !== 0) {
            return this._reject(values._reason());
        } else {
            return this._cancel();
        }
    }
    values = util.asArray(values);
    if (values === null) {
        var err = apiRejection(
            "expecting an array or an iterable object but got " +
                util.classString(values)
        ).reason();
        this._promise._rejectCallback(err, false);
        return;
    }
    if (values.length === 0) {
        if (resolveValueIfEmpty === -5) {
            this._resolveEmptyArray();
        } else {
            this._resolve(toResolutionValue(resolveValueIfEmpty));
        }
        return;
    }
    this._iterate(values);
};
```

init 总结为几步

1. 尝试转换参数为 Promise 对象

2. 如果转换成功，那么检查 Promise 对象的状态

   1\. Pending，等待 Promise

   2. fulfilled, 换取返回值，继续进行

   3\. Rejected 终止，返回原因

   4\. 其他， 终止

上面的代码可以看出，一旦数组的具有 then 方法，就可被 tryConvertToPromise 方法转换为一个 Promise 对象，如果 then 方法未实现 promise 规范，那么 Promise 对象就会处于 Pending 的状态，Promise.all 方法永远就不会达到 fulfilled 的条件，问题也就明白了

<!-- {% endraw %} - for jekyll -->