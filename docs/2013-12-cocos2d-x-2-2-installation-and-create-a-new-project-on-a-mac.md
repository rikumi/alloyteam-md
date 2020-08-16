---
title: Cocos2D-X2.2 在 Mac 上的安装与创建新工程
date: 2013-12-30
author: TAT.Minren
source_link: http://www.alloyteam.com/2013/12/cocos2d-x-2-2-installation-and-create-a-new-project-on-a-mac/
---

手边有一台 iMac，听说 cocos2d 比较流行就想尝试一下。

首先到官网看文档，<http://www.cocos2d-x.org/wiki>

看了 2 天，完全不知所云。我想再 mac 上开发 ios 版本的，结果大部分都是 android 相关的，或这 windows 平台的内容。先看看下载的安装包吧。

下载的 2.2 版本，里面真是程序猿风格，一篇文档说明都木有。既然文档没用就自己试吧。

进入 samples/Cpp/HelloCpp/pro.ios/ 目录找到一个 Xcode 的工程文件。双击打开，然后运行，居然没有报错，顺利打开模拟器，还能运行。

好吧，就算是这么简单，文档上也该说一下呀。

然后又运行了一下 SimpleGame，也成功了。

看了一下工程的结构，还是挺复杂的，里面引用了 cocos2dx 的工程，这倒是比较方便，有问题可以直接 track 到源代码。还可以看到各种宏定义，各种源代码。缺点是在同一时间只能打开一个工程，如果不把第一个工程关闭，第二个就会报引用错误。

接下来的问题是，这么复杂的工程自己怎么创建呢？官网上的文章又是语焉不详，搜索了一下找到一大堆适用于 cocos2d 2.0 甚至 1.x 的文章。各种创建模板的文章完全不适用。

后来用关键字 “cocos2dx 2.2 模板” 才找到靠谱的答案。原来 2.1.5 之后 cocos2d 的模板改用 python 生成了。详细说明看这个文章吧。<http://blog.csdn.net/u010229677/article/details/14016471>

接下来安装 python，安装时注意要在设置－安全性与隐私中打开未知开发者的限制。然后就 ok 了，也不用设置劳什子的环境变量，mac 就是爽呀。

然后按照上述文章在命令行中执行，就可以创建一个新的工程了。