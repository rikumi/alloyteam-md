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
 
@keyframes move {
      0%{
          stroke-dasharray: 0, 511px;
      }
      100%{
          stroke-dasharray: 511px, 511px;
      }
}
 
```

效果：

[![](https://oc5n93kni.qnssl.com/blog/dong2.gif)](https://oc5n93kni.qnssl.com/blog/dong2.gif)

511 这个值是整个路径的长度，可以用 js 的 document.getElementById ('path').getTotalLength () 得到

stroke-dasharray: 0, 511; 表示实线和空隙的长度分别为 0 和 511，所以一开始整个路径都是空隙，所以是空的。  
然后过渡到 stroke-dasharray: 511, 511; 因为整个线条的长度就是 511，而实线的长度也慢慢变成 511，所以整个线条就出现了。

同样利用 stroke-dashoffset 也可以实现这个效果，原理就是最初线条分为 511 实线，和 511 空隙，但是由于设置了 offset 使线条偏移不可见了，当不断修改 offset 后，线条慢慢出现。

```css
#path {
    animation: move 3s linear forwards;
    stroke-dasharray: 511px,511px;
}
 
@keyframes move {
  0%{
      stroke-dashoffset: 511px;
  }
  100%{
      stroke-dashoffset: 0;
  }
}
 
```

效果：

[![](https://oc5n93kni.qnssl.com/blog/dong2-1.gif)](https://oc5n93kni.qnssl.com/blog/dong2-1.gif)

当我们掌握了上述的方法后，整个利用 SVG 实现线条动画的原理就已经清楚了，我们需要的就是一个 SVG 路径了，但是总画一些简单的线条还是不美啊，那我们如何才能得到复杂的 svg 路径呢？

1.  找 UI 设计师要一个。
2.  自己利用 PS 和 AI 做一个，只需要简单的 2 步。

[![](https://oc5n93kni.qnssl.com/blog/psai.png)](https://oc5n93kni.qnssl.com/blog/psai.png)

以部落 LOGO 为例：

1，得到部落 LOGO 的 png 图片。

2，右键图层，然后点击从选区生成工作路径，我们就可以得到：

[![](https://oc5n93kni.qnssl.com/blog/buluopng.png)](https://oc5n93kni.qnssl.com/blog/buluopng.png)

3，文件 -- 导出 -- 路径到 AI，将路径导出在 AI 里面打开。

[![](https://oc5n93kni.qnssl.com/buluolujing.png)](https://oc5n93kni.qnssl.com/buluolujing.png)

4，在 AI 里面选择保存成 svg 格式的文件，然后用 sublime 打开 svg 文件，将 path 的 d 拷贝出来即可。

5，利用上文介绍的实现动画的方法，我们就可以轻松的得到了下面这个效果。

[![](https://oc5n93kni.qnssl.com/blog/buluo.gif)](https://oc5n93kni.qnssl.com/blog/buluo.gif)

线条动画进阶：

可以看到上面的动画效果和文章最初显示的动画效果还是有区别的，要想实现文章最初的动画效果，需要用到 SVG 的<symbol> 和 <use> 来实现，读者可以在网上查一下这两个标签的用法。

```html
<symbol id="pathSymbol">
    <path  class="path" stroke="#00adef"  d="M281.221,261.806c0,2.756-2.166,4.922-4.922,4.922l0,0h-33.964c-11.715-24.119-31.503-59.855-47.156-68.026
  c-15.751,7.974-35.637,43.907-47.451,68.026h-33.865l0,0c-2.756,0-4.922-2.166-4.922-4.922l0,0l0,0c0-0.295,0-0.689,0.098-0.984
  c0,0,14.078-69.109,79.15-129.161c-2.953-2.56-5.907-5.119-8.959-7.58c-1.87-1.575-2.166-4.233-0.591-6.104
  c1.575-1.772,4.43-2.166,6.497-0.689c3.347,2.461,6.694,5.218,9.746,8.073c3.15-2.953,6.497-5.71,10.041-8.368
  c2.067-1.378,4.922-1.083,6.497,0.689c1.575,1.87,1.28,4.529-0.591,6.104c-3.052,2.56-6.104,5.218-9.155,7.876
  c65.27,59.953,79.446,129.161,79.446,129.161C281.221,261.117,281.221,261.412,281.221,261.806L281.221,261.806L281.221,261.806z"/>
    <path  class="path" stroke="#00adef"  d="M194.589,212.583h0.984l0,0c19.886,28.451,31.503,54.145,31.503,54.145h-63.99C163.086,266.728,174.703,241.034,194.589,212.583
