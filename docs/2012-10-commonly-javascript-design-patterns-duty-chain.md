---
title: 【Javascript 设计模式 15】- 职责链模式
date: 2012-10-24
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-duty-chain/
---

<!-- {% raw %} - for jekyll -->

职责链模式是一个对象 A 向另一个对象 B 发起请求，如果 B 不处理，可以把请求转给 C，如果 C 不处理，又可以把请求转给 D。一直到有一个对象愿意处理这个请求为止。

打个比方，客户让老板写个 php 程序。老板肯定不写，然后老板交给了部门经理。部门经理不愿意写，又交给项目经理。项目经理不会写，又交给程序员。最后由码农来完成。  

在这个假设里， 有几条职责链模式的特点。

1 老板只跟部门经理打交道，部门经理只联系项目经理，项目经理只找码农的麻烦。  
2 如果码农也不写，这个项目将会流产。  
3 客户并不清楚这个程序最后是由谁写出来的。  
js 中的事件冒泡就是作为一个职责链来实现的。一个事件在某个节点上被触发，然后向根节点传递， 直到被节点捕获。

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