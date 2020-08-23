---
title: 从零开始 React 服务器渲染
date: 2017-01-13
author: TAT.rocket
source_link: http://www.alloyteam.com/2017/01/react-from-scratch-server-render/
---

<!-- {% raw %} - for jekyll -->

一。前言

当我们选择使用 Node+React 的技术栈开发 Web 时，React 提供了一种优雅的方式实现服务器渲染。使用 React 实现服务器渲染有以下好处：

        1\. 利于 SEO：React 服务器渲染的方案使你的页面在一开始就有一个 HTML DOM 结构，方便 Google 等搜索引擎的爬虫能爬到网页的内容。

        2\. 提高首屏渲染的速度：服务器直接返回一个填满数据的 HTML，而不是在请求了 HTML 后还需要异步请求首屏数据。

        3\. 前后端都可以使用 js

二。神奇的 renderToString 和 renderToStaticMarkup

有两个神奇的 React API 都可以实现 React 服务器渲染：renderToString 和 renderToStaticMarkup。renderToString 和 renderToStaticMarkup 的主要作用都是将 React Component 转化为 HTML 的字符串。这两个函数都属于 react-dom (react-dom/server) 包，都接受一个 React Component 参数，返回一个 String。

也许你会奇怪为什么会有两个用于服务器渲染的函数，其实这两个函数是有区别的：

        1.renderToString：将 React Component 转化为 HTML 字符串，生成的 HTML 的 DOM 会带有额外属性：各个 DOM 会有 data-react-id 属性，第一个 DOM 会有 data-checksum 属性。

        2.renderToStaticMarkup：同样是将 React Component 转化为 HTML 字符串，但是生成 HTML 的 DOM 不会有额外属性，从而节省 HTML 字符串的大小。

下面是一个在服务器端使用 renderToStaticMarkup 渲染静态页面的例子：

npm 包安装：

    npm -S install express react react-dom

server.js：

```javascript
var express = require("express");
var app = express();
var React = require("react"),
    ReactDOMServer = require("react-dom/server");
var App = React.createFactory(require("./App"));
app.get("/", function (req, res) {
    var html = ReactDOMServer.renderToStaticMarkup(
        React.DOM.body(
            null,
            React.DOM.div({
                id: "root",
                dangerouslySetInnerHTML: {
                    __html: ReactDOMServer.renderToStaticMarkup(App()),
                },
            })
        )
    );
    res.end(html);
});
app.listen(3000, function () {
    console.log("running on port " + 3000);
});
```

App.js：

```javascript
var React = require('react'),
```


<!-- {% endraw %} - for jekyll -->