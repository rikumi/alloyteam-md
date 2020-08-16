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
module.exports = function (source, other) {
    // do whatever you want
    // ...
    this.callback(null, source, other);
};
```

以上的内容，稍总结下

> -   从右到左，链式执行
> -   上一个 Loader 的处理结果给下一个接着处理
> -   node module 写法
> -   module 依赖
> -   return && this.callback()

而实际上，掌握上面所介绍的内容及思想，就可以开始写一个简单的 Loader 了，不是吗？ 由上所说的，在你的 Loader 中，你可以拿到需要处理的文件内容，并且知道了处理后的结果应该怎么去返回，在中间部分，你可以以正常使用 node 的姿态对内容进行怎样的处理，Do Whatever You Want，Loader 没有其他特殊要求。

3 如何开发更好用的 Webapck Loader

上半部分的介绍虽然确实能搭建起一个普通的 Loader 了，但这样就够了吗？

❶ 缓存

从提高执行效率上，如何处理利用**缓存**是极其重要的。 Mac OS 会让内存充分使用、尽量占满来提高交互效率。回到 Webpack，Hot-Replace 以及 React Hot Loader 也充分地利用缓存来提高编译效率。 Webpack Loader 同样可以利用缓存来提高效率，并且只需在一个可缓存的 Loader 上加一句 this.cacheable (); 就是这么简单

```javascript
// 让 Loader 缓存
module.exports = function (source) {
    this.cacheable();
    return source;
};
```

很多 Loader 都是可以缓存的，但也有例外。可以缓存的 Loader 需要具备可预见性，不变性等等。

❷ 异步

异步并不陌生，当一个 Loader 无依赖，可异步的时候我想都应该让它不再阻塞地去异步。在一个异步的模块中，回传时需要调用 Loader API 提供的回调方法 this.async ()，使用起来也很简单

```javascript
// 让 Loader 缓存
module.exports = function (source) {
    var callback = this.async(); // 做异步的事
    doSomeAsyncOperation(content, function (err, result) {
        if (err) return callback(err);
        callback(null, result);
    });
};
```

❸ 认识更多的 Loader

**pitching Loader**

前面所述的 Loader 从右到左链式执行。这种说法实际说的是 Loader 中 module.exports 出来的执行方法顺序。在一些场景下，Loader 并不依赖上一个 Loader 的结果，而只关心原输入内容。这时候，从左到右执行并没有什么问题。在 Loader 的 module 中，可使用 module.exports.pitch = function (); pitch 方法在 Loader 中便是从左到右执行的，并且可以通过 data 这个变量来进行 pitch 和 normal 之间传递。

```javascript
module.exports.pitch = function (remaining, preceding, data) {
    if (somothingFlag()) {
        return (
            "module.exports = require(" +
            JSON.stringify("-!" + remaining) +
            ");"
        );
    }
    data.value = 1;
};
```

具体的实践可以查看 style-loader，里面就有使用到 pitch。

**raw loader**

默认的情况，原文件是以 UTF-8 String 的形式传入给 Loader，而在上面有提到的，module 可使用 buffer 的形式进行处理，针对这种情况，只需要设置 module.exports.raw = true; 这样内容将会以 raw Buffer 的形式传入到 loader 中了

```javascript
module.exports = function (content) {};
module.exports.raw = true;
```

❹ 善用 Loader 中的 this

Loader API 将提供给每一个 Loader 的 this 中，API 可以让我们的调用方式更加地方便，更加灵活。 

**data**  pitch loader 中可以通过 data 让 pitch 和 normal module 进行数据共享。 

**query**  则能获取到 Loader 上附有的参数。 如 require ("./somg-loader?ls"); 通过 query 就可以得到 "ls" 了。 

**emitFile**  emitFile 能够让开发者更方便的输出一个 file 文件，这是 webpack 特有的方法，使用的方法也很直接

```javascript
emitFile((name: string), (content: Buffer | String), (sourceMap: { ... }));
```

在 file-loader 中有调用到 this.emitFile (url, content); 这个方法，具体可以查看其源码了解。

更多的 API 就不在此 一 一 说明了，建议查看官网文档了解。最后推荐一个工具模块 loader-utils，大多数的 Loader 都会用上它来解析或者使用它提供的一些 util 方法，很方便。

话不多说

针对 Loader 的基础介绍大致就到这了，不多，希望这篇文章能够对 Webpack Loader 有一个大致的了解。 更多进阶的方案及实战经验容我再整理整理，迟些输出。


<!-- {% endraw %} - for jekyll -->