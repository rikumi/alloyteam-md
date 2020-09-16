---
title: 构建流式应用 —RxJS 详解
date: 2016-12-02
author: TAT.joeyguo
source_link: http://www.alloyteam.com/2016/12/learn-rxjs/
---

<!-- {% raw %} - for jekyll -->

[原文地址](https://github.com/joeyguo/blog/issues/11)

最近在 Alloyteam Conf 2016 分享了《使用 RxJS 构建流式前端应用》，会后在线上线下跟大家交流时发现对于 RxJS 的态度呈现出两大类：有用过的都表达了 RxJS 带来的优雅编码体验，未用过的则反馈太难入门。所以，这里将结合自己对 RxJS 理解，通过 RxJS 的实现原理、基础实现及实例来一步步分析，提供 RxJS 较为全面的指引，感受下使用 RxJS 编码是怎样的体验。

目录  

=====

-   常规方式实现搜索功能
-   RxJS・流 Stream
-   RxJS 实现原理简析

    -   观察者模式
    -   迭代器模式
    -   RxJS 的观察者 + 迭代器模式
-   RxJS 基础实现

    -   Observable
    -   Observer
-   RxJS · Operators

    -   Operators・入门
    -   一系列的 Operators 操作
-   使用 RxJS 一步步实现搜索功能
-   总结

* * *

常规方式实现搜索  

===========

做一个搜索功能在前端开发中其实并不陌生，一般的实现方式是：监听文本框的输入事件，将输入内容发送到后台，最终将后台返回的数据进行处理并展示成搜索结果。

````html
<input id="text"></input>

```html
<script>
    var text = document.querySelector('#text');
    text.addEventListener('keyup', (e) =>{
        var searchText = e.target.value;
        // 发送输入内容到后台
        $.ajax({
            url: `search.qq.com/${searchText}`,
            success: data => {
              // 拿到后台返回数据，并展示搜索结果
              render(data);
            }
        });
    });
</script>
````

````

上面代码实现我们要的功能，但存在两个较大的问题：

1.  多余的请求  
    当想搜索“ 爱迪生” 时，输入框可能会存在三种情况，“ 爱”、“ 爱迪”、“ 爱迪生”。而这三种情况将会发起 3 次请求，存在 2 次多余的请求。
    
2.  已无用的请求仍然执行  
    一开始搜了“ 爱迪生”，然后马上改搜索“ 达尔文”。结果后台返回了“ 爱迪生” 的搜索结果，执行渲染逻辑后结果框展示了“ 爱迪生” 的结果，而不是当前正在搜索的“ 达尔文”，这是不正确的。
    

**减少多余请求数**，可以用 setTimeout 函数节流的方式来处理，核心代码如下

```html
<input id="text"></input>

```html
<script>
    var text = document.querySelector('#text'),
        timer = null;
    text.addEventListener('keyup', (e) =>{
        // 在 250 毫秒内进行其他输入，则清除上一个定时器
        clearTimeout(timer);
        // 定时器，在 250 毫秒后触发
        timer = setTimeout(() => {
            console.log('发起请求..');
        },250)
    })
</script>
````

```

**已无用的请求仍然执行**的解决方式，可以在发起请求前声明一个当前搜索的状态变量，后台将搜索的内容及结果一起返回，前端判断返回数据与当前搜索是否一致，一致才走到渲染逻辑。最终代码为
```


<!-- {% endraw %} - for jekyll -->