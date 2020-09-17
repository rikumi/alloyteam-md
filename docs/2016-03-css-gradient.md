---
title: CSS Gradient 详解
date: 2016-03-05
author: TAT.yunsheng
source_link: http://www.alloyteam.com/2016/03/css-gradient/
---

<!-- {% raw %} - for jekyll -->

前言  

=====

现在设计师同学越来越高大上了，纯色背景已经不能满足人民群众日益增长的物质文化需要了，必须整渐变背景 o (╯□╰) o。怎么还原呢，设计师直接丢过来一个几十 K 的图片，这怎么行。。。

还好我们有 CSS 第三代！这次就来唠唠 CSS3 Gradient (/ˈgreɪdɪənt/) 的用法。

兼容性  

======

从 [Can I use](http://caniuse.com/#feat=css-gradients) 上看，现代浏览器支持程度良好，尤其移动端，对于不支持的浏览器，下文会提供一种采用纯色的降级方案。

[![CSS Gradient 1](http://www.alloyteam.com/wp-content/uploads/2016/02/18.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/18.png)

但是各种兼容性问题肯定免不了，Gradient 和 Flex box 一样 eggache，总共有三种语法规则，而且差异很大。。。

这里为了讨论简单，我们只涉及最新的语法（基本能覆盖大量新浏览器了）。老旧语法规则和 IE 等各浏览器的兼容方法请见参考文章的 2、3 有详细的介绍，也可以使用 [Gradient Generator](http://www.cssmatic.com/gradient-generator) 或者 [autoprefixer](https://css-tricks.com/autoprefixer/) 自动生成代码。

前置知识  

=======

1、绘制区域，也就是规范中所谓的 [gradient box](https://drafts.csswg.org/css-images-3/#gradient-box)（为了理解无歧义，下文不再翻译该术语），跟所关联 DOM 的实际尺寸有关，比如，设定 background 的话，绘制区域就是 DOM 的 padding box，除非用 backgroud-size 指定大小；如果是设定 list-style-image，绘制区域就是 1em 的正方形。

2、从 [W3C](https://drafts.csswg.org/css-images-3/#gradients) 的描述中可以知道，浏览器实际是根据 Gradient 指定的语法来生成对应的图片

>         A gradient is an image that smoothly fades from one color to another. 

      而且不只 background 可以用，比如

```css
background: linear-gradient(white, gray);
list-style-image: radial-gradient(circle, #006, #00a 90%, #0000af 100%, white 100%);
```

3、由于是 image，所以用于 background 时，实际是设置在 background-image 上，如果只是单纯的渐变颜色，可以用以下的样式来对不支持的老旧浏览器做降级处理

```css
.gradient {
/* can be treated like a fallback */
  background-color: red;
/* will be "on top", if browser supports it */
  background-image: linear-gradient(red, orange);
}
```

原理就借用慕课网的一张图：

[![CSS Gradient 2](http://www.alloyteam.com/wp-content/uploads/2016/02/2.jpg)](http://www.alloyteam.com/wp-content/uploads/2016/02/2.jpg)

Gradient 有几个子特性，下面一一列出。

线性渐变（linear-gradient）  

========================

语法如下：

    linear-gradient() = linear-gradient(
      [ | to ]?,
      <color-stop-list>
    )
    <side-or-corner> = [left | right] || [top | bottom]

第一个参数指明了颜色渐变的方向：

-   可以是角度，比如 0deg，表示正上方向，90deg 表示向右（顺时针）
-   也可以是关键词，比如 to top, to right, to bottom, to left, 分别对应了 0deg, 90deg, 180deg, 270deg。当然也可以不指定，默认值是 to bottom

第二个参数指明了颜色断点（即 [color-stop](https://drafts.csswg.org/css-images-3/#color-stop)）。位置可以省略，第一个默认为 0%，最后一个默认为 100%，如果中间的值没有指定，则按颜色数目求均值，比如

    linear-gradient(red 40%, white, black, blue)
    /*等价于*/
    linear-gradient(red 40%, white 60%, black 80%, blue 100%)

更多边界情况可以参考 [W3C 规范](https://drafts.csswg.org/css-images-3/#color-stop)，建议位置都采用同样的单位，避免产生意外情况。

浏览器是如何绘制渐变线的呢？  

=================

如下图，从 gradient box 的中心（对角线交点）开始以 CSS 中指定的角度向两侧延伸，终点是 gradient box 的一个相近顶点到 gradient line 垂线的垂足，起点也是类似的求法，两点间的距离就是 gradient line 的长度（浓浓的初中几何味～）。


<!-- {% endraw %} - for jekyll -->