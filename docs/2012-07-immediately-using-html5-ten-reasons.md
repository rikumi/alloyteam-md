---
title: 马上使用 HTML5 的十大理由
date: 2012-07-12
author: TAT.Kinvix
source_link: http://www.alloyteam.com/2012/07/immediately-using-html5-ten-reasons/
---

<!-- {% raw %} - for jekyll -->

> 为了让 HTML5 不再神秘，为了帮助犹豫不决的设计师和开发工程师跑步跟上快速发展的浪潮，我列出了为什么要马上使用 HTML5 的十大理由。

[![十大理由马上使用 HTML5](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/141702TYg.jpg "十大理由马上使用 HTML5")](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/141702TYg.jpg)

_你还没有用 HTML5 吗？_ 我想你有你的道理：它还没有被全面采纳；IE 不支持；你觉得现在就挺好，或是你还是热衷于写严格的 XHTML 代码。HTML5 是网络行业所需要的一场革命。事实上，不管你是否情愿，它就是未来。HTML5 并不深奥，用起来也不难。尽管它的标准还没有被完全采纳，还是有足够的理由**马上**就开始用它！_—— 对，就是在你刚读完这篇文章的时候！_

现在有很多的文章都在号召使用 HTML5，并大力宣传它的的好处。是的，这又是新的一篇。有这么多的文章，有苹果的推动，加上 Adobe 围绕它推出新的开发工具，而越来越多的网站投入其中，我还是要劝说那些出于各种原因迟迟未动或根本不想转变的设计师和工程师同行们。我想**主要的**问题在于，对很多人来说，它看起来还是一个神秘的事物。

为了揭开 **HTML5** 神秘面纱，帮助那些步履缓慢的前端后端人士赶上潮流，我列出了为什么要马上使用 HTML5 的十大理由。对于已经在用 HTML5 的人来说，这些可能并没有什么新鲜的，但希望还是它们对你在与同行间交流能有所启发。这里我用了倒数的方法，从第十项开始。

### 10 – 易用性

![accessibility](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/1417029ia.jpg "accessibility")

有两个主要原因使得 HTML5 制作的网站更易用：语义和 ARIA。新的 HTML 标签，像 &lt;header>、&lt;footer>、&lt;nav>、&lt;section>、&lt;aside> 等，使屏幕阅读器更容易读取内容。之前，屏幕阅读器无法判断某个 &lt;div> 是什么，即使你给它添加了 ID 或是类。有了新的语义标签，屏幕阅读器会更好的检查 HTML 文档，让使用它们的人有更好的体验。

