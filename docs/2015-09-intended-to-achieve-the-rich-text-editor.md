---
title: 手把手实现富文本编辑器
date: 2015-09-14
author: TAT.dorsywang
source_link: http://www.alloyteam.com/2015/09/intended-to-achieve-the-rich-text-editor/
---

<!-- {% raw %} - for jekyll -->

# 前言

最近尝试去写一个富文本编辑器，觉得应该也不难，但没想到还是花了不少时间去写前期的主要逻辑，其间太多的边角逻辑是没有考虑到的。原因是前期走了很多弯路，单纯的一点一点的去实现功能，有分支功能出现就一点一点的修补，到最后发现代码量很多，逻辑很复杂。最后痛下决心，静下心来分析了一下，思考用理论逻辑去铺垫根基，才算是构建了一个还算满意的基础逻辑。真心觉得，理论才是一切事情的开始点，缜密的理论逻辑才能建造基乎无 bug 的代码。  

前面的都是些废话，由于该文本编器实现了 execCommaond 的部分方法，下面的内容相对比较复杂，对实现不感兴趣的可以忽略，如果是妹子可以直接联系笔者交流交流

# 功能

富文本编辑器实现如下的功能

-   实现 fake 原生 execCommand 的能力
-   修改 style 的能力

其实很多能力，原生的 execCommand 已经帮我们做好了，但我们的编辑器要有与 execCommand 相同的能力，以备原生无法实现的时候，我们的编辑器还是可以实现。

## API 能力

-   标签插入与删除
-   style 修改

便签的修改能力  
比如一段代码

```html
<div>abcd</div>;
```

如果 abc 被选中之后，执行 execCommand 之后的代码是在 abc 外包裹一个 strong 标签  
变成

    <div><strong>abc</strong>d</div>

如果 b 再次选中执行 execCommand ('bold') 命令后，会变成

```html
<div>
    <strong>a</strong>b<strong>c</strong>
</div>;
```

可以看到原来的 strong 被分离了，变成单独的两个，还有一些更复杂的情况，如下

```html
<div><strong>ab<u><strong>cd<u>b<span><strong>pp</strong></span></u><strong></u></strong></div>
```

像这个串，如果没有良好的理论基础与抽象建模，靠手动的代码去处理基乎是不可能的。

## 第一步

### 串的正则化

如上那个复杂的串，其树结构如下  
最上面的是根结点，叶子结点都是文本节点 (textNode)

### 我们可以看到规律

叶子结点向上回溯的过程中，通过的结点会给我们赋予不同的功能，但我们要操作的节点，如果像 strong、underline 一定程度是与样式有关的，我们把它们称为样式结点  
如果我们直接删掉叶子结点最近的祖先中的样式结点，很有可能会影响到其他的叶子结点，这时候我们就要把样式结点的影响最小化，就要先进行正则处理

正则化的过程就是要把样式结点转化到叶子结点的上面，每个样式结点只控制一个我们想要直接操作的叶子结点  
如下的转化过程

正则化的过程的同时，我们还要修剪一些无用的结点，比如空的 span 结点，比如空的 textNode，转化完了之后的树，我们处理起来变得很简单

正则化的实现也很简单，从 ROOT 结点进行中序遍历的算法，即先访问根结点，再从左向右依次访问子结点，然后一直到叶子结点，找出叶子结点的样式结点次续，并删除经过的样式结点，然后把它们插入到每个叶子结点的上面

```javascript
            var scan = function(node, inhrintStyles){
                // 已经是叶子节点了
                if(node.nodeType === node.TEXT_NODE){
 
                   if(inhrintStyles.length){
                       leafNodes.push({
                            inhrintStyles: inhrintStyles.concat([]),
                            node: node
                       });
```


<!-- {% endraw %} - for jekyll -->