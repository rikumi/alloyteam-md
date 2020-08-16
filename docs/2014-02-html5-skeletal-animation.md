---
title: AlloyStick—— 专为 HTML5 开发的开源骨骼动画引擎
date: 2014-02-21
author: TAT.bizai
source_link: http://www.alloyteam.com/2014/02/html5-skeletal-animation/
---

<!-- {% raw %} - for jekyll -->

[![allotstick_head2](http://www.alloyteam.com/wp-content/uploads/2014/02/allotstick_head2.jpg)](http://www.alloyteam.com/wp-content/uploads/2014/02/allotstick_head2.jpg)

What's AlloyStick

AlloyStick 是一款专为 HTML5 开发的 2D 骨骼动画引擎。可以用于 HTML5 动画开发、HTML5 游戏开发。AlloyStick 主要由骨骼动画引擎和骨骼动画编辑器两部分组成。骨骼动画编辑器提供强大的骨骼动画编辑功能，拖拽骨骼组合角色，通过设置动画关键帧，输出动画数据。js 动画库根据输出数据，依靠强大的自动补间和骨骼关系，就可以制作出逼真、生动的 Canvas 骨骼动画，可以畅快的运行在 PC、手机、平板等设备里。

**AlloyStick 官网**：[http://alloyteam.github.io/AlloyStick/](http://alloyteam.github.io/AlloyStick/ "http&#x3A;//alloyteam.github.io/AlloyStick/   ") 

Why is Skeleton animation ?

　骨骼动画将动画对象抽象出拆分成一个个层级关系的骨骼，骨骼上绑定对应的部件贴图，通过对各个骨骼在关键帧进行移动，缩放，旋转等操作来实现动画对象的行为动画效果。

       目前 HTML5 游戏动画都是使用精灵图来实现的，设计师需要绘制大量的精灵图，逐帧播放产生动画效果。原始精灵图动画带来最大的两个问题是：大量的位图资源和动画不可。相对于 spriter 动画，骨骼动画能有以下几个突出的优势

1.  基于骨骼运动的角色会看上去更生动逼真、富有生命
2.  相对于 Spriter 动画，骨骼动画的图片容量可以减少 90%
3.  更精准的碰撞检测，结合物理引擎实现传神动画效果
4.  动画自动补间
5.  结合 Spriter 动画制作更完美的动画
6.  骨骼可控。动画过程中，骨骼可以通过 js 控制变化，例如：通过射击把敌人的骨骼击中脱落。
7.  轻松实现角色装备更换，甚至可对某骨骼做特殊控制或事件监听

相应的，骨骼动画在 CPU 运算上会带来一定的消耗。

for What ?

本身骨骼动画应用地方最多就是游戏，所以，第一版整体设计都是偏向于 HTML5 游戏。比较特别的是，用户群很大一部分是程序员。所以，在编辑动画整体设计上都趋向于小白化，即使不懂任何动画软件也能快速上手。同时，我们将来会提供一套百搭的火柴人素材，并且可以矢量输出，让没有设计师的单身程序员摆脱木有素材的困扰 (依旧不能摆脱单身)。

对比于其他的骨骼动画引擎，我们趋向于简单化，就像火柴小人一样，简单却灵活生动，这也是 AlloyStick 名字由来。【程序员也能做出非常棒的骨骼动画】，这是我们的愿景。

后继拓展：Flash 动画在移动上夭折，那么我们希望未来 AlloyStick 能定制化，兼容场景式 HTML5 动画，至少原理上是相通的。

How is it ?  
AlloyStick 只负责动画部分，不带游戏引擎，最终版本是能够嵌入第三方游戏引擎中。当然你也可以期待我们的游戏引擎，带上碰撞检测的特性，这样就会变得非常有趣。现版本是：我们只做动画的实现，跟游戏引擎独立分离。

目前，AlloyStick 还处于开发阶段。js 库部分还有很多计划中的功能没有实现。我们需要把时间投放在动画编辑器上。因为，我们的动画编辑器还在加班加点中。。。


<!-- {% endraw %} - for jekyll -->