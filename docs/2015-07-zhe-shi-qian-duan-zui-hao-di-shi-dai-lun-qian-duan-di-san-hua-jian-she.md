---
title: 这是前端最好的时代 —— 论前端的 “三化” 建设
date: 2015-07-28
author: TAT.heyli
source_link: http://www.alloyteam.com/2015/07/zhe-shi-qian-duan-zui-hao-di-shi-dai-lun-qian-duan-di-san-hua-jian-she/
---

**CSDN 原文链接：**<http://www.csdn.net/article/2015-07-17/2825243-alloy-team-leehey>

**摘要：**深 JS 大会近日在深圳举办，涵盖了 JS 领域众多热点话题，很多专家的精彩分享更是引起参会者的诸多思考，如赫门演讲中提出的 “每 18 至 24 个月，前端都会难一倍”。本文来自腾讯 AlloyTeam 李成熙，分享了他参会的所见所感。

**JS 中国开发者大会于 7 月 11-12 日在深圳成功举办。该大会号称 JavaScript 和 Node.js 领域含金量最高的技术分享大会，聚集了来自国内外 20 多位讲师及大量 JS 技术爱好者，几乎涵盖了 JS 领域的所有热点话题。会后，腾讯 AlloyTeam 李成熙特别撰写了该文章，分享了他参会的**所见所感。\*\*\*\*

“每 18 至 24 个月，前端都会难一倍”（注：2015 深 JS 大会上，赫门在《前端服务化之路》主题演讲中说的一句话）。难，是前端发展史偶然中的必然。但难，也造就着前端当下的繁荣。

