---
title: 一箩筐的预加载技术
date: 2015-10-31
author: TAT.yunsheng
source_link: http://www.alloyteam.com/2015/10/prefetching-preloading-prebrowsing/
---

<!-- {% raw %} - for jekyll -->

译者说明  

* * *

-   本文翻译自 [Prefetching, preloading, prebrowsing](https://css-tricks.com/prefetching-preloading-prebrowsing/)，为了阅读通畅，部分技术术语就不做蹩脚的翻译了。
-   原文中有很多扩展文章的链接，都是对所在章节的详细说明，个个都值得一读。

当我们谈到前端的性能时，总是会提到比如合并、压缩、缓存或者在服务器上开启 gzip 之类的，目的都是为了让页面加载的更快。

资源预拉取（prefetch）则是另一种性能优化的技术。通过预拉取可以告诉浏览器用户在未来可能用到哪些资源。

[Patrick Hamann](https://twitter.com/patrickhamann) 对此的[说明](http://patrickhamann.com/workshops/performance/tasks/2_Critical_Path/2_3.html)：

> Pre-fetching 会提示浏览器那些未来一定或可能使用到的资源，有时在当前页面见效，有些则在未来可能打开的页面生效。 作为开发者，我们比浏览器更懂自己的应用。我们可以利用这些技术提前告知浏览器 web 中用到的核心资源。

以前这种实践也被称为『prebrowsing』。但这并不是一种单一的技术，实际上可以拆分成很多小点：dns-prefetch, subresource, prefetch, preconnect, 和 prerender.

DNS prefetch  

* * *

DNS prefetching 通过指定具体的 URL 来告知客户端未来会用到相关的资源，这样浏览器可以尽早的解析 DNS。比如我们需要一个在 example.com 的图片或者视频文件。在<head> 就可以这么写：

```html
<link rel="dns-prefetch" href="//example.com">
```

当请求这个域名下的文件时就不需要等待 DNS 查询了。项目中有用到第三方的代码时这么做尤其有益（译者注：其他的使用场景，比如当静态资源和 HTML 不在一个域上，而在 CDN 上；又比如在重定向前可以加上 DNS prefetch）。

Harry Roberts 在他的[前端性能优化文章](http://csswizardry.com/2013/01/front-end-performance-for-web-designers-and-front-end-developers/#section:dns-prefetching)中建议：

> 简单的一行就能让支持的浏览器提前解析 DNS。也就是说在浏览器请求资源时，DNS 查询就已经准备好了。

这可能看起来是个非常微不足道的性能提升，而且还不是必须的 --[Chrome 总是会做类似的处理](https://docs.google.com/presentation/d/18zlAdKAxnc51y_kj-6sWLmnjl6TLnaru_WH0LJTjP-o/present?slide=id.g120f70e9a_041)，用户只要在地址栏敲入一部分域名，如果命中了历史常用的网站，Chrome 就会提前解析 DNS、预拉取页面。（译者注：效果确实有限，但是聊胜于无）

> [caniuse](http://caniuse.com/#feat=link-rel-dns-prefetch)

Preconnect  

* * *

和 DNS prefetch 类似，preconnect 不光会解析 DNS，还会建立 TCP 握手连接和 TLS 协议（如果需要）。用法如下：

```c
<link rel="preconnect" href="http://css-tricks.com">
```

Ilya Grigorik 写了一篇[文章](https://www.igvita.com/2015/08/17/eliminating-roundtrips-with-preconnect/)详细说明了这种技术：

> 现代浏览器竭尽所能的尝试预测网站可能需要哪些链接。通过提前连接，浏览器可以提前建立必要的通信，消除了实际请求中 DNS、TCP 和 TLS 的耗时。不过，即使是只能的现代浏览器，也没办法为每个网站可靠的预测所有连接。
>
> 幸运的是开发者可以告诉浏览器哪些通信需要在实际请求发起前就提前建立连接。

举个栗子： ![](https://1-ps.googleusercontent.com/sk/bYSmB63yuhjL_l7bPRuu4R3ENi/www.igvita.com/posts/15/xfont-preconnect.png.pagespeed.ic.tC0wdnTl8DuD8UE7Xn1Y.png) 上半张图显示了浏览器先拉 html、再拉 CSS 并建立好 CSSOM 后，发现需要两个外链的字体（在 fonts.gstatic.com 上）, 然后浏览器开始发起两个请求，具体来说，需要对这个域进行 DNS 解析、TCP 和 TLS 握手（一个建立后可以复用给另一个连接）。

```html
<link href='https://fonts.gstatic.com' rel='preconnect' crossorigin>
<link href='https://fonts.googleapis.com/css?family=Roboto+Slab:700|Open+Sans' rel='stylesheet'>
```

下半张图增加了上面的代码来从 fonts.gstatic.com **preconnect** 资源。可以看到，浏览器在请求 CSS 的同时并行的建立字体资源需要的连接，等到真正开始需要字体时立刻就开始返回数据。

更多详细的内容可以参考 Ilya Grigorik 的文章。

> 目前只支持 Firefox 39 + 和 Chrome 46+，具体参见 [caniuse](http://caniuse.com/#feat=link-rel-preconnect)

Prefetch  

* * *

当能确定网页在未来一定会使用到某个资源时，开发者可以让浏览器提前请求并且缓存好以供后续使用。**prefetch** 支持预拉取图片、脚本或者任何可以被浏览器缓存的资源。

```c
<link rel="prefetch" href="image.png">
```

不同于 DNS prefetch，上面的写法可是会去请求、下载资源并且缓存起来。当然也是有一些发生条件的。比如，客户端可能会在弱网络下不去请求较大的字体文件，Firefox 则只会在浏览器空闲的时候 prefetch 资源（译者注：[这里](https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ)是 MDN 上对浏览器空闲的定义和一些 FAQ，建议阅读）。

正如 Bram Stein 在他的[文章](http://www.bramstein.com/writing/preload-hints-for-web-fonts.html)中指出，prefetch 很适用于优化 webfonts 的性能。以前，字体文件必须等 DOM 和 CSSOM 创建好后才能下载，可如果 prefetch 了字体，这个瓶颈就能轻松解决了。

> 注意：prefetch 并没有同域的限制

[caniuse](http://caniuse.com/#feat=link-rel-prefetch)

Subresource  

* * *

subresource 可以用来指定资源是最高优先级的。比如，在 Chrome 和 Opera 中我们可以加上下面的代码：

```html
<link rel="subresource" href="styles.css">
```

[Chromium 的文档](https://www.chromium.org/spdy/link-headers-and-server-hint/link-rel-subresource)这么解释：

> 和 "Link rel=prefetch" 的语义不同，"Link rel=subresource" 是一种新的连接关系。rel=prefetch 指定了下载后续页面用到资源的低优先级，而 rel=subresource 则是指定当前页面资源的提前加载。

所以，如果资源是在当前页面需要，或者马上就会用到，则推荐用 subresource，否则还是用 prefetch。

Prerender  

* * *

prerender 是一个重量级的选项，它可以让浏览器提前加载指定页面的所有资源。

```c
<link rel="prerender"  href="/thenextpage.html" />
```

Steve Souders 的[文章](http://www.stevesouders.com/blog/2013/11/07/prebrowsing/)详细解释了这个技术：

> prerender 就像是在后台打开了一个隐藏的 tab，会下载所有的资源、创建 DOM、渲染页面、执行 JS 等等。如果用户进入指定的链接，隐藏的这个页面就会进入马上进入用户的视线。Google Search 多年前就利用了这个特性实现了 Instant Pages 功能。微软最近也宣布会让 Bing 在 IE11 上用类似 prerender 的技术。

但是要注意，一定要在十分确定用户回点某个链接时才用这个特性，否则客户端就会无端的下载很多资源和渲染这个页面。

> 正如任何提前的动作一样，预判总是有一定风险出错。如果提前的动作是昂贵的（比如高 CPU、耗电、占用带宽），就要谨慎使用了。虽然不容易预判用户会点进哪个页面，但还是存在一些典型的场景：
>
> -   如果用户搜索到了一个明显正确的结果时，那么这个页面就很有可能被点入
> -   如果用户在登录页面，那么登录成功后的页面就很可能接下来会被加载了
> -   如果用户在阅读一个多页面的文章或者有页码的内容时，下一页就很可能会马上被点击了

利用 [Page Visibility API](http://www.w3.org/TR/page-visibility/) 可以用来防止页面在还没真正展示给用户时就触发了 JS 的执行。

[caniuse](http://caniuse.com/#feat=link-rel-prerender)

未来：Preload  

* * *

以上是已有的技术，我们再谈谈未来。 preload [草案](https://w3c.github.io/preload/)建议允许始终预加载某些资源，不像 prefetch 有可能被浏览器忽略，浏览器必须请求 preload 标记的资源。

```html
<link rel="preload" href="image.png">
```

然而，这项草案还没有任何浏览器支持，不过值得关注。

总结  

* * *

预判用户的操作虽然不易，而且还需要大量的设计和测试工作，但是性能的提升是值得我们孜孜不倦的去追求的。如果我们愿意试验这些预加载技术，我们肯定能显著地提升用户体验。

（译者补一句，文章说的大部分预加载技术移动端都不支持，PC 支持有限，但我们显然应该知道这些技术的存在，并且持续的关注）

扩展阅读  

* * *

-   [Slides from a talk by Ilya Grigorik called Preconnect, prerender, prefetch](https://docs.google.com/presentation/d/18zlAdKAxnc51y_kj-6sWLmnjl6TLnaru_WH0LJTjP-o/present?slide=id.p19)
-   [MDN link prefetching FAQ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ)
-   [W3C preload spec](https://w3c.github.io/preload/)
-   [Harry Roberts on DNS prefetching](http://csswizardry.com/2013/01/front-end-performance-for-web-designers-and-front-end-developers/#section:dns-prefetching)
-   [HTML5 prefetch](https://medium.com/@luisvieira_gmr/html5-prefetch-1e54f6dda15d#.yl37ya9a1)
-   [Preload hints for webfonts](http://www.bramstein.com/writing/preload-hints-for-web-fonts.html)


<!-- {% endraw %} - for jekyll -->