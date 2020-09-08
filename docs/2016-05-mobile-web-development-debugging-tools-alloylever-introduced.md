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
window.XMLHttpRequest = function () {
    var xhr = new XHR();
    checkSuccess(xhr);
    return xhr;
};
window.XMLHttpRequest.realXHR = XHR;
var self = this;
function checkSuccess(xhr) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        self.option.xhrs.push({
            url: xhr.responseURL,
            json: JSON.stringify(JSON.parse(xhr.responseText), null, "\t"),
        });
    } else if (xhr.status >= 400) {
        console.error(
            xhr.responseURL + " " + xhr.status + " (" + xhr.statusText + ")"
        );
    } else {
        window.setTimeout(function () {
            checkSuccess(xhr);
        }, 0);
    }
}
```

如上面所示，重写了 XMLHttpRequest 对象。用户 new 的对象全部为重写后的，返回的是真正的。这样就可以拿到所有用户创建的 XMLHttpRequest 对象的实例进行监听。

### Error 截获

其中 error 包含两部分，第一部分是 js 报的错误，通过下面的方式截获：

```css
window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
    console.error(
        "Error: " +
            errorMsg +
            " Script: " +
            url +
            " Line: " +
            lineNumber +
            " Column: " +
            column +
            " StackTrace: " +
            errorObj
    );
};
```

这里执行的时候 console 已经被重写了。所以自己的 console 面板也能看到错误。

第二部分是资源加载失败报的错，通过遍历 HTML dom 节点拿到所有的 js/css/img，然后再次发送请求。js 和 css 通过 XMLHttpRequest 发请求，监听状态。，img 通过 new Image (), 监听 onerror。具体代码参见： <https://github.com/AlloyTeam/AlloyLever/blob/master/src/component/alloy_lever/index.js>

### 其他

Timeline 通过 timing.js 获得所有信息，timing.js 基于 window.performance 封装的类库。Cookie 和 localStorage 通过 js 遍历得到。

### 相关

Github： <https://github.com/AlloyTeam/AlloyLever>  
Issues： <https://github.com/AlloyTeam/AlloyLever/issues>

微信部门也有个的 [vConsole](https://github.com/WechatFE/vConsole) 工具用于移动端 Console.log

欢迎大家试用反馈。


<!-- {% endraw %} - for jekyll -->