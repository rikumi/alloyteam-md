---
title: 和弦推导逻辑简析与实现，以及 Raphael 库试用
date: 2015-06-01
author: TAT.littenli
source_link: http://www.alloyteam.com/2015/06/he-xian-tui-dao-luo-ji-jian-xi-yu-shi-xian-yi-ji-raphael-ku-shi-yong/
---

<!-- {% raw %} - for jekyll -->

![](http://litten.github.io/assets/blogImg/chord1.jpg)

诚然，吉他有上千个和弦。世界上最厉害的吉他大师，也无法一眼辨识出所有的和弦。  
更多时候，我们熟记几个基本的和弦，然后通过一定的计算法则，去推导其他的和弦。因而推导的逻辑就非常重要。

《吉他三月通》一书把这乐理洋洋洒洒说了一百多页，我想试着让事情简单一些。  
最后，我们将逻辑实现成一个[小程序](http://litten.github.io/assets/demo/chord/index.html)，可以方便打印出想要推导的和弦。

### 音乐与数学的不同

在这之前，我们得谈点有趣的事情，它们都有共同的原因：

-   为什么我们会觉得某首歌很 “中国风”？
-   为什么某些日本的传统音乐听起来很 “诡异”？
-   为什么钢琴要做成黑键白键，所有键都一样不行吗？

> 我们常用正整数：1、2、3、4、5、6、7 ，  
> 对应和弦：C、D、E、F、G、A、B，  
> 对应音符：Do、Re、Me、Fa、So、La、Ti

每个正整数之间，都是相差 1；而按频率高低排列的音符，由于历史原因，它们并不是等差数列。

实际上，`4 比理想的要低一点，7 比理想的要高一点`，其他的 5 个音，则基本在理想线性曲线上！

![](http://litten.github.io/assets/blogImg/chord2.png)

这 5 个跟理想比较吻合的音，就是天朝古代的五音阶：宫、商、角、徵、羽。“中国风” 的歌曲，大多使用了这五个音，所以让人感到舒服和温和；而日本的传统音乐，反其道而行用了许多 4 与 7（其实这么说也不太对，是受阴阳调式影响，但表现上大概如此），有一种幽静阴深的效果。

所以，以上问题的原因是**音符的递增不完全是线性的**！

我们得把 4 和 7 这两个不和谐点标志出来，就出现了 “半音和全音” 的理论。  
把 `3 到 4` 和 `7 到 1` 这两个不满一个跨度的叫做`半音`；其他相邻音符之间，都叫做`全音`。  
而造物主的神奇之处在于：`两个半音等于一个全音`。

音乐的世界跟数学的这点不同，会在后面逻辑推导上会给我们一点小小的麻烦。

### 音乐家与程序员

试想，如果程序员要完成描述音阶的数据结构，会如何设计呢？

通常，应该先规划 “最小粒度”。而 “半音” 刚好是最合适的选择。

音乐家与程序员的处理方式如出一辙，钢琴上夹在两个白键之间的黑键，吉他相邻品丝之间，都是为了表现半音。

如果用程序描述吉他品丝的关系就是：

```html
<span class="keyword">var</span> scale = [<span class="number">2</span>, <span class="number">2</span>, <span class="number">1</span>, <span class="number">2</span>, <span class="number">2</span>, <span class="number">2</span>, <span class="number">1</span>]; <span class="comment">//3-4是半音，7-1也是半音，相隔1品；其他是全音，相隔2品</span>
 
```

### 吉他与尺子

知道了这些，我们就好比掌握了`一把尺子的刻度`。

在尺子上，如果一个刻度表示 1cm，那么从 3cm 往后推两个格子，就是 5cm；  
把吉他想象成尺子，一个刻度表示半音，和弦之间就可以推导了。

与众不同的是，这把尺子首尾相连，更像一个循环的圈。

```html
刻度：      <span class="number">2</span>品      <span class="number">2</span>品       <span class="number">1</span>品       <span class="number">2</span>品      <span class="number">2</span>品       <span class="number">2</span>品       <span class="number">1</span>品       <span class="number">2</span>品       <span class="number">2</span>品
和弦：C  +----> D  +----> E  +----> F  +----> G  +----> A  +----> B  +----> C  +----> D  +----> ……
音符：<span class="keyword">Do</span> +----> Re +----> Me +----> Fa +----> So +----> La +----> Ti +----> <span class="keyword">Do</span> +----> Re +----> ……
整数：<span class="number">1</span>  +----> <span class="number">2</span>  +----> <span class="number">3</span>  +----> <span class="number">4</span>  +----> <span class="number">5</span>  +----> <span class="number">6</span>  +----> <span class="number">7</span>  +----> <span class="number">1</span>  +----> <span class="number">2</span>  +----> ……
 
```

因而，`一个和弦可以有多种方式弹奏`。  
比如 C 和弦，除了最基础的开放式（不需要用食指横按品丝）指法，我们还可以用 A 和弦的指法实现：

    C = B + 1品
    = A + 2品+1品
    = A + 3品
     

所以，我们用食指横按住第 3 品（或者用变调夹夹第 3 品），然后再加上 A 和弦的开放式指法，就形成了一个 C 和弦。

同理也可以用 E 和弦实现：

    C = B + 1品
    = A + 2品+1品
    = G + 2品 + 2品+1品
    = F + 2品 + 2品 + 2品+1品
    = E + 1品 + 2品 + 2品 + 2品+1品
    = E + 8品
     

横按的位置就在第 8 品上。

其实大部分情况下，我们都是用 A，E，Am，Em 这四个和弦去推导其他和弦，理由是这几个和弦横按与转换比较方便，特别是在扫弦的时候。

### 程序实现

明确逻辑之后，就差程序实现了。但这之前，我们定了程序的最小粒度是 1 品，就无可避免遇到一个问题：  
如果 `A + 2 品 = B`，那 `A + 1 品 = ？`

这个和弦介于 A 与 B 之间，人们把它称为`升 A` 或`降 B`，对应记法是 `A#`或 `Bb`。

至此我们可以列出，用 E 指法和 A 指法推导的所有和弦的横按位置：

```html
<span class="keyword">var</span> positions = {
    <span class="string">"E"</span>: {
        <span class="string">"A"</span>: <span class="number">5</span>,
        <span class="string">"A#"</span>: <span class="number">6</span>,
        <span class="string">"Bb"</span>: <span class="number">6</span>,
        <span class="string">"B"</span>: <span class="number">7</span>,
        <span class="string">"C"</span>: <span class="number">8</span>,
        <span class="string">"C#"</span>: <span class="number">9</span>,
        <span class="string">"Db"</span>: <span class="number">9</span>,
        <span class="string">"D"</span>: <span class="number">10</span>,
        <span class="string">"D#"</span>: <span class="number">11</span>,
        <span class="string">"Eb"</span>: <span class="number">11</span>,
        <span class="string">"E"</span>: <span class="number">12</span>,
        <span class="string">"F"</span>: <span class="number">1</span>,
        <span class="string">"F#"</span>: <span class="number">2</span>,
        <span class="string">"Gb"</span>: <span class="number">2</span>,
        <span class="string">"G"</span>: <span class="number">3</span>,
        <span class="string">"G#"</span>: <span class="number">4</span>,
        <span class="string">"Ab"</span>: <span class="number">4</span>
    },
    <span class="string">"A"</span>: {
        <span class="string">"A"</span>: <span class="number">12</span>,
        <span class="string">"A#"</span>: <span class="number">1</span>,
        <span class="string">"Bb"</span>: <span class="number">1</span>,
        <span class="string">"B"</span>: <span class="number">2</span>,
        <span class="string">"C"</span>: <span class="number">3</span>,
        <span class="string">"C#"</span>: <span class="number">4</span>,
        <span class="string">"Db"</span>: <span class="number">4</span>,
        <span class="string">"D"</span>: <span class="number">5</span>,
        <span class="string">"D#"</span>: <span class="number">6</span>,
        <span class="string">"Eb"</span>: <span class="number">6</span>,
        <span class="string">"E"</span>: <span class="number">7</span>,
        <span class="string">"F"</span>: <span class="number">8</span>,
        <span class="string">"F#"</span>: <span class="number">9</span>,
        <span class="string">"Gb"</span>: <span class="number">9</span>,
        <span class="string">"G"</span>: <span class="number">10</span>,
        <span class="string">"G#"</span>: <span class="number">11</span>,
        <span class="string">"Ab"</span>: <span class="number">11</span>
    }
};
 
```

同时，将 E、A 的开放和弦的指型描述出来：

```javascript
chord_shapes = {
    "M E": {
        name: "Maj",
        chord: [
            [3, 2],
            [4, 3],
            [5, 3],
        ],
        bars: [{ from_string: 6, to_string: 1, fret: 1 }],
    },
    "m E": {
        name: "m",
        chord: [
            [4, 3],
            [5, 3],
        ],
        bars: [{ from_string: 6, to_string: 1, fret: 1 }],
    },
    "M A": {
        name: "Maj",
        chord: [
            [2, 3],
            [3, 3],
            [4, 3],
            [6, "x"],
        ],
        bars: [{ from_string: 5, to_string: 1, fret: 1 }],
    },
    "m A": {
        name: "m",
        chord: [
            [2, 2],
            [3, 3],
            [4, 3],
            [6, "x"],
        ],
        bars: [{ from_string: 5, to_string: 1, fret: 1 }],
    },
};
```

分别传递 “和弦名”,“指法”，“类型” 作为参数，画出和弦图像的接口就可以这样定义：

    createChord("C", "A", "M A"); 画出C和弦，用A指法，定义类型是大三和弦(Maj)
    createChord("D", "A", "m A"); 画出Dm和弦，用A指法，定义类型是小三和弦(Minor)
     

### Raphael.js

理清了逻辑，那么如何画出这样的和弦图？

![](http://7tszky.com1.z0.glb.clouddn.com/FpjATJHtUiNMOyfkNMWX9u0YYMCP)

Dom 自然是可以的，Canvas 也是个好选择，因为它能省去好多定位的样式。但考虑到后续可拓展成五线谱，其包含了许多复杂的乐符，SVG 是最好的选择。[Raphael.js](http://raphaeljs.com/) 是很方便处理 SVG 的 JS 库。

Raphael.js 以其兼容性（IE6+），实用性，以及良好的接口著称。  
在官方的入门例子里，可看到从元素定义到事件绑定，基本我们平时处理 dom 没多大区别。

```html
<span class="comment">//创建一个画布</span>
<span class="keyword">var</span> paper = <span class="keyword">new</span> Raphael(<span class="string">"paper"</span>, <span class="number">500</span>, <span class="number">500</span>);
<span class="comment">//画圆</span>
<span class="keyword">var</span> circle = paper.circle(<span class="number">50</span>, <span class="number">50</span>, <span class="number">40</span>);
circle.attr({
    <span class="string">"stroke"</span>: <span class="string">"red"</span>,
    <span class="string">"stroke-width"</span>: <span class="number">4</span>,
    <span class="string">"fill"</span>: <span class="string">"blue"</span>
});
circle.mousedown(<span class="keyword">function</span> () {
    circle.attr(<span class="string">"fill"</span>, <span class="string">"red"</span>);
});
 
```

其核心模块大概分为：

-   动画 Animation
-   元素 Element
-   矩阵 Matrix
-   画布 Paper
-   事件 Eve
-   核心 Raphael（通用函数库，比如颜色转换，贝塞尔曲线描绘等）

一个和弦图的绘制，其实只需要 `Paper` 模块的三个方法：  
`path`（和弦外框）,`rect`（指型）,`text`（文字说明）

具体可参考以下 Demo，就不赘述了。

### Demo

以下是一个 [Demo](http://litten.github.io/assets/demo/chord/index.html)，将上述 chord_shapes 的指型补充得更完整。

并且尝试用 A 指型，自动生成了 C 调的 7 个常用和弦。

End.

<!-- {% endraw %} - for jekyll -->