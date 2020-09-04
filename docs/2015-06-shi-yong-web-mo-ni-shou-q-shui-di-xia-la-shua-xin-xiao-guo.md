---
title: 使用 web 模拟手 Q 水滴下拉刷新效果
date: 2015-06-30
author: TAT.dorsywang
source_link: http://www.alloyteam.com/2015/06/shi-yong-web-mo-ni-shou-q-shui-di-xia-la-shua-xin-xiao-guo/
---

<!-- {% raw %} - for jekyll -->

兴趣部落页面中，为了加强下拉刷新的体验效果，我们用 web 模拟了 ios 下手 Q 下拉刷新时的水滴效果，实现效果如下。  

[![2](http://alloyteam.github.io/AlloyImage/demos/source/pull.gif)](http://alloyteam.github.io/AlloyImage/demos/source/pull.gif)

页面开发已经很久，今天写这篇来总结一下吧。

**实现原理**

这里分为几个部分

实现的关键在于水滴的绘制部分，考虑到尺寸特别小，这里我们使用 canvas 来进行绘制

**为什么是 canvas**

首先用 CSS3 来做的话会非常麻烦，很多东西不能直接控制，并且涉及到动画，所以基本不用考虑，SVG 的话也是不错的选择，就是控制也不是很方便，Canvas 就性能和控制性上都比较高，所以最终选择了 Canvas 来做关键帧的绘制。

**水滴的绘制**

如果仔细观查水滴是由三部分组成，两个半圆加中间连接线，如果两个半圆的端点用直线连起来的话，看起来过渡会很生硬，如下所示

所以我们要选择一个好一点的曲线来连接两个半圆。但实际上，水滴的绘制可以是完全用贝塞尔曲线绘制的

鉴于 canvas 使用三次贝塞尔曲线绘制比较复杂一点（其实也还好，三次贝塞尔曲线要求两个控制点，控制点选择坚直就好了，具体没有尝试，这可能是一个优化点），所以考虑用二次的贝塞尔曲线来连接两个半圆，所以问题变成是如何选择二次贝塞尔曲线的控制点

**二次贝塞尔曲线**

二次贝塞尔曲线的 canvas Api 大家可以在网上搜到

JavaScript 语法：

    context.quadraticCurveTo(cpx,cpy,x,y);

[![canvas](http://alloyteam.github.io/AlloyImage/demos/source/canvas.png)](http://alloyteam.github.io/AlloyImage/demos/source/canvas.png)

下面有一个动画图更能反映这个曲线的绘制过程

[![1426130734_8_w474_h593](http://alloyteam.github.io/AlloyImage/demos/source/1426130734_8_w474_h593.gif)](http://alloyteam.github.io/AlloyImage/demos/source/1426130734_8_w474_h593.gif)

控制点的选择其实也有很多种，这里我选用了两个连接点连线的垂直平分线上的点，如下图所示，两条蓝线是两条连线的垂直平分线，在这上面的点，会使弧线过渡很均匀

[![1426065675_6_w990_h876](http://alloyteam.github.io/AlloyImage/demos/source/1426065675_6_w990_h876.jpg)](http://alloyteam.github.io/AlloyImage/demos/source/1426065675_6_w990_h876.jpg)

这样做出来，在图像很小的情况下也很漂亮，只是连接点的不是连续的（左导！= 右导），但还可以接受。

所以按这种方法绘制水滴，用 canvas 这样绘制

```go
ctx.beginPath();
 
// 画顶圆
ctx.arc(topRound[0], topRound[1], topR, - Math.PI, 0);
 
// 计算控制点
// 先计算垂分线
// 找出垂分线上 向水滴里面的 一点做控制点
 
// 使用控制点画贝塞尔曲线到 底部圆连接点
ctx.quadraticCurveTo(point[0], point[1], bottomRound[0] + bottomR, bottomRound[1]);
 
// ...另一侧也是这样画
 
// 闭合
ctx.closePath();
 
// 填充
ctx.fill();
 
//画边
ctx.stroke();
```

其中可能要计算垂直平分线，计算的原理比较简单，先计算出两个连接点 p0, p1 的斜率 k，然后，计算出两点的中点 pm，垂分线方程就是 y - ypm\\=-1/k \* (x - xpm), 然后再取靠中点向里一点的值 x, 计算 y 就可以了，这样控制点坐标就计算出来了

这里要特别说明的是，对于高清屏，canvas 的绘制要用两倍宽高去绘，用 css 把 canvas 缩放回来

其他的一些参数如下

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
     
    // 为高清屏缩放
    canvas.style.width = ~~ (WIDTH / 2) + "px";
    canvas.style.height = ~~ (HEIGHT / 2) + "px";
     
    // 画笔和填充颜色的配置
    ctx.fillStyle = "#b1b1b1";
    ctx.strokeStyle = "rgb(118,113,108)";
     


<!-- {% endraw %} - for jekyll -->