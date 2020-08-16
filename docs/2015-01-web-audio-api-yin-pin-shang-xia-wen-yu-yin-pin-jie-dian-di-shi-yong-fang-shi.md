---
title: 【Web Audio API】— 初探音频上下文与音频节点
date: 2015-01-11
author: TAT.Jdo
source_link: http://www.alloyteam.com/2015/01/web-audio-api-yin-pin-shang-xia-wen-yu-yin-pin-jie-dian-di-shi-yong-fang-shi/
---

这主题主要是早期对 web audio api 的一些尝试，这里整理一下以便以后翻阅，如有错误，诚请指正。

在真正进入 Web Audio API 开发之前，需要先弄清两个概念：音频上下文（AudioContext）、音频节点（AudioNode）;

Web Audio API 是一套以音频上下文（AudioContext）为基础的接口系统；基本上每一次的开发都需要第一个用到，

看下 W3C 对 AudioContext 的描述：

> This interface represents a set of AudioNode objects and their connections. It allows for arbitrary routing of signals to the AudioDestinationNode (what the user ultimately hears). Nodes are created from the context and are then connected together. In most use cases, only a single AudioContext is used per document.

大意是一个 AudioContext 代表一系列音频节点以及节点之间的连接方式，它允许一个或以上的音频信号在经过任意的连接之后最终连接在音频播放设备节点上；节点都是可以通过音频上下文对象然后连接到了一起；通常一个文档中只需要一个一个音频上下文对象即可。

个人觉得 AudioContext 就是一个大的工厂，它不仅能够创建各种类型的音频节点，还规范了音频节点跟节点之间的连接式，规范了音频流在节点之间的传达方式。比如我实例化一个音频上下文对象：

```javascript
var audioCtx = new AudioContext();
```

接下来我就可以通过音频对象来创建各类型的音频节点：

```javascript
// 创建音源节点
var sourceNode = audioCtx.createBufferSource();
// 创建分析节点
var analyserNode = audioCtx.createAnalyser();
// 创建增益节点
var gainNode = audioCtx.createGain();
...
```

音频节点的连接方式、拥有特性都会在创建完成时就确定好了，这就是 AudioContext 所需要去规范的。

那再来看一下 W3C 对音频节点（AudioNode）的定义：

> AudioNodes are the building blocks of an AudioContext. This interface represents audio sources, the audio destination, and intermediate processing modules.

AudioNode 是 AudioContext 的基石，它可以是音频音源模块，音频播放设备模块，也可以是中间音频处理模块。

可以想象一下家庭卡拉 OK 设备，DVD 机就充当音频音源模块（当然一台 DVD 还是会包含很多对音频的处理模块的，暂且忽略），音响就充当音频播放设备模块，而家庭卡拉 OK 还会有一台混响器（主要用于把你的声音与背景音乐合成最终输出到音响上），这台混响器则可以充当音频处理模块，然后各个模块最终还是需要电线连接起来，最终才接在音响上。

W3C 给出最简单的音频上下文，音源节点直接连接到了播放设备节点上，这样你就可以播放一首你想要的音乐了。

[![modular-routing1](http://www.alloyteam.com/wp-content/uploads/2015/01/modular-routing1.png)](http://www.alloyteam.com/wp-content/uploads/2015/01/modular-routing1.png)

当然一个音频上下文也可以以很复杂的方式连接起来，你只需要在音源跟播放设备之间增加其他效果处理的节点或者分析节点，比如：

[![modular-routing2](http://www.alloyteam.com/wp-content/uploads/2015/01/modular-routing2.png)](http://www.alloyteam.com/wp-content/uploads/2015/01/modular-routing2.png)

这是一套专业音效合成处理图，这里可以看得出一个音频上下文是允许多个音源节点同时存在的，而且个别类型节点还允许可以有多个输入端以及多个输出端，下面就对 Web Audio API 现有的节点类型整理一下：

**音源节点 **（0 input, 1 output）\*\*\*\*

**主要用于产生或引入一段音频信号**

    // 音频原始数据节点，可通过ajax、input方式引入音频格式文件
    AudioBufferSourceNode
    // 音频媒体标签节点，可通过关联<audio>标签
    MediaElementAudioSourceNode
    // 实时音频流节点，可通过getUserMedia获取实时输入的音频流数据
    MediaStreamAudioSourceNode
    // 波形产生器节点，可产生自定义的波形/频率的音频信号
    OscillatorNode

**分析节点 **（1 input, 1 output）\*\*\*\*

**主要用于对频谱数据的读取，以便可是实现一些可视化的交互**

    // 音频信号分析节点
    AnalyserNode
    // js处理节点，该节点因性能问题，目前处于废弃状态，后续逐步由`AudioWorkerNode`代替
    ScriptProcessorNode
    // 能实现与`ScriptProcessorNode`一样的功能，不过音频处理代码会放到单独的一个外部文件由浏览器端引入，而该文件的执行也由浏览器端新开独立进行去执行，不会影响主线程
    AudioWorkerNode

**音频处理节点（1+ input, 1+ output）**

**该类节点大都是具有某种效果的处理能力，可以对输入的音频信号进行一些处理**

    // 增益节点
    GainNode
    // 滤波器节点
    BiquadFilterNode
    // 延时节点
    DelayNode
    ...

**播放设备节点 **（1 input, 0 output）\*\*\*\*

**主要用于播放最终处理完的音频信号**

    // 实时音频流播放设备节点
    MediaStreamAudioDestinationNode
    AudioDestinationNode

来个最简单的 demo 吧

```javascript
// 前缀兼容
["", "webkit", "moz", "ms"].forEach(function (pre) {
    var prefix = pre + "AudioContext";
    if (!window.AudioContext && window[prefix]) {
        window.AudioContext = window[prefix];
    }
});
```

使用 `createBufferSource` 节点创建音源节点主要有两种方式引入音频文件：`XMLHttpRequest` 与`<input type="file"/>`，这里就尝试 XMLHttpRequest 方式

```javascript
// 请求音频文件
function fetchAudioSource(url, successCallback) {
    if (url && typeof url === "string") {
        var request = new XMLHttpRequest();
        request.open("GET", url, true); // 以二进制缓冲的方式存储音频文件数据
        request.responseType = "arraybuffer";
        request.onload = function () {
            successCallback(request.response);
        };
        request.send();
    }
}
```

然后我们需要定义一个方法对这个缓冲区的文件数据解码成音频 RAW 数据

```javascript
function decodeAudio(audioCtx, audioData, callback) {
    if (audioData) {
        audioCtx.decodeAudioData(
            audioData, // on success
            function (buffer) {
                callback && callback(buffer);
            }, // on fail
            function (e) {
                console.log("Fail to decode the file!");
            }
        );
    }
}
```

有了这些准备后，我们就开始搞个最简单的播放器吧

```javascript
if (AudioContext) {
    fetchAudioSource("./somemusic.mp3", function (re) {
        // 创建音频上下文对象
        var audioCtx = new AudioContext(); // 创建音源节点
        var sourceNode = audioCtx.createBufferSource(); // 加一个增益节点，用于控制音量
        var gainNode = audioCtx.createGain(); // 设置音量大小，默认值为1 - 无增益或衰减
        gainNode.gain.value = 0.8; // 解码
        decodeAudio(audioCtx, re, function (sourceBuffer) {
            sourceNode.buffer = sourceBuffer;
        }); // 连接各节点 // source node -> gain node -> destination node
        sourceNode.connect(gainNode);
        gainNode.connect(audioCtx.destination); // 播放
        (sourceNode.start || sourceNode.noteOn)(0);
    });
}
```

未完待续…