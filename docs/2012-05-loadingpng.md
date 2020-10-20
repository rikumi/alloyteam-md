---
title: 用纯 CSS3 制作透明 loading 图片，你值得拥有！！！
date: 2012-05-04
author: TAT.sheran
source_link: http://www.alloyteam.com/2012/05/loadingpng/
---

<!-- {% raw %} - for jekyll -->

## 你是否遇到过这样的情景：

1、用 gif 格式的 loading 菊花会有背景颜色，与页面背景格格不入  
2、于是，设计师给你一帧一帧变化的透明 png 合图，你能想到的就是用 JS 来控制  
3、最终，你会发现用 JS 控制的 loading 菊花，对网页性能有一定的影响

        好在现在，这个 HTML5 到来的时代，如果你不用考虑浏览器兼容问题，你就可以用 CSS3 轻轻松松实现透明 loading 菊花的加载效果，下面的**Step By Step** 会让你茅塞顿开：

## step1: 准备图片

首先，我们需要准备类似下面的 png 合图一张，如下：

[![](http://www.alloyteam.com/wp-content/uploads/2012/05/loading-300x37.png "loading")](http://www.alloyteam.com/wp-content/uploads/2012/05/loading.png)

上面图片只是类似，你可以根据自己的喜好设计图片的表现方式，但是每帧的效果要尽量不一样，这样才会有 loading 效果

## step2: 设置菊花样式

```css
.loading_css3 {
    display: block;
    position: absolute;
    z-index: 1;
    left: 50%;
    top: 50%;
    margin-top: -24px;
    margin-left: -24px;
    width: 48px;
    height: 48px;
    background: url(./loading.png) 0 0;
    -webkit-animation-duration: 500ms;                        //一个周期动画执行时间
    -webkit-animation-iteration-count: infinite;              //这里表示执行无限次，即菊花一直转
    -webkit-animation-timing-function: step-start;            //动画执行方式
    -webkit-animation-name: animate01;                        //指定要执行的动画的名称，见step3
}
```

## step3: 加入 CSS3 动画样式

```css
    @-webkit-keyframes animate01 {
	 0%		{ background-position:  0px 0; }
	 12.5%		{ background-position:48px 0; }
	 25%		{ background-position:96px 0; }
	 37.5%		{ background-position:144px 0; }
	 50%		{ background-position:192px 0; }
	 62.5%		{ background-position:240px 0; }
	 75%		{ background-position:288px 0; }
	 87.5%		{ background-position:336px 0; }
	 100%		{ background-position:384px 0; }
    }
```

keyframes : 定义一系列关键帧的样式区别，用来作为移动到下一个关键帧的动画，类似 flash 里面对动画的出理

## step4: 最后放入一个容器中

```css
    .wrapper{
	width:200px;
	height:200px;
	border:3px solid #808080;
	border-radius:5px;
        position: relative;
    }
```

```html
<div class="wrapper">
             <div class="loading_css3"></div>
        
</div>;
```

O(∩\_∩) O 哈哈～～就这样我们的 loading 菊花就顺利完成了，如果想在 Firefox 上使用，只需把 - webkit - 前缀改成 - moz - 即可，最终效果如下：

\[点击我查看 demo  

## ](<http://www.alloyteam.com/wp-content/uploads/2012/05/index.html>)

PS：如果你用不支持 CSS3 动画属性的浏览器来打开这个 demo，恐怕你要失望了～(\*^\_\_^\*) 嘻嘻……


<!-- {% endraw %} - for jekyll -->