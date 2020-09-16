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


<!-- {% endraw %} - for jekyll -->