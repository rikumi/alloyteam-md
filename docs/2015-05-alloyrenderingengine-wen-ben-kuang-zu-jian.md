---
title: AlloyRenderingEngine 文本框组件
date: 2015-05-20
author: TAT.dnt
source_link: http://www.alloyteam.com/2015/05/alloyrenderingengine-wen-ben-kuang-zu-jian/
---

<!-- {% raw %} - for jekyll -->

写在前面  

* * *

Github: <https://github.com/AlloyTeam/AlloyGameEngine>

在 dom 元素里，自带了 input 标签，设置其 type 为 text，它就是一个文本框。

那么在 Canvas 中模拟 input 文本框是不是闲的没事找事？绝对不是！  
因为在游戏当中可以统一化像素管理，具体统一化像素管理有什么好处，以后新开文章详细讨论。

演示  

* * *

(function () { var r = ARE.Stage, t = ARE.Container, i = ARE.Graphics, n = ARE.Text; ARE.Textbox = t.extend({ ctor: function (t) { this.\_super(); this.box = new i; this.box.strokeRect(0, 0, t.width, t.height); this.box.fillStyle("rgba(255,255,255,0.1)").fillRect(0, 0, t.width, t.height); this.add(this.box); this.\_bindEvent(); this.option = { fontSize: t.fontSize || 12, fontFamily: t.fontFamily || "arial", color: t.color || "black", width: t.width }; this.cursor = "text"; this.cursorText = new n("|", this.option.fontSize + "px " + this.option.fontFamily, "black"); this.realTextbox = document.createElement("input"); this.realTextbox.type = "text"; this.realTextbox.style.position = "fixed"; this.realTextbox.style.left= "-200px"; this.realTextbox.style.top= "0px";document.body.appendChild(this.realTextbox); this.text = new n("", this.option.fontSize + "px " + this.option.fontFamily, this.option.color); this.measureCtx = document.createElement("canvas").getContext("2d"); this.measureCtx.font = this.option.fontSize + "px " + this.option.fontFamily; this.add(this.text, this.cursorText); this.tickFPS = 20 }, focus: function () { var n = this; this.realTextbox.focus(); this.loop = setInterval(function () { n.cursorText.visible = !n.cursorText.visible }, 500) }, blur: function () { clearInterval(this.loop); this.realTextbox.blur(); this.cursorText.visible = !1 }, \_bindEvent: function () { var n = this; this.onClick(function (t) { n.realTextbox.focus(); n.cursorText.visible = !0; n.focus(); t.stopPropagation() }); document.addEventListener("mousedown", function () { n.blur() }, !1) }, getFitStr: function (n, t) { var i = this.measureCtx.measureText(n.substring(t, n.length - 1)).width; return i &lt; this.option.width - this.option.fontSize ? this.getFitStr(n, --t) : n.substring(t++, n.length - 1) }, tick: function () { this.cursorText.x = this.measureCtx.measureText(this.realTextbox.value).width; this.cursorText.x > this.option.width ? (this.text.value = this.getFitStr(this.realTextbox.value, this.realTextbox.value.length - 2), this.cursorText.x = this.measureCtx.measureText(this.text.value).width) : this.text.value = this.realTextbox.value } }) })(), function () { var t = ARE.Stage, r = ARE.Textbox, i = new t("#ourCanvas"), n = new ARE.Textbox({ fontSize: 22, color: "red", width: 200, height: 26 }); n.x = 50; n.y = 50; window.onload=function () { n.focus() ; i.offset = i.\_getXY(i.canvas); }; i.add(n) }()

上面的文本框就是使用 AlloyRenderingEngine 渲染出来的。

使用  

* * *

```javascript
(function () {
    var Stage = ARE.Stage,
        Textbox = ARE.Textbox;
    var stage = new Stage("#ourCanvas", true);
    var textbox = new ARE.Textbox({
        fontSize: 22,
        color: "red",
        width: 200,
        height: 26,
    });
    textbox.x = 50;
    textbox.y = 50;
    textbox.focus();
    stage.add(textbox);
})();
```

原理 (都在注释里)  

* * *

```javascript
; (function () {
    //先把要使用类的赋给临时变量，以后就不用打点了:)
    var Stage = ARE.Stage, Container = ARE.Container,
```


<!-- {% endraw %} - for jekyll -->