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
  inputFileSystem: null,
  recordsInputPath: null,
  recordsOutputPath: null,
  records: {},
  fileTimestamps: {},
  contextTimestamps: {},
  resolvers:
   { normal: Tapable { _plugins: {}, fileSystem: null },
     loader: Tapable { _plugins: {}, fileSystem: null },
     context: Tapable { _plugins: {}, fileSystem: null } },
  parser:
   Parser {
     _plugins:
      { 'evaluate Literal': [Object],
        'evaluate LogicalExpression': [Object],
        'evaluate BinaryExpression': [Object],
        'evaluate UnaryExpression': [Object],
        'evaluate typeof undefined': [Object],
        'evaluate Identifier': [Object],
        'evaluate MemberExpression': [Object],
        'evaluate CallExpression': [Object],
        'evaluate CallExpression .replace': [Object],
        'evaluate CallExpression .substr': [Object],
        'evaluate CallExpression .substring': [Object],
        'evaluate CallExpression .split': [Object],
        'evaluate ConditionalExpression': [Object],
        'evaluate ArrayExpression': [Object],
        'expression Spinner': [Object],
        'expression ScreenMod': [Object] },
     options: undefined },
  options:
   { entry:
      { 
        'index': '/Users/mac/web/src/page/index/main.js' },
     output:
      { publicPath: '/homework/features/model/',
        path: '/Users/mac/web/dist',
        filename: 'js/[name].js',
        libraryTarget: 'var',
        sourceMapFilename: '[file].map[query]',
        hotUpdateChunkFilename: '[id].[hash].hot-update.js',
        hotUpdateMainFilename: '[hash].hot-update.json',
        crossOriginLoading: false,
        hashFunction: 'md5',
        hashDigest: 'hex',
        hashDigestLength: 20,
        sourcePrefix: '\t',
        devtoolLineToLine: false },
     externals: { react: 'React' },
     module:
      { loaders: [Object],
        unknownContextRequest: '.',
        unknownContextRecursive: true,
        unknownContextRegExp: /^\.\/.*$/,
        unknownContextCritical: true,
        exprContextRequest: '.',
        exprContextRegExp: /^\.\/.*$/,
        exprContextRecursive: true,
        exprContextCritical: true,
        wrappedContextRegExp: /.*/,
        wrappedContextRecursive: true,
        wrappedContextCritical: false },
     resolve:
      { extensions: [Object],
        alias: [Object],
        fastUnsafe: [],
        packageAlias: 'browser',
        modulesDirectories: [Object],
        packageMains: [Object] },
     plugins:
      [ [Object],
        [Object],
        [Object],
        [Object],
        NoErrorsPlugin {},
        [Object],
        [Object] ],
     devServer: { port: 8081, contentBase: './dist' },
     context: '/Users/mac/web/',
     watch: true,
     debug: false,
     devtool: false,
     cache: true,
     target: 'web',
     node:
      { console: false,
        process: true,
        global: true,
        setImmediate: true,
        __filename: 'mock',
        __dirname: 'mock' },
     resolveLoader:
      { fastUnsafe: [],
        alias: {},
        modulesDirectories: [Object],
        packageMains: [Object],
        extensions: [Object],
        moduleTemplates: [Object] },
     optimize: { occurenceOrderPreferEntry: true } },
  context: '/Users/mac/web/' }
