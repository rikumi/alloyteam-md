---
title: Styled Components：让样式也成为组件
date: 2017-05-15
author: TAT.rocket
source_link: http://www.alloyteam.com/2017/05/guide-styled-components/
---

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
        color: ${(props) => (props.primary ? "SteelBlue" : "palevioletred")};
`;
```

    <Title primary>Hello world</Title>
     

上面两种写法非常相似，实际上还是要用 CSS 的语法编写样式。但是第一种写法需要 className 或 style 作为 “中间人” 使 JS 找到对应的样式，而 styled components 的写法中样式组件暴露 props 让外层 JS 来控制样式，不再需要 className 或 style 这样的 “中间人”，**移除了样式和组件间的映射关系**。

## 支持全部 CSS 特性

实际上 styled components 使用的还是 CSS，因此完美**支持 CSS 的所有特性**。伪类，媒体查询，keyframes 都可以在 styled components 中实现：

```css
const Title = styled.h1`
    font-size: 1.5em;
    text-align: center;
    color: palevioletred;
 
    &:hover {
        background-color: #ddd;
    }
 
    @media (max-width: 650px) {
        font-size: 1em;
    }
 
`;
```

上例中，鼠标放在 “Hello world” 的时候会变成灰色，窗口宽度少于 650px 的时候文字大小会变成 1em。

## CSS 作用域

CSS 有一个痛点 ——CSS 的作用域是全局的。当两个 CSS 选择器有冲突时，会根据选择器的权值确定使用哪一个选择选择器。当项目较大时，编写的 css 选择器很难判断会不会把另外一个选择器冲掉。  
解决 CSS 作用域的其中一个方法就是使用[后代选择器](http://www.w3school.com.cn/css/css_selector_descendant.asp)，这种用法和命名空间相似，即在每个选择器前添加一个父元素的选择器，从而减少选择器冲突的概率：

    #myParent .title {
        /*...*/
    }
     
    #myParent .title-primary {
        /*...*/
    }
     

LESS 和 SASS 的持选择器嵌套的语法，该语法最终会编译成后代选择器的形式，和上述方法实际上是一样的：

    #myParent {
        .title {
            /*...*/
        }
     
        .title-primary {
            /*...*/
        }
    }
     

使用嵌套语法能较好的解决 CSS 全局作用域的问题，但是，由于编译出来的 CSS 选择器过于具体，一个组件组件难以复用另一个组件的当时，你的组件样式变得孤立起来。

上文有提到，使用 styled components 会给生成的 React 组件添加一个值为随机字符串的 className。使用同一个 styled components 生成的多个 React 组件的 className 是不同的，这种随机 className 的机制使得**组件之间的 className 值不会冲突**，从而解决了 CSS 全局作用域的问题。

styled components 也支持 css 的嵌套语法：

```css
const Title = styled.h1`
        font-size: 1.5em;
        text-align: center;
        color: palevioletred;
`;
const Wrapper = styled.div`
    font-size: 1.2em;
 
    .content1 {
        color: red;
    }
 
    .content2 {
        color: green;
    }
`;
```

```html
<Wrapper>
        <div>You'd better don't do that like so:</div>
        <div className="content1">I am red</div>
        <div className="content2">I am green</div>
</Wrapper>;
```

不推荐在 styled components 中使用嵌套，因为样式组件的子组件的 className 不会被编译成随机值，这些子组件的类还是会受 CSS 的全局作用域影响。

## 分离逻辑组件和展示组件

使用 styled components，可将组件分为逻辑组件和展示组件**，逻辑组件只关注逻辑相关的部分，展示组件只关注样式**。通过解耦成两种组件，可以使代码变得更加清晰可维护。  
当逻辑有变化，如后台拉取的数据的格式有所变化时，只需关注并修改逻辑组件上的代码，展示组件的代码不用动。而当 UI 需要变化时，只需改变展示组件上的代码，并保证展示组件暴露的 props 接口不变即可。逻辑组件和展示组件各司其职，修改代码时错误发生率也会有所减少。

## CSS Module vs Styled Components

CSS Module 是另一种解决全局作用域的方案，还没了解 CSS Module 的朋友可以参考 [CSS Modules 入门及 React 中实践](http://www.alloyteam.com/2017/03/getting-started-with-css-modules-and-react-in-practice/) 和 [CSS Modules 用法教程](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)这两篇博文。  
CSS Module 只需修改构建代码和使用模块依赖引入 className 的方式即可使用，且支持 less 和 sass 的语法，样式代码不用修改即可让使用 CSS 语法的旧项目零成本接入。而 styled components 是一种全新的样式组件化的编程方式，不支持 less 和 sass 语法。  
CSS Module 还是 JS 和 CSS 分离的写法，而 styled components 实际上是在 JS 上写 CSS。习惯 JS、CSS 和 HTML 都分离的人或许不习惯 styled components 的写法。

## 最后

styled components 一种全新的控制样式的编程方式，它能解决 CSS 全局作用域的问题，而且移除了样式和组件间的映射关系。传统的 web 开发推崇 HTML、CSS、Javascript 都分离，styled components 则有点 “离经叛道” 的味道 —— 在 JS 上编写 CSS，什么东西都在 JS 里写感觉是近几年前端开发的趋势，React 就是一个活生生的例子。究竟这是不是一个好趋势，现在还不好判断，但是实践和时间总会给我们一个答案。

## 参考文章

1\.[Styled Components: Enforcing Best Practices In Component-Based Systems](https://www.smashingmagazine.com/2017/01/styled-components-enforcing-best-practices-component-based-systems/)  
2.[\[译\] 一个关于 Styled Components 的五分钟介绍](https://github.com/sqrthree/sqrthree.github.io/issues/11)  
3.[CSS Modules vs Styled Components](https://hashnode.com/post/css-modules-vs-styled-components-ciz2g9dt7000h7c535j35rbfu)