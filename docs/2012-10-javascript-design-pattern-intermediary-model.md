---
title: 【Javascript 设计模式 11】- 中介者模式
date: 2012-10-24
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2012/10/javascript-design-pattern-intermediary-model/
---

<!-- {% raw %} - for jekyll -->

中介者对象可以让各个对象之间不需要显示的相互引用，从而使其耦合松散，而且可以独立的改变它们之间的交互。

打个比方，军火买卖双方为了安全起见，找了一个信任的中介来进行交易。买家 A 把钱交给中介 B，然后从中介手中得到军火，卖家 C 把军火卖给中介，然后从中介手中拿回钱。一场交易完毕，A 甚至不知道 C 是一只猴子还是一只猛犸。因为中介的存在，A 也未必一定要买 C 的军火，也可能是 D，E，F。  

银行在存款人和贷款人之间也能看成一个中介。存款人 A 并不关心他的钱最后被谁借走。贷款人 B 也不关心他借来的钱来自谁的存款。因为有中介的存在，这场交易才变得如此方便。

中介者模式和代理模式有一点点相似。都是第三者对象来连接 2 个对象的通信。具体差别可以从下图中区别。

代理模式：

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/图片4.png "图片 4")](http://www.alloyteam.com/wp-content/uploads/2012/10/图片4.png)

中介者模式

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/图片5.png "图片 5")](http://www.alloyteam.com/wp-content/uploads/2012/10/图片5.png)

代理模式中 A 必然是知道 B 的一切，而中介者模式中 A,B,C 对 E,F,G 的实现并不关心。而且中介者模式可以连接任意多种对象。

切回到程序世界里的 mvc，无论是 j2ee 中 struts 的 Action. 还是 js 中 backbone.js 和 spine.js 里的 Controler. 都起到了一个中介者的作用.  
拿 backbone 举例。一个 mode 里的数据并不确定最后被哪些 view 使用. view 需要的数据也可以来自任意一个 mode. 所有的绑定关系都是在 controler 里决定。中介者把复杂的多对多关系，变成了 2 个相对简单的 1 对多关系.

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/图片6.png "图片 6")](http://www.alloyteam.com/wp-content/uploads/2012/10/图片6.png)

一段简单的示例代码：

```javascript
var mode1 = Mode.create(),  mode2 = Mode.create();
var view1 = View.create(),   view2 = View.create();
var controler1 = Controler.create( mode1, view1, function(){
  view1.el.find( ''div' ).bind( ''click', function(){
    this.innerHTML = mode1.find( 'data' );
  } )
})
var controler2 = Controler.create( mode2 view2, function(){
  view1.el.find( ''div' ).bind( ''click', function(){
    this.innerHTML = mode2.find( 'data' );
  } )
})
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