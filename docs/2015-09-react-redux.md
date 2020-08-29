---
title: React 数据流管理架构之 Redux 介绍
date: 2015-09-30
author: TAT.joeyguo
source_link: http://www.alloyteam.com/2015/09/react-redux/
---

<!-- {% raw %} - for jekyll -->

### [原文地址](https://github.com/joeyguo/blog/issues/3)

### 继 Facebook 提出 Flux 架构来管理 React 数据流后，相关架构开始百花齐放，本文简单分析 React 中管理数据流的方式，以及对 Redux  进行较为仔细的介绍。

### 

React  

* * *

> " A JAVASCRIPT LIBRARY FOR BUILDING USER INTERFACES "

在 React 中，UI 以组件的形式来搭建，组件之间可以嵌套组合。另，React 中组件间通信的数据流是单向的，顶层组件可以通过 props 属性向下层组件传递数据，而下层组件不能向上层组件传递数据，兄弟组件之间同样不能。这样简单的单向数据流支撑起了 React 中的数据可控性。

那么，更全面的组件间通信形式该怎么实现呢？

1.  嵌套组件间，上层组件向下层组件传递回调函数，下层组件触发回调来更新上层组件的数据。
2.  以事件的形式，使用发布订阅的方式来通知数据更新。
3.  Flux ---- Fackbook 提出的管理 React 数据流的架构。Flux 不像一个框架，更是一种组织代码的推荐思想。就像 “引导数据流流向的导流管”。
4.  其他的 “导流管”。ReFlux，Redux 等。

前两种形式其实也足够在小应用中跑起来。但当项目越来越大的时候，管理数据的事件或回调函数将越来越多，也将越来越不好管理了。 对于后两种形式，个人经过对比后，可以看出 Redux 对 Flux 架构的一些简化。如 Redux 限定一个应用中只能有单一的 store，这样的限定能够让应用中数据结果集中化，提高可控性。当然，不仅如此。

### Redux

Redux 主要分为三个部分 Action、Reducer、及 Store

#### Action

在 Redux 中，action 主要用来传递操作 State 的信息，以 Javascript Plain Object 的形式存在，如

    {
      type: 'ADD_FILM',
      name: 'Mission: Impossible'
    }

在上面的 Plain Object 中，type 属性是必要的，除了 type 字段外，action 对象的结构完全取决于你，建议尽可能简单。type 一般用来表达处理 state 数据的方式。如上面的 'ADD_FILM' 表达要增加一个电影。而 name 表达了增加这个电影的电影名为 'Mission: Impossible'。那么，当我们需要表达增加另一部电影时，就需要另外一个 action，如

    {
      type: 'ADD_FILM',
      name: 'Minions'
    }

上面写法没有任何问题，但细想，当我们增加的电影越来越多的时候，那这种直接声明的 Plain Object 将越来越多，不好组织。实际上，我们可以通过创建函数来生产 action，这类函数统称为 Action Creator，如

```css
function addFilm(name) {
    return { type: "ADD_FILM", name: name };
}
```

这样，通过调用 addFilm (name) 就可以得到对应的 Action，非常直接。

#### Reducer

有了 Action 来传达需要操作的信息，那么就需要有根据这个信息来做对应操作的方法，这就是 Reducer。 Reducer 一般为简单的处理函数，通过传入旧的 state 和指示操作的 action 来更新 state，如

```javascript
function films(state = initialState, action) {
  switch (action.type) {
 
  case 'ADD_FILM':
    // 更新 state 中的 films 字段
    return [{
```


<!-- {% endraw %} - for jekyll -->