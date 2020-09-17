---
title: Styled Components：让样式也成为组件
date: 2017-05-15
author: TAT.rocket
source_link: http://www.alloyteam.com/2017/05/guide-styled-components/
---

<!-- {% raw %} - for jekyll -->

## 前言

为了应对越来越复杂的 web 应用，组件化应运而生，React、Vue 等组件化框架使我们的程序更简单更加可维护。在一个组件内会将结构、样式和逻辑写在一起，虽然这违背了关注点分离的原则，但是这有利于组件间的隔离。为了顺应组件化的潮流，人们开始考虑使用 JS 上编写 CSS，[styled components](https://github.com/styled-components/styled-components) 就是其中一种解决方案。styled components 是一个 React 第三方库，作用是可以将样式写成组件的形式，实现在 JS 上编写 CSS。

## 基本用法

安装

    npm install -S styled-components
     

使用 styled-components 不需要再使用 className 属性来控制样式，而是将样式写成更具语义化的组件的形式，如下例：

```css
import React from "react";
import styled from "styled-components";
import { render } from "react-dom";
const Title = styled.h1`
        font-size: 1.5em;
        text-align: center;
        color: palevioletred;
`;
class App extends React.Component {
    render() {
        return <Title>Hello world</Title>;
    }
}
render(<App />, document.getElementById("app"));
```

结果：  
![](http://www.alloyteam.com/wp-content/uploads/2017/05/1_1.png)

上例中的 styled.h1 是一个标签模板函数，紧跟其后的是一个模板字符串参数，“标签模板” 和 “模板字符串” 都是 es6 的语法，具体可以参考阮一峰老师 ECMASCRIPT6 入门中的[模板字符串](http://es6.ruanyifeng.com/?search=%E6%A8%A1%E6%9D%BF&x=8&y=4#docs/string#模板字符串)和[标签模板](http://es6.ruanyifeng.com/?search=%E6%A8%A1%E6%9D%BF&x=8&y=4#docs/string#标签模板)

styled.h1 函数返回一个 React Component，styled components 会为这个 React Component 添加一个 class，该 class 的值为一个随机字符串。传给 styled.h1 的模板字符串参数的值实际上是 CSS 语法，这些 CSS 会附加到该 React Component 的 class 中，从而为 React Component 添加样式：  
![](http://www.alloyteam.com/wp-content/uploads/2017/05/1_2.png)

## 更简单地控制样式 —— props 参数

在 React 中是通过控制 className 和 style 来控制样式的，如下例，Title 组件需要判断是否有 primary 属性来判断是否渲染”title-primary” 类的样式：

```javascript
class Title extends React.Component {
    render() {
        const className = `title${this.props.primary ? " title-primary" : ""}`;
        return <div className={className}>{this.props.children}</div>;
    }
}
```

    <Title primary>Hello world</Title>
     

styled components 使用 props 来控制样式，将控制样式代码放在样式组件中，使 React 组件更加简洁：

```css
const Title = styled.h1`
    font-size: 1.5em;
    text-align: center;
    color: ${props
```


<!-- {% endraw %} - for jekyll -->