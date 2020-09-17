---
title: 教你用 webgl 快速创建一个小世界
date: 2017-03-15
author: TAT.vorshen
source_link: http://www.alloyteam.com/2017/03/teach-you-to-use-webgl-to-quickly-create-a-small-world/
---

<!-- {% raw %} - for jekyll -->

Webgl 的魅力在于可以创造一个自己的 3D 世界，但相比较 canvas2D 来说，除了物体的移动旋转变换完全依赖矩阵增加了复杂度，就连生成一个物体都变得很复杂。

什么？！为什么不用 Threejs？Threejs 等库确实可以很大程度的提高开发效率，而且各方面封装的非常棒，但是不推荐初学者直接依赖 Threejs，最好是把 webgl 各方面都学会，再去拥抱 Three 等相关库。

上篇矩阵入门中介绍了矩阵的基本知识，让大家了解到了基本的仿射变换矩阵，可以对物体进行移动旋转等变化，而这篇文章将教大家快速生成一个物体，并且结合变换矩阵在物体在你的世界里动起来。

**注：本文适合稍微有点 webgl 基础的人同学，至少知道 shader，知道如何画一个物体在 webgl 画布中**

## 为什么说 webgl 生成物体麻烦

我们先稍微对比下基本图形的创建代码  
矩形：  
canvas2D

    ctx1.rect(50, 50, 100, 100);
    ctx1.fill();
     

webgl (shader 和 webgl 环境代码忽略)

```go
var aPo = [
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    0.5, 0.5, 0,
    -0.5, 0.5, 0
];
 
var aIndex = [0, 1, 2, 0, 2, 3];
 
webgl.bindBuffer(webgl.ARRAY_BUFFER, webgl.createBuffer());
webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(aPo), webgl.STATIC_DRAW);
webgl.vertexAttribPointer(aPosition, 3, webgl.FLOAT, false, 0, 0);
 
webgl.vertexAttrib3f(aColor, 0, 0, 0);
 
webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, webgl.createBuffer());
webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(aIndex), webgl.STATIC_DRAW);
 
webgl.drawElements(webgl.TRIANGLES, 6, webgl.UNSIGNED_SHORT, 0);
 
```

完整代码地址：<https://vorshen.github.io/simple-3d-text-universe/rect.html>  
结果：  
![](https://vorshen.github.io/simple-3d-text-universe/doc/assets/1.png)

圆：  
canvas2D

```c
ctx1.arc(100, 100, 50, 0, Math.PI * 2, false);
ctx1.fill();
 
```

webgl

```javascript
var angle;
var x, y;
var aPo = [0, 0, 0
```


<!-- {% endraw %} - for jekyll -->