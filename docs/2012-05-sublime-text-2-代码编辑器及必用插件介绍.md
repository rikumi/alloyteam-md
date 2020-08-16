---
title: Sublime Text 2 代码编辑器及必用插件介绍
date: 2012-05-02
author: TAT.Kinvix
source_link: http://www.alloyteam.com/2012/05/sublime-text-2%e4%bb%a3%e7%a0%81%e7%bc%96%e8%be%91%e5%99%a8%e5%8f%8a%e5%bf%85%e7%94%a8%e6%8f%92%e4%bb%b6%e4%bb%8b%e7%bb%8d/
---

最近试用了一款新的编辑器 [Sublime Text 2](http://www.sublimetext.com/)，跨平台，Sublime Text 2 是一个轻量、简洁、高效、跨平台的编辑器，方便的配色以及兼容 vim 快捷键等各种优点博得了很多前端开发人员的喜爱，我一用就爱上他了，本文推荐一些好用的插件和扩展。

![sublimetext2](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/024014NkH.png)

Windows 版

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/0240169ED.png "Mac OS X")

Mac OS X 版

一开始是由于他的迷你地图模式而吸引我的注意力的，这个迷你地图可以概览整个文件。实现快速跳转。这个是个亮点，在其他编辑器中都没有见过此类功能。然而试用了之后我很快发现，迷你地图功能可能未必好用，但真正让我觉得舒服的是，他的 zencoding 支持的非常完美，直接有实时预览功能。

此外他的窗口分组、项目管理、扩展工具、代码折叠方面都非常不错。他还直接支持 vim 模式呢！  
我之前在微博上推荐 Sublime Text 2 后，引来好多 vimer 的鄙视。说比 vim 差多了。我也无意参与这类争论。一个是现代兵器，一个是上古神器。自己用的爽就行了，何必与人争呢。

总之这个编辑器非常适合我这样喜欢 vim 的快捷键，又不喜欢 vim 复杂的配置的人。轻松上手功能强大。

目前他唯一的缺点是，无法打开 gb2312 之类的东亚编码，打开都会乱码。但是打开 utf-8 编码的文件毫无问题，可以正常显示和输入中文。

如果你也心动了，可以点下面的地址来下载最新版。Sublime Text 2 是收费软件，售价 $59，但可以无限期试用，仅仅会偶尔在保存文件时弹出提示框而已，编码过程中不会出现任何干扰。

