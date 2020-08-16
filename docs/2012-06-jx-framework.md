---
title: 腾讯 Web 前端 Javascript 开发框架 JX (Javascript eXtension tools)
date: 2012-06-06
author: TAT.Kinvix
source_link: http://www.alloyteam.com/2012/06/jx-framework/
---

<!-- {% raw %} - for jekyll -->

一个类似 Google Closure Library 的 Web 前端开发框架，服役于 WebQQ 等大规模的 WebApp

by [Tencent AlloyTeam](http://www.alloyteam.com/)

## [](https://github.com/AlloyTeam/JX#%E7%AE%80%E4%BB%8B)简介

JX 是模块化的非侵入式 Web 前端框架，开发于 2008 年，并于 2009 年开源于 GoogleCode - <http://code.google.com/p/j-et/，于> 2012 年切换到 Github，开始我们开源计划的新征途，请记住我们的最新开源地址：<https://github.com/AlloyTeam/JX>，欢迎访问我们的团队 Blog - <http://www.alloyteam.com/2012/06/jx-framework/>, 谢谢大家来支持 ^\_^。

JX 框架同时适用于 Web Page 和 Web App 项目的开发，特别适合构建和组织大规模、工业级的 Web App，腾讯 WebQQ -[http://web.qq.com](http://web.qq.com/)、腾讯 Q+ [http://www.QPlus.com](http://www.qplus.com/) 等产品都是采用 JX 框架开发，兼容目前所有主流浏览器。

## [](https://github.com/AlloyTeam/JX#%E5%91%BD%E5%90%8D%E5%90%AB%E4%B9%89)命名含义

-   JX 是 Javascript eXtension tools 的缩写，即 Javascript 扩展工具套件的意思。

## [](https://github.com/AlloyTeam/JX#%E8%AE%BE%E8%AE%A1%E7%90%86%E5%BF%B5)设计理念

-   保持最优的执行效率
-   保持 Javascript 原有的代码风格，降低学习难度
-   不做任何的过度封装
-   更好的组织工业级 Javascript 应用程序
-   探索在前端使用 MVP、MVC 等模式来构建大型 WebApp
-   探索工业级 Javascript 的开发技术

## [](https://github.com/AlloyTeam/JX#%E7%89%B9%E6%80%A7)特性

-   **微内核设计**：内核可完全分离出来，用于构建其他的框架
-   **原生对象零污染**：你懂的，随着 js 的 App 越来约复杂，对原生对象的零污染也体现的越来越重要了
-   **模块封包**：采用命名空间、闭包等方式建立了模块封包的体系，帮助更好的组织海量 js 代码
-   **模块自由拼装**：自身模块做了良好的架构分离，尽可能让各个模块之间可以自由的拼装组合
-   **无缝集成各种 js 框架**：与 jQuery, YUI, Mootools, Prototype.js 等框架无缝集成；与多种局部框架无缝集成，如：Mini, Sizzle, cssQuery, xpath, JSON 等等
-   **多版本共存**：如采用的 Jx 版本过旧，旧有的 Javascript 代码不能与新版本 Jx 兼容，则可以采用多版本共存的方式保持程序的可延续性
-   **分层设计**：Javascript 核心层，与 Javascript 解释引擎无关的封装和扩展；浏览器端 Javascript 层，对浏览器中的 Javascript 引擎部分的封装和扩展

## 代码示范

-   JX 代码组织方式一 (传统)：  

    ```javascript
    var J = new Jx();
    J.out(J.version);
    ```
-   JX 代码组织方式二 (推荐)：  

    ```javascript
    Jx().$package(function (J) {
        J.out(J.version);
    });
    ```

## 相关文档

-   CheatSheet：<http://alloyteam.github.com/JX/doc/jx_cheatsheet.html>
-   核心文档：<http://alloyteam.github.com/JX/doc/core/index.html>
-   UI 库文档：<http://alloyteam.github.com/JX/doc/ui/index.html>
-   代码规范：<http://alloyteam.github.com/JX/doc/specification/google-javascript.xml>

## [](https://github.com/AlloyTeam/JX#%E6%9E%B6%E6%9E%84)架构

第一层：**Core Javascript 扩展模块** / **代码组织模块**(可用于 NodeJs 等其他 js 引擎，轻松组织大型应用，无缝接入其它 js 库)

第二层：**Browser Javascript 扩展模块**(跨浏览器，基础封装) / **可选模块**(设计模式相关模块，选择器模块...)

第三层：**UI 组件** / **实时动画模块** / **游戏引擎模块**

## [](https://github.com/AlloyTeam/JX#%E5%8F%91%E5%B1%95%E8%A7%84%E5%88%92)发展规划

-   **核心底层** - 纯 Js 底层功能封装 / 代码组织 / 无缝接入其它 js 库 - \[完成]
-   **基础扩展** - 跨浏览器封装 / 工具函数 / 设计模式相关 - \[完成]
-   **UI 基础控件** - 按钮 / 面板 / 窗口 / 树形列表 / Tab/lightbox/widgets...
-   **实时动画系统** - 实时定时器 / 关键帧动画 / 加速度公式 / 物理引擎 / 声音控制器...
-   **游戏引擎** - 角色控制 / 地图系统 / 游戏异步通讯系统 / 寻路算法 / 键盘控制 / 人工智能 /...

## [](https://github.com/AlloyTeam/JX#%E8%AE%BE%E8%AE%A1%E5%8E%9F%E5%88%99)设计原则

-   不要重复造轮子

业界已经有很多优秀的局部框架，比如 JSON、Mini Selector Engine、SWFObject 等等，作为一个综合性的 Web 前端框架直接做兼容即可，没有再写一遍的必要了，所以 JX 框架针对出色的局部框架做了良好的兼容工作。

## [](https://github.com/AlloyTeam/JX#%E8%B0%81%E5%9C%A8%E7%94%A8jx)谁在用 JX

-   [腾讯 WebQQ](http://web.qq.com/)
-   [腾讯 Q+](http://www.qplus.com/)

## [](https://github.com/AlloyTeam/JX#%E6%84%9F%E8%B0%A2)感谢

感谢团队每一位成员做出的努力，有你我们会更精彩！

Tencent Alloy Team 2012


<!-- {% endraw %} - for jekyll -->