---
title: CSS3 的 roate 与 rotateX 的顺序研究
date: 2012-11-08
author: TAT.Minren
source_link: http://www.alloyteam.com/2012/11/the-order-of-roate-with-rotatex-problem/
---

<!-- {% raw %} - for jekyll -->

我觉得 CCS3 的 transform 中的学问很深，可以出不少面试题了，[之前的文章谈到过 perspective 属性的位置问题](http://www.alloyteam.com/2012/10/the-css3-transform-perspective-property/)，我们今天看看 rotate 的顺序，首先看看下面两个 CSS3 的 keyframe 动画：

两个动画的起始状态和结束状态都是是一摸一样的（其实就是原始位置），不同的只不过是 rotate 和 rotateX 的顺序。但是动画效果却有惊人的差别。

[![](http://www.alloyteam.com/wp-content/uploads/2012/11/raceFlag_clip.gif "raceFlag_clip")](http://www.alloyteam.com/wp-content/uploads/2012/11/raceFlag_clip.gif)[![](http://www.alloyteam.com/wp-content/uploads/2012/11/raceFlag2_clip.gif "raceFlag2_clip")](http://www.alloyteam.com/wp-content/uploads/2012/11/raceFlag2_clip.gif)

CSS 代码如下：

```css
@-webkit-keyframes raceFlag0{
	0%{
		-webkit-transform:rotate(-720deg) rotateX(0deg) ;
		-webkit-transform-origin:100% 0%;
	}
	100%{
		-webkit-transform:rotate(0deg) rotateX(-360deg) ;
		-webkit-transform-origin:100% 0%;
	}
}
 
@-webkit-keyframes raceFlag1{
	0% {
		-webkit-transform: rotateX(0deg) rotate(-720deg);
		-webkit-transform-origin:100% 0%;
	}
	100% {
		-webkit-transform: rotateX(-360deg) rotate(0deg);
		-webkit-transform-origin:100% 0%;
	}
}
```

我看了 mozilla 的网站介绍，里面没有提到关于顺序的问题。于是我做了以下实验。

将两个同样的元素的 style 分别设置为：

```css
-webkit-transform: rotateX(-135deg) rotate(-270deg);
-webkit-transform-origin: 100% 0%;
 
-webkit-transform: rotate(-270deg) rotateX(-135deg);
-webkit-transform-origin: 100% 0%;
```

结果是不相同的。如下图：

[![](http://www.alloyteam.com/wp-content/uploads/2012/11/rotate静态.png "rotate 静态")](http://www.alloyteam.com/wp-content/uploads/2012/11/rotate静态.png)

是不是 - webkit-transform-origin 设置的原因呢？我们将该属性删除：

[![](http://www.alloyteam.com/wp-content/uploads/2012/11/rotate静态2.png "rotate 静态 2")](http://www.alloyteam.com/wp-content/uploads/2012/11/rotate静态2.png)

我们将问题旋转的角度简化为 45 度和 90 度，为了让 rotateX 的效果明显现一些，我们增加 perspective 属性。两个 CSS 分别是：

```css
-webkit-transform: perspective(200px) rotateX(45deg) rotate(90deg);
-webkit-transform: perspective(200px) rotate(90deg) rotateX(45deg)
```

[![](http://www.alloyteam.com/wp-content/uploads/2012/11/rotate静态3.png "rotate 静态 3")](http://www.alloyteam.com/wp-content/uploads/2012/11/rotate静态3.png)

这样我们就能发现一些规律了。就是 rotate 旋转的不是图像，（也不是寂寞）而是坐标系。具体来说，就是 X 轴也被旋转了。rotateX 旋转的也是坐标系。

我们在图上添加坐标系大家就明白了。注意右面的图的坐标系顺时针旋转了 90 度。

[![](http://www.alloyteam.com/wp-content/uploads/2012/11/rotate静态4.png "rotate 静态 4")](http://www.alloyteam.com/wp-content/uploads/2012/11/rotate静态4.png)

我们再看一个个例子：

```css
-webkit-transform: perspective(200px) rotateX(45deg) rotateY(10deg);
-webkit-transform: perspective(200px) rotateY(20deg) rotateX(45deg);
```

[![](http://www.alloyteam.com/wp-content/uploads/2012/11/rotate静态5.png "rotate 静态 5")](http://www.alloyteam.com/wp-content/uploads/2012/11/rotate静态5.png)

结论：rotate、rotateX、rotateY、rotateZ 都是旋转坐标系。rotateX 时，Y 轴和 Z 轴的位置会变。rotateY 时，X 轴和 Z 轴的位置会变。rotate 和 rotateZ 时，X 轴和 Y 轴的位置会变。

我们使用 rotate 时要注意顺序，特别是动画的时候。

进一步的结论：用过 canvas 中 transform 的同学可能会知道，在 canvas 中进行 transform 时，变形的对象是 canvas 本身。看来在 CSS3 的 transform 中也是一样的道理。比如我想将图片旋转 90 度，浏览器的逻辑是，将页面旋转 - 90 度，然后渲染图片，之后再将页面旋转 90 度。这样就实现了旋转图片的效果。

因此在 CSS3 的 tranform 属性中，perspective、rotate、translate 等属性并不是代表对象的最终状态，而是浏览器渲染对象的 “指令队列”。浏览器会依次执行这些 “指令”。

这样也就可以解释为什么 perspective 为什么要放在 transform 的第一位了。

PS：以上结论是基于逻辑推理得来，本人没有看过这部分的浏览器源代码，请看过的同学指正。

<!-- {% endraw %} - for jekyll -->