---
title: 前沿技术解密 ——VirtualDOM
date: 2015-04-07
author: TAT.donaldyang
source_link: http://www.alloyteam.com/2015/04/%e5%89%8d%e6%b2%bf%e6%8a%80%e6%9c%af%e8%a7%a3%e5%af%86-virtualdom/
---

<!-- {% raw %} - for jekyll -->

> 作为 `React` 的核心技术之一 `Virtual DOM`，一直披着神秘的面纱。

> 实际上，Virtual DOM 包含：
>
> 1.  Javascript DOM 模型树（VTree），类似文档节点树（DOM）
> 2.  DOM 模型树转节点树方法（VTree -> DOM）
> 3.  两个 DOM 模型树的差异算法（diff (VTree, VTree) -> PatchObject）
> 4.  根据差异操作节点方法（patch (DOMNode, PatchObject) -> DOMNode）

> 接下来我们分别探讨这几个部分：

### VTree

VTree 模型非常简单，基本结构如下：

```html
{
    <span class="comment">// tag的名字</span>
    tagName: <span class="string">'p'</span>,
    <span class="comment">// 节点包含属性</span>
    properties: {
        style: {
            color: <span class="string">'#fff'</span>
        }
    },
    <span class="comment">// 子节点</span>
    children: [],
    <span class="comment">// 该节点的唯一表示，后面会讲有啥用</span>
    key: <span class="number">1</span>
}
 
```

所以我们很容易写一个方法来创建这种树状结构，例如 React 是这么创建的：

```html
<span class="comment">// 创建一个div</span>
react.createElement(<span class="string">'div'</span>, <span class="keyword">null</span>, [
    <span class="comment">// 子节点img</span>
    react.createElement(<span class="string">'img'</span>, { src: <span class="string">"avatar.png"</span>, <span class="keyword">class</span>: <span class="string">"profile"</span> }),
    <span class="comment">// 子节点h3</span>
    react.createElement(<span class="string">'h3'</span>, <span class="keyword">null</span>, [[user.firstName, user.lastName].join(<span class="string">' '</span>)])
]);
 
```

### VTree -> DOM

这方法也不太难，我们实现一个简单的：

```html
<span class="keyword">function</span> create(vds, <span class="keyword">parent</span>) {
  <span class="comment">// 首先看看是不是数组，如果不是数组统一成数组</span>
  !<span class="keyword">Array</span>.isArray(vds) && (vds = [vds]);
  <span class="comment">//  如果没有父元素则创建个fragment来当父元素</span>
  <span class="keyword">parent</span> = <span class="keyword">parent</span> || document.createDocumentFragment();
  <span class="keyword">var</span> node;
  <span class="comment">// 遍历所有VNode</span>
  vds.<span class="keyword">forEach</span>(<span class="keyword">function</span> (vd) {
    <span class="comment">// 如果VNode是文字节点</span>
    <span class="keyword">if</span> (isText(vd)) {
      <span class="comment">// 创建文字节点</span>
      node = document.createTextNode(vd.text);
    <span class="comment">// 否则是元素</span>
    } <span class="keyword">else</span> {
      <span class="comment">// 创建元素</span>
      node = document.createElement(vd.tag);
    }
    <span class="comment">// 将元素塞入父容器</span>
    <span class="keyword">parent</span>.appendChild(node);
    <span class="comment">// 看看有没有子VNode，有孩子则处理孩子VNode</span>
    vd.children && vd.children.length &&
      create(vd.children, node);
 
    <span class="comment">// 看看有没有属性，有则处理属性</span>
    vd.properties &&
      setProps({ style: {} }, vd.properties, node);
  });
  <span class="keyword">return</span> <span class="keyword">parent</span>;
}
 
```

### diff(VTree, VTree) -> PatchObject

差异算法是 Virtual DOM 的核心，实际上该差异算法是个取巧算法（当然你不能指望用 O (n^3) 的复杂度来解决两个树的差异问题吧），不过能解决 Web 的大部分问题。

那么 React 是如何取巧的呢？

1.  分层对比

![](http://7tszky.com1.z0.glb.clouddn.com/Fhq0GHcNOOmQzOatlocjiumnfhiS)

如图，React 仅仅对同一层的节点尝试匹配，因为实际上，Web 中不太可能把一个 Component 在不同层中移动。

2.  基于 key 来匹配

还记得之前在 VTree 中的属性有一个叫 key 的东东么？这个是一个 VNode 的唯一识别，用于对两个不同的 VTree 中的 VNode 做匹配的。

![](http://7tszky.com1.z0.glb.clouddn.com/FrKv3vIeGM6PepD_gNBCrQRpsHtt)

这也很好理解，因为我们经常会在 Web 遇到拥有唯一识别的 Component（例如课程卡片、用户卡片等等）的不同排列问题。

3.  基于自定义元素做优化

React 提供自定义元素，所以匹配更加简单。

![](http://7tszky.com1.z0.glb.clouddn.com/FmEiwBAlzD1gP5u6RZG1h03dIjB8)

### patch(DOMNode, PatchObject) -> DOMNode

由于 diff 操作已经找出两个 VTree 不同的地方，只要根据计算出来的结果，我们就可以对 DOM 的进行差异渲染。

### 扩展阅读

具体可参考下面两份代码实现：

1.  @Matt-Esch 实现的：[virtual-dom](https://github.com/Matt-Esch/virtual-dom)
2.  我们自己做的简版实现，用于 Mobile 页面渲染的：[qvd](https://github.com/miniflycn/qvd)


<!-- {% endraw %} - for jekyll -->