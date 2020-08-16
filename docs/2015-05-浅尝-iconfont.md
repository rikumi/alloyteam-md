---
title: 浅尝 iconfont
date: 2015-05-30
author: TAT.lqlongli
source_link: http://www.alloyteam.com/2015/05/%e6%b5%85%e5%b0%9diconfont/
---

## 1. iconfont 简介

什么是 iconfont？正如字面意思，就是图标字体，下面我给大家慢慢道来

web 页面包含什么元素？

-   文字
    -   链接
-   流媒体
    -   视频
    -   音频
-   图片
    -   背景图（大）
    -   插图（中，例如照片集，课程封面等）
    -   图标（小）

在所有包含 ui 的程序架构中，以上不同的 ui 元素在各种环境中都会遭遇到不同的问题，同时也都有与之对应的解决方案  
iconfont 就是一个解决【图标】问题的解决方案之一

### 1.1 图标问题

首先来看一下图标会有什么难题：

-   图标的大小会变，在两种情况下：
    -   每次 ui 改版，那些厌倦一成不变喜欢尝鲜的设计师们总是会淘气地改变图标大小，图标一般是点缀其他事物，例如文字，有时候设计会把某个图标从一段描述文字改成标题的点缀，这时候图标就需要变大
    -   自适应页面，整个页面的大小都在变，难道图标还能独善其身吗？
-   图标会经常换，这点还是那些设计师的问题，他们说不好看要换，作为开发我们还能说什么？
-   图标自身也会变，“来把那个图标改成红色吧，鲜艳点！”，“那个谁，把那个图标的底色改成蓝色吧～”，“…”

> 背景图和插图一般不会有这些问题，他们偏向于主体内容而不是点缀，一般不会改变。背景图一般是平铺，插图一般也是定宽，所以大小也不怎么需要改变。

### 1.2 图标解决方案

图标的解决方案有：

-   使用 png 图片，这是最传统的方案，兼容性最好，使用方面基本不会有技术问题。但是它不够方便，主要有以下两个问题：
    -   只要图标稍有改动都必须换新的图片，即使只是换个颜色或者透明度
    -   图标大小改变问题，不管是改图标还是需要自适应。使用大图片会造成两个问题：缩放效率和大图流量浪费加载慢
-   使用 svg 图片可以很好的解决图片大小的问题，但是兼容性是这个解决方案的致命问题，svg 不兼容 IE6~8，svg 不兼容 Android2.3
-   css，对于一些简单的图标，比如箭头，叉叉等，可以使用 css 来绘制而成，这也是现在移动端经常使用的方式，毕竟移动端对 css3 兼容性较好，但是利用 css 绘制的图片的问题是不能支持自适应，自适应的 css 会出现小数点，图标本身就是小的，所以当位置相差 1px 看起来都会很明显

### 1.3 iconfont 解决方案

iconfont 是图标的另一种解决方案，它是把一些简单的图标制作成字体，然后让图标变成和字体一样使用  
iconfont 有以下优点：

-   字体是矢量的，所以可以随意改变大小
-   因为它是字体，所以所有字体的 css 都可以使用，比如 font-size，color，background，opacity 等
-   iconfont 的制作也很简单，现在有很多线上制作 iconfont 的站点，只要上传 svg 的图标设计稿，就能线上生成 iconfont 字体文件，而且连使用代码都直接生成
-   iconfont 没有兼容性问题，IE6，Android2.3 都能够兼容

## 2. 使用 iconfont

