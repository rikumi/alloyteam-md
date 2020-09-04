---
title: 前端相关数据监控
date: 2014-03-04
author: TAT.Perlt
source_link: http://www.alloyteam.com/2014/03/front-end-data-monitoring/
---

<!-- {% raw %} - for jekyll -->

项目开发完成外发后，没有一个监控系统，我们很难了解到发布出去的代码在用户机器上执行是否正确，所以需要建立前端代码性能相关的监控系统。

所以我们需要做以下的一些模块：

一、收集脚本执行错误

```javascript
function error(msg, url, line) {
    var REPORT_URL = "xxxx/cgi"; // 收集上报数据的信息
    var m = [msg, url, line, navigator.userAgent, +new Date()]; // 收集错误信息，发生错误的脚本文件网络地址，用户代理信息，时间
    var url = REPORT_URL + m.join("||"); // 组装错误上报信息内容URL
    var img = new Image();
    img.onload = img.onerror = function () {
        img = null;
    };
    img.src = url; // 发送数据到后台cgi
}
// 监听错误上报
window.onerror = function (msg, url, line) {
    error(msg, url, line);
};
```

通过管理后台系统，我们可以看到页面上每次错误的信息，通过这些信息我们可以很快定位并且解决问题。

二、收集 html5 performance 信息

performance 包含页面加载到执行完成的整个生命周期中不同执行步骤的执行时间。performance 相关文章点击如下：[使用 performance API 监测页面性能](http://www.alloyteam.com/2012/11/performance-api-monitoring-page-performance/)

计算不同步骤时间相对于 navigationStart 的时间差，可以通过相应后台 CGI 收集。

```javascript
function _performance(){
   var REPORT_URL = "xxxx/cgi?perf=";
   var perf = (window.webkitPerformance ? window.webkitPerformance : window.msPerformance ),
      points = ['navigationStart','unloadEventStart','unloadEventEnd','redirectStart','redirectEnd','fetchStart','domainLookupStart','connectStart','requestStart','responseStart','responseEnd','domLoading','domInteractive','domContentLoadedEventEnd','domComplete','loadEventStart','loadEventEnd'];
   var
```


<!-- {% endraw %} - for jekyll -->