---
title: Preload：有什么好处？（下）
date: 2016-07-25
author: TAT.Johnny
source_link: http://www.alloyteam.com/2016/07/preload-what-is-it-good-for-part2/
---

<!-- {% raw %} - for jekyll -->

\\============== 接上篇 [Preload：有什么好处？（上）](http://www.alloyteam.com/2016/05/preload-what-is-it-good-for-part1/)\\=================

译者注：上文讲到了利用 Preload，我们可以做到哪些事情，从这里继续～

响应式加载（RESPONSIVE LOADING）  

* * *

因为 **Preload 是一个链接**，遵循规范它应有 media 属性（目前 Chrome 还未支持，不过很快就可以了）。这个属性可以启用资源的条件加载能力。

它又有什么用处呢？举个例子，你的网站的初始视窗，对于 PC／宽屏设备展示可交互的地图版本，而对于手机／窄屏设备则展示静态的地图版本。如果你擅于加载性能优化，会想到在特定设备**只加载其中一个版本的资源，而不是所有资源**。而要做到这样唯一的办法就是使用 JS 去动态地加载资源。但是这么做，会使得资源对于 [preloader](http://calendar.perfplanet.com/2013/big-bad-preloader/)（译者注：上文提到过的浏览器内部的预加载器）不可见，因此会使得资源的加载时机稍微滞后，不但影响了用户的视觉体验，还对站点的 [SpeedIndex](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index)  得分有着**负面影响**。

所以我们该怎么做，才能让浏览器尽早知道所需加载的资源呢？没错，就是 Preload！

我们可以**使用 Preload 提前加载这些资源**，并且使用 media 属性，做到只加载需要的资源：

```html
&lt;link rel="preload" as="image" href="map.png" media="(max-width: 600px)">
 
&lt;link rel="preload" as="script" href="map.js" media="(min-width: 601px)">
```

HTTP 首部（Headers）  

===================

link 标签带来另外一个特性就是，它可以[代表一个 HTTP 的首部](https://tools.ietf.org/html/rfc5988)。这意味着上面很多基于标签的例子，你都可以使用 HTTP 响应首部达到同样的目的。（唯一的例外是 onload 相关的例子，你无法在 HTTP 首部中定义一个 onload 的 handler。）

HTTP 响应首部的例子：

```css
Link: &lt;thing_to_load.js>;rel="preload";as="script"
 
Link: &lt;thing_to_load.woff2>;rel="preload";as="font";crossorigin
```

当做优化的人与当初书写标签的人，不是同一个人时，HTTP 首部可谓信手拈来。特别明显的例子是，当一个**外部优化引擎**，对内容进行扫描和优化的时候（透露下，[我正在实现的一个](https://www.akamai.com/us/en/resources/front-end-optimization-feo.jsp)）。

另一些例子是，一个独立的优化小组，想做这样的优化，或者是优化构建流程，避免了对 HTML 的修改，显著地降低了复杂度。

特性检测（Feature Detection）  

==========================

最后一点：在上面的一些例子中，我们依赖的前提是 preload 支持基础的功能，如样式、脚本的加载。而如果浏览器中并不是如此，会怎么样呢？

会悲剧。。

我们不希望这样。由于 preload 的原因，我们改变了 DOM 规范，使得被支持 rel 关键字的特性检测成为了可能。

一个**特性检测方法**的例子：

```javascript
var DOMTokenListSupports = function (tokenList, token) {
    if (!tokenList || !tokenList.supports) {
        return;
    }
    try {
        return tokenList.supports(token);
    } catch (e) {
        if (e instanceof TypeError) {
            console.log(
                "The DOMTokenList doesn't have a supported tokens list"
            );
        } else {
            console.error("That shouldn't have happened");
        }
    }
};
var linkSupportsPreload = DOMTokenListSupports(
    document.createElement("link").relList,
    "preload"
);
if (!linkSupportsPreload) {
    // Dynamically load the things that relied on preload.
}
```

这使得你可以**提供降级加载机制**，以防止因为 preload 缺乏支持，而站点发生崩溃的情况。So easy...

HTTP/2 的 Push 涵盖了上面所有 case 吗？  

================================

并不是的，虽然它们部分特性有所重叠，但它们是互相配合的关系。

HTTP/2 Push 的优势是，它可以**推送**浏览器还未发起请求的**资源**。也就是说，Push 可以随时推送资源，甚至在 HTML 的请求还没被发送给到服务器的时候。它还可以被用来向下给一个开放的，不需要响应的 HTTP/2 链接推送资源。

而另一方面，**preload 可以解决一些 HTTP/2 不能处理的问题**。如我们所见，使用 Preload 的应用知道资源加载的发生时机，并可在资源加载完毕后马上得到通知。这些并不是 HTTP/2 Push 所设计的目标。并且，HTTP/2 Push 不能被第三方资源使用，而 Preload 在这方面是没有第三方之分的。

此外，HTTP/2 Push **不能把浏览器的缓存和非全局 Cookie 状态考虑在内**。虽然缓存状态可能可以通过新的 [cache digest specification](https://tools.ietf.org/html/draft-kazuho-h2-cache-digest-00) 规范解决，但对于非全局 Cookie 状态则无计可施了，所以 Push 不能使用在对这些 Cookie 有依赖的资源上。对于这类资源，Preload 才是你的朋友👬。

Preload 另一个好处就是可以进行内容协商，而 HTTP/2 Push 不能。这意味着如果你想使用 [Client-Hints](https://www.smashingmagazine.com/2016/01/leaner-responsive-images-client-hints/) 来决定发给服务器正确的图片，或者是 Accept 首页来决定最佳的格式，HTTP/2 Push 会爱莫能助。

所以...  

========

我希望你现在确信，Preload 开辟了一套以前并不可行的加载功能，欢迎去 Chrome Canary 中使用它～


<!-- {% endraw %} - for jekyll -->