---
title: Javascript 中有趣的反柯里化技术
date: 2013-08-12
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2013/08/javascript-zhong-you-qu-di-fan-ke-li-hua-ji-shu/
---

<!-- {% raw %} - for jekyll -->

反柯里化 (uncurrying, 非 currying) 的话题来自 javascript 之父 Brendan Eich 去年的一段 twitter. 近几天研究了一下，觉得这个东东非常有意思，分享一下。先忘记它的名字，看下它能做什么.

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/1.gif "1")](http://www.alloyteam.com/wp-content/uploads/2013/08/1.gif)

不要小看这个功能，试想下，我们在写一个库的时候，时常会写这样的代码，拿 webQQ 的 Jx 库举例。

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/2.gif "2")](http://www.alloyteam.com/wp-content/uploads/2013/08/2.gif)

我们想要的，其实只是借用 Array 原型链上的一些函数。并没有必要去显式的构造一个新的函数来改变它们的参数并且重新运算。

如果用 uncurrying 的方式显然更加优雅和美妙，就像这样：  
[![](http://www.alloyteam.com/wp-content/uploads/2013/08/3.gif "3")](http://www.alloyteam.com/wp-content/uploads/2013/08/3.gif)

调用方式跟之前一样，Jx.Array.indexOf ( \[ 1, 2 ,3 ], 2 );  
还能做很多有趣和方便的事情.  
[![](http://www.alloyteam.com/wp-content/uploads/2013/08/4.png "4")](http://www.alloyteam.com/wp-content/uploads/2013/08/4.png)

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/5.png "5")](http://www.alloyteam.com/wp-content/uploads/2013/08/5.png)

甚至还能把 call 和 apply 方法都 uncurrying，把函数也当作普通数据来使用。使得 javascript 中的函数调用方式更像它的前生 scheme, 当函数名本身是个变量的时候，这种调用方法特别方便.  
scheme 里面调用函数是这样:

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/6.png "6")](http://www.alloyteam.com/wp-content/uploads/2013/08/6.png)

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/7.png "7")](http://www.alloyteam.com/wp-content/uploads/2013/08/7.png)

再看看 jquery 库，由于 jquery 对象 (即通过 $() 创建的对象 ) 是一个对象冒充的伪数组，它有 length 属性，并且能够通过下标查找对应的元素，当需要给 jquery 对象添加一个成员时，伪代码大概是：

$.prototype.push = function( obj ){  
this\[ this.length ] = obj;  
this.length = this.length + 1  
}  
如果用 uncurrying 的话，就可以

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/8.gif "8")](http://www.alloyteam.com/wp-content/uploads/2013/08/8.gif)

借用了 array 对象的 push 函数，让引擎去自动管理数组成员和 length 属性.

而且可以一次把需要的函数全部借过来，一劳永逸。一段测试代码:

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/9-.gif "9")](http://www.alloyteam.com/wp-content/uploads/2013/08/9-.gif)

总的来说，使用 uncurrying 技术，可以让任何对象拥有原生对象的方法。好了，如果到这里依然没有引起你的兴趣，那拜拜。  
接下来一步一步来看看原理以及实现。

在了解反 currying 化这个奇怪的名字之前，我们得先搞清楚 currying。  
维基百科上的定义：科里化 (currying); 又称部分求值，是把接受多个参数的函数变换成接受一个单一参数的函数，并且返回接受余下的参数并且返回结果的新函数的技术。

通俗点讲，currying 有点类似买房子时分期付款的方式，先给一部分首付 (一部分参数)， 返回一个存折（返回一个函数），合适的时候再给余下的参数并且求值计算。  
来看看我们都用过的 currying, 我们经常在绑定 context 的时候实现一个 Function.prototype.bind 函数.

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/10.gif "10")](http://www.alloyteam.com/wp-content/uploads/2013/08/10.gif)

高阶函数是实现 currying 的基础，所谓高阶函数至少满足这 2 个特性：  
1， 函数可以当作参数传递，  
2， 函数可以作为返回值。

Javascript 在设计之初，参考了很多 scheme 语言的特性。而 scheme 是函数式语言鼻祖 lisp 的 2 大方言之一，所以 javascript 也拥有一些函数式语言的特性，包括高阶函数，闭包，lambda 表达式等。

当 javascript 中的函数返回另一个函数，此时会形成一个闭包，而在闭包中就可以保存第一次运算的参数，我们用这个思想，来写一个通用的 currying 函数。

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/11.gif "11")](http://www.alloyteam.com/wp-content/uploads/2013/08/11.gif)

我们约定，当传入参数时候，继续 currying 化，参数为空时才开始求值.  
假设在实现一个计算每月花费的函数，每天结束前我们都要记录今天花了多少钱，但我们只关心月底的花费总值，无需每天都计算一次.

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/12.gif "12")](http://www.alloyteam.com/wp-content/uploads/2013/08/12.gif)

使用 currying 函数，便可以延迟到最后一刻才一起计算，好处不言而喻，在很多场合可以避免无谓的计算，节省性能，也是实现惰性求值的一种方案.

currying 并非这次要讨论的重点，现在走进正题，  
curring 是预先填入一些参数.  
反 curring 就是把原来已经固定的参数或者 this 上下文等当作参数延迟到未来传递.  
其实就是搞这样一个事情，将：  
obj.foo (arg1) //foo 本来是只在 obj 上的函数。就像 push 原本只在 Array.prototype 上  
转化成这样的形式

foo (obj, arg1) // 跟我们举的第一个例子一样。将 \[].push 转换成 push ( \[] )  
就像原本是接在电视插头上的插座，把它拆下来之后，其实也能用来接冰箱。  
Ecma 上 Array 和 String 的每个原型方法后面都有这么一段话，比如 push：

The push function is intentionally generic; it does not require that its this value be an Array object.  
Therefore it can be transferred to other kinds of objects for use as a method. Whether the concat function can be applied.  
Javascript 为什么要这样设计，我们先来复习下动态语言中重要的鸭子类型思想.  
说个故事：

很久以前有个皇帝喜欢听鸭子呱呱叫，于是他召集大臣组建一个一千只鸭子的合唱团。大臣把全国的鸭子都抓来了，最后始终还差一只。有天终于来了一只自告奋勇的鸡，这只鸡说它也会呱呱叫，好吧在这个故事的设定里，它确实会呱呱叫。 后来故事的发展很明显，这只鸡混到了鸭子的合唱团中。— 皇帝只是想听呱呱叫，他才不在乎你是鸭子还是鸡呢。

这个就是鸭子类型的概念，在 javascript 里面，很多函数都不做对象的类型检测，而是只关心这些对象能做什么。  
Array 构造器和 String 构造器的 prototype 上的方法就被特意设计成了鸭子类型。这些方法不对 this 的数据类型做任何校验。这也就是为什么 arguments 能冒充 array 调用 push 方法.

看下 v8 引擎里面 Array.prototype.push 的代码:  
function ArrayPush() {  
var n = TO_UINT32( this.length );  
var m = %\_ArgumentsLength();  
for (var i = 0; i &lt; m; i++) {  
this\[i+n] = %\_Arguments (i); // 属性拷贝  
this.length = n + m; // 修正 length  
return this.length;  
}  
}

可以看到，ArrayPush 方法没有对 this 的类型做任何显示的限制，所以理论上任何对象都可以被传入 ArrayPush 这个访问者。  
我们需要解决的只剩下一个问题， 如何通过一种通用的方式来使得一个对象可以冒充 array 对象。  
真正的实现代码其实很简单:

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/13.gif "13")](http://www.alloyteam.com/wp-content/uploads/2013/08/13.gif)

这段代码虽然很短，初次理解的时候还是有点费力。我们拿 push 的例子看看它发生了什么.  
var push = Array.prototype.push.uncurrying();  
push( obj, 'first' );  
[![](http://www.alloyteam.com/wp-content/uploads/2013/08/14.gif "14")](http://www.alloyteam.com/wp-content/uploads/2013/08/14.gif)


<!-- {% endraw %} - for jekyll -->