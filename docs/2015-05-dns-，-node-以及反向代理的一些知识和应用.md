---
title: DNS，node 以及反向代理的一些知识和应用
date: 2015-05-07
author: TAT.moonye
source_link: http://www.alloyteam.com/2015/05/dns%ef%bc%8cnode%e4%bb%a5%e5%8f%8a%e5%8f%8d%e5%90%91%e4%bb%a3%e7%90%86%e7%9a%84%e4%b8%80%e4%ba%9b%e7%9f%a5%e8%af%86%e5%92%8c%e5%ba%94%e7%94%a8/
---

<!-- {% raw %} - for jekyll -->

## 概念

域名系统（英文：Domain Name System，缩写：DNS）是因特网的一项服务。它作为将域名和 IP 地址相互映射的一个分布式数据库，能够使人更方便的访问互联网。DNS 使用 TCP 和 UDP 端口 53。当前，对于每一级域名长度的限制是 63 个字符，域名总长度则不能超过 253 个字符。  
正向解析：从域名到 ip 的转换  
反向解析：从 ip 到域名的转换

-   根域  
    就是一个 "."， 就是我们的网址，比如 [www.example.com](http://www.example.com/)，实际是 "[www.example.com](http://www.example.com/).", 最后是有一个点的。当然一般是被我们忽略了的。  
    全球共有 504 个根域服务器，分为 13 组。
-   域的划分  
    一种是按性质划分，如 org.,edu. 等，另一中是按国家划分，如 cn.,jp. 等  
    每个域都有自己的域名服务器，也叫做权威服务器。  
    如 [example.com](http://example.com/) 就是顶级域名，而 [www.example.com](http://www.example.com/) 就表示 [example.com](http://example.com/) 域下面的一个 www 主机。当然也有网站直接将顶级域名映射到 www 这个主机上的，这样就可以直接通过顶级域名来访问主机。

## 解析步骤

1、在浏览器中输入 [www.example.com](http://www.example.com/) 域名，操作系统会先检查自己本地的 hosts 文件是否有这个网址映射关系，如果有，就先调用这个 IP 地址映射，完成域名解析。  
2、如果 hosts 里没有这个域名的映射，则查找本地 DNS 解析器缓存，是否有这个网址映射关系，如果有，直接返回，完成域名解析。  
3、如果 hosts 与本地 DNS 解析器缓存都没有相应的网址映射关系，首先会找 TCP/ip 参数中设置的首选 DNS 服务器，在此我们叫它本地 DNS 服务器，此服务器收到查询时，如果要查询的域名，包含在本地配置区域资源中，则返回解析结果给客户机，完成域名解析，此解析具有权威性。  
4、如果要查询的域名，不由本地 DNS 服务器区域解析，但该服务器已缓存了此网址映射关系，则调用这个 IP 地址映射，完成域名解析，此解析不具有权威性。  
5、如果本地 DNS 服务器本地区域文件与缓存解析都失效，则根据本地 DNS 服务器的设置（是否设置转发器）进行查询，如果未用转发模式，本地 DNS 就把请求发至 13 组根 DNS，根 DNS 服务器收到请求后会判断这个域名 (.com) 是谁来授权管理，并会返回一个负责该顶级域名服务器的一个 IP。本地 DNS 服务器收到 IP 信息后，将会联系负责.com 域的这台服务器。这台负责.com 域的服务器收到请求后，如果自己无法解析，它就会找一个管理.com 域的下一级 DNS 服务器地址 ([example.com](http://example.com)) 给本地 DNS 服务器。当本地 DNS 服务器收到这个地址后，就会找 [example.com](http://example.com/) 域服务器，重复上面的动作，进行查询，直至找到 [www.example.com](http://www.example.com/) 主机。  
6、如果用的是转发模式，此 DNS 服务器就会把请求转发至上一级 DNS 服务器，由上一级服务器进行解析，上一级服务器如果不能解析，或找根 DNS 或把转请求转至上上级，以此循环。不管是本地 DNS 服务器用是是转发，还是根提示，最后都是把结果返回给本地 DNS 服务器，由此 DNS 服务器再返回给客户机。

## node 框架

npm 上有一个 dns 的框架，可以做域名解析

-   安装


    npm install -g dns 
     

-   正向解析

```html
<span class="keyword">var</span> dns = <span class="keyword">require</span>(<span class="string">'dns'</span>);
dns.lookup(<span class="string">'www.google.com'</span>, <span class="keyword">function</span> onLookup(err, addresses, family) {
  console.log(<span class="string">'addresses:'</span>, addresses);
});
 
```

-   反向解析

```html
<span class="keyword">var</span> dns = <span class="keyword">require</span>(<span class="string">'dns'</span>);
 
dns.resolve4(<span class="string">'www.google.com'</span>, <span class="keyword">function</span> (err, addresses) {
  <span class="keyword">if</span> (err) <span class="keyword">throw</span> err;
 
  console.log(<span class="string">'addresses: '</span> + JSON.stringify(addresses));
 
  addresses.<span class="keyword">forEach</span>(<span class="keyword">function</span> (a) {
    dns.reverse(a, <span class="keyword">function</span> (err, hostnames) {
      <span class="keyword">if</span> (err) {
        <span class="keyword">throw</span> err;
      }
 
      console.log(<span class="string">'reverse for '</span> + a + <span class="string">': '</span> + JSON.stringify(hostnames));
    });
  });
});
 
```

> 更多 API，[这里](https://nodejs.org/api/dns.html)

## 实战

> 一个反向代理的小实践

实现一个本地的服务，对于普通文件则直接取本地文件，对于请求则转发到服务器上，可配置希望转发的具体 ip。  
代码会上传到 github 上。


<!-- {% endraw %} - for jekyll -->