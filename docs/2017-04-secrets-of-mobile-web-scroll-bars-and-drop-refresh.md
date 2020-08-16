---
title: 移动 web 之滚动篇
date: 2017-04-14
author: TAT.tennylv
source_link: http://www.alloyteam.com/2017/04/secrets-of-mobile-web-scroll-bars-and-drop-refresh/
---

<!-- {% raw %} - for jekyll -->

# 知识点 1: 移动 web 滚动问题

> 在移动端，使用滚动来处理业务逻辑的情况有很多，例如列表的滚动加载数据，下拉刷新等等都需要利用滚动的相关知识，但是滚动事件在不同的移动端机型却又有不同的表现，下面就来一一总结一下。

1.  **滚动事件**：即 onscroll 事件，形成原因通俗解释是当子元素的高度超过父元素的高度时且父元素的高度时定值 window 除外，就会形成滚动条，滚动分为两种：局部滚动和 body 滚动。
2.  **onscroll 方法**： 一般情况下当我们需要监听一个滚动事件时通常会用到 onscroll 方法来监听滚动事件的触发。  
    如果在浏览器上调试这个方法在浏览器上很好用，但是如果跑在手机端就没有想象中的效果了。
3.  **body 滚动**：在移动端如果使用 body 滚动，意思就是页面的高度由内容自动撑大，body 自然形成滚动条，这时我们监听 window.onscroll，发现 onscroll 并没有实时触发，只在手指触摸的屏幕上一直滑动时和滚动停止的那一刻才触发，采用了 wk 内核的 webview 除外。  

    ![](https://qiniu.nihaoshijie.com.cn/QQ20170414-0@2x.png)

    body 滚动  
    ![](https://qiniu.nihaoshijie.com.cn/QQ20170414-1@2x.png)局部滚动
4.  **局部滚动**：在移动端如果使用局部滚动，意思就是我们的滚动在一个固定宽高的 div 内触发，将该 div 设置成 overflow:scroll/auto; 来形成 div 内部的滚动，这时我们监听 div 的 onscroll 发现触发的时机区分 android 和 ios 两种情况，具体可以看下面表格：
5.  **不同机型 onscroll 事件触发情况：**  

    |                  | body 滚动 | 局部滚动   |
    | ---------------- | ------- | ------ |
    | ios              | 不能实时触发  | 不能实时触发 |
    | android          | 实时触发    | 实时触发   |
    | ios wkwebview 内核 | 实时触发    | 实时触发   |
6.  **wkwebview 内核**: 这里说明一下关于 ios 的 wkwebview 内核是 ios 从 ios8 开始提供的新型 webview 内核，和之前的 uiwebview 相比，性能要好，具体大家可以自行查看关于 wkwebview 的相关概念。
7.  **body 滚动和局部滚动 demo**：这里我需要指出的是在采用 wkwebview 内核的页面中 scroll 是可以实时触发的，如果使用的是原本的 uiwebview 则不能够实时触发，手 q 目前使用的是 uiwebview 而新版微信使用的是 wkwebview，大家可以分别使用来尝试一下下面的 demo：  
    ![](https://qiniu.nihaoshijie.com.cn/1492155048.png)局部滚动

    ![](https://qiniu.nihaoshijie.com.cn/1492155773.png)body 滚动  

    分别用 ios 手 q 和微信和 android 手 q 体验会有不同的结果。

# 知识点 2: 关于模拟滚动

1.  有了上面介绍的关于滚动的知识，理解的模拟滚动就不难了。
2.  正常的滚动：我们平时使用的 scroll，包括上面讲的滚动都属于正常滚动，利用浏览器自身提供的滚动条来实现滚动，底层是由浏览器内核控制。
3.  模拟滚动：最典型的例子就是 iscroll 了，原理一般有两种：  
    1). 监听滚动元素的 touchmove 事件，当事件触发时修改元素的 transform 属性来实现元素的位移，让手指离开时触发 touchend 事件，然后采用 requestanimationframe 来在一个线型函数下不断的修改元素的 transform 来实现手指离开时的一段惯性滚动距离。  
    2). 监听滚动元素的 touchmove 事件，当事件触发时修改元素的 transform 属性来实现元素的位移，让手指离开时触发 touchend 事件，然后给元素一个 css 的 animation，并设置好 duration 和 function 来实现手指离开时的一段惯性距离。
4.  这两种方案对比起来各有好处，第一种方案由于惯性滚动的时机时由 js 自己控制所以可以拿到滚动触发阶段的 scrolltop 值，并且滚动的回调函数 onscroll 在滚动的阶段都会触发。
5.  第二种方案相比第一种要劣势一些，区别在于手指离开时，采用的时 css 的 animation 来实现惯性滚动，所以无法直接触发惯性滚动过程中的 onscroll 事件，只有在 animation 结束时才可以借助 animationend 来获取到事件，当然也有一种方法可以实时获取滚动事件，也是借助于 requestanimationframe 来不断的去读取滚动元素的 transform 来拿到 scrolltop 同时触发 onscroll 回调。
6.  关于模拟滚动和正常滚动，两者在性能上差别还是比较明显的，下面时两个 demo，可以扫描体验一下：  
    ![](https://qiniu.nihaoshijie.com.cn/1495680143.png)正常滚动

    ![](https://qiniu.nihaoshijie.com.cn/blog/1495679733.png)模拟滚动  

    衡量滚动是否流畅的指标 fps，我这边也统计了一下正常滚动和模拟滚动的 fps 数据：  

    ![](https://qiniu.nihaoshijie.com.cn/normaltu.jpg)正常滚动  

    ![](https://qiniu.nihaoshijie.com.cn/iscrolltu.jpg)模拟滚动  

    模拟滚动的 fps 值波动较大，这样滚动起来会有明显的卡顿感觉，各位体验的时候如果滚动超过 10 屏之后就可以明显感觉到两着的区别。  

    在使用模拟滚动时，浏览器在 js 层面会消耗更多的性能去改变 dom 元素的位置，在 dom 复杂层级深的页面更为高，所以在长列表滚动时还要使用正常滚动更好。

# 知识点 3: 滚动和下拉刷新

1.  下拉刷新的元素在页面顶部，正常浏览时不可见的。
2.  当在页面顶部往下滚动时出现下拉刷新元素，当手指离开时收起。
3.  以上两点时实现一个下拉刷新组件的基本步骤，结合我们上述关于滚动的描述，我们可以这样实现下拉刷新：  
    ![](https://qiniu.nihaoshijie.com.cn/10AA2031-24A3-4858-BFA9-FF702231FB4C.png)  
    方案 1：借助 iscroll 的原理，整个页面使用模拟滚动，将下拉刷新元素放在顶部，当页面滚动到顶部下拉时，下拉刷新元素随着页面的滚动出现，当手指离开时收回，此方案实现起来较为简单直接借助 iscoll 即可，但是使用了模拟滚动之后在正常的列表滚动时性能上不如正常滚动。  
    方案 2：页面使用正常滚动，将下拉刷新元素放置在顶部 top 值为负值（正常情况下不可见），当页面处于顶部时下拉，这时监听 touchmove 事件，修改 scrollcontent 的 tranlateY 值，同时修改下拉刷新元素的 tranlateY 值，将两者同时位移来将下拉刷新元素显示出来，手指离开时（touchend）收回，这种方案满足了在正常列表滚动时使用原生的滚动节省性能，只在下拉刷新时使用模拟滚动来实现效果。  
    方案 3：方案 2 的改良版，唯一不同是将下拉刷新元素和 scrollcontent 放在一个 div 里，将下拉刷新元素的 margintop 设为负值，在下拉刷新时，只需要修改 scrollcontent 一个元素的 tranlateY 值即可实现下拉，在性能上要比方案 2 好。  
    ![](https://qiniu.nihaoshijie.com.cn/pullrefresh3.gif)
4.  在采用了上述方案之后，还会有一个性能上的问题就是：当页面的列表过长，dom 元素过多时，在模拟滚动，下拉刷新这段时间内，页面也会有卡顿现象，这里采取了一个优化策略即：  
    1) 列表较长时 dom 数量较多时，在触发下拉刷新的时机时将页面视窗之外的 dom 元素隐藏或者存放在 fragment 里面。  
    2) 在刷新完成之后手指离开（touchend）时将隐藏的元素显示出来。  
    3) 需要注意的是，隐藏和显示视窗外的元素这个操作在下拉刷新时只会执行一次，并且只有在下拉刷新时才会执行。

# AlloyPullRefresh

1.  基于上述知识点，我写了一个下拉刷新组件，各位可以参考使用，如有问题，请多多指出！

<https://github.com/AlloyTeam/AlloyPullRefresh/>


<!-- {% endraw %} - for jekyll -->