---
title: 使用 HTML5 跨域共享特性解决 AJAX 跨域数据同步问题
date: 2012-11-05
author: TAT.yukin
source_link: http://www.alloyteam.com/2012/11/html5-cors/
---

<!-- {% raw %} - for jekyll -->

HTML 5 以前的标准由于考虑到浏览器安全问题并不允许直接跨域通信，于是为了达到跨域通信的目的各种蛋疼的解决办法出现了，常用的有：jsonp、使用代理文件、地址栏 hash 等等，这些办法的出现在达到解决跨域问题的同时，也增加了前端页面的性能开销和维护成本。HTML5 新的标准中，增加了” Cross-Origin Resource Sharing” 特性，这个特性的出现使得跨域通信只需通过配置 http 协议头来即可解决。

Cross-Origin Resource Sharing 详细解释见：  
<http://dvcs.w3.org/hg/cors/raw-file/tip/Overview.html>

Cross-Origin Resource Sharing 实现的最重要的一点就是对参数” Access-Control-Allow-Origin” 的配置，即通过 次参数检查该跨域请求是否可以被通过。  
如：Access-Control-Allow-Origin:[http://a.com](http://a.com/) 表示允许 a.com 下的域名跨域访问；  
Access-Control-Allow-Origin:\*表示允许所有的域名跨域访问。

[![](http://www.imyukin.com/wp-content/uploads/2012/11/xhr2.png "xhr2")](http://www.imyukin.com/wp-content/uploads/2012/11/xhr2.png)

[![](http://www.imyukin.com/wp-content/uploads/2012/11/header.png "header")](http://www.imyukin.com/wp-content/uploads/2012/11/header.png)  
如果需要读取读取 cookie：  
需要配置参数：Access-Control-Allow-Credentials:true  
同时在 xhr 发起请求的时候设置参数 withCredentials 为 true：  
var xhr = new XMLHttpRequest();  
xhr.open();  
xhr.withCredentials = true; // 这个放在 xhr.open 后面执行，否则有些浏览器部分版本会异常，导致设置无效。

示例代码：  
php:

```css
header('Access-Control-Allow-Origin:http: //a.com');
header('Access-Control-Allow-Methods:POST,GET');
header('Access-Control-Allow-Credentials:true'); 
echo 'Cross-domain Ajax';
```

JS:

```javascript
var xhr = new XMLHttpRequest();
xhr.open("GET", "http: //b.com/cros/ajax.php", true);
xhr.withCredentials = true;
xhr.onload = function () {
    alert(xhr.response); //reposHTML;
};
xhr.onerror = function () {
    alert("error making the request.");
};
xhr.send();
```


<!-- {% endraw %} - for jekyll -->