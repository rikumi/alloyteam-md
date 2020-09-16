---
title: Web Animation API 从入门到上座
date: 2015-12-22
author: TAT.sheran
source_link: http://www.alloyteam.com/2015/12/web-animation-api-from-entry-to-the-top/
---

<!-- {% raw %} - for jekyll -->

  一、远观：认识 WAAPI  

* * *

当我们谈及网页动画时，自然联想到的是 CSS3 动画、JS 动画、SVG 动画、APNG 动画等技术以及 jQuery.animate () 等动画封装库，根据实际动画内容设计去选择不同的实现方式。然而，每个现行的动画技术都存在一定的缺点，如 CSS3 动画必须通过 JS 去获取动态改变的值，setInterval 的时间往往是不精确的而且还会卡顿，APNG 动画会带来文件体积较大的困扰，引入额外的动画封装库也并非对性能敏感的业务适用。目前情形对开发者而言，鱼和熊掌似乎不可兼得，既希望获得更强大便捷的动画控制能力，又希望性能和体验上足够流畅优雅，如果能有一种浏览器原生支持的通用的动画解决方案，那将是极好极好的呢。

W3C 提出 Web Animation API（简称 WAAPI）正缘于此，它致力于集合 CSS3 动画的性能、JavaScript 的灵活、动画库的丰富等各家所长，将尽可能多的动画控制由原生浏览器实现，并添加许多 CSS 不具备的变量、控制以及或调的选项。看起来一切都很棒，是不是以后我们在动画技术选型上可以一招鲜吃遍天了呢？接下来请跟我一起敲开 Web Animation API 的奇妙之门。

二、入门：从实例开始  

* * *

WAAPI 核心在于提供了

    Element.animate()

方法，下面看个最简单的例子：

    document.body.animate(
        [{'background': 'red'}, {'background': 'green'}, {'background': 'blue'}]
        , 3000);

使用 Chrome 39 以上的浏览器运行一下，页面背景色进行了红绿蓝的依次过渡，3s 后结束。我们当然是不会满足于这么简单的控制参数，继续看下个例子：

      var dot = document.querySelector('.dot');
      var frames = [
        {transform: 'rotate(0deg) translate(80px)'},
        {transform: 'rotate(360deg) translate(80px) '},
      ];
      var timing = {
        duration: 2500,         //ms
        delay: 0,               //ms
        iterations: Infinity,   //1, 2, 3 ... Infinity
        direction: 'alternate', //'normal', 'reverse'等
        easing: 'ease-in-out',  //'linear', 'ease-in'等
        fill: 'forwards',       //'backwards', 'both', 'none', 'auto'
      };
      dot.animate(frames, timing);

可以看到 DOM 节点具备全新的 animate 方法，第一个参数是关键帧数组 frames\[]，对应 CSS3 中的 @keyframes，每一帧的描述与 css3 极其类似；第二个参数是时间控制 timing，包括有 duration 持续时间、iterations 执行次数、direction 动画方向、easing 缓动函数等属性。是不是很像 CSS3 的语法，以上 timing 参数等同于：

```css
.dot {
  animation: frames 2500ms ease-in-out 0ms infinite alternate forwards;
}
```

效果如下所示：

    [![demo1](http://www.alloyteam.com/wp-content/uploads/2015/12/demo1.gif)](http://www.alloyteam.com/wp-content/uploads/2015/12/demo1.gif)

三、进院：细数 WAAPI 众妙  

* * *

### 动画回调与动画状态

在最初的例子中，我们可以定义一个对象来接收 Element.animate () 的返回值，如：

    var player = document.body.animate(/* ... */);

player 即成为该动画返回的一个 “动画播放器” 对象，同时动画开始播放。我们需要了解动画当前的状态，可以通过该对象的只读属性 playState 来获得：

```javascript
console.log(player.playState); //"running","paused","finished"...
```

播放器共有五种状态，除了代码中注释的三种基本状态，还包括 "idle" 表示恢复到初始状态，"pending" 表示播放或者暂停即将发生时。

播放器可以通过四种方法可以改变动画当前的状态。


<!-- {% endraw %} - for jekyll -->