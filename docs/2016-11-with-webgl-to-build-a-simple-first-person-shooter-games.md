---
title: 用 webgl 打造一款简单第一人称射击游戏
date: 2016-11-03
author: TAT.vorshen
source_link: http://www.alloyteam.com/2016/11/with-webgl-to-build-a-simple-first-person-shooter-games/
---

<!-- {% raw %} - for jekyll -->

背景：不知道大家还记不记得上次那个 3D 迷宫游戏，有同事吐槽说游戏中间有一个十字瞄准器，就感觉少了一把枪。好吧，那这次就带来一款第一人称射击游戏。写 demo 锻炼，所以依旧用的原生 webgl，这次重点会说一下 webgl 中关于摄像头相关的知识，点开全文在线试玩～～

simpleFire 在线试玩：<https://vorshen.github.io/simpleFire/index.html（推荐开声音……> 否则没有打击感会觉得游戏有点呆……）

simpleFire 源码地址：<https://github.com/vorshen/simpleFire>

说明：

游戏比较简单（所以叫 **simple**Fire）…… 不过也勉强算是一款第一人称射击游戏啦～

由于时间非常有限，这次真的不是懒！！相信我！！所以界面比较丑，见谅见谅（讲良心说，这比 3D 迷宫真的走心多了……）

上次 3D 迷宫文章重点介绍了迷宫的几种算法，webgl 没怎么讲，这篇文章会重点讲下 webgl 中摄像机相关的知识，webgl 基础知识会简单带一下

最后贴一下上次 3D 迷宫的地址：<https://vorshen.github.io/3Dmaze/3Dmaze2.html>

**1、游戏准备：**

做一款游戏和做一个项目是一样的，不能刚有想法了就直接开始撸代码。一个前端项目可能要考虑框架选型、选用何种构建、设计模式等等；而一款游戏，在确定游戏类型之后，要考虑游戏玩法，游戏场景，游戏关卡，游戏建模美术等等，而这些很多都是非代码技术层面的，在真正的游戏开发中会有专门那个领域的人去负责，所以一款好的游戏，每一个环节都不可或缺。

上面是关于游戏开发的碎碎念，下面开始真正的讲解 simpleFire 这款游戏。

试玩之后大家应该会发现游戏整个场景非常简单，一把枪，四面墙，墙上面有靶子，将所有的靶子都打掉则游戏结束，最终的游戏分数是： 击中靶子数 + 剩余时间转换。此时读者可能内心感受：这尼玛在逗我呢，这也太简单了吧。先别急，接下来说下游戏准备过程中遇到的坑点

因为是 3D 游戏，而且涉及到了不同的物体在 3D 空间中存在（枪、靶子、墙），之前那 3D 迷宫准备工作之所以简单是空间中从头到尾就只有 “墙” 这一个东西。

要让枪、靶子、墙这些东西同处一个空间内很简单，把他们顶点信息写进 shader 就行了嘛

（在这里考虑到可能有没接触过 webgl 的同学，所以简单介绍一下，canvas 是对象级别的画板操作，drawImage 画图片，arc 画弧度等，这些都是对象级别操作。而 webgl 是片元级操作，片元在这里可以先简单理解为像素，只是它比像素含有更多的信息。上面所说的把顶点信息写进 shader，可以理解为把枪、靶子、墙这些东西的坐标位置画进 canvas。先就这样理解着往下看吧～如果 canvas 也不知道那就没办法了。。。）

顶点信息从哪来？一般是设计师建模弄好了，导成相关文件给开发者，位置、颜色等等都有。但是…… 我这里没有任何相关信息，全部得自己来做。

自己跟前又没有专业的建模工具，那该如何生成顶点信息？用脑补 + 代码生成…… 事先声明，这是一种很不对很不对的方式，自己写点 demo 可以这样玩，但是生产中千万别这样。

这里就用生成枪来举例，我们知道普通制式手枪长 180mm 到 220mm 左右，在这里取 20cm，并将其长度稍微小于视锥体近平面的长度，视锥体近平面也看作为屏幕中 webgl 画布的宽度。所以我们生成的枪理论上应该是这样的，如图所示：