L194.589,212.583z"/>
</symbol>
<g>
  <use xlink:href="#pathSymbol"
    id="path1"></use>
    <use xlink:href="#pathSymbol"
      id="path2"></use>
</g>
 
```

````html
#path1 {
 
    stroke-dashoffset: 7% 7%;
    stroke-dasharray: 0 35%;
    animation: animation 3s linear forwards;
  }
 
  @keyframes animation {
      100% {
        stroke-dasharray: 7% 7%;
        stroke-dashoffset: 7%;
 
      }
  }
 
  #path2 {
 
    stroke-dashoffset: 7% 7%;
    stroke-dasharray: 0 35%;
    animation: animation2 3s linear forwards;
  }
 
  @keyframes animation2 {
      100% {
          stroke-dasharray: 7% 7%;
          stroke-dashoffset: 14%;
 
      }
 }
 ```
思路就是：
 
1，将原来只有一条path的路径替换成两条，并且这两条的路径是完全重合的。
 
2，分别设置两条路径的stroke-dasharray和stroke-dashoffset的css3的animation动画，注意两条路径的动画不能完全一样要有差值。
 
3，设置成功之后就可以利用animation动画触发的时机和改变程度来实现多条动画效果。
 
效果：
 
<a href="https://oc5n93kni.qnssl.com/blog/buluofuza.gif"><img class="alignnone size-full wp-image-670" src="https://oc5n93kni.qnssl.com/blog/buluofuza.gif" alt="" width="279" height="237" /></a>
 
那么如何实现alloyteam的文字动画呢，其实原理也是利用了stroke-dasharray和stroke-dashoffset，这两个属性不仅可以作用在&lt;path&gt;上，同样可以作用在&lt;text&gt;上。
```html
<symbol id="text">
    <text x="30%" y="35%" class="text">QQ</text>
  </symbol>
 
  <g>
    <use xlink:href="#text"
      class="use-text"></use>
      <use xlink:href="#text"
        class="use-text"></use>
        <use xlink:href="#text"
          class="use-text"></use>
          <use xlink:href="#text"
            class="use-text"></use>
            <use xlink:href="#text"
              class="use-text"></use>
  </g>
 
````

```css
.use-text:nth-child(1) {
      stroke: #360745;
      animation: animation1 8s infinite ease-in-out forwards;
 
}
 
.use-text:nth-child(2) {
      stroke: #D61C59;
      animation: animation2 8s infinite ease-in-out forwards;
 
}
 
.use-text:nth-child(3) {
       stroke: #E7D84B;
       animation: animation3 8s infinite ease-in-out forwards;
 
}
 
.use-text:nth-child(4) {
       stroke: #EFEAC5;
       animation: animation4 8s infinite ease-in-out forwards;
 
}
 
.use-text:nth-child(5) {
      stroke: #1B8798;
      animation: animation5 8s infinite ease-in-out forwards;
}
 
@keyframes animation1 {
       50%{
            stroke-dasharray: 7% 28%;
            stroke-dashoffset: 7%;
       }
       70%{
             stroke-dasharray: 7% 28%;
             stroke-dashoffset: 7%;
       }
}
@keyframes animation2 {
       50%{
           stroke-dasharray: 7% 28%;
           stroke-dashoffset: 14%;
       }
       70%{
            stroke-dasharray: 7% 28%;
            stroke-dashoffset: 14%;
       }
}
@keyframes animation3 {
     50%{
         stroke-dasharray: 7% 28%;
         stroke-dashoffset: 21%;
    }
    70%{
         stroke-dasharray: 7% 28%;
         stroke-dashoffset: 21%;
    }
}
@keyframes animation4 {
       50%{
            stroke-dasharray: 7% 28%;
            stroke-dashoffset: 28%;
       }
       70%{
            stroke-dasharray: 7% 28%;
            stroke-dashoffset: 28%;
       }
}
@keyframes animation5 {
      50%{
           stroke-dasharray: 7% 28%;
           stroke-dashoffset: 35%;
      }
      70%{
           stroke-dasharray: 7% 28%;
           stroke-dashoffset: 35%;
      }
}
 
```

这里用了 5 条完全重合的路径，并且每个路径的颜色和动画效果都不一样。

效果：

[![](https://oc5n93kni.qnssl.com/qq.gif)](https://oc5n93kni.qnssl.com/qq.gif)

<!-- {% endraw %} - for jekyll -->