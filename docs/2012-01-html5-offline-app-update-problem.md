---
title: HTML5 离线应用无法更新的定位与解决
date: 2012-01-12
author: TAT.iAzrael
source_link: http://www.alloyteam.com/2012/01/html5-offline-app-update-problem/
---

<!-- {% raw %} - for jekyll -->

 一、些许前提

最近在制作一个 Web 应用，其中用到了 HTML5 的离线应用功能 (offline application), 离线应用的概念就不再阐述，可以查看这两篇文章:

<http://www.ibm.com/developerworks/cn/web/1011_guozb_html5off/>

<http://www.mhtml5.com/2011/02/583.html>

这里主要讨论它的更新问题。首先浏览器是有两部分 cache 的，browser cache 和 app cache, browser cache 就是常说的浏览器缓存，app cache 是离线应用的缓存。他们各自的更新机制如下:

 [![](http://alloyteam.com/wp-content/uploads/2012/01/browser-cache.png "browser-cache")](http://alloyteam.com/wp-content/uploads/2012/01/browser-cache.png)

Browser cache

[![](http://alloyteam.com/wp-content/uploads/2012/01/app-cache.png "app-cache")](http://alloyteam.com/wp-content/uploads/2012/01/app-cache.png)

App cache

其中 browser cache 的机制大家都很清楚了，其中离线应用的更新是：除了第一次访问是直接拉取 server 的，然后后台更新 app cache 之外，其余的情况都是直接访问 app cache. 因此，要如果离线应用的代码更新了，只有下次打开或者刷新才会生效.

## 二、找出凶手

OK, 铺垫完毕。我的应用主要在 webkit 内核的浏览器使用的，为了方便起见，下面的文字都是在 chrome 的环境下产生的.

在测试机测试离线功能时，我们发现，如果更改了 js 文件且更新了 manifest, 刷新两次 (嗯，你没看错，是两次，第一次于后台更新 app cache, 第二次应用新 cache) 就会应用上新的代码。但是，发布到正式环境之后，就不能更新了，把 F5 按烂了，也没什么变化。当然这是删除掉 app cache 是没问题的，但是我们没办法要求用户这样做.

通过抓包发现，无论哪个环境，manifest 更新了，浏览器端都能抓取新的，在 chrome 的控制台也能看到更新 app cache 的 log, 因此不是 manifest 本身被缓存了的原因。但是在正式环境里面，拉取了新的 manifest 之后，就没有任何更新的请求出去，太诡异了.

继续对比 http 的响应头，发现了不同之处，如下:

<table border="1" cellspacing="0" cellpadding="0"><tbody><tr><td valign="top" width="356">测试环境</td><td valign="top" width="356">正式环境</td></tr><tr><td valign="top" width="356"><p align="left">HTTP/1.1 200 OK</p><p align="left">Date: Thu, 05 Jan 2012 05:56:38 GMT</p><p align="left">Server: NWS_HY_P91</p><p align="left">Last-Modified: Thu, 05 Jan 2012 04:29:52 GMT</p><p align="left">Expires: Thu, 05 Jan 2012 05:56:38 GMT</p><p align="left"><em>Connection: close</em></p><p>Content-Type: application/javascript</p><p align="left"><em>Vary: Accept-Encoding</em></p></td><td valign="top" width="356"><p align="left">HTTP/1.1 200 OK</p><p align="left">Date: Thu, 05 Jan 2012 05:56:38 GMT</p><p align="left">Server: nginx</p><p align="left">Last-Modified: Thu, 05 Jan 2012 04:29:52 GMT</p><p align="left">Expires: Thu, 05 Jan 2012 05:56:38 GMT</p><p align="left"><em>Connection: keep-alive</em></p><p>Content-Type: application/javascript</p><p align="left"><em>Cache-Control: max-age=10368000</em></p></td></tr></tbody></table>

可以看到，两个环境里面有 3 个不同，connection, vary, cache-control. 第一眼望去，感觉就可能是 cache-control 的问题。于是用 fildder 把响应卡住，把 max-age 改成 0, 结果呢，它正常更新了！因此猜测 app cache 的更新应该是先去 browser cache 找，找到了该文件，并且没过期，就不再访问 server 了，因此抓包也看不到任何请求。它的流程应该是这样的:

[![](http://alloyteam.com/wp-content/uploads/2012/01/app-cache2.png "app-cache2")](http://alloyteam.com/wp-content/uploads/2012/01/app-cache2.png)

App cache 2

于是我本地搭了一个 apache 验证，把 js 的 max-age 设置为 30 秒，果然在 30 秒内，无论怎么修改 manifest 和 js, 都不会有对 js 的新请求，它一直在向 browser cache 拉取，而 30 秒之后，就能去 server 拉去新的 js 了.

## 三、谁是真凶？

理论上这件事就应该到此为止了，只要把正式环境的 cdn 都去掉 cache-control 就大功告成啦。但是，去掉 cache-control 将大大浪费公司的带宽！而且 deewii 童鞋发现，有一台放置 vm (应用用到的一个接口层，是一个页面) 的机器，也设置了 cache-control, 但是却能正常更新，这下又变得扑朔迷离了.

刚才我们对比响应头发现了三个不同，继续看 connection 这东西，keep-alive 是用来保持长连接的，莫非是它的影响？但是抓了几个包，却发现 vm 所在机器返回的响应头里面是 Connection: keep-alive, 因此排除了这个影响.

最后只能把希望放在 Vary: Accept-Encoding 里面了，还是刚刚搭 apache, 加上 max-age=10368000, 加上 keep-alive, 加上 Vary: Accept-Encoding, 修改 manifest, 刷新… 天，竟然发起更新请求了！原来你 (Accept-Encoding) 才是真正的凶手！有没有可能是本地才会这样呢，继续用 fiddler 卡住正式环境的响应，加上 Vary: Accept-Encoding, 果然刷新之后也能正常更新了.

虽然找到原因，但是本人对这个 Accept-Encoding 不是很了解，查了些资料 (参考这里: <http://www.falconhan.com/webanalytics/vary-accept-encoding-header.htm> ), 猜测 Accept-Encoding 是用来告诉浏览器只缓存它自己声明的类型 (在发起的 http 请求头里面指定，例如: Accept-Encoding: gzip,deflate,sdch) 的文件，而存在于 browser cache 里面的内容则是浏览器解压后的，因此 app cache 去 browser cache 更新的时候发现格式不对，就抛弃掉，继续去 server 请求。不知道想的对不对，欢迎拍砖指正.

## 四、写在后面

花了一个晚上 + 一个上午，总算把这个无法更新的问题解决了。虽然最后得到的结论很简单，只要在服务器配个返回头就行了，但是找问题的时候相当痛苦。归根到底还是对 http 协议不够了解，学艺不精还得继续努力.

PS: 在用 firefox 测试的时候，发现它只有第一次打开 (或者删掉离线数据之后) 的时候会去请求 manifest 和其他离线资源，之后它竟然完全不访问 manifest, 导致没办法更新，网上也没找到什么好资料 (网上也有遇到相同状况的童鞋: <http://hi.baidu.com/erik168/blog/item/aadff9547720d8013b293559.html> ), 不知道有没有童鞋了解的.

## 参考资料

Offline Application

<http://www.ibm.com/developerworks/cn/web/1011_guozb_html5off/>

<http://www.mhtml5.com/2011/02/583.html>

<http://www.mhtml5.com/resources/html5-js-api-%E6%95%99%E7%A8%8B%EF%BC%88%E5%9B%9B%EF%BC%89-%E7%A6%BB%E7%BA%BF%E5%BA%94%E7%94%A8>

Vary: Accept-Encoding

<http://www.falconhan.com/webanalytics/vary-accept-encoding-header.htm>

<http://hi.baidu.com/%B9%E3%D6%DD_it%C4%D0/blog/item/c2dd76c96d1eb4009c163d2a.html>

<http://mark.koli.ch/2010/09/understanding-the-http-vary-header-and-caching-proxies-squid-etc.html>

Firefox 的 ApplicationCache

<http://hi.baidu.com/erik168/blog/item/aadff9547720d8013b293559.html>


<!-- {% endraw %} - for jekyll -->