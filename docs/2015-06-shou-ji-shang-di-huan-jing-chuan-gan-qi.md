---
title: 手机上的环境传感器
date: 2015-06-29
author: TAT.sheran
source_link: http://www.alloyteam.com/2015/06/shou-ji-shang-di-huan-jing-chuan-gan-qi/
---

<!-- {% raw %} - for jekyll -->

手机上的环境传感器，一般包括气压传感器、温度传感器、湿度传感器、光传感器、声音传感器和距离传感器等。气压传感器能通过气压测量，判断手机当前位置的海拔高度，能提高 GPS 定位的精度，在三星 Galaxy Nexus 上有配备；温度传感器一方面用来测量气温，判断当前环境是否舒适，一方面也能监测手机内部温度是否异常；而比较普遍的是光传感器和距离传感器，对智能手机来说几乎是标配，并且一般设计位于手机正面上方听筒附近位置。

**N.1.1 距离传感器和环境光传感器**

[![img1](http://www.alloyteam.com/wp-content/uploads/2015/06/img1.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/06/img1.jpg)

距离传感器由一个红外 LED 灯和红外辐射光线探测器构成。距离传感器位于手机的听筒附近的主要原因是，当手机靠近耳朵时，系统通过距离传感器知道用户在通电话，然后会关闭显示屏，防止用户因误操作影响通话。距离传感器利用 “飞行时间法” 的原理来检测与物体之间距离，它通过发射特别短的光脉冲，由被物体反射回来的时间计算而得。

手机的光传感器，即环境光传感器，能感知设备周围光线情况。手机操作系统利用光线传感器的数据，自动调节显示屏亮度 ———— 当环境亮度高时，显示屏亮度会相应调高；当环境亮度低时，显示屏亮度也会相应调低。自动亮度一方面保证了手机在不同环境中的屏幕阅读体验，一方面降低了电量损耗，最大限度地延长设备工作时间。

**N.1.2 Proximity API**  
Proximity API 是 W3C 规范中关于距离传感器的一个独立 API，为 web 开发者提供设备与物体之间的距离信息。基于设备的距离信息，我们能做的可不只是通话时熄灭屏幕，我可以在手机网页中播放音乐时，不需要触碰屏幕就能使音乐暂停，我也可以在手机网页游戏中，像玄幻魔术般控制角色的进退……

该 API 中定义了两个设备事件 `deviceproximity` 和 `userproximity`，前者提供设备与物体之间的距离信息，后者判断是否感应到有物体接近。我们先看看当前浏览器是否支持：

    if ('ondeviceproximity' in window) {
    // 支持返回距离信息
    }
     
    if ('onuserproximity' in window) {
    // 支持返回是否有物体靠近
    }

deviceproximity 事件提供三个属性：value，min 和 max。value 代表设备与设备前物体的距离，min 和 max 代表传感器能检测的距离范围，单位是厘米。

```javascript
if ("ondeviceproximity" in window) {
    window.addEventListener("deviceproximity", function (event) {
        proximityValue.innerHTML = event.value;
        proximityMax.innerHTML = event.max;
        proximityMin.innerHTML = event.min;
    });
}
```

userproximity 事件有一个属性：near。它是一个布尔值，代表是否有设备前方是否有物体靠近，默认是 false。它探测的范围也是 deviceproximity 的检测距离范围。

```javascript
if ("onuserproximity" in window) {
    window.addEventListener("userproximity", function (event) {
        inProximity.innerHTML = event.near;
    });
}
```

通过以上两个事件，我们能感知到设备与物体的距离信息，通过绑定网页元素的控制事件，可以实现网页上不触摸屏幕的手势交互。

**N.1.3 Ambient Light API**  
Ambient Light API，W3C 规范中关于环境光传感器的一个独立 API，为 web 开发者提供设备感应到的环境光强度的数值。该 API 最初提供了 2 个事件监听设备的环境光状况：`devicelight` 和 `lightlevel`。前者返回环境光强度的数值，使用勒克斯（lux）照度单位；后者描述当前环境光的强度等级 ———— 暗淡、正常和明亮。在最新的 W3C 规范中，已经移除了 `lightlevel` 事件，事实上，我们完全可以通过 `devicelight` 自己来定义光的强度等级。

```javascript
if ("ondevicelight" in window) {
    // 浏览器支持检测
    window.addEventListener("devicelight", function (event) {
        // 获取光强度数值
        lightValue.innerHTML = Math.round(event.value);
    });
}
```

devicelight 事件只有一个 value 属性，随着测试设备不同可能有不同的返回数值，范围从 0 到无穷大。基于这个环境光强度，我们可以在网页中做到自动切换夜间主题，尽力减缓网页阅读造成的用户眼睛疲劳。观察不同环境中该数值的变化，我们设定两个主题变化的分界点：50lux 和 10000lux，因此有：

// 根据数值变换网页主题

```javascript
if (event.value < 50) {
    document.body.className = "dark-theme";
} else if (event.value < 10000) {
    document.body.className = "classic-theme";
} else {
    document.body.className = "light-theme";
}
```

不仅如此，在网页游戏中，我们可以根据当前环境光强度，匹配不同的主题场景作为游戏背景，烘托环境氛围，强化游戏的现实代入感。

**N.1.4 兼容性**  
遗憾的是，目前桌面和移动浏览器中都仅有 firefox 支持 Proximity API 和 Ambient Light API，并且桌面版对 Ambient Light API 的支持只限于 Mac OS X 系统中。

[![图片 2](http://www.alloyteam.com/wp-content/uploads/2015/06/图片2.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/图片2.png)

_\[**图 N.**1**.**2_ _Proximity API**支持**情况]_

[![图片 3](http://www.alloyteam.com/wp-content/uploads/2015/06/图片3.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/图片3.png)

_\[**图 N.**1**.**3_ _Ambient Light API**支持**情况]_

感谢大家阅读，同事感谢小伙伴 junda 对文章提出的专业建议！O (∩\_∩)O

<!-- {% endraw %} - for jekyll -->