---
title: 探索 react native 首屏渲染最佳实践
date: 2016-03-20
author: TAT.ronnie
source_link: http://www.alloyteam.com/2016/03/best-practice-in-react-native/
---

<!-- {% raw %} - for jekyll -->

react native 给了我们使用 javascript 开发原生 app 的能力，在使用 react native 完成兴趣部落安卓端发现 tab 改造后，我们开始对由 react native 实现的界面进行持续优化。目标只有一个，在享受 react native 带来的新特性的同时，在体验上无限逼近原生实现。作为一名前端开发，本文会从前端角度，探索 react native 首屏渲染最佳实践。

**1. 首屏耗时计算方法**  

===================

**1.1 我们关注的耗时**

优化首屏渲染耗时，需要先定义首屏耗时的衡量方法。将 react native 集成至原生 app 中时，可以将首屏耗时定义为如下

**首屏耗时 = react native 上下文初始化耗时 + 首屏视图渲染耗时**

其中，react native 上下文初始化耗时为一个固定开销，通过将初始化过程提前至 app 启动后异步进行，在安卓端，这一耗时已经可以降低到约 70ms。本文关注的是首屏视图渲染耗时，文中优化探索是在安卓端 react native 结合版 app 中进行，但其思路和方法，可以复用至 iOS 端。

**1.2 渲染耗时衡量方法**

关注首屏视图渲染耗时，需要理解 react 框架视图渲染流程，相应的需要了解其生命周期方法。下图是一张 react 组件完整的声明周期图，从图中可以看出，上方虚线框内为生命周期第一阶段，这个阶段完成初始化，并第一次渲染组件。左下角虚线框为组件运行和交互阶段，这里可能会再次渲染组件。右下角虚线框为第三阶段，组件这一阶段卸载消亡。

