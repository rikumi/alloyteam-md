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
var scan = function (node, inhrintStyles) {
    // 已经是叶子节点了
    if (node.nodeType === node.TEXT_NODE) {
        if (inhrintStyles.length) {
            leafNodes.push({
                inhrintStyles: inhrintStyles.concat([]),
                node: node,
            });
        } // 非叶子节点
    } else {
        // 如果是style节点
        // 标记这是要删除的style节点，
        if (styleTagNames.indexOf(node.tagName.toLowerCase()) > -1) {
            // inhrintStyles存在此style 不重复增加
            var exists = 0;
            for (var i = 0; i < inhrintStyles.length; i++) {
                if (inhrintStyles[i].tagName === node.tagName) {
                    exists = 1;
                    break;
                }
            }
            if (!exists) {
                inhrintStyles = inhrintStyles.concat(node);
            }
            styleNodes.push(node);
        }
        for (var i = 0; i < node.childNodes.length; i++) {
            scan(node.childNodes[i], inhrintStyles);
        }
    }
};
scan(tree, []);
```

如下代码实现删除样式结点的过程

```javascript
// 删除样式节点
for (var i = 0; i < styleNodes.length; i++) {
    var styleNode = styleNodes[i];
    var childNodes = styleNode.childNodes;
    var fragment = document.createDocumentFragment();
    var child;
    while ((child = childNodes[0])) {
        fragment.appendChild(child);
    }
    styleNode.parentNode.replaceChild(fragment, styleNode);
}
```

经过这样处理后的树，没有了任何样式结点，这也是去除样式的一个方法  
下面的代码展示将样式结点最小化到 textNode 之上的代码

```javascript
// 对叶子结点进行样式插入
for (var i = 0; i < leafNodes.length; i++) {
    var leafNode = leafNodes[i];
    if (leafNode.node.nodeValue === "") {
        leafNode.node.parentNode.removeChild(leafNode.node);
        continue;
    }
    var node;
    var styleNode;
    var frag = document.createDocumentFragment();
    var currParent = frag;
    while ((styleNode = leafNode.inhrintStyles.shift())) {
        // 去除无用atribute属性
        if (
            !donotTrimSpan &&
            styleAttrTagNames.indexOf(styleNode.tagName.toLowerCase()) > -1 &&
            !styleNode.attributes.length
        ) {
        } else {
            el = styleNode.cloneNode();
            currParent.appendChild(el);
            currParent = el;
        }
    }
    var leafNodeParent = leafNode.node.parentNode;
    var tempNode = document.createElement("span");
    leafNodeParent.replaceChild(tempNode, leafNode.node);
    currParent.appendChild(leafNode.node);
    leafNodeParent.replaceChild(frag, tempNode);
}
```

经过了这一轮的正则化处理之后， 我们主要做了以下三件事情

-   最小化样式结点到文本结点上
-   去除无用的结点
-   去除重复的结点

其实这一轮正则化之后理应要再进行更多的优化，比如

-   合并结点

正则化完成之后使我们修减样式结点变得容易很多了，为了实现 execCommand 的功能，我们要实现树的如下两个方法  
叶子结点某个样式结点的删除  
叶子结点某个样式结点的增加

### 增加的实现

先向上检查是否有该样式结点存在，如果有了就不进行添加了，如果没有，要进行添加  
添加的实现了很简单

```javascript
        setNodesUnderLabel: function(selectedNodes, labelName){
            selectedNodes.map(function(item){
                var p = item.parentNode;
 
                var hasLabel = 0;
                do{
                    if(p.childNodes.length > 1){
                        break;
                    }
 
                    if(p.tagName.toLowerCase() === labelName){
                        hasLabel = 1;
                        break;
                    }
                }while(p = p.parentNode);
 
                if(hasLabel){
                }else{
                    var label = document.createElement(labelName);
 
                    item.parentNode.replaceChild(label, item);
 
                    label.appendChild(item);
                }
            });
        },
```

删除的实现也是如此，先向上检查是否有 label 存在，有的话才删除

树的抽象功能已经建成，但后面提取最选中的叶子结点也并非一件容易的事情，主要是浏览器提供的 API 坑点太多，太不好用

## Selection & Range 对象

使用这两个父子对象，能帮我们获取被选中的区域

### Selection

就是蓝色被选中的可视区域

### Range

就是逻辑里面的一块区域，与可视化无关

### 获取 Range

从一个蓝色选中的区域中获取到 Range 对象，用如下的方法

```javascript
var selection = window.getSelection();
var range;
if (selection.rangeCount) {
    range = selection.getRangeAt(0);
}
```

拿到 Range，我们还要分析被选中的叶子节点，这里有很多坑点  
首先 Range 对象，我们常用的五个属性  
startContainer 开始选中的元素  
startOffset 开始选中的偏移  
endContainer  
endOffset  
commonAncestorContainer 共同的最近的祖先结点

startContainer 有两种情况，一种是元素，但这时被选中的是其子结点， 这时候 startOffset 代表的是被选中的子结点的 index，子结点可能是叶子结点，也可能是 element 结点，另外一种可能是叶子结点（textNode)，startOffset 代表的是 text 的偏移位置，比较坑的是，有可能偏移位置是不存在的 str，什么意思呢，就是比如  
startContainer 对应叶子结点 abcd  
startOffset 如果是 1，那就被选中的开始就是从第 1 个字符开始（下标从 0 算）即 bcd  
但 startOffset 还可能是 4，这时就坑了，开始什么都没有  
同样 endContainer 也是如此

我们的任务是要找出被选中的叶子结点，然后进行增删样式处理，当前，前提是保证已经正则化过了  
找出被选中的叶子结点并非一件容易的事情  
文章比较长，请待后续更新


<!-- {% endraw %} - for jekyll -->