---
title: 从网页监听 Android 设备的返回键
date: 2013-02-05
author: TAT.iAzrael
source_link: http://www.alloyteam.com/2013/02/cong-wang-ye-jian-ting-android-she-bei-di-fan-hui-jian/
---

<!-- {% raw %} - for jekyll -->

最近搞 Android 项目的时候，遇到一个比较蛋疼的需求，需要从 Client App 调用系统浏览器打开一个页面，进行杂七杂八的一些交互之后，返回到 App。如何打开浏览器和如何返回 App 这里就不说了，有兴趣的童鞋可私下交流。

之所以说这个需求蛋疼，是因为 Android 有个物理返回键啊…… 返回键啊…… 键啊…… 啊……

用户按下返回键后，预期应该跟点击页面上的返回键一样 —— 返回 App。然而这个返回键的被按下的时候网页完全不知道啊（onbeforeunload 不算），找不到直接的办法去监听，愁死我们这全苦逼程序员鸟～

虽然啊不能直接监听，曲线救国的办法，还是有滴。

经过艰苦卓绝的寻找，发现使用 HTML5 的 History 可以稍微模拟到返回键的按下事件。原理如下：

1.  页面加载完成时，调用 history.pushState 写入一个指定状态 STATE，并监听 window.onpopstate；
2.  当 onpopstate 被触发时，检查 event.state 是否等于 STATE，如果相等，表示页面发生了后退（按下返回键或者浏览器的后退按钮），则把这次行为当作是返回键被按下了（把点击浏览器的后退按钮也误算进来了，不过没啥好法子了呀）。

嗯，为了方便调用，把这个逻辑稍微封装了下，代码见这里（<https://github.com/iazrael/xback>），使用方法如下：

```javascript
XBack.listen(function () {
    alert("oh! you press the back button");
});
XBack.listen(function () {
    alert("ah, press press press");
});
```

不过这个方法有些缺陷：

1.  如果项目本身使用了 pushState，则历史记录会有瑕疵（多了一个历史）；
2.  浏览器的后退按钮点击以及调用 history.back () 也会被当成按下了返回键。

But anyway，对于结构和逻辑比较简单的跳转页来说（就是为了返回 App 用的），这个方法还是蛮实用的，对不对？嘻嘻～

<!-- {% endraw %} - for jekyll -->