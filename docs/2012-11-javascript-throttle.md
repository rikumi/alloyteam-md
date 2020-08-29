---
title: 浅谈 javascript 的函数节流
date: 2012-11-02
author: TAT.老教授
source_link: http://www.alloyteam.com/2012/11/javascript-throttle/
---

<!-- {% raw %} - for jekyll -->

##  什么是函数节流？

介绍前，先说下背景。在前端开发中，有时会为页面绑定 resize 事件，或者为一个页面元素绑定拖拽事件（其核心就是绑定 mousemove），这种事件有一个特点，就是用户不必特地捣乱，他在一个正常的操作中，都有可能在一个短的时间内触发非常多次事件绑定程序。而大家知道，DOM 操作时很消耗性能的，这个时候，如果你为这些事件绑定一些操作 DOM 节点的操作的话，那就会引发大量的计算，在用户看来，页面可能就一时间没有响应，这个页面一下子变卡了变慢了。甚至在 IE 下，如果你绑定的 resize 事件进行较多 DOM 操作，其高频率可能直接就使得浏览器崩溃。

怎么解决？函数节流就是一种办法。话说第一次接触函数节流 (throttle)，还是在看 impress 源代码的时候，impress 在播放的时候，如果窗口大小发生改变 (resize)，它会对整体进行缩放 (scale)，使得每一帧都完整显示在屏幕上：

[![impress 在 resize 的时候自动适应](http://www.alloyteam.com/wp-content/uploads/2012/11/impress-300x188.jpg "impress")  
](http://www.alloyteam.com/wp-content/uploads/2012/11/impress.jpg)

稍微留心，你会发现，当你改变窗体大小的时候，不管你怎么拉，怎么拽，都没有立刻生效，而是在你改变完大小后的一会儿，它的内容才进行缩放适应。看了源代码，它用的就是函数节流的方法。

函数节流，简单地讲，就是让一个函数无法在很短的时间间隔内连续调用，只有当上一次函数执行后过了你规定的时间间隔，才能进行下一次该函数的调用。以 impress 上面的例子讲，就是让缩放内容的操作在你不断改变窗口大小的时候不会执行，只有你停下来一会儿，才会开始执行。

## 函数节流的原理

函数节流的原理挺简单的，估计大家都想到了，那就是定时器。当我触发一个时间时，先 setTimout 让这个事件延迟一会再执行，如果在这个时间间隔内又触发了事件，那我们就 clear 掉原来的定时器，再 setTimeout 一个新的定时器延迟一会执行，就这样。

## 代码实现

明白了原理，那就可以在代码里用上了，但每次都要手动去新建清除定时器毕竟麻烦，于是需要封装。在《JavaScript 高级程序设计》一书有介绍函数节流，里面封装了这样一个函数节流函数：

```javascript
 function throttle(method, context) {
     clearTimeout(methor.tId);
     method.tId = setTimeout(function(){
         method.call(context);
     }， 100);
 }
```

它把定时器 ID 存为函数的一个属性（= = 个人的世界观不喜欢这种写法）。而调用的时候就直接写

```javascript
window.onresize = function () {
    throttle(myFunc);
};
```

这样两次函数调用之间至少间隔 100ms。

而 impress 用的是另一个封装函数：

```javascript
var throttle = function (fn, delay) {
    var timer = null;
    return function () {
        var context = this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
};
```

它使用闭包的方法形成一个私有的作用域来存放定时器变量 timer。而调用方法为


<!-- {% endraw %} - for jekyll -->