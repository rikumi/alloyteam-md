---
title: 使用 performance API 监测页面性能
date: 2012-11-03
author: TAT.horde
source_link: http://www.alloyteam.com/2012/11/performance-api-monitoring-page-performance/
---

<!-- {% raw %} - for jekyll -->

对于前端开发来说，知道整个页面从开始加载到有内容展示出来的时间是很重要的事情.

通常我们要知道页面加载的时间的话。是采用计算几个关键的时间点的方法来得出页面加载的时间。但是这个方式存在一些问题，比如：我们不知道浏览器在开始解析页面之前卸载前一个文档，解析 dns 的时间.

那么 performance API 是啥，能做啥和不能做啥呢？

首先，performance 这货素 html5 的草案，目前 ie9,chrome11+,firefox&+ 已经提供了支持，用来提供浏览器级别的监控数据，可以在猛戳这里查看文档 <http://w3c-test.org/webperf/specs/NavigationTiming/>.  其次，他只能对和当前的 html 文档做检测，而不能检查 html 中资源的情况.

这个 API 主要包括如下 2 个接口

PerformanceNavigation  主要反应用户访问页面的形式和关于访问重定向的一些相关信息

PerformanceTiming  文档解析各个步骤的耗时.  这个是我们在测试页面性能的时候需要用的东东，先上个 timing 的图.

![](http://w3c-test.org/webperf/specs/NavigationTiming/timing-overview.png "performance.timing")

具体的含义:

-   .navigationStart 准备加载页面的起始时间
-   .unloadEventStart 如果前一个文档和当前文档同源，返回前一个文档开始 unload 的时间
-   .unloadEventEnd 如果前一个文档和当前文档同源，返回前一个文档开始 unload 结束的时间
-   .redirectStart   如果有重定向，这里是重定向开始的时间.
-   .redirectEnd     如果有重定向，这里是重定向结束的时间.
-   .fetchStart        开始检查缓存或开始获取资源的时间
-   .domainLookupStart   开始进行 dns 查询的时间
-   .domainLookupEnd     dns 查询结束的时间
-   .connectStart                  开始建立连接请求资源的时间
-   .connectEnd                     建立连接成功的时间.
-   .secureConnectionStart      如果是 https 请求。返回 ssl 握手的时间
-   .requestStart                     开始请求文档时间 (包括从服务器，本地缓存请求)
-   .responseStart                   接收到第一个字节的时间
-   .responseEnd                      接收到最后一个字节的时间.
-   .domLoading                       'current document readiness' 设置为 loading 的时间 (这个时候还木有开始解析文档)
-   .domInteractive               文档解析结束的时间
-   .domContentLoadedEventStart    DOMContentLoaded 事件开始的时间
-   .domContentLoadedEventEnd      DOMContentLoaded 事件结束的时间
-   .domComplete        current document readiness 被设置 complete 的时间
-   .loadEventStart      触发 onload 事件的时间
-   .loadEventEnd       onload 事件结束的时间

通过计算这些时间消耗，我们能得出页面是在文档解析的时候消耗的时间很多还是的等等连接的时候消耗的时间多.

这个接口还有啥缺陷？

暂时还木有真正开始解析 dom 文档的时间，不过这个 ie9, 有个私有属性 msFirstPaint chrome 下则是 chrome.loadTimes ().firstPaintTime

<!-- {% endraw %} - for jekyll -->