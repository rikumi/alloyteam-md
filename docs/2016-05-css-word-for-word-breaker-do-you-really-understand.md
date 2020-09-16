---
title: CSS 单词换行 and 断词，你真的完全了解吗
date: 2016-05-25
author: TAT.walker
source_link: http://www.alloyteam.com/2016/05/css-word-for-word-breaker-do-you-really-understand/
---

<!-- {% raw %} - for jekyll -->

背景  

* * *

某天老板在群里反馈，英文单词为什么被截断了？ 

![QQ 截图 20160523145733.png-44.5kB](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2016/05/104717l1Y.png "点击查看大图")

很显然，这是我们前端的锅，自行背锅。这个问题太简单了，css 里加两行属性，分分钟搞定。

```css
word-break: keep-all;
word-wrap: break-word;
```

开心的提交代码，刷新页面。我擦，怎么还是没有断词？不可能啊！！！ 难道这两个属性有什么兼容性问题或者有什么限制条件？为了不搬石头砸自己的脚，还是去深入了解一下。

css 单词断词、换行  

* * *

关键字： word-break,  word-wrap

**提前声明：上面的问题用这两个属性来解决并没有什么问题，这里只是再加深巩固一下知识。想了解原因的同学请直接看下一小节。**

word-break, word-wrap 这两个属性都比较常见，断词、溢出显示省略号等常见功能都需要用到它们。但具体它们分别是什么意思，各自有什么属性，可能很多人都不是很清楚。反正我不懂。每次都是从网上查一查就用上了，两个属性长得太像了，总是记不住。

来，先看文档。

```css
word-break: normal | break-all | keep-all;
```

**normal**  使用浏览器默认的换行规则。   
**break-all**  允许在单词内换行。   
**keep-all**  只能在半角空格或连字符处换行。

<http://www.w3school.com.cn/cssref/pr_word-break.asp>

```css
word-wrap: normal | break-word;
```

**normal**  只在允许的断字点换行（浏览器保持默认处理）。   
**break-word**  在长单词或 URL 地址内部进行换行。

<http://www.w3school.com.cn/cssref/pr_word-wrap.asp>

看懂了吗？反正我好像没看懂。

看图貌似会好点。

<http://www.w3school.com.cn/tiy/t.asp?f=css3_word-wrap> 

![word-break.png-6.9kB](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2016/05/104717Tfq.png "点击查看大图")

![word-wrap.png-8.7kB](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2016/05/104717zmN.png)

相信大概能看明白了，我简单总结下：

1.  word-break 当行尾放不下一个单词时，决定单词内部该怎么摆放。   
    break-all: 强行上，挤不下的话剩下的就换下一行显示呗。霸道型。   
    keep-all: 放不下我了，那我就另起一行展示，再放不下，我也不退缩。傲骄型。
2.  word-wrap 当行尾放不下时，决定单词内是否允许换行   
    normal: 单词太长，换行显示，再超过一行就溢出显示。   
    break-word: 当单词太长时，先尝试换行，换行后还是太长，单词内还可以换行。
3.  上面这些换行神马的都是针对英文单词，像 CJK (中文 / 日文 / 韩文) 这样的语言就算了，因为他们不需要，不信你读一下下面的文字

> 研表究明，汉字的序顺并不定一能影阅响读，比如当你看完这句话后，才发这现里的字全是都乱的。
>
> 这样子都可以流畅阅读，更别说断词了...
>
> 再回头来看我们的问题，理论上加上了 word-break: keep-all;word-wrap: break-word; 应该没问题了，看来还有别的坑。
>
> 空格转换  
>
> * * *
>
> 关键字：   white-space
>
> 确认 word-break 和 word-wrap 使用方法没有错后，开始检查我们自己的代码。抓包发现，后台同学返回的文本里空格全部以  来代替。 
>
> ![image_1ajjmjc0r17sp390ho2j0i6h613.png-21.5kB](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2016/05/104717juI.png)
>
> what？为什么要用转义字符代替？为什么 css 不能识别这个转义空格？
>
> 电话后台同学，告知：在很早之前的为了解决某个前端问题才这么做的。   
> 抓耳挠腮，使劲回忆了下，确实有这么回事。   
> 因为浏览器会自动将多个空格压缩为一个空格显示。为了还原用户的原本输入，才将空格进行 html 转义。
>
> 1.  很多用户会用空格来换行或者实现宽字间距
> 2.  字符画也很好玩，压缩空格就全乱了。不知道字符画的请看下面   
>     ![image_1ajjlmh8r122l1edl2eb1kqc76c9.png-14.2kB](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2016/05/104717kAZ.png)   
>     ![image_1ajjlnmssduu1p4d114p1ete2rrm.png-4.4kB](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2016/05/104717kAN.png)
>
> _专业的字符画制作人员会用全角空格来做，这样就不担心浏览器的空格合并问题了_
>
> ok, 那  暂时还不能动它。
>
> ### 为什么浏览器会自动压缩空格？
>
> 1.  规范如此，就是这么**任性** <https://www.w3.org/TR/REC-html40/struct/text.html#h-9.1>
> 2.  如果不自动压缩空格，那我们写 html 的时候就只能写成 1 行了，否则先这样的代码就会出现大段的空白。
> 3.      <div>
>         <div>
>         bananas
>         </div>
>         </div>
>
> 既然规范这么定了，埋了坑，肯定会想办法让你绕过的，想起了 white-space。  
> white-space 我们更多的时候只用到 nowrap 的属性，来配合实现... 的特效，实际它还有更多的姿势未解锁。


<!-- {% endraw %} - for jekyll -->