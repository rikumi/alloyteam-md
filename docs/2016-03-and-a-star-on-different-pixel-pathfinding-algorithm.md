---
title: 与 A-Star 不同的像素级寻路算法上
date: 2016-03-04
author: TAT.vorshen
source_link: http://www.alloyteam.com/2016/03/and-a-star-on-different-pixel-pathfinding-algorithm/
---

<!-- {% raw %} - for jekyll -->

前言：

寻路是游戏中非常重要的一项功能，这项功能将直接体现出 AI 的智商如何。那说起寻路的算法，就不得不提标题上面的 A star 算法了。A Star（又称 A\*），是结合了 Dijkstra 算法和贪心算法优点的算法，对此不了解的同学可以去搜索一下，这里不具体介绍实现，而是简单的说一下原理，为后面我们的主角铺垫。

A Star 的核心在于将游戏背景**分为一个又一个格子**，每个格子有自己的靠谱值，然后通过遍历起点的格子去找到周围靠谱的格子，接着继续遍历周围…… 最终找到终点。好了，A Star 的介绍就到这里了，因为它不是文章的主角。

文章篇幅较长所以分为上下文，下文地址：

上下文各有一种实现方式，区别看了就知道，此外上文包含了一些研究寻路的思考。

开头介绍 A Star 我们提及了格子，这是 A Star 最核心的一个地方，不过并不是所有游戏都引入了格子的概念，还有很多的游戏是像素级别的。虽然说像素也是一个个的格子，如果用 A Star 针对像素来寻路，试想如果一个 1366\*768 分辨率的屏幕，那格子的总数将会有 1049088 个，这明显是很不合适的。

那么接下来就有请我们的文章主角出场了，算法没有名字，因为百分百原创，可能还有一些自己没有发现的坑点，希望和大家一起讨论研究～

1、寻路的本质是什么

在现实生活中寻路就是从起点到达目的地，在游戏中也是如此，区别在于我们人在现实中会自己避开各个障碍物，而计算机不会，所以寻路本质就是**我们帮助计算机避开一个又一个障碍物**

如果我们对计算机下达一个从红点到蓝点的命令，如图

[![1](http://www.alloyteam.com/wp-content/uploads/2016/02/1.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/1.png)

第二幅图中我们必须要帮助计算机绕开多边形

[![2](http://www.alloyteam.com/wp-content/uploads/2016/02/2.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/2.png)  

 

2、该以怎么样的方式绕开

下图中红线和蓝线都是绕开的表现，但所有人都不会选择蓝色的方式，因为它远

[![3](http://www.alloyteam.com/wp-content/uploads/2016/02/3.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/3.png)

远的路径有很多很多，那么什么是最近的呢，我们知道：**两点之间，线段最短**

但我们用最短路径的话一定与障碍物多边形相交，这时候我们换一种思维，不考虑绕过，而考虑什么时候不会相交，如图

[![15](http://www.alloyteam.com/wp-content/uploads/2016/02/15-300x279.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/15.png)

看！只要将起点终点平移了就没有相交了！

先别慌着喷我…… 看下图

[![5](http://www.alloyteam.com/wp-content/uploads/2016/02/5.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/5.png)

这里 A 点我称之为必过点，就是以最短绕开路径一定会经过的点，①

我们刚刚通过平移移动起点和终点的绝对位置，不改变它们相对位置，扫过了障碍物区域，发现了一个必过点

整个寻路的思想就是如此！

接下来说具体在程序中是如何实现的

a、先将起点终点连接

b、针对连线的垂直平分线方向平移

c、直到发现连线没有与障碍物相交即可

d、去障碍物上与那个没有相交的线最近点 (也就是必过点)，分别与起点和终点相连

[![6](http://www.alloyteam.com/wp-content/uploads/2016/02/6.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/6.png)[![7](http://www.alloyteam.com/wp-content/uploads/2016/02/7.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/7.png)[![8](http://www.alloyteam.com/wp-content/uploads/2016/02/8.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/8.png)

整个流程就是如此，下面说实现过程中的一些难点和坑点

1、如何找到必过点

因为我们所说的连线与障碍物相交，本质上是与障碍物中的某一条线相交了

图中蓝线和红线相交所以说与障碍物相交了

[![9](http://www.alloyteam.com/wp-content/uploads/2016/02/9.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/9.png)

我们找必过点的方式就是首先找到连线最后相交的障碍物的两点，然后针对这两点分别求到起点和终点的距离

[![10](http://www.alloyteam.com/wp-content/uploads/2016/02/10.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/10.png)

就是图中比较 a1+a2 和 b1+b2 的大小，距离小的就是必过点

2、第一次找到的必过点无法直接和终点或起点相连

这个就是用核心思想递归的再去找下一个必过点

不过代码里面我是用循环做的

给出一张开启 debug 的演示图

[![11](http://www.alloyteam.com/wp-content/uploads/2016/02/11-235x300.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/11.png)

那么多黑点黑线是平移的轨迹，然后黄点是第一个必过点，此时发现黄点无法与蓝色点相连，那么 continue，以黄点为起点和蓝点为终点，找出第二个必过点粉色的点

3、平移连线穿过必过点，大坑

注意小标题中的**穿**字，先用一个例子表示出来

[![12](http://www.alloyteam.com/wp-content/uploads/2016/02/12-192x300.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/12.png)

开启 debug 我们走一遍看看～

[![13](http://www.alloyteam.com/wp-content/uploads/2016/02/13-224x300.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/13.png)

注：我这里设定了只找一个必过点，所以出现了穿越的情况

但问题是怎么必过点（绿点）会出现在这儿！！

因为那个红框，**平行线（红框内的那个）过了障碍物没问题，但它是穿越过去的！**不是按我们想的横扫过去的！

那该如何解决，这时候就需要我们矫正起点和终点了

只需要把起点和终点都保证在障碍物的 AABB 外就可以了，AABB 就是将一个多边形看成长方形，它的 x，y，width 和 height

这个在 AABB 外也不是随便取得，必须按照连线的方向去延长，让我们看看效果

如图所示

[![14](http://www.alloyteam.com/wp-content/uploads/2016/02/14-152x300.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/14.png)

**在线演示地址：**<http://westanhui.github.io/navigate/index.html>

**注意：点击画障碍物，通过左键单击画多边形最后右键自动闭合图像**

下面贴核心代码和解释（完整代码可查看页面源代码）


<!-- {% endraw %} - for jekyll -->