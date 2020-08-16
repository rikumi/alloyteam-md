---
title: HTTP/2 Server Push 详解（下）
date: 2017-04-20
author: TAT.Johnny
source_link: http://www.alloyteam.com/2017/04/guide-http2-server-push-part2/
---

<!-- {% raw %} - for jekyll -->

\\============== 接上篇 [HTTP/2 Server Push 详解（上）](http://www.alloyteam.com/2017/04/guide-http2-server-push-part1)\\=================

译者注：上文介绍了 HTTP/2 Server Push 的基本概念和用法，下面继续深入实际使用的性能和考量。

## 如何分辨 Server Push 是否生效

目前，我们已经通过 Link 首部来告诉服务器推送一些资源。剩下的问题是，我们怎么知道是否生效了呢？

这还要看不同浏览器的情况。最新版本 Chrome 将在开发者工具的网络发起栏中展示推送的资源。

![](http://www.alloyteam.com/wp-content/uploads/2017/04/chrome-push-indicator-large-opt-1024x76.png)

Chrome 显示服务器推送的资源（[大图](https://www.smashingmagazine.com/wp-content/uploads/2017/02/chrome-push-indicator-large-opt.png)）

更进一步，如果把鼠标悬停在网络请求瀑布图中的资源上，将获得关于该推送资源的详细耗时信息：

![](http://www.alloyteam.com/wp-content/uploads/2017/04/push-timing-large-opt.png)

Chrome 显示推送资源的详细耗时信息（[大图](https://www.smashingmagazine.com/wp-content/uploads/2017/02/push-timing-large-opt.png)）

Firefox 对推送资源则标识地没那么明显。如果一个资源是被推送的，则浏览器开发者工具的网络信息里，会将其状态显示为一个灰色圆点。

![](http://www.alloyteam.com/wp-content/uploads/2017/04/firefox-push-indicator-large-opt-1024x53.png)

Firefox 对推送资源的展示（[大图](https://www.smashingmagazine.com/wp-content/uploads/2017/02/firefox-push-indicator-800w-opt.png)）

如果你在寻找一个确保能分辨资源是否为推送的方法，可以使用 [nghttp 命令行客户端](https://nghttp2.org/)来检查是否来自 HTTP/2 服务器，像这样：

    nghttp -ans https://jeremywagner.me

这个命令会显示出会话中所有资源的汇总结果。推送的资源将在输出中显示一个星号（\*），像这样：

    id  responseEnd requestStart  process code size request path
     13     +50.28ms      +1.07ms  49.21ms  200   3K /
      2     +50.47ms *   +42.10ms   8.37ms  200   2K /css/global.css
      4     +50.56ms *   +42.15ms   8.41ms  200  157 /css/fonts-loaded.css
      6     +50.59ms *   +42.16ms   8.43ms  200  279 /js/ga.js
      8     +50.62ms *   +42.17ms   8.44ms  200  243 /js/load-fonts.js
     10     +74.29ms *   +42.18ms  32.11ms  200   5K /img/global/jeremy.png
     17     +87.17ms     +50.65ms  36.51ms  200  668 /js/lazyload.js
     15     +87.21ms     +50.65ms  36.56ms  200   2K /img/global/book-1x.png
     19     +87.23ms     +50.65ms  36.58ms  200  138 /js/debounce.js
     21     +87.25ms     +50.65ms  36.60ms  200  240 /js/nav.js
     23     +87.27ms     +50.65ms  36.62ms  200  302 /js/attach-nav.js

这里，我在[自己的站点](https://jeremywagner.me/)上使用了 nghttp，有五个推送的资源（至少在写这篇文章时）。推送的资源在 requestStart 栏左侧以星号标记了出来。

现在我们知道了如何识别推送的资源，接下里具体看看对真实站点的性能有什么实际影响。

## 测量 Server Push 性能

测量任何性能提升的效果都需要很好的测试工具。[Sitespeed.io](https://www.sitespeed.io/) 是一个可从 [npm](https://www.npmjs.com/) 获取的优秀工具，它可以自动地测试页面，收集有价值的性能数据。有了得力的工具，我们来快速过一下测试方法吧。

### 测试方法

我想通过一个有意义的方法，来测量 Server Push 对网站性能的影响。为了让结果是有意义的，我需要建立 6 种独立的场景来交叉对比。这些场景以两个方面进行分隔：使用 HTTP/2 或 HTTP/1。在 HTTP/2 服务器上，我们想测量 Server Push 在多个指标的效果。在 HTTP/1 服务器上，我们想看看内联资源的方法，在相同指标中对性能有什么影响，因为内联应该能达到和 Server Push 差不多的效果。具体场景如下：

-   **未使用 Server Push 的 HTTP/2**

网站使用了 HTTP/2 协议，但没有资源是被推送的。

-   **仅推送 CSS 的 HTTP/2**

使用了 Server Push，但仅用在了 CSS 资源。该网站的 CSS 体积比较小，经过 [Brotli 压缩](https://www.smashingmagazine.com/2016/10/next-generation-server-compression-with-brotli)后仅有 2KB 多一点。

-   **推送所有资源**

网站的所有资源都是推送的。包括了上面的 CSS，以及 6 个 JS（合计 1.4KB）、5 个 SVG 图片（合计 5.9KB）。这些资源同样经过了压缩处理。

-   **未内联资源的 HTTP/1**

网站只运行在 HTTP/1 上，没有内联任何资源，来减少请求数和加快渲染速度。

-   **只内联 CSS**

只有网站的 CSS 被内联了。

-   **内联所有资源**

页面上的所有资源都进行了内联。CSS 和脚本是普通内联，而 SVG 图片是经过 Base64 编码方式直接放入 HTML 标签中。值得一提的是 Base64 编码后体积比原先[大了 1.37 倍](https://en.wikipedia.org/wiki/Base64#MIME)。

在每个场景中，都使用下面的命令开始测试：

    sitespeed.io -d 1 -m 1 -n 25 -c cable -b chrome -v https://jeremywagner.me

如果想知道这个命令的输入、输出，可以[参看文档](https://www.sitespeed.io/documentation/sitespeed.io/configuration)。简而言之，这个命令测试了我的网站 <https://jeremywagner.me> 的主页，使用了下面的条件：

-   页面中的链接无法抓取。只测试指定的页面。
-   页面测试 25 次
-   使用了 “有线宽带” 级的网络配置。回路时间（_译者注：RTT_）为 28ms，下行带宽是 5000kbps，上行带宽为 1000kbps。
-   测试使用 Google Chrome

每项测试中收集和展示 3 项指标：

-   **首屏渲染时间**

页面在浏览器首次展现的时间点。当我们努力让一个页面 “感觉上” 加载很快，那么这个指标是我们要尽量降低的。

-   **DOMContentLoaded 时间**

这个是 HTML 完成加载与解析的时间。同步的 JavaScript 代码会阻塞解析，并导致这个时间增加。在<script> 标签上使用 async 属性可以避免对解析的阻塞。

-   **页面加载时间**

这个是整个页面完成所有资源加载的耗时。

测试的所有因素都确定后，让我们看看结果！

### 测试结果

经过对上述 6 种场景的测试，我们将结果以图表形式做了展示。先看看各个场景的首屏渲染时间情况：

![首屏渲染时间](http://www.alloyteam.com/wp-content/uploads/2017/04/graph-first-paint-800w-opt.png)

首屏渲染时间（[大图](https://www.smashingmagazine.com/wp-content/uploads/2017/02/graph-first-paint-800w-opt.png)）

让我们先讲讲图表是如何设计的。图中蓝色部分代表了首屏渲染的平均时间，橙色部分是 90% 的情况，灰色部分代表了首屏渲染的最长耗时。

接下来我们讨论结果。最慢的情形是未使用任何优化的 HTTP/2 和 HTTP/1。可以看到，对 CSS 使用 Server Push 使页面渲染平均速度提升了 8%，而内联 CSS 也比简单的 HTTP/1 提升了 5% 速度。

当我们尽可能地推送了所有资源，图片却显示出了一些异样，首屏渲染时间有所轻微增加。在 HTTP/1 中我们尽可能内联所有资源，性能表现和推送所有资源差不多，仅仅少了一点时间。

结论很明确：使用 Server Push，我们能获得比 HTTP/1 中使用内联更优的性能。但随着推送或内联的资源增多，提升的效果逐渐减少。

使用 Server Push 或内联虽好，但对于首次访问的用户并没有太大价值（_译者注：实际上对于首次访问用户有很大的性能提升，猜测作者这里写错了_）。另外，这些测试实验是运行在较少资源的站点上，所以未必能反映出你的网站的使用情况。

我们再看看各项测试对 DOMContentLoaded 时间的影响：

![](http://www.alloyteam.com/wp-content/uploads/2017/04/graph-domcontentloaded-800w-opt.png)

DOMContentLoaded 时间（[大图](https://www.smashingmagazine.com/wp-content/uploads/2017/02/graph-domcontentloaded-large-opt.png)）

数据趋势跟刚才看到的图表没太大差别，除了一个需要注意的区别：在 HTTP/1 中尽可能地内联资源，相对 DOMContentLoaded 时间非常低。可能的原因是内联减少了需要下载的资源数，从而保证解析器（parser）可以不被打断地工作。

最后再看看页面加载时间的情况：

![](http://www.alloyteam.com/wp-content/uploads/2017/04/graph-page-load-800w-opt.png)

页面加载时间（[大图](https://www.smashingmagazine.com/wp-content/uploads/2017/02/graph-page-load-800w-opt.png)）

 各项测量数据依然保持了先前的趋势。仅推送 CSS 时加载时间最短。推送所有资源会偶尔导致服务迟缓，但毕竟还是比什么都不做表现更优。与内联相比，Server Push 的各项情况都是优于内联的。

在做最后总结前，还要讲讲使用 Server Push 时可能遇到的 “坑”。

## 使用 Server Push 的一些建议

Server Push 并不是性能优化的万金油，它也有一些需要注意的地方。

### 推送过多资源

前面的一项测试中，我推送了很多资源，但它们加起来也只占传输数据的一小部分。一次推送很多大资源的话，会造成页面渲染及可交互时间的延迟，因为浏览器不但要加载 HTML 文档，还要同时下载推送的资源。最好的做法是有选择性地推送，样式表文件是个不错的开始（目前它们并不是很大），接着再评估还有什么其他资源适合推送。

### 推送页面以外的资源

如果你有访客统计分析，那么这种做法也未必不好。一个好的例子是，在多页注册账户表单场景，可以推送下一页的注册步骤资源。但要澄清的是，如果你不确定用户是否会访问后续的页面，**千万不要**尝试推送它的资源。有些用户的流量是十分珍贵的，这么做可能会导致其不必的损失。

### 正确地配置 HTTP/2 服务

有些服务器会给出很多 Server Push 的配置选项。Apache 的 mod_http2 模块有一些关于如何推送资源的配置选项。[`H2PushPriority` 设置](https://httpd.apache.org/docs/2.4/mod/mod_http2.html#h2pushpriority)就比较有意思，虽然在我的服务器上使用了默认设置。有一些实验性的配置可以获得额外的性能提升。每一种 Web 服务器都有其整套不同的实验性配置，所以查看你的服务器手册，看看有哪些配置可以用起来吧！

### 推送资源可能不被缓存

Server Push 也有一些有损性能的的情况，对于访问网站的回头客们，一些资源可能会被非必要地进行推送。有些服务器会尽可能地减轻这种影响。Apache 的 mod_http2 模块使用了 [H2PushDiarySize 设置](https://httpd.apache.org/docs/2.4/mod/mod_http2.html#h2pushdiarysize)对这一点进行了一些优化。H2O 服务器有一种 [Server Push 缓存感知](https://h2o.examp1e.net/configure/http2_directives.html)特性，使用了 Cookie 机制来记录推送行为。

如果你不是使用 H2O 服务器，也可以使用服务端代码实现同样的效果，即只推送 Cookie 记录外的资源。如果有兴趣了解具体做法，可以查看[我在 CSS Tricks 上的文章](https://css-tricks.com/cache-aware-server-push)。值得一提的是，浏览器可以向服务器发送一个 RST_STREAM 帧来通知不需推送的资源。随着时间推移，这个问题的解决将会愈加优雅。

最后来总结一下以上学到的内容。

## 最后的思考

如果你已经将自己的网站迁移到 HTTP/2，你没有什么理由_不_使用服务器推送。如果你的网站因有过多的资源而显得复杂，可以从体积较小的资源开始尝试。一个好的经验法则是，考虑推送那些你曾经用到内联的资源。推送 CSS 是个不错的开始。如果感觉更有冒险精神之后，就考虑推送其他资源。要牢记在改动后测试对性能的影响。下了一定功夫后，你一定能从中有所受益。

如果你没有用像 H2O 这样使用缓存感知推送机制的服务器，可以考虑用 cookie 追踪你的用户，只在没有相关 cookie 的情况下给他们推送资源。这样可以为未知用户提升着性能的同时，最小化向已知用户的资源推送量。这不仅利于性能优化，也向用户展示了数据用量的尊重。

剩下的就需要你自己在服务器上折腾 Server Push 了，看看有哪些特性可以对你或用户有用吧。如果你想了解更多关于 Server Push，看看这些资源吧：

-   “[Server Push](https://tools.ietf.org/html/rfc7540#section-8.2),” “Hypertext Transfer Protocol Version 2 (HTTP/2),” Internet Engineering Task Force
-   “[Modernizing Our Progressive Enhancement Delivery](https://www.filamentgroup.com/lab/modernizing-delivery.html),” Scott Jehl, Filament Group
-   “[Innovating with HTTP 2.0 Server Push](https://www.igvita.com/2013/06/12/innovating-with-http-2.0-server-push/),” Ilya Grigorik

<!-- {% endraw %} - for jekyll -->