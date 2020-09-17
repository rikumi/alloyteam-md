---
title: webgl 性能优化初尝
date: 2017-05-13
author: TAT.vorshen
source_link: http://www.alloyteam.com/2017/05/webgl-performance-optimizations-first-taste/
---

<!-- {% raw %} - for jekyll -->

上次文章介绍了如何用 webgl 快速创建一个自己的小世界，在我们入门 webgl 之后，并且可以用原生 webgl 写 demo 越来越复杂之后，大家可能会纠结一点：就是我使用 webgl 的姿势对不对。因为 webgl 可以操控 shader 加上超底层 API，带来了一个现象就是同样一个东西，可以有多种的实现方式，而此时我们该如何选择呢？这篇文章将稍微深入一点 webgl，给大家介绍一点 webgl 的优化知识。

讲 webgl 优化之前我们先简单回忆一下 canvas2D 的优化，常用的 display list、动态区域重绘等等。用 canvas2D 多的同学应该对以上的优化或多或少都有了解，但是你对 webgl 的优化了解么，如果不了解的话往下看就对了～这里会先从底层图像是如何渲染到屏幕上开始，逐步开始我们的 webgl 优化。  

## gpu 如何渲染出一个物体

先看一个简单的球的例子，下面是用 webgl 画出来的一个球，加上了一点光的效果，代码很简单，这里就不展开说了。  
[一个球](https://vorshen.github.io/simple-3d-text-universe/doc/0.html)  
这个球是一个简单的 3D 模型，也没有复杂的一些变化，所以例子中的球性能很好，看 FPS 值稳定在 60。后面我们会尝试让它变得复杂起来，然后进行一些优化，不过这一节我们得先了解渲染的原理，知其根本才能知道优化的原理。

我们都知道 webgl 与着色器是密不可分的关系，webgl 当中有顶点着色器和片段着色器，下面用一张图来简单说明下一个物体由 0 到 1 生成的过程。  
![](http://www.alloyteam.com/wp-content/uploads/2017/05/1-300x164.png)  
0 就是起点，对应图上面的 3D mesh，在程序中这个就是 3D 顶点信息  
1 就是终点，对应图上面的 Image Output，此时已经渲染到屏幕上了  
我们重点是关注中间那三个阶段，第一个是一个标准的三角形，甚至三角形上面用三个圈指明了三个点，再加上 vertex 关键字，可以很明白的知道是顶点着色器处理的阶段，图翻译为大白话就是：  
**我们将顶点信息传给顶点着色器 (drawElements/drawArray)，然后着色器将顶点信息处理并开始画出三角形 (gl_Position)**

然后再看后两个图，很明显的 fragments 关键字指明了这是片元着色器阶段。Rasterization 是光栅化，从图上直观的看就是三角形用三条线表示变成了用像素表示，其实实际上也是如此，更详细的可以看下面地址，这里不进行展开。  
[如何理解光栅化 - 知乎](https://www.zhihu.com/question/29163054)  
后面阶段是上色，可以用 textture 或者 color 都可以，反正统一以 rgba 的形式赋给 gl_FragColor  
图中 vertexShader 会执行 3 次，而 fragmentShader 会执行 35 次 (有 35 个方块)  
**发现 fragmentShader 执行次数远远超过 vertexShader**，此时机智的朋友们肯定就想到尽可能的将 fragmentShader 中的计算放在 vertexShader 中，但是能这样玩么？

强行去找还是能找到这样的场景的，比如说反射光。反射光的计算其实不是很复杂，但也稍微有一定的计算量，看核心代码

```c
    vec3 L = normalize(uLightDirection);
    vec3 N = normalize(vNormal);
    float lambertTerm = dot(N, -L);
    vIs = vec4(0.0, 0.0, 0.0, 1.0);
    if(lambertTerm > 0.0) {
            vec3 E = normalize(vEye);
            vec3 R = reflect(L, N);
 
            float specular = pow(max(dot(R, E), 0.0), uShininess);
            vIs = uLightSpecular * uMaterialSpecular * specular;
    }
 
```

上面反射光代码就不细说了，核心就是内置的 reflect 方法。这段代码既可以放在 fragmentShader 中也可以放在 vertexShader 中，但是二者的结果有些不同，结果分别如下  
[放在 vertexShader 中](https://vorshen.github.io/simple-3d-text-universe/doc/-1.html)  
[放在 fragmentShader 中](https://vorshen.github.io/simple-3d-text-universe/doc/0.html)

所以说这里的优化是有缺陷的，可以看到 vertexShader 中执行光计算和 fragmentShader 中执行生成的结果区别还是蛮大的。换言之如果想要实现真实反射光的效果，必须在 fragmentShader 中去计算。开头就说了这篇文章的主题在**同样的一个效果，用什么方式是最优的**，所以 continue~

## gpu 计算能力很猛

上一节说了 gpu 渲染的原理，这里再随便说几个 gpu 相关的新闻  
[百度人工智能大规模采用 gpu](http://www.leiphone.com/news/201609/cD4r03UnXsdVW3so.html)，[PhysX 碰撞检测使用 gpu 提速](https://en.wikipedia.org/wiki/PhysX)…… 种种类似的现象都表明了 gpu 在单纯的计算能力上是超过普通的 cpu，而我们关注一下前一节 shader 里面的代码  
vertexShader

```c
    void main() {
            vec4 vertex = uMMatrix * uRMatrix * vec4(aPosition, 1.0);
            vNormal = vec3(uNMMatrix * uNRMatrix * vec4(aNormal, 1.0));
            vEye = -vec3((uVMatrix * vertex).xyz);
 
            gl_Position = uPMatrix * uVMatrix * vertex;
    }
 
```

fragmentShader

```c
    void main() {
        vec3 L<
```


<!-- {% endraw %} - for jekyll -->