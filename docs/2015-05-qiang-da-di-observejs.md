---
title: 强大的 observejs
date: 2015-05-07
author: TAT.dnt
source_link: http://www.alloyteam.com/2015/05/qiang-da-di-observejs/
---

<!-- {% raw %} - for jekyll -->

写在前面  

* * *

各大 MVVM 框架的双向绑定太难以观察，很难直观地从业务代码里知道发生了什么，我不是双向绑定的反对者，只是认为双向绑定不应该糅合进底层框架，而应该出现在业务代码中，或者是业务和框架之间的代码上，由开发者实现，由开发者决定观察什么，决定响应什么。  
以及 Object.observe 的支持度不够好（<http://caniuse.com/#search=observe），再者> Object.observe 的功能太弱（如对象内数组的变化无法监听）。  
所以就有了 observejs。

observe.js 意义  

* * *

\* 监听任意对象的任意数据变化  
\* 作为业务和框架之间的中间件存在  
\* 作为 mv\*框架中的监听模块（当然我是相当反对）

3 分钟精通 observe.js  

* * *

### 对象字面量

```javascript
var obj = { a: 1 };
//watch obj
observe(obj, function (name, value) {
    console.log(name + "__" + value); //a__2
});
obj.a = 2;
```

### 数组

```javascript
var arr = [1, 2, 3];
//watch obj
observe(arr, function (name, value, old) {
    console.log(name + "__" + value + "__" + old);
});
arr.push(4); //array__push
arr[3] = 5; //3__5
```

### 复杂对象

```javascript
var complexObj = { a: 1, b: 2, c: [{ d: [4] }] };
//watch complexObj
observe(complexObj, function (name, value) {
    console.log(name + "__" + value); //d__100
});
complexObj.c[0].d = 100;
```

### 普通对象


<!-- {% endraw %} - for jekyll -->