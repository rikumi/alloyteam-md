---
title: 【原创教程】使用 CSS3 绘制腾讯 QQ 的企鹅 Logo
date: 2012-10-24
author: TAT.aishen
source_link: http://www.alloyteam.com/2012/10/css3-draw-qq-logo/
---

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/result.png "result")](http://download.alloyteam.com/demo/css3-tencent-qq-logo-basic/ "点击查看 Demo")

[CSS3 绘制腾讯 QQ 的企鹅 Logo 效果](http://www.alloyteam.com/wp-content/demos/css3-tencent-qq-logo-basic/ "点击查看 Demo")

今天和大家分享一下使用 CSS3 绘制腾讯 QQ 的企鹅 Logo 的过程。

## 一、如何使用 CSS3 来绘制图形？

网络上经常能够看到一些用 CSS3 绘制的精致图形，它们通常由矩形，圆形，椭圆，三角形，梯形等组合而成。要想绘制我们自己的图形，就要先了解下基本图形的绘制方法了。

一个 display：block 的元素设定宽高之后表现为矩形。通过设定 border-radius 可以得到圆角矩形，圆形和椭圆形。

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/border-radius.png "border-radius")](http://www.alloyteam.com/wp-content/uploads/2012/10/border-radius.png)

在使用 border-radius 时，有几点可能需要注意一下：

1.  border-radius，可以分别对 4 个角进行设定。 例如上图：border-top-left-radius: apx bpx;
2.  border-xxx-xxx-radius 的两个值分别代表着椭圆长轴和短轴长度的一半，通常简写的时候例如 border-top-left-radius: 10px;(border-top-left-radius:10px 10px;) 表明长轴和短轴的长度均为 20px，也就是半径为 10px 的圆形（圆角部分）。
3.  当使用百分比数值时，a 相对于 width， b 相对于 height

如果 a == width/2, b == height/2，结果就是一个椭圆，与此同时 a==b，那么就可以得到一个半径为 a 的圆形了。

在看三角形之前，首先看看三角形的 “绘制者” border，下面的例子：

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/border.png "border")](http://www.alloyteam.com/wp-content/uploads/2012/10/border.png)

```css
.test{
	border: 20px solid;
	border-top-color:#ff0000;
	border-right-color:#00ff00;
	border-bottom-color:#0000ff;
	border-left-color:#FFFF00;
	width:100px;
	height: 100px;
	background: #272822;
}
```

将每个 boder 的颜色值设为不一样，就可以清楚的看到每个 border 的负责区域，有三角形的雏形了。其实，绘制三角形的原理很简单，如下图

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/triangle.png "triangle")](http://www.alloyteam.com/wp-content/uploads/2012/10/triangle.png)

我们可以这样去理解一个 border 所代表的区域，那就是 “三角形 x2 + 矩形”，以 border-bottom 为例，

矩形 = width x (border-bottom-width)

相邻的 border 交叉的区域构成一个矩形，每个 border 各负责一半，一个直角三角形。只要将其中的一个 border 的颜色值设为 transparent 或者背景色，从视觉上就可以得到一个直角三角形了。

-   三角形 1 = border-left-width x border-bottom-width
-   三角形 2 = border-right-width x border-bottom-width

当 width = 0（height = 0, border-left || border-right）时，我们通过调整 border 的宽度可以将这两个直角三角形拼接成任意形状的三角形，或者调整 width (height) 等获得一个梯形，当然梯形也可以通过拼图得到，这样不是更简单吗？。Transform 中旋转将为我们提供更多的灵活变化。

## 二、绘制我们的企鹅

结束了对于基本图形部分的一些讨论，开始着手于 QQ 企鹅的绘制。

第一步当然是基本框架的绘制了。

通过对手里的 Logo 图像的观察，按照层次划分来组合最终的效果。选择使用绝对位置 position:absolute; 来布局各个元素。主要划分为头部，身体，围脖，双手，双脚。

框架的结果图：

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/simple.png "simple")](http://www.alloyteam.com/wp-content/uploads/2012/10/simple.png)

介绍下这个过程中几个比较典型的图形绘制方法：

1、**企鹅的眼睛**：椭圆，直接设置 border-radius:50% 50%; 即可_\[因为宽高分别为 44px 和 66px，所以也可以这样设定：border-radius: 22px / 33px]_

2、**围脖的尾部**：一个圆角各异的矩形，所以这里需要对几个角分别设定 border-radius，微调的结果为

```css
border-bottom-left-radius: 50% 43%;
border-bottom-right-radius: 15px;
border-top-left-radius: 20% 57%;
```

3、**企鹅的胳膊**：手的绘制较为麻烦一点，可以分为上下两个部分，将绘制的结果拼接到一起。那么对于不需要的部分怎么办呢？我们可以将上 (下) 部分放到一个 div (container) 中，利用 overflow:hidden 的属性来截取所要的部分。绘制复杂图形的时候常用的方法就是切割和拼接，将图形切割成一个个简单的小块，通过层叠和旋转变化进行组合。

使用 transform:rotate (deg) 的时候，优先设定 transform-origin 属性，会比较方便。设定的点作为中心点，整个图形绕着这个点进行角度变化。例如：transform-origin:bottom left， 使用左下角作为原点。也可以使用具体的像素值和百分比。

在基本的框架线条中比非常多的使用了 border-radius 用于构造各种曲线条，小企鹅是圆圆胖胖的，:)

