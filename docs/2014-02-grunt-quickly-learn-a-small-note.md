---
title: grunt 快速学习小记
date: 2014-02-27
author: TAT.dorsywang
source_link: http://www.alloyteam.com/2014/02/grunt-quickly-learn-a-small-note/
---

<!-- {% raw %} - for jekyll -->

<!-- h3{ font-weight: 100; color: rgb(13, 120, 186); font-family: "Helvetica Neue",Helvetica,STHeiTi,"Microsoft YaHei",sans-serif; } h3 span{ color: rgb(13, 120, 186); font-size: 24px; font-family: Georgia; margin-right: 10px; } -->

快速过了一下 grunt，做个小记与总结。

**grunt 是什么？**

知道的人就会觉得这里有点罗嗦，但还是快速了解一下。grunt 是一个构建平台。

**grunt 可以做什么？**

在开发阶段和发布阶段有一些自动重复的过程还是要做的  

 

-   可以帮你自动合图
-   可以帮你自动合并脚本
-   可以帮你自动压缩脚本

以上这些是基本要做的，但还有一些其他的工作也可以

**grunt 本质是什么？**

grunt 本质是服务端的 node 的运行的代码架构，同样，理论上 php 也可以做到

**使用 grunt**

### 1. 安装 node 环境

使用 grunt 肯定少不了 node 环境，在 node 官网上下载 node 安装包安装

### 2.  安装 grunt-cli

使用 npm 安装 grunt-cli，在命令行中执行下述命令

    npm install -g grunt-cli

grunt-cli 并不是安装了 grunt，是 grunt 的运行框架，或者类似于运行时

### 3.  在项目下初始化项目信息

cd 到当前目录，执行

    npm  init

这时候 npm 会引导创建一个 package.json 文件，写上基本信息

在目录下打开这个文件，把 grunt 的配置信息也写进去

```javascript
{
  "name": "my-project-name",
  "version": "0.1.0",
  "devDependencies": {
    "grunt": "~0.4.2",
    "grunt-contrib-jshint": "~0.6.3",
    "grunt-contrib-nodeunit": "~0.2.0",
    "grunt-contrib-uglify": "~0.2.2"
  }
}
 
   可以看出，devDependencies是项目的依赖插件，包括grunt也是以插件存在的
```

       grunt-contrib-jshint 是一个代码检查工具
       grunt-contrib-uglify 是代码压缩工具

### 4.  安装插件

在命令行中运行

    npm install

会根据上个步骤中的 devDependencies 安装依赖包

安装完成会在项目下有个 node_modules 目录就是安装的包

### 5. 创建 Gruntfile.js

在项目在创建 Gruntfile.js 把下面代码复制进去

```javascript
module.exports = function (grunt) {
    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        uglify: {
            options: {
                banner:
                    '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            },
            build: {
                src: "src/<%= pkg.name %>.js",
                dest: "build/<%= pkg.name %>.min.js",
            },
        },
    }); // 加载提供 "uglify" 任务的插件
    grunt.loadNpmTasks("grunt-contrib-uglify"); // 默认任务
    grunt.registerTask("default", ["uglify"]);
};
```

解释下上面代码

上面代码本质上是 node 支持的 JavaScript 代码，grunt 要求外面那个函数框必须要有的，每个文件都应该用那个框包起来

grunt.init () 方法是初始化化 grunt 配置，所有的这些配置可以在其他的地方通过 grunt.config.get 方法获取到

grunt.loadNpmTasks 是加载提供支持任务的文件夹

grunt.registerTask 是注册一个任务流，default 是入口

### 6. 示例 压缩代码

上述配置，init 参数里 uglify 的任务就是压缩代码，让代码变丑，其中 option 配置一些选项，具体怎么配置可以去看提供插件的文档

build 就是构建配制，其中 src 就是构建的源文件，dest 就是构建到目标目录下

命令行中运行

    grunt

### 7. 使用 grunt 插件

在官网搜索想要的插件，在项目目录下运行

    npm install <module> --save-dev

在 gruntfile.js 中根据插件文件添加任务和选项，然后使用 shell 运行 grunt 命令

### 8. 写 grunt 插件（!important)

有些时候，不一定能找到想要的插件，或者实现一些复杂的功能，那就自己动手写一个 grunt 插件吧，这样写一次，随项目提交 svn，可以到处运行。

1) 在 node_modules 目录建一个你的插件目录，目录名随便起，这里起做 grunt-concat-file

2) 在目录下建一个 tasks 的目录，然后在 tasks 目录下建一个随便的 js 名字，这里起做 concat.js

3) 打开 concat.js，把下面这个框代码复制进去

```javascript
"use strict";
//这里可以写依赖的模块
var path = require("path");
module.exports = function (grunt) {
    grunt.registerMultiTask("{your task name}", "", function () {
        //这里拿到options信息，即是gruntfile.js里的对的{your task name}的配置的options
        var options = this.options({}); //遍历所有的src文件
        this.files.forEach(function (f) {
            //根据正则过滤相应文件
            var src = f.src.filter(function (filepath) {
                // filepath是当前文件相对项目目录的路径
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    //这里做想要做的事
                    return true;
                }
            });
        });
    });
};
```

好了，现在这个 js 文件就是普通的 node 运行的 js 文件了，可以做任何想做的事情

当然，grunt 已经帮我们封装好了一些常用的 api 操作，看下文档就可以明白了

注意这里

```javascript
grunt.registerMultiTask('{your task name}', '', function() {
```

    即是gruntfile.js里面的任务名，这里也是可以随便命名的
    下面的例子是去除html中comments的例子

```javascript
    //遍历所有的src文件
    this.files.forEach(function(f) {
 
      //根据正则过滤相应文件
      var src = f.src.filter(function(filepath) {
        // filepath是当前文件相对项目目录的路径
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
 
          var commentsReg = /<!--.*?-->/g;
 
          //读到当前文件
          var html = grunt.file.read(filepath);
 
          //替换注释
          html = html.replace(commentsReg, "");
 
          //写到文件
          grunt.file.write(f.dest + filepath, html);   
 
          return true;
        }
      });
```

在 gruntfile.js 中添加上该任务

```javascript
// 项目配置
grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    "{your task name}": {
        options: {},
        build: {
            src: "*.html",
            dest: "dist/",
        },
    },
});
```

加载目录模块

      // 加载目录名
      grunt.loadNpmTasks('grunt-concat-file');
     
      // 默认任务
      grunt.registerTask('default', ['{your task name}']);

运行 grunt 命令

    grunt

[![plugin](http://www.alloyteam.com/wp-content/uploads/2014/02/plugin.png)](http://www.alloyteam.com/wp-content/uploads/2014/02/plugin.png)

dist 目录下同样生成了一个去掉注释的 html 文件

一个去注释的功能就这样完成了

学习时间仓促，错误内容还望指正

<!-- {% endraw %} - for jekyll -->