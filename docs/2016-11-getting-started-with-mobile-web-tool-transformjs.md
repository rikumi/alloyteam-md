---
title: 移动 Web 利器 transformjs 入门
date: 2016-11-28
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/11/getting-started-with-mobile-web-tool-transformjs/
---

<!-- {% raw %} - for jekyll -->

简介  

* * *

在过去的两年，越来越多的同事、朋友和其他不认识的童鞋进行移动 web 开发的时候，都使用了 [transformjs](https://github.com/AlloyTeam/AlloyTouch/tree/master/transformjs)，所有必要介绍一下，让更多的人受益，提高编程效率，并享受编程乐趣。（当然 transformjs 不仅仅支持移动设备，[支持 CSS3 3D Transforms 的浏览器](http://caniuse.com/#search=CSS3%203D)都能正常使用 transformjs）

传送门  

* * *

官方网站：<http://alloyteam.github.io/AlloyTouch/transformjs/>  
Github 地址：<https://github.com/AlloyTeam/AlloyTouch/tree/master/transformjs>

安装  

* * *

    npm install css3transform

API  

* * *

    Transform(domElement, [notPerspective]);

通过上面一行代码的调用，就可以设置或者读取 domElement 的 "translateX", "translateY", "translateZ", "scaleX", "scaleY", "scaleZ", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "originX", "originY", "originZ"！

方便吧！

使用姿势  

* * *

```javascript
Transform(domElement); //or Transform(domElement, true);
//set "translateX", "translateY", "translateZ", "scaleX", "scaleY", "scaleZ", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "originX", "originY", "originZ"
domElement.translateX = 100;
domElement.scaleX = 0.5;
domElement.originX = 50;
//get "translateX", "translateY", "translateZ", "scaleX", "scaleY", "scaleZ", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "originX", "originY", "originZ"
console.log(domElement.translateX);
```

传统的 CSS3 编程的问题  

* * *

以前，我们一般使用 animate.css、zepto/jQuery 的 animate 方法或者 tween.js+css3 进行交互特效编程。总结下来有三个缺点：

-   不直观
-   不直接
-   不方便

### 不直观

看下面这张图：  
![](http://images2015.cnblogs.com/blog/105416/201611/105416-20161125110517471-588991382.png)

顺序影响结果，不直观。那么为什么会是这个结果？可以通过 new WebKitCSSMatrix (transform_str) 对比最终的 matrix。  
![](http://images2015.cnblogs.com/blog/105416/201611/105416-20161125110527206-832361505.png)

这也直接说明了矩阵不符合交换律。A_B!=B_A

不直接  

* * *

zepto 姿势：

    $("#some_element").animate({
      opacity: 0.25, left: '50px',
      color: '#abcdef',
      rotateZ: '45deg', translate3d: '0,10px,0'
    }, 500, 'ease-out')

translate3d: '0,10px,0' 非常不方便，无法 step 递进递减控制。更别提配合一些运动或者时间的库来编程了。可能你会反驳 'ease-out' 不就可以实现缓动吗？但是如果我需要让 x 和 y 以及 z 分别对应不同的缓动函数，这种基于字符串编程的形式就费劲了～～  
这里还需要注意的是，zepto 里的顺序也会影响结果。因为其最后也是拼成 string 赋给 dom 元素。

tween.js 姿势


<!-- {% endraw %} - for jekyll -->