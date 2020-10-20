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

简单的游戏使用`&lt;audio>` 标签可能就足够了。然而，许多浏览器提供的简陋实现导致音频毛刺和高延迟的出现。这可能只是暂时性的问题，因为厂商们都在努力改进各自的实现。要了解`&lt;audio>` 标签的支持情况，我们可以使用 [areweplayingyet.org](http://areweplayingyet.org/) 所提供的优秀测试工具。

一旦深入`&lt;audio>` 标签规范，就会清楚了解到有很多事情根本不能用它实现。这并不奇怪，因为它主要被设计来支持多媒体播放。这些限制包括：

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

现在许多游戏开发商为背景音乐使用`&lt;audio>` 标签，因为它非常适合流媒体内容。现在你可以通过`&lt;audio>` 标签把内容带入网络音频的上下文。

&lt;audio> 标签支持流媒体相当有用，因为它可以让你立即播放背景音乐，而无须等待下载所有内容。在网络音频 API 支持音频流之后，你可以操作或分析它们。下面的例子为通过`&lt;audio>` 标签播放的音乐使用了一个低通滤波器：

**\[html]** [view plain](http://blog.csdn.net/hfahe/article/details/7443276# "view plain")[copy](http://blog.csdn.net/hfahe/article/details/7443276# "copy")

1.  var audioElement = document.querySelector('audio');
2.  var mediaSourceNode = context.createMediaElementSource(audioElement);
3.  // Create the filter
4.  var filter = context.createBiquadFilter();
5.  // Create the audio graph.
6.  mediaSourceNode.connect(filter);
7.  filter.connect(context.destination);

关于`&lt;audio>` 标签和网络音频 API 整合更多的讨论，可以看看这篇[短文](http://updates.html5rocks.com/2012/02/HTML5-audio-and-the-Web-Audio-API-are-BFFs)。

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

如果你觉得声音太响了，我感到抱歉。我们将在后面的章节讨论测量和动态压缩。

现在，如果你游戏里所有的机枪都像这样响起，那将相当无聊。当然，它们会基于目标的距离和相对位置而有所差异（稍后讨论），但即使这样做可能还不够。幸运的是，网络音频 API 提供了对上面的示例进行轻松调整的方式，主要有两种：

1.    发射子弹时间上微妙的变化

2.    改变每个音效的播放速率（同时改变音高），以更好地模拟现实世界中的随机性。

        这两种方法的效果如下：

[![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/144759Nem.jpg)](http://www.html5rocks.com/en/tutorials/webaudio/games/)

[完整源代码](http://www.html5rocks.com/en/tutorials/webaudio/games/samples/machine-gun/gun.js)

对于这些技术在现实生活中的实际例子，可以看看[台球桌的演示](http://chromium.googlecode.com/svn/trunk/samples/audio/o3d-webgl-samples/pool.html) ，它采用了随机抽样和变化的播放速率来表现更有趣的球的碰撞声。

## 3D 定位音效

游戏往往设定在一个 2D 或者 3D 的世界里。在这样的情况下，立体定位的音频可以大大增加沉浸感的体验。幸运的是，网络音频 API 带来了内置硬件加速的位置音频特性，可以直接的使用。 顺便说一下，你应该确保有立体声扬声器（最好是耳机）来运行下面的例子。 在下面的示例中，你可以通过在画布上滚动鼠标滚轮来更改声源的角度。

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/1448006J1.jpg)

[完整源代码](http://www.html5rocks.com/en/tutorials/webaudio/games/samples/position/position.js)

上面的例子中，有一个监听者在画布正中（人的图标），同时鼠标控制声源（喇叭图标）的位置，这是使用 [AudioPannerNode](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#AudioPannerNode-section) 实现这种效果的简单例子。它的基本思想是通过设置音频信号源的位置响应鼠标的移动，如下所示：

**\[html]** [view plain](http://blog.csdn.net/hfahe/article/details/7443276# "view plain")[copy](http://blog.csdn.net/hfahe/article/details/7443276# "copy")

1.  PositionSample.prototype.changePosition = function(position) {
2.    // Position coordinates are in normalized canvas coordinates
3.    // with -0.5 &lt; x, y &lt; 0.5
4.    if (position) {
5.      if (!this.isPlaying) {
6.        this.play();
7.      }
8.      var mul = 2;
9.      var x = position.x / this.size.width;
10.     var y = -position.y / this.size.height;
11.     this.panner.setPosition(x \* mul, y \* mul, -0.5);
12.   } else {
13.     this.stop();
14.   }
15. };

关于网络音频空间化处理需要了解的事情：

-   监听者默认在原点（0，0，0）。
-   网络音频位置 API 没有单位，所以我引入了一个乘数使得演示的声效更好。
-   网络音频采用 Y - 型直角坐标系（和大多数计算机图形系统相反）。 这就是为什么我在上面的代码片段进行了 y 轴的变换。

### 高级：音锥

定位模型非常强大，而且相当先进，主要基于 [OpenAL](http://connect.creativelabs.com/openal/Documentation/OpenAL%201.1%20Specification.pdf)。详细信息请查看上述规范的第 3 和第 4 节。

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/144801YUx.jpg)

在有单一的 [AudioListener](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#AudioListener-section) 连接到网络音频 API 的情况下，它可以通过位置和方向配置空间。每个源可以通过一个 AudioPannerNode（音频声像节点）来使得音频输入空间化。声像节点有位置和方向，以及距离和方向性模型。

距离模型指定的增益取决于和源的接近程度，而方向模型可以通过指定内外锥来配置，以决定监听者在内部锥里，在内外锥之间，或在外部锥之外时增益的大小（通常为负值）。

**\[html]** [view plain](http://blog.csdn.net/hfahe/article/details/7443276# "view plain")[copy](http://blog.csdn.net/hfahe/article/details/7443276# "copy")

1.  var panner = context.createPanner();
2.  panner.coneOuterGain = 0.5;
3.  panner.coneOuterAngle = 180;
4.  panner.coneInnerAngle = 0;

虽然我的例子在 2D 空间，但是这种模式很容易推广到三维。例如 3D 声音空间化的例子可以看看这个[位置演示](http://chromium.googlecode.com/svn/trunk/samples/audio/simple.html)。另外对于位置来说，网络音频模型也可以选择多普勒频移的速度。这个例子展示了[多普勒效应](http://chromium.googlecode.com/svn/trunk/samples/audio/doppler.html)的详细信息。

关于这一主题的更多信息，可以阅读[混合定位音频和 WebGL](http://www.html5rocks.com/tutorials/webaudio/positional_audio/) 的详细教程 。

## 室内效果和滤波器

在现实中，声音被感觉的方式很大程度上取决于声音所在的房间。相同吱吱作响的门在地下室与大型的开放式大厅里相比会发出相当不同的声音。高产值的游戏将会模仿这些影响，因为为每个环境创建一套独立的音效是相当昂贵的，并且会产生相当多的材料和大量的游戏数据。

严格地说，描述原始声音和现实中所听到之间不同的音频术语是[脉冲响应](http://en.wikipedia.org/wiki/Impulse_response)。这些脉冲响应可以被精心录制，其实也有[网站](https://www.google.com/search?q=impulse+responses)为了方便你的使用存放了许多这种预先录制的脉冲响应文件（作为音频方式存储）。

对于如何从一个给定的环境创建脉冲响应的更多信息，可以通读网络音频 API 规范卷积部分的 “录音设置” 一节。

更重要的是针对我们的目标，网络音频 API 提供了一个简单的方法来在我们的声音里应用脉冲响应，即通过使用 [ConvolverNode](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#ConvolverNode-section) 的方式。

**\[html]** [view plain](http://blog.csdn.net/hfahe/article/details/7443276# "view plain")[copy](http://blog.csdn.net/hfahe/article/details/7443276# "copy")

1.  // Make a source node for the sample.
2.  var source = context.createBufferSource();
3.  source.buffer = this.buffer;
4.  // Make a convolver node for the impulse response.
5.  var convolver = context.createConvolver();
6.  convolver.buffer = this.impulseResponseBuffer;
7.  // Connect the graph.
8.  source.connect(convolver);
9.  convolver.connect(context.destination);

下面的示例展示了一些不同脉冲响应下的军事演讲：

[![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/144802GQt.jpg)](http://www.html5rocks.com/en/tutorials/webaudio/games/)

[完整源代码](http://www.html5rocks.com/en/tutorials/webaudio/games/samples/room-effects/room-effects.js)

还可以看看网络音频 API 规范页面上的[房间效果演示](http://chromium.googlecode.com/svn/trunk/samples/audio/convolution-effects.html)，以及[这个让你控制通过一个伟大的爵士标准混合干（原料）和湿（通过卷积处理）的例子](http://kevincennis.com/audio/)。

## 最后的倒计时

现在你已经创建了一个游戏，添加了位置音频，而且现在在你的图里有大量的同时播放的 AudioNodes。 太棒了，但是还有一件事要考虑：

由于多种声音互相叠加起来播放，你可能会发现在某种情况下，声音超过了扬声器的最大承受能力。就像图像超出了画布边界的情况一样，声音也会在波形超过最大阈值时进行削波，导致明显的失真。波形看起来会像下面这样：

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/144804LOy.jpg)

这里有一个真实削波的例子。波形看起来相当糟糕：

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/144805fDt.jpg)

听起来也很糟糕：

[![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/144806OTs.jpg)](http://www.html5rocks.com/en/tutorials/webaudio/games/)

听到像上面这样严重扭曲的音乐是很严重的事，或者与此相反，过分的混合会迫使听众调大音量。如果你现在有这种情况，你真的需要立即解决它！

### 检测削波

从技术角度看，削波发生在任何一个通道的信号值超出有效范围即 - 1 和 1 之间时。一旦检测到削波反生时，视觉反馈会非常有用。要可靠的实现这点，可以把 [JavaScriptAudioNode](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#JavaScriptAudioNode-section) 放到你的图里。音频图将会按如下进行设置：

**\[html]** [view plain](http://blog.csdn.net/hfahe/article/details/7443276# "view plain")[copy](http://blog.csdn.net/hfahe/article/details/7443276# "copy")

1.  // Assume entire sound output is being piped through the mix node.
2.  var meter = context.createJavaScriptNode(2048, 1, 1);
3.  meter.onaudioprocess = processAudio;
4.  mix.connect(meter);
5.  meter.connect(context.destination);

同时通过下面的 ```processAudio`` 方法可以检测到```削波：

**\[html]** [view plain](http://blog.csdn.net/hfahe/article/details/7443276# "view plain")[copy](http://blog.csdn.net/hfahe/article/details/7443276# "copy")

1.  function processAudio(e) {

2.    var buffer = e.inputBuffer.getChannelData(0);

3.    var isClipping = false;

4.    // Iterate through buffer to check if any of the |values| exceeds 1.

5.    for (var i = 0; i &lt; buffer.length; i++) {

6.      var absValue = Math.abs(buffer\[i]);

7.      if (absValue >= 1) {

8.        isClipping = true;

9.        break;

10.     }

11.   }

12. }

在通常情况下要小心，因为性能方面的原因，不要过度的使用 `JavaScriptAudioNode`。 在这种情况下，一种替代的方法是为 `getByteFrequencyData` 在音频图里加入 `RealtimeAnalyserNode`，在渲染时通过 ```requestAnimationFrame`` 来检测```。这个方法更有效，但会错过多数信号（包括有可能削波的地方），因为渲染最多发生 60 次，而音频信号的变化更为迅速。

因为削波的检测非常重要，未来我们很可能将看到网络音频 API 节点内置 `MeterNode`。

### 防止削波

通过调整主要 AudioGainNode 的增益，你可以控制混音的水平来防止削波。 然而在实践中，因为你游戏中所播放的声音可能取决于大量因素，所以决定主增益值来防止所有情况下的削波是相当困难的。在通常情况下，你应该调整增益来预期最坏的情况，但这是一门艺术，而不是科学。

要知道这是具体如何实现的，下面是一个示例，在此你可以调整主增益。如果增益设置过高，会导致声音削波。监视器会变成红色来给出削波的视觉反馈。下面的音响生态环境是 Disco Dan 的混音作品，原曲是由 [Yasunori Mitsuda](http://en.wikipedia.org/wiki/Yasunori_Mitsuda) 所做的伟大的 “超时空之轮”。

[![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/144810GLT.jpg)](http://www.html5rocks.com/en/tutorials/webaudio/games/)

[完整源代码](http://www.html5rocks.com/en/tutorials/webaudio/games/samples/metering/metering.js)

### 加一点糖

音乐和游戏制作中经常使用效果器来平滑信号和控制尖峰。此功能在网络音频世界里可以通过 `DynamicsCompressorNode` 来实现，可以在你的音频图加入一个更响亮，更丰富，更饱满的音色，这也有利于削波。直接引用规范里的话，这个节点

“... 降低了信号最响亮部分的体积，并提升了最柔软部分的音量... 尤其重要的是在游戏和音乐应用里，当大量独立的声音播放时，控制信号整体水平，并有助于避免削波。”

使用动态压缩通常来说是一个好主意，尤其是在游戏的设置里，正如前面所讨论的一样，你并不知道到底此时什么声音将会何时播放。DinahMoe 实验室的 [Plink](http://labs.dinahmoe.com/plink) 是很好的例子，因为声音的回放完全取决于你和其他参与者。效果器在大多数情况下是有用的，除了一些罕见的情况外，而这种情况下你可以使用已经精心调整过，并且听起来 “恰到好处” 的曲目。

它的实现是一件简单的事情，只需要在你的音频图里把 DynamicsCompressorNode 作为目标前的最后一个节点添加进去。

**\[html]** [view plain](http://blog.csdn.net/hfahe/article/details/7443276# "view plain")[copy](http://blog.csdn.net/hfahe/article/details/7443276# "copy")

1.  // Assume the output is all going through the mix node.
2.  var compressor = context.createDynamicsCompressor();
3.  mix.connect(compressor);
4.  compressor.connect(context.destination);

关于动态压缩的更多细节，[Wikipedia 上的这篇文章](http://en.wikipedia.org/wiki/Dynamic_range_compression)非常翔实。

总结一下，仔细检查削波，通过插入主增益节点来防止它的出现。然后使用动态效果器节点来收紧整个混音。你的音频图可能看起来像这样：

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/144811wgY.jpg)

## 结论

以上内容涵盖了我认为使用网络音频 API 来开发游戏音乐最重要的方面。有了这些技术，可以在你的浏览器上构建真正有吸引力的音频体验。在我结束本文之前，给你一个提示：如果你的浏览器标签使用 [page visibility API](http://www.samdutton.com/pageVisibility/) 切换到了后台，一定要让声音暂停，否则你会为用户提供一个潜在的令人厌烦的体验。

对于关于网络音频的其他信息，需要在[入门的文章](http://www.html5rocks.com/en/tutorials/webaudio/intro/)进行更多了解。如果你有问题，看看它是否已经在[网络音频 FAQ](http://updates.html5rocks.com/2012/01/Web-Audio-FAQ) 里得到解答。最后，如果你有其他问题，可以在 [Stack Overflow](http://stackoverflow.com/questions/tagged/web-audio) 上的 [web-audio](http://stackoverflow.com/questions/tagged/web-audio) 标签下提问。

在本文结束前，让我为你展示网络音频 API 现在在实际游戏里的用途：

-   [Field Runners](http://fieldrunnershtml5.appspot.com/)，以及有关一些[技术细节的](http://weblog.bocoup.com/fieldrunners-playing-to-the-strengths-of-html5-audio-and-web-audio/)文档。
-   [愤怒的小鸟](http://chrome.angrybirds.com/)，最近换用了网络音频 API。到[这个文档](http://googlecode.blogspot.com/2012/01/angry-birds-chrome-now-uses-web-audio.html)查看更多信息。
-   [SkidRacer](https://skid.gamagio.com/play/)，大量使用了立体音效。

**译自：**<http://www.html5rocks.com/en/tutorials/webaudio/games/>

出处：蒋宇捷的博客


<!-- {% endraw %} - for jekyll -->