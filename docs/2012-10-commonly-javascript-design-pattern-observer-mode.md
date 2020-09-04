---
title: 【Javascript 设计模式 3】- 观察者模式
date: 2012-10-24
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2012/10/commonly-javascript-design-pattern-observer-mode/
---

<!-- {% raw %} - for jekyll -->

观察者模式 (又叫发布者 - 订阅者模式) 应该是最常用的模式之一。在很多语言里都得到大量应用。包括我们平时接触的 dom 事件。也是 js 和 dom 之间实现的一种观察者模式.

```javascript
div.onclick  =  function click (){
 
   alert ( ''click' )
 
}
```

只要订阅了 div 的 click 事件。当点击 div 的时候，function click 就会被触发.

那么到底什么是观察者模式呢。先看看生活中的观察者模式。

好莱坞有句名言. “不要给我打电话， 我会给你打电话”. 这句话就解释了一个观察者模式的来龙去脉。 其中 “我” 是发布者， “你” 是订阅者。

再举个例子，我来公司面试的时候，完事之后每个面试官都会对我说：“请留下你的联系方式， 有消息我们会通知你”。 在这里 “我” 是订阅者， 面试官是发布者。所以我不用每天或者每小时都去询问面试结果， 通讯的主动权掌握在了面试官手上。而我只需要提供一个联系方式。

观察者模式可以很好的实现 2 个模块之间的解耦。 假如我正在一个团队里开发一个 html5 游戏。当游戏开始的时候，需要加载一些图片素材。加载好这些图片之后开始才执行游戏逻辑。假设这是一个需要多人合作的项目。我完成了 Gamer 和 Map 模块，而我的同事 A 写了一个图片加载器 loadImage.

loadImage 的代码如下

```javascript
loadImage(imgAry, function () {
    Map.init();
    Gamer.init();
});
```

当图片加载好之后，再渲染地图，执行游戏逻辑。嗯，这个程序运行良好。突然有一天，我想起应该给游戏加上声音功能。我应该让图片加载器添上一行代码.

```javascript
loadImage(imgAry, function () {
    Map.init();
    Gamer.init();
    Sount.init();
});
```

可是写这个模块的同事 A 去了外地旅游。于是我打电话给他，喂。你的 loadImage 函数在哪，我能不能改一下，改了之后有没有副作用。如你所想，各种不淡定的事发生了。如果当初我们能这样写呢:

```javascript
loadImage.listen( ''ready', function(){
 
    Map.init();
 
})
 
loadImage.listen( ''ready', function(){
 
   Gamer.init();
 
}
```


<!-- {% endraw %} - for jekyll -->