beta 版：  
[http://www.sublimetext.com/2](http://www.sublimetext.com/dev)  
大约 1 个月更新一次。

dev 版：  
<http://www.sublimetext.com/dev>  
隔三差五更新，非常频繁，慎用……

另外建议依次拜读 [Lucifr](http://lucifr.com/) 的三篇博客  
[Sublime Text 2 入门及技巧](http://lucifr.com/139225/sublime-text-2-tricks-and-tips/)  
[ZenCoding in Sublime Text 2](http://lucifr.com/139231/zencoding-in-sublime-text-2/)  
[Sublime Text 2 实用快捷键 \[Mac OS X\]](http://lucifr.com/139235/sublime-text-2-useful-shortcuts/)

Sublime Text 2 基本上是共享软件，免费版和收费版基本无区别，只是偶尔会弹框让你去购买，这个基本不影响使用。

## 安装 Sublime Text 2 插件的方法：

### 1. 直接安装

安装 Sublime text 2 插件很方便，可以直接下载安装包解压缩到 Packages 目录（菜单 ->preferences->packages）。

### 2. 使用 Package Control 组件安装

也可以安装 package control 组件，然后直接在线安装：

1.  按 Ctrl+\`调出 console
2.  粘贴以下代码到底部命令行并回车：  
    `import urllib2,os;pf='Package Control.sublime-package';ipp=sublime.installed_packages_path();os.makedirs(ipp) if not os.path.exists(ipp) else None;open(os.path.join(ipp,pf),'wb').write(urllib2.urlopen('http://sublime.wbond.net/'+pf.replace(' ','%20')).read())`
3.  重启 Sublime Text 2。
4.  如果在 Perferences->package settings 中看到 package control 这一项，则安装成功。

如果这种方法不能安装成功，可以[到这里下载文件手动安装](http://wbond.net/sublime_packages/package_control/installation "手动安装 Package Control")。

#### 用 Package Control 安装插件的方法：

1.  按下 Ctrl+Shift+P 调出命令面板
2.  输入 install 调出 Install Package 选项并回车，然后在列表中选中要安装的插件。

不爽的是，有的网络环境可能会不允许访问陌生的网络环境从而设置一道防火墙，而 Sublime Text 2 貌似无法设置代理，可能就获取不到安装包列表了。  
好，方法介绍完了，下面是本文正题，一些有用的 Sublime Text 2 插件：

### [Zen Coding](https://bitbucket.org/sublimator/sublime-2-zencoding)

这个，不解释了，还不知道 ZenCoding 的同学强烈推荐去看一下：《[Zen Coding: 一种快速编写 HTML/CSS 代码的方法](http://www.qianduan.net/zen-coding-a-new-way-to-write-html-code.html "Permanent Link to Zen Coding: 一种快速编写 HTML/CSS 代码的方法")》。

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/024017oTG.png "zen")  
PS:Zen Coding  for Sublime  Text 2 插件的开发者已经停止了在 Github 上共享了，现在只有通过 Package Control 来安装。

### [jQuery Package for sublime Text](https://github.com/mrmartineau/Jquery)

如果你离不开 jQuery 的话，这个必备～～

### [Sublime Prefixr](https://github.com/wbond/sublime_prefixr)

Prefixr，CSS3 私有前缀自动补全插件，显然也很有用哇

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/0240179XG.png "pr")

### [JS Format](https://github.com/jdc0589/JsFormat)

一个 JS 代码格式化插件。

### [SublimeLinter](https://github.com/kronuz/SublimeLinter/)

一个支持 lint 语法的插件，可以高亮 linter 认为有错误的代码行，也支持高亮一些特别的注释，比如 “TODO”，这样就可以被快速定位。（IntelliJ IDEA 的 TODO 功能很赞，这个插件虽然比不上，但是也够用了吧）

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/024017mzi.png "linter")

### [Placeholders](https://github.com/mrmartineau/Placeholders)

故名思意，占位用，包括一些占位文字和 HTML 代码片段，实用。

### [Sublime Alignment](https://github.com/wbond/sublime_alignment)

用于代码格式的自动对齐。传说最新版 Sublime 已经集成。

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/024017f8Z.png "align")

### [Clipboard History](https://github.com/kemayo/sublime-text-2-clipboard-history)

粘贴板历史记录，方便使用复制 / 剪切的内容。

### [DetectSyntax](https://github.com/phillipkoebbe/DetectSyntax)

这是一个代码检测插件。

### [Nettuts Fetch](https://github.com/weslly/Nettuts-Fetch)

如果你在用一些公用的或者开源的框架，比如 [Normalize.css](http://necolas.github.com/normalize.css/) 或者 [modernizr.js](http://www.modernizr.com/)，但是，过了一段时间后，可能该开源库已经更新了，而你没有发现，这个时候可能已经不太适合你的项目了，那么你就要重新折腾一遍或者继续用陈旧的文件。Nettuts Fetch 可以让你设置一些需要同步的文件列表，然后保存更新。

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/024017NEC.jpg "remote")

### [JsMinifier](https://github.com/cgutierrez/JsMinifier)

该插件基于 Google Closure compiler，自动压缩 js 文件。

### [Sublime CodeIntel](https://github.com/Kronuz/SublimeCodeIntel)

代码自动提示

### [Bracket Highlighter](https://github.com/facelessuser/BracketHighlighter)

类似于代码匹配，可以匹配括号，引号等符号内的范围。

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/0240175ed.png "braket")

### [Hex to HSL](https://github.com/atadams/Hex-to-HSL-Color)

自动转换颜色值，从 16 进制到 HSL 格式，快捷键 Ctrl+Shift+U

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/024018wZR.png "hsl")

### [GBK to UTF8](http://www.sublimetext.com/forum/viewtopic.php?f=5&p=22274)

将文件编码从 GBK 转黄成 UTF8，快捷键 Ctrl+Shift+C

### [Git](https://github.com/kemayo/sublime-text-2-git)

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/0240187WW.png "git")

该插件基本上实现了 git 的所有功能。（转自前端观察）