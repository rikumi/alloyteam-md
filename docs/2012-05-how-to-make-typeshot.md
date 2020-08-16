---
title: 【HTML5 Game】一步步开发一个 TypeShot 的打字游戏
date: 2012-05-17
author: TAT.岑安
source_link: http://www.alloyteam.com/2012/05/how-to-make-typeshot/
---

<!-- {% raw %} - for jekyll -->

废话不多说，直接进入正题，这篇文章主要为大家讲解一下一个类似【Z-Type】的 html5 小游戏的开发思路。

[【Z-Type】](http://www.phoboslab.org/ztype/ "【Z-Type】")不知大家是否有玩过，[Impactjs](http://impactjs.com/ "Impactjs") 的一个演示 demo。一个需要 99$ 的 html5 游戏框架。咱们暂且先不管他实现的思路，以下我们按自己的思路来一步步实现。

以下实例基于 [AlloyTeam](http://www.alloyteam.com/) 团队游戏底层库 [【Laro】](https://github.com/AlloyTeam/laro/) 实现.

[【演示 Demo】](http://hongru.github.com/proj/laro/examples/typeshot/index.html) （Firefox3.4+，Chrome10+，safari10+ 测试通过）  

\\=======================================================

## 【Stpe 1】游戏主循环和 CanvasReander

游戏初始化的时候，我们先做两件事：

-   获取 Laro 提供的用于 canvas 渲染的 canvas render 实例，里面封装了大部分常用的 canvas 游戏常用的方法。
-   开始循环，重绘

```javascript
this.render = new La.CanvasRender(canvas, 1, false);
```

接下来，主循环开始，我们在主循环里可以先做两件事，一个 update 用于处理每次循环数据方面的更新。 一个 draw ，用来做每帧的重绘。

```javascript
/**
 * looper
 */
Laro.register('TypeShot.$loop', function (La) {
    ...
 
    this.init = function () {
        this.$ = new La.Loop(this.looper, this);
    }
    this.looper = function (dt) {
        this.update(dt);
        this.draw();
    }
 
    this.update = function (dt) {
        ...
 
    };
 
    this.draw = function () {
        $TS.render.clear();
        ...
    };
 
})
```

接下来，开始考虑游戏主流程的逻辑编码，这里我们使用有限状态机 FSM 来处理游戏主流程。

## 【Stpe 2】游戏主流程

关于有限状态机，简单的理解可以理解为一种 switch case 的升级版，基于事件驱动的状态分支管理方式。适用于一些典型的基于事件驱动的模型，比如说游戏，或者是一些富操作的 app。详细可以 google 或者百科一下。

状态与状态之间尽量解耦，状态之间的消息传递和转换通过他们的宿主来处理。

于是，我们暂且先把这个游戏流程分为 3 块。

1.  资源 loading，初始化  
    [![](http://www.alloyteam.com/wp-content/uploads/2012/05/1-169x300.png "1")](http://www.alloyteam.com/wp-content/uploads/2012/05/1.png)
2.  游戏主场景  
    [![](http://www.alloyteam.com/wp-content/uploads/2012/05/2-171x300.png "2")](http://www.alloyteam.com/wp-content/uploads/2012/05/2.png)
3.  游戏结束 Game Over  
    [![](http://www.alloyteam.com/wp-content/uploads/2012/05/3-169x300.png "3")](http://www.alloyteam.com/wp-content/uploads/2012/05/3.png)

关于状态机的使用方式，我这里有一个简单的 [Demo](http://hongru.github.com/proj/laro/test/laro.fsm.html) ，对于每个状态都抛出了 enter，leave，update，transition 等事件，状态宿主有 onStateChange 状态改变的监听。

```javascript
Laro.register('TypeShot.$fsm', function (La) {
 
    ...
    var statesList = [
    states.loading, $sClass.Loading, states.inGame, $sClass.InGame, states.gameOver, $sClass.GameOver];
    ...
 
    this.init = function () {
        this.$ = new La.AppFSM(this, statesList);
        this.setState(this.states.loading); //进入loading
    }
 
    this.setState = function (state, msg, suspendCurrent) {
        ...
        this.$.setState(state, msg, suspendCurrent);
        ...
    }
});
```

我们状态机主流程初始化的时候，进入第一个资源 Loading 状态，这时候，我们可以在 loading 的 state class 里面来处理资源加载状态的一些情况。

```javascript
    this.Loading = La.BaseState.extend(function () {
        ...
 
    }).methods({
        enter: function (msg, fromState) {
            ...
 
            var images = [
            // images
            'images/backdrop.png', 
 
            //music
            'music/endure.ogg',
            ...
            ];
            $TS.loader.preload(images, La.curry(this.resourceLoadCallback, this));//加载资源
        }, leave: function () {
 
        }, update: function (dt) {
            ...
        }, draw: function (render) {
            ...
            // 绘制背景，进度条，文案等...
        }, transition: function () {
            //加载完毕，自动跳到下一状态
            if (this.loadAll) {
                this.host.setState(this.host.states.inGame);
            }
        }, resourceLoadCallback: function (p) {
            // 资源加载进度回调
            this.progress = p;
            if (p & gt; = 1) {
                this.loadAll = true;
            }
        }, drawProgressBar: function (render) {
            // 绘制进度条
        }
    });
```

上面抛出了

-   enter：进入状态时触发
-   leave：离开状态时触发
-   update：每帧数据更新
-   draw: 每帧的绘制
-   transition：转换判断，在每次 update 之后触发
-   ...

还有一些别的事件，详细请参考源码和文档。 每个状态的 update 和 draw 方法会有他们的状态宿主统一派发。

所以只需要在主循环里面的 update 和 draw 里面加上这个 fsm 宿主的 update 和 draw 的调用即可。

## 【Step 3】游戏主场景 - 飞船和敌人的绘制

进入游戏主场景状态之后，我们可以看到，主场景绘制也可以分为下面几个方面：

-   后面网格背景的动态绘制
-   飞船，包括射击动作的处理
-   敌人，敌人头上的文字，还有被击中状态的处理

动态网格背景很简单，让背景绘制的坐标不断向上移动就可以了

```javascript
       drawGrid: function (render) {
            for (var i = -2; i & lt; 11; i++) {
                render.drawImage($TS.textures['grid'], 0, i * $TS.textures['grid'].height + this.bgPos, 0, false, 0.5, false, false);
            }
        }
```

飞船，因为需要处理的逻辑可能比较多，我们用一个新建的类来处理。同时，飞船必定也会有多种状态间的切换，比如：普通静止的状态，射击的状态，被撞毁的状态等等。

所以，飞船这里我们又可以利用一个状态机来处理飞船自身的一些状态切换管理。

```javascript
    this.Ship = La.Class(function (x, y) {
        ...
 
    }).methods({
        update: function (dt) {
            this.fsm.update(dt);
            this.check();
 
            ...
        }, draw: function (render) {
            this.fsm.draw(render);
 
            ...
        }, setState: function (state, msg) {
            this.fsm.setState(state, msg);
        }, check: function () {
            ...
        }
    });
```

然后，在游戏主场景状态里面的 update 和 draw 里面去派发调用这个 Ship 的 update 和 draw 即可。

敌人的绘制也一样，可以独立一个 负责 敌人的类， 只不过可能需要多个敌人在同一个场景里面，那么按照不同的条件生成多个实例即可。基本思路一致。这里就不细说。

## 【Step 4】键盘事件响应，激光的射出

键盘事件，很常见，这里就不详述，监听键盘事件，判断当前的按键符不符合当前射击条件，这里的条件跟游戏规则挂钩。

我这里设计的游戏规则是这样的。

-   当前所有敌人都是 “满血” 状态时，这里由于是打字游戏，所以这里的满血状态指的每一个敌人的 word 都是完整的，没被消除过字母。这时候，根据当前的按键情况，遍历 word 列表的 首字母，如果遇到符合条件的，那么射击，否则表示按键失误，没有匹配的单词。
-   当有单词被击中之后，这个单词就变红，意味着你只能继续把这个单词完全打完之后才能打别的单词。

我们按照这个规则处理是否射击的判断，也就简单了，假如有符合条件的判断，那么我们添加一个 “激光” 类的实例到当前需要渲染的激光列表里面。

在游戏主场景 的 update 和 draw 里面对这个激光 列表进行遍历 update 和 draw 即可。

激光击中之后，消失，移除这个激光渲染列表。

## 【Step 5】激光击中的判断和击中效果绘制

由于我们是打字游戏，所以只要激光射出，就一定会中，至于激光在什么时候消失，我们可以做个粗略的 碰撞检测 即可，比如激光当前 位置 和 所射击敌人的位置 距离 的绝对值 小于多少 就判定 为击中...

因为并不需要判定 精确击中，所以这种逻辑基本也能满足需求。

那么判定激光击中之后，将当前激光移除渲染列表，同时可以在击中敌人周围加上一些 击中的效果， 比如说一些 飞舞的光圈等等。

当然，这些都是增加体验的效果，不是必需。

## 【Step 6】体验的丰富，音效处理

当然，想要更好的体验，可以考虑在射击可击中的时候加上音效的播放，这一点可以直接使用 html5 的 audio 来处理。需要注意的几个点是：

-   firefox，chrome，safari 等浏览器能够支持的音频格式都不太一致，需要有个适配兼容
-   firefox 下面如果不开始 play 的时候，他不会自动帮你预加载资源，所以做资源预加载时，firefox 下最好先 play (), 再 pause () 一下，可以绕过去。
-   另外，资源预加载时，如果为了保证音频完整可用之后再使用，最好使用 canplaythrough 事件来做回调。

\\============================

好吧，大致的思路就写到这里，感兴趣的同学可以直接查看 [demo 源码](https://github.com/AlloyTeam/Laro/tree/master/examples/typeshot), 当然，代码里面有一些处理的不够好的地方，因为仅作演示而已。


<!-- {% endraw %} - for jekyll -->