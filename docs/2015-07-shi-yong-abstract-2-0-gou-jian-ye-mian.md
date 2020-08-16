---
title: 使用 Abstract 2.0 构建页面
date: 2015-07-31
author: TAT.dorsywang
source_link: http://www.alloyteam.com/2015/07/shi-yong-abstract-2-0-gou-jian-ye-mian/
---

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

```javascript
var renderTop = function(){
    //先使用缓存渲染数据
    var dataCache = JSON.parse(localStorage.getData("top") || '{}');
    Tmpl(topTmpl, dataCache).appendTo($("#top"));      
 
    // 请求cgi
    $.ajax({
       url: "/cgi-bin/top_info",
       data: {
           bid: 10038
       },
       success: function(data){
            for(var i = 0; i < data.posts.length; i ++){
               var item = data.posts[i];
               item.flag = getFlag(item.flag);
            }
            
            // 渲染模板了
            Tmpl(topTmpl, data).appendTo($("#top"));
            
            //写下缓存供下次使用
            // 防止写的时候溢出啊亲
            try{
                  localStorage.setData('top', JSON.stringify(data));
            }cache(e){
                   localStorage.clear();
                   localStorage.setData('top', JSON.stringify(data));
            }
       },
 
       error: function(data){
       } 
    });
}
renderTop();
```

看起来也还不错，好像挺好的，这次，第二次之后进来，top 刷刷就出来了，Abstract 怎么写呢

```javascript
/*
 Abstract构建的页面
*/
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

看了半天，发现跟之前的写法没什么区别啊？是啊，使用 Abstract 你不需要关心缓存层的渲染的，它自动帮你做了。但有些时候我不需要它做，只需要加上 noCache: false 这样的选项关闭即可

这样感觉也没什么值得炫耀的功能，是的，但是，接定来看

接着我们可能要渲染底部的信息，普通是这么做的

```javascript
var renderTop = function(){
    //先使用缓存渲染数据
    var dataCache = JSON.parse(localStorage.getData("top") || '{}');
    Tmpl(topTmpl, dataCache).appendTo($("#top"));      
 
    // 请求cgi
    $.ajax({
       url: "/cgi-bin/top_info",
       data: {
           bid: 10038
       },
       success: function(data){
            for(var i = 0; i < data.posts.length; i ++){
               var item = data.posts[i];
               item.flag = getFlag(item.flag);
            }
            
            // 渲染模板了
            Tmpl(topTmpl, data).appendTo($("#top"));
            
            //写下缓存供下次使用
            // 防止写的时候溢出啊亲
            try{
                  localStorage.setData('top', JSON.stringify(data));
            }cache(e){
                   localStorage.clear();
                   localStorage.setData('top', JSON.stringify(data));
            }
       },
 
       error: function(data){
       }
    });
};
 
var renderBottom = function(){
    //先使用缓存渲染数据
    var dataCache = JSON.parse(localStorage.getData("bottom") || '{}');
    Tmpl(topTmpl, dataCache).appendTo($("#bottom"));      
 
    // 请求cgi
    $.ajax({
       url: "/cgi-bin/bottom_info",
       data: {
           bid: 10038
       },
       success: function(data){
            for(var i = 0; i < data.posts.length; i ++){
               var item = data.posts[i];
               item.flag = getFlag(item.flag);
            }
            
            // 渲染模板了
            Tmpl(bottomTmpl, data).appendTo($("#bottom"));
            
            //写下缓存供下次使用
            // 防止写的时候溢出啊亲
            try{
                  localStorage.setData('bottom', JSON.stringify(data));
            }cache(e){
                   localStorage.clear();
                   localStorage.setData('bottom', JSON.stringify(data));
            }
       },
 
       error: function(data){
       }
    });
};
 
renderTop();
renderBottom();
```

这样写或许也挺简单的，但是不同的人有不同的写法，可能一个 renderTop 和一个 renderBottom 写法就不同，更别说更加复杂的逻辑，那 Abstract 怎么写

```javascript
/*
 Abstract构建的页面
*/
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
var bottomInfo = new RenderModel({
    cgiName: "/cgi-bin/bottom_info",
    param: {
        bid: 10038,
    },
    renderTmpl: bottomTmpl,
    renderContainer: $("#bottom"),
    processData: function (data) {
        for (var i = 0; i < data.posts.length; i++) {
            var item = data.posts[i];
            item.flag = getFlag(item.flag);
        }
    },
});
var page = new PageMode();
page.add(topInfo);
page.add(bottomInfo);
page.rock();
```

细心的同学会发现，Abstract 在最后，不是让 topInfo 和 bottomInfo 分别 rock，而上加到了一个 pageModel 的实例上，让 pageModel 实例去 rock。

可以看出，Abstract 的优点

1. 规范化代码，所有人的代码风格统一，阅读方便

2. 写法简单，快速

3. 尽可能多的帮业务开发者做更多的事情

4. 页面模块化的思想与配置型代码（类似 React，但那时不了解有 React)

5. 更优雅的代码

上面的例子还不足矣让 Abstract 来支撑更复杂的页面，那如果更复杂页面怎么写？

移动中比较常见的场景就是滚动加载，这时用 Abstract 要怎么写呢？

普通的写法，可能要洋洋洒洒写上一大篇了吧，Abstract 是这样写的

```javascript
/*
 Abstract构建的页面
*/
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
var bottomInfo = new RenderModel({
    cgiName: "/cgi-bin/bottom_info",
    param: {
        bid: 10038,
    },
    renderTmpl: bottomTmpl,
    renderContainer: $("#bottom"),
    processData: function (data) {
        for (var i = 0; i < data.posts.length; i++) {
            var item = data.posts[i];
            item.flag = getFlag(item.flag);
        }
    },
});
// 这里是一个滚动加载模型
var postList = new ScrollModel({
    cgiName: "/cgi-bin/posts",
    param: (function () {
        var every = 10;
        var start = -every;
        return function () {
            return {
                start: (start += every),
                num: every,
                bid: 10038,
            };
        };
    })(),
    renderTmpl: postTmpl,
    renderContainer: $("#postList"),
    processData: function (data) {
        for (var i = 0; i < data.posts.length; i++) {
            var item = data.posts[i];
            item.flag = getFlag(item.flag);
        }
    },
});
var page = new PageMode();
page.add(topInfo);
page.add(bottomInfo);
page.add(postList);
page.rock();
```

就这么简单，一个简单的页面就完成了

## Abstract 2.0 的地址

[点击这里访问更多信息吧](http://alloyteam.github.io/Abstract.js/)