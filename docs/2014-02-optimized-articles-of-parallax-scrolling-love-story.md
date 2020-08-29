---
title: 视差滚动的爱情故事之优化篇
date: 2014-02-14
author: TAT.bizai
source_link: http://www.alloyteam.com/2014/02/optimized-articles-of-parallax-scrolling-love-story/
---

<!-- {% raw %} - for jekyll -->

上篇博客链接：[视差滚动的爱情故事](http://www.alloyteam.com/2014/01/parallax-scrolling-love-story/)

大家好，想起以前有家伙想给我起个花名，叫伟哥。这种跟人类生殖器官有关系的花名，怎么能让它伴随我英明的一生呢！看我不抽死那。。。。。哦，不对，看我不说服那个家伙改口，最后他在我 185 魁梧的身材，俊朗的五官的威严下改口了，只不过那天手掌略疼略疼而已。上一篇博客知道，我的女神居然有男朋友了，很明显这是上天给予我的挑战，然后故事就会像狗血韩剧那样发展，我成为了男二号，女神女主角因为得了癌症，男一号假以远赴外国寻医实则东莞被捕，就这样在女神身边消失了，而身为男二号的我会不离不弃地守护这女神，终于女神在我的爱情滋润下战胜病魔，重获新生，男二号和女神走在一起，哈哈哈哈哈哈啊啊啊哈哈，故事一定是这样。什么？你说韩剧后面还有男一号回来跟女神重拾旧爱的剧情？韩剧一般看到这里我就不看的。

。。。。。。好吧我承认，我没有成为什么男二号，而是成为一名（diao si）备胎

具体备胎是做什么的？电视里面播的，要陪女神去打胎这样的剧情是假的，在现实里是没有的。什么？你问我为什么这么清楚？当然，我当了这多年。。。。。

[![buzhidao](http://www.alloyteam.com/wp-content/uploads/2014/02/buzhidao.jpg)](http://www.alloyteam.com/wp-content/uploads/2014/02/buzhidao.jpg)  
女神做不了的，女神男朋友做不了的，或者他不忍心他男朋友做的，这就是备胎要做的。  
哎～～，不多说，先把女神上次拜托的事情完善了先。

**【优化问题 ： 解决 Chrome 下跳动的 bug】**

在上一篇的爱（diao）情（si）故事里面，[demo3](http://www.alloyteam.com/wp-content/uploads/2014/01/demo3_scene.html "demo3") 在 Chrome 下是这样的问题：鼠标滚动视差元素动画生硬，鬼畜跳动，拖动滚动条却没有这样的问题。之前也分析过，是因为 Chrome 只触发一次 scroll 事件导致的（还有个上下跳动的原因，博客后面会再论述），后来 IE10 也发现也有这个问题。概括一下问题可以论述为：现代浏览器出于 “优化” 目的，对 scroll 事件机制进行特殊处理，限制了鼠标滚动所触发的 scroll 事件次数。硬件设备鼠标滚动一个齿轮幅度，通常 scrollTop 就会滚动了 100px 左右，其他浏览器会触发十几次，而 Chrome 和 IE10 却只触发一次的 scroll 事件。

[http://www.manufacturedessai.it/it/](http://www.manufacturedessai.it/it/ "http&#x3A;//www.manufacturedessai.it/it/") 这个网站的视差滚动也是没有做优化，视差效果出现问题跟我上个的 dome3 一样，滚动起来，看着美女下面粗壮的大腿不断地跳啊跳啊，挺惊悚的。（此网站后来换了个烈焰红唇）

**【采用 mousewheel 事件做视差滚动，顺道避规上面的问题】**

既然问题出在浏览器的 “优化” 机制，那么我们只要找出触发浏览器的优化的核心代码，改写即可。或者重新自个写个浏览器，就不会有这样的问题了，而且还能在市场上推广自己的浏览器.............（博主，不就是当个备胎嘛，认真点。）  
既然问题出在 scroll 事件，我们就改用 mousewheel 事件即可。注意，mousewheel 鼠标滚轮事件在浏览器上兼容性比较差，所以........... 大家还是自个写个浏览器吧（喂喂！认真点！）。关于 mousewheel 的使用和兼容不在本文讨论范围，不清楚的读者自个查 (wan) 阅 (dan) 去吧。

使用 mousewheel 的的 wheelDelta 值后，我们就可以忽略掉 scrollTop 的值，元素要滚动多少内容就完全由我们来决定了，这样可以解决上面的 “滚动了几百 px 却只触发几次的动画事件” 的问题。来看个 demo。

[v_demo1_mousewheel.html](http://www.alloyteam.com/wp-content/uploads/2014/02/v_demo1_mousewheel.html "v_demo1_mousewheel.html")

核心代码如下：

```c
function mouseWheelHandler(e){
  var e = e || window.event;
  //使用wheelDelta的正负来判断鼠标是向上滚动还是向下滚动
  //wheelDelta是120的倍数(鼠标下滚是为负)，detail是firefox的，3的倍数(鼠标上滚为正)。
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
 
  circles[0].style.top = getOldTop(circles[0])+delta*10+'px';
  circles[1].style.top = getOldTop(circles[1])+delta*20+'px';
  circles[2].style.top = getOldTop(circles[2])+delta*50+'px';
 
}
```

显然要想使用 mousewheel 作为视察滚动的触发事件，最好把页面 overflow 设为 hidden。因为出现滚动条后，滚动鼠标，是 mousewheel 事件和 scroll 事件都触发的，但是如果拖动滚动条，那就只会触发 scroll 事件而不触发 mousewheel 了。介于没有了滚动条，可以创造的思路就更多更广了，往往令人震惊的视差滚动都是使用 mousewheel 的形式来创作的

马里奥赛车：[http://www.nintendo.com.au/gamesites/mariokartwii/#home](http://www.nintendo.com.au/gamesites/mariokartwii/#home "http&#x3A;//www.nintendo.com.au/gamesites/mariokartwii/#home")  
QQ 浏览器 7：[http://browser.qq.com/index_m.html](http://browser.qq.com/index_m.html "http&#x3A;//browser.qq.com/index_m.html")  
愤怒的小鸟星际版（很可惜，这个网站已经被覆盖了）

博客后面还有对上面这两个优秀的视差滚动做了小 demo。

**【hack 的方法解决问题？】**

虽然使用 mousewheel 能够避规问题，但不是解决问题，就像你的女神有了男友，你就对你女神避而远之，你这样对得起自己的狼心狗肺吗？对得起乡亲叔侄吗？所来，还是像我那样，当一名备胎多好。欢迎加入 “寡人要当备胎俱乐部 “。好，回归正题，我们还是要直视滚动鼠标触发 scroll 事件的 bug。我开始的思路是下面这几个：

1. 同时绑定 scroll 事件和 mousewheel 事件，滚动鼠标就屏蔽 scroll 事件，只触发 mousewheel 事件，问题搞定  
2. 只触发一次 scroll 事件，那么强制触发多次 scroll 事件，让触发 scroll 事件次数回归正常，问题搞定  
3. 自个写个浏览器，问题搞定

读者自个忽略每个思路最后一句话，单单从思路上看，就知道是 hack 手法。但没办法，只�


<!-- {% endraw %} - for jekyll -->