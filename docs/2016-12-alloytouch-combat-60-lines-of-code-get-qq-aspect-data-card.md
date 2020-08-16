---
title: AlloyTouch 实战–60 行代码搞定 QQ 看点资料卡
date: 2016-12-29
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/12/alloytouch-combat-60-lines-of-code-get-qq-aspect-data-card/
---

原文链接：<https://github.com/AlloyTeam/AlloyTouch/wiki/kandian>

先验货  

* * *

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161229100016070-1865978262.png)

-   访问 DEMO 你也可以[点击这里](http://alloyteam.github.io/AlloyTouch//refresh/infinite/kandian.html)
-   源代码可以[点击这里](https://github.com/AlloyTeam/AlloyTouch/blob/master/refresh/infinite/kandian.html#L915-L978)

如你体验所见，流程的滚动的同时还能支持头部的动画？不断地加载新数据还能做到流畅的滑动！怎么做得的？使用 AlloyTouch CSS 0.2.0 及以上版本便可！

头部动画  

* * *

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161229100113867-627323058.gif)

加载更多  

* * *

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161229100100961-1863388318.gif)

实现代码  

* * *

```javascript
var infoList = document.getElementById("infoList"),
    mockHTML = infoList.innerHTML,
    scroller = document.getElementById("scroller"),
    header = document.getElementById("header"),
    userLogo = document.getElementById("user-logo-wrapper"),
    loading = false,
    alloyTouch = null;
Transform(scroller, true);
Transform(header);
header.originY = -70;
header.translateY = -70;
Transform(userLogo);
alloyTouch = new AlloyTouch({
    touch: "#wrapper",
    vertical: true,
    target: scroller,
    property: "translateY",
    maxSpeed: 2,
    outFactor: 0.1,
    min: 160 * -20 + window.innerHeight - 202 - 50,
    max: 0,
    lockDirection: false,
    touchStart: function () {
        reastMin();
    },
    lockDirection: false,
    change: function (v) {
        if (v <= this.min + 5 && !loading) {
            loading = true;
            loadMore();
        }
        if (v < 0) {
            if (v < -140) v = -140;
            var scaleY = (240 + v) / 240;
            header.scaleY = scaleY;
            userLogo.scaleX = userLogo.scaleY = scaleY;
            userLogo.translateY = v / 1.7;
        } else {
            var scaleY = 1 + v / 240;
            header.scaleY = scaleY;
            userLogo.scaleX = userLogo.scaleY = scaleY;
            userLogo.translateY = v / 1.7;
        }
    },
});
function loadMore() {
    setTimeout(function () {
        infoList.innerHTML += mockHTML;
        loading = false;
        reastMin();
    }, 500);
}
function reastMin() {
    alloyTouch.min =
        -1 * parseInt(getComputedStyle(scroller).height) +
        window.innerHeight -
        202;
}
document.addEventListener(
    "touchmove",
    function (evt) {
        evt.preventDefault();
    },
    false
);
```

就这么多代码。当然你要引用一个 transformjs 和 alloy_touch.css.js。先看这一堆：

    Transform(scroller, true);
    Transform(header);
    header.originY = -70;
    header.translateY = -70;
    Transform(userLogo);

-   Transform (xxx) 是什么意思？

    > 赋予 xxx transformation 能力
-   第一个 scroller 加上 true 代表关闭透视投影，为什么要关闭透视投影？

    > 因为 scroller 里面是有文本，防止文本在 IOS 中模糊的情况。
-   header 是顶部的那个蓝色的区域。为什么要设置 originY 和 translateY？为什么要设置为 - 70？

    > 因为 header 的高度为 140px，用户向上滚动的过程中，需要对其进行 scaleY 变换。通常我们的做法是设置 CSS3 transform-origin 为 center top。而使用 transformjs 之后，可以抛弃 transform-origin，使用 originY 或者 originX 属性便可。originY 设置为 -70，相对于高度为 140 的 header 来说就是 center top。

再看这一堆：

```javascript
alloyTouch = new AlloyTouch({
    touch: "#wrapper",
    vertical: true,
    target: scroller,
    property: "translateY",
    maxSpeed: 2,
    outFactor: 0.1,
    lockDirection: false,
    min: 160 * -20 + window.innerHeight - 202 - 50,
    max: 0,
    touchStart: function () {
        resetMin();
    },
    lockDirection: false,
    ...
    ...
    ...
})
...
...
function resetMin() {
    alloyTouch.min = -1 * parseInt(getComputedStyle(scroller).height) + window.innerHeight - 202;
}
```

