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
对前端构建来说，使用最多的莫过于 [grunt](http://gruntjs.com/) 和 [gulp](http://gulpjs.com)。

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

老版本的 gulp 对多个异步任务很难控制，必须借助于第三方模块，如 `run-sequence`、`event-stream` 等，效果也并不理想。

现在 gulp 带来了两个新的 api：`gulp.series` 和 `gulp.parallel`，这两个革命性的 api 将帮助开发者解决恼人的任务流程控制问题。

下面就来见识新 api 的神奇之处吧。

### [](http://www.alloyteam.com/2015/07/update-your-gulp/#example)example

以开发中最常见的 dist 任务为例，使用 gulp 首先得分解任务，dist 大致分解成子任务如下

1.  删除开发目录 dev，`clean-dev`
2.  删除发布目录 dist，`clean-dist`
3.  合图并修改 css 中图片引用，`sprite`
4.  预编译 css（如 sass）到 dev，`compile-css`
5.  预编译 js 到 dev，`compile-js`
6.  从 src 拷贝 html 到 dev，`copy-html`
7.  对 dev 下面的 js/css 进行 md5，再拷贝到 dist，`reversion`
8.  替换 dev 下 html 中 js/css 进行过 md5 之后的文件路径，并拷贝到 dist，`replcae`

这只是一个普通的 dist 任务，我将 dist 拆得比较细并省略了压缩合并等常规任务，大致由以上 8 个步骤组成。

拆的粒度完全由自己控制，达到方便复用又便于理解的目的就行。

使用老版本的 gulp，首先需要对每一个任务进行注册，这里只是为了说明问题，我省略了任务的具体代码。

```javascript
gulp.task('clean-dev', function() {// TODO});
gulp.task('clean-dist', function() {// TODO});
gulp.task('sprite', function() {// TODO});
gulp.task('compile-css', function() {// TODO});
gulp.task('compile-js', function() {// TODO});
gulp.task('copy-html', function() {// TODO});
gulp.task('reversion', function() {// TODO});
gulp.task('replcae', function() {// TODO});
 
```

然后，我们来理一理任务的流程，为了让任务执行效率更高，尽量保证能同时执行的都同时执行，这里简单画了个流程图来表示任务的流程，箭头表示先后顺序。

[![Task](https://camo.githubusercontent.com/4fa1f9acdc1243aa3c5539435f1cefb11d3255cc/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031352f30372f67756c70342e302e706e67)](http://www.alloyteam.com/wp-content/uploads/2015/07/gulp4.0.png)

可以看到图中既存在同步又存在异步的任务，需要实现这样的流程，我们还需要修改和注册额外的几个任务，并借助 run-sequence 等第三方模块。

```javascript
gulp.task("compile-css", ["sprite"]);
gulp.task("dev", ["clean-dev"], function () {
    runSecquence(["compile-css", "compile-js", "copy-html"]);
});
gulp.task("md5", ["dev", "clean-dist"], function () {
    runSecquence("reversion");
});
gulp.task("dist", ["md5"], function () {
    runSecquence("replcae");
});
```

gulp 官方推荐将任务最小化，每一个任务只做一件明确的事，可以看到任务拆得越细需要注册的任务就越多，为了处理同时涉及到同步和异步的任务，需要引进额外的中间任务来衔接，在代码上也不够自然。

如果使用 gulp 4.0，只用这样就行了

```javascript
function cleanDev() {// TODO}
function cleanDist() {// TODO}
function sprite() {// TODO}
function compileCss() {// TODO}
function compileJs() {// TODO}
function copyHtml() {// TODO}
function reversion() {// TODO}
function replcae() {// TODO}
 
gulp.task('dist', gulp.series(
    gulp.parallel(
        gulp.series(
            cleanDev,
            gulp.parallel(
                gulp.series(
                    sprite,
                    compileCss
                ),
                compileJs,
                copyHtml
            )
        ),
        cleanDist
    ),
    reversion,
    replcae
));
 
```

`gulp.series` 和 `gulp.parallel` 都可以接受以 `gulp.task` 注册的任务名干脆就是一个（多个）函数，省去了一大堆 gulp.task 的代码，同时也达到了任务复用的目的，将子任务经过不同的组合又可以产生新的任务。

结合流程图，上面的代码还是很好理解的。

另外再说一点，只要在 gulpfile.js 中没有使用 gulp.task 传三个参数的用法，gulp 4.0 也是兼容老版本的 gulpfile.js 的。

[官方升级日志](https://github.com/gulpjs/gulp/blob/4.0/CHANGELOG.md)中也列出了一些其他的说明，想升级到 4.0 又想完全兼容老版本 gulpfile.js 的开发者最好还是看看咯。


<!-- {% endraw %} - for jekyll -->