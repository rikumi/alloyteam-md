---
title: 【Javascript 设计模式 7】- 外观模式
date: 2012-10-24
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-appearance-mode/
---

<!-- {% raw %} - for jekyll -->

外观模式 (门面模式)，是一种相对简单而又无处不在的模式。外观模式提供一个高层接口，这个接口使得客户端或子系统更加方便调用。  
用一段再简单不过的代码来表示

```javascript
var getName = function(){
  return ''svenzeng"
}
var getSex = function(){
   return 'man'
}
```

如果你需要分别调用 getName 和 getSex 函数。那可以用一个更高层的接口 getUserInfo 来调用.

```javascript
var getUserInfo = function () {
    var info = a() + b();
    return info;
};
```

也许你会问为什么一开始不把 getName 和 getSex 的代码写到一起，比如这样

```javascript
var getNameAndSex = function(){
  return 'svenzeng" + "man";
}
```

答案是显而易见的，饭堂的炒菜师傅不会因为你预定了一份烧鸭和一份白菜就把这两样菜炒在一个锅里。他更愿意给你提供一个烧鸭饭套餐。同样在程序设计中，我们需要保证函数或者对象尽可能的处在一个合理粒度，毕竟不是每个人喜欢吃烧鸭的同时又刚好喜欢吃白菜。  
外观模式还有一个好处是可以对用户隐藏真正的实现细节，用户只关心最高层的接口。比如在烧鸭饭套餐的故事中，你并不关心师傅是先做烧鸭还是先炒白菜，你也不关心那只鸭子是在哪里成长的。

最后写个我们都用过的外观模式例子

```javascript
var stopEvent = function (e) {
    //同时阻止事件默认行为和冒泡
    e.stopPropagation();
    e.preventDefault();
};
```

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