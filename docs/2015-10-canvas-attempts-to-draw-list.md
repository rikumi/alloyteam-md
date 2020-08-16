---
title: Canvas 绘制列表的尝试
date: 2015-10-30
author: TAT.Cson
source_link: http://www.alloyteam.com/2015/10/canvas-attempts-to-draw-list/
---

<!-- {% raw %} - for jekyll -->

为什么尝试使用 Canvas 绘制列表？使用 canvas 绘制列表的好处在于页面只有一个 dom 元素，这样对于大量 dom 元素组成的列表来说，无疑更节省页面内存。

本文将一步一步分析，如何实现一个 canvas 绘制的长列表。

**Step1：dom 节点映射**

首先考虑一个问题，对于我们在页面中常见的 dom 结点，在 Canvas 中如何表示？

因此我们的第一步工作就是实现 **dom 结点到 Canvas 绘制对象的映射**。

[![1](http://www.alloyteam.com/wp-content/uploads/2015/10/1.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/1.jpg)

上面列出了 dom 节点常见的属性和方法，因此对于 canvas，我们也需要封装对应的对象，模拟 dom 节点的特性与方法接口：

[![2](http://www.alloyteam.com/wp-content/uploads/2015/10/2.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/2.jpg)

上面封装的 renderLayer 对象模拟了 dom 节点的基础特性，并提供一个 draw 方法用于绘制节点。

我们把 renderLayer 对象对应为网页元素中最基本的 div 元素，接下来我们可以封装更多的继承于 renderLayer 的对象，分别对应更多的 dom 元素：

[![3](http://www.alloyteam.com/wp-content/uploads/2015/10/3.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/3.jpg)

其中 CanvasText 类和 CanvasImage 类分别都继承于 RenderLayer 类，并且由于它们各有不同的展示方式，因此它们分别实现自己的 draw 方法，做定制化的展示。

[![4](http://www.alloyteam.com/wp-content/uploads/2015/10/4.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/4.jpg)

**Step2：绘制对象的布局机制实现**

接下来思考的一个问题就是，如何定义绘制对象出现在 canvas 上的位置？

**方案 1：直接指定绘制坐标**

[![5](http://www.alloyteam.com/wp-content/uploads/2015/10/5.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/5.jpg)

这种方案的**缺点**是，不方便页面元素进行布局，列表结构复杂的时候，坐标难以维护。、

**方案 2：通过指定 css 样式 根据布局计算，转换到具体坐标**[![6](http://www.alloyteam.com/wp-content/uploads/2015/10/6.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/6.jpg)

方案 2 的优点是：方面元素布局，样式结构更便于维护。

需要实现在 canvas 中能够使用 css 的方式布局，我们需要依赖一个库：css-layout.js

<http://github.com/facebook/css-layout>

css-layout.js 可以帮忙实现 json 对象的 css 样式到 canvas 坐标系的转换，有兴趣的同学可以看看其源码。

[![7](http://www.alloyteam.com/wp-content/uploads/2015/10/7.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/7.jpg)

css-layout 支持多种 css 属性的转换：

[![8](http://www.alloyteam.com/wp-content/uploads/2015/10/8.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/8.jpg)

**整个流程如下：**

初始化 canvas 绘制对象 -> 通过 layout.js 从根节点开始计算 layout，得到每个对象的具体绘制坐标 -> 绘制

**step3：元素样式更新**

首先我们会把样式分为两个类别：布局样式和渲染样式。

布局样式：决定元素的布局，例如大小，位置等。

渲染样式：决定元素的展示样式，例如色值等。

对于两种样式的变更，分别有不同的样式更新方式。

布局样式变更：在下次循环，需要**重新计算 layout ，**然后再重新绘制所有对象。

然而对于渲染样式的变更：在下次循环，只需要重新绘制所有对象。

**step4: 实现列表滚动**

在尝试模拟 canvas 的列表滚动之前，我们先来看看如何模拟传统 dom 页面的 div 滚动。

以 iscroll 为例，要模拟 div 的滚动，实质上就是对 div 层不断改变其 translateY 值，让其位移到不同地方，从而实现滚动的效果。

再来看 canvas 的列表滚动模拟，其实我们需要做的就是不断改变 2dContext 的绘制原点，使每次在不同的原点开始绘制 canvas 内的所有元素，实现滚动的视觉效果：

[![9](http://www.alloyteam.com/wp-content/uploads/2015/10/9.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/9.jpg)

因此，我们需要的就是一个通过监听用户手势事件，模拟滚动并得到当前滚动距离的组件。

**方案 1：使用 Zynga Scroller 组件**

组件 github 地址：<http://github.com/zynga/scroller>

该组件不同于 iscroll 之类的组件，它不对实际元素进行移位操作，而是仅仅根据手势，实时返回一个当前的滚动距离值，结合组件改变绘制原点的使用示例：

[![10](http://www.alloyteam.com/wp-content/uploads/2015/10/10.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/10.jpg)

**方式 2：透明 div 接管滚动，获取 scrollY 值**

[![11](http://www.alloyteam.com/wp-content/uploads/2015/10/11.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/11.jpg)

该方法是把两个父子关系的透明 div 盖在 canvas 上面，设置子 div 高度为内容高度，并监听父 div 的 scroll 事件，在 scrol 事件的处理程序中获取 scrollTop 并用于改变 Canvas 2dContext 的绘制原点。该方案相比方案 1 的好处是不用通过 js 代码监听用户手势事件并模拟滚动的缓动效果，而是直接使用原生的浏览器滚动。

**Step5：事件模拟**

对于 click，touch 等 dom 事件的模拟，我们采用的方案是根据点击区域进行检测，并找出最底层的元素，递归寻找父元素并触发对应事件处理程序，从而模拟事件冒泡。

[![12](http://www.alloyteam.com/wp-content/uploads/2015/10/12.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/12.jpg)

**step6：滚动绘制流程优化**

按照目前的做法，每个循环当中，我们都需要清除整个 canvas，然后再把列表内的所有元素重新绘制一次，这样做无疑是非常损耗性能的：

[![13](http://www.alloyteam.com/wp-content/uploads/2015/10/13.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/13.jpg)

因此我们可以做的一个优化就是，把绘制过的列表项缓存下来，把绘制结果保存到一个脱离 dom 的 canvas 中，放到一个 canvas 池中，下次绘制的时候，直接从 canvas 池中读取已缓存的 canvas，把列表项的绘制结果绘制到列表的 canvas 当中：

[![14](http://www.alloyteam.com/wp-content/uploads/2015/10/14.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/14.jpg)

**step7：自定义标签**

对于目前的代码组织方式，我们需要每次使用类的 api 的方式去创建一个新的对象，并添加到 canvas 中，然而我们还可以使用 jsx 的方式，让整个代码组织更便于维护，参考 react canvas 中的做法：

[![15](http://www.alloyteam.com/wp-content/uploads/2015/10/15.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/15.jpg)

**效果测试：**

到这里，基本上已经实现了对列表在 canvas 上的模拟了，然而性能怎样呢？以下是一些测试结果：

**android：不同机型 fps 差异较大**

SumSung grand 2 ：fps35 左右 

小米 2：fps50 左右

ios:

iphone5c: 50 左右

然而针对 android 机型进行进一步的测试，尝试仅仅改变绘制区域的大小进行测试：

[![16](http://www.alloyteam.com/wp-content/uploads/2015/10/16.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/16.jpg)

测试发现，仅仅通过减少绘制区域，对 fps 就会造成较大的影响，**因此也证明一些机器上 canvas 绘制的最大瓶颈，在于绘制区域的大小。**

**其他需要注意的问题：**

由于元素都绘制在 Canvas 上，因此不能被读屏软件识别，影响无障碍化。


<!-- {% endraw %} - for jekyll -->