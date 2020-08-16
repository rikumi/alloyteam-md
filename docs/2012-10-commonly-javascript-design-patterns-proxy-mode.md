---
title: 【Javascript 设计模式 5】- 代理模式
date: 2012-10-24
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-proxy-mode/
---

<!-- {% raw %} - for jekyll -->

代理模式的定义是把对一个对象的访问，交给另一个代理对象来操作.

举一个例子，我在追一个 MM 想给她送一束花，但是我因为我性格比较腼腆，所以我托付了 MM 的一个好朋友来送。

这个例子不是非常好， 至少我们没看出代理模式有什么大的用处，因为追 MM 更好的方式是送一台宝马。  

再举个例子，假如我每天都得写工作日报 (其实没有这么惨). 我的日报最后会让总监审阅。如果我们都直接把日报发给 总监，那可能 总监 就没法工作了。所以通常的做法是把日报发给我的组长 ， 组长把所有组员一周的日报都汇总后再发给总监 .

实际的编程中， 这种因为性能问题使用代理模式的机会是非常多的。比如频繁的访问 dom 节点，频繁的请求远程资源。可以把操作先存到一个缓冲区，然后自己选择真正的触发时机.

再来个详细的例子，之前我写了一个街头霸王的游戏，地址在 <http://alloyteam.github.com/StreetFighter/>

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/图片2.jpg "图片 2")](http://www.alloyteam.com/wp-content/uploads/2012/10/图片2.jpg)

游戏中隆需要接受键盘的事件，来完成相应动作.

于是我写了一个 keyManage 类。其中在游戏主线程里监听 keyManage 的变化.

```javascript
var keyMgr = keyManage();
 
keyMgr.listen( ''change', function( keyCode ){
 
   console.log( keyCode );
 
});
```

图片里面隆正在放升龙拳，升龙拳的操作是前下前 + 拳。但是这个 keyManage 类只要发生键盘事件就会触发之前监听的 change 函数。这意味着永远只能取得前，后，前，拳这样单独的按键事件，而无法得到一个按键组合。

好吧，我决定改写我的 keyManage 类，让它也支持传递按键组合。但是如果我以后写个 html5 版双截龙，意味着我每次都得改写 keyManage. 我总是觉得，这种函数应该可以抽象成一个更底层的方法，让任何游戏都可以用上它.

所以最后的 keyManage 只负责映射键盘事件。而隆接受到的动作是通过一个代理对象处理之后的.

```javascript
var keyMgr = keyManage();
 
keyMgr.listen( ''change', proxy( function( keyCode ){
 
   console.log( keyCode );  //前下前+拳
 
)} );
```

至于 proxy 里面怎么实现，完全可以自由发挥。

还有个例子就是在调用 ajax 请求的时候，无论是各种开源库，还是自己写的 Ajax 类，都会给 xhr 对象设置一个代理。我们不可能频繁的去操作 xhr 对象发请求，而应该是这样.

```javascript
var request = Ajax.get("cgi.xx.com/xxx");
request.send();
request.done(function () {});
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