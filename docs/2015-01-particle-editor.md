---
title: HTML5 粒子编辑器
date: 2015-01-23
author: TAT.dnt
source_link: http://www.alloyteam.com/2015/01/particle-editor/
---

# **写在前面**

大家阅读此文之前，可以先看一篇 MiloYip 的文章：[用 JavaScript 玩转游戏物理 (一) 运动学模拟与粒子系统](http://www.cnblogs.com/miloyip/archive/2010/06/14/Kinematics_ParticleSystem.html)，看完之后再看此文，更加容易理解。

MiloYip 使用的粒子是 canvas 中绘制的圆，还有一些粒子效果是基于 像素级别的，如：[火焰字](https://github.com/gyrocode/burning-words.js "火焰字") ，但是使用像素的计算成本太大，因为需要的粒子数量太多，甚至要配合一些 nosie 算法，如（perlin nosie），计算量太大。

所以一般会先设计好粒子的纹理（每个纹理假设是 32\*32，一个粒子就包含了九百多个像素了），这样需要的粒子个数不多，计算量也不大，管理粒子的成本也不高（对粒子增删改查）。

# canvas globalCompositeOperation

粒子系统在什么时候最漂亮？晚上！所以在绘制纹理的时候，需要设置 globalCompositeOperation 的值为 lighter。其作用是：在图形重叠的地方，颜色由两种颜色值的加值来决定。

globalCompositeOperation 还有非常多的属性可以设置，详情见：w3school。

# 粒子系统

粒子系统的本质其实就是粒子从发射到消失的过程。所以，可以立刻想到一些配置项目：

1. 发射速度（每个粒子的速度、方向、角度范围）

2. 发射区域（定点发射，还是在某个区域发射）

3. 重力场（你是在月球上发射，还是在地球上发射，还是太空的失重状态下）

4. 粒子纹理（你发射的是激光、还是五角星、还是烟雾）

5. 纹理滤镜（激光是红色还是蓝色）

6. 发射频率（你是一秒发射一次、还是一秒发射 100 次）

每个参数的变化都会导致呈现效果截然不同。

# 数学与物理

比如运动方向的独立性，2 维空间可以使用 new Vector2 (1,2) 来描绘速度，把速度拆分成 x 和 y 方向，1 代表 x 轴方向的速度，2 代表 y 轴方向的速度

同样，重力场也可以拆封成两个方向。如 new Vector2 (0,0.98),0 代表 x 轴方向的速度，0.98 代表 y 轴方向的速度

简单的积分思想：（如：速度是加速度在时间上的累加，路程是速度在时间上的累加等等）。

当然，听上去好像要会微积分才能写粒子系统似的，但其实微积分根本体现不再程序里面，因为程序 / 游戏里面有 core loop，loop 里面干的事情就是积分... 比如：

```javascript
tick: function () {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity.multiply(0.1));
    this.rotatingSpeed+=this.rotatingAcceleration;
    this.rotation += this.rotatingSpeed;
    this.alpha -= this.hideSpeed;
}
```

所以有这个思想就行，根本不需要会微积分 =  =！

# Canvas UI 小控件

整个编辑器的所有控件都是 canvas 写的，感觉就三个词：简单、粗暴、直接。使用起来也非常方便。如，下面这个控制发射范围、粒子、方向的控件：

[![ctrl](http://www.alloyteam.com/wp-content/uploads/2015/01/ctrl.png)](http://www.alloyteam.com/wp-content/uploads/2015/01/ctrl.png)

使用的代码：

```javascript
var dirCtrl = new PE.CircleAdjust({
    min: 0,
    max: 50,
    rotation: -30,
    value: 10,
    angleRange: 50,
    change: function (value, angle) {
        ps.setAngle(angle);
        ps.setSpeed(value);
    },
    renderTo: document.getElementById("emitAngleCtrl"),
});
```

当然这里不是否定 dom 写控件，而是，有的时候 canvas 写 UI 更具备优势。还有一些场景是 dom 写控件无法实现的。（比如全局的滤镜效果、波浪效果等，也就是跟像素有关，dom 相对较弱）

# 其他

粒子编辑器，还使用了一些 HTML5 特性，比如拖拽、FileReader、和 blob 下载功能。如，基于 blob 封装了一个工具函数用于下载文件：

```javascript
Util.downloadFile = function (code, fileName) {
    if (window.URL.createObjectURL) {
        var fileParts = [code];
        var bb = new Blob(fileParts, {
            type: "text/plain",
        });
        var dnlnk = window.URL.createObjectURL(bb);
        var dlLink = document.createElement("a");
        dlLink.setAttribute("href", dnlnk);
        dlLink.setAttribute("download", fileName);
        dlLink.click();
    }
};
```

# 传送门

demo: [http://alloyteam.github.io/ParticleEditor/](http://alloyteam.github.io/ParticleEditor/ "http&#x3A;//alloyteam.github.io/ParticleEditor/")

github: [https://github.com/AlloyTeam/ParticleEditor](https://github.com/AlloyTeam/ParticleEditor "https&#x3A;//github.com/AlloyTeam/ParticleEditor")

ps: 编辑器使用小测验：你能使用 demo 的粒子编辑器实现下面那只企鹅效果吗？:)

# [![sh](http://www.alloyteam.com/wp-content/uploads/2015/01/sh.png)](http://www.alloyteam.com/wp-content/uploads/2015/01/sh.png)