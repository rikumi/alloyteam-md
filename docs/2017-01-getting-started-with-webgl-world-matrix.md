---
title: webgl 世界 matrix 入门
date: 2017-01-16
author: TAT.vorshen
source_link: http://www.alloyteam.com/2017/01/getting-started-with-webgl-world-matrix/
---

<!-- {% raw %} - for jekyll -->

这次没有带来游戏啦，本来还是打算用一个小游戏来介绍阴影，但是发现阴影这块想完完整整介绍一次太大了，涉及到很多，再加上业务时间的紧张，所以就暂时放弃了游戏，先好好介绍一遍 webgl 中的 Matrix。  
这篇文章算是 webgl 的基础知识，因为如果想不走马观花的说阴影的话，需要打牢一定的基础，文章中我尽力把知识点讲的更易懂。内容偏向刚上手 webgl 的同学，至少知道着色器是什么，webgl 中 drawElements 这样的 API 会使用～

文章的标题是 Matrix is magic，矩阵对于 3D 世界来说确实是魔法一般的存在，说到 webgl 中的矩阵，PMatrix／VMatrix／MMatrix 这三个大家相信不会陌生，那就正文 let's go~

**1/ 矩阵的来源**  
刚刚有说到 PMatrix／VMatrix／MMatrix 这三个词，他们中的 Matrix 就是矩阵的意思，矩阵是干什么的？**用来改变顶点位置信息的**，先牢记这句话，然后我们先从 canvas2D 入手相信一下我们有一个 100\*100 的 canvas 画布，然后画一个矩形

```html
<canvas width="100" height="100"></canvas>;
ctx.rect(40, 40, 20, 20);
ctx.fill();
```

代码很简单，在画布中间画了一个矩形

现在我们希望将圆向左移动 10px

    ctx.rect(30, 40, 20, 20);
    ctx.fill();

结果如下：

