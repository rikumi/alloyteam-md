---
title: 拥抱 sass，抛弃 compass
date: 2015-03-31
author: TAT.ycxu
source_link: http://www.alloyteam.com/2015/03/%e6%8b%a5%e6%8a%b1sass%ef%bc%8c%e6%8a%9b%e5%bc%83compass/
---

<!-- {% raw %} - for jekyll -->

## 为什么要用 sass

在选择 sass 之前，我们先说下为什么要使用 CSS Preprocessor。

大概两年前，CSS Preprocessor 其实没有这么热，而了解 sass，less，stylus 的人也还没那么多（当时三者占比 less 还是拥有绝对优势的），但很多时候就是那么 duang 的一下，然后改变就发生了，就如 html5&css3，仿佛一夜之间就遍地开花。当然这其中质变肯定是有道理值得去说道说道的。下面我们一起来对比下 css 和 CSS Preprocessor（以 sass 为例），了解下其中的优劣。

**CSS 无层级嵌套机制**

因为 css 无嵌套机制，所以造成层级方面的阅读及折叠方面极为不便，如下代码，使用 scss 就能更好的管理代码层级关系

```html
<span class="comment">// css</span>
.<span class="keyword">parent</span>{}
.<span class="keyword">parent</span> .child{}
 
<span class="comment">// scss</span>
.<span class="keyword">parent</span>{
    .child{}
}
 
```

**css 本身缺少变量机制**

举个最简单的例子，每个站点都有个主色，如果没有变量的话，我们只能每次使用都拷贝颜色，当然也有神人是可以把颜色的六位数记住，但多数肯定是记不住。下面以文本色及链接色为例：

```html
<span class="comment">// css</span>
body{
    color:<span class="comment">#333;</span>
}
a{
    color: <span class="comment">#188eee;</span>
}
.dark a{
    color: <span class="comment">#333;</span>
}
.dark a:hover{
    color: <span class="comment">#188eee;</span>
}
 
```

有了变量呢，那就简单了，直接定义一个变量，然后需要的时候调用变量即可:

```html
<span class="comment">// scss</span>
<span class="variable">$textColor</span>: <span class="comment">#333 !default;</span>
<span class="variable">$lickColor</span>: <span class="comment">#188eee !default;</span>
 
body{
    color:<span class="variable">$textColor</span>;
}
a{
    color: <span class="variable">$lick</span>-color;
}
.dark a{
    color: <span class="variable">$textColor</span>;
}
.dark a:hover{
    color: <span class="variable">$lickColor</span>;
}
 
```

注：css 变量已经正在开发中，现在的火狐其实已经支持最新的 css 变量了，而且比所有的 CSS Preprocessor 都好用，感兴趣的同学可以去尝个鲜。

**@import 不是我们所期望的功能**

随着业务功能增加及复杂性增强，多人员合作及组件开发模式是必然的。而现有的 CSS 的 `@import` 与我们所要的 `@import` 不是一个概念。为了表示两者的区别，我们直接在 `page.scss` 中导入一个 css 文件和一个 scss 文件：

page.scss

```html
@import <span class="string">"reset.css"</span>;
@import <span class="string">"mod-a"</span>;
p{
  background: <span class="comment">#0982c1;</span>
} 
 
```

\_mod-a.scss

```html
<span class="comment">//_mod-a.scss</span>
<span class="comment">//-------------------------------</span>
.hello {
  color: <span class="comment">#eee;</span>
}
 
```

最终编译出来的 page.css 文件：

```html
@import <span class="string">"reset.css"</span>;
.hello {
  color: <span class="comment">#eee;</span>
}
p{
  background: <span class="comment">#0982c1;</span>
}
 
```

可以看到，`@import "reset.css"` 没有发生改变，而 moda-a 的 scss 文件则被合进了 `page.css`，这才是我们需要的结果，需要的时候调用想用的 scss 文件，然后最终合并到一个 css 文件中。

**对可重用的代码缺少重复使用机制**

css 对于相同或相似的代码，除了一遍遍的拷贝复制或组合申明之外，不可以定义一些规则或函数，去简单重复使用，如下：

```html
<span class="comment">// 组合申明</span>
.center-block,
.container{
    margin-left: auto;
    margin-right: auto;
}
.container{
    margin-bottom: <span class="number">20</span>px;
    width: <span class="number">1200</span>px;
}
 
<span class="comment">// 拷贝使用</span>
.fixed-top{
    position: fixed;
    left: <span class="number">0</span>;
    right: <span class="number">0</span>;
    top: <span class="number">0</span>;
}
.fixed-bottom{
    position: fixed;
    left: <span class="number">0</span>;
    right: <span class="number">0</span>;
    bottom: <span class="number">0</span>;
}
 
```

