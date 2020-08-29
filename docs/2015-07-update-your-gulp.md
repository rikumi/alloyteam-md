---
title: 是时候升级你的 gulp 到 4.0 了
date: 2015-07-29
author: TAT.云中飞扬
source_link: http://www.alloyteam.com/2015/07/update-your-gulp/
---

<!-- {% raw %} - for jekyll -->

[  
![](https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png)  
](http://gulpjs.com/)

# [](http://www.alloyteam.com/2015/07/update-your-gulp/#不得不说的废话)不得不说的废话

随着前端工程化的推进，相信越来越多的项目都用上了自动化构建。  
对前端构建来说，使用最多的莫过于 [grunt](http://gruntjs.com/) 和 [gulp](http://gulpjs.com/)。

本文的主角是 gulp，所以花一两句话来介绍 gulp 还是有必要的。

gulp 是一款基于 [stream](https://nodejs.org/api/stream.html) 的前端构建工具，由于底层使用 stream，可以将多个任务无缝串连在一起，相比使用临时文件的 grunt 要快不少；同时也不用像 grunt 一样写一大堆配置文件，每一个任务都可以可编程的来完全控制逻辑。

gulp 比 grunt “快” 这是公认的事实，这里不再过多比较两者之间的差异，还是那句话，各有千秋吧。

# [](http://www.alloyteam.com/2015/07/update-your-gulp/#gulp-40的变化)gulp 4.0 的变化

扯完了废话，开始进入正题。  
gulp 团队大概在两个月前提交了 [4.0 分支](https://github.com/gulpjs/gulp/tree/4.0)，新版本带来了新的 api，新 api 给任务流程控制带来了 “革命性” 的进步。  
但新版本并未提交到 npm，可能现在连 alpha 都算不上吧，不过还是可以先进行体验的。

### [](http://www.alloyteam.com/2015/07/update-your-gulp/#安装gulp-40)安装 gulp 4.0

想体验 4.0 只有通过 github 安装，执行以下两条命令即可在本地畅爽地使用 gulp 4.0 了。

`npm install gulpjs/gulp#4.0 -g`

`npm install gulpjs/gulp#4.0 --save-dev`

gulp 4.0 相对以前的版本发生了不少变化

1.  使用新的任务系统 `bach`，替换了老版本使用的 `orchestrator`

也许会更快些？实际上 gulp 已经很快了，除非是超大型项目，否则几乎不用担心 gulp 构建会花太多时间，不过寻求更快总是好的。

1.  移除了 gulp.task 传递三参数的用法

即这种用法将报错

```javascript
gulp.task("watch", ["default"], function () {
    // TODO
    // watch file
});
```

在 gulp4.0 之前，这种用法将会保证 default 任务先执行完再执行 watch 任务，gulp 的任务流程控制就是这么实现的，不过这也是老版本 gulp 的弱点之一。

对我们这些普通使用者来说，最大的变化有两点

### [](http://www.alloyteam.com/2015/07/update-your-gulp/#gulptask的变化)`gulp.task` 的变化

gulp 官方建议：

1.  当我们想在命令行通过敲 `gulp taskname` 的方式执行一个任务，这时候你应该使用 `gulp.task` 注册 `taskName`
2.  当一个较复杂的任务（如 dist）由很多个子任务组合而成的时候，子任务使用具名函数即可，不用单独为每个子任务进行注册，而只需将 `dist` 使用 `gulp.task` 进行注册，以前的版本则必须将每一个子任务都先使用 `gulp.task` 进行注册，然后再组合出 `dist`，详细用法见最后的例子。

gulp.task 又增加了一种用法，即传递一个具名函数作为参数，将自动注册以该函数名命名的任务

```javascript
function compile() {
    // TODO
    gulp.src("./src/*.js").pipe(uglify()).pipe(gulp.dest("./dist/js"));
}
gulp.task(compile);
```

等同于

```javascript
gulp.task("compile", function () {
    // TODO
    gulp.src("./src/*.js").pipe(uglify()).pipe(gulp.dest("./dist/js"));
});
```

两者都可以通过命令行运行 `gulp compile` 执行任务

### [](http://www.alloyteam.com/2015/07/update-your-gulp/#增加了gulpseries和gulpparallel)增加了 `gulp.series` 和 `gulp.parallel`

哈哈，解放军来了。

如果你是 gulp 深度使用者，你一定不止一次吐槽过 gulp 的任务流程难以控制，就像一条复杂的电路一样，电路上很多电阻都是串联加并联的方式连接在一起，gulp 一个复杂的任务同样也是由很多个子任务以串联（同步）加并联（异步）的方式连接在一起的。

老版本的 gulp 对多个异步任务很难控制，必须借助于第三方模块，如 `run-seq`


<!-- {% endraw %} - for jekyll -->