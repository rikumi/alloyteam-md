---
title: 搞懂闭包
date: 2019-07-20
author: TAT.yaoyao
source_link: http://www.alloyteam.com/2019/07/closure/
---

<!-- {% raw %} - for jekyll -->

闭包这个概念是前端工程师必须要深刻理解的，但是网上确实有一些文章会让初学者觉得晦涩难懂，而且闭包的文章描述不一。

本文面向初级的程序员，聊一聊我对闭包的理解。当然如果你看到闭包联想不到`作用域链`与`垃圾回收`也不妨看一眼。希望读了它之后你不再对闭包蒙圈。

### 先体验一下闭包

这里有个需求，即写一个计数器的函数，每调用一次计数器返回值加一：

    counter()   // 1
    counter()   // 2
    counter()   // 3
    ......

要想函数每次执行的返回不一样，怎么搞呢？ 先简单的写一下：

```javascript
var index = 1;
function counter() {
    return index++;
}
```

这样做的确每次返回一个递增的数。但是，它有以下三个问题：

1.  这个 index 放在全局，其他代码可能会对他进行修改
2.  如果我需要同时用两个计数器，但这种写法只能满足一个使用，另一个还想用的话就要再写个 counter2 函数，再定义一个 index2 的全局变量。
3.  计数器是一个功能，我只希望我的代码里有个 counter 函数就好，其他的最好不要出现。这是稍微有点代码洁癖的都会觉得不爽的。

三个痛点，让闭包来一次性优雅解决：

```javascript
function counterCreator() {
    var index = 1;
    function counter() {
        return index++;
    }
    return counter;
}
// test
var counterA = counterCreator();
var counterB = counterCreator();
counterA(); // 1
counterA(); // 2
counterB(); // 1
counterB(); // 2
```

我的 `counterCreator` 函数只是把上面的几行代码包起来，然后返回了里面的 `counter` 函数而已。却能同时解决这么多问题，这就是闭包的魅力！ 6 不 6 啊？

![666](http://www.alloyteam.com/wp-content/uploads/2019/07/666-294x300.jpg)

### 铺垫知识

铺垫一些知识点，不展开讲。

#### 执行上下文

函数每次执行，都会生成一个会创建一个称为执行上下文的内部对象（AO 对象，可理解为函数作用域），这个 AO 对象会保存这个函数中所有的变量值和该函数内部定义的函数的引用。函数每次执行时对应的执行上下文都是独一无二的，**正常情况下函数执行完毕执行上下文就会被销毁**。

#### 作用域链

在函数定义的时候，他还获得 \[\[scope]]。这个是里面包含该函数的作用域链，初始值为引用着上一层作用域链里面所有的作用域，后面执行的时候还会将 AO 对象添加进去 。作用域链就是执行上下文对象的集合，这个集合是链条状的。


<!-- {% endraw %} - for jekyll -->