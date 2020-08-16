---
title: JX.Animate 基于 HTML5&CSS3 的 JavaScript 并行动画库
date: 2014-02-27
author: TAT.Minren
source_link: http://www.alloyteam.com/2014/02/based-html5-css3-animation-technology-to-achieve-the-javascript-libraries-jx-animate/
---

[![JX20140226181130](http://www.alloyteam.com/wp-content/uploads/2014/02/JX20140226181130.png)](http://www.alloyteam.com/wp-content/uploads/2014/02/JX20140226181130.png)

What’s JX.Animate

[JX.Animate](http://alloyteam.github.io/JXAnimate/ "http&#x3A;//alloyteam.github.io/JXAnimate/") 是由腾讯前端团队 AlloyTeam 推出的一个 JavaScript 的 CSS3 动画库，通过 [JX](http://alloyteam.github.io/JX "http&#x3A;//alloyteam.github.io/JX") 插件的形式提供。

-   **JX.Animate 官网：**[http://alloyteam.github.io/JXAnimate/](http://alloyteam.github.io/JXAnimate/ "http&#x3A;//alloyteam.github.io/JXAnimate/")

JX.Animate 可以帮助开发者在 JavaScript 代码中方便调用和控制 CSS3 动画，例如动画时长、重复次数、动画缓冲、结束回调等，并且支持播放声音。

Why CSS3

众所周知在支持 HTML5 的浏览器中，使用 CSS3 的动画效果无论从性能还是流畅程度都远超传统的 JavaScript 定时器动画效果。然而 CSS3 动画却存在 CSS 样式文件不好维护、动画过程不易控制、无法在运行动态生成动画等不足之处。

Features

动画可以通过多种方式定义

通过在 CSS 文件中定义关键帧动画（KeyFrameAnimate），可以做到动画定义与动画控制分离，可以更好的支持多人协同工作。

使用 JavaScript 代码定义既可以预先定义好动画效果，也可以在运行时动态定义动画效果，相比 CSS 样式的方式更加灵活。

JX.Animate 支持多米诺效果，可以控制多个 DOM 对象依次播放动画，增强视觉效果。JX.Animate 还提供了一个幻灯片组件，其中就利用了多米诺效果来实现图片的切换。可以在 JX.Animate 的主页直接看到动画效果。

How to use

1. 使用内置动画效果

```css
JXAnimate.flash(elems, { duration: "500ms" });
```

2. 使用 CSS 样式中的动画，并播放声音

            JXAnimate.applyCss(
                    elems,
                    {duration:'500ms'},
                    {
                        name:'tada', //CSS KeyFrame Name in Animate.css
                        sound:'tada',
                        volume:'1'
                    });

对应的 CSS 样式：

```css
@-webkit-keyframes tada {
	0% {-webkit-transform: scale(1);}	
	10%, 20% {-webkit-transform: scale(0.9) rotate(-3deg);}
	30%, 50%, 70%, 90% {-webkit-transform: scale(1.1) rotate(3deg);}
	40%, 60%, 80% {-webkit-transform: scale(1.1) rotate(-3deg);}
	100% {-webkit-transform: scale(1) rotate(0);}
}
```

3. 应用多米诺效果，并在在动画结束后执行回调

```javascript
JXAnimate.flipInY(
    elems,
    { duration: "1500ms" },
    {
        domino: 150,
        callback: function (argument) {
            argument.elem.classList.remove("transparent");
        },
    }
);
```

Demo 效果请点击 <http://alloyteam.github.io/JXAnimate/demo1.html>