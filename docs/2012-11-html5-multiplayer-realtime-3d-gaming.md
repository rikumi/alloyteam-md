---
title: 【译】HTML5 实现多人实时 3D 游戏
date: 2012-11-14
author: TAT.iptton
source_link: http://www.alloyteam.com/2012/11/html5-multiplayer-realtime-3d-gaming/
---

原文：<http://blog.artillery.com/2012/05/realtime-multiplayer-3d-gaming-html5.html>

这篇文章国内有些机器译的版本，但实在太难阅读，这里试译了下。  
由于译者水平有限，可能会有不少错漏之处，一些不明确是否译准的地方附了原文。  
此文涉及挺多框架 / 库，在翻译过程中 ip 收获还是挺多的，建议大家在阅读时可以同时去了解下文中所提到的相关技术。  
【提示：此文不是 "跟我学做 HTML5 游戏" 之类的教程文章】

\----------------------------------------- 译文分隔线 -------------------------------------

六周前我们想试下用 HTML5 实现一个 \_twitch_3D 游戏是否可行。最终我们完成了几个游戏且很意外我们所达成的效果。

你可以试下其中一个游戏：[Air Hockey](http://airhockey.artillerygames.com/)  
![](http://blog.artillery.com/images/airhockey.jpg)

## 图形

目前多数浏览器对 WebGL 的支持已经很好，[three.js](http://mrdoob.github.com/three.js/) 是对使用 WebGL 很有用的库。它提供了简洁的 API，内建的实用功能，通信模块等，其缺点是… 文档很少。不过你可以通过很多现存例子来学习如何实现你所需要的功能。

一些例子使用了 [state.js](https://github.com/mrdoob/stats.js/) 和 [dat.GUI](http://code.google.com/p/dat-gui/) 来监控频帧和修改设置，这两个库都是非常有用的。dat.GUI 可用于微调延迟补偿算法及游戏外观，如光强，材料属性等。

我们从 [TurboSquid](http://dillinger.io/) 买了游戏中所需的 3D 模型 (air hockey, mallet and puck) ，感谢 three.js 的 [Blender](http://www.blender.org/) 导出插件，依靠这个插件我们可以轻易地把 Blender 的场景 (使用了买来的模型) 转为 json 格式以用于浏览器。在分离模型，调整材料和减少多边形的数量的过程中，我们磨练了 Blender 使用技巧以优化文件大小。

_Blender 界面_  
![](http://blog.artillery.com/images/airhockey-blender.jpg)

如果你是刚接触 3D, WebGL 和 three.js 将会显得比较艰涩，因为这里面会有很多陌生的术语和概念。由于我们都不熟悉 3D，所以在光线和材质的调整上花费了不少时间。我们反复尝试了各种调整，反复地刷新，体验效果。当看到 [Mr.doob 在 RO.ME 项目上的演讲](http://www.youtube.com/watch?feature=youtu.be&hl=zh-CN&v=D8mOtkuN864) (需翻墙) 时，才想到有个更好的办法，那就是`在合成最终效果前把各个部件先分离成单独的小 demo 以便于调节效果`。

## 网络通信

我们想试下创建一个能及时响应低延时，挑战玩家反应的游戏是否可行，air hockey 看起来很合适。移动冰槌和冰球需要良好的网络性能。而只要网络稍有延时，这个游戏的可玩性就大大降低。幸好，`WebSocket` 提供了很好的性能。

我们的网络方案相对简单，但这已经路以证明我们的观点：`用 HTML5 来实现互动 (twitch，不知怎么翻译) 游戏是可行的！`，网络方案如下：

-   客户端发送玩家的冰槌位置给服务端.
-   服务端基于之前的位置，计算两玩家的冰槌的速度，然后计算是否有碰撞、冰球新的速度及位置。
-   服务器发送最新的冰球及冰槌位置给两个客户端，客户端更新界面。

当然，延时会使这个处理过程变得复杂。如果从服务端到客户端的数据包需要 50 毫秒，那么玩家最终看到的界面就是 50 毫秒前的，**这使得玩家很难击中冰球**。针对此问题我们的解决方法是：

-   客户端计算自己与服务器之前的延时时长，比如 50 毫秒。
-   **当客户端从服务器接收到冰球的位置和速度时，使用与服务器相同的计算方法算出冰球 50 毫秒后的位置与速度。**
-   然后客户端把冰球显示到预算出来的位置

如此，玩家就不需要自己计算延时所导致的位置误差来击中冰球了。

还有很多流行的以验证有效的滞后补偿技术可以提高游戏的可玩性。不过我们的 demo 里仅使用上述方法 --90 年代的游戏联网技术，因为这已经足以让我们创建一个有趣的、实时的、浏览器上的多玩家游戏了。

`另外，值得一提的是，一切应该以服务端数据为准，所有的实时多人游戏里都是如此防范作弊的。`  
![image](http://blog.artillery.com/images/airhockey2.jpg)

## JavaScript

我们认为以 `HTML5 为前端 + Node.js 为后端` 这样的形式进行开发，可以减少开发时间，因为这样客户端和服务端可以复用代码。特别是在实时游戏里，因为这种情况下，前后端需要相同的模拟计算逻辑。`与之前的项目相比，把客户端和服务端中相同逻辑复用的方式，为我们节省了约 30% 的时间。`

我们尝试使用 RequireJS 编写客户端代码，但是用 AMD（Modules/AsynchronousDefinition）的方式来封装我们所有的代码的话，那会让人随时受不了的！幸好我们发现了 [Browserify](https://github.com/substack/node-browserify) 这一神器，它提供了很多 Node 标准库的实现封装。这样的代码 **events = require 'events'**、**class Game extends event.EventEmitter** 可以同时在服务端和客户端运行。可惜的是 Browserify 不能兼容 Backbone.js，为此，我们写了 50 行 `CoffeeScript` 来替换 Backbone.js 中我们所需要的功能。

选择 CoffeeScript 而非直接写 JavaScript 是因为这样可以精简代码量，而且所有的 Node 管理工具（如 nodemon,forever）似乎都支持 CoffeeScript。`一开始我们担心用 CoffeeScript 写的代码难以调试，但事实证明，CoffeeScript 生成的 js 代码极具可读性。`

Browserify 使用了新的代码映射标准，这有助于使用 Chrome 开发者工具游览代码，相信不需要多久我们就可以在游览器上直接调试 CoffeeScript 了。（译注：chrome 上已经可以直接调试 CoffeeScript，相关链接 <http://ryanflorence.com/2012/coffeescript-source-maps/>）

**性能与优化**

上文已经提到，我们用 Node.js 来当服务端，除了 Node.js，我们觉得没别的方案可以实现我们让服务端和客户端跑相同代码的需求了。目前为止，我们对 Node 的性能相当满意，在我们的负载测试中，512M 的 Rackspace VM 机可以同时良好地支撑 100 左右个游戏进行。因为性能如此良好，我们几乎没花时间进行优化。

关于 HTML5 的性能讨论，无可避免地涉及到 GC (Garbage Collection), 而在最初，我们发现 GC 的暂停可能会导致游戏出现明显停顿 ( and we were initially concerned that GC pauses might cause noticeable pauses in game play )，Chrome 无此问题，只有 FireFox 在跑 Air Hockey 时才会出现明显的光滑度光点 ( there are noticeable blips in smoothness)，我们认为这和 GC 有关。不过，我们并没在这上面花工夫去减少 GC 出现的数量，当然，我们认为，如果在代码写得更小心些以减少垃圾，在 Firefox 可能会获得更好的性能。

**收获**

游览器上的游戏开发，最大的障碍是工具的缺乏。我们看到有很多游戏框架，但要么对游戏的开发方式有限定，要么就是他们被收购了又或者是没有发布 (译注：这句看得莫名其妙，原文: We see a lot of frameworks, but they either constrain you into making your game a certain way, or they get acquired and are never released.) 关于游戏开发的优秀的库和组件很多，但开发者需要自己去把他们组合起来。

Flash 和 Unity 已经建立了一个良好的开发环境，iOS 和 Xbox Live Arcade 平台，也提供了终端到终端的解决方案以创建和发布游戏。但浏览器平台还是太新，写 HTML5 游戏就像写汇编代码一样麻烦。在我们的开发过过程中，我们找不到一个滚动条来调节冰球的颜色或者光线的强弱。要得到效果我们就必须跑起来又或者在从一个很复杂的软件里得到字面上的代码。(if we wanted any of that we’d have to build it or buy in (literally) to a heavier framework.)

我们非常高兴能看到浏览器上实现一个接近手抦控制的同步多人游戏的可能性。作为 StarCraft 和 Halo 的粉丝，我们已经准备好看到这两者在浏览器上的出现，同时我们也希望能激起你对它们在浏览器上出现的期望。

在这里可以获取我们的游戏及游戏开发工具的早期版本：[http://artillerygames.com](http://artillerygames.com/)。

**相关阅读**

-   [What every programmer needs to know about game networking](http://gafferongames.com/networking-for-game-programmers/what-every-programmer-needs-to-know-about-game-networking/)
-   [Latency Compensating Methods in Client/Server In-game Protocol Design and Optimization](https://developer.valvesoftware.com/wiki/Latency_Compensating_Methods_in_Client/Server_In-game_Protocol_Design_and_Optimization)
-   [A Stream-based Time Synchronization Technique For Networked Computer Games](http://www.mine-control.com/zack/timesync/timesync.html)