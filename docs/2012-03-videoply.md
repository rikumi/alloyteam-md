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

```html
 
 
        &lt;!--Meta tags-->
 
        &lt;!--Title-->
 
        &lt;!--Stylesheets-->
 
        &lt;!--jQuery-->&lt;script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js">&lt;/script>
 
        &lt;!--[if lt IE 9]>
            &lt;script src="http://html5shim.googlecode.com/svn/trunk/html5.js">&lt;/script>
        &lt;![endif]-->
```

## Step 2: 下载 jPlayer 插件

插件地址： [jplayer.org](http://www.alloyteam.com/2012/03/videoply/jplayer.org)  
然后在 head 里面引用，当然是基于 Jquery 的插件

## Step 3: Player 标记

html 如下：

Update Required Here's a message which will appear if the video isn't supported. A Flash alternative can be used here if you fancy it.

## Step 4: Controls 标记

html 如下：

```html
&lt;!--play and pause buttons-->
&lt;a class="jp-play" tabindex="1" href="javascript:;">play&lt;/a>
&lt;a class="jp-pause" tabindex="1" href="javascript:;">pause&lt;/a>
 
&lt;!--progress bar-->
```

```html
&lt;span class="time-sep">/&lt;/span>;
```

```html
&lt;!--mute / unmute toggle-->
&lt;a class="jp-mute" title="mute" tabindex="2" href="javascript:;">mute&lt;/a>
&lt;a class="jp-unmute" title="unmute" tabindex="2" href="javascript:;">unmute&lt;/a>
 
&lt;!--volume bar-->
```

```html
&lt;!--full screen toggle-->
&lt;a class="jp-full-screen" title="full screen" tabindex="3" href="javascript:;">full screen&lt;/a>
&lt;a class="jp-restore-screen" title="restore screen" tabindex="3" href="javascript:;">restore screen&lt;/a>
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

```html
&lt;!--instantiate-->&lt;script type="text/javascript">// &lt;![CDATA[
$(document).ready(function(){
 
    $("#jquery_jplayer_1").jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                m4v: "mi4.m4v",
                ogv: "mi4.ogv",
                webmv: "mi4.webm",
                poster: "mi4.png"
            });
        },
        swfPath: "js",
        supplied: "webmv, ogv, m4v",
        size: {
            width: "570px",
            height: "340px",
            cssClass: "jp-video-360p"
        }
    });
 
});
// ]]>&lt;/script>
```

更多使用方法见：[jplayer.org](http://www.alloyteam.com/2012/03/videoply/jplayer.org)

## Step 6: Video 基本样式

css 代码如下:

```css
html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,and,address,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video,input,textarea,select{background:transparent;border:0;font-size:100%;margin:0;outline:0;padding:0;vertical-align:baseline}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}abbr[title],dfn[title]{border-bottom:1px dotted;cursor:help}blockquote,q{quotes:none}blockquote:before,blockquote:after,q:before,q:after{content:none}del{text-decoration:line-through}hr{background:transparent;border:0;clear:both;color:transparent;height:1px;margin:0;padding:0}mark{background-color:#ffffb3;font-style:italic}input,select{vertical-align:middle}ins{background-color:red;color:white;text-decoration:none}ol,ul{list-style:none}table{border-collapse:collapse;border-spacing:0}a{text-decoration:none;}
 
body {
    margin:0;
    padding:0;
    background:url("bg.jpg") repeat;
}
 
.jp-video {
    font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;
    position:relative;
 
    -webkit-box-shadow:0px 0px 20px rgba(0,0,0,.3);
    -moz-box-shadow:0px 0px 20px rgba(0,0,0,.3);
    box-shadow:0px 0px 20px rgba(0,0,0,.3);
}
.jp-video-360p {
    width:570px;
    margin: 100px auto;
}
.jp-video-full {
    width:480px;
    height:270px;
    position:static !important;
    position:relative
}
.jp-video-full .jp-jplayer {
    top: 0;
    left: 0;
    position: fixed !important; position: relative; /* Rules for IE6 (full-screen) */
    overflow: hidden;
    z-index:1000;
}
 
.jp-video-full .jp-gui {
    position: fixed !important; position: static; /* Rules for IE6 (full-screen) */
    top: 0;
    left: 0;
    width:100%;
    height:100%;
    z-index:1000;
}
.jp-video-full .jp-interface {
    position: absolute !important; position: relative; /* Rules for IE6 (full-screen) */
    bottom: 0;
    left: 0;
    z-index:1000;
}
```

## Step 7: 基本控制样式

css 样式如下：

```css
.jp-interface {
    position: relative;
    width:100%;
    height: 35px;
 
    background-image: -webkit-linear-gradient(top, rgb(242, 242, 242), rgb(209, 209, 209));
    background-image: -moz-linear-gradient(top, rgb(242, 242, 242), rgb(209, 209, 209));
    background-image: -o-linear-gradient(top, rgb(242, 242, 242), rgb(209, 209, 209));
    background-image: -ms-linear-gradient(top, rgb(242, 242, 242), rgb(209, 209, 209));
    background-image: linear-gradient(top, rgb(242, 242, 242), rgb(209, 209, 209));
    filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0,StartColorStr='#f2f2f2', EndColorStr='#d1d1d1');
 
    -webkit-box-shadow:
        inset 0px 1px 0px #f7f7f7,
        inset 0px -1px 0px #e2e2e2;
    -moz-box-shadow:
        inset 0px 1px 0px #f7f7f7,
        inset 0px -1px 0px #e2e2e2;
    box-shadow:
        inset 0px 1px 0px #f7f7f7,
        inset 0px -1px 0px #e2e2e2;
}
 
