---
title: 完美的自定义滚动条
date: 2012-05-14
author: TAT.melody
source_link: http://www.alloyteam.com/2012/05/perfect-custom-scrollbar/
---

<!-- {% raw %} - for jekyll -->

今天写了一个滚动条 UI 组件。欢迎大家体验：<http://alloyteam.github.com/ui/>

为何称之为完美呢？只因其具有以下优点：

1.  兼容所有浏览器。
2.  支持所有鼠标事件，包括长按。
3.  样式可以完全自定义。
4.  使用该组件无需改动原来的任何代码，也不要求原来的元素使用什么定位方式。
5.  只需引进一两个 js 文件，再添加一句代码即可。

下面讲核心部分。

## 首先关于鼠标长按事件，使用 setInterval 的方式

这里关键在于什么时候清楚定时器。首先，鼠标弹起时候要清除；第二种情况是不满足条件时要清除。下面把鼠标按在滚动槽中的鼠标响应事件的代码贴出来，以供参考：

```javascript
slider.onmousedown=function(e){
  e=e||event;
  var id;
  var mouseY=e.clientY;
  function isUp(){
    var rect=context.cube.getBoundingClientRect();
    var y=rect.top;
    if(y>mouseY){
       up();
       id||(id=setInterval(function(){isUp(y);},100));
       return true;
    }
    else{
       id&&clearInterval(id);
       id=0;
       return false;
    }
  }
  function isDown(){
    var rect=context.cube.getBoundingClientRect();
    var y=rect.top;
    if(rect.bottom<mouseY){
      down();
      id||(id=setInterval(function(){isDown(y)},100));
      return true;
    }
    else{
      id&&clearInterval(id);
      id=0;
      return false;
```


<!-- {% endraw %} - for jekyll -->