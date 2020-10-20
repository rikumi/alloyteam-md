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

    player.pause(); //"paused"
    player.play();  //"running"
    player.cancel(); //"idle"
    player.finish(); //"finished"

与 CSS3 动画类似，player 可以为动画自然结束或者手动结束时指定一个 onfinish 函数。

```javascript
player.onfinish = function (e) {
    // ...
};
```

请注意，设置播放次数 Infinity 的动画没有自然结束的时机去调用 onfinish 函数。

### 时间控制与时间轴

播放器 player 具有一个读写属性 playbackRate，用于控制动画的播放速度。

```javascript
var player = element.animate(/* ... */);
console.log(player.playbackRate); //1
player.playbackRate = 2;
```

playbackRate 默认值为 1，可以通过设置更大的整数使得动画加速，也可以通过设置大于零的小数来使得动画减缓播放速度。

player 还具有两个与时间相关的读写属性 currentTime 和 startTime。前者返回动画当前过去的毫秒数，它的最大值是 timing 参数设置的 delay+(duration\*iterations)，而设置 Infinity 的动画没有 currentTime 的最大值。

当设置了 playbackRate 时，动画的 currentTime 并不会发生变化，真正变化的是时间轴，播放速度改变使得时间轴被相应拉伸或者压缩。

播放器可以调用 reverse () 倒叙播放动画，由时间轴的终点走向起点，动画结束时 currentTime 的值回到 0。

```javascript
player.onfinish = function () {
    player.reverse();
};
```

### 多个动画

CSS3 动画是可以同时指定多个 keyframes 动画到一个 DOM 节点上，WAAPI 同样具备应用多个动画的能力。在一个元素上多次调用 animate 方法，即实现了一个元素多个动画：

    var animated = document.getElementById('toAnimate');
    var pulseKeyframes, activateKeyframes, haveFunKeyframes;
    var pulse = animated.animate(pulseKeyframes, 1000); 
    var activate = animated.animate(activateKeyframes, 3000);
    var haveFunWithIt = animated.animate(haveFunKeyframes, 2500);

每个子动画也拥有独立的 timing 参数，以及独立的动画状态（播放、停止、完成、取消）和独立的时间轴（启动时间、播放速度和结束时间），方便动画进行细节控制。

### 更高级的接口

WAAPI 还拥有 timeline 属性，对动画进行分组和排序的能力，以及沿自定义路径移动（再也不是 SVG 的天下了）的能力，光这一点就足够令人激动不已，然而篇幅有限于是下回再表。

四、登堂：官方案例  

* * *

Codelabs  越来越多基于 WAAPI 的 Codelabs 实例涌现，这些实例非常适合初接触 WAAPI 的同学作为开始的范例。 \[[https://github.com/web-animations/web-animations-codelabs\\\]](https://github.com/web-animations/web-animations-codelabs/]) 

[![preview](http://www.alloyteam.com/wp-content/uploads/2015/12/preview.gif)](http://www.alloyteam.com/wp-content/uploads/2015/12/preview.gif)

[![demo22](http://www.alloyteam.com/wp-content/uploads/2015/12/demo22.gif)](http://www.alloyteam.com/wp-content/uploads/2015/12/demo22.gif)

Google’s demos  如果你希望用 WAAPI 挑战更炫酷的动画，特别是遵循 Material Design 风格的动画效果，这将是不错的灵感来源。 \[[http://web-animations.github.io/web-animations-demos\\\]](http://web-animations.github.io/web-animations-demos/]) 

[![demo2](http://www.alloyteam.com/wp-content/uploads/2015/12/demo2.gif)](http://www.alloyteam.com/wp-content/uploads/2015/12/demo2.gif) 

五、上座：移动端运行  

* * *

看到这里，相信你已经不只一次体验到 WAAPI 带来的惊喜。作为一名彻头彻尾的移动端 H5 开发，我当然也想把 WAAPI 应用到移动业务上去服务用户... 什么？手机上怎么没效果！

 \[[http://caniuse.com/#feat=web-animation\\\]](http://caniuse.com/#feat=web-animation%5C])

[![WAAPI03](http://www.alloyteam.com/wp-content/uploads/2015/12/WAAPI03.png)](http://www.alloyteam.com/wp-content/uploads/2015/12/WAAPI03.png)

为了在现代浏览器厂商还没完全跟进到位的时候抢先用上 WAAPI，我们可以选择引入针对 Web Animation API 的 Polyfill 库 \[[https://github.com/web-animations/web-animations-js\\\]，从而在](https://github.com/web-animations/web-animations-js/]，从而在) IE/Firefox/Safari 等浏览器上体验到 WAAPI 的精彩。

```html
&lt;script src="https://cdn.jsdelivr.net/web-animations/latest/web-animations.min.js">&lt;/script>
&lt;script>
  document.body.animate([
    {'background': 'red'},
    {'background': 'green'}
  ], 1000);
&lt;/script>
```

移动端浏览器，Android 5.0 以上的 Android Browser 和 Chrome for Android 本身就已经支持 WAAPI 了，加上 Polyfill 之后，iOS 的 Safari 也支持了。别忘了，还有我大手 Q 的 X5 内核浏览器。

至此，小伙伴们终于露出欣慰的笑容。敬请期待下篇《Web Animation API  从上座到书墨》。

六、品茗：参考文献  

* * *

1.  W3C Spec：<https://w3c.github.io/web-animations/>
2.  《Let’s talk about the Web Animations API》：<http://danielcwilson.com/blog/2015/07/animations-intro/>
3.  Google's Demo：<http://web-animations.github.io/web-animations-demos/>
4.  codelabs： <https://github.com/web-animations/web-animations-codelabs>
5.  Polyfill： <https://github.com/web-animations/web-animations-js>
6.  Resources：<https://developers.google.com/web/updates/2015/10/web-animations-resources>


<!-- {% endraw %} - for jekyll -->