---
title: 用 HTML5 Audio API 开发游戏的 3D 音效和混音
date: 2012-05-24
author: TAT.Kinvix
source_link: http://www.alloyteam.com/2012/05/%e7%94%a8html5-audio-api%e5%bc%80%e5%8f%91%e6%b8%b8%e6%88%8f%e7%9a%843d%e9%9f%b3%e6%95%88%e5%92%8c%e6%b7%b7%e9%9f%b3/
---

<!-- {% raw %} - for jekyll -->

**支持的浏览器：![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/14475238f.jpg)**

**难度：中等**

**注意：**本文讨论的 API 尚未最终确定，仍在不断变化。请在自己的项目中谨慎使用。

## 介绍

音频在很大程度上使得多媒体体验非常引人注目。如果你曾经尝试在关闭声音的情况下看电影，你就很可能已经注意到了这一点。

游戏也不例外！我最喜爱的视频游戏的回忆里包含了音乐和声效。在二十年后的今天，大多情况下，当玩我最爱的游戏时，我仍然不能把 “塞尔达” 里[近藤浩二](http://en.wikipedia.org/wiki/Koji_Kondo)的[乐曲](http://www.youtube.com/watch?v=4qJ-xEZhGms)和[马特](http://en.wikipedia.org/wiki/Matt_Uelmen)大气的[暗黑配乐](http://www.youtube.com/watch?v=Q2evIg-aYw8)从我的头脑里驱逐掉。这同样适用于音效，例如魔兽里单位实时点击的响应，以及任天堂的经典例子。

游戏的音频提出了一些有趣的挑战。要创建令人着迷的游戏音乐，设计人员需要调节潜在的不可预知的状态。实际上，部分游戏能持续未知的时间长度，声音可以与环境互动，并以复杂的方式混合起来，例如室内效果和相对声音定位。最后，可能有大量的一次播放声效，这需要不错的混合效果和在渲染时没有性能损失。

## 网页上的游戏音频

简单的游戏使用`<audio>` 标签可能就足够了。然而，许多浏览器提供的简陋实现导致音频毛刺和高延迟的出现。这可能只是暂时性的问题，因为厂商们都在努力改进各自的实现。要了解`<audio>` 标签的支持情况，我们可以使用 [areweplayingyet.org](http://areweplayingyet.org/) 所提供的优秀测试工具。

一旦深入`<audio>` 标签规范，就会清楚了解到有很多事情根本不能用它实现。这并不奇怪，因为它主要被设计来支持多媒体播放。这些限制包括：

-   无法为声音信号使用滤波器
-   无法访问原始的 PCM（宇捷：即 WAV）数据
-   没有来源和听众位置、方向的概念
-   没有细粒度的计时

在下文中，我将深入介绍一些用 WebAudio API 编写游戏音频方面的内容。在[入门教程](http://www.html5rocks.com/en/tutorials/webaudio/intro/)里可以了解到此 API 的简单介绍。

## 背景音乐

游戏里往往有循环播放的背景音乐。例如，一个背景音轨如下：

[![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/144753TNg.jpg)](http://www.html5rocks.com/en/tutorials/webaudio/games/)

如果你的循环音乐很短并且已知，会相当的烦人。当玩家被困在一个区域或者关卡上，会同时连续播放相同的背景音乐，我们可能需要逐渐淡出来防止让玩家厌烦。另一种策略是，根据游戏中的上下文，把不同的音效强度通过逐渐的淡入淡出混合起来。

如果你的玩家在一个史诗般的 BOSS 关卡里，可能需要对几个不同的情绪范围进行混音，例如从艺术氛围到有心理暗示的氛围再到激烈的氛围。音乐合成软件通常允许你通过选择音轨集合来导出几种混音（它们具有同样长度）。这样音轨之间就有某种内部一致性，避免出现从一个音轨切换到另一个时出现不和谐的转换过渡。

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/144755eF2.jpg)

然后，利用 WebAudio API，你可以使用某些类例如 [BufferLoader](http://www.html5rocks.com/en/tutorials/webaudio/intro/js/buffer-loader.js) 通过 XHR 导入所有这些音效样本（这在[介绍网络音频 API 的文章](http://www.html5rocks.com/en/tutorials/webaudio/intro/)中进行了深入介绍）。加载音效需要时间，所以这些在游戏中使用的音效在每一关开始时，应该在页面加载时同时载入，或者在播放器播放时增量加载。

接下来，你需要为每个节点创建一个源，并为每个源创建一个增益节点，连接图如下：

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/144757SSj.jpg)

完成之后，你可以在一个循环中同时回放这些音效源，因为它们都具有相同的长度，WebAudio API 将保证它们保持一致。由于最后的 BOSS 战时音效风格会变得相近或更不同，游戏可以使用类似于下面的增量算法来改变链中各节点对应的增益值：

**\[html]** [view plain](http://blog.csdn.net/hfahe/article/details/7443276# "view plain")[copy](http://blog.csdn.net/hfahe/article/details/7443276# "copy")

1.  // Assume gains is an array of AudioGainNode, normVal is the intensity
2.  // between 0 and 1.
3.  var value = normVal \* (gains.length - 1);
4.  // First reset gains on all nodes.
5.  for (var i = 0; i &lt; gains.length; i++) {
6.    gains\[i].gain.value = 0;
7.  }
8.  // Decide which two nodes we are currently between, and do an equal
9.  // power crossfade between them.
10. var leftNode = Math.floor(value);
11. // Normalize the value between 0 and 1.
12. var x = value - leftNode;
13. var gain1 = Math.cos(x \* 0.5\*Math.PI);
14. var gain2 = Math.cos((1.0 - x) \* 0.5\*Math.PI);
15. // Set the two gains accordingly.
16. gains\[leftNode].gain.value = gain1;
17. // Check to make sure that there's a right node.
18. if (leftNode &lt; gains.length - 1) {
19.   // If there is, adjust its gain.
20.   gains\[leftNode + 1].gain.value = gain2;
21. }

在上述方法中，有两个音效源同时播放，我们使用同等功率的曲线（如[介绍](http://www.html5rocks.com/en/tutorials/webaudio/intro/)所述）从它们之间淡入淡出。下面的示例使用了这一策略，演示的背景音乐在魔兽争霸 2 的主题上逐渐增强：

[![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/144757pHY.jpg)](http://www.html5rocks.com/en/tutorials/webaudio/games/)

[完整源代码](http://www.html5rocks.com/en/tutorials/webaudio/games/samples/background-intensity/background.js)

### 缺少的环节：Web Audio 的 Audio 标签

现在许多游戏开发商为背景音乐使用`<audio>` 标签，因为它非常适合流媒体内容。现在你可以通过`<audio>` 标签把内容带入网络音频的上下文。

<audio> 标签支持流媒体相当有用，因为它可以让你立即播放背景音乐，而无须等待下载所有内容。在网络音频 API 支持音频流之后，你可以操作或分析它们。下面的例子为通过`<audio>` 标签播放的音乐使用了一个低通滤波器：

**\[html]** [view plain](http://blog.csdn.net/hfahe/article/details/7443276# "view plain")[copy](http://blog.csdn.net/hfahe/article/details/7443276# "copy")

1.  var audioElement = document.querySelector('audio');
2.  var mediaSourceNode = context.createMediaElementSource(audioElement);
3.  // Create the filter
4.  var filter = context.createBiquadFilter();
5.  // Create the audio graph.
6.  mediaSourceNode.connect(filter);
7.  filter.connect(context.destination);

关于`<audio>` 标签和网络音频 API 整合更多的讨论，可以看看这篇[短文](http://updates.html5rocks.com/2012/02/HTML5-audio-and-the-Web-Audio-API-are-BFFs)。

## 音效

游戏经常在响应用户输入或者游戏状态改变时播放声音效果。但是像背景音乐一样，音效可以很快的让用户厌倦。 为了避免这种情况，最好有一个音效池放置相似但是不同的音效。 这可以从轻微变化到急剧变化间通过固定长度来过渡，像[魔兽系列](http://www.youtube.com/watch?v=MXgr6SYYNZM)里点击各单位的时候。

游戏音效的另外一个关键点是可以同时有多个。想象一下，你与多个演员拍摄枪战时。每个机枪每秒触发多次，造成几十个音效同时播放。从多个源同时播放音效，还要对音效源精确计时，是网络音频 API 真正的亮点。

下面的例子演示了由多个单独子弹样本组成的机枪，其创建了多个播放时间错开的声源。

**\[html]** [view plain](http://blog.csdn.net/hfahe/article/details/7443276# "view plain")[copy](http://blog.csdn.net/hfahe/article/details/7443276# "copy")

1.  var time = context.currentTime;
2.  for (var i = 0; i &lt; rounds; i++) {
3.    var source = this.makeSource(this.buffers\[M4A1]);
4.    source.noteOn(time + i \* interval);
5.  }

下面是这个代码的效果：

[![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/144758HEl.jpg)](http://www.html5rocks.com/en/tutorials/webaudio/games/)


<!-- {% endraw %} - for jekyll -->