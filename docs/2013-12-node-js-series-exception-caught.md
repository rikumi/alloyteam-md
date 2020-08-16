---
title: Node.js 异常捕获的一些实践
date: 2013-12-31
author: TAT.dmyang
source_link: http://www.alloyteam.com/2013/12/node-js-series-exception-caught/
---

<!-- {% raw %} - for jekyll -->

本文 [github 地址](https://github.com/chemdemo/chemdemo.github.io/blob/master/blogs/exception_catch.md)

本篇谈谈 Node.js 捕获异常的一些探索。

采用事件轮训、异步 IO 等机制使得 Node.js 能够从容应对无阻塞高并发场景，令工程师很困扰的几个理解 Node.js 的地方除了它的事件（回调）机制，还有一个同样头痛的是异常代码的捕获。

### [](http://www.alloyteam.com/2013/12/node-js-series-exception-caught/#trycatch%E4%B9%8B%E7%97%9B)try/catch 之痛

一般情况下，我们会将有可能出错的代码放到 `try/catch` 块里。但是到了 Node.js，由于 `try/catch` 无法捕捉异步回调里的异常，Node.js 原生提供 `uncaughtException` 事件挂到 `process` 对象上，用于捕获所有未处理的异常：

```javascript
process.on("uncaughtException", function (err) {
    console.error("Error caught in uncaughtException event:", err);
});
try {
    process.nextTick(function () {
        fs.readFile("non_existent.js", function (err, str) {
            if (err) throw err;
            else console.log(str);
        });
    });
} catch (e) {
    console.error("Error caught by catch block:", e);
}
```

执行的结果是代码进到了 uncaughtException 的回调里而不是 catch 块。 uncaughtException 虽然能够捕获异常，但是此时错误的上下文已经丢失，即使看到错误也不知道哪儿报的错，定位问题非常的不利。而且一旦 uncaughtException 事件触发，整个 node 进程将 crash 掉，如果不做一些善后处理的话会导致整个服务挂掉，这对于线上的服务来说将是非常不好的。

### [](http://www.alloyteam.com/2013/12/node-js-series-exception-caught/#%E4%BD%BF%E7%94%A8domain%E6%A8%A1%E5%9D%97%E6%8D%95%E6%8D%89%E5%BC%82%E5%B8%B8)使用 domain 模块捕捉异常

随 Node.js v0.8 版本发布了一个 [domain](http://nodejs.org/api/domain.html)（域）模块，专门用于处理异步回调的异常，使用 `domain` 我们将很轻松的捕获异步异常：

运行上面的代码，我们会看到错误被 domain 捕获到，并且 uncaughtException 回调并不会执行，事情似乎变得稍微容易些了。

但是如果研究 domain 模块的 API 很快我们会发现，domain 提供了好几个方法，理解起来似乎不是那么直观（其实为啥这个模块叫 “域 (domain)” 呢，总感觉些许别扭），这里简单解释下：

```javascript
process.on("uncaughtException", function (err) {
    console.error("Error caught in uncaughtException event:", err);
});
var d = domain.create();
d.on("error", function (err) {
    console.error("Error caught by domain:", err);
});
d.run(function () {
    process.nextTick(function () {
        fs.readFile("non_existent.js", function (err, str) {
            if (err) throw err;
            else console.log(str);
        });
    });
});
```

首先，关于 domain 模块，我们看到它的稳定性是 2，也就是不稳定，API 可能会变更。

默认情况下，domain 模块是不被引入的，当 `domain.create()`创建一个 domain 之后，调用 `enter()`方法即可 “激活” 这个 domain，具体表现为全局的进程（`process`）对象上会有一个 domain 属性指向之前创建的这个的 domain 实例，同时，domain 模块上有个 `active` 属性也指向这个的 domain 实例。、

结合 [should](https://github.com/visionmedia/should.js) 断言库测试下上面说的：

```javascript
// domain was not exists by default
should.not.exist(process.domain);
var d = domain.create();
d.on("error", function (err) {
    console.log(err);
});
d.enter(); // makes d the current domain
process.domain.should.be.an.Object;
process.domain.should.equal(domain.active);
d.exit(); // makes d inactive
should.not.exist(process.domain);
```

执行之后发现几个断言都能 pass。`exit()`方法的意思是退出当前 “域”，将会影响到后续异步异常的捕获，后面会提到。

`enter` 和 `exit` 组合调用这样会使代码有些混乱，尤其是当多个 domain 混合、嵌套使用时比较难理解。

这时候可以使用 `run()`方法，`run()`其实就是对 `enter` 和 `exit` 以及回调的简单封装，即：run () -- callback () -- exit () 这样，就像上面例子中的 `run()`一样。

还有两个方法，`bind()`和 `intercept()`：

bind:

```javascript
fs.readFile(
    "non_existent.js",
    d.bind(function (err, buf) {
        if (err) throw err;
        else res.end(buf.toString());
    })
);
```

intercept：

```javascript
fs.readFile(
    "non_existent.js",
    d.intercept(function (buf) {
        console.log(buf);
    })
);
```

用法差不多，只是 intercept 拦截了异步回调，如果抛出异常就自己处理掉了。

#### [](http://www.alloyteam.com/2013/12/node-js-series-exception-caught/#domain%E7%9A%84%E9%9A%90%E5%BC%8F%E7%BB%91%E5%AE%9A)domain 的隐式绑定

domain 主要会影响 `timers` 模块（包括 `setTimeout`, `setInterval`, `setImmediate`）, 事件循环 `process.nextTick`，还有就是 event。

实现的思路都差不多，都是通过注入 domain 代码到 timer、nextTick、event 模块中，在创建的时候检查当前有没有激活（active）的 domain，有则记录下，如果是 timer 和 nextTick，当在事件循环中执行回调的时候，把 process.domain 设置为之前记录的 domain 并把错误交给它处理。如果是 event，多一步判断，先会把异常交给 event 自己定义的 error 事件处理。

这里要注意，如果这个 domain 没有绑定 `error` 事件的话，node 会直接抛出错误，即使 uncaughtException 绑定了也没有用：

```javascript
var d = domain.create();
process.on("uncaughtException", function (err) {
    console.error("Error caught in uncaughtException event:", err);
});
d.run(function () {
    process.nextTick(function () {
        fs.readFile("non_existent.js", function (err, str) {
            if (err) throw err;
            else console.log(str);
        });
    });
});
```

在这个例子里面，使用了 domain 捕获异常但是没有监听 domain 的 error 事件，监听了 uncaughtException，但是还是抛出了异常，个人觉得觉得这里是个 bug，domain 没有 errorHandle 应该把异常交给全局的 uncaughtException，后面有例子验证这一点。

还有一个小问题，同时监听了 uncaughtException 和 domain 的 error 事件，在 node v0.8 里有个 bug，uncaughtException 和 domain 都能捕获异常，0.10 + 已经修复。

#### [](http://www.alloyteam.com/2013/12/node-js-series-exception-caught/#domain%E7%9A%84%E6%98%BE%E5%BC%8F%E7%BB%91%E5%AE%9A)domain 的显式绑定

上面没有提到的两个 API 是 `add()`和 `remove()`，add 作用是把 domain 创建之前创建的（EventEmitter 实例）对象添加到这个 domain 里边，然后这个对象即可使用 domain 捕捉异常了，remove 则相反。domain 对象上有个 numbers 队列专门用于管理 add 后的对象。

这里可参考[官方示例](http://nodejs.org/api/domain.html#domain_explicit_binding)。

#### [](http://www.alloyteam.com/2013/12/node-js-series-exception-caught/#domain%E5%A6%82%E4%BD%95%E6%8A%9B%E5%87%BA%E5%BC%82%E5%B8%B8)domain 如何抛出异常

我们看 [node 源码](https://github.com/joyent/node/blob/v0.10.4/src/node.js#L43)有这么一行：

    // do this good and early, since it handles errors.
    startup.processFatal();

`processFatal` 里边调用 `process._fatalException()`，先判断是否存在 process.domain，尝试把错误交给 process.domain 处理，如果不存在才交给 uncaughtException 处理，所以 domain 捕获异常的关键代码在 [node.js#L219](https://github.com/joyent/node/blob/v0.10.4/src/node.js#L219)。

这里尝试修改下上面的例子，在抛出异常前把 process.domain 设为 null：

```javascript
d.run(function () {
    process.domain = null;
    process.nextTick(function () {
        fs.readFile("non_existent.js", function (err, str) {
            if (err) throw err;
            else console.log(str);
        });
    });
});
```

这下 uncaughtException 将捕获异常！

当上面提到的异常都没被捕获，进程将直接退出 [node.js#L280](https://github.com/joyent/node/blob/v0.10.4/src/node.js#L280)：

    // if someone handled it, then great.  otherwise, die in C++ land
    // since that means that we'll exit the process, emit the 'exit' event
    ...
    process.emit('exit', 1);

另外关于 domain 如何在多个不同的事件循环中传递，可以参考下[这篇](http://deadhorse.me/nodejs/2013/04/13/exception_and_domain.html)文章。

值得关注的是，并不是所有在 domain 域下创建的事件分发器（EventEmitter）上面的异步异常都能捕获：

```javascript
var d = domain.create();
var msg;
var Msg = function () {
    events.EventEmitter.call(this);
    this.on("msg", function (msg) {
        console.log(msg);
    });
    this.send = function (msg) {
        this.emit("msg", msg);
    };
    this.read = function (file) {
        var root = this;
        fs.readFile(file, function (err, buf) {
            if (err) throw err;
            else root.send(buf.toString());
        });
    };
};
require("util").inherits(Msg, events.EventEmitter);
d.on("error", function (err) {
    console.error("Error caught by domain:", err);
});
d.run(function () {
    msg = new Msg();
});
msg.read("non_existent.js");
```

这个例子中，msg 对象虽然是在 domain 中实例化，但是 msg.send 里边 fs.readFile 在执行回调的时候，process.domain 是 `undefined`。

我们稍微改造下，把 readFile 的回调绑定到 domain 上，或者把 msg.send () 的调用放到 d.run () 包裹，结果可预知，能正常捕获抛出的异常。为了验证，尝试改造下 readFile：

```c
fs.readFile(file, function(err, buf) {
    process.domain = d;
    if(err) throw err;
    else root.send(buf.toString());
});
```

这样亦可捕获异常，不过实际中不要这样写，还是要采用 domain 提供的方法。

#### [](http://www.alloyteam.com/2013/12/node-js-series-exception-caught/#%E6%9B%B4%E5%A5%BD%E7%9A%84%E4%BD%BF%E7%94%A8domain)更好的使用 domain

其实上，更推荐的做法是，如果在活动 domain 里面创建了事件分发器（EventEmitter）实例，我们应该尽可能的给它注册 error 事件，把错误都抛给这个 EventEmitter 实例处理，就像上面的例子，我们改造下，绑定 error 事件并把 readFile 的错误交给 Msg 实例处理：

```javascript
this.on("error", function (err) {
    throw err;
});
this.read = function (file) {
    var root = this;
    fs.readFile(file, function (err, buf) {
        if (err) root.emit("error", err);
        else root.send(buf.toString());
    });
};
```

在书写 Node.js 代码的时候，对于事件分发器，应该养成先绑定（`on()`或 `addEventListener()`）后触发（`emit()`）的习惯。在执行事件回调的时候，**对于有可能抛异常的情况，应该把 emit 放到 domain 里去**：

```javascript
var d = domain.create();
var e = new events.EventEmitter();
d.on("error", function (err) {
    console.error("Error caught by domain:", err);
});
e.on("data", function (err) {
    if (err) throw err;
});
if (Math.random() > 0.5) {
    d.run(function () {
        e.emit("data", new Error("Error in domain runtime."));
    });
} else {
    e.emit("data", new Error("Error without domain."));
}
```

根据 [domain#L187](https://github.com/joyent/node/blob/v0.10.4/lib/domain.js#L187) 可知，run 会把传进去的函数包装成另一个函数返回，并在这个返回的函数上设置 domain：

    b.domain = this;

events 模块 [events.js#L85](https://github.com/joyent/node/blob/v0.10.4/lib/events.js#L85) 有这么一行：

```javascript
if (this.domain && this !== process) this.domain.enter();
```

当调用 e.emit () 的时候，如果回调函数上挂有 domain，则将这个 domain 激活，进而可以捕获异常。

#### [](http://www.alloyteam.com/2013/12/node-js-series-exception-caught/#domain%E7%9A%84%E7%BC%BA%E9%99%B7)domain 的缺陷

有了 domain，似乎异步异常捕捉已经不再是难事。Node.js 允许创建多个 domain 实例，并允许使用 add 添加多个事件分发器给 domain 管理，，而且 domain 之间可以相互嵌套，而创建 domain，是有一定的性能耗损的，这样带来了一个棘手的问题是：多个 domain 如何合理的创建与销毁，domain 的运行期应该如何维护？

还有一点，domain 并不能捕捉所有的异常，看[这里](https://github.com/domenic/domains-tragedy)。

#### [](http://www.alloyteam.com/2013/12/node-js-series-exception-caught/#domain%E5%AE%9E%E8%B7%B5)domain 实践

关于使用 domain 到集群环境，推荐都看看官方的说明：[Warning: Don't Ignore Errors!](http://nodejs.org/docs/latest/api/domain.html#domain_warning_don_t_ignore_errors)。把每一个网络请求都包在一个 domain 里边，捕获到异常时，不要立即退出进程，应该保证进程中其他连接正常退出之后再 exit，官方推荐的是设一个定时器，过 3min 后退出进程，接下去做善后处理，然后应该返回应该有的错误（如 500）给客户端。

对于 connect 或者 express 创建的 web 服务，有一个 [domain-middleware](https://github.com/fengmk2/domain-middleware) 中间件可以直接用，它会把 next 包装到一个已经定制好的 domain 里边。

在具体应用场景，应该 uncaughtException 事件配合 domain 来用。

本篇完，欢迎补充指正，所有用到的例子都在[这里](https://github.com/chemdemo/chemdemo.github.io/blob/master/demos/domain_demo.js)。

参考资料：

-   <http://nodejs.org/docs/latest/api/domain.html>
-   <https://github.com/joyent/node>
-   <http://www.slideshare.net/domenicdenicola/domains-20010482>
-   <http://deadhorse.me/nodejs/2013/04/13/exception_and_domain.html>

<!-- {% endraw %} - for jekyll -->