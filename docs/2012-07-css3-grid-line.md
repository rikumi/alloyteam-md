---
title: 使用 CSS3 绘制网格线
date: 2012-07-19
author: TAT.iAzrael
source_link: http://www.alloyteam.com/2012/07/css3-grid-line/
---

话说昨天在写[在线素描](http://www.alloyteam.com/2012/07/convert-picture-to-sketch-by-canvas/ "使用 Canvas 把照片转换成素描画")的时候，想着给画布加上些网格，就跟 PS 里面的一样。但是用 canvas 画是不行的（注：不是它不行……），图片又让我不齿，就作罢了。

[![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/044033iwQ.png "ps-grid")](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/044033iwQ.png)

今天想着要不尝试着用 CSS3 画一个，找了些资料，看了下 CSS3 的所有属性，竟然也被我找到画网格的方法了，喔～哇哈哈哈～～

这些属性就是 ——linear-gradient、background-size，大家鼓掌欢迎他们～

那到底要怎么做呢？我们暂时不考虑网格，先想想，怎么画一条横线呢？

……（10 分钟过去鸟）

好，看下面的代码（只贴了 webkit 的实现，其他的太多，不想写，下同～ &lt;\_&lt;）：

    .grid{
        background:
            -webkit-linear-gradient(top, transparent 39px, blue 40px);
    }

它的效果是酱紫滴：

[![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/044033fPN.png "css linear gradient")](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/044033fPN.png)

前面 39px 的都是透明的，那只要让 40px 之后的也是透明的或者看不到不就成了一条线了么。这时 background-size 就上场咯。何谓 background-size？[w3cschool](http://www.w3schools.com/cssref/css3_pr_background-size.asp) 如是说：

> The background-size property specifies the size of the background images.

也就是指定背景图片（渐变也是个图片）的大小。比如说一张 100 x 100 的图片，可以用这个属性指定只显示其中的 30 x 20（纯属举例）。这里把水平限制设置为 100%（也就是不限制），垂直方向限制成只显示 40px 的范围。这样就会漏出 1 像素的蓝色，看上去就成了一条线了。

```css
.grid{
    background:
        -webkit-linear-gradient(top, transparent 39px, blue 40px);
        background-size: 100% 40px;
}
```

[![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/04403455E.png "css-line")](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/04403455E.png)

可以看到，当不设置背景平铺的时候，横线就出来了吧。加上 repeat 之后，hoho，就成了信纸咯～

那么，接下来的事就容易过剃头啦（么剃头很容易么）！利用 CSS3 的多重背景，依个葫芦画个瓢再加个垂直的竖线，就搞定咯。完整的代码如下：

```css
.grid{
    background:
        -webkit-linear-gradient(top, transparent 39px, blue 40px),
        -webkit-linear-gradient(left, transparent 39px, blue 40px)
        ;
    background-size: 40px 40px;
}
```

[![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/044035wTA.png "css grid")](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/044035wTA.png)

呼～大功告成！如果你的浏览器支持 CSS3，可以到[这里查看 live demo](http://www.alloyteam.com/wp-content/uploads/2012/07/css3-grid.html)。不过这个网格是不是有点单调？如果你够创意，可以整成更炫哦～比如说：2px 宽，颜色相间的网格 ——

[![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/044036Cjn.png "css colorful grid")](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/044036Cjn.png)

嗯，剩下的就各位自由发挥了，hoho～～