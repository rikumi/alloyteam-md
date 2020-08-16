---
title: AlloyRenderingEngine 之 Shape
date: 2015-04-23
author: TAT.dnt
source_link: http://www.alloyteam.com/2015/04/alloyrenderingengine-zhi-shape/
---

## [](http://www.alloyteam.com/2015/04/alloyrenderingengine-zhi-shape/#写在前面)写在前面

不读文章，只对代码感兴趣可以直接跳转到这里 [](https://github.com/AlloyTeam/AlloyGameEngine)<https://github.com/AlloyTeam/AlloyGameEngine>  
然后 star 一下，多谢支持：)。

游戏或者应用中，不是所有的地方都是贴图，**Shape** 也有很常见的应用场景，如游戏中显示 HP 的血条。大量的 Shape 可以组成矢量图。矢量图的好处是放大不失真，也就是不会变模糊；而位图放大失真，失真的程度要看其平台插值算法的牛 B 程度，但放大效果越好的算法，速度越慢，所以大部分平台会在速度和效果上取个折中。

绘制 Shape 根绘制位图本质不一样，绘制位图可以充分利用 GPU 渲染（当然也可以不用），绘制 Shape 必须经过 CPU 先进行数学计算和图形学相关算法（比如你可以尝试不使用 api，而使用点去绘制贝塞尔曲线、圆形、线条等，你做的所有数学工作，就是计算机做的工作），然后再进行渲染。所以很显然，绘制大量的 Shape 会造成帧率下降。

**那么又想使用 Shape，又不想降低帧率怎么办？**

绘制 Shape 和绘制图片又不冲突。Shape 可以转成图片进行渲染，跟 Shape 类似的还有文字，文字也可以转成图片再进行绘制以提高绘制帧率，意思就是：  
1. 经过 CPU 先进行数学计算和图形学相关算法  
2. 渲染至某个备份 Canvas  
3. 以后游戏或者应用中的 core loop 直接把备份 Canvas 绘制上去，而不用去重新计算  
4. 当 Shape 有更改的时候才去更新备份 Canvas

这里需要注意的是：必须知道 Shape 所占据的宽高。

## [](http://www.alloyteam.com/2015/04/alloyrenderingengine-zhi-shape/#shape类)Shape 类

AlloyRenderingEngine 内置了 Shape 类用于绘制几何形状。  
其 API 设计与命名也 Canvas 的 Context2d 的一致，不同在与：  
1. 使用了连缀的方法调用方式，  
2. 最后要调用 end () 结尾  
3. 需要增加到舞台

如入画一个圆：

```javascript
(function (ARE) {
    var Stage = ARE.Stage,
        Shape = ARE.Shape;
    var stage = new Stage("#ourCanvas");
    var shape = new Shape(73, 76);
    shape
        .beginPath()
        .arc(10, 10, 20, 0, Math.PI * 2)
        .fill()
        .end();
    stage.add(shape);
})(ARE);
```

可以看到，创建 Shape 的实例需要传两个参数，一个代表宽，一个代表高。具体为什么要传这两个参数，请从文章开头重新读一遍：)。  
以此类推。其他的方法还有：moveTo、lineTo、bezierCurveTo、stroke、fillStyle、fillRect、clear、clearRect 等…

而 shape 也拥有 scale、scaleX、scaleY、skewX、skewY、rotation、x、y、alpha 等属性

### [](http://www.alloyteam.com/2015/04/alloyrenderingengine-zhi-shape/#举个栗子)举个栗子 (鼠标放在球上然后滚动你的滚轮试试)

## [](http://www.alloyteam.com/2015/04/alloyrenderingengine-zhi-shape/#再举个栗子)再举个栗子 (鼠标放在老虎上然后滚动你的滚轮试试)

