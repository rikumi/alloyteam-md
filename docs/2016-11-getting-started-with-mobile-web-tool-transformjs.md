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

```javascript
var position = { x: 100, y: 100, rotation: 0 },
    target = document.getElementById("target");
new TWEEN.Tween(position)
    .to({ x: 700, y: 200, rotation: 359 }, 2000)
    .delay(1000)
    .easing(TWEEN.Easing.Elastic.InOut)
    .onUpdate(function update() {
        var t_str =
            "translateX(" +
            position.x +
            "px) translateY(" +
            position.y +
            "px) rotate(" +
            Math.floor(position.rotation) +
            "deg)";
        element.style.transform = element.style.msTransform = element.style.OTransform = element.style.MozTransform = element.style.webkitTransform = t_str;
    });
```

使用字符串的方式，看着就心累。更别提写的过程要遭受多少折磨。

animate.css 姿势:

```css
@keyframes pulse {
  from {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
 
  50% {
    -webkit-transform: scale3d(1.05, 1.05, 1.05);
    transform: scale3d(1.05, 1.05, 1.05);
  }
 
  to {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}
```

animate.css 封装了一大堆关键帧动画，开发者只需要关心添加或者移除相关的动画的 class 便可以。这一定程度上给交互特效带来了极大的遍历，但是要有硬伤：

-   可编程性不够高
-   适用于简单场景
-   没有 change 回调，只有 end 回调

不方便  

* * *

transform 的旋转点基准点默认是在中心，但是有些是时候，不系统在中心，我们传统的做法是使用 transform-origin 来设置基准点。  
![](http://images2015.cnblogs.com/blog/105416/201611/105416-20161125110501581-412990102.png)

注意，是另一个属性 transform-origin，而不是 transform。但是如果需要运动 transform-origin 呢？这种设计是不是就废了？有没有需要运动 origin 的场景？这个在游戏设计中是经常会使用的到，这个以后另外单独开篇再说，事实就是，有场景是需要运动 origin 来达到某种效果。

transformjs  

* * *

基于上面种种不便，所以有了 transformjs！

-   transformjs 作为腾讯 AlloyTeam 移动开发利器之一，广泛应用于手 Q Web、微信 Web 相关业务开发
-   transformjs 专注于 CSS3 transform 读取和设置的一个超轻量级 js 库，大大提高了 CSS3 transform 的可编程性
-   transformjs 高度抽象，不与任何时间、运动框架捆绑，所以可以和任意时间、和运动框架轻松搭配使用
-   transformjs 使用 matrix3d 为最终输出给 dom 对象，硬件加速的同时，不失去可编程性
-   transformjs 拥有超级易用的 API，一分钟轻松上手，二分钟嵌入真实项目实战
-   transformjs 扩展了 transform 本身的能力，让 transform origin 更加方便

开始使用吧：  
官方网站：<http://alloyteam.github.io/AlloyTouch/transformjs/>  
Github 地址：<https://github.com/AlloyTeam/AlloyTouch/tree/master/transformjs>


<!-- {% endraw %} - for jekyll -->