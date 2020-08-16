---
title: canvas 动画优化小议
date: 2013-12-01
author: TAT.Cson
source_link: http://www.alloyteam.com/2013/12/canvas-animation-optimized-discussion/
---

在使用 canvas 制作动画时，最传统的方式是对 canvas **update -> clear -> draw** 的过程

[![e1](http://www.alloyteam.com/wp-content/uploads/2013/12/e1.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/e1.png)

但是对于同一个 view 里的不同的动画，需要的更新频率可能并不一样，所以对于不同类型的动画，我们可以放在不同的 canvas 层上进行渲染，使用多层 canvas 分别渲染取代单个 canvas

[![e2](http://www.alloyteam.com/wp-content/uploads/2013/12/e2.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/e2.png)

这样的好处是对不同更新频率的动画，可以分别以他们各自的频率进行 update -> clear -> draw 的操作，并不会因为一个高频率的动画而导致所有动画频繁地刷新。另一个好处是各个层之间相对独立，刷新和绘制不会对其他层造成影响。

对动画进行分层之后，我们发现对于单个层我们其实也没必要每帧清空该层的整个 canvas 并重新绘制，我们需要 clear 和 draw 的其实仅仅是 canvas 里 **“变更了的部分”**。

一种比较简单的方法是尽量缩小清除与绘制的整体区域：

[![e5](http://www.alloyteam.com/wp-content/uploads/2013/12/e5.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/e5.png)

我们圈出所有变化元素所形成的最大矩形区域，clear 掉该区域部分，然后仅仅对变化元素进行 redraw。

这样的优点是仅仅对所有变化面积范围内的元素进行清楚与绘制操作，减少渲染的面积。

但是，上面的方案还是会对一些没必要进行清除的 canvas 区域进行清除操作，例如上面 clear area 里中间的空白部分，因此，更极致的优化方式是记录每一个元素移动造成的 “脏矩形” 区域，每次只清除所有 “脏矩形” 区域并绘制改变的元素，最大化减少渲染面积。

[![e10](http://www.alloyteam.com/wp-content/uploads/2013/12/e10.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/e10.png)

然而，对于方案 3，还存在一些在实现上需要考虑的问题，例如如何保存运动元素的脏矩形列表，对于重叠元素如何处理等等，具体的流程可以参考下图：

[![e13](http://www.alloyteam.com/wp-content/uploads/2013/12/e13.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/e13.png)