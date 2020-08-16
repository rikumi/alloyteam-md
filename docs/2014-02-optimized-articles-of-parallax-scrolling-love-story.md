---
title: 视差滚动的爱情故事之优化篇
date: 2014-02-14
author: TAT.bizai
source_link: http://www.alloyteam.com/2014/02/optimized-articles-of-parallax-scrolling-love-story/
---

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

读者自个忽略每个思路最后一句话，单单从思路上看，就知道是 hack 手法。但没办法，只能试试，介于方法都很麻烦，而且总试不成功，一直处理到深夜，很夜很夜，终于找到一个奇怪的处理手法，下面简称” 莫名其妙就解决了问题的 hack 方法 “。自个用 Chrome 先看 demo

[v_demo2_hack.html](http://www.alloyteam.com/wp-content/uploads/2014/02/v_demo2_hack.html "v_demo2_hack.html")

hack 的手法核心就是：在原来的使用 scroll 事件的视差滚动，增加一个对 mousewheel 的事件的” 空处理 “函数。其实只要有绑定 mousewheel 事件即可，里面有逻辑处理和没有逻辑逻辑都可以。目前没有找到合理的解析。

手拿着 hack 手法的我，悄悄走到了 IE10 姐姐身后，想把 IE10 也 hack 掉，那我的大计就完成。  
突然 IE10 姐姐一个华丽的扭头，伴随的还有飘逸飞舞的长发和全新力士香薰沐浴露的香味。

” 你就是那个常年做备胎的谭伟 X？“

我了个大叉，什么玩意，为什么他会知道我是个备胎，她明明是个浏览器啊，只是萌化娘了一下而已，难道我当备胎的事情我同事我父母我基友都知道吗？先不理了，只要把 hackIE10 的任务完成了先。

” 那个。。。IE10 姐姐，你看 Chrome 阿姨都被我 hack 了，你能不能。。。。“ 我特意把 Chrome 姐姐说成阿姨。正当 IE10 萌娘在做思考的时候，身后突然冒出个小萝莉，不好，是 IE6 小朋友。

” 姐姐，就是他，整天都吐槽我诋毁我 hack 我，活该当备胎！“IE6 小朋友居然热泪盈眶了都，说话还这么突出重点，你两姐妹究竟有多在意我是备胎啊。

各位读者，上面就是我深夜 hack 浏览器，Chrome 成功，却在 IE10 不成功的故事啦。

**【深入分析跳动 bug】**

虽然 hack 不成功，但分析了 scroll 和 mousewheel 的事件，找到了问题的突破点。先来看，Chrome 上的鼠标滚动有动画生硬鬼畜跳动的 bug，其实有两个原因：  
1. 只触发一次 scroll 只有一帧的动画  
2. 那一帧的动画，浏览器重绘了两次，导致” 动画跳动 “

我们来深入分析 scroll 和 mousewheel 事件触发的顺序和浏览器渲染过程，以一次鼠标滚动触发浏览器事件和渲染顺序的对比  
1. 一滚动鼠标，首先触发的是 mousewheel 事件，之后再到 scroll，这时候浏览器没有做渲染，dom 的 scrollTop 不变。

[![debug_1](http://www.alloyteam.com/wp-content/uploads/2014/02/debug_1.png)](http://www.alloyteam.com/wp-content/uploads/2014/02/debug_1.png)

2. 之后 debug 到 scroll 事件，发现，当刚进入 scroll 事件处理时候，浏览器就按照默认行为，页面内容上滚，这时 dom 的 scrollTop 已发生改变，如图。或者说，浏览器默认行为页面内容上滚，再触发 scroll 事件

[![debug_2](http://www.alloyteam.com/wp-content/uploads/2014/02/debug_2.png)](http://www.alloyteam.com/wp-content/uploads/2014/02/debug_2.png)

3. 最后执行到在 scroll 事件内我们要进行视察滚动的逻辑，使到 dom 的 scrollTop 又发生了一次改变。

[![debug_3](http://www.alloyteam.com/wp-content/uploads/2014/02/debug_3.png)](http://www.alloyteam.com/wp-content/uploads/2014/02/debug_3.png)  
上面这三步，基本可以把问题看穿了，一次鼠标滚动，浏览器渲染了两次：  
第一次，就是默认浏览器行为，页面上滚。渲染位置一般偏上  
第二次，视察滚动逻辑，dom 的 top 改变。渲染位置一般偏下  
这样一上一下的进行两次渲染，导致了出现个跳动的 bug.

**【使用 fixed 做视差滚动，真正处理问题】**

” 诶，谭伟 X，你要不不搞那个问题先了，看你那天搞到这么晚，不如。。。。“ 女神依旧呼唤着我的全名，还安慰我了有木有，不愧是女神啊，真是心地善良啊～～  
” 其实，我已经找到方法，你大放心 “是的，我找到真正的解决方案。

问题出在一上一下的两次渲染，那我们真正希望的是只做第二次渲染，即是视差滚动逻辑的渲染。但是如果吧页面上滚的渲染屏蔽掉呢？屏蔽掉是不实际的，人要往前行，页面内容也要往上滚。大家还记得上篇博客介绍的视差滚动的原理一吗？使用 background-attachment: fixed。这个属性可以让 background 在页面滚动的时候不跟随内容滚动。这不正正是我们需要的吗？

使用 background-attachment: fixed，页面 dom 结构要发生变化，发生视差滚动的元素都要以 background-image 的赋值和 background-position 调整位置。这是 demo 的片段 html 代码，需要注意的是 scene 类，是需要变得非常的大，方便用 backgroundPostion 调整视差元素的位置

```html
.scene{
  position: absolute;
  width: 100%;
  height: 3000px;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
</style>
<body>
 
<div id="scene_back" class="scene"></div>
<div id="scene_center" class="scene"></div>
<div id="scene_front" class="scene"></div>
```

js 基本上只是把原来的 top，改为 backgroundPostionY 而已。

```javascript
function onScroll(e) {
    var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
    sceneBack.style.backgroundPositionY = 100 - scrollTop * 0.05 + "px";
    sceneCenter.style.backgroundPositionY = 300 - scrollTop * 0.15 + "px";
    sceneFront.style.backgroundPositionY = 600 - scrollTop * 0.4 + "px";
}
```

[v_demo3_background.html](http://www.alloyteam.com/wp-content/uploads/2014/02/v_demo3_background.html)

问题算是终于解决了，可是女神给予充分感谢后，很长一段时间没有再联系我了，可能跟男一号过得很好吧，可能刚好没有需要我帮忙的吧，也有可能缘分大概走到这里了吧。现在能做的，就是继续完善视差滚动，等到我们再次相遇，让她觉得依旧值得可靠。  
思考一下，视差滚动 一般带来有以下几个问题。  
1. 页面加载慢，存在大量的效果图片。  
2. 比一般传统页面卡，有大量动画元素。  
3. 视差滚动效果太花销，用户注意力没有在内容本身。  
4. 写视差滚动的程序员都是大帅哥，却依旧单身，当着备胎。

**【优化思考一：权衡使用合图】**

视差滚动需要很多元素效果图片，由于运动轨迹不同，不能用传统的 sprite 合图，所以会产生很多额外的 http 请求。但是这里应该思考，把视差滚动运动轨迹相同的元素合图，例如

```c
<div id="scene_back" class="scene">
  <img id="pokemon1" src="./img/001.png">
  <img id="pokemon4" src="./img/004.png">
  <img id="pokemon7" src="./img/007.png">
</div>
<div id="scene_center" class="scene">
  <img id="pokemon2" src="./img/002.png">
  <img id="pokemon5" src="./img/005.png">
  <img id="pokemon8" src="./img/008.png">
</div>
<div id="scene_front" class="scene">
  <img id="pokemon3" src="./img/003.png">
  <img id="pokemon6" src="./img/006.png">
  <img id="pokemon9" src="./img/009.png">
</div>
```

我们特殊把运动规则相同的元素都放到一个 div 里面，这里面可以把每个 scene 里的 img 合图，减少 http 请求数并且可以统一 js 操作处理。当然，合图大小如果过大也不好，自个权衡取最优吧。

**【优化思考二：添加 CSS3 缓动动画】**

差的视差滚动页面都会有卡顿的感觉，一方面是图片没有加载完成，另外一方面动画执行太生硬。我们在一般的视差滚动里面增加 CSS3 transition 动画，会有别具一格的效果。

优化思考一和二，请查看这个 Demo:  [v_demo4_sprite_tween.html](http://www.alloyteam.com/wp-content/uploads/2014/02/v_demo4_sprite_tween.html)

**【优化思考三：请合理使用视差滚动】**

如果视差滚动效果太花销，用户只会顾着拼命的滚动页面，好奇有什么的效果，而不在关注页面内容。这本来是希望用来吸引眼球让用户能关注内容，却本末倒置。首先，视差滚动并不适合一般论坛，门户网站或功能性网站等，通常出现新产品的宣传页面上，就是那种能吸引眼球的宣传产品页面上。现网上视差网站都是宣传某个产品或某个游戏，这也是很多优秀的视差滚动网站地址失效的原因，因为这个产品过了宣传期了。

当然，一般的网站博客都可以使用视差滚动，但建议少部分使用视差效果。优秀的视差滚动网站：[http://www.ok-studios.de/home/](http://www.ok-studios.de/home/ "http&#x3A;//www.ok-studios.de/home/")这个网站的视差效果只用两层来表现，没有过多的渲染元素。底部层为 fixed 的 background，顶部层为网页内容内容和辅助元素（例如开始右边的那两只模糊的 bird）。没有使用 js 控制不同层之间的差异滚动速度的动画，所以整个网站非常流畅不卡顿。另外，其实这种优秀视差效果是还需要射鸡师的精心设计，不，更确切的说，任何一个优秀的视差滚动都需要一名优秀的射鸡师。所以如何泡到一名射鸡师妹子，变成这个问题的核心所在。

依旧是一个冰冷幽暗的夜晚，我正认真地观看一部青年爱国片，讲述如何折腾那些可恶日本人，场面相当粗暴，血肉模糊，满满的马赛克，惨叫不断。突然，手机以一种奇怪的方式响起，居然是女神带过来，而且是最新版手机 QQ 的视频通话，当时神经错乱地按下立刻就接通了。  
” 嘿，谭伟 X，这么晚在干嘛呢！“ 女神依旧一字不留的呼唤着我的全名，依旧亲切。  
” 嘿，好久不见啦，，，，哈哈，，，，额，，，“ 我立刻调整手机拍摄到安全位置。  
” 咦，刚才好像什么画面的略过，声音有点怎么这么奇怪，，，哦，你居然还在看爸爸去那里啊？“

手 Q 视频通话你能不能不要这么流畅啊，声音传播也太好了，以前我用微信视频通话都一卡一卡的，你手 Q 体验这么棒想干嘛，想毁掉哥的一生啊。还好机智的我立刻打开 v.qq.com 随便点了个视频播放。  
” 我们来聊聊天吧，我心情不好，好久没联系你了 “

生活总是这样，坚持的，终会有结果。

我迫不及待要展示我对视差滚动的优化思考，女神惊讶之余称赞若声。我连忙再展示几个有趣的视差滚动效果

**【有趣的视差滚动效果实现方式二：路径变动】**

视差滚动一般都是纵向的，去掉惯性思维，我们可以让自己网站编程横向滚动的，当然也有打斜移动的等等，这些都统称归类为路径变动的视差滚动吧，其中最具代表性的是马里奥赛车：[http://www.nintendo.com.au/gamesites/mariokartwii/#home](http://www.nintendo.com.au/gamesites/mariokartwii/#home "http&#x3A;//www.nintendo.com.au/gamesites/mariokartwii/#home")，页面内容根据赛道的方向移动，非常的酷。

由于是使用了 mousewheel，可以不是用 backgroundPosition 的方式写视差而用 left，top 属性。核心代码如下，以 art1_oldLeft 为整个视差运动的判断标准，在某个范围如何” 拐弯 “。

```html
<div class="container">
  <article id="article1">
  <h1>阿姆施特朗回旋加速喷气式阿姆施特朗炮</h1>
  <div class="content">。。。。。。。内容。。。。。。</div>
  <img src="./img/somepic1.jpg" width="400px" height="250px">
  <div class="content">。。。。。。。内容。。。。。。</div>
  <div class="roadbg1"></div><!-- 注意我道路的dom放到了article里面-->
  <div class="roadangle"></div>
</article>
 
<article id="article2">
   <h1>阿姆施特朗回旋加速喷气式阿姆施特朗炮</h1>
   <div class="content">。。。。。。。内容。。。。。。</div>
   <img src="./img/somepic1.jpg" width="400px" height="250px">
   <div class="content">。。。。。。。内容。。。。。。</div>
   <div class="roadbg2"></div>
</article>
 
</div>
```

```javascript
function mouseWheelHandler(e) {
    var e = e || window.event; //使用wheelDelta的正负来判断鼠标是向上滚动还是向下滚动 //wheelDelta是120的倍数(鼠标下滚是为负)，detail是firefox的，3的倍数(鼠标下滚为正)。
    var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
    var art1_oldLeft = getOldStyle(article1, "left"),
        art1_oldTop = getOldStyle(article1, "top"),
        art2_oldLeft = getOldStyle(article2, "left"),
        art2_oldTop = getOldStyle(article2, "top");
    var newTop = 0,
        range = 100;
    if (art1_oldLeft < 50 && art1_oldLeft > -560) {
        newTop = art1_oldTop + delta * 50;
        range = 40;
    } else if (art1_oldLeft <= -560) {
        newTop = -700;
    } else {
        newTop = 0;
    }
    article1.style.top = newTop + "px";
    article1.style.left = art1_oldLeft + delta * range + "px";
    article2.style.top = newTop + 729 + "px";
    article2.style.left = art2_oldLeft + delta * range + "px";
}
```

[v_demo_trun5.html](http://www.alloyteam.com/wp-content/uploads/2014/02/v_demo5_trun.html)

值得注意的是：你 debug 马里奥赛车的网站，会发现，每滚一次，整个网站的所有的运动元素的 dom 的 left，top 都会改变，对于性能要求高的我们，看到可能都会冒汗三尺。虽然整站运动流程，非常棒，但我写 demo 的时候还是把统一运动轨迹的 dom 放到一个 div 里面，例如 demo 中的” 道路 “都是以 absolute 的形式嵌在 article 里面。js 操作也只操作 article。

当我自信满满向女神展现我的 demo 成果的时候，女神态度视乎平平，心不在焉的感觉。不行，女神肯定在怀疑我的实力。

**【有趣的视差滚动效果实现方式三：QQ 浏览器】**

QQ 浏览器的官网一直是视差滚动界的佼佼者，[http://browser.qq.com/index_m.html](http://browser.qq.com/index_m.html "http&#x3A;//browser.qq.com/index_m.html")，看多少次都非常酷。其实本质跟上面的” 路径变动 “原理差不多，只是单纯的横向运动加上视差元素被旋转过了而已。先看个挫版的 Demo

核心代码如下：（js 就不贴出来，自个在 Demo 查看吧）

```html
.rotateBlock{
  position: absolute;
  left: 300px;
  top: -2000px;
  -webkit-transform: rotate(45deg);
  -webkit-transform-origin: left top;
}
 
.block{
  width: 2000px;
  height: 3000px;
  position: absolute;
 
  line-height: 3000px;
  font-size: 200px;
}
</style>
<body>
 
<div class="container">
  <div id="rotateBlock" class="rotateBlock">
  <div id="green_b" class="block green_b">
    Green <span class="sub_head"> Happiness is under the tree that year</span>
  </div>
  <div id="orange_b" class="block orange_b">
    Red <span class="sub_head"> Youth is like a fire </span>
  </div>
  <div id="blue_b" class="block blue_b">
    Blue <span class="sub_head">Life is like a boat </span>
  </div>
</div>
```

class 为 block 就是我们的视差元素，他的父类为 rotateBlock，进行了 transform 旋转，视差元素扩大一定程度的长宽就能看出效果。

[v_demo6_qqbrowser_temp.html](http://www.alloyteam.com/wp-content/uploads/2014/02/v_demo6_qqbrowser_temp.html)

**【有趣的视差滚动效果实现方式三：QQ 浏览器（带响应式）】**

这里可能还有个比较有趣的地方，如何让自己的视差滚动带有响应式设计。上面 Demo 你拉伸页面是不能让内容跟着浏览器变化而改动页面中心。这里的做法：以一个小宽高的 div (可为 0px) 居中在整个页面上，然后比绝对定位的方式把视差元素填到这个 div 里面。那么页面的长宽就不会影响到页面内容居中的问题了。

```html
html,body{
  overflow: hidden;
  position: relative;
  margin: 0;
 
  width: 100%;
  height: 100%;
}
 
.center_location{
  width: 10px;
  height: 10px;
  margin: 0;
  padding: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  overflow: visible;
  /* background: red;*/
}
 
.rotateBlock{
  position: absolute;
  -webkit-transform: rotate(45deg);
  -webkit-transform-origin: left top;
}
 
.block{
  width: 1500px;
  height: 2000px;
 
  margin-top: -1000px;
  position: absolute;
  line-height: 2000px;
  font-size: 150px;
  font-family: '微软雅黑';
  color: rgba(255,255,255,.5);
  -webkit-transition:left .5s;
}
</style>
<body>
 
<div class="center_location">
 
  <div id="rotateBlock" class="rotateBlock">
    <div id="green_b" class="block green_b">Green for Youth</div>
    <div id="orange_b" class="block orange_b">Red for Sunshine</div>
    <div id="blue_b" class="block blue_b">Blue for Life</div>
  </div>
 
</div>
```

[v_demo6_qqbrowser.html](http://www.alloyteam.com/wp-content/uploads/2014/02/v_demo6_qqbrowser.html)

” 额～～～非常棒，不然这样吧，我先去洗澡，等下再聊 “ 看完 demo，女神略带羞涩的作这样的回答。  
” 恩，好吧 “

机智的我当然知道女神的意思，说出” 我先去洗澡 “这样的结束性交流语句，我只能盖上电脑，默默离开。  
。。。。。。。。。。。。。。。。。。。  
。。。。。。。。。。。

哎~~，女神明明这么晚视频通话我出来吃饭，还说在餐厅内展示 demo 不容易理解，说要上酒店展示。  
哎~~，明明在酒店上，我很认真讲解了我 demo 和思路，最后女神却以” 我要洗澡了 “结束交流。  
哎～～，以我多年和女神网上聊天的经验表示，她不想聊天了。我只好独自离开了酒店。

博客前的小朋友可能觉得，这次 demo 素材跟上次不同个层次啊。你想想都 2 月 14 号半夜了，情侣都去约会了，剩我在那里写这个烂博客，还有什么心情。还好，隔壁那对情侣好像吵架了，而且还大打出手，互扇面耳，发出 “啪啪啪啪” 声音，女的可能被扇痛了，发出惨叫声，真是好开心啊~~~~~ 哈哈哈啊哈啊哈哈。