源码地址：<https://vorshen.github.io/3Dmaze/1.html>  
结果展示：[![1](http://www.alloyteam.com/wp-content/uploads/2016/12/1-300x213.png)](http://www.alloyteam.com/wp-content/uploads/2016/12/1.png)

改变 rect 方法第一个参数就可以了，很简单，因为 rect () 对应的就是一个矩形，是一个**对象**，canvas2D 是对象级别的画布操作，而 webgl 不是，webgl 是片元级别的操作，我们操作的是顶点  
用 webgl 如何画一个矩形？地址如下，可以直接查看源码

源码地址：<https://vorshen.github.io/3Dmaze/2.html>  
结果展示：[![2](http://www.alloyteam.com/wp-content/uploads/2016/12/2.png)](http://www.alloyteam.com/wp-content/uploads/2016/12/2.png)

这里我们可以看到 position 这个数组，这里面存的就是矩形 4 个点的顶点信息，我们可以通过操作改变其中点的值来改变位置 (页面源码也可以看到实现)，但是扪心自问这样不累吗？有没有可以**一次性改变某个物体所有顶点的方式呢？**  
有，那就是矩阵，magic is coming

1  0  0  0  
0  1  0  0  
0  0  1  0  
0  0  0  1

上面这个是一个单位矩阵（矩阵最基础的知识这里就不说了），我们用这个乘一个顶点 (2,1,0) 来看看  
[![3](http://www.alloyteam.com/wp-content/uploads/2016/12/3-300x118.png)](http://www.alloyteam.com/wp-content/uploads/2016/12/3.png)

并没有什么变化啊！那我们换一个矩阵来看

1  0  0  1  
0  1  0  0  
0  0  1  0  
0  0  0  1

再乘之前那个顶点，发现顶点的 x 已经变化了！  
[![4](http://www.alloyteam.com/wp-content/uploads/2016/12/4-300x111.png)](http://www.alloyteam.com/wp-content/uploads/2016/12/4.png)

如果你再多用几个顶点试一下就会发现，无论我们用哪个顶点，都会得到这样的一个 **x 坐标 + 1** 这样一个结果  
来，回忆一下我们之前的目的，现在是不是有了一种**一次性改变顶点位置**的方式呢？

**2/ 矩阵规律介绍**  
刚刚我们改变了矩阵 16 个值中的一个，就使得矩阵有改变顶点的能力，我们能否总结一下矩阵各个值的规律呢？当然是可以的，如下图

[![5](http://www.alloyteam.com/wp-content/uploads/2016/12/5.png)](http://www.alloyteam.com/wp-content/uploads/2016/12/5.png)  
这里红色的 x，y，z 分别对应三个方向上的偏移

[![6](http://www.alloyteam.com/wp-content/uploads/2016/12/6.png)](http://www.alloyteam.com/wp-content/uploads/2016/12/6.png)  
这里蓝色的 x，y，z 分别对应三个方向上的缩放

然后是经典的围绕各个轴的旋转矩阵 (记忆的时候注意围绕 y 轴旋转时，几个三角函数的符号……)  
[![7](http://www.alloyteam.com/wp-content/uploads/2016/12/7-279x300.png)](http://www.alloyteam.com/wp-content/uploads/2016/12/7.png)

还有剪切 (skew) 效果的变换矩阵，这里用个 x 轴的例子来体现  
[![8](http://www.alloyteam.com/wp-content/uploads/2016/12/8-300x111.png)](http://www.alloyteam.com/wp-content/uploads/2016/12/8.png)

这里都是某一种单一效果的变化矩阵，可以相乘配合使用的，很简单。我们这里重点来找一下规律，似乎所有的操作都是围绕着**红框这一块**来的  
[![9](http://www.alloyteam.com/wp-content/uploads/2016/12/9.png)](http://www.alloyteam.com/wp-content/uploads/2016/12/9.png)  
其实也比较好理解，因为矩阵这里每一行对应了个坐标  
[![10](http://www.alloyteam.com/wp-content/uploads/2016/12/10.png)](http://www.alloyteam.com/wp-content/uploads/2016/12/10.png)

那么问题来了，最下面那行干啥用的？  
一个顶点，坐标 (x,y,z)，这个是在笛卡尔坐标系中的表示，在 3D 世界中我们会将其转换为齐次坐标系，也就是变成了 (x,y,z,w)，这样的形式 (之前那么多图中 w=1)  
矩阵的最后一行也就代表着齐次坐标，那么齐次坐标有啥作用？很多书上都会说齐次坐标可以**区分一个坐标是点还是向量**，点的话齐次项是 1，向量的话齐次项是 0 (所以之前图中 w=1)  
对于 webgl 中的 Matrix 来说齐次项有什么用处呢？或者说这个第四行改变了有什么好处呢？一句话概括 (敲黑板，划重点)  
**它可以让物体有透视的效果**  
举个例子，大名鼎鼎的透视矩阵，如图  
[![15](http://www.alloyteam.com/wp-content/uploads/2016/12/15-300x141.png)](http://www.alloyteam.com/wp-content/uploads/2016/12/15.png)  
在第四行的第三列就有值，而不像之前的是 0；还有一个细节就是第四行的第四列是 0，而不是之前的 1

写到这里的时候我纠结了，要不要详细的把正视和透视投影矩阵推导写一下，但是考虑到篇幅，实在是不好放在这里了，否则这篇文章要太长了，因为后面还有内容  
大部分 3D 程序开发者可能不是很关注透视矩阵 (PMatrix)，只是知道有这一回事，**用上这个矩阵可以近大远小**，然后代码上也就是 glMatrix.setPerspective (……) 一下就行了  
所以决定后面单独再写一篇，专门说下正视透视矩阵的推导、矩阵的优化这些知识  
这里就暂且打住，我们先只考虑红框部分的矩阵所带来的变化  
[](http://www.alloyteam.com/wp-content/uploads/2016/12/9.png)


<!-- {% endraw %} - for jekyll -->