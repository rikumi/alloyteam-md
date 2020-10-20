---
title: CSSStickyFooter—— 当内容不足一屏时 footer 紧贴底部
date: 2015-04-22
author: TAT.ycxu
source_link: http://www.alloyteam.com/2015/04/cssstickyfooter-%e5%bd%93%e5%86%85%e5%ae%b9%e4%b8%8d%e8%b6%b3%e4%b8%80%e5%b1%8f%e6%97%b6footer%e7%b4%a7%e8%b4%b4%e5%ba%95%e9%83%a8/
---

<!-- {% raw %} - for jekyll -->

一般来说我们的 footer 是跟着内容走的，所以当内容较少不足一屏的时候，footer 也会跟着内容往上走，导致下面一段空白。所以这里我们来探讨下当内容不足一屏时 footer 也要紧贴底部的情况，因为比较难以描述，所以干脆使用了英文标题，要实现的效果如下：

第一个和第三个为正常不处理的情况，第二个和第三个是我们要实现的情况

![](http://7tszky.com1.z0.glb.clouddn.com/FuHVM5gtpt-9u-4tmoRuBm-84n__)

以前因为要兼容 ie7-，所以对结构比较有要求，实现起来也比较复杂。这里我们先讨论下 ie8 + 的情况，然后在来讨论下更高级的 flex 实现。

## ie8+

实现思路为：设置 body 最小高度为 100%，相对定位，然后空出底部的高度，关键是要设置盒模型 box-sizing 为 border-box 或 padding-box，最后将 footer 绝对定位在底部即可。

html 代码如下：

```html
&lt;body>
    ...
    &lt;div &lt;span class="keyword">class&lt;/span>=&lt;span class="string">"footer"&lt;/span>>&lt;/div>
&lt;/body>
 
```

css 代码如下：

```html
html{
    height: &lt;span class="number">100&lt;/span>%;
}
body{
    min-height: &lt;span class="number">100&lt;/span>%; &lt;span class="comment">/* 设置最小高度100% */&lt;/span>
    position: relative; &lt;span class="comment">/* 设置最小高度100% */&lt;/span>
    box-sizing: border-box; &lt;span class="comment">/* 设置盒模型为border-box，那样这个100%包括了下面的padding-bottom高度 */&lt;/span>
    padding-bottom: &lt;span class="number">120&lt;/span>px; &lt;span class="comment">/* 高度为footer的高度 */&lt;/span>
}
.footer{
    position: absolute; &lt;span class="comment">/* 将footer绝对定位在底部 */&lt;/span>
    left: &lt;span class="number">0&lt;/span>;
    bottom: &lt;span class="number">0&lt;/span>;
    width: &lt;span class="number">100&lt;/span>%;
    height: &lt;span class="number">120&lt;/span>px;
}
 
```

## flex

flex 实现其实比上面的要求更严格，上面的几乎对结构没要求，而 flex 则对 footer 的兄弟元素是有要求的。

主要思路是设置 flex 的方向为垂直方向，然后设置内容占满其余的空间

html 代码如下：

```html
&lt;body>
    &lt;div &lt;span class="keyword">class&lt;/span>=&lt;span class="string">"header"&lt;/span>>&lt;/div>
    &lt;div &lt;span class="keyword">class&lt;/span>=&lt;span class="string">"container"&lt;/span>>&lt;/div>
    &lt;div &lt;span class="keyword">class&lt;/span>=&lt;span class="string">"footer"&lt;/span>>&lt;/div>
&lt;/body>
 
```

css 代码如下：

```html
html{
    height: &lt;span class="number">100&lt;/span>%;
}
body{
    min-height: &lt;span class="number">100&lt;/span>%;
    display: flex; &lt;span class="comment">/* 设置flex */&lt;/span>
    flex-direction: column; &lt;span class="comment">/* 方向为垂直方向 */&lt;/span>
}
.container{
    flex: &lt;span class="number">1&lt;/span>; &lt;span class="comment">/* 内容占满所有剩余空间 */&lt;/span>
}
```


<!-- {% endraw %} - for jekyll -->