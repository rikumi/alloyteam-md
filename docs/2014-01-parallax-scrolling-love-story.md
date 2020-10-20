---
title: 视差滚动的爱情故事
date: 2014-01-05
author: TAT.bizai
source_link: http://www.alloyteam.com/2014/01/parallax-scrolling-love-story/
---

<!-- {% raw %} - for jekyll -->

故事说起在一个冰冷幽暗的夜晚上，我正思考的十分重要的人生问题，这周末该去那里 happy 好呢？是宅在家里好呢，或者宅在家里好呢，还是宅在家里好呢？这时，万年隐身的 QQ 竟然浮起浅色聊天框，我去！不得了，居然是女神主动联系我，女神一定是因为我俊朗的五官，185 的模特身材而深深地迷恋上我了，呵呵呵呵呵呵。

“诶，谭伟 X，你在干嘛呢？”  
“没啊，在思考人生。”   难道这是要约我的节奏吗？在妹子前必须保持冷静。  
“那个这周我要搞一个游戏宣传的页面，设计师说用【视差滚动】的效果，你能做个 demo 页给我看看？”

。。。。。。。。。没事！虽然跟我预想有点出入，但女神这是在考验我！

**【定义】**

所谓的视差滚动，就是在页面滚动过程中，多层次的元素进行不同程度的位移，带来立体的视差效果。还有很多的奇思妙想的展现方式，都是滚动页面触发的，也可称为视差滚动。视差滚动里面最基础的就是切换背景，这点其实一个 CSS 就满足了

**【视差滚动原理一】**  
background-attachment: fixed || scroll || local  
默认是 scroll，内容跟着背景走，而视差滚动页面里用 fixed，背景相对页面固定而不跟内容滚动。

很快地我就做出了一个 demo 出来，还特意配上几张优雅的图片和极富内涵的词句，女神一定会因为我的文采而爱上我的，而且，那些看似简单的 “我是内容” 不断重复，其实只要细心就会发现里面隐藏着我的表白，情商如此之高的女神，一定会发现，然后我们就可以幸福的在一起，在爱情的滋润下，我很快就能升职加薪，当上总经理，出任 CEO，赢取白富美，走上人生巅峰。哈哈哈哈哈哈哈哈，诶？好像不用赢取白富美，那就挑战白富美。

