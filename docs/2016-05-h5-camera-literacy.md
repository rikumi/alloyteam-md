---
title: H5 视频直播扫盲
date: 2016-05-22
author: TAT.tennylv
source_link: http://www.alloyteam.com/2016/05/h5-camera-literacy/
---

<!-- {% raw %} - for jekyll -->

视频直播这么火，再不学就 out 了。

为了紧跟潮流，本文将向大家介绍一下视频直播中的基本流程和主要的技术点，包括但不限于前端技术。

**1 H5 到底能不能做视频直播？**

当然可以， H5 火了这么久，涵盖了各个方面的技术。

对于视频录制，可以使用强大的 webRTC（Web Real-Time Communication）是一个支持网页浏览器进行实时语音对话或视频对话的技术，缺点是只在 PC 的 chrome 上支持较好，移动端支持不太理想。

对于视频播放，可以使用 HLS (HTTP Live Streaming) 协议播放直播流，ios 和 android 都天然支持这种协议，配置简单，直接使用 video 标签即可。

webRTC 兼容性：

![](http://tenny.qiniudn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202016-05-23%2010.24.48.png)

video 标签播放 hls 协议视频：

```html
<video controls autoplay>
           
    <source
        src="http://10.66.69.77:8080/hls/mystream.m3u8"
        type="application/vnd.apple.mpegurl"
    />
           <p class="warning">Your browser does not support HTML5 video.</p>  
</video>;
```

**2 到底什么是 HLS 协议？**

简单讲就是把整个流分成一个个小的，基于 HTTP 的文件来下载，每次只下载一些，前面提到了用于 H5 播放直播视频时引入的一个.m3u8 的文件，这个文件就是基于 HLS 协议，存放视频流元数据的文件。

每一个.m3u8 文件，分别对应若干个 ts 文件，这些 ts 文件才是真正存放视频的数据，m3u8 文件只是存放了一些 ts 文件的配置信息和相关路径，当视频播放时，.m3u8 是动态改变的，video 标签会解析这个文件，并找到对应的 ts 文件来播放，所以一般为了加快速度，.m3u8 放在 web 服务器上，ts 文件放在 cdn 上。

.m3u8 文件，其实就是以 UTF-8 编码的 m3u 文件，这个文件本身不能播放，只是存放了播放信息的文本文件：

    ​#EXTM3U                     m3u文件头
    #EXT-X-MEDIA-SEQUENCE       第一个TS分片的序列号
    #EXT-X-TARGETDURATION       每个分片TS的最大的时长
    #EXT-X-ALLOW-CACHE          是否允许cache
    #EXT-X-ENDLIST              m3u8文件结束符
    #EXTINF                     指定每个媒体段(ts)的持续时间（秒），仅对其后面的URI有效
    mystream-12.ts

ts 文件：

![](http://tenny.qiniudn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202016-05-23%2011.09.29.png)

HLS 的请求流程是：  
**1 http 请求 m3u8 的 url。  
2  服务端返回一个 m3u8 的播放列表，这个播放列表是实时更新的，一般一次给出 5 段数据的 url。  
3  客户端解析 m3u8 的播放列表，再按序请求每一段的 url，获取 ts 数据流。**

简单流程：

![](http://tenny.qiniudn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202016-05-23%2011.20.29.png)

**3 HLS 直播延时**

我们知道 hls 协议是将直播流分成一段一段的小段视频去下载播放的，所以假设列表里面的包含 5 个 ts 文件，每个 TS 文件包含 5 秒的视频内容，那么整体的延迟就是 25 秒。因为当你看到这些视频时，主播已经将视频录制好上传上去了，所以时这样产生的延迟。当然可以缩短列表的长度和单个 ts 文件的大小来降低延迟，极致来说可以缩减列表长度为 1，并且 ts 的时长为 1s，但是这样会造成请求次数增加，增大服务器压力，当网速慢时回造成更多的缓冲，所以苹果官方推荐的 ts 时长时 10s，所以这样就会大改有 30s 的延迟。参考资料：<https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/StreamingMediaGuide/FrequentlyAskedQuestions/FrequentlyAskedQuestions.html>

**4 视频直播的整个流程是什么？**

当视频直播可大致分为：

**1 视频录制端：一般是电脑上的音视频输入设备或者手机端的摄像头或者麦克风，目前以移动端的手机视频为主。**

**2 视频播放端：可以是电脑上的播放器，手机端的 native 播放器，还有就是 h5 的 video 标签等，目前还是已手机端的 native 播放器为主。**

**3 视频服务器端：一般是一台 nginx 服务器，用来接受视频录制端提供的视频源，同时提供给视频播放端流服务。**

简单流程：

![](http://tenny.qiniudn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202016-05-23%2011.33.20.png)

**5 怎样进行音视频采集？**

当首先明确几个概念：

**视频编码：所谓视频编码就是指通过特定的压缩技术，将某个视频格式的文件转换成另一种视频格式文件的方式，我们使用的 iphone 录制的视频，必须要经过编码，上传，解码，才能真正的在用户端的播放器里播放。**

**编解码标准：视频流传输中最为重要的编解码标准有国际电联的 H.261、H.263、H.264，其中 HLS 协议支持 H.264 格式的编码。  
音频编码：同视频编码类似，将原始的音频流按照一定的标准进行编码，上传，解码，同时在播放器里播放，当然音频也有许多编码标准，例如 PCM 编码，WMA 编码，AAC 编码等等，这里我们 HLS 协议支持的音频编码方式是 AAC 编码。**

下面将利用 ios 上的摄像头，进行音视频的数据采集，主要分为以下几个步骤：

**1  音视频的采集，ios 中，利用 AVCaptureSession 和 AVCaptureDevice 可以采集到原始的音视频数据流。  
2 对视频进行 H264 编码，对音频进行 AAC 编码，在 ios 中分别有已经封装好的编码库来实现对音视频的编码。  
3 对编码后的音、视频数据进行组装封包；  
4 建立 RTMP 连接并上推到服务端。**

ps：由于编码库大多使用 c 语言编写，需要自己使用时编译，对于 ios，可以使用已经编译好的编码库。

x264 编码：<https://github.com/kewlbear/x264-ios>

faac 编码：<https://github.com/fflydev/faac-ios-build>

ffmpeg 编码：<https://github.com/kewlbear/FFmpeg-iOS-build-script>

关于如果想给视频增加一些特殊效果，例如增加滤镜等，一般在编码前给使用滤镜库，但是这样也会造成一些耗时，导致上传视频数据有一定延时。

简单流程：

![](http://tenny.qiniudn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202016-05-23%2012.07.49.png)

**6 前面提到的 ffmpeg 是什么？**

和之前的 x264 一样，ffmpeg 其实也是一套编码库，类似的还有 Xvid，Xvid 是基于 MPEG4 协议的编解码器，x264 是基于 H.264 协议的编码器，ffmpeg 集合了各种音频，视频编解码协议，通过设置参数可以完成基于 MPEG4,H.264 等协议的编解码，demo 这里使用的是 x264 编码库。

**7 什么是 RTMP？**

Real Time Messaging Protocol（简称 RTMP）是 Macromedia 开发的一套视频直播协议，现在属于 Adobe。和 HLS 一样都可以应用于视频直播，区别是 RTMP 基于 flash 无法在 ios 的浏览器里播放，但是实时性比 HLS 要好。所以一般使用这种协议来上传视频流，也就是视频流推送到服务器。

这里列举一下 hls 和 rtmp 对比：

![](http://tenny.qiniudn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202016-05-25%2010.43.02.png)

**8 推流**

简所谓推流，就是将我们已经编码好的音视频数据发往视频流服务器中，一般常用的是使用 rtmp 推流，可以使用第三方库**[librtmp-iOS](https://github.com/ifactorylab/librtmp-iOS)**进行推流，librtmp 封装了一些核心的 api 供使用者调用，如果觉得麻烦，可以使用现成的 ios 视频推流 sdk，也是基于 rtmp 的，<https://github.com/runner365/LiveVideoCoreSDK>

**9 推流服务器搭建**

简简单的推流服务器搭建，由于我们上传的视频流都是基于 rtmp 协议的，所以服务器也必须要支持 rtmp 才行，大概需要以下几个步骤：

**1 安装一台 nginx 服务器。**

**2 安装 nginx 的 rtmp 扩展，目前使用比较多的是 <https://github.com/arut/nginx-rtmp-module>**

**3 配置 nginx 的 conf 文件：**


<!-- {% endraw %} - for jekyll -->