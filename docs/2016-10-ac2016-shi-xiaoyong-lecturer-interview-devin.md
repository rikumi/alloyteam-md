---
title: AC2016 讲师专访 —— 石小勇 devin
date: 2016-10-19
author: TAT.Johnny
source_link: http://www.alloyteam.com/2016/10/ac2016-shi-xiaoyong-lecturer-interview-devin/
---

[![石小勇](http://www.alloyteam.com/wp-content/uploads/2016/10/粘贴图片_20160928202740-300x257.jpg)](http://www.alloyteam.com/wp-content/uploads/2016/10/粘贴图片_20160928202740.jpg)

讲师介绍  
石小勇 devin  
腾讯 AlloyTeam 高级工程师  
做过甲方乙方，前端后台，14 年正式从企业开发转型互联网，扎根前端。现致力于 react、vue 等热门技术在实际业务中的落地。Github 地址：<https://github.com/shixy>

1. React Native 发布 1 年时间了，但国内很少看到使用 React Native 做开发的，你觉得有哪些比较适合的应用场景？  

* * *

其实还是有不少人在用 ReactNative 开发 app 的，只不过还没有一些比较出众或者典型的 app 让大家熟知，这部分 app 大多为小团队或者个人来进行开发的。像腾讯这样的大公司确实很少有全部用 ReactNative 来开发的 app，不过一些大型 app 内部如手机 QQ，空间等 app 里还是有业务采纳了 ReactNative，这也从侧面反应了 ReactNative 存在一些问题。

我们先来看看，为什么我们要用 ReactNative？我个人的理解是：

1.  为了解决 H5 的痛点 - 体验差，H5 性能差诟病已久，动画、加载速度、操作反馈、长列表等等。我们团队曾经也针对 webview 做了很多的优化，包含去年 AC 大会上 cson 和教授的分享，但是这些都是治标不治本。在目前的情况下，纯 web 的体验在一些复杂或者要求高的产品中还是难以被接受。如果能有这么一项技术能够解决这个问题，那就皆大欢喜了，而 RN 正是这样的一项技术。
2.  javascript 开发。其实我这里的要说的是 javascript 开发人员，RN 是用 js 开发，虽然它没办法做到跨平台开发，但是 80% 以上的逻辑代码是可以复用的，不需要大量的 Android 和 iOS 的开发人员，这对人力紧张的小团队的人力成本和学习成本都有极大的改善。
3.  热更新机制。快速迭代，这是我们部分业务选择 web 而不是 native 的根本原因，RN 在给我们享受 Native 体验的同时还拥有了 web 得高效。

这是我为什么选择 RN 的原因，那为什么我们不用 ReactNative？

1.  版本不稳定。到现在已经一年多了，RN 版本仍然在更新，仍然没有达到 1.0 版本，各种 bug 依旧很多。这意味着我们要在生产环境应用 RN，必定要承担极大的风险。在腾讯内部其实有将 RN 与手 Q 进行整合，为了性能或者其他的优化，改动了很多源码，但是 RN 一升级，这些改动都需要同步，各中艰辛苦不堪言。
2.  需要 Native 同学重度参与，组件尚不完善。根据我们的一些实践，目前 facebook 官方提供的组件还是严重不足，总是有许多个性化的组件通过 js 无法实现，需要 Native 同学来协助开发，这与我们最初通过 js 来统治世界的初衷还是有差距的。
3.  性能相比 Native 还是有差距，内存问题，crash 都难以解决。配套的日志跟踪，测试，调试工具还没有跟上。App 不是开发完就结束了，后续的测试、维护、跟踪更为重要，Native 在这一领域已经非常的完善，RN 还是个新生儿。

好了，啰嗦了一堆，回归到主题。鉴于目前 RN 还有上述的问题，我的答案是：

1.  小型 App，工具类、生活类、阅读类等开发起来应该不会有什么大的问题，对于大型 App 如手 Q，微信等全部用 RN 就算了。不过，即便是小型 App，建议开发人员也需要掌握一部分 Android 和 iOS 的知识，毕竟我们还是要做优化的不是？
2.  大型 App 的非核心子业务。一般大型 App 都有安装包大小的限制，所以这类业务基本不可以用 Native 来实现，在这里进行一些 RN 的尝试也是有机会的。我们团队在这两个方面都有所尝试，内部也有使用 RN 来独立开发一些工具类 App。

[![哨兵 App](http://www.alloyteam.com/wp-content/uploads/2016/10/哨兵App.jpg)](http://www.alloyteam.com/wp-content/uploads/2016/10/哨兵App.jpg)

2. 你是如何看待 Weex、微信小程序这些类 React Native 框架的？  

* * *

我先简单说一下他们之间的差异吧。

     从大的架构上来看是它们是同一类东西，都是通过前端技术来进行 NativeApp 的开发，但还是有一些本质上的区别。

    ReactNaitve: 开源开放，大家可以作为使用者也可以作为组件提供者。你可以用 RN 来做一个独立的 App，也可以嵌在你原有的 App 里运行。

     小程序 / Weex： 受微信限制，运行在微信上。组件目前也只能是微信来提供，个人无法自定义 Native 组件，在你和 Native API 之间还有一层微信。

[![小程序原理](http://www.alloyteam.com/wp-content/uploads/2016/10/小程序原理.jpg)](http://www.alloyteam.com/wp-content/uploads/2016/10/小程序原理.jpg)

    RN 这类框架的流行是也是时代的产物。随着智能设备的崛起，H5 壮大了，但随着时间的推移以及人们对产品的高要求，H5 的弊端也逐渐的凸显，RN 这类框架的出现也显得理所当然。但是它还是代替不了 Native，大型 App 的功能还是要靠 Native，这就好比当年客户端游戏火了半边天比如传奇，后来出了网页版传奇，但是又出了 LOL，以后可能会有网页版 LOL，也会诞生出 LLOLL，总有你实现不了的地方。它也代替不了 H5，就目前看来，H5 还是跨平台的，而且很多需要传播需要分享的应用还是只能 H5。

3. 目前移动领域，Web 与客户端技术的结合越来越紧密，你认为未来趋势会是怎样的呢？  

* * *

这种情况应该还会持续很长一段时间，它们的结合也是为了取长补短，为了更快更好的服务于用户。

从用户的角度来看：

     目前人们的生活还是与智能手机息息相关，手机的承载量还是有限的，虽然标配从 8G 到 16G 再到 32G 或者更多，但还是不愿意安装太多的 app，特别是一些低频或者非核心应用。目前的情形还是用 web 或者小程序比较合适，这也是我理解为什么服务号和小程序为什么那么火的原因。

从产品和开发者的角度来看：

     在这个人力成本和竞争越来越激烈的时代，能够跨平台和快速迭代，抢占优势地位显得更为重要。开发者也不需要兼容那么多的平台，将更多的精力投入到产品优化和性能提升上。而当前的现状是 H5 并不能提供那么多的能力，有了 Native 的帮助就如鱼得水了。RN 和小程序目前还是一个不稳定的状态，随着时间的推移，它们可能会蚕食一部分 H5 应用，但不管怎样，它还是 web 开发哈，我们又可以要求涨工资了。js 必将统治世界！哈哈！

[![装逼表情](http://www.alloyteam.com/wp-content/uploads/2016/10/装逼表情.png)](http://www.alloyteam.com/wp-content/uploads/2016/10/装逼表情.png)

当然，我们也不排除以后随着标准的进行，H5 的性能会变得越来越好，RN、小程序甚至是 Native 都会被慢慢替代，成为王者。让我们一起期待这一天。