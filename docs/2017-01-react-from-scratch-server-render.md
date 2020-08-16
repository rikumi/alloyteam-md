---
title: 从零开始 React 服务器渲染
date: 2017-01-13
author: TAT.rocket
source_link: http://www.alloyteam.com/2017/01/react-from-scratch-server-render/
---

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
var React = require("react"),
    DOM = React.DOM,
    div = DOM.div,
    button = DOM.button,
    ul = DOM.ul,
    li = DOM.li;
module.exports = React.createClass({
    getInitialState: function () {
        return {
            isSayBye: false,
        };
    },
    handleClick: function () {
        this.setState({
            isSayBye: !this.state.isSayBye,
        });
    },
    render: function () {
        var content = this.state.isSayBye ? "Bye" : "Hello World";
        return div(
            null,
            div(null, content),
            button({ onClick: this.handleClick }, "switch")
        );
    },
});
```

运行：

    node server.js

结果：

[![结果 1](http://www.alloyteam.com/wp-content/uploads/2017/01/结果1.png)](http://www.alloyteam.com/wp-content/uploads/2017/01/结果1.png)

三。动态的 React 组件

上例的页面中，点击 “switch” 按钮是没有反应的，这是因为这个页面只是一个静态的 HTML 页面，没有在客户端渲染 React 组件并初始化 React 实例。只有在初始化 React 实例后，才能更新组件的 state 和 props，初始化 React 的事件系统，执行虚拟 DOM 的重新渲染机制，让 React 组件真正 “ 动” 起来。

或许你会奇怪，服务器端已经渲染了一次 React 组件，如果在客户端中再渲染一次 React 组件，会不会渲染两次 React 组件。答案是不会的。秘诀在于 data-react-checksum 属性：

上文有说过，如果使用 renderToString 渲染组件，会在组件的第一个 DOM 带有 data-react-checksum 属性，这个属性是通过 adler32 算法算出来：如果两个组件有相同的 props 和 DOM 结构时，adler32 算法算出的 checksum 值会一样，有点类似于哈希算法。

当客户端渲染 React 组件时，首先计算出组件的 checksum 值，然后检索 HTML DOM 看看是否存在数值相同的 data-react-checksum 属性，如果存在，则组件只会渲染一次，如果不存在，则会抛出一个 warning 异常。也就是说，当**服务器端和客户端渲染具有相同的 props 和相同 DOM 结构的组件时，该 React 组件只会渲染一次**。

在服务器端使用 renderToStaticMarkup 渲染的组件不会带有 data-react-checksum 属性，此时客户端会重新渲染组件，覆盖掉服务器端的组件。因此，当页面不是渲染一个静态的页面时，最好还是使用 renderToString 方法。

上述的客户端渲染 React 组件的流程图如下：

[![客户端渲染流程 2](http://www.alloyteam.com/wp-content/uploads/2017/01/客户端渲染流程-2-1.png)](http://www.alloyteam.com/wp-content/uploads/2017/01/客户端渲染流程-2-1.png)

四。一个完整的例子

下面使用 React 服务器渲染实现一个简单的计数器。为了简单，本例中不使用 redux、react-router 框架，尽量排除各种没必要的东西。

项目目录如下：

[![目录](http://www.alloyteam.com/wp-content/uploads/2017/01/目录.png)](http://www.alloyteam.com/wp-content/uploads/2017/01/目录.png)

npm 包安装：

    npm install -S express react react-dom jsx-loader

webpack.config.js：webpack 配置文件，作用是在客户端中可以使用代码模块化和 jsx 形式的组件编写方式：

```javascript
var path = require("path");
var assetsPath = path.join(__dirname, "public", "assets");
var serverPath = path.join(__dirname, "server");
module.exports = [
    {
        name: "browser",
        entry: "./app/entry.js",
        output: {
            path: assetsPath,
            filename: "entry.generator.js",
        },
        module: {
            loaders: [{ test: /\.js/, loader: "jsx-loader" }],
        },
    },
    {
        name: "server-side rending",
        entry: "./server/page.js",
        output: {
            path: serverPath,
            filename: "page.generator.js", // 使用page.generator.js的是nodejs，所以需要将 // webpack模块转化为CMD模块
            library: "page",
            libraryTarget: "commonjs",
        },
        module: {
            loaders: [{ test: /\.js$/, loader: "jsx-loader" }],
        },
    },
];
```

app/App.js：根组件（一个简单的计数器组件），在客户端和服务器端都需要引入使用

```javascript
var React = require("react");
var App = React.createClass({
    getInitialState: function () {
        return {
            count: this.props.initialCount,
        };
    },
    _increment: function () {
        this.setState({ count: this.state.count + 1 });
    },
    render: function () {
        return (
            <div>
                                <span>the count is: </span>
                                
                <span onClick={this._increment}>{this.state.count}</span>
                            
            </div>
        );
    },
});
module.exports = App;
```

server/index.js：服务器入口文件：

```javascript
var express = require("express");
var path = require("path");
var page = require("./page.generator.js").page;
var app = express();
var port = 8082;
app.use(express.static(path.join(__dirname, "..", "public")));
app.get("/", function (req, res) {
    var props = {
        initialCount: 9,
    };
    var html = page(props);
    res.end(html);
});
app.listen(port, function () {
    console.log("Listening on port %d", port);
});
```

server/page.js：暴露一个根组件转化为字符串的方法

````html
var React = require("react");
var ReactDOMServer = require("react-dom/server");
var App = require("../app/App");
var ReactDOM = require("react-dom");
module.exports = function (props) {
    var content = ReactDOMServer.renderToString(
        <App initialCount={props.initialCount}></App>
    );
    var propsScript = "var APP_PROPS = " + JSON.stringify(props);
    var html = ReactDOMServer.renderToStaticMarkup(
        <html>
                        <head>            </head>
                        
            <body>
                                
                <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
                                
                
```html
<script
                    dangerouslySetInnerHTML={{ __html: propsScript }}
                ></script>
