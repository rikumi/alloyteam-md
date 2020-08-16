---
title: Animations in Canvas
date: 2012-08-21
author: TAT.岑安
source_link: http://www.alloyteam.com/2012/08/animations-in-canvas/
---

<!-- {% raw %} - for jekyll -->

#### ![](http://hongru.github.com/proj/laro/test/resources/fighter/RYU1_wait.gif)

#### 关于 Canvas 中动画的处理和实现

大致会有三种类型：

-   矢量动画【No Textures】
-   关键帧动画
-   骨骼动画

这里先分别做一个浅析。都会做一个大致的介绍，这篇文章暂不会涉及深入的技术细节。

##### 【矢量动画】

顾名思义，这里暂且把不用素材，只用一些矢量的绘制就能达到的动画效果归为矢量动画。矢量动画，个中有很多很多的例子，比如一些粒子效果啊，矢量线条的特效，或者一些 3D 的矢量特效等等。

应该可以说矢量的效果是其他效果制作的基础，而且它能完成一些通过素材达不到的效果，尤其是在处理或者演示一些数学模型的时候。

通常比较简单，也比较容易出新花样的是一些粒子特效。我这边列几个比较简单的 demo[![](https://a248.e.akamai.net/camo.github.com/24a733dd42a684254e4cfd46a2671e968311cb09/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031322f30352f32372d313530783135302e706e67 "27")](http://hongru.github.com/proj/jcanvas/particleEffector.html)  [![](https://a248.e.akamai.net/camo.github.com/96b620e7acbb61d34368c40f3c19aea66875d385/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031322f30352f372d313530783135302e706e67 "7")](http://hongru.github.com/test/text_particles.html?t=AlloyTeam) [![](https://a248.e.akamai.net/camo.github.com/04db1f0e3ee9ee32e1d20057f22af73ea51f1bad/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031322f30352f3231302d313530783135302e706e67 "2")](http://hongru.github.com/proj/laro/examples/jxhome/index.html)  
通常，有了以点为单位的粒子效果，把点连成线，也就能够完成一些基于线条或者平面的动画了。比如下面这个例子：  
[![](https://a248.e.akamai.net/camo.github.com/504bdb46086b8f38ef9c7606ab5ef56a9750a8ad/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031322f30352f32382d313530783135302e706e67 "28")](http://hongru.github.com/proj/jcanvas/rotate3D_lines.html)  
做基于矢量的动画，在 canvas 上面可能比较需要注意的地方是一些细节的问题，可能和性能有密切的关系。

-   注意 beginPath 和 closePath 的使用，尤其是 beginPath，因为他们通常标志这这一次路径的绘制是否闭合结束。如果没有 beginPath 和 closePath，浏览器将不知道下一次的绘制路径是否重新开始，那么它只能把上一次没有闭合的路径重新绘制一次。如果出现这种情况，在连续绘制几次之后，由于冗余绘制叠加的原因，会发现性能陡然间极速下降。
-   canvas 的矢量 API 是较为消耗性能的，所以尽量减少 canvas 矢量 API 的调用，如果是对于相同形状的矢量图，有个简单直接的优化方案，就是将这个需要重复绘制的矢量图先绘制在一个临时的 canvas 上，然后在需要绘制这个矢量图的地方直接通过 drawImage 把这个临时 canvas 绘制上去即可。

【关键帧动画】

通常实际的应用中，好多动画还是需要素材的帮助，比如大多数的游戏里，或者一些 apps 里面。目前很常用的关键帧动画在 web 上都是利用序列帧图有序播放来完成的。比如下面这个序列图  
![](http://hongru.github.com/proj/laro/test/resources/fighter/RYU1_wait.gif)  
我们按照之前设定好的数据，按顺序播放序列图中的每个部分，连贯起来就会有动画的效果，这是最基本的逻辑，我们小时候看的动画片也都是通过这个原理实现的。简单有效，唯一的缺憾就是一旦需要大量的素材或者序列图来支撑。才能出来一个生动完整的动画。  
[![](https://a248.e.akamai.net/camo.github.com/a946a6f2a1592676987e17b6141d97966060a26a/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031322f30352f33372d313530783135302e706e67 "37")](http://hongru.github.com/proj/laro/test/laro.input.animation.html)（鼠标移到人物上播放动画）  
关键帧动画，有优势也有劣势。  
优势：计算量小，只要序列图的每帧衔接的好，动画播放流畅自然。  
劣势：对于复杂的动画，需要大量的序列图做支撑。资源量太大对于 web 来说是一个不小的负担，另外，就是对于这种基于序列图播放的关键帧动画，我们的可控度不太高，顶多能在一些特定的帧之间抛出一些事件做额外的处理，但是动画本身的变化都是 “固定” 好的。

##### 【骨骼动画】

骨骼动画的实现思路是从人体或动物的身体的运动方式而来的。动画人物的身体（肉、皮肤）是一个网格 (Mesh) 模型，网格的内部是一个骨架结构。当人物的骨架运动时，身体就会跟着骨架一起运动。骨架是由一定数目的骨骼组成的层次结构，每一个骨骼的排列和连接关系对整个骨架的运动有很重要的影响。每一个骨骼数据都包含其自身的动画数据。和每个骨架相关联的是一个 “蒙皮”(Skin) 模型，它提供动画绘制所需要的几何模型 (Vertex,Normal,etc) 和纹理材质信息。每个顶点都有相应的权值 (Weight)，这些权值定义了骨骼的运动对有关顶点的影响因子。当把动画人物的姿势和全局运动信息作用到骨架上时，这个 “蒙皮” 模型就会跟随骨架一起运动。

当前客户端的大部分 3D 游戏或者 2.5D 的游戏，为了让人物动作和动画更加活泼，可控，可扩展，大多采用的都是这种骨骼动画来实现的。

总体来说，这种动画的实现复杂度也会是较高的。下面是几个简单的过程演示。  
[![](https://a248.e.akamai.net/camo.github.com/dca686b62eee7018d985d8f1dd2a1b6e8d8f4964/687474703a2f2f686f6e6772752e6769746875622e636f6d2f696d616765732f736b656c6574616c2d616e696d6174696f6e2f312e706e67 "7")](http://hongru.github.com/skeletal-animation/test/test2.html)[![](https://a248.e.akamai.net/camo.github.com/8772c337899707d8a29d0ffed97cdff97a120766/687474703a2f2f686f6e6772752e6769746875622e636f6d2f696d616765732f736b656c6574616c2d616e696d6174696f6e2f322e706e67 "7")](http://hongru.github.com/skeletal-animation/test/test3.html)[![](https://a248.e.akamai.net/camo.github.com/5daf5fcb083a9fe7f54047691173abea913646a2/687474703a2f2f686f6e6772752e6769746875622e636f6d2f696d616765732f736b656c6574616c2d616e696d6174696f6e2f332e706e67 "7")](http://hongru.github.com/skeletal-animation/test/test4.html)[![](https://a248.e.akamai.net/camo.github.com/57fb8c3e3e5c0825cab08fecbeda338d8c20cd2f/687474703a2f2f686f6e6772752e6769746875622e636f6d2f696d616765732f736b656c6574616c2d616e696d6174696f6e2f342e706e67 "7")](http://hongru.github.com/skeletal-animation/test/test6.html)[![](https://a248.e.akamai.net/camo.github.com/0d25ca50a663bb7dfb73e630757d9dc31188a3e2/687474703a2f2f686f6e6772752e6769746875622e636f6d2f696d616765732f736b656c6574616c2d616e696d6174696f6e2f352e706e67 "7")](http://hongru.github.com/skeletal-animation/test/doll1/index.html)  
要做好骨骼动画，一个是要了解其实现的原理，再深入一些可能还需要对前向动力学（FK）和逆向动力学（IK）做一些了解。

在我看来，骨骼动画只要有一套数据和 texture，按照一定的规则规范读数据播放，其实并不是重点和难点，重点和难点是需要有一个方便易用的骨骼动画的编辑器。可以做到以下几点：

-   能对素材进行可视的切分编辑，把每一块骨骼需要用的素材部分切分出来使用
-   能方便的对每一块骨骼进行关节的添加，删除，编辑。同时，在进行骨骼组装的时候，关节能有锁定的功能，方便后续的可视化动作编辑。
-   能方便的对骨骼进行一些拖拽，旋转的可视化编辑操作。而且不能脱离关节，对已经绑定好关节的骨骼能做到前向或者逆向的联动。
-   最后，有些有规律的动作其实不用自己一帧一帧的去摆，去添加，而是可以设置一个起始动作和结束动作，中间的补帧可以自动动态的插入。

这也是我正在尝试实现的一个简单的骨骼动画编辑器所应该具备的一些功能。我会朝着这个方向去尝试实现一个 web 的版本。

【结语】

本文只是对于 canvas 中实现各种动画做了一个大致框架性的介绍和一些 demo 演示。后续如果有需要可以针对每一种动画在实现的一些细节上进行更深入的讲解。

<!-- {% endraw %} - for jekyll -->