(function (ARE) { var Stage = ARE.Stage, Shape = ARE.Shape; var stage = new Stage ("#ourCanvas"); //M = moveto //L = lineto //H = horizontal lineto //V = vertical lineto //C = curveto //S = smooth curveto //Q = quadratic Belzier curve //T = smooth quadratic Belzier curveto //A = elliptical Arc //Z = closepath // 注释：以上所有命令均允许小写字母。大写表示绝对定位，小写表示相对定位。 var tiger = new Shape (600, 600); var offsetX = 200, offsetY = 180; for (var i = 0, len = tigerPath.length; i &lt; len; i++) { var pathDt = tigerPath\[i]; var points = pathDt.path.split(/\[M,L,H,V,C,S,Q,T,A,Z,m,l,h,v,c,s,q,t,a,z]/g); points.shift(); var cmds = pathDt.path.match(/\[M,L,H,V,C,S,Q,T,A,Z,m,l,h,v,c,s,q,t,a,z]/g); tiger.beginPath(); tiger.strokeStyle(pathDt.stroke); tiger.fillStyle(pathDt.fill); for (var j = 0, cmdLen = cmds.length; j &lt; cmdLen; j++) { var pArr = points\[j].split(" "); if (cmds\[j] == "M") { pArr\[0] = parseFloat(pArr\[0]) + offsetX; pArr\[1] = parseFloat(pArr\[1]) + offsetY; tiger.moveTo.apply(tiger, pArr); } else if (cmds\[j] == "C") { pArr\[0] = parseFloat(pArr\[0]) + offsetX; pArr\[2] = parseFloat(pArr\[2]) + offsetX; pArr\[4] = parseFloat(pArr\[4]) + offsetX; pArr\[1] = parseFloat(pArr\[1]) + offsetY; pArr\[3] = parseFloat(pArr\[3]) + offsetY; pArr\[5] = parseFloat(pArr\[5]) + offsetY; tiger.bezierCurveTo.apply(tiger, pArr) } else if (cmds\[j] == "L") { pArr\[0] = parseFloat(pArr\[0]) + offsetX; pArr\[1] = parseFloat(pArr\[1]) + offsetY; tiger.lineTo.apply(tiger, pArr); } } tiger.closePath(); tiger.stroke(); tiger.fill(); } tiger.end(); stage.add(tiger); tiger.scale = 0.5; tiger.originX = tiger.originY = 0.5; tiger.x = 240; tiger.y = 240; stage.onMouseWheel(function (event) { if (event.delta &lt; 0) { tiger.scale -= 0.05; } else { tiger.scale += 0.05; } if (tiger.scale &lt; 0) tiger.scale = 0; }) })(ARE);  
(function (ARE) { var Stage = ARE.Stage, Shape = ARE.Shape; var stage = new Stage("#alloyCanvas2"); var shape = new Shape(73, 76); shape.beginPath().arc(377 / 4 - 58, 391 / 4 - 58, 140 / 4, 0, Math.PI \* 2).closePath() .fillStyle('#f4862c').fill() .strokeStyle("#046ab4").lineWidth(8 / 4).stroke() .beginPath().moveTo(298 / 4 - 58, 506 / 4 - 58).bezierCurveTo(236 / 4 - 58, 396 / 4 - 58, 302 / 4 - 58, 272 / 4 - 58, 407 / 4 - 58, 254 / 4 - 58).strokeStyle("#046ab4").lineWidth(6 / 4).stroke() .beginPath().moveTo(328 / 4 - 58, 258 / 4 - 58).bezierCurveTo(360 / 4 - 58, 294 / 4 - 58, 451 / 4 - 58, 272 / 4 - 58, 503 / 4 - 58, 332 / 4 - 58).strokeStyle("#046ab4").lineWidth(6 / 4).stroke() .beginPath().moveTo(282 / 4 - 58, 288 / 4 - 58).bezierCurveTo(391 / 4 - 58, 292 / 4 - 58, 481 / 4 - 58, 400 / 4 - 58, 488 / 4 - 58, 474 / 4 - 58).strokeStyle("#046ab4").lineWidth(6 / 4).stroke() .beginPath().moveTo(242 / 4 - 58, 352 / 4 - 58).bezierCurveTo(352 / 4 - 58, 244 / 4 - 58, 319 / 4 - 58, 423 / 4 - 58, 409 / 4 - 58, 527 / 4 - 58).strokeStyle("#046ab4").lineWidth(6 / 4).stroke() .end(); shape.x = shape.y = 200; shape.originX = shape.originY = 0.5; stage.add(shape); stage.onMouseWheel(function (evt) { if (evt.delta > 0) { shape.scale += 0.05; } else { shape.scale -= 0.05; } }) })(ARE);

**滚轮事件怎么搞滴？**

```javascript
stage.onMouseWheel(function (evt) {
    if (evt.delta > 0) {
        shape.scale += 0.05;
    } else {
        shape.scale -= 0.05;
    }
});
```

简单吧！

## [](http://www.alloyteam.com/2015/04/alloyrenderingengine-zhi-shape/#github)Github

[](https://github.com/AlloyTeam/AlloyGameEngine)<https://github.com/AlloyTeam/AlloyGameEngine>  
据说 star 一下不会怀孕 = =！多谢支持：)！