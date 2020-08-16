---
title: Internet Explorer 10 新特性及开发者指南
date: 2012-03-12
author: TAT.Kinvix
source_link: http://www.alloyteam.com/2012/03/internet-explorer-10-%e5%bc%80%e5%8f%91%e8%80%85%e6%8c%87%e5%8d%97/
---

<!-- {% raw %} - for jekyll -->

Internet Explorer 10 开发者指南让你提前了解下一版本的 Windows Internet Explorer 中即将推出的开发者功能，以及最新的 HTML5、JavaScript 和级联样式表级别 3 (CSS3) 功能（可供 Windows 8 Consumer Preview 中使用 JavaScript 的 Metro 风格的应用程序的开发者使用）。通过使用本指南中的文档和示例，开发者和设计者就可以做好准备使用这些新功能了。

Internet Explorer 10 当前不适用于 Windows 7。适用于 Windows 7 的最新版本是 2011 年 6 月 29 日推出的 Internet Explorer 10 Platform Preview Build 2。因此，你将注意到，本指南中提到的较新功能对于面向 Windows 7 的最新版本的 Internet Explorer 10 Platform Preview 尚不可用。有关对于 Internet Explorer Platform Preview Build 2 的更改的列表，请参阅[修订历史记录](http://msdn.microsoft.com/zh-cn/library/ie/hh673560.aspx)。有关所有新功能的全面列表，请参阅下文。

Internet Explorer 10 在发布之后将适用于 Windows 7、Windows 8 Consumer Preview、Windows Server 2008 R2 和 Windows Server 8 Beta。

此处列出了 Internet Explorer 10 中新增的开发者功能。除了阅读本指南外，还请确保参阅[发行说明](http://go.microsoft.com/fwlink/p/?LinkID=190919)了解安装信息和已知问题，以及 [Internet Explorer Test Drive](http://go.microsoft.com/?linkid=9707143) 网站获取新的演示和示例。你还可以通过访问 [Internet Explorer 开发者中心](http://go.microsoft.com/fwlink/p/?LinkID=58649)和 [MSDN 库](http://go.microsoft.com/fwlink/p/?LinkId=214816)获取有关开发者功能的详细技术信息。

这个预发行版的 Internet Explorer 10 — 以及使用 JavaScript— 的 Metro 风格的应用程序包含对于下列开发者功能的支持。除非特别说明，否则这些功能在 Internet Explorer 10 中和使用 JavaScript 的 Metro 风格的应用程序中的工作方式相同。  

-   [兼容性](http://msdn.microsoft.com/zh-cn/library/ie/hh673527.aspx)
    -   [用户代理字符串](http://msdn.microsoft.com/zh-cn/library/ie/hh673527.aspx#User-agent_String)
    -   [兼容性模式](http://msdn.microsoft.com/zh-cn/library/ie/hh673527.aspx#compat_modes)
    -   [可互操作的 Quirks 模式](http://msdn.microsoft.com/zh-cn/library/ie/hh673527.aspx#Interoperable_Quirks_Mode)
-   [CSS](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx)

    -   [高级布局](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#advanced_layout)
        -   [CSS3 排除项](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#pos_floats)
        -   [CSS3 区域](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#css_regions)
        -   [CSS3 多列布局](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#css_multicol)
        -   [CSS3 弹性框（“Flexbox”）布局](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#css_flexbox)
        -   [CSS3 网格对齐](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#grid_alignment)
        -   [CSS 设备适应](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#device_adaptation)

    -   [视觉效果](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#vis_effects)
        -   [CSS3 3D 变换](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#css3_3d_transforms)
        -   [CSS3 动画](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#css_animations)
        -   [CSS3 字体](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#css3_fonts)
        -   [CSS3 渐变](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#css3_gradients)
        -   [CSS3 过渡](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#css3_transitions)
        -   [CSS3 文本](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#css3_text)
            -   [文本投影](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#text_drop_shadows)
            -   [断字](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#hyphenation)

    -   [平移和缩放](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#panning_and_zooming)

    -   [去除样式表限制](http://msdn.microsoft.com/zh-cn/library/ie/hh673536.aspx#removal_of_style_sheet_limits)
-   [DOM](http://msdn.microsoft.com/zh-cn/library/ie/hh673538.aspx)
    -   [高级命中测试 API](http://msdn.microsoft.com/zh-cn/library/ie/hh673538.aspx#Advanced_Hit_Testing_APIs)
    -   [createContextualFragment 方法](http://msdn.microsoft.com/zh-cn/library/ie/hh673538.aspx#createContextualFragment)
    -   [CSSOM 中的浮点值](http://msdn.microsoft.com/zh-cn/library/ie/hh673538.aspx#Floating-point_Values_in_CSSOM)
    -   [媒体查询侦听器](http://msdn.microsoft.com/zh-cn/library/ie/hh673538.aspx#Media_Query_Listeners)
    -   [指针和笔势事件](http://msdn.microsoft.com/zh-cn/library/ie/hh673538.aspx#Pointer_and_Gesture_Events)
    -   [XMLHttpRequest 改进](http://msdn.microsoft.com/zh-cn/library/ie/hh673538.aspx#xhr_enhance)
-   [ECMAScript 5](http://msdn.microsoft.com/zh-cn/library/ie/hh673540.aspx)
    -   [ECMAScript 5 严格模式](http://msdn.microsoft.com/zh-cn/library/ie/hh673540.aspx#es5_strict_mode)
-   [F12 开发者工具](http://msdn.microsoft.com/zh-cn/library/ie/hh673541.aspx)
    -   [F12 开发者工具中的 Web Workers 调试功能](http://msdn.microsoft.com/zh-cn/library/ie/hh673541.aspx#Debugging_Web_Workers_in_F12_tools)
-   [HTML5](http://msdn.microsoft.com/zh-cn/library/ie/hh673546.aspx)
    -   [异步执行脚本](http://msdn.microsoft.com/zh-cn/library/ie/hh673546.aspx#Asynchronous_Script_Execution)
    -   [应用程序缓存 API（以下简称 “AppCache”）](http://msdn.microsoft.com/zh-cn/library/ie/hh673546.aspx#Application_Cache_API_AppCache)
    -   [拖放 API](http://msdn.microsoft.com/zh-cn/library/ie/hh673546.aspx#Drag_and_Drop_APIs)
    -   [文件 API](http://msdn.microsoft.com/zh-cn/library/ie/hh673546.aspx#File_API)
    -   [表单](http://msdn.microsoft.com/zh-cn/library/ie/hh673546.aspx#HTML5_Forms)
    -   [历史记录](http://msdn.microsoft.com/zh-cn/library/ie/hh673546.aspx#history)
    -   [分析](http://msdn.microsoft.com/zh-cn/library/ie/hh673546.aspx#parsing)
    -   [沙盒](http://msdn.microsoft.com/zh-cn/library/ie/hh673546.aspx#sandbox)
    -   [拼写检查](http://msdn.microsoft.com/zh-cn/library/ie/hh673546.aspx#Spellcheck)
    -   [视频](http://msdn.microsoft.com/zh-cn/library/ie/hh673546.aspx#html5_video)
    -   [Web Workers](http://msdn.microsoft.com/zh-cn/library/ie/hh673546.aspx#Web_Workers)
    -   [通道消息](http://msdn.microsoft.com/zh-cn/library/ie/hh673546.aspx#channel_messaging)
    -   [WebSockets](http://msdn.microsoft.com/zh-cn/library/ie/hh673546.aspx#websockets)
-   [IndexedDB](http://msdn.microsoft.com/zh-cn/library/ie/hh673548.aspx)
-   [SVG](http://msdn.microsoft.com/zh-cn/library/ie/hh673562.aspx)
    -   [SVG 筛选器](http://msdn.microsoft.com/zh-cn/library/ie/hh673562.aspx#filters)
-   [性能](http://msdn.microsoft.com/zh-cn/library/ie/hh673556.aspx)
    -   [requestAnimationFrame 方法](http://msdn.microsoft.com/zh-cn/library/ie/hh673556.aspx#requestAnimationFrame)
    -   [页面可见性](http://msdn.microsoft.com/zh-cn/library/ie/hh673556.aspx#Page_Visibility)
    -   [setImmediate 方法](http://msdn.microsoft.com/zh-cn/library/ie/hh673556.aspx#setimmediate)
    -   [导航计时](http://msdn.microsoft.com/zh-cn/library/ie/hh673556.aspx#Navigation_Timing)
-   [修订历史记录](http://msdn.microsoft.com/zh-cn/library/ie/hh673560.aspx)

<!-- {% endraw %} - for jekyll -->