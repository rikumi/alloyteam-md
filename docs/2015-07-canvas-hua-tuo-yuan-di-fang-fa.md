---
title: Canvas 画椭圆的方法
date: 2015-07-26
author: TAT.vorshen
source_link: http://www.alloyteam.com/2015/07/canvas-hua-tuo-yuan-di-fang-fa/
---

<!-- {% raw %} - for jekyll -->

虽然标题是画椭圆，但是我们先来说说 Canvas 中的圆

相信大家对于 Canvas 画圆都不陌生

```c
oGC.arc(400, 300, 100, 0, 2*Math.PI, false);
```

如上所示，直接调用 API 就可以了，但是计算机内部却是使用光栅学，利用 bresenham 算法画圆的，这个我们放到最后来说，先说说利用圆的参数方程画圆

```c
circle(oGC, 400, 300, 100);
function circle(context, x, y, a) { // x,y是坐标;a是半径
    var r = 1/a; // ①注意：此处r可以写死，不过不同情况下写死的值不同
    context.beginPath();
    context.moveTo(x + a, y);
    for(var i = 0; i < 2 * Math.PI; i += r) {
        context.lineTo(x + a * Math.cos(i), y + a * Math.sin(i));
    }
    context.closePath();
    context.fill();
}
```

原理是什么，相信三角函数不错的童鞋理解起来很容易的，如果不知道的话，注意注释①，我变化一下 r 的值，相信就立竿见影了～

![](http://www.alloyteam.com/wp-content/uploads/2015/07/1.png)![](http://www.alloyteam.com/wp-content/uploads/2015/07/2.png)

![](http://www.alloyteam.com/wp-content/uploads/2015/07/3.png)![](http://www.alloyteam.com/wp-content/uploads/2015/07/43.png)

r 和 2\*Math.PI 配合就是圆的精细程度，在半径为 100 的时候，r 取 1/10 就可以了，通用的话可以写死，写成 r = 1 /a；这样无论半径取大或者小，圆都会很精细，但是性能会有很大影响

现在来看看文章的主角，针对圆来看椭圆的

```c
function EllipseOne(context, x, y, a, b) {
    var step = (a > b) ? 1 / a : 1 / b;
    context.beginPath();
    context.moveTo(x + a, y);
    for(var i = 0; i < 2 * Math.PI; i += step) {
        context.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
    }
    context.closePath();
    context.fill();
}
```

和圆基本一样，不过圆只有一个半径，而椭圆分为长轴和短轴了。

看下效果～

![](http://www.alloyteam.com/wp-content/uploads/2015/07/51.png)

好了，画椭圆成功，文章结束～

怎么可能！！

就这样结束也太没品了，刚刚是方法一，下面来看其他的

方法二，均匀压缩法

这是我最喜欢的方法，易理解，相比较方法一，性能也快了很多，先贴代码～

    function EllipseTwo(context


<!-- {% endraw %} - for jekyll -->