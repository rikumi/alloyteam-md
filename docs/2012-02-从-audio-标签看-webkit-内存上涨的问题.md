---
title: 从 Audio 标签看 webkit 内存上涨的问题
date: 2012-02-28
author: TAT.melody
source_link: http://www.alloyteam.com/2012/02/%e4%bb%8eaudio%e6%a0%87%e7%ad%be%e7%9c%8bwebkit%e5%86%85%e5%ad%98%e4%b8%8a%e6%b6%a8%e7%9a%84%e9%97%ae%e9%a2%98/
---

<!-- {% raw %} - for jekyll -->

这段时间做一个关于 widget 的项目，忙了一两个月了。在临发布的时候突然出现一个问题，一个音乐 widget 的内存不断上涨，且不会回落，最终导致这个 widget 只能下架。  
因为我在 ie9 没发现内存上涨的问题，所以我觉得这是 webkit 内存管理的问题。所以一直没去看他，等待客户端的同事去解决。直到有一天，客户端同事说了一个方法，说防止 src 频繁切换，建议延迟 1s 去设置 audio 标签的 src。开始我想这不是 web 的原因，所以给予断然拒绝，另外也是怕维护麻烦。但是，我还是进行了尝试。没想到效果出奇的明显，内存基本不会上涨了。  
从这件事，我意识到了，凡事不能说绝对。因为它包括了太多情况，涵盖了很长的一段时间，而且使你不能有回旋的余地。  
下面说说解决的方法。因为我们想要的是 src 不频繁切换，所以单单做延迟是不会有任何结果的。关键是要使一首歌保持 1s 以上才会去设置它的 src。这句话我说来简简单单，但是要真正理解是需要很深入的思考的。代码我会在最后面给出来，大家可以自己试着写写，然后对照一下。  
通过客户端同事的进一步研究发现，发现对 Dom 对象的某个属性就行频繁操作就会导致上涨。这里还有个比较明显的属性就是 buffered，大家可以通过设置一个频率为 20ms 的定时器去读取这个属性，就可以进行测试了。  
以此类推，是否对于 img 标签也有类似的情况呢。这个有待各位同仁进行验证。  
相关代码:

```javascript
var id,
    audioEl = new Audio();
function loadAudio(src) {
    if (id) {
        clearTimeout(id);
        id = null;
    }
    id = setTimeout(function () {
        audioEl.src = src;
        id = null;
    }, 1000);
}
```

<!-- {% endraw %} - for jekyll -->