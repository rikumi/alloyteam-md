---
title: 时光倒流程序设计 - AlloyTicker
date: 2016-07-25
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/07/clock-programming-alloyticker/
---

<!-- {% raw %} - for jekyll -->

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
this.y = this.startY + this.vy * dt +</
```


<!-- {% endraw %} - for jekyll -->