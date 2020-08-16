---
title: CSSStickyFooter—— 当内容不足一屏时 footer 紧贴底部
date: 2015-04-22
author: TAT.ycxu
source_link: http://www.alloyteam.com/2015/04/cssstickyfooter-%e5%bd%93%e5%86%85%e5%ae%b9%e4%b8%8d%e8%b6%b3%e4%b8%80%e5%b1%8f%e6%97%b6footer%e7%b4%a7%e8%b4%b4%e5%ba%95%e9%83%a8/
---

一般来说我们的 footer 是跟着内容走的，所以当内容较少不足一屏的时候，footer 也会跟着内容往上走，导致下面一段空白。所以这里我们来探讨下当内容不足一屏时 footer 也要紧贴底部的情况，因为比较难以描述，所以干脆使用了英文标题，要实现的效果如下：

第一个和第三个为正常不处理的情况，第二个和第三个是我们要实现的情况

![](http://7tszky.com1.z0.glb.clouddn.com/FuHVM5gtpt-9u-4tmoRuBm-84n__)

以前因为要兼容 ie7-，所以对结构比较有要求，实现起来也比较复杂。这里我们先讨论下 ie8 + 的情况，然后在来讨论下更高级的 flex 实现。

## ie8+

实现思路为：设置 body 最小高度为 100%，相对定位，然后空出底部的高度，关键是要设置盒模型 box-sizing 为 border-box 或 padding-box，最后将 footer 绝对定位在底部即可。

html 代码如下：

```html
<body>
    ...
    <div <span class="keyword">class</span>=<span class="string">"footer"</span>></div>
</body>
 
```

css 代码如下：

```html
html{
    height: <span class="number">100</span>%;
}
body{
    min-height: <span class="number">100</span>%; <span class="comment">/* 设置最小高度100% */</span>
    position: relative; <span class="comment">/* 设置最小高度100% */</span>
    box-sizing: border-box; <span class="comment">/* 设置盒模型为border-box，那样这个100%包括了下面的padding-bottom高度 */</span>
    padding-bottom: <span class="number">120</span>px; <span class="comment">/* 高度为footer的高度 */</span>
}
.footer{
    position: absolute; <span class="comment">/* 将footer绝对定位在底部 */</span>
    left: <span class="number">0</span>;
    bottom: <span class="number">0</span>;
    width: <span class="number">100</span>%;
    height: <span class="number">120</span>px;
}
 
```

## flex

flex 实现其实比上面的要求更严格，上面的几乎对结构没要求，而 flex 则对 footer 的兄弟元素是有要求的。

主要思路是设置 flex 的方向为垂直方向，然后设置内容占满其余的空间

html 代码如下：

```html
<body>
    <div <span class="keyword">class</span>=<span class="string">"header"</span>></div>
    <div <span class="keyword">class</span>=<span class="string">"container"</span>></div>
    <div <span class="keyword">class</span>=<span class="string">"footer"</span>></div>
</body>
 
```

css 代码如下：

```html
html{
    height: <span class="number">100</span>%;
}
body{
    min-height: <span class="number">100</span>%;
    display: flex; <span class="comment">/* 设置flex */</span>
    flex-direction: column; <span class="comment">/* 方向为垂直方向 */</span>
}
.container{
    flex: <span class="number">1</span>; <span class="comment">/* 内容占满所有剩余空间 */</span>
}
```