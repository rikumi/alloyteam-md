---
title: polymer 组件化与 vm 特性
date: 2015-05-25
author: TAT.ouvenzhang
source_link: http://www.alloyteam.com/2015/05/polymer%e7%bb%84%e4%bb%b6%e5%8c%96%e4%b8%8evm%e7%89%b9%e6%80%a7/
---

<!-- {% raw %} - for jekyll -->

#### 一、Polymer

Polymer 是 Google 在 2013 年的 Google I/O 大会上提出了一个新的 UI 框架。Polymer 的实现使用了 WebComponent 标准，并且 Polymer 可保证针对包含各种平台的 Web Component 规范本地实现的浏览器、库和组件的使用效果完全相同。

#### 1.1 Polymer 框架：

Polymer 框架可以分为三个层次：

-   基础层 (platform.js)：是基本构建块。大多数情况下，基础层都是本地浏览器的 API。
-   核心层 (polymer.js)：实现基础层的辅助器。
-   元素层：建立在核心层之上的 UI 组件或非 UI 组件。

#### 1.2 基础层

基础层包括以下技术：

-   DOM Mutation Oberservers 和 Object.observe ()：用于观察 DOM 元素的变更，是纯 JavaScript 对象。
-   指针事件：处理鼠标和触摸操作，支持所有的平台。
-   阴影 DOM：封装元素内的结构和样式，适合自定义元素。
-   自定义元素：可以自定义 HTML5 的元素。自定义元素的名字必须包含一个破折号，这是一种简单的命名空间标识，以区别于标准元素。
-   HTML 导入：包自定义元素。这些包可能包含 HTML、CSS 和 JavaScript。
-   模型驱动的视图 (MDV)：把数据直接绑定到 HTML。
-   Web 动画：一套统一的 Web 动画 API。  
    阴影 DOM、自定义元素和 HTML 元素 Web Components，是网络组件模型。Web Components 是 Polymer 框架的最重要的基础。  
    platform.js 目前浏览器还没有提供，它仅有 31KB 大小。

#### 1.3 核心层和元素层，即组件 UI 和组件逻辑

```html
<polymer-panels
    on-select="panelSelectHandler"
    selected="{{selectedPanelIndex}}"
>
        
</polymer-panels>;
```

其架构是面向组件的，它由 HTML5 元素组成，元素甚至可以用户界面，比如动画是元素，它没有 UI，而是代替点。同时响应式设计内建了许多 Widget，这意味着它们能自适应多种给定的平台，如手机、平板、桌面等。

### 二、Polymer 的一个例子

##### 1. 先看下面 polymer 的一个例子代码

````html
    
```html
<script  src="../components/platform/platform.js"></script>
````

    <!-- 下面用到的几个组件 -->
    <link rel="import" href="../components/core-header-panel/core-header-panel.html">
    <link rel="import" href="../components/core-toolbar/core-toolbar.html">
    <link rel="import" href="../components/paper-tabs/paper-tabs.html">

 

````

##### 2\. Polymer 使用 HTML imports 技术来加载组件。

HTML imports 提供了依赖管理, 确保自定义元素及其所有的依赖项都在使用之前被加载进来。

##### 3\. 要增加一个工具条 (toolbar), 可以在 body 标签内添加下面的代码:

```html
    <core-header-panel> 
        <core-toolbar> 
        <!-- 添加一些选项卡,以paper-开头的是Material design风格的标签,具有很炫酷的效果 --> 
        <paper-tabs valueattr=<span class="string">"name"</span> selected=<span class="string">"all"</span> <span class="keyword">self</span>-end> 
            <paper-tab name=<span class="string">"all"</span>>所有</paper-tab> 
                <paper-tab name=<span class="string">"favorites"</span>>收藏</paper-tab> 
                </paper-tabs> 
            </core-toolbar> 
        <!-- 主要的页面内容将会放在这里 -->  
        </core-header-panel>  
    <core-header-panel>
 
````

元素是一个简单的容器，例如包含一个 header 和一些内容。默认情况下，header 保持在屏幕的顶部，但也可以设置为随内容滚动。core-toolbar 元素作为容器，可以存放 选项卡 (tab) 的，菜单按钮以及其他控件。  
给迪例子较为简单，目前由于以下兼容性 Polymer 用的还不是很多，但是通过 Polymer 组件化的思想，也可以给我们一些组件未来化的方向。

### 三、Polymer 的 vm 特性

#### 3.1、数据的双向绑定

Polymer 支持双向的数据绑定。数据绑定通过扩展 HTML 和 DOM API 来支持应用的 UI (DOM) 及其底层数据 (数据模型) 之前的有效分离。更新数据模型会反映在 DOM 上，而 DOM 上的用户输入会立即赋值到数据模型上。  
对于 Polymer elements 来说，数据模型始终就是 element 本身。比如想想这个简单的 element：


<!-- {% endraw %} - for jekyll -->