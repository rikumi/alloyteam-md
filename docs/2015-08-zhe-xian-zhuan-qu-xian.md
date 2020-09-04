---
title: 折线转曲线
date: 2015-08-25
author: TAT.dnt
source_link: http://www.alloyteam.com/2015/08/zhe-xian-zhuan-qu-xian/
---

<!-- {% raw %} - for jekyll -->

写在前面  

* * *

这个东西其实是有价值的东西。因为在软体模拟、数学方程可视化、流体模拟、数据可视化等等方面都有其用武之地。

如水的模拟：

![usage](http://images0.cnblogs.com/blog2015/105416/201508/251939571561058.png)

心形函数方程转图像

![usage](http://images0.cnblogs.com/blog2015/105416/201508/251940011098732.png)

线性报表

![usage](http://images0.cnblogs.com/blog2015/105416/201508/251939511257781.png)

其原理都是通过三次贝塞尔曲线将有限个数的点平滑化。

问题建模  

* * *

已知若干个点，绘制出该点连接的曲线。

````html
​<canvas width="480" height="480"></canvas> 

```html
<script> 
    function drawPath(path){ 
        //实现 
    } 
 
    drawPath([{ x: 50, y: 50 }, { x: 200, y: 100 }, { x: 250, y: 50 }, { x: 350, y: 150 }, { x: 370, y: 100 }, { x: 570, y: 200 }]) 
</script>
````

```

这里实验平台使用浏览器环境，即 Canvas 相关 API 以及 javascript 语言。

这里 canvas 的上下文对象拥有了 bezierCurveTo 方法，故免去了自己实现 bezierCurveTo 的一些事情。

```

​context.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y);

````

实现图解  

-------

实现目标

![usage](http://images0.cnblogs.com/blog2015/105416/201508/252022052033323.png)

具体过程  
![usage](http://images0.cnblogs.com/blog2015/105416/201508/252022149062488.png)

代码  

-----

Vector2，一般用来表示向量，但有的时候也用来当作点来进行一计算。

```javascript
var Vector2 = function(x, y) { 
        this.x = x; 
        this.y = y; 
} 
Vector2.prototype = { 
    "length": function () {
````


<!-- {% endraw %} - for jekyll -->