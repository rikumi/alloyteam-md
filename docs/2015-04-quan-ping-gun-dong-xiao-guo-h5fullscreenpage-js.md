---
title: 全屏滚动效果 H5FullscreenPage.js
date: 2015-04-21
author: TAT.tennylv
source_link: http://www.alloyteam.com/2015/04/quan-ping-gun-dong-xiao-guo-h5fullscreenpage-js/
---

**前提：**

介于现在很多活动都使用了 类似全屏滚动效果 尤其在微信里面 我自己开发了一个快速构建 此类项目的控件 与市面上大部分控件不同的是此控件还支持元素的动画效果 并提供多种元素效果 基于 zepto.js 

功能清单:

1 快速实现页面全屏滚动效果。并提供多种翻页效果，兼容大部分 ios 和 android 系统。  

2 支持在页面中添加多种动画元素效果 来实现淡入，滑入等效果。  

3 支持配置音乐功能。  

4 支持摇一摇接口功能。

**组件核心代码原理：**

**1 页面滚动**

  在移动页面上如果想使用滚动，如过没有任何动画效果，那么肯定大家首先想到的就是用滚动条来滚动，但这样的滚动比较单调，实现动画效果比较困难，于是就想出了利用 css3 和 div 的绝对定位来实现。

```html
<body>
      <div class="item item1">               </div>
      <div class="item item2">               </div>
      <div class="item item3">               </div>
</body>;
```

然后给每个 div 设置绝对定位样式

```css
 .item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-position: center;
}
```

这样页面上的每个 div 都相当于一个页面 只不过重叠了而已，接下来就要利用 javascript 和 css 让这些页面可以滚动 (利用 touch 时间改变 div 的 transform 来实现滚动)

```javascript
function touchStart(event) {
    if (dragStart !== null) return;
    if (event.touches) {
        event = event.touches[0];
    } //抓取时的所在位置
    dragStart = event.clientY;
}
function touchMove(event) {
    if (dragStart === null) return;
    if (event.touches) {
        event = event.touches[0];
    } //得到抓取开始时于进行中的差值的百分比
    percentage = (dragStart - event.clientY) / window.screen.height; //和屏幕高度做比较
    if (percentage > 0) {
        // //向上拖动
        var translateY = 1 - 0.4 * percentage; //位置系数，可以微调
        $(event.target)
            .next()
            .css("-webkit-transform", "translateY(" + translateY * 100 + "%)"); //下一个item上移动
    } else {
        //向下拖动
        var translateY = -(0.4 * percentage);
        $(event.target).css(
            "-webkit-transform",
            "translateY(" + translateY * 100 + "%)"
        ); //当前item下移动
    }
}
function touchEnd(event) {
    dragStart = null; //标志位值空 //抓取停止后，根据临界值做相应判断
    if (percentage >= dragThreshold) {
        //向下滚动
        $(event.target).css("-webkit-transform", "translateY(-100%)");
        $(event.target).next().css("-webkit-transform", "translateY(0)");
    } else if (Math.abs(percentage) >= dragThreshold) {
        //向上滚动
        $(event.target).css("-webkit-transform", "translateY(100%)");
    } else {
        //没有达到临界值 恢复原样
        $(event.target).next().css("-webkit-transform", "translateY(100%)");
    } //重置percentage
    percentage = 0;
}
```

这里有几点说明一下：

1) 使用 translate3d 来替换 translateY 可以开启硬件加速 在渲染上会好一些。

2) 在执行下一页或者上一页时  可以给 div 添加 css3 动画来使其滚动带有一定的动画效果，组件提供 8 中翻页效果。

**2 元素的淡入淡出：**

元素入场的动画效果主要是利用 css3 来实现

```css
.fadeIn {
        animation-name: fadeIn;
        -webkit-animation-name: fadeIn; 
 
        animation-duration: 1.5s;   
        -webkit-animation-duration: 1.5s;
 
        animation-timing-function: ease-in-out; 
        -webkit-animation-timing-function: ease-in-out;     
 
        
    }
@keyframes fadeIn {
        0% {
            transform: scale(0);
            opacity: 0.0;       
        }
        60% {
            transform: scale(1.1);  
        }
        80% {
            transform: scale(0.9);
            opacity: 1; 
        }   
        100% {
            transform: scale(1);
            opacity: 1; 
        }       
    }
 
    @-webkit-keyframes fadeIn {
        0% {
            -webkit-transform: scale(0);
            opacity: 0.0;       
        }
        60% {
            -webkit-transform: scale(1.1);
        }
        80% {
            -webkit-transform: scale(0.9);
            opacity: 1; 
        }   
        100% {
            -webkit-transform: scale(1);
            opacity: 1; 
        }       
    }
```

该元素首先是隐藏的，在页面滑入视窗时将其显示，就会应用上 css3 设定的动画效果，延伸出来不仅 fadeIn 效果，许多效果都可以设定，另外可以给元素添加 data-delay 属性来控制元素的执行顺序。

**组件使用方法：**

```javascript
{
    'type' : 1,//翻页的动画效果 共有8种可以使用
    'pageShow' : function(page){},
    'pageHide' : function(page){},
    'useShakeDevice' : {//是否使用手机摇一摇接口
        'speed' : 30,
        'callback' : function(page){}
    },
    'useParallax' : true,//是否使用parallax效果可参看demo第六页
    'useArrow' : true,//是否使用箭头
    'useAnimation' : true,//是否使用元素动画效果
    'useMusic' : {//是否使用音乐
        'autoPlay' : true,
        'loopPlay' : true,
        'src' : 'http://mat1.gtimg.com/news/2015/love/FadeAway.mp3'
    }
 };
```

几种效果的预览：

![](http://lvming6816077.github.io/H5FullscreenPage/images/h5scroll/2.gif)  ![](http://lvming6816077.github.io/H5FullscreenPage/images/h5scroll/3.gif)  ![](http://lvming6816077.github.io/H5FullscreenPage/images/h5scroll/4.gif)  ![](http://lvming6816077.github.io/H5FullscreenPage/images/h5scroll/5.gif)

**相关文档和说明：**

更详细的文档可以查看：<http://lvming6816077.github.io/H5FullscreenPage/>

后续会对这个组件增加一些新的功能 例如增加 canvas 涂抹元素和可拖拽元素等等，如果大家有好的建议也可以留言。