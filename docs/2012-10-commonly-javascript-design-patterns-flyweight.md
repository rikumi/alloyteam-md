---
title: 【Javascript 设计模式 16】- 享元模式
date: 2012-10-24
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-flyweight/
---

<!-- {% raw %} - for jekyll -->

享元模式主要用来减少程序所需的对象个数。有一个例子，我们这边的前端同学几乎人手一本《javascript 权威指南》. 从省钱的角度讲，大约三本就够了。放在部门的书柜里，谁需要看的时候就去拿，看完了还回去。如果同时有 4 个同学需要看，此时再去多买一本.  
在 webqq 里面，打开 QQ 好友列表往下拉的时候，会为每个好友创建一个 div (如果算上 div 中的子节点，还远不只 1 个元素).  

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/图片8.jpg "图片 8")](http://www.alloyteam.com/wp-content/uploads/2012/10/图片8.jpg)

如果有 1000 个 QQ 好友，意味着如果从头拉到尾，会创建 1000 个 div, 这时候有些浏览器也许已经假死了。这还只是一个随便翻翻好友列表的操作.

所以我们想到了一种解决办法，当滚动条滚动的时候，把已经消失在视线外的 div 都删除掉。这样页面可以保持只有一定数量的节点。问题是这样频繁的添加与删除节点，也会造成很大的性能开销，而且这种感觉很不对味.

现在享元模式可以登场了。顾名思义，享元模式可以提供一些共享的对象以便重复利用。仔细看下上图，其实我们一共只需要 10 个 div 来显示好友信息，也就是出现在用户视线中的 10 个 div. 这 10 个 div 就可以写成享元.  
伪代码如下.

```javascript
var getDiv = (function () {
    var created = [];
    var create = function () {
        return document.body.appendChild(document.createElement("div"));
    };
    var get = function () {
        if (created.length) {
            return created.shift();
        } else {
            return create();
        }
    };
    /* 一个假设的事件，用来监听刚消失在视线外的div，实际上可以通过监听滚                                     动条位置来实现 */
    userInfoContainer.disappear(function (div) {
        created.push(div);
    });
})();
var div = getDiv();
div.innerHTML = "${userinfo}";
```

原理其实很简单，把刚隐藏起来的 div 放到一个数组中，当需要 div 的时候，先从该数组中取，如果数组中已经没有了，再重新创建一个。这个数组里的 div 就是享元，它们每一个都可以当作任何用户信息的载体.

当然这只是个示例，实际的情况要复杂一些，比如快速拖动的时候，我们可能还得为节点设置一个缓冲区.

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