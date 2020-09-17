---
title: 初探 performance – 监控网页与程序性能
date: 2015-09-03
author: TAT.felix
source_link: http://www.alloyteam.com/2015/09/explore-performance/
---

<!-- {% raw %} - for jekyll -->

使用 window.performance 提供了一组精确的数据，经过简单的计算就能得出一些网页性能数据。  

========================================================

配合上报一些客户端浏览器的设备类型等数据，就可以实现简单的统计啦！

额，先看下兼容性如何：<http://caniuse.com/#feat=nav-timing>

这篇文章中 Demo 的运行环境为最新的 Chrome 的控制台，如果你用的是其他浏览器，自查兼容性哈～

先来看看在 Chrome 浏览器控制台中执行 window.performance  会出现什么：

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2015/09/072454pGM.jpg)

简单解释下 performance 中的属性：  

==========================

先看下一个请求发出的整个过程中，各种环节的时间顺序：

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2015/09/072455NuJ.png)

```javascript
// 获取 performance 数据
var performance = {  
    // memory 是非标准属性，只在 Chrome 有
    // 财富问题：我有多少内存
    memory: {
        usedJSHeapSize:  16100000, // JS 对象（包括V8引擎内部对象）占用的内存，一定小于 totalJSHeapSize
        totalJSHeapSize: 35100000, // 可使用的内存
        jsHeapSizeLimit: 793000000 // 内存大小限制
    },
 
    //  哲学问题：我从哪里来？
    navigation: {
        redirectCount: 0, // 如果有重定向的话，页面通过几次重定向跳转而来
        type: 0           // 0   即 TYPE_NAVIGATENEXT 正常进入的页面（非刷新、非重定向等）
                          // 1   即 TYPE_RELOAD       通过 window.location.reload() 刷新的页面
                          // 2   即 TYPE_BACK_FORWARD 通过浏览器的前进后退按钮进入的页面（历史记录）
                          // 255 即 TYPE_UNDEFINED    非以上方式进入的页面
    },
 
    timing: {
        // 在同一个浏览器上下文中，前一个网页（与当前页面不一定同域）unload 的时间戳，如果无前一个网页 unload ，则与 fetchStart 值相等
        navigationStart: 1441112691935,
 
        
```


<!-- {% endraw %} - for jekyll -->