````

                                
                

```html
<script src={"assets/entry.generator.js"}></script>
```

                            
            </body>
                    
        </html>
    );
    return html;

};

````

为了让服务器端和客户端的 props 一致，将一个服务器生成的首屏 props 赋给客户端的全局变量 APP\_PROPS，在客户端初始化根组件时使用这个 APP\_PROPS 根组件的 props。

app/entry.js：客户端入口文件，用于在客户端渲染根组件，别忘了使用在服务器端写入的 APP\_PROPS 初始化根组件的 props

```javascript
var React = require("react"),
    ReactDOM = require("react-dom"),
    App = require("./App");
var APP_PROPS = window.APP_PROPS || {};
ReactDOM.render(
    <App initialCount={APP_PROPS.initialCount} />,
    document.getElementById("root")
);
````

源代码放在 github 上，懒得复制粘贴搭建项目的同学可以猛戳[这里](https://github.com/RockyRen/react-webpack-server-render-example)

github 上还有其他的服务器渲染的例子，有兴趣的同学可以参考参考：

1. [无 webpack 无 jsx 版本](https://github.com/mhart/react-server-example)

2. [使用 webpack 版本](https://github.com/webpack/react-webpack-server-side-example)

参考文章：

1\.[Rendering React Components on the Server](http://www.crmarsh.com/react-ssr/)

2. [一看就懂的 React Server Rendering（Isomorphic JavaScript）入門教學](http://blog.techbridge.cc/2016/08/27/react-redux-immutablejs-node-server-isomorphic-tutorial/)

3\.[Clientside react-script overrides serverside rendered props](http://stackoverflow.com/questions/29060523/clientside-react-script-overrides-serverside-rendered-props)

4\.[React 直出实现与原理](http://imweb.io/topic/5547892e73d4069201d83e6c)

5\.[React Server Side Rendering 解决 SPA 应用的 SEO 问题](https://blog.coding.net/blog/React-Server-Side-Rendering-for-SPA-SEO)

6\.[Server-Side Rendering with React + React-Router](https://ifelse.io/2015/08/28/server-side-rendering-with-react-and-react-router/)