---
title: 慎用 DataImageURL 给 DOM 赋值
date: 2013-12-02
author: TAT.Minren
source_link: http://www.alloyteam.com/2013/12/dom-assigned-to-caution-dataimageurl/
---

<!-- {% raw %} - for jekyll -->

最近在更新 [JX.Animate](http://alloyteam.github.io/jxanimate/) 的 Demo，我想让首页的美女图动起来。用的是 Canvas 实现的，过几天大家就可以看到一边移动一边缩放的效果了。

在切换图片的时候，过场动画是用 m×n 个 div 的 CSS3 动画实现的。此时 div 上显示的图片必须要和 Canvas 大图上的一致。

之前是用图片 url 设置 div 背景的方式实现的。于是很自然的想到可以通过 Canvas.toDataURL () 获得一个 DataImageURL，然后沿用原来的逻辑就行了。

现实永远是骨感的。

DataImageURL 字符串必然是一个巨长无比的字符串，用这么长的字符串进行 m×n 次的 DOM 操作，结果就是一场灾难。

大约界面卡 3 秒才能完成全部 div 的背景更新，这还是在 PC 上，手机上肯定更杯具。

现在试试用 m×n 个 canvas 代替 div，用 Canvas 之间的图像复制替代 DataImageURL 试试看。

后续和大家汇报最新进展。


<!-- {% endraw %} - for jekyll -->