---
title: Android 音频模块学习小结
date: 2013-12-30
author: TAT.zerozheng
source_link: http://www.alloyteam.com/2013/12/android-audio-module-learning-summary/
---

<!-- {% raw %} - for jekyll -->

现在移动端已不仅仅局限于文本、图片这些 pc 平台上的常见信息类型，语音的使用愈见频繁，于是前段时间萌生了个想法：如果在移动端对语音内容做处理，提取特征出来构建关键词库是否可以对这些语音进行分类、搜索，于是花了一段时间研究 android，本文从音频的录制、处理来记录总结，识别下篇放上。

一、 音频系统的架构

安卓系统里的音频模块可划分为几层：硬件、驱动、硬件抽象层、硬件与 java 库之间的 “中介”、Framework（供 app 调用的接口都封装在这层）、实际用户可视的 app。

二、 语音录制

处理语音录制的类主要 4 个： AudioTrack、AudioRecorder、MediaPlayer 和 MediaRecorder，都在 android.media 包下，MediaRecorder 的使用相对简单，不过相对的是无法处理一些底层的操作，例如无法对音频进行处理。

除了上面的类库实现外，音频系统实际调用了更为底层的服务来实现音频的采集，这就是 AudioFlinger 和 AudioPolicyService 。

AudioRecord 使用：

1、 创建 AudioRecord 对象

```c
AudioRecord( 
 
int  audioSource,            
 
int sampleRateInHz, 
 
int channelConfig, 
 
int audioFormat, 
 
int bufferSizeInBytes)
```

参数说明

AudioSource 音频采集来源

SampleRateInHz  录制频率

channelConfig 录制通道

AudioFormat 录制编码格式

BufferSize 录制缓冲大小，可以通过 getMinBufferSize 来获取

getMinBufferSize 这个接口返回了要成功创建一个 AudioRecord object 所需的最小 buffer size。

2、监听用户界面操作

```javascript
public void setOnClickListener (View.onClickListener l)
```

3、读

```javascript
public int read ( 
 
byte[] audioData, 
 
int offsetInBytes, 
 
int sizeInBytes)
```

audioData 是一个用来存储音频的字节数组

4、写

写操作主要涉及几个类：

java.io.File;

java.io.FileInputStream;

java.io.FileOutputStream;

使用：

```javascript
FileOutputStream fos = null;  
 
fos.write(audiodata); //将上一步得到的字节数组写入到文件中
```

**二、音频处理**

一般信号处理技术采用快速傅立叶变换，卷积变换和逆傅立叶变换来实现音频处理。

音频处理大致两类：变频、变速、变调。我们录到的声音为时域信号，需要利用信号处理技术将时域转成频域（指在对函数或信号进行分析时，分析其和频率有关部份，而不是和时间有关的部份），然后用频谱迁移技术来对信号处理，最后再将频域信号转换回时域。

对于每个音频片段，傅里叶变换将音频波形分解为它的成分音符并且保存下来，从而代替存储原始波形。语音识别就是基于此，将一段话分成块，与已有词库进行比较。

“函数或信号可以透过一对数学的运算子在时域及频域之间转换。例如傅里叶变换可以将一个时域信号转换成在不同频率下对应的振幅及相位，其频谱就是时域信号在频域下的表现，而反傅里叶变换可以将频谱再转换回时域的信号。”

虽说音频处理令人为之一亮，但涉及的技术较为复杂，因此现在市场上提供了相关产品直接提供开发者使用，例如 soundtouch，IIR 。

<!-- {% endraw %} - for jekyll -->