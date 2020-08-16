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

用 js 做动画，无非就是用 setInterval 或者 setTimeout 让图片的 top 和 left, 或者图片本身的 src 在很短的时间内间隔变换。达到视觉的动画效果。跟动画片一样.

虽然屏幕上有很多精灵在同时运动。但在一个游戏中，只有也应该只有一个全局的定时器. 

1.  是从性能出发.  setInterval 的开销相当不小.
2.  是为了统一管理，比如方便的实现暂停功能.

北京时间 X 点 X 分 X 秒 X 毫秒，东经 X 度北纬 X 度在发生什么。整个世界就是这样组成.

定时器从游戏开始一直在不停执行，像地铁环线。每隔 1 小时回到起点。也像我们自己，每隔 24 小时回到原点，周而复始. 

```javascript
var timer = Timer.add( function(){
 
alert (1)
 
})
 
timer.start();  //上车
 
timer.stop();  //下车
 
timer.slow( 1000 ) 地铁减速
```

## Interface.js

我之前写过几个小游戏，每个都搞了很多类在里面。比如坦克大战，子弹是一个类，移动是一个类。碰撞是一个类。坦克先继承碰撞类，再继承移动类。这样一来坦克既能碰撞也能移动。非常酷.

可是真的需要那么多类么。有种方式或许更轻巧敏捷，那就是接口. 

让精灵可以移动只需要 Spirit.interface ( 'Animate', Interfaces.Animate );

上帝创造生命的时候，没有让腔肠动物和环节动物实现眼睛的接口.

人类当然实现了眼睛的接口，但人类不是从眼睛继承来的.

接口在未被声明之前，只是一个普通的函数，没有构造器，没有 prototype. 基本不占内存开销. 

对于每个宿主 (实现者) 来说，比如精灵 1 的 animate 和精灵 2 的 animate. 它们像两个平行的宇宙。每个都有各自的 scope. 局部变量. 

接口之间不赞成互相通信。但可以通过宿主来通信。就像人类实现了耳朵接口和嘴巴接口. 

耳朵听到声音先把信息报告给大脑。大脑再控制嘴巴说话。但耳朵和嘴巴是不应该长到一起的。这样不至于耳朵坏了的时候要修理嘴巴。其实就是三个字，要解耦！

Intanfances 里面的主要接口有这些:

Event: 一个简单的自定义事件机制，以便在 Animate,Frame 和碰撞检测的时候实现有限状态机.

1.  Lock: 动作锁.
2.  Queue: 一个简单队列机制. 
3.  StatusManage: 管理精灵的各种状态.
4.  Shadow: 精灵的阴影.
5.  Animate: 移动.
6.  SpiritFrames: 精灵的动画帧.
7.  KeyManage: 键盘管理器，收集玩家输入.
8.  Collision: 检测碰撞.
9.  AttackEffect: 攻击效果.
10. Audio: 音效.

## Main.js

游戏的具体逻辑都在里面，这个模块里一共实现了三个类。精灵类，战斗类，还有一个类有点别扭，它是波动拳类. - -!. 

整个游戏里也只有这 3 个类。不过因为逻辑较多。时间消耗基本都花在了这里。毕竟它不像贪食蛇，只要判断食物，墙壁和尾巴. 

## Ai.js

这个模块负责 Ai 所有逻辑，也是写的最轻松的一个模块。写好之后基本没改过.

对于电脑 ai 来讲，它明白对方的每一个动作。所以对每一组动作，都给 ai 设计了一组反应动作。比如你出旋风腿，电脑就出升龙拳. 

但这样的话就没人打的过电脑了，所以电脑的每次反应都有一组对的和一组错的，可以调节 ai 的难度，当 ai 越难的时候，随到正确那组动作的可能性越大.

写游戏和写普通的应用有点不一样的地方是，游戏需要更好的抽象出每个场景之间的共同点，或者找出他们的不同点。要尽量尽量少写 if else. 除非是逼不得已。当你写了一个 if, 就意味着可能要写 N 个 else if. 当逻辑越来越多的时候，维护这些 if 会异常痛苦.

街头霸王里面的动作有很多种，比如跳跃的时候不能移动，攻击的时候既不能跳跃也不能移动，跌倒的时候既不能跳跃也不能攻击也不能移动。死亡之后啥也干不了。那么怎么处理这些逻辑呢。想想如果是写这样的代码.

```c
If ( isJump ){
 
If ( move ) return false;
 
}else if( isAttack ){
 
If ( move || jump ) return false;
 
}else if ( fall_down ){
 
If ( move || jump || attack ) return false;
 
}...
```

游戏里的具体逻辑比这复杂的多，我也想不到得写多少个 if else, if else. 闭上眼睛就是 if else.

现在我是这样实现的。给每种动作在配置文件里加一个锁。精灵在动的时候，总是被它锁住的。移动的锁是 0 级，跳跃是 1 级，攻击是 2 级。摔倒是 3 级. 

当要执行一个新的动作的时候，比如攻击的时候突然被踢倒。会先比较 2 个动作的锁的级别。如果后面动作的级别大于之前动作的级别。就会打破之前的锁，执行新的动作。反之会无视新的动作。比如攻击的时候移动和跳跃都是没用的.

**转载请注明原地址：**<http://www.alloyteam.com/2012/05/html5-streetfighter-demo/>


<!-- {% endraw %} - for jekyll -->