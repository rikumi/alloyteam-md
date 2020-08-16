---
title: CodeNow 让你在浏览器实时调试代码你的 API 代码
date: 2012-05-07
author: TAT.Kinvix
source_link: http://www.alloyteam.com/2012/05/codenow%e8%ae%a9%e4%bd%a0%e5%9c%a8%e6%b5%8f%e8%a7%88%e5%99%a8%e5%ae%9e%e6%97%b6%e8%b0%83%e8%af%95%e4%bb%a3%e7%a0%81%e4%bd%a0%e7%9a%84api%e4%bb%a3%e7%a0%81/
---

[![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/064644lO0.jpg "codenow")](http://www.alloyteam.com/?attachment_id=106339)

几乎所有互联网巨头都会开放自己的 API，但是对于开发者来说试新 API 却是件棘手的事。在开始写第一行代码之前，也许得折腾几个小时来做好设置、获得权限，还得先学习语法。因此，由 Amazon 前员工设立的初创企业[**CodeNow.com**](http://www.codenow.com/)瞄准了这一点需求，帮助开发者简化测试 API 前的准备步骤。

该网站目前仍处于非公开 beta 版，但是感兴趣的开发者可以提供电子邮件地址来申请对方的邀请。

其界面很简洁。左边面板是代码，右边则是结果窗口。代码测试无需客户端，完全在浏览器运行。[TC](http://techcrunch.com/2012/05/04/new-start-up-codenow-com-lets-you-build-and-test-code-in-real-time-in-your-browser/) 提供了一些界面：

下图这个界面是一个很简单的 FacebookAPI 调用，返回的是一组用户列表。

[![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/064648ZKb.png "screen-shot-2012-05-05-at-1-57-21-am")](http://www.alloyteam.com/?attachment_id=106335)

其实现机制是把代码放到把环境准备好的虚拟机器上运行，代码可以实时改变，结果即刻显示：

[![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/064650aRZ.png "screen-shot-2012-05-05-at-1-58-13-am")](http://www.alloyteam.com/?attachment_id=106336)

CodeNow 几乎支持所有的 API，包括 Dropbox、Twilio 以及 Facebook 等的，测试好的代码可以一键分享链接。

网站创始人 Yash Kumar 是 Amazon 的前员工，创办该网站的灵感源自在 Amazon 时一位产品经理的抱怨，对方说尽管自己具备相关编程知识，但是想调试一个新的 API 也要花掉数天。

CodeNow 是在[**AngelPad**](http://angelpad.org/)孵化器登录的第一家初创企业。其货币化计划是提供 API 发现功能，向 API 提供商收取费用。

(转自 36kr)