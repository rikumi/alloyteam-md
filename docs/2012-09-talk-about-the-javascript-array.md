---
title: 谈谈 Javascript Array
date: 2012-09-03
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2012/09/talk-about-the-javascript-array/
---

<!-- {% raw %} - for jekyll -->

Javascript 里的数组对象构建自 Array 构造器。比如:  
var ary = new Array (1, 2, 3) 或者 var ary = \[ 1, 2, 3 ]

在 java 里，数组会按照索引连续分配有序个元素.  
而在 javascript 里，数组的存取方式跟普通对象一模一样.

比如

```javascript
var a = [];
a[0] = 0;
和;
var a = {};
a["0"] = 0;
```

这 2 者的存取方式几乎一致。都是对一个属性表进行存取操作。所以以为用数组来存取数据比用 object 性能更高的说法未必一定是对的.

```javascript
var obj = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9 };
var ary = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
for (var i = 0; i < 10; i++) {
    Obj[i];
}
for (var i = 0; i < 10; i++) {
    ary[i];
}
```

这 2 个循环在 chrome 下测试，花费的时间完全一致.

前面说 array 对象和 object 对象属性存取的方式几乎一致，之所以说几乎是因为在某些引擎下 (测试过 chrome 和 firefox 都是如此), 用 for in 来遍历 array 对象，引擎会对 key 进行排序，比如 0 总是排在 1 之前.

```javascript
var ary = [];
ary[1] = 1;
ary[0] = 0;
for (var i in ary) {
    alert(i); //ie: 1,0.  chrome: 0,1
}
```

Array 也是从 Function 构造而来.

```javascript
Array.__proto__ === Function.prototype; //true
```

跟普通的对象最大的不同就是，array 对象有个被引擎自动维护的 length 属性，length 属性可读写但不能被枚举。当调用 push, shift 等方法时. length 的值会被引擎更改。而对 length 进行写操作时，ary 对象的属性表也可能被更改.

```javascript
var ary = [1, 2, 3];
alert(ary.length);
ary.push(4);
alert(ary.length);
ary.length = 2;
for (var i in ary) {
    alert(ary[i]);
}
```

说到 Array, 就得顺便说说 arguments.  
arguments 是 AO (activation object, 活动对象) 的一个属性，看看它的 \[\[class]] 是什么.

```javascript
(function(a,b,c){
```


<!-- {% endraw %} - for jekyll -->