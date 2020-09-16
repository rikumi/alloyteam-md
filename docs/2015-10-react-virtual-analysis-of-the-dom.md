---
title: React 虚拟 DOM 浅析
date: 2015-10-31
author: TAT.李强
source_link: http://www.alloyteam.com/2015/10/react-virtual-analysis-of-the-dom/
---

<!-- {% raw %} - for jekyll -->

       在 Web 开发中，需要将数据的变化实时反映到 UI 上，这时就需要对 DOM 进行操作，但是复杂或频繁的 DOM 操作通常是性能瓶颈产生的原因，为此，React 引入了虚拟 DOM（Virtual DOM）的机制。

1.  [什么是虚拟 DOM？](http://www.alloyteam.com/2015/10/react-virtual-analysis-of-the-dom/#1)
2.  [虚拟 DOM VS 直接操作原生 DOM？](http://www.alloyteam.com/2015/10/react-virtual-analysis-of-the-dom/#2)
3.  [虚拟 DOM VS MVVM？](http://www.alloyteam.com/2015/10/react-virtual-analysis-of-the-dom/#3)
4.  [对 React 虚拟 DOM 的误解？](http://www.alloyteam.com/2015/10/react-virtual-analysis-of-the-dom/#4)

===

一、什么是虚拟 DOM？  

===============

        在 React 中，render 执行的结果得到的并不是真正的 DOM 节点，结果仅仅是轻量级的 JavaScript 对象，我们称之为 virtual DOM。

        虚拟 DOM 是 React 的一大亮点，具有 batching (批处理) 和高效的 Diff 算法。这让我们可以无需担心性能问题而” 毫无顾忌” 的随时 “ 刷新” 整个页面，由虚拟 DOM 来确保只对界面上真正变化的部分进行实际的 DOM 操作。在实际开发中基本无需关心虚拟 DOM 是如何运作的，但是理解其运行机制不仅有助于更好的理解 React 组件的生命周期，而且对于进一步优化 React 程序也会有很大帮助。

二、虚拟 DOM VS 直接操作原生 DOM？  

==========================

       如果没有 Virtual DOM，简单来说就是直接重置 innerHTML。这样操作，在一个大型列表所有数据都变了的情况下，还算是合理，但是，当只有一行数据发生变化时，它也需要重置整个 innerHTML，这时候显然就造成了大量浪费。

比较 innerHTML 和 Virtual DOM 的重绘过程如下：

innerHTML: render html string + 重新创建所有 DOM 元素

Virtual DOM: render Virtual DOM + diff + 必要的 DOM 更新

        和 DOM 操作比起来，js 计算是非常便宜的。Virtual DOM render + diff 显然比渲染 html 字符串要慢，但是，它依然是纯 js 层面的计算，比起后面的 DOM 操作来说，依然便宜了太多。当然，曾有人做过验证说 React 的性能不如直接操作真实 DOM，代码如下：

```javascript
function Raw() {
    var data = _buildData(),
        html = "";
    ...
    for(var i=0; i<data.length; i++) {
        var render = template;
        render = render.replace("{{className}}", "");
        render = render.replace("{{label}}", data[i].label);
        html += render;
    }
    ...
    container.innerHTML = html;
    ...
}
```

        该测试用例中虽然构造了一个包含 1000 个 Tag 的 String，并把它添加到 DOM 树中，但是只做了一次 DOM 操作。然而，在实际开发过程中，这 1000 个元素更新可能分布在 20 个逻辑块中，每个逻辑块中包含 50 个元素，当页面需要更新时，都会引起 DOM 树的更新，上述代码就近似变成了如下格式：

```javascript
function Raw() {
    var data = _buildData(), 
        html = ""; 
    ... 
    for(var i=0; i<data.length;
```


<!-- {% endraw %} - for jekyll -->