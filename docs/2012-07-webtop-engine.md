---
title: Webtop 桌面 HTML5 WebApp 引擎
date: 2012-07-20
author: TAT.melody
source_link: http://www.alloyteam.com/2012/07/webtop-engine/
---

<!-- {% raw %} - for jekyll -->

**新版发布，敬请关注**

这是个什么东西？这是个用 web 开发桌面 app 的引擎，或者你可以简单的认为它是一个透明浏览器。可是它能做的不仅仅如此，它提供了大量的本地 api，使 web 的能力得到从所未有的提升，也使开发桌面 app 变得如此轻松简单。你有试想过自己开发一个浏览器吗？或者一个 qq。以前，或许你会说这太难了。可是，从今天开始，这一切都变得如此简单。这不是预想，这是已经实现的事情。

[![](http://www.alloyteam.com/wp-content/uploads/2012/07/1.png "1")](http://www.alloyteam.com/wp-content/uploads/2012/07/1.png)

**下载地址：**

-   <http://download.alloyteam.com/webtop.zip>

## 官方群：257960168

## 一、示例 Demo

这个引擎本来是无影无形。可是，人们总是希望能看到一个东西。所以，我做了一个初始界面，放了几个 demo 在上面。

[![](http://www.alloyteam.com/wp-content/uploads/2012/07/browser.png "browser")](http://www.alloyteam.com/wp-content/uploads/2012/07/browser.png)

**透明浏览器**

[![](http://www.alloyteam.com/wp-content/uploads/2012/07/music-widget.png "music widget")](http://www.alloyteam.com/wp-content/uploads/2012/07/music-widget.png)

**音乐 widget**

[![](http://www.alloyteam.com/wp-content/uploads/2012/07/ruler.png "ruler")](http://www.alloyteam.com/wp-content/uploads/2012/07/ruler.png)

**桌面尺子**

## 二、使用详解

说了这么多，或许你会急切的想知道该怎么开发，或许你会期盼一个教程。我很遗憾的告诉你，没有教程。因为这一切都是原有的东西，你只要会开发网页，你就能做 app。我只会给出我的一些建议。建议在开发时使用提供的透明浏览器 demo 进行调试，可以点击[![](http://www.alloyteam.com/wp-content/uploads/2012/07/setting1.png "setting")](http://www.alloyteam.com/wp-content/uploads/2012/07/setting1.png)右上角这个按钮打开控制台，[![](http://www.alloyteam.com/wp-content/uploads/2012/07/apps1.png "apps")](http://www.alloyteam.com/wp-content/uploads/2012/07/apps1.png)点击右上角这个按钮可以生成.app 文件，可以直接双击运行。或者你可以使用记事本打开.app 文件（注：不要设为默认打开），你就会明白原来一切是如此简单。

下面我给出一个尚未定稿的 api 说明文档：

**以下为 api 列表和浏览器事件的回调函数列表，api 较多，并未全部列举出来，可按 f12 打开控制台输入 webtop 查看全部 api**

-   webtop.close = function () {};// 关闭窗口

-   webtop.stopDrag = function () {};// 停止拖拽

-   webtop.setSize = function (w,h) { };// 设置窗口大小

-   webtop.move = function (x,y) { };// 移动窗口

-   webtop.max = function () {};// 最大化窗口

-   webtop.mini = function () {};// 最小化窗口

-   webtop.restore = function () {};// 还原窗口

-   webtop.drag = function () ｛};// 开始拖拽窗口

-   webtop.bringToTop = function () {};// 窗口移到最上层

-   webtop.focus = function () {};// 窗口聚焦

-   webtop.loadUrl = function (url) { };// 改变窗口的 url

-   webtop.getPos = function () {};// 获取窗口位置

-   webtop.getSize = function () {};// 获取窗口大小

-   webtop.enableDrag = function () {};// 允许全窗口拖拽

-   webtop.quit = function () {};// 退出进程

-   webtop.ready = function () {};// 调用后会调用窗口的 webtop.readyHandler () 函数

-   webtop.createWindow = function (url,exStyle,transparent,readyHandler) { };// 创建窗口

-   webtop.createWindowBase = function (url,exStyle,transparent,readyHandler) { };// 使用相对路径创建窗口

-   webtop.createBrowser = function (url) { };// 创建浏览器，会新起一个进程

-   webtop.browse = function (url) { };// 浏览网页

-   webtop.setTitle = function (title) { };// 设置窗口标题

-   webtop.getImage = function () {};// 把网页存为图片

-   webtop.showDev = function () {};// 显示调试工具

-   webtop.readFile = function (path) { };// 读取文件，只直接字符串

-   webtop.writeFile = function (path,s) { };// 写文件，只直接字符串

-   webtop.getSaveName = function (filename) { };// 打开保存对话框

-   webtop.runApp = function (appName) { };// 在当前进程运行 app

-   webtop.runAppEx = function (appName) { };// 在新起的进程运行 app

-   webtop.getOpenName = function (filename) { };// 打开 “打开” 对话框

-   webtop.reload = function () {};// 刷新页面

-   webtop.reloadIgnoreCache = function () {};// 强制刷新页面，不使用缓存

-   webtop.setTopMost ();// 窗口置顶

-   ……

**回调函数**

-   webtop.sizeHandler=function (w,h){}// 窗口大小改变后的回调函数
-   webtop.moveHandler=function (x,y){}// 窗口移动后的回调函数
-   webtop.closeHandler=function (){}// 窗口关闭后的回调函数
-   webtop.focusHandler=function (){}// 窗口聚焦的回调函数
-   webtop.activeHandler=function (x,y){}// 窗口激活的回调函数
-   webtop.dragHandler=function (fileList){}// 文件拖拽进来的回调函数
-   ……

**很遗憾，在这里我不能把一些高级功能及高级使用方法列出来。不过，如果您愿意，可以联系我，我会尽我所能给予帮助。请持续关注我们的博客～**

<http://www.alloyteam.com/2012/07/webtop-engine/>

**这一切，只是为了我们能生活得更好～**

<!-- {% endraw %} - for jekyll -->