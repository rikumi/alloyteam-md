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


<!-- {% endraw %} - for jekyll -->