---
title: 【福利】乳摇动画初探
date: 2015-08-23
author: TAT.vorshen
source_link: http://www.alloyteam.com/2015/08/fu-li-ru-yao-dong-hua-chu-tan/
---

<!-- {% raw %} - for jekyll -->

咳，以探索技术的精神进行一些猥琐的实现，先说明，如果你只想看最后乳摇的结果那就请 ctrl+F4 吧，因为网上有那些乳摇的 APP，制作出来绝对比我这个初探的方法好，我这个只是介绍我实现乳摇的过程思路与方法。

关于乳摇如何实现，我第一个想法是使用 metaball，因为是两个球嘛，然而发现根本就不行，Fail。最终使用的是液化算法去实现。

好了，下面是对液化算法的介绍。

如果你从来不使用 ps，暂时想不起来液化是什么不要紧，请看下图

![](http://www.alloyteam.com/wp-content/uploads/2015/08/1.gif)

这个是采用液化使一只静态的小狗有了动的感觉

总而言之，液化是使一张图片的部分进行平滑的有规律的变化，这个变化有扭曲的平移之感

是如何实现的呢，来看算法，先给一张图

![](http://www.alloyteam.com/wp-content/uploads/2015/08/2.png)

局部变化以一个圈为变化环境，C 点是圆心，r 是半径，当 C 移动到 M 这个点时，U 移动到 X。

通过以上这句话我们得出了这样的结论：

液化的变化只在半径为 r 的圆内发生，距离圆心越近，变化越明显。这是不是和乳摇这一现象特别的吻合？

下面是算法公式

![](http://www.alloyteam.com/wp-content/uploads/2015/08/3.png)

公式终于实现的是你知道 X 点的坐标，可以推算出 U 点的坐标，反之知道 U 点也可以推算出 X 的坐标

怎么推算出来的这个我也不知道，需要结合圆的范围，进行插值处理，但是具体如何得到这个结论，感兴趣的同学可以阅读

Andreas Gustafsson 的 [Interactive Image Warping](http://www.gson.org/thesis/warping-thesis.pdf) 一文，这个公式就是从这而来

好了，接下来该码程序了

乳摇首先你得有图

```javascript
var sImg = new Image();
sImg.src = "./dd.png";
var leftImage = new Image();
leftImage.src = "./dd_left.png";
var rightImage = new Image();
rightImage.src = "./dd_right.png";
var timer = null;
sImg.onload = function () {
    oGC.drawImage(sImg, 0, 0);
};
```

这里上来就有三张图，其中一张是完整的，还有两张分别是美女左右对半分开的【其实就是左胸和右胸】，因为需要这两张图进行乳摇【液化】后的还原。当然你也可以只用一张图，先取出还原的像素存起来也是可以的，我在这里偷懒了

```javascript
function liquify(imgData, cx, cy, mx, my, r) {
        var imgDataBuff = copyImageDataBuff(imgData);
        eachCircleDot(imgData, cx, cy, r, function(posi) {
            var tx = posi.x,
                ty = posi.y;
            var u = transFormula(cx, cy, mx, my, tx, ty, r);
            moveDot(imgData, imgDataBuff, posi, u);
            function transFormula(cx, cy, mx, my, tx, ty, r) {
                var relativity = sqr(r) - distanceSqr(tx, ty, cx</
```


<!-- {% endraw %} - for jekyll -->