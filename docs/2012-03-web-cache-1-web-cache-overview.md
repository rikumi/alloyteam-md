---
title: 【Web 缓存机制系列】1 – Web 缓存的作用与类型
date: 2012-03-22
author: TAT.Rehorn
source_link: http://www.alloyteam.com/2012/03/web-cache-1-web-cache-overview/
---

\\==== 索引 =====

[【Web 缓存机制系列】1 – Web 缓存的作用与类型](http://alloyteam.com/2012/03/web-cache-1-web-cache-overview/)

[【Web 缓存机制系列】2 – Web 浏览器的缓存机制](http://alloyteam.com/2012/03/web-cache-2-browser-cache/)

[【Web 缓存机制系列】3 – 如何构建可缓存站点](http://alloyteam.com/2012/03/web-cache-3-how-to-build-cacheable-website/)

[【Web 缓存机制系列】4 – HTML5 时代的 Web 缓存机制](http://alloyteam.com/2012/03/web-cache-4-html5-web-cache/)

[【Web 缓存机制系列】5 – Web App 时代的缓存机制新思路](http://alloyteam.com/2012/03/web-cache-5-web-app-cache/)

[【Web 缓存机制系列】6 - 进击的 Hybrid App，量身定做缓存机制](http://www.alloyteam.com/2013/12/web-cache-6-hybrid-app-tailored-cache/)

\\============

### **前言 & 摘要**

这段时间的工作内容主要是为一个客户端类型的产品增加文档在线存储和文档在线预览相关特性。由于测试的同事比较细心和专业，发现了项目实现中一些效率低下的环节，比如在线预览图片没有经过压缩、重开打开同一张图片没有有效利用 Web 缓存等问题。而这些细节问题往往在做项目架构时，容易因为时间紧张等等因素而被忽略。虽然以前也有一些关于 Web 缓存的意识，但并没有很系统的了解、总结，并在项目中进行合理的运用。借此机会，整理了一些相关资料和项目的实际应用实践，做个备忘，便于在日后的项目查询和应用。

本文从 Web 缓存的定义、作用、分类、工作机制等方面介绍了目前常用的 Web 缓存及其原理，并给出如何构建有效利用 Web 缓存的站点。最后探讨了在 HTML5 和 Web App、Web Game 逐渐盛行的今天，现代浏览器给我们提供哪些有利于 Web 缓存、提高访问效率的机制，前端的代码架构又能从哪些方面进行调整，更好的利用 Web 缓存等问题。  

### 什么是 Web 缓存

Web 缓存是指一个 Web 资源（如 html 页面，图片，js，数据等）存在于 Web 服务器和客户端（浏览器）之间的副本。缓存会根据进来的请求保存输出内容的副本；当下一个请求来到的时候，如果是相同的 URL，缓存会根据缓存机制决定是直接使用副本响应访问请求，还是向源服务器再次发送请求。比较常见的就是浏览器会缓存访问过网站的网页，当再次访问这个 URL 地址的时候，如果网页没有更新，就不会再次下载网页，而是直接使用本地缓存的网页。只有当网站明确标识资源已经更新，浏览器才会再次下载网页。至于浏览器和网站服务器是如何标识网站页面是否更新的机制，将在后面介绍。

### Web 缓存的作用

使用 Web 缓存的作用其实是非常显而易见的：

# 减少网络带宽消耗

无论对于网站运营者或者用户，带宽都代表着金钱，过多的带宽消耗，只会便宜了网络运营商。当 Web 缓存副本被使用时，只会产生极小的网络流量，可以有效的降低运营成本。

# 降低服务器压力

给网络资源设定有效期之后，用户可以重复使用本地的缓存，减少对源服务器的请求，间接降低服务器的压力。同时，搜索引擎的爬虫机器人也能根据过期机制降低爬取的频率，也能有效降低服务器的压力。

# 减少网络延迟，加快页面打开速度

带宽对于个人网站运营者来说是十分重要，而对于大型的互联网公司来说，可能有时因为钱多而真的不在乎。那 Web 缓存还有作用吗？答案是肯定的，对于最终用户，缓存的使用能够明显加快页面打开速度，达到更好的体验。

### Web 缓存的类型

在 Web 应用领域，Web 缓存大致可以分为以下几种类型：

# 数据库数据缓存

Web 应用，特别是 SNS 类型的应用，往往关系比较复杂，数据库表繁多，如果频繁进行数据库查询，很容易导致数据库不堪重荷。为了提供查询的性能，会将查询后的数据放到内存中进行缓存，下次查询时，直接从内存缓存直接返回，提供响应效率。比如常用的缓存方案有 [memcached](http://www.mysql.com/why-mysql/memcached/ "MySQL and Memcached") 等。  

# 服务器端缓存

#####  代理服务器缓存

代理服务器是浏览器和源服务器之间的中间服务器，浏览器先向这个中间服务器发起 Web 请求，经过处理后（比如权限验证，缓存匹配等），再将请求转发到源服务器。代理服务器缓存的运作原理跟浏览器的运作原理差不多，只是规模更大。可以把它理解为一个共享缓存，不只为一个用户服务，一般为大量用户提供服务，因此在减少相应时间和带宽使用方面很有效，同一个副本会被重用多次。常见代理服务器缓存解决方案有 [Squid](http://www.squid-cache.org/ "squid cache") 等，这里不再详述。

#####  CDN 缓存

CDN（Content delivery networks）缓存，也叫网关缓存、反向代理缓存。CDN 缓存一般是由网站管理员自己部署，为了让他们的网站更容易扩展并获得更好的性能。浏览器先向 CDN 网关发起 Web 请求，网关服务器后面对应着一台或多台负载均衡源服务器，会根据它们的负载请求，动态将请求转发到合适的源服务器上。虽然这种架构负载均衡源服务器之间的缓存没法共享，但却拥有更好的处扩展性。从浏览器角度来看，整个 CDN 就是一个源服务器，从这个层面来说，本文讨论浏览器和服务器之间的缓存机制，在这种架构下同样适用。

# 浏览器端缓存

浏览器缓存根据一套与服务器约定的规则进行工作，在同一个会话过程中会检查一次并确定缓存的副本足够新。如果你浏览过程中，比如前进或后退，访问到同一个图片，这些图片可以从浏览器缓存中调出而即时显现。

# Web 应用层缓存

应用层缓存指的是从代码层面上，通过代码逻辑和缓存策略，实现对数据，页面，图片等资源的缓存，可以根据实际情况选择将数据存在文件系统或者内存中，减少数据库查询或者读写瓶颈，提高响应效率。

后续将从 Web 前端的角度讨论浏览器缓存机制、前端应用层缓存。