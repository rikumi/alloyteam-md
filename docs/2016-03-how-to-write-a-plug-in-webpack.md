---
title: 如何写一个 webpack 插件
date: 2016-03-16
author: TAT.heyli
source_link: http://www.alloyteam.com/2016/03/how-to-write-a-plug-in-webpack/
---

<!-- {% raw %} - for jekyll -->

[原文地址](https://github.com/lcxfs1991/blog/issues/1)  

* * *

前言  

* * *

最近由于用着 html-webpack-plugin 觉得很不爽，于是乎想自己动手写一个插件。原以为像 gulp 插件一样半天上手一天写完，但令人郁闷的是完全找不到相关的文章。一进官方文档却是被吓傻了。首先是进入 [how to write a plugin](https://webpack.github.io/docs/how-to-write-a-plugin.html) 看了一页简单的介绍。然后教程会告诉你，你需要去了解 compiler 和 compilation 这两个对象，才能更好地写 webpack 的插件，然后作者给了 github 的链接给你，让你去看源代码，我晕。不过幸好最后给了一个 [plugins](https://webpack.github.io/docs/plugins.html#the-compiler-instance) 的 API 文档，才让我开发的过程中稍微有点头绪。

how to write a plugin 这个教程还是可以好好看看的，尤其是那个 simple example，它会教你在 compilation 的 emit 事件或之前，将你需要生成的文件放到 webpack 的 compilation.assets 里，这样就可以借助 webpack 的力量帮你生成文件，而不需要自己手动去写 fs.writeFileSync。

主要就是这段代码

```javascript
compilation.assets["filelist.md"] = {
    source: function () {
        return filelist;
    },
    size: function () {
        return filelist.length;
    },
};
```

基本特性介绍  

* * *

首先，定义一个函数 func，用户设置的 options 基本就在这里处理。

其次，需要设一个 func.prototype.apply 函数。这个函数是提供给 webpack 运行时调用的。webpack 会在这里注入 compiler 对象。

### compiler 对象

输出 complier 对象，你会看到这一长串的内容（如下面代码），初步一看，我看出了两大类（有补充的可以告诉我）。一个 webpack 运行时的参数，例如\_plugins，这些数组里的函数应该是 webpack 内置的函数，用于在 compiltion，this-compilation 和 should-emit 事件触发时调用的。另一个是用户写在 webpack.config.js 里的参数。隐约觉得这里好多未来都可能会是 webpack 暴露给用户的接口，使 webpack 的定制化功能更强大。

```javascript
Compiler {
  _plugins:
   { compilation: [ [Function], [Function], [Function], [Function] ],
     'this-compilation': [ [Function: bound ] ],
     'should-emit': [ [Function] ] },
  outputPath: '',
  outputFileSystem: null,
```


<!-- {% endraw %} - for jekyll -->