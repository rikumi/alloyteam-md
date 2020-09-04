---
title: 移动 web 开发调试工具 AlloyLever 介绍
date: 2016-05-10
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/05/mobile-web-development-debugging-tools-alloylever-introduced/
---

<!-- {% raw %} - for jekyll -->

### 简介

web 调试有几个非常频繁的刚需：看 log、看 error、看 AJAX 发包与回包。其他的如 timeline 和 cookie 以及 localstorage 就不是那么频繁，但是 AlloyLever 都支持。如你所见：

![](http://www.alloyteam.com/wp-content/uploads/2016/05/alloylever2.png)

**AJAX 抓取**：

![](http://www.alloyteam.com/wp-content/uploads/2016/05/ajax.png)

### 特征

-   点击 alloylever 按钮之间切换显示或隐藏工具面板
-   Console 会输出所有用户打印的日志如 console.\[log/error/info/debug/debug]
-   Console 会输出所有的错误信息 (脚本错误和网络请求错误)
-   XHR 面板会输出所有（XMLHttpRequest）AJAX 请求和服务器端返回的数据
-   Resouces 面板会输出所有的 Cookie 信息和 LocalStorage
-   TimeLime 面板会输出页面相关的生命周期里的时间段耗时情况

### 演示

[![](http://www.alloyteam.com/wp-content/uploads/2016/05/alloylever-150x150.png)](http://www.alloyteam.com/wp-content/uploads/2016/05/alloylever-150x150.png)​

<http://alloyteam.github.io/AlloyLever/>

### Install

可以通过 npm 安装:

    npm install alloylever

### 使用

你的页面只需要引用一个 js 即可！

````html

```html
<script src="alloylever.js"></script>
````

;

````

但是需要注意的是，该 js 必须引用在其他脚本之前。至于为什么，看下面的原理。

### Console 截获  

```javascript
window.console = {
    wc: window.console,
};
var self = this;
["log", "error", "warn", "debug", "info"].forEach(function (item) {
    console[item] = function (msg) {
        this.wc[item](msg);
        self.log(msg, item);
    };
});
````

重写了 console 方法，并且保存下 window 下真正的方法进行执行，并且注入自己的事件。

### AJAX 截获

```javascript
var XHR = window.XMLHttpRequest;
 
window.XMLHttpRequest=function(){
    var xhr = new XHR();
    checkSuccess(xhr);</
```


<!-- {% endraw %} - for jekyll -->