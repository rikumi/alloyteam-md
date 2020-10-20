---
title: 教你制作自己的魔性游戏
date: 2015-10-31
author: TAT.vorshen
source_link: http://www.alloyteam.com/2015/10/teach-you-how-to-make-your-own-magic-game/
---

<!-- {% raw %} - for jekyll -->

文章背景：在朋友手机上看到一个有趣的魔性游戏（不知道的无须百度，下面直接看我的就好～），一拍脑袋想把 navtive 端的移植到 web 上面来～虽然游戏玩法和主题是抄袭，但是技术可以保证百分百自己实现～

**PS：写完发现网上已经有标准的 web 版，UI 和 native 一样，而我的是赶时间之作…… 一比较 UI，我很尴尬，请勿太介意……**

先给 demo 地址～可以试玩！

<http://westanhui.github.io/self-moxing-game/index.html>

github 地址：<https://github.com/westAnHui/self-moxing-game/blob/master/index.html>

这样简明的游戏应该不需要教程吧，感觉游戏玩法还是挺有趣的，下面开始正题，技术如何实现！

**注意：想了解的请边看游戏源码边看文章，这里只会贴核心代码，否则太多了……**

整个开发过程分为两部分，布局和逻辑

1、布局

布局可以采用 Canvas，网上标准 web 版就是 Canvas 的，不过我没用，原因有三：

a、因为不想用第三方库，原生 Canvas 做的话自己最好还得封装一层事件操作，懒……

b、DOM 性能问题并不大，有需要优化的地方，下面会说，但总体还是算那种低性能游戏，DOM 可以接受

c、DOM 开发快啊！我将标准的六边形改成了圆形就是 DOM 写起来方便啊，追求效率

布局的代码请看 141 行

```javascript
function uiInit() {
    globalGamePanel = new GamePanel();
    randomBlock();
    randomBlock();
    randomBlock();
}
```

GamePanel 构造函数建立了上面那个六边形，randomBlock 函数是生成下面那种随机节点插入图形

布局比较简单，稍微烦人一点的地方在于六边形对齐问题和插入节点组的随机性上

六边形对齐问题

153、154 行有两个数组

```javascript
var topArr = [0, 70, 140, 210, 280, 350, 420];
var leftArr = [120, 80, 40, 0, 40, 80, 120];
```

存的就是六边形中每一个节点的位置，7\*7 = 49

接下来一个嵌套 for 循环生成 DOM，先 append 到 documentFragment 中，最后一次性 append 进来

插入节点组的随机性

```javascript
function randomBlock() {
    var r1, r2;
    r1 = Math.random() * 10;
    if (r1 &lt; 1) {
        new BlockPanel(0);
    } else {
        r2 = Math.random() * 10;
        if (r2 &lt; 2) {
            new BlockPanel(1);
        } else if (r2 &lt; 6) {
            new BlockPanel(2);
        } else {
            new BlockPanel(3);
        }
    }
}
```

185 行这个函数是产生随机插入节点的入口，第一个 if 用来决定是否是单节点，也就是这样的

