---
title: HTML5 Canvas 玩转酷炫大波浪进度图
date: 2016-12-14
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/12/html5-canvas-playing-cool-big-wave-of-progress/
---

<!-- {% raw %} - for jekyll -->

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161213115104620-1393781477.gif)

如上图所见，本文就是要实现上面那种效果。  
由于最近 [AlloyTouch](https://github.com/AlloyTeam/AlloyTouch) 要写一个下拉刷新的酷炫 loading 效果。所以首选大波浪进度图。  
首先要封装一下大波浪图片进度组件。基本的原理是利用 Canvas 绘制矢量图和图片素材合成出波浪特效。

本文的代码你可以在这里 <https://github.com/AlloyTeam/AlloyTouch/blob/master/refresh/wave/image_wave.html> 找到。

了解 quadraticCurveTo  

* * *

quadraticCurveTo () 方法通过使用表示二次贝塞尔曲线的指定控制点，向当前路径添加一个点。

JavaScript 语法：  
context.quadraticCurveTo(cpx,cpy,x,y);  
参数值

-   cpx 贝塞尔控制点的 x 坐标
-   cpy 贝塞尔控制点的 y 坐标
-   x 结束点的 x 坐标
-   y 结束点的 y 坐标

如：

    ctx.moveTo(20,20);
    ctx.quadraticCurveTo(20,100,200,20);
    ctx.stroke();

通过上面代码可以绘制一条二次贝塞尔曲线，具体原理效果看下图：  
![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161213115120636-1871822499.gif)

尝试绘制波浪  

* * *

```javascript
var waveWidth = 300,
    offset = 0,
    waveHeight = 8,
    waveCount = 5,
    startX = -100,
    startY = 208,
    progress = 0,
    progressStep = 1,
    d2 = waveWidth / waveCount,
    d = d2 / 2,
    hd = d / 2,
    c = document.getElementById("myCanvas"),
    ctx = c.getContext("2d");
 
function tick() {
    offset -= 5;
    progress += progressStep;
    if (progress > 220 || progress < 0) progressStep *= -1
```


<!-- {% endraw %} - for jekyll -->