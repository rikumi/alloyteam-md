---
title: 基于 Javascript 和 HTML5 的 Flash Player 播放器 (Mozilla)
date: 2012-06-08
author: TAT.Kinvix
source_link: http://www.alloyteam.com/2012/06/javascript-and-html5-flash-player-is-mozilla/
---

<!-- {% raw %} - for jekyll -->

面对 HTML5 技术的发展，Flash 节节败退，首先是 iOS 设备不支持 Flash，后来 Adobe 又宣布将[终止移动设备上](http://www.iteye.com/news/23316)、[Linux 平台上](http://www.iteye.com/news/24740) Flash Player 的开发工作，根据 Adobe 发布的 [Flash 路线图](http://www.iteye.com/news/24320)来看，未来 Flash 将逐渐消弱普通的需求，专注于游戏和增值视频领域。  

**但从目前的技术来看，HTML5 还远远替代不了 Flash 的地位。**目前互联网上大约 80% 的在线视频是 Flash 格式。

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/06/064952ssb.jpg)

不过，**最近 Firefox 浏览器的缔造者 Mozilla 推出了一个新的解决方案，即使用 HTML5 技术来渲染和播放 Flash 文件。**

该项目名为 [Shumway](https://github.com/mozilla/shumway)，托管在 Github 上，这是一个 “**基于 JavaScript 的 Flash 虚拟机和运行时”。Mozilla 称这是一个 HTML5 技术实验，目的是探索并构建一个基于 JavaScript 的、可靠有效的 SWF（Flash 文件格式）渲染器，而无需本地代码支持。**

该项目由社区驱动，由 Mozilla 提供支持。Mozilla 表示，**如果实验成功，会在 Firefox 中整合该技术。**

之前谷歌、Adobe 都推出了[将 Flash 文件转换成 HTML5 格式的工具](http://www.iteye.com/news/21879)，但是转换都会存在一些不尽人意的地方。相比这些工具，Mozilla 的这个方案更实用，直接在浏览器中集成了替代 Flash Player 的播放器，且无需插件。**如果该技术成熟，将会加速 Flash Player 的终结。**

Shumway 源码：<https://github.com/mozilla/shumway>

<!-- {% endraw %} - for jekyll -->