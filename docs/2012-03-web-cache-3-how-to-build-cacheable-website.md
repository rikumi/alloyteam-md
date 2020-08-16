---
title: 【Web 缓存机制系列】3 – 如何构建可缓存站点
date: 2012-03-22
author: TAT.Rehorn
source_link: http://www.alloyteam.com/2012/03/web-cache-3-how-to-build-cacheable-website/
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

前面了解了 Web 缓存的运行机制极其重要性之后，我们可以从以下这些方面去努力改善我们的站点，保证缓存被最有效的利用，达到最佳的性能。

## 同一个资源保证 URL 的稳定性

URL 是浏览器缓存机制的基础，所以如果一个资源需要在多个地方被引用，尽量保证 URL 是固定的。同时，比较推荐使用公共类库，比如 [Google Ajax Library](http://code.google.com/apis/libraries/ "Google Ajax Lab") 等，有利于最大限度使用缓存

## 给 Css、js、图片等资源增加 HTTP 缓存头，并强制入口 Html 不被缓存

对于不经常修改的静态资源，比如 Css，js，图片等，可以设置一个较长的过期的时间，或者至少加上 Last-Modified/Etag，而对于 html 页面这种入口文件，不建议设置缓存。这样既能保证在静态资源不变了情况下，可以不重发请求或直接通过 304 避免重复下载，又能保证在资源有更新的，只要通过给资源增加时间戳或者更换路径，就能让用户访问最新的资源  

## 减少对 Cookie 的依赖

过多的使用 Cookie 会大大增加 HTTP 请求的负担，每次 GET 或 POST 请求，都会把 Cookie 都带上，增加网络传输流量，导致增长交互时间；同时 Cache 是很难被缓存的，应该尽量少使用，或者这在动态页面上使用。

## 减少对 HTTPS 加密协议的使用

通过 HTTPS 请求的资源，默认是不会被缓存的，必须通过特殊的配置，才能让资源得到缓存。建议只对涉及敏感信息的请求使用 HTTPS 传输，其他类似 Css，Js，图片这些静态资源，尽量避免使用。

## 多用 Get 方式请求动态 Cgi

虽然 POST 的请求方式比 Get 更安全，可以避免类似密码这种敏感信息在网络传输，被代理或其他人截获，但是 Get 请求方式更快，效率更高，而且能被缓存，建议对于那些不涉及敏感信息提交的请求尽量使用 Get 方式请求

## 动态 CGI 也是可以被缓存

如果动态脚本或 CGI 输入的内容在一定的时间范围内是固定的，或者根据 GET 参数相同，输入的内容相同，我们也认为请求是可以被缓存的，有以下几种方式，可以达到这个效果：

1.  让动态脚本定期将内容改变时导出成静态文件，Web 直接访问带有 Last-Modified/Etag 的静态文件
2.  开发者可以通过代码给动态脚本的响应头中添加 Cache-Control: max-age，告诉浏览器在过期前可以直接使用副本
3.  通过代码给动态脚本的响应头添加 Last-Modified/Etag 信息，浏览器再次请求的时候，可以通过解析 If-Modified-Since/If-None-Match 得知浏览器是否存在缓存，由代码逻辑控制是否返回 304

## 如何给站点增加缓存机制

HTTP 请求 / 响应头中缓存报头对有效利用站点缓存，作为一个 Web 前端开发者，我要做什么呢？答案是：啥都不用做。不过要去推动 Web 运营人员、Web 后端开发人员分别给服务器和动态脚本 CGI 增加合适的缓存报头。

### 服务器配置

Apache 相关配置参考：[mod_headers](http://httpd.apache.org/docs/2.0/mod/mod_expires.html)、[mod_headers](http://httpd.apache.org/docs/2.0/mod/mod_headers.html)

### 编写可缓存的动态脚本

服务器配置的方法比较简单通用，但是如果遇到没有权限修改服务器配置或者需要添加更细致的 Expires/Cache-Control/Etag 等信息时，不妨可以试试从代码层面去添加这些信息。不同语言写法实现略有不同，但思路都是一致的。可以在单独开辟一个独立模块，调用语言库提供的添加报头的接口，根据需要设置报头信息。当某个请求的动态脚本需要被缓存时，可以采用类似 include，require 等模块引用方式调用公共模块，实现缓存机制。

_Php\_\_实现代码实例如下：_

_Cache.php_

_&lt;?php_  
_Header(“Cache-Control: must-revalidate”);_

_$offset = 60 \* 60 \* 24 \* 3;_  
_$ExpStr = “Expires: ” . gmdate(“D, d M Y H:i:s”, time() + $offset) . ” GMT”;_  
_Header($ExpStr);_  
_?>_

_&lt;?php_

_Require(Cache.php)_

_// business code here_

_// todo_

_?>_

<!-- {% endraw %} - for jekyll -->