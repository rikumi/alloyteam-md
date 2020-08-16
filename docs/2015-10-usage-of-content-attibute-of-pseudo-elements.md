---
title: 伪元素 content 的应用
date: 2015-10-31
author: TAT.will
source_link: http://www.alloyteam.com/2015/10/usage-of-content-attibute-of-pseudo-elements/
---

<!-- {% raw %} - for jekyll -->

日常开发中，我们常用:before,:after 来实现一些效果，比如

\- 边框   
    ![](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ20151031-3@2x.png)  
- 图标

    ![](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ20151031-2@2x.png)

此时的 content 中只是为了伪元素能渲染出来而声明

```css
	div:before{
	  content: "";
	}
```

事实上，content 属性不仅仅支持字符串，也支持一些内置的 css 方法。

使用 `content: attr(arribute-name)`可以实现 HTML 与 CSS 的 “通讯”，使得伪元素能读取当前元素的属性。看以下例子

![](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ20151031-1@2x.png)

在图中，要实现多行文本的自动截断，然而，设计上还在第三行末尾增加了一个小箭头，没办法使用简单粗暴的 flex-box 的`-webkit-line-clamp:3` 来搞定。

通过拜读[移动端做文本尾行留空截断处理的一个方案](http://www.w3ctech.com/topic/616) ， 实现了这个效果。  
这时就可以用伪元素了。具体实现上，before 和 after 均通过 content 获取文本，before 展示前两行，而 after 则通过 `padding-right` 与 `text-indent` 的配合，给箭头腾了个空位。

![](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ20151031-6@2x.png)![](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ20151031-4@2x.png)![](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ20151031-5@2x.png)

  当然，这只是 attr 的一个应用场景，还可以通过 content 来实现一个自定义的 [tooltip](http://jackosborne.com/demos/2010/tooltip/) 等等。

content 属性还支持 url 方法嵌入图片

```css
content: url("./image.png");
```

不过可控性没有 background-image 高，所以实际场景中较少用到。

以及 [counter](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters) 方法实现自增，在此不多加叙述。

参考文章：[移动端做文本尾行留空截断处理的一个方案](http://www.w3ctech.com/topic/616)


<!-- {% endraw %} - for jekyll -->