---
title: HTML5，CSS3，jQuery 自制 video 播放器～～值得借鉴哦～～～
date: 2012-03-22
author: TAT.sheran
source_link: http://www.alloyteam.com/2012/03/videoply/
---

<!-- {% raw %} - for jekyll -->

**  
首先说这是一个神奇的播放器，为什么神奇呢，先直接看最终成果：**  

[  
](http://www.alloyteam.com/wp-content/uploads/2012/03/palydemo/index.html)

## [点击我查看 demo](http://www.alloyteam.com/wp-content/uploads/2012/03/palydemo/index.html)

不用 object 或者 embed 标签插入就能完成 video 的播放，那要感谢 html5 和 css3 的强大功能了，详细了解：

> <http://webdesign.tutsplus.com/tutorials/site-elements/skin-orman-clarks-video-interface-using-jplayer-and-css>

现在我们就 **step by step** 的详细指导吧，大家千万不要嫌长哦，不敢兴趣的地方可以直接略过，主要是为了保持文章的完整性 O (∩\_∩)O：

## step1:HTML5 标记

````html
 
 
        <!--Meta tags-->
 
        <!--Title-->
 
        <!--Stylesheets-->
 
        <!--jQuery-->
```html
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
````

 
        &lt;!--[if lt IE 9]>

            

```html
<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
```

        &lt;![endif]-->

````

Step 2: 下载 jPlayer 插件
---------------------

插件地址： [jplayer.org]( jplayer.org)  
然后在 head 里面引用，当然是基于 Jquery 的插件

Step 3: Player 标记
-----------------

html 如下：

Update Required Here's a message which will appear if the video isn't supported. A Flash alternative can be used here if you fancy it.

Step 4: Controls 标记
-------------------

html 如下：

```html
<!--play and pause buttons-->
<a class="jp-play" tabindex="1" href="javascript:;">play</a>
<a class="jp-pause" tabindex="1" href="javascript:;">pause</a>
 
<!--progress bar-->
````

```html
<span class="time-sep">/</span>;
```

```html
<!--mute / unmute toggle-->
<a class="jp-mute" title="mute" tabindex="2" href="javascript:;">mute</a>
<a class="jp-unmute" title="unmute" tabindex="2" href="javascript:;">unmute</a>
 
<!--volume bar-->
```

```html
<!--full screen toggle-->
<a class="jp-full-screen" title="full screen" tabindex="3" href="javascript:;">full screen</a>
<a class="jp-restore-screen" title="restore screen" tabindex="3" href="javascript:;">restore screen</a>
```

主要包含：  
播放，停止按钮  
进度条  
时间提醒  
静音切换  
卷栏  
全屏切换

## Step 5: 添加视频

jPlayer 插件目前支持以下视频格式:  
mp3  
mp4 (AAC/H.264)  
ogg (Vorbis/Theora)  
webm (Vorbis/VP8)  
wav  
使用代码如下：


<!-- {% endraw %} - for jekyll -->