[![1](http://www.alloyteam.com/wp-content/uploads/2016/11/1-300x225.png)](http://www.alloyteam.com/wp-content/uploads/2016/11/1.png)

好了，枪的比例确定之后就要结合 webgl 坐标系生成顶点信息了，webgl 坐标系和 canvas2D 坐标系有很大的不同，如图：

[![2](http://www.alloyteam.com/wp-content/uploads/2016/11/2-300x143.png)](http://www.alloyteam.com/wp-content/uploads/2016/11/2.png)

因为是代码手动生成顶点信息，用 - 1~1 写起来有点难受，所以这里我们先放大 10 倍，后面在把除回去，蛋疼吧，这就是不走正途的代价……

代码该怎么生成顶点信息呢？用代码画一把枪听起来很难，但是用代码画一条线、画一个圆、画一个正方体等，这些不难吧，因为这些是基本图形，有数学公式可以得到。一个复杂的模型，我们没法直接确定顶点信息，那就只好通过各种简单模型去拼凑了，下面这个页面就是简单的拆分了下枪的模型，可以看到是各个简单子模型拼凑而成的（说明：建模形成的也是拼凑，不过它的一块块子模型不是靠简单图形函数方法生成）。

手枪生成展示：<https://vorshen.github.io/simpleFire/gun.html>

这种方式有什么坏处：工作量大而且不好看、扩展性差、可控性差

这种方式有什么好处：锻炼空间想象力与数学函数应用吧……

介绍了这么多，其实就想说：这么恶心且吃力不讨好的活我都干下来了，真的走心了！

具体怎么用简单图形函数生成的子模型可以看代码，代码看起来还是比较简单，有一定立体几何空间想象力就好，这里不细讲，毕竟非常非常不推荐这样玩。

枪建模相关代码地址：<https://github.com/vorshen/simpleFire/blob/master/js/gun.js>

**2、游戏视角**

第一人称射击类游戏玩的是什么？就是谁开枪开的准，这个是永恒不变的，就算是 OW，在大家套路都了解、可以见招拆招的情况下，最终也是比枪法谁更准。那么枪法准是如何体现的呢？就是通过移动鼠标的速度与准确度来体现（这里没有什么 IE3.0……），对于玩家来说，**手中移动的是鼠标，映射在屏幕上的是准心**，对于开发者来说，**移动的是视角**，也就是 3D 世界中的摄像头！

先说下摄像头的基本概念和知识，webgl 中默认的摄像头方向是朝着 Z 轴的负方向，随手画了图表示下（已知丑，轻吐槽）

[![3](http://www.alloyteam.com/wp-content/uploads/2016/11/3-300x164.png)](http://www.alloyteam.com/wp-content/uploads/2016/11/3.png)

摄像头位置不变，同一个物体在不同位置能给我们不同的感受，如下

[![4](http://www.alloyteam.com/wp-content/uploads/2016/11/4-300x200.png)](http://www.alloyteam.com/wp-content/uploads/2016/11/4.png) [![5](http://www.alloyteam.com/wp-content/uploads/2016/11/5-300x200.png)](http://www.alloyteam.com/wp-content/uploads/2016/11/5.png)

摄像头位置改变，同一个物体位置不变，也能给我们不同的感受，如下

[![6](http://www.alloyteam.com/wp-content/uploads/2016/11/6-300x200.png)](http://www.alloyteam.com/wp-content/uploads/2016/11/6.png) [![7](http://www.alloyteam.com/wp-content/uploads/2016/11/7-300x200.png)](http://www.alloyteam.com/wp-content/uploads/2016/11/7.png)

等等！这似乎并没有什么区别啊！感觉上就是物体发现了变化啊！确实如此，就好像你在车上，看窗外飞驰而过的风景那般道理。

**摄像头的作用也就是改变物体在视锥体中的位置，物体移动的作用也是改变其在视锥体中的位置！**

熟悉 webgl 的中的同学了解

```c
gl_Position = uPMatrix * uVMatrix * uMMatrix * aPosition;
```

对于不了解的同学，可以这样理解

gl_Position 是最终屏幕上的顶点，aPosition 是最初我们生成的模型顶点

uMMatrix 是模型变换矩阵，比如我们想让物体移动、旋转等等操作，可以再次进行

uPMatrix 是投影变换矩阵，就理解为 3 维物体能在 2D 屏幕上显示最为重要的一步

uVMatrix 是视图变换矩阵，就是主角！我们用它来改变摄像头的位置

我们的重点也就是玩转 uVMatrix 视图矩阵！在这里，用过 threejs 或者 glMatrix 的同学肯定就很诧异了，这里有什么好研究的，直接 lookAt 不就不搞定了么？

确实 lookAt 就是用来操作视图矩阵的，考虑到没用过的用户，所以这里先说一下 lookAt 这个方法。

lookAt 功能如其名，用来确认 3D 世界中的摄像机方向（操作视图矩阵），参数有 3 个，第一个是眼睛的位置，第二个是眼睛看向目标的位置，第三个是坐标的正上方向，可以想象成脑袋的朝上方向。

用图来展示的话就是如下图（已知丑，轻吐槽）：

[![8](http://www.alloyteam.com/wp-content/uploads/2016/11/8-300x199.png)](http://www.alloyteam.com/wp-content/uploads/2016/11/8.png)

知道了 lookAt 的用法，接下来我们来看一下 lookAt 的原理与实现。lookAt 既然对应着视图矩阵，将它的结果想象成矩阵 VM

大家知道 webgl 中最初的坐标系是这样的

[![9](http://www.alloyteam.com/wp-content/uploads/2016/11/9-300x268.png)](http://www.alloyteam.com/wp-content/uploads/2016/11/9.png)

那么如果我们知道最终的坐标系，就可以逆推出矩阵 VM 了。这个不难计算，结果如下

[![10](http://www.alloyteam.com/wp-content/uploads/2016/11/10-300x152.png)](http://www.alloyteam.com/wp-content/uploads/2016/11/10.png)

来，回看一下 lookAt 第一个和第二个参数，**眼睛的位置**和**眼睛看向目标的位置**，有了这两个坐标，最终坐标系的 Z 是不是确定了！，最后一个参数是正上方向，是不是 Y 也确定了！

机智的同学看到有了 Z 和 Y，立马想到可以用叉积算出 X，不知道什么是叉积的可以搜索一下（学习 webgl 一定要对矩阵熟悉，这些知识是基础）

这样我们就很轻松愉快的得出了 VM，但是！似乎有点不对劲

本身 VM 是没有问题的，关键在于这么使用它，比如说我直接 lookAt (0,0,0, 1,0,0, 0,1,0) 使用，可以知道此时我们的视线是 X 轴的正方向，但若是我鼠标随便晃一个位置，你能快速的知道这三个参数该如何传么？

所以现在的目标就是通过鼠标的偏移，来计算出 lookAt 的三个参数，先上代码～

```javascript
var camera = {
    rx: 0,
    ry: 0,
    mx: 
```


<!-- {% endraw %} - for jekyll -->