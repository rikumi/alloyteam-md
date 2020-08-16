---
title: 【Web 缓存机制系列】5 – Web App 时代的缓存机制新思路 & 全文总结
date: 2012-03-22
author: TAT.Rehorn
source_link: http://www.alloyteam.com/2012/03/web-cache-5-web-app-cache/
---

\\==== 索引 =====

[【Web 缓存机制系列】1 – Web 缓存的作用与类型](http://alloyteam.com/2012/03/web-cache-1-web-cache-overview/)

[【Web 缓存机制系列】2 – Web 浏览器的缓存机制](http://alloyteam.com/2012/03/web-cache-2-browser-cache/) 

[【Web 缓存机制系列】3 – 如何构建可缓存站点](http://alloyteam.com/2012/03/web-cache-3-how-to-build-cacheable-website/)

[【Web 缓存机制系列】4 – HTML5 时代的 Web 缓存机制](http://alloyteam.com/2012/03/web-cache-4-html5-web-cache/)

[【Web 缓存机制系列】5 – Web App 时代的缓存机制新思路](http://alloyteam.com/2012/03/web-cache-5-web-app-cache/)

[【Web 缓存机制系列】6 - 进击的 Hybrid App，量身定做缓存机制](http://www.alloyteam.com/2013/12/web-cache-6-hybrid-app-tailored-cache/)

\\============

Web App 的概念逐渐被业界认可，各大互联网公司也纷纷推出 Web App 开发大赛，积极引入到他们的开放平台，比较著名类似 facebook 农场，qzone 偷菜之类的。Web 开发逐渐从 Web Page 的进入到 Web App 的时代，想详细了解的话，可以看下[超叔](http://blog.lifeclaw.com/)在 D2 上分享的分享《开放时代：从 Web Page 到 Web APP》[视频](http://v.youku.com/v_show/id_XMjg2NTA2Mjg4.html)、[Slide](http://www.slideshare.net/taobaoued/web-pageweb-app)。

## Web App 常见架构

以 WebQQ 例，WebQQ 这个站点的所有内容都是一个页面里面呈现的，我们看到的类似 windows 操作系统的框架，是它的顶级容器和框架，由 AlloyOS 的内核负责统筹和管理，然后其他模块，比如壁纸设置，消息中心，App Store 都是以模块的形式，并用 iframe 的方式嵌入到顶级容器中。具观察，现在越来越多的 Web 应用都倾向于使用这个的架构，这样做好处是很明显的，比如顶级框架可以维持一个不变的 javascript 上下文便于管理；关闭模块的 iframe 后，内存可以更好的释放；利用 iframe 的安全机制最大限度的保证内核的安全和稳定等等。

这种 Web 的架构，其实也给我们 Web 前端提供了从代码逻辑层面上给 Web 应用实现缓存提供了可能。

## 缓存 Ajax 请求

由于顶级框架页面是不会由于调整刷新而导致 javascript 上下文丢失，所以底层或各个模块所需要的 Ajax 请求，都是可以通过顶级框架统一请求后，并以信息服务的形式对外提供 Api 调用。对于一些实时性要求不是很强的请求来说，可以由顶级框架做统一缓存，定期更新。这种做法可以不影响用户体验的前提下，明显减少请求数，降低网络流量，并间接减轻了服务器的压力。

## 通过 Javascript 实现内存缓存

跟缓存 Ajax 请求的结果类似，程序运行过程中的其他数据，其实也可以采用类似的方式在顶级容器的 Javascript 上下文中缓存。

## Web App 发展新方向：Web-Client 模式

随着 Web App 的进一步发展，貌似浏览器已经无法阻挡 Web 应用探索更前端，更本地化 Native App 的用户体验。比如目前的 [Qplus](http://www.qplus.com/)、[豆瓣荚](http://www.liqucn.com/l/37087.shtml)等应用，都采用 Client、Web 相结合的开发模式。这样做即可以利用 Web 开发迭代更新快、UI 开发成本低等特点，有可以利用客户端的能力为 Web 实现很多无法实现的功能。以 Qplus 为例，Qplus 不但内嵌了 Webkit 内核，还未 Webkit 上定制了很多便利的接口，比如跨 Web-Client 的拖曳、多线程下载等。在这种发展新模式下，Web 缓存又能有什么考虑的发张方向呢？

### 客户端提供缓存读写能力

我们知道，HTML5 的 localstorage 仅仅只能支持 5m 的存储。我们可以按 localstorage 的设计思路，让客户端为 Web 定制更大，更灵活的本地存储功能。到时，Web 缓存能做的事情就会更多。

以上就当前 Web App 的发展趋势，讨论了对于 Web 缓存领域，有哪些可以做，可以考虑的方向。当然，这些做法，合不合理，合不合适都还是值得讨论和商榷的，如果你有想法，都可以随时联系并一起讨论。

## 全文总结

本文尝试概述目前 Web 缓存方向的现状，以及 HTML5 和 Web App 时代下，Web 缓存可以考虑的新方向。由于时间仓促和表达概括能力有限，有可能有表达不妥的地方，欢迎指正讨论。

## 历史

\[Version 1.0] 2012-03-21 [rehorn](http://weibo.com/u/1721747240) @ tencent webplus team

## 参考文献

<http://www.mnot.net/cache_docs/> 

<http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html> 

<http://robbin.iteye.com/blog/462476>

<http://www.procata.com/cachetest/>

<http://www.web-caching.com/cacheability.html>

<http://www.laruence.com/2010/03/05/1332.html>

<http://sofish.de/1449>

<http://www.fovweb.com/web/web-cache.html>