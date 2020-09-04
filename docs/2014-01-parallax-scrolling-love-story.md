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
    if (scrollTop > 0 && scrollTop < articleHeight) {
        title1.classList.add("title-anim");
        content1.classList.add("content-anim");
    } else if (scrollTop >= articleHeight && scrollTop < articleHeight * 2) {
        title2.classList.add("title-anim");
        content2.classList.add("content-anim");
    } else if (
        scrollTop >= articleHeight * 2 &&
        scrollTop < articleHeight * 3
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


<!-- {% endraw %} - for jekyll -->