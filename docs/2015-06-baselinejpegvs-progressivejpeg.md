---
title: BaselineJPEGvs.ProgressiveJPEG
date: 2015-06-15
author: TAT.helondeng
source_link: http://www.alloyteam.com/2015/06/baselinejpegvs-progressivejpeg/
---

<!-- {% raw %} - for jekyll -->

JPEG 有两种存储格式：baseline 和 progressive。Baseline JPEG 会在数据可用时，`一行一行自上而下`显示。Progressive JPEG 会`先显示模糊图片，然后逐渐清晰`。

![01-02_baseline_vs_progressive](https://cloud.githubusercontent.com/assets/3880323/7693875/e38c96d2-fe0a-11e4-9fc9-5a116df51920.jpg)  

### 浏览器渲染

Progressive JPEG 在所有浏览器都会显示，这里的关注点是如何渲染。

![qq 20150518145212](https://cloud.githubusercontent.com/assets/3880323/7693874/df6d4236-fe0a-11e4-9c1a-d4e7fe93996e.png)

Chrome + Firefox + IE9 下 Progressive JPEG 加载很快。

### 对比

##### 用户体验

Progresssive JPEG 用户体验更好，用户从开始就知道图片长什么样子，对于弱网用户来说，尤其必要。

##### 文件大小

一般，`Progressive 比 Baseline 格式小几 KB`。参考[这里](http://yuiblog.com/blog/2008/12/05/imageopt-4/)  
**实验**  
随机从网上下载图片，剔除 4xx 和 5xx 错误后，剩余 10360 张图片，分别转化成 Baseline 格式 和 Progressive 格式。  
**结论**

-   大于 10K 的图片，Progressive 格式更小（in 94% of the cases）。
-   小于 10K 的图片，Baseline 格式更小（75%）。

实际测试结论（这里受限于机器性能，样本不大）：

![qq 20150518192002](https://cloud.githubusercontent.com/assets/3880323/7693877/fa0f1be6-fe0a-11e4-8ba1-b25717617f4e.png)

浏览器支持情况：  
![qq 20150525091646](https://cloud.githubusercontent.com/assets/3880323/7790545/dcfc5c2c-02be-11e5-911e-ece2af1c5e8e.png)  
即便在浏览器不支持的情况下，由于 Progressive 格式的图片比原图小，加载也会更快。

##### 性能

Progressive 比较耗 CPU， 对于移动设备来讲，这是一个顾虑，在低端机型上面可能不会支持 Progressive，但是随着硬件升级。这个问题会得到解决。

参考文献：  
<http://yuiblog.com/blog/2008/12/05/imageopt-4/>  
<http://calendar.perfplanet.com/2012/progressive-jpegs-a-new-best-practice/>

原文地址：  
<https://github.com/imweb/mobile/issues/4>


<!-- {% endraw %} - for jekyll -->