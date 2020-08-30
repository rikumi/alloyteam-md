---
title: 一分钟搞定 AlloyTouch 图片轮播组件
date: 2016-12-12
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/12/a-minutes-alloytouch-picture-carousel-component/
---

<!-- {% raw %} - for jekyll -->

轮播图也涉及到触摸和触摸反馈，同时，AlloyTouch 可以把惯性运动打开或者关闭，并且设置 min 和 max 为运动区域，超出会自动回弹。  
除了一般的竖向滚动，AlloyTouch 也可以支持横向滚动，甚至任何属性的运动，因为它的设计的本质就是属性无关，触摸可以反馈到任何属性的运动。所以 [AlloyTouch](https://github.com/AlloyTeam/AlloyTouch) 制作各种各样的轮播组件还是得心应手。

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161209125418429-1113660217.gif)

第一种轮播图如上图所示。下面开始实现的过程。

第 0 秒  

* * *

```css
<div id="carousel-container">
    <div class="carousel">
        <div class="carousel-scroller" id="carousel-scroller">
            <img style="width: 88%;" src="asset/ci1.jpg">
            <img style="width: 88%;" src="asset/ci2.jpg">
            <img style="width: 88%;" src="asset/ci3.jpg">
            <img style="width: 88%;" src="asset/ci4.jpg">
            <img style="width: 88%;" src="asset/ci5.jpg">
        </div>
 
    </div>
</div>
```

一共五张图，每张图占有屏幕比例的百分之 88，所以用户的屏幕里可以看到一张多一点的图片，给用户可以横向滑动查看的感觉。

第 10 秒  

* * *

````html

```html
<script src="../transformjs/transform.js"></script>
````

```html
<script src="../alloy_touch.js"></script>
```

```html
<script>
    var scroller = document.querySelector("#carousel-scroller");
    Transform(scroller); 
</script>
```

````

通过 Transform(scroller); 注入 CSS3 transform 属性。

第 20 秒  

---------

```c
new AlloyTouch({
    touch: "#carousel-container",//反馈触摸的dom
    vertical: false,// 监听用户横向触摸
    target: scroller, //运动的对象
    property: "translateX",  //被运动的属性
    min:0.88 * window.innerWidth * -5 + window.innerWidth, 
    max: 0
})
````

这里最大的难点（其实也没有什么难的），就是就是 min 的值。因为初始值是 0，所有向左边滑动一定是负值。可以得到 max 一定是 0。  
那么 min 的值就是： 屏幕的宽度－图片的张数\*图片的宽度

-   图片的宽度为 0.88 \* window.innerWidth
-   屏幕的宽度为 window.innerWidth
-   图片的张数为 5

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161209125531413-1028411634.gif)

第 30 秒  

* * *

如上图所示，相对于传统的 swipe 然后再去触发滚动，上面的跟手然后再去校正的体验是更加良好的。那么怎么实现呢？  
首先，AlloyTouch 是支持 step 配置。

```javascript
new AlloyTouch({
    step: 100，
    ...
    ...
    ...
})
```

只要用户设置的 step，最后运动结束之后，AlloyTouch 都会帮用户校正到最接近的 step 的整数倍的位置。  
比如上面是 100：

-   如果运动的对象停在 120，会被校正到 100
-   如果运动的对象停在 151，会被校正到 200
-   如果运动的对象停在 281，会被校正到 300
-   如果运动的对象停在 21，会被校正到 0

第 40 秒  

* * *

当然这有个问题，比如用户从 0 滑倒 30，其实他是想去 100，但是会被校正到 0!!!  
所以光使用校正是不够。还需要一个 API 去阻止校正自己去注入逻辑滚动相应的位置。所以你必须支持 AlloyTouch 的：

**to 方法**

      to(v [, time, easing]) 

其中 time 和 easing 不是必须。time 的默认值是 600.

第 50 秒  

* * *

```javascript
var items = document.querySelectorAll("#nav a");
var scroller = document.querySelector("#carousel-scroller");
Transform(scroller);
new AlloyTouch({
    touch: "#carousel-container", //反馈触摸的dom
    vertical: false, //不必需，默认是true代表监听竖直方向touch
    target: scroller, //运动的对象
    property: "translateX", //被运动的属性
    min: window.innerWidth * -3, //不必需,运动属性的最小值
    max: 0, //不必需,滚动属性的最大值
    step: window.innerWidth,
    inertia: false, //不必需,是否有惯性。默认是true
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
            this.to(step_v + this.step);
        } else {
            this.to(step_v - this.step);
        }
        return false;
    },
    animationEnd: function (evt, v) {
        var i = 0,
            len = items.length;
        for (; i < len; i++) {
            if (i === this.currentPage) {
                items[i].classList.add("active");
            } else {
                items[i].classList.remove("active");
            }
        }
    },
});
```

因为一共四张图，所以  
min 得到的结果是 window.innerWidth \* -3  
max 的值依然是 0  
step 的值是 window.innerWidth  
通过设置 inertia: false, 把惯性运动关掉  
注意看 touchEnd 里面的 return false 是为了不去计算手指离开屏幕后的校正位置、惯性运动等逻辑。  
touchEnd 可以拿到当前的位置 v 以及当前所处的位置 index。  
animationEnd 是运动结束后的回调，用来设置 nav 的 active。当然不是所有浏览器都支持 classList，这里只是为了演示代码足够简洁。  
再注意，在 touchEnd 和 animationEnd 中能拿到 this，也就是 AlloyTouch 当前对象的实例。其中，  
to 方法用来运动当前对象  
step 是当前的步长  
还可以拿到 currentPage 去获取当前所处的页码  
还能拿到 min 和 max 值，得到运动的区间。

最后  

* * *

所有例子演示和代码可以在 Github 上找到。  
Github：<https://github.com/AlloyTeam/AlloyTouch>  



<!-- {% endraw %} - for jekyll -->