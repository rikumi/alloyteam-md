---
title: 【Javascript 设计模式 10】- 模版方法模式
date: 2012-10-24
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-template-method-pattern/
---

<!-- {% raw %} - for jekyll -->

模式方法是预先定义一组算法，先把算法的不变部分抽象到父类，再将另外一些可变的步骤延迟到子类去实现。听起来有点像工厂模式 (非前面说过的简单工厂模式).  
最大的区别是，工厂模式的意图是根据子类的实现最终获得一种对象。而模版方法模式着重于父类对子类的控制.  

按 GOF 的描叙，模版方法导致一种反向的控制结构，这种结构有时被称为 “好莱坞法则”，即 “别找我们，我们找你”。这指的是一个父类调用一个子类的操作，而不是相反。  
一个很常用的场景是在一个公司的项目中，经常由架构师搭好架构，声明出抽象方法。下面的程序员再去分头重写这些抽象方法。

在深入了解之前，容许我先扯远一点。  
作为一个进化论的反对者，假设这个世界是上帝用代码创造的。那么上帝创造生命的时候可能就用到了模版方法模式。看看他是怎么在生命构造器中声明模版方法的：

```javascript
var Life = function(){
}
Life.prototype.init = function(){
   this.DNA复制();
   this.出生();
   this.成长();
   this.衰老();
   this.死亡();
}
this.prototype.DNA复制 = function(){
  &*$%&^%^&(&(&(&&(^^(*)  //看不懂的代码
}
Life.prototype.出生 = function(){
}
Life.prototype.成长 = function(){
}
Life.prototype.衰老 = function(){
}
Life.prototype.死亡 = function(){
}
```

其中 DNA 复制是预先定义的算法中不变部分。所有子类都不能改写它。如果需要我们可以写成 protected 的类型.  
而其他的函数在父类中会被先定义成一个空函数 (钩子). 然后被子类重写，这就是模版方法中所谓的可变的步骤。  
假设有个子类哺乳动物类继承了 Life 类.

```javascript
var Mammal = function () {};
Mammal.prototype = Life.prototype; //继承Life
```

然后重写出生和衰老这两个钩子函数.


<!-- {% endraw %} - for jekyll -->