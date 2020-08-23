---
title: 超级小的 web 手势库 AlloyFinger 发布
date: 2016-05-26
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/05/super-small-web-gesture-library-alloyfinger-released/
---

<!-- {% raw %} - for jekyll -->

简介  

=====

针对多点触控设备编程的 Web 手势组件，快速帮助你的 web 程序增加手势支持，也不用再担心 click 300ms 的延迟了。拥有两个版本，无依赖的独立版和 react 版本。除了 Dom 对象，也可监听 Canvas 内元素的手势（需要 Canvas 引擎内置对象支持 addEventListener 绑定 touch 相关事件）。

据不完全统计，目前 AlloyFinger 服务于：兴趣部落、QQ 群、QQ 动漫、腾讯学院、TEDxTencent、 AlloyTeam、腾讯 CDC 等多个部门、团队和项目。

功能清单  

=======

极小的文件大小  
简洁的 API 设计  
优秀的性能  
丰富的手势支持  
双版本（react 和独立版）

事件  

=====

支持 pinch 缩放  
支持 rotate 旋转  
支持 pressMove 拖拽  
支持 doubleTap 双击  
支持 swipe 滑动  
支持 longTap 长按  
支持 tap 按  
支持 singleTap 单击

快速上手  

=======

独立版使用方式:

```javascript
//element为需要监听手势的dom对象
new AlloyFinger(element, {
    pointStart: function () {
        //手指触摸屏幕触发
    },
    multipointStart: function () {
        //一个手指以上触摸屏幕触发
    },
    rotate: function (evt) {
        //evt.angle代表两个手指旋转的角度
        console.log(evt.angle);
    },
    pinch: function (evt) {
        //evt.scale代表两个手指缩放的比例
        console.log(evt.scale);
    },
    multipointEnd: function () {
        //当手指离开，屏幕只剩一个手指或零个手指触发
    },
    pressMove: function (evt) {
        //evt.deltaX和evt.deltaY代表在屏幕上移动的距离
        console.log(evt.deltaX);
        console.log(evt.deltaY);
    },
    tap: function (evt) {
        //点按触发
    },
    doubleTap: function (evt) {
        //双击屏幕触发
    
```


<!-- {% endraw %} - for jekyll -->