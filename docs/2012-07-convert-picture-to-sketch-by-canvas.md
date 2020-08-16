---
title: 使用 Canvas 把照片转换成素描画
date: 2012-07-18
author: TAT.iAzrael
source_link: http://www.alloyteam.com/2012/07/convert-picture-to-sketch-by-canvas/
---

<!-- {% raw %} - for jekyll -->

## [![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/0208516qY.png "sketch")](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/0208516qY.png)

## 一、引子

话说前阵子想把一张照片转换成素描，然后发个微博。结果发现 mac 上没找到能直接转换素描的软件（PS 不算，可要好几步呢），坑爹啊～～google 了下，Web 上竟然也是没有直接把照片转换成素描的东西，连让我包含期望的美图秀秀（Web 版）竟然都没有素描功能，T_T。

手机上是有很多这类 app，但是我只是想一键转换下，发个微博嗟，至于这么折腾么……

所以自己动手整一个在线版的吧，没怎么用过 canvas，正好可以顺道熟悉下。等不及的童鞋可以先到这里看看效果（[http://appx.imatlas.com/sketching/](http://appx.imatlas.com/sketching/ "sketching app")）。

## 二、怎么转换

刚冒出这个想法的时候，简直是一头雾水诶～数学不行、PS 不懂、图形学忘光了……

还好有万能的 google，翻了几页，找到一个 ps 制作素描图片的步骤 —— 虽然我不懂，但是如果按照这个步骤用 PS 能做成素描，我用代码也一定可以的。嗯，一定是的。

PS 里面最简单的一个转换素描的步骤为：

1.  去色（黑白化）
2.  复制一份，反相
3.  把复制后的图层叠加方式设为颜色减淡
4.  高斯模糊

PS 里面的具体步骤我就不详说了，可以看[这篇](http://www.pconline.com.cn/pcedu/sj/pm/photoshop/sm/0601/744561.html)文章。既然知道了实现步骤，我只要用 JS 把这些算法都实现了就行啦，哇哈哈哈～

## 三、原理什么的

**去色**：把图片变成黑白图，只要把每个像素的 R、G、B 设为亮度（Y）的值就行了。关于 R、G、B、Y 的关系可以看到[这里](http://www.61ic.com/Article/DaVinci/DM64X/200804/19645.html)看看，这里只要记住这条公式：Y = 0.299R + 0.587G + 0.114B。

**反相**：就是将一个颜色换成它的补色。补色就是用 255（8 位通道模式下，255 即 2 的 8 次方，16 位要用 65535 去减，即 2 的 16 次方）减去它本身得到的值：R (补) = 255 - R。

**颜色减淡**：其计算公式是：结果色 = 基色 + (混合色 \* 基色) / (255 - 混合色)，在[这里](http://wenku.baidu.com/view/275f9c4769eae009581bec56.html)找到的这条公式，原理我就不多说了，因为我也不大懂（^\_^，图形学睡过去了……）。

**高斯模糊**：嗯，这个是最让我抓头摸脑的。一开始没怎么理解到这个算法，纠结了两天。最后终于灵光一闪，想通了（还好没晕过去大睡三天～.～）！网上有很多 C++ 的实现，但是基本没找到 JS 的。一开始不想去理解高斯模糊，就尝试把 C++ 代码改成 JS 的，改了半天，终于放弃了～想明白之后，自己照原理写了个，想不到还挺容易的，呃…… 具体的高斯模糊原理，就在[这里](http://blog.csdn.net/lovelyloulou/article/details/5485538)、[这里](http://blog.csdn.net/jia20003/article/details/7234741)和[这里](http://my.oschina.net/tonywolf/blog/64896)看吧，老衲就不误人子弟了。

本项目已经托管到了 Github（[https://github.com/iazrael/sketching](https://github.com/iazrael/sketching "sketching on github")），这几个方法的源码可以到上面查看。稍微提下实现素描的一个注意事项：去色之后需要拷贝一份像素数组备用，开始是用数组的 slice 方法来拷贝像素数组的，结果经常需要 800ms 左右的时间；后来尝试了直接用 canvas，putImageData 之后再调用 getImageData 来 “曲线救国”，结果只用 10 几毫秒就可完成，简直让老衲老泪纵横诶～其代码如下：

```ruby
    /**
     * 素描
     * @param  {Object} imgData  
     * @param  {Number} radius 取样区域半径, 正数, 可选, 默认为 3.0
     * @param  {Number} sigma 标准方差, 可选, 默认取值为 radius / 3
     * @return {Array}
     */
    function sketch(imgData, radius, sigma){
        var pixes = imgData.data,
            width = imgData.width, 
            height = imgData.height,
            copyPixes;
 
        discolor(pixes);//去色
        canvas.width = width, canvas.height = height;
        //复制一份
        ctx.clearRect(0, 0, width, height);
        ctx.putImageData(imgData, 0, 0);
        copyPixes = ctx.getImageData(0, 0, width, height).data;
        // 拷贝数组太慢
        // copyPixes = Array.prototype.slice.call(pixes, 0);
        invert(copyPixes);//反相
        gaussBlur(copyPixes, width, height, radius, sigma);//高斯模糊
        dodgeColor(pixes, copyPixes);//颜色减淡
        return pixes;
    }
```

## 四、怎么用

说起用法啊，那你可以问对人了，哈哈。狠狠的敲入 app 的网址：<http://appx.imatlas.com/sketching/>（注意只能用现代浏览器（Chrome，Firefox，Opera，Safari 等）打开哦，IE9 以前的老古董就甭来啦），然后拖拽一张图片到画布区（就是下面打开的灰色地带～），然后…… 就没有然后啦，最多 2 秒之后自动生成素描画。点击 download 按钮可以下载生成的图片。

如果感觉效果不太好，可以改下取样的半径（Sample size），为正整数，最小为 1。如果你一定要填负数、小数，也会被取正取整（抠鼻）。之后点下 action 按钮，生成新的素描图。

如果你还不明白，下面来看图说明（点击图片可以查看大图）。

[![sketching](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/020848a60.png "sketching")](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/020848a60.png)

sketching 图示

斋说都没益啦，实牙实齿效果才是王道，看看下面的原图：

[![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/020850Svs.jpg "示例图")](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/020850Svs.jpg)

原图

转换后的素描图：

[![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/0208516qY.png "sketch")](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/0208516qY.png)

素描

怎么样，效果是不是还不错咧，嘎嘎嘎。当然，这个算法未必是最好的，欢迎各位童鞋踊跃拍砖，^\_^


<!-- {% endraw %} - for jekyll -->