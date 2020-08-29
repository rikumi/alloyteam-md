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
<!--more-->
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
var bar = chart.selectAll('g')
  .data(data)
  .enter()
  .append('g')
  // 接收一个数据填充一个g元素
  // 同时为g设置位置
  .attr('transform', function(d, i) {
    return 'translate(' + i * barWidth + ', 0)'
```


<!-- {% endraw %} - for jekyll -->