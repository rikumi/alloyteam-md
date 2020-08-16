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
Grid.prototype.getNeighbor = function () {
    var x, y, neighbor;
    this.choosed = true; // 标记当前格
    for (var i = 0; i < this.neighbor.length; i++) {
        x = this.neighbor[i].x;
        y = this.neighbor[i].y;
        neighbor = maze.grids[y][x];
        if (!neighbor.choosed) {
            // 邻格是否标记过
            neighbor.parent = this; // 选中的邻格父级为当前格
            return neighbor;
        }
    }
    if (this.parent === firstGrid) {
        return 0; // 结束
    } else {
        return 1; // 这里是邻格都被标记过，返回父级
    }
};
```

这里比较核心，注释给的也比较全，结合前面的原理图应该很好懂

再看下 maze 里面的 findPath 方法，在这里面调用的 getNeighbor 方法

```javascript
Maze.prototype.findPath = function () {
    var tmp;
    var curr = firstGrid; // 先确定起点
    while (1) {
        tmp = curr.getNeighbor(); // 获得邻格
        if (tmp === 0) {
            console.log("路径找寻结束");
            break;
        } else if (tmp === 1) {
            // 邻格都被标记，回到父级
            curr = curr.parent;
        } else {
            // 找到了一个没被标记的邻格，存起来
            curr.children[curr.children.length] = tmp;
            curr = tmp;
        }
    }
};
```

可以看到 parent 和 children 属性是不是本能的就反应起树的概念了，那不就是深度的思想么～

核心的代码讲解了，其他的画图部分就不介绍了，在 drawPath 方法里面，原理就是先画一个节点 (一个格子)，然后它的 children 格和它打通 (前面图中灰色格子转为白色)，再去画 children 格……

注：开头给的试玩 demo 用的不是深度优先算法，**下面这个是深度优先生成的迷宫游戏**，可以感受一下，这样与开头的有一个对比

<https://westanhui.github.io/3Dmaze/3Dmaze1.html>

b）广度优先 (prim 随机)

一言不合贴源码：<https://github.com/westAnHui/3Dmaze/blob/master/maze2.html>

再看一下广度优先生成的迷宫图～可以和上面的对比一下

[![16](http://www.alloyteam.com/wp-content/uploads/2016/08/16-300x225.png)](http://www.alloyteam.com/wp-content/uploads/2016/08/16.png)

前面说的深度优先算法挺好理解的，人类语言表达出来就是 “一直走，能走多远走多远，发现不通了，死路了，再回去想想办法”。

但是，用深度优先算法在迷宫游戏中有很致命的一个缺点，就是简单，那条明显的主路让玩家不看 2D 地图都能轻松的绕出来 (路痴退散)，这明显不符合开头所说的消 (bao) 遣 (fu) 时 (she) 间 (hui) 的主题，那么正主来啦～

prim（普里姆）算法是传统迷宫游戏的标准算法，岔路多，复杂。我觉得有广度优先的思想，所有自己也称广度优先算法，正好和上一个对应上。贴原理图～

[![5](http://www.alloyteam.com/wp-content/uploads/2016/08/52-280x300.png)](http://www.alloyteam.com/wp-content/uploads/2016/08/52.png)

人类语言表达出来就是 “随机的方式将地图上的墙尽可能打通”，还记得这个底图么，照着这个底图我解释一下

[![6](http://www.alloyteam.com/wp-content/uploads/2016/08/62.png)](http://www.alloyteam.com/wp-content/uploads/2016/08/62.png)

选择 1 为起点，并标记。1 的邻墙有 2，3，放入数组中。

此时数组 \[2, 3]，随机选择一个，比如我们选到了 2，2 的对面格是 4，此时 4 没有被标记过，**打通 2（将 2 由灰变成白色）**，并将 4 标记，并把 5，6 放入数组

此时数组 \[2, 3, 5, 6]，继续随机……

结合一下源码，发现这次写法和上次的完全不同了，在深度优先中我们直接没考虑墙的存在，**主体是路（白色的格子）**，将他们变成树的结构即可，**在后面绘制部分再会考虑墙的位置**

而在广度优先中，我认为主体是墙（灰色的格子），所以算法中一定要把墙的概念带上，在 initNeighbor 方法中路 (白色格) 的邻格已经是 + 2 而不是之前的 + 1 了，因为 + 1 是墙 (灰色格)

再看重要的 getNeighbor 方法

```javascript
Grid.prototype.getNeighbor = function () {
    var x,
        y,
        neighbor,
        ret = [];
    this.choosed = true;
    for (var i = 0; i < this.neighbor.length; i++) {
        x = this.neighbor[i].x;
        y = this.neighbor[i].y;
        neighbor = maze.grids[y][x];
        neighbor.wallX = this.x + (x - this.x) / 2; // 重要！
        neighbor.wallY = this.y + (y - this.y) / 2; // 重要！
        if (!neighbor.choosed) {
            ret.push(neighbor);
        }
    }
    return ret;
};
```

看起来我们获得的是邻格，但实际上我们**要的是挂载在邻格上的 wallX 和 wallY 属性**，所以我们可以把 neighbor 抽象的就看成是墙！！在下面 findPath 方法中就是这样用的

```javascript
Maze.prototype.findPath = function () {
    var tmp;
    var curr = firstGrid;
    var index;
    var walls = this.walls;
    tmp = curr.getNeighbor();
    curr.isClear = true; // 标记
    walls.push.apply(walls, tmp);
    while (walls.length) {
        index = (Math.random() * walls.length) >> 0; // 随机取
        wall = walls[index];
        if (!wall.isClear) {
            // 如果不是通路
            wall.isClear = true;
            this.path.push({
                x: wall.wallX, // 重要！
                y: wall.wallY, // 重要！
            });
            tmp = wall.getNeighbor();
            walls.push.apply(walls, tmp); // 加入更多的墙
        } else {
            walls.splice(index, 1); // 如果是通路了就移除
        }
    }
    console.log("路径找寻结束", this.path);
};
```

如果感觉有点绕的话可以结合原理图再慢慢的看代码，核心理解的一点就是 getNeighbor 方法返回的 **x，y 对应是路（白色格）**，而它的 **wallX，wallY 对应的是墙（灰色格）**

画图部分很简单

```c
for(i = 0; i <= 290; i+=20) { // 隔行画横线(横墙)
    ctx.fillRect(0, i, 390, 10);
}
 
