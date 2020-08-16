---
title: 使用 js 实现思维导图
date: 2015-08-28
author: TAT.rocket
source_link: http://www.alloyteam.com/2015/08/shi-yong-js-shi-xian-si-wei-dao-tu/
---

<!-- {% raw %} - for jekyll -->

本文主要阐述使用 js 实现思维导图的关键技术点，如果还不知道什么是思维导图的同学，请自行度娘。以下是 demo 和源码的传送门：  
demo：<http://rockyren.github.io/mindmaptree/>  
源码：<http://github.com/RockyRen/mindmaptree/tree/master>

在源码中我使用了 svg 绘制思维导图。与 canvas 相比，svg 将图像当成对象，我们可将思维导图中节点和线等图形表现为对象，而且 svg 更适合用于动态交互的应用

下面介绍几个关键技术点：

**子节点位置的重绘**  
一个基本的思维导图工具应该拥有增加节点和删除节点的功能。在某个节点上增删节点时，为了使得所有子节点的高度相对于该节点垂直居中，都会重新渲染子节点的垂直位置。  
如图 1 所示，首先求得父节点的中心点 F 的坐标为 (hfx, hfy)，设父节点与子节点的水平距离为 interval，父节点的宽为 parentWidth。作水平线段 FC，C 点的横坐标即为子节点的横坐标 childX。如下图所示：

![](http://www.alloyteam.com/wp-content/uploads/2015/08/图1.png)

为了让子节点间垂直隔开，每一个子节点上下都有补白，所以一个子节点所占的区域高度为该子节点的节点高度加上两个补白高度。迭代所有子节点，求取所有子节点的区域高度 areaHeight，然后在线段 FC 的 C 点上作一条长度为 areaHeight 的垂直平分线 AB，所有子节点的垂直区域都在垂直平分线 AB 内，这样可以保证所有子节点的高度相对于该节点垂直居中。如下图所示：

![](http://www.alloyteam.com/wp-content/uploads/2015/08/图2.png)

我们需要求得每一个子节点的垂直坐标 childY。首先求得 A 点的垂直坐标 startY = hfy - areaHeight / 2，第一个子节点的垂直坐标由 startY 加 padding 可得。求第二个子节点的垂直坐标时，startY 累加上一个子节点的区域高度，则第二个子节点的垂直坐标等于当前 startY 加上 padding。之后的子节点通过迭代相同的操作可得。在每一轮迭代中，根据求得的子节点坐标 (childX, childY) 渲染节点的位置。如下图所示：

![](http://www.alloyteam.com/wp-content/uploads/2015/08/图3.png)

实现代码如下：

```javascript
// 以下变量请自行求得
var hfx, // 父节点的中心x轴坐标
    hfy, // 父节点的中心y轴坐标
    parentWidth, // 父节点的宽度
    children, // 子节点列表
    padding, // 子节点垂直间距
    interval; // 节点间水平间距
var childX, // 子节点的x轴坐标
    startY, // 子节点区域的起始坐标
    childrenAreaHeight = 0; // 子节点总区域高度
childX = hfx + parentWidth / 2 + interval;
// 迭代子节点，求得子节点总区域高度
children.forEach(function (child) {
    var curAreaHeight = getNodeHeight(child) + padding * 2;
    childrenAreaHeight += curAreaHeight;
});
startY = hfy - childrenAreaHeight / 2;
// 迭代子节点，求得每个子节点的垂直坐标
children.forEach(function (child) {
    var childY = startY + padding;
    // 已经求得当前子节点坐标(childX, childY)，在这里作渲染操作
    var curAreaHeight = getNodeHeight(child) + padding * 2;
    startY += curAreaHeight; // 其实高度累加
});
/**
 * 获取节点的高度
 */
function getNodeHeight() {
    // ...
}
```

**祖先节点的同级节点的垂直位置调整**  
如下图所示，当增加一个节点时，该节点父节点的同级节点需要被 “撑开”：设该节点的 1/2 区域高度为 moveY，在父节点的同级节点中，比父节点高的向上偏移一个 moveY，比父节点低的向下偏移一个 moveY。父节点的父节点的同级节点也做相同的处理，一直递归到根节点为止。当删除一个节点时，节点的父节点的同级节点会被 “ 压低”，“ 压低” 操作和上述操作相似。注意，当增加第一个子节点和删除最后一个子节点时，不会进行 “ 撑开” 和 “ 压低” 操作。

![](http://www.alloyteam.com/wp-content/uploads/2015/08/moveY-e1440753663443.png)

实现源码如下：

```javascript
/**
 * 调整当前的父节点的同级节点的位置
 * @param node 当前的父节点, 以下为该节点需要用到的属性
 *              node.father: 节点的父节点，为null时表示父节点为根节点
 *              node.children:  节点的子节点列表
 *              node.x：  节点的x轴坐标
 *              node.y： 节点的y轴坐标
 *
 * @oaram areaHeight 被操作节点的区域高度
 */
function resetBrotherPosition(node, areaHeight) {
    var brother, // 同级节点
        moveY = areaHeight / 2; // 需要移动的高度
    if (node.father) {
        node.father.children.forEach(function (curNode) {
            // 遍历同级节点
            if (curNode != node) {
                if (brother.y < node.y) {
                    // 向上移动brother节点的代码写在这
                } else {
                    // 向下移动brother节点的代码写在这
                }
            }
        });
    } // 递归父节点
    if (node.father) {
        resetBrotherPosition(node.father, areaHeight);
    }
}
```

**拖动节点**  
当拖动根节点时，通过改变 svg 的视口坐标来实现拖动整个思维导图的效果。当拖动  
非根节点时，会按顺序触发 mouseup、mousemove、mousedown 三个事件，分别对应按下鼠标、鼠标移动和放下鼠标三个状态。在按下鼠标状态下，会以当前节点为原型克隆一个节点用于占位。在拖动鼠标状态下，通过改变节点的坐标实现节点位置的改变。在放下鼠标状态下，会判断当前节点是否与其他节点重叠，如果重叠则使重叠节点变为当前节点的父节点，否则，当前节点返回原来的位置。

其他技术点我就不一一列出来了，有兴趣的同学可以到上面的传送门看看源码。

<!-- {% endraw %} - for jekyll -->