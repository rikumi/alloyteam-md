---
title: 图文理解 CSS3 3D Transform
date: 2012-11-04
author: TAT.bizai
source_link: http://www.alloyteam.com/2012/11/css3-3d-transform/
---

Minren 哥前面已经写了一些关于这方面的 blog 了，大家也可以在团队 blog 里面参考。

[http://www.alloyteam.com/2012/10/the-css3-transform-perspective-property/](http://www.alloyteam.com/2012/10/the-css3-transform-perspective-property/ "CSS3 Transform 属性 perspective")

介于只是介绍 perspective，没有对 css 3d transform 其他部分属性介绍说明，下面是我个人对 css3 3D 的一些个人见解，大神们莫喷。那些 rotateX 啊，scaleY 啊这些大家都能够立刻明白的我就不过多的解析了。主要有几个属性大家可能比较少用或没有理解透的为这部分的主要内容。

## **【perspective 和 translate】**

perspective 视距。通常我们使用 rotate 来做 3D 旋转的时候，效果不是很明显，总感觉差点什么的。而 translateZ 更是没有任何的效果。原因是，我们没有为它的父节点添加视距 perspective。使用 perpective 才是真正建立 3D 转换的核心元素。

[![](http://www.alloyteam.com/wp-content/uploads/2012/11/图片1.png "图片 1")](http://www.alloyteam.com/wp-content/uploads/2012/11/图片1.png)[![](http://www.alloyteam.com/wp-content/uploads/2012/11/图片2.png "图片 2")](http://www.alloyteam.com/wp-content/uploads/2012/11/图片2.png)

那么 perspective 是个什么东西，视距就是你看 3D 物体，眼睛到画布的距离，而 translate 就是 3D 物体距离源点的距离，下面引用 w3c 的图解说一下 perspective 和 translateZ 的关系。

[![](http://www.alloyteam.com/wp-content/uploads/2012/11/图片3.png "图片 3")](http://www.alloyteam.com/wp-content/uploads/2012/11/图片3.png)

简单的可以得出下面的结论：

1. 没有 perspective 就没有真 3D（不是真 33D）

2. 当 perpective 的值越小，3D 效果就越明显（就是说你眼睛越靠近 33D 就越 3D）

3. 当 perpective 的值无穷大的，值为 0，不写 perpective，这三种情况的效果一样。

为切面效果。什么是切面效果，就是前面我说的不是很明显的 3D 效果，给个图大家就明白了

[![](http://www.alloyteam.com/wp-content/uploads/2012/11/图片4.png "图片 4")](http://www.alloyteam.com/wp-content/uploads/2012/11/图片4.png)

几乎平衡的两条视线，使到我们看到的 3D 好像被水平投影到显示器那样。

4. 还有种特殊情况，perspective 和 translateZ 的值一样。一图胜万语。

[![](http://www.alloyteam.com/wp-content/uploads/2012/11/图片5.png "图片 5")](http://www.alloyteam.com/wp-content/uploads/2012/11/图片5.png)perspective 和 translateZ 值相等，男猪脚看到什么了....

## 【transform-style:preserve-3d】

这个属性有点蛋疼，没有像 perspective 效果那么明显。顾名思义，是建立一个 3D 渲染环境。我们来看看 w3c 的为这个属性的一段说明：

> · A [3D rendering context](http://www.w3.org/TR/css3-transforms/#d-rendering-context) is established by a a [transformable element](http://www.w3.org/TR/css3-transforms/#transformable-element) whose computed value for ‘[transform-style](http://www.w3.org/TR/css3-transforms/#transform-style)’ is ‘preserve-3d’, and which itself is not part of a 3D rendering context. Note that such an element is always a containing block. An element that establishes a 3D rendering context also participates in that context.
>
> · An element whose computed value for ‘[transform-style](http://www.w3.org/TR/css3-transforms/#transform-style)’ is ‘preserve-3d’, and which itself participates in a [3D rendering context](http://www.w3.org/TR/css3-transforms/#d-rendering-context), extends that 3D rendering context rather than establishing a new one.
>
> · An element participates in a [3D rendering context](http://www.w3.org/TR/css3-transforms/#d-rendering-context) if its containing block establishes or extends a [3D rendering context](http://www.w3.org/TR/css3-transforms/#d-rendering-context).

简单说：preserve-3d 建立的 3D 渲染环境是对其子节点影响的，使子节点同父节点同一个渲染环境，如果子节点的子节点也带有 preserve-3d 属性就继承其父节点的。即是建立一个统一的 3D 渲染环境。那同一个 3D 渲染环境又如何。我们用个例子来说明：

demo 的基本结构和样式如下代码

```css
        div{
            width:250px;
            height:100px;
        }
 
        .stage{
            -webkit-perspective:800px;
            border: 1px solid black;
        }
        .container{
            -webkit-transform:rotateY(50deg);
            background: rgba(0,255,0,0.7);
        }
        .child{
            -webkit-transform-origin: top left;
            -webkit-transform:rotateX(45deg);
            background: rgba(255,0,0,0.7);
 
        }
```

```html
<div class="stage">
            
    <div class="container">
                    <div class="child"></div>
                
    </div>
        
</div>;
```

[![](http://www.alloyteam.com/wp-content/uploads/2012/11/图片6.png "图片 6")](http://www.alloyteam.com/wp-content/uploads/2012/11/图片6.png)

我们看到，被包含的子节点（红色）使用 rotateX，但是没有效果。其实不是没有效果，是效果不明显。子节点（红色）的 3D 旋转式在容器节点（绿色）的 3D 渲染环境下发生的。而容器节点没有 perspective，效果就为切面效果

[![](http://www.alloyteam.com/wp-content/uploads/2012/11/图片7.png "图片 7")](http://www.alloyteam.com/wp-content/uploads/2012/11/图片7.png)

我们为容器节点（绿色）增加 perspective 属性，那样子节点（红色）的 rotateX 效果就出来了，但是注意，现在我们是拥有 2 个包含关系的 3D 渲染环境。但是我觉得这不是你所希望的的（除了你有什么特殊癖好或特殊需求）

[![](http://www.alloyteam.com/wp-content/uploads/2012/11/图片8.png "图片 8")](http://www.alloyteam.com/wp-content/uploads/2012/11/图片8.png)

当容器节点（绿色）使用【transform-style:preserve-3d】后，容器节点（绿色）建立了 3D 渲染环境，严格上说是继承了舞台（空边框）的的 3D 渲染环境。使到子节点的渲染环境都在一个环境上。效果就想我们当初那样了

[查看 Demo 页面](http://www.alloyteam.com/wp-content/uploads/2012/11/testPreserve_3d.html)

## 【transform-origin，perspective-origin，backface-visibilty】

如果理解好前面几个属性，这几个就非常的好理解了。

Backface-visibilty，就是背面的可见性，默认是可见的。想不可见就写：backface-visibilty:hidden; 自己写一下代码就好了.

Transform-origin 为源点的位置。Rotate 和 translate 都是按照默认的源点转变的，可以通过 transform-origin 来改变这个源点位置。

Perspective-origin 为视点的位置。就像上面那张解析 perspective 图的眼睛的位置。

[![](http://www.alloyteam.com/wp-content/uploads/2012/11/图片12.jpg "图片 12")](http://www.alloyteam.com/wp-content/uploads/2012/11/图片12.jpg)

贞子从你的显示器里面爬出来的时候就有 3D 效果啦。我们换个视点来一睹贞子姐的容貌。

就是 perspective-origin: right bottom;

。

。

。

。

。

。

[![](http://www.alloyteam.com/wp-content/uploads/2012/11/图片13.jpg "图片 13")](http://www.alloyteam.com/wp-content/uploads/2012/11/图片13.jpg)

。

。

。

。

。

[![](http://www.alloyteam.com/wp-content/uploads/2012/11/图片14.jpg "图片 14")](http://www.alloyteam.com/wp-content/uploads/2012/11/图片14.jpg)

### **【perspective，preserve-3d，translateZ 之间关系又是怎么的】**

[点击理解关系 Demo 页面](http://www.alloyteam.com/wp-content/uploads/2012/11/simpleDemo2.html)

通常我们写 CSS3 3D 效果的东西，建议 html 结构为：

舞台 为舞台加上 perspective

容器 为容器加上 preserve-3d，使到一个容器内为同一 3D 渲染环境

内容 实际 transform 效果

**结语：**

本来好像还要为大家分享一个 3D slider 的，但是感觉博文略长略长了，分篇幅，下篇博文在分享一下 css3 3D 的实际使用。