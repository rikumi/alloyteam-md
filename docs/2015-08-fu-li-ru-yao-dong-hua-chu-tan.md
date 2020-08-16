---
title: 【福利】乳摇动画初探
date: 2015-08-23
author: TAT.vorshen
source_link: http://www.alloyteam.com/2015/08/fu-li-ru-yao-dong-hua-chu-tan/
---

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
    eachCircleDot(imgData, cx, cy, r, function (posi) {
        var tx = posi.x,
            ty = posi.y;
        var u = transFormula(cx, cy, mx, my, tx, ty, r);
        moveDot(imgData, imgDataBuff, posi, u);
        function transFormula(cx, cy, mx, my, tx, ty, r) {
            var relativity = sqr(r) - distanceSqr(tx, ty, cx, cy);
            var distanceMovedSqr = distanceSqr(mx, my, cx, cy);
            var rate = sqr(relativity / (relativity + distanceMovedSqr));
            var ux = tx - rate * (mx - cx),
                uy = ty - rate * (my - cy);
            return {
                x: ux,
                y: uy,
            };
        }
    });
    return imgData;
}
```

上面是液化算法的函数，结合上面的图来看，参数分别是图片像素 data，圆心 C 的 x 轴和 y 轴，M 点的 x 轴和 y 轴，圆的半径 r

copyImageDataBuff 是将将要液化部分的像素 copy 一份，代码如下

```javascript
function copyImageDataBuff(imgData) {
    var data = imgData.data,
        imgDataBuff = [];
    for (var i in data) {
        imgDataBuff[i] = data[i];
    }
    return imgDataBuff;
}
```

eachCircleDot 是将每个圆内的像素取出来进行处理

```javascript
function eachCircleDot(imageData, ox, oy, r, callback) {
    var imgWidth = imageData.width,
        imgHeight = imageData.height,
        data = imageData.data,
        left = ox - r,
        right = ox + r,
        top = oy - r,
        bottom = oy + r;
    for (var x = left; x < right; x++) {
        for (var y = top; y < bottom; y++) {
            if (distanceSqr(x, y, ox, oy) <= sqr(r)) {
                callback({
                    x: x,
                    y: y,
                });
            }
        }
    }
}
```

distanceSqr 和 sqr 是求圆心距离和平方的函数，很简单

```c
function distanceSqr(x1, y1, x2, y2) {
	return sqr(x1 - x2) + sqr(y1 - y2);
}
 
function sqr(x) {
	return x * x;
}
```

transFormula 这个方法就是液化公式的使用，传入的是 c 点的 x，y 值、m 点的 x，y；t 点就是上面图中的 x 点，return 出来 u 点的 x，y 值之后传入 moveDot，这个就是液化最终的表现函数

```c
function moveDot(imgData, dataBuff, posi, u) {
	var imgWidth = imgData.width,
		imgHeight = imgData.height,
		data = imgData.data;
 
	u.x = Math.floor(u.x);
	u.y = Math.floor(u.y);
 
	data[(posi.y * imgWidth + posi.x) * 4] = dataBuff[(u.y * imgWidth + u.x) * 4];
	data[(posi.y * imgWidth + posi.x) * 4 + 1] = dataBuff[(u.y * imgWidth + u.x) * 4 + 1];
	data[(posi.y * imgWidth + posi.x) * 4 + 2] = dataBuff[(u.y * imgWidth + u.x) * 4 + 2];
	data[(posi.y * imgWidth + posi.x) * 4 + 3] = dataBuff[(u.y * imgWidth + u.x) * 4 + 3];
}
```

将公式算出的 u 点 rgba 信息换给之前的 t 点，也就是图中的 x 点，完成液化

最终给个结果图

![](http://images0.cnblogs.com/blog2015/740327/201508/231838083944385.gif)

因为只时间缘故（LPL 决赛呢）只设置了左胸的摇动触发，触发代码如下

```javascript
var sX = 5;
var sY = 5;
var iX = -200;
var x = -10;
var iY = ev.clientY - oC.offsetTop;
if (iY > 296) {
    iY = 200;
    y = 10;
} else {
    iY = -200;
    y = -10;
}
timer = setInterval(function () {
    oGC.drawImage(leftImage, 0, 0); // 只做了左半边的效果
    var d = oGC.getImageData(23, 140, 140, 200);
    var c = liquify(d, 60, 170, sX + 65, sY + 170, 58);
    oGC.putImageData(c, 23, 140);
    sX = sX + x;
    sY = sY + y;
    if (Math.abs(sX) > Math.abs(iX) || Math.abs(sY) > Math.abs(iY)) {
        clearInterval(timer);
    }
}, 30);
```

这里面的数值都是自己测出来的，sX 和 sY 是摇动的频率，getImageData 的 xywh 四个值也是试出来的，意味着你想要胸变化的范围，注意：

这个范围必须要比液化公式中的圆大

iY 和 y 是根据点击在胸上方还是胸下方来确定摇动的方向

liquify 传入的参数已经介绍过了

* * *

这次的乳摇还是很初步的，只是优化了速度，最早还有一个版本非常的卡，demo 就不放出来了…… 一些幅度，方向都很简单，而且是写死的，如果你有兴趣可以更多的去优化和添加功能～