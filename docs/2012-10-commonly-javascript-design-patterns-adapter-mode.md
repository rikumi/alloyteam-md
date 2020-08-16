---
title: 【Javascript 设计模式 4】- 适配器模式
date: 2012-10-24
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-adapter-mode/
---

<!-- {% raw %} - for jekyll -->

去年年前当时正在开发 dev.qplus.com, 有个存储应用分类 id 的 js 文件，分类 id 的结构最开始设计的比较笨重。于是我决定重构它。我把它定义成一个 json 树的形式，大概是这样:  

```javascript
var category = {
    music: {
        id: 1,
        children: [, , , ,],
    },
};
```

dev.qplus.com 里大概有 4，5 个页面都调用这个 category 对象。春节前我休了 1 个星期假。过年来之后发现邮箱里有封邮件，设计数据库的同学把 category..js 也重构了一份，并且其他几个项目里都是用了这份 category.js, 我拿过来一看就傻眼了，和我之前定的数据结构完全不一样.

当然这是一个沟通上的反面例子。但接下来的重点是我已经在 N 个文件里用到了之前我定的 category.js. 而且惹上了一些复杂的相关逻辑。怎么改掉我之前的代码呢。全部重写肯定是不愿意。所以现在适配器就派上用场了.

只需要把同事的 category 用一个函数转成跟我之前定义的一样.

    my.category = adapterCategory ( afu.category );

适配器模式的作用很像一个转接口。本来 iphone 的充电器是不能直接插在电脑机箱上的，而通过一个 usb 转接口就可以了.

所以，在程序里适配器模式也经常用来适配 2 个接口，比如你现在正在用一个自定义的 js 库。里面有个根据 id 获取节点的方法 $id (). 有天你觉得 jquery 里的 $ 实现得更酷，但你又不想让你的工程师去学习新的库和语法。那一个适配器就能让你完成这件事情.

```javascript
$id = function (id) {
    return jQuery("#" + id)[0];
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