---
title: 使用 Abstract 2.0 构建页面
date: 2015-07-31
author: TAT.dorsywang
source_link: http://www.alloyteam.com/2015/07/shi-yong-abstract-2-0-gou-jian-ye-mian/
---

<!-- {% raw %} - for jekyll -->

## 为什么是 2.0?

Abstract 1.0 去哪了？1.0 就在这里  

[![9D091902EEDCF30CC954521638883510](http://www.alloyteam.com/wp-content/uploads/2015/07/9D091902EEDCF30CC954521638883510.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/9D091902EEDCF30CC954521638883510.png)  
Abstract 1.0 并非凭空产生，而是来自兴趣部落这样千万级访问量大型项目的最佳实践，经过了千万客户端的检验，也证明了 Abstract 是一款优秀的框架。

## Abstract 2.0 是否是轮子？

用过 Abstract 的同学都知道答案是否定的，就拿当下最流行的框架来举例，使用了 AngularJS、React 之后，是否就可以不用 Abstract 了，答案也是否定的，Abstract 解决的问题的层面是高于 AngularJS 和 React 的，在抽象层面上 Abstract 更高于 AngularJS、React。更为简单的叙述是，AngularJS、React 会帮你写业务逻辑么？肯定不会，但 Abstract 会帮你写业务逻辑，这就是 Abstract 和其他框架的区别所在.  
如果 React 宣称自己处于抽象层面的 V (view) 层，那么 Abstract 是处于 C (controller) 层的框架

## Abstract 为兴趣部落这样大型的项目解决了什么问题？

Abstract 带来的优势是很可观的

-   统一风格的代码
-   清晰的逻辑
-   解决代码复用与耦合的问题
-   快速开发页面

Abstract 怎么去构建页面？  

* * *

我们来做一个对比，看普通的写法是怎么做的，用 Abstract 是怎么做的

假设我们来完成部落头部的信息的渲染，普通的写法可能是这样的

```javascript
var renderTop = function () {
    // 请求cgi
    $.ajax({
        url: "/cgi-bin/top_info",
        data: {
            bid: 10038,
        },
        success: function (data) {
            for (var i = 0; i < data.posts.length; i++) {
                var item = data.posts[i];
                item.flag = getFlag(item.flag);
            } // 渲染模板了
            Tmpl(topTmpl, data).appendTo($("#top"));
        },
        error: function (data) {},
    });
};
renderTop();
```

这么简单的逻辑，感觉写起来还不错

看看使用 Abstract 是怎么做的

```javascript
var topInfo = new RenderModel({
    cgiName: "/cgi-bin/top_info",
    param: {
        bid: 10038,
    },
    renderTmpl: topTmpl,
    renderContainer: $("#top"),
    processData: function (data) {
        for (var i = 0; i < data.posts.length; i++) {
            var item = data.posts[i];
            item.flag = getFlag(item.flag);
        }
    },
});
topInfo.rock();
```

哈，感觉没什么高大上的，也没什么吧。。。这还不是 Abstract 强大之处

现在需求来了，产品要求加快 top 渲染的速度，怎么办？有什么办法？

一个办法就是做本地缓存，一进来使用上次请求过的据渲染，安份的写法应该是这样的吧


<!-- {% endraw %} - for jekyll -->