---
title: AC 大会讲师访谈之 —— 帅气逼人的郭高工
date: 2015-12-11
author: TAT.heyli
source_link: http://www.alloyteam.com/2015/12/ac-conference-speakers-interview-handsome-guo-engineers/
---

[![johnnyguo](http://www.alloyteam.com/wp-content/uploads/2015/12/johnnyguo1.png)](http://www.alloyteam.com/wp-content/uploads/2015/12/johnnyguo1.png)

**本期看点： 性能 前端发展 首屏优化 兴趣部落**

**导读：**

首届 AC2015 大会即将于 2015 年 12 月 12 日在深圳腾讯大厦总部举行。这是 AlloyTeam 沉寂一年来首次对外举行的一次技术分享。AlloyTeam 前身是负责 WebQQ，Q+，QQ 互联的腾讯前端团队，最近又历经了兴趣部落、群开放、家校群等一连串 QQ 拳头项目的洗礼，积淀了不少技术知识，希望借着一年一度的技术分享会对外展示我们一年以来的技术成果。届时，亦会有神秘 web 游戏项目对外公布。

郭碧青，AC2015 的讲师，2011 年加入腾讯 AlloyTeam，先后开发过 WebQQ，Q+，QQ 互联，兴趣部落。在性能优化方面有非常丰富的经验，是腾讯学院前端性能优化课程的讲师，曾参与春节兴趣部落红包项目，将性能优化做到极致，成功应对每秒 50 万的并发。最近应用 React 直出的方案实践兴趣部落 PC 版 web 的优化，得到不少的性能提升。

**Github：<https://github.com/biqing>**

**项目：<https://github.com/biqing/MessengerJS>**

**React 直出：<http://www.alloyteam.com/2015/10/8783/>**

**图片一：部落 PC web React 直出页**

[![buluo](http://www.alloyteam.com/wp-content/uploads/2015/12/buluo.png)](http://www.alloyteam.com/wp-content/uploads/2015/12/buluo.png)

**问题 1： 介绍一下你自己？例如，昵称，什么时候在哪里毕业，什么系，有什么前端作品**

我的英文名叫 Johnny，所以网用昵称都是 “碧青”、“Johnny” 这样，没有特别的昵称哈。我是 2011 年毕业于中山大学，数学与计算科学学院，信息与计算科学专业。我的前端开源作品比较少，比较有价值的就是 MessengerJS，属于需要兼容 IE6/7 时代的产物，主要的精力还是在业务产品上，大家可能熟悉的是 WebQQ、Q＋、QQ 互联，以及现在比较流行的兴趣部落。

**问题 2： 你是什么时候开始接触前端，是什么让你选择往前端这个领域发展？**

首次接触前端开发，应该是在 09 年，大三开学的时候。当时加入了学校的一个工作室，大家筹划着做几个学院内部系统，当时的技术选型是 LAMP 组合，所以在那时开始从前到后地学习 Web 开发的知识。

说到选择，在学校的时候也算精力充沛，除了 LAMP 的学习，对客户端技术也有关注，MFC 和 WPF 都有尝试，后来对 linux 内核也十分痴迷。终于到了 2010 年暑假，我选择了 Web 前端方向的实习，也许是出于对 UI 开发更有兴趣吧，但在过程中深刻体会到了 Web 开发的效率、调试便利性、以及跨平台的好处（当时在 FireBug 里调试页面简直感动）。

09-10 年间，HTML5 的概念开始升温，让我对前端领域充满了期待与信心。到校招的时候，WebQQ 2.0 这款 web 产品惊艳了整个互联网，我当时也是冲着 WebQQ 来加入腾讯的，幸运的是，成功地加入了这个团队。

**问题 3：你这几年经历的前端届的发展变化有哪些？**

前端这几年真的发展非常快，偶尔会听到同事开玩笑，戏称已经跟不上时代节奏了。确实有些爆发性的发展，从早前的浏览器兼容、jQuery、雅虎十四条，到工程化思想、ES 2015、Node.js，可以说在短短几年时间，前端领域迅速地补齐了很多早期缺失的能力。

前端的变化，我觉得大概可以归类到三个层面：

1.  平台延伸。Node.js 的出现，不但让前端在服务端有所作为，还在构建、工具、甚至桌面客户端，都有不俗的表现；同时，随着移动大潮的兴起，移动设备的普及，Web 页面也在社交网络中承担着重要角色。也就是说，前端开发可以触及的领域更多了，可以在浏览器之外做更多提升用户体验，以及开发效率的事情。
2.  语言增强。HTML5、CSS3，这些语言层面的标准规范升级，也给前端带来更多的生机。除了以往的 DOM 操作、简单样式，我们可以利用 Canvas 做游戏、骨骼动画，用 Websocket 更优雅地实现实时场景需求，用 CSS 实现圆角、渐变、阴影等效果，还有 Web worker、LocalStorage、WebGL、离线缓存等丰富的 API 可以使用。不久前，ES 2015 也定稿了，JS 这门脚本语言本身，也在紧随发展增强，弥补之前所缺失的一些语言特性，同时提升代码的书写效率。
3.  理念更新。首先是开发理念，早期的页面逻辑相对简单，对 DOM 的操作也相对粗暴，导致的结果就是维护性很差。在改进的过程中，涌现了不少 MVC 库，在此之上又出现了以 AngularJS 为代表的 MVVM 框架，近期开始流行组件化开发的 React.js… 这些开发框架 / 库只是结果，其背后都有着明确的开发理念作为动机，本质上都是维护性与开发效率之间的平衡，性能对比是其次的事情（大家通常会过于纠结性能的争论）。其次是工程理念，由于前端代码是不经编译就能运行的，所以以前并不受大家关注。随着 Node.js 的出现，涌现了一批模块化、预处理的工具，又是让大家眼前一亮，很多性能、维护性的问题迎刃而解。同时，随着页面复杂度的提升，人们对真正意义的组件化开发模式呼声更高了，而这些都是需要优良的工程方案作为其中的粘合剂的。

除了技术方向的变化，整个业界环境也在改变。随着 Github 的流行，程序员之间的交流早已消除了国籍界限，新技术、新名词传播的特别快，大家也更乐于开源项目代码，或者是贡献代码。综上，现在一名合格的前端开发人员，已经不再是那个被困在浏览器的页面仔，而是被赋予了更多能力和工具，给用户带来更好体验的工程师。

 

**问题 4： 作为腾讯学院的讲师，有哪些感触和体会？**

作一名认证讲师，是一件非常棒、收获满满的事情。

一方面，对于自己，平时工作中会更注意归纳总结，工作之余也需要关注业界动向，因为这些平时的积累，都可能成为课程中很好的内容或案例。这是一个重新审视和思考的过程，所以我会经常调整课件内容，有一种不进则退的感觉。另一方面，经验知识，如果没有被有效分享，其实是一种浪费。在前端发展大潮中，谁也不敢说自己的方案就是最好的，所以每次分享也是一个交流的机会，我喜欢跟大家思想碰撞的交流。

前端领域还是有非常广阔的空间，可以研究的方向非常多，希望大家勇于探索，敢于上台做一名讲师，这个过程其实并不难 : )

**图片二：JohnnyGuo 在腾讯学院开设的前端性能课程内容**

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJDQzA1MTVGNkE2MjExRTRBRjEzODVCM0Q0NEVFMjFBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJDQzA1MTYwNkE2MjExRTRBRjEzODVCM0Q0NEVFMjFBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkNDMDUxNUQ2QTYyMTFFNEFGMTM4NUIzRDQ0RUUyMUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkNDMDUxNUU2QTYyMTFFNEFGMTM4NUIzRDQ0RUUyMUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6p+a6fAAAAD0lEQVR42mJ89/Y1QIABAAWXAsgVS/hWAAAAAElFTkSuQmCC)[![johnnyguo_course](http://www.alloyteam.com/wp-content/uploads/2015/12/johnnyguo_course.png)](http://www.alloyteam.com/wp-content/uploads/2015/12/johnnyguo_course.png)

**问题 5：你在 AC2015 上主要分享的是你的专长，首屏时间的优化。能结合一下最近知乎的有关 QQ 空间性能的热点谈谈你的看法吗？**

**热点背景：<http://www.zhihu.com/question/37905339>**

Web 性能一直是我的关注焦点，因为自己平时对浏览页面的要求非常高，糟糕的 Web 性能对用户和产品都是一种伤害，我不希望这种事情会发生自己负责的产品上。

Web 性能主要集中体现在两个环节：加载过程和运行时间。然而一个网页给用户的印象，往往在加载过程中就能得出优劣的判断，其原因是：一般情况下，网页运行时并没有明显的瓶颈，只有加载时的白屏等待时间、页面各个模块逐渐呈现的过程，是有明显感知的。因此，BAT 这些大公司的前端工程师们，都会在加载性能上做很多监控、优化的事情。

知乎上 QQ 空间的性能讨论我也看了一些，很多 QQ 空间的开发者们都已经分析总结了不少内容，我就简单分享几个看法好了。

1.  万变不离其宗。其实 Web 加载性能的优化，讲来讲去，并没有比 Yahoo 总结 n 条优化军规超越多少，因为很多耗时的环节在于 Web 页面赖以生存的 HTTP 协议与浏览器。所以在压缩、缓存利用、请求合并上，只要做到合理，大家就没有太多可挑战的地方。
2.  项目迭代之殇。任何单一的技术点讲起来都很简单，然而在瞬息万变的 Web 世界，一切都变化的太快：需求在变、人员在变、技术在变，很有可能你的代码明天就被其他人改了，满怀忧桑；也有可能你接手了某个已离职人员的代码，看的内牛满面… 所以优化的工作会周期性进行，只要产品还在发展，这项工作就永远不会结束。
3.  多端发力趋势。新的优化趋势是，眼光不再局限在浏览器中，放眼更多与 Web 紧密协作的平台能力。在客户端上，我们也有很多为了加速 web 加载的优化工作，早在 PC QQ 我们就积累了资源离线包这一技术，并在手机 QQ 上进行了广泛的应用，取得了很好的效果。在服务端，我们也有后端渲染、缓存加速等策略，结合不同的网络环境，给出适合的优化方案。所以大家做的优化工作，可能不是简单地从请求数看出来的，还要看看最后在用户端真实的加载数据。
4.  系统方案思考。大部分性能问题，都是在一定的业务场景出现的，因此大大小小的优化方案很多，但缺乏通用场景的抽象，显得比较零散。我想这也是很多团队可能正在总结的内容，而我们团队也希望在这个方向，能利用组件模块化、工程化等框架／工具，整合出一套具有预见性的解决方案来。

**图片三：JohnnyGuo 在鹅厂 wo 谈会**

[![510](http://www.alloyteam.com/wp-content/uploads/2015/12/510.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/12/510.jpg)

更多有关前端性能的内容，请关注 **AC 大会**。或添加 **AlloyTeam** 的公众号 **AlloyTeam**，或搜索 **AlloyTeam** 的微博。