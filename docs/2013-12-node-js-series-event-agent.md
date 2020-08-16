---
title: Node.js 系列之 —— 事件代理
date: 2013-12-31
author: TAT.Perlt
source_link: http://www.alloyteam.com/2013/12/node-js-series-event-agent/
---

<!-- {% raw %} - for jekyll -->

本篇介绍关于 Node.js 事件代理的一个解决方案。

项目实践中，有遇到使用 nodejs 解决实际问题场景。Node.js 以 Javascript 作为语言，解决问题时，采用了 EventProxy 做事件代理，避免事件嵌套回调。

### EventProxy 做为一个组件，包含如下特点：

1.  内部包含事件代理机制，能避免多重回调嵌套问题
2.  符合 CMD，AMD 及 CommonJS 等其它的模块设计标准
3.  包装友好的回调处理监听器，包含标准的 Node.js 错误处理方法
4.  兼容多平台，能够被应用到 Node.js 和各种浏览器环境中

### 一、Eventproxy 解决问题的例子

在使用 Node.js 解决问题的时候，经常遇到多函数嵌套回调问题，引用例子：

```javascript
var render = function (template, data) {
    _.template(template, data);
};
$.get("template", function (template) {
    // something
    $.get("data", function (data) {
        // something
        $.get("l10n", function (l10n) {
            // something
            render(template, data, l10n);
        });
    });
});
```

为了避免这种较为臃肿的代码编写方式，可以考虑使用 Eventproxy 组件解耦调用模块，引用例子：

```javascript
var ep = EventProxy.create("template", "data", "l10n", function (template, data, l10n) {
  _.template(template, data, l10n);
});
 
$.get("template", function (template) {
  // something
  ep.emit("template", template);
});
$.get("data", function (data) {
  // something
  ep.emit("data", data);
});
$.get("l10n", function (l10n) {
  // something
  ep.emit("l10n", l10n);
});
 
这样很好避免了回调函数嵌套使用，使得处理函数和调用函数能够声明在程序的合适位置。
```

### 二、Eventproxy 拥有的接口

1.  addListener 绑定事件监听器
2.  after 在某个事件之后在限制的次数之内执行某个监听器
3.  all 在所有绑定事件触发之后，执行一次监听器
4.  any 在某个绑定的事件触发之后，执行一次监听器
5.  asap 绑定事件，并且执行一次监听器
6.  assign 等同于 all
7.  assignAll 在所有绑定事件触发之后，优先执行一次监听器
8.  assignAlways 等同于 assignAll
9.  bind 等同于 addListener
10. done 返回一个事件成功执行的代理函数
11. doneLater 返回一个事件成功执行的异步代理函数
12. emit 触发事件，并且执行所有监听器
13. emitLater  异步触发事件，并且执行所有监听器
14. fail 绑定一个只执行一次的错误回调函数
15. fire 触发某个事件，并且执行所有监听器
16. group 按绑定顺序执行某个监听器，并且将结果有序返回给用 after 绑定在这个事件的监听器
17. immediate 等同于 asap
18. not 绑定时间监听器，非某个事件执行监听器
19. on  等同于 addListener
20. once 绑定并且返回只执行一次的事件监听器
21. removeAllListeners  等同于 removeListener
22. removeListener 移除事件的监听器
23. subscribe  等同于 addListener
24. tail 等同于 assignAll
25. trigger 等同于 emit
26. unbind 等同于 removeListener
27. Eventproxy.create 创建一个 Eventproxy 实例。如果有绑定事件，在每次事件触发后，减少调用参数，执行相应监听器。

### 三、Eventproxy 安装和使用

#### Node 用户

通过 NPM 安装即可使用：

    $ npm install eventproxy

调用:

```javascript
var EventProxy = require("eventproxy");
```

#### 普通环境

在页面中嵌入脚本即可使用：

```html
<script src="https://raw.github.com/JacksonTian/eventproxy/master/lib/eventproxy.js"></script>
```

使用：

    // EventProxy此时是一个全局变量

```javascript
var ep = new EventProxy();
```

参考资料：

-   <https://npmjs.org/package/eventproxy>
-   <https://github.com/JacksonTian/eventproxy>
-   <https://github.com/JacksonTian/eventproxy/blob/master/lib/eventproxy.js>
-   <http://nodejs.org/api/process.html#process_process_nexttick_callback>


<!-- {% endraw %} - for jekyll -->