---
title: 用 d3.js 实现基于 SVG 的线形图
date: 2013-12-30
author: TAT.云中飞扬
source_link: http://www.alloyteam.com/2013/12/d3-line-chart/
---

<!-- {% raw %} - for jekyll -->

D3 全称 Data-Driven-Documents，这里说的不是暗黑 III，d3 是一款可视化 js 库，其主要用途是用 HTML 或者 SVG 生动地展现数据。

相信网站开发者大都接入过 ga 来分析各种数据，例如 pv 图。ga 的图都是基于 SVG 的，下面笔者就用 d3 来一步一步实现类似 ga 的 pv 线形图，并假设读者具有一定的 SVG 基础（没有？没关系，[w3school](http://www.w3school.com.cn/svg/) 帮你快速上手）。

## step1：引入 d3.js

到 [github d3](https://github.com/mbostock/d3) 下载最新版 d3，然后在 html 代码增加标签

````html

```html
<script src="path/to/d3.js"></script>
````

<!--more-->

````

step2：创建 SVG 容器
---------------

```javascript
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = document.body.clientWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var container = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
var svg = container
    .append("g")
    .attr("class", "content")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
````

margin、width、height 定义了 svg 节点的位置和尺寸，后面会用到。d3.select 类似 jquery 的选择器，并且 d3 的语法也支持串联调用，append ('svg') 将 svg 追加到 body 的尾部，同时为 svg 节点设置了宽度和高度值，attr 也有 get 和 set 两种用法。

svg 的 g 元素类似于 div，在这里作为一组元素的容器，后面加入的元素都放在 g 里面，g 可以设置统一的 css，里面的子元素会继承可继承 css 属性。margin 和 position 对 g 的定位不起作用，只能使用 translate 通过位移来定位。

## step3：定位坐标轴

既然 d3 是数据驱动的，那必须要有数据啊，没有数据肿么能搞呢。好吧，首先模拟一份数据，就模拟本月的 pv 数据吧，即 12 月每天的 pv 数据，日期采用 yy-mm-dd 的格式，pv 随机一个 100 以内的整数。

```javascript
var data = Array.apply(0, Array(31)).map(function(item,
```


<!-- {% endraw %} - for jekyll -->