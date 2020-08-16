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
var data = Array.apply(0, Array(31)).map(function (item, i) {
    // 产生31条数据
    i++;
    return {
        date: "2013-12-" + (i < 10 ? "0" + i : i),
        pv: parseInt(Math.random() * 100),
    };
});
```

然后定义坐标轴的一些参数

```javascript
var x = d3.time
    .scale()
    .domain(
        d3.extent(data, function (d) {
            return d.day;
        })
    )
    .range([0, width]);
var y = d3.scale
    .linear()
    .domain([
        0,
        d3.max(data, function (d) {
            return d.value;
        }),
    ])
    .range([height, 0]);
```

横坐标是日期，这里使用 d3.time 自动帮我们在时间和字符串之间做转换。y 轴使用普通的线性缩放坐标轴。其实这里的 x 和 y 也是一个 function，后续会用到。  
domain 规定了坐标轴上值的范围，d3.extent 从数组里选出最小值和最大值，d3.max 选数组里面最大值。range 规定了坐标轴端点的位置，svg 的坐标原点是左上角，向右为正，向下为正，而 y 轴正方向为由下向上，所以 (0, height) 才是图表的坐标原点。  
然后使用 d3 的 axis 定制坐标轴

```javascript
var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(30);
var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);
```

orient 有四个参数（left、right、top、bottom）定义了坐标轴的位置，这里很好理解。  
ticks 定义了坐标轴上除最小值和最大值以外最多有多少个刻度，因为一个月最多有 31 天，ticks (30) 就足以展示每天的刻度了。

然后就可以把坐标轴加进 svg 容器了

    // 横坐标
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      // 增加坐标值说明
      .append('text')
      .text('日期')
      .attr('transform', 'translate(' + width + ', 0)');
     
    // 纵坐标
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .text('次/天');
    加上坐标轴之后的效果图应该是这样

[![坐标轴](http://www.alloyteam.com/wp-content/uploads/2013/12/QQ截图20131229224225.png "坐标轴")](http://www.alloyteam.com/wp-content/uploads/2013/12/20131229224225.png)

## step4：画线

有了坐标轴之后我们可以加上图表的主体部分了，pv 图应该是一条折线图。怎么加折线呢，d3 提供了丰富的图表元素，需要折线只需要 append ('path') 即可，了解 svg 的都知道，path 的 d 属性是最重要的，决定了折线的 “路径”，这里就不详细讲解 path 了。

我们只有一个数组的数据，怎么转化成需要的 d 呢，别担心，d3 帮我们做了这部分工作。首先需要用 d3.svg.line 生成一个 “线条函数”，然后将数据传给该函数即可生成我们想要的 d，我们需要做的就是定制这个 “线条函数” 的两条坐标轴分别由数据的哪部分决定。

下面看代码

```javascript
var line = d3.svg
    .line()
    .x(function (d) {
        return x(d.date);
    })
    .y(function (d) {
        return y(d.pv);
    })
    .interpolate("monotone");
```

上面的代码很好理解，设置了 x 坐标轴由 date 属性决定，y 坐标轴由 pv 属性决定，最后还调用了 interpolate，该方法会改变线条相邻两点之间的链接方式以及是否闭合，接受的参数有 linear，step-before，step-after，basis，basis-open，basis-closed，bundle，cardinal，cardinal-open，cardinal-closed，monotone，读者可以一一尝试，看看线条有什么不一样。

“线条函数” 生成好了，可以应用到 path 上了

```javascript
var path = svg.append("path").attr("class", "line").attr("d", line(data));
```

此时的图应该是这样了

[![折线图](http://www.alloyteam.com/wp-content/uploads/2013/12/20131229234348.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/20131229234348.png)

## step5：打点

到这里其实基本的图形已经实现了，只用了应该不到 20 行代码，不过这也太丑了点吧，而且完全木有交互啊。

别急，ga 的 pv 图在每个数据点都会有一个小点来占位，其实本来我们的数据就是离散的，图上也应该是离散的一些点，不过为了图表好看，也为了方便查看数据的走势，折线图显然更形象一些。

下面就在折线上增加相应的点，点我们可以用 circle，要增加元素用 append 即可

```javascript
var g = svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("g")
    .append("circle")
    .attr("class", "linecircle")
    .attr("cx", line.x())
    .attr("cy", line.y())
    .attr("r", 3.5)
    .on("mouseover", function () {
        d3.select(this).transition().duration(500).attr("r", 5);
    })
    .on("mouseout", function () {
        d3.select(this).transition().duration(500).attr("r", 3.5);
    });