接下来就是对只有基本线条的小企鹅进行着色了。着色的过程可以帮助我们调整 z-index，也就是各个模块的重叠层次，遮盖了一些无用的线条和框角。

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/basic.png "basic")](http://www.alloyteam.com/wp-content/uploads/2012/10/basic.png)

填充颜色之后的企鹅看起来好多了，可是总感觉有点不对劲。嘴巴的形状不够性感，围脖竟然没折，小企鹅的脚趾去哪了，穿鞋了吗？

剩余的工作就是对这些细节上的问题进行修复，这里主要使用两种图形：

### 1、绘制一个斜边三角形，修复嘴唇的层次感：

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/fix1.png "fix1")](http://www.alloyteam.com/wp-content/uploads/2012/10/fix1.png)

绘制这样一个斜边三角形，步骤分解如图所示：

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/fix1-step.png "fix1-step")](http://www.alloyteam.com/wp-content/uploads/2012/10/fix1-step.png)

先是绘制一个普通三角形，通过逆时针旋转得到一个修复三角形，那么相对称的修复三角形可以通过使用 rotateY，绕着 Y 轴旋转 180 度，来得到。

### 2、绘制一个 “小尾巴”

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/fix2.png "fix2")](http://www.alloyteam.com/wp-content/uploads/2012/10/fix2.png)

```css
border-right: 6px solid black;
width: 100px;
height: 70px;
border-bottom-right-radius: 70px 70px;
```

当对一个角应用圆角样式，如果这个角相邻的两个 border 一个有定义而一个无定义，那么绘制的结果就是由粗到细的 “小尾巴了”。\[_在整个绘制过程中，同一个图形它的绘制方法有很多种，例如一个矩形可以用 width x height 构成，也可以由 border x height (width) 构成，甚至可以由 border 组合 (width = height = 0) 构成，根据情况选择吧。_]

将这些修复应用到小企鹅上，得到最终的效果图：

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/result.png "result")](http://www.alloyteam.com/wp-content/uploads/2012/10/result.png)

请点击查看[**实例 DEMO**](http://www.alloyteam.com/wp-content/demos/css3-tencent-qq-logo-basic/ "查看 demo")，今天的分享就这么多了，之后会添加一些颜色效果和 CSS 动画效果，让我们的小企鹅变得迷人，敬请期待！