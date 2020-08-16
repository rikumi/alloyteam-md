---
title: 如何用单张小图实现九宫格布局
date: 2012-05-19
author: TAT.melody
source_link: http://www.alloyteam.com/2012/05/leaflets-thumbnail-squared-layout/
---

<!-- {% raw %} - for jekyll -->

九宫格布局一直是前端比较纠结的一个问题，一是切图麻烦，二是修改 css 麻烦。本文将要介绍一种用一张小图实现九宫格布局的方法。使用此方法每次只要传图片路径跟四个边角的剪裁尺寸即可实现九宫格布局。请先看例子：[melodyui.sinaapp.com](http://melodyui.sinaapp.com/)

下面讲讲原理：

其实原理很简单，就是使用了 css 的 clip 属性。对中间需要平铺的区域进行了拉伸，然后再进行剪裁定位。主要的工作量都在坐标的计算上面，所以我这里不多说，可自行查看源代码。

最后希望这个方法能对大家有所帮助，谢谢大家。

<!-- {% endraw %} - for jekyll -->