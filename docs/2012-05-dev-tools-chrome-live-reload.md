---
title: 【腾讯 Web 前端工具系列 1】Live Reload – Chrome 扩展
date: 2012-05-03
author: TAT.Rehorn
source_link: http://www.alloyteam.com/2012/05/dev-tools-chrome-live-reload/
---

<!-- {% raw %} - for jekyll -->

### 摘要

 ** [Live Reload](https://chrome.google.com/webstore/detail/pccddenngcbofbojodpghgpbheckgddn?hl=zh-CN "安装 Live Reload")** 是一个旨在提高 web 前端开发者开发效率的 **chrome** 扩展。当你在心爱的编辑器中更新页面资源（html,js,css）的时候，Chrome 浏览器会自动获取最新的文件并重新载入，避免开发过程需要频繁按 F5 页面的烦恼。特别适合在双屏环境下进行 web 前端开发，不必在编辑器和浏览器之间不停的切换，大大提升开发体验。  

[![](http://www.alloyteam.com/wp-content/uploads/2012/05/x2scrap1.jpg "Live Reload")](http://www.alloyteam.com/wp-content/uploads/2012/05/x2scrap1.jpg)

### 前言

 在过去很长的一段时间内，Firefox 和 Firebug 绝对是前端开发者必备的神器，它们的确给我们开发调试带来极大便捷。近几年，Chrome 以其优良的架构、基于 JS 插件机制、跑分各种给力的表现，吸引众多普通者用户和开发者的眼球，都纷纷投入它的怀抱。最新版 Webkit 开发者工具已经基本能够胜任开发工作，相信已经有很多开发者已经从 Firefox 切换到 Chrome 进行开发。据不完全统计，[AlloyTeam](http://www.alloyteam.com/) 大部分成员已经把开发工具切换成 Chrome 了 ^\_^。

大家在进行前端页面开发初期的时候，都会出现以下杯具的场景：

 **场景 1：**切换到你喜爱的**编辑器**，在 HTML 页面添加一个节点，到 Css 中添加样式，切换到你喜爱的**浏览器**，按 F5 刷新，发现样式不满意，再次切换编辑器，之后循环...

 **场景 2：**在 HTML 页面添加一个节点，到 Css 中添加样式，切换到你喜爱的浏览器，打开开发者工具，对样式、节点进行微调，满意之后，**Ctrl+c，Ctrl+v** 把开发者工具的最新内容保存到源代码中...

  无论是场景 1 还是场景 2 都很令人蛋疼，F5 按多了（ps：chrome 的按 F5 之后都会卡个几秒，再发新请求刷新页面），就会想有没有办法偷懒呢？人家哲学家都说了，偷懒是推动人类技术发展的动力。如果能够在编辑代码后，在浏览器立刻看到效果，所见即所得，那可能可以在开发初期带来不错的开发体验，特别是那些有两个显示器的开发者，根本不需要切换。通过一番搜索，发现 Chrome Store 上面已有类似的应用，比如 Css Auto Reload，Css Refresh，Live Page 等，但是功能上觉得还是可以做得更完整些，于是，就考虑参考后另起炉灶，自己搞一个叫**[Live Reload](https://chrome.google.com/webstore/detail/pccddenngcbofbojodpghgpbheckgddn?hl=zh-CN)**。

### Live Reload 简介

  简介参考开头摘要，简单来说，就是一个帮助你在开发初期，让浏览器自动加载编辑器修改过的新文件，不用一直 F5 的的 chrome 插件。实现的思路很简单，就是监控服务器的 **HTML/JS/Css** 文件是否更新，如果就触发浏览器**自动重新加载**。

  Chrome Store 安装地址: <https://chrome.google.com/webstore/detail/pccddenngcbofbojodpghgpbheckgddn>

 Github 项目地址: <https://github.com/rehorn/chrome-live-reload>

### Live Reload 特性：

-   只需要安装一个 chrome 插件，不需要特殊的服务器端支持
-   启用实时更新模式后，能够自动重新载入 html/js/css 等资源更新
-   不启用实时更新模式，也能够通过按 **F9** 来手动重新载入 css 文件
-   支持**本域和跨域**资源的实时更新，可以通过配置项只监控本域资源更新
-   支持重新载入页面的时候，保留页面**滚动条位置**
-   页面的资源支持相对路径，绝对路径
-   可以通过 **F8** 来启用【显示页面节点 id,class 信息】功能，便于开发过程中在编辑器快速定位
-   提供启用 Live Reload 的页面管理界面
-   能够通过配置选择监控的资源类型和频率

[![](http://www.alloyteam.com/wp-content/uploads/2012/05/snapshot5.png "Live-reload-2")](http://www.alloyteam.com/wp-content/uploads/2012/05/Live-reload-2.png)

[![](http://www.alloyteam.com/wp-content/uploads/2012/05/snapshot2.png "live-reload-3")](http://www.alloyteam.com/wp-content/uploads/2012/05/live-reload-3.png)

### 暂不支持：

-   由于 chrome 安全机制，暂不支持通过 file:// 打开的页面
-   不支持页面中的 iframe 内资源的变化
-   无法监控 CSS 中使用 import 引入其它 CSS 的情况

### 使用方法

-   先**安装 Live Reload 扩展**，可以通过 chrome store 安装，也可以下载后拖入浏览器手动安装

-   安装后扩展栏会出现一个 **Live Reload 图标** 

-   把正在开发的页面资源部署一个 Web 服务器上

-   可以选择在本机架构 Apache/Nginx/IIS/Tomcat 等专业服务器

-   如有 Python 运行环境，可以通过在页面根目录执行 python -m SimpleHTTPServer 8999 快速架构服务器

-   可以选择配合 **Fiddler/Rythem** 等本地替换工具进行开发（强烈推荐 ^\_^）

-   在 chrome 地址栏内输入页面地址，可以通过点击 Live Reload 图标，来启用实时监控模式

-   在你最喜欢的编辑器中修改页面资源内容后，可以看到页面上已经更新

-   可以再次点击 Live Reload 图标，图标变灰，不启用实时监控模式

-   可以通过按 **F8** 来启用 / 隐藏 (F8/ESC)【显示页面节点 id,class 信息】功能，便于开发过程中在编辑器快速定位

-   可以通过按 **F9** 来手动更新页面 CSS 资源

-   可以在 Live Reload 图标右击，选择选项，可以在配置页面上面**设置相关参数**

-   设备允许的情况下，推荐使用**双显示器**进行工作，将 chrome 放在副屏幕，代码编辑器在主屏幕，编辑后立即以预览效果

-   设备不允许，可以选择使用小工具将 chrome **窗口置顶**或者将编辑器和 chrome 窗口进行**左右分栏**

ps:  前面有提到，使用 Chrome 进行开发的时候，按 F5 之后貌似都会卡个几秒（具体原因貌似没有 google 到，有了解的同学欢迎交流），再请求新的资源，最近测试发现使用 **location.reload()**的方式，能够大大改善卡住的现象，加快刷新的时间，推荐大家使用。

给大家提供一个 bookmarklet，把下面链接拖到 Chrome 收藏栏，点击试试 ^\_^

[QuickReload](javascript:location.reload();)

<!-- {% endraw %} - for jekyll -->