---
title: AC2016 讲师专访 —— 吕鸣 tenny
date: 2016-10-19
author: TAT.Johnny
source_link: http://www.alloyteam.com/2016/10/ac2016-lecturers-interview-lv-ming-tenny/
---

<!-- {% raw %} - for jekyll -->

[![吕鸣](http://www.alloyteam.com/wp-content/uploads/2016/10/粘贴图片_20160928211304-300x254.jpg)](http://www.alloyteam.com/wp-content/uploads/2016/10/粘贴图片_20160928211304.jpg)

讲师介绍

吕鸣 tenny

腾讯 AlloyTeam 前端工程师

负责兴趣部落，明星空降等业务的开发工作，专注移动端性能优化，前端日志工具 MLogger 作者，对 iOS 开发和移动直播技术有探索和研究。

1.  **简单介绍一下自己？例如学习和工作经历，加入 AlloyTeam 有何体会？**  

* * *

我叫吕鸣，网上常用的网名是 吕小鸣，大家如果搜我的网名应该可以搜到我的博客，我是 2013 年毕业的，学的是软件工程专业，大概从毕业之后才算真正接触前端的技术，才真正的开始写前端代码，从此便开始了我的前端生涯，自我感觉做前端比较有意思的就是自己做的东西，写的代码能够立刻看到，特别是做一些很炫的动画效果能让自己有很大的成就感。我是在 2014 年来到公司的，来之前就已经知道 AlloyTeam 在业界是一个很有影响力的团队，能加入其中感到兴奋不已，之后便真正接触到基于海量用户的业务产品，个人感觉前端开发在其中也是出于非常重要的位置，不仅要优化处理好自己的部分，而且还要结合后端，终端，运维一起推动优化的发展，因为我们是处于最接近用户的位置，我们做的页面才是用户的第一入口，特别是在我们团队，推动全面的合作是必不可少的。

2. \***\* 我们看到你的 Github 上也有许多自己的开源项目，同时也有写博客的习惯，能分享一下这些经历吗？\*\***

关于开源项目其实都是源于我们平时写业务时的用到的一些工具和组件，有时为了提高效率就把自己平时做的一些效果和组件抽离出来，便形成了一些通用化的东西就放在了 Github，以便于能让更多的人用到，同时也便于组件的发展和维护，还有就是 AlloyTeam 的官方 Github 都会不定时的推出新的组件，大家可以经常关注。关于写博客我自已也是想将一些平时遇到的问题和经验积累下来统一在一起，而且自己搭建博客也能够拓宽自己的知识面，能够更全面的了解前端、服务器、数据库等的一些知识，对自己都是有所帮助的，而且公司和团队都鼓励大家写博客，我们的 AlloyTeam 博客就是因此不断壮大起来的，这些都会对自己的技术和发展有提升的。

3.  **听说你对 HTTPS 和 HTTP2 有所研究，能不能简单分享一些相关内容？**

其实对于 HTTPS，大家应该都有所了解，可能大家平时也都会用到，只是最近苹果宣布了将在 2017 年开始，强制 app 内部的请求要走更加安全的 HTTPS 协议才能通过审核，这一下把 HTTPS 的热度提升了一大截，尤其是在移动端，许多业务都开始了 HTTPS 改造，我们业务也不例外，很早就开始了对 HTTPS 和研究可改造。顾名思义 HTTPS 比 HTTP 多一个 S (Secure), 从字面上理解 HTTPS 更加安全，的确 HTTPS 和 HTTP 都是基于 TCP 的上层协议，HTTPS 多了一个 SSL/TLS 协议来保证数据传输的安全性，但是保证了安全的同时也会带来一些性能上的消耗，例如速度要比 HTTP 慢一些，但是有了 HTTP2 就不同了，HTTP2 的多路复用和请求头压缩等特性都能带来性能上的提升，结合 HTTP2 和 HTTPS 的应用和优化，性能上并不比 HTTP 差，所以我认为将来 HTTPS 和 HTTP2 的结合应用会成为前端的一大改变。

4.  **本次 AC 大会你将会分享 H5 直播的内容，你认为目前 H5 直播有哪些技术优劣？**  

* * *

H5 直播也可以说是移动直播目前是处于一个非常火爆的阶段，各大公司的产品都有涉及到直播的功能，所以我也想借此机会给大家分享一下其中的技术点和一些优化知识，其实 H5 直播主要还是用来播，关于视频的录制和上传还是最好采用终端来做，但是 H5 直播也有其不可替代的地方，例如 H5 的高效传播性能够让用户在不安装 app 的情况下观看直播内容，这些都是终端 app 做不到的。关于 H5 直播的优势主要就是传播性和跨平台性，H5 直播页能够满足用户观看直播中的一些常用需求例如评论点赞等等，但是劣势也是有的，基于 H5 播放直播视频时采用的 HLS 协议的延迟性要比终端 app 播放直播 RTMP 的延时性要差一些，并且对于交互过为复杂的直播页面，尤其是在一些低端机型上，移动 app 的体验还是要好一些，所以现在的直播产品一般是用 H5 直播页面播放直播视频来扩大传播性，将用户导入到自己的 app 里面使用直播的复杂交互功能。我本次也会给大家介绍一下整个的直播架构，包括前端，直播服务器等其中的一些技术点，手把手教大家搭建自己的直播服务。


<!-- {% endraw %} - for jekyll -->