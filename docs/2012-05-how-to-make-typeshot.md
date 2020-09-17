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
        this.$ = new 
```


<!-- {% endraw %} - for jekyll -->