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

[![CSS Gradient 3](http://www.alloyteam.com/wp-content/uploads/2016/02/32.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/32.png)

所以，gradient line 的长度计算公式是：

    abs(W * sin(A)) + abs(H * cos(A))
    A是角度，W是gradient box的宽，H为高

是不是看完有种然并卵的感觉：前端工程师哪里需要知道这些鬼啊。

非也非也，在开发 UI 的时候，清楚的知道浏览器原理，才能在脑中根据视觉稿正确的解构出 CSS 代码，否则只能在那里傻傻的试了又试。

🌰[栗子一](http://codepen.io/sxlzll/pen/vGYzPe)

以下的写法效果其实都一样 

```css
  background-image: linear-gradient(yellow, green); // 默认方向为to bottom
  background-image: linear-gradient(to bottom, yellow, green); // 使用关键字指定方向
  background-image: linear-gradient(180deg, yellow, green); // 使用角度指定方向
  background-image: linear-gradient(to top, green, yellow);
  background-image: linear-gradient(to bottom, yellow 0%, green 100%); // 指定颜色断点
```

           [![CSS Gradient 4](http://www.alloyteam.com/wp-content/uploads/2016/02/41.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/41.png)

🌰[栗子二](http://codepen.io/sxlzll/pen/yOLmgR)

当然多个颜色断点也可以：

```css
background-image: linear-gradient(to bottom, #FF0000 14.28%, #FFA500 14.28%, #FFA500 28.57%, #FFFF00 28.57%, #FFFF00 42.85%, #008000 42.85%, #008000 57.14%, #0000FF 57.14%, #0000FF 71.42%, #4B0082 71.42%, #4B0082 85.71%, #800880 85.71%, #800880 100%);
```

[![CSS Gradient 5](http://www.alloyteam.com/wp-content/uploads/2016/02/52.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/52.png)

这个例子还有个小技巧，Gradient 中两个不同颜色间默认是渐变的，但如果我们需要做出图中这种颜色明显变化的效果（锐变），就可以用同一个位置不同颜色的方式实现。

🌰[栗子三](http://codepen.io/sxlzll/pen/ZWYEKa)

在颜色上设置透明度渐变

```css
.gradient-1 {
  background-image: url(http://a57.foxnews.com/global.fncstatic.com/static/managed/img/fn2/876/493/EmmaWatsonBrown.jpg);
  background-size: 100% 100%;
}
 
.gradient-2 {
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1)), url(http://a57.foxnews.com/global.fncstatic.com/static/managed/img/fn2/876/493/EmmaWatsonBrown.jpg) no-repeat;
  background-size: 100% 100%;
}
```

效果如下，左边原图，右边增加了一层遮罩，这个效果其实是利用了 [CSS3 的多背景语法](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Background_and_Borders/Using_CSS_multiple_backgrounds)

[![CSS Gradient 6](http://www.alloyteam.com/wp-content/uploads/2016/02/62-e1456750931790.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/62-e1456750931790.png)

更多例子可以在这里看 <http://lea.verou.me/css3patterns/>

径向渐变（radial-gradient）  

========================

radial gradient 其实就是颜色从一个点以同心圆或者椭圆向外渐变。

[![CSS Gradient 7](http://www.alloyteam.com/wp-content/uploads/2016/02/72.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/72.png)

简化版语法如下：

    radial-gradient() = radial-gradient(
      [ || ]? [ at ]? ,
      <color-stop-list>
    )

-   position 用来指定渐变圆心的位置，默认为 center，[赋值规则](https://drafts.csswg.org/css-backgrounds-3/#position)与 background-positon 的类似；

-   ending-shape 可以是 circle 或者 elipse，如果省略，则默认值与 size 相关，size 指定一个值就是圆形，否则是椭圆；

-   size 可以是具体的值，也可以用关键字指定，默认值是 farthest-corner。如果是具体值，圆形需要一个数值，椭圆需要两个。关键字则包括：

    -   closest-side 指 gradient box 某一边到盒子中心最近的距离；
    -   farthest-side 指 gradient box 某一边到盒子中心最远的距离；
    -   closest-corner 指 gradient box 某一顶点到盒子中心最近的距离；
    -   farthest-corner 指 gradient box 某一顶点到盒子中心最远的距离；

-   color-stop-list 与 linear-gradient 类似

注意：

-   size 的数值不能是负数
-   W3C 规范规定，百分比的数值只能用于椭圆，不能用于圆形。
-   position 的值可以是负数

所以，复杂版语法如下：

    radial-gradient() = radial-gradient(
      [ [ circle               || ]                          [ at ]? , |
        [ ellipse              || [ | ]{2} ]    [ at ]? , |
        [ [ circle | ellipse ] || ]                  [ at ]? , |
        at <position> ,
      ]?
      <color-stop> [ ,
    ]+
    )
    <extent-keyword> = closest-corner | closest-side | farthest-corner | farthest-side

🌰[栗子一](http://codepen.io/sxlzll/pen/vGEBRa)

以下几种写法是等价的

```css
.gradient-1 {
  background-image: radial-gradient(yellow, green);
}
 
.gradient-2 {
  background-image: radial-gradient(ellipse at center, yellow 0%, green 100%);
}
 
.gradient-3 {
  background-image: radial-gradient(farthest-corner at 50% 50%, yellow, green);
}
 
.gradient-4 {
  background-image: radial-gradient(ellipse farthest-corner at 50% 50%, yellow, green);
}
```

[![CSS Gradient 8](http://www.alloyteam.com/wp-content/uploads/2016/02/82.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/82.png)

🌰[栗子二](http://codepen.io/sxlzll/pen/xVbKyP)

看下 size 各种关键字的效果

```css
.gradient-1 {
  background-image: radial-gradient(circle closest-side at 30% 50%, yellow, green);
}
 
.gradient-2 {
  background-image: radial-gradient(circle farthest-side at 30% 50%, yellow, green);
}
 
.gradient-3 {
  background-image: radial-gradient(circle closest-corner at 30% 50%, yellow, green);
}
 
.gradient-4 {
  background-image: radial-gradient(circle farthest-corner at 30% 50%, yellow, green);
}
```

[![CSS Gradient 9](http://www.alloyteam.com/wp-content/uploads/2016/02/92.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/92.png)

圆心没设置在中心是因为矩形的对角线相等且平分，所以 closest-corner = farthest-corner，就没法比较差异了。

重复渐变（Repeating Gradients）  

============================

基本语法与上面的线性渐变和径向渐变类似，就是增加了重复的特性。

从 [Can I use](http://caniuse.com/#feat=css-repeating-gradients) 的数据看目前支持程度不乐观，PC 除了 IE 都还不错，移动端 Android4.0 以下都红 o (╯□╰) o。。

但是了解下还是必要的

[![CSS Gradient 10](http://www.alloyteam.com/wp-content/uploads/2016/02/102.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/102.png)

重复的规则简单说就是用最后一个颜色断点的位置减去第一个颜色断点位置的距离作为区间长度，不断的重复。比如 repeating-linear-gradient (red 10px, blue 50px)  就相当于 linear-gradient (..., red -30px, blue 10px, red 10px, blue 50px, red 50px, blue 90px, ...)

至于首尾颜色距离为 0 等特殊情况，这里就不细说 了，可以到 [W3C 规范](https://drafts.csswg.org/css-images-3/#funcdef-repeating-radial-gradient)自行研究。

🌰[栗子](http://codepen.io/sxlzll/pen/EKxdKN)

```css
div {
  width: 100px;
  height: 100px;
  margin: 10px;
  border: 1px solid blue;
  float: left;
}
 
.repeat-linear {
  background-image: repeating-linear-gradient( 45deg, white, white 10px, red 10px, red 20px);
}
 
.repeat-radial {
  background: repeating-radial-gradient( circle at bottom left, white, white 10px, red 10px, red 20px);
}
```

[![CSS Gradient 11](http://www.alloyteam.com/wp-content/uploads/2016/02/112.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/112.png)

根据上面说的规则，这个例子里的区间长度是首尾颜色的位置之差，是 20px。

我们可以验证下，两张图里都有约 7 个红白条，矩形宽高均 100px，对角线则是约 140px，140px/7=20px，bingo！

注：本文例子的代码在 [codepen](http://codepen.io/collection/Xkkwve/) 可以查看

参考文章  

=======

1.  [W3C: Gradients](https://drafts.csswg.org/css-images-3/#gradients)
2.  [CSS-Tricks: CSS Gradients](https://css-tricks.com/css3-gradients/)
3.  [大漠：CSS3 Gradient](http://www.w3cplus.com/content/css3-gradient)
4.  MDN: CSS [linear-graient()](https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient), [radial-gradient()](https://developer.mozilla.org/en-US/docs/Web/CSS/radial-gradient), [Using CSS gradients](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Images/Using_CSS_gradients)

<!-- {% endraw %} - for jekyll -->