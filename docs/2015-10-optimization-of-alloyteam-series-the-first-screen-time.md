---
title: 【AlloyTeam 优化系列】纯前端优化首屏时间
date: 2015-10-12
author: TAT.heyli
source_link: http://www.alloyteam.com/2015/10/optimization-of-alloyteam-series-the-first-screen-time/
---

<!-- {% raw %} - for jekyll -->

**背景：**

1. 对构建的改造已经完成，目前构建的能力可以较为灵活地支撑进一步的优化

2. 希望进一步减少首屏时间，将首屏时间控制在 2 秒以内

**页面情况：**

优化之前，并没有上报首屏时间，页面加载时间约为 2.4 秒。

研究认为，用户最满意的网页打开时间是 2 秒以内。作为一个相对简单的页面，我们就应该最可能将首屏时间甚至加载时间控制在 2 秒以内，让用户体验到最佳的页面体验。

**定义页面的首屏与加载时间：**

首屏时间，英文称之为 above the fold (首屏线之上)。我们以手 Q 群成员分布的页面作为例子。在 iPhone5 屏幕下，这个页面在没有往下滚动的时候，如左图。滚动到底部时，如右图。

[![pasted image 0 (3)](http://www.alloyteam.com/wp-content/uploads/2015/10/pasted-image-0-3.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/pasted-image-0-3.png) [![pasted image 0](http://www.alloyteam.com/wp-content/uploads/2015/10/pasted-image-01.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/pasted-image-01.png)

我们所说的首屏时间，就是指用户在没有滚动时候看到的内容渲染完成并且可以交互的时间。至于加载时间，则是整个页面滚动到底部，所有内容加载完毕并可交互的时间。

在这个页面中，我们可以划分成四个部份，分别是活跃 群成员、男女比例、省市分布及年龄。我们将前三个部份归入首屏渲染时间。剩下的内容加载时间加上首屏加载时间即是页面加载时间。

另外值得一提的是，由于之前项目的开发将动画渲染时间也纳入统计，因此为了方便对比，我也将渲染时间纳入统计。实际上，如果除去动画渲染时间，首屏及加载时间会快 300 - 500ms。

 

**已经做好的优化:**

除非各种性能优化书籍提出的要点之外，在这篇优化之前已经做到的优化并值得简单提出来的有两点。

1. 活跃群成员头像的懒加载。由于手 Q 的头像允许 gif，因此直接加载头像性能会比较低下。因此之前在完成这块业务的逻辑的时候，已经添加上懒加载，业务渲染的时候显示默认头像，等真实头像加载完成的时候再进行渲染。而且，在这次的优化项目中，我们并不将头像的加载时间也纳入首屏时间内。

2. 其它内容动画的滚动渲染。其它部份的内容是会由滚动渲染效果的（这些逻辑并不由本人写）。感谢前人做比较模块化地做好了这部份逻辑，因此我能够比较容易地进行代码的搬迁与更改。

 

**纯前端手段优化页面加载及渲染模式:**

[![pasted image 0 (1)](http://www.alloyteam.com/wp-content/uploads/2015/10/pasted-image-0-1.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/pasted-image-0-1.png)

上图是项目旧有的加载模式，是比较通常的页面加载渲染模式。将 css 放在 head 标签内，为了避免阻塞将 js 放在底部。因此页面渲染完成后，还需要等待 js 的加载，js 拉取数据以及 js 的渲染。 这便大大地减慢了首屏及加载时间。

从性能的角度看，将整个加载渲染模式换成下面的模式更有利于首屏的渲染，我们可以称之为首屏优先加载渲染模式。

[![pasted image 0 (2)](http://www.alloyteam.com/wp-content/uploads/2015/10/pasted-image-0-2.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/pasted-image-0-2.png)

 

根据上述的模型，我们可以将首屏优先模式总结为三个原则，一是首屏数据拉取逻辑置于顶部，二是首屏渲染 css 及 js 逻辑优先内联 HTML，三是次屏逻辑延后处理和执行。

原则一：首屏数据拉取逻辑置于顶部，是为了数据能够第一时间返回，相比起将数据拉取逻辑放在外部资源会少了一个 JS 资源加载的往返时间。

原则二：首屏渲染 css 及 js 逻辑优先内联 HTML，这是为了当 HTML 文档返回时 CSS 和 JS 能够立即执行。但要注意的是 HTML 文档最好不要超过 14kb。这是由于，TCP 协议里面有一个流控机制，被称为 slow start，也就是在连接建立过程中逐渐增加传输的分段 (segments) 大小，根据 Paul Irish 在他的演讲[“Delivering the Goods”](https://docs.google.com/presentation/d/1MtDBNTH1g7CZzhwlJ1raEJagA8qM3uoV7ta6i66bO2M/present#slide=id.g3eb97ca8f_10) 给出的结论是，一个 Web 应用最开始的 14kb 数据是最重要的。

原则三：次屏逻辑延后处理和执行，各种数据上报最好是延时上报，这样可以减少阻塞。对于首屏的数据上报，可以先将数据存在变量里面，等上报组件 report.js 加载完毕后，再调用回调进行上报。

新人可能会问将这么多代码内联很不优雅，而且很麻烦呀。如果你用的构建是一个合格的构建，你大可以用构建帮你进行内联，这并不是很费时的事情（这也是为什么我将构建作为优化的第一篇章，构建给优化带来便利）。

经过优化以后，首屏时间方面，非离线包版本达到 1400ms 左右，离线包版本则达到 850ms 左右。

[![png;base64482f3b2f69dfa50b](http://www.alloyteam.com/wp-content/uploads/2015/10/pngbase64482f3b2f69dfa50b.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/pngbase64482f3b2f69dfa50b.png)

[![png;base64bf518ecb266e45ae](http://www.alloyteam.com/wp-content/uploads/2015/10/pngbase64bf518ecb266e45ae.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/pngbase64bf518ecb266e45ae.png)

页面渲染完成时间方面，非离线包版本从平均 2400ms 左右，降至平均 1600ms，性能提升 33%。离线包版本从平均 1350ms，降至平均 970ms，性能提升 28%。  

 

[![png;base64f96a5669ecdf9ab](http://www.alloyteam.com/wp-content/uploads/2015/10/pngbase64f96a5669ecdf9ab.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/pngbase64f96a5669ecdf9ab.png)

[![png;base64a0fa4a79f40368f3](http://www.alloyteam.com/wp-content/uploads/2015/10/pngbase64a0fa4a79f40368f3.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/pngbase64a0fa4a79f40368f3.png)

**系列文章**

[【AlloyTeam 优化系列】构建篇](http://www.alloyteam.com/2015/10/optimization-of-alloyteam-series-building-articles/)

[【AlloyTeam 优化系列】纯前端优化首屏时间](http://www.alloyteam.com/2015/10/optimization-of-alloyteam-series-the-first-screen-time/)

[【AlloyTeam 优化系列】Node 直出让你的网页秒开](http://www.alloyteam.com/2015/10/optimization-of-alloyteam-series-node-directly-transferring-your-web-pages-second-opening/)


<!-- {% endraw %} - for jekyll -->