[![01](http://www.alloyteam.com/wp-content/uploads/2016/03/01.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/01.png)

对应上述生命周期方法，我们在初始阶段首先渲染 loading 视图，并开始拉取数据。获取数据后，通过改变状态（state），触发视图的再次渲染，在屏幕绘制出视图。

[![02](http://www.alloyteam.com/wp-content/uploads/2016/03/02.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/02.png)

结合上述分析，我们将首屏视图渲染耗时定义为如下

**首屏视图渲染耗时 = compontDidUpdate 结束时间 – compontWillMount 开始时间**

**2. 开启渲染优化探索之路**

**2.1 输出当前渲染耗时**

既然已经明确了视图渲染耗时的计算方法，那么就可以打时间点日志输出这一耗时看看。这里查看耗时有两种方法。

1.  使用调试模式，通过 console.log，在 chrome 调试工具中输出时间差值
2.  封装 native 层日志方法封装给 react native 层调用，将日志输出到 app 日志文件中。

推荐使用第二种方法，采用这种方法，可以以 release 模式运行 app，输出结果与我们普通的安装运行 app 表现一致。

这时我们的耗时输出是怎样的呢？查看日志得知，在 wifi 环境下，荣耀 4X 手机上，**渲染耗时为约 700ms**，加上 react native 上下文初始化时间约 70ms 耗时，整个界面的耗时需要约 770ms。

那么原生 app 的实现中，发现 tab 渲染耗时是多少呢？通过打点发现，**安卓端原生 app 实现中，发现 tab 从 onCreateViewEx 开始至 onResume 结束，耗时约 100ms**。

**2.2 来吧，加上缓存**

看到上述数据时，我的内心是有点崩溃的，说好的高性能呢？但是我并不慌，根据我不多的前端开发经验，我知道有一个大招还没有用上，那就是使用缓存数据。

react native 为我们提供了 AsyncStorage 模块，AsyncStorage 是一个简单的、异步的、持久化的 Key-Value 存储系统，它对于 App 来说是全局性的。相对于之前我们使用 LocalStorage 存储数据，在 react native 端，我们可以使用 AsyncStorage 作为数据存储解决方案。

在使用缓存之前，我们的视图渲染流程如下所示

[![03](http://www.alloyteam.com/wp-content/uploads/2016/03/03.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/03.png)

上述流程中，每次渲染界面视图前，都需要等待网络请求。这里我们将请求数据缓存起来，渲染界面视图时，首先使用缓存数据渲染视图，同时发起网络请求，数据返回时再以新的数据渲染一遍。使用缓存之后的渲染流程如下图所示

[![04](http://www.alloyteam.com/wp-content/uploads/2016/03/04.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/04.png)

上述流程中，当有缓存数据时，我们会快速拿到缓存数据渲染出界面视图。然后在网络请求返回数据时，再次触发 render 方法，以新数据再次渲染视图。

这里为了提升性能，避免多余的触发 render 方法，可以在 shouldComponentUpdate 方法中判断 cache data 和 response data 差异，仅当两份数据不一致时才再次触发 render 方法。同时，得益于 react 框架的虚拟 dom 特性，在网络请求的数据返回再次触发 render 方法后，react native 会计算 dom diff 并以此为依据来判定视图更新范围。

此时通过日志数据可以看到，在有缓存场景下，我们获取缓存时间耗时约在 40ms，此时我们的**渲染耗时下降至 400ms**。

**2.3 接管轮播图**

加入缓存优化后，我们将渲染耗时降低至 400ms，但是仍与原生实现中耗时有较大差距。此时的优化进入了深水区，经过梳理界面视图，可以将视图划分为上部轮播图、中间部落列表和下部热门帖子三个模块，逐一优化。

[![05](http://www.alloyteam.com/wp-content/uploads/2016/03/05.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/05.png)

在最初的版本中，我们是这么实现轮播组件的：在请求的返回结果中，取出轮播图集合，依次生成全部图片视图，并添加至轮播图容器视图中。最后监听容器视图的对应事件，设置当前显示的图片视图。

如下图所示，当结果数据中共有五张轮播图时，会有五个图片视图被添加至轮播图容器中。初始时仅首张图片视图可见，容器内滑动事件发生时，图片视图可见状态随之改变。

[![06](http://www.alloyteam.com/wp-content/uploads/2016/03/06.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/06.png)

从上述过程可以看出一个明显的问题：对首屏来讲，轮播图容器内，非可见状态的其余图片视图的渲染是没有意义的。

既然已经找到了问题，优化是思路也就很自然：在从请求结果中获取轮播图集合后，不是生成全部图片视图，而是仅生成一份，将这一个图片视图添加至容器内，并为他设置当前图片的 url 地址。当容器内滑动事件发生时，不再是切换不同视图的可见状态，而是复用这一个图片视图，切换视图图片的 url 地址，其流程如下图所示。

[![07](http://www.alloyteam.com/wp-content/uploads/2016/03/07.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/07.png)

采用这一方案，完全去除了非可见状态的图片视图的渲染耗时，同时，通过复用视图，也降低了对内存的占用。这一方案在理论上将渲染耗时和内存占用做到了最优，然而在实际运用中，会有一个体验的问题：当滑动发生时，才加载下一张图片并刷新图片视图，会导致容器内滑动事件的卡顿，使得滑动有阻滞感。因此我们最终采用了一种折衷方案：当轮播图集合超过三张时，在容器内加入当前图片视图，同时提前加入当前图片的上一张和下一张图片视图。容器内滑动事件发生时，复用这三个视图，来设置这次事件对应的当前图片、上一张和下一站图片视图。

[![08](http://www.alloyteam.com/wp-content/uploads/2016/03/08.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/08.png)

通过日志输出优化前后的耗时数据，采用这一方案时，在渲染耗时上降低了约 30ms，此时我们的首屏**渲染耗时下降到了约 370ms**。

**2.4 为列表加特效**

在发现 tab 界面中部，是子类别的部落列表。子类别数量通常是两个，每个子类别下一般有七至八个列表项，每个列表项由部落图标和部落名称组成。

[![09](http://www.alloyteam.com/wp-content/uploads/2016/03/09.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/09.png)

最初的版本中，我们从请求结果数据中获取子类别下部落集合，以 ScrollView 为容器，依次创建列表项视图并添加至容器中。这样，当所有列表项渲染完成，该子类的部落列表才渲染完成，最初的实现示意如下所示。

[![10](http://www.alloyteam.com/wp-content/uploads/2016/03/101.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/101.png)

通过上述过程可以发现，在部落列表渲染过程中，等待非可视区域的列表项的图片下载再渲染该视图，对于首屏是没有意义的。

结合对轮播图组件的优化经验，我们尝试延迟加载列表项视图。理想的状态是在首屏仅渲染可见的几个列表项，非可见区域的列表项，延迟渲染，流程如下所示

[![11](http://www.alloyteam.com/wp-content/uploads/2016/03/111.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/111.png)

很快我们遇到了问题，在轮播图组件中，首屏仅显示第一张图片。但是在横向部落列表中，首屏应该渲染几个列表项呢？答案是我们无法提前确定，首屏可见的列表项，只有在渲染时，根据当前列表项在横向列表中的相对位置，才能计算出该项是否可见。

继续思考，虽然我们不能预知在首屏应该几个列表项，但是利用 react native 提供的 API 方法，我们可以获取当前视图相对于容器的坐标位置。

```javascript
static measureLayout(relativeToNativeNode: number, 
onSuccess: MeasureLayoutOnSuccessCallback, onFail: () => void)
```

利用 measureLayout 方法，在视图完成布局，触发其 onLayout 事件回调后，可以通过视图的 measureLayout 方法，传入容器节点，从而获得当前视图在容器中的相对位置。利用这一特性，结合我们的视图特点 —— 列表项视图的尺寸是确定的，可以在初始时，将所有列表项视图渲染为这一特定尺寸的空视图，待所有空视图渲染完成后，获取视图在容器中相对位置，仅将可视区域内的列表项用真实视图重新渲染。同时监听列表容器的滚动事件，在滚动事件回调中，计算视图在容器中的相对位置，当视图进入了可视区域时，再用真实视图替换空视图，上述流程如下所示

[![12](http://www.alloyteam.com/wp-content/uploads/2016/03/121.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/121.png)

通过上述方案，我们可以实现列表项的延迟渲染特性，通过日志输出耗时时间，可以发现通过这一优化，渲染优化又可降低约 30ms。

上述方案中，屏幕在首次渲染空白视图和再次渲染首屏可见列表项视图之间，有短暂闪动的感觉，为解决这一体验问题，可使用占位图方案替代空视图方案，即首先都用静态资源占位图来渲染列表项 icon 图，并延迟加载非可见列表项 icon 图，其方案如下所示

[![13](http://www.alloyteam.com/wp-content/uploads/2016/03/13.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/13.png)

实现效果如下，首次渲染时均用占位图，首屏区域内的列表项 icon 视图依次下载并重新渲染。在采用这样实现后，解决了空视图带来的屏幕闪动问题，快速的完成初次渲染，实现了 icon 图片的延迟加载，渲染耗时稍有增加，相比空视图方案耗时增加约 10ms，此时我们的首屏**渲染耗时下降到了约 350ms**。

[![14](http://www.alloyteam.com/wp-content/uploads/2016/03/14.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/14.png)

**2.5 热门帖模块的归宿**

发现 tab 视图下部还有一个模块，如下所示，是几条热门帖子的展示区域。对于首屏内容来说，这一模块整个都属于非可视区域，因此我们需要设法将这一块的耗时从首屏耗时中拿掉。

[![15](http://www.alloyteam.com/wp-content/uploads/2016/03/15.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/15.png)

有了上面部落列表的优化经验，我们已经知道，在布局事件完成后，可以获取视图在容器内的相对位置，对于滚动视图如 ScrollView，我们可以监听他的滚动事件，来判断视图距离可视区域的位置以决定是否渲染该视图，为了优化体验，我们再给视图的渲染设置一个提前阈值 aheadDistance，当视图距离可视区域还有 aheadDistance 单位时，提前渲染该视图，这一方法如下图所示

[![16](http://www.alloyteam.com/wp-content/uploads/2016/03/16.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/16.png)

采用这一方案后，已经可以将热门帖子模块的渲染耗时从首屏耗时中去掉了，此时通过日志输出耗时分析，首屏渲染耗时下降到了约 270ms。

那么这块的优化工作完成了吗？没有，在优化做完，回顾体验时，我们发现了这里仍存在体验问题。这一体验问题与发现 tab 的视图结构有关。在发现 tab 中，热门帖子模块，距可视区域底部的距离不远。因为本身距离可视区域底部很接近，所以 ahead Distance 的设置并没有起到预想的效果，导致发现 tab 界面向下滑动时，因为实时去渲染热门帖子模块，使得滑动不流畅，有阻滞感。

为了解决这一体验问题，继续对热门帖子模块做了定制的优化，最终对热门帖子模块做到了异步渲染。在首屏渲染时，还是将热门帖子渲染为空视图，然后将 ahead Distance 调大，使得空视图落在 ahead Distance 区域内，接着使用 setTimeout 技巧，异步的去计算该空视图在容器中位置，并将热门帖子真实视图渲染出来。

通过上述方案，将延迟渲染替换为异步渲染，在不增加渲染耗时的基础上，同时解决了滑动不流畅的体验问题，最终将首屏**渲染耗时定格在约 270ms**。

**3. 总结**

react native 框架给了我们新的能力，使得我们可以用 javascript 开发原生 app。当我们走入 react native 应用的深水区，开始对他进行各方面细致的优化时，我们在原来 web 端积累的最佳实践依然有效，诸如缓存的使用、元素复用、延迟加载、异步加载等方法依然会起到很好的效果。

与此同时，对渲染耗时的优化也要兼顾使用的体验，我们应该追求的，不仅仅是快。而是在快的基础上，也有很好的使用体验。

优化探索到最后，**我们将首屏渲染耗时定格在约 270ms，加上 react native 初始化耗时约 70ms，我们的首屏总耗时仍需约 340ms**，相比原生实现仍然存在差距。原生实现的渲染速度也是经过了层层的优化，而我们对 react native 最佳实践的探索也没有结束，欢迎大家指导、探讨。

[![1846.743](http://cdn.alloyteam.com/wp-content/uploads/2016/03/1846.743.jpg)](http://www.ituring.com.cn/book/1846)

好书推荐 [《](http://www.ituring.com.cn/book/1846)[React Native 开发指南》](http://www.ituring.com.cn/book/1846)

<!-- {% endraw %} - for jekyll -->