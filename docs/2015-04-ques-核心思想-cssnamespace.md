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

```html
<body>  
  <style>
    button {
      font-size: <span class="number">18</span>px;
      font-family: <span class="string">'华文行楷'</span>;
    }
  </style>
  <button>我是一个普通的按钮</button>
  <div></div>
 
  <script>
    <span class="keyword">var</span> host = document.querySelector(<span class="string">'div'</span>);
    <span class="keyword">var</span> root = host.createShadowRoot();
    root.innerHTML = <span class="string">'<style>button { font-size: 24px; color: blue; } </style>'</span> +
                     <span class="string">'<button>我是一个影子按钮</button>'</span>
  </script>
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
      border: <span class="string">'1px solid #cdced0'</span>,
      borderRadius: <span class="number">2</span>,
      boxShadow: <span class="string">'0 1px 1px rgba(0, 0, 0, 0.05)'</span>,
      padding: <span class="string">'0 8px'</span>,
      margin: <span class="number">2</span>,
      lineHeight: <span class="string">'23px'</span>
    },
    depressed: {
      backgroundColor: <span class="string">'#4e69a2'</span>,
      borderColor: <span class="string">'#1A356E'</span>,
      color: <span class="string">'#FFF'</span>
    },
  },
  propTypes: {
    isDepressed: React.PropTypes.bool,
    style: React.PropTypes.object,
  },
  render: <span class="keyword">function</span>() {
    <span class="keyword">return</span> (
      <button style={m(
        <span class="keyword">this</span>.styles.container,
        <span class="comment">// 如果压下按钮，mixin压下的style</span>
        <span class="keyword">this</span>.props.isDepressed && <span class="keyword">this</span>.styles.depressed,
        <span class="keyword">this</span>.props.style
      )}>{<span class="keyword">this</span>.props.children}</button>
    );
  }
});
 
```

几乎等同于脱离了 css，直接利用 javascript 来实现样式依赖、继承、混入、变量等问题…… 当然如果我们去看看 [React-native](https://github.com/facebook/react-native) 和 [css-layout](https://github.com/facebook/css-layout)，就可以发现，如果想通过 React 打通客户端开发，style 几乎成了必选方案。

### 我们的方案

> 我们期望用类似 `Web Component` 的方式去写 Component 的样式，但在低端浏览器根本就不支持 `Shadow DOM`，所以，我们基于 BEM 来搭建了一种 CSS Namespace 的方案。

我们的 Component 由下面 3 个文件组成：

-   main.html 结构
-   main.js 逻辑
-   main.css 样式

可参考：<https://github.com/miniflycn/Ques/tree/master/src/components/qtree>

可以发现我们的 css 是这么写的：

```html
.<span class="variable">$__title</span> {
    margin: <span class="number">0</span> auto;
    font-size: <span class="number">14</span>px;
    cursor: <span class="keyword">default</span>;
    padding-left: <span class="number">10</span>px;
    -webkit-user-select: none;
}
<span class="comment">/** 太长忽略 **/</span>
 
```

这里面有长得很奇怪的`.$__`前缀，该前缀是我们的占位符，构建系统会自动将其替换成 Component 名，例如，该 Component 为 qtree，所以生成结果是：

```html
.qtree__title {
    margin: <span class="number">0</span> auto;
    font-size: <span class="number">14</span>px;
    cursor: <span class="keyword">default</span>;
    padding-left: <span class="number">10</span>px;
    -webkit-user-select: none;
}
<span class="comment">/** 太长忽略 **/</span>
 
```

同样道理，在 `main.html` 和 `main.js` 中的对应选择器，在构建中也会自动替换成 Component 名。

这有什么好处呢？

1.  基于路径的 Namespace，路径没有冲突，那么在该项目中 Namespace 也不会冲突
2.  Component 可以任意改名，或复制重构，不会产生任何影响，便于 Component 的重构和扩展
3.  Component 相对隔离，不会对外部产生影响
4.  Component 非绝对隔离，外部可以对其产生一定影响


<!-- {% endraw %} - for jekyll -->