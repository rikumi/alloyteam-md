---
title: NodeJS 中的 EventEmitter 模块
date: 2015-08-31
author: TAT.joeyguo
source_link: http://www.alloyteam.com/2015/08/eventemitter/
---

<!-- {% raw %} - for jekyll -->

EventEmitter 简单介绍  

* * *

在 Nodejs 中，异步的 I/O 操作在完成时会触发事件队列中的具体事件。这里的主要原因是这些对象本质上是通过继承 EventEmitter 来实现对事件的处理和回调，如文件的 file 读写等。（这里的事件与 DOM 树上事件不同，不存在事件冒泡和捕获的情况。）我们也可以让自定义的对象通过继承 EventEmitter 来让其走观察者模式（事件监听与触发），主要通过 EventEmitter 的 on 和 emit 这些方法来构成。也有更为具体的 API。如 emitter.once (event,listener) 添加一次性 listener（这个 listener 只会被触发一次，触发完成后就被删除）。

EventEmitter 主要 API  

* * *

emitter.on (event, listener) 注册一个事件。

emitter.once (event, listener) 注册一个一次性的事件，触发后就被抹掉。

emitter.removeListener (event, listener) 在时间队列中剔除某一个事件

emitter.removeAllListeners(\[event]) 删除整个事件队列，或多个事件

emitter.listeners (event) 返回某些事件 emitter.emit (event, \[arg1], \[arg2], \[...]) 触发事件，可传入具体参数

使用 EventEmitter 的方式  

* * *

### 1. 直接实例化获取 EventEmitter

```javascript
var events = require("events");
// 实例化EventEmitter
var emitter = new events.EventEmitter();
// 绑定sayHi事件
// 可以绑定多个同名事件，触发时会顺序触发
emitter.on("sayHi", function (someone) {
    console.log("我是", someone);
});
emitter.on("sayHi", function (someone) {
    console.log("我就是", someone);
});
// 触发sayHi事件
emitter.emit("sayHi", "jerry");
// 输出
// 我是jerry
// 我就是jerry
```

### 2. 通过继承来获取事件对象的方法

```javascript
// 引用util工具方便继承
var util = require("util");
var events = require("events");
// 创建自定义对象
var Cat = function (name) {
    this.name = name;
};
// 继承events.EventEmitter
util.inherits(Cat, events.EventEmitter);
// 创建自定义对象实例
var Tom = new Cat("Tom");
// 绑定sayHiTo事件
Tom.on("sayHi", function (someone) {
    // this指向实例Tom
    console.log(this.name, " sayHiTo ", someone);
});
Tom.emit("sayHiTo", "jerry");
// 输出
// Tom sayHiTo jerry
```

EventEmitter 其他 API  

* * *

### emitter.once(event, listener)

emitter.once 是一次性监听，触发一次后，监听将被移除，并返回 false

```javascript
var EventEmitter = require("events").EventEmitter;
var emitter = new EventEmitter();
emitter.once("sayHi", function (someone) {
    console.log(someone);
});
emitter.emit("sayHi", "jerry");
// 输出
// sayHi jerry
var res = emitter.emit("sayHi", "jerry");
// 无输出，res为false
```

### emitter.removeListener(event, listener)

移除监听事件的对应的 listener

```javascript
var EventEmitter = require("events").EventEmitter;
var emitter = new EventEmitter();
emitter.on("sayHi", function (someone) {
    console.log(someone);
});
emitter.removeListener("sayHi", function () {
    console.log("sayHi event");
});
emitter.emit("jerry");
// 输出： jerry
```

上面代码仍然输出了 jerry，原因在于 removeListener (event, listener) 中的 listener 需要是注册到 event 事件中的函数。而不是 removeListener 执行完了之后的回调函数。 所以要如下进行删除 listener

```javascript
var EventEmitter = require("events").EventEmitter;
var emitter = new EventEmitter();
var sayHiCallBack = function (someone) {
    console.log(someone);
};
emitter.on("sayHi", sayHiCallBack);
emitter.removeListener("sayHi", sayHiCallBack);
emitter.emit("jerry");
// 无输出。即成功remove了sayHi事件
```

EventEmitter 为 node 的事件注册和分发提供了较好的形式。提高的代码的可读性及维护的便利性。


<!-- {% endraw %} - for jekyll -->