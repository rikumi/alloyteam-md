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
	alert ( Object.prototype.toString.call( arguments ) );  //[object  Arguments]
})(0，1，2)
```

打印出来是 Arguments, 但 arguments 本身却是由 Object 构造.

```javascript
alert(Arguments); //undefined.
alert(arguments.constructor); //Object
arguments.__proto__ === Object.prototype; //true
```

由此可见，arguments 对象也是一个普通的 Object 对象，它无法使用 push, shift 等 Array 原型链上的方法.

在上例中，arguments 的结构类似于

```javascript
{
	0: 0,
	1:1,
	2:2,
	length: 3,  //dontEnum
	callee: function(){}  //dontEnum
 
	__proto__: Object.prototype  //dontEnum
}
```

我们经常需要把 arguments 当成数组来使用.

```javascript
(function(a,b,c){
	Array.prototype.push.call( arguments, 3 );
	alert ( arguments.length )  //4, 成功添加了一个元素.
})(0，1，2)
```

为什么 arguments 可以被当成 array 的对象，进行 push 操作。为了搞清这个，只有翻看引擎源码最靠谱.

看看 v8 的实现.

```javascript
function ArrayPush() {
    var n = TO_UINT32(this.length); //上例中, this是arguments
    var m = %_ArgumentsLength();
    for (var i = 0; i < m; i++) {
        this[i + n] = %_Arguments(i); //属性拷贝
    }
    this.length = n + m; //修正length
    return this.length;
}
```

可以清楚的看到，实际上 push 也就是一个属性拷贝的过程，顺便修正了 length 属性。至于 this 是谁，并没有做任何校验。因为 TO_UINT32 操作的存在，甚至不需要 this 这个对象拥有 length 属性，如果没有，引擎会把 length 设置为 0.

不难看出，只要满足这 2 个条件，任何对象都可以冒充 array 调用 push 方法。  
1 此对象本身要可存取属性.  
2 length 属性可读写.

第 1 点很好理解，前面说过了 push 就是一个属性拷贝的过程，看看下面的例子.

```javascript
var a = 1;
Array.prototype.push.call(a, "first");
alert(a.length); //undefined
```

第二点从 v8 的代码里也能清楚看到，因为 this.length = n + m; 这一句的关系， 要求该对象的 length 属性是可写的。回忆下 function.length. 这个 length 就是一个只读的属性，表示 function 形参的个数。所以如果使用下面的代码，还是会有问题.

```javascript
var a = function () {};
Array.prototype.push.call(a, "first");
alert(a[0]); //first， 属性拷贝的过程OK.
alert(a.length); // 0, a的length不可写
```

另外，IE 低版本中此对象必须有一个显式并且有效的 length 属性，猜测是这些引擎中没有 TO_UINT32 这个操作，待大哥们验证.

来看看一个顺利的例子

```javascript
var obj = {}
Array.prototype.push.call( obj, ''first" );
alert ( obj.length ); //1
alert( obj[0] ) //  'first"
```


<!-- {% endraw %} - for jekyll -->