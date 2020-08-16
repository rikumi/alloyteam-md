---
title: 和 transformjs 一起摇摆
date: 2016-12-01
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/12/and-transformjs-rock/
---

<!-- {% raw %} - for jekyll -->

写在前面  

* * *

记得以前 facebook 做过一款 HTML5 游戏。开场动画是一块软体类似豆腐的东西一起摇摆。类似的效果如下面的 gif 所示：  
![](http://images2015.cnblogs.com/blog/105416/201611/105416-20161128130600349-445032634.gif)

facebook 当时使用的是 createjs 下的子项目 easeljs 和 tweenjs 去制作，基于 Canvas 的动画。基本的原理主要是：循环运动 Canvas 抽象的 DisplayObject 的 skewX 和 scaleY 来实现软体摇摆。  
目前来看 transformjs 也能做到，因为 transformjs 也能运动 skewX 和 scaleY。先来看看 facebook 的方式。

tweenjs + transformjs  

* * *

注意这里的 tweenjs 是 createjs 下的子项目，而不是 github 上的 tween.js 项目。

```javascript
var element = document.querySelector("#test");
Transform(element);
element.originY = 100;
element.skewX = -20;
var Tween = createjs.Tween,
    sineInOutEase = createjs.Ease.sineInOut;
Tween.get(element, { loop: true })
    .to({ scaleY: 0.8 }, 450, sineInOutEase)
    .to({ scaleY: 1 }, 450, sineInOutEase);
Tween.get(element, { loop: true })
    .to({ skewX: 20 }, 900, sineInOutEase)
    .to({ skewX: -20 }, 900, sineInOutEase);
```

在线演示地址： <http://alloyteam.github.io/AlloyTouch/transformjs/example/soft2.html>  
上面的代码很精简。这里稍微解释下：

-   元素的初始 skewX 是 - 20，为了和 scale 的步调一致
-   元素的 originY 是 100，为的以企鹅的 bottom center 为基准点

可以看到，由于 transformjs 高度抽象，可以和 tweenjs 轻松搭配使用，没有任何压力。

AlloyFlow + transformjs  

* * *

可能上面的代码不是很明白具体实现的流程？说实话，第一次看到上面的代码也没有一下看清晰流程。那么就使用 AlloyFlow 分解工作流的方式去实现同样的效果。

```javascript
var element = document.querySelector("#test");
Transform(element);
element.originY = 100;
element.skewX = -20;
function sineInOut(a) {
    return 0.5 * (1 - Math.cos(Math.PI * a));
}
var alloyFlow = new AlloyFlow({
    workflow: [
        {
            work: function () {
                To.go(element, "scaleY", 0.8, 450, sineInOut);
                To.go(element, "skewX", 20, 900, sineInOut);
            },
            start: 0,
        },
        {
            work: function () {
                To.go(element, "scaleY", 1, 450, sineInOut);
            },
            start: 450,
        },
        {
            work: function () {
                To.go(element, "scaleY", 0.8, 450, sineInOut);
                To.go(element, "skewX", -20, 900, sineInOut);
            },
            start: 900,
        },
        {
            work: function () {
                To.go(element, "scaleY", 1, 450, sineInOut);
            },
            start: 1350,
        },
        {
            work: function () {
                this.start();
            },
            start: 1800,
        },
    ],
}).start();
```

在线演示地址： <http://alloyteam.github.io/AlloyTouch/transformjs/example/soft.html>  
可以看到上面的 workflow 里面有一堆 work 按照 start 的时间依次序执行，最后在 1800ms 的时候调用 this.start () 会回到起点重新开始运行。还需要解释一下为什么选择 sineInOut 的 easing。可以来看看其缓动图像：

![](http://images2015.cnblogs.com/blog/105416/201611/105416-20161128130608365-1908586169.png)

sineInOut 速率是先慢后快再慢，刚好符合软体自身约束作用力的模拟。  
那么，AlloyFlow 是何方神器？且听下回单独开篇分解。

开始 transformjs 之旅  

* * *

有很多童鞋问，transformjs 还能做什么酷炫特效？怎么在官网看到的都是简单的效果？  
其实 transformjs 他只是提供了基础的 transformation 能力，不与时间、和运动库耦合。可以和任意时间运动库配合使用。所以怎么酷炫完全靠大家创意和想象力，搭配 transformjs 使用就对了。  
transformjs 会计算出 matrix3d 赋给 dom 的 transform msTransform OTransform MozTransform webkitTransform，保证硬件加速和兼容性的同时，不丢失可编程性，点个赞....

主页：<http://alloyteam.github.io/AlloyTouch/transformjs/>  
Github ：<https://github.com/AlloyTeam/AlloyTouch/tree/master/transformjs>  



<!-- {% endraw %} - for jekyll -->