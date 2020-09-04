---
title: 移动 web 适配利器 - rem
date: 2016-03-27
author: TAT.tennylv
source_link: http://www.alloyteam.com/2016/03/mobile-web-adaptation-tool-rem/
---

<!-- {% raw %} - for jekyll -->

前言  

* * *

提到 rem，大家首先会想到的是 em，px，pt 这类的词语，大多数人眼中这些单位是用于设置字体的大小的，没错这的确是用来设置字体大小的，但是对于 rem 来说它可以用来做移动端的响应式适配哦。

兼容性  

* * *

![](http://7jpp2v.com1.z0.glb.clouddn.com/0a269f05e4fb51f561d060eb24e864b11458889628.png)

  先看看兼容性，关于移动端

ios：6.1 系统以上都支持

android：2.1 系统以上都支持

大部分主流浏览器都支持，可以安心的往下看了。

rem 设置字体大小  

* * *

rem 是（font size of the root element），官方解释

![](http://7jpp2v.com1.z0.glb.clouddn.com/QQ%E5%9B%BE%E7%89%8720160313181850.png)，

意思就是根据网页的根元素来设置字体大小，和 em（font size of the element）的区别是，em 是根据其父元素的字体大小来设置，而 rem 是根据网页的跟元素（html）来设置字体大小的，举一个简单的例子，

现在大部分浏览器 IE9+，Firefox、Chrome、Safari、Opera ，如果我们不修改相关的字体配置，都是默认显示 font-size 是 16px 即

```css
html {
    font-size:16px;
}
```

那么如果我们想给一个 P 标签设置 12px 的字体大小那么用 rem 来写就是

```css
p {
    font-size: 0.75rem; //12÷16=0.75（rem）
}
```

基本上使用 rem 这个单位来设置字体大小基本上是这个套路，好处是假如用户自己修改了浏览器的默认字体大小，那么使用 rem 时就可以根据用户的调整的大小来显示了。 但是 rem 不仅可以适用于字体，同样可以用于 width height margin 这些样式的单位。下面来具体说一下

rem 进行屏幕适配  

* * *

在讲 rem 屏幕适配之前，先说一下一般做移动端适配的方法，一般可以分为： 

**1**  简单一点的页面，一般高度直接设置成固定值，宽度一般撑满整个屏幕。

**2**  稍复杂一些的是利用百分比设置元素的大小来进行适配，或者利用 flex 等 css 去设置一些需要定制的宽度。

**3**  再复杂一些的响应式页面，需要利用 css3 的 media query 属性来进行适配，大致思路是根据屏幕不同大小，来设置对应的 css 样式。

上面的一些方法，其实也可以解决屏幕适配等问题，但是既然出来的 rem 这个新东西，也一定能兼顾到这些方面，下面具体使用 rem：

**rem 适配**

先看一个简单的例子：

```css
.con {
      width: 10rem;
      height: 10rem;
      background-color: red;
 }
<div class="con">
        
</div>
```

![](http://7jpp2v.com1.z0.glb.clouddn.com/div.png)

这是一个 div，宽度和高度都用 rem 来设置了，在浏览器里面是这样显示的，   可以看到，在浏览器里面 width 和 height 分别是 160px，正好是 16px \* 10, 那么如果将 html 根元素的默认 font-size 修改一下呢？

```css
html {
    font-size: 17px;
}
.con {
      width: 10rem;
      height: 10rem;
      background-color: red;
 }
<div class="con">
        
</
```


<!-- {% endraw %} - for jekyll -->