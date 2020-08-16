---
title: 【Javascript 设计模式 9】- 策略模式
date: 2012-10-24
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-strategy-mode/
---

<!-- {% raw %} - for jekyll -->

策略模式的意义是定义一系列的算法，把它们一个个封装起来，并且使它们可相互替换。  
一个小例子就能让我们一目了然。  
回忆下 jquery 里的 animate 方法.  

```css
$( div ).animate( {"left: 200px"}, 1000, 'linear' );  //匀速运动
$( div ).animate( {"left: 200px"}, 1000, 'cubic' );  //三次方的缓动
```

这 2 句代码都是让 div 在 1000ms 内往右移动 200 个像素. linear (匀速) 和 cubic (三次方缓动) 就是一种策略模式的封装.  
再来一个例子。上半年我写的 dev.qplus.com, 很多页面都会有个即时验证的表单。表单的每个成员都会有一些不同的验证规则.

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/图片34.png "图片 3")](http://www.alloyteam.com/wp-content/uploads/2012/10/图片34.png)

比如姓名框里面， 需要验证非空，敏感词，字符过长这几种情况。 当然是可以写 3 个 if else 来解决，不过这样写代码的扩展性和维护性可想而知。如果表单里面的元素多一点，需要校验的情况多一点，加起来写上百个 if else 也不是没有可能。  
所以更好的做法是把每种验证规则都用策略模式单独的封装起来。需要哪种验证的时候只需要提供这个策略的名字。就像这样：

```javascript
nameInput.addValidata({
   notNull: true,
   dirtyWords: true,
   maxLength: 30
})
而notNull，maxLength等方法只需要统一的返回true或者false，来表示是否通过了验证。
validataList = {
  notNull: function( value ){
     return value !== '';
  },
  maxLength: function( value, maxLen ){
     return value.length() > maxLen;
  }
}
```

可以看到，各种验证规则很容易被修改和相互替换。如果某天产品经理建议字符过长的限制改成 60 个字符。那只需要 0.5 秒完成这次工作。

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