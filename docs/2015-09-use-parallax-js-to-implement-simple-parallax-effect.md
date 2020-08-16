---
title: 使用 Parallax.js 实现简单视差效果
date: 2015-09-30
author: TAT.yana
source_link: http://www.alloyteam.com/2015/09/use-parallax-js-to-implement-simple-parallax-effect/
---

<!-- {% raw %} - for jekyll -->

        作为一只网瘾少女，各种酷炫的网页效果已经不能再引起我的注意了，直到有一天我看到了这个 <http://matthew.wagerfield.com/parallax/> ，瞬间晕船了。嗯，我喜欢这种微醺的感觉。这时我的脑洞突然开了一下，想起了前段时间票圈疯转的各种 360° 全景摄影。当手机绕着你 360° 转动的时候，就好像置身照片中的场景一样，那这个框架应该可以做成这样的效果～（虽然后来知道这个效果并不是用 parallax.js 做的![sad](http://www.alloyteam.com/wp-content/plugins/ckeditor-for-wordpress/ckeditor/plugins/smiley/images/sad_smile.png "sad")）。于是开启了我用 parallax.js 来变身炫酷少女之路。

**Parallax.js 到底干嘛的**

       Parallax.js 是一种轻量级的 JavaScript 框架（技术文必备语句），也可以作

为 jQuery 插件来使用。它可以对移动设备的横竖屏自适应，还支持自定义行为（data 属性或是 JavaScript 的 api）。最最适合我装逼的是它可以对智能设备的方向作出反应。但是即使没有陀螺仪或是其他重力感应硬件的时候，它还可以用光标来控制方向。真是个能屈能伸的好汉子![yes](http://www.alloyteam.com/wp-content/plugins/ckeditor-for-wordpress/ckeditor/plugins/smiley/images/thumbs_up.png "yes")

**快闪开，我要开始装逼了**

        首先，素材很重要。要做成下面的样子。

![](http://www.alloyteam.com/wp-content/uploads/2015/09/1.png)

        我从博客首页搞到了这个

![](http://www.alloyteam.com/wp-content/uploads/2015/09/2.png)

        还简单截了 “alloyteam” 的图，然后通过 ps 决定了他们的大小和位置，分别合并成图层

![](http://www.alloyteam.com/wp-content/uploads/2015/09/3.png) ![](http://www.alloyteam.com/wp-content/uploads/2015/09/41.png) ![](http://www.alloyteam.com/wp-content/uploads/2015/09/5.png)

        这时我们简单的基本样式就出来啦～接下来就开始写代码了。

        我从 <http://matthew.wagerfield.com/parallax/> 上下载了一个叫 parallax.js 的源码。

        然后我新建了一个.html 文件，实现 HTML 结构。其中，data-depth 属性定义的是该层的深度，数值越大代表运动的越激烈，”0.00“ 为固定不动。

![](http://www.alloyteam.com/wp-content/uploads/2015/09/div.png)

         在 html 中引用 parallax.js，并且初始化 parallax 插件。

![](http://www.alloyteam.com/wp-content/uploads/2015/09/script.png)

        这时候我们通过光标移动就可以看到我们的 “Alloyteam” 围着 Alloy 企鹅在做各种频率的移动。

        然而运动量的改变不止依赖 data-depth，还依赖于 scalarX 和 ScalarY 的值和父容器的尺寸。计算公式为 xMotion = parentElement.width  \* (scalarX / 100) \* layerDepth，也就是说，当 data-depth 的值为 0.20，scalarX 为 10，scalarY 为 10，父容器尺寸为 1000px 500px 时，它在 x 方向的运动量为 20，在 y 方向的运动量为 10。

        Parallax.js 还可以配置一些参数。data-calibrate-x 和 data-calibrate-y 用来指定是否根据初始时的 x 轴的值来计算运动量；data-invert-x 和 data-invert-y 判断是否按反方向来运动层；data-limit-x 和 data-limit-y 可以设置 x 或 y 方向上总的运动量数值范围，数值越大运动量范围越大；data-scalar-x 和 data-scalar-y 为层运动的灵敏度，通过 “20” 和 “8” 的对比，明显发现 “20” 更灵敏；![](http://www.alloyteam.com/wp-content/uploads/2015/09/scalar.png)data-friction-x 和 data-friction-y 设置层运动的摩擦量，数值为 0-1，明显有摩擦的感觉，但是我的肉眼实在没看出来小数值和大数值摩擦感觉上的区别；data-origin-x 和 data-origin-y 代表了鼠标输入的 x 或 y 原点，默认值是 0.5，在我的理解就是：当数值越小的时候，运动层的运动就会越随着鼠标运动，反之，数值越大运动层的运动就会越向着鼠标运动的反向运动。

        Parallax.js 并不是一个没有故事的小框架，通过它，还可以做出非常炫酷的滑页效果，至于滑页效果，我会在后面继续我的炫酷少女之路。

        以下就是一个简单的视差效果页面

![](http://www.alloyteam.com/wp-content/uploads/2015/09/afa.gif)


<!-- {% endraw %} - for jekyll -->