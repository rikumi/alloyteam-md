---
title: 【腾讯 Alloy 实验室】二维流体的粒子模拟
date: 2012-05-23
author: TAT.岑安
source_link: http://www.alloyteam.com/2012/05/fluid-simulation/
---

[![](http://hongru.github.com/resource/images/fluid.png "fluid simulation")](https://github.com/hongru/fluid)

以技术预研的心态做的一个东东。基于【双密度松弛算法】

目前来看应用价值不大，更多的是扩展一些思路，扩大前端方向，或者说是 js 能做的事的范围。大家路过围观一下就好。

源码不多，托管在 [github/hongru/fluid](https://github.com/hongru/fluid) 上，感兴趣的可以大致看一看。

#### 【实现的思路】

最关键的还是【双密度松弛算法】的实现。具体的算法可以参考文献和资料：

-   <http://wenku.baidu.com/view/2d53091b6bd97f192279e95e.html>
-   <http://www.iro.umontreal.ca/labs/infographie/papers/Clavet-2005-PVFS/pvfs.pdf>

另有一个 html5 版本的 粒子 流体模拟；实现思路略有不同，可以参考：[http://www.music.mcgill.ca/~sinclair/content/blog/liquid\\\_simulator\\\_ported\\\_to\\\_canvas](http://www.music.mcgill.ca/~sinclair/content/blog/liquid/_simulator/_ported/_to/_canvas)

使用 js 来做这种高计算量的事情，还是有点吃不住.