---
title: 【腾讯 Web 前端工具系列 3】HTML5 开发的在线雪碧图片合成工具 GoPng
date: 2012-05-23
author: TAT.duwei
source_link: http://www.alloyteam.com/2012/05/gopng-sprite-figure-synthesis-tool-another-html5-app/
---

<!-- {% raw %} - for jekyll -->

Css Sprite，有时也称为雪碧图、精灵图，是每一个前端开都会遇到的问题，也是常见的小图片加载优化手段。相信各位同学都清楚其原理，具体就不赘述了。

之前一直有动机利用 html5 实现一个合成雪碧图的工具，方便小项目的快速开发，减少一些诸如开 photoshop、fireworks 等工具来合图的机械劳动，最近终于抽出时间将构思实现。

-   **在线使用**：<http://alloyteam.github.com/gopng>
-   **使用介绍：**<http://www.alloyteam.com/?p=1050>
-   **github 地址**：<https://github.com/AlloyTeam/gopng>

# Go!Png 介绍：

目前实现的功能如下：

1.  支持图片文件拖拽
2.  支持生成 png 图片与 css 文件
3.  支持两种自动排列的模式
4.  放大镜功能
5.  磁力吸附对齐功能
6.  工作状态导出功能，可以方便导出文件，在下一次操作通过拖放改文件来恢复工作状态（包括图片数据跟参数设置）
7.  支持 Mac（Chrome）：）

# 使用说明：

## **1. 拖拽图片小文件到操作区域，如下图：**

[![](http://www.alloyteam.com/wp-content/uploads/2012/05/drop1.png "拖放文件")](http://www.alloyteam.com/wp-content/uploads/2012/05/drop1.png)

## 2. 输入类属性设置与目标图片、css 文件生成，如下图

[![](http://www.alloyteam.com/wp-content/uploads/2012/05/make.png "生成目标文件")](http://www.alloyteam.com/wp-content/uploads/2012/05/make.png)

## **3. 生成的 css 文件是可以通过改变 css 模版来定制的**

使用的模版函数是 John Resig 的 Micro-Templating，

可以用的变量有：

-   **x** 图片的 x 坐标
-   **y** 图片的 y 坐标
-   **w** 图片的宽度
-   **h** 图片的高度
-   **name** 图片文件的名称（不带后缀）
-   **absolute_path** 绝对路径（自定义）
-   **relative_path** 相对路径（自定义）

**x、y、w、h 的解释如下图：**

[![](http://www.alloyteam.com/wp-content/uploads/2012/05/cord.png "坐标")](http://www.alloyteam.com/wp-content/uploads/2012/05/cord.png)

**css 模版的设置操作如下图：**

[![](http://www.alloyteam.com/wp-content/uploads/2012/05/css.png "css")](http://www.alloyteam.com/wp-content/uploads/2012/05/css.png)

## **4. 生成目标图片、css 后可以直接下载**

点击 download 按钮即可完成下载：

[![](http://www.alloyteam.com/wp-content/uploads/2012/05/down.png "down")](http://www.alloyteam.com/wp-content/uploads/2012/05/down.png)

## **5. 工作状态导出**

这个功能是可以将你目前的工作状态，包括图片的数据（图片、图片位置排列），参数设置（包括主页的参数设置与 css 模版设置），全部导出成一个文件，下次利用此文件便可复原工作状态。

**导出如下图：**

[![](http://www.alloyteam.com/wp-content/uploads/2012/05/export.png "导出")](http://www.alloyteam.com/wp-content/uploads/2012/05/export.png)

**导入如下图：**

[![](http://www.alloyteam.com/wp-content/uploads/2012/05/dragdata.png "导入")](http://www.alloyteam.com/wp-content/uploads/2012/05/dragdata.png)

**即可复原：**

[![](http://www.alloyteam.com/wp-content/uploads/2012/05/recoverworkspace.png "复原")](http://www.alloyteam.com/wp-content/uploads/2012/05/recoverworkspace.png)

<!-- {% endraw %} - for jekyll -->