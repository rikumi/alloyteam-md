---
title: 腾讯编程马拉松优胜作品：HTML5 体感游戏《守护拉普达》
date: 2012-07-09
author: TAT.Kinvix
source_link: http://www.alloyteam.com/2012/07/the-tencent-programming-marathon-winning-entries-html5-somatosensory-game-guardian-of-lapu-da/
---

<!-- {% raw %} - for jekyll -->

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/070405gPc.jpg "title")

## **拉普达是什么？**

《守护拉普达》是一款基于 HTML5 的体感塔防游戏，是腾讯编程马拉松的优胜作品。  
拉普达（Laputa）是天空之城的意思。玩家以保护拉普达为目标，通过肢体运动控制准星杀死不断靠近总部的小怪。杀怪可以获取游戏积分，连杀或触发道具都能得到更多积分！分数最终会存入服务器，列入宇宙排名。

**演示视频**

## 实现原理

视频体感游戏的核心在于运动的捕获与识别，主要的问题是如何实现运动捕获算法。

关于运动捕方式有很多，于是就存在算法选型问题。我们先后实验过三种方式：色域跟踪、Mean shift、帧差。最终综合了一套方案。下面简单介绍下实现方案。

原理：分析连续关键帧间差异来确定运动区域。再通过运动特征系数加权，最终得到较为准确的坐标。  
优点：环境干扰相对较小，且无需特征录入。

**处理流程：**

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/0704150Zf.jpg "flow")

1. 通过浏览器 getUserMediaAPI 启动摄像头并获取视频流

2. 利用 canvas 转化图像数据格式

3. 利用帧差原理获取运动区域 (这里用到 ([grayscale](http://en.wikipedia.org/wiki/Grayscale) 公式)

灰度 = R\*.299+G\*.587+B\*.114;

我们预先设定了一个亮度敏感度值 sen = 15;

当 Math.abs（像素亮度 1 - 像素亮度 2）>sen 时，这个点将被纳入运动区域。

4、降噪

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/070416nKN.jpg "noise")

栅格化图像，判断每个栅格的运动点密度，排除低于设定值的栅格。这样就得到比较干净的运动区域。

5. 运动区域平衡分析

上一步返回的是坐标点阵群，游戏需要的是唯一坐标。数据需要进一步处理。经过观察发现运动点阵分布在画面的区间与动作目的有一定关联性。也就是以画面中心点为基准，判断运动点阵距离中心点距离。以距离为加权因素，越靠边缘因素值越大。最终得出唯一坐标。

6. 每个图像算法最终都会遇到性能问题

这里我们用到了 worker。关于 worker：[THE BASICS OF WEB WORKERS](http://www.html5rocks.com/en/tutorials/workers/basics/)

以上便是《守护拉普达》实现体感控制的基本原理。在比赛最后一刻我们还在不断优化算法，是一件很磨人的事情。不过结果还算令人满意，带走 3 个奖项 **杰出项目**、**优秀创新**、**优秀技术**。

PS:Demo 代码正在整理，体验地址会稍后放出。

团队靓照  
![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/070417v5o.jpg "IMG_1437")

《守护拉普达》已经入驻深圳腾讯形象店 - [@Image](http://e.t.qq.com/tx-image?pgv_ref=smart.0.0.tx-image)，欢迎前往体验。  
![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/07/0704181wK.jpg "photo_副本")

文 /benny

<!-- {% endraw %} - for jekyll -->