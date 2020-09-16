---
title: JS、CSS 以及 img 对 DOMContentLoaded 事件的影响
date: 2014-03-03
author: TAT.kerry95
source_link: http://www.alloyteam.com/2014/03/effect-js-css-and-img-event-of-domcontentloaded/
---

<!-- {% raw %} - for jekyll -->

最近在做性能有关的数据上报，发现了两个非常有意思的东西：Chrome 开发者工具的 Timeline 分析面板，以及 DOMContentLoaded 事件。一个是强大的令人发指的性能分析工具，一个是重要的性能指标，于是就用 Timeline 对 DOMContentLoaded 事件进行了一番研究。

## 前端的纯技术就是对规范的认知

什么是 DOMContentLoaded 事件？

首先想到的是查看 [W3C 的 HTML5 规范](http://www.w3.org/TR/html5/syntax.html#the-end)，DOMContentLoaded 事件在什么时候触发：

> Once the user agent stops parsing the document, the user agent must run the following steps:  
> 1. Set the current document readiness to "interactive" and the insertion point to undefined.  
> Pop all the nodes off the stack of open elements.  
> 2. If the list of scripts that will execute when the document has finished parsing is not empty, run these substeps:  
> 2.1 Spin the event loop until the first script in the list of scripts that will execute when the document has finished parsing has its "ready to be parser-executed" flag set and the parser's Document has no style sheet that is blocking scripts.  
> 2.2 Execute the first script in the list of scripts that will execute when the document has finished parsing.  
> 2.3 Remove the first script element from the list of scripts that will execute when the document has finished parsing (i.e. shift out the first entry in the list).  
> 2.4 If the list of scripts that will execute when the document has finished parsing is still not empty, repeat these substeps again from substep 1.  
> 3. Queue a task to fire a simple event that bubbles named **DOMContentLoaded** at the Document.

规范总是那么的晦涩，但至少有一点是可以明确了的，就是在 JS（不包括动态插入的 JS）执行完之后，才会触发 DOMContentLoaded 事件。

接下来看看 [MDN 上有关 DOMContentLoaded 事件的文档](https://developer.mozilla.org/en-US/docs/Web/Reference/Events/DOMContentLoaded)：

> The DOMContentLoaded event is fired when the document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading  
> Note: Stylesheet loads block script execution, so if you have a `<script>` after a `<link rel="stylesheet" ...>`, the page will not finish parsing - and DOMContentLoaded will not fire - until the stylesheet is loaded.

这么看来，至少可以得出这么一个理论：DOMContentLoaded 事件本身不会等待 CSS 文件、图片、iframe 加载完成。  
它的触发时机是：加载完页面，解析完所有标签（不包括执行 CSS 和 JS），并如规范中所说的设置 `interactive` 和执行每个静态的 script 标签中的 JS，然后触发。  
而 JS 的执行，需要等待位于它前面的 CSS 加载（如果是外联的话）、执行完成，因为 JS 可能会依赖位于它前面的 CSS 计算出来的样式。

## 实践是检验真理的唯一标准

### 实验 1：DOMContentLoaded 事件不直接等待 CSS 文件、图片的加载完成

index.html:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title></title>
    <link rel="stylesheet" type="text/css" href="./css/main.css">
</head>
<body>
    <p>Content</p>
    <img src="./img/chrome-girl.jpg">
</body>
</html>
```

[![71fca778-a249-11e3-8824-2aae4440c857](http://www.alloyteam.com/wp-content/uploads/2014/03/71fca778-a249-11e3-8824-2aae4440c857.png)](http://www.alloyteam.com/wp-content/uploads/2014/03/71fca778-a249-11e3-8824-2aae4440c857.png)  
图一

如果页面中没有 script 标签，DOMContentLoaded 事件并没有等待 CSS 文件、图片加载完成。

Chrome 开发者工具的 Timeline 面板可以帮我们记录下浏览器的一举一动。图一中红色小方框中的蓝线，表示 DOMContentLoaded 事件，它右边的红线和绿线分别表示 load 事件和 First paint，鼠标 hover 在这些线露出灰色方框下面的一小部分时就会出现带有说明文字的 tips（这交互够反人类的对吧！）。

### 实验 2：DOMContentLoaded 事件需要等待 JS 执行完才触发

index.html:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title></title>
    <script type="text/javascript">
        console
```


<!-- {% endraw %} - for jekyll -->