---
title: AlloyTouch 实战–60 行代码搞定 QQ 看点资料卡
date: 2016-12-29
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/12/alloytouch-combat-60-lines-of-code-get-qq-aspect-data-card/
---

<!-- {% raw %} - for jekyll -->

原文链接：<https://github.com/AlloyTeam/AlloyTouch/wiki/kandian>

先验货  

* * *

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161229100016070-1865978262.png)

-   访问 DEMO 你也可以[点击这里](http://alloyteam.github.io/AlloyTouch//refresh/infinite/kandian.html)
-   源代码可以[点击这里](https://github.com/AlloyTeam/AlloyTouch/blob/master/refresh/infinite/kandian.html#L915-L978)

如你体验所见，流程的滚动的同时还能支持头部的动画？不断地加载新数据还能做到流畅的滑动！怎么做得的？使用 AlloyTouch CSS 0.2.0 及以上版本便可！

头部动画  

* * *

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161229100113867-627323058.gif)

加载更多  

* * *

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161229100100961-1863388318.gif)

实现代码  

* * *

```javascript
var infoList = document.getElementById("infoList"),
    mockHTML = infoList.innerHTML,
    scroller = document.getElementById("scroller"),
    header = document.getElementById("header"),
    userLogo = document.getElementById("user-logo-wrapper"),
    loading = false,
    alloyTouch = null;
 
Transform(scroller, true);
Transform(header);
header.originY = -70;
header.translateY = -70;
Transform(userLogo);
 
alloyTouch = new AlloyTouch({
    touch: "#wrapper",
    vertical: true,
    target: scroller,
    property: "translateY",
    maxSpeed: 2,
    outFactor: 0.1,
    min: 160 * -20 + window.innerHeight - 202 - 
```


<!-- {% endraw %} - for jekyll -->