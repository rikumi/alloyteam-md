---
title: HTML5 Canvas 玩转酷炫大波浪进度图
date: 2016-12-14
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/12/html5-canvas-playing-cool-big-wave-of-progress/
---

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
    if (progress > 220 || progress < 0) progressStep *= -1;
    if (-1 * offset === d2) offset = 0;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
    var offsetY = startY - progress;
    ctx.moveTo(startX - offset, offsetY);
    for (var i = 0; i < waveCount; i++) {
        var dx = i * d2;
        var offsetX = dx + startX - offset;
        ctx.quadraticCurveTo(
            offsetX + hd,
            offsetY + waveHeight,
            offsetX + d,
            offsetY
        );
        ctx.quadraticCurveTo(
            offsetX + hd + d,
            offsetY - waveHeight,
            offsetX + d2,
            offsetY
        );
    }
    ctx.lineTo(startX + waveWidth, 300);
    ctx.lineTo(startX, 300);
    ctx.fill();
    requestAnimationFrame(tick);
}
tick();
```

可以看到无限运动的波浪：

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161213115127339-337053178.png)

这里需要主要，绘制的区域要比 Canvas 大来隐藏摇摆校正的图像，上面使用了 200_200 的 Canvas。  
大家把代码 clone 下来可以试试把它绘制到一个大的 Canvas 上就可以明白。  
这里通过 if (-1_ offset === d2) offset = 0; 来实现无限循环。  
d2 就是一个波峰 + 波谷的长度。一个波峰 + 一个波谷之后又开始同样的生命周期和从 0 开始一样，所以可以重置为 0。

了解 globalCompositeOperation  

* * *

globalCompositeOperation 属性说明了绘制到画布上的颜色是如何与画布上已有的颜色组合起来的。

绘制大波浪进度图会用到：

    ctx.globalCompositeOperation = "destination-atop";

destination-atop 意义：画布上已有的内容只会在它和新图形重叠的地方保留。新图形绘制于内容之后。

当然，globalCompositeOperation 还有很多选项，这里不一一列举，大家可以试试设置其他的属性来调整出很酷炫的叠加特效。

整体实现  

* * *

```javascript
var img = new Image();
function tick() {
    ...
    ...
    ctx.fill();
    ctx.globalCompositeOperation = "destination-atop";
    ctx.drawImage(img, 0, 0);
    requestAnimationFrame(tick);
}
 
img.onload = function () {
    tick();
};
 
img.src = "asset/alloy.png";
```

为了代码简单直接，这里免去了封装一个加载器的代码，直接通过 new Image 来设置 src 来加载图片。  
在绘制完矢量图之后，设置 globalCompositeOperation，然后再绘制企鹅图片，绘制顺序不能搞错。

最后  

* * *

更多例子演示和代码可以在 Github 上找到。  
Github：<https://github.com/AlloyTeam/AlloyTouch>  
未完待续预告：《AlloyTouch 大波浪刷新》  
