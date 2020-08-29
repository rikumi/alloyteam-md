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

```javascript
new AlloyTouch({
    touch: "#carousel-container",//反馈触摸的dom
    vertical: false,// 监听用户横向触摸
    target: scroller, //运动的对象
    property: "translateX",  //被运动的属性
    min:0.88
````


<!-- {% endraw %} - for jekyll -->