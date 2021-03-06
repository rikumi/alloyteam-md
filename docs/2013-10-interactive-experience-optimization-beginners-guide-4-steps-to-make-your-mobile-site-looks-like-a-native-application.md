---
title: 交互体验优化：4 步让移动网站看起来像本地应用
date: 2013-10-31
author: TAT.sheran
source_link: http://www.alloyteam.com/2013/10/interactive-experience-optimization-beginners-guide-4-steps-to-make-your-mobile-site-looks-like-a-native-application/
---

<!-- {% raw %} - for jekyll -->

译自：[  
A Beginner's Guide to Perceived Performance: 4 Ways to Make Your Mobile Site Feel Like a Native App](http://www.mobify.com/blog/beginners-guide-to-perceived-performance/)  
原作者：Kyle leads  
译者：  [TAT.sheran](http://weibo.com/flylan)

_注：该文章大约 3000 字。它覆盖了移动端网页交互体验优化的很多不同方面的实际解决方案，用来优化你的网页运行速度。注意不是让你的站点运行的有多快，而是让你的用户感觉有多快。_

_[  
![A Beginner's Guide to Perceived Performance](http://www.mobify.com/static/blog/2013/09/perceived-performance.png)](http://www.alloyteam.com/blog/beginners-guide-to-perceived-performance/)_

当下在移动端构建一个优秀的网站逐渐变得越来越简单。无论是响应式设计还是自适应式，只要清楚你要做的样式，精心制作一个好看的站点就不是什么问题。

也许你的用户和我们一样，想要一个像本地应用体验的网站，所以构建这样的体验将会带来很大的挑战。

大多数时候，当人们说一个应用就像一个原生程序或者像本地应用，他们并不是在讨论这个网站的外观。相反，他们讨论的是当他们做出的一些操作之后的响应效果。

本地应用相对于 Web 应用要快得多，动画效果渲染也更加平滑；当点击按钮时，按钮自身会立即响应变化的样式，不管操作是否加载成功，都不会报错。

**使你的站点看起来想本地应用，意味着要尽一切可能的方法使你的站点快速的响应。**

当今，性能优化是一个非常热门的话题。最近，网站开发已经越来越重量级，网页越重代表运行得越慢，所以有人声称做一个高性能的网页应用程序几乎是不可能的。

这就是为什么 [Facebook 不得不转向本地应用](http://www.infoq.com/news/2012/09/Facebook-HTML5-Native)的原因。因为从目前所拥有的 Web 资源来看，并不能达到他们期望的运行速度和交互体验。

尽管 Facebook 也这么认为，但是构建一个高性能的网站还是有可能的。虽然并不容易，但还是在我们可控制的范围内。我们只是需要花更多的精力去将它实现而已。从技术上说，我们有能力使我们的网站运行地更快，看上去更现代化，以及拥有更完美的交互体验。

## 体验性能 VS 实际性能

虽然提高实际性能很重要，但这并不意味着用户最终能够感觉到改善。

年初在西雅图的一次 An Event Apart 会议中，Luke Wroblewski 讲述了下关于他们的[移动应用 Polar](http://www.lukew.com/ff/entry.asp?1797)。他阐述到他和他的团队非常努力地优化每次加载新的选票所需时间。

于此同时，当发送加载选票的异步请求时，他们用了一个轻量的微调控件提示用户。但是用户反馈在加载新的选票时显示微调控件让他们感觉比以前慢了好多，尽管实际上它比以前更快。Polar 迅速发布了一个版本移除了这个微调控件，然后用户马上就觉得页面加载快了好多。

这个例子能很好的说明用户对性能感知的重要性。你的网站是否真正运行非常快并不重要。就像这个微调控件的例子，它只是吸引了用户的注意力，但事实上仍然让用户感觉在等待响应，而正确的做法是，我们应该去分散用户的注意力。

**作为设计师和开发者，我们的目标不仅仅是从学术理论上创造一个快速的站点，而更应该从体验上去创造一个最快的站点。**

用户是如何感知你的站点的运行速度才是最重要的，任何实际速度的提升不过是一个已经精心装饰好的蛋糕外帽。我认为体验性能优化比实际性能优化更重要，但绝不代表不应该去做实际性能优化。

综上所述，你该做些什么来优化你站点的体验性能呢？

## **这里有四个技巧，你可以立即开始实施。**

1. 给你的按钮增加触摸状态

在移动设备上改善网站体验性能最容易的方法之一就是使用激活状态。

众所周知，用户在任何时候点击你网页上的按钮，在网页响应前他都必须等待约 300 毫秒。

浏览器会保持这个延时，这样它才能确保用户并不是想做其它动作（准确地说就是双击）。所以浏览器在这三分之一秒内检测用户是否有其它操作，如果没有，则响应用户上一次点击。当这个事件最终发生时，它会给出一个灰色的高亮展示给用户。

这是一个糟糕的体验，Nielsen 团队进行了一项调查，结果显示任何[超过 100 毫秒的响应都会让用户感到他们在等待](http://www.nngroup.com/articles/response-times-3-important-limits/)—— 而用户想要的仅仅是浏览你的网页。

然而大多数的移动站点，包括我自己创建的，并没有应用这个体验设计，设计师们总是使用链接或者按钮的默认触摸状态。

**要使你的站点感觉快，就要让你的按钮能够及时响应用户的点击事件，并且在状态改变时给用户一个可见的反馈。**

有一个非常好用的 CSS 伪类叫做 active 状态，它可以用来在网页上显示一个按钮或者链接被点击了。我们也可以同时把它使用在 PC 端浏览器上。

不幸的是，无论是 iOS 还是 Android 上的链接或者按钮被点击的时候都会忽略这个属性。为了使用这个 active 状态，你需要使用 JavaScript 给页面添加一个简单的事件:

```javascript
document.addEventListener("touchstart", function () {}, true);
```

这样，你就可以使用 CSS 来给按钮添加 active 状态或者移除点击高亮的状态了:

```css
-Webkit-tap-highlight-color: rgba(0,0,0,0);
```

给你创建的按钮添加了这些属性和 active 状态之后，用户就可以立即感觉到页面的反馈，即使实际上真实的反馈速度并没有改变。你只是让用户针对自己的行为得到了一个及时的反馈，而不是让他们等待 300 毫秒后才看到页面响应。

![Without Touch States](http://www.mobify.com/static/blog/2013/09/notapstate.gif)

##### Without Touch State([code](http://codepen.io/mobify/full/ulwqf))

![Withough Touch States](http://www.mobify.com/static/blog/2013/09/tapstate.gif)

##### With Touch State([code](http://codepen.io/mobify/full/ulwqf))

**如果你想要使页面立即响应，你可以做进一步的改进。**

使用一个 fasttap 或者 fastclick 函数，可以完全消除点击按钮时 300 毫秒的延时，与 active 状态搭配使用，可以让你的站点拥有飞一般的速度。

关于更多 fasttap 的信息，可以参考谷歌的这篇文章 [this article by Google](http://developers.google.com/mobile/articles/fast_buttons) 或者 Github 上的一个现成的实现 [this repo on Github](http://github.com/ftlabs/fastclick)。

2. 使用默认滚动

你曾经是否尝试在自己的站点上创建一个可滚动的容器，或者被一个运行起来非常慢，并且没有任何响应的滚动条困住？

幸运的是，Android 3+ 和 iOS 5+ 都实现了一个新的名叫 overflow-scroll 的属性，用来开启原生的滚动条，它运行起来非常完美。

![\>No Momentum Scrolling](http://www.mobify.com/static/blog/2013/09/nooverflowscroll.gif)

##### No Momentum Scrolling ([code](http://codepen.io/mobify/full/LueFn))

![With Momentum Scrolling](http://www.mobify.com/static/blog/2013/09/overflowscroll.gif)

##### With Momentum Scrolling ([code](http://codepen.io/mobify/full/vLcky))

这个滚动条使用起来就像是使用本地程序的感觉，实际上它就是原生的，你需要做的只是给你的滚动容器添加这个属性：

```css
-Webkit-overflow-scrolling: touch;
```

然而，关于这个属性还存在一个问题，那就是当滚动到页面最顶部的时候会禁止你的 iphone 显示状态栏。这个 BUG 已经存在有段时间了，即使是最新版本 iOS7 上的移动版 Safari 都没有解决这个问题。

解决这个问题的方法之一是：创建一个类来给容器添加 overflow-scrolling:touch 属性。然后只有当容器处于可见状态 时，使用 JavaScript 去应用这个类，使其生效。

在 Android 4 上你不需要这个属性，因为每个可滚动的容器都包含了原生滚动条。

在比较老的 Android 版本下，你有两个选择方案。我最喜欢的一个方法是检测容器是否支持滚动溢出属性来判断是否支持原生滚动。如果不支持，有几个 JavaScript 库可以用来代替，Filament Group’s [Overthrow](http://filamentgroup.github.io/Overthrow/) 和 [iScroll](http://cubiq.org/iscroll-4) 都是很不错的实现方案。

3. 创建高性能动画

在 Web 网站和本地应用之间最显著的差别是动画的使用。

多年前，本地应用在当今设备中就能够充分利用硬件图形加速。而在 Web 端，开发者却只能基于 JavaScript 来实现动画，对于移动端功能比较弱的 CPU 来说，运行起来会比较慢。

但是现在，随着移动浏览器的支持，我们可以大量利用 CSS3 动画来实现硬件加速。

**这是一个英明的方法来添加那些我们喜欢的，本地应用都已经炫耀了多年的动画特效。**

如果还是觉得不够快？要让 Web 动画感觉像本地动画，你必须确保你的动画运行起来不会慢或者足够稳定，这些都是相当困难的。

Allen Pike of Steamclock Software (一家软件公司) [2011 年发表了一篇很赞的文章](http://www.allenpike.com/2011/providing-joy-at-60-fps/)，大意为给用户提供一个有趣的不影响性能的动画，可以使用户对这个应用有一个非常好的印象。

有趣的是，这篇文章是关于本地应用开发的，但我们可以参考这篇文章用来在网页站点上创建类似本地应用的动画。

在这篇文章中，他描述了一个他所谓的 “时间感知”：

**1. 动画的帧数至少要有 60fps。**这意味着每帧最起码都要在 [16 毫秒内完成](http://speakerdeck.com/jaffathecake/rendering-without-lumps)，这样才能让人感觉动画是原生的或者是平滑的。所有 iOS 的内置动画都保持在 60fps 的运行速度，这就是为什么在 iPhone 设备上滚动的感觉明显比 Android 设备好的原因（虽然谷歌最近在这个领域取得了很大的改善）。你应该确保所有跟用户有直接交互的动画都保持在这个速度才行。

**2. 所有事件的响应都应该保持在 100 毫秒以内。**如果超过这个心理门槛，用户就会有慢的感觉，反之任何低于 100 毫秒的响应对用户来说都是一瞬间的体验。

**3. 如果一个动画一定需要超过 100 毫秒，那也至少要保证在 1000 毫秒内完成。**Allen 认为任何需要在这么长时间的行为都需要给用户一个反馈，比如一个进度控件或者一个滚动条。

但是正如我们前面介绍的 Polar 的例子，转移用户注意力实际上是弊大于利的。稍后我们将介绍一个不同的方法来处理这个问题。

**4. 任何一个超过 1 秒的响应都是不好的，并且需要谨慎。**

当创建一个网站的时候，你还不得不考虑动画运行时间，知道这一切之后是否有种想转行的冲动？

不要担心，有些很好的资源可以使这些东西变得容易得多。

首先，有一个基于 HTML5 的一个 CSS 库，叫做 [Effeckt.css](http://github.com/h5bp/Effeckt.css)。这个库的目的是创建一个公用的动画，它们的帧数都处于 60fps。虽然这个库还没有完全完成，但是库里的很多动画都已经可以很好的运行了，我们强烈推荐使用这个库来满足你们的项目需求。

另外一个非常好用的库就是 Adobe 公司的前端团队开发的 [Topcoat](http://topcoat.io/) 库，这是一个以性能为中心的 CSS 组件库，这个库里全是能够运行得非常顺畅的组件。因为动画性能是他们的主要目标，组件的每一部分，你都可以看到[它究竟是如何执行](http://bench.topcoat.io/)的。

Topcoat 和 Effeckt.css 可以结合一起使用，Topcoat 可以直接使用 Effeckt.css 的功能，并且可以很完美的融合在一起。

**接下来，我们来讨论前面提到的尽可能避免 spinners 问题的方法。**

我的首选方法是避免 spinners 的等待时间不会超过 100 毫秒，但对于小于 250 毫秒的等待我会 (使用 spinner 实际上是弊大于利的) 用一个动画来隐藏它。

例如，你正在异步拉取一段内容的时候，尝试使用动画让容器缩上去，再缩回来以适应新的内容。这样一个简短的动画可以分散用户注意力，而不是盯着一个 spinner，他们只需等待一个很短的动画完成。甚至他们都不知道是否有新的内容。

当然，那些重复且需要花费长时间完成的动画有可能让人觉得厌烦，所以一定要确保有节制的使用这些技术，对于大多数的动画而言这都是一个很好的建议。

4. 手势利用

本地应用优于 Web 应用的优势在于他们能够利用手势，对于使用触摸屏幕的用户来说，这样能够更加友好。

移动开发者已经意识到手势的魅力所在，并很快就使其得到了很好的利用。

看看类似 [Mailbox](http://www.mailboxapp.com/) 或者 [Clear](http://www.realmacsoftware.com/clear/) 这样的例子，这些应用都使用了简单的手势，充分发挥了移动设备最大的优势 —— 能够直接触摸屏幕的能力。

大多数网站都只会使用手势点击来触发事件，设计师甚至不想去实现其它手势，这样给用户像一个二等公民待遇的感觉。

我们开始考虑直接为这些设备开发特定的网站。如果用户的设备支持手势功能，那么为什么不利用他们呢？

当然，移动操作系统都存在一个问题那就是：劫持在浏览器中的手势，而去执行系统自身的响应。

对于本地应用，比如 Facebook 使用屏幕左右边缘的滑动开拓导航。然而不幸的是，对于 Web 应用来说，这种行为叫出界，Chrome 会使用这个操作来切换选项卡，新版本的 [iOS7 的 Safari 浏览器却会使用它来历史前进和后退。](http://www.mobify.com/blog/designing-for-ios-7/)

好把，这些手势还是有相当多的限制的，究竟哪些可供我们使用呢？这里有 4 个：

**手势 1 一侧到另一侧的滑动**

即使即将出界，一侧到另外一侧的滑动也是一个相当不错的手势，只是需要注意的是不要太靠近屏幕的边缘了。

**手势 2 拉取刷新**

拉取刷新是让用户去获取数据的另外一个手势，有一大堆 JavaScript 库可以很简单的去实现这个手势，有一个我以前用过的库叫 [Hook.js](http://usehook.com/)。

**手势 3 长按**

有一个很有用的属性叫做 –Webkit-touch-callout: none; 它将关闭移动端 Safari 默认的长按事件，但是你想要在 Android 上关闭它还需要[额外的工作](http://stackoverflow.com/questions/3413683/disabling-the-context-menu-on-long-taps-on-android)。

长按手势主要用于拖动一个元素（比如重排一个列表的顺序）或者展示更多操作给用户（例如，社交分享）。

**手势 4 缩放功能**

每个人都理解缩放，大多数人在网站上看到一个照片的时候都会去缩放来查看更多细节。

有时候浏览器也会劫持这种手势，即使这样，也没有那么糟糕。

无论是否需要锁定整个窗口的放大或者缩小，有时你也并不希望用户去缩放整个页面。为了接管这些多点触摸，你可以使用一个非常轻量库叫 [Hammer.js](http://eightmedia.github.io/hammer.js/)，这个库里有一堆手势，你可以使用内置的手势，也可以创建你自己的。

这有一个很优秀的图片缩放示例网站 [imgur.com mobile Website](http://imgur.com/gallery/U6HYTnm)，它能够检测你的触摸方法。

但是要注意的是，如果你使用了一个手势，请确保它是一个让用户感觉自然或有意义的行为。

## **总结**

但愿有那么一天，我们不需要再区分本地应用还是 Web 应用。虽然这一天还没达到，但只要我们一直努力，使我们的网站让用户感受到是为他们量身打造，我相信那天一定会很快到来。

**我觉得专注性能优化虽然是件好事，但我们也必须记住，我们的用户不是机器。**

他们不关心你的网站发出了多少请求，也不在乎你的屏幕渲染得有多快。他们只关心网站带给他们体验上的感觉。

**重要的是如何让你的网站看起来或者感觉上是最快的。那些用户无法感知的高速网站是毫无意义的。**

如果你有更多提高体验性能的建议，请在评论中发表。


<!-- {% endraw %} - for jekyll -->