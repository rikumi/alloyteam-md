---
title: Browser-Sync：响应式 Web 开发调试利器
date: 2014-02-14
author: TAT.Johnny
source_link: http://www.alloyteam.com/2014/02/browser-sync-responsive-web-development-and-debugging-tool/
---

[![QQ 截图 20140214151148](http://www.alloyteam.com/wp-content/uploads/2014/02/QQ截图20140214151148.png)](http://www.alloyteam.com/wp-content/uploads/2014/02/QQ截图20140214151148.png)

快速的移动 Web 开发模式，是我们团队一直在探索的一项内容。今天给大家介绍一种高效的开发方式，在开始内容前，我们先了解与分析一下目前主流开发模式的现状（本文聚焦响应式 Web 开发，这里主要指页面重构的工作）。

### 传统的 PC 模式

相信很多开发者还停留在使用 PC 调试的阶段，即在 PC 浏览器内调试好页面后，再到手机终端进行测试。

优势：这种开发模式基本没有优势可言，此行仅当占位符。。

缺点：我们知道，PC 与手机终端上的表现并不是完全如一的，PC 浏览器中看着完美的页面到手机中可能还是存在瑕疵，这时在手机微调的工作就显得非常繁琐了，因为要不断的修改源文件与刷新手机页面。另外，当你面对多个移动设备时，你的工作会更加耗时，并且一团糟。

### 远程调试模式

不少开发者也应该接触过 weinre（**WE**b **IN**spector **RE**mote），一个很强大的开发调试工具，支持 CSS、JS log、Timeline 等功能。此外还有不少远程调试工具，不久前我曾翻译过 addy osmani 的文章，[跨设备的移动端同步化测试](http://www.alloyteam.com/2013/12/synchronized-cross-device-testing/)，里面也介绍了不少有用的工具。

优势：各类远程调试工具各有专攻，有些脚本调试功能还是很优秀的。

缺点：多数工具有一个问题，就是并不支持所有平台与设备，而且配置工作稍显复杂。另外针对响应式开发，很多工具并未做考虑。上次的文章中介绍的 Ghostlab 是一款不错的工具，但是需要购买商业授权，还是有些不方便。

### 当响应式开发遇上调试

响应式设计这个概念，应该说从智能终端普及的时候就开始进入开发者的视线了。简单地说，响应式设计是使用 CSS 的 Media Query，为不同分辨率的设备编写不同的样式，从而达到一个页面在多个尺寸设备下展现最好的体验。虽然说主流的响应式设计主要是兼容 PC、平板、手机等设备，但单从手机来看就已经各种差异了，所以为了高效省时地进行响应式开发，我们希望可以同时在所有设备上看到效果。更多地，如果能同步进行操作（点击、滚动等）那必是极好的～

### Browser-Sync

今天介绍的 [Browser-Sync](http://www.browsersync.io/) 工具就是一款非常强大的工具，跨平台并且是免费开源的（基于 MIT）！Github [传送门](https://github.com/shakyShane/browser-sync)。

同步，是 Browser-Sync 最基本的功能，它可以跨设备同步操作行为，如滚动、点击、导航，以及填写表单。

于此同时，Browser-Sync 更大的亮点在于：

-   CSS 注入。Browser-Sync 可以 watch 你的 CSS 文件，当 CSS 文件有变更时，它可以动态注入到页面中，而不用将整个页面刷新一遍。
-   实时刷新。同样是 watch 源文件，可以在文件修改时，刷新所有设备中的页面。
-   静态 server。可以在本地架设静态资源的服务器。
-   更多地，Browser-Sync 还有 grunt 插件，集成到你的开发流程中。

更多的使用细节，可以查看 Github 上的[文档](https://github.com/shakyshane/grunt-browser-sync)与[示例](http://quick.as/klaqfq7e)。

### 搭配 Chrome Workspace

上面介绍到，Browser-Sync 的一大亮点在于可以 CSS 注入，即对 css 文件的编辑修改可以动态注入到所有设备中。搭配 Chrome 的 Workspace 功能，效率可以进一步提升！

Workspace 是 Chrome DevTools 的一项功能，现在已加入到 Chrome stable 版本。Workspace 可以将 Chrome 中的网络资源与本地资源进行映射与同步，即在 Chrome 中对 CSS 的修改可以同步写到本地 css 文件中。

这样一来，我们在 Chrome 中对 CSS 进行编辑，实时的编辑修改会同步到本地的 css 文件中，随之触发 Browser-Sync 的 watch 功能，这样样式的修改便会自动注入到所有的设备中了。

关于 Workspace 的设置这里就不详述了，可以参考官方的[设置指引](https://developers.google.com/chrome-developer-tools/docs/settings#workspace)，或者访问 ISUX 的[博客文章](http://isux.tencent.com/chrome-workspace.html)。

可以说 Browser-Sync 是一款很有潜力的工具，虽然现在它还是个命令行工具，但开发者也在计划集成更多的调试工具，如 Weinre 和 Chrome DevTools。

参考：<http://addyosmani.com/blog/browser-sync/>

发表在情人节 & 元宵节，祝大家节日快乐 : )