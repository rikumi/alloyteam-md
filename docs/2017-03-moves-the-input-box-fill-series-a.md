---
title: 移动端输入框填坑系列（一）
date: 2017-03-21
author: TAT.yana
source_link: http://www.alloyteam.com/2017/03/moves-the-input-box-fill-series-a/
---

<!-- {% raw %} - for jekyll -->

输入在移动端是一个很常用的功能，那么输入框必然是一个很重要的部分。然而，移动端输入框总会遇到各种各样的问题，无论是样式还是 ios 和 android 两端体验不一致都是很让我们头疼的问题，那么如何使移动 web 的输入框体验更贴近原生也成了一个需要我们多多思考和研究的问题。

## 一、文字输入限制问题

我们拿最多可输入 16 个字为例。当输入字数（注意，不是字符长度）超过 16 字时，会触发 tips 提示，并且不能继续输入。  
办法一：  
textarea 可以使用 maxlength 进行输入字数限制。  
但是这个办法只能单纯的限制 length，有时并不能真正的结局问题。  
办法二：  
在将第二个办法之前先来讲讲下面的几种情况：  
**1、非直接的文字输入**  
什么叫做非直接的文字输入呢？  
![](http://www.alloyteam.com/wp-content/uploads/2017/03/非直接输入.gif)  
当输入汉字时必然会是非直接输入，需要我们点选才能正式输入。  
当我们字数限制为 16 个字，需要实时检查是否到 16 字。输入文字时，当有非直接的文字输入时，监听 keydown 事件和 input 事件都会直接触发判断字数逻辑，会截断我们正在输入的文字。  
解决办法：  
监听 compositionend（当直接的文字输入时触发）这时，当没选中中文的时候不会进行字数判断。  

```javascript
$("#input").on("compositionend", function (e) {
    var len = $(this).val().length;
    if (len > 16) {
        // 提示超过16字
    }
});
```

**2、emoji 表情的输入**  
当输入 emoji 的时候，但是，当输入 **emoji 表情**的时候，js 中判断 emoji 表情的 length 为 2，因此 emoji 正常应该最多只能输入 8 个，但是 ios 端却把 emoji 的 length 算为 1，可以输入 16 个 emoji。这样就导致了两端的体验不同。因此需要在 js 中来进行字数限制。  
再加上汉字输入问题，那么就加入一个标记位，来判断是否是直接的文字输入。然后监听 input，限制字数，当超过字数限制的时候，把前 16 个字截断显示出来就 ok 了。  

```javascript
var cpLock;
$('#input').on('compositionstart', function(e) {
    cpLock = true；
});
$('#input').on('compositionend', function(e) {
    cpLock = false;
});
$('#input').on('input', function(e) {
    if (!cpLock) {
        if (e.target.value.length - 17 >=0) {
            var txt = $(e.target).val().substring(0, 16);
            $(e.target).val(txt);
            // 超过16字提示
        }
    }
});
 
```

## 二、textarea 置底展示问题

ios 中的输入体验永远伴随着一个问题，就是当唤起键盘后，整个页面会被键盘压缩，也就是说页面的高度变小，并且所有的 fixed 全部变为了 absolute。  
android 效果：  
![](http://www.alloyteam.com/wp-content/uploads/2017/03/2D60002621E863465FA9D1D125E0A625.png)![](http://www.alloyteam.com/wp-content/uploads/2017/03/19B6FBC1CDAB2DFD5D8372835AD40D5B.jpg)![](http://www.alloyteam.com/wp-content/uploads/2017/03/0F235217BAA61D883AE0FF749D56639E.png)![](http://www.alloyteam.com/wp-content/uploads/2017/03/E7A2A47E4CBADEEC480C817F33420B89.jpg)  
使用 fixed 定位     
可见 android 中唤起键盘是覆盖在页面上，不会压缩页面  
在 ios 上的效果：  
![](http://www.alloyteam.com/wp-content/uploads/2017/03/C2C872ABEC19523C4F7FA12C8BF9AF6C.png)![](http://www.alloyteam.com/wp-content/uploads/2017/03/13433D7D79C882AD3C77E44923C0E2AC.png)![](http://www.alloyteam.com/wp-content/uploads/2017/03/7750008C947D43327F2C12BBC837B52E.png)![](http://www.alloyteam.com/wp-content/uploads/2017/03/1A9474E333E9DC2B5943AA23B78BE9E6.png)

那么如果我们需要将**输入框固定在屏幕下方，而当键盘被唤起同时输入框固定在键盘上方**（如�


<!-- {% endraw %} - for jekyll -->