ARIA 是一个 W3C 标准，主要用来给 HTML 文档中的元素指定特殊的 “角色”—— 通过角色的属性从底层为页面创建重要的标记，如页眉、页脚、导航或是文章。这在以前是被忽略的，也没有人去用，原因是它之前不是合法有效的。不过，HTML5 现在会去验证这些属性使其合法。另外，HTML5 有优先的内置角色，这使得分配角色变得轻而易举。更多关于 HTML5 和 ARIA 的深入讨论可以访问 [WAI](http://www.w3.org/WAI/intro/aria "http&#x3A;//www.w3.org/WAI/intro/aria")。

### 9 – 视频和音频支持

忘掉 Flash 播放器和其它的第三方媒体播放器吧，用新的 HTML5 &lt;video> 和 &lt;audio> 标签让你的视频和音频更容易播放。以前想要让你的媒体正确播放就如恶梦一般。你需要用 &lt;embed> 和 &lt;object> 标签，还得设置一大堆的参数，才能让内容可见并正常工作。你的媒体标签会变成一大堆混乱又让人困惑的代码。HTML5 的音视频标签基本上就像对待图像一样：&lt;video src=”url”/>。可是像高度、宽度、自动播放这些参数怎么办？不心担心，就像定义其它 HTML 元素那样就行了：&lt;video src=”url” width=”640px” height=”380px” autoplay/>。

就是这么出奇的简单。不过，因为旧的老爷级浏览器不喜欢我们的 HTML5 朋友，你还需要添上一些代码来让他们正常工作 —— 这也比 &lt;object> 和 &lt;embed> 标签来得简单：

<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div></td><td><div><div><code>&lt;</code><code>video</code> <code>poster</code><code>=</code><code>"myvideo.jpg"</code> <code>controls&gt;</code></div><div><code>&nbsp;</code><code>&lt;</code><code>source</code> <code>src</code><code>=</code><code>"myvideo.m4v"</code> <code>type</code><code>=</code><code>"video/mp4"</code> <code>/&gt;</code></div><div><code>&nbsp;</code><code>&lt;</code><code>source</code> <code>src</code><code>=</code><code>"myvideo.ogg"</code> <code>type</code><code>=</code><code>"video/ogg"</code> <code>/&gt;</code></div><div><code>&nbsp;</code><code>&lt;</code><code>embed</code> <code>src</code><code>=</code><code>"/to/my/video/player"</code><code>&gt;&lt;/</code><code>embed</code><code>&gt;</code></div><div><code>&lt;/</code><code>video</code><code>&gt;</code></div></div></td></tr></tbody></table>

参考资料：

-   [HTML5 Audio and Video: What you Must Know](http://net.tutsplus.com/tutorials/html-css-techniques/html5-audio-and-video-what-you-must-know/ "http&#x3A;//net.tutsplus.com/tutorials/html-css-techniques/html5-audio-and-video-what-you-must-know/")
-   [Audio and Video processing in HTML5](http://blog.gingertech.net/wp-content/uploads/2011/01/LCA_MM_AVProc2011/#slide1 "http&#x3A;//blog.gingertech.net/wp-content/uploads/2011/01/LCA_MM_AVProc2011/#slide1")
-   [How to Make Your Own Video Player On HTML5 Video](http://www.splashnology.com/article/how-to-make-your-own-video-player-on-html5-video/2654/?utm_source=html5weekly&utm_medium=email "http&#x3A;//www.splashnology.com/article/how-to-make-your-own-video-player-on-html5-video/2654/?utm_source=html5weekly&utm_medium=email")
-   [Using HTML5 Video and Audio in Modern Browsers](http://www.sitepoint.com/using-html5-video-and-audio-in-modern-browsers/ "http&#x3A;//www.sitepoint.com/using-html5-video-and-audio-in-modern-browsers/")
-   [Browserscene: Creating a 3D sound visualiser with WebGL and HTML5 audio](http://rawkes.com/blog/2011/08/06/browserscene-creating-a-3d-sound-visualiser-with-webgl-and-html5-audio?utm_source=html5weekly&utm_medium=email "http&#x3A;//rawkes.com/blog/2011/08/06/browserscene-creating-a-3d-sound-visualiser-with-webgl-and-html5-audio?utm_source=html5weekly&utm_medium=email")

### 8 – Doctype 文档类型

![html5 doctype](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/1417035vZ.jpg "html5 doctype")

<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div>1</div></td><td><div><div><code>&lt;!DOCTYPE html&gt;</code></div></div></td></tr></tbody></table>

没错，doctype，就这么多了。够简单吧？不需要拷贝粘贴一串看不明白的长代码，也不需要在 head 里加带各种标签属性。只要简单输入就好了。更重要的是，除了简单之外，它可以在各种浏览器下工作，即使是人人都拿它没有办法的 IE6。

### 7 – 更简洁的代码

如果你钟情于书写简单、优雅、易读的代码，那 HTML5 最适合不过。HTML5 可以让你写出简洁的，描述性的代码；带有语义的代码让你轻易地将内容与样式分开。看看下面这段简单的，带导航的 header 代码：

<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div></td><td><div><div><code>&lt;</code><code>div</code> <code>id</code><code>=</code><code>"header"</code><code>&gt;</code></div><div><code>&nbsp;</code><code>&lt;</code><code>h1</code><code>&gt;Header Text&lt;/</code><code>h1</code><code>&gt;</code></div><div><code>&nbsp;</code><code>&lt;</code><code>div</code> <code>id</code><code>=</code><code>"nav"</code><code>&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>&lt;</code><code>ul</code><code>&gt;</code></div><div><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>li</code><code>&gt;&lt;</code><code>a</code> <code>href</code><code>=</code><code>"#"</code><code>&gt;Link&lt;/</code><code>a</code><code>&gt;&lt;/</code><code>li</code><code>&gt;</code></div><div><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>li</code><code>&gt;&lt;</code><code>a</code> <code>href</code><code>=</code><code>"#"</code><code>&gt;Link&lt;/</code><code>a</code><code>&gt;&lt;/</code><code>li</code><code>&gt;</code></div><div><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>li</code><code>&gt;&lt;</code><code>a</code> <code>href</code><code>=</code><code>"#"</code><code>&gt;Link&lt;/</code><code>a</code><code>&gt;&lt;/</code><code>li</code><code>&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>&lt;/</code><code>ul</code><code>&gt;</code></div><div><code>&nbsp;</code><code>&lt;/</code><code>div</code><code>&gt;</code></div><div><code>&lt;/</code><code>div</code><code>&gt;</code></div></div></td></tr></tbody></table>

够简洁了吗？用 HTML5，还能更加简化，并有更明晰的含义：

<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div></td><td><div><div><code>&lt;</code><code>header</code><code>&gt;</code></div><div><code>&nbsp;</code><code>&lt;</code><code>h1</code><code>&gt;Header Text&lt;/</code><code>h1</code><code>&gt;</code></div><div><code>&nbsp;</code><code>&lt;</code><code>nav</code><code>&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>&lt;</code><code>ul</code><code>&gt;</code></div><div><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>li</code><code>&gt;&lt;</code><code>a</code> <code>href</code><code>=</code><code>"#"</code><code>&gt;Link&lt;/</code><code>a</code><code>&gt;&lt;/</code><code>li</code><code>&gt;</code></div><div><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>li</code><code>&gt;&lt;</code><code>a</code> <code>href</code><code>=</code><code>"#"</code><code>&gt;Link&lt;/</code><code>a</code><code>&gt;&lt;/</code><code>li</code><code>&gt;</code></div><div><code>&nbsp;&nbsp;&nbsp;</code><code>&lt;</code><code>li</code><code>&gt;&lt;</code><code>a</code> <code>href</code><code>=</code><code>"#"</code><code>&gt;Link&lt;/</code><code>a</code><code>&gt;&lt;/</code><code>li</code><code>&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>&lt;/</code><code>ul</code><code>&gt;</code></div><div><code>&nbsp;</code><code>&lt;/</code><code>nav</code><code>&gt;</code></div><div><code>&lt;/</code><code>header</code><code>&gt;</code></div></div></td></tr></tbody></table>

使用 HTML5，你可以用语义来描述你的内容，从而治好你的 div 和 class 强迫症。以前你得为所有的内容逐一定义 div，然后加上描述内容的 id 或者类。现在采用 &lt;section>、&lt;article>、&lt;header>、&lt;footer>、&lt;aside> 和 &lt;nav> 等 HTML5 标签，你可以让代码更干净，而且让 CSS 更有条理。

参考资料：

-   [HTML5 Boilerplate](http://html5boilerplate.com/ "http&#x3A;//html5boilerplate.com/")

### 6 – 更聪明的存储

![storage](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/141703ZFu.jpg "storage")

HTML5 最酷的一件事是新的本地存储功能。它有点像传统的 cookie 技术和客户端数据库的跨界组合。它比 cookie 的好处是允许跨多个窗口进行存储，它有更好的安全性和性能表现，数据在浏览器关闭之后仍能保留。因为它本质上是客户端的数据库，你不用担心 cookie 被用户删除。它已经被主流的浏览器采纳。

本地存储在很多方面来看都非常棒，不过这还只是 HTML5 提供的众多工具之一。这些工具有可能让你不用第三方插件就开发网页 app 应用。能够将数据保存在用户的浏览器让你能轻易实现这些 app 功能：保存用户信息、缓存数据、加载用户之前的应用状态等。

更多资源：

-   [Storing Data the Simple HTML5 Way (and a few tricks you might not have known)](http://html5doctor.com/storing-data-the-simple-html5-way-and-a-few-tricks-you-might-not-have-known/?utm_source=html5weekly&utm_medium=email "http&#x3A;//html5doctor.com/storing-data-the-simple-html5-way-and-a-few-tricks-you-might-not-have-known/?utm_source=html5weekly&utm_medium=email")
-   [Quick Tip: Learning About HTML5 Local Storage](http://net.tutsplus.com/tutorials/html-css-techniques/quick-tip-learning-about-html5-local-storage/ "http&#x3A;//net.tutsplus.com/tutorials/html-css-techniques/quick-tip-learning-about-html5-local-storage/")
-   [HTML5 Local Storage](http://www.kirupa.com/html5/html5_local_storage.htm "http&#x3A;//www.kirupa.com/html5/html5_local_storage.htm")
-   [5 Obscure Facts About HTML5 LocalStorage](http://htmlui.com/blog/2011-08-23-5-obscure-facts-about-html5-localstorage.html "http&#x3A;//htmlui.com/blog/2011-08-23-5-obscure-facts-about-html5-localstorage.html")

### 5 – 更好的交互性

我们都希望有更好的互动，我们都喜欢有更多动态效果的交互网站，可以响应用户的操作，允许用户欣赏并网站内容交互，而不是仅仅是看看而已。通过 HTML5 的绘图标签 &lt;canvas>，你可以实现大多数的交互操作和动态效果。

除了 &lt;canvas>，HTML5 还有很多强大的 API，使你能实现更好的用户体验，开发出更具动感，活力十足的应用。下面是部分原生 API 的列表：

-   拖放 (DnD)
-   离线存储数据库
-   浏览历史管理
-   文档编辑
-   定时媒体回放

关于这些 API 的更多信息以及 HTML5 的原生交互特性可以访问 [HTML5Doctor](http://html5doctor.com/ "html5doctor.com")。

参考资料：

-   [Hakim’s experiments](http://hakim.se/experiments "http&#x3A;//hakim.se/experiments")
-   [Ricardo’s works](http://mrdoob.com/ "http&#x3A;//mrdoob.com/")
-   [HTML5 Canvas and Audio Experiment](http://9elements.com/io/projects/html5/canvas/ "http&#x3A;//9elements.com/io/projects/html5/canvas/")
-   [Ball Pool](http://mrdoob.com/projects/chromeexperiments/ball_pool/ "http&#x3A;//mrdoob.com/projects/chromeexperiments/ball_pool/")
-   [HTML5 Video Destruction](http://craftymind.com/factory/html5video/CanvasVideo.html "http&#x3A;//craftymind.com/factory/html5video/CanvasVideo.html")
-   [Social Weather Mapping](http://smalltalkapp.com/#all "http&#x3A;//smalltalkapp.com/#all")

### 4 – 游戏开发

是的。你可以采用 HTML5 的 &lt;canvas> 标签来开发游戏。HTML5 提供了强大的、对移动友好的方式用来开发有趣的交互游戏。如果你以前开发过 Flash 游戏，你也会乐于做 HTML5 游戏。

参考资料：

-   [How to Build Asteroids with the Impact HTML5 Game Engine](http://msdn.microsoft.com/en-us/scriptjunkie/gg189187?utm_source=html5weekly&utm_medium=email "http&#x3A;//msdn.microsoft.com/en-us/scriptjunkie/gg189187?utm_source=html5weekly&utm_medium=email")
-   [Developing Multiplayer HTML5 Games with Node.js](http://smus.com/multiplayer-html5-games-with-node?utm_source=html5weekly&utm_medium=email "http&#x3A;//smus.com/multiplayer-html5-games-with-node?utm_source=html5weekly&utm_medium=email")
-   [How to write a BrikBloc game with HTML5 SVG and Canvas](http://css.dzone.com/articles/how-write-brikbloc-game-html5?utm_source=html5weekly&utm_medium=email "http&#x3A;//css.dzone.com/articles/how-write-brikbloc-game-html5?utm_source=html5weekly&utm_medium=email")
-   [How to make a simple HTML5 Canvas game](http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/?utm_source=html5weekly&utm_medium=email "http&#x3A;//www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/?utm_source=html5weekly&utm_medium=email")
-   [Html5 Games](http://html5-games.org/ "http&#x3A;//html5-games.org/")
-   [LimeJS, an HTML5 game framework](http://www.limejs.com/ "http&#x3A;//www.limejs.com/")

### 3 – 老式浏览器 / 跨浏览器支持

![browsers](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/141704mFX.jpg "browsers")

流行的现代浏览器（Chrome、Firefox、Safari、IE9 和 Opera）都支持 HTML5，而且 HTML5 doctype 可用于所有的浏览器，甚至包括老掉渣的 IE6。不过，老的浏览器可以识别 HTML5 doctype，并不意味着他们能够处理所有新的 HTML5 标签和特性。幸运的是，HTML5 会让问题简单化，具备友好的跨浏览器性能。针对不支持新标签的老式 IE 浏览器，我们只要简单添加 Javascript shiv 代码，就可以让它们使用新的元素：

<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div>1</div><div>2</div><div>3</div></td><td><div><div><code>&lt;!--[</code><code>if</code> <code>lt IE 9]&gt;</code></div><div><code>&nbsp;</code><code>&lt;script src=</code><code>"http://html5shiv.googlecode.com/svn/trunk/html5.js"</code><code>&gt;&lt;/script&gt;</code></div><div><code>&lt;![endif]--&gt;</code></div></div></td></tr></tbody></table>

参考资料：

-   [HTML5 & CSS3 READINESS](http://html5readiness.com/ "http&#x3A;//html5readiness.com/")
-   [When can I use](http://caniuse.com/ "http&#x3A;//caniuse.com/")
-   [HTML5 Cross Browser Polyfills](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills "https&#x3A;//github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills")
-   [Modernizr](http://www.modernizr.com/ "http&#x3A;//www.modernizr.com/")

### 2 – 移动，移动，还是移动！

移动技术变得越来越流行了！我知道，这是一个疯狂的假设，你们也许都在想 —— 移动会引领时尚。移动设备正在占领世界。移动设备的数量在一路攀升，这意味着越来越多的用户会使用他们的移动浏览器来访问你的网站或是应用。HTML5 是完备的移动网站和应用的开发工具。随着 Adobe 宣布移动版 Flash 的死亡，你现在完全可以依赖 HTML5 来做移动应用的开发。

移动浏览器已经完全采纳了 HTML5，所以开发移动项目就像给这些小尺寸的屏幕设计和构建显示内容一样简单 —— 这也促进了响应式设计的流行。这里还有一些很不错的 meta 标签可以用来做移动优化：

-   Viewport：允许你定义视口的宽度和缩放比例
-   全屏浏览：IOS 特定的数值，允许苹果设置按全屏模式显示
-   首页图标：类似桌面应用的 favicon，这些图标用于在 IOS 和安卓移动设备的首页上添加收藏

有关如何通过 HTML5 使你的网站 “移动化”，可以参考： [“Mobifying” Your HTML5 Site](http://www.html5rocks.com/en/mobile/mobifying.html "http&#x3A;//www.html5rocks.com/en/mobile/mobifying.html").

参考资料：

-   [Mobile HTML5](http://mobilehtml5.org/ "http&#x3A;//mobilehtml5.org/")
-   [Mobile Boilerplate](http://html5boilerplate.com/mobile "http&#x3A;//html5boilerplate.com/mobile")
-   [HTML5 Mobile Web Applications](http://teamtreehouse.com/library/projects/html5-mobile-web-applications "http&#x3A;//teamtreehouse.com/library/projects/html5-mobile-web-applications")

### 1 – 大势所趋，未来所向！

你应该今天就开始使用 HTML5 的首要原因是：它就是未来，千万不要掉队。HTML5 不会随意发展。随着越来越多的元素被采纳，越来越多的公司开始基于 HTML5 进行开发。HTML5 本质上还是 HTML，它并不可怕，你也不需要从头学习 —— 如果你正在用 XHTML strict 开发，你实际上已经是在用 HTML5 了，那何不享用它全面的功能？

你完全没有任何借口不用 HTML5。事实上，我倾向于使用 HTML5 的真正原因只是用它可以写更简洁的代码，所有其它的好处和有趣的功能我都还没有去试。不过，重要的是，你可以不用改变你的设计方式，马上就能开始。所以，开始用吧，不管你只是想让代码简单而更加语义化，或者是你准备开发一款会征服世界的移动游戏，谁知道呢？

### 重要的 HTML5 资源

[http://html5doctor.com](http://html5doctor.com/ "http&#x3A;//html5doctor.com")

[http://html5rocks.com](http://html5rocks.com/ "http&#x3A;//html5rocks.com")

[http://html5weekly.com/](http://html5weekly.com/ "http&#x3A;//html5weekly.com/")

[http://www.remysharp.com](http://www.remysharp.com/ "http&#x3A;//www.remysharp.com")

[http://www.script-tutorials.com](http://www.script-tutorials.com/ "http&#x3A;//www.script-tutorials.com")

本文由 [5 迷 3 道](http://5m3d.com/ "5 迷 3 道 | 有关 HTML5 和 CSS3 的真材实料")翻译自：[TOP 10 REASONS TO USE HTML5 RIGHT NOW](http://tympanus.net/codrops/2011/11/24/top-10-reasons-to-use-html5-right-now/ "TOP 10 REASONS TO USE HTML5 RIGHT NOW")。


<!-- {% endraw %} - for jekyll -->