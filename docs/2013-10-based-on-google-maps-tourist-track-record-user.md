---
title: 基于 google 地图记录用户旅游轨迹
date: 2013-10-01
author: TAT.sheran
source_link: http://www.alloyteam.com/2013/10/based-on-google-maps-tourist-track-record-user/
---

<!-- {% raw %} - for jekyll -->

在参加飞跃马拉松的时候，小组的项目构思是基于移动社交网络做一个记录用户旅游轨迹和照片的 APP 应用。

即当用户在旅游过程中，手机会不间断的上报 GPS 坐标到服务器，服务器会保存所有坐标到数据库，然后用户打开自己的旅游记录后，我们会在手机上创建一个全屏的地图，通过服务器 CGI 获取所有 GPS 的坐标点，然后通过这些坐标点绘制出一条线。

同时，我们还可以在地图上打上一些锚点来记录用户的兴趣点，如发表心情、发表旅游的所见所闻、发表随手拍等等。点击锚点还会出现一个气泡，便可以查看相应的信息，[点击查看 demo](http://sheranli.com/wp-content/uploads/2013/10/map/)。如下图所示：

[![](http://www.alloyteam.com/wp-content/uploads/2013/10/1.png "1")](http://www.alloyteam.com/wp-content/uploads/2013/10/1.png)

**技术细节简介**

-   上面的界面展示效果都是基于 HTML CSS JS 的，这样的好处是不需要关心手机硬件和操作系统差异，毕竟现在几乎所有的操作系统都支持 HTML5 标准。
-   在此次项目中我使用的 JQ1.9.1, 主要用来简化 JS 的书写和兼容 PC。
-   再就是[Google Maps API 3v](https://developers.google.com/maps/documentation/javascript/tutorial) ，这是谷歌最新的地图 API，使用起来非常简单，文档和示例也非常多。

接下来我们看看如何通过以上技术**Step by Step**构建这个用户轨迹和兴趣点展示页面。这里主要是基于 PC 端的页面介绍，移动端的兼容会在后面具体说明。

# Step1 创建 Google Map

[![](http://www.alloyteam.com/wp-content/uploads/2013/10/2.png "2")](http://www.alloyteam.com/wp-content/uploads/2013/10/2.png)

如上图先创建一个地图：包括初始化配置（mapOptions），和 New 一个 Google Map 对象传入我们需要渲染的 DIV 元素。下面是参数解释：

zoom 是打开地图的放大倍数，放大倍数大概在 1-13 之间，有些地方没法达到 10 以上的倍数；

center 是初始化中心点坐标；

mapTypeId 是采用的地图类型，比如公路地图还是卫星地图；

mapTypeControl、panControl、zoomControl 、streetViewControl 这些都是我们打开默认的谷歌地图的时候左边浮动显示的那些操作工具，比如地图类型控制器，地图移动控制器，地图倍数控制器，街区查询控制器，在这个项目中不需要这些控制器，所以全部给它设置的 false 关闭了。最后运行效果如下所示：

[![](http://www.alloyteam.com/wp-content/uploads/2013/10/3.png "3")](http://www.alloyteam.com/wp-content/uploads/2013/10/3.png)

根据我们传入的初始化参数，大概的中心点就是中国的恩施，放大倍数刚刚好浏览城市省份。接下来我们看看如何在这个地图上画出一条旅游路线和放置一些锚点。

# Step2 计算轨迹和放置锚点

[![](http://www.alloyteam.com/wp-content/uploads/2013/10/4.png "4")](http://www.alloyteam.com/wp-content/uploads/2013/10/4.png)

如上代码所示：假设 data 是我们从服务器那儿获取的一个 GPS 坐标数组。

1、首先，我们创建一个经纬度范围对象，将这些点都放到这个对象中去；

2、然后再放到一个 coordinates 数组中；

3、我们可以用 Polyline 对象和这些 GPS 数组在地图上画一条线，再通过经纬度范围对象计算所有点的中心点坐标和一个合适的放大倍数；

4、线画完后，我们可以通过谷歌提供 Marker 对象将一个 GPS 锚点放到地图上去，这个锚点也是用户发表的状态的一个兴趣点。

用户想看哪一个兴趣的内容只需要点击或则触摸一下这个锚点即可冒出一个气泡信息，如下图所示，这个跟 iPhone 的相册地图是类似

#   [![](http://www.alloyteam.com/wp-content/uploads/2013/10/m1.jpg "m1")](http://www.alloyteam.com/wp-content/uploads/2013/10/m1.jpg)

# Step3 气泡展示：

在这里由于谷歌 API 没有提供跟业务相关的气泡类，所以这里的气泡是自定义的，大概的思路就是一个绝对定位的 DIV 对象，然后通过谷歌的 API 将坐标换算成整个地图 DIV 的 X 坐标和 Y 坐标，由于自定义代码比较长所以，所以在此不详细说明，具体代码可以查看 demo 里的 directions.js 文件。我们直接运行这些代码，效果如下图所示：

[![](http://www.alloyteam.com/wp-content/uploads/2013/10/5.jpg "5")](http://www.alloyteam.com/wp-content/uploads/2013/10/5.jpg)[![](http://www.alloyteam.com/wp-content/uploads/2013/10/8.jpg "8")](http://www.alloyteam.com/wp-content/uploads/2013/10/8.jpg)

**step4 移动端优化**

移动设备上的幻灯片一般是人机交互的，也就是用户通过手指来主动或半自动的通知幻灯片是否切换，这个时候我们就用到了 touchstart 、touchmove、 touchend 三个事件，当发生 touchstart 的时候我们需要记录开始坐标，然后用户在不停的滑动的时候 touchmove 时间会不间断地触发，这个时候再次通过事件的坐标计算图片容器的位置，当滑动结束后 touchend 事件会被触发，这个时候整个用户操作过程结束，主要代码如下所示：

[![](http://www.alloyteam.com/wp-content/uploads/2013/10/9.png "9")](http://www.alloyteam.com/wp-content/uploads/2013/10/9.png)

当然这个过程虽然很简单，但是算法还是比较复杂的，例如我们用 iPhone 相册的时候，会出现以下几种情形：

1、触摸时间如果非常短，不管滑动距离有多长，图片都会被切换到下一张，

2、如果时间比较缓慢，触摸的距离如果小于屏幕宽度的一半，图片则会回归初始位置。

3、如果大于屏幕宽度的一般，则自动滑动到下一张。

4、如果当前图片是第一张或则最后一张的时候。向上或则向下滑动其实是没图片的，iPhone 的相册里的效果是发生了阻尼，也就是说，不管你怎么滑都不会滑动超过屏幕的一半并且最终都会归位。

[![](http://www.alloyteam.com/wp-content/uploads/2013/10/10.png "10")](http://www.alloyteam.com/wp-content/uploads/2013/10/10.png)

除了滑动功能，通过 touchstart 、touchmove、 touchend 也是可以实现多点触摸，判断用户操作是浏览下一张图片还是放大缩小图片的。这次产品中由于时间比较紧，所以除了多点触摸，以上 iPhone 相册的功能全部都在 WEB 端实现了。

以上就是基于 google 地图记录用户旅游轨迹 WEB 端整个过程了，谢谢大家阅读，祝大家国庆快乐！

<!-- {% endraw %} - for jekyll -->