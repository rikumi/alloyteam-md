---
title: 小米 WIFI 预定页面是如何出声的？
date: 2013-12-26
author: TAT.Minren
source_link: http://www.alloyteam.com/2013/12/how-millet-wifi-predetermined-page-aloud/
---

<!-- {% raw %} - for jekyll -->

小米又做了一个成功的营销。在首页上放了 7 个三色的小米随身 WIFI 图片，每个图片是一个琴键，各代表一个音节，按照提示可以弹出《铃儿响叮当》。然后就出现了小米 WIFI 的预订页面。

这个页面估计又要在微博、微信中疯转了。小米的互联网营销技巧实在是无法望其项背。所以这里就谈谈技术实现吧。

琴键的实现很简单，一副大的 sprite 图，分别是原始状态和按下的状态。然后在 div 中设置 backgound position 就行了。

点击的时候更新一下 div 的 class 就可以换图了。

下面就是 spirit 图了，166k，还真不小。

![](http://img03.mifile.cn/webfile/images/hd/2013122501/wifi2.png)

声音用的是一个开源库，SoundManager <http://schillmania.com/projects/soundmanager2/>

看了一下这库的功能还比较强大，可以支持 Flash、HTML5 多种方式。压缩之后 11k。还有一个环形的播放器，使用 canvas 实现的。

11k 对手机可能有点大，估计如果只用 HTML5 的话应该可以再小点。这要研究一下。


<!-- {% endraw %} - for jekyll -->