---
title: AlloyRenderingEngine 燃烧的进度条
date: 2015-05-25
author: TAT.dnt
source_link: http://www.alloyteam.com/2015/05/alloyrenderingengine-ran-shao-di-jin-du-tiao/
---

<!-- {% raw %} - for jekyll -->

写在前面  

* * *

Github: <https://github.com/AlloyTeam/AlloyGameEngine>

HTML 5 新增了 progress 标签，那么再去使用 AlloyRenderingEngine 去模拟进度条是否多余？  
不多余。有四大好处：

-   样式更加灵活 (想怎么绘制就怎么绘制)
-   跨平台跨浏览器样式更加统一（使用便签，各个浏览器默认样式是五花八门）
-   效果更加酷炫，（比如燃烧的进度条 = =！）
-   像素能够统一管理

统一像素管理的好处：

-   更容易的全尺寸缩小和放大（最常见的：全屏游戏）
-   缩小和放大不用操心内部元素错位（只是交给浏览器去进行插值运算）
-   更好的滤镜控制（如游戏中死亡画面，全屏黑白化）
-   更好的移植性和跨平台性（opengl&lt;->canvas2d&lt;->webgl&lt;->opengl 等等各种 mapping）

上面所列的，对 AlloyRenderingEngine 所有组件都适用。

演示  

* * *

开始演示

(ps: 可以直接点击进度条黑色部分设置进度)

(function () { var i = ARE.Stage, t = ARE.Container, n = ARE.Graphics; ARE.Progress = t.extend({ ctor: function (t) { this.\_super(); this.box = new n; this.box.lineWidth(2).strokeStyle(t.borderColor || "black").strokeRect(0, 0, t.width, t.height); this.add(this.box); this.width = t.width; this.value = 0; var i = this.value \* t.width - 4; this.bar = new n; this.add(this.bar); this.bar.fillStyle(t.fillColor || "green").fillRect(2, 2, i &lt; 0 ? 0 : i, t.height - 4); this.pilot = new ARE.ParticleSystem({ emitX: 0, emitY: 0, speed: 10, angle: 180, angleRange: 90, emitArea: \[1, t.height], texture: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJkSURBVHjaxJeJbusgEEW94S1L//83X18M2MSuLd2pbqc4wZGqRLrKBsyZhQHny7Jk73xVL8xpVhWrcmiB5lX+6GJ5YgQ2owbAm8oIwH1VgKZUmGcRqKGGPgtEQQAzGR8hQ59fAmhJHSAagigJ4E7GPWRXOYC6owAd1JM6wDQPADyMWUqZRMqmAojHp1Vn6EQQEgUNMJLnUjMyJsM49wygBkAPw9dVFwXRkncCIIW3GRgoTQUZn6HxCMAFEFd8TwEQ78X4rHbILoAUmeT+RFG4UhQ6MiIAE4W/UsYFjuVjAIa2nIY4q1R0GFtQWG3E84lqw2GO2QOoCKBVu0BAPgDSU0eUDjjQenNkV/AW/pWChhpMTelo1a64AOKM30vk18GzTHXCNtI/Knz3DFBgsUqBGIjTInXRY1yA9xkVoqW5tVq3pDR9A0hfF5BSARmVnh7RMDCaIdcNgbPBkgzn1Bu+SfIEFSpSBmkxyrMicb0fAEuCZrWnN89veA/4XcakrPcjBWzkTuLjlbfTQPOlBhz+HwkqqPXmPQDdrQItxE1moGof1S74j/8txk8EHhTQrAE8qlwfqS5yukm1x/rAJ9Jiaa6nyATqD78aUVBhFo8b1V4DdTXdCW+IxA1zB4JhiOhZMEWO1HqnvdoHZ4FAMIhV9REF8FiUm0jsYPEJx/Fm/N8OhH90HI9YRHesWbXXZwAShU8qThe7H8YAuJmw5yOd989uRINKRTJAhoF8jbqrHKfeCYdIISZfSq26bk/K+yO3YvfKrVgiwQBHnwt8ynPB25+M8hceTt/ybPhnryJ78+tLgAEAuCFyiQgQB30AAAAASUVORK5CYII=", filter: \[.63, .35, .18, 1], emitCount: 1, maxCount: 50 }); this.pilot.y = t.height / 2; this.pilot.scale = .4; this.add(this.pilot); this.height = t.height; this.fillColor = t.fillColor; ARE.Observe(this, "value", function (n, t) { t >= 1 ? (this.pilot.maxCount = 0, this.value = 1) : (this.pilot.maxCount = 50, this.value = t); this.pilot.x = this.value \* this.width; var i = this.value \* this.width - 4; this.bar.clear().fillStyle(this.fillColor || "green").fillRect(2, 2, i &lt; 0 ? 0 : i, this.height - 4) }) } }) })(), function () { var r = new ARE.Stage("#ourCanvas"), n = new ARE.Progress({ width: 200, height: 20, borderColor: "#3d3d3d", fillColor: "#black" }), t, i, u; n.x = 50; n.y = 50; t = 0; i = !0; r.onTick(function () { i || (t += .005, n.value = t) }); r.add(n); n.cursor = "pointer"; n.onClick(function (i) { t = n.value = (i.stageX - n.x) / n.width }); u = document.querySelector("#progressBegin"); u.addEventListener("click", function () { i = !1 }, !1) }()

组件使用  

* * *

```javascript
; (function () {
    //注意：当要渲染文字(Text)和图形(Graphics)时，请使用Cavnas渲染
    //Progress组件内部使用了Graphics
    //第二个参数true代表关闭webgl,使用Canvas2d渲染
    //如果要使用webgl渲染，请使用Lable渲染文字，Shape渲染矢量图。
    var stage = new ARE.Stage("#ourCanvas", true);
    var progress = new ARE.Progress({
        width: 200,
        height: 20,
        borderColor: "#3d3d3d",
        fillColor: "#black"
    })
    progress.x = 50;
    progress.y = 50;
    stage.add(progress);
 
    var current = 0, pause = true;
    stage.onTick(function () {
        if (
```


<!-- {% endraw %} - for jekyll -->