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
        &lt;Transform
          translateX={100}
          scaleX={0.5}
          originX={0.5}>
          &lt;div>sth&lt;/div>
        &lt;/Transform>
    );
}
 
// you can also use other porps, such as "className" or "style"
render() {
    return (
        &lt;Transform
          translateX={100}
          className="ani"
          style={{width: '100px', background: 'red'}}
          &lt;div>sth&lt;/div>
        &lt;/Transform>
    );
}
```

通过上面的声明，就可以设置或者读取 "translateX", "translateY", "translateZ", "scaleX", "scaleY", "scaleZ", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "originX", "originY", "originZ"！

方便吧！

使用姿势  

* * *

```javascript
import React, { Component } from "react";
import { render } from "react-dom";
import Transform from "../../transform.react.js";
class Root extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            el1: { rotateZ: 0 },
            el2: { rotateY: 0 },
        };
        this.animate = this.animate.bind(this);
    }
    animate() {
        this.setState(
            {
                el1: { rotateZ: this.state.el1.rotateZ + 1 },
                el2: { rotateY: this.state.el2.rotateY + 1 },
            },
            () => {
                requestAnimationFrame(this.animate);
            }
        );
    }
    componentDidMount() {
        setTimeout(this.animate, 500);
    }
    render() {
        return (
            &lt;div>
                        
                &lt;Transform
                    rotateZ={this.state.el1.rotateZ}
                    className="test"
                    style={{ backgroundColor: "green" }}
                >
                              transformjs         
                &lt;/Transform>
                          
                &lt;Transform
                    rotateY={this.state.el2.rotateY}
                    className="test"
                    style={{ backgroundColor: "red", left: "200px" }}
                >
                              transformjs         
                &lt;/Transform>
                        
            &lt;/div>
        );
    }
}
render(&lt;Root />, document.getElementById("root"));
```

更加复杂的详细的使用代码可以看这里：<https://github.com/AlloyTeam/AlloyTouch/blob/master/transformjs/react/example/src/index.jsx>

在线演示  

* * *

<http://alloyteam.github.io/AlloyTouch/transformjs/react/example/>

性能对比  

* * *

因为 react 版本会有 diff 过程，然后 apply diff to dom 的过程，state 改变不会整个 innerHTML 全部替换，所以对浏览器渲染来说还是很便宜，但是在 js 里 diff 的过程的耗时还是需要去 profiles 一把，如果耗时严重，不在 webworker 里跑还是会卡住 UI 线程导致卡顿，交互延缓等。所以要看一看 CPU 的耗时还是很有必要的。  
主要是那上面的演示和传统的[直接操作 dom 的方式](http://alloyteam.github.io/AlloyTouch/transformjs/example/all.html)对比。就是下面这种传统的方式：

```javascript
var element1 = document.querySelector("#test1");
Transform(element1);
...
...
function animate() {
    element1.rotateZ++;
    ...
    requestAnimationFrame(animate);
}
 
animate();
```

对两种方式使用 chrome profiles 了一把。  
**先看总耗时对比**：

react：  
![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161219093619916-74108507.png)

传统方式：  
![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161219093636291-1750787495.png)

-   react 在 8739 秒内 CPU 耗时花费了近似 **1686ms**
-   传统方式在 9254ms 秒内 CPU 耗时花费近似 **700ms**

在不进行 profiles 就能想象到 react 是一定会更慢一些，因为 state 的改变要走把 react 生命周期走一遍，但是可以看到 react 的耗时还是在可以接受的范围。但是，我们还是希望找到拖慢的函数来。  
那么在使用 transformjs react 版本中，哪个函数拖了后腿？展开 profiles tree 可以看到：

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161219093641494-1359005044.png)

就是它了。

```ruby
/**
       * Reconciles the properties by detecting differences in property values and
       * updating the DOM as necessary. This function is probably the single most
       * critical path for performance optimization.
       *
       * TODO: Benchmark whether checking for changed values in memory actually
       *       improves performance (especially statically positioned elements).
       * TODO: Benchmark the effects of putting this at the top since 99% of props
       *       do not change for a given reconciliation.
       * TODO: Benchmark areas that can be improved with caching.
       *
       * @private
       * @param {object} lastProps
       * @param {object} nextProps
       * @param {?DOMElement} node
       */
      _updateDOMProperties: function (lastProps, nextProps, transaction) {
```

打开对应的代码可以看到。注释里已经写了这是优化重点。

开始使用吧  

* * *

官方网站：<http://alloyteam.github.io/AlloyTouch/transformjs/>

Github 地址：<https://github.com/AlloyTeam/AlloyTouch/tree/master/transformjs>  
任何问题和意见欢迎 [new issue](https://github.com/AlloyTeam/AlloyTouch/issues) 给我们。  



<!-- {% endraw %} - for jekyll -->