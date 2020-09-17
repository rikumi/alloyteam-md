---
title: HTML5 实现屏幕手势解锁
date: 2015-07-17
author: TAT.tennylv
source_link: http://www.alloyteam.com/2015/07/html5-shi-xian-ping-mu-shou-shi-jie-suo/
---

<!-- {% raw %} - for jekyll -->

**效果展示**

![](http://7jpp2v.com1.z0.glb.clouddn.com/testh5lock.gif)  

**实现原理** 利用 HTML5 的 canvas，将解锁的圈圈划出，利用 touch 事件解锁这些圈圈，直接看代码。

```c
function createCircle() {// 创建解锁点的坐标，根据canvas的大小来平均分配半径
 
        var n = chooseType;// 画出n*n的矩阵 
        lastPoint = [];
        arr = [];
        restPoint = [];
        r = ctx.canvas.width / (2 + 4 * n);// 公式计算 半径和canvas的大小有关
        for (var i = 0 ; i < n ; i++) {
            for (var j = 0 ; j < n ; j++) {
                arr.push({
                    x: j * 4 * r + 3 * r,
                    y: i * 4 * r + 3 * r
                });
                restPoint.push({
                    x: j * 4 * r + 3 * r,
                    y: i * 4 * r + 3 * r
                });
            }
        }
        //return arr;
    }
```

canvas 里的圆圈画好之后可以进行事件绑定

```javascript
function bindEvent() {
        can.addEventListener("touchstart", function (e) {
             var po = getPosition(e);
             console.log(po);
             for (var i = 0 ; i < arr.length ; i++) {
                if (Math.abs(po.x - arr[i].x) < r && Math.abs(po.y - arr[i].y) < r) { // 用来判断起始点是否在圈圈内部
```


<!-- {% endraw %} - for jekyll -->