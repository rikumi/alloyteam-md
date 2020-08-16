---
title: 【Web 缓存机制系列】2 – Web 浏览器的缓存机制
date: 2012-03-22
author: TAT.Rehorn
source_link: http://www.alloyteam.com/2012/03/web-cache-2-browser-cache/
---

<!-- {% raw %} - for jekyll -->

\\==== 索引 =====

[【Web 缓存机制系列】1 – Web 缓存的作用与类型](http://alloyteam.com/2012/03/web-cache-1-web-cache-overview/)

[【Web 缓存机制系列】2 – Web 浏览器的缓存机制](http://alloyteam.com/2012/03/web-cache-2-browser-cache/) 

[【Web 缓存机制系列】3 – 如何构建可缓存站点](http://alloyteam.com/2012/03/web-cache-3-how-to-build-cacheable-website/)

[【Web 缓存机制系列】4 – HTML5 时代的 Web 缓存机制](http://alloyteam.com/2012/03/web-cache-4-html5-web-cache/)

[【Web 缓存机制系列】5 – Web App 时代的缓存机制新思路](http://alloyteam.com/2012/03/web-cache-5-web-app-cache/)

[【Web 缓存机制系列】6 - 进击的 Hybrid App，量身定做缓存机制](http://www.alloyteam.com/2013/12/web-cache-6-hybrid-app-tailored-cache/)

\\============

## Web 缓存的工作原理

所有的缓存都是基于一套规则来帮助他们决定什么时候使用缓存中的副本提供服务（假设有副本可用的情况下，未被销毁回收或者未被删除修改）。这些规则有的在协议中有定义（如 HTTP 协议 1.0 和 1.1），有的则是由缓存的管理员设置（如 DBA、浏览器的用户、代理服务器管理员或者应用开发者）。

## 浏览器端的缓存规则

对于浏览器端的缓存来讲，这些规则是在 HTTP 协议头和 HTML 页面的 Meta 标签中定义的。他们分别从**新鲜度**和**校验值**两个维度来规定浏览器是否可以直接使用缓存中的副本，还是需要去源服务器获取更新的版本。  

**新鲜度（过期机制）**：也就是缓存副本有效期。一个缓存副本必须满足以下条件，浏览器会认为它是有效的，足够新的：

1.  含有完整的过期时间控制头信息（HTTP 协议报头），并且仍在有效期内；
2.  浏览器已经使用过这个缓存副本，并且在一个会话中已经检查过新鲜度；

满足以上两个情况的一种，浏览器会直接从缓存中获取副本并渲染。

**校验值（验证机制）：**服务器返回资源的时候有时在控制头信息带上这个资源的实体标签 Etag（Entity Tag），它可以用来作为浏览器再次请求过程的校验标识。如过发现校验标识不匹配，说明资源已经被修改或过期，浏览器需求重新获取资源内容。

## 浏览器缓存的控制

### 使用 HTML Meta 标签

Web 开发者可以在 HTML 页面的<head> 节点中加入<meta> 标签，代码如下：

    <META HTTP-EQUIV="Pragma" CONTENT="no-cache">

上述代码的作用是告诉浏览器当前页面不被缓存，每次访问都需要去服务器拉取。使用上很简单，但只有部分浏览器可以支持，而且所有缓存代理服务器都不支持，因为代理不解析 HTML 内容本身。

可以通过这个页面测试你的浏览器是否支持：[Pragma No-Cache Test](http://www.procata.com/cachetest/tests/pragma/index.php "No-Cache Test") 。

### 使用缓存有关的 HTTP 消息报头

一个 URI 的完整 HTTP 协议交互过程是由 HTTP 请求和 HTTP 响应组成的。有关 HTTP 详细内容可参考《[Hypertext Transfer Protocol -- HTTP/1.1](http://www.w3.org/Protocols/rfc2616/rfc2616.html "HTTP")》、《[HTTP 协议详解](http://www.cnblogs.com/li0803/archive/2008/11/03/1324746.html "HTTP 协议详解")》等。

在 HTTP 请求和响应的消息报头中，常见的与缓存有关的消息报头有：

![HTTP 缓存相关报头](http://alloyteam.com/wp-content/uploads/2012/03/http-header1.png "HTTP 缓存相关报头")

### Cache-Control 与 Expires

Cache-Control 与 Expires 的作用一致，都是指明当前资源的**有效期**，控制浏览器是否直接从浏览器缓存取数据还是重新发请求到服务器取数据。只不过 Cache-Control 的**选择更多，设置更细致**，如果同时设置的话，其**优先级高于 Expires**。

### Last-Modified/ETag 与 Cache-Control/Expires

配置 Last-Modified/ETag 的情况下，浏览器再次访问统一 URI 的资源，还是**会发送请求**到服务器询问文件是否已经修改，如果没有，服务器会只发送一个 304 回给浏览器，告诉浏览器直接从自己本地的缓存取数据；如果修改过那就整个数据重新发给浏览器；

Cache-Control/Expires 则不同，如果检测到本地的缓存还是有效的时间范围内，浏览器直接使用本地副本，**不会发送任何请求**。两者一起使用时，Cache-Control/Expires 的优先级要高于 Last-Modified/ETag。即当本地副本根据 Cache-Control/Expires 发现还在有效期内时，则不会再次发送请求去服务器询问修改时间（Last-Modified）或实体标识（Etag）了。

一般情况下，使用 Cache-Control/Expires 会配合 Last-Modified/ETag 一起使用，因为即使服务器设置缓存时间，当用户点击 “刷新” 按钮时，浏览器会忽略缓存继续向服务器发送请求，这时 Last-Modified/ETag 将能够很好利用 304，从而减少响应开销。

### Last-Modified 与 ETag

你可能会觉得使用 Last-Modified 已经足以让浏览器知道本地的缓存副本是否足够新，为什么还需要 Etag（实体标识）呢？HTTP1.1 中 Etag 的出现主要是为了解决几个 Last-Modified 比较难解决的问题：

1.  Last-Modified 标注的最后修改只能精确到**秒级**，如果某些文件在 1 秒钟以内，被修改多次的话，它将不能准确标注文件的新鲜度
2.  如果某些文件会被定期生成，当有时内容并没有任何变化，但 Last-Modified 却改变了，导致文件没法使用缓存
3.  有可能存在服务器没有准确获取文件修改时间，或者与代理服务器时间不一致等情形

Etag 是服务器自动生成或者由开发者生成的对应资源在服务器端的唯一标识符，能够更加准确的控制缓存。Last-Modified 与 ETag 是可以一起使用的，**服务器会优先验证 ETag**，一致的情况下，才会继续比对 Last-Modified，最后才决定是否返回 304。Etag 的服务器生成规则和强弱 Etag 的相关内容可以参考，《[互动百科 - Etag](http://www.hudong.com/wiki/Etag)》和《[HTTP Header definition](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html)》，这里不再深入。

### 用户操作行为与缓存

用户在使用浏览器的时候，会有各种操作，比如输入地址后回车，按 F5 刷新等，这些行为会对缓存有什么影响呢？

![用户操作与缓存](http://alloyteam.com/wp-content/uploads/2012/03/user-action2.png "用户操作与缓存")

通过上表我们可以看到，当用户在按 F5 进行刷新的时候，会忽略 Expires/Cache-Control 的设置，会再次发送请求去服务器请求，而 Last-Modified/Etag 还是有效的，服务器会根据情况判断返回 304 还是 200；而当用户使用 Ctrl+F5 进行强制刷新的时候，只是所有的缓存机制都将失效，重新从服务器拉去资源。

相关有趣的分享：

《[浏览器缓存机制](http://www.laruence.com/2010/03/05/1332.html "浏览器缓存机制")》：不同浏览器对用户操作行为处理比较

《[HTTP 304 客户端缓存优化的神奇作用和用法](http://spyrise.org/blog/http-304-not-modified-header-setting-optimize/ "HTTP 304 客户端缓存优化的神奇作用和用法")》：强行在代码层面比对文件的 Last-Modified 时间，保证用户使用 Ctrl+F5 进行刷新的时候也能正常返回 304

## 哪些请求不能被缓存？

无法被浏览器缓存的请求：

1.  HTTP 信息头中包含 Cache-Control:no-cache，pragma:no-cache，或 Cache-Control:max-age=0 等告诉浏览器不用缓存的请求
2.  需要根据 Cookie，认证信息等决定输入内容的动态请求是不能被缓存的
3.  经过 HTTPS 安全加密的请求（有人也经过测试发现，ie 其实在头部加入 Cache-Control：max-age 信息，firefox 在头部加入 Cache-Control:Public 之后，能够对 HTTPS 的资源进行缓存，参考《[HTTPS 的七个误解](http://www.ruanyifeng.com/blog/2011/02/seven_myths_about_https.html "HTTPS 七个误解")》）
4.  POST 请求无法被缓存
5.  HTTP 响应头中不包含 Last-Modified/Etag，也不包含 Cache-Control/Expires 的请求无法被缓存


<!-- {% endraw %} - for jekyll -->