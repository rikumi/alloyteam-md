---
title: AC 大会讲师访谈之 —— 隔壁的老王技术精
date: 2015-12-12
author: TAT.heyli
source_link: http://www.alloyteam.com/2015/12/ac-next-door-to-the-old-kings-of-the-conference-speakers-interviews-technical-precision/
---

<!-- {% raw %} - for jekyll -->

[![dorsywang2](http://www.alloyteam.com/wp-content/uploads/2015/12/dorsywang2.png)](http://www.alloyteam.com/wp-content/uploads/2015/12/dorsywang2.png)

**本期看点： Abstract 框架 AlloyImage 兴趣部落**

**导读：**

首届 AC2015 大会即将于 2015 年 12 月 12 日在深圳腾讯大厦总部举行。这是 AlloyTeam 沉寂一年来首次对外举行的一次技术分享。AlloyTeam 前身是负责 WebQQ，Q+，QQ 互联的腾讯前端团队，最近又历经了兴趣部落、群开放、家校群等一连串 QQ 拳头项目的洗礼，积淀了不少技术知识，希望借着一年一度的技术分享会对外展示我们一年以来的技术成果。届时，亦会有神秘 web 游戏项目对外公布。

王斌，AC2015 的讲师，2012 年加入腾讯 AlloyTeam，先后开发过 Q + 互联，兴趣部落。开发过 AlloyDesigner, AlloyPhoto 等有趣的设计、图像处理开源项目。并为兴趣部落手机端整合出 Abstract 框架，支撑了这一亿万级业务的稳健发展。

**Github：**

[**http://github.com/dorsywang/**](http://github.com/dorsywang/)

**个人地址：**

[**http://www.dorsywang.com/**](http://www.dorsywang.com/)

**项目：**

**Abstract 最新地址：**

**中文： <http://www.dorsywang.com/Abstract.js/>**

**英文： <http://alloyteam.github.io/Abstract.js/>**

**SodaRender 最新地址：**

[**http://www.dorsywang.com/SodaRender/**](http://www.dorsywang.com/SodaRender/)

[**http://alloyteam.github.io/SodaRender/**](http://alloyteam.github.io/SodaRender/)

**图一：AlloyPhoto 简约版图像处理效果**

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJDQzA1MTVGNkE2MjExRTRBRjEzODVCM0Q0NEVFMjFBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJDQzA1MTYwNkE2MjExRTRBRjEzODVCM0Q0NEVFMjFBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkNDMDUxNUQ2QTYyMTFFNEFGMTM4NUIzRDQ0RUUyMUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkNDMDUxNUU2QTYyMTFFNEFGMTM4NUIzRDQ0RUUyMUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6p+a6fAAAAD0lEQVR42mJ89/Y1QIABAAWXAsgVS/hWAAAAAElFTkSuQmCC)[![alloyPhoto](http://www.alloyteam.com/wp-content/uploads/2015/12/alloyPhoto.png)](http://www.alloyteam.com/wp-content/uploads/2015/12/alloyPhoto.png)

**问题 1： 介绍一下你自己？例如，昵称，什么时候在哪里毕业，什么系，有什么前端作品**

我叫王斌，在腾讯的英文名是 dorsy，大家觉得我很实在，所以叫我老王（应该是这样的）。毕业于正冰天雪地里的东北师大。2013 年毕业，和老教授一样，学的专业是数学与应用数学，本该在教育事业中奋斗终身，但毕业后还是选择来到了深圳，投奔了蓬勃发展的互联网行业。

2012 年到公司实习，个人兴趣开发了定位于专业图像处理的前端引擎 AlloyImage，之后为了提高工作效率和工作质量，开发了前端辅助工具 AlloyDesinger。 在兴趣部落项目中，为了解决一些问题，开发了 Abstract 框架并被广泛应用到兴趣部落和群活动、群通知等其他项目中，同时开发了 SodaRender 模板引擎，替换了部落中老旧的 ejs 模板语法形式。

**问题 2.：AlloyImage 诞生之后反响很好，台湾的开源组织还想邀请你过去做分享。你当初是怎么得到做这个项目的灵感的？在开发这个项目的时候需要做些什么的准备，沉淀什么知识储备？遇到了什么难题，是怎么一一解决的？**

接触 canvas 之后觉得 canvas 很好玩，可以做以前前端做不到的东西，于是有一些想法，可以尝试做一个图像处理应用，之后得到了涛哥（编者注：帅帅的 AlloyTeam 团队负责人）的大力支持，在经历了几个月的开发之后，完成了 AlloyImage。

AlloyImage 在业界受到如此的关注，我觉得，一方面，在我的调研里，使用 JS 写的前端图像处理引擎中，AlloyImage 是第一个使用图层来进行图像处理的 JS 库，AlloyImage 拥有 17 种完善的、与 PS 相对应图层混合模式，这为 AlloyImage 定位于专业级的图像处理奠定了很好的基础。我们都知道，PS 中图层与图层混合模式是非常基本的功能。AlloyImage 中的所有操作，都是依赖多图层的概念上展开的。看似一个很简单的复合图像处理效果，比如 LOMO 效果，实际上经过复制多个图层混合得到的效果。这也为得到更多的高级效果提供了很好的支持。第二个原因就是 AlloyImage 功能确实很强大、性能很好，是成熟的产品，可以应用到实际的产品中去。国内很多人会尝试写一些图像处理引擎，但很多都是用来练一练技术，应用到实际的项目缺乏更多的功能与操作能力，而 AlloyImage 中包含的亮度、饱和度和色相的调节，都是在图像处理中最基本的功能，另外，曲线这个锋利的调节工具，AlloyImage 是具有的。甚至在专业调节里面用到的可选颜色功能，在 AlloyImage 的 1.2 的开发版本中已经实现，为调出专业色调的照片做好的充分的准备。第三个原因是因为 AlloyImage 的 API 设计的很友好，很方便使用。

开发这个项目，对我的能力得到很大的锻炼，首先是要去学习图像处理的基本理论知识，这些理论知识都是晦涩、难懂的，与应用结合的数学与传统的理论数学还是有一些区别，而且离散数学体系与连续数学体系还是有一些差别的。但这些都不是问题，只要多看几遍就能学会，毕竟都是熟悉的符号和变换。设计一个框架，怎么去设计 API，也是一个非常头疼的问题。解决这个问题就是，你做第一个使用者。很多人在设计库或框架的时候，只是单纯设计库或框架，并没有实际的产品。为了使 AlloyImage 库的 API 设计的更合理，我开发了 AlloyPhoto 来做为 AlloyImage 第一个使用者产品，不断调整 AlloyImage 的接口，使得它更符合实际应用的接口设计。

**问题 3：由于你之前的出色表现，你曾经跳了一个技术等级。请问你是如何做到能在腾讯这么优秀的前端技术团队里脱颖而出的？能分享一下经验吗？另外，你是如何承担起改造兴趣部落开发框架的工作的？能说说当中的艰辛与泪水么？**

和晓思一样，中间有幸跳了一级。对于工作，我觉得在腾讯这三年自己成长很快，学到了很多东西。我想总结和分享自己的工作态度，并且能一如既往的保持这样的态度：

1.  主动、负责、勇于承担
2.  富有创造力、解决工作中遇到的难题
3.  工作中遇到问题及时和老大、同事沟通
4.  思考与总结

说到改变兴趣部落开发框架的工作，兴趣部落在工作前期，接手过来，大家都做了很多的基础工作，也使得部落这个项目朝着更好的方向发展做出了很大的努力。说起承担起部落框架的工作，要从去年的一天晚上。那天是晚上坐班车回去，和桂总聊起我对当时部落代码的一些想法，希望有种方法能够把部落的逻辑写的更简单，就提出最初的封装组件的想法，比如帖子列表就是一个组件。桂总也提出，客户端的代码就是这种编写方式：客户端的开发中，一个滚动列表就是一个 listView 等等，基础层已经帮你封装了常用的操作。我也从中受到一些启发，决定把部落首页用这种方式重构一下，就挤了一点时间，边想边做。把部落首页按照这种方式做了一次重构。正好赶上我手里一个需求，通过测试，搭车发布了。

后来这种方式得到了大家的认可，也逐渐被大家采纳，慢慢部落中就使用了这种方式来开发页面，其中遇到的功能、API 问题和一些 BUG 也在使用中和大家一起完善、解决了，逐渐成为了一个稳定的基础框架。在部落中，这个框架叫做 Model。后来，Model 因为和部落其他模快绑的很紧，于是我就着手使用状态机完全重写了 Model，也引入了一些新的特性，比如事件冒泡的机制等等，并且开源出去，就是现在所说的 Abstract 2.0. 要说艰辛，就在于怎么去把自己的想法落实下来并且执行到产品中去，这经常是比较难的一件事情，要说泪水，我觉得 Model 的发展和稳定离不开大家的支持，这应该就是其中的感动的泪水。

 

**问题 4：Abstract 框架是你在兴趣部落移动端推行的一套开发框架，你会在 AC2015 中重点介绍它。它的定位是怎样的？性能呢？它对比于现在流行的 React、Angular 有什么优势呢？你会从其它框架中借鉴技术进行迭代更新吗？若是，你认为 Abstract 会向什么方向发展？**

很开心能回答关于 Abstract 的问题。可能大家第一眼看 Abstract，觉得没有太多的新鲜感在里面，不像 React 一样，会给你眼睛戳上一下。也没有像 Angular 一样，给你一种动态十足，很酷的感觉。但 Abstract 就像公司一贯的风格一样，低调、实在、踏实做事。Abstract 是兴趣部落的选择，支撑了兴趣部落亿万次的访问量，经过了千万客户端的检验，是一款方便、快速、稳定的前端框架。相比 React、AngularJS，最直白的不同点就在于 React、AngularJS 不会帮你写业务逻辑，而 Abstract 会，它可以处在 React、AngularJS 的上层，因为 Abstract 就是定位在逻辑层的抽象与提取。更详细的分析，React 和 Abstract 一样，都是基于状态管理的，React 的状态有多种，Abstract 的状态只有两种：激活态与非激活态（像 2 进制一样）。与 AngularJS 的相同点，就是借用了 AngularJS 的模板语法。

Abstract 的有什么优势？适合什么样的场景？

如果你不喜欢 React 的 JSX 戳你的眼睛，那么放弃 React 的吧，使用 Abstract。

如果你想要更好的移动性能，那么放过 AngularJS 吧，投入到 Abstract 的怀抱。

如果你想在几分钟内搞定一个需求或者页面，省下的时间想停下你的脚步去看看周围的风景，那么放弃 React 和 AngularJS 吧，使用 Abstract 会让你快速的完成工作

Abstract 专注效率的提升，它定位在对逻辑层的抽象与封装，所以你的业务逻辑必然被它轻松抽象和封装（Abstract 抽象出了模型间关系，并且可以完备表述所有具相逻辑，并且是数学可证的），简单的几行代码就能完成具象的业务逻辑，这是 Abstract 的理念，也是他未来的发展方向。

**图二：Abstract2.0 正式发布**

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJDQzA1MTVGNkE2MjExRTRBRjEzODVCM0Q0NEVFMjFBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJDQzA1MTYwNkE2MjExRTRBRjEzODVCM0Q0NEVFMjFBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkNDMDUxNUQ2QTYyMTFFNEFGMTM4NUIzRDQ0RUUyMUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkNDMDUxNUU2QTYyMTFFNEFGMTM4NUIzRDQ0RUUyMUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6p+a6fAAAAD0lEQVR42mJ89/Y1QIABAAWXAsgVS/hWAAAAAElFTkSuQmCC)[![Abstract2.0](http://www.alloyteam.com/wp-content/uploads/2015/12/Abstract2.0.png)](http://www.alloyteam.com/wp-content/uploads/2015/12/Abstract2.0.png)

**问题 5： 你认为前端或者 web 的局限性是什么，又有怎样的挑战和机遇？**

前端的局限性在于玩来玩去都只能做有限的事情，如果真正要做实践性的完整项目，还是要有后台、运维的知识，隔离在前端领域，可能对后台是怎么做量级的性能优化等知识还是很匮乏的，比如一个网站，在有限的资源下如何能承载更大的访问量，这也是比较实际的问题，但如果专注前端，可能真的接触不到这些知识。

但同时，前端引入了很多新的知识，这些知识也会让前端的代码逻辑越来越复杂，项目越做越庞大，怎么样去维护逐渐变得强大的项目，对前端来说也是一次机遇和挑战。

**图三：老王和小狗狗**  
[![dorsywang3](http://www.alloyteam.com/wp-content/uploads/2015/12/dorsywang3.png)](http://www.alloyteam.com/wp-content/uploads/2015/12/dorsywang3.png)

更多有关前端交互的内容，请关注 **AC 大会**。或添加 **AlloyTeam** 的公众号 **AlloyTeam**，或搜索 **AlloyTeam** 的微博。

<!-- {% endraw %} - for jekyll -->