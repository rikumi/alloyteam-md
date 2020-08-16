---
title: 游戏 / 前端开发利器：第二代 spritecow
date: 2015-03-09
author: TAT.dnt
source_link: http://www.alloyteam.com/2015/03/you-xi-qian-duan-kai-fa-li-qi-di-er-dai-spritecow/
---

## 快速入口

不读文章可以直接拐向这里：

spritecow 二代:<https://kmdjs.github.io/arejs-tool-sprite/>

## 写在前面

工欲善其事必先利其器，最近 fork 了一份 spritecow 代码进行了大量升级改造，  
作为 [AlloyRenderingEngine](https://github.com/AlloyTeam/AlloyRenderingEngine) 的开发辅助工具之一，确确实实地提高了开发效率，游戏或前端开发更加便利。  
因为改造后，有些交互使用点需要特别提醒才能发现，所以特意录制了 gif 教程。

## 取色

![enter image description here](http://htmljs.b0.upaiyun.com/uploads/1425866537075-sc-tutorial3.gif)

取色很简单，点哪里，该点的颜色会自动生成在下方。

## Rect 自动识别和导出

![enter image description here](http://htmljs.b0.upaiyun.com/uploads/1425866562993-sc-tutorial2.gif)

矩形区域是系统自动选择，需要的操作是点击或者选区，操作后会自动选择最小能容纳该元素的矩形  
区域。

这里需要特别注意的是，选择完毕如果还想要下载导出，需要【鼠标右键】点击该选区。

## 顶点数据提取

![enter image description here](http://htmljs.b0.upaiyun.com/uploads/1425866798824-sc-tutorial1.gif)

顶点自动提取可以方便地提取容纳图形的最小多边形，可用于游戏开发中的碰撞检测等。

这里需要注意的是，提取出来的坐标是相对于图片右上角的世界坐标，如果需要相对于该多边形的最小矩形区域  
的坐标系统（也就是最小矩形区域的左上角为【0，0】），那该怎么办？

不用担心，我特意为导出的坐标写了一个校正函数，用来将世界坐标转成相对于矩形区域的坐标，代码如下：

```javascript
function correctingVertexList(vertexList) {
    var firstVertex = vertexList[0],
        minX = firstVertex.x,
        minY = firstVertex.y,
        i = 1,
        len = vertexList.length;
    for (; i < len; i++) {
        var vertex = vertexList[i];
        vertex.x < minX && (minX = vertex.x);
        vertex.y < minY && (minY = vertex.y);
    }
    i = 0;
    for (; i < len; i++) {
        var vertex = vertexList[i];
        vertex.x -= minX;
        vertex.y -= minY;
    }
}
```

代码很容易懂，就不做解释了。

赶紧体验一把 :<https://kmdjs.github.io/arejs-tool-sprite/>

Have Fun！