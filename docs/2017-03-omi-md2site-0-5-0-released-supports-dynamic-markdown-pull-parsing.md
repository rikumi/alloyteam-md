---
title: Omi 应用 md2site-0.5.0 发布 - 支持动态 markdown 拉取解析
date: 2017-03-15
author: TAT.dnt
source_link: http://www.alloyteam.com/2017/03/omi-md2site-0-5-0-released-supports-dynamic-markdown-pull-parsing/
---

<!-- {% raw %} - for jekyll -->

## 写在前面

Md2site 是基于 [Omi](https://github.com/AlloyTeam/omi) 的一款 Markdown 转网站工具，使用简单，生成的文件轻巧，功能强大。

-   官网：<http://alloyteam.github.io/omi/md2site/>
-   Github: <https://github.com/AlloyTeam/omi/tree/master/md2site>
-   真实案例:<http://alloyteam.github.io/omi/website/docs-cn.html>

在使用之前的版本的时候，你会发现体验非常好？为什么非常好？因为页面间的切换是无刷新！  
无刷新的原理就是，所有的 markdown 都会被 webpack 打包到 js 里，只要在 js 动态 require 就行。

这样带来的一个问题便是：如果有海量的 markdown 的时候，首次加载的时间非常长。

怎么解决？支持动态拉取和解析 markdown\~~

## 使用姿势

    $ npm install md2site -g
    $ md2site init your_project_name
    $ cd your_project_name
    $ npm run dev
    $ npm run dist
     

所有命令都是和以前一样的。接下来，打开 project.js:

    module.exports = {
        cdn : '',
        async: true
    }
     

-   你把 async 改成 true 就代表会生成一个异步拉取和解析 markdown 的网站
-   你把 async 改成 false 就代表会生成一个完全无刷新的网站

够方便吧！！一键配置！！

## 原理解析

### 防止 webpack 打包 markdown

当我们设置 async 为 true 的时候，不是希望 webpack 把 markdown 打包入 js 里的，所以在 webpack config 做了如下操作：

```javascript
var proj_config = require("./project.js");
if (proj_config.async) {
    config.module.loaders[3].exclude = /\.md$/;
}
```

其中 config.module.loaders\[3] 就是配置的 markdown loader。exclude 就代表把相关的正则匹配到的文件直接给无视掉。

### 动态加载 markdown

```javascript
 loadMarkdown(url,callback) {
     var xobj = new XMLHttpRequest();
     xobj.open('GET', url, true); 
     xobj.onreadystatechange = function () {
         if (xobj.readyState == 4 && xobj.status == "200") {
             callback(xobj.responseText);
         }
     };
     xobj.send(null);
 }
 
```

加载完后直接交给 remarkable 解析成 HTML，remarkable 解析成 HTML 的速度超快到你无法感知，所以提前生成好 HTML 不是非常必要。

### Async Update

```javascript
asyncUpdate() {
    this.loadMarkdown("../../docs/" + this.data.lan + "/" + this.data.name + ".md",(md)=>{
        this.data.html = this.md.render(md);
        this.update();
    })
}
 
```

异步的刷新组件。

详细的代码可以[看这里](https://github.com/AlloyTeam/omi/tree/master/md2site/template/app/src)

## Github

-   <https://github.com/AlloyTeam/omi/tree/master/md2site>

欢迎使用～～


<!-- {% endraw %} - for jekyll -->