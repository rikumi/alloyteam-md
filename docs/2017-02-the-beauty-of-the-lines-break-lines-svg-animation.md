---
title: 线条之美，玩转 SVG 线条动画
date: 2017-02-27
author: TAT.tennylv
source_link: http://www.alloyteam.com/2017/02/the-beauty-of-the-lines-break-lines-svg-animation/
---

<!-- {% raw %} - for jekyll -->

通常来说 web 前端实现动画效果主要通过下面几种方案：

-   css 动画；利用 css3 的样式效果可以将 dom 元素做出动画的效果来。
-   canvas 动画；利用 canvas 提供的 API，然后利用清除 - 渲染这样一帧一帧的做出动画效果。
-   svg 动画；同样 svg 也提供了不少的 API 来实现动画效果，并且兼容性也不差，本文主要讲解一下如何制作 svg 线条动画。

先来看几个效果：

[![](https://oc5n93kni.qnssl.com/blog/buluofuza.gif)](https://oc5n93kni.qnssl.com/blog/buluofuza.gif)[demo](https://www.nihaoshijie.com.cn/mypro/svg/buluofuza.html)

[![](https://oc5n93kni.qnssl.com/blog/daojishi1.gif)](https://oc5n93kni.qnssl.com/blog/daojishi1.gif)[demo](https://www.nihaoshijie.com.cn/mypro/svg/daojishi.html)

[![](https://oc5n93kni.qnssl.com/alloyteam.gif)](https://oc5n93kni.qnssl.com/alloyteam.gif)[demo](https://www.nihaoshijie.com.cn/mypro/svg/alloyteam.html)

以上这些效果都是利用 SVG 线条动画实现的，只用了 css3 和 svg，没有使用一行 javascript 代码，这一点和 canvas 比起来要容易一些，下面就说明一下实现这些效果的原理。

关于 SVG 的基础知识，我这里就不再叙述了，大家可以直接在文档中查看相关的 API，这里只说一下实现线条动画主要用到的：path（路径）

## <path> 标签命令

-   M = moveto
-   L = lineto
-   H = horizontal lineto
-   V = vertical lineto
-   C = curveto
-   S = smooth curveto
-   Q = quadratic Belzier curve
-   T = smooth quadratic Belzier curveto
-   A = elliptical Arc
-   Z = closepath

利用 path 的这些命令我们可以实现我们想要的任何线条组合，以一段简单的线条为例:

```html
<path
    id="path"
    fill="none"
    stroke="#000"
    stroke-width="1px"
    d="M452,293c0,0,0-61,72-44c0,0-47,117,81,57
    s5-110,10-67s-51,77.979-50,33.989"
/>;
```

效果：

[![](https://oc5n93kni.qnssl.com/blog/simple.png)](https://oc5n93kni.qnssl.com/blog/simple.png)

呵呵，看起来很简单，但是，如何让这个线条动起来呢？这里就要明白到 SVG 里的 path 的一些主要属性：

1.  stroke：标识路径的颜色；
2.  d：标识路径命令的集合，这个属性主要决定了线条的形状。
3.  stroke-width：标识路径的宽度，单位是 px；
4.  stroke-dasharray：它是一个<length> 和<percentage> 数列，数与数之间用逗号或者空白隔开，指定短划线和缺口的长度。如果提供了奇数个值，则这个值的数列重复一次，从而变成偶数个值。因此，5,3,2 等同于 5,3,2,5,3,2；
5.  stroke-dashoffset：标识的是整个路径的偏移值；

以一张图来解释 stroke-dasharray 和 stroke-dashoffset 更容易理解一些：

[![](https://oc5n93kni.qnssl.com/blog/array.png)](https://oc5n93kni.qnssl.com/blog/array.png)

因此，我们之前的路径就会变成这个样子：

```css
#path {
        stroke-dasharray: 3px, 1px;
        stroke-dasharray: 0;
}
 
```

效果：

[![](https://oc5n93kni.qnssl.com/%E8%99%9A%E7%BA%BF.png)](https://oc5n93kni.qnssl.com/%E8%99%9A%E7%BA%BF.png)

理解了 stroke-dasharray 的作用之后，下面我们就可以使用 css3 的 animation 来让这个路径动起来。

```css
#path {
    animation: move 3s linear forwards;
}
 
@keyframes move <
```


<!-- {% endraw %} - for jekyll -->