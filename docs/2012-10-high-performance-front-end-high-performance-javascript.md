---
title: 【高性能前端 3】高性能 JavaScript
date: 2012-10-10
author: TAT.yuanyan
source_link: http://www.alloyteam.com/2012/10/high-performance-front-end-high-performance-javascript/
---

<!-- {% raw %} - for jekyll -->

## 使用事件代理

有时候我们会感觉到页面反应迟钝，这是因为 DOM 树元素中附加了过多的事件句柄并且些事件句病被频繁地触发。这就是为什么说使用事件代理是一种好方法了。如果你在一个 div 中有 10 个按钮，你只需要在 div 上附加一次事件句柄就可以了，而不用去为每一个按钮增加一个句柄。事件冒泡时你可以捕捉到事件并判断出是哪个事件发出的。

## 缓存选择器查询结果

选择器查询是开销很大的方法。所以，使用选择器的次数应该越少越好，并且尽可能缓存选中的结果，便于以后反复使用。比如，下面这样的写法就是糟糕的写法：

```javascript
jQuery("#top").find("p.classA");
jQuery("#top").find("p.classB");
```

更好的写法是：

```javascript
var cached = jQuery("#top");
cached.find("p.classA");
cached.find("p.classB");
```

## 避免频繁的 IO 操作

对 cookie 与 localstorage 操作的 API 是同步的，且 cookie 与 localstorage 是多个 tab 页面间共享的，多页面同时操作时会存在同步加锁机制，建议应尽量少的对 cookie 或 localStorage 进行操作。

## 避免频繁的 DOM 操作

使用 JavaScript 访问 DOM 元素是比较慢的，因此为了提升性能，应该做到：

1.  缓存已经查询过的元素；
2.  线下更新完节点之后再将它们添加到文档树中；
3.  避免使用 JavaScript 来修改页面布局；

## 使用微类库

通常开发者都会使用 JavaScript 类库，如 jQuery、Mootools、YUI、Dojo 等，但是开发者往往只是使用 JavaScript 类库中的部分功能。为了更大的提升性能，应尽量避免使用这类大而全的类库，而是按需使用微类库来辅助开发。


<!-- {% endraw %} - for jekyll -->