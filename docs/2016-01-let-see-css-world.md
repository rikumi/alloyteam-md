---
title: 我就是要用 CSS 实现
date: 2016-01-13
author: TAT.polar
source_link: http://www.alloyteam.com/2016/01/let-see-css-world/
---

<!-- {% raw %} - for jekyll -->

写在最前  

=======

我们都是前端工程师，无论你现在是页面仔，还是 Node 服务开发者，抑或是全端大神，毋庸置疑的是，我们都是前端工程师，我们生来就对追求页面的极致拥有敏锐的触觉，无论是页面实现方式的高大上、页面的极致的性能还是页面完美的展现，都是我们孜孜不倦的追求目标。即使这些在别人眼里，只是跟其他的页面一样没什么不同，但我们却能为其中那只有我们才知道的一抹别致而窃喜。

而今天我要讲的，就是我们最熟悉的老朋友，CSS。不讲枯燥的语法，抛开 js，让我们一起来看业务中那别致的纯 CSS 实现，让我们一起来追求那更好的页面实现，希望我带着你走完这段旅程后，你能收获一些惊喜甚至灵感。

WHY，为什么  

==========

“我有很多事要做诶，忙都忙不过来，难道我要在这 CSS 上面浪费很多时间？”

不，不，不，我们要做的事情，当然不会只是满足技术的追求，而是会有实质的好处的！

我的观点如下：

1.  CSS 跟 UI 结合更加紧密；
2.  用 CSS 来实现，能减少 JS 计算，减少样式修改，减少重绘，提升渲染效率；
3.  用 CSS 实现的，是一种模块化，更符合 Web Components 组件化思想，shadow DOM 不就是致力于这么做么；
4.  咱最爱的，逼格更高～

WHEN，何时  

==========

“我懂了，看起来是有那么点意思，可是我什么时候能用 CSS 来做大事啊？”

在我看来：

1.  实现的对象是非交互性 UI；
2.  这么做不会给你带来过量的 DOM。要知道最不能忍受的，就是臃肿的页面；
3.  这么做能完美实现 UI、能覆盖所有场景，否则设计跟产品不服。

什么是非交互性 UI，就是不会在用户触发了某种行为时，哗啦啦来个闪瞎眼的交互，吓得用户直接高潮，而是从页面渲染后，就一直在那里，那么安静，那么美的女子，哦不，UI。

HOW，该怎么做  

===========

“可是我还是不懂该如何做才能这么有逼格”

我个人的见解：

1.  布局之美，理解透盒子模型，熟悉各种布局，不要忘了这是咱的根本；
2.  自适应之美，放心交给浏览器去做，我们要做的，是思考规则；
3.  Magic，新技术及小技巧，总能在某一刹那给你最需要的援助；
4.  前人之鉴，坑王之王，你已经身经百战了，还怕什么。

这些就是我总结出你要用 CSS 来实现一个别人想不到的东西时，应该具有素质。最重要的还是思考，因为没有一个东西是绝对最好的，我们总在前进。

