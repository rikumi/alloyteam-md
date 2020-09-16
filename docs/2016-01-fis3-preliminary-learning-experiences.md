---
title: fis3 初步学习体验
date: 2016-01-05
author: TAT.yana
source_link: http://www.alloyteam.com/2016/01/fis3-preliminary-learning-experiences/
---

<!-- {% raw %} - for jekyll -->

作为前端开发，或多或少都会接触很多前端构建工具，最近的业务使用到了百度 FIS 团队的 fis3，想和大家分享下我所理解的 fis3。

**使用方法简单说**

首先，你需要安装 node 和 npm

然后，使用 **npm install -g fis3**  命令安装 fis3，安装完成是这样的

[![图片 1](http://www.alloyteam.com/wp-content/uploads/2015/12/图片12-300x125.png)](http://www.alloyteam.com/wp-content/uploads/2015/12/图片12.png)表示安装成功。

然后我们可以通过 **fis3 release -w** 来对代码进行监听。

注：fis3 默认内置了 fis3-command-release 插件，提供了文件监听和浏览器自动刷新功能，在 release 的时候添加 - w 或 - L 参数就可以，这样可以很方便的部署代码。

当你需要使用插件的时候，可以用 **fis3 install -g 插件名** 进行安装。

与其他构件工具一样，fis3 也需要配置 fis-conf.js 文件。

**添加 MD5 戳以及资源的合并压缩**（配置**useHash: true**即可添加 MD5 戳）

    fis.media('offpack')
        .match('**.{js,tpl}', {
            optimizer: fis.plugin('uglify-js'),
            useHash: true
        })
        .match('**.{css,scss,sass}', {
            optimizer: fis.plugin('clean-css'),
            useHash: true
        })
        .match('**.png', {
            optimizer: fis.plugin('png-compressor')
        })
    });

**CssSprite 图片合并**

    .match('::package', {
            spriter: fis.plugin('csssprites')
        })
        .match('*.css', {
            useSprite: true
            })

**对 sass 文件进行编译**

```javascript
 .match('**.{scss,sass}', {
        parser: fis.plugin('sass', {
            include_paths: ['modules/common/sass']
        }),
        rExt: '.css'
    })
```

这样我们就可以使用基本的 fis3 了。

**fis 三种编译能力**

fis3 可以做到以下几点：

[![a](http://www.alloyteam.com/wp-content/uploads/2016/01/a-300x294.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/a.png)

其主要功能基本都是围绕着前端开发所需要的三种编译能力：资源定位、内容嵌入、依赖声明。

**1、资源定位**

HTML 中的资源定位

    fis.match('*.css', {
        packTo: '../demo/demo.css'
    })

js 中的资源定位


<!-- {% endraw %} - for jekyll -->