---
title: 详解 NodeJs 的 VM 模块
date: 2015-04-29
author: TAT.dorsywang
source_link: http://www.alloyteam.com/2015/04/xiang-jie-nodejs-di-vm-mo-kuai/
---

## 什么是 VM？

VM 模块是 NodeJS 里面的核心模块，支撑了 require 方法和 NodeJS 的运行机制，我们有些时候可能也要用到 VM 模板来做一些特殊的事情。  
通过 VM，JS 可以被编译后立即执行或者编译保存下来稍后执行（JavaScript code can be compiled and run immediately or compiled, saved, and run later.）  
VM 模块包含了三个常用的方法，用于创建独立运行的沙箱体制，如下三个方法

vm.runInThisContext(code, filename);  

* * *

此方法用于创建一个独立的沙箱运行空间，code 内的代码可以访问外部的 global 对象，但是不能访问其他变量  
而且 code 内部 global 与外部共享

```javascript
var vm = require("vm");
var p = 5;
global.p = 11;
vm.runInThisContext("console.log('ok', p)"); // 显示global下的11
vm.runInThisContext("console.log(global)"); // 显示global
console.log(p); // 显示5
```

vm.runInContext(code, sandBox);  

* * *

此方法用于创建一个独立的沙箱运行空间，sandBox 将做为 global 的变量传入 code 内，但不存在 global 变量  
sandBox 要求是 vm.createContext () 方法创建的 sandBox

```javascript
var vm = require("vm");
var util = require("util");
var window = {
    p: 2,
    vm: vm,
    console: console,
    require: require,
};
var p = 5;
global.p = 11;
vm.createContext(window);
vm.runInContext("p = 3;console.log(typeof global);", window); // global是undefined
console.log(window.p); // 被改变为3
console.log(util.inspect(window));
```

## vm.runInNewContext(code, sandbox, opt);

这个方法应该和 runInContext 一样，但是少了创建 sandBox 的步骤

## 比较

![5](http://alloyteam.github.io/AlloyPhoto/res/aa.png)

## 更为复杂的情形

如果 runInContext 里面执行 runInThisContext 会是怎么样，runInThisContext 访问到的 global 对象是谁的？  
如下代码将会怎么执行？

```javascript
var vm = require("vm");
var util = require("util");
var window = {
    p: 2,
    vm: vm,
    console: console,
    require: require,
};
window.global = window;
var p = 5;
global.p = 11;
vm.runInNewContext(
    "p = 3;console.log(typeof global);require('vm').runInThisContext(\"console.log(p)\");",
    window
);
```

runInThisContext 里面的代码可以访问外部的 global 对象，但外面实际上不存在 global 对象 (虽然有，但本质不是 global 对象）, 只要记住一点，runInThisContext 只能访问最顶部的 global 对象就 OK 了  
执行结果如下  
object (global 存在）  
11（顶部 global 的 p)