---
title: iframe 跨域通信的通用解决方案 - 第二弹！（终极解决方案）
date: 2013-11-29
author: TAT.Johnny
source_link: http://www.alloyteam.com/2013/11/the-second-version-universal-solution-iframe-cross-domain-communication/
---

<!-- {% raw %} - for jekyll -->

一年前，我发过一篇关于跨文档通信方案的文章 [《iframe 跨域通信的通用解决方案》](http://www.alloyteam.com/2012/08/lightweight-solution-for-an-iframe-cross-domain-communication/)，提供了一种基于创建 iframe 与轮询 window.name 的方案。

一年后，很高兴地带来彻底改造的新版本。实际上新方案已经用了很久了，一直没有时间抽象出来，最近终于挤时间分享出来了！~

[![MessengerJS](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ截图20131129204225.png)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ截图20131129204225.png)

## 回望过去

第一版的方案还是有不少问题，这里统一回复与总结一下。第一次使用 MessengerJS 的同学，可以直接跳到下面的 “新版使用” 小节。

### 无法使用的反馈

第一版方案，在一定程度上可以解决 iframe 通信的问题，但从大家的反馈上看，还是存在一些不足。这里列举一下评论里反馈的问题：

-   HTTP 与 HTTPS，无法通信
-   IE6 在某些设置下，无法通信
-   js 设置 document.domain 后，无法通信

\*上述问题本人并未全部确认

### 性能有损

第一版方案，需要在内层的 iframe 中创建两个 iframe，并且需要跑定时器轮询 window.name，其性能必然有所损耗，更不要说在 IE6/7 下执行这样的操作。如果父窗口要与两个 iframe 通信，那么性能的问题也会成倍增长。

### API 不一致

第一版方案，为父窗口和 iframe 提供了不同的 API。这样的设计并不友好，使用者应该把每个窗口对象统一对待。

### 多 iframe 通信？

多个 iframe 无法直接通信，需要父窗口中转才行。

## 问题新版都解决了？

那是必须的，上述问题全部得以解决，更重要的是，代码量还减少了 50%+！

## 新方案原理概述

概念上，方案的理念还是使用 “信使” 概念，即 Messenger。

对于现代浏览器，postMessage API 还是无可撼动的。IE6/7 下，使用的是一个被认为是 bug 或安全漏洞的特性，即**navigator 对象在父窗口和 iframe 之间是共享的**。基于这一点，我们可以在父窗口中，在 navigator 对象上注册一个消息回调函数；在 iframe 中，调用 navigator 上的这个函数并传入参数。此时可看作，iframe 往父窗口的一个函数传递了一个参数，并在父窗口的上下文中执行了，那么就相当于 iframe 向父窗口发送了一条消息。反之亦然。

原理就是这么简单（这次我连图都不用画了），好处也是很明显的：

-   该方案不依赖浏览器的各项设计，不受设置影响，同时完美支持 HTTPS
-   不用创建多余 iframe，基于接口调用，不需要轮询，性能大幅提升
-   良好的接口封装，所有窗口对象统一对待
-   多 iframe 也不怕，navigator 对象的共享，让 iframe 之间直接通信成为可能

## 关于安全性

有些同学认为上述方案存在安全风险，也有在 wuyun 反馈这类问题，但微软并没有去修改。

其实并不用担心，这里做个简单说明：

我们只将消息回调函数注册在 navigator 对象上，虽然任何引入的脚本或页面，都可以向 navigator 上发消息，但这其实和 postMessage 不限域的情况并无差异。这里对开发者的建议是，传递消息使用 JSON String 的形式，使用一个字段做消息有效性的验证。如果怕一个固定值（如项目名）不安全，可以使用一个简单的加密算法，并对业务脚本进行压缩混淆，此时的安全风险可以降到最低。

## 好处说完了，怎么用？

最新的使用方法，请参见 Github 项目主页: <http://biqing.github.io/MessengerJS/>

1.  在需要通信的文档中 (父窗口和 iframe 们), 都确保引入 MessengerJS
2.  每一个文档 (`document`), 都需要自己的 `Messenger` 与其他文档通信。即每一个 `window` 对象都对应着一个，且仅有一个 `Messenger` 对象，该 `Messenger` 对象会负责当前 `window` 的所有通信任务。每个 `Messenger` 对象都需要唯一的名字，这样它们才可以知道跟谁通信.  

    ```javascript
    // 父窗口中 - 初始化Messenger对象
    var messenger = new Messenger("Parent");
    // iframe中 - 初始化Messenger对象
    var messenger = new Messenger("iframe1");
    // 多个iframe, 使用不同的名字
    var messenger = new Messenger("iframe2");
    ```
3.  在发送消息前，确保目标文档已经监听了消息事件.  

    ```javascript
    // iframe中 - 监听消息
    // 回调函数按照监听的顺序执行
    messenger.listen(function (msg) {
        alert("收到消息: " + msg);
    });
    ```
4.  父窗口想给 iframe 发消息，它怎么知道 iframe 的存在呢？添加一个消息对象吧.  

        // 父窗口中 - 添加消息对象, 明确告诉父窗口iframe的window引用与名字
        messenger.addTarget(iframe1.contentWindow, 'iframe1');
         
        // 父窗口中 - 可以添加多个消息对象
        messenger.addTarget(iframe2.contentWindow, 'iframe2');
5.  一切 ready, 发消息吧～发送消息有两种方式. (以父窗口向 iframe 发消息为例)  

        // 父窗口中 - 向单个iframe发消息
        messenger.targets['iframe1'].send(msg1);
        messenger.targets['iframe2'].send(msg2);
         
        // 父窗口中 - 向所有目标iframe广播消息
        messenger.send(msg);
6.  现在看到 iframe 收到消息的 alert 提示了吗？

    更多

* * *

Demo: <http://biqing.github.io/labs/messenger/parent.html>

项目主页：<http://biqing.github.io/MessengerJS/>

欢迎反馈，使用中遇到问题一定要告诉我哟！

<!-- {% endraw %} - for jekyll -->