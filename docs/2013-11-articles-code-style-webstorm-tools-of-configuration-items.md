---
title: 【WebStorm 工具篇】之一 code style 配置项
date: 2013-11-30
author: TAT.woshayawo
source_link: http://www.alloyteam.com/2013/11/articles-code-style-webstorm-tools-of-configuration-items/
---

<!-- {% raw %} - for jekyll -->

最近组内在打造统一的代码风格，每个人都自觉的按照规范文档给自己的偏好编辑器配上一配，我一直在用 webstorm，ctrl + alt + s 打开 webstorm 的 settings。

Project settings 下边的第一项就是 code style。往下看 IDE settings 却找不到 code style，所以就心生纳闷，难道 webstorm 不支持 global 的 code style ？

所以就查了一下资料，发现技巧在这里：[![webstorm-codestyle](http://www.alloyteam.com/wp-content/uploads/2013/11/1.jpg)](http://www.alloyteam.com/wp-content/uploads/2013/11/1.jpg)

打开 code style 的选项卡，点击 general 有一个 scheme 的选项，学问就出在这里：

Project- 指的就是 project 级别的 code style（ps：我们习惯称： code convention）

如果你想修改 project 级别的 code style，点击 manage，直接用其他的 scheme 覆盖 project 即可。

Global- 除 project 之外的所以其他的 scheme 都会是 global 生效的，默认是预定义的 default（ps：这个 scheme 是不可更改的，当发生更改时，webstorm 会生成一个新的 scheme）。


<!-- {% endraw %} - for jekyll -->