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
```


<!-- {% endraw %} - for jekyll -->