---
title: 【译】跨设备的移动端同步化测试
date: 2013-12-16
author: TAT.Johnny
source_link: http://www.alloyteam.com/2013/12/synchronized-cross-device-testing/
---

<!-- {% raw %} - for jekyll -->

原文：<http://www.html5rocks.com/en/tutorials/tooling/synchronized-cross-device-testing/>

作者：[Addy Osmani](http://www.html5rocks.com/profiles/#addyosmani)

译者按：在突如其来的移动热潮下，web 开发者似乎回到了早期兼容或 hack 各种浏览器的暗黑时代。唯一不同的是，现在不是兼容浏览器而是兼容设备，这比起在同一台 PC 上兼容不同浏览器要痛苦得多，另外由于终端尺寸的差异，涉及的兼容性问题会显得更加复杂。因此，跨终端的同步化测试工具是急切需要的，这意味着工作效率的成倍提升！感谢 Addy 大神的文章，给出了这个领域的多个选择，希望对大家有所帮助，遇到问题可以微博交流（[@碧青\_Kwok](http://weibo.com/lovelovelt)）~ 最后，与往常一样，转载请注明出处: )

\\=========================== 译文分割线 ============================

### 简介

如果你是一个面向多设备的 Web 开发者，你可能会使用多个不同的设备及配置，来测试网站和 web app。同步化测试在这可以帮上大忙，它可以同一时间自动地在多个设备和浏览器执行相同的交互操作。 同步化测试可以帮助我们解决两个特别耗时的问题：

-   **保持所有设备同步你想测试的 URL。**手动地在每个设备上加载 URL 太 out 了，不仅需要更长的时间，并且更容易错过回归。
-   **同步交互。**多设备同步地加载一个页面对于可视化测试已经非常棒了，但是对于交互测试，我们也非常希望设备之间能够同步滚动，点击等交互行为。

值得庆幸的是，除了直接访问目标设备，还有一些工具，它们旨在改善从桌面到移动设备的工作流。在这篇文章中，我们将着眼于 Ghostlab，Remote Preview，Adobe Edge Inspect 和 Grunt 这些工具。

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image10.jpg)

_这是我的办公桌。好吧，它曾经是我的办公桌。现在它只是个移动博物馆。_

### 工具

### GhostLab (Mac)

（译者注：翻译时，官网已经有支持 Windows 32 位与 64 位的版本下载，其交互比 Mac 版的更好哦）

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image00.png)

**_GhostLab for Mac by Vanamco_**

[Ghostlab](http://vanamco.com/ghostlab/) 是一款为在多个设备上进行站点和 Web App 同步化测试，而设计的商业化 Mac 应用程序（49 刀）。它只需很少的设置就可以让你实时同步：

-   点击
-   导航
-   滚动
-   表单填写（例如登录表单，注册）

这使得在多个设备上测试网站端对端的用户体验非常简单。一旦在设备上的浏览器打开网页，任何导航的更改（包括刷新）都会导致与之相连的其他设备可以立即刷新。Ghostlab 支持监控本地目录，所以当你保存编辑本地文件时，页面也会自动刷新，一切都总是保持同步！ 搭建 Ghostlab 是一个轻松的过程。要开始使用，下载、安装和运行[试用版](http://awesome.vanamco.com/downloads/ghostlab/latest/Ghostlab.dmg)（或完整版，如果你是糕富帅）。接着要将 Mac 和需要测试的设备连接到同一个 Wifi 下，这样它们才可以相互感知。 一旦 Ghostlab 开始运行，你可以点击 “+” 添加用于测试的 URL，或者干脆从您的浏览器地址栏中拖过来。亦或者，通过把一个想测试的本地文件夹拖到主窗口，来创建一个新的站点条目。在这篇文章中，我真实地测试了 <http://html5rocks.com，很有趣不是吗？>

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image06.png)

_**选择一个 URL 或本地目录**_

 然后，通过点击网站名称旁边的 “>” 按钮（译者注：类似于播放按钮，实际为一个向右的封闭三角形）来启动新的 Ghostlab 服务器。这将启动一个新的服务器，可用于你的网络专用 IP 地址（如 [http://192.168.21.43:8080）。（译者注：ip](http://192.168.21.43/:8080）。（译者注：ip) 地址在客户端的右下角处，更有二维码入口，非常方便）

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image11.jpg)

_**Ghostlab 服务器在本地进行******网址******内容的**\_\_**代理**_

在这里，我已经连接了的 Nexus4，并在 Android Chrome 浏览器中使用 Ghostlab 给出的 IP 地址。这就是所有我所做的。Ghostlab 不像其他一些解决方案，需要为每一个设备安装专用的客户端，这意味着你可以更快地开始测试。 连接到 Ghostlab URL 的所有设备，将被添加到 Ghostlab 主窗口右边栏的 “已连接客户端” 列表中。双击设备名称会显示额外的详细信息，如屏幕大小，操作系统等。现在应该能够测试导航和同步的点击了，耶！ Ghostlab 还能显示一些已连接设备的信息，如 UA 字符串，视口的宽度和高度，设备的像素密度，高宽比等。任何时候，都可以点击条目旁边的设置齿轮按钮，来手动更改需要检测的 URL。这将打开一个类似下图的配置窗口：

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image05.png)