Ryan Dah 之所以选择用 Javascript 作为 Node.js 的基础语言，主要是因为它是单线程的，没有服务器 I/O，没有历史包袱，有较低的门槛和比较良好的社区（更多内容可见：[Node.js Interview: 4 Questions with Creator Ryan Dahl](http://bostinno.streetwise.co/2011/01/31/node-js-interview-4-questions-with-creator-ryan-dahl/)）。这看似是偶然，但实际上正是 Javascript 的这些优秀特性必然被历史选择，承担推动 Web 技术发展的使命。

7 月 11-12 日在深 JS 大会上，我们看见的是在 Node.js 的推动下，前端技术大放异彩，逐渐告别 “石器时代”，走向 “工业时代”。而通过推动前端迈进” 工业时代” 的 “三化 “建设的力量，分别是前端的自动化、实时化与服务化。

**前端自动化**

前端的自动化技术已经发展了好几年，之前涌现的 grunt、gulp 已帮助前端很好地解决了代码压缩、生成 md5、合图等功能。自动化属于 “三化” 中的基础，它的发展极大释放了前端的手脚，让前端有更多的时间专注于实时化与服务化的发展。大会带来与前端相关的主题是前端的测试自动化。这相信是前端自动化比较棘手的问题。

马逸清给我们展示了七牛存储在前端测试上的一些尝试。但目前来看成果还是相当有限的。其一，他们的做法主要是针对于 JavaScript 的逻辑，或者是一些基本的 UI 交互的测试，浏览器兼容性的测试、前端页面与设计稿对齐方面的测试，基本都是空白。其二，即使他们现在可以对 JavaScript 的逻辑进行测试，但比较好的切入条件是对 DOM 的隔离，所以，如果业务使用的是 View 与 Model 的框架，如 Angular，测试是比较友好的。但如果使用到的是 Web Component—— 这种将 JavaScript，CSS 和 HTML 模块化地放在一起的元素，则比较麻烦。

对于前端页面与设计稿对齐的测试，我们团队 AlloyTeam 也有一些尝试，曾开发过一个 AlloyDesigner 的工具。而对于浏览器兼容性测试，在 IE 流行的时代，为了兼容 IE，很多人喜欢用一个叫 IE Tester 的工具。但这些都只属于测试的工具化，离自动化还有很长的距离。

![](http://top.oa.com/apis/imgcache.php/http://img.ptcms.csdn.net/article/201507/17/55a8b1f879b7e.jpg)

另外，马逸清还提到，写这些测试代码要增加约 20% 至 30% 的工作时间。这对于人手不足、业务时间急、需求迭代快的团队，是一个不少的挑战。而且这个幅度的时间增加，对这些团队来说，可能有违自动化的核心理念 —— 效率的提高。

因此，前端的自动化下一步需要关注的是，拓展测试可覆盖的场景，以及减少额外的时间开销。

**前端服务化**

所谓服务化，即使用者只需调用，而毋须知道内部的实现，说白了就是标准化（引自 2015 深 JS 大会上，赫门主题演讲《前端服务化之路》的内容）。Node.js 的出现使前端服务化成为可能。Node.js 开发的系统可以作为接入层，调用 Java、C++ 等提供的基础功能，处理数据库，然后将数据吐给浏览器进行渲染。简易言之，就是用 Node.js 代替业务逻辑这一层。最后造就的成果是，不仅 Java，C++ 可以放弃业务逻辑，更专注于数据处理的基础服务，而且 Node.js 能更专注于业务逻辑，挺供 API 服务给浏览器端的代码进行调用。

用 Node.js 作为接入层，让前端涉足 “后台” 的业务成为可能，而且能提高开发效率，还能更方便地使用最新 Web 技术，如 Big Pipe，WebSocket 等对页面进行优化。早前淘宝进行的前后端分离，腾讯 AlloyTeam 正在进行的玄武框架，都是在推动前端服务化做出努力。

除了 Node.js 作为接入层提供服务以外，淘宝的赫门还提出了将前端 Web Component 作为一种服务，提供给后台使用。Javascript 的 AMD 与 CommonJS 规范的订立使 Javascript 的模块化开发成为可能，也就自然而然地推动了前端的组件化。但赫门认为组件化的 Web Component 是散乱的，并没有办法一统江湖（如 Angular、React 这类框架），而他的理念就是希望帮助 Web Component 重新定位，也就是将其标准化。他在演讲中举出一个应用场景：使用 React 开发了一个组件，给前端直接使用 React，而给后端用的时候则先用 Flipper 输出成 Web Component 再用。赫门的这个 Flipper 在技术上并没有太大的新意，其创新之处在于，他基于 Flipper 提出的服务化理念。

AlloyTeam 内部其实有类似的更完善的方案 —— MVVM 框架 [Q.js](https://github.com/imweb/Q.js) 及 [Ques](https://github.com/miniflycn/Ques) 组件方案。赫门的 Flipper 只管将代码转成标准化 Web Component，而 Ques 组件方案不仅在开发过程中可以用标准化 Web Component，而且在基于构建，开发的过程中就已经可以将 HTML，CSS 及 JS 模块化，更好地组织代码。而 Q.js 则是一个类 Vue.js 的的 MVVM 框架，它可以使用 Ques 组件方案，结合 MVVM 框架的特性，能够轻松驾驭一个项目的开发 Ques。

**前端实时化**

我不确定用实时化这个词来形容是否恰当，但不可否认的是，Web 技术的发展使网页获得更好的响应。目前比较流行的方案就是前端 SPA（单页应用）技术结合后台的 API 服务，他们的桥梁是诞生刚满 10 年的 Ajax。 未来，这种趋势会得到强化，而且 Web 的体验会越来越贴近应用。

会上，前 Googler 尤雨溪带来的 Meteor 正致力于完善这件事。一般的单页应用都如下图，UI、客户端数据和服务器数据相互沟通，达到状态的更新。而 Meteor 则希望将客户端数据这一层变薄甚至直接去掉，以减少性能的损耗，因此他们在客户端引入一种叫 Minimongo 的数据库驱动，它遵守 DDP（分布式数据协议），根据 Meteor 的说法，是一种简易的结构化数据获取及数据更新协议。它的特色是，可以在客户端直接定制想要订阅的数据格式，服务器根据请求对订阅者进行推送。Meteor 的另一个特色是使用了 WebSocket 技术。如果你打开 TeleScope（使用 Meteor 技术的一个 BBS 应用），你能发现它是通过 WebSocket 获取数据的实时应用。也正因为 Meteor 使用 WebSocket 这个 HTML5 新特性，Meteor 将 DDP 亲切地称为 WebSocket 的 REST。

![](http://km.oa.com/files/post_photo/574/247574/f967eab90a466dff51ac176aa3e34abb1437123122.jpg)

图片来源： 深 JS 上，尤雨溪的演讲 PPT《[Database Everywhere: a Reactive Data Architecture for JavaScript Frontends](http://slides.com/evanyou/shenjs#/)》

另一个讲者，Strikingly CTO 郭达峰提到 Facebook 最近打算开源的一种新技术 GraphQL，结合 Relay 和 Reactive，是最新比较热门的 Web 开发方案。这种方案跟 Meteor 相比其实有异曲同工之妙。在通信结构方案，这种方案遵循上图，React 负责 UI 状态，Relay 负责客户端数据状态，而 GraphQL 则负责服务器数据状态。在通信协议方案，与 Meteor 不同，它并不限于使用 WebSocket，它其实更着眼于解决 REST 的问题。GraphQL 在服务器端发布一个类型系统，Relay 通过客户端发送一些比较结构化的查询请求来获取数据，如下图。这套解决方案简化了服务器端，以统一的 GraphQL 接口提供给 Relay 这一层，Relay 会自动获取数据并统一进行数据变更的处理，使数据获取和处理更加高效。

![](http://top.oa.com/apis/imgcache.php/http://img.ptcms.csdn.net/article/201507/17/55a8b24ab84c2.jpg)

图片来源：深 JS 上，郭达峰的演讲 PPT《[GraphQL and Relay](https://speakerdeck.com/dfguo/lightning-talk-at-jsconf-2015)》

在实时化应用方面，业界前 10 年（今年是 Ajax 诞生 10 周年）的发展致力于前端的交互与设计方面的优化，例如 Ajax 的诞生，Angular、React 一类框架使单页应用更为普及。又如 AlloyTeam 的 AlloyKit 离线包系统，使 HybridApp 体验更为完美。而看这次大会，站在 10 年这个分水岭上发表的演讲，像 Facebook 这样的巨头和 Meteor 这样的创新型公司正开始着眼于使前后端的数据通信更快更好。

**结语**

前端的自动化、服务化和实时化是前端开发中正在发生的变化，是一系列深刻的变革。这些变革使前端的能力更加丰富、创造的应用更加完美。在深圳举办的这次中国 Javascript 大会上的讲座，都相当精彩，有意无意地反应出业界的这些变化。希望下一届的大会能更加国际化，为我们带来更多的技术干货。