---
title: clip-path 动画分享
date: 2015-06-30
author: TAT.vorshen
source_link: http://www.alloyteam.com/2015/06/clip-path-dong-hua-fen-xiang/
---

<!-- {% raw %} - for jekyll -->

CSS 样式的 clip-path 来源于 SVG<clipPath> 元素，它们的本质都是剪切

每个人都知道剪切，那么 clip-path 实现的剪切有什么特别之处呢？

**它的剪切元素可以是任意对象**

你整个 HTML 页面也好，一个 form 表单也好，图片也好，一切都可以变成一块一块的

在看效果之前先检查一个这个属性的浏览器兼容情况，如下图：

![](http://www.alloyteam.com/wp-content/uploads/2015/06/310.png)

IE 是完全不支持，尽量使用 webkit 内核，需要加上内核前缀 - webkit-

* * *

好了，接下来就是栗子了，整片文章多图～

下面是一个资源管理器的静态页面

[![](http://www.alloyteam.com/wp-content/uploads/2015/06/110.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/110.png)

让我们对其简单的剪切下

![](http://www.alloyteam.com/wp-content/uploads/2015/06/210.png)

变成了一个三角形，简单的一句话代码

```css
-webkit-clip-path: polygon(0 0,750px 0,750px 500px);
```

利用 polygon 多边形给出了三个点，画了一个三角形，也就是将整个图切割成了一个三角形

给多了的点的话就可以生成各种形状，比如四边形，五角星，六边形等等……

目前来说没有什么亮点，但是如果 clip-path 里面的数值变化可以触发 transition 的话那瞬间就不一样了

所以关于 clip-path 的大部分动画都是这样的，我给出一个简单的例子

![](http://www.alloyteam.com/wp-content/uploads/2015/06/a.gif)

本身效果是毫无卡顿感的，因为录制成 gif 希望文件较小所以帧间隔较大，显得比较卡

由于 clip-path 剪切出来的部分和正常的 DOM 节点其实是一样一样的，那么很多关于 DOM 节点的操作也可以给它加上，比如……

3D 动画！

之前的长方形变成了一个三角形，如果是由一个长方形变成多个三角形呢，然后他们进行 3D 变化了呢？

下面是制作的一个简单的效果

![](http://www.alloyteam.com/wp-content/uploads/2015/06/3.gif)

这里我进行了 3D 变化，随机动态的改变其 rotateXYZ、translate3D 的值，如果实现确定好的话可以实现一些折纸啊，折叠之类的效果，在这里我就不演示了，道理说道就好

**注意：经过 clip-path 剪切之后的元素，background-color 和 background-image 同时使用会产生 bug，会有边缘线产生，请单独使用它们！**

分享一个动画献给 AlloyTeam，毕竟是在这里的第一篇文！动画前半部分和后半部分都是使用 clip-path 实现的

![](http://www.alloyteam.com/wp-content/uploads/2015/06/2.gif)

由于动画时间较长，特地缩小了录制区域来避免文件过大，显得还是有点卡顿，真实情况下真的还好……

最后提一下毕竟利用 clip-path 频繁操作 DOM，简单一点的还好，如果是特别复杂，或者像我这个动画里面碎图的块再多一点，那么就会卡到你抓狂

所以做动画还是 Canvas 大法好～那么下一篇文章确定了，还是动画，不过是 Canvas 相关

结语：整篇文章代码很少（就是没有代码……），没有把某个效果具体从开始第一秒到最后一秒具体去实现，因为 clip-path 本身不难，也不算什么新东西～有哪些属性值，怎么使用，网上一搜一大堆，我这里就不罗列了啊～如果有什么疑问大家一起交流吼吼～

<!-- {% endraw %} - for jekyll -->