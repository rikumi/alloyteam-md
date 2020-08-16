---
title: AC 大会讲师访谈之 —— 一文惊人的高工晓思
date: 2015-12-12
author: TAT.heyli
source_link: http://www.alloyteam.com/2015/12/ac-conference-speakers-interviews-an-amazing-engineering-of-xiao-si/
---

<!-- {% raw %} - for jekyll -->

[![csonlai2](http://www.alloyteam.com/wp-content/uploads/2015/12/csonlai2.png)](http://www.alloyteam.com/wp-content/uploads/2015/12/csonlai2.png)

**本期看点： 跨 webview 优化 LocalStorage 优化 滚动长列表优化 兴趣部落**

**导读：**

首届 AC2015 大会即将于 2015 年 12 月 12 日在深圳腾讯大厦总部举行。这是 AlloyTeam 沉寂一年来首次对外举行的一次技术分享。AlloyTeam 前身是负责 WebQQ，Q+，QQ 互联的腾讯前端团队，最近又历经了兴趣部落、群开放、家校群等一连串 QQ 拳头项目的洗礼，积淀了不少技术知识，希望借着一年一度的技术分享会对外展示我们一年以来的技术成果。届时，亦会有神秘 web 游戏项目对外公布。

赖晓思，AC2015 的讲师之一，2012 年加入腾讯 AlloyTeam，曾参与过 QQ 互联、群基础、兴趣部落等项目的开发，目前负责兴趣部落的页面开发。在公司内率先使用跨 webview 预拉取数据的性能优化办法。之所以说一文惊人，是因为他成功解决移动端滚动列表的卡顿问题，提出 InfiniteScroll.js 的解决方案，并将解决滚动列表卡顿的解决方案，包括代码、横向对比的数据分析、渲染分析以及图表及视频的形式发布在内网，获得一致好评。这套方案的结合分析也是他成为高级工程师的一大亮点。他将会在 AC 大会中分享以上优化心得。

**Github：<https://github.com/csonlai>**

**项目：**

**墙来了：<http://wc.alloyteam.com/>**

**Codetank：<http://codetank.alloyteam.com/>**

**AEditor： [http://aeditor.alloyteam.com](http://aeditor.alloyteam.com/)**

**图一：Aeditor 界面**

[![aeditor](http://www.alloyteam.com/wp-content/uploads/2015/12/aeditor.png)](http://www.alloyteam.com/wp-content/uploads/2015/12/aeditor.png)

**问题 1： 介绍一下你自己？例如，昵称，什么时候在哪里毕业，什么系，有什么前端作品**

我叫赖晓思，昵称是 Cson，广东工业大学网络工程系毕业。来到 alloyteam 之后，由于比较喜欢 HTML5 游戏相关的开发，所以利用业余时间做了 CodeTank 这个编程游戏项目，希望让开发者在玩游戏的同时也能够进行 javascript 的学习。 之后和几个小伙伴参加腾讯创意马拉松，开发了另一个比较有意思的 HTML5 体感游戏《墙来了》。后来在工具方面，开发了面向开发者的交互页编辑器 AEditor，希望可以通过它解决交互页开发效率的问题。

**问题 2：你在 AlloyTeam 工作期间弄了不少开源项目，例如 Codetank，墙来了，AEditor。你最喜欢哪个项目。这个项目给你带来了怎么样的成长呢？**

每个项目对于我来说都有不同的意义，最喜欢的应该是 CodeTank 吧，也是投入时间最长的项目。那时刚刚毕业来到 AlloyTeam 实习，很高兴能够在做业务项目之余投入到这个项目当中。在做这个项目的过程当中，也学习到不少前端方面的知识，特别是游戏开发中的一些基本原则与技巧，例如对 API 的设计，游戏中动画的运作模式，与玩家的交互以及优化技巧等等，开发 CodeTank 的过程感觉是非常有意思和有挑战性的。

 

**问题 3： 当初，你是通过什么样的努力才能进入腾讯的，然后又是通过怎么样的努力快速成为高级工程师的。**

在学校的时候，刚开始自学的是 ASP.NET，然后在学校做了一些网页项目，练手的同时赚一些了零花钱。后来大三的时候才真正开始接触前端开发，之后觉得前端开发比后台开发更有意思，一些自己的想法都可以通过简单的 javascript 进行实现，后来就一直专注在前端开发这个领域上面了。腾讯这边校招主要比较看重学生的基础与积极性，那时在学校没事就用 js 写一些简单的组件和效果，或者是一些简单的 H5 游戏，然后把遇到的问题与解决方案分享到博客中，我觉得 js 入门的话，还是应该自己多练练手，以自己的兴趣为导向做一些喜欢的项目，这样一方面能把基础打扎实一点，还能锻炼解决问题的能力。我觉得腾讯还是很重视毕业生的动手能力以及对编程本身的兴趣的。

腾讯这边对于高级工程师的最重视的是解决问题的能力，所以我平时会尽量尝试在解决一个问题的时候思考多种不同的解决方案，有些方案可能在解决了一个问题之后又会引入其他的问题，所以我们要花比较多的时间在不同方案之间进行对比。在选择方案的时候最好以具体的性能测试数据作为依据，这样才能客观地看待一个方案的优劣。例如对于加载优化，我们要收集优化前与优化后的加载时间数据来对比，而对于渲染优化则是 FPS 的前后对比。

另外，遇到一些比较难解决的问题可以多想想能否通过其他捷径来解决，或者参考一下其他在这方面比较有经验的同学的做法，从中获取一些灵感并改善自己的项目。遇到问题并解决之后，最好能做一下总结与分享，这样大家都可以一起提高。

 

**问题 4： AC 大会上你会介绍你在处理滚动长列表的渲染优化方案。在渲染优化方面，业界也出现过很多不同的尝试方案，例如之前的 React Canvas 等，这边是否进行过类似的尝试呢，不同的方案如何取舍？**

不同的方案可能在不同的平台或者场景下有不同的表现，例如我们这边之前也尝试过使用 Canvas 渲染列表的方式，把长列表放到 Canvas 上进行绘制渲染，但是发现在不同的 Android 机型下，有较大的性能差异，另外还会带来无障碍化上的硬伤。另外也尝试过把不可见区域的列表元素移除的优化方式，发现在 PC 上运行良好，但是在移动端却会带来较大的性能问题，每次在移除 / 添加列表元素由于触发了整个列表的 layout，所以都会带来明显的卡顿。所以有时候我们可能需要在不同的环境下采用不同的方案，或者采用适合大部分环境的通用方案，具体也是需要和业务结合起来进行评判。每一种解决方案的实践和性能对比在这我就不多说了，到时我会在 AC2015 上给大家娓娓道来。

**图二：手 Q 兴趣部落动态页及酋长招聘页（可前往体验滚动效果）**

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJDQzA1MTVGNkE2MjExRTRBRjEzODVCM0Q0NEVFMjFBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJDQzA1MTYwNkE2MjExRTRBRjEzODVCM0Q0NEVFMjFBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkNDMDUxNUQ2QTYyMTFFNEFGMTM4NUIzRDQ0RUUyMUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkNDMDUxNUU2QTYyMTFFNEFGMTM4NUIzRDQ0RUUyMUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6p+a6fAAAAD0lEQVR42mJ89/Y1QIABAAWXAsgVS/hWAAAAAElFTkSuQmCC) [![list2](http://www.alloyteam.com/wp-content/uploads/2015/12/list2.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/12/list2.jpg)    [![list](http://www.alloyteam.com/wp-content/uploads/2015/12/list.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/12/list.jpg)

问题 5： 现在纯前端的性能优化方案感觉已经开发得差不多，越来越多人往后台寻求方案，如 Node 直出、HTTP2.0、SPDY 等等。真的是这样吗？纯前端的优化方案在未来还有哪些方向会有突破点？

基本的纯前端优化方案确实已经开发得差不多了，一些新的纯前端性能优化方案，例如最近比较流行的 React 使用的虚拟 dom 技术、Webpack 带来的打包模式的改变等，确实可以为我们制定优化方案提供一些新的灵感。

另外在与后台结合方面，后台直出等也确实是前端之外可行的方案，但是当这些通用的方案都使用上之后，可能我们又会发现很难再找到其他的方案进行优化。所以其实我觉得优化方案应该结合具体的业务以及具体的环境去进行实施，例如如果是和客户端结合的业务，那我们可以利用客户端的能力去为前端做一些格外的优化，就像我们手 Q 自研的离线包、前端调用客户端能力的 mqq 库等。

另外对于不同业务场景，也可以在其中去发掘出另外一些优化的点，这些可能都不一定是通用的优化方案，但只要是适合业务本身就可以了。总的来说纯前端优化方案可能越来越少，跨界结全后台、客户端的方案可能会挖掘到不少的宝藏。

**图四：喜欢健身的晓思**

[![赖晓思 1](http://www.alloyteam.com/wp-content/uploads/2015/12/赖晓思1.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/12/赖晓思1.jpg)

更多有关前端交互的内容，请关注 **AC 大会**。或添加 **AlloyTeam** 的公众号 **AlloyTeam**，或搜索 **AlloyTeam** 的微博。


<!-- {% endraw %} - for jekyll -->