```

这里的代码可能复杂一点，因为 circle 不止一个，需要使用 selectAll，而 circle 现在是还不存在的。selectAll ('circle') 的作用可以理解成先预定若干个 circle 的位置，等有数据了再插入 svg 容器里。

enter 就表明有数据来了，将每个 circle 放到单独的 g 里面，这里没有特殊的用意，就像 html 里面习惯用 div 来装其他元素一样。

为 circle 设置一些属性，cx、cy 代表圆心 x、y 坐标，line.x () 和 line.y () 会返回折线上相应点的 x、y 坐标，这样添加的 circle 就依附在折线上了。r 表示圆半径，同时为 circle 添加了两个鼠标事件，这样鼠标在 circle 上移动和移出的时候增加了圆半径变化的一个动画。

效果图

[![20131230002543](http://www.alloyteam.com/wp-content/uploads/2013/12/20131230002543.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/20131230002543.png)

## step6：增加 tips

现在看整体数据倒是可以了，不过看某天的具体数据还是太不方便了，如果在 circle 上直接标注出具体的数据又太挫了。

咋办？嘿嘿，参考 ga 呗。ga 在鼠标经过某点的纵坐标所在的直线的时候就会在改点附近出现具体的数据 tips，赞，既能清晰地看到整体的走势又能看到每天的具体数据。

先上效果图

[![20131230004305](http://www.alloyteam.com/wp-content/uploads/2013/12/20131230004305.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/20131230004305.png)

图中用一个圆角矩形和两行文字组成了一个简单的 tips

```javascript
var tips = svg.append("g").attr("class", "tips");
tips.append("rect")
    .attr("class", "tips-border")
    .attr("width", 200)
    .attr("height", 50)
    .attr("rx", 10)
    .attr("ry", 10);
var wording1 = tips
    .append("text")
    .attr("class", "tips-text")
    .attr("x", 10)
    .attr("y", 20)
    .text("");
var wording2 = tips
    .append("text")
    .attr("class", "tips-text")
    .attr("x", 10)
    .attr("y", 40)
    .text("");
```

为啥要用矩形呢，为啥不直接在 g 上设置圆角效果呢？实践证明对 g 设置的 width、height、border-radius 均无效，无赖只能使用 svg 的 rect 元素了。

rx、ry 是圆角两个方向的半径，原理同 border-radius。展示文字用 text 元素即可，这里的 x 和 y 还是坐标，不过是相对于父元素 g 的坐标。

最后的关键是怎么让 tips 出现在该出现的位置和展示对的数据，即鼠标经过某个点的纵坐标所在的直线是 tips 出现在改点附近，且展示改点的数据。

```javascript
container
    .on("mousemove", function () {
        var m = d3.mouse(this),
            cx = m[0] - margin.left;
        var x0 = x.invert(cx);
        var i = d3
            .bisector(function (d) {
                return d.date;
            })
            .left(data, x0, 1);
        var d0 = data[i - 1],
            d1 = data[i] || {},
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        function formatWording(d) {
            return "日期：" + d3.time.format("%Y-%m-%d")(d.date);
        }
        wording1.text(formatWording(d));
        wording2.text("PV：" + d.pv);
        var x1 = x(d.date),
            y1 = y(d.pv); // 处理超出边界的情况
        var dx = x1 > width ? x1 - width + 200 : x1 + 200 > width ? 200 : 0;
        var dy = y1 > height ? y1 - height + 50 : y1 + 50 > height ? 50 : 0;
        x1 -= dx;
        y1 -= dy;
        d3.select(".tips").attr(
            "transform",
            "translate(" + x1 + "," + y1 + ")"
        );
        d3.select(".tips").style("display", "block");
    })
    .on("mouseout", function () {
        d3.select(".tips").style("display", "none");
    });
```

这段长长的代码需要重点解释一下，首先是 d3.mouse (this)，这个方法会返回当前鼠标的坐标，是一个数组，分别是 x 和 y 坐标。

下面这一步最重要的一点来了，x.invert (cx) 跟据传入的横坐标数值返回该横坐标的实际数据上的值，在本例中返回一个日期。

下面的 i 是根据返回的日期反向得到 data 数组中的元素位置。有了这个 i 一切都好办了，接下来的代码是为了判断鼠标在两个日期之间离哪个更近。

后面的代码都很简单了，拿到了 tips 应该出现的 x、y 坐标之后设置 tips 的 transform 即可，再控制 tips 的 display 属性就达到了最后的效果。

查看最后的代码请移步 <http://jsfiddle.net/jarvisjiang/wh877/>

That‘s all.


<!-- {% endraw %} - for jekyll -->