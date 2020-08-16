---
title: H5 页面的跨 webview 预拉取数据尝试
date: 2015-06-01
author: TAT.Cson
source_link: http://www.alloyteam.com/2015/06/h5-ye-mian-di-kua-webview-yu-la-qu-shu-ju-chang-shi/
---

<!-- {% raw %} - for jekyll -->

对于传统的页面模型来说，数据的拉取 + 渲染模型如下：

[![1](http://www.alloyteam.com/wp-content/uploads/2015/06/1.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/06/1.jpg)

在页面的 head 部分，使用 jsonp 预拉取 cgi 资源，然后在资源加载完成之后，检查预拉取的数据是否已经返回，如果已返回，则直接用该数据渲染（避免了先用缓存数据渲染再用 cgi 数据渲染导致的二次刷新），否则才用缓存数据渲染。

[![3](http://www.alloyteam.com/wp-content/uploads/2015/06/3.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/06/3.jpg)

对于上面的优化方式，我们可以用于独立页面的首屏数据渲染中，但是对于由手 Q 中一个 webview 内打开的新 webview 里的 H5 页面，是否有更好的方法呢？

当我们通过点击操作，在 webview 内调用手 Q 的 openUrl 接口打开新的 webview 并加载页面，新页面对于我们来说是可被预知的，也就是说我们点击打开新 webview 的时候，其实是知道要打开的页面是什么。

因此对于 cgi 预拉取的逻辑，我们其实可以提前到前一个 webview 点击的操作时就发起。

统计了一下手 Q 创建 webview 到开始请求页面 url 之间的耗时，android 端耗时大约在 1.5-2 秒之间。

因此其实我们可以利用这段时间，在点击前一个 webview 的同时，让新页面的首屏 cgi 请求提前发起，在等待下一个 webview 打开并 load 页面的期间，如果 cgi 请求已经返回，数据可以暂存在前一个 webview 中，等新 webview 页面资源 ready 之后，通过手 Q 的 webview 通信接口 mqq.addEventListener/mqq.dispatchEvent 从上一个 webview 获取数据并渲染。

由于客户端接口通信速度比网络通信要快，因此可借此减少首屏数据渲染的等待时间，另外也同时可以改善二次渲染的问题：

[![2](http://www.alloyteam.com/wp-content/uploads/2015/06/21.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/06/21.jpg)


<!-- {% endraw %} - for jekyll -->