---
title: 谈谈函数式编程
date: 2016-09-20
author: TAT.joeyguo
source_link: http://www.alloyteam.com/2016/09/talk-about-functional-programming/
---

<!-- {% raw %} - for jekyll -->

[原文地址](https://github.com/joeyguo/blog/issues/10)

函数式编程 (Functional Programming) 是一种以函数为基础的编程方式和代码组织方式，能够带来更好的代码调试及项目维护的优势。[本篇](https://github.com/joeyguo/blog/issues/10)主要结合笔者在实际项目开发中的一些应用，简要谈谈函数式编程。

函数  

* * *

在函数式编程中，任何代码可以都是函数，且要求具有返回值，如下示例

```javascript
// 非函数式
var title = "Functional Programming";
var saying = "This is not";
console.log(saying + title); // => This is not Functional Programming
```

```javascript
// 函数式
var say = (title) => "This is " + title;
var text = say("Functional Programming"); // => This is Functional Programming
```

纯函数  

* * *

纯函数在这里指函数内外间是 “无” 关联的。主要有下面两点

-   没有副作用（side effect）  
    不会涉及到外部变量的使用或修改
-   引用透明  
    函数内只会依赖传入参数，在任何时候对函数输入相同的参数时，总能输出相同的结果

```javascript
// 非纯函数（函数内依赖函数外的变量值）
var title = "Functional Programming";
var say = () => "This is not" + title; // <= 依赖了全局变量 title
```

```javascript
// 纯函数
var say = (title) => "This is " + title; // <= 依赖了以参数 title 传入
say("Functional Programming");
```

不可变数据（immutable）  

* * *

这里主要是指变量值的不可变。当需要基于原变量值改变时，可通过产生新的变量来确保原变量的不变性，如下

```javascript
// 可变数据
var arr = ["Functional", "Programming"];
arr[0] = "Other"; // <= 修改了arr[0]的值
console.log(arr); // => ["Other", "Programming"] // 变量arr值已经被修改
```

```javascript
// 不可变数据
var arr = ["Functional", "Programming"];
// 得到新的变量，不修改了原来的值
var newArr = arr.map((item) => {
    if (item === "Functional") {
        return "Other";
    } else {
        return item;
    }
});
console.log(arr); // => ["Functional", "Programming"] 变量arr值不变
console.log(newArr); // => ["Other", "Programming"]  产生新的变量newArr
```

之所以使用这种不变值，除了更好的函数式编程外，还能够维持线程安全可靠，落地在业务中，实际上也能让代码更加清晰。  
设想，如果你定义了一个变量 A，A 在其他地方被其他人修改了，这样是不方便定位 A 的当前值的。关于定义多个变量引发的内存等问题，可以通过重用结构或部分引用的方式来减轻，可参考 immutable.js

使用 map, reduce 等数据处理函数  

* * *

强大的 JavaScript 有着越来越多的高能处理数据函数，其中包含了 map、 reduce、 filter 等。

map 能够对原数组中的值进行逐个处理并产生新的数组，一个简单例子

```javascript
// map
var data = [1, 2, 3];
var squares = data.map((item, index, array) => item * item);
console.log(squares); // => [1, 4, 9]
console.log(data); // =>  [1, 2, 3] data 还是那个 data
```

reduce 能够对原数组中的各个值进行结合处理，来产生新的值，如下面例子中，previous 代表上一个结果值，current 代表当前值，reduce 函数可以传入第二个参数作为 previous 初始值，不传时则 previous 初始值为数组中第一个值。

```javascript
// reduce
var sum = [1, 2, 3].reduce(
    (previous, current, index, array) => previous + current
);
console.log(sum); // => 6
```

函数柯里化 Currying  

* * *

柯里化 是将多参函数转换成一系列的单参函数。结合下面例子来说明下

```javascript
// 一个多参函数
var add = (a, b) => a + b;
add(1, 2); // => 3
```

将上面的多参函数进行柯里化，如下

```javascript
// 柯里化函数
var add = (a) => (b) => a + b;
```

上面柯里化后的函数调用方式也有所转变，第一次传入一个参数返回了一个函数，再传入参数则完成整体的调用，这也是利用的闭包的特性

```javascript
var add1 = add(1);
add1(2); // => 3
```

柯里化后的函数，也可以应用在生产 “函数” 上，如下示例

```javascript
var say = (title) => (type) => title + " is " + type;
var sayFP = say("Functional Programming");
var sayOther = say("Other Programming");
sayFP("good"); // => Functional Programming is good
sayOther("good"); // => Other Programming is good
```

组合函数 compose  

* * *

顾名思义，组合函数是将多个函数进行组合成一个函数。举个例子

```javascript
var compose = (fn1, fn2) => (arg) => fn1(fn2(arg));
var a = (arg) => arg + "a";
var b = (arg) => arg + "b";
var c = compose(a, b); // 将a,b函数进行组合
c("c"); // => cba
```

上面示例中，当调用组合函数 c 时，传入的参数会经过 b 函数，接着将 b 函数的返回值作为 a 函数的参数值，从而输出最终结果。  
组合函数 c 就像管道一样，将水流 (返回值) 流经各个函数中进行处理。

当想要组合很多函数成一条很长很长的 “管道” 时，那么显然上面的 compose 函数已经不够用了。下面看看 redux 是怎么做这个 compose 工具函数的。

```javascript
// 源自: redux/src/compose.js
export default function compose(...funcs) {
    if (funcs.length === 0) {
        return (arg) => arg;
    } else {
        const last = funcs[funcs.length - 1];
        const rest = funcs.slice(0, -1);
        return (...args) =>
            rest.reduceRight((composed, f) => f(composed), last(...args));
    }
}
```

代码很简洁，主要利用了递归方式和数组的 reduceRight 方法来处理，reduceRight 跟上边提到的 reduce 方法功能是一样的，不同的是 reduceRight 是从数组的末尾向前逐个处理。就这样，想拼多长的就多长。

以上，便是笔者在项目实践中应用较多的函数式编程内容，如有不妥，请斧正。

附：一些可供学习函数式编程的内容

-   Immutable.js (<https://facebook.github.io/immutable-js/>)
-   Underscore (<http://underscorejs.org/>)
-   Lodash (<https://lodash.com/>)
-   Ramda (<http://ramdajs.com/>)
-   Mori (<http://swannodette.github.io/mori/>)
-   Monads (<http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html>)

好书推荐 [《JavaScript 设计模式与开发实践》](http://www.ituring.com.cn/book/1632)

[![1632.236](http://www.alloyteam.com/wp-content/uploads/2016/09/1632.236.jpg)](http://www.ituring.com.cn/book/1632)


<!-- {% endraw %} - for jekyll -->