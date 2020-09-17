---
title: iScroll 学习小结
date: 2015-03-29
author: TAT.lqlongli
source_link: http://www.alloyteam.com/2015/03/iscroll%e5%ad%a6%e4%b9%a0%e5%b0%8f%e7%bb%93/
---

<!-- {% raw %} - for jekyll -->

## 前言

最近项目需要实现一个 fixed 标题栏的功能，很普通的功能，实现核心也是在 sroll 事件中切换到 fixed 状态即可，但是在某些版本 ios 的某些内核中，在惯性滚动过程中不执行任何 js 代码，亦即不会触发 scroll 事件，基本任何事情都做不了，为了解决这个问题不得不使用 div 内滚动，然后使用 iscroll 库实现滚动逻辑。

基于使用过程中的一些问题，抱着学习的态度，稍微看了一下源代码，现把学习所得记录如下。

## 源代码学习

### 核心实现

滑动相关组件（如 swipe 库）的实现基本都是类似的，就是通过 3 个核心事件：touchstart，touchmove，touchend 完成操作。

```html
<span class="keyword">switch</span> ( e.type ) {
    <span class="keyword">case</span> <span class="string">'touchstart'</span>:
    <span class="keyword">case</span> <span class="string">'mousedown'</span>:
        <span class="keyword">this</span>._start(e);
        <span class="keyword">break</span>;
    <span class="keyword">case</span> <span class="string">'touchmove'</span>:
    <span class="keyword">case</span> <span class="string">'mousemove'</span>:
        <span class="keyword">this</span>._move(e);
        <span class="keyword">break</span>;
    <span class="keyword">case</span> <span class="string">'touchend'</span>:
    <span class="keyword">case</span> <span class="string">'mouseup'</span>:
        <span class="keyword">this</span>._end(e);
        <span class="keyword">break</span>;
}
 
```

> 注：下面的源码只罗列核心部分，而且只展示 y 轴方向

touchstart 需要做的事情有：

```html
<span class="keyword">function</span> _start(e) {
    <span class="keyword">var</span> point       = e.touches ? e.touches[<span class="number">0</span>] : e;
    
    <span class="comment">//[1]</span>
    <span class="comment">//初始化相关数据，一般是开始滑动的位置基点，时间基点</span>
    <span class="comment">//还有相关的变量</span>
    <span class="keyword">this</span>.moved      = <span class="keyword">false</span>;
    <span class="keyword">this</span>.distY      = <span class="number">0</span>;
    <span class="keyword">this</span>.directionY = <span class="number">0</span>;
    <span class="keyword">this</span>.startTime  = utils.getTime();
    <span class="keyword">this</span>.startY     = <span class="keyword">this</span>.y;
    <span class="keyword">this</span>.pointY     = point.pageY;
 
    <span class="comment">//[2]</span>
    <span class="comment">//如果正在滑动中，需要对此做处理，一般策略有：</span>
    <span class="comment">//1. 在当前滑动状态的基础上，叠加新的滑动状态</span>
    <span class="comment">//2. 立刻停止当前的滑动，开始新的滑动</span>
    <span class
```


<!-- {% endraw %} - for jekyll -->