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
    <span class="comment">//iscroll使用的是方案2</span>
    <span class="comment">//方案1对于状态处理，滑速计算等方面略偏复杂，但这是更加合理的处理策略（原生的scroll也是这样的）</span>
    <span class="comment">//这有点类似开车时踩油门的场景，想象一下就清楚了。。。</span>
    <span class="keyword">if</span> ( !<span class="keyword">this</span>.options.useTransition && <span class="keyword">this</span>.isAnimating ) {
        <span class="keyword">this</span>.isAnimating = <span class="keyword">false</span>;
        <span class="keyword">this</span>._execEvent(<span class="string">'scrollEnd'</span>);
    }
}
 
```

touchmove 需要做的事情有：

```html
<span class="keyword">function</span> _move(e) {
    <span class="comment">//[1]</span>
    <span class="comment">//计算位置和时间，各种增量</span>
    <span class="keyword">var</span> point       = e.touches ? e.touches[<span class="number">0</span>] : e,
        deltaY      = point.pageY - <span class="keyword">this</span>.pointY,
        timestamp   = utils.getTime(),
        newY, absDistY;
 
    <span class="keyword">this</span>.pointY     = point.pageY;
    <span class="keyword">this</span>.distY      += deltaY;
    absDistY        = Math.abs(<span class="keyword">this</span>.distY);
    
    <span class="comment">//[2]</span>
    <span class="comment">//判定是否是标准滑动，防止手抖干扰</span>
    <span class="comment">//干扰有时候是很大的，特别是有惯性滑动逻辑的时候就更甚了，所以这个细节是少不了的</span>
    <span class="keyword">if</span> ( timestamp - <span class="keyword">this</span>.endTime > <span class="number">300</span> && (absDistX < <span class="number">10</span> && absDistY < <span class="number">10</span>) ) {
        <span class="keyword">return</span>;
    }
 
    newY = <span class="keyword">this</span>.y + deltaY;
 
    <span class="comment">//[3]</span>
    <span class="comment">//判断滑动是否超出范围了</span>
    <span class="comment">//自从ios出现了负向滚动效果之后，各种滑动组件都跟着实现了这种bounce效果</span>
    <span class="keyword">if</span> ( newY > <span class="number">0</span> || newY < <span class="keyword">this</span>.maxScrollY ) {
        newY = <span class="keyword">this</span>.options.bounce ? <span class="keyword">this</span>.y + deltaY / <span class="number">3</span> : newY > <span class="number">0</span> ? <span class="number">0</span> : <span class="keyword">this</span>.maxScrollY;
    }
 
    <span class="comment">//[4]</span>
    <span class="comment">//触发scrollStart事件</span>
    <span class="comment">//一个健全的组件肯定有相关的插口，一般都是用事件机制实现的</span>
    <span class="comment">//这里的细节是，开始事件是要在判定为标准滑动才会触发的，并且只触发一次</span>
    <span class="comment">//如果考虑不细的话，很容易会在touchstart事件中触发事件</span>
    <span class="keyword">if</span> ( !<span class="keyword">this</span>.moved ) {
        <span class="keyword">this</span>._execEvent(<span class="string">'scrollStart'</span>);
    }
 
    <span class="keyword">this</span>.moved = <span class="keyword">true</span>;
 
    <span class="comment">//[5]</span>
    <span class="comment">//万事俱备，让页面(元素)滑过去吧！</span>
    <span class="keyword">this</span>._translate(newX, newY);
}
 
```

touchend 需要做的事情有：

```html
<span class="keyword">function</span> _end(e) {
    <span class="comment">//[1]</span>
    <span class="comment">//进行必要的计算</span>
    <span class="keyword">var</span> duration = utils.getTime() - <span class="keyword">this</span>.startTime,
        newY = Math.round(<span class="keyword">this</span>.y),
        distanceY = Math.abs(newY - <span class="keyword">this</span>.startY);
 
    <span class="keyword">this</span>.endTime = utils.getTime();
 
    <span class="comment">//[2]</span>
    <span class="comment">//最后的位置也要滑过去</span>
    <span class="keyword">this</span>.scrollTo(newX, newY);  <span class="comment">// ensures that the last position is rounded</span>
 
    <span class="comment">//[3]</span>
    <span class="comment">//实现惯性滑动</span>
    <span class="keyword">if</span> ( <span class="keyword">this</span>.options.momentum && duration < <span class="number">300</span> ) {
        momentumY = <span class="keyword">this</span>.hasVerticalScroll ? utils.momentum(<span class="keyword">this</span>.y, <span class="keyword">this</span>.startY, duration, <span class="keyword">this</span>.maxScrollY, <span class="keyword">this</span>.options.bounce ? <span class="keyword">this</span>.wrapperHeight : <span class="number">0</span>, <span class="keyword">this</span>.options.deceleration) : { destination: newY, duration: <span class="number">0</span> };
        newY = momentumY.destination;
        time = Math.max(momentumX.duration, momentumY.duration);
        <span class="keyword">this</span>.isInTransition = <span class="number">1</span>;
    }
    
    <span class="keyword">if</span> ( newX != <span class="keyword">this</span>.x || newY != <span class="keyword">this</span>.y ) {
        <span class="keyword">this</span>.scrollTo(newX, newY, time, easing);    
        <span class="keyword">return</span>;
    }
 
    <span class="comment">//[4]</span>
    <span class="comment">//触发滑动结束事件</span>
    <span class="keyword">this</span>._execEvent(<span class="string">'scrollEnd'</span>);
}
 
