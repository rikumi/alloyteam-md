---
title: CSS3 Transform 的 perspective 属性
date: 2012-10-29
author: TAT.Minren
source_link: http://www.alloyteam.com/2012/10/the-css3-transform-perspective-property/
---

<!-- {% raw %} - for jekyll -->

以下两行语句有什么区别？

```html
<div id="animateTest" 
     style="-webkit-transform: perspective(400px) rotateY(40deg);">
```

```html
<div id="animateTest" 
     style="-webkit-transform: rotateY(40deg) perspective(400px);">
```

如果大家不清楚，请听我娓娓道来。

CCS3 中的 Transform 是设置界面样式和动画的一大利器。而且在 Chrome 和 FF 中还支持 3D 变换。IE9 不支持，IE10 支持。

只要是 3D 场景都会涉及视角问题和透视的问题。在 Transform 中的设置方法比较简单：

1.  只能选择透视方式，也就是近大远小的显示方式。
2.  镜头方向只能是平行 Z 轴向屏幕内，也就是从屏幕正前方向里看。
3.  可以调整镜头与平面位置：

-   a) perspective 属性设置镜头到元素平面的距离。所有元素都是放置在 z=0 的平面上。比如 perspective (300px) 表示，镜头距离元素表面的位置是 300 像素。
-   b) perspective-origin 属性规定了镜头在平面上的位置。默认是放在元素的中心。

下面用一个正方体（或者说骰子）向大家演示视角不同视角（perspective 以及）的差别。

镜头距离 z=0 平面的不同距离的效果。

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/image001.jpg "image001")](http://www.alloyteam.com/wp-content/uploads/2012/10/image001.jpg)

镜头在 z 坐标固定时，x 和 y 坐标（perspective-origin）变化时的差别。

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/image002.jpg "image002")](http://www.alloyteam.com/wp-content/uploads/2012/10/image002.jpg)

# 使用 CSS3 进行 3D 变换很简单。

例如：让一个 Div 沿 Y 轴旋转一个角度：

上面的原始的 Div 和图片，下面是旋转后的效果。

```html
<div id="animateTest" >
    <img src="http://imgcache.qq.com/ptlogin/head/1_100.gif" 
         width="100" height="100">
</div>
 
<div id="animateTest" 
     style="<span style="color: #ff0000;">-webkit-transform: rotateY(40deg);</span>">
    <img src="http://imgcache.qq.com/ptlogin/head/1_100.gif" 
         width="100" height="100">
</div>
```

第一张图是原始状态的 DIV，第二张图是旋转后的效果。

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/image003-289x300.jpg "image003")](http://www.alloyteam.com/wp-content/uploads/2012/10/image003.jpg)

是不是效果不明显？这是因为镜头离平面太远了，所以旋转效果不明显。现在我们试试 perspective 属性。我们设置 perspect=400px。

```html
<div id="animateTest" 
     style="-webkit-transform: <span style="color: #ff0000;">perspective(400px)</span> rotateY(40deg);">
<img src="http://imgcache.qq.com/ptlogin/head/1_100.gif" 
     width="100" height="100">
</div>
```

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/image004-300x188.jpg "image004")](http://www.alloyteam.com/wp-content/uploads/2012/10/image004.jpg)

怎么样现在效果明显了吧。这就是 perspective 的用途。

不过在 chrome 中发现一个问题，那就是 perspective 一定要在 rotateY（或 rotateX）的前面。如果代码写成下面的情况，perspective 的设置会无效。

```html
<div id="animateTest" 
     style="-webkit-transform: <span style="color: #ff0000;">rotateY(40deg) perspective(400px);</span>">
```

在 FireFox 中也是这种情况。

在 mozilla 的文档上也没有说明这个情况。现在还不确定是设计如此还是 Bug。总之大家用的时候就将 prespective 放在前面好了。

<!-- {% endraw %} - for jekyll -->