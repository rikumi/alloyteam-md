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
    for (; i &lt; size; i++) {
        x = getRandomNumber(-250, 250);
        y = getRandomNumber(-250, 250);
        j *= -1;
        if (x * x + y * y &lt;= r * r) {
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
    for (; i &lt; len; i++) {
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

```javascript
function positionsProjection() {
    var index = 0,
        len = positions.length;
    for (; index &lt; len; index++) {
        var p = positions[index];
        var rp = rd_positions[index]; //perspective projection //rp.x = p.x * distance / Math.abs(camera_position.z - p.z); //rp.y =  p.y * distance / Math.abs(camera_position.z - p.z); //orthogonal projection
        rp.x = p.x;
        rp.y = p.y;
    }
}
```

为了简单起见，把球心和摄像机（也可以叫眼睛、亦或是视点）的坐标分别设置为：

    center = {x: 300, y: 300, z: 0},
    camera_position = {x: 300, y: 300, z: 500},
    distance = 600,

distance 代表摄像机到投影平面的距离，摄像机就固定在球心的正前方不动，这样进行透视投影或正交投影计算起来无比方便，免去用齐次坐标、4\*4 矩阵的过程。如下简单推导便可：

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161205081819772-280179985.png)

这里需要注意的是，上面是透视投影的图解，会产生近大远小的感觉。透视投影是视锥体（上图没有把视锥体画出来），正交投影是立方体。  
正交投影如下图解，x 和 y 坐标投影后不变就可以了：

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161205081824944-272605910.png)

可以这么理解：

-   透视投影从一个点看无数个点
-   正交投影从无数个点看无数个点

旋转  

* * *

```c
function rotate() {
    var cx,
        z,
        i = 0,
        len=positions.length;
    for (; i &lt; len; i++) {
        cx = positions[i].x;
        z = positions[i].z;
        positions[i].x = positions[i].x * Math.cos(step_angle) - positions[i].z * Math.sin(step_angle);
        positions[i].z = positions[i].z * Math.cos(step_angle) + cx * Math.sin(step_angle);
    }
}
```

可以看到，上面是绕 y 轴旋转，所以 y 的坐标不变，x 和 z 需要经过下面的 matrix 变换：  
![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161205082217382-982714952.png)

Transformation  

* * *

```javascript
function transformImg(img, i) {
    var z = positions[i].z;
    img.translateX = center.x + rd_positions[i].x;
    img.translateY = center.x + rd_positions[i].y; //projection
    img.scaleX = img.scaleY =
        (0.5 * distance) / Math.abs(camera_position.z - z);
    img.style.opacity = 0.1 + 1 - (r - z) / (2 * r);
}
function render() {
    var i = 0,
        len = positions.length;
    for (; i &lt; len; i++) {
        transformImg(img_list[i], i);
    }
}
```

初始化和循环  

* * *

```javascript
function tick() {
    rotate();
    positionsProjection();
    render();
    requestAnimationFrame(tick);
}
(function () {
    randomPoints();
    createImgs();
    positionsProjection();
    tick();
})();
```

通过通过上面几行代码串整个流程。通过 requestAnimationFrame 循环执行 tick。

最后  

* * *

为了加深理解，你可以把[源码](https://github.com/AlloyTeam/AlloyTouch/blob/master/transformjs/example/stars.html) clone 下来，然后改代码实现：

-   试试绕着 z 轴旋转
-   试试绕着 x 轴旋转
-   试试切换下透视投影和正交投影
-   透视投影的时候试着修改摄像机的 z 坐标
-   正交投影的时候试着修改摄像机的 z 坐标
-   透视投影的时候试着修改到投影面的距离
-   正交投影的时候试着修改到投影面的距离
-   不使用星星素材换过其他素材会达到意想不到的酷炫效果

第二种实现方式：试试 Transform (img,false)  

* * *

因为 Transform 第二个参数不传，或者设置为 false 的时候是打开透视投影的。  
所以可以设置 img.translateZ 来使用浏览器自身的透视投影，省去 positionsProjection 过程。

创建图片的时候，使用下面的方式注入 Transformation 能力，

    Transform(img, false);

-   即打开透视投影，
-   即近大远小，
-   即不用自己去 positionsProjection
-   即不用自己去设置图片的 scaleX 和 scaleY

渲染的时候直接使用原始坐标便可：

```javascript
function transformImg(img, i) {
    var p = positions[i];
    img.translateX = p.x;
    img.translateY = p.y;
    img.translateZ = p.z;
    img.style.opacity = 0.1 + 1 - (r - p.z) / (2 * r);
}
function render() {
    var i = 0,
        len = positions.length;
    for (; i &lt; len; i++) {
        transformImg(img_list[i], i);
    }
}
```

循环和初始化，不再需要投影过程：

```javascript
function tick() {
    rotate();
    render();
    requestAnimationFrame(tick);
}
(function () {
    randomPoints();
    createImgs();
    tick();
})();
```

transformjs  

* * *

transformjs 提供了基础的 transformation 能力，不与任何时间和运动库绑定。虽然官网 demo 简单，但是稍微费点脑细胞就可以做出很酷炫的效果。所以酷炫靠大家，用 transformjs 就对了。  
传送门：[transformjs 主页](http://alloyteam.github.io/AlloyTouch/transformjs/) \| [transformjs Github](https://github.com/AlloyTeam/AlloyTouch/tree/master/transformjs)

所有例子可以在上面找到。  



<!-- {% endraw %} - for jekyll -->