使用 AlloyTouch 最关键的一点就是计算 min 和 max 的值。min 和 max 决定了可以滚到哪里，到了哪里会进行回弹等等。这里 max 是 0 毫无疑问。

-   但是 min 那一堆加减乘除是什么东西？

    > 这里首次加载是 20 行数据，每一行高度大概 160，主意是大概， window.innerHeight 是视窗的高度，202px 是滚动的容器的 padding top 的值，50px 是用来留给显示**加载更多**的...  
    > ![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161229100051132-1273608491.png)

如上图所示，主要是需要求？？？的高度。

-   那么怎么解决大概 160\*20 的问题？

    > touchStart 的时候 reastMin。resetMin 会去通过 getComputedStyle 计算整个 scroller 的高度。
-   maxSpeed 是干什么用的？

    > 用来限制滚动的最大速度，个人感觉调整到 2 挺舒适，这个可以根据场景和被运动的属性灵活配置。
-   outFactor 是干什么用的？

    > 用来设置超出 min 或者 max 进行拖拽的运动比例系数，系数越小，超出 min 和 max 越难拖动，也就是受到的阻力越大。
-   lockDirection 是干什么用的？

    > lockDirection 默认值是 true。代表用户起手时候是横向的，而你监听的是竖直方向的 touch，这样的话是不会触发运动。只有起手和监听对应上才会有触摸运动。这里把 lockDirection 设置成 false 就没有这个限制，不管用户起手的 direction，都会有触摸运动。

再看 AlloyTouch 注入的 change 事件！头部动效核心的一个配置函数：

```javascript
change: function (v) {
    if (v <= this.min + 5 && !loading) {
        loading = true;
        loadMore();
    }
    if (v < 0) {
        if (v < -140) v = -140;
        var scaleY = (240 + v) / 240;
        header.scaleY = scaleY;
        userLogo.scaleX = userLogo.scaleY = scaleY;
        userLogo.translateY = v / 1.7;
    } else {
        var scaleY = 1 + v / 240;
        header.scaleY = scaleY;
        userLogo.scaleX = userLogo.scaleY = scaleY;
        userLogo.translateY = v / 1.7;
    }
}
```

v 代表当前被运动对象的被运动属性的当前的值，根据这个 v 去做一些效果和加载更多。

-   什么时候加载更多？

    > 当滚动你能看到加载更多的时候去加载更多
-   什么时候能看到加载更多？

    > v &lt;= this.min + 5。 可以看到 change 回调里可以拿到 this，也就是 AlloyTouch 对象的实例，当 v 等于 this.min 代表滚到了底部，所以这里加上 5 代表快要滚动底部已经看到了加载更多。就去执行 loadMore 函数。
-   loading 是干什么用的？

    > 防止重复 loadMore 用得，因为 change 执行得很频繁，所以这里会通过 loading 的状态去锁上。
-   下面一堆设置 scaleX、scaleY、translateY 以及一堆数字是怎么来的？

    > 慢慢调试得出的最佳效果～～反正就是根据 v 的数值映射到 header 和用户头像的 transform 属性上，这里就不一一讲了。

再看 loadMore：

```javascript
function loadMore() {
    setTimeout(function () {
        infoList.innerHTML += mockHTML;
        loading = false;
        reastMin();
    }, 500);
}
```

这里使用了一段假的 HTML 去模拟 AJAX 异步请求以及数据转 HTML 的过程，整个耗时 500ms，500ms 后会去：

-   插入 HTML
-   重置 loading 状态
-   重置 AlloyTouch 的 min

最后：

```javascript
document.addEventListener(
    "touchmove",
    function (evt) {
        evt.preventDefault();
    },
    false
);
```

阻止掉整个 document 的默认事件，不会把整个页面拖下来，在手 Q 里的话，你就看不到网址和 X5 内核提供技术支持了。

开始 AlloyTouch  

* * *

Github：<https://github.com/AlloyTeam/AlloyTouch>

任何意见和建议欢迎 [new issue](https://github.com/AlloyTeam/AlloyTouch/issues)，AlloyTouch 团队会第一时间反馈。  
