---
title: HTML5 迟来的 API：Page Visibility
date: 2012-11-05
author: TAT.dmyang
source_link: http://www.alloyteam.com/2012/11/page-visibility-api/
---

<!-- {% raw %} - for jekyll -->

一开始先看个[小小 demo](http://www.alloyteam.com/wp-content/uploads/2012/11/page-visibility.html "page visibility demo")，**切换 tab 对比下！**

不得不说，浏览器的多 tab（and 多窗口）设计确实是满足了用户同时浏览很多个网页的需求，但是，网上有成千上万的页面，这些页面性能又参差不齐，对于某些性能很差的页面，用户停留在这个页面倒还好，但是当用户切换了到了其他 tab 页时，有可能会出现由于性能差的页面卡死导致整个浏览器卡死甚至机器卡死，其他页面好冤，浏览器好冤，机子好冤 \[汗]。

多 tab 固然是好，但是即使用户打开了 N 个 tab 窗口，他看的永远只是一个 tab，其他不是激活态（按 API，应该是叫隐藏）的 tab 虽然没用被用户关注到，但是它照样再跑，该计算的还得计算，改占的内存并不会少，这明显是造成了很大的资源浪费，作为网页开发者的我们，如果是知道了用户已经不再关注我们的页面，一些耗性能的操作当然可以停掉了（比如 canvas 的绘图，动态拉取 feeds 等，这种情况我觉得在网页游戏里面应该较多见），当用户切换回页面时，之前状态就可以恢复，可以说毫不影响用户体验。

这其中，最关键的是一个环节：开发者如何知道所开发的页面被用户关注了？HTML5 的 Page Visibility API 提供了这种可能！但是我觉得在这个时候作为 H5 的标准提出来明显是迟了，应该在 tab 设计之初就应该有此 API 或者相关的方案，如果大家都按照此方式组织代码，我们有理由相信浏览器的内存占用会大幅减少。

支持 page visibility 的浏览器在 document 上添加一个 hidden 属性（不同浏览器可能需要前缀，如 webkitHidden），看当前 tab 页是否激活，激活（focus）时 document.hidden 属性是 false，否则是 true，一下这段代码能用来检测浏览器是否支持 pagevisivility 并读取 document 的 hidden 值：

```javascript
function getHiddenProp() {
    return "hidden" in document
        ? "hidden"
        : (function () {
              var r = null;
              ["webkit", "moz", "ms", "o"].forEach(function (prefix) {
                  if (prefix + "Hidden" in document) {
                      return (r = prefix + "Hidden");
                  }
              });
              return r;
          })();
}
```

document 还会添加一个 visibilityState 属性，该属性有 4 个可能值，分别如下：

hidden：当浏览器最小化、切换 tab（the page is on a background tab）、电脑锁屏时 visibilityState 值是 hidden

visible：当浏览器顶级 context（top level browsing context）的 document 至少显示在一个屏幕（screen）当中时，返回 visible；当浏览器窗口没有最小化，但是浏览器被其他应用遮挡时，visibilityState 值也是 visible

prerender：文档加载离屏（is loaded off-screen）或者不可见时返回 prerender，浏览器可选择性的支持这个属性（not all browsers will necessarily support it）

unloaded：当文档（document）将要被 unload 时返回 unloaded，浏览器可选择性的支持这个属性

此外就是事件支持，document 上会添加 visibilitychange 事件，当 UA 的顶级 document 可见性（visibility）改变时触发：

```javascript
document.addEventListener(
    bPrefix + "visibilitychange",
    function onVisibilityChange(e) {
        //do some thing...
    }
);
```

bPrefix 是浏览器前缀，如 webkit。

总体来说，page visibility 的内容很少，也很简单，但是窃以为很有用，比如我们在做视频页面时，tab 是 hidden 状态时，我们可以去努力拉取视频内容，播放可以停止，当用户切回来时开始播放；又比如我们可以配合 H5 的桌面通知（Notifications）API，保证只在使用了 Notifications 的页面可以收取桌面通知，在此页面 visibilityState 不是 visible 时不干扰用户等等。。

最后，enjoy it！

参考：

1\.[W3C PageVisibility API Spec](http://www.w3.org/TR/page-visibility)

2\.[Using the PageVisibility API](http://www.html5rocks.com/en/tutorials/pagevisibility/intro/)


<!-- {% endraw %} - for jekyll -->