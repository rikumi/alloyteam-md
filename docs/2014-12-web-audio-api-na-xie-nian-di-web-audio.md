---
title: 【Web Audio API】— 那些年的 web audio
date: 2014-12-27
author: TAT.Jdo
source_link: http://www.alloyteam.com/2014/12/web-audio-api-na-xie-nian-di-web-audio/
---

<!-- {% raw %} - for jekyll -->

这主题主要是早期对 web audio api 的一些尝试，这里整理一下以便以后翻阅，如有错误，诚请指正。

在这之前，先回顾一下那些年我们一起走过的 web audio：

**&lt;bgsound>**

在我印象当中，bgsound 是个很古老的东西，接触互联网之后，那时兴起的个人 blog 都有一个增加小组件或者背景音乐的功能，就是允许你贴入一段代码来实现，那是我最早接触 bgsound 的时候；当然那时也只是会 ctrl+c/v \~~

网上翻来些资料，大概是这样的：

早在 1996 年，IE3.0 定义了&lt;bgsound> 的标签，这应该 web 最早的一个能播放音频的标签；但它却从未成为标准，由始至终只有 IE 支持该标签；提供的功能比较有限，简单的后台自动播放，支持.wav|.mid|.ua 格式音频；

**&lt;embed>**

IE 推出 bgsound 之后没多久，作为当年浏览器厂商的大哥 - NetScape 同年即推出了功能类似的标签&lt;embed>；

个人觉得&lt;embed> 早期相对于&lt;bgsound> 而言，最大的两个特色：

1. 有界面交互，可以让用户控制播放 / 暂停（该属性可选）；

2. 不止能播放音频格式文件，还能播放当时比较高端的 VRML Live3D 图形动画。

以浏览器厂商老大的身份，很快 IE3V2+, 以及后续的 safari, opare, firefox 均支持了&lt;embed>。

**&lt;object>**

随着 web 的快速发展，标准变得越来越重要，这时就有了 W3C 存在的理由，1997 年伴随着 HTML4 的到来，W3C 引入了&lt;object> 标签，囊括了图片、音频、视频等格式文件，可以说非常彪悍；作为第一款可以跨浏览器间播放音频的标签，基本能满足我们当时对嵌入媒体的欲望，但&lt;object> 同样存在自己的弊端，例如标签臃肿，依赖插件，SEO 困难等；

**&lt;audio>**

08 年初，第一份正式的 HTML5 草案发布，引入更新的富媒体元素&lt;video> &lt;audio> &lt;canvas>，这些标签的引入最大目的还是为了减少 web 富媒体应用对插件的依赖。仅从标签名来说就能很好区分各自的功能，这点无疑是非常有利于搜索引擎去索引资源的，相比&lt;object> 来说，最明显的特色即是：

1. 标签语义化，结构更简单；

2. 脱离插件；

3. 简单的 javascript 内置方法以及事件交互。

看似对音频控制都比较完善，但开发者缺少了对音频数据的访问权限，在很多更动感的交互，更复杂的音效需求面前就显得力不从心了。

**\[Audio Data API]**

为了解决现状，Mozilla 社区提出了 [Audio Data API](https://wiki.mozilla.org/Audio_Data_API)，对&lt;audio> 标签进行 js 能力方面的扩展，这套 API 主要还是以提供读取写入音频数据接口为主，例如：

```javascript
// 定义音频对象
var audio = new Audio();
var bufferLenth;
audio.src = "song.ogg";
audio.addEventListener("MozAudioAvailable", handleWithSample, false);
audio.addEventListener("loadedmetadata", handleWithMeta, false);
audio.play();
function handleWithMeta() {
    bufferLenth = audio.mozFrameBufferLength;
}
function handleWithSample(e) {
    var samples = e.frameBuffer;
    for (var i = 0; i &lt; bufferLenth; i++) {
        // do something with audio data
        dosomething(samples[i]);
    }
}
```

基于 `MozAudioAvailable` 事件驱动读取音频原始数据

注：该方法已无法正确执行，Firefox 已转向 Web Audio API 的支持，后续的 Firefox 版本逐渐废弃了 Audio Data API 的旧接口。

但对于一个开发者来说，并非人人都是音频资深用户或者发烧级音乐玩家，而且在很多音频的专业效果处理上需涉及大量波形相关处理算法，这就直接把很多开发者拒之门外了，这也是为什么最后 W3C 推荐了 Web Audio API。

**\[Web Audio API]**

[Web Audio API](http://webaudio.github.io/web-audio-api/) 最早是 Chrome 社区提出并支持的，Web Audio API 是一套全新的相对独立的接口系统，对音频文件拥有更高的处理权限以及内置相关的音频专业效果处理，可以完全独立于 &lt;audio> 标签而存在。这里把`内置相关音频专业效果处理`标红主要是因为，我个人觉得这是 Web Audio API 相对于 Audio Data API 最大的一个区别，也是为什么最终被 W3C 推荐的原因。

大概整了一下 Web Audio API 的新特点：

1. 更精准的时间控制；

2. 可完全独立&lt;audio>，允许更多音频文件同时播放，用于游戏或者复杂音频应用场景；

3. 模块化路由连接方式，让音频操作更加灵活形象；

4. 实时的频域、时域数据访问 / 操作；

5. 更多专业的音频处理方法

(1) 音道分离 / 合并；

(2) 音频延时效果；

(3) 内置频率滤波器；

(4) 音频空间感效果以及多普勒效应模拟；

(5) 音频卷积运算（用于声场环境模拟）；

(6) 自定义波形生成器；

(7) 波形非线性失真处理。

未完待续...

下期预告：[【Web Audio API】— 初探音频上下文与音频节点](http://www.alloyteam.com/2015/01/web-audio-api-yin-pin-shang-xia-wen-yu-yin-pin-jie-dian-di-shi-yong-fang-shi/)


<!-- {% endraw %} - for jekyll -->