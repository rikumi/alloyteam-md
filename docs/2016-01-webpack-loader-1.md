---
title: 如何开发一个 Webpack Loader (一)
date: 2016-01-13
author: TAT.joeyguo
source_link: http://www.alloyteam.com/2016/01/webpack-loader-1/
---

<!-- {% raw %} - for jekyll -->

[原文地址](https://github.com/joeyguo/blog/issues/4)

[![webpack](http://www.alloyteam.com/wp-content/uploads/2016/01/webpack.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/webpack.png)

最近，项目用了 React，配套使用了 Webpack，毕竟热替换（react-hot-loader）吸引力确实高，开发模式下使用 webpack 构建其实也够用，并且相对 gulp-webpack 来说，模块的编译等待时间大大缩小，这是生命啊！ 发布时，借助 gulp 来进行其他方面的处理，如合图，打包等。或许把这些边幅修一修、支持下，Webpack 估计就要逆天了吧？

仰望天空，还是脚踏实地，Webpack 虽非新鲜之物，但也没有多成熟。对应的 Plugin 及 Loader 的量并不多，还是有很多轮子没造，很多坑没踩呢。从源码中似乎看到了一些可能在接下来会暴漏出来的新接口，想想还有点小激动，期待下 Webpack2 吧。

碎碎念完毕，以下讲讲如何开发一个基础的 Webpack Loader 及一些心得。

1 开发 Webpack Loader 前须知

Loader 是支持链式执行的，如处理 sass 文件的 loader，可以由 sass-loader、css-loader、style-loader 组成，由 compiler 对其由右向左执行，第一个 Loader 将会拿到需处理的原内容，上一个 Loader 处理后的结果回传给下一个接着处理，最后的 Loader 将处理后的结果以 String 或 Buffer 的形式返回给 compiler。

这种链式的处理方式倒是和 gulp 有点儿类似，固然也是希望每个 loader  **只做该做的事，纯粹的事**，而不希望一箩筐的功能都集成到一个 Loader 中。

```javascript
{
    module: {
        loaders: [{
            test: /\.scss$/,
            loader: 'style!css!sass'
        }]
    }
}；
```

另一方面，虽然链式之间可以依赖其前一个 Loader 所返回的结果来执行自己的内容。但这并不支持两个 Loader 之间进行数据交流的做法，一个标准的 Loader 应该是要求着 强独立性、以及输入什么，就输出什么的可预见性。

2 Webpack Loader 基础

官网说了，A loader is a node module exporting a function.

既然是 node module，那么基本的写法可以是

```javascript
// base loader
module.exports = function (source) {
    return source;
};
```

如果你所写的 Loader 需要依赖其他模块的话，那么同样以 module 的写法，将依赖放在文件的顶部声明，让人清晰看到

```javascript
// Module dependencies.
var fs = require("fs");
module.exports = function (source) {
    return source;
};
```

上面使用返回 return 返回，是因为是同步类的 Loader 且返回的内容唯一，如果你希望将处理后的结果（不止一个）返回给下一个 Loader，那么就需要调用 Webpack 所提供的 API。 一般来说，构建系统都会提供一些特有的 API 供开发者使用。Webpack 也如此，提供了一套 Loader API，可以通过在 node module 中使用 this 来调用，如 this.callback (err, value...)，这个 API 支持返回多个内容的结果给下一个 Loader 。

```javascript
// return multiple result
module.exports = function(source, other) {
  // do whatever you want
  // ...
```


<!-- {% endraw %} - for jekyll -->