---
title: 如何用 canvas 画图表（1）扇形图和环形图
date: 2015-05-31
author: TAT.heyli
source_link: http://www.alloyteam.com/2015/05/ru-he-yong-canvas-hua-tu-biao-1-shan-xing-tu-he-huan-xing-tu/
---

现在 canvas 图表的库越来越多，也越来越成熟，以致于大家想到图表制作都直接想着用第三方库，而忽略了自己动手制作的可能性。其实要绘制一个简单基本的 canvas 图表库并不难。下面就让我展开介绍。

[![canvas](http://www.alloyteam.com/wp-content/uploads/2015/05/canvas.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/05/canvas.jpg)

第一期，我先挑了最基础的扇形和环形图表进行讲解。

若要看懂此文，先要阅读一下 MDN 的 canvas 文档。

<https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API>

有了 canvas 的基础之后，我们便可以开始对问题进行拆解。

画一个扇形或者环形图需要什么元素。

1. 画一出扇形或环形，以及上色

2. 数据标签。

3. 动画效果。

**1. 绘制图形，则需要找到合适的绘制图形的函数。**

    绘制圆弧 arc(x, y, radius, startAngle, endAngle, anticlockwise)

该方法有五个参数： x,y 为绘制圆弧所在圆上的圆心坐标。radius 为半径。startAngle 以及 engAngle 参数用弧度定义了开始以及结束的弧度。这些都是以 x 轴为基准。参数 anticlockwise 为一个布尔值。为 true 时，是逆时针方向，否则顺时针方向。

    ctx.beginPath();
    // 移动到圆心
    ctx.moveTo(this.cx, this.cy);
    // 从圆心画直线到计算好的圆外边上的点
    ctx.lineTo(startPos.x, startPos.y);
    //从外边上的点画曲线
    ctx.arc(this.cx, this.cy, this.r, startRadius, endRadius, 0, 0);
    //计算下一个圆边上的点
    this.getPos(endDeg, endPos, this.r);
    //上色
    ctx.fillStyle = this.data.sorted[key].color;
    ctx.fill();
    ctx.closePath();

重复以上步骤，则可以将各个扇形分别画出来。

如果想画环形，则给线上色，而非画扇形那样，给扇形内背景上色。如下

    ctx.beginPath();
    // 给曲线设定颜色
    ctx.strokeStyle = this.data.sorted[key].color;
    // 画出曲线
    ctx.arc(this.cx, this.cy, this.r, startRadius, endRadius, 0);
    //设定曲线粗细度
    ctx.lineWidth = this.lineWidth;
    //给曲线着色
    ctx.stroke();
    ctx.closePath();

**2. 将图形绘制好后，需要填上标签。**

填上标签需要一些数据的处理，以及计算数据摆放的位置

```javascript
//方形颜色
ctx.fillStyle = this.data.sorted[key].color;
//绘制填充方形
ctx.fillRect(x, y, 30, 30);
//绘制数据标签
this.drawText(x, y, key);
fchart.prototype.drawText = function (x, y, key) {
    var ctx = this.ctx; // 字体大小和形状
    ctx.font =
        '30px -apple-system-font, "Helvetica Neue", Helvetica, STHeiTi, sans-serif'; // 字体颜色
    ctx.fillStyle = "#000000"; // 绘制字体在特定位置上面
    ctx.fillText(key + " " + this.data.percentage[key] + "%", x + 40, y + 25);
};
```

3. 最后，我们需要考虑动画的问题。

我们希望图形旋转 360 度后，出现标签，因此我们需要以下的逻辑：

```javascript
var startDeg = -90;
var incre = 10;
var dr = setInterval(function () {
    //清除画布
    ctx.clearRect(0, 0, 600, 600); //起始绘制角度
    self.draw(startDeg); // 每16ms增加10度
    startDeg += incre; // 当图形转到270度（转完一圈）的时候，停止动画，绘制标签
    if (startDeg >= 270) {
        clearInterval(dr);
        self.drawLabel();
    }
}, 16);
```

看着上面你可能还不懂。在 canvas 画布上绘制动画，相当于在一定时间内不断更新画布上的内容。此处，则是在不断更新绘制的角度，每 16ms 内绘制出一幅新的图表，并将旧的图表用 clearRect 清除掉。当转完一圈后，才绘制标签。

对详细代码有兴趣的朋友，可以到 <https://github.com/mPresst/fchart> 查看。后面，将会陆续更新柱状图和折线图的画法。

备注：MDN canvas 文章里面有几篇是小弟翻译的文章，请多多支持哈。

canvas 高级动画 <https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/Canvas_tutorial/Advanced_animations>

canvas 像素操作 <https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/Canvas_tutorial/Pixel_manipulation_with_canvas>

canvas 的优化 <https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/Canvas_tutorial/Optimizing_canvas>