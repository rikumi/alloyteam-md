---
title: Windows8 的 WPF 技术与 HTML5 的比较
date: 2012-11-12
author: TAT.Minren
source_link: http://www.alloyteam.com/2012/11/compare-wpf-and-html5-in-windows8-development/
---

Windows8 风格程序支持使用 WPF 和 HTML 两种方式进行编程。本人之前曾使用 WPF 开发过[概念版 QQ](http://im.qq.com/qq/gainian/ "概念版 QQ")，现在又在使用 HTML5。两种技术都略懂，略懂。所以将两者做了个比较。虽然 WPF 的命运多舛，应用不太广泛，但技术本身还是有很多亮点的。值得我们学习一下，开阔眼界。

严格说 WPF 与 Silverlight 都属于.Net 技术体系下新一代的界面技术，都使用标记语言 XAML 搭建界面，程序语可以选择 C# 等.Net 体系的语言。

本文为了方面将 WPF 与 Silverlight 统一称作 WPF，用 XAML 专门表示标记语言。用 HTML5 表示技术、HTML 表示语言。

# 1. XAML 与 HTML

     都是标记语言，客户端在运行时进行渲染。

     XAML 的程序虽然需要编译，但是 XAML 的处理是从文本格式转换为二进制格式，节省空间。

     HTML 一般在服务器端进行压缩，如 GZIP，在浏览器解压缩。目的也是节省空间。

# 2. 页面布局

     XAML 提供的布局类型较多，有 Table 布局，有横向或纵向的堆栈式，wrap 的流式布局，绝对位，还有 windows 特有的 dock 和 anchor。

     HTML5 中，大量用 Div，布局方式有绝对的，float 的，inline，chrome 等浏览器对 DIV 的 display 方式进行了扩展，可以实现横向或纵向的顺序排列。Table 方式就不用说了。HTML5 中的多列方式是独有的。

     两者都可以在运行时动态修改界面元素。WPF 还有原生的控件模版和数据绑定模版 Template，但是 HTML5 的 innerHTML 更灵活更方便。

# 3. 渲染逻辑

     两者类似，都有逻辑树、视觉树（显示树）的概念。同样也有 reflow 和 redraw 的概念。同样 reflow 也是最耗资源的。

# 4. 图形绘制

     位图方面两者都支持很多图片格式。不过浏览器可以天然支持 GIF，WPF 不行，但可以自行实现。微软好像一直和 GIF 有仇。

     矢量图方面，WPF 支持的形状种类更丰富。不过 HTML5 可以利用 DIV 的 boader、圆角的设置实现很多基本图形。两者都支持 Path。都支持 Canvas.

     渐变色，两者都支持，不过 WPF 一开始就很完善看，HTML5 在逐渐完善，毕竟浏览器不是一家的。

# 5. 样式

     HTML5 的 style，CCS3 什么的到家都很熟悉了。不多说了。

     WPF 中也有 style，style 可以有内建、外链和元素内的，外链的方式引用一个资源文件和 CSS 类似。不过 CSS 的选择器做得比较好，可以通过 id、class、元素类型、伪类、还有各种组合方式。毕竟 HTML 用的人更多，CSS 有机会发展的更完善。

     WPF 中对于资源可以实现完全的编程控制，HTML5 中可以用变成控制内联的 CSS，外联的就不行了。

# 6. 事件

     元素的事件都支持事件前的捕获与事件后的冒泡。

     都可以自定义事件。两者没有太大差别。

     WPF 有一个特有的机制叫触发器 trigger。trigger 与 CSS3 的 hover 伪类有些类似，但功能要多得多。trigger 的实现是基于事件模式的，只不过是将常用的场景进行了包装，从而达到了不用写 C# 代码就可以处理简单事件逻辑的功能。

# 7. 数据绑定

     WPF 所独有的。与触发器配合，可以打打减少编码量，很多功能不需要用 C#，只需要 XAML 就可以实现。

# 8. 3D 支持

     WPF 可以支持 3D。HTML5 标准中支持，但是目前支持的还不完善处于实验状态。WPF 中操作 3D 的编程界面比较友好，有高级 API。WebGL 提供的是底层 API，难度较高，不过也有很多 JS 类库进行了封装。

# 9. Transform

     WPF 只支持 2D 的 translate，rotate，skew，scale。HTML5 可以支持 3D 的 rotate 和 translate。但正如第八点提到的，WPF 有专门的 3DAPI，操作也不复杂。

# 10. 编程语言

     WPF 支持 C#、C++、VB 等多种.Net 语言。HTML5 支持 JavaScript。个人感觉.Net 的功能更强大，毕竟是客户端，几乎无所不能。但是脚本语言更灵活，可以在运行动态添加修改代码。

# 11. 数据

     WPF 中可以将数据作作为资源以文本形式放在 XAML 内。

     最新的 Chromium 也支持 DataList 了。<http://blog.chromium.org/2012/11/a-web-developers-guide-to-latest-chrome.html>

# 12. 多媒体

     视频、声音理论上两者都支持。WPF 支持更好，毕竟是客户端可以支持自己编写视频解码。HTML5 这方面比较慢。视频方面由于 H264 的专利问题几大浏览器互相博弈。声音方面更是缓慢，没有一种音频格式能够通吃所有浏览器，在声音播放时还有诸多问题。不过前景是光明的，只是时间问题。

# 13. WPF 中的特色

     依赖对象（DependcyObject）一套非常强大、霸气的面向对象模型。初期接触会觉得很晕，用熟了非常方便、非常爽。

# 14. HTML5 的特色

     MathML 算是一个特色。

# 15. 其他

     地理信息呀、WebWorker 呀、WebSockets 呀什么的可比较性不强。这里就不说。