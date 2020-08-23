---
title: 用 webgl 打造自己的 3D 迷宫游戏
date: 2016-09-18
author: TAT.vorshen
source_link: http://www.alloyteam.com/2016/09/built-with-webgl-3d-maze-game/
---

<!-- {% raw %} - for jekyll -->

背景：前段时间自己居然迷路了，有感而发就想到写一个可以让人迷路的小游戏，可以消 (bao) 遣 (fu) 时 (she) 间 (hui)

没有使用 threejs，就连 glMatrix 也没有用，纯原生 webgl 干，写起来还是挺累的，不过代码结构还是挺清晰的，注释也挺全的，点开全文开始迷宫之旅～

毕竟要赚一点 PV，所以开头没有贴地址，现在贴地址：

github：<https://github.com/westAnHui/3Dmaze>

在线试玩：<https://westanhui.github.io/3Dmaze/3Dmaze2.html>

游戏操作：鼠标控制方向，w 前进，s 后退，**切记方向键没用啊！**

迷宫本身的比较简陋，没加光和阴影啥的，挺赶的一个 demo。不过这篇文章不是介绍 webgl 技术为主的，主要是讲解整个游戏开发的情况，let's go~

1、生成 2D 迷宫

迷宫游戏嘛，肯定迷宫是主体。大家可以从游戏中看到，我们的迷宫分为 2D 迷宫和 3D 迷宫，首先说 2D 迷宫，它是 3D 迷宫的前提

生成迷宫有三种方式

a）深度优先

一言不合贴源码：<https://github.com/westAnHui/3Dmaze/blob/master/maze1.html>

先看一下用深度优先法生成迷宫的图吧

[![1](http://www.alloyteam.com/wp-content/uploads/2016/08/13-300x227.png)](http://www.alloyteam.com/wp-content/uploads/2016/08/13.png)

我们看下迷宫的特点，发现有一条**很明显的主路**，是不是能理解算法名中 “深度优先” 的含义了。简单介绍一下算法的原理：

[![2](http://www.alloyteam.com/wp-content/uploads/2016/08/22-300x173.png)](http://www.alloyteam.com/wp-content/uploads/2016/08/22.png)

知道了原理，我们着手来制造 2D 迷宫～

首先得确定墙和路的关系，考虑到迷宫转化为 3D 之后墙立体一点，我们就不要用 1px 的线来模拟墙了，那样 3D 之后不够饱满～

这里我们设置墙的厚度为路的宽度，都是 10px，然后我们的底图应该是这样子的（注：理解这幅图最为关键）：

[![3](http://www.alloyteam.com/wp-content/uploads/2016/08/32.png)](http://www.alloyteam.com/wp-content/uploads/2016/08/32.png)

白色部分是路，也可以理解为原理中所说的邻格，这是**可以达到的**

灰色部分是墙，这个墙**可能会打通，也可能没有打通**

黑色部分是墙，这个墙是**不可能打通的**！！

如果脑子没转过来就看下图，转化理解

[![4](http://www.alloyteam.com/wp-content/uploads/2016/08/42.png)](http://www.alloyteam.com/wp-content/uploads/2016/08/42.png)

红线就是玩家的路径啦，其中我们看到穿过了三个黑色的矩形，这就是上面所说的灰色格，可能打通，也可能没打通，蓝色那块就是没打通的情况；而黑色部分正对应上面的黑色格，这是不可能打通的，如果把墙看成一个面 (灰色蓝色部分再压缩)，黑色就变成一个点，是横墙与竖墙的交点，玩家不会走交点上面走的～

好，下面就是套算法的过程啦，写的过程中我把墙的部分给省略了，全部考虑成路

```javascript
var maxX = 18;
var maxY = 13;
```

以宽度来解释，Canvas 宽度 390px，有 18 列的路（20 列的墙暂时被我无视），不理解的可以对照图看一下

initNeighbor 方法是获得邻格用的，注意最后有一个随机，将它的邻格打乱，这样我们在 getNeighbor 中获取邻格就很方便了

```javascript
Grid.prototype.getNeighbor = function() {
    var x, y, neighbor;
    this.choosed = true; // 标记当前格
    for(var i = 0; i < this.neighbor.length; i++) {
        x = this.neighbor[i].x;
        y = this.neighbor[i].y;
        neighbor = maze.grids[y][x];
        if(!neighbor.choosed) { // 邻格是否标记过
            neighbor.parent
```


<!-- {% endraw %} - for jekyll -->