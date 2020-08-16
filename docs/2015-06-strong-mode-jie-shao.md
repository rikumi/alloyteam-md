---
title: Strong Mode 介绍
date: 2015-06-30
author: TAT.云中飞扬
source_link: http://www.alloyteam.com/2015/06/strong-mode-jie-shao/
---

**_If it is too strong, then you are too weak._**

# [](http://www.alloyteam.com/2015/06/strong-mode-jie-shao/#就算是背景吧)就算是背景吧

随着 ES2015 的到来，JavaScript 引进了许多新特性，很多很强大的特性完全可以弥补 JS 本身语法上的弱点，比如让很多初次尝试 JS 的程序员感到不习惯的变量提升问题、没有块级作用域问题等问题。

# [](http://www.alloyteam.com/2015/06/strong-mode-jie-shao/#strong-mode)strong mode

ES5 增加了 `strict mode`，现在 V8 又实现了一种新的模式 ——`strong mode`。

`strong mode` 是 `strict mode` 的升级版，在语法要求上更严格了，同时正因为这些严格的要求，让开发者得以规避语言本身一些糟粕或者让人困惑的地方。

# [](http://www.alloyteam.com/2015/06/strong-mode-jie-shao/#开启strong-mode)开启 strong mode

跟开启 strict 一样，js 文件第一行或者 function 第一行加上`'use strong';`，  
使用 --strong_mode 标志位，需要 Chrome Cancry 或者 iojs v2.0 以及上。

!!! 注意了：如果 iojs 使用 --use_strong 标志位，将开启全局 strong，不管代码里有没有 'use strong;'，一律当作 strong mode 运行，因此很有可能伤及 nodejs 本身的模块和第三方不支持 strong mode 的模块，同样的 --use_strict 也是全局开启 strict 模式，都请慎用。

# [](http://www.alloyteam.com/2015/06/strong-mode-jie-shao/#strong-mode有哪些改变)strong mode 有哪些改变

下面将涉及到一些 ES2015 的新特性，这里不做详细讲解，感兴趣的读者可以关注后续 ES2015 系列相关文章。

### [](http://www.alloyteam.com/2015/06/strong-mode-jie-shao/#deprecate-sloppy-equality)Deprecate sloppy equality

废弃了 == 和！= 两个比较操作符，强制使用 === 和！==。

避免了一些意想不到的结果，大家都懂的。

```javascript
"use strong";
if (1 == 1);
```

node --strong_mode example.js

```javascript
if (1 == 1);
      ^^
SyntaxError: Please don't use '==' or '!=' in strong mode, use '===' or '!==' instead
 
```

### [](http://www.alloyteam.com/2015/06/strong-mode-jie-shao/#deprecate-var)Deprecate 'var'

废弃了 var 关键字，变量声明使用 const 或者 let。

const 和 let 不存在变量提升的问题，也可以创造块级作用域。

```javascript
"use strong";
var name = "alloyteam";
```

node --strong_mode example.js

```javascript
var name = 'alloyteam';
^^^
SyntaxError: Please don't use 'var' in strong mode, use 'let' or 'const' instead
 
```

### [](http://www.alloyteam.com/2015/06/strong-mode-jie-shao/#deprecate-delete)Deprecate 'delete'

废弃了 delete 操作符，需要 delete 的地方可以使用 set 或者 map 的 delete，可能数据结构需要改变。

```javascript
"use strong";
const obj = {
    name: "alloyteam",
};
delete obj.name;
```

node --strong_mode example.js

    delete obj.name;
               ^^^^
    SyntaxError: Please don't use 'delete' in strong mode, use maps or sets instead
     

可以这样解决

```javascript
"use strong";
const obj = new Map([["name", "alloyteam"]]);
obj.delete("name");
```

### [](http://www.alloyteam.com/2015/06/strong-mode-jie-shao/#deprecate-empty-sub-statements)Deprecate empty sub-statements

像 `if (expression);` 这样的空子语句的写法会报错了。

```javascript
"use strong";
if (1 === 1);
```

node --strong_mode example.js

```javascript
if (1 === 1);
            ^
SyntaxError: Please don't use empty sub-statements in strong mode, make them explicit with '{}' instead
 
```

### [](http://www.alloyteam.com/2015/06/strong-mode-jie-shao/#deprecate-for-in)Deprecate for-in

废弃了 `for-in` 遍历，可以使用 `for-of` 替代。

for-in 对对象属性进行遍历，for-of 对可迭代的对象进行遍历。

for-in 存在[诸多问题](http://www.infoq.com/cn/articles/es6-in-depth-iterators-and-the-for-of-loop)，如果非要遍历对象，可以使用 Object.keys (obj) 拿到对象的属性列表，然后进行数组遍历。

```javascript
"use strong";
const obj = {
    name: "alloyteam",
};
for (let k in obj) {
    console.log(k, obj[k]);
}
```

node --strong_mode example.js

```javascript
for (let k in obj) {
           ^^
SyntaxError: Please don't use 'for'-'in' loops in strong mode, use 'for'-'of' instead
 
```

可以这样解决

```javascript
"use strong";
const obj = new Map([["name", "alloyteam"]]);
for (let item of obj) {
    console.log(item[0], item[1]);
}
```

### [](http://www.alloyteam.com/2015/06/strong-mode-jie-shao/#deprecate-arguments)Deprecate 'arguments'

函数体内不能再使用 arguments 变量，可以使用...args 替代。  

```javascript
"use strong";
function test() {
    console.log(arguments);
}
```

node --strong_mode example.js  

```javascript
    console.log(arguments);
                ^^^^^^^^^
SyntaxError: Please don't use 'arguments' in strong mode, use '...args' instead
 
```

可以这样解决  
node --strong_mode --harmony-rest-parameters example.js  

```javascript
"use strong";
function test(...args) {
    console.log(args);
}
```