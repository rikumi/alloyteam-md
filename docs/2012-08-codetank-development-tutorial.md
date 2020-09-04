---
title: CodeTank 坦克机器人开发教程
date: 2012-08-30
author: TAT.Cson
source_link: http://www.alloyteam.com/2012/08/codetank-development-tutorial/
---

<!-- {% raw %} - for jekyll -->

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


<!-- {% endraw %} - for jekyll -->