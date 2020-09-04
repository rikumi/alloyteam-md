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
整数：<span class="number">1</span>  +----> <span class="number">2</span>  +----> <span class="number">3</span>  +----> <span class=
```


<!-- {% endraw %} - for jekyll -->