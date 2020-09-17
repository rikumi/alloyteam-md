---
title: AlloyTouch 全屏滚动插件发布–30 秒搞定顺滑 H5 页
date: 2016-12-22
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/12/alloytouch-full-screen-scroll-plugin-released-30-seconds-to-get-smooth-page-h5/
---

<!-- {% raw %} - for jekyll -->

原文链接：<https://github.com/AlloyTeam/AlloyTouch/wiki/AlloyTouch-FullPage-Plugin>

先验货  

* * *

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161222110211620-1131519869.png)

插件代码可以在[这里](https://github.com/AlloyTeam/AlloyTouch/blob/master/alloy_touch.full_page.js)找到。

> 注意，虽然是扫码体验，但是 AlloyTouch.FullPage 特意对鼠标滚轮事件进行了兼容，所以 PC 上的全屏滚动页面也可以使用它来快速制作。

使用姿势  

* * *

在设计全屏滚动插件的时候，希望开发者几乎：

-   不用写任何脚本快速生成精致 H5
-   支持 PC 滚轮和移动触摸
-   酷炫的转场动效
-   灵活的时间轴管理
-   一切皆可配置

但是不写脚本肯定没有灵活性咯？！不是的。这里不仅仅可以通过在 HTML 配置一些参数，还可通过插件的回调函数进行一些逻辑注入。就拿上面大家扫码看到的例子的**部分 HTML** 来分析下 AlloyTouch.FullPage 的使用姿势：

```html
 <div id="fullpage">
        <div>
            <div>
                <div class="animated" data-show="bounceInLeft" data-hide="bounceOutLeft">AlloyTouch Introduction</div>
                <div class="animated" data-delay="500" data-show="bounceInUp" data-hide="zoomOut"><img src="asset/alloytouch.png"></div>
                <div class="animated" data-delay="1200" data-show="bounceIn" data-hide="bounceOut">By AlloyTeam</div>
            </div>
        </div>
        
        <div>
            <div>
                <div class="animated"  data-delay="100" data-show="flipInY" data-hide="flipOutY" >Powerful Features</div>
                <div class="animated"  data-delay="400" data-show="zoomIn" data-hide="zoomOut"><img src="asset/power.png"></div>
            </div>
        </div>
        ...
        ...
        ...
 </div>
```

注意，上面只是部分 HTML，而且我已经把一些和插件配置无关的 HTML 去掉了。下面一一进行分析：

-   class="animated" 符合 [animate.css](https://daneden.github.io/animate.css/) 的约定，加上了这个 class 代表会有动画。
-   data-delay 代表滚到该页面之后，被标记的 DOM 元素要等待多久才开始播放动画。如果开发者不标记的话默认值是 0。
-   data-show 代表被标记的 DOM 元素显示的动画类型
-   data-hide 代表被标记的 DOM 元素隐藏的动画类型（这个通常用户看不到，但是为了 show 的时候平滑，一般设置为与 data-show 的相反的类型）

就这么多，配置就这么多，配置就这么多！！够简单把！！  
当然你需要在 js 里面初始化一下：

```javascript
new AlloyTouch.FullPage("#fullpage", {
    animationEnd: function () {},
    leavePage: function (index) {
        console.log("leave" + index);
    },
    beginToPage: function (index) {
        console.log("to" + index);
        pb.to(index / (this.length - 1));
    },
});
```

-   animationEnd 是滚动结束之后的回调函数
-   leavePage 是代表离开某个页面的回调函数
-   beginToPage 代表打算去某个页面的回调函数

上面的 pb 是用来设置 nav 或者 progress 的进度，这个可以先不用管。如果有需要的话，用户可以自己封装任意的进度条组件。

原理分析  

* * *

这里主要抽取了 AlloyTouch.FullPage 的核心代码进行分析：


<!-- {% endraw %} - for jekyll -->