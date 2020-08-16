---
title: UA 的秘密
date: 2015-10-31
author: TAT.finlay
source_link: http://www.alloyteam.com/2015/10/uas-secret/
---

<!-- {% raw %} - for jekyll -->

UA 的秘密

userAgent, 这种大众脸，大家一定不陌生，平时似乎没什么用.  
但是当我们需要去了解外网用户时，就会发现，非常有意义。  
如果一个用户向你投诉，这个时候。  
需要第一时间拿到用户环境去分析问题，于是 ua 就能派上用场了

* * *

请看下面这条 ua 信息:

    Mozilla/5.0 (Linux; U; Android 5.1.1; zh-cn; SCL-TL00H Build/HonorSCL-TL00H) AppleWebKit/533.1 (KHTML, like Gecko)Version/4.0 MQQBrowser/5.4 TBS/025477 Mobile Safari/533.1lolapp/3.9.0.1260 lolappcpu/armeabi-v7a

扫一眼，能看出多少信息量呢，在说明之前，我们先看看官方文档吧.  
下面是谷歌开发者上关于 ua 的格式说明

WebView on Android  

* * *

The Android 4.4 (KitKat) [Chromium-based WebView](https://developer.chrome.com/multidevice/webview/overview) adds **Chrome/\_version\_** to the user agent string.

Old WebView UA:

    Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, likeGecko) Version/4.0 Safari/534.30

**WebView UA in KitKat to Lollipop**

```html
Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/_BuildID_) AppleWebKit/537.36 (KHTML,like Gecko) Version/4.0 <strong>Chrome/30.0.0.0 Mobile</strong> Safari/537.36
```

<https://developer.chrome.com/multidevice/user-agent>

大部分厂商，实现的 ua 描述都和以上一样样，但且看下方安卓 webview 设置 ua 的 api 描述

#### public abstract void setUserAgentString (String ua)

Added in API level 3

Sets the WebView's user-agent string. If the string is null or empty, the system default value will be used. Note that starting from KITKAT Android version, changing the user-agent while loading a web page causes WebView to initiate loading once again.

##### Parameters

<table><tbody><tr><th>ua</th><td>new user-agent string</td></tr></tbody></table>

调用此方法，可以随意设置自己的个性 ua.

所以也有些个性厂商出现，例如下方把自己的厂商品牌放最前面.. 这种可分析度就不太高，不过幸好量并不大

    ZTE U985_TD/1.0 Linux/3.1.10 Android/4.0 Release/8.1.2012 Browser/AppleWebKit534.30 V1_AND_SQ_5.4.0_218_YYB_D QQ/5.4.1.2395 NetType/3G

然后，我们再回头看看开头的 ua 上包含了多少信息:

大致扫一眼，我会知道，这个人是中文安卓 5.1.1 (Android 5.1.1, zh-cn), 机型是华为荣耀 SCL-TL00H (Build/HonorSCL-TL00H), 这些是约定中可看出的数据

再看后面的信息. MQQBrowser/5.4 表示是 QQ 浏览器，版本 5.4, Moblie 后面则可以看出  
Safari/533.1lolapp/3.9.0.1260 这是 LOLapp 大概是掌上英雄联盟？/ 软件版本   
lolappcpu/armeabi-v7a 然后是设备 CPU 类型，armeabi-v7a;

因为是自定义的，所以每个不同的 app 在 ua 上带的信息量大小是不同的。再来看一个

Mozilla/5.0 (Linux; U; Android 4.1.1; zh-cn; MI 2S Build/JRO03L) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 V1_AND_SQ_5.9.1_272_YYB_D QQ/5.9.1.2535 NetType/WIFI WebP/0.3.1 Pixel/720

这个，可以看出基本信息外，能知道，用户是在用 WIFI 上网 NetType/WIFI , 且屏幕分辨率是 Pixel/720，使用的软件是应用宝 V1_AND_SQ_5.9.1_272_YYB_D, 机型百度一下 JRO03L，发现是小米 2s..

好了，基本结构已经介绍完了，接下来看下如何用代码将所需内容提取出来

* * *

```javascript
/**
 * [一个非常简版的ua分析器]
 */
(function(){
    /**
     * [plate_reg description]
     * @type {RegExp}
     * 
     * 安卓和IOS的版本判断，
     * 安卓的版本分割用的点","IOS都用的"_“
     * 可以很好的区分平台
     */
    function parseUa( ua ){
        var ua_array = ua.split('Mobile') ,
            result = [“平台信息:”] ,
            common = ua_array[0] ,
            apps = ua_array[1] ,
            tmp_data = [] ,
            properkey = "" ,
            app_reg = /IPadQQ\/[^\s]*|MQQBrowser\/[^\s]*|qqnews\/[^\s]*|QQJSSDK\/[^\s]*|Qzone\/[^\s]*|QZONEJSSDK\/[^\s]*|QQ\/[^\s]*|NetType\/[^\s]*|Pixel\/[^\s]*|MicroMessenger\/[^\s]*|(lol)appcpu\/[^\s]*|[^\s]*(YYB)[^\s]*|QQHD/g ,
            plate_reg = /Android\s[^;]+|[a-z]{2}-[a-z]{2}|Build\/[^\)]*|\d_\d_\d|iPad|iPhone|iPod/g ,
            /**
             * [app_map description]
             * @type {Object}
             * 需要做解释和检测的，appua信息
             */
            app_map = {
                IPadQQ : "IPadQQ" ,
                MQQBrowser : "QQ浏览器" ,
                qqnews : "腾讯新闻" ,
                QQJSSDK : "QJS" ,
                Qzone : "Qzone" ,
                QZONEJSSDK : "QZONEJSSDK" ,
                QQ : "QQ" ,
                MicroMessenger : "微信" ,
                YYB : "应用宝" ,
                lol : "掌上英雄联盟"
            } ,
            common_map = {
                Android : "安卓" ,
            };
            while( tmp_data = plate_reg.exec( common ) ){
                result.push( tmp_data[0] );
            }
            result.push("应用信息:");
            while( tmp_data = app_reg.exec( apps ) ){
                properkey = tmp_data[1] || tmp_data[0] ;
                result.push( app_map[properkey] || properkey );
            }
            return result.join(' ');
    }    
    var format_str = parseUa( 'Mozilla/5.0 (Linux; U; Android 5.1.1; zh-cn; SCL-TL00H Build/HonorSCL-TL00H) AppleWebKit/533.1 (KHTML, like Gecko)Version/4.0 MQQBrowser/5.4 TBS/025477 Mobile Safari/533.1lolapp/3.9.0.1260 lolappcpu/armeabi-v7a' );
    console.log( format_str );
})();
```


<!-- {% endraw %} - for jekyll -->