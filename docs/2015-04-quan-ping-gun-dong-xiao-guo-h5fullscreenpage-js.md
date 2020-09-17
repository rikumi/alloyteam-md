---
title: 全屏滚动效果 H5FullscreenPage.js
date: 2015-04-21
author: TAT.tennylv
source_link: http://www.alloyteam.com/2015/04/quan-ping-gun-dong-xiao-guo-h5fullscreenpage-js/
---

<!-- {% raw %} - for jekyll -->

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
            }
             //抓取时的所在位置
            dragStart = event.clientY;
 
         }
          
         function touchMove (event) {
            
            if (dragStart === null) return;
 
            if (event.touches) {
                event = event.touches[0];
```


<!-- {% endraw %} - for jekyll -->