_**配置监控文件，HTTP 首部，字符集等。**_

  现在我可以选择一个其他连接的设备，点一下 HTML5ROCKS 周边不同的链接，此时的导航在我的桌面版 Chrome（在这里我输入相同的 Ghostlab 的 URL），以及我所有的设备上，都是保持同步的。 更棒的是，Ghostlab 有一个选项，允许所有链接都通过该网络代理。这样，相比于通过点击 <http://192.168.21.43:8080/www.html5rocks.com> 导航到 [www.html5rocks.com/en/performance（举个栗子），Ghostlab](http://www.html5rocks.com/en/performance（举个栗子），Ghostlab) 可以只将此链接转换为 <http://192.168.21.43/www.htm5rocks.com/en/performance，从而解决了其他解决方案所遭受的跨设备自动更新问题，因此导航在所有设备之间是无缝的。> 想要开启这个功能， 勾选 "Content Loading" tab 下的 "Load all content through Ghostlab" 选项。

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image08.png)

_**Ghostlab 可以 rewrite URL，因此所有资源都通可以通过 Ghostlab 代理。这对于同步导航多个页面非常有用。**_

看下实际效果：

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image18.jpg)

_**在 Android, Windows 8 and Firefox OS 手机上使用 Ghostlab 进行同步化测试**_

Ghostlab 能够在任何支持的浏览器加载任何数目的网站。这不仅可以测试网站在不同的分辨率的表现，还可以测试代码在不同浏览器和平台上的行为。耶！

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/ghostlabanim.gif)

**_在所有测试设备_\*\***_同步滚动，点击和导航_\*\*

Ghostlab 允许你配置项目工作区的设置，可以指定是否对目录内容的修改进行监视，并在检测到更新时进行刷新。这意味着任何改变将导致所有连接的客户端进行刷新，无需再手动刷新！

你可能想知道 Ghostlab 还有什么能力。虽然它不像瑞士军刀般全能，但也支持在连接的设备上进行远程代码检查。通过主界面，在任何设备上名双击会弹出一个 “调试” 选项，将启动一个版本的 [Chrome DevTools](http://devtools.chrome.com/) 让你捣腾。

Ghostlab 通过捆绑 Weinre 远程 Web 检查器，让你可以调试连接设备上的脚本和调整样式。类似与 Chrome for Android 的[远程调试](https://developers.google.com/chrome-developer-tools/docs/remote-debugging)体验，你可以选择元素，运行一些性能分析和调试脚本。

总之，我留下的印象是我可以快速地使用 Ghostlab 进行日常的跨设备测试。如果你是一个自由职业者，你可能会发现商业执照的成本有点高（请参阅下面的更多选项）。不过，我还是很乐意为您推荐 Ghostlab。

### Adobe Edge Inspect CC (Mac, Windows)

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image12.png)

_**Adobe's Creative Cloud 包括 Edge Inspect**_

Adobe Edge Inspect 是 Adobe Creative Cloud 包的一部分，但也可免费试用。它可以让你驱动多个 iOS 和 Android 设备的 Chrome（通过 Adobe Edge Inspect 的 Chrome 扩展），如果浏览到特定的 URL，所有连接的设备将保持同步。

若要使用，首先注册一个 [Adobe Creative Cloud](http://creative.adobe.com/) 帐户，或登录到现有帐户 (如果你已经注册过)。接下来，从 Adobe.com 下载并安装 [Edge Inspect](https://creative.adobe.com/inspect)（目前仅适用于 Mac 和 Windows，但没有 Linux - 抱歉！）。Edge Inspect 的[文档](http://forums.adobe.com/docs/DOC-2535)是非常有帮助的，可以常备在手。

安装后，安装 Edge Inspect 的 Chrome 扩展，这样就可以在连接的设备之间同步浏览。

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image03.png)

**_Edge Inspect CC Chrome 扩展_**

同时需要给每个需要链接的设备安装 Edge Inspect 客户端，幸好现在有支持 [iOS](http://www.adobe.com/go/edgeinspect_ios), [Android](http://www.adobe.com/go/edgeinspect_android) 和 [Kindle](http://www.adobe.com/go/edgeinspect_amazon) 的客户端。

安装客户端的同时，我们可以开始准备监测页面了。你得保证所有设备都连接在同一网络下，这样才能正常工作。

启动桌面上的 Edge Inspect、Chrome 中的 Edge Inspect 插件，以及移动设备的 Edge Inspec 应用（如下图）：

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image02.png)

**_向 Edge Inspect 扩展连接一个设备_**

现在可以在台式机上导航到 HTML5Rocks.com 网站，我们的移动设备将自动会导航到相同的页面。

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image17.jpg)

**_跨多个连接设备的 URL 的导航_**

在扩展中，可以看到列出的设备旁边的 &lt;> 符号，如截图所示。点击它将启动 Weinre 的实例，从而可以让你检查和调试网页。

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image01.png)

_**出现在连接设备旁的 &lt;> 符号是用来启动 Weinre 调试器的**_

Weinre 是一个 DOM 查看器和控制台，但缺乏 Chrome DevTools 的一些功能，如 JavaScript 调试，分析和网络瀑布图。虽然这是最基础的开发工具，但对于检查 DOM 和 JavaScript 的状态它是非常有用的。

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image13.png)


<!-- {% endraw %} - for jekyll -->