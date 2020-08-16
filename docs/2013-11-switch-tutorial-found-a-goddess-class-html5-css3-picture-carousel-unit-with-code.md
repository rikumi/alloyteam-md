---
title: 【教程】女神级的 HTML5 CSS3 的图片轮播器
date: 2013-11-21
author: TAT.Minren
source_link: http://www.alloyteam.com/2013/11/switch-tutorial-found-a-goddess-class-html5-css3-picture-carousel-unit-with-code/
---

最近在学习 HTML5 和 CSS3，印象最深的是 CSS3 的动画功能，不仅有浏览器原生支持，执行效率高，而且免去在 js 中自己管理 timer。

本来想写一个图片轮播器练练手，结果在网上发现一个国人写的开源的图片轮播器。不仅效果很酷，而且是 “女神级” 的。什么？你问是不是妹子写的？这个我不知道，我说的是这个 Demo 中的图片都是女神呀，性感火辣，丰满妩媚…… 咳咳，回正题。

Demo 的页面是<http://alloyteam.github.io/jxanimate/>想看女神的自己点吧。

看链接就知道是 alloyteam 的作品。你没听说过 Alloyteam？Alloyteam 就是腾讯负责开发 WebQQ 的队伍，他们有很多开源作品，比如坦克大战，AlloyImage 图片处理工具。有兴趣可以访问他们的博客网站<http://www.alloyteam.com/>

这次的轮播器也是一个开源项目，名叫 JX.Animate，看页面介绍是一个轻量级的 CSS3 动画库，不仅可以用 JS 方便调用 CSS3 的 keyframe 动画，而且还能用 JS 定制 CSS3 的动画。

以后有时间在来仔细研究这个框架库，我先找找轮播器的代码。在主页上有一个文档链接[Documents](http://alloyteam.github.io/jxanimate/js/out/index.html)，打开后可以看到有一个类叫[SlideShow](http://alloyteam.github.io/jxanimate/js/out/classes/SlideShow.html)，这个就是图片轮播器。

直接在 Chrome 中查看源代码，作者很厚道，源代码没有压缩，注释也都保留着。  
主文件是 index.js，里面代码不多，看了一下其中和轮播器相关的有以下代码：

```css
SlideShow.init("slide_contrainer", { imgW: 640, imgH: 400, num: cardnum });
```

这句应该是初始化，第一个参数是一个 div 容器的名字，在 index.html 中可以找到这个 div，里面包含了一个 img（还有 7 个被注释了，后面解释）。  
后面的参数是图片的高度和宽度，最后一个参数叫卡片数量。

    SlideShow.setDonimo(default_domino);

这句是设置多米诺效果，这是作者号称的一个特色功能。原理很简单，比如有 10 个对象要设置动画效果，本来是 10 个动画一起播放，如果设置了多米诺效果，就将 10 个动画依次延迟一段时间播放，中间延迟的时间就是这里多米诺参数的值。

    //添加更多图片
    SlideShow.addImgByUrl('style/images/m2.jpg');

这里添加了 7 张新图，正是 index.html 页面中注释掉的图片。为什么要改呢？估计是因为如果写在 html 中会导致页面加载时间过长，放在 js 中可以实现静默加载吧。

    SlideShow.next();
    SlideShow.prev ();

这个就是翻页方法了，如果一直 next 下去会循环播放的。

轮播器的方法封装还是很简洁的。看来自己做一个轮播器并不复杂。

首先要引用若干 JS 文件  
l jx.all.js   这个据说是 Web QQ 的框架库，有机会研究一下  
l jxanimate.js  看名字就知道这个动画框架是基于 JX 的。  
l jxanimate.effects.js  这个是效果库，里面是用 js 定义的一些动画效果，支持扩展。  
l slideshow.js     图片轮播器的主文件。  
l slideshow.effects.js          这个是向 JXAnimation 中添加一些动画效果。

以下 HTML 和 JS 代码

````html
    <body>
 
        图片轮播器Demo
 
        <div id="picplayer" style="position:relative;width:300px;height:300px;">
 
            <img src="http://img.jb51.net/online/picPlayer/1.jpg">
 
        </div>
 
        <button id="prev" onclick="SlideShow.prev();">上一页</button>
 
        <button id="next" onclick="SlideShow.next();">下一页</button>
 
        
```html
<script>
 
            var pics1 = [
 
                'http://img.jb51.net/online/picPlayer/1.jpg',
 
                'http://img.jb51.net/online/picPlayer/2.jpg',
 
                'http://img.jb51.net/online/picPlayer/3.jpg'
 
                ];
 
            SlideShow.init('picplayer',{imgW:300,imgH:300,
 
                num:6}); //横竖都是6个片片
 
            SlideShow.setDonimo(900/6/6);  //900毫秒除以36个片片
 
            //添加更多图片
 
            for (var i = pics1.length - 1; i >= 1; i--) {
 
                SlideShow.addImgByUrl(pics1[i]);
 
            };
 
        </script>
````

 
    </body>

````

代码还是挺清爽的。

不过这样运行可是什么效果都没有。。。。。。

不得已用Chrome 的调试神器分析一下。结果发现是一些样式问题。必须有以下的 CSS：

```css
    .slide_Img{
        display: none;
        visibility: collapse;
    }
    .card_piece{
      position: absolute;
      visibility: hidden;
    }
    .hidden{
      visibility: hidden;
    }
    .visible{
      visibility: visible;
    }
    #stage
    {
      position: relative;
      top: 0px;
      left: 0px;
    }
````

感觉这些都是很基本的样式设置，直接在 JS 中写 Style 就行了。这里的封装可以再改进一下。有时间给作者提交一个 pull request。

另外还有一个坑，就是一定要引用 animate.css 文件，因为 SlideShow 中引用了其中的动画，估计作者是想演示一下调用 CSS 动画的能力。但是如果找不到 CSS 中 keyframe 动画，不仅当前的动画播放不了，以后所有的动画都会有问题。这里的容错还需要加强一下。

好东西不敢独享，把完整代码给大家发上来。

请访问原文下载源代码

<http://bbs.miaov.com/forum.php?mod=viewthread&tid=7374&fromuid=11876>