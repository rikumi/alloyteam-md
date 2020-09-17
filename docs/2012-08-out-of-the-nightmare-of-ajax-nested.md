---
title: 走出 ajax 嵌套的梦魇
date: 2012-08-03
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2012/08/out-of-the-nightmare-of-ajax-nested/
---

<!-- {% raw %} - for jekyll -->

## 一 介绍

随着 web2.0 的兴起。越来越多的网站开始重视用户体验。传统的服务器吐出页面的方式很多场景下逐渐被 ajax 取代。用 ajax 的方式一来可以无刷新的更新页面数据。二来可以大大减少服务器跟浏览器的数据交换量.

我们都知道，javascript 是一种单线程的语言. Ajax 必须通过异步回调的方式来实现。但在复杂的 web 应用中. Ajax 请求过多会带来更复杂的逻辑，和降低代码的可读性和维护性.

刚来公司时，我做了一个 QQ 群消息漫游的项目。由于数据来源复杂。我曾经在里面写过 5 个嵌套的 ajax 请求.

比如这样

```javascript
$.get( "a.do", function( data1 ){
    $.post( '"b.do" , data1, function( data2 ){
        $.getJson( "c.do", function( data3 ){
            $.get( "d.do", function( data4 ){
                $.post( "e.do", function( data5 ){
                })
            })
        })
    })
} )
```

当然，每个回调函数里还要进行一些渲染 Ui 等等复杂的操作，我们先看看这一大陀东西会给我们带来什么痛苦.

1, 严重影响视力.

2, 调试起来很痛苦，当整个请求链被断开的时候，不方便定位到是哪个请求出了问题，特别是当他们之间的数据相互依赖的时候。比如 c.do 的请求参数依赖 b.do 或者 a.do 的返回值.

3, data1. data2, data3. data4. data5 看着就蛋碎.

因为这些原因，产生了写这个异步队列库的想法。之所以叫 danceRequest, 是希望它轻巧而美妙.

## 二 调用

异步队列并不是一个新鲜的东西。很早之前 dojo 就提供了一套实现方式. Jquery 在 1.5 版本的时候也引入了 Deffrred 对象。这 2 个都是基于 promise 规范。所谓 promise 规范，可以看成这样一个故事.

(1) 有个年轻人。为了给妻子买钻石项链出去挣钱.  
(2) 几年后他回来了.  
(3) 如果他挣到钱了......  
(4) 如果他没挣到钱......

换成代码，

```javascript
var earnMoney = $.get( “earnMoney.do” );
earnMoney .succ( function(){
 
})
earnMoney .fail( function(){
 
})
```

promise 规范有三种状态。未完成，完成，和失败。可以包装事件，setTimeout 和 ajax 请求等一切异步的操作，是目前最常用的一种解决方案.

另外国内有一个 jscex 异步编程类库。这个库的实现很令人惊叹。它允许你按同步的方式书写代码。然后通过词法分析，把代码重新编译成异步方式去执行。但我没用这个库的原因，是因为我担忧 js 的词法分析和编译的性能。而且因为写的代码和实际运行的代码并不一样，也许会给调试带来困难。但这两个问题在未来应该都不是问题.

Promise 对于普通开发者来说，学习成本并不算太低. Jquery 的 Deffrred 可能算 jquery 中最麻烦的 api 了，现在的事实是，虽然你很强大，但我用五层嵌套也能解决问题，为什么要去学习你一个不算简单的新东西.

而关于这个 danceRequest, 虽然 api 有点像，但它不属于神马规范。它也只专注于解决嵌套或者并发的 ajax 请求。因为我暂时觉得 setTimeout 和 dom 事件的异步没有给我带来太多困扰.

danceRequest 大致由两部分工作组成，先把一些 Request 对象串起来，然后监听它们 done 或者 error 事件.

比如开始的那 5 个嵌套请求可以改成.

```javascript
var a = Dance.Request("a.do");
a.done(function () {});
var b = Dance.Request("b.do");
var c = Dance.Request("c.do");
var d = Dance.Request("d.do");
var e = Dance.Request("e.do");
a.chain(b).chain(c).chain(d).chain(e).start();
```

现在来一步步了解下它的用法。整个执行过程由一个 Request 对象和一些 Request 的集合链 Queue 组成。其中我们只需要关注的是 request. queue 会在调用过程中隐式生成和变换，在 request 的 done 或者 error 或者 beforeSend 事件里可以用 this.queue 访问到.

**三 Request 对象**

首先要发起一个请求，我们需要创建一个 Request 对象.

```javascript
var a = Dance.Request({
```


<!-- {% endraw %} - for jekyll -->