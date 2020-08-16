---
title: web 里计算 FPS [译]
date: 2015-10-23
author: TAT.dnt
source_link: http://www.alloyteam.com/2015/10/web-computing-fpstranslation/
---

帧率（FPS）用于描述成像装置产生连续图像的频率 动画其实就是显示连续帧产生的错觉。如果 FPS 太低，动画将不平滑，甚至人眼都能看到每一帧图像。 一般运动图像的帧率为 24 FPS, 电视使用 30 FPS。在现代游戏中，玩家必须在视觉跟踪动画对象 ，并迅速作出反应，帧速率一般是每秒 30 帧和 60 帧之间。然而，快速移动的物体，可能需要更高的帧速率 ，以避免不希望的视觉假象（闪现）。虽然从理论上讲，我们可以达到极高的帧速率，在 FPS 由显示器的刷新速率的限制 。现代的液晶电视能 120 FPS，甚至 240 FPS。在手机，显示器是最有可能限制为 60 FPS。

图 1：1 秒内不同动画帧速率比较

![usage](https://www.codeaurora.org/sites/default/files/uploads/Onesecondframe.jpg)

HTML5 提供的 Web 开发人员提供了新的工具来创建动态和交互式内容，如动画和游戏。 帧速率仍作为开发人员的重要指标，fps 太低会带来差劲的用户体验。所以开发人员希望有可靠的方式来计算 HTML5 页面的 FPS。 但是问题是，没有办法得到可靠的 FPS。 Web 开发人员通常通过每次 loop 和上次 loop 的间隔来时间 time，再通过 1000/time 来算 fps。 微软发布了许多 HTML5 性能基准测试。如 FishIE 演示，该演示主要是能够计算 Canvas 中图像的 fps。 。Facebook 的 JSGamebench 主要是计算使用 WebGL 中展示大量动画的 fps。 但是他们没有办法知道浏览器整个网页（整个网页可能包含 dom、canvas、webgl、svg..）的 FPS。 那么通过 JavaScript 能否计算出整个网页的 fps？

JavaScript 的动画  

* * *

制作动画效果，可以使用的 setInterval /setTimeout 和 requestAnimationFrame。 后者用于制作动画的首选方法。它将告知浏览器你马上要开始动画效果了，浏览器会在下次 repaint 前调用特定的方法来更新动画以达到优化的结果。

了解定时器在 JavaScript 中是如何工作是很重要的。 定时器延迟是没法保证的，不准确的，因为所有的 JavaScript 在单个线程中执行，只有当前面队列执行完毕且轮到了自己才能被执行。 如下图： ![usage](https://www.codeaurora.org/sites/default/files/uploads/Timers.png)

如上图所以，不仅时间不够精确，而且由于排队，导致 setInterval 的一次回调被延迟到了下一轮回调，为了避免同一时间执行多次 setInterval 的回调， 上次次的将被浏览器放弃执行。

FishIE  

* * *

所以从上面可以知道，使用 setInterval (function (){},16.7) 是有可能达不到 60fps，是什么导致了回调的延迟？

-   画布的大小
-   鱼的数量的位置计算
-   鱼的大小
-   平移，缩放，转换的计算
-   背景（鱼缸）
-   ...

结论  

* * *

因为浏览器还没有提供通过 JavaScript 测量真正的 FPS 一种标准的方法， Web benchmarks 测试出来的 FPS 本质上是不可信的（它可以测试 SVG、Canvas、WebGL 等渲染的 FPS, 而没法测试整个网页）。 Mozilla 已经提供了一个方法来解决这个问题：mozPaintCount 变量；返回的次数文档已 paint 到屏幕的数目。理想情况下，我们会希望这个有待规范 ，使所有的现代浏览器将提供衡量 FPS 的标准接口。随着富媒体网站越来越多，保持 FPS 稳定的是很重要的事情， 在流畅的 30 帧运行的动画比跳动的 50 FPS 受欢迎得多。在 webkit 系列的浏览器中，解决这个问题的办法是公开一个 webkitPaintCount 变量。 我们可以通过 webkitPaintCount 的变化得到真正意义上的 FPS.

参考

-   Measuring FPS (<http://weblogs.mozillazine.org/roc/archives/2010/11/measuring_fps.html>)
-   How JavaScript Timers Work (<http://ejohn.org/blog/how-javascript-timers-work>)
-   Animating with javascript: from setInterval to requestAnimationFrame (<http://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/>)
-   JSGamebench
-   FishIE Tank (<http://ie.microsoft.com/testdrive/performance/fishietank/>)
-   Vellamo Mobile Web Benchmark (<https://market.android.com/details?id=com.quicinc.vellamo>)

英文原文： <https://www.codeaurora.org/blogs/mbapst/measuring-fps-web>