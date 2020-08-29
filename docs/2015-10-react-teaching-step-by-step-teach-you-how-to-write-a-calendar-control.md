---
title: 【React 教学】Step by Step 教你写一个日历控件
date: 2015-10-22
author: TAT.sheran
source_link: http://www.alloyteam.com/2015/10/react-teaching-step-by-step-teach-you-how-to-write-a-calendar-control/
---

<!-- {% raw %} - for jekyll -->

 [React](https://facebook.github.io/react/) 是一个用于构建用户界面的 javascript 库 (官网定义)，很多人认为 React  是 [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)  中的 V（视图），React  采用下面几个主要的思想

**简单**

仅仅只要表达出你的应用程序在任一个时间点应该长的样子，然后当底层的数据变了，React  会自动处理所有用户界面的更新。

**声明式 (Declarative)**

数据变化后，React  概念上与点击 “刷新” 按钮类似，但仅会更新变化的部分。

**构建可组合的组件**

React  都是关于构建可复用的组件。事实上，通过 React  你唯一要做的事情就是构建组件。得益于其良好的封装性，组件使代码复用、测试和关注分离（separation of concerns）更加简单。

**疯狂**

React  挑战了很多传统的知识，第一眼看上去可能很多想法有点疯狂。当你阅读完这篇教程，你会对 React  的产生更多的喜爱。

下面就直奔主题一步一步为大家讲解怎么用 React 构建一个简单的日历控件，最终结果如下图所示：

[![图片 1](http://www.alloyteam.com/wp-content/uploads/2015/10/图片1.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/图片1.png)

          为了便于讲解，后续增加的 js 和 css 都写在这个 CalendarControl.html 文件里，[点击这里查看 demo](http://www.alloyteam.com/wp-content/uploads/2015/10/CalendarControl.html)。

**Step1：搭建页面**

   为了运行 React，首先你需要搭建一个页面，结构大致如下：

CalendarControl.html：

````html
<!DOCTYPE  html>
<html>
<head>
1 <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
2 
```html
<script src="./build/react.js"></script>
````

3 

```html
<script src="./build/browser.min.js"></script>
```

<style type="text/css"></style>

4 

```html
<script type="text/babel"></script>
```

</head>
<body></body>
</html>
```

下面对标行逐一做个解释：

line1   支持中文编码

line2  react.js 是运行 React 的框架，请自行去官网下载：<https://facebook.github.io/react/downloads.html>

line3  browser.min.js 的作用是将 JSX  语法转为 JavaScript  语法

line4  script  标签的 type  属性为 text/babel 。这是因为 React  独有的 JSX  语法，跟 JavaScript  不兼容。凡是使用 JSX  的地方，都要加    上 type="text/babel" 

其次，上面代码一共用了两个库： react.js  和 Browser.js ，它们必须首先加载。其中，Browser.js  的作用是将 JSX  语法转为 JavaScript。这一步很消耗时间，实际上线的时候，应该将它放到服务器完成。

**Step2: 将界面分解**

[![２](http://www.alloyteam.com/wp-content/uploads/2015/10/２.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/２.jpg)

将代码分解后，代码结构如下：

```html
<script type="text/babel">	
		var CalendarHeader = React.createClass({
			render:function(){
				return(
					<div className="headerborder">
						<p>20月</p>
						<p>2015年</p>
						<p className="triangle-left"> </p>
						<p className="triangle-right"> </p>
					</div>
				
```


<!-- {% endraw %} - for jekyll -->