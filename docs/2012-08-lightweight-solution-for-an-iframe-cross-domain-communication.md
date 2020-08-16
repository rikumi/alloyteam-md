---
title: iframe 跨域通信的通用解决方案
date: 2012-08-10
author: TAT.Johnny
source_link: http://www.alloyteam.com/2012/08/lightweight-solution-for-an-iframe-cross-domain-communication/
---

<!-- {% raw %} - for jekyll -->

[![2 个信使的情况](http://www.alloyteam.com/wp-content/uploads/2012/08/two_messenger.png "图 2")](http://www.alloyteam.com/wp-content/uploads/2012/08/two_messenger.png)

此方案已有新版本，请查看 [《iframe 跨域通信的通用解决方案 - 第二弹！（终极解决方案）》](http://www.alloyteam.com/2013/11/the-second-version-universal-solution-iframe-cross-domain-communication/)。本文章可做技术学习供继续交流。

**一、背景**

在这个 Web 页面越来越丰富的时代，页面通过 iframe 嵌入其他的页面也越来越常见。但由于浏览器同源策略的限制，不同域之间属性和操作是无法直接交互的，所以在这个时候，开发者多多少少需要一些方案来突破这些限制。跨域问题涉及的地方也很多，如文档之间的消息通信、ajax 请求、Cookie 等，本文讨论的是 iframe 和父页面的消息通信。

**二、现状**

目前网上也可以找到各种解决方案（少说都有 10 + 个，有兴趣的话可以[去看看](http://www.woiweb.net/10-cross-domain-methods.html)），对于现代浏览器来说，原生的 postMessage API 一定是不二的选择，所以各种方案的不同点均在于 IE 6、7 中的处理（不用兼容 IE6、7 的同志可以去看其他文章了）。当然这么多方案有各种优缺点，甚至有些只支持单向跨域，个人觉得实际意义不大。另外一些方案需要 proxy.html 这样的代理页面做中转，但是涉及服务器上的部署，并且对于多方合作来说还是有些麻烦。

**三、思路**

虽然不再复述现有的各种方案，但还是想交待一点上下文。相信网上看到最多方案就是利用 location.hash 或是 window.name 进行 iframe 的跨域通信：

-   location.hash 会直接暴露在 URL 里，并且在一些浏览器里会产生历史记录，数据安全性不高也影响用户体验，所以不做考虑。另外由于 URL 大小的限制，支持传递的数据量也不大。
-   window.name 相比来讲就好很多了，支持 2M 的数据量，并且当 iframe 的页面跳到其他地址时，其 window.name 值保持不变，副作用可以说是最小的。

讲到这思路也比较清晰了，咱们就用 window.name 呗，但问题又来了：只有两个页面同域时才能访问 window.name。这个问题还好，只要把 iframe 改为与父页面同域就可以了。这又衍生了新的问题：这不是意味着只能单向通信了吗，iframe 怎么向父页面发消息（不可能去改父页面的 location 吧）？在暗骂坑爹的同时偶然发现了一个很神奇的方法，就是想访问一个 iframe 的 window.name 时，只要将其 location 改为 ‘about:blank’ 即可，屡试不爽～没错这个 “特性” 可以视为 IE6/7 的一项安全性问题，但利用这个特性来进行跨域通信并没有实际的安全风险。

具体的实现见下图，在 iframe 的内部再创建一个 iframe（我们称之为信使），父子页面轮询信使的 window.name，父子页面各自使用变量保存 window.name，轮询时发现有变化即被视为收到消息。基本原理就是这么简单，我们继续..

[![1 个信使的情况](http://www.alloyteam.com/wp-content/uploads/2012/08/one_messenger1.png "图 1")](http://www.alloyteam.com/wp-content/uploads/2012/08/one_messenger1.png)

图 1

作为一个通用的解决方案，我们的目标是提供一个 js 文件，封装通信的接口，需要通信的页面只要加载 js 文件就行。但在封装前，需要考虑更复杂一点的情况：当父子页面双方频率较高地双向通信时，如何进行支持？按照上述的方案，信使的 window.name 并没有读写锁的概念，这意味着消息很容易乱掉或被漏掉。所以更好的方案应该是：创建两个信使，分别负责 "父 --> 子" 和 "子 --> 父" 的消息传递，并且为了防止消息被冲掉，发送消息时会维护一个消息队列，在取消息时处理消息队列里的所有消息。见图 2。

[![2 个信使的情况](http://www.alloyteam.com/wp-content/uploads/2012/08/two_messenger.png "图 2")](http://www.alloyteam.com/wp-content/uploads/2012/08/two_messenger.png)

图 2

**四、封装**

最后的封装就是加入了 postMessage API 的检测，另外也要判断是否为跨域，这样就满足了所有 iframe 通信的情况了。这里实现的信使只负责消息的监听和发送，所以在使用上是非常简单的：

```javascript
// 父页面中
// 初始化信使, 告知与其交互的iframe引用
var messenger = Messenger.initInParent(iframeEl);
 
// 监听消息
messenger.onmessage = function (data) {
          ...
};
 
// 发送消息
messenger.send(message);
```

```javascript
// iframe中
// 初始化信使
var messenger = Messenger.initInIframe();
 
// 监听消息
messenger.onmessage = function (data) {
      ...
};
 
// 发送消息
messenger.send(message);
```

具体使用可以参考下方的 demo : )

**五、总结**

虽然国内也有人提过使用 "about:blank" 进行 iframe 通信的，但是代码的封装和可读性都不是太好，[本方案](http://www.ne.jp/asahi/nanto/moon/2011/12/08/ie-post-message.html)是一日本人所提出，我觉得处理的很好，所以就拿出来和大家分享下。虽然尝试过优化轮询那一块，但暂时无果，有兴趣的朋友可以一起研究下～

**DEMO：[点击这里](http://www.alloyteam.com/wp-content/uploads/2012/08/parent.html)**

**脚本下载：<http://biqing.alloyteam.com/lab/messenger/messenger.js>**

**GitHub：<https://github.com/biqing/MessengerJS>**

<!-- {% endraw %} - for jekyll -->