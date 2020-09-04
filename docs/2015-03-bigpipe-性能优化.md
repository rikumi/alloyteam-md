---
title: bigpipe 性能优化
date: 2015-03-31
author: TAT.moonye
source_link: http://www.alloyteam.com/2015/03/bigpipe%e6%80%a7%e8%83%bd%e4%bc%98%e5%8c%96/
---

<!-- {% raw %} - for jekyll -->

## 背景

当前网速越来越快，但是随着网页内容越来越丰富，其实我们打开网页的速度并未得到什么提升，相反，过多的内容会导致网页打开速度变慢。于是，出现了一些性能优化的方法。  
1. 合并文件，如 css，js 等  
2. 将 js 文件放在文档的底部  
3. 将服务器部署到离用户近的地方，如 cdn 技术  
4. 缓存技术  
5. 负载均衡  
6. 文档直出  
等等

有这么多通用的方式能够适用于我们的产品中，每一种实现的技术难度不大，当我们都应用了这些技术，发现网站性能依然不那么乐观的时候，会考虑到一些非常规、适用于某些特定场景的优化技术

## 另一种思路

Facebook 的研究科学家 changhao jiang 提出了一个优化方案，名字叫做 bigpipe，应用了此项技术的 facebook 首页，访问速度提升一倍。它极大的提升了 fackebook 的性能。它是怎么做到的。

传统的一个打开页面的步骤

1.  浏览器发送 HTTP 请求
2.  服务器接收到 HTTP 请求，解析请求，从存储层拉取数据，拼接 HTML，发回一个 HTTP 响应
3.  这个请求通过网络传输到浏览器
4.  浏览器解析接收到的数据，构造 DOM 树，下载 CSS 和 JavaScript
5.  浏览器下载了 CSS 之后，开始解析 CSS，渲染页面
6.  下载 JavaScript 之后，开始解析 JavaScript，执行 JavaScript

Bigpipe 的思路

1.  Request parsing：服务器解析和检查 http request
2.  Datafetching：服务器从存储层获取数据
3.  Markup generation：服务器生成 html 标记
4.  Network transport ： 网络传输 response
5.  CSS downloading：浏览器下载 CSS
6.  DOM tree construction and CSS styling: 浏览器生成 DOM 树，并且使用 CSS
7.  JavaScript downloading: 浏览器下载页面引用的 JS 文件
8.  JavaScript execution: 浏览器执行页面 JS 代码

看着 bigpipe 的步骤和普通的方式没什么区别，其实，它只是其中一个模块（pagelet）的流程而已。而一个页面是可以分解成 N 个模块，多个模块以流水线式的方式运行

## demo

一个 node 实现的 demo，实现基本的分块的思想  
模拟服务器部分

````html
http.createServer(<span class="keyword">function</span>(request, response) {
    <span class="comment">// Write the document</span>
    response.writeHead(<span class="number">200</span>, {<span class="string">"Content-Type"</span> : <span class="string">"text/html"</span>});
    response.write(<span class="string">'<!DOCTYPE html>'</span>);
    response.write(<span class="string">'<head>
```html
<script type="text/javascript">function arrived(id,text) { var b=document.getElementById(id); b.innerHTML = text; }</script>
````

'</span>);
    response.write(<span class="string">"</head><body><div>Progressive Loading"</span>);
    <span class="keyword">for</span>(<span class="keyword">var</span> i = <span class="number">0</span>; i &lt; <span class="number">6</span>; i++) {
        response.write(<span class="string">"<div id='"</span> + i + <span class="string">"'>"</span> + i + <span class="string">"</div>"</span>);
    }
    response.write(<span class="string">"</div>"</span>);

 
    &lt;span class="keywo

```

```


<!-- {% endraw %} - for jekyll -->