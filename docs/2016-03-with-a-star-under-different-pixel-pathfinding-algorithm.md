---
title: 与 A-Star 不同的像素级寻路算法下
date: 2016-03-04
author: TAT.vorshen
source_link: http://www.alloyteam.com/2016/03/with-a-star-under-different-pixel-pathfinding-algorithm/
---

<!-- {% raw %} - for jekyll -->

先贴上文地址：<http://www.alloyteam.com/2016/03/and-a-star-on-different-pixel-pathfinding-algorithm/>

之前说到了起点和终点连线平移方式的不足，那这篇文章就介绍另一个给力的方法

演示地址：

<http://westanhui.github.io/navigate/index2.html>

**注意：点击画障碍物，通过左键单击画多边形最后右键自动闭合图像**

上文中我们绕过障碍物的核心是起点和终点的连线扫过障碍物，**当障碍物为多边形的时候**，扫过障碍物一定意味着最后是扫过了障碍物上的某一个点

[![2](http://www.alloyteam.com/wp-content/uploads/2016/02/21.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/21.png)

那么这一点也一定能成为必过点，那我们就先尽可能的找到每一个点，把它当成必过点来看

[![3](http://www.alloyteam.com/wp-content/uploads/2016/02/31.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/31.png)

然后我们把**“这些必过点尽可能的相连起来，再与起点和终点相连起来，从里面找出最短的一条路径来”，**这是整个寻路的核心，已经用语言描述了出来，下面是用程序表现的一些问题

1、哪些点可能成为我们的必过点，不可能所有的点都是的，比如下图

[![4](http://www.alloyteam.com/wp-content/uploads/2016/02/4-176x300.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/4.png)

在这里我的判断方法是取起点或终点中的一点，然后**找到障碍物上能和其直接相连的点（1 级点，不止一个）**

然后遍历这些 1 级点，找到障碍物中可以直接相连的 2 级点们…… 以此内推，一直找到某一个点可以直接与终点相连

对，就是树的思想！

2、哪些点是被算作为可直接相连的

这个对于人眼看来很容易区分，但对于计算机稍微有些麻烦

[![5](http://www.alloyteam.com/wp-content/uploads/2016/02/51.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/51.png)[![6](http://www.alloyteam.com/wp-content/uploads/2016/02/61.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/61.png)[![7](http://www.alloyteam.com/wp-content/uploads/2016/02/71.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/71.png)

图中红色的连线都算作可以直接相连，而下面这样的则不算做相连

[![8](http://www.alloyteam.com/wp-content/uploads/2016/02/81.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/81.png)

程序中的判断一定要考虑周全

3、择优取点

之前说了整个核心是树的思想，不停的找某个点的下级可行直连点，什么是可行直连点，请点击下面 gif 图

[![gif5 新文件](http://www.alloyteam.com/wp-content/uploads/2016/02/gif5新文件-273x300.gif)](http://www.alloyteam.com/wp-content/uploads/2016/02/gif5新文件.gif)

看下图中障碍物上标了数字的点

由起点出发，起点的直连点有三个，1,2,3

然后我们来看 3 点的直连点有哪些，图中轻易可知有四个，起点、1,、4、5 这几个点

哪些被算作可行直连点呢，起点不可以，因为它是 3 点的父级点，1 也不可以，它是 3 点的兄弟节点

所以在这里我们认为 4 点和 5 点是 3 点的可行直连点，同理可以得到 5 点的可行直连点只有终点

再用一个树的结构图来表示一下

[![14](http://www.alloyteam.com/wp-content/uploads/2016/02/141-300x300.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/141.png)

我们过滤无用的直连点越多，程序的性能就会越快，后面的程序会具体的说下这些择优是如何判断

4、哪条路径是最短路径

[![10](http://www.alloyteam.com/wp-content/uploads/2016/02/101-167x300.png)](http://www.alloyteam.com/wp-content/uploads/2016/02/101.png)

我们都知道了每条路径的每个点，计算一下就知道最短路径了～

再贴演示地址：

<http://westanhui.github.io/navigate/index2.html>

这里没有开启 debug 了，因为 debug 也没啥好显示的…… 下面是核心程序，**完整程序请右键源代码**~

```javascript
var point = {
    x: 608,
    y: 408,
    index: n,
    childs: [],
    parent: {},
    isEnd: bool,
    isObstacle: bool,
};
```

起点、终点、每个障碍物的点，格式是这样的

x,y 是坐标，isObstacle 是标示是否是障碍物点

index 是索引，其中 start 为 - 1，end 为 - 2，障碍物的从 0 开始递增，不要问我为什么 - 1 和 - 2…… 拍脑袋

childs 是一个数组，存着该点的**可行直连点**，并不是直连点哦

**注意：存着的对象是深拷贝的！为了方便下面的 parent 属性唯一！**

parent 就是该点的父级点，最后用来确定路径的


<!-- {% endraw %} - for jekyll -->