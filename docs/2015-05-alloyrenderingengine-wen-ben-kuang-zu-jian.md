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
(function () {
    //先把要使用类的赋给临时变量，以后就不用打点了:)
    var Stage = ARE.Stage,
        Container = ARE.Container,
        Graphics = ARE.Graphics,
        Text = ARE.Text; //文本框集成自容器
    ARE.Textbox = Container.extend({
        //构造函数
        ctor: function (option) {
            //把容器的属性和方法搞给自己
            this._super(); //鼠标移上去指针的形状，AlloyRenderingEngine会自动帮你显示鼠标移上去时候的形状
            this.cursor = "text"; //文本框的边框
            this.box = new Graphics(); //直接根据传进的宽和高画个矩形
            this.box.strokeRect(0, 0, option.width, option.height); //文本框的背景，这里接近透明，为什么要设置背景是因为鼠标一上去要触发一个事件， //而AlloyRenderingEngine的默认触发是像素级别， //会根据getImageData得到该点的rgba的a是否为0去判断是否触发事件 //所以铺一个接近透明的背景 //主要是为了触发的事件是：鼠标移到文本框上面，鼠标形状要变成cursor:text
            this.box
                .fillStyle("rgba(255,255,255,0.1)")
                .fillRect(0, 0, option.width, option.height); //把边框添加到自身（因为自身就是容器，继承自Container，所以有了add方法）
            this.add(this.box); //绑定事件
            this._bindEvent(); //合并默认配置
            this.option = {
                fontSize: option.fontSize || 12,
                fontFamily: option.fontFamily || "arial",
                color: option.color || "black",
                width: option.width,
            }; //cursorText代表文本框中闪烁的光标，自己用黑色的Text去模拟
            this.cursorText = new Text(
                "|",
                this.option.fontSize + "px " + this.option.fontFamily,
                "black"
            ); //真正的input！！！！哈哈，玄机就在于此 =   =！
            this.realTextbox = document.createElement("input");
            this.realTextbox.type = "text";
            this.realTextbox.style.position = "fixed";
            this.realTextbox.style.left = "-200px";
            this.realTextbox.style.top = "0px";
            document.body.appendChild(this.realTextbox); //canvas中显示的文本
            this.text = new Text(
                "",
                this.option.fontSize + "px " + this.option.fontFamily,
                this.option.color
            ); //measureCtx是专门用于测量canvas中文本宽度的
            this.measureCtx = document.createElement("canvas").getContext("2d");
            this.measureCtx.font =
                this.option.fontSize + "px " + this.option.fontFamily;
            this.add(this.text, this.cursorText); //tickFPS是该容器tick执行的频率，AlloyRenderingEngine会自动帮你执行tick方法
            this.tickFPS = 20;
        }, //获取焦点
        focus: function () {
            var self = this; //真正的input也同时获取焦点
            this.realTextbox.focus(); //Canvas中的光标闪烁
            this.loop = setInterval(function () {
                self.cursorText.visible = !self.cursorText.visible;
            }, 500);
        }, //失去焦点
        blur: function () {
            clearInterval(this.loop); //真正的input也同时失去焦点
            this.realTextbox.blur(); //隐藏Canvas中的光标
            this.cursorText.visible = false;
        },
        _bindEvent: function () {
            var self = this;
            this.onClick(function (evt) {
                //真正的input也同时获取焦点
                self.realTextbox.focus(); //显示光标
                self.cursorText.visible = true; //自己也假装获取焦点
                self.focus(); //阻止冒泡
                evt.stopPropagation();
            }); //点击文本框的其他区域触发失去焦点
            document.addEventListener(
                "mousedown",
                function () {
                    //失去焦点
                    self.blur();
                },
                false
            );
        }, //计算合适的显示文本，这主要是解决文本超出了文本框的宽度时候的显示问题
        getFitStr: function (str, index) {
            //利用measureText计算文本宽度
            var width = this.measureCtx.measureText(
                str.substring(index, str.length - 1)
            ).width;
            if (width < this.option.width - this.option.fontSize) {
                return this.getFitStr(str, --index);
            } else {
                return str.substring(index++, str.length - 1);
            }
        },
        tick: function () {
            //利用measureText计算文本宽度，并把该宽度赋值给光标的偏移
            this.cursorText.x = this.measureCtx.measureText(
                this.realTextbox.value
            ).width; //如果宽度超了
            if (this.cursorText.x > this.option.width) {
                this.text.value = this.getFitStr(
                    this.realTextbox.value,
                    this.realTextbox.value.length - 2
                );
                this.cursorText.x = this.measureCtx.measureText(
                    this.text.value
                ).width;
            } else {
                //如果宽度没超
                this.text.value = this.realTextbox.value;
            }
        },
    });
})();
```

大部分代码都做了解释，不再重复阐述。

Github: <https://github.com/AlloyTeam/AlloyGameEngine>

<!-- {% endraw %} - for jekyll -->