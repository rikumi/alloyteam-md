---
title: CodeTank 坦克机器人开发教程
date: 2012-08-30
author: TAT.Cson
source_link: http://www.alloyteam.com/2012/08/codetank-development-tutorial/
---

[![](http://www.alloyteam.com/wp-content/uploads/2012/08/codetank-3.png "codetank-3")](http://www.alloyteam.com/wp-content/uploads/2012/08/codetank-3.png)

**一、坦克结构组成：**

坦克由三个基本部件组成：**主体，炮管和雷达**。

1.  **主体**：可进行移动或旋转动作。
2.  **炮管**：可进行旋转和开火动作，开火可控制子弹的能量范围。
3.  **雷达**：可进行旋转和探测敌人的动作。当坦克停止移动时，雷达会被关闭，玩家可以通过手动调用 scan 方法开启雷达。

雷达射线可以在界面的设置面板中设置是否开启，取消雷达射线显示可以得到更好的性能。

**二、坐标系**

codetank 的坐标系如下：

[![](http://www.alloyteam.com/wp-content/uploads/2012/08/zuobiao.jpg "zuobiao")](http://www.alloyteam.com/wp-content/uploads/2012/08/zuobiao.jpg)

 **三、坦克参数说明**

-   坦克，雷达，火炮旋转速度：6 度 / 帧。
-   坦克初始能量：100
-   坦克最大移动速度：8px / 帧（当坦克快完成指定位移时，会作一个减速运动）
-   火炮冷却速度：0.1 / 帧
-   火炮热度增加计算：3+（发射子弹的能量 / 5）
-   子弹能量范围：1-3
-   子弹速度：12px / 帧
-   坦克被击中能量损耗计算：4\*子弹能量，如果子弹能量大于 1，则再加上 2\*（子弹能量 - 1）的伤害
-   击中敌人获得的能量奖励：3\*子弹能量
-   撞墙能量损耗：速度值 / 2
-   撞击其他 robot 的能量损耗：6

**四、坦克的运动**

[![](http://www.alloyteam.com/wp-content/uploads/2012/07/codetank2.png "codetank2")](http://www.alloyteam.com/wp-content/uploads/2012/07/codetank2.png)

坦克的运动入口为 run 方法，该方法启动坦克的运动，例如我们可以使用如下代码使坦克在前进 50px 之后，雷达旋转 90 度：

```javascript
run:function(){
        this.say("运动入口run方法");
	this.ahead(50);//向前走100像素
	this.turnRadarLeft(90);//雷达向左转90度	
 
}
```

**[查看 demo](http://codetank.alloyteam.com/index.html?cmd=battle&param=instructor.runFunction "查看 demo")**

正如你们所看到的，坦克在 run 方法里的运动结束之后，就会停止。

如果我们想运动多次地执行，我们只需要一个 for 循环。例如下面的代码将使坦克进行三次的来回运动

```javascript
run:function(){
    for(var i=0;i
```

 **[查看 demo](http://codetank.alloyteam.com/index.html?cmd=battle&param=instructor.threeMove)**

有时候可能多次的循环运动还不足够，如果我们想让运动无限地循环执行，可以调用 robot 的 loop 方法，使坦克的行为无限循环。 以下代码使用 loop 方法，使坦克做不断做一个矩形的运动：

```javascript
run:function(){
	this.loop(function(){//循环执行
		this.say("矩形轨迹运动");
		this.ahead(100);//向前走100像素
		this.turnLeft(90);//向左转90度		
	});
}
```

**[查看 demo](http://codetank.alloyteam.com/index.html?cmd=battle&param=instructor.rectRun)**

**五、旋转运动**

由于坦克包括雷达，炮管，主体三个部分，默认情况下，炮管和雷达跟随坦克的旋转而进行旋转。

但是某些情况下，我们可能希望主体只产生独立的旋转，炮管和雷达不跟随主体产生旋转。因此 robot 提供三种方法让玩家使坦克作出理想的旋转运动：

```javascript
run:function(){
	this.setAdjustGunForRobotTurn(true);//炮管独立于坦克的旋转
	this.setAdjustRadarForGunTurn(true);//雷达独立于炮管的旋转
	this.setAdjustRadarForRobotTurn(true);//雷达独立于坦克的旋转
}
```

**[查看 demo](http://codetank.alloyteam.com/index.html?cmd=battle&param=instructor.turnTogether,instructor.indepentTurn)**

**六、动作完成的回调**

当一个动作完成之后，玩家可以指示 Robot 进行怎样的回调操作。

例如，我们可以使用下面的方法，利用回调函数改变坦克的运动轨迹：

```c
var dir=1;	
run:function(){
this.loop(function(){
            this.ahead(40*dir);
            this.turnLeft(90*dir,function(){
                dir*=-1;
            });
        })	
}
```

在上面的方法中，首先前进 40px 后转左 90 度，然后在旋转完成的回调函数中，把 dir 变量进行反向，那么 robot 在下一次的行动中，行动轨迹将会变成先后退 40px，再转右 90 度，周而复始。

**[查看 demo](http://codetank.alloyteam.com/index.html?cmd=battle&param=instructor.callback)**

**七、多个动作并行执行**

在上面的动作中，robot 必须先执行完一个动作，才能开始执行下一个动作，但是如果我们需要多个动作一起执行呢？

Robot 提供多动作同时执行的 API，形式为：setXXX。

例如如果我们需要 robot 进行一个圆周运动，那么我们就可以让前进和旋转的运动同时执行，首先调用 setAhead 和 setTurn 方法设置需要并行执行的两个行为：

    this.setAhead(10000);
    this.setTurn(36000);

当设置好并行执行的两个行为之后，我们就可以调用 execute 方法，同时执行之前订制的行为：

    this.execute();

这样 robot 就会进行一个圆周的运动。

**[查看 demo](http://codetank.alloyteam.com/index.html?cmd=battle&param=instructor.circle)**

需要注意的是，setXX 预设的行为并不一定通过 execute 方法来执行，任何会具有执行特性的方法都会触发之前预设的行为，例如，通过 turn 方法同样可以使之前预设的 ahead 值并行执行，robot 也会进行一个圆周运动：

    this.setAhead(10000);
    this.turn(36000);

**八、事件**

CodeTank 提供多个事件，常用的事件有 onScannedRobot，onHitWall 等，玩家在实现自己的坦克的时候，可以重写这些事件处理程序从而使自己的坦克具有更多个性化的行为。

**事件的优先级一览：**

1.  scannedRobot:10
2.  bulletMissed:60
3.  bulletHit:50
4.  hitWall:30
5.  bulletHitBullet:50
6.  hitByBullet:40,
7.  hitRobot:20
8.  death:100
9.  win:100
10. robotDeath:70

优先级高的事件会中断优先级低的事件。每个事件处理程序中的事件对象都具有某些特定的方法，获取处理该事件的时候需要访问的参数，例如：

```javascript
onHitByBullet:function(e){
	var enemyName=e.getName();//被子弹击中时，获取发射该子弹的敌人的名字
}
```

**九、雷达的特殊行为**

之前提到过，雷达会在坦克停止移动的时候自动停止扫描（停止移动的含义是：坦克的主体，雷达，炮管都停止移动和旋转）。因此如果想让坦克在停止移动的状态下启动扫描，可以调用坦克的 scan 方法：

    this.scan();

scan 方法有两种应用场景：

1. 在坦克停止移动的时候手动出发雷达的扫描，当此时雷达扫描到坦克，立刻进入 scannedRobot 事件处理程序。如果我们的坦克在扫描到敌人后停下来开火，此时雷达也会**停止扫描**，因此如果需要不断对敌人开火，我们就可以再次调用 scan，使扫描启动，坦克再次发现敌人并开火。

2. 中断并重新执行现在的 scanedRobot 处理程序。当手动调用 scan 方法时，如果再次出发了 scanedRobot 事件，此时会**中断**之前的 scanedRobot 事件，由头开始重新执行 scannedRobot 事件处理程序，例如：

```javascript
onScannedRobot:function(e){
	this.fire(1);
	this.scan();
	this.back(100);//这里将不会被执行到
}
```

**十、子弹能量与炮管热度**

调用 fire 方法可以向敌人开火，火力范围为 0-3，火力越大，对敌人的伤害越大，同时对自身的能量损耗也越大，另外，热量产生也越多（热量决定了射击的间隔，热量越大，炮管需要的冷却时间也越多）。

**热量损耗计算公式**： (3+(power/5)).toFixed(1);

**十一、射击技巧**

通常情况下，当我们使用雷达旋转扫描，一扫描到敌人的时候，就可以立刻开火：

```javascript
run:function(){
	this.turnGunRight(3600);
},
onScannedRobot:function(e){
	this.fire(1);
}
```

**[查看 demo](http://codetank.alloyteam.com/index.html?cmd=battle&param=instructor.notGoodFire,alloyteam.slient)**

但是我们会发现，这样的话坦克在发现敌人并射击之后，炮管会继续旋转，在旋转一周之后再探测到敌人并射击。每次射击都在旋转一周之后，因此效率是很低下的，我们可以改造下这个笨笨的坦克，在发现敌人的时候，停止旋转并一直射击：

```javascript
run:function(){
	this.turnGunRight(3600);
},
onScannedRobot:function(e){
	this.stopMove();
	this.fire(1);
	this.scan();//保证停止射击后马上再次启动雷达扫描
}
```

在这种情况下，如果敌人相距比较近，我们的坦克还是能顺利击中敌人的，但是如果敌人相距比较远，我们会发现，坦克每次射击都偏离了目标。

**[查看 demo](http://codetank.alloyteam.com/index.html?cmd=battle&param=instructor.notGoodFire2,alloyteam.slient)**

为什么会出现这样的情况呢？其实，在 codetank 里，scannedRobot 触发的条件并不是雷达的中心正对敌人的中心，而是敌人的中心在雷达的扫描范围内。因此，如果敌人的中心刚好在雷达扫描范围比较靠边的地方，此时开火就不能准确击中敌人了。

更好的方法是，在发现敌人之后，并不立刻射击，而是把炮管旋转一定角度，使其对准了敌人的中心，在进行射击。在 scannedRobot 的事件对象里，可以通过 getBearing 方法获取到探测到的敌人相对于坦克的角度：

```javascript
onScannedRobot:function(e){
	var angleToRobot=e.getBearing();//探测到的敌人相对于该坦克的角度
}
```

由于我们可以通过 getHeading () 获取到坦克自身的角度，getGunHeading 获取到炮管的角度，因此可以轻松计算出敌人相对于自身的角度为：

```javascript
var angleGunToTurn = angleToRobot + this.getHeading() - this.getGunHeading();
```

之后由于计算出的角度可能会超出-360-360 度的范围，并且我们总是需要选择最小的旋转轨迹进行炮管的旋转，因此修复这些角度之后得出的最终旋转角度为：

```javascript
var angleGunToTurn = angleToRobot + this.getHeading() - this.getGunHeading();
```

```c
if(angleGunToTurn>180){	//选择最小旋转轨迹
    angleGunToTurn=angleGunToTurn-360;
}
else if(angleGunToTurn
```

在炮管旋转该角度后再进行开火，命中率就大大增高了。

**[查看 demo](http://codetank.alloyteam.com/index.html?cmd=battle&param=instructor.goodFire,alloyteam.slient)**

**十二、游戏模式**

codeTank 提供 5 种游戏的模式，包括：

-   **开发模式：**适合于玩家调试自己的坦克，坦克数量不作限制。
-   **1v1\*\***模式：\*\* 坦克之间进行单挑的模式。
-   **10 人混战：**10 个坦克加入战场，彼此之间进行混战。
-   **二人对决：**两个战队，每个战队两辆坦克进行对决。
-   **战队对决：**两个战队，每个战队五辆坦克进行对决。

codeTank 支持坦克自由组队进行对战，队友之间可以相互发送信息进行彼此间的合作。

例如，坦克 A 在发现敌人之后把敌人的坐标告诉坦克 B，坦克 B 就可以和坦克 A 一起对敌人发动猛烈的攻击。  
**十三、团队作战**

团队成员之间可以进行合作，CodeTank 提供一些 API 让团队成员之间能够互相通信：

**1.isTeammate:**

判断某个坦克是否是队友。一般在团队作战的模式下，发现一个坦克，我们应该首先调用 isTeammate 方法判断坦克是否为队友，再决定是否开火。

**2.getTeammates:**

获取所有队友

**3.sendMessage:**

向一个或一组队友发送信息

**4.broadcastMessage:**

向所有队友发送信息

**十四、分享你的坦克**

CodeTank 和为坦克的分享提供接口，各位玩家可以把自己调教出来的坦克分享到微博中，其他玩家的坦克进行对战：

[![](http://www.alloyteam.com/wp-content/uploads/2012/08/P5-300x218.png "P5")](http://www.alloyteam.com/wp-content/uploads/2012/08/P5.png)

**十五、个性化行为**

Codetank 有一些比较个性化的行为，使游戏的吸引力和可玩性都得到了提高，以下主要介绍几个：

**1.say 方法，会说话的坦克**

玩家可以设置坦克在不同场景下所说的话，说话的内容和对话的颜色都由玩家自定义，使坦克看起来更人性化：

[![](http://www.alloyteam.com/wp-content/uploads/2012/08/p1.png "p1")](http://www.alloyteam.com/wp-content/uploads/2012/08/p1.png)

 **2.setUI 方法，多种 ui 更换**

玩家可以订制坦克的多种 ui 风格，为自己的坦克换装。codeTank 提供多种坦克 ui。

[![](http://www.alloyteam.com/wp-content/uploads/2012/08/p2-300x237.png "p2")](http://www.alloyteam.com/wp-content/uploads/2012/08/p2.png)

**3.onPaint 的自定义绘制**

如果提供的 UI 都没办法满足蛋疼的你，codeTank 还能为你的坦克提供一个自由绘制的画布，实现 onPaint 事件处理程序，你可以在自己的坦克上绘制上你想要的东东：

[![](http://www.alloyteam.com/wp-content/uploads/2012/08/p3.png "p3")](http://www.alloyteam.com/wp-content/uploads/2012/08/p3.png)

**4. 战场的订制：**

codeTank 为具有不同需求的玩家提供多种对战场的自定义设定，玩家可以根据自己的爱好订制适合自己的战场：

[![](http://www.alloyteam.com/wp-content/uploads/2012/08/p41-274x300.png "p4")](http://www.alloyteam.com/wp-content/uploads/2012/08/p41.png)

OK，还有更多的 API 和玩法就等待大家自己去发掘了，相信 codeTank 的 API 文档能成为你们的好帮手：

[CodeTank API 文档](http://codetank.alloyteam.com/doc/ "CodeTank API 文档")

**Enjoy yourself and your tank！**

## 参见

### 文档手册

-   [CodeTank 的帮助文档](http://codetank.alloyteam.com/help.html)
-   [CodeTank 的 API 文档](http://codetank.alloyteam.com/doc/)
-   [CodeTank 的 CheatSheet 速查表](http://codetank.alloyteam.com/doc/cheatsheet.html)

### 教程

-   [开始用的 CodeTank](http://codetank.alloyteam.com/help.html)
-   [CodeTank 坦克机器人开发教程](http://www.alloyteam.com/2012/08/codetank-development-tutorial/)

### 主页

-   [CodeTank 官方网站](http://codetank.alloyteam.com/)
-   CodeTank 坦克代码排名

### 新闻资讯

-   [CodeTank 智能代码坦克机器人 - 全世界 Javascript 程序员的游戏](http://www.alloyteam.com/2012/08/welcome-to-codetank/)
-   CodeTank 的微博：[腾讯微博 @CodeTank](http://t.qq.com/CodeTank)，[新浪微博 @CodeTank](http://www.weibo.com/CodeTank)