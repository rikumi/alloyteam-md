---
title: 完美的自定义滚动条
date: 2012-05-14
author: TAT.melody
source_link: http://www.alloyteam.com/2012/05/perfect-custom-scrollbar/
---

<!-- {% raw %} - for jekyll -->

今天写了一个滚动条 UI 组件。欢迎大家体验：<http://alloyteam.github.com/ui/>

为何称之为完美呢？只因其具有以下优点：

1.  兼容所有浏览器。
2.  支持所有鼠标事件，包括长按。
3.  样式可以完全自定义。
4.  使用该组件无需改动原来的任何代码，也不要求原来的元素使用什么定位方式。
5.  只需引进一两个 js 文件，再添加一句代码即可。

下面讲核心部分。

## 首先关于鼠标长按事件，使用 setInterval 的方式

这里关键在于什么时候清楚定时器。首先，鼠标弹起时候要清除；第二种情况是不满足条件时要清除。下面把鼠标按在滚动槽中的鼠标响应事件的代码贴出来，以供参考：

```javascript
slider.onmousedown = function (e) {
    e = e || event;
    var id;
    var mouseY = e.clientY;
    function isUp() {
        var rect = context.cube.getBoundingClientRect();
        var y = rect.top;
        if (y > mouseY) {
            up();
            id ||
                (id = setInterval(function () {
                    isUp(y);
                }, 100));
            return true;
        } else {
            id && clearInterval(id);
            id = 0;
            return false;
        }
    }
    function isDown() {
        var rect = context.cube.getBoundingClientRect();
        var y = rect.top;
        if (rect.bottom < mouseY) {
            down();
            id ||
                (id = setInterval(function () {
                    isDown(y);
                }, 100));
            return true;
        } else {
            id && clearInterval(id);
            id = 0;
            return false;
        }
    }
    isUp() || isDown();
    document.onmouseup = function () {
        id && clearInterval(id);
        id = 0;
        document.onmouseup = null;
    };
};
```

## 第二，关于如何做到使用该组件无需改动任何代码。

这里关键在于对要使用滚动条元素的定位方式进行分析，然后应用于我们生成的包含滚动条元素的 dom 节点，最后使用替换节点的方式把我们生成的 dom 节点插入文档中，具体代码如下：

```javascript
var padding = 0;
var position;
var float, margin, left, top, right, bottom;
if (el.currentStyle) {
    var paddingLeft = el.currentStyle["paddingLeft"];
    var paddingRight = el.currentStyle["paddingRight"];
    padding =
        parseInt(paddingLeft.substr(0, paddingLeft.length - 2)) +
        parseInt(paddingRight.substr(0, paddingRight.length - 2));
    position = el.currentStyle["position"];
    float = el.currentStyle["float"];
    margin = el.currentStyle["margin"];
    left = el.currentStyle["left"];
    top = el.currentStyle["top"];
    right = el.currentStyle["right"];
    bottom = el.currentStyle["bottom"];
} else {
    var computedStyle = document.defaultView.getComputedStyle(el, null);
    var paddingLeft = computedStyle.getPropertyValue("padding-left");
    var paddingRight = computedStyle.getPropertyValue("padding-right");
    padding =
        parseInt(paddingLeft.substr(0, paddingLeft.length - 2)) +
        parseInt(paddingRight.substr(0, paddingRight.length - 2));
    position = computedStyle.getPropertyValue("position");
    float = computedStyle.getPropertyValue("float");
    margin = computedStyle.getPropertyValue("margin");
    left = computedStyle.getPropertyValue("left");
    top = computedStyle.getPropertyValue("top");
    right = computedStyle.getPropertyValue("right");
    bottom = computedStyle.getPropertyValue("bottom");
}
if (position == "absolute" || position == "relative") {
    container.style.position = position;
    container.style.left = el.offsetLeft + "px";
    container.style.top = el.offsetTop + "px";
    container.style.bottom = bottom;
    container.style.right = right;
    container.style.left = left;
    container.style.top = top;
}
el.style.left = el.style.top = "0";
container.style.float = float;
container.style.margin = margin;
el.style.margin = "0";
el.parentNode.insertBefore(container, el);
```

## 三。因为使用了样式分离，所以支持任意自定义样式。

## 四。组件的使用。

仅需一句代码 ScrollUI (el)//el 为要使用自定义滚动条的元素

<!-- {% endraw %} - for jekyll -->