---
title: 手机上的位置传感器
date: 2015-08-31
author: TAT.sheran
source_link: http://www.alloyteam.com/2015/08/mobile-phone-location-on-the-sensor/
---

<!-- {% raw %} - for jekyll -->

位置传感器  

* * *

1 GPS 与基站定位

位置传感器通常主要指手机内部的 Global Positioning System (GPS) 模块，GPS 又称全球卫星定位系统，该系统包括太空中的 24 颗 GPS 卫星；地面上 1 个主控站、3 个数据注入站和 5 个监测站及作为用户端的 GPS 接收机。最少只需其中 3 颗卫星，就能迅速确定用户端在地球上所处的位置及海拔高度；所能收联接到的卫星数越多，解码出来的位置就越精确。

获取位置信息，核心在于获取经纬度坐标，继而在手机地图中标注出自身坐标，从而确定当前所处的位置。目前手机定位的方式有两种，一种是基于 GPS 的定位，一种是基于移动运营网的基站的定位。基于 GPS 的定位方式是利用手机上的 GPS 定位模块将自己的位置信号发送到定位后台来实现手机定位的。基站定位则是利用基站对手机的距离的测算距离来确定手机位置的。后者不需要手机具有 GPS 定位能力，但是精度很大程度依赖于基站的分布及覆盖范围的大小，有时误差会超过一公里。前者定位精度较高。

[![图片 1](http://www.alloyteam.com/wp-content/uploads/2015/08/图片1-300x225.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/08/图片1.jpg)  
\[图.1 ublox 生产的 GPS 模块]

实际应用中，设备位置信息的来源，除了 GPS 和基站定位，还包括通过 IP 地址、RFID、WIFI 和蓝牙 MAC 地址推断，以及用户主动输入。

2 Geolocation API

从安全性考虑，地理位置信息属于用户隐私，不恰当的暴露可能会为用户带来潜在的威胁。因此当浏览器需要获取设备信息时，必须获得用户主动确认：

[![图片 2](http://www.alloyteam.com/wp-content/uploads/2015/08/图片2-300x190.png)](http://www.alloyteam.com/wp-content/uploads/2015/08/图片2.png)  
\[图.2  请求位置弹框图]

浏览器在获得用户许可后，也允许用户取消许可，并提供给用户更新或者删除过往位置信息的能力。

我们依然是通过特性检测来判断：

```c
    if(navigator.geolocation) {
        // 支持返回地理位置信息
    }
```

地理位置接口提供了两个函数来获取用户的当前位置：getCurrentPosition、watchPosition。前者只获取一次设备位置信息，后者则是实时地获取设备位置信息，保持异步更新。

   2.1 getCurrentPosition

先看一个最基本的例子：

        function showMap(position) {
            alert('经度：' + data.coords.longitude + ' 纬度：' + data.coords.latitude);
        }

    navigator.geolocation.getCurrentPosition(showMap);

运行一下，位置询问框出现，确认后看到了弹出了经纬度信息，我们已经获取了一次当前设备的位置。

getCurrentPosion 的调用方式为 `getCurrentPosition(onSuccess, onError, options)`，其中 `onSuccess`（成功回调函数）是必要参数，另外两个都是可选参数。

成功获取时，API 返回一个包含地理位置信息的容器，包含两个属性 `coords`（坐标）和 `timestamp`（时间戳），其中 `coords` 包含经度、纬度、精确度（米）、海拔高度、移动速度等信息，可惜除了前三个数据必然有返回，后面的数据经常返回 null 无法使用。

有的时候也会获取位置失败，此时我们可以通过失败回调函数处理：

```go
    var onError = function(err){
        switch(err.code) {
            case err.TIMEOUT:
                // 超时
                break;
            case err.PERMISSION_DENIED:
                // 用户拒绝获取地理位置
                break;
            case err.POSITION_UNAVAILABLE:
                // 位置不能确定
                break;
            default:
        }
    };
```

至于第三个参数 `options`，则支持三个子参数：

1. `enableHighAccuracy`，是否启用高精度定位，当然，启用之后会延长定位时间，默认为 false;  
2. `timeout`，超时时间，如果在规定的时间内没获取到地理位置，则触发 `onError` 并带上超时错误码。默认不限时长；  
3. `maximumAge`，缓存时长，如果为 0 则不缓存获取到的位置每次都去获取最新，如果大于 0 则在缓存时间内不会再去进行定位而是返回缓存数据，默认为 0。

    2.2 watchPosition 和 clearWatch

`watchPosition` 的参数和 `getCurrentPosition` 一致，区别是 `watchPosition` 会在�


<!-- {% endraw %} - for jekyll -->