---
title: 研究首屏时间？你先要知道这几点细节
date: 2016-01-09
author: TAT.老教授
source_link: http://www.alloyteam.com/2016/01/points-about-resource-loading/
---

<!-- {% raw %} - for jekyll -->

做移动 web 页面，受移动网络网速和终端性能影响，我们经常要关注首屏内容展示时间（以下简称首屏时间）这个指标，它衡量着我们的页面是否能在用户耐心消磨完之前展示出来，很大程度影响着用户的使用满意度。

### 怎么获取首屏时间呢？

我们经常要先问自己：页面是怎么加载数据？

A：加载完静态资源后通过 ajax 请求去后台获取数据，数据回来后渲染内容

[![QQ 截图 20160109164815](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ截图20160109164815.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ截图20160109164815.png)

在每个点打上一个时间戳，首屏时间 =  点 8 - 点 1；

B：使用后台直出，返回的 html 已经带上内容了

[![QQ 截图 20160109165343](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ截图20160109165343.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ截图20160109165343.png)

此时首屏时间 = 点 4 - 点 1。

注：1. 打了这么多个点，是因为当我们收集到首屏时间之后，要去分析到底是哪一段是性能瓶颈，哪一段还有优化空间，所以我们需要收集 点 2 - 点 1、点 3 - 点 1 …… 这些时间以作分析；

2. 打点 1 我们一般是在 html 文件 head 标签的开头打个时间戳；

3. 在 css 文件加载前一般没有别的加载处理，所以打点 1 和打点 2 一般可以合并。

到此我们就收集到首屏相关各种数据，可以做各种针对性优化。Wait！在你大刀阔斧优化前，你要了解一些细节，它们有利于你做更准确的分析和更细致的优化。

###  

### 细节 1：js 后面的点 - js 前面的点 ≠ js 的加载时间

[![9171cc76404a83c387079c40f6517a3c913dc55d](http://www.alloyteam.com/wp-content/uploads/2016/01/9171cc76404a83c387079c40f6517a3c913dc55d.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/9171cc76404a83c387079c40f6517a3c913dc55d.png)

JsEndTime - JsStartTime = js 文件的加载时间，对吗？

不对！明显地，这个等式忽略了 js 的执行时间。js 执行代码是需要花费时间的，特别是做一些复杂的计算或频繁的 dom 操作，这个执行时间有时会达到几百毫秒。

那么，JsEndTime - JsStartTime = js 文件的加载执行时间？

依然不对！因为**CSS 文件的加载执行带来了干扰**。觉得很奇怪对吧，别急，我们来做个试验：我们找一个 demo 页面，在 chrome 里面打开，然后启动控制台，模拟低网速，让文件加载时间比较久：[![QQ 截图 20160109180011](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ截图20160109180011.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ截图20160109180011.png)

先在正常情况下收集 JsEndTime - JsStartTime 的时间，然后使用 fiddler 阻塞某一条 css 请求几秒钟：

[![QQ 截图 20160109180537](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ截图20160109180537-1024x591.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ截图20160109180537.png)

然后再恢复请求，拿到此时的 JsEndTime - JsStartTime 结果，会发现第一次的时间是几百毫秒将近 1s，而第二次的时间低于 100ms 甚至接近为 0（我的示例，时间视读者具体的 js 文件决定），两者的差距非常明显。

这是什么原理？这就是我们常说的” 加载是并行的，执行是串行的 “ 的结果。html 开始加载的时候，浏览器会将页面外联的 css 文件和 js 文件并行加载，如果一个文件还没回来，它后面的代码是不会执行的。刚刚我们的 demo，我们阻塞了 css 文件几秒，此时 js 文件因为并行已经加载回来，但由于 css 文件阻塞住，所以**后面 JsStartTime 的赋值语句是不执行的！**当我们放开阻塞，此时才会运行到 JsStartTime 的赋值、js 文件的解析、JsEndTime 的赋值，由于大头时间加载早已完成，所以 JsEndTime 和 JsStartTime 的差值非常小。

知道这个有何用？

1.  别再把 JsEndTime - JsStartTime 的结果成为 js 文件的加载执行时间（除非你没有外联 css 文件），不然会被内行人取笑滴；
2.  css 文件的阻塞会影响后面 js 代码的执行，自然也包括 html 代码的执行，即是说此时你的页面就是空白的。所以 css 文件尽量内联，你可以让构建工具帮你忙；
3.  如果真想要知道 js 文件的加载时间，最正确的姿势是使用 Resource Timing API，不过这个 API 移动端只能在 Android4.4 及以上的版本拿到数据，也就在业务 PV 大的场景才够我们做分析用

当然，那两个打点留着还是可以做分析用的。

### 细节 2：html 里面外联的 js 文件，前一个文件的加载会阻塞下一个文件的执行；而如果 a.js 负责渲染并会动态拉取 js、拉取 cgi 并做渲染，会发现它后面的 js 文件再怎么阻塞也不会影响到它的处理

前半部分的结论在细节 1 里面已经证明，因为浏览器的执行是串行的。这说明，我们负责渲染内容的 js 代码要等到它前面所有的 js 文件加载执行完才会执行，即使那些代码跟渲染无关的代码如数据上报：

[![QQ 截图 20160109191818](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ截图20160109191818.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ截图20160109191818.png)

而后半部分的结论很好验证，我们在负责渲染的 js 文件后面外联一个别的 js 文件并把它阻塞住，你会发现渲染相关的 js 不管是动态拉取新的 js 文件、拉取渲染相关内容都一切正常，页面内容顺利渲染出来，它们的执行并不需要等被阻塞的这个文件。

知道这个有何用？

1.  **无关紧要” 的 js 不要放在负责渲染的 js 前面，这里的 “无关紧要” 是指和首屏渲染无关**，如数据上报组件。我们可以选择将要上报的数据临时存起来，先继续执行渲染的 js，等负责渲染的 js 执行完再加载上报组件再上报。甚至连 zepto 之类的库我们也可以放后面，把渲染相关的代码抽离出来并用原生 js 书写，放到最前面；
2.  可以看到，动态加载的 js 的执行是不会受到 html 后面外联的 js 的阻塞的影响，即是说，它的执行和后面 js 的执行顺序是不确定的。因此我们要小心处理好文件的依赖关系。当然还可以采用最不容易出错的方法：负责动态加载 js 的文件是 html 里面外联的最后一个文件

（注：个人觉得这是全文最重要的两点结论，因为我正在做首屏优化 ^-^）

### 细节 3：如果 html 的返回头包含 chunk，则它是边返回边解析的，不然就是一次性返回再解析。这个是在服务器配置的

[![QQ 截图 20160109165343](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ截图20160109165343.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ截图20160109165343.png)

打点 1 一般写在 html 里 head 标签的最前面，时常有朋友拿直出时的 点 4 - 点 1 的时间和非直出时 点 8 - 点 1 的时候做对比，来说明直出优化了多少多少毫秒，我倒觉得不一定。要知道直出的情况 html 文件包含渲染后的内容和 dom 节点，文件大小一般比非直出大，有时甚至大个几十 K 都有，那我觉得要说明直出优化了多少就要把 html 的加载时间考虑进去了。那上面的计算方法是否考虑上 html 的加载时间？

那就要看 html 文件的返回头是否包含 chunk：

[![1](http://www.alloyteam.com/wp-content/uploads/2016/01/11.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/11.png)

如果包含这个返回头，那 html 文件是边返回边解析的，此时上面的计算方法是合理的。如果不包含这个头，则 html 文件是整一个返回来后才开始解析，此时上面的计算方法就少算了 html 的加载时间，也就不够精准。这个返回头是由后台控制的。

知道这个有何用？

1.  如果我们想说明直出的优化程度，最好先瞧瞧你的 html 返回头。如果不包含 chunk 返回头，考虑拿 HTML5 performance 里面的 navigationStart 作为打点 1（这个 API 也是 Android4.4 及以上才支持），要不就要评估文件大小变化做点修正了；
2.  对于没有启用 chunk 的 html，建议不要 inline 太多跟渲染首屏内容无关的 js 在里面，这样会影响渲染时间

### 细节 4：写在 html 里面的 script 节点的加载和解析会影响 domContentLoaded 事件的触发时间

我们有时会用 domContentLoaded 事件代替 onload 事件，在页面准备好的时候做一些处理。然而要知道，domContentLoaded 里面的 dom 不止包含我们常说的普通 dom 节点，还包括 script 节点。

试验一下，我们将页面里面外联的一个 js 文件阻塞住一段时间再放开，我们看下 chrome 控制台：

[![2](http://www.alloyteam.com/wp-content/uploads/2016/01/21.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/21.png)

很明显，js 文件的加载时间会影响这个事件的触发事件。那 js 代码的解析时间会不会影响？我们在最后一个外联 js 文件后面打了一个点，它的时间是：

[![3](http://www.alloyteam.com/wp-content/uploads/2016/01/31.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/31.png)

所以 js 文件加载执行会影响 domContentLoaded 事件的执行时机。

知道这个有何用？

1.  如果我们打算在 domContentLoaded、onLoad 事件里面做一些特殊处理且这些处理比较重要（如跟渲染有关），那我们最好就不要在 html 里面直接外联一些跟渲染无关的 js 文件，可以考虑改用动态加载

### 总结 

研究首屏时间和资源加载是一件挺有意思的事情，大家利用好 chrome 控制台（特别是里面的 network 标签）以及 fiddler 可以挖掘出很多有趣的小细节小结论。别以为这是在没事找事，理解好这些对大家做首屏性能优化、定位因为 js 文件执行顺序错乱导致报错等场景是非常有好处的。所以发现什么记得与我共享哈～


<!-- {% endraw %} - for jekyll -->