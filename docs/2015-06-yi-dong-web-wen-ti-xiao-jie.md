---
title: 移动 web 问题小结
date: 2015-06-14
author: TAT.tennylv
source_link: http://www.alloyteam.com/2015/06/yi-dong-web-wen-ti-xiao-jie/
---

<!-- {% raw %} - for jekyll -->

### **Meta 标签：**

```html
<meta
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;"
    name="viewport"
/>;
```

这个想必大家都知道，当页面在手机上显示时，增加这个 meta 可以让页面强制让文档的宽度与设备的宽度保持 1:1，并且文档最大的宽度比例是 1.0，且不允许用户点击屏幕放大浏览。

```c
<meta content="telephone=no" name="format-detection" />
<meta content="email=no" name="format-detection" />
```

这两个属性分别对 ios 上自动识别电话和 android 上自动识别邮箱做了限制。

### **获取滚动条的值：**

    window.scrollY  window.scrollX

桌面浏览器中想要获取滚动条的值是通过 document.scrollTop 和 document.scrollLeft 得到的，但在 iOS 中你会发现这两个属性是未定义的，为什么呢？因为在 iOS 中没有滚动条的概念，在 Android 中通过这两个属性可以正常获取到滚动条的值，那么在 iOS 中我们该如何获取滚动条的值呢？就是上面两个属性，但是事实证明 android 也支持这属性，所以索性都用 woindow.scroll.

### **禁止选择文本：**

    -webkit-user-select:none

禁止用户选择文本，ios 和 android 都支持

### 屏蔽阴影：

    -webkit-appearance:none

亲测，可以同时屏蔽输入框怪异的内阴影，解决 iOS 下无法修改按钮样式，测试还发现一个小问题就是，加了上面的属性后，iOS 下默认还是带有圆角的，不过可以使用 border-radius 属性修改。

### **css 之 border-box：**

```css
element{
        width: 100%;
        padding-left: 10px;
        box-sizing:border-box;
        -webkit-box-sizing:border-box;
        border: 1px solid blue;
}
```

那我想要一个元素 100% 显示，又必须有一个固定的 padding-left／padding-right，还有 1px 的边框，怎么办？这样编写代码必然导致出现横向滚动条，肿么办？要相信问题就是用来解决的。这时候伟大的 css3 为我们提供了 box-sizing 属性，对于这个属性的具体解释不做赘述（想深入了解的同学可以到 w3school 查看，要知道自己动手会更容易记忆）。让我们看看如何解决上面的问题：

### **css3 多文本换行：**

```css
p {
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
```

Webkit 支持一个名为 - webkit-line-clamp 的属性，参见[链接](http://developer.apple.com/safari/library/documentation/AppleApplications/Reference/SafariCSSRef/Articles/StandardCSSProperties.html#//apple_ref/doc/uid/TP30001266-UnsupportedProperties)，也就是说这个属性并不是标准的一部分，可能是 Webkit 内部使用的，或者被弃用的属性。需要注意的是 display 需要设置成 box，-webkit-line-clamp 表示需要显示几行。

### **Retina 屏幕高清图片：**


<!-- {% endraw %} - for jekyll -->