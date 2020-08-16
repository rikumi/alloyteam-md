---
title: HTTP/2 Server Push 详解（上）
date: 2017-04-18
author: TAT.JohnnyJeremy Wagner
source_link: http://www.alloyteam.com/2017/04/guide-http2-server-push-part1/
---

<!-- {% raw %} - for jekyll -->

原文：<https://www.smashingmagazine.com/2017/04/guide-http2-server-push/>

作者：[Jeremy Wagner](https://www.smashingmagazine.com/author/jeremywagner/ "Posts by Jeremy Wagner")

译者按：网络优化一直是译者长期研究的方向，HTTP/2 的理论学习也已做了不少，随着这项标准的推进，越来越多特性被大家开始使用。作为 HTTP/2 最激动人心的特性，Server Push 在性能提升的效果被寄予了很高期望，却因其对传统 B/S 架构的开发模式影响较大未能广泛实践。如何更好地使用这项能力，让我们跟着作者深入探索～

\\======================== 译文分割线 ===========================

#### 在过去的一年时间，HTTP/2 的出现为关注性能的开发者带来了显著的变化。HTTP/2 已经不再是我们期待中的特性，而是伴着 Server Push（服务端推送）能力已然到来。

除了解决常见的 HTTP/1 性能问题（比如，首部阻塞和未压缩的报头），HTTP/2 还提供了 Server Push 能力！服务端推送允许我们向用户发送一些还没有被访问的资源。这是一种获得 HTTP/1 优化实践（例如内联）所带来性能提升的优雅方式，同时也避免了原先实践的一些缺点。

本文中，你将了解什么是 Server Push，它的工作原理与解决了哪些问题。同时你也将学习如何使用它，判断它是否正常运作，以及它对性能的影响。让我们开始吧！

## Server Push 为何物

访问网站始终遵循着请求 —— 响应模式。用户将请求发送到远程服务器，在一些延迟后，服务器会响应被请求的内容。

对网络服务器的初始请求通常是一个 HTML 文档。在这种情况下，服务器会用所请求的 HTML 资源进行响应。接着浏览器开始对 HTML 进行解析，过程中识别其他资源的引用，例如样式表、脚本和图片。紧接着，浏览器对这些资源分别发起独立的请求，等待服务器返回。

![](http://www.alloyteam.com/wp-content/uploads/2017/04/normal-server-response.png)

典型的服务器通信 ([大图](http://provide.smashingmagazine.com/normal-server-response.svg))

这一机制的问题在于，它迫使用户等待这样一个过程：_直到_一个 HTML 文档下载完毕后，浏览器才能发现和获取页面的关键资源。从而延缓了页面渲染，拉长了页面加载时间。

有了 Server Push，就有了解决上述问题的方案。Server Push 能让服务器在用户没有明确询问下，抢先地 “推送” 一些网站资源给客户端。只要正确地使用，我们可以根据用户正在访问的页面，给用户发送一些即将被使用的资源。

比如说你有一个网站，所有的页面都会在一个名为 styles.css 的外部样式表中，定义各种样式。当用户向务器请求 index.html 时，我们可以向用户推送 styles.css，同时我们发送 index.html。

![](http://www.alloyteam.com/wp-content/uploads/2017/04/server-push-response.png)

使用 HTTP/2 Server Push 的 Web 服务器通信（[大图](http://provide.smashingmagazine.com/server-push-response.svg?_ga=1.90756190.591051418.1492446688)）

相比等待服务器发送 index.html，然后等待浏览器请求并接收 styles.css，用户只需等待服务器的响应，就可在初次请求同时使用 index.html 和 styles.css。

可以想象，这可以降低一个页面的渲染时间。它还解决了一些其他问题，特别是在前端开发工作流方面。

## Server Push 解决了什么问题？

Server Push 解决了减少关键内容网络回路的耗时问题，但这并不是唯一作用。Server Push 更像是 HTTP/1 特定优化反模式的替代方案，例如将 CSS 和 JavaScript 内联在 HTML，以及使用 [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme) 方案将二进制数据嵌入到 CSS 和 HTML 中。

这些技术在 HTTP/1 优化工作流中非常受用，是因为这样减少了我们所说的页面 “感知渲染时间”，也就是说在页面整体加载时间可能不会减少的同时，对用户而言网页的加载速度却显得更快。这确实是说得通的，如果你将 CSS 内嵌到 HTML 的<style> 标签中，浏览器就可以无需等待外部资源的获取，而立即应用 HTML 中的样式。这种概念同样适用于内联脚本，以及使用 data URL 方式内联二进制数据。

![](http://www.alloyteam.com/wp-content/uploads/2017/04/inlined-content-unopt.png)

内联内容的服务器通信（[大图](http://provide.smashingmagazine.com/inlined-content-unopt.svg?_ga=1.44440544.591051418.1492446688)）

看起来是个不错的方案，对吧？在 HTTP/1 的时代确实如此，因为也没有别的选择。这么做实际上也留下了恶果，即内联的内容不能有效地被缓存。当样式、脚本资源以外链及模块形式引用，会更高效地进行缓存。当用户访问后续页面需要这些资源时，可以直接从缓存中获取，从而省去了额外的资源请求。

![](http://www.alloyteam.com/wp-content/uploads/2017/04/caching-unopt.png)

优化缓存行为（[大图](http://provide.smashingmagazine.com/caching-unopt.svg?_ga=1.115932098.591051418.1492446688)）

而当我们对内容进行内联时，它们是没有独立的缓存上下文的，而存在于所内联文档的上下文中。举个在 HTML 中内联 CSS 的例子，如果 HTML 的缓存策略，是每次访问都向服务器拉取最新的内容，那么内联的 CSS _总是_无法缓存其内容。即使把 HTML 进行缓存，但在后续访问的页面内，内联相同的 CSS 内容也是需要重复下载的。这还是比较宽松的缓存策略，实际情况中 HTML 仅有较短的缓存周期。内联是我们在 HTTP/1 优化方案中所做的权衡，它确实在用户第一次访问时非常有效，而往往第一印象是非常重要的。

这就是 Server Push 能解决的问题。当推送资源时，我们能获得与内联相同的性能提升，同时保持资源的外链形式，从而有独立的缓存策略。这里有个需要注意的问题，我们稍后再深入探讨。

我已经谈了很多_为什么_你该考虑使用 Server Push 的原因，也澄明了它能为用户和开发者所解决的问题。接下来让我告诉你_如何_去使用它。

## 如何使用 Server Push

使用 Server Push，_通常_会以下面的方式使用 Link 这个 HTTP 首部。

```css
Link: </css/styles.css>; rel=preload; as=style
```

注意我说的是通常，上面看到的实际是[预加载资源示意](https://w3c.github.io/preload)（resource hint）的实践。这是个区别于 Server Push 的独立优化方案，但大多数（并非全部）HTTP/2 的实现都将 preload 放进来 Link 首部。如果服务器或客户端选择不接受推送的资源，客户端仍可以根据指示提早获取资源。

首部中 as=style 部分是必选的，它能告知浏览器推送资源的类型。在这个例子中，我们使用 style 来指明推送的资源是一个样式表，你还可以设置[其他的内容类型](https://w3c.github.io/preload/#link-element-interface-extensions)。值得注意的是如果省略了 as 的值，会导致浏览器对推送资源下载_两次_，所以千万别忘了它。

现在知道推送资源的方法了，但具体要怎样设置 Link 首部呢？我们有两种方式：

-   Web 服务器配置（例如，Apache httpd.conf 或.htaccess）；
-   后端语言功能（例如 PHP 的 header 方法）。

### 使用服务器配置设置 Link 首部

下面是一个 Apache 配置（通过 httpd.conf 或.htaccess）的例子，作用是在请求 HTML 时推送样式资源。

    <FilesMatch "\.html$">
        Header set Link "</css/styles.css>; rel=preload; as=style"
    <FilesMatch>

这里我们使用了 FilesMatch 指令来匹配后缀为 “.html” 的文件请求。当一个请求匹配这个条件时，我们就往响应头里加入 Link 首部，并告知服务器推送位置在 /css/styles.css 的资源。

_边注_：Apache 的 HTTP/2 模块也可以使用 H2PushResource 指令启用资源推送。该指令的文档指出，这种方法能够早于 Link 首部方法启用推送。根据 Apache 安装时的不同设置，你也可能无法使用此功能。本文后面会给出 Link 首部方法的性能测试结果。

截至目前，Nginx 并不支持 HTTP/2 Server Push，目前的 changelog 中没有任何支持情况的记录。而随着 Nginx HTTP/2 实现的逐渐成熟，这种情况可能会发生变化。

### 使用后端代码设置 Link 首部

另一个设置 Link 首部的方法是使用服务器端语言。这在你无法修改或覆盖服务器配置时十分有效。下面是 PHP header 方法设置 Link 首部的例子：

```css
header("Link: </css/styles.css>; rel=preload; as=style");
```

如果你的应用程序部署在一个共享的托管环境中，并且修改服务器的配置不太现实，那么这个方法可能是最适合你的。你可以使用任何服务端语言设置这个首部。在真实使用前记得确保测试无误，以避免潜在的运行时错误。

### 多资源推送

目前看到的都是演示推送一个资源的例子，如果想一次推送更多资源呢？这么做也是很有道理的，对吧？毕竟页面不止是样式表组成的。下面来看推送多资源的例子：

```css
Link: </css/styles.css>; rel=preload; as=style, </js/scripts.js>; rel=preload; as=script, </img/logo.png>; rel=preload; as=image
```

当你想推送多个资源，只要用逗号把每个指令隔开就行了。因为资源示意是通过 Link 首部加入的，这种语法让我们可以把不同资源的推送指令合在一起。这还有个包括 preconnect 的混合推送指令示例：

```css
Link: </css/styles.css>; rel=preload; as=style, <https://fonts.gstatic.com>; rel=preconnect
```

多个 Link 首部也是同样合法的。下面是 Apache 给 HTML 配置多个 Link 首部的例子：

    <FilesMatch "\.html$">
        Header add Link "</css/styles.css>; rel=preload; as=style"
        Header add Link "</js/scripts.js>; rel=preload; as=script"
    <FilesMatch>

这种语法相比一长串逗号分隔的字符串更为方便，且达到的作用是相同的。唯一的缺点就是没那么紧凑，而且会多一点字节量的网络传输，但提供的便利是值得的。

现在知道了如何推送资源，在本文下半部分，我们继续看推送是否生效，且表现性能如何。


<!-- {% endraw %} - for jekyll -->