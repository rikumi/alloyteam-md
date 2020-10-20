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

在扩展中，可以看到列出的设备旁边的&lt;> 符号，如截图所示。点击它将启动 Weinre 的实例，从而可以让你检查和调试网页。

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image01.png)

_**出现在连接设备旁的&lt;> 符号是用来启动 Weinre 调试器的**_

Weinre 是一个 DOM 查看器和控制台，但缺乏 Chrome DevTools 的一些功能，如 JavaScript 调试，分析和网络瀑布图。虽然这是最基础的开发工具，但对于检查 DOM 和 JavaScript 的状态它是非常有用的。

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image13.png)

_**使用**\_\_**Weinre 调试**_

Edge Inspect 扩展也支持从连接设备生成截图。这对布局相关的测试很有帮助，也可以把截图分享给其他人。

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image04.png)

_**Edge Inspect 生成的截图**_

对于已经付费的 Adobe CC 用户，Edge Inspect 是一个很好的解决方案。然而它需要几个注意事项，如每个设备需要安装专用的客户端，因此可能要比 Ghostlab 多一些额外的设置工作。

### Remote Preview (Mac, Windows, Linux)

[Remote Preview](http://viljamis.com/blog/2012/remote-preview/) 是一个托管 HTML 页面和内容，并可以显示在多个设备上的开源工具。

Remote preview 会每隔 1100 毫秒发起一个 XHR 请求，去检查配置文件中的 URL 有没有发生变化。如果检测到变化，脚本会更新每个设备中 iframe 的 src 属性，把页面加载进来。如果没有检测到变化，脚本会保持轮询直到检测到变化。![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image16.gif)

**_跨 27 + 个设备同步测试 URL_**

把所有设备连接在一起，并且轻松地跨设备修改 URL，这非常棒。上手步骤：

1.  下载 Remote Preview，并把所有文件移到本地可访问的服务器中。服务器可以是 Dropbox，一个开发服务器，或者其他。
2.  在所有目标设备上加载刚才下载的 “index.html” 文件。这个页面会把你想测试的页面作为 iframe 加载进来。
3.  修改 “url.txt”（包括下载包里的和服务器上的），将需要测试的 URL 写入文件，并保存。
4.  Remote Preview 会感知到 url.txt 发生了变化，然后会自动刷新所有设备的页面，来加载你的 URL。

虽然 Remote Preview 是一个低保真的解决方案，但它是免费并且可用的。

### Grunt + Live-Reload (Mac, Windows, Linux)

[Grunt](http://gruntjs.com/)（和 [Yeoman](http://yeoman.io/)）是面向前端的脚手架和构建项目的命令行工具。如果你已经在用这些工具，并且安装了 [live-reload](http://livereload.com/)，那么升级你的工作流将会非常简单，跨设备测试不再是问题，任何编辑器的改动都会触发所有设备重新加载页面。

你可能已经使用 grunt server 命令了。在根目录运行你的项目起，它便一直监控着所有源文件，一旦发现有改动将会自动刷新浏览器窗口。这得归功于我们运行服务器中的 grunt-contrib-watch 任务。 如果你恰好使用过 Yeoman 作为项目脚手架，它会创建一个 Gruntfile，里面包含所有你在桌面上使用 live-reload 需要的内容。为了支持跨设备，你只需要改动一项属性 ——hostname（台式机上），它在 connect 的配置里。如果你注意到 `hostname` 被设置为 `localhost`，只需要改为 0.0.0.0。然后像往常一样执行 grunt server，一个新的窗口将会打开，里面展示着你的页面。URL 可能是长得这样的 [http://localhost:9000](http://localhost:9000/)（9000 是端口号）。 开启一个新的 tab 或终端，用 ipconfig | grep inet 命令找出系统 IP，比如 `192.168.32.20`。最后一步，打开移动设备上的浏览器，比如 Chrome，然后输入 IP 以及端口号，例如 `192.168.32.20`。 搞定！Live-reload 现在可以让你在台式机上对源文件的修改，同步在桌面和移动浏览器中刷新展示，帅！

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image09.jpg)

**_台式机的源文件修改会触发桌面和移动浏览器的实时刷新_**

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image15.gif)

**_跨设备实时刷新实战。任何编辑修改会实时展现出来，对于响应式设计测试很有帮助。_**

Yeoman 还有一个[移动项目生成器](https://github.com/yeoman/generator-mobile)可用，使得设置这个工作流程变成一件轻而易举的事。

### Emmet LiveStyle

Emmet LiveStyle 是一个浏览器、编辑器插件，它可以支持 CSS 的实时编辑展现。目前仅支持 Chrome，Safari 和 Sublime Text，支持双向的编辑（编辑器到留浏览器，反之亦然）。 Emmet LiveStyle 不会在你修改文件时强制浏览器完全刷新，取而代之的是使 CSS 的编辑横跨 DevTools 远程调试协议。这意味着无论在桌面版 Chrome 还是 Android 版 Chrome，都可以看见编辑内容的变化。（译者注：作者的意思是，不用实时刷新页面就可以看到源文件修改的效果，其实原理与 inspector 相同）LiveStyle 有一种 “多视图模式”，是为测试跨窗口及设备的响应式设计提供的。在多视图模式下，编辑器内的任何修改都会同步到所有的窗口中，开发者工具内的修改也是如此。 **为了实时编辑 CSS，需要安装 LiveStyle 包**

1.  启动 Sublime Text，并打开项目中的一个 CSS 文件
2.  开启 Chrome，并打开你想编辑 CSS 的那个页面
3.  打开开发者工具，以及 LiveStyle 面板，勾选 “Enable LiveStyle” 选项。注意：在编辑过程中要保持开启开发者工具，这样实时的编辑才可以生效。
4.  这一切都开启后，一个样式列表将会出现在左侧，你的编辑器文件出现在右侧。选择编辑器中的文件与浏览器关联起来。又搞定啦，切克闹！

现在，当你编辑，创建，打开或关闭文件，编辑器的文件列表将会自动更新。

![](http://www.html5rocks.com/static/images/screenshots/crossdevice/image07.gif)

**_Sublime 中对 CSS 的修改会立即在不同浏览器窗口和模拟器中展现_**

### 总结

跨设备测试目前依旧是一块新的领域，不断发展变化着，并不是出现新的工具。很庆幸现在已经有了一些免费或商用的工具，提供了跨多个设备进行测试的能力。 尽管如此，还是有很多可以改进的地方，我们鼓励你去思考如何进一步提高跨设备测试的工具。任何减少安装时间，提高跨设备的工作流程都是一个双赢的结果。

### 使用问题

也许我在用这些工具测试过程中，遇到最大的问题是设备会定期进入休眠状态。这并不是一个致命弱点，但经过一段时间会招人烦。如果可能的话，可以将设备不休眠作为一种解决方法，但是请记住，这会耗尽你的电池，除非总是插上电源。 我个人并未在 Ghostlab 的使用中遇到大问题。49 美元的价格有些人可能觉得有点高，但是请记住，如果你经常使用它，可以或多或少为自己支付一下。其中有关安装的最好的事情是不必担心安装和管理每个目标设备的客户端。同一个 URL 在任何地方都是有效的。 至于 Adobe Edge Inspect，我觉得每个设备都要安装和使用特定的客户端有点繁琐。我还发现它并没有始终如一地刷新所有连接起来的客户端，这意味着我不得不在 Chrome 扩展中自己做一些实现。它还需要订阅 Creative Cloud，仅限于加载在客户端的网站，而不是你的设备中浏览器加载的网站。这会限制你无法做一些精确的测试。 Remote Preview 的功能只如其名，但却非常轻量。这意味着任何超出跨设备刷新网站的能力，你都需要一个更先进的工具来满足。比如它无法同步滚动或点击。

### 推荐

如果你只是寻找一个免费的跨平台方案作为起步，我推荐使用 Remote Preview。对于在公司就职寻找付费解决方案的朋友，在我的体验中 Ghostlab 是最棒的，所以我推荐它，虽然它仅支持 Mac。（译者注：Windows 版本已经有啦，作者你不用忧桑了）对于 Windows 用户，Adobe Edge Inspect 是你最好的选择，除去一下奇怪的设置，它还是满足工作需要的。 Grunt 和 LiveStyle 对与日常的开发迭代，也是不错的。


<!-- {% endraw %} - for jekyll -->