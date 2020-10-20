---
title: 简单玩转 manifest.json
date: 2015-03-31
author: TAT.huhu
source_link: http://www.alloyteam.com/2015/03/jian-dan-wan-zhuan-manifest-json/
---

<!-- {% raw %} - for jekyll -->

回想最早年资源版本控制，是不是类似如下

```html
<script src="a.js?t=20140404"></script>
<script src="a.js?v=1.1.0"></script>
 
```

这是一个最常见的古老的版本控制方式，简单直观易用，缺点就是我们常常会因为缓存因为覆盖造成发布外网时出现资源同步问题。对于没啥访问量的小型站点折腾折腾也就过了，如果项目很大访问很大，一但出现问题波及很广你自然少不了被领导被上级抓去捡肥皂的命运。

所以现在有了很多居于 gulp 或 grunt 的 hash 值生成静态文件的工具，没错今天我要讲的也是这个，但是会换点花样和玩法。

最基本的 rev 玩法

```html
<!-- build:js js/all.js -->
<script src="js/all.js"></script>
<!-- endbuild -->
 
```

通过定义 build 再在 gulpfile.js 做 rev () 配置，比如

```javascript
return gulp
    .src("*.html")
    .pipe(userefAssets) // Concatenate with gulp-useref
    .pipe(jsFilter)
    .pipe(uglify()) // Minify any javascript sources
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(csso()) // Minify any CSS sources
    .pipe(cssFilter.restore())
    .pipe(rev()) // Rename the concatenated files
    .pipe(userefAssets.restore())
    .pipe(useref())
    .pipe(revReplace()) // Substitute in new filenames
    .pipe(gulp.dest("dist"));
```

这样就可以动态将 build 内的 css，js 等文件合并压缩并 md5 命名，但是这种做法的缺点也很明显，写法繁琐，而且不支持特殊规则比如 css 内部的 background:url ()，如果想要支持这种替换还得自己做插件做规则匹配。

于是就有了巧妙的利用 manifest.json 来帮助我们做更智能化的 md5 规则

```javascript
gulp.task('ift-js', ['move-js'], function(){
    return gulp.src('./dev/js/**')
        .pipe(rev())
        .pipe(gulp.dest('./dist/js/'))
        .pipe(rev.manifest({path:'ift-js.json'}))
        .pipe(gulp.dest('./dist/'));
 
```

通过这种形式我们使用主动式创建 md5 文件让本地文件自然形成 md5 拷贝版同时生成了 json 对应表

然后通过扫描全部资源文件，通过正则匹配确认文件被使用的是原文件还是 md5 文件，如果使用的是原文件，系统自动删除已生成的 md5 文件，如果使用了 md5 文件，系统自动删除源文件，这种形式消除了冗余拷贝

```javascript
return gulp
    .src(["./dist/css/**", "./dist/js/**", "./dist/*.html"], { base: "dist" })
    .pipe(
        replace(/js\/[\S]*\\?\_\_\_md5/g, function (match) {
            return md5(match, "js/");
        })
    )
    .pipe(gulp.dest("./dist/"));
```

而这边使用的规则避开了传统的 bulid 注释形式，因为我觉得这种写法真的有些繁琐了，所以这边采用时间戳形式

于是就有了如下成果

调用方

```html
<script src="/js/console.js"></script>
<script src="/js/plugin.js?___md5"></script>
<script src="/js/section.js?___md5"></script>
<script src="/js/index.js?___md5"></script>
 
```

开发目录

    dev/js
        - console.js
        - index.js
        - plugin.js
        - section.js
     

发布目录

    dist/js
        - console.js
        - index-a5fae3cd.js
        - plugin-0ddc6bc0.js
        - section-0c058d64.js
     

可以看到根据自能匹配规则，js 目录下有三个文件被自动 md5，而调试文件因为没有 md5 标识保留了源文件拷贝。


<!-- {% endraw %} - for jekyll -->