```

基本所有滑动相关的组件所做的事情都是这些，都可以借鉴一二的。

### 特殊 css prefix 缓存

用 js 处理特殊 css 的时候，可以先缓存 prefix，这样就不用每次都操作所有的内置属性

```html
<span class="keyword">var</span> _elementStyle = document.createElement(<span class="string">'div'</span>).style;
<span class="keyword">var</span> _vendor = (<span class="keyword">function</span> () {
    <span class="keyword">var</span> vendors = [<span class="string">'t'</span>, <span class="string">'webkitT'</span>, <span class="string">'MozT'</span>, <span class="string">'msT'</span>, <span class="string">'OT'</span>],
        transform,
        i = <span class="number">0</span>,
        l = vendors.length;
 
    <span class="keyword">for</span> ( ; i < l; i++ ) {
        transform = vendors[i] + <span class="string">'ransform'</span>;
        <span class="keyword">if</span> ( transform in _elementStyle ) <span class="keyword">return</span> vendors[i].substr(<span class="number">0</span>, vendors[i].length-<span class="number">1</span>);
    }
 
    <span class="keyword">return</span> <span class="keyword">false</span>;
})();
 
<span class="keyword">function</span> _prefixStyle (style) {
    <span class="keyword">if</span> ( _vendor === <span class="keyword">false</span> ) <span class="keyword">return</span> <span class="keyword">false</span>;
    <span class="keyword">if</span> ( _vendor === <span class="string">''</span> ) <span class="keyword">return</span> style;
    <span class="keyword">return</span> _vendor + style.charAt(<span class="number">0</span>).toUpperCase() + style.substr(<span class="number">1</span>);
}
 
```

### 事件绑定

addEventListener 绑定事件可以传入一个对象而不是一个 cb 函数，事件触发的时候，就会调用该对象的 handleEvent 方法来处理事件。例如：

```html
<span class="keyword">var</span> event = {
    handleEvent: <span class="keyword">function</span>(e) {
        <span class="keyword">switch</span> ( e.type ) {
            <span class="keyword">case</span> <span class="string">'touchstart'</span>:
                <span class="keyword">this</span>._start(e);
                <span class="keyword">break</span>;
            <span class="keyword">case</span> <span class="string">'touchmove'</span>:
                <span class="keyword">this</span>._move(e);
                <span class="keyword">break</span>;
            <span class="keyword">case</span> <span class="string">'touchend'</span>:
                <span class="keyword">this</span>._end(e);
                <span class="keyword">break</span>;
        }
    },
    _start: <span class="keyword">function</span>() {},
    _move: <span class="keyword">function</span>() {},
    _end: <span class="keyword">function</span>() {}
}
el.addEventListener(<span class="string">'touchstart'</span>, event);
el.addEventListener(<span class="string">'touchmove'</span>, event);
el.addEventListener(<span class="string">'touchend'</span>, event);
 
```

这种绑定方式的优点有：

1.  删除事件方便
2.  事件集中处理
3.  程序结构清晰

还记得那种绑定事件时 bind (this) 的日子吗。。。  
这种方式也方便了实现事件代理

### 事件触发频率调整

对于一些触发频率较高的事件，我们通常会控制一下事件处理的频率，例如 scroll，resize 事件。  
另一方面，在实现一个公共组件的时候可以考虑从组件本身来解决这个问题，iScroll 通过配置来设置 scroll 事件的触发频率

```html
<span class="comment">//下面代码在_move方法里</span>
<span class="comment">//probeType == 1 则300ms才会触发一次scroll</span>
<span class="keyword">if</span> ( timestamp - <span class="keyword">this</span>.startTime > <span class="number">300</span> ) {
    <span class="keyword">this</span>.startTime = timestamp;
 
    <span class="keyword">if</span> ( <span class="keyword">this</span>.options.probeType == <span class="number">1</span> ) {
        <span class="keyword">this</span>._execEvent(<span class="string">'scroll'</span>);
    }
}
 
<span class="comment">//probeType > 1 则一直触发</span>
<span class="keyword">if</span> ( <span class="keyword">this</span>.options.probeType > <span class="number">1</span> ) {
    <span class="keyword">this</span>._execEvent(<span class="string">'scroll'</span>);
}
 
```

## 缺点与使用问题

下面是针对版本 5.1.3 的 iscroll 使用过程中的一些问题

### 1. 没有插件版

iScroll 没有 zepto/jquery 插件版本，一些基础方法都需要自己实现，导致了库的体积偏大。

### 2. 没有暴露停止滑动（惯性滑动）的接口

通过查看源代码找到了停止滑动的方法，如下：

```html
<span class="keyword">var</span> iScroll = <span class="keyword">new</span> IScroll({ <span class="comment">/* ... */</span> });
<span class="comment">//直接通过修改iScroll对象的状态来停止滑动</span>
<span class="comment">//通过这种方式停止动画是不会触发scrollEnd事件的！</span>
iScroll.isAnimating = <span class="keyword">false</span> 
 
```

### 3. 调用 scrollTo 方法不会触发 scroll 事件

可以通过 scrollTo 方法来手动滑动，但是这样的滑动过程是不会触发 scroll 事件的。

## 总结

在使用 iScroll 的过程中遇到不少坑，但使用起来还是比较容易的，文档也比较齐全。  
iScroll 在实现上也非常成熟，里面许多实现细节都是值得学习的


<!-- {% endraw %} - for jekyll -->