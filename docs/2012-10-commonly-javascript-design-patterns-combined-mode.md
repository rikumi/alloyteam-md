---
title: 【Javascript 设计模式 13】- 组合模式
date: 2012-10-24
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2012/10/commonly-javascript-design-patterns-combined-mode/
---

<!-- {% raw %} - for jekyll -->

组合模式又叫部分 - 整体模式，它将所有对象组合成树形结构。使得用户只需要操作最上层的接口，就可以对所有成员做相同的操作。  
一个再好不过的例子就是 jquery 对象，大家都知道 1 个 jquery 对象其实是一组对象集合。比如在这样一个 HTML 页面

```html
&lt;body>
      
    &lt;div>
             &lt;span>&lt;/span>
             &lt;span>&lt;/span>
          
    &lt;/div>
&lt;/body>;
```

我们想取消所有节点上绑定的事件，需要这样写

```javascript
var allNodes = document.getElementsByTagName("*");
var len = allNodes.length;
while (len--) {
    allNodes.unbind("*");
}
```

但既然用了 jquery，就肯定不会再做这么搓的事情。我们只需要 $('body').unbind ( '\*' );  
当每个元素都实现 unbind 接口，那么只需调用最上层对象 $('body') 的 unbind, 便可自动迭代并调用所有组合元素的 unbind 方法.  
再来个具体点的例子， 还是 dev.qplus.com 这个网站的即时验证表单。

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/图片7.png "图片 7")](http://www.alloyteam.com/wp-content/uploads/2012/10/图片7.png)

注意下面那个修改资料的按钮，如果有任意一个 field 的验证没有通过，修改资料的按钮都将是灰色不可点的状态。 这意味着我们重新填写了表单内容后，都得去校验每个 field, 保证它们全部 OK.  
这代码不难实现.

```javascript
if (
    nameField.validata() &&
    idCard.validata() &&
    email.validata() &&
    phone.validata()
) {
    alert("验证OK");
}
```

似乎我们用一个外观模式也能勉强解决这里条件分支堆砌的问题，但真正的问题是，我们并不能保证表单里 field 的数量，也许明天产品经理就让你删掉一个或者增加两个。那么这样的维护方式显然不能被接受.  
更好的实现是有一个 form.validata 函数，它负责把真正的 validata 操作分发给每个组合对象.  
form.validata 函数里面会依次遍历所有需要校验的 field. 若有一个 field 校验未通过，form.validata 都会返回 false. 伪代码如下.

```javascript
form.validata = function () {
    forEach(fields, function (index, field) {
        if (field.validata() === false) {
            return false;
        }
    });
    return true;
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