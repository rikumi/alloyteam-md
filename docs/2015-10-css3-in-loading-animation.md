---
title: CSS3 制作 Loading 动画
date: 2015-10-30
author: TAT.yana
source_link: http://www.alloyteam.com/2015/10/css3-in-loading-animation/
---

<!-- {% raw %} - for jekyll -->

     虽然现在互联网的网速越来越快，但永远都跟不上我们生活节奏的加快。资深网瘾少女表示，这世上最刺眼的不是阳光，而是 “正在加载”；最长的不是周杰伦的电影，而是 “ 正在加载”；最痛心的事情不是你不爱我，而是 “ 正在加载”（语文老师告诉我排比要至少写三句）。

**这是为什么呢**

为什么 loading 让我们如此痛苦呢？

因为，我们看到的 loading 是这样的[![QQ 截图 20151102114700](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ截图20151102114700.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ截图20151102114700.png)是这样的[![QQ 截图 20151102114723](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ截图20151102114723.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ截图20151102114723.png)颜值再高一点的是这样的[![spinner-css3-animations](http://www.alloyteam.com/wp-content/uploads/2015/10/spinner-css3-animations.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/spinner-css3-animations.png)。

这就是为什么要叫他们 “菊花”，就因为长得丑啊喂！

**我们要在这个看脸的世界活下去！！！**

 刚出生的时候我是个大圆脸，塌鼻梁，单眼皮，曾经一度被隔壁阿姨怀疑我是我妈捡来的 == 但我善良可爱的母亲大人对我不离不弃，常常跟我说 “先天不足，后天弥补”，我才有了继续活下去的勇气。作为网页，如果真的没办法改变 “ 加载慢” 这个病，那么把 loading 的动画做的好看一点，萌用户一脸血，“ 愉快的时光总是转瞬即逝”。

 又是一个刷朋友圈的难眠的夜晚，一篇文章吸引了我《什么样的 loading 动画，我会等！》。只要一点点简单的创意，加一点点简单的动效设计，加载过程就充满了乐趣。

 那么我们一起来用纯纯的 CSS3 做几个简单有趣的 loading 动画吧～（效果图均为动图！效果图均为动图！效果图均为动图！）

 首先，我们做一个最简单的进度条样的动画（这里偷懒下，只兼容 webkit 内核了 ==）

 [在这里，我们可以设置 animation-name（动画的名字），animation-timing-function（动画的速度曲线），animation-direction（动画循环效果），animation-iteration-count（动画播放次数），animation-duration（一次动画所需要的时间），除此之外，还可以规定 animation-delay（动画开始时间），animation-play-state（动画运行与否），animation-fill-mode（动画之外的状态）。](http://www.alloyteam.com/wp-content/uploads/2015/10/1.png)

 其中，animation-timing-function 的默认状态是 ease（低速开始，加快，在结束前变慢），ease-in（低速开始），ease-out（低速结束），ease-in-out（低速开始低速结束），linear（匀速），还可以用 cubic-bezier（0, 0, 0, 0）来设置速度。具体的速度曲线和设置速度值可以在[http://cubic-bezier.com](http://cubic-bezier.com/)上查到。

 animation-iteration-count 的 infinite 表示无限次循环；animation-direction 的 normal 表示动画播放完后从头开始播放，reverse 和 normal 相反，是从后向前播放，还有 alternate 会逆向播放。

```html
    &lt;a href="http://www.alloyteam.com/wp-content/uploads/2015/10/1.png">&lt;img alt="1" class="alignnone size-medium wp-image-8625" src="http://www.alloyteam.com/wp-content/uploads/2015/10/1-300x86.png" style="height:115px; width:400px" />
&lt;/a>    &lt;a href="http://www.alloyteam.com/wp-content/uploads/2015/10/12.png">&lt;img alt="12" class="alignnone size-medium wp-image-8623" src="http://www.alloyteam.com/wp-content/uploads/2015/10/12-300x267.png" style="height:356px; width:400px" />
    &lt;span style="font-size:16px">&lt;span style="color:#000000">然后我们在@keyframes中规定动画效果，由于是直线进行，所以只有开始和结束两个状态就OK了。&lt;/span>&lt;/span>
&lt;/a>    &lt;a href="http://www.alloyteam.com/wp-content/uploads/2015/10/111.png">&lt;img alt="11" class="alignnone size-medium wp-image-8631" src="http://www.alloyteam.com/wp-content/uploads/2015/10/111-300x162.png" style="height:162px; width:300px" />&lt;/a>
```

 效果如下

[![222](http://www.alloyteam.com/wp-content/uploads/2015/10/222-300x103.gif)](http://www.alloyteam.com/wp-content/uploads/2015/10/222.gif)

**卡带 Loading**

 上面那个黄条是什么鬼 == 好丑的有没有！！！

 于是我灵光一闪，卡带的样子来做 loading 一定不错～

 我找了一个卡带的图，把其中的转轮切出来，使用 rotate 来使圆圈旋转。注意要使用 transform-origin： 50% 50%；使动画以圆圈的圆心旋转。

     [![cs](http://www.alloyteam.com/wp-content/uploads/2015/10/cs-300x206.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/cs.png)

    于是就出现了如下的效果：

    [![cassette2](http://www.alloyteam.com/wp-content/uploads/2015/10/cassette2-300x148.gif)](http://www.alloyteam.com/wp-content/uploads/2015/10/cassette2.gif)

**牛顿摆 Loading**

 做好了卡带的效果后我的灵感欲罢不能，看到家里的牛顿摆就好想把它做成 loading。

 牛顿摆只有两端的小球会动，那么我们只要以绳子顶端为轴心旋转一定的角度就可以啦～于是我们使用 Photoshop 来简单画一个牛顿摆的图片。

 但是，摆动速度并不是随便就可以的，毕竟也算是个自由落体运动。开始的时候会有个横向的加速度，然后就是有个向下的重力加速度，毕竟用户中只有少数是物理学家，所以只要有个大概的速度变化即可。也就是说小球开始运动先加速再减速，到最顶端后再加速。于是使用[![33](http://www.alloyteam.com/wp-content/uploads/2015/10/33-300x24.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/33.png)来设置速度。

 搞定！于是牛顿摆的 Loading 是这样的：

    [![newtonBall2](http://www.alloyteam.com/wp-content/uploads/2015/10/newtonBall2-300x148.gif)](http://www.alloyteam.com/wp-content/uploads/2015/10/newtonBall2.gif)

**橘子甩汁 Loading**

 就说我对取名字什么的不擅长。。。

 在开头提到的那篇文章中，我看到了一个动图真的是萌我一脸血，让我不禁咽了咽口水。

 就是这货！！

    [![orange](http://www.alloyteam.com/wp-content/uploads/2015/10/orange-300x130.gif)](http://www.alloyteam.com/wp-content/uploads/2015/10/orange.gif) 

 其实叫 “橘子甩汁” 还是挺形象的 ==

 这里，我将整个动画分为三部分。

    [![44](http://www.alloyteam.com/wp-content/uploads/2015/10/44-300x158.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/44.png)

 第一部分是整个的进度条动画，这里我们的第一个颜值略低的进度条就派上了用场。我们将背景色换成黄色，然后给进度条加上 8px 的 border 就可以啦。

 第二部分是最右边的橘子切面，只要固定好位置就可以，注意，一定要将它置到最顶。

 第三部分就是橘子果肉部分，因为要向不同方向旋转不同路径运动，所以我分成了三个状态。

    [![43](http://www.alloyteam.com/wp-content/uploads/2015/10/43-300x119.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/43.png) [![42](http://www.alloyteam.com/wp-content/uploads/2015/10/42-300x119.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/42.png) [![41](http://www.alloyteam.com/wp-content/uploads/2015/10/41-300x169.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/41.png)

 translate 为平移运动，translate（left 的值，top 的值）；rotate 从 0 到 360 度为逆时针转动，反之为顺时针转动。通过给 translate 和 rotate 设置的值不同，就可以改变果肉运动的状态。然而我们不可以让他们同时间出现，那么我们可以为其中一个果肉动画设置 delay[![45](http://www.alloyteam.com/wp-content/uploads/2015/10/45-300x58.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/45.png)，这样就有了果肉不断被甩出的效果。

 css3 动画十分简单有趣，只要通过简单的平移变换的组合就可以做出很多可爱的动效。

 如果 loading 动画不再是菊花，那么等待也不再是件痛苦的事了。


<!-- {% endraw %} - for jekyll -->