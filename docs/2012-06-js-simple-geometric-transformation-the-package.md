---
title: Js 对几何变换的简单封装
date: 2012-06-02
author: TAT.Cson
source_link: http://www.alloyteam.com/2012/06/js-simple-geometric-transformation-the-package/
---

<!-- {% raw %} - for jekyll -->

如果是涉及到游戏或动画的编程，我们很可能会用到几何变换。如果在大学过线性代数的话，我们就会知道，无论是 2d 还是 3d 的几何变换，矩阵都是实现线性变换的一个重要工具。任意线性变换都可以用矩阵表示为易于计算的一致形式，并且多个变换也可以很容易地通过矩阵的相乘连接在一起。

本文章主要对如下的变换进行简单的封装，并简单阐述其中的变换原理：

1.  **平移变换**：只改变图形的位置，不改变大小。
2.  **旋转变换**：保持图形各部分之间的关系，变换后形状不变。
3.  **比例变换**：可改变图形大小和形状。
4.  **错切变换**：引起图形角度关系的改变，甚至导致图形发生畸变。
5.  **对称变换**：使图形对称于 x 轴或 y 轴或 y=x 或 y=-x 的变换。

[查看 demo](http://www.alloyteam.com/wp-content/uploads/2012/06/main.html "查看 demo")  
程序中，我们将定义一个矩阵类 Matrix，其中的 matrix 属性保存以二维数组表示的矩阵形式，当我们初始化矩阵对象时，需要传入该矩阵的具体数据：

```javascript
var mtx = new matrix({
    matrix: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ],
});
```

**2D 坐标系下的变换:**

2d 坐标系下，我们使用如下的变换矩阵：

[![](http://www.alloyteam.com/wp-content/uploads/2012/06/1.jpg "1")](http://www.alloyteam.com/wp-content/uploads/2012/06/1.jpg)

其中，左上区域（abde）负责图形的缩放、旋转、对称、错切等变换，cf 负责平移变换。

**2d 平移：**

使点平移一定位移，我们使用的变换矩阵是：

[![](http://www.alloyteam.com/wp-content/uploads/2012/06/21.jpg "2")](http://www.alloyteam.com/wp-content/uploads/2012/06/21.jpg)

使 x，y 点平移 Tx，Ty 的位移，则使 \[x,y,1] 矩阵与上面的矩阵相乘，具体的封装如下：

```javascript
/**
*2d平移
**/
translate2D:function(x,y){
    var changeMtx= new matrix({
        matrix:[
           [1,0,0],
           [0,1,0],
           [x,y,1]
        ]
    });
    return this.multiply(changeMtx);
},
```

**2d 缩放：**  
2d 坐标轴下以原点为参考点时，缩放变换使用的变换矩阵如下：

[![](http://www.alloyteam.com/wp-content/uploads/2012/06/3.jpg "3")](http://www.alloyteam.com/wp-content/uploads/2012/06/3.jpg)

使 \[x,y,1] 矩阵与上面的矩阵相乘，则可得出相对于原点缩放后的坐标值。

但是很多情况下，我们可能需要相对于任意点进行缩放而不单单限制于相对于原点的缩放，因此我们这里最好封装相对于坐标轴上任意点的缩放方法。相对于任意点的缩放其实也是由相对于原点的缩放转换而来，相对于点 (x1,y1) 的**缩放计算具体步骤**如下：

**把坐标原点平移至 (x1,y1)\*\***--> 进行相对于原点的变换 --> 把坐标原点平移回去 \*\*

矩阵计算：

[![](http://www.alloyteam.com/wp-content/uploads/2012/06/41-300x77.jpg "4")](http://www.alloyteam.com/wp-content/uploads/2012/06/41.jpg)

因此对任意点缩放的方法封装如下：

```javascript
/**
*2d缩放
**/
scale2D:function(scale,point){//缩放比，参考点
    var sx=scale[0],sy=scale[1],x=point[0],y=point[1];
 
    var changeMtx= new matrix({
        matrix:[
           [sx,0,0],
           
```


<!-- {% endraw %} - for jekyll -->