```

除此以外，compiler 还有一些如 run, watch-run 的方法以及 compilation, normal-module-factory 对象。我目前用到的，主要是 compilation。其它的等下一篇有机会再说。

compiler 还有 compiler.plugin 函数。这个相当于是插件可以进行处理的 webpack 的运行中的一些任务点，webpack 就是完成一个又一个任务而完成整个打包构建过程的。如下图：  
[![task](https://cloud.githubusercontent.com/assets/3348398/13768093/f46acd18-eaac-11e5-8895-a20a48e0972c.png)](https://cloud.githubusercontent.com/assets/3348398/13768093/f46acd18-eaac-11e5-8895-a20a48e0972c.png)

其它的任务点如 invalid, after-plugins, after-resolvers 具体可参考 [compiler 对象](https://webpack.github.io/docs/plugins.html#the-compiler-instance)。

### compilation 对象

至于 compilation，它继承于 compiler，所以能拿到一切 compiler 的内容（所以你也会看到 webpack 的 options），而且也有 plugin 函数来接入任务点。在 compiler.plugin ('emit') 任务点输出 compilation，会得到大致下面的对象数据，因为实在太长，我只保留了最重要的 assets 部份，如下

```javascript
assetsCompilation {
  assets:
   { 'js/index/main.js':
      CachedSource {
        _source: [Object],
        _cachedSource: undefined,
        _cachedSize: undefined,
        _cachedMaps: {} } },
  errors: [],
  warnings: [],
  children: [],
  dependencyFactories:
   ArrayMap {
     keys:
      [ [Object],
        [Function: MultiEntryDependency],
        [Function: SingleEntryDependency],
        [Function: LoaderDependency],
        [Object],
        [Function: ContextElementDependency],
     values:
      [ NullFactory {},
        [Object],
        NullFactory {} ] },
  dependencyTemplates:
   ArrayMap {
     keys:
      [ [Object],
        [Object],
        [Object] ],
     values:
      [ ConstDependencyTemplate {},
        RequireIncludeDependencyTemplate {},
        NullDependencyTemplate {},
        RequireEnsureDependencyTemplate {},
        ModuleDependencyTemplateAsRequireId {},
        AMDRequireDependencyTemplate {},
        ModuleDependencyTemplateAsRequireId {},
        AMDRequireArrayDependencyTemplate {},
        ContextDependencyTemplateAsRequireCall {},
        AMDRequireDependencyTemplate {},
        LocalModuleDependencyTemplate {},
        ModuleDependencyTemplateAsId {},
        ContextDependencyTemplateAsRequireCall {},
        ModuleDependencyTemplateAsId {},
        ContextDependencyTemplateAsId {},
        RequireResolveHeaderDependencyTemplate {},
        RequireHeaderDependencyTemplate {} ] },
  fileTimestamps: {},
  contextTimestamps: {},
  name: undefined,
  _currentPluginApply: undefined,
  fullHash: 'f4030c2aeb811dd6c345ea11a92f4f57',
  hash: 'f4030c2aeb811dd6c345',
  fileDependencies: [ '/Users/mac/web/src/js/index/main.js' ],
  contextDependencies: [],
  missingDependencies: [] }
```

assets 部份重要是因为如果你想借助 webpack 帮你生成文件，你需要像官方教程 how to write a plugin 在 assets 上写上对应的文件信息。

除此以外，compilation.getStats () 这个函数也相当重要，能得到生产文件以及 chunkhash 的一些信息，如下：

```javascript
assets{ errors: [],
  warnings: [],
  version: '1.12.9',
  hash: '5a5c71cb2accb8970bc3',
  publicPath: 'xxxxxxxxxx',
  assetsByChunkName: { 'index/main': 'js/index/index-4c0c16.js' },
  assets:
   [ { name: 'js/index/index-4c0c16.js',
       size: 453,
       chunks: [Object],
       chunkNames: [Object],
       emitted: undefined } ],
  chunks:
   [ { id: 0,
       rendered: true,
       initial: true,
       entry: true,
       extraAsync: false,
       size: 221,
       names: [Object],
       files: [Object],
       hash: '4c0c16e8af4d497b90ad',
       parents: [],
       origins: [Object] } ],
  modules:
   [ { id: 0,
       identifier: 'multi index/main',
       name: 'multi index/main',
       index: 0,
       index2: 1,
       size: 28,
       cacheable: true,
       built: true,
       optional: false,
       prefetched: false,
       chunks: [Object],
       assets: [],
       issuer: null,
       profile: undefined,
       failed: false,
       errors: 0,
       warnings: 0,
       reasons: [] },
     { id: 1,
       identifier: '/Users/mac/web/node_modules/babel-loader/index.js?presets[]=es2015&presets[]=react!/Users/mac/web/src/js/main/index.js',
       name: './src/js/index/main.js',
       index: 1,
       index2: 0,
       size: 193,
       cacheable: true,
       built: true,
       optional: false,
       prefetched: false,
       chunks: [Object],
       assets: [],
       issuer: 'multi index/main',
       profile: undefined,
       failed: false,
       errors: 0,
       warnings: 0,
       reasons: [Object],
       source: ''  // 具体文件内容}
 ],
  filteredModules: 0,
  children: [] }
```

这里的 chunks 数组里，是对应会生成的文件，以及 md5 之后的文件名和路径，里面还有文件对应的 chunkhash（每个文件不同，但如果你使用 ExtractTextPlugin 将 css 文件独立出来的话，它会与 require 它的 js 入口文件共享相同的 chunkhash），而 assets.hash 则是统一的 hash，对每个文件都一样。值得关注的是 chunks 里的每个文件，都有 source 这一项目，提供给开发者直接拿到源文件内容（主要是 js，如果是 css 且使用 ExtractTextPlugin，则请自行打印出来参考）。

例子  

* * *

接下来，会以最近我写的一个插件 [html-res-webpack-plugin](https://github.com/lcxfs1991/html-res-webpack-plugin/) 作为引子，来介绍基本的写插件原理。插件的逻辑就写在 index.js 里。

首先，将用户输入的参数在定好的函数中处理，HtmlResWebpackPlugin。

```javascript
function HtmlResWebpackPlugin(opt) {
    // 进行参数的处理
}
```

然后，新增 apply 函数，在里面写好插件需要切入的 webpack 任务点。目前 HtmlResWebpackPlugin 插件只用到 emit 这个任务点，其它几个仅作为演示。

```javascript
HtmlResWebpackPlugin.prototype.apply = function (compiler, callback) {
    // some code here
    compiler.plugin("make", function (compilation, callback) {
        // some code here
        callback(); // 异步回调，跟gulp类似
    });
    compiler.plugin("emit", function (compilation, callback) {
        // 对即将生成的文件进行处理
        _this.options.basename = _this.addFileToWebpackAsset(
            compilation,
            _this.options.template,
            true
        );
        if (_this.options.favicon) {
            _this.options.faviconBaseName = _this.addFileToWebpackAsset(
                compilation,
                _this.options.favicon
            );
        }
        _this.findAssets(compilation);
        if (!_this.options.isWatch) {
            _this.processHashFormat();
        }
        _this.addAssets(compilation); // other codes
        callback();
    });
};
```

第三步，调用 addFileToWebpackAsset 方法，写 compilation.assets，借助 webpack 生成 html 文件（项目里最新版本新增了添加 favicon 的功能，因此有 2 个 addFileToWebpackAsset 的方法）。这里的核心就是本文一开始那段给 compilation.assets 添加 source 和 size 的代码。

第四步，在开发模式下 (isWatch = true)，直接生成 html，但在生产模式下 (isWatch = true），插件会开始对静态资源（js，css）进行 md5 或者内联。项目用了\_this.options.isWatch 去进行判断。

第五步，调用 findAssets 方法是为了通过 compilation.getStats () 拿到的数据，去匹配对应的静态资源，还有找到对应的哈希 (是 chunkhash 还是 hash)。

最六步，调用 addAssets 方法，对静态资源分别做内联或者 md5 文件处理。内联资源的函数是 inlineRes, 你会看到我使用了 compilation.assets\[hashFile].source () 及 compilation.assets\[hashFile].children\[1].\_value。前者是针对于 js 的，后者是针对使用了 ExtractTextPlugin 的 css 资源。

最后一步，即是内联和 md5 完成后，再更新一下 compilation.assets 中对应生成 html 的 source 内容，才能正确地生成内联和 md5 后的内容。这一步在 addAssets 方法里有一处代码如下：

```javascript
compilation.assets[this.options.basename].source = function () {
    return htmlContent;
};
```

后记  

* * *

有兴趣可以试用一下 [html-res-webpack-plugin](https://github.com/lcxfs1991/html-res-webpack-plugin/) 这个插件（为什么要写一个新的 html 生成插件，我在 readme 里写了，此处不赘述），看看有哪些用得不爽之处。目前只是第一版，还不适合用于生产环境。希望第二版的时候能适用于更多的场景，以及性能更好。到是，我也会写第二篇插件开发文章，将本文还没提到的地方一一补充完整。也欢迎大家在这里发贴，或者指出本人的谬误之处。

<!-- {% endraw %} - for jekyll -->