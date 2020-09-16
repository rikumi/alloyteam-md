---
title: react 动画难写？试试 react 版 transformjs
date: 2016-12-20
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/12/react-animations-difficult-to-write-try-react-transformjs/
---

<!-- {% raw %} - for jekyll -->

简介  

* * *

[transformjs](http://alloyteam.github.io/AlloyTouch/transformjs/) 在非 react 领域用得风生水起，那么 react 技术栈的同学能用上吗？答案是可以的。junexie 童鞋已经造了个 [react 版本](https://github.com/AlloyTeam/AlloyTouch/blob/master/transformjs/react/transform.react.js)。

动画实现方式  

* * *

**传统 web 动画的两种方式**：

1.  纯粹的 CSS3 ：如：transition/animation+transform（大名鼎鼎的 animate.css）
2.  JS + CSS3 transition 或者 animation：这里第一种一样，只是通过 js 里 add class 和 remove class 去增加或者移除对应的动画
3.  纯粹 JS 控制时间轴：第一和第二种都是自带时间轴，使用 setInterval /setTimeout/requestAnimationFrame 不断地修改 DOM 的 style 属性产生动画

**对应在 react 中**：

使用 CSS3

-   使用 ReactCSSTransitionGroup 来实现
-   相关动画的 class 都有对应的 state，修改 state 相当于增加或者移除 class，也就相当于 js 里 add class 和 remove class 去增加或者移除对应的动画

纯粹 JS 控制时间轴

-   仍然使用 setInterval /setTimeout/requestAnimationFrame，修改某个 state 值，然后映射到 component 的 style 上。

这里很明显，方案 1 和方案 2 可应对简单场景（如没有 prop change 回调等），方案 3 可编程性最大，最灵活，可以适合复杂的动画场景或者承受复杂的交互场景。

安装  

* * *

    npm install css3transform-react

API  

* * *

```html
//set "translateX", "translateY", "translateZ", "scaleX", "scaleY", "scaleZ", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "originX", "originY", "originZ"
render() {
    return (
        <Transform
          translateX={100}
          scaleX={0.5}
          originX={0.5}>
          <div>sth</div>
        </Transform>
    );
}
 
// you can also use other porps, such as "className" or "style"
render() {
    return (
        <Transform
          translateX={100}
          className="ani"
          style={{width: '100px', background: 'red'}}
          <div>sth</div>
        </Transform>
    );
}
```

通过上面的声明，就可以设置或者读取 "translateX", "translateY", "translateZ", "scaleX", "scaleY", "scaleZ", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "originX", "originY", "originZ"！

方便吧！

使用姿势  

* * *


<!-- {% endraw %} - for jekyll -->