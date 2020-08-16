---
title: 从 console.log 说起（下）
date: 2013-11-30
author: TAT.老教授
source_link: http://www.alloyteam.com/2013/11/console-log-2/
---

<!-- {% raw %} - for jekyll -->

[上集入口](http://www.alloyteam.com/2013/11/console-log/)

### 那些兄妹

[![console 的兄妹](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-13@2x.jpg)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-13@2x.jpg)

这些都可以做调试输出，区别是：

1.  样式不同
2.  我们可以通过调试器底部筛选出不同的输出项

所以跟网站重构要求 html 语义化类似，当我们的调试输出比较多时，根据实际场景使用不同类型的输出函数能使我们的输出更有条理。

值得一提的是 `console.error`，我们使用它做输出除了可以输出错误信息外，还可以输出调用这个函数的一瞬间的调用栈！这无疑给我们调试带来很多方便（当然你也可以用 js 断点一步步跟踪），而这是 console.log 所不具备的。除了 console.error，还有一个函数 `console.trace` 也可以打印出调用一瞬间的调用栈，不过它的输出样式和位置就跟 console.log 一样了：  
[![QQ20131111-14@2x](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-14@2x.jpg)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-14@2x.jpg) [![QQ20131111-15@2x](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-15@2x.jpg)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-15@2x.jpg)

其实这一系还有函数（丫的搞这么多类似的）：

```javascript
// 等价
console.log("%o", document.body);
console.log(document.body);
// 等价
console.log("%O", document.body);
console.dir(document.body);
```

它们才是失散多年的兄妹吗。。

### 邻居们

其实除了打印调试信息外，console 还有不少强大有用但却很低调的接口。

#### console.time & console.timeEnd

这是性能调试的利器啊，熟悉 NodeJs 的童鞋更是清楚。肯定不少童鞋干过这事：在我们的某块代码前新增一个类似 startTime 的变量，给它一个时间戳，然后在我们执行完代码后，再打一个时间戳，再将两者相减，再将结果输出。现在我们使用上面的函数，就可以省下很多功夫了：  
[![QQ20131111-16@2x](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-16@2x.jpg)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-16@2x.jpg)

上面是我写的一个懒加载判断图片是否在可视区域内，可以看出调用 10000 次花费时间为 160ms 左右，使用这两个接口是何其方便！而且我们还可以将一个字符串作为函数参数，来区分不同的性能计时。

#### console.count

这是一个计数器，我们可以传个名字给它，如 a，然后每次调用 `console.count('a')`（可以在不同函数不同地方），它就能打印出这样一个调用执行了多少次：  
[![QQ20131111-17@2x](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-17@2x.jpg)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-17@2x.jpg)

这个函数特别适用于在一些复杂的场景，有时一个函数被多个地方调用到，而我们想知道该函数是否少调用或重复调用，此时使用计数器比 js 断点自己还要默记调了几次快多了。

#### console.assert

assert，搞编程的应该对这个单词不陌生：断言。使用 console.assert，你可以理解为于禁的技能（三国杀玩多了这孩子），你猜错了这个表达式的真假，那我就可以打出我的信息：  
[![QQ20131111-18@2x](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-18@2x.jpg)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-18@2x.jpg)

不消说，使用该函数可以让我们在某些地方只在符合某个条件才进行调试输出，使输出更加干净。当然你也可以用 if 语句，不过写起来就麻烦了一些。

#### console.group

一看就知道是分组输出：  
[![QQ20131111-19@2x](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-19@2x.jpg)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-19@2x.jpg)

而且这个分组还可以嵌套的：  
[![QQ20131111-20@2x](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-20@2x.jpg)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-20@2x.jpg)

显然这个函数特别适合有一大堆调试输出的情况，做大项目估计会用上。不过有时你打开控制台看到满屏满屏的输出你也会很头痛的，于是你可以分组输出且默认收起：  
[![QQ20131111-21@2x](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-21@2x.jpg)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-21@2x.jpg)

#### console.clear

最后的最后，该清场了。

特别适用于，在一个多人开发项目，你不爽别人的调试输出，那你可以用这个函数统统清掉，再输出自己的调试信息，不用跟这个函数客气。

### 总结

我是王大锤，万万没想到，console.log 的八卦就这样被我说完了，本以为还可以吹水个几万字。

这是【那些不为人知的接口系列】的第一篇，浏览器其实提供了很多有用的接口给我们，我们要不不知道，要不知道了感觉用不上，该系列试图将它们一一挖掘出来并给出适用场景建议，敬请期待。

### 附

1.  conssole.timestamp & console.profile 这两个函数对应 chrome 调试面板的两个 tab，调试性能时可用上，有兴趣的童鞋可以看看：[Google 开发者文档之 console](https://developers.google.com/chrome-developer-tools/docs/console-api)
2.  本文的[演示版本地址](http://www.ipresst.com/play/52774e16d1bf21205e000d3f)

<!-- {% endraw %} - for jekyll -->