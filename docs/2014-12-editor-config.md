---
title: 【译】EditorConfig 介绍
date: 2014-12-14
author: TAT.yunsheng
source_link: http://www.alloyteam.com/2014/12/editor-config/
---

## 前言

`EditorConfig` 是一套用于统一代码格式的解决方案，很多项目都有用到，比如 `Bootstrap`、`jQuery`、`Underscore` 和 `Ruby` 等等。[官方网站](http://editorconfig.org/)说的很简明，为了方便大家快速上手，我做了简单的翻译。

## EditorConfig 是什么？

`EditorConfig` 可以帮助开发者在不同的编辑器和 IDE 之间定义和维护一致的代码风格。`EditorConfig` 包含一个用于定义代码格式的文件和一批编辑器插件，这些插件可以让编辑器读取配置文件并依此格式化代码。`EditorConfig` 的配置文件十分易读，并且可以很好的在 VCS（`Version Control System`）下工作。

## EditorConfig 的配置文件是怎样的？

以下是一个用于设置 `Python` 和 `JavaScript` 行尾和缩进风格的配置文件。

```python
# EditorConfig is awesome: http://EditorConfig.org
 
# top-most EditorConfig file
root = true
 
# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
insert_final_newline = true
 
# Matches multiple files with brace expansion notation
# Set default charset
[*.{js,py}]
charset = utf-8
 
# 4 space indentation
[*.py]
indent_style = space
indent_size = 4
 
# Tab indentation (no size specified)
[*.js]
indent_style = tab
 
# Indentation override for all JS under lib directory
[lib/**.js]
indent_style = space
indent_size = 2
 
# Matches the exact files either package.json or .travis.yml
[{package.json,.travis.yml}]
indent_style = space
indent_size = 2
```

[这里](https://github.com/editorconfig/editorconfig/wiki/Projects-Using-EditorConfig)是一些使用了 `EditorConfig` 的示例项目

## 在哪里存放配置文件

当打开一个文件时，`EditorConfig` 插件会在打开文件的目录和其每一级父目录查找`.editorconfig` 文件，直到有一个配置文件 `root=true`。

`EditorConfig` 配置文件从上往下读取，并且路径最近的文件最后被读取。匹配的配置属性按照属性应用在代码上，所以最接近代码文件的属性优先级最高。

**Windows 用户：**在资源管理器创建`.editorconfig` 文件，可以先创建`.editorconfig.` 文件，系统会自动重名为`.editorconfig`。

## 文件格式详情

`EditorConfig` 文件使用 INI 格式（_译注：请参考[维基百科](http://zh.wikipedia.org/wiki/INI%E6%96%87%E4%BB%B6)_），目的是可以与 [Python ConfigParser Library](https://docs.python.org/2/library/configparser.html) 兼容，但是允许在分段名（译注：原文是 section names）中使用 “and”。分段名是全局的文件路径，格式类似于 [gitignore](http://manpages.ubuntu.com/manpages/intrepid/man5/gitignore.5.html#contenttoc2)。斜杠 (`/`) 作为路径分隔符，`#`或者`;` 作为注释。注释应该单独占一行。`EditorConfig` 文件使用 `UTF-8` 格式、`CRLF` 或 `LF` 作为换行符。

### 通配符

| 通配符        | 说明                     |
| ---------- | ---------------------- |
| \*         | 匹配除`/`之外的任意字符串         |
| \*\*       | 匹配任意字符串                |
| ?          | 匹配任意单个字符               |
| \[name]    | 匹配 name 字符             |
| \[!name]   | 匹配非 name 字符            |
| {s1,s3,s3} | 匹配任意给定的字符串（0.11.0 起支持） |

特殊字符可以用`\`转义，以使其不被认为是通配符。

### 支持的属性

_注意：_不是每种插件都支持所有的属性，具体可见 [Wiki](https://github.com/editorconfig/editorconfig/wiki/EditorConfig-Properties)。

-   `indent_style`：`tab` 为 hard-tabs，`space` 为 soft-tabs。
-   `indent_size`：设置整数表示规定每级缩进的列数和 soft-tabs 的宽度（_译注：空格数_）。如果设定为 `tab`，则会使用 `tab_width` 的值（如果已指定）。
-   `tab_width`：设置整数用于指定替代 tab 的列数。默认值就是 `indent_size` 的值，一般无需指定。
-   `end_of_line`：定义换行符，支持 `lf`、`cr` 和 `crlf`。
-   `charset`：编码格式，支持 `latin1`、`utf-8`、`utf-8-bom`、`utf-16be` 和 `utf-16le`，不建议使用 `uft-8-bom`。
-   `trim_trailing_whitespace`：设为 `true` 表示会除去换行行首的任意空白字符，`false` 反之。
-   `insert_final_newline`：设为 `true` 表明使文件以一个空白行结尾，`false` 反之。
-   `root`：表明是最顶层的配置文件，发现设为 `true` 时，才会停止查找`.editorconfig` 文件。

目前所有的属性名和属性值都是大小写不敏感的。编译时都会将其转为小写。通常，如果没有明确指定某个属性，则会使用编辑器的配置，而 `EditorConfig` 不会处理。

推荐不要指定某些 `EditorConfig` 属性。比如，`tab_width` 不需要特别指定，除非它与 `indent_size` 不同。同样的，当 `indent_style` 设为 `tab` 时，不需要配置 `indent_size`，这样才方便阅读者使用他们习惯的缩进格式。另外，如果某些属性并没有规范化（比如 `end_of_line`），就最好不要设置它。

## 下载插件

### Sublime Text

直接在 `Package Control` 里搜 `EditorConfig` 就行，在 `Console` 里可以看到生效的配置。

### WebStorm

在 Setting-->Plugins-->Browse JetBrains Plugins 里搜索 `EditorConfig` 即可。  
`IntellijIDEA`、`PhpStorm`、`PyCharm` 等应该类似。

_注：_从 9.X 版本开始，`WebStorm` 原生就内置了 `EditorConfig`，不需要装任何插件。

_译注：_支持的编辑器 / IDE 很多，使用也都很简单，大家自己去[官网](http://editorconfig.org/#download)下吧。

## 做点贡献

### Feedback

联系方式：

-   [邮件群组](http://groups.google.com/group/editorconfig)
-   [issue](https://github.com/editorconfig/editorconfig/issues)
-   [twitter](https://twitter.com/#!/EditorConfig)

### 编写插件

可以用任何一种核心库来编写 `EditorConfig` 插件。核心库以正在编辑的文件作为输入，寻找 / 编译相关的`.editorconfig` 文件，并回传需要用到的属性。考虑到未来的兼容性（可以添加新的属性名和属性值），请在你的插件里忽略未识别的属性名和属性值。目前有供 C、Python 和 Java 语言使用的库。（还有一个 Java 和 Python 绑定的库，这个只是用来存档的，目前已废弃。）

如果你计划编写一个新插件，请用邮件群组通知我们，这样我们可以帮忙并添加链接。如果你计划用任意一个核心作为库或者命令行接口，C、Python 或者 Java 库的文档可能会帮上忙。

更多信息请看 [WIKI](https://github.com/editorconfig/editorconfig/wiki/Plugin-How-To)。

## 后言

可以看到，`EditorConfig` 目前支持的属性非常少，且只局限于基本的文件缩进、换行等格式（当然这与其定位有关），虽然并不能满足团队里代码规范统一的要求，但是其简单易上手、跨编辑器且静默生效的特点，建议在项目中使用。