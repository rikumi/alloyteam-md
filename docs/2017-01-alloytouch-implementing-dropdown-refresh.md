---
title: AlloyTouch 实现下拉刷新
date: 2017-01-09
author: TAT.dnt
source_link: http://www.alloyteam.com/2017/01/alloytouch-implementing-dropdown-refresh/
---

<!-- {% raw %} - for jekyll -->

原文地址:<https://github.com/AlloyTeam/AlloyTouch/wiki/Pull-to-refresh>

效果展示  

* * *

![](http://images2015.cnblogs.com/blog/105416/201701/105416-20170109114535869-1708764997.gif)

你也可以[点击这里](http://alloyteam.github.io/AlloyTouch/refresh/pull_refresh/)访问 Demo  
可以[点击这里](https://github.com/AlloyTeam/AlloyTouch/blob/master/refresh/pull_refresh/index.html)查看代码

扫码体验  

* * *

![](http://images2015.cnblogs.com/blog/105416/201701/105416-20170109114542306-160399788.png)

背景  

* * *

在手机 QQ 内部，其实客户端提供了下拉刷新的能力，拖动整个 webview 进行下拉刷新，loading 以及 loading 相关的 wording 和动画都是客户端的。解决了一部分需要下拉场景的问题。但是在某些场景下，还是需要 web 拥有自身的下拉刷新的能力。比如：

-   需要统一 IOS 和安卓的体验
-   需要自定义下拉刷新动画
-   需要已 web 内的背景或者其他 Dom 元素有联动交互反馈

而拖动整个 webview 的下拉刷新无法满足这些场景。AlloyTouch 很明显非常擅长处理 web 下拉刷新的需求。

页面骨架实现  

* * *

![](http://images2015.cnblogs.com/blog/105416/201701/105416-20170109114556181-1378926254.png)

pullRefresh 在 AlloyTouch header 的下面，其中：  
header zIndex > pullRefresh zIndex >wrapper 和 scroller 的 zIndex。

下拉动画实现  

* * *

看以看到，下拉到一定程度，箭头有个旋转动画，以及 wording 描述也会变化。这里主要利用 js 去切换 class 去实现，动画使用 CSS transition 实现。所以要预先定义好两种 class。

```css
.arrow {
    margin-top: 5px;
    margin-bottom: 5px;
}
 
.arrow:after {
    content: "Pull to refresh";
}
    
.arrow_up.arrow:after {
    content: "Release to refresh";
}
 
.arrow_up img {
    transform: rotateZ(180deg);
    -webkit-transform: rotateZ(180deg);
}
 
.pull_refresh img {
    width: 20px;
    transition: transform .4s ease;
}
```

通过上面定要好的 class，在 js 逻辑里面只需要负责 remove 和 add arrow_up clas 便可以实现箭头旋转和 wording 的切换。

Loading 动画实现  

* * *

```html
<svg width='40px' height='40px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-default">
    <rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#00a9f2' transform='rotate(0 50 50) translate(0 -30)'>
        <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0s' repeatCount='indefinite' />
    </rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#00a9f2' transform='rotate(30 50 50) translate(0 -30)'>
        <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.08333333333333333s' repeatCount='indefinite' />
       ...
       ...
</svg>
```

loading 效果使用 SVG 去实现，利用 12 个 rect 的 indefinite animate 去实现。begin 代表开始时间有个递增达到 loading 的效果。

核心实现  

* * *


<!-- {% endraw %} - for jekyll -->