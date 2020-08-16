---
title: 调试时屏蔽 JavaScript 库代码 –Chrome DevTools Blackbox 功能介绍
date: 2015-01-09
author: TAT.yunsheng
source_link: http://www.alloyteam.com/2015/01/chrome-devtools-blackbox/
---

代码难免会有 Bug，每次我们在 Chrome 调试代码时，总是会进入各种各样的库代码（比如 jQuery、Zepto），但实际上很多时候我们并不希望这样，要是能把这些库代码 “拉黑” 多好啊。

广大码农喜闻乐见的事情，隔壁家火狐已经实现了的功能，而且也有人给 Chromium 提了 [Issue-407024](https://code.google.com/p/chromium/issues/detail?id=407024%20%E2%80%9CIssue%E2%80%9D)。自然 Chrome 最终也提供了这个功能 --**Blackbox**。**Blackbox** 允许屏蔽指定的 JS 文件，这样调试的时候就会绕过它们了。

[![blackboxing-unblackboxed](http://www.alloyteam.com/wp-content/uploads/2015/01/blackboxing-unblackboxed.png)](http://www.alloyteam.com/wp-content/uploads/2015/01/blackboxing-unblackboxed.png)

## 屏蔽文件后会怎么样

-   库代码（被屏蔽的文件）里抛出异常时不会暂停（当设置为 **Pause on exceptions** 时）
-   调试时 _Stepping into/out/over_ 都会忽略库代码
-   事件断点也会忽略库代码
-   库代码里设置的任何断点也不会起作用  
    最终的结果就是只会调试应用代码而忽略第三方代码（配置了 Blackbox 的代码）。

## 怎样屏蔽文件

有两个途径可以屏蔽 JS 文件：

### 1、开发人员工具的 Settings 面板

在设置面板可以配置屏蔽文件列表。

[![blackboxing-setting](http://www.alloyteam.com/wp-content/uploads/2015/01/blackboxing-setting.png)](http://www.alloyteam.com/wp-content/uploads/2015/01/blackboxing-setting.png)

打开开发人员工具的配置面板，在 **Sources** 下点击 **Manage framework blackboxing**，打开新窗口后，有如下集中方式配置：

-   输入文件名称
-   用正则表达式匹配
    -   包含特定名称的文件，比如`/backbone\.js$`
    -   特定类型的文件，比如`\.min\.js$`
-   输入整个文件夹，比如 `bower_components`

[![blackboxing-dialog](http://www.alloyteam.com/wp-content/uploads/2015/01/blackboxing-dialog.png)](http://www.alloyteam.com/wp-content/uploads/2015/01/blackboxing-dialog.png)

另外，需要暂时不屏蔽某个规则时，可以将 Behavior 改为 Disable。或者也可以直接删除（光标移到某行规则后会有个 X）。  
_Blackbox content scripts_ 是指屏蔽 Chrome 插件注入页面的脚本（新版 Chrome 增加的功能，笔者用的 39）。

### 2、在 **Sources** 面板上右键某个文件

在 **Sources** 面板目录里，或者编辑器里，右键点击 “Blackbox Script”，可以将屏蔽该文件，同时也会增加到 **Setting** 面板中的匹配规则里。  
[![blackboxing-nav-menu](http://www.alloyteam.com/wp-content/uploads/2015/01/blackboxing-nav-menu.png)](http://www.alloyteam.com/wp-content/uploads/2015/01/blackboxing-nav-menu.png)     ![blackboxing-text-menu](http://www.alloyteam.com/wp-content/uploads/2015/01/blackboxing-text-menu.png)

屏蔽某个文件后，会在编辑器里看到黄色的提示信息，点开 More，有功能说明，直接点击 “Unblackbox this script”，也能方便的取消屏蔽（这样会在匹配规则里直接删除，而不是 Disable 掉）  
[![blackboxing-expanded](http://www.alloyteam.com/wp-content/uploads/2015/01/blackboxing-expanded.png)](http://www.alloyteam.com/wp-content/uploads/2015/01/blackboxing-expanded.png)

_注意_：如果项目对 JS 文件做了 MD5 重命名的话，建议在 **Setting** 面板用正则设置匹配规则。

调试时，在调用堆栈时可以看到已经屏蔽的文件数量，默认是隐藏具体文件信息的，当然也可以点击 **Show** 展开显示完整。

[![blackboxing-call-stack](http://www.alloyteam.com/wp-content/uploads/2015/01/blackboxing-call-stack.png)](http://www.alloyteam.com/wp-content/uploads/2015/01/blackboxing-call-stack.png) [![blackboxing-stack-expanded](http://www.alloyteam.com/wp-content/uploads/2015/01/blackboxing-stack-expanded.png)](http://www.alloyteam.com/wp-content/uploads/2015/01/blackboxing-stack-expanded.png)

## 总结

**Blackbox** 功能配置简单、使用方便，可以在调试时减少无关代码对开发者的干扰，是个很有用的小技巧。  
使用时如果有任何建议 / 意见可以给 `Chromium` 提 [Issue](http://crbug.com/)

参考

-   [官方说明](https://developer.chrome.com/devtools/docs/blackboxing "\[官方文档] Blackbox JavaScript Source Files")