---
title: context2D 上的 texture mapping
date: 2012-08-22
author: TAT.岑安
source_link: http://www.alloyteam.com/2012/08/texture-mapping-on-context2d/
---

<!-- {% raw %} - for jekyll -->

我们在做一些图像变换或者 3D 建模时，骨架或者网格的 “蒙皮” 是少不了的。

在 webGL 中，也就是 “experimental-webgl” 的 context 中，webGL 跟 openGL 一样，提供了一个非常方便的

    gl.bindTexture

接口，可以很容易的对某一个指定的面或者网格蒙上指定的素材。并且，被蒙皮的区域做矢量变换，3d rotate 之类的，texture 会自动随着变换。不用额外的做处理。所以在 webGL 中，textureMapping 是十分容易和方便的。

这里有个简单的 demo，支持 webGL 的浏览器可以尝试围观下。  
[![](http://www.alloyteam.com/wp-content/uploads/2012/08/webgl-300x258.png "webgl")  
](http://hongru.github.com/share/3D/webgl/cube_texture.html)

当然，从文章的标题可以看出，我们今天要讨论的内容并不是 webGL 下的 bindTexture。而是在 2D 的 context 下怎么对素材进行 TextureMapping？

**【Texture Mapping】**

其实只要对 canvas 2d context 的 api 有一定了解，找来找去就会发现，唯一能让图片变形的 api 应该只有

    CanvasRenderingContext2D.transform

了，但是实际上，仅仅折腾这个 api，参数改来改去试来试去会发现 transform 只能完成平行四边形的变换。如下 demo：

[![](http://www.alloyteam.com/wp-content/uploads/2012/08/tm-300x209.png "tm")](http://hongru.github.com/proj/texturemapping/canvas.transform.html)

假如我想要做到不规则四边形的 texture 变换，就需要重新考虑一条路子。比如下面这个例子：  
[![](http://www.alloyteam.com/wp-content/uploads/2012/08/tm1-300x246.png "tm")](http://hongru.github.com/proj/texturemapping/example/demo1.html)

ok，看起来基本已经达到目的了。可以适应任意不规则四边形的变换。

那么是怎么实现的呢？

**【实现】** 

从上面那个演示 demo 应该就可以看出来了，还是利用 “三角拼凑法” 来实现。三角切分法有个维度，切分的越细，得到最终的模拟的结果会越逼真。相应的计算量也会越大。

假设我们切分的阀值为 n，那么代表把每条边先 n 等分，然后 n\*n 个四边形格子，然后每个格子再沿对角一分为二，这样得到 n\*n\*2 个三角形，每个三角形都可以根据它所在的四边形格子进行 transfrom 的变换，最终拼接起来得到近似的结果。

具体的实现和 demo 都可以从这里获取：  
<https://github.com/hongru/TextureMapping>

**【扩展】**

说了这么多，那么这样的功能在什么地方能用起来呢？更多的情景是在一些 2D 模拟 3D 场景并且需要 texture 做支撑的时候。

于是，我们在 Context 2D 中也可以做到图片的 3D 翻转变换了。当然，如果只是图片的翻转的话，css3 的 transform-3d 也可以做到，我们这里只讨论 canvas 中 context 2d 中的实现。  
[![](http://www.alloyteam.com/wp-content/uploads/2012/08/3d-300x130.png "3d")](http://hongru.github.com/proj/texturemapping/example/demo2.html)

当然，继续下去，完成一个图片展示的应用也未尝不可，并不需要 webGL。如下一个简单的 Demo

[![](http://www.alloyteam.com/wp-content/uploads/2012/08/demo-300x237.png "demo")](http://hongru.github.com/test/rubik/zoom/index.html)


<!-- {% endraw %} - for jekyll -->