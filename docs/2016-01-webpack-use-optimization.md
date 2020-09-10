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

```javascript
new webpack.ProvidePlugin({
    "R": "report",
}),
```

### 优化点五。合并公共代码

有些类库如 utils, bootstrap 之类的可能被多个页面共享，最好是可以合并成一个 js，而非每个 js 单独去引用。这样能够节省一些空间。这时我们可以用到 CommonsChunkPlugin，我们指定好生成文件的名字，以及想抽取哪些入口 js 文件的公共代码，webpack 就会自动帮我们合并好。

```javascript
new webpack.optimize.CommonsChunkPlugin({
    name: "common",
    filename: "js/common.js",
    chunks: ['index', 'detail]
}),
```

###  

### 优化点六。善用 alias。

resolve 里面有一个 alias 的配置项目，能够让开发者指定一些模块的引用路径。对一些经常要被 import 或者 require 的库，如 react, 我们最好可以直接指定它们的位置，这样 webpack 可以省下不少搜索硬盘的时间。  
[![w6](https://cloud.githubusercontent.com/assets/3348398/12219812/56bfd1aa-b78d-11e5-89d7-6bcc9230db81.png)](https://cloud.githubusercontent.com/assets/3348398/12219812/56bfd1aa-b78d-11e5-89d7-6bcc9230db81.png)

###  

### 优化点七。多个 html 怎么办

1.  使用 HtmlWebpackPlugin，有多少个 html，就排列多少个，记得不要用 inject，否则全部 js 都会注入到 html。如果真的要用 inject 模式，请务必将不需要的 js 用 exclude chunk 去掉或者用 chunk 参数填上你需要入口文件。

仅使用 app 作为注入的文件：

```javascript
plugins: [
    new HtmlWebpackPlugin({
        chunks: ["app"],
    }),
];
```

不使用 dev-helper 作为注入文件：

```javascript
plugins: [
    new HtmlWebpackPlugin({
        excludeChunks: ["dev-helper"],
    }),
];
```

如果你不想用 inject 模式，但又想使用 html-webpack-plugin，那你需要在 html 里用<script> 标签放入对应的 js，以及用入对应的 css。记住，这些资源的路径是在生成目录下的，写路径的时候请写生成目录下的相对路径。

### 优化点八. html-webpack-plugin 不用使 inject 模式没又 md5，而且不支持文件内联怎么破？

当时我就给维护者提了一个 issue--[Add inline feature to the plugin](https://github.com/ampedandwired/html-webpack-plugin/issues/157)。

然后维护者在[开发的分支](https://github.com/ampedandwired/html-webpack-plugin/tree/feature/loaders)上加了这么一个特性（证明维护者不想在插件里加内联功能了，想让我来弄）：

事件  
允许其它插件去使用执行事件  
html-webpack-plugin-before-html-processing  
html-webpack-plugin-after-html-processing  
html-webpack-plugin-after-emit

使用办法：

```javascript
compilation.plugin("html-webpack-plugin-before-html-processing", function (
    htmlPluginData,
    callback
) {
    htmlPluginData.html += "The magic footer";
    callback();
});
```

不过我还是决定自己开发一个了一个插件  
[html-res-webpack-plugin](https://github.com/lcxfs1991/html-res-webpack-plugin)，有中英文文档可以参考。其实 html-webpack-plugin 以 js 作为入口可能跟 webpack 的理念更为一致，但其实直接在 html 上放 link 和 script 更加方便直白一些。而且 html-webpack-plugin 局限性太多，如果我想在 script 上加 attribute 也是比较麻烦的事儿。所以我干脆开发一个可以允许在 html 上直接放 link 和 script 而且支持内联及 md5 的插件。

但相信我之后也会针对 html-webpack-plugin 再写一个内联及 md5 的插件，适配一直在用这个插件的人。

### 优化点九。用 gulp-webpack 速度慢乍办

[![w3](https://cloud.githubusercontent.com/assets/3348398/12219720/e2503ece-b78a-11e5-976c-e4dfc6dd5a16.png)](https://cloud.githubusercontent.com/assets/3348398/12219720/e2503ece-b78a-11e5-976c-e4dfc6dd5a16.png)

上图是初始化构建 30 个文件的用时，一共用了 13 秒。用了 externals 优化后，还有 100 多 kb，比用纯 webpack 优化要大 50 多 kb。而且，由于你用的是 gulp-webpack，每次有文件改动，都必须全部重新编译一次。因此，跟 react 搭配建议还是不要用 gulp-webpack。因为如果你使用 webpack 的话，即使初次启动时速度也并不快，但开发过程中，webpack 会自动识别，只会重新编译有修改的文件，这大大加快了编译构建速度。

没办法，老项目改造，真的要用，乍办？我提供以下思路  
（1）当非 js 文件改变的时候，不要去跑 js 打包的任务  
（2）非公共的 js 发生改变的时候，只执行这个 js 的打包任务

[![w4](https://cloud.githubusercontent.com/assets/3348398/12219743/8df48f0a-b78b-11e5-97ba-c8c31426364d.png)](https://cloud.githubusercontent.com/assets/3348398/12219743/8df48f0a-b78b-11e5-97ba-c8c31426364d.png)

下图是优化了之后，在开发过程中非公共文件修改后的编译速度。我的娘，纯 webpack 只需要 100 多 200ms。建议还是用 webpack 吧。  
[![w5](https://cloud.githubusercontent.com/assets/3348398/12219746/98bab1a8-b78b-11e5-8710-4a9cdd70996b.png)](https://cloud.githubusercontent.com/assets/3348398/12219746/98bab1a8-b78b-11e5-8710-4a9cdd70996b.png)

###  

### 优化点十。如果在通过 webpack 在项目中使用 bootstrap, jquery 以及 fontawesome

这一点对于创业公司来说可能比较有用，它们的初期产品都需要快速上线，用一些比较成熟的 UI 框架会比较好。

这样，首先我们需要 jquery 文件，并且安装 bootstrap (3.3.5) ,font-awesome (4.4.0), 以及 imports-loader (0.6.3)。还需要 sass-loader (3.1.2) 及 less-loader (2.5.3)。

然后，在主要入口文件要这么引用下面的样式文件：

    require('bootstrap/less/bootstrap.less');
    require('font-awesome/scss/font-awesome.scss');
    require('./index.scss');

在 webpack.config.js 的 entry 项目里，可以加上这个 vendor:

```javascript
common: ['jquery', 'bootstrap'],
```

在 loaders 里加入以下 loader，将 jQuery 暴露到全局:

    {
        test: path.join(config.path.src, '/libs/jq/jquery-2.1.4.min'),
        loader: 'expose?jQuery'
    },

再添加以下 loader，让 webpack 帮助复制 font 文件

    { 
            test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,  
            loader: 'url-loader?importLoaders=1&limit=1000&name=/fonts/[name].[ext]' 
    },

在 plugins 里添加 ProvidePlugin，让 $ 指向 jQuery

```javascript
new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
}),
```

这样，就可以同时使用 jQuery, Bootstrap 和 Fontawesome 了。

webpack 会取代 gulp 吗  

* * *

-   未必，但在开发环境，以及不需要一些功能如合图的情况下，webpack 可以完全取代 gulp，至少现在我有三个项目完全用 webpack 进行开发和部署上线
-   要取代 gulp, 还需要不断发展它的 loader 以及 plugin 生态，至少，完善一下开发者文档啊。


<!-- {% endraw %} - for jekyll -->