---
title: 移动 Web 触摸与运动解决方案 AlloyTouch 开源啦
date: 2016-12-06
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/12/mobile-web-touch-and-motion-solutions-alloytouch-open-source/
---

<!-- {% raw %} - for jekyll -->

传送门  

* * *

Github 地址：<https://github.com/AlloyTeam/AlloyTouch>

简介  

* * *

AlloyTouch 的本质是运动一个数字，把数字的物理变化映射到你想映射的任何属性上。所以带来了广泛的应用场景。不论实在应用、游戏、操作系统等许多层面，监听用户触摸，给用户真实的运动反馈是很常见的应用场景。如王者荣耀里，旋转用户角色，抽奖程序滚动转盘、页面滚动、局部滚动等。

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161205114323788-1224574900.png)

上面的那些场景，都会使用到下面三种过程之一：

-   触摸、运动、减速、停止
-   触摸、运动、减速、回弹、停止
-   触摸、回弹、停止

上面的运动可以是任何形式，如旋转、平移、zoom 等运动形式。当然，在上面过程执行的过程中，如果有其他用户交互介入，会停止当前的过程，继而反馈用户新的触摸手势。AlloyTouch 正是为了解决这类问题而生。同时做到了:

-   极小的文件大小（不到 300 行代码）
-   与页面布局无关
-   运动属性无关，能运动对象字量（如 ｛x:100｝）
-   渲染无关的设计（dom、canvas、webgl、svg 都能使用）
-   真实的物理运动轨迹
-   高效的运动方式
-   极简的 API 设计

安装  

* * *

    npm install alloytouch

使用姿势  

* * *

```javascript
new AlloyTouch({
    touch: "#wrapper", //反馈触摸的dom
    target: target, //运动的对象
    property: "translateY", //被运动的属性
    min: 100, //不必需,运动属性的最小值,越界会回弹
    max: 2000, //不必需,滚动属性的最大值,越界会回弹
    vertical: true, //不必需，默认是true代表监听竖直方向touch
    sensitivity: 1, //不必需,触摸区域的灵敏度，默认值为1，可以为负数
    factor: 1, //不必需,表示触摸位移与被运动属性映射关系，默认值是1
    step: 45, //不必需，用于校正到step的整数倍
    change: function () {}, //不必需，属性改变的回调。alloytouch.css版本不支持该事件
    touchStart: function (value) {},
    touchMove: function (value) {},
    touchEnd: function (value) {},
    animationEnd: function (value) {}, //运动结束
});
```

比如上面是运动 target 的 translateY 属性，必须要 target 拥有 translateY 属性才能正常工作。  
你可以使用 [transformjs](https://github.com/AlloyTeam/AlloyTouch/tree/master/transformjs) 赋予 dom 的快速 tranformation 能力。所以一般需要 AlloyTouch dom 元素的话，可以：

```javascript
var target = document.querySelector("#scroller");
//给element注入transform属性
Transform(target,true);
 
new AlloyTouch({
...
...
```

功能演示  

* * *

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161205114328741-786760499.gif)

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161205114325007-1308347874.gif)

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161205114324726-1195541813.gif)

在线 Demo  

* * *

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161205114347616-90910942.png)

开始 AlloyTouch 吧  

* * *

Github 地址：<https://github.com/AlloyTeam/AlloyTouch>  
欢迎 issues:<https://github.com/AlloyTeam/AlloyTouch/issues>  
我们会在第一时间响应你的意见和建议。  


<!-- {% endraw %} - for jekyll -->