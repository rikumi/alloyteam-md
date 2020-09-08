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
"url": "a.do",
"type": "get",
"cache": false,
"param": {
"qq": 52052****
}
})
 
a.start();
```

其中 type, cache, param 都是可选的.

type 表示请求方式，提供了 get, post, jsonp, iframe 四种。默认为 get.. 其中 jsonp 和 iframe 分别用来代替跨域的 get 和 post.

cache 决定是否使用缓存数据。默认为 false.

param 表示传递给请求的参数，可以是一个 plain object 对象。也可以是一个函数。比如

```javascript
var a = Dance.Request({
    url: "a.do",
    param: function (before) {
        if (currPage < 7) {
            return {
                page: currPage + 1,
            };
        } else {
            return {
                page: 0,
            };
        }
    },
});
```

这个函数在请求之前会被运算，它的返回值才作为真正的参数传递过去。从上例可以看出，在处理分页等参数需要变化的请求里特别方便.

有一些情况，request1, request2 同在一个集合链中。而 request1 的作用就是给 request2 提供某个数据。比如从 request1 可以取得用户的 QQ 号。再用这个 QQ 号从 request2 中取得用户的昵称。这时 request2 的 param 函数里的参数里 before 就是 request1. 所以可以这样来写.

```javascript
var request1 = Dance.Request("getQQ.do");
var request2 = Dance.Request({
    url: "getNickName.do",
    param: function (before) {
        //before就是request1
        return {
            qq: before.data.qq,
        };
    },
});
request1.chain(request2).start();
```

**四 beforeSend、done 和 error**

对于每个 request 对象，提供三个监听事件。用这三个事件足够完成大部分业务逻辑.

1、beforeSend 可以在请求开始前做一些校验或者设置参数或者其他操作。如果任何一个 beforeSend 函数里返回 false, 会截断整条链的执行.

```javascript
request1.beforeSend(function () {
    this.setParam({});
});
```

done 请求成功返回. data 为服务器返回的数据. json 或者 string 格式。如果任何一个 doen 函数里返回 false, 会截断整条链的执行.

```javascript
request1.done( function( data ){
if ( data.qq !== "52052****'' ){
return fasle;
}
})
```

error 因为超时等原因引起的请求错误. error 回调函数里接收 2 个参数，第一个是错误类型，第二个是错误信息.  
如果一条请求链中途有个某个请求错误，默认不会再进行后面的请求。如果要强制继续请求。可以在 error 方法里调用 this.queue.contine ();

```javascript
request1.error( function( type, message ){
If ( type === ''timeout' ){
alert ( "请求超时" );
}
this.queue.contine();
})
```

**五 Request 的其它 api**

```javascript
request.useCache() 此请求使用缓存数据.
 
request.stopCache() 此请求不使用缓存数据.
 
request.setParam 设置请求参数.
 
request.again() 接收一个num型参数, 表示重新调用此request几次, 直到请求成功返回. 常用在error事件里. 比如
request.error( function( type, message ){
If ( type === 'timeout' ){
this.again( 2 );
}
} )
```

**六 Queue**

当 2 个以上的请求被串起来的时候，已经隐式的生成了一条集合链。可以用变量来引用它.  
var queue = request1.chain( request2, request3 ).chain( request4 );

Queue 对象提供了这几个 api.

queue.chain () 串起一个或者一些 request 对象。注意上面的 request2 和 request3 是放在一个括号里的。这样表示 reqeust2 和 reqeust3 是并行的请求。他们的执行顺序并没有要求。但 request4 必须等 request2 和 request3 都返回了才会执行。因为不能确定 request2 和 request3 哪个先返回，所以 request4 里的 before 是 request2 和 request3 中的随机一个.

queue.stop () 暂停链的执行.

queue.contine () 继续链的执行.

queue.error (function ( type, obj, message){}) 监听一条链中的所有 error 事件. type 表示 error 类型. obj 表示当前触发 error 事件的 request 对象. message 表示错误信息.

queue.cut () 从当前的请求开始，扔弃链中后续的请求。比如有这样一个需求。我们需要在某一个请求返回之后，可能需要丢弃开始约定的请求链，走另外一个分支。那么我们可以这样来重新组织链.

```javascript
request2.done(function( error ){
if (...){
this.queue.cut().chain( reqeust8 ).chan( request9 );
}
})
```

queue.lenth 返回链中请求的数量.

queue\[0]、queue\[1]、queue\[2] 可以用下标来获取链中的每组请求对象，注意因为可能含有并发请求，所以统一返回数组形式.

queue.useCache () 整条链中的 request 对象都使用缓存数据

queue.stopCache () 整条链中的 request 对象都不使用缓存数据

queue.now () 此条链中正在请求的 request 对象.

**七 示例**

```javascript
var a = Dance.Reqeuest( {
url: "a.do"
})
 
var b = Dance.Reqeuest( {
url: "b.do",
type: 'jsonp',
cache: true,
param: function(){
return {
name: this.before.data.name
}
}
})
 
var c = Dance.Reqeuest( {
url: "c.do",
type: "iframe"
 
})
 
a.beforeSend( function(){
this.queue.stop();
this.queue.contine();
} )
 
a.done( function(){
this.useCache();
this.stopCache();
this.queue.cut().chain( b ).chain( c ).start();
} )
 
a.error( function( type, message ){
alert ( type === ''timeout'' );
a.again( 2 );
} )
 
var queue = a.chain( b ).chain( c );
 
queue.error(function( type, obj, message ){
alert ( type === '"timeout" )
alert ( obj === a )
} )
 
queue.useCache();
 
queue.stopCache();
```

**八 结尾**

5 个嵌套回调并不能阻止你完成一个程序的编写。所以，这个库其实对大多数来说都是没有意义。不管怎样，佛渡有缘人，药医不死病.  也希望它能对一些人恰好带来一点方便.

因为还没有经过详细的测试，它也许还需要一段时间才能稳定。有任何问题都可以 email 我.520521086 at qq.com

下载地址:  <https://github.com/AlloyTeam/DanceRequest>

详细的 api 文档近期补上.

## /\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*8 月 9 号\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/

用 coffeeScript 重写了一次。跟原始的版本放一起提供下载.


<!-- {% endraw %} - for jekyll -->