[![1](http://www.alloyteam.com/wp-content/uploads/2015/10/15.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/15.png)

只有 10% 的几率，第二个 if 用来决定多节点类型，分为以下三种

[![2](http://www.alloyteam.com/wp-content/uploads/2015/10/21-300x95.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/21.png)

说一下区别，在说区别之前我们先定义一个概念，就是一个六边形，七个节点中，中间那个为核心节点

[![3](http://www.alloyteam.com/wp-content/uploads/2015/10/31.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/31.png)

再看那三种图形，其中 1 和 2 是有 Core 节点的，3 没有，这里我们给每一个插入节点组自定义属性 haveCore 表示这一组节点是否有 Core 节点

1 和 2 的区别在于 1 的边节点必须是对齐的，2 的话随机取边节点 3 个就可以了，所以两套逻辑区分开，如何记录边界点呢，这里我们定义一个规范

[![3](http://www.alloyteam.com/wp-content/uploads/2015/10/32.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/32.png)

每个边节点都根据 Core 用数字代替，在节点组上面用自定义属性 around 表示出来，举个栗子，前面的 2 号节点组，它的 DOM 结构最终是这样的

[![4](http://www.alloyteam.com/wp-content/uploads/2015/10/46-300x65.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/46.png)

实现的代码在 202~331 行，原理说过了，代码就不一句一句读了，有原理实现起来还是挺简单的

OK 到这里布局就没问题了，还是很简单的，接下来是逻辑部分，先整理一下游戏的逻辑部分

a、玩家拖拽插入节点组至六边形面板中

b、判断插入节点组是否可以放下，可以的话插入节点组变红

c1、用户松开鼠标时，如果可以放下，更改六边形中相对于的节点颜色并表示，并生产新的插入节点组

c2、用户松开鼠标时、如果不能放下，退回

d、当六边形中有一边全部插入节点，消失并加分

这是整个游戏逻辑，复杂点在 b 和 d 上面

先说如何判断插入节点组是否可以放下

判断需要触发函数，一种是 mousemove 触发，在这里没有使用此方法，原因这不废话么…… 用这个要卡成马赛克的

我们最终采用的是当用户 mousedown 插入节点组时，设置定时器去检测

**在这里提一个开发工程中遇到的坑，就是当我们拖拽下面的插入节点组时，鼠标移入六边形，是不触发 mouseenter、mouseover 等函数的，只有你松开鼠标才会触发，所以我才将定时器开始设置为 mousedown 插入节点组**

检测的实现代码在 441~549 行，先关注一下 446 行代码

```c
if(Math.abs(panelY - yCenterArr[i]) &lt; 10) {
    ……
}
```

panelY 相当于是鼠标在六边形区域的 clientY 值【我这样解释大家应该听得懂吧……^\_^

**鼠标在六边形区域上代表的是可插入节点组中 Core 节点中心的位置**

yCenterArr 是六边形中 7 行中心点 Y 值，还有一个 xCenterArr，定义在 100 和 109 行

当这 x 与 y 都相差 10px 以内时候才认为玩家想把插入节点组插进去（此时并不知道能不能插进去），进行判断

[![5](http://www.alloyteam.com/wp-content/uploads/2015/10/5-300x243.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/5.png)

红点为鼠标（抱歉我没截下来鼠标，又偷懒了……），这个点的 x,y 会与六边形中节点中心位置遍历，是否 x,y 差距都在 10px 以内，注意一定先遍历 y，因为每一行节点的 y 都是一样的，但是每一列节点的 x 是不一样的……

当发现用户悬停了某一节点，似乎想插入时我们就要判断是否可以插入，具体代码在 449~539 行

**说原理之前先讲下六边形中每个节点上多了三个自义定属性**

**一个是 isEmpty，用来判断这个节点能否插入，还有 x,y 这是当前节点对应六边形里面的行列号**

原理就是利用插入节点 Core 开始，对应的六边形节点 isEmpty 是否为 1，然后再根据插入节点组 around 属性找六边形鼠标悬停节点周围的其他节点

请一定根据代码来解读…… 原理是这样，但是实现起来还是挺繁琐的

这时最恶心的检验就完成啦

下面说逻辑上第二个复杂点的就是一行插满就消失

说复杂其实也还好，就是每次用户插入成功时把每一行检验，代码在 380~421 行

分别要遍历横行，左斜行和右斜行，看起来如何遍历挺头疼的，其实直接写死就好了嘛～

代码的 113~131 定义了 globalValid_1、globalValid_2、globalValid_3 三个数组遍历，存的是遍历的顺序

左斜行和右斜行有点特殊，以 globalValid_2\[0] 为例，数组内容是 \[0,0,1,0,2,0,3,0]

利用游标每次 + 2，这个数组使用起来变成 \[0,0],\[1,0],\[2,0],\[3,0]，就是六边形中左斜第一边（是的，坐标为 y,x）

之所以这样是避免三维数组出现，小小优化一下

当发现某一行 isEmpty 都为 0 时，改变 isEmpty 值，改变节点颜色，增加分数，分数是根据那一行节点数\*50 来的，最长的 7 节点行可以加 350 分，最少的 4 节点行就只有 200 分

好啦，游戏核心的一些介绍就到这儿了

自己这个有很多不足的地方，UI、交互的细节、声音细节、还有死亡机制

死亡机制挺重要的，但是我没弄，最近太忙了。就说一下原理吧，原理就是用户插入成功之后加一步检验每个节点是否可以插入下面三个插入节点，检验方法已经有了不是么～

文章很长，能把看完一定非常不容易，在此万分感谢，愿读者看完之后可以写出比原版还 nice 的魔性游戏～

有想法和问题可以留言交流～


<!-- {% endraw %} - for jekyll -->