for(i = 0; i <= 390; i+=20) { // 隔行画竖线(竖墙)
    ctx.fillRect(i, 0, 10, 290);
}
 
ctx.fillStyle = 'white';
 
for(i = 0; i < this.path.length; i++) { // 打通墙
    ctx.fillRect(10 + this.path[i].x * 10, 10 + this.path[i].y * 10, 10, 10);
}
```

c）递归分割法

这个实在是超级简单，原理简单，算法简单，我就不介绍啦。一来这个生成的迷宫也超级简单，一般不用于传统迷宫游戏；二来后面还有很多要介绍的，不浪费口水在这了

2、生成 3D 迷宫

此时我们已经有一个 2D 迷宫，我们可以将其看成是俯视图，下面就是将其转化为 3D 顶点信息

**注：这篇文章不负责介绍 webgl！！我也尽量避开 webgl 知识，通俗一点的介绍给大家～**

将 2D 转 3D，首先非常重要的一点就是坐标系的转化

2D 的坐标系是这样的

[![7](http://www.alloyteam.com/wp-content/uploads/2016/08/7-300x233.png)](http://www.alloyteam.com/wp-content/uploads/2016/08/7.png)

3D 的坐标系是这样的

[![8](http://www.alloyteam.com/wp-content/uploads/2016/08/8-300x128.png)](http://www.alloyteam.com/wp-content/uploads/2016/08/8.png)

感觉到蛋疼就对了～后面考虑到摄像机近平面的碰撞计算还得蛋碎呢～

其实这个坐标转换并不难，首先我们先通过 2D 迷宫获得墙面的信息（黑色部分）

下面这段代码是获得横墙信息的

```javascript
function getRowWall() {
    var i = 0;
    var j = 0;
    var x1, x2;
    console.log("getRowWall");
    for (; i < height; i += 10) {
        rowWall[i] = [];
        j = 0;
        while (j < width) {
            if (isBlack(j, i)) {
                x1 = j; // 记录横墙开始点
                j += 10;
                while (isBlack(j, i) && j < width) {
                    j += 10;
                }
                x2 = j; // 记录横墙结束点
                if (x2 - x1 > 10) {
                    // 这步很关键！！
                    rowWall[i].push({
                        x1: 2 * (x1 / width) - 1,
                        x2: 2 * (x2 / width) - 1,
                    });
                }
            }
            j += 10;
        }
    } // console.log(rowWall);
}
```

结果会得到一个数组，注意一下注释中很关键的一步，为什么要**大于 10**

下面两张图给你答案

[![9](http://www.alloyteam.com/wp-content/uploads/2016/08/9-300x210.png)](http://www.alloyteam.com/wp-content/uploads/2016/08/9.png)

[![10](http://www.alloyteam.com/wp-content/uploads/2016/08/10-300x210.png)](http://www.alloyteam.com/wp-content/uploads/2016/08/10.png)

总结就是小于等于 10px 的横墙，**那它的本体一定是竖墙**，10px 也是那一行正好看到的，我们就将他们过滤掉了

得到竖墙信息同理，源码可见，我就不贴出来了

下面这段代码是 2D 坐标转化为顶点信息

```c
// k1和k2算作Z轴
for(i = 0; i < rowWall.length; i += 10) { // rowWall.length
    item = rowWall[i];
    while((tmp = item.pop())) {
        k1 = (2 * i / height) - 1;
        k2 = (2 * (i + 10) / height) - 1;
        po_data.push.apply(po_data, [
            tmp.x1*120+0.01, -1.09, k1*120, // 左下
            tmp.x2*120+0.01, -1.09, k1*120, // 右下
            tmp.x2*120+0.01, 0.2, k1*120, // 右上
            tmp.x1*120+0.01, 0.2, k1*120, // 左上
 
            tmp.x2*120+0.01, -1.09, k1*120,
            tmp.x2*120+0.01, -1.09, k2*120,
            tmp.x2*120+0.01, 0.2, k2*120,
            tmp.x2*120+0.01, 0.2, k1*120,
 
            tmp.x1*120+0.01, -1.09, k2*120,
            tmp.x2*120+0.01, -1.09, k2*120,
            tmp.x2*120+0.01, 0.2, k2*120,
            tmp.x1*120+0.01, 0.2, k2*120,
 
            tmp.x1*120+0.01, -1.09, k1*120,
            tmp.x1*120+0.01, -1.09, k2*120,
            tmp.x1*120+0.01, 0.2, k2*120,
            tmp.x1*120+0.01, 0.2, k1*120,
 
            tmp.x1*120+0.01, 0.2, k1*120,
            tmp.x2*120+0.01, 0.2, k1*120,
            tmp.x2*120+0.01, 0.2, k2*120,
            tmp.x1*120+0.01, 0.2, k1*120
        ]);
    }
}
```

乘以 120 是我 3D 空间中 X 轴和 Z 轴各放大了 120 倍，没有写在模型变换矩阵里面，Y 轴的方法在模型变化矩阵中，不过那不重要。

数组中三个单位为一点，四个点为一个面，五个面为 3D 迷宫中一堵墙（底面的不管）

后面是 webgl 里面常规操作，各种矩阵、绑定 buffer、绑定 texture 等等 balabala，原生 webgl 写起来是比较累，无视了光和阴影还要写这么多 T_T

3、摄像机碰撞检测

如果说前面的代码写着很累看着累，那这里的就更累了……

摄像机是什么？在 3D 中摄像机就是玩家的视角，就是通过鼠标和 w，s 来移动的 webgl 可视区，那么在 2D 中摄像机映射为什么呢？

2D 中摄像机就是**红色的那个圈圈的右点**，如图！

[![11](http://www.alloyteam.com/wp-content/uploads/2016/08/111-300x197.png)](http://www.alloyteam.com/wp-content/uploads/2016/08/111.png)

那么大的圈圈只是方便看而已……

碰撞检测的作用是防止出现透视现象，透视现象如下图所示：

[![12](http://www.alloyteam.com/wp-content/uploads/2016/08/121-300x236.png)](http://www.alloyteam.com/wp-content/uploads/2016/08/121.png)

要介绍透视现象出现的原因，就得先了解一下视锥体，如图：

[![13](http://www.alloyteam.com/wp-content/uploads/2016/08/131-300x175.png)](http://www.alloyteam.com/wp-content/uploads/2016/08/131.png)

看到近平面了吗，当物体穿过近平面，就会出现透视现象了

[![14](http://www.alloyteam.com/wp-content/uploads/2016/08/14-300x157.png)](http://www.alloyteam.com/wp-content/uploads/2016/08/14.png)

我们游戏中近平面距离是 0.1，所以可能看成围绕原点有一个矩形，只要让矩形碰到不边，那就不会出现透视现象

矩形的宽度我设置为 2，设大了一些，也没必要让玩家贴墙贴的那么近……

我们通过调用摄像机的 move 方法触发 Role.prototype.update 方法

```javascript
move: function(e){
    // 只考虑x和z轴移动，cx，cy是转换为2D的方向
    cx = Math.sin(-this.rot) * e;
    cy = Math.cos(-this.rot) * e;
 
 
    this.x += cx;
    this.z += cy;
 
    ret = role.check(-this.x/120, this.z/242, -cx, cy); // 后两个参数代表方向
 
    if(ret.x === 0) {
        this.x -= cx;
    } else {
        role.x = ret.x;
    }
 
    if(ret.y === 0) {
        this.z -= cy;
    } else {
        role.y = ret.y;
    }
 
    role.update();
}
```

而 update 方法里面更新 x0,x2,y0,y2 就是对应那四个点，这四个点在 check 方法里面用到，check 通过则移动摄像机，否则不移动

摄像机与墙的整体检测在 Role.prototype.isWall 中，注意这里有两个参数，cx 和 cy，这个是方向，确切的说是**将要移动的方向**，然后我们根据方向，只会从这四个点中取三个来判断会不会有碰撞

[![15](http://www.alloyteam.com/wp-content/uploads/2016/08/15.png)](http://www.alloyteam.com/wp-content/uploads/2016/08/15.png)

每个点的检测通过 Role.prototype.pointCheck 方法，通过像素来判断的，发现是黑色值 (rgb 中的 r 为 0) 那么就认为撞上了，会在 2D 中标记黄色。如果你贴着墙走，就会发现黑色的墙都被染成黄色啦～

结语：

写累死，这还是在把 webgl 里面知识点大部分丢掉的情况下。迷宫整体比较简单，就两张贴图，地面也很简陋，最近需求比较多，很忙，没太多时间去美化。有兴趣的同学可以做一款属于自己棒棒的迷宫游戏～

感兴趣有疑问的可以留言一起交流～


<!-- {% endraw %} - for jekyll -->