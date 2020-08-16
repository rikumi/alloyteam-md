---
title: Preload：有什么好处？（上）
date: 2016-05-18
author: TAT.JohnnyYoav Weiss
source_link: http://www.alloyteam.com/2016/05/preload-what-is-it-good-for-part1/
---

<!-- {% raw %} - for jekyll -->

原文：<https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/>

作者：[Yoav Weiss](https://www.smashingmagazine.com/author/yoav-weiss/ "Posts by Yoav Weiss")

译者按：网络优化一直是译者长期研究的方向，除了近期热门的 HTTP/2 之外，还是要关注浏览器在加载策略上的一些改进，从不同层面提升用户的访问体验。prefetch 这些 HTML5 的新特性，虽然很新鲜，但并未在生产环境中得到广泛使用，其中的原因是什么？preload 有什么改进？本文将娓娓道来～

\\======================== 译文分割线 ===========================

**Preload**（[规范](https://w3c.github.io/preload/)）是一项新的 Web 标准，旨在提升性能，让 Web 开发者对加载的控制更加粒度化。它让开发者有**自定义加载**逻辑的能力，免受基于脚本的 loader 所带来的性能损耗。

几周前，我在 Chrome Canary 提交了对 preload 的支持，解决了一些 bug，预计将在四月中旬合入 Chrome 稳定版。但 preload 到底是什么？它有什么用处？对你有什么好处呢？

好吧，<link rel="preload"> 它是一种声明式的获取（fetch）指令。

用人话来讲，它是一种告诉浏览器开始获取一项确定资源的方式，因为我们是作者（或者服务器管理员，或者聪明的服务器开发），我们是知道浏览器将很快需要那一项资源的。

不是已经有这种能力了吗？  

===============

嗯，也不算是真有。<link rel="prefetch"> 已经被支持一段时间了，也有不错的[兼容性](http://caniuse.com/#feat=link-rel-prefetch)。在此基础上，Chrome 也对[<link rel="subresource">](https://web.archive.org/web/20150907034803/https://www.chromium.org/spdy/link-headers-and-server-hint/link-rel-subresource) 支持好一段时间了，所以 preload 有什么新特性？它跟前面这几个指令有什么区别？它们都告知浏览器去获取资源，是吧？

确实是的，但是它们有一些重要的区别，这些区别使得 preload 成为一项全新的指令，做出之前指令所不能做到的事情。

<link rel="prefetch"> 是一种告诉浏览器**获取一项可能被**下一页访问**所需要的资源**方式。这意味着资源将以较低优先级地获取（因为浏览器知道当前页面所需要的资源，要比我们猜测在下一页访问所需资源更重要）。这意味着 prefetch 的主要用途是加速下一页访问速度，而不是当前页面的速度。

<link rel="subresource"> 原本是计划处理当前页面的，但是在一些特别的场景失败了。由于 Web 开发者无法定义资源的优先级，所以浏览器（实际只有 Chrome 和基于 Chromium 的浏览器）使用同等较低的优先级加载资源，也就是说大多数情况，即使没有 subresource，请求也是同一时机发出的。

Preload 如何做得更好？  

==================

Preload 像 subresource 一样，注定是为当前页面服务的，但具备一项小而重要的区别。它有一个 as 属性，这可以让浏览器做到很多 subresource 和 prefetch 做不到的事情：

-   **浏览器可以设置正确的资源优先级**，使得资源可以被正确地加载，重要的资源不再会被延迟，不再被不重要的资源阻塞。
-   浏览器会保证请求对应正确的内容安全策略（[Content-Security-Policy](http://www.html5rocks.com/en/tutorials/security/content-security-policy/) ）指令，不会发起非法请求。
-   浏览器会基于资源类型发送正确的 Accept 首部。（比如获取图片时指定对 “image/webp” 的支持）
-   浏览器知道资源的类型，所以可以稍后决定资源是否在后续请求中保持可重用。

Preload 的另外一个不同是，它有 onload 事件（至少在 Chrome 中，对另外两种 rel 取值并没作用）。

Preload **不阻塞 window 的 onload 事件**，除非该资源是被一个阻塞该事件的资源请求的。

将这些特性结合在一起，我们可以做到一些新的事情。

加载较晚发现的资源  

* * *

preload 最基本的使用方式是**提前加载较晚发现的资源**。虽然大部分基于标签的资源会被浏览器内部的预加载器（[preloader](http://calendar.perfplanet.com/2013/big-bad-preloader/)）提早发现，但并非所有资源都是基于标签的。有些资源是隐藏在 CSS 和 JavaScript 中的，浏览器不知道页面即将需要这些资源，而等到发现它们时已经为时已晚。所以在有些情况，这些资源延缓了首屏渲染，或是延缓了页面关键部分的加载。

而现在你有途径告诉浏览器，“嘿，浏览器！这个是你一会所需要的资源，现在就开始加载吧。”

做法可能如下

```html
<link rel="preload" href="late_discovered_thing.js" as="script">
```

as 属性告诉浏览器什么类型的资源将被下载。as 可能的取值有：

-   “script”
-   “style”
-   “image”
-   “media”
-   “document”

（参考 [fetch 规范](https://fetch.spec.whatwg.org/#concept-request-destination)的完整列表）

如果省略 as 属性，或者给定一个非法值，将等同发起一个 XHR 请求，因为浏览器不知道将要获取的是什么，并且加载的优先级也会很低。

较早加载字体  

* * *

一种流行的 “较晚发现关键资源” 的代表是 Web 字体。一方面，它对页面渲染字体很关键（除非你在使用最新的 [font-display](https://tabatkins.github.io/specs/css-font-display/)）。另一方面，它们被埋在 CSS 很深的地方，即使浏览器的预加载器解析了 CSS，也不能保证在它们选择器应用到 DOM 节点之前，就是被需要的。理论上讲，浏览器应该可以发觉这种情况，但实际上都没有，而就算可以，也会造成无谓的下载，因为后续的 CSS 规则可能会覆盖现有的字体样式规则。

简而言之，这很复杂。

但是，你可以对一定需要的字体使用 preload 指令，摆脱上述的复杂问题。像这样：

```c
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
```

有一点需要指明，获取字体时[必须加上 crossorigin 属性](https://github.com/w3c/preload/issues/32)，就如[使用 CORS 的匿名模式获取](https://drafts.csswg.org/css-fonts/#font-fetching-requirements)一样。是的，即使你的字体与页面同域，抱歉……

同时，type 属性确保了浏览器只预加载其支持的类型文件。现在，只有 Chrome 支持 preload，同时支持 WOFF2。未来会有越来越多浏览器支持 preload，但我们不敢确保它们都会支持 WOFF2。同理，不同浏览器对不同类型的资源支持也可能是不一样的。

动态加载，不做运行  

* * *

另一个突然变得现实的有趣场景是，你想**下载一个资源因为你觉得它是被需要的**，但不想立即运行它。举个例子，想象这个场景，你想在页面生命周期的一个特定时间点执行代码，而不用通过脚本来控制（不用添加一个 runNow () 的方法）。

如今，要做到上面的事情非常受限。如果只是在需要运行的地方注入脚本，浏览器会在执行前下载这段脚本，耗费一点时间。也可以先使用 XHR 下载脚本，但浏览器会拒绝使用它，因为资源不是以同样 type 下载的。

所以该怎么办呢？

在没有 preload 之前，也没什么办法了。（在一些场景可以使用 eval () 脚本的内容，但那不太切合实际并且伴有副作用。）但可以配合 preload 来实现！

```javascript
var preload = document.createElement("link");
link.href = "myscript.js";
link.rel = "preload";
link.as = "script";
document.head.appendChild(link);
```

可以在页面加载的早期运行它，也就是在希望脚本运行的早些时间（但你要确信这个脚本不会对其他需要加载的关键资源有所干扰）。然后但你想运行它们的时候，只要简单注入一段脚本就好了。

```javascript
var script = document.createElement("script");
script.src = "myscript.js";
document.body.appendChild(script);
```

基于标签的异步加载器  

* * *

另一个酷炫的技巧，是使用 onload 处理函数来创建一些基于标签的异步加载器。[Scott Jehl](https://twitter.com/scottjehl) 做了这方面的第一个[实验](https://github.com/filamentgroup/loadCSS/issues/59)，作为他的 loadCSS 库。简单说，你可以这么使用：

```html
<link rel="preload" as="style" href="async_style.css" onload="this.rel='stylesheet'">
```

在标签里获取异步的样式表！Scott 还有一个该特性的 [demo](http://filamentgroup.github.io/loadCSS/test/preload.html) 页面。

该特性同样可以应用在脚本上。

话说我们不是已经有<script async> 了吗？嗯，<script async> 确实不错，但它会阻塞 window 的 onload 事件。在一些情况，这可能是你希望的，而有些情况并不是。

比如说你想下载一个上报分析脚本，希望尽快去加载它（以避免分析脚本漏掉一些访客上报），但不想它对用户体验有任何影响，也就是不希望它对 onload 造成延迟。（你可以说 [onload](http://www.stevesouders.com/blog/2013/05/13/moving-beyond-window-onload/) 不是影响用户的唯一因素，但缩短转菊花的时间总是一件好事）。

有了 preload，实现起来就很容易了：

```javascript
<link rel="preload" as="script" href="async_script.js"
onload="var script = document.createElement('script');
        script.src = this.href;
        document.body.appendChild(script);">
```

（onload 属性中包含太长 JS 可能不是个好主意，可以在 inline 的代码中来定义。）

\\======================== 译文分割线 ===========================

由于本文篇幅较长，便于大家吸收消化，更多网络细节以及 HTTP/2 相关内容，将于下一篇博客与各位见面～


<!-- {% endraw %} - for jekyll -->