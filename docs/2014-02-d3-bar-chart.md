---
title: 用 d3.js 实现基于 SVG 的柱状图
date: 2014-02-28
author: TAT.云中飞扬
source_link: http://www.alloyteam.com/2014/02/d3-bar-chart/
---

<!-- {% raw %} - for jekyll -->

之前用 6 步实现了[基于 SVG 的折线图](http://www.alloyteam.com/2013/12/d3-line-chart/)，这一篇文章将回到比折线图更基本的图表 —— 柱状图。

本篇直接从创建 SVG 讲起，引入 d3 等简单的准备工作参见[用 d3.js 实现基于 SVG 的线形图](http://www.alloyteam.com/2013/12/d3-line-chart/)。

## step1：模拟数据

```javascript
// 模拟100条0-100的随机数，作为柱状图的高度
var data = Array.apply(0, Array(100)).map(function() {
  return Math.random() * 100;
});
&lt;!--more-->
```

## step2：创建 SVG 容器

```javascript
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = document.body.clientWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var chart = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
```

这里的代码就不解释了，前一篇文章已经详细说明。chart 就是最终建立的容器，下面就往容器里面放元素。

## step3：画柱状图

```javascript
// 计算每根柱状物体的宽度
var barWidth = width / data.length;
// 用g作每根柱状物体的容器，意义可类比div
// 前一篇文章已经介绍过selectAll的意义，即生成占位符，等待填充svg图形
var bar = chart
    .selectAll("g")
    .data(data)
    .enter()
    .append("g") // 接收一个数据填充一个g元素 // 同时为g设置位置
    .attr("transform", function (d, i) {
        return "translate(" + i * barWidth + ", 0)";
    });
bar.append("rect") // 添加一个矩形
    .attr("y", function (d) {
        return height - d;
    })
    .attr("height", function (d) {
        return d;
    })
    .attr("width", barWidth - 1);
```

前文提到 svg 的元素定位都是基于整个 svg 容器左上角作为原点，但并不能使用 position: absolute 等方法定位，此处的 g 元素通过位移来定位 x 坐标，即 transform: translate (x, 0)。

这里的 bar 可类比 jQuery 对象，是一个类数组对象，bar 调用的方法都会对 bar 里面每个对象进行调用。代码中每一次调用都插入一个矩形，同时设置 y 坐标、高度和宽度，x 坐标跟父容器（g）保持一致即可。这里需要注意 y 坐标往下为正，为了让所有矩形的下边处于同一高度，这里设置每个矩形的 y 坐标为容器高度减去矩形高度。为了用一像素区分开每个矩形，这里设置矩形宽度为父容器的宽度减 1。

通过以上 js 代码再稍微设置一点 css

```css
rect {
  fill: #2177BB;
}
```

即可看到一张最简单的柱状图了。

[![20140228002600](http://www.alloyteam.com/wp-content/uploads/2014/02/20140228002600.png)](http://www.alloyteam.com/wp-content/uploads/2014/02/20140228002600.png)

## step4：添加坐标轴

```javascript
var y = d3.scale
    .linear()
    .domain([0, d3.max(data)])
    .range([height, 0]);
var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(1);
var yAxis = d3.svg.axis().scale(y).orient("left");
// 添加x坐标轴
chart
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
// 添加y坐标轴
chart.append("g").attr("class", "y axis").call(yAxis);
```

完整的柱状图就是这样了  
[![20140228235631](http://www.alloyteam.com/wp-content/uploads/2014/02/20140228235631.png)](http://www.alloyteam.com/wp-content/uploads/2014/02/20140228235631.png)

完整的代码请移步 [jsFiddle](http://jsfiddle.net/jarvisjiang/RqK4P/)

由于篇幅关系，本篇文章就暂时只介绍最基本的柱状图是怎么完成的，后续会更新动态柱状图以及为柱状图添加交互系效果的实现方法，敬请期待！


<!-- {% endraw %} - for jekyll -->