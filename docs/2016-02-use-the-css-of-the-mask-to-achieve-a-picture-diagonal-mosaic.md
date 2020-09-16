---
title: 使用 CSS mask 实现图片的斜线拼接
date: 2016-02-04
author: TAT.iAzrael
source_link: http://www.alloyteam.com/2016/02/use-the-css-of-the-mask-to-achieve-a-picture-diagonal-mosaic/
---

<!-- {% raw %} - for jekyll -->

### 每次必说题外话

话说貌似好久没有写技术文章了，自从娃娃出来后，很少能有时间做技术研究，思考的时间也不足。不过有得必有失，世上事也就酱紫了。但是作为一个前端攻城师，不写代码，不研究技术，是会被后浪拍死在沙滩上的。

碰巧前段时间碰到个 CSS 问题，一直很喜欢 CSS 的，能 CSS 解决的问题绝对不用 JS，于是就抽时间整整看。

### 什么是斜线拼接

回到本文主题上，” 斜线拼接 “是我自创的词语，因为我也不知道怎么描述这个需求，o (╯□╰) o，实际的效果是下面所示：

[![example](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2016/02/035701rqZ.png)](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2016/02/035701rqZ.png)

眼力好的筒子应该就能发现，上面这张图是两个帅锅拼接在一起的，看中间的斜线。

但是呢，刚接到这个需求的时候，开发是抓狂的 —— 第一反应就是用 canvas 画图，这得多累啊，只是要显示张图片而已，竟然还要动用一坨 JS，O\_\_O "…

不过依稀记得，CSS 貌似有个遮罩的特性，可以实现图片的部分显示的效果的。

### CSS mask & linear gradient

要实现这个特性，就需要用到 CSS 遮罩和线性渐变。 至于这两个是什么东西，我就不班门弄斧的介绍了，毕竟这两个属性出生也挺久了的，不了解的筒子可以看这两篇文章 [CSS 遮罩 —— 如何在 CSS 中使用遮罩](http://www.w3cplus.com/css3/css-masking.html)和[深入理解 css3-gradient 斜向线性渐变](http://www.zhangxinxu.com/wordpress/2013/09/%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3css3-gradient%E6%96%9C%E5%90%91%E7%BA%BF%E6%80%A7%E6%B8%90%E5%8F%98/)。

先看下实际的效果

[![拼接效果图](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2016/02/0357027HZ.png)](http://demo.imatlas.com/use-css-mask-slash-achieve-image-stitching.html)

大家请看妹子中间（注意表看错了，是两个妹子的中间），有一条比较明显的分界线。多说无益，我知道你们想看 demo，[用力戳这里 >>](http://demo.imatlas.com/use-css-mask-slash-achieve-image-stitching.html)。

#### **第一步，显示两张图**

OK，先看代码，然后我再来解释。

```html
<div class="img-container">
            <div class="img-left"></div>
            <div class="img-right"></div>
        
</div>;
```

然后是 CSS

```css
    .img-container{
        position: relative;
        width: 200px;
        height: 200px;
        border: 5px solid #40BCFF;
    }
 
    .img-left{
        background: url(img/left.jpg);
        background-size: cover;
        width: 100%;
        height: 100px;
    }
 
    .img-right{
        background: url(img/right.jpg);
        background-size: cover;
        width: 100%;
        height: 10
```


<!-- {% endraw %} - for jekyll -->