虽然使用 iconfont 没有图片那么简单，但也没有想象中那么难，下面来看看怎么使用 iconfont  
首先，你需要制作 iconfont，现在有许多 iconfont 的站点，比如 [fontello](http://fontello.com//)  
我们随便选择一个图标：

![](http://7tszky.com1.z0.glb.clouddn.com/Flo7u1DAq0VFcHwnfu_QlQoM0Epl)

然后我们可以自定义字码：

![](http://7tszky.com1.z0.glb.clouddn.com/Fgeg4HBkDz815c_2r2FIxMPKBpxE)

最后我们就可以下载字体文件了：

![](http://7tszky.com1.z0.glb.clouddn.com/FmGzZ5YwNqynK1tJR-_TbycOuwkD)

下载完，解压出来，我们可以看到有 demo，有字体文件，也有使用代码：

![](http://7tszky.com1.z0.glb.clouddn.com/Fqs792r3qssROy1c2QtR7y6vajxL)

可以看到使用代码里面已经把各种兼容性考虑到了：

![](http://7tszky.com1.z0.glb.clouddn.com/FoNdMprATY9F2bCyn2911XU0wI7Q)

使用代码也给到，注意使用类名也是可以在站点中自定义的：

![](http://7tszky.com1.z0.glb.clouddn.com/Fhi4BThAVQ9n6cXWY-RMZJoS-jge)

另外注意的是，字体文件也是可以内链的，在 fontello-embedded.css 文件里面：

![](http://7tszky.com1.z0.glb.clouddn.com/FgrRPDTxbmVvaO6wC49UCzwH9Nug)

基本上，利用提供的代码，基本我们就可以完全兼容的使用 iconfont，下面介绍移动端使用 iconfont，在移动端只需要如下代码：

![](http://7tszky.com1.z0.glb.clouddn.com/FviwapxBkqlzU7DCbGz_HvNxt65A)

在移动端，只需要 truetype 类型

效果如下：

![](http://7tszky.com1.z0.glb.clouddn.com/FtWV1rLfDYydLkstcPcwkUPvXEGo)

使用 iconfont，我们可以应用许多字体样式，现在我们改变一下样式：

![](http://7tszky.com1.z0.glb.clouddn.com/FjimHjm93CdICkEuGKKscaDi5lPL)

效果如下：

![](http://7tszky.com1.z0.glb.clouddn.com/FpmHfwUpneMoW1lHWMb3xRdQhzFn)

可以发现，改变一个图标的颜色，背景色，大小都是非常方便的一件事

另一方面，当需要改一个图标的时候，我们可以在制作 iconfont 的时候，替换掉一个图标即可，使用的类名和字码都是可以定制的，这样就可以在不用修改业务使用代码的情况下，只需要替换掉内链的字体代码就可以完成替换图标的工作

> 以上代码经过实机测试，兼容 IOS4，Android2.3  
> 在移动端，iconfont 也可以使用外链形式，这里就不再赘述

## 3. 小结

在解决图标的问题上，不管是兼容性，灵活性，扩展性，iconfont 都是一个很好的解决方案

### 3.1 iconfont 优势

-   **灵活性**，改变图标的颜色，背景色，大小都非常简单
-   **兼容性**，兼容所有流行的浏览器，不仅 h5 可以使用 iconfont，app 也可以使用 iconfont，关于这方面可以查看其它线上分享
-   **扩展性**，替换图标很方便，新增图标也非常简单，也不需要考虑图标合并的问题，图片方案需要 css sprite
-   **高效性**，iconfont 有矢量特性，没有图片缩放的消耗高

> -   在使用上字体文件和普通的静态资源一样，既可以外链也可以内链，并且字体文件也可以使用 gzip 压缩
> -   在移动端上，可以只使用 truetype 类型，非常灵活小巧
> -   现在很多项目已经在使用 iconfont，先不说国外，比如国内，阿里巴巴各个平台（不仅 pc，h5，还有 app）已经全面使用 iconfont，并且阿里巴巴还搭建了一个线上 [iconfont 站点](http://www.iconfont.cn/)，这是一个很完善的站点，上面有阿里几个主要业务的图标资源库，也可以让用户自己制作图标，完善用户自身的图标库，让用户之间可以共享形成生态，同时站点的使用说明也非常完整，从图标设计，iconfont 制作和 iconfont 使用（里面包含了各个平台的使用方法）都有很完善的说明

### 3.2 iconfont 缺点

-   制作 iconfont 需要 svg 设计稿，对于开发来说没有图片来的方便
-   iconfont 有些特有的问题，详情可参考 [@font-face and performance](http://www.stevesouders.com/blog/2009/10/13/font-face-and-performance/)，不过许多问题在移动端是不存在的

### 3.3 结语

总的来说，iconfont 是可以应用的，特别是在移动端，如果不兼容 Android2.3，使用 svg 图片也是可以接受的，实际上制作 iconfont 也是需要 svg 资源的，所以两者其实很类似

另外，阿里巴巴主要业务都已经广泛应用 iconfont，并且还有成熟的线上站点支持，最起码在可行性方面是可以不用过多考虑的，虽然在使用 iconfont 的过程中可能会遇到许多问题，但是鉴于 iconfont 应用广泛的前提下，线上的资源也会非常丰富，应该不需要过多的担心

最后想说，我们业务是可以考虑使用的！如果要应用 iconfont，我们还需要设计们的支持！