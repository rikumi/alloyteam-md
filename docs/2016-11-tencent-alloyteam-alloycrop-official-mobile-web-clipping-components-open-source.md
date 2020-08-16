---
title: 腾讯 AlloyTeam 移动 Web 裁剪组件 AlloyCrop 正式开源
date: 2016-11-21
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/11/tencent-alloyteam-alloycrop-official-mobile-web-clipping-components-open-source/
---

简介  

* * *

裁剪图片的应用场景有头像编辑、图像编辑，在移动端要配合手势以及进行触摸反馈来进行变形以确认用户的选区进行裁剪。AlloyCrop 就是专注于裁剪图像的组件，目前服务于 QQ 相关的 Web 业务，今日正式对外开源。

传送门  

* * *

Github 地址：<https://github.com/AlloyTeam/AlloyFinger/tree/master/alloy_crop>

在线 Demo 演示:  
![](http://images2015.cnblogs.com/blog/105416/201611/105416-20161117111050545-396487242.png)

项目截图  

* * *

![](http://images2015.cnblogs.com/blog/105416/201611/105416-20161117111104279-1013796781.png) ![](http://images2015.cnblogs.com/blog/105416/201611/105416-20161117111127857-178909467.png)

![](http://images2015.cnblogs.com/blog/105416/201611/105416-20161117111133623-58070903.png) ![](http://images2015.cnblogs.com/blog/105416/201611/105416-20161117111137904-2054286801.png)

这里需要注意的是，圆形裁剪出的图片其实是正方形的，这里可以通过 CSS3 圆角边框自行设置为圆形的图片。

使用姿势  

* * *

```javascript
new AlloyCrop({
    image_src: "img src",
    circle: true, // optional parameters , the default value is false
    width: 200,
    height: 200,
    ok: function (base64, canvas) {},
    cancel: function () {},
    ok_text: "确认", // optional parameters , the default value is ok
    cancel_text: "取消", // optional parameters , the default value is cancel
});
```

-   image_src 为需要裁剪的图片的地址
-   circle 为裁剪组件的样式，为可选参数，默认值是 false。需要注意：当设置为 true 时候，width 必须等于 height。
-   width 为裁剪区域的宽
-   height 为裁剪区域的高
-   ok 为点击确认按钮的回调函数，并且可以拿到裁剪完成的 base64 和裁剪所用的 canvas
-   cancel 为点击取消按钮的回调函数
-   ok_text 为确认按钮的文本，可选。默认是 ok
-   cancel_text 为取消按钮的文本，可选。默认是 cancel

Q&A  

* * *

Q: 对比了下微信的头像裁剪，为什么基于 Web 的 AlloyCrop 比微信 Native 还要流畅？为什么？为什么？  
A: 基于 [transformjs](https://github.com/AlloyTeam/AlloyTouch/tree/master/transformjs) 和 [AlloyFinger](https://github.com/AlloyTeam/AlloyFinger) 打造的 AlloyCrop 必须流畅啊！  
这里猜测下（因为看不到微信裁剪的源码），微信头像裁剪走的是软绘，[transformjs](https://github.com/AlloyTeam/AlloyTouch/tree/master/transformjs) 走的是硬绘。

Q: 兼容性如何  
A: 支持 touchstart、touchmove、touchend、touchcancel 以及 CSS3 transform 的设备的浏览器便可运行 AlloyCrop.... 不一一列举..

Q: [transformjs](https://github.com/AlloyTeam/AlloyTouch/tree/master/transformjs)+[AlloyFinger](https://github.com/AlloyTeam/AlloyFinger)+ AlloyCrop 一共不到 600 行？为什么体积这么小？  
A: 腾讯手 Q 内大量的 web 都会去不断地从各个维度进行性能优化。框架类库尺寸的大小就是其中很重要的一个维度，小文件明显加载更快，解析也更快，这是很直接的优化手段。100 行代码能解决的问题绝对不会用 1000 行代码去解决。所以 Hammerjs 被我们抛弃了，各种 CSS3 的 js 库也被我们放弃。使用更加精简的、抽象层次更高的 [transformjs](https://github.com/AlloyTeam/AlloyTouch/tree/master/transformjs) 和 [AlloyFinger](https://github.com/AlloyTeam/AlloyFinger)。具体为何如此小，可以看看源码。

Q: 腾讯内部有哪些项目在用？  
A: 目前 AlloyCrop 主要是兴趣部落、QQ 群等 Web 业务在用，刚刚开源出来，只要有裁剪图片的地方都会用到。AlloyFinger 和 transformjs 拥有大量的项目在使用，包括公司外部的内部的以及国内的和国外的用户。

你值得拥有  

* * *

Github 地址：<https://github.com/AlloyTeam/AlloyFinger/tree/master/alloy_crop>

欢迎使用！