而使用 scss 之后则如下：

```html
<span class="comment">// %，解析后组合申明样式</span>
%center-block{
    margin-left: auto;
    margin-right: auto;
}
 
.center-block{
    @extend %center-block;
}
.container{
    @extend %center-block;      
    margin-bottom: <span class="number">20</span>px;
    width: <span class="number">1200</span>px;
}
 
<span class="comment">// @mixin, 解析后拷贝样式 </span>
@mixin fixed(<span class="variable">$pos</span>: <span class="number">0</span>) {
    position: fixed;
    left: <span class="number">0</span>;
    right: <span class="number">0</span>;
    @<span class="keyword">if</span> <span class="variable">$pos</span> == bottom {
        bottom: <span class="number">0</span>;
    }
    @<span class="keyword">else</span> {
        top: <span class="variable">$pos</span>;
    }
}
.fixed-top{
    @<span class="keyword">include</span> fixed;
}
.fixed-bottom{
    @<span class="keyword">include</span> fixed(bottom);
}
 
```

除此之外，CSS Preprocessor 还有条件判断，循环等高大上的东西，这些都是 css 目前不具备的，当然 CSS 也正在一步步变化，为更好而革新，相信在不久的将来，CSS 也会 duang 的一下，给你眼前一亮。

说完为什么要选择 CSS Preprocessor，接下来我们说下为什么选择 sass 吧。

其实几个 CSS Preprocessor 的基本功能都差不多，都能胜任日常的开发，但如果是做基础的 css 框架及组件开发的话还是 sass 略强点。

1.  sass 的语法不容易混淆，@mixin，%，@function 定义各种用途，很清楚明白
2.  原先被人诟病的 sass 的变量机制也完善了，!default 变量和！global 变量双剑合璧，解决一切所需。
3.  自从 map 类型数据出现后，sass 处理数据方面更加突出。
4.  sass 的函数多多，应有尽有，各种选择器函数，颜色函数，判断条件，循环函数等，是你构建基础框架的得力助手

总之，就目前来说 sass 是个很好的选择。当然也许有一天 less 或其他的会超越它，或者直接到了某一天 css 本身就有了这些功能，根本不需要这些 CSS Preprocessor。而所有这些都是有极可能的。

## 为什么要抛弃 compass

用雕爷的一个字评价 compass 就是 —— 学习成本比较高，更新太慢，东西太多，实用的却很少。

作为以 sass 为基础构建的 css 框架，compass 还是非常优秀的，其思想及设计都值得借鉴。但是鉴于它的更新频率及里面的 css 代码，还是不得不吐槽下：

**跟不上 sass 的更新节奏**

sass 之所以能够在 2 年内反超 less，成为现在的首选，就是因为从版本 3.2.0 之后，不断更新，开发并优化更好的功能，吸引更多的关注。而 compass 却迟迟跟不上 sass 的脚步，严重影响 sass 的体验。

**跟不上 css 的脚步**

看下 compass 的重置，html5 的几乎没有，现在框架几乎都是 normalize+reset 的天下了；再看下其 inline-block 的 mixin 居然还有 `display: -moz-inline-stack;`，虽然穿着的是 sass 前沿的华衣，走的却是怀旧风格，怎么着都有点诡异。

**CSS3 mixin**

相信很多人用 compass 是奔着这烦人的 css3 前缀来的，可是弱弱的说句，它也过时了，现在都是基于 [can i use](http://caniuse.com/) 的数据来自动生成前缀或兼容了，各大自动化工具如 grunt/gulp 都有其相应的插件 autoprefixer，就算是不用这些自动的前缀，也有很多专门针对 css3 前缀的 scss 文件供调用，如 [css3-scss](https://github.com/marvin1023/css3-scss)

**sprite 自动生成雪碧图**

当然还有更大部分使用者是朝着这个功能来的，如果你仅是为了使用这个功能呢，替代的工具同样有的是，同样配置下自动化工具生成 sprite 分分钟搞定。

所以你为什么还在坚持使用 compass？

最后问题来了，如果选择了 sass，抛弃了 compass，用哪个做基础的框架比较合适？

请听下回分解。


<!-- {% endraw %} - for jekyll -->