---
title: 复制粘贴的高级玩法
date: 2015-04-26
author: TAT.老教授
source_link: http://www.alloyteam.com/2015/04/how-to-paste-zhuangbility/
---

<!-- {% raw %} - for jekyll -->

想做一个好用的在线编辑器，不管是地图编辑器、PPT 创作平台还是通过拖拽快速创建活动页面的编辑器等等，必然要给用户提供各种快捷的操作方法。如非常常用的复制粘贴功能。

举个例子，在 iPresst 创作平台，我们的作品在好几页都要用到同一张图片，总不能每次都点击上传一次图片吧？右键复制粘贴或者直接按快捷键无疑是最符合用户预期的操作方式，然而我们编辑器用到的元素一般比较特别，而且我们复制粘贴的时候经常要做一些特殊处理，此时我们就需要覆盖浏览器给我们提供的复制粘贴功能了。

[![QQ20150426-1@2x](http://www.alloyteam.com/wp-content/uploads/2015/04/QQ20150426-1@2x1.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/04/QQ20150426-1@2x1.jpg)

实现的原理也挺简单：

方法 1：监听键盘事件

```javascript
document.addEventListener(
    "keydown",
    function (e) {
        if (e.ctrlKey) {
            switch (e.keyCode) {
                case 88:
                    console.log("Ctrl + X, cutting");
                    break;
                case 67:
                    console.log("Ctrl + C, copying");
                    break;
                case 86:
                    console.log("Ctrl + V, pasting");
                    break;
                default:
            }
        }
    },
    false
);
```

此时我们要覆盖掉浏览器的默认右键菜单，不然快捷键和右键菜单的复制粘贴操作效果不一致。这并不奇怪，一般的稍复杂的编辑器都有定制自己的右键菜单。

```javascript
document.addEventListener(
    "contextmenu",
    function (e) {
        e.preventDefault();
        console.log("show my context menu");
    },
    false
);
```

方法 2：直接覆盖剪切复制粘贴事件

```javascript
document.addEventListener(
    "cut",
    function (e) {
        e.preventDefault();
        console.log("Ctrl + X, cutting");
    },
    false
);
document.addEventListener(
    "copy",
    function (e) {
        e.preventDefault();
        console.log("Ctrl + C, copying");
    },
    false
);
document.addEventListener(
    "paste",
    function (e) {
        e.preventDefault();
        console.log("Ctrl + V, pasting");
    },
    false
);
```

如此我们就可以定制我们编辑器的特色复制粘贴功能。

（完）

开玩笑，如果就这样结束那也太水了，前面那些只是铺垫，铺垫，咳咳。

上面的代码只是实现了编辑器的内部元素复制粘贴的闭环，那来自外部的元素呢？如别的地方拷贝的一段文本，如用 QQ 截了一张图，能否直接粘贴在我们的编辑器生成特有的文本元素、图片元素？

这就是接下去要讲的高级玩法，Clipboard API。

其实访问剪贴板的数据这并不新鲜，早在多年前 IE 就支持了，我们可以通过下面的方式访问：


<!-- {% endraw %} - for jekyll -->