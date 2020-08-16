---
title: 使用 web 模拟手 Q 水滴下拉刷新效果
date: 2015-06-30
author: TAT.dorsywang
source_link: http://www.alloyteam.com/2015/06/shi-yong-web-mo-ni-shou-q-shui-di-xia-la-shua-xin-xiao-guo/
---

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
     
    // 为了让效果更好 设置上角的一点点高光
    ctx.shadowColor = "#ccc";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 1;
     
    // 画笔宽度为1
    ctx.lineWidth = 1;

画出来在手机上的效果如下  
[![1426128335_58_w671_h581](http://alloyteam.github.io/AlloyImage/demos/source/1426128335_58_w671_h581.png)](http://alloyteam.github.io/AlloyImage/demos/source/1426128335_58_w671_h581.png)

左为原生，右为 web 实现

更细节的对比

[![1426128809_32_w592_h882](http://alloyteam.github.io/AlloyImage/demos/source/1426128809_32_w592_h882.png)](http://alloyteam.github.io/AlloyImage/demos/source/1426128809_32_w592_h882.png)

上为原生，下为 web 实

**ICON 贴图**

中间的 ICON 就没有用 canvas 去画在上面，直接是 DOM 覆盖在 canvas 上

**动画的实现**

在 IOS 上，因为弹性滚动，某个 DOM 可以被拉下，其 scrollTop 可以为负值（-），我们就跟据被拉下元素的 scrollTop 的负值的大小，依次绘制出此时的水滴即可。

具体的关系，某个 scrollTop 值 对就一个 -dis，如果 dis

```c
 topR = TOP_R - d * 0.1;
 bottomR = BOTTOM_R - d * 0.3;
```

同时，注意还要跟据这个关系变换那个刷新的 ICON，不过这个就是 DOM 变换了，相对比较简单

     reloadIcon.style.webkitTransform = "scale(" + (topR / TOP_R) + ")";

拉到一定值，水滴消失，出现 loading 菊花，这就是普通的 DOM 操作 **最后的回弹**

注意到，如果仅仅是这样子，在放手那一刻还没来得及出刷新成功的提示，IOS 自动就会让 scrollTop 为负值的 DOM 弹上去了，这还不能满足我们的需要

这就要放手那一刻，迅速给负值的 DOM 元素做 CSS translate 变换，使当前 DOM 保持在被拉下的位置

    // 放手那时
    // 监听touchend即可
    // 不要拉在哪就停在哪 稍微弹回一点 
    $(scrollDom).css("-webkit-transition", "all ease-out 0.5s").css("-webkit-transform", "translateY(" + (currDis - 40) + "px)");

直到刷新成功了，让它弹上去

    // 弹回去吧 （上面代码已设置过transition属性）
    $(scrollDom).css("-webkit-transform", "translateY(" + (0) + "px)");

至此，代码的核心部分已经完成了，然后再做一些接口的封装就算彻底完工了。

**关于 Android**

Android 鉴于无法拉下负的 scrollTop，而且 Android 的下拉样式不是这个样子的，所以这个方案就只用在 ios 上了。