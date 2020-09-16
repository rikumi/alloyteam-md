---
title: png 的故事：获取图片信息和像素内容
date: 2017-03-16
author: june01
source_link: http://www.alloyteam.com/2017/03/the-story-of-png-get-images-and-pixel-content/
---

<!-- {% raw %} - for jekyll -->

## 前言

现在时富媒体时代，图片的重要性对于数十亿互联网用户来说不言而喻，图片本身就是像素点阵的合集，但是为了如何更快更好的存储图片而诞生了各种各样的图片格式：jpeg、png、gif、webp 等，而这次我们要拿来开刀的，就是 png。

## 简介

首先，png 是什么鬼？我们来看看 wiki 上的一句话简介：

> Portable Network Graphics (PNG) is a raster graphics file format that supports lossless data compression.

也就是说，png 是一种使用**无损压缩**的图片格式，而大家熟知的另外一种图片格式 ——jpeg 则是采用有损压缩的方式。用通俗易懂的方式来讲，当原图片数据被编码成 png 格式后，是可以完全还原成原本的图片数据的，而编码成 jpeg 则会损耗一部分图片数据，这是因为两者的编码方式和定位不同。jpeg 着重于人眼的观感，保留更多的亮度信息，去掉一些不影响观感的色度信息，因此是有损耗的压缩。png 则保留原始所有的颜色信息，并且支持透明／alpha 通道，然后采用无损压缩进行编码。因此对于 jpeg 来说，通常适合颜色更丰富、可以在人眼识别不了的情况下尽可能去掉冗余颜色数据的图片，比如照片之类的图片；而 png 适合需要保留原始图片信息、需要支持透明度的图片。

以下，我们来尝试获取 png 编码的图片数据：

## 结构

图片是属于 2 进制文件，因此在拿到 png 图片并想对其进行解析的话，就得以二进制的方式进行读取操作。png 图片包含两部分：文件头和数据块。

### 文件头

png 的文件头就是 png 图片的前 8 个字节，其值为 `[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]`，人们常常把这个头称之为 “魔数”。玩过 linux 的同学估计知道，可以使用 `file` 命令类判断一个文件是属于格式类型，就算我们把这个文件类型的后缀改得乱七八糟也可以识别出来，用的就是判断 “魔数” 这个方法。有兴趣的同学还可以使用 `String.fromCharCode` 将这个 “魔数” 转成字符串看看，就知道为什么 png 会取这个值作为文件头了。

用代码来判断也很简单：

```javascript
// 读取指定长度字节
function readBytes(buffer, begin, length) {
    return Array.prototype.slice.call(buffer, begin, begin + length);
}
let header = readBytes(pngBuffer, 0, 8); // [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]
```

### 数据块

去掉了 png 图片等前 8 个字节，剩下的就是存放 png 数据的数据块，我们通常称之为 `chunk`。

顾名思义，数据块就是一段数据，我们按照一定规则对 png 图片（这里指的是去掉了头的 png 图片数据，下同）进行切分，其中一段数据就是一个数据块。每个数据块的长度是不定的，我们需要通过一定的方法去提取出来，不过我们要先知道有哪些类型的数据块才好判断。

#### 数据块类型

数据块类型有很多种，但是其中大部分我们都不需要用到，因为里面没有存储我们需要用到的数据。我们需要关注的数据块只有以下四种：

-   IHDR：存放图片信息。
-   PLTE：存放索引颜色。
-   IDAT：存放图片数据。
-   IEND：图片数据结束标志。

只要解析这四种数据块就可以获取图片本身的所有数据，因此我们也称这四种数据块为 **“关键数据块”**。

#### 数据块格式

数据块格式如下：

| 描述        | 长度   |
| :-------- | :--- |
| 数据块内容长度   | 4 字节 |
| 数据块类型     | 4 字节 |
| 数据块内容     | 不定字节 |
| crc 冗余校验码 | 4 字节 |

这样我们就可以轻易的指导当前数据块的长度了，即`数据块内容长度 + 12 字节`，用代码实现如下：

```javascript
// 读取32位无符号整型数
function readInt32(buffer, offset) {
    offset = offset || 0;
    return (
        (buffer[offset] << 24) +
        (buffer[offset + 1] << 16) +
        (buffer[offset + 2] << 8) +
        (buffer[offset + 3] << 0)
    );
}
let length = readInt32(readBytes(4)); // 数据块内容长度
let type = readBytes(4); // 数据块类型
let chunkData = readBytes(length); // 数据块内容
let crc = readBytes(4); // crc冗余校验码
```

这里的 crc 冗余校验码在我们解码过程中用不到，所以这里不做详解。除此之外，数据块内容长度和数据块内容好解释，不过数据块类型有何作用呢，这里我们先将这个 `type` 转成字符串类型：

```javascript
// 将buffer数组转为字符串
function bufferToString(buffer) {
    let 
```


<!-- {% endraw %} - for jekyll -->