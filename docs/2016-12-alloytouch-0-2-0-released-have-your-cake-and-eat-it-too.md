---
title: AlloyTouch 0.2.0 发布– 鱼和熊掌兼得
date: 2016-12-28
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/12/alloytouch-0-2-0-released-have-your-cake-and-eat-it-too/
---

<!-- {% raw %} - for jekyll -->

原文链接：<https://github.com/AlloyTeam/AlloyTouch/wiki/AlloyTouch-0.2.0>

背景  

* * *

公司师姐昨日在 KM 发了篇长文，主要结论 RAF+transform3d 就是不如 transition+transform3d 平滑流畅，但是 transition+transform3d 没有 translate 属性变更 change 回调，只有 transitionend 的事件回调。最后得出的解决方案：

支持动态切换 raf 和 transition\~~

AlloyTouch 在这个基础上更加激进，直接支持 change 事件，不用用户去关系 RAF 还是 transition，也不用用户去手动切换。那么是怎么做到了？往下看。

主要更新  

* * *

**AlloyTouch CSS 版本已经支持 change 事件回调了**

鱼和熊掌兼得！慢，什么是鱼？什么是熊掌？  
鱼，性能。由于 RAF+transform3d 就是不如 transition+transform3d 平滑流畅。CSS 版本在处理 DOM 局部滚动的时候明显更加 smooth。

熊掌，change 回调。以前使用 CSS 版本是无法监听到 dom 的 translate 属性变更 change 回调，只有 transitionend 的事件回调。

现在鱼和熊掌可以兼得！

举个例子  

* * *

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161228104220726-1650383152.png)

-   访问 DEMO 你也可以[点击这里](http://alloyteam.github.io/AlloyTouch//refresh/infinite/kandian.html)
-   源代码可以[点击这里](https://github.com/AlloyTeam/AlloyTouch/blob/master/refresh/infinite/kandian.html)

这里就是使用 CSS 版本制作的，而且滚动过程中可以执行 chang 回调，所以头部的动画都在在 change 回调里进行处理的。  
注意，这里只是个 DEMO 页面，用来展示头部的动画，底部显示正在加载中是加载不出来数据的，所以不用等待了。

原理分析  

* * *

-   用户 touchstart 的时候开启 RAF 定时器
-   定时器一直计算读取滚动元素的 translate 属性，并抛给用户传入的 change 事件
-   transitionend 的时候关闭 RAF 定时器

对，就是这么简单！

代码分析  

* * *

```javascript
...
...
_start: function (evt) {
    cancelAnimationFrame(this.tickID);
    this._tick();
...
...
_tick: function () {
    this.change.call(this, this.getComputedPosition());
    this.tickID = requestAnimationFrame(this._tick.bind(this));
},
...
```

touchstart 的时候会去触发\_start 事件，先去 cancelAnimationFrame 取消掉当前的循环，再重新开启一个，滚动点停。还可以看到，在不断 tick 的过程中，change 函数是一直会被执行，而且计算出的 translate 会传给 change 回调。再看 getComputedPosition：

```javascript
getComputedPosition: function () {
    var matrix = window.getComputedStyle(this.scroller, null);
    matrix = matrix[transform].split(')')[0].split(', ');
    return this.vertical ? (+(matrix[13] || matrix[5])) : (+(matrix[12] || matrix[4]));
},
```

这里会通过 getComputedStyle 去计算出滚动 DOM 的 matrix，然后提取出 translate 出来。

读取

```javascript
...
...
if (this.step) {
    this.correction();
    if (this._endCallbackTag) {
        this._endTimeout = setTimeout(function () {
            this.animationEnd.call(this, current);
            cancelAnimationFrame(this.tickID);
        }.bind(this), 400);
        this._endCallbackTag = false;
    }
} else {
    this.animationEnd.call(this, current);
    cancelAnimationFrame(this.tickID);
}
...
```

当触发了\_transitionEnd 之后，会去清除定时器。这里需要注意，当用户传了 step 配置，会延迟 400ms 清除定时器，因为校正 step 的过程需要 400ms。

Q&A  

* * *

问：那么非 CSS 版本还有存在的意义吗？  
答：有的，因为非 CSS 不仅仅可以用于 DOM, 还能用于 WebGL、Canvas，并且运动属性无关。CSS 版本没有这些功能。

问：AlloyTouch 如何做到这么小的尺寸？  
答：AlloyTouch 专注于数字的加速减速和回弹，抽象级别较高，而且适用场景较广。

问：有没有出 React 版本的计划？  
这个正在计划当中，但是事实上，不是所有页面都适合 React，比如无限滚动，不使用 React 性能会更优。有的时候要在体验最优和工程化最优做一个权衡，如果体验达不到预期，要学会放弃工程化最优的方案。

问：AlloyTouch 和 transformjs 什么关系？  
没有关系。AlloyTouch 专注于触摸和运动，transformjs 提供 DOM 和任意对象 transformation 能力以及一些基础工具函数。  
但是建议一起使用。这里需要注意的是，CSS 版本的 AlloyTouch 强制必须和 transformjs 一起使用。

开始 AlloyTouch  

* * *

Github：<https://github.com/AlloyTeam/AlloyTouch>

任何意见和建议欢迎 [new issue](https://github.com/AlloyTeam/AlloyTouch/issues)，我们会第一时间反馈。  


<!-- {% endraw %} - for jekyll -->