[demo1_base](http://www.alloyteam.com/wp-content/uploads/2014/01/demo1_base.html "查看 demo1")

“咦，怎么是静态的，谭伟 X，能不能帮我做个会动的那种的视差滚动，麻烦了么么哒～”

。。。。。。居然完全没有留意到我溢出的文采和隐藏的表白。。。。。没事！虽然跟我预想有点出入，但女神这是在考验我！

**【视差滚动原理二】**  
女神想要些更加丰富的效果，也对，像我这么内涵有档次的程序员，当然要来写非常酷的动画效果。  
在原理的 demo1 的基础上，我在 scroll 事件上添加一些动画事件。

```javascript
window.addEventListener("scroll", function (e) {
    var scrollTop = window.scrollY;
    if (scrollTop > 0 && scrollTop &lt; articleHeight) {
        title1.classList.add("title-anim");
        content1.classList.add("content-anim");
    } else if (scrollTop >= articleHeight && scrollTop &lt; articleHeight * 2) {
        title2.classList.add("title-anim");
        content2.classList.add("content-anim");
    } else if (
        scrollTop >= articleHeight * 2 &&
        scrollTop &lt; articleHeight * 3
    ) {
        title3.classList.add("title-anim2");
        content3.classList.add("content-anim");
    }
});
```

视差滚动的表现方式非常多，滚动到页面某个值后会触发一个 CSS3 动画，这也是众多视差滚动中常见的一种。

[demo2_anim](http://www.alloyteam.com/wp-content/uploads/2014/01/demo2_anim.html)

(这个 Demo 使用了 CSS3 动画，请使用现代浏览器查看)

**【视差滚动原理三】**  
视差滚动中最突出的内容就是立体的视差效果，最具有说明代表性的就是超级玛丽的游戏场景

[![supermario](http://www.alloyteam.com/wp-content/uploads/2014/01/supermario.jpg)](http://www.alloyteam.com/wp-content/uploads/2014/01/supermario.jpg)

当玩家操作马里奥移动时，水管和墙块更马里奥在同一水平层，移动速度最快。天上的白云为中层背景图，移动速度中等。而小山丘是最远的背景图，移动速度最慢。三个层次内容按不同速度移动，就会带来一种立体的视差效果。

在 dom 结构上，把同一层的 dom 元素都放到一个 div 里面，html 结构如下。

```c
&lt;div id="scene_back" class="scene">
    &lt;img id="pokemon1" src="./img/001.png">
    &lt;img id="pokemon4" src="./img/004.png">
    &lt;img id="pokemon7" src="./img/007.png">
&lt;/div>
&lt;div id="scene_center" class="scene">
    &lt;img id="pokemon2" src="./img/002.png">
    &lt;img id="pokemon5" src="./img/005.png">
    &lt;img id="pokemon8" src="./img/008.png">
&lt;/div>
&lt;div id="scene_front" class="scene">
    &lt;img id="pokemon3" src="./img/003.png">
    &lt;img id="pokemon6" src="./img/006.png">
    &lt;img id="pokemon9" src="./img/009.png">
&lt;/div>
```

在页面滚动过程中，我们获取页面的 scrollTop 的值，根据不同参数值去设置各自 scene 的 top 值，这样滚动页面的时候，不同的速度就出来了

```javascript
var sceneBack = document.getElementById("scene_back"),
    sceneCenter = document.getElementById("scene_center"),
    sceneFront = document.getElementById("scene_front");
var old_top1 = 0,
    old_top2 = 200,
    old_top3 = 700;
addEvent(window, "scroll", onScroll);
onScroll();
function onScroll(e) {
    var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
    sceneBack.style.top = old_top1 + scrollTop * 0.9 + "px";
    sceneCenter.style.top = old_top2 + scrollTop * 0.7 + "px";
    sceneFront.style.top = old_top3 + scrollTop * 0.3 + "px";
}
function addEvent(eventTarget, eventType, eventHandler) {
    if (eventTarget.addEventListener) {
        eventTarget.addEventListener(eventType, eventHandler, false);
    } else {
        if (eventTarget.attachEvent) {
            eventType = "on" + eventType;
            eventTarget.attachEvent(eventType, eventHandler);
        } else {
            eventTarget["on" + eventType] = eventHandler;
        }
    }
}
```

由于女神在等待的关系，代码有点搓，也没有做兼容性，但是原理就是这样的。

[demo3_scene](http://www.alloyteam.com/wp-content/uploads/2014/01/demo3_scene.html)

这个 Demo 在非 IE6/7 下都能查看，只是，IE8 的效果并不太好。Firefox 效果最好。

**这里还有个特殊情况：在 Chrome 下查看这个 Demo 请拖动滚动条，而不是滚动鼠标。**原因是 Chrome 浏览器对鼠标的滚动做了优化处理，滚动一个齿轮幅度，其他浏览器是触发十几次 scroll 事件，而 Chrome 只会触发一次。只有一帧的动画，大家想想就知道。这里可以考虑加入缓动动画，本 Demo 是基于原理说明和泡女神，具体可以留意下一篇博客优化篇

两个 demo 完事后，很快地就交到女神手上，这次我在 demo 特意多加上几句（真的是几句？）表白，女神这次一定能发现的。而且，pokemon 都出来帮忙了，精心挑选的初代御三家来卖萌，女神一定被萌到在我广阔的胸怀，然后爱上我，我在爱情的滋润下，我很快就会升职加薪，当上总经理，出入 CEO，挑战白富美，走上人生巅峰。哈哈哈哈哈哈啊哈。

“啊，欧巴好厉害哟～最后一次拜托你，能不能做个滚动的时候角色上下出现的效果。弄完我请你吃饭哟。”

。。。。。。居然还是没有留意我的表白。。。但是，女神要请我吃饭了，想想都有点激动。不过请吃饭这事，应该反过来才对，我无数次幻想这样的场景：我在万众瞩目下，大喊 “女神我暗恋你好久了，我好喜欢你！我一定会追到你，然后我要带你去吃 KFC。”

**【视差滚动一种效果实现】**  
上下颠倒出现，这个跟原理三是一样的，唯独就是不是所有的元素都是往上升，而是一些元素上升，一些元素下沉。在计算 top 值的时候，不是 “加上”，变成 “减去” scrollTop 就会有相应的效果。亲自试了一下，效果就出来了，但是很明显有个问题，就是上升元素和下沉元素在同一水平线上的时候，这时却不是在页面正中间。这时候思考一下问题所在就好了。计算 top 的公式是下面

```c
newTop1 = oldTop1 + scrollTop * x1 ;   (x是个系数)
newTop2 = oldTop2 - scrollTop * x2 ;   (x是个系数)
```

我们假设，oldTop 为 - 1000，oldTop2 为 1000，我们希望滚动到 500 的时候，两者在同一水平线上，这时 newTop1 和 newTop2 都相同为 500 才能再页面中心（注意不是 0，自个想想就明白）。这样得到 x1 为 2，x2 为 0。代码如下。

```javascript
var sona = document.getElementById("sona"),
    ahri = document.getElementById("ahri");
var old_top1 = -1000,
    old_top2 = 1000;
addEvent(window, "scroll", onScroll);
onScroll();
function onScroll(e) {
    var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
    sona.style.top = old_top1 + scrollTop * 2 + "px";
    ahri.style.top = old_top2 - scrollTop * 0 + "px";
}
function addEvent(eventTarget, eventType, eventHandler) {
    if (eventTarget.addEventListener) {
        eventTarget.addEventListener(eventType, eventHandler, false);
    } else {
        if (eventTarget.attachEvent) {
            eventType = "on" + eventType;
            eventTarget.attachEvent(eventType, eventHandler);
        } else {
            eventTarget["on" + eventType] = eventHandler;
        }
    }
}
```

所以，如果在多种效果混合使用，希望滚动到某地方的时候，某两个 dom 元素在同一水平线上且在页面中间，代入参数，得到不同 x1，x2 即可。

[demo4_reverse](http://www.alloyteam.com/wp-content/uploads/2014/01/demo4_reverse.html)

这次精挑细选两个 LOL 美女来做素材，女神就可以看出我在游戏方面，和游戏方面，还有游戏方面的知识渊博。这次的任务非常简单，我很快的 Q 回女神。女神也表示了感激之情，并约定在那里吃饭。我们在 Q 上轻松的聊了起来。气氛也越来越好，看来时机成熟了。

我 “聊到这么晚了，差不多要睡了”  
女神 “嗯，都很晚了，今天晚上超冷”  
我 “妹子，话说你需不需要一个又会暖被子，又会陪着你聊天的男朋。。。”  
女神 “哈哈，不用了。我男朋友都趴在我身上，看着我跟你聊天很久了。

。

。。

。。。

。。。。。

真是一个感动的爱（diao）情（si）故事

[![yidama](http://www.alloyteam.com/wp-content/uploads/2014/01/yidama.jpg)](http://www.alloyteam.com/wp-content/uploads/2014/01/yidama.jpg)


<!-- {% endraw %} - for jekyll -->