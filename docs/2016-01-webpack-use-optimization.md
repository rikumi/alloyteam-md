---
title: webpack 使用优化
date: 2016-01-14
author: TAT.heyli
source_link: http://www.alloyteam.com/2016/01/webpack-use-optimization/
---

<!-- {% raw %} - for jekyll -->

[原文链接](https://github.com/lcxfs1991/blog/issues/2)

前言  

* * *

本文不是 webpack 入门文章，如果对 webpack 还不了解，请前往题叶的 [Webpack 入门](http://segmentfault.com/a/1190000002551952)，或者阮老师的 [Webpack-Demos](https://github.com/ruanyf/webpack-demos)。

为什么要使用 Webpack  

* * *

1.  与 react 一类模块化开发的框架搭配着用比较好。
2.  属于配置型的构建工具，比较用容易上手，160 行代码可大致实现 gulp400 行才能实现的功能。
3.  webpack 使用内存来对构建内容进行缓存，构建过程中会比较快。

第 3 点我想稍微论述一下，如果看过我之前写的 [《如何写一个 webpack 插件（一）》](https://github.com/lcxfs1991/blog/issues/1)，会发现，webpack 会将文件内容存在 compilation 这个大的 object 里面，方便各种插件，loader 间的调用。虽然 gulp 也用到了流 (pipe) 这样的内存处理方式，但感觉 webpack 更进一步。gulp 是每一个任务 (task) 用一个流，而 webpack 是共享一个流。

简要回顾 Webpack 的配置  

* * *

[![webpack_config](https://cloud.githubusercontent.com/assets/3348398/12219566/59f04c1e-b784-11e5-93b5-9301333f0e22.png)](https://cloud.githubusercontent.com/assets/3348398/12219566/59f04c1e-b784-11e5-93b5-9301333f0e22.png)

Webpack 的配置主要为了这几大项目：

-   entry：js 入口源文件
-   output：生成文件
-   module：进行字符串的处理
-   resolve：文件路径的指向
-   plugins：插件，比 loader 更强大，能使用更多 webpack 的 api

   

* * *

常用 Loaders 介绍  

* * *

-   处理样式，转成 css，如：less-loader, sass-loader
-   图片处理，如: url-loader, file-loader。两个都必须用上。否则超过大小限制的图片无法生成到目标文件夹中
-   处理 js，将 es6 或更高级的代码转成 es5 的代码。如： babel-loader，babel-preset-es2015，babel-preset-react
-   将 js 模块暴露到全局，如果 expose-loader

常用 Plugins 介绍  

* * *

-   代码热替换，HotModuleReplacementPlugin
-   生成 html 文件，HtmlWebpackPlugin
-   将 css 成生文件，而非内联，ExtractTextPlugin
-   报错但不退出 webpack 进程，NoErrorsPlugin
-   代码丑化，UglifyJsPlugin，开发过程中不建议打开
-   多个 html 共用一个 js 文件 (chunk)，可用 CommonsChunkPlugin
-   清理文件夹，Clean
-   调用模块的别名 ProvidePlugin，例如想在 js 中用 $，如果通过 webpack 加载，需要将 $ 与 jQuery 对应起来

使用优化  

* * *

了解了以上介绍的 Loaders 和 Plugins 之后，基本就可以搭建一整套基于 Webpack 的构建（不需要 gulp 与 grunt，合图除外）。下面让我来介绍一下在使用过程中的一些优化点。

###  

### 优化点一。如何区分开发及生产环境

1.  在 package.json 里面的 script 设置环境变量，注意 mac 与 windows 的设置方式不一样

```javascript
"scripts": {
    "publish-mac": "export NODE_ENV=prod&&webpack -p --progress --colors",
    "publish-win":  "set NODE_ENV=prod&&webpack -p --progress --colors"
}
```

1.  在 webpack.config.js 使用 process.env.NODE_ENV 进行判断

###  

### 优化点二。使用代码热替换

使用代码热替换在开发的时候无需刷新页面即可看到更新，而且，它将构建的内容放入内在中，能够获得更快的构建编译性能，因此是官方非常推荐的一种构建方式。

####  

#### 方法一：

1. 将代码内联到入口 js 文件里   
[![w1](https://cloud.githubusercontent.com/assets/3348398/12219594/40d8b65c-b785-11e5-82f2-5557084605dc.png)](https://cloud.githubusercontent.com/assets/3348398/12219594/40d8b65c-b785-11e5-82f2-5557084605dc.png)

2. 启动代码热替换的 plugins  
[![w2](https://cloud.githubusercontent.com/assets/3348398/12219596/4a3acafa-b785-11e5-9836-0d0617c81d58.png)](https://cloud.githubusercontent.com/assets/3348398/12219596/4a3acafa-b785-11e5-9836-0d0617c81d58.png)

####  

#### 方法二：

直接实现一个 server.js，启动服务器（需要启动热替换 plugin)，下面是我在业务中用到的一个范例。具体的一些参数可以

```javascript
var webpack = require("webpack");
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackDevServer = require("webpack-dev-server");
var config = require("./webpack.config.js");
config.entry.index.unshift("webpack-dev-server/client?http://localhost:9000"); // 将执替换js内联进去
config.entry.index.unshift("webpack/hot/only-dev-server");
var compiler = webpack(config);
var server = new webpackDevServer(compiler, {
    hot: true,
    historyApiFallback: false, // noInfo: true,
    stats: {
        colors: true, // 用颜色标识
    },
    proxy: {
        "*": "http://localhost:9000", // 用于转发api数据，但webpack自己提供的并不太好用
    },
});
server.listen(9000);
```

####  

#### 方法三：

直接在 webpack.config.js 上配置。这个办法最简单，当然灵活性没有自己实现一个服务器好。  
[![w3](https://cloud.githubusercontent.com/assets/3348398/12219636/b46bef20-b786-11e5-9116-3481c8f06e95.png)](https://cloud.githubusercontent.com/assets/3348398/12219636/b46bef20-b786-11e5-9116-3481c8f06e95.png)

###  

### 优化点三.import react 导致文件变大，编译速度变慢，乍办？

1.  如果你想将 react 分离，不打包到一起，可以使用 externals。然后用<script> 单独将 react 引入  
    [![w1](https://cloud.githubusercontent.com/assets/3348398/12219645/57e0e98a-b787-11e5-8cd1-59f2190669d8.png)](https://cloud.githubusercontent.com/assets/3348398/12219645/57e0e98a-b787-11e5-8cd1-59f2190669d8.png)
2.  如果不介意将 react 打包到一起，请在 alias 中直接指向 react 的文件。可以提高 webpack 搜索的速度。准备部署上线时记得将换成 react.min，能减少文件大小 (减少约 600kb)  
    [![w2](https://cloud.githubusercontent.com/assets/3348398/12219647/64904914-b787-11e5-9736-8199c7f6a064.png)](https://cloud.githubusercontent.com/assets/3348398/12219647/64904914-b787-11e5-9736-8199c7f6a064.png)
3.  使用 module.noParse 针对单独的 react.min.js 这类没有依赖的模块，速度会更快。

###  

### 优化点四。将模块暴露到全局

如果想将 report 数据上报组件放到全局，有两种办法：

#### 方法一：

在 loader 里使 expose 将 report 暴露到全局，然后就可以直接使用 report 进行上报

    {
        test: path.join(config.path.src, '/js/common/report'),
        loader: 'expose?report'
    },

#### 方法二：

如果想用 R 直接代表 report，除了要用 expose loader 之外，还需要用 ProvidePlugin 帮助，指向 report，这样在代码中直接用 R.tdw， R.monitor 这样就可以


<!-- {% endraw %} - for jekyll -->