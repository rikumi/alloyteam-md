---
title: Ques 核心思想 ——CSSNamespace
date: 2015-04-06
author: TAT.donaldyang
source_link: http://www.alloyteam.com/2015/04/ques%e6%a0%b8%e5%bf%83%e6%80%9d%e6%83%b3-cssnamespace/
---

<!-- {% raw %} - for jekyll -->

> Facebook’s challenges are applicable to any very complex websites with many developers. Or any situation where CSS is bundled into multiple files and loaded asynchronously, and often loaded lazily.  
> ——@vjeux  
> 将 Facebook 换成 Tencent 同样适用。

### 同行们是怎么解决的？

-   Shadow DOM Style

Shadow DOM 的样式是完全隔离的，这就意味着即使你在主文档中有一个针对全部 `<h3>` 标签的样式选择器，这个样式也不会不经你的允许便影响到 shadow DOM 的元素。

举个例子：

![举个栗子](http://7tszky.com1.z0.glb.clouddn.com/Fst7pnZpcfxtdFcqOCQw6aWM2iMZ)

````html
<body>  
  <style>
    button {
      font-size: <span class="number">18</span>px;
      font-family: <span class="string">'华文行楷'</span>;
    }
  </style>
  <button>我是一个普通的按钮</button>
  <div></div>
 
  
```html
<script>
    <span class="keyword">var</span> host = document.querySelector(<span class="string">'div'</span>);
    <span class="keyword">var</span> root = host.createShadowRoot();
    root.innerHTML = <span class="string">'<style>button { font-size: 24px; color: blue; } </style>'</span> +
                     <span class="string">'<button>我是一个影子按钮</button>'</span>
  </script>
````

</body>
 
```

![Nacespace](http://7tszky.com1.z0.glb.clouddn.com/FhqVEOXTsoXNd8r7OgbIPZjsVOAl)

这就很好地为 `Web Component` 建立了 CSS Namespace 机制。

-   Facebook: CSS in JS

> <http://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html>

比较变态的想法，干脆直接不要用 classname，直接用 style，然后利用 js 来写每个元素的 style……

例如，如果要写一个类似 `button:hover` 的样式，需要写成这样子：

```html
<span class="keyword">var</span> Button = React.createClass({
  styles: {
    container: {
      fontSize: <span class="string">'13px'</span>,
      backgroundColor: <span class="string">'rgb(233, 234, 237)'</span>,
      border: <span class="string">'1px solid #cdced0'</span
```


<!-- {% endraw %} - for jekyll -->