[![EM{B0CE8533-03D7-62AC-27EF-6E2E9AABF024}-(10)](http://www.alloyteam.com/wp-content/uploads/2016/01/EMB0CE8533-03D7-62AC-27EF-6E2E9AABF024-10.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/EMB0CE8533-03D7-62AC-27EF-6E2E9AABF024-10.png)

下面就以两个手机 QQ 实际业务的例子，带领大家感受一下 CSS 的魅力。

一、手 Q 吃喝玩乐   好友去哪儿九宫格图  

=========================

下图是手 Q 吃喝玩乐   好友去哪儿九宫格图的图示：

[![九宫格](http://www.alloyteam.com/wp-content/uploads/2016/01/九宫格.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/九宫格.png)

从上图我们可以分析出如下需求：

-   图片大小自适应；
-   图片个数不同时，图片按照指定方式排列；
-   图片相邻处有 1px 空白间隙。

我们以最复杂的 6 图布局为例，一步一步来看如何以纯 CSS 实现。

### float 布局

最容易想到的，也是最简单的方案，就是 float 布局：

-   **图片大小自适应**：宽度百分比，高度使用 padding-top 百分比
-   **图片个数不同时，图片按照指定方式排列**：使用 nth-child 伪类指定不同情况下的元素大小
-   **图片相邻处有 1px 空白间隙**：使用 border-box + border 模拟边框

这里父元素的高度未知，height 使用百分比行不通，而 padding 的百分比值是依据父元素的宽度来计算的，我们可以使用 padding-top 撑开高度。

让我们一瞅伪码，[猛击我看 demo](http://jsbin.com/firufo/4)

```html
<div class="float">
        <div class="item">1</div>
        ...     <div class="item">6</div>
</div>;
```

```css
.float {
    overflow: hidden;
}
.item {
    float: left;
    padding-top: 33.3%;
    width: 33.3%;
    border-right: 1px solid #fff;
    border-top: 1px solid #fff;
}
.item:nth-child(1) {
    padding-top: 66.6%;
    width: 66.6%;
}
.item:nth-child(2), .item:nth-child(3), .item:nth-child(6) {
    border-right: 0 none;
}
.item:nth-child(1), .item:nth-child(2) {
    border-top: 0 none;
}
```

实际效果并不理想，如下图：

[![1](http://www.alloyteam.com/wp-content/uploads/2016/01/1.gif)](http://www.alloyteam.com/wp-content/uploads/2016/01/1.gif)

可以看到 float 布局的优点是 DOM 结构十分简单，缺点是容易出现空白间隙错位，优缺点都十分明显，它更适用于 js 计算的版本。

### **flex 布局**

还有谁？flex！**flex 布局有以下重要特性**：

-   可以将 flex 布局下的元素展示在同一水平、垂直方向上；
-   可以支持自动换行、换列（移动端 - webkit-box 暂不支持，好消息是从 iOS9.2、Android4.4 开始都支持新 flex 了）；
-   可以指定 flex 布局下的元素如何分配空间，可以让元素自动占满父元素剩余空间；
-   可以指定 flex 布局下的元素的展示方向，排列方式。

这里面的子元素同一水平、垂直方向展示对我们很有帮助，它使我们更容易控制子元素的排列，而不会错位。

使用 flex 布局与 float 布局不同的地方在于，移动端目前主要还是 - webkit-box，因此图片个数不同时，我们需要使用不同的 html，组合出不同的块。

#### flex 布局上下划分

来，我们快动手分块吧！新解决方案出现导致的肾上腺素上升，使我们迫不及待使用了传统 css 文档流自上而下的方式来划分，我称为**上下划分**，如下图：

[![上下划分](http://www.alloyteam.com/wp-content/uploads/2016/01/上下划分.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/上下划分.png)

上面一块包含左侧 1 个 2/3 的大块，右侧 2 个 1/3 的小块，下面一块则是 3 个 1/3 的小块。

我们指定 2/3 的大块宽度是 66.6%，1/3 的小块宽度是 33.3%（实际可以使用 - webkit-box-flex 来分配，这里为了下面的计算方便）。

来看下实际效果，你也可以[猛击 demo](http://output.jsbin.com/zolupe) 来查看源码：

[![2](http://www.alloyteam.com/wp-content/uploads/2016/01/2.gif)](http://www.alloyteam.com/wp-content/uploads/2016/01/2.gif)

demo 中我们看到中间那条竖空白间隙错位了，为什么？按照预期我们上面块左侧宽度 66.6%，下面块左侧宽度 33.3% + 33.3%，两个宽度应该相等才对。

然而我们忽略了 flex 一个重要特性，子元素会自动占满父元素剩余空间，这时子元素宽度计算受 flex 控制，下面块的 3 个子元素宽度计算并非一定是相等的，会有些许差异，此时 **66.6% != 33.3% + 33.3%**。

怎么破！别急，我们刚刚只是受到了肾上激素的影响，让我们冷静下来重新思考如何划分。

#### flex 布局左右划分

问题在于竖间隙涉及到的左右侧宽度计算不稳定，既然如此，我们可以考虑依据竖间隙**左右划分**，排除不稳定因素，如下图：

[![左右划分](http://www.alloyteam.com/wp-content/uploads/2016/01/左右划分.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/左右划分.png)

这样就解决了竖间隙错位问题，但我们依然有所担心，中间的横间隙会错位吗？我们来算一下。

整体父元素宽度确定，为 W；

整体父元素高度由子元素撑开，不确定；

左侧大块高度：左侧 flex 父元素宽度（W \* 66.6%）\* 100% = W \* 66.6%；

左侧小块高度：左侧 flex 父元素宽度（W \* 66.6%）\* 50% = W \* 33.3%；

右侧小块高度：右侧 flex 父元素宽度（W \* 33.3%）\* 100% = W \* 33.3%。

依然是 66.6% 与 33.3% + 33.3% 的等式，但这次高度计算会受 flex 影响吗？

不会，因为此时整体父元素的高度是不确定的，是由子元素内容撑开的，flex 的高度也是由子元素来撑开的。

最终 **66.6% === 33.3% + 33.3%**

我们来看下伪码，[猛击我看 demo](http://jsbin.com/takiti/9)：

```html
<div class="wrap-box wrap-6">
        
    <div class="flex-inner">
              <div class="flex-box1 flex-item"></div>
              
        <div class="flex-box2">
                    <div class="flex-item"></div>
                    <div class="flex-item"></div>
                  
        </div>
            
    </div>
        
    <div class="flex-inner">
              <div class="flex-item"></div>
              <div class="flex-item"></div>
              <div class="flex-item"></div>
            
    </div>
</div>;
```

```css
.wrap-box {
  display: -webkit-box;
}
 
.flex-inner {
    -webkit-box-flex: 1;
    display: -webkit-box;
}
 
.flex-item {
    -webkit-box-flex: 1;
    position: relative;
}
.wrap-6 {
      -webkit-box-orient: horizontal;
}
.wrap-6 .flex-inner {
      -webkit-box-flex: 0;
      -webkit-box-orient: vertical;
}
.wrap-6 .flex-inner:first-child {
      width: 66.6%;
}
.wrap-6 .flex-inner:last-child {
      width: 33.3%;
}
.wrap-6 .flex-item {
      padding-top: 100%;
}
.wrap-6 .flex-box2 .flex-item {
      padding-top: 50%;
}
.wrap-6 .flex-box2 {
      display: -webkit-box;
      -webkit-box-orient: horizontal;
}
.wrap-6 .flex-inner:first-child,
.wrap-6 .flex-box2 .flex-item:first-child {
      margin-right: 1px;
}
.wrap-6 .flex-box1,
.wrap-6 .flex-inner:last-child .flex-item:first-child,
.wrap-6 .flex-inner:last-child .flex-item:nth-child(2) {
      margin-bottom: 1px;
}
```

实际效果：

[![3](http://www.alloyteam.com/wp-content/uploads/2016/01/3.gif)](http://www.alloyteam.com/wp-content/uploads/2016/01/3.gif)

[![QQ 图片 20160113000812](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ图片20160113000812.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ图片20160113000812.png)

二、手 Q 家校群先锋教师进度条  

===================

下图是手 Q 家校群先锋教师进度条设计稿：

[![先锋教师进度条](http://www.alloyteam.com/wp-content/uploads/2016/01/先锋教师进度条.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/先锋教师进度条.png)

图中的 12345 便是主角进度条。分析需求如下：

-   线的长度不固定
-   点平均地分布在一条线上
-   点的个数不固定，可能会改变
-   激活的点之间线的颜色是绿色的

让我们看下如何用纯 CSS 实现。

### 绝对定位大法

我们看了第一眼，便想起了最受青睐的万金油 absoulte，方案图如下：

[![绝对定位大法](http://www.alloyteam.com/wp-content/uploads/2016/01/绝对定位大法.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/绝对定位大法.png)

-   将点、线分离，灰色背景线使用父元素的 after 实现；
-   点使用绝对定位，left 百分比值定位；
-   绿色线条使用父元素 before 实现，绝对定位，宽度百分比值。

不消一会儿我们就做出来了，但再多看一眼觉得十分不妥，点和线百分比值都要手动指定，不便修改点的数量，且过多的绝对定位不优雅。

这并不是我们想要的 CSS 实现。

### 百分比宽度切分

于是我们回归本源，遵从 CSS 世界的规则来，将点线合起来看，每个子元素包含自己的点线，从左至右排列，并使用自适应布局的方式，子元素宽度为百分比，如下图的方案：

[![百分比宽度划分](http://www.alloyteam.com/wp-content/uploads/2016/01/百分比宽度划分.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/百分比宽度划分.png)

-   灰色背景线依旧使用父元素的 after 实现；
-   每个子元素宽度一致，为平均下来的百分比值，如 25%；
-   点绝对定位在子元素右侧；
-   绿色线条在子元素内实现。

然而我们发现这么做不灵，在普通盒子模型里，子元素宽度总和无法溢出父元素（除了 flex），在这里总宽度是 **4 个带线子元素（百分比）+1 个点宽度（固定）**，实际 25% 的划分展示与理想不符。

此外，最左侧只有点，没有线条，点的宽度固定，线条宽度不定，css 无法计算（忘掉表达式吧），无法隐藏线条，fail！

### 百分比宽度切分进化版

搅屎棍就是最左侧那固定的点，难道就不能把最左边那该死的点从我们的百分比团队里排除掉吗？如下图：

[![百分比宽度划分进化版](http://www.alloyteam.com/wp-content/uploads/2016/01/百分比宽度划分进化版.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/百分比宽度划分进化版.png)

当然可以！我们只需父元素腾出这个子元素宽度出来，不算在其余子元素宽度百分比计算内。

腾出空间方式：父元素 margin-left 出空间，子元素负 margin-left 移回原位。

此时父元素给子元素的内容计算宽度就是 width - margin-left，除首个子元素外，其余每个子元素宽度一致，为平均下来的百分比值。

实际效果，由于源码较长，请[猛击 demo](http://jsbin.com/qabujul/2) 看源码：

[![4](http://www.alloyteam.com/wp-content/uploads/2016/01/4.gif)](http://www.alloyteam.com/wp-content/uploads/2016/01/4.gif)

完（美），话还没说完，产品就找来要改点的数量。

[![图片 6](http://www.alloyteam.com/wp-content/uploads/2016/01/图片6.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/图片6.png)

我们一看宽度是百分比设死的，这样在点的数量修改时，我们还是要改 css，完。

[![图片 7](http://www.alloyteam.com/wp-content/uploads/2016/01/图片7.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/图片7.png)

### 百分比宽度划分究极版

来，心中默念 3 遍 “要优雅不要污”，灵光一闪，flex 大法好！

flex 重要特性之一，可以指定 flex 布局下的元素如何分配空间，我们将点线元素宽度改为 - webkit-box-flex:1，此时子元素就自动平均分了父元素宽度。

实际效果，[猛击 demo](http://jsbin.com/qabujul/3)：

[![5](http://www.alloyteam.com/wp-content/uploads/2016/01/5.gif)](http://www.alloyteam.com/wp-content/uploads/2016/01/5.gif)

[![QQ 图片 20160113000812](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ图片20160113000812.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ图片20160113000812.png)

旅程还在继续  

=========

本文讲了笔者对前端页面开发中尽量思考多用 CSS 实现的一些见解，主观性强烈，欢迎大家的一起来探讨。

通过业务实践中的两个例子带领大家走了一回 CSS 实现旅程，还望各位观众姥爷过了瘾，如大家有一些更好的实践十分欢迎与我分享。

我跟你的旅程就在此结束了，但你的旅程依然在继续，若本文能给你带来启发，我就最开心不过了。

最后，flex 大法好！

行文匆忙，如大家发现错误欢迎指正。

感谢你的阅读！


<!-- {% endraw %} - for jekyll -->