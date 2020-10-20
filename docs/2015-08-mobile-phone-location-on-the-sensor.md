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

`watchPosition` 的参数和 `getCurrentPosition` 一致，区别是 `watchPosition` 会在开始及每次用户位置发生变化的时候更新地理位置触发成功回调，这在导航类应用场景非常实用。我们可以调用 `clearWatch` 清除位置监视，如下示例： 

        function scrollMap(position) {
            // 实时获取位置变化
            alert('经度：' + data.coords.longitude + ' 纬度：' + data.coords.latitude);
        }
        var watchId = navigator.geolocation.watchPosition(scrollMap);
        function buttonClickHandler() {
          // 主动关闭位置更新
          navigator.geolocation.clearWatch(watchId);
        }

这就是浏览器提供的地理位置 API，使用它们我们的 web 页面就可以提供 LBS 服务及其他地理位置服务，变得更为强大。要注意的是获取地理位置可能会耗费一定时间，此时前台给用户一个等待反馈会提升用户体验，而实际应用场景中如何提升获取地理位置的精确度和效率，我们在后面的章节细讲。

####     2.3 兼容性

地理位置 API 被以下桌面浏览器支持：

\* IE 9+  
\* Firefox 3.5+  
\* Chrome 5+  
\* safari 5+  
\* Opera 16+

以及以下移动设备浏览器支持：

\* iOS Safari 3.2+  
\* Android Browser 2.1+  
\* Chrome for Android

\* Firefox for Android 38+

\* Opera mobile 12+

[![图片 3](http://www.alloyteam.com/wp-content/uploads/2015/08/图片3-300x132.png)](http://www.alloyteam.com/wp-content/uploads/2015/08/图片3.png)  
\[图 N.2.3  地理位置 API 支持情况]

3 案例：地理位置获取信息

首先我们创建一个 dom 节点

    &lt;div id="geoloc">&lt;/div>

判断浏览器支持 `Geolocation API` 后，通过参数的 corrds 属性就可以取到经纬度坐标了，如下

```javascript
   &lt;script>
    function getElem(id) {
        return typeof id === 'string' ? document.getElementById(id) : id;
    }
    
    function show_it(lat, lon) {
        var str = '您当前的位置，纬度：' + lat + '，经度：' + lon;
        getElem('geoloc').innerHTML = str;
    }
     
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {  
            show_it(position.coords.latitude, position.coords.longitude);  
        }, function(err) {
            getElem('geo_loc').innerHTML = err.code + "\n" + err.message;
        });
    } else {
        getElem('geo_loc').innerHTML = "您当前使用的浏览器不支持Geolocation服务";
    }
    &lt;/script>
```

下一步我们要引入一个谷歌地图来定位，这里需要引入谷歌地图的 API，如下

    &lt;script type="text/javascript" src="[http://maps.google.com/maps/api/js?sensor=false">&lt;/script>](http://maps.google.com/maps/api/js?sensor=false%22%3E%3C/script%3E)

接着对获取经纬度的函数做一个改造

```go
 &lt;script>
    function success(position) {
        var mapcanvas = document.createElement('div');
        mapcanvas.id = 'mapcanvas';
        mapcanvas.style.height = '400px';
        mapcanvas.style.width = '560px';
    
        getElem("map_canvas").appendChild(mapcanvas);
    
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); 
        var myOptions = {
            zoom: 15,
            center: latlng,
            mapTypeControl: false,
            navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
        var marker = new google.maps.Marker({
          position: latlng, 
          map: map, 
          title:"你在这里！"
        });
    }
     
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(success); 
    }
    &lt;/script>
```

如下图所示，我们已经获取到当前位置的地图坐标呈现

[![图片 4](http://www.alloyteam.com/wp-content/uploads/2015/08/图片4-300x167.png)](http://www.alloyteam.com/wp-content/uploads/2015/08/图片4.png)  
\[图 N.3 笔者当前坐标位置]

进一步地，根据地理位置坐标，通过公共 API 获取用户的  天气信息 –  周边新闻 –  热点资讯  等…  
如 QQ 会员的用户关怀，与天气结合，如果是阴雨天气，红毛小 Q 以拟人姿态提醒用户多带把伞；晴好高温天气可以提醒用户擦防晒液防紫外线等…

感谢大家阅读，同事感谢小伙伴 junda 对文章提出的专业建议！O (∩\_∩)O


<!-- {% endraw %} - for jekyll -->