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
       &nb
```


<!-- {% endraw %} - for jekyll -->