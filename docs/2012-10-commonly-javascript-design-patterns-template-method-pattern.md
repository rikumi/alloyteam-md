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

```javascript
Mammal.prototope.出生 = function(){
  '胎生()
}
Mammal.prototype.成长 = function(){
  //再留给子类去实现
}
Mammal.prototope.衰老 = function(){
  自由基的过氧化反应()
}
Life.prototype.死亡 = function(){
 //再留给子类去实现
}
//再实现一个Dog类
var = Dog = function(){
}
//Dog继承自哺乳动物.
Dog.prototype = Mammal.prototype;
var dog = new Dog();
dog.init();
```

至此，一只小狗的生命会依次经历 DNA 复制，出生，成长，衰老，死亡这几个过程。这些步骤早在它出生前就决定了。所幸的是，上帝没有安排好它生命的所有细节。它还是能通过对成长函数的重写，来成为一只与众不同的小狗。

举个稍微现实点的例子，游戏大厅中的所有游戏都有登录，游戏中，游戏结束这几个过程，而登录和游戏结束之后弹出提示这些函数都是应该公用的。  
那么首先需要的是一个父类。

```javascript
var gameCenter = function () {};
gameCenter.ptototype.init = function () {
    this.login();
    this.gameStart();
    this.end();
};
gameCenter.prototype.login = function () {
    //do something
};
gameCenter.prototype.gameStart = function () {
    //空函数, 留给子类去重写
};
gameCenter.prototype.end = function () {
    alert("欢迎下次再来玩");
};
```

接下来创建一个斗地主的新游戏，只需要继承 gameCenter 然后重写它的 gameStart 函数.

```javascript
var 斗地主 = function () {};
斗地主.prototype = gameCenter.prototype; //继承
斗地主.prototype.gameStart = (function () {
    //do something
})(new 斗地主()).init();
```

这样一局新的游戏就开始了.

## \[目录]

-   [单例模式](http://www.alloyteam.com/2012/10/common-javascript-design-patterns/ "单例模式")
-   [简单工厂模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-simple-factory-pattern/ "简单工厂模式")
-   [观察者模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-pattern-observer-mode/ "观察者模式")
-   [适配器模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-adapter-mode/ "适配器模式")
-   [代理模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-proxy-mode/ "代理模式")
-   [桥接模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-mode-bridge-mode/ "桥接模式")
-   [外观模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-appearance-mode/ "外观模式")
-   [访问者模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-the-visitor-pattern/ "访问者模式")
-   [策略模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-strategy-mode/ "策略模式")
-   [模版方法模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-template-method-pattern/ "模版方法模式")
-   [中介者模式](http://www.alloyteam.com/2012/10/javascript-design-pattern-intermediary-model/ "中介者模式")
-   [迭代器模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-iterator-mode/ "迭代器模式")
-   [组合模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-combined-mode/ "组合模式")
-   [备忘录模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-memorandum-mode/ "备忘录模式")
-   [职责链模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-duty-chain/ "职责链模式")
-   [享元模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-flyweight/ "享元模式")
-   [状态模式](http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-state-mode/ "状态模式")


<!-- {% endraw %} - for jekyll -->