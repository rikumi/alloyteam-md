---
title: 【Web 缓存机制系列】4 – HTML5 时代的 Web 缓存机制
date: 2012-03-22
author: TAT.Rehorn
source_link: http://www.alloyteam.com/2012/03/web-cache-4-html5-web-cache/
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

随着现代浏览器的推动，Flash 放弃对移动端的支持，HTML5 无疑成为当前 Web 前端炙手可热的话题。各大游戏开发商、App 开发商纷纷投入人力进行研究和技术储备。相信不久的将来，HTML5 会迎来一个快速发展和普及的春天。那么，HTML5 这个新一代的标准，又给我们带来哪些缓存机制呢？

##  HTML5 之离线应用 Manifest

我们知道，使用传统的技术，就算是对站点的资源都实施了比较好的缓存策略，但是在断网的情况下，是无法访问的，因为入口的 HTML 页面我们一般运维的考虑，不会对其进行缓存。HTML5 的 Cache Manifest 离线应用特性就能够帮助我们构建离线也能使用的站点，所有的资源都使用浏览器本地缓存，当然前提是要求在联网的情形下使用过一次站点。

### 如何实现离线访问特性

实现的步骤非常简单，主要 3 个步骤：

1）在服务器上添加 MIME TYPE 支，让服务器能够识别 manifest 后缀的文件

AddType text/cache-manifest manifest

2）创建一个后缀名为.manifest 的文件，把需要缓存的文件按格式写在里面，并用注释行标注版本

CACHE MANIFEST

\# 直接缓存的文件

CACHE:

Path/to/cache.js

\# version：2012-03-20

3）给 <html> 标签加 manifest 属性，并引用 manifest 文件

具体可以参考：HTML5 缓存: cache manifest

<html manifest="path/to/name-of.manifest">

### 离线应用访问及更新流程

1.  第一次访问离线应用的入口页 HTML（引用了 manifest 文件），正常发送请求，获取 manifest 文件并在本地缓存，陆续拉取 manifest 中的需要缓存的文件
2.  再次访问时，无法在线离线与否，都会直接从缓存中获取入口页 HTML 和其他缓存的文件进行展示。如果此时在线，浏览器会发送请求到服务器请求 manifest 文件，并与第一次访问的副本进行比对，如果发现版本不一致，会陆续发送请求重新拉取入口文件 HTML 和需要缓存的文件并更新本地缓存副本
3.  之后的访问重复第 2 步的行为

### 离线机制的缓存用途

从 Manifest 的机制来看，即使我们不是为了创建离线应用，也同样可以使用这种机制用于缓存文件，可以说是给 Web 缓存提供多一种可以选择的途径。

### 存在的问题：缓存文件更新控制不灵活

就目前 HTML5 提供的 manifest 机制来讲，一个页面只能引用一个 manifest 页面，而且一旦发现这个 manifest 改变了，就会把里面所有定义的缓存文件全部重新拉取一遍，不管实际上有没有更新，控制比较不灵活。针对这个问题，也有的同学提出了一些建议，比如把需要缓存的文件分模块切分到不同 manifest 中，并分开用 HTML 引用，再使用强大的 iframe 嵌入到入口页面，这样就当某一个模式需要有更新，不会导致其他模块的文件也重新拉取一遍。

## HTML5 之本地存储 localstorage

HTML5 给我们提供本地存储 localstorage 特性，严格来讲，其实已经不算传统 Web 缓存的范畴。因为它存储的地方是跟 Web 缓存分开的，是浏览器重新开辟的一个地方。

### localstorage 的作用

本地存储 localstorage 的作用主要使 Web 页面能够通过浏览器提供的 set/get 接口，存储一些自定义的信息到本地硬盘，并且在单次访问或以后的访问过程中随时获取或修改。

### Localstorage 的使用

Localstorage 提供了几个非常易用的 Api，setItem/getItem/removeItem/clear，具体的可以参考：[Html5 Step by Step (二) 本地存储](http://www.cnblogs.com/Henllyee/archive/2012/02/26/Html5_Third.html)

### Localstorage 的缓存用途

Localstorage 设计的本意可能是用来存储一些用户操作的个性化设置的文本类型的信息和数据，当我们其实也可能拿来当 Web 缓存区使用，比如我们可以将 Base64 格式编码的图片信息，存在 localstorage 中，再次访问时，直接本地获取后，使用 Css3 的 Data:image 的方式直接展现出来。

### 存在的问题：大小限制

按照目前标准，目前浏览器只给每个独立的域名提供 5m 的存储空间，当存储超过 5m，浏览器就会弹出警告框。

可以说，HTML5 的 Manifest 和 localstorage 是给我们在考虑 Web 缓存的时候提供了多一种思路，当你开发的应用只面对现代浏览器的时候，不妨可以考虑一下。

<!-- {% endraw %} - for jekyll -->