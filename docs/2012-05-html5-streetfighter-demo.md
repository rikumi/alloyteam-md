---
title: HTML5 街头霸王游戏 (开放源码)
date: 2012-05-29
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2012/05/html5-streetfighter-demo/
---

<!-- {% raw %} - for jekyll -->

**[![](http://www.alloyteam.com/wp-content/uploads/2012/05/未命名1.jpg "未命名")](http://www.alloyteam.com/wp-content/uploads/2012/05/未命名1.jpg)**

-   试玩地址:  <http://alloyteam.github.com/StreetFighter/>
-   下载地址: <https://github.com/AlloyTeam/StreetFighter>

**主机控制键:**

-   **移动:** W: 上，D: 前，A: 后，S：下
-   **攻击:** J: 轻拳，K: 重拳，U: 轻腿，I: 重腿
-   **特殊技能:** 下→前→拳：波动拳，下→后→腿：旋风腿，前→下→前→拳：升龙拳

**副机（小键盘）:**

-   移动: ↑: 上，←: 前，→: 后，↓：下
-   攻击: 1: 轻拳，2: 重拳，4: 轻腿，5: 重腿
-   特殊技能：下→前→拳：波动拳，下→后→腿：旋风腿，前→下→前→拳：升龙拳

**其他：  
**

-   按 F2 暂停游戏，1 键大战电脑 ai, 2 键双人对打.
-   如果控制不了，注意切换下输入法哈.

图片素材来自互联网，原作者 Random. 游戏版权归 CAPCOM 公司所有。欧洲杯之前加上 websocket 和 3D 音效.

## 开发过程介绍

大概是 1 个月前开始学习 HTML5, 就写了这样一个东东练手。不过说来惭愧，至今也只学会了 canvas 的 drawImage. 每天的业余时间不太固定，有时候一天能写三小时，有时候一天能写三分钟。代码也写的相当潦草。总的来说有点虎头蛇尾。本来准备找个时间再重构一下，突然发现失去了兴致，欧洲杯又马上开始了。对我来说，已经差不多达到练手的目的，所以还是罢了.

非常简单的记录一些实现思路。暂且不讨论 api. 一是因为 api 到处可以查阅，二是因为我确实只认识 drawImag. 本人技术也十分有限，请轻砸.

代码里只有几个 js 文件，每个文件的功能如下:

-   Class.js   创建类和对象.
-   Game.js   游戏入口文件.
-   Map.js    绘制地图.
-   Config.js  各种游戏人物动作打架挨打等等配置.
-   Interface.js 各种接口
-   Main.js    负责游戏逻辑
-   Ai.js      Ai
-   Timer.js   全局定时器
-   Class.js.

为毛要搞这样一个东西呢。保护原型，继承的时候修正 constructor 什么的， 反正现在不搞个 Class.create 都有点不太好意思. 

这里也借鉴了 prototype 框架里的一些思路。相对于 prototype 里的换汤不换药。这儿的 class.create 选择返回一个普通的 object 对象，有点像 jquery 里 $ 的搞法. 

这样可以自由的扩展 Class 的各种方法，而不用再搭理 Function 的原型。举个例子， Class.empty () 可以秒杀这个类生成的所有对象。比如现在正在设计一个飞机游戏。有个大招可以清除屏幕上的所有子弹和敌机。那么，哼哼.. 

因为 Class.create 返回的是一个普通的 object. 所以不能用 new Function 的方式生成对象。具体使用方法如下例.

```javascript
var Hero = Class.create( function( name ){
 
this.name =  name;
 
} , {
 
addSkill: function(  skill ){
 
.......
 
}
 
})
 
var hero1 = Hero.getInstance(  "半人马酋长"  );
 
hero1.addSkill(  "六级跳大"  );
 
var hero2 = Hero.getInstance(  "山岭巨人"  )
 
hero2.addSkill(  "六级跳大"  )
 
var hero3 = Hero.getInstance(  "黑暗游侠"  );
 
hero3.addSkill(  "六级跳大">"  );
```

## Timer.js

用 js 做动画，无非就是用 setInterval 或者 setTimeout 让图片的


<!-- {% endraw %} - for jekyll -->