div.jp-controls-holder {
    clear: both;
    width:570px;
    margin: 0 auto;
 
    position: relative;
    overflow:hidden;
}
```

## Step 8: 停止播放按钮

css 样式如下：

```css
a.jp-play,
a.jp-pause {
    width:40px;
    height:35px;
    float:left;
    text-indent:-9999px;
    outline:none;
}
 
a.jp-play {
    background: url("sprite.png") 0 0 no-repeat;
}
 
a.jp-pause {
    background: url("sprite.png") -40px 0 no-repeat;
    display: none;
}
 
.separator {
    background-image:url("separator.png");
    background-repeat:no-repeat;
    width: 2px;
    height: 35px;
    float:left;
    margin-top: 7px;
    margin-right: 10px;
}
```

## Step 9: 进度条样式

css 样式如下：

```css
.jp-progress {
    background: #706d6d;
 
    -webkit-border-radius:5px;
    -moz-border-radius:5px;
    border-radius:5px;
 
    -webkit-box-shadow:
        inset 0px 1px 4px rgba(0,0,0,.4),
        0px 1px 0px rgba(255,255,255,.4);
    -moz-box-shadow:
        inset 0px 1px 4px rgba(0,0,0,.4),
        0px 1px 0px rgba(255,255,255,.4);
    box-shadow:
        inset 0px 1px 4px rgba(0,0,0,.4),
        0px 1px 0px rgba(255,255,255,.4);
 
    width:280px;
    height:10px;
    float:left;
    margin-top: 13px;
}
 
.jp-seek-bar {
    width:0px;
    height:100%;
    cursor: pointer;
}
 
.jp-seeking-bg {
    background:#575555;
    -webkit-border-radius:5px;
    -moz-border-radius:5px;
    border-radius:5px;
}
 
.jp-play-bar {
    background: url("play-bar.png") left repeat-x;
    width:0px;
    height:10px;
    position:relative;
    z-index: 9999;
 
    -webkit-border-radius:5px;
    -moz-border-radius:5px;
    border-radius:5px;
}
 
.jp-play-bar span {
    position:absolute;
    top: -3px;
    right: -12px;
 
    background:url("handle.png") no-repeat center;
    width: 16px;
    height: 17px;
}
```

## Step 10: 当前时间 / 持续时间的 css 样式

css 样式如下：

```css
.jp-current-time,
.jp-duration {
    font-size:11px;
    font-family:Arial;
    color:#444444;
    margin-top: 12px;
    float:left;
}
.jp-current-time {
    float: left;
    display:inline;
}
.jp-duration {
    float: left;
    display:inline;
    text-align: right;
}
.jp-video .jp-current-time {
    margin-left:10px;
}
.jp-video .jp-duration {
    margin-right:10px;
}
.time-sep {
    float:left;
    margin: 13px 3px 0 3px;
 
    font-size:11px;
    font-family:Arial;
    color:#444444;
}
```

## 第 11 步：卷按钮和栏

css 样式如下：

```css
.jp-video a.jp-mute,
.jp-video a.jp-unmute {
    text-indent:-9999px;
    float:left;
 
    height: 35px;
    outline:none;
}
 
.jp-mute {
    float:left;
    background: url(../images/sprite.png) -80px 0 no-repeat;
    margin-top: 1px;
    margin-left: -10px;
    width: 35px;
}
 
a.jp-unmute {
    background: url(../images/sprite.png) -115px 0 no-repeat;
    margin-top: 1px;
    margin-left: -13px;
    display: none;
    width: 38px;
}
 
.jp-volume-bar {
    float:left;
    margin-top: 13px;
    margin-right: 10px;
    overflow:hidden;
    width:70px;
    height:10px;
    cursor: pointer;
 
    background: #706d6d;
 
    -webkit-border-radius:5px;
    -moz-border-radius:5px;
    border-radius:5px;
 
    -webkit-box-shadow:
        inset 0px 1px 4px rgba(0,0,0,.4),
        0px 1px 0px rgba(255,255,255,.4);
    -moz-box-shadow:
        inset 0px 1px 4px rgba(0,0,0,.4),
        0px 1px 0px rgba(255,255,255,.4);
    box-shadow:
        inset 0px 1px 4px rgba(0,0,0,.4),
        0px 1px 0px rgba(255,255,255,.4);
}
 
.jp-volume-bar-value {
    background: transparent;
    width:0px;
    height:10px;
    position: relative;
}
 
.jp-volume-bar-value span {
    position:absolute;
    top: 0px;
    right: 0px;
 
    background:url(../images/volume.png) no-repeat center;
    width: 11px;
    height: 10px;
}
```

## 第 12 步： 全屏按钮

CSS 样式如下：

```css
.jp-full-screen {
    background: url(../images/sprite.png) -150px 0 no-repeat;
    float:left;
    width: 40px;
    height: 35px;
    text-indent:-9999px;
    margin-left: -15px;
    outline:none;
}
 
.jp-restore-screen {
    background: url(../images/sprite.png) -150px 0 no-repeat;
    float:left;
    width: 40px;
    height: 35px;
    text-indent:-9999px;
    margin-left: -15px;
    outline:none;
}
```

哈哈，到这里我们的 video player 就完成了，是不是代码很多，看得头大，其实不用那么紧张，我们只需要看关键地方就行了，比如说，了解那个 player 是如何使用的，还有具体的界面也有对应的 CSS 注释，关键是这些代码可以单独提取出来复用，仅供给大家自制播放器的时候提供一个参考，感谢伟大的 coder 的默默无闻奉献，上帝会一直眷顾你们的，阿门～～～


<!-- {% endraw %} - for jekyll -->