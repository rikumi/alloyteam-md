---
title: 不能说的秘密 —— 前端也能玩的图片隐写术
date: 2016-03-24
author: TAT.Johnny
source_link: http://www.alloyteam.com/2016/03/image-steganography/
---

<!-- {% raw %} - for jekyll -->

上个月在千里码刷题的时候，碰到了比较有意思的一道题 —— [隐写术](http://www.qlcoder.com/task/7617)。既然感觉有意思，又很久没有玩过 canvas，所以今天结合这两块内容带大家探索一下。

隐写术算是一种加密技术，权威的 [wiki](https://zh.wikipedia.org/wiki/%E9%9A%90%E5%86%99%E6%9C%AF) 说法是 “ **隐写术**是一门关于信息隐藏的技巧与科学，所谓信息隐藏指的是不让除预期的接收者之外的任何人知晓信息的传递事件或者信息的内容。” 这看似高大上的定义，并不是近代新诞生的技术，早在 13 世纪末德国人 [Trithemius](https://zh.wikipedia.org/wiki/%E7%BA%A6%E7%BF%B0%E5%B0%BC%E6%96%AF%C2%B7%E7%89%B9%E9%87%8C%E7%89%B9%E7%B1%B3%E4%B9%8C%E6%96%AF) 就写出了《隐写术》的著作，学过密码学的同学可能知道。好了，说了这么多，隐写术到底是什么技术，让我们看一个例子。

下面是一张看似普通的图片，但其中却藏有另一个肉眼无法识别的图像哦。

![](https://upload.wikimedia.org/wikipedia/commons/a/a8/Steganography_original.png)

这是如果把上图每个[色彩空间](https://zh.wikipedia.org/wiki/%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%96%93 "色彩空间")和数字 3 进行[逻辑与](https://zh.wikipedia.org/wiki/%E9%82%8F%E8%BC%AF%E8%88%87 "逻辑与")运算，再把亮度增强 85 倍，可以得到下图。

![](https://upload.wikimedia.org/wikipedia/commons/c/c3/Steganography_recovered.png)

简单的说，上述的处理过程可以理解为对图片像素的处理，也就是说，加密的信息散布在每个像素点上。可是，13 世纪还没有 “像素” 这个概念吧？！没错，上面这个例子只是隐写术的一个现代技术实现，隐藏信息的手段有很多，我们日常的钞票防伪也算是隐写术的一种，所以标题上也限定了我们的讨论范围 —— 图片隐写术。

[![{15AAFDB9-59F0-458E-93EF-AE4E799FA5D2}](http://www.alloyteam.com/wp-content/uploads/2016/03/15AAFDB9-59F0-458E-93EF-AE4E799FA5D2-300x235.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/15AAFDB9-59F0-458E-93EF-AE4E799FA5D2.png)

（电子水印与隐写术有一些共通点）

聚焦到载体为图片的隐写术，一起来从前端角度分析其技术原理。

我们知道图片的像素信息里存储着 RGB 的色值，R、G、B 分别为该像素的红、绿、蓝通道，每个通道的分量值范围在 0~255，16 进制则是 00~FF。在 CSS 中经常使用其 16 进制形式，比如指定博客头部背景色为 #A9D5F4。其中 R（红色）的 16 进制值为 A9，换算成十进制为 169。这时候，对 R 分量的值 + 1，即为 170，整个像素 RGB 值为 #AAD5F4，别说你看不出差别，就连火眼金金的 “像素眼” 设计师都察觉不出来呢。于此同时，修改 G、B 的分量值，也是我们无法察觉的。因此可以得出重要结论：**RGB 分量值的小量变动，是肉眼无法分辨的，不影响对图片的识别。**

有了这个结论，那就给我们了利用空间，常用手段的就是对二进制最低位进行操作，下面就用 canvas 来演示一下。

解开图中的秘密  

* * *

![](http://biqing.github.io/teamblog/xiaolan.png)

这是一张我们当家美女小兰师姐的照片，为了让例子足够简单，里面的 R 通道分量被我加入了文本信息，想知道其中的信息，可以跟我用 canvas 代码来解开。

首先在页面加入一个 canvas 标签，并获取到其上下文。

```html
<canvas id="canvas" width="256" height="256"></canvas>;
```

```javascript
var ctx = document.getElementById("canvas").getContext("2d");
```

接着将图片先绘制在画布上，然后获取其像素数据。

```javascript
var img = new Image();
var originalData;
img.onload = function () {
    ctx.drawImage(img, 0, 0); // 获取指定区域的canvas像素信息
    originalData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    console.log(originalData);
};
img.src = "xiaolan.png";
```

打印出数据，会看到有一个非常大的数组。

[![QQ 截图 20160325174947](http://www.alloyteam.com/wp-content/uploads/2016/03/QQ截图20160325174947-300x55.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/QQ截图20160325174947.png)

这个一维数组存储了所有的像素信息，一共有 256 \* 256 \* 4 = 262144 个值。其中 4 个值一组，为什么呢？在浏览器中解析图片，除了 RGB 值外，每组第 4 个值为透明度值，即像素信息实际为大家熟知的 rgba 值。 

这里的解密规则是对 R 通道进行处理，R 的分量最低位为 1 则该像素设为红色，R 的分量最低位为 0 则该像素设为黑色，直接看代码实现，完成后我们再绘制到 canvas，即可看到结果。

```javascript
var processData = function (originalData) {
    var data = originalData.data;
    for (var i = 0; i < data.length; i++) {
        if (i % 4 == 0) {
            // 红色分量
            if (data[i] % 2 == 0) {
                data[i] = 0;
            } else {
                data[i] = 255;
            }
        } else if (i % 4 == 3) {
            // alpha通道不做处理
            continue;
        } else {
            // 关闭其他分量，不关闭也不影响答案，甚至更美观 o(^▽^)o
            data[i] = 0;
        }
    } // 将结果绘制到画布
    ctx.putImageData(originalData, 0, 0);
};
```

在 img onload 事件中调用 processData 方法，就可以看到结果啦。

得到的结果可能是这个样子的。

[![result](http://www.alloyteam.com/wp-content/uploads/2016/03/result.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/result.png)

在图片中隐藏信息  

* * *

讲了基础的解密过程，再来反向说说加密过程。

既然要在图片中加入文字信息，那么首先要获取文字的像素信息，这里我先用 canvas 在画布上打印文字，获取像素信息。

```javascript
var textData;
// 这些canvas API，好久没用，需要查API文档了T_T
ctx.font = "30px Microsoft Yahei";
ctx.fillText("广告位招租u", 60, 130);
textData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;
```

先保存文字的像素信息，接着加载图片获取其像素信息，然后对两组像素进行处理，我在这里抽离了一个公共方法。

```javascript
var mergeData = function (newData, color) {
    var oData = originalData.data;
    var bit, offset; // offset的作用是找到alpha通道值，这里需要大家自己动动脑筋
    switch (color) {
        case "R":
            bit = 0;
            offset = 3;
            break;
        case "G":
            bit = 1;
            offset = 2;
            break;
        case "B":
            bit = 2;
            offset = 1;
            break;
    }
    for (var i = 0; i < oData.length; i++) {
        if (i % 4 == bit) {
            // 只处理目标通道
            if (newData[i + offset] === 0 && oData[i] % 2 === 1) {
                // 没有信息的像素，该通道最低位置0，但不要越界
                if (oData[i] === 255) {
                    oData[i]--;
                } else {
                    oData[i]++;
                }
            } else if (newData[i + offset] !== 0 && oData[i] % 2 === 0) {
                // // 有信息的像素，该通道最低位置1，可以想想上面的斑点效果是怎么实现的
                if (oData[i] === 255) {
                    oData[i]--;
                } else {
                    oData[i]++;
                }
            }
        }
    }
    ctx.putImageData(originalData, 0, 0);
};
```

上述代码做的是，接受要隐藏的数据以及隐藏的颜色通道，然后对原图进行操作，修改图片该通道分量的最低位，如果有文字信息，则最低位置为 1，否则为 0。从最文章开头的结论知道，RGB 的三个通道可以分别隐藏不同信息。

在 img.onload 中调用 mergeData (textData, 'R')，处理好图像后，只要在浏览器中的 canvas 上右键保存图片即可。

这里的例子比较简单，只展示了基本的最低位隐藏文本信息，像二维码这些简单图形也可以这么处理。现实中隐藏画中画则需要更专业的图像处理算法，这里就不再展开了。

应用价值  

* * *

图片隐写术的应用价值很广泛，比如程序员之间的表白（不限男女），不失为一种浪漫的方式～

上面的案例中我没有放出师姐的原片，这意味着如果盗用上面的图片，我是有办法识别出来的，起到了简单的一种签名作用。当然你也有办法消除掉里面的信息，而前提是你需要知道我的加密方式，可是实际应用中绝不会这么简单哦。有个成功案例就是大众点评通过这种方式，成功证明食神 app 对其图片的盗用，为自己的合法权益进行了有效维护。

好的，感谢阅读到最后，作为回报，我将福利隐藏在了师姐的图片中，请自行发现吧～


<!-- {% endraw %} - for jekyll -->