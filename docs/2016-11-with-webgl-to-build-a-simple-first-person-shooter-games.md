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
    mx: 0,
    my: 0,
    mz: 0,
    toMatrix: function () {
        var rx = this.rx;
        var ry = this.ry;
        var mx = this.mx;
        var my = this.my;
        var mz = this.mz;
        var F = normalize3D([
            Math.sin(rx) * Math.cos(ry),
            Math.sin(ry),
            -Math.cos(rx) * Math.cos(ry),
        ]);
        var x = F[0];
        var z = F[2];
        var angle = getAngle([0, -1], [x, z]);
        var R = [Math.cos(angle), 0, Math.sin(angle)];
        var U = cross3D(R, F);
        F[0] = -F[0];
        F[1] = -F[1];
        F[2] = -F[2];
        var s = [];
        s.push(R[0], U[0], F[0], 0);
        s.push(R[1], U[1], F[1], 0);
        s.push(R[2], U[2], F[2], 0);
        s.push(0, 0, 0, 1);
        return s;
    },
};
```

这里封装了一个简单的 camera 对象，里面有 rx 对应鼠标在 X 方向上的移动，ry 对应鼠标在 Y 方向上的移动，这个我们可以通过监听鼠标在 canvas 上的事件轻松得出。

```javascript
var mouse = {
    x: oC.width / 2,
    y: oC.height / 2,
};
oC.addEventListener(
    "mousedown",
    function (e) {
        if (!level.isStart) {
            level.isStart = true;
            level.start();
        }
        oC.requestPointerLock();
    },
    false
);
oC.addEventListener(
    "mousemove",
    function (event) {
        if (document.pointerLockElement) {
            camera.rx += event.movementX / 200;
            camera.ry += -event.movementY / 200;
        }
        if (camera.ry >= Math.PI / 2) {
            camera.ry = Math.PI / 2;
        } else if (camera.ry <= -Math.PI / 2) {
            camera.ry = -Math.PI / 2;
        }
    },
    false
);
```

lockMouse+momentX/Y 对于游戏开发来说是真的好用啊！！否则自己来写超级蛋疼还可能会有点问题，安利一大家一波，用法也很简单。

鼠标在 X 方向上的移动，在 3D 空间中，其实就是围绕 Y 轴的旋转；鼠标在 Y 方向上的移动，其实就是围绕 X 轴的旋转，这个应该可以脑补出来吧

那么问题来了，围绕 Z 轴的旋转呢？？这里我没有考虑围绕 Z 轴的旋转啊，因为游戏没用到嘛，第一人称射击的游戏很少会有围绕 Z 轴旋转的场景吧，那个一般是治疗颈椎病用的。虽然不考虑，但是原理都是一样的，可以推出来，有兴趣的小伙伴可以自己研究下。

我们将 rx 和 ry 拆看来看，首先就只看 rx 对初始视线 (0, 0, -1) 的影响，经过三角函数的变换之后应该是 **( Math.sin(rx), 0, -Math.cos(rx) )**，这里就不画图解释了，三角函数基本知识

然后再考虑 **( Math.sin(rx), 0, -Math.cos(rx) )**经过了 ry 的变换会如何，其实就是将 **( Math.sin(rx), 0, -Math.cos(rx) )**与 ry 的变化映射到 y-z 坐标系上面，再用三角函数知识得出 **( Math.sin(rx)\*Math.cos(ry), Math.sin(ry), -Math.cos(rx) \* Math.cos(ry) )**

一时理解不了的同学可以闭上眼睛好好脑部一下变换的画面……

经过这两步最终我们得到了经过变换之后的视线方向 F（少了 Z 轴方向的旋转，其实就是再多一步），也就是 lookAt 函数中的前两个函数得出来的值，然后再计算一个值就 ok 了，代码中我们求的是 X 轴的正方向

代码在刚刚封装的 camera 中是这几行

```javascript
var x = F[0];
var z = F[2];
var angle = getAngle([0, -1], [x, z]);
```

angle 得出了最终的视角方向（-Z）和最初视线方向在 x-z 坐标系中的偏转角，因为是 x-z 坐标系，所以最初的 X 正方向和最终的 X 正方向偏移角也是 angle

```javascript
function getAngle(A, B) {
    if (B[0] === 0 && A[0] === 0) {
        return 0;
    }
    var diffX = B[0] - A[0];
    var diffY = B[1] - A[1];
    var a = A[0] * B[0] + A[1] * B[1];
    var b = Math.sqrt(A[0] * A[0] + A[1] * A[1]);
    var c = Math.sqrt(B[0] * B[0] + B[1] * B[1]);
    return (B[0] / Math.abs(B[0])) * Math.acos(a / b / c);
}
```

通过简单的三角函数得到了最终 X 轴的正方向 R（注意：没考虑围绕 Z 轴的旋转，否则要繁琐一些）

再用叉积得到了最终 Z 轴的正方向 U，然后不要忘记，之前 F 是视线方向，也就是 Z 轴正方向的相反方向，所以取反操作不要忘了

R、U、-F 都得到了，也就得到了最终的 VM 视图矩阵！

其实吧，在没有平移的情况下，视图矩阵和模型变换矩阵也就是旋转方向不一致，所以以上的知识也可以用在推导模型变换矩阵里面。就算带上了平移也不麻烦，牢记**模型变换矩阵需要先平移、再旋转，而视图变换矩阵是先旋转、再平移**

游戏中摄像机相关的知识就先讲到这里了，如果有不明白的同学可以留言讨论。

当然这不是唯一的方法，simpleFire 这里没有考虑平移，不考虑平移的情况下，其实就是最终就是要生成一个 3 维旋转矩阵，只不过使用的是一种逆推的方法。此外还有一些欧拉角、依次 2 维旋转等等方式，都可以得到结果。不过这些都比较依赖矩阵和三角函数数学知识，是不是现在无比的怀恋当年的数学老师……

**3、命中检测**

我们玩转了摄像头，然后就是开枪了，开枪本身很简单，但是得考虑到枪有没有打中人呀，这可是关于到用户得分甚至是敌我的死活。

我们要做的工作是判断子弹有没有击中目标，听起来像是碰撞检测有没有！来，回忆一下在 2D 中的碰撞检测，我们的检测都是按照 AABB 的方式检测的，也就是**基于对象的包围框**（对象 top、left、width、height）形成，然后坐标（x, y）与其计算来判断碰撞情况。这种方法有一个缺陷，就是**非矩形的检测可能有误差**，比如圆、三角形等等，毕竟包围框是矩形的嘛。dntzhang 所开发出的 AlloyPage 游戏引擎中有画家算法完美的解决了这个缺陷，将检测粒度由对象变成了像素，感兴趣的同学可以去研究一下～这里暂且不提，我们说的是 3D 检测

仔细想想 3D 世界中的物体也有包围框啊，更确切的说是**包围盒**，这样说来应该也可以用 2D 中 AABB 方式来检测啊。

确实可以，只要我们将触发鼠标事件得到的（x, y）坐标经过各种变换矩阵转换为 3D 世界中的坐标，然后和模型进行包围盒检测，也可以得到碰撞的结果。对开发者来说挺麻烦的，对 CPU 来说就更麻烦了，这里的计算量实在是太大了，如果世界中只有一两个物体还好，如果有一大票物体，那检测的计算量实在是太大了，很不可取。有没有更好的方法？

有，刚刚那种方式，是将 2D 中（x, y）经过矩阵转换到 3D 世界，还有一种方式，将 3D 世界中的东西转换到 2D 平面中来，这便是帧缓冲技术。帧缓冲可是一个好东西，**3D 世界中的阴影也得靠它来实现。**

这里用一句话来直观的介绍帧缓冲给不了解的同学：将需要绘制在屏幕上的图像，**更加灵活处理的后**绘制在内存中

如图对比一下 simpleFire 中的帧缓冲图像是什么样的

[![11](http://www.alloyteam.com/wp-content/uploads/2016/11/11-300x190.png)](http://www.alloyteam.com/wp-content/uploads/2016/11/11.png)正常游戏画面

[![12](http://www.alloyteam.com/wp-content/uploads/2016/11/12-300x179.png)](http://www.alloyteam.com/wp-content/uploads/2016/11/12.png)帧缓冲下的画面

发现整个世界中只有靶子有颜色对不对！这样我们读取帧缓冲图像中某个点的 rgba 值，就知道对应的点是不是在靶子上了！实现了坐标碰撞检测！

之前说的更加灵活的处理，就是指渲染时对各个模型颜色的处理

检测代码如下：

```javascript
oC.onclick = function(e) {
    if(gun.firing) {
        return ;
    }
    gun.fire();
 
    var x = width / 2;
    var y = height / 2;
    
    webgl.uniform1i(uIsFrame, true);
    webgl.bindFramebuffer(webgl.FRAMEBUFFER, framebuffer);
    webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
 
    targets.drawFrame();
 
    var readout = new Uint8Array(1*1*4);
 
    // webgl.bindFramebuffer(webgl.FRAMEBUFFER, framebuffer);
    webgl.readPixels(x, y, 1, 1, webgl.RGBA, webgl.UNSIGNED_BYTE, readout);
    webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
 
    targets.check(readout);
 
    webgl.uniform1i(uIsFrame, false);
};
 
