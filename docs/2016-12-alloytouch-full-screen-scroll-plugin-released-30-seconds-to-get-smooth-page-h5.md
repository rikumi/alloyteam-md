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

```javascript
new AlloyTouch({
    touch: this.parent,
    target: this.parent,
    property: "translateY",
    min: (1 - this.length) * this.stepHeight,
    max: 0,
    step: this.stepHeight,
    inertia: false,
    bindSelf: true,
    touchEnd: function (evt, v, index) {
        var step_v = index * this.step * -1;
        var dx = v - step_v;
        if (v < this.min) {
            this.to(this.min);
        } else if (v > this.max) {
            this.to(this.max);
        } else if (Math.abs(dx) < 30) {
            this.to(step_v);
        } else if (dx > 0) {
            self.prev();
        } else {
            self.next();
        }
        return false;
    },
    animationEnd: function () {
        option.animationEnd.apply(this, arguments);
        self.moving = false;
    },
});
```

-   这里触摸和运动的 Dom 都是 fullpage 的 dom，也就是上面的 this.parent
-   因为是上下滚动，所以运动的属性是 translateY
-   min 可以通过 window.innerHeight 和总共的页数推算出来，this.stepHeight 就是 window.innerHeight
-   max 显然就是 0
-   step 显然就是 window.innerHeight，也就是 this.stepHeight
-   inertia: false 代表把惯性运动禁止掉，也就是用户松手和不会惯性滚动
-   bindSelf 是意思是 touchmove 和 touchend 以及 touchcancel 都绑定在 this.parent 自己，而非 window 下。不设置 bindSelf 的话 touchmove 和 touchend 以及 touchcancel 都绑定在 window 下。

> 这里需要特别详细说下，这个 bindSelf 配置非常有用，比如很典型的应用场景就是解决 AlloyTouch 嵌套 AlloyTouch 的问题。比如你上面扫码看到的例子里面，嵌套了 AlloyTouch 的 Demo 如下所示：  
> ![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161222110224151-1675751079.png)  
> 这里其实是嵌套的滚动。滚动里面的会导致外面的也滚动？怎么解决？里面的滚动必须加上 bindSelf 并且阻止冒泡：

且看内部滚动的详细代码：

```javascript
var scroller = document.querySelector("#scroller");
Transform(scroller, true);
new AlloyTouch({
    touch: "#demo0",
    target: scroller,
    property: "translateY",
    min: 250 - 2000,
    max: 0,
    touchStart: function (evt) {
        evt.stopPropagation();
    },
    touchMove: function (evt) {
        evt.stopPropagation();
    },
    bindSelf: true,
});
```

这样的话，嵌套的 HTML 里面的嵌套的 AlloyTouch 就不会向上冒泡了，也就是滚动里面的就不会触发外面的滚动。

继续分析 FullPage 源码：  
touchEnd 是用户手指离开屏幕之后的回调函数。里面有边界处理的逻辑：

-   超出 min 和 max 都会对应的校正会 min 和 max。
-   step 校正，绝对值小于 30px 会复位
-   step 校正，绝对值大于 30px 且大于 0 会去上一页
-   step 校正，绝对值大于 30px 且小于 0 会去下一页
-   return false 代表不会去运行 AlloyTouch 松开手后的运动校正逻辑，这点很重要

animationEnd 就是运动结束之后的回调函数，会去执行用户从 AlloyTouch.FullPage 传递过来的 animationEnd，并且把 moving 设置为 false

开启 AlloyTouch.FullPage 之旅  

* * *

Github：<https://github.com/AlloyTeam/AlloyTouch>  
任何意见和建议欢迎 [new issue](https://github.com/AlloyTeam/AlloyTouch/issues)，我们会第一时间反馈。  


<!-- {% endraw %} - for jekyll -->