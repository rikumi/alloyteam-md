---
title: transformjs 玩转星球
date: 2016-12-05
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/12/transformjs-fun-planet/
---

<!-- {% raw %} - for jekyll -->

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161205081805476-861034303.gif)

如你所见。这篇就是要讲下使用 [transformjs](https://github.com/AlloyTeam/AlloyTouch/tree/master/transformjs) 制作星球的过程。你也可以无视文章，直接去看源码和在线演示：

[源码](https://github.com/AlloyTeam/AlloyTouch/blob/master/transformjs/example/stars.html) \| [在线演示](http://alloyteam.github.io/AlloyTouch/transformjs/example/stars.html)

代码 100 行多一点，直接看也没有什么压力。下面分几步讲解下。

生成球上点坐标  

* * *

设球心为 (a,b,c), 半径为 r,  
则球的标准方程为 **(x-a)²+(y-b)²+(z-c)²=r²**

这里假设球心的（0，0，0），则：  
标准方程为 **x²+y²+z²=r²**

因为可以渲染的时候再把球的本地坐标转为世界坐标进行位移，所以球心 (0,0,0) 便可以。

```c
function randomPoints() {
    var x, y, z, j = -1, i = 0;
    for (; i < size; i++) {
        x = getRandomNumber(-250, 250);
        y = getRandomNumber(-250, 250);
        j *= -1;
        if (x * x + y * y <= r * r) {
            z = j * Math.sqrt(Math.abs(r * r - x * x - y * y));
            positions.push({x: x, y: y, z: z});
            rd_positions.push({x: x, y: y, z: z});
        }
    }
}
```

上面的生成过程很取巧：

-   1. 随机生成 2D 内的圆内的坐标 x 和 y。（x \* x + y \* y &lt;= r \* r 就是表示圆内）
-   2. 根据 2D 维度的坐标推算其属于球面上的 z

其中 positions 用来存放所有点的 local 坐标，rd_positions 用来以后存放投影后的坐标。

坐标转 Dom  

* * *

```javascript
function createImgs() {
    var i = 0,
        len = positions.length;
    for (; i < len; i++) {
        var img = document.createElement("img");
        img.style.position = "absolute";
        img.style.left = "0px";
        img.style.top = "0px";
        img.src = "../asset/star.png";
        document.body.appendChild(img);
        Transform(img, true);
        transformImg(img, i);
        img_list.push(img);
    }
}
```

所有的点都对应创建一个绝对定位的图片，并且通过 Transform (img,true) 给 img 注入 transformation 能力。注意第二个参数 true 代表关闭透视投影，因为投影下面会自己去实现。

投影变换  

* * *


<!-- {% endraw %} - for jekyll -->