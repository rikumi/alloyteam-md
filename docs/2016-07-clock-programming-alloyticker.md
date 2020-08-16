---
title: 时光倒流程序设计 - AlloyTicker
date: 2016-07-25
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/07/clock-programming-alloyticker/
---

熵与负熵  

* * *

熵遵循熵增原理，即无序非热能与热能之间的转换具有方向性。薛定谔说过：生命本质在于负熵。熵代表的是无序，负熵就是熵的对立，而负熵表示的则是有序。汲取负熵（米饭、面包、牛奶、鸡蛋），可以简单的理解为从外界吸收了物质或者能量之后，转化成负熵流，使系统的熵降低，人体变得更加有序。

那么一直吃饭为何还衰老？一日吃 6 餐行不行？答案是肯定不行。  
负熵流和熵增伴从出生到死亡一直在对抗，随着时间流逝，负熵流慢慢对抗不过熵增，人体组织体系结构越来越无序。越无序就越难以抵抗疾病，所以通常死亡不是熵增到无序而老死，而是熵值较大时，难以抵抗其他疾病而死亡。最终归于尘土、洒向大海（更加无序了）。  
所以：熵增加的方向就是时间的方向，时间不可逆，回到过去是不可能的，才有了 AlloyTicker - 让时光倒流成为可能….

Github: <https://github.com/AlloyTeam/AlloyTicker>  
Demo: <http://alloyteam.github.io/AlloyTicker/>

传统的动画和运动  

* * *

涉及到动画和运动才能和时间关联起来。这里做下分类：  
1. 精灵图动画：如利用精灵图实现人物跑、走等  
2. 积分运动：如粒子系统、子弹飞行等  
3. 缓动：如骨骼动画、弹出层特效、金币拾取等其他拥有起点、终点、时间和缓动函数的运动

精灵图动画  

* * *

![](http://www.alloyteam.com/wp-content/uploads/2016/07/at_ss.png)  
如上面的精灵图动画，当需要求出当前播放哪一帧的时候，通常按照下面这种方式计算：

```javascript
var index = Math.floor(dt / interval) % length;
```

其中 index 为当前求出的结果。  
dt 为过去了多长时间  
interval 每一帧的间隔时间  
length 为总共的帧数

精灵图动画可逆设计  

* * *

要实现精灵图动画可逆，必须对 dt 进行动态计算。dt 怎么计算？  
dt = 当前时间 - 开始时间  
即：

```javascript
var dt = currentTime - startTime;
var index = Math.floor(dt / interval) % length;
```

只需要把 currentTime 和 startTime 保存好方便 sprite 对象使用即可实现可逆。  
当然这里要做边界处理，即 dt 小于 0，代表播放时间还未开始，index 是没有对应的值。

积分运动  

* * *

![](http://www.alloyteam.com/wp-content/uploads/2016/07/at_b.png)  
传统的做法：

```c
this.vx += this.ax * dt;
this.vy += this.ay * dt;
this.x += this.vx* dt;
this.y += this.vy * dt;
```

即：  
速度是加速度在时间上的累加  
位移是速度在时间上的累加

积分运动可逆设计  

* * *

问题建模：根据起点位置（startX startY）、起始速度 (vx vy)、加速度 (ax ay)、开始时间 (startTime)、当前时间 (currentTime) 求当前位置 (x y)。

```c
var dt = this.currentTime - this.startTime;
var h_sqDt = dt * dt/2;
this.x = this.startX + this.vx * dt + this.ax * h_sqDt;
this.y = this.startY + this.vy * dt + this.ay * h_sqDt;
```

公式：  
![](http://www.alloyteam.com/wp-content/uploads/2016/07/at_ltx.gif)

缓动  

* * *

![](http://www.alloyteam.com/wp-content/uploads/2016/07/at_ease.png)

```c
this.dv = this.endValue - this.startVaule ;
var result = this.startVaule + this.dv * this.ease(dt / this.time);
```

其中 result 为当前求出的结果。  
endValue 为最终要运动到的结果  
startVaule 为开始运动的状态  
ease 为缓动函数  
time 为总时间

缓动可逆设计  

* * *

缓动天生就是支持可逆设计。只需计算好 dt 便可。

```javascript
var dt = currentTime - startTime;
```

当然还要处理一下边界情况，因为时间的流动性，dt 是可能大于 0 或者 dt 大于传入的总时间 this.time。  
当 dt 小于 0，即 result 等于 this.startVaule  
当 dt 大于总时间，即 result 等于 this.endVaule

精灵图动画 + 积分运动  

* * *

![](http://www.alloyteam.com/wp-content/uploads/2016/07/at_m2.png)  
![](http://www.alloyteam.com/wp-content/uploads/2016/07/al_ma.png)  
如上面的超级玛丽，不仅需要播放精灵图动画，还需要向右的积分运动。所以需要同时顾及两种状态：

```c
var dt = this.currentTime - this.startTime;
//计算关键帧索引的结果
if (dt < 0) {
    this.index = -1;
} else {
    this.index = Math.floor(dt / this.interval) % this.length;
}
//计算积分运动的结果
this.x = this.startX + this.vx * dt;
this.y = this.startY + this.vy * dt;
```

AlloyTicker  

* * *

是时候抽象出一个时间机器的 - AlloyTicker。

```javascript
var AlloyTicker = function () {
    this.interval = null;
    this.intervalTime = 16;
    this.tickIntervalTime = 16;
    this.currentTime = 0;
    this.clockwise = true;
    this.ticks = [];
    this.isPause = false;
    this.isStop = false;
};
AlloyTicker.prototype = {
    //时间开始
    start: function () {
        this.interval = setInterval(
            function () {
                if (!this.isPause) {
                    this.currentTime += this.clockwise
                        ? this.intervalTime
                        : -1 * this.intervalTime;
                    if (this.currentTime < 0) this.currentTime = 0;
                    this.tick();
                }
            }.bind(this),
            this.tickIntervalTime
        );
    },
    tick: function () {}, //时光倒流
    back: function () {
        this.clockwise = false;
    },
    forward: function () {},
    goto: function (time) {},
    pause: function () {},
    play: function () {},
    stop: function () {},
    scale: function (value) {},
};
```

因为：  
1. 从逻辑层面上 currentTime 不属于动画或运动对象的属性，都属于 AlloyTicker 时间机器的属性。  
2. 统一时间管理（倒流 (back)、暂停 (pause)、加速减速 (scale)、时间跳转 (goto)…）  
3. 所有对象的动画和运动都跟 AlloyTicker 挂钩，AlloyTicker 时间状态的变更会影响到所有挂钩的对象

Github: <https://github.com/AlloyTeam/AlloyTicker>  
Demo: <http://alloyteam.github.io/AlloyTicker/>