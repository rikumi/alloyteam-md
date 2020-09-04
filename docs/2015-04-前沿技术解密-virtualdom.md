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
  <
```


<!-- {% endraw %} - for jekyll -->