/* targets下的check方法 */
check: function(arr) {
    var r = '' + Math.floor(arr[0] / 255 * 100);
    var g = '' + Math.floor(arr[1] / 255 * 100);
    var b = '' + Math.floor(arr[2] / 255 * 100);
    var i;
    var id;
 
    for(i = 0; i < this.ids.length; i++) {
        if(Math.abs(this.ids[i][0] - r) <= 1 && Math.abs(this.ids[i][1] - g) <= 1 && Math.abs(this.ids[i][2] - b) <= 1) {
            console.log('命中!');
            id = this.ids[i][0] + this.ids[i][1] + this.ids[i][2];
            this[id].leave();
            score.add(1);
            level.check();
            break ;
        }
    }
}
```

而且这个方法很快，计算量都在 GPU 里面，这种数学计算的效率 GPU 是比 CPU 快的，GPU 还是并行的！那传统的 AABB 法还有存在的意义么？

其实是有的，因为**精确**，可以在包围盒中计算得到具体的碰撞点位置，这是帧缓冲法所达不到的

举个例子，第一人称射击游戏中的爆头行为，可以在帧缓冲中将人物模型中身体和头用不同颜色区分出来，这样可以检测出碰撞的是头还是身体。这种情景下帧缓冲方法还 hold 住

那如果是想得到打靶中具体的位置，留下子弹的痕迹呢？这里帧缓冲方法就死也做不到了。

最佳实践就是在**需要高精度复杂场景下的**碰撞检测可以将两种方法结合使用：**用帧缓冲去掉多余的物体，减少传统 AABB 法的计算量，最终得到具体位置。**

simpleFire 这里就没这么折腾了…… 只要射到靶上打哪都是得分～～～

**4、碎碎念**

关于 simpleFire 想讲的东西也就讲完了，本身也没有什么技术难点，文章的最后一节也聊一聊关于 webgl

之前已经说了与 canvas 之间的区别，是从计算机层面的区别，这里说一下对于开发者的区别：

canvas2D 是一块画布，在画布上作画，画中的东西一定是虚拟的

webgl 是一个世界，你要在世界中创造，但也要满足世界的规则

这比喻有点夸大，都牵扯到了世界的规则。但事实就是如此，webgl 比 canvas2D 复杂，而很大一块复杂的地方就是世界的规则 ——  光与阴影

这两块知识 3D 迷宫和 simpleFire 都没有用上，因为这应该是**静态** 3D 中最难啃的骨头了吧。说难吧，知道原理之后也不难，但就是恶心麻烦，加上光和阴影得多很多很多的代码。后面会详细讲解光和阴影相关知识的，也是用小游戏的方式。写一篇纯原理的文章感觉没啥意思，知识点一搜能搜到很多了

不看动画，纯看静态渲染方面的东西，2D 和 3D 也就差不多，需要位置信息、颜色信息，平移旋转等等，3D 也就是加上了光和阴影这样的世界规则，比 2D 还多了一些数学知识的要求

所以 webgl 并不难～欢迎更多的人来到 webgl 的坑中来吧，但是推荐入坑的同学不要开始就过于依赖 three、oak3D、PhiloGL 等图形库，还是从原生入手比较好

文章对 simpleFire 代码讲解的不是很多，源码也贴出来了，100% 原生 webgl 的写法，看起来应该也不是很难

结语：

下次带来的不一定是 3D 小游戏，3D 小游戏写起来还是挺累的，素材什么的比 2D 麻烦很多

这篇文章也就到此结束啦，写的好累 T_T。。有问题和建议的小伙伴欢迎留言一起探讨～

<!-- {% endraw %} - for jekyll -->