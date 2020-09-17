---
title: AlloyRenderingEngine 开门大吉
date: 2015-02-28
author: TAT.dnt
source_link: http://www.alloyteam.com/2015/02/alloyrenderingengine-ru-men-xi-lie-yi-kai-men-da-ji/
---

<!-- {% raw %} - for jekyll -->

## 快速入口

不读文章可以直接拐向这里：

github:<https://github.com/AlloyTeam/AlloyGameEngine>

## 开门大吉

每次输入 kmdj 输入法自动提示【开门大吉】，输入 kmdjs 提示【开幕倒计时】，所以说 kmdjs 不仅仅是满满的血腥味  
(kill all module define lib/framework, kill amd and cmd)，还有着美好的寓意。  
一定要提 kmdjs 是因为 AlloyRenderingEngine 是基于 kmdjs 进行模块化开发（其实使用 kmdjs 已经没有模块的概念了），只要 class 和 namespace。  
kmdjs 的核心的核心就是 ｛｝，class 全部挂在 ｛｝ 上。｛｝ 属于 namespace。所以很自然而然得轻松实现循环依赖。当然 kmdjs 还有很多优点，如：

-   支持依赖可视
-   支持循环依赖
-   支持命名重复
-   支持压缩打包
-   支持代码美化
-   支持远程加载
-   支持延迟加载
-   支持模块共享
-   支持平铺依赖
-   支持断点调试
-   支持独立打包
-   支持一键下载

github:<https://github.com/kmdjs/kmdjs>

## 再造轮子

看过一些 flash 团队的 html5 开源项目，也读了读很多 opengl 转 webgl 的工程师的游戏引擎教程，他们视野够广，图形方面经验也很丰富，  
但是项目的组织架构千奇百怪，一个人一个花样，一个团队一个花样。所以，kmdjs 要出手了（当然也可以认为又多了一个新花样，  
当至少是我觉得很满意、很清晰简洁的花样），去组织每一行没有归宿感的 js 代码。

## 目录结构

先看顶级目录结构

![are](https://raw.githubusercontent.com/AlloyTeam/AlloyRenderingEngine/gh-pages/asset/ls1-1.png)

再看 build 里的目录结构

![are](https://raw.githubusercontent.com/AlloyTeam/AlloyRenderingEngine/gh-pages/asset/ls1-2.png)

其中 main.js：

```javascript
kmdjs.config({
    name: "BuildARE",
    baseUrl: "../src",
    classes: [
          { name: "ARE.DisplayObject", url: "are/display" },
          { name: "ARE.Bitmap", url: "are/display" },
          { name: "ARE.Sprite", url: "are/display" },
          { name: "ARE.Stage", url: "are/display" },
          { name: "ARE.Shape", url: "are/display" },
          { name: "ARE.Container", url: "are/display" },
          { name: "ARE.Txt", url: "are/display" },
          { name: "ARE.Matrix2D", url: "are/util" },
          { name: "ARE.Loader", url: "are/util" },
          { name: "ARE.UID", url: "are/util" },
          { name: "ARE.CanvasRenderer", url: "are/renderer" },
          { name: "ARE.WebGLRenderer", url: "are/renderer" },
          { name: "ARE.GLMatrix", url: "are/util" },
          { name: "ARE.RAF", url: "are/util" },
          
```


<!-- {% endraw %} - for jekyll -->