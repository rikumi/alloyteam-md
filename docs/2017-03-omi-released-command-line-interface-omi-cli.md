---
title: Omi 命令行界面 omi-cli 发布
date: 2017-03-09
author: TAT.dnt
source_link: http://www.alloyteam.com/2017/03/omi-released-command-line-interface-omi-cli/
---

<!-- {% raw %} - for jekyll -->

[原文链接：https://github.com/AlloyTeam/omi/blob/master/docs/deep_in/cn_omi-cli.md](https://github.com/AlloyTeam/omi/blob/master/docs/deep_in/cn_omi-cli.md)

## 写在前面

通常认为，命令行界面（CLI）没有图形用户界面（GUI）那么方便用户操作。但是 CLI 比 GUI 节约资源，在熟悉命令之后，CLI 会比 GUI 更加高效地帮你完成想要的任务。

Omi CLI 地址: [omi-cli](https://github.com/AlloyTeam/omi/tree/master/cli)

下面来介绍下 [pasturn](https://github.com/pasturn) 童鞋为 Omi 开发的 CLI 的两种使用姿势：

## 姿势一

    $ npm install omi-cli -g       //安装cli
    $ omi init your_project_name   //初始化项目
    $ cd your_project_name         //转到项目目录
    $ npm run dev                  //开发
    $ npm run dist                 //部署发布
     

## 姿势二

当我们在一个空文件夹的时候，可以执行下面的命令。

    $ npm install omi-cli -g       //安装cli
    $ omi init                     //初始化项目
    $ npm run dev                  //开发
    $ npm run dist                 //部署发布
     

这里不用再去跳转目录了，当前目录就是项目的目录。

## 安装过程截图

安装 omi-cli:

![](http://images2015.cnblogs.com/blog/105416/201702/105416-20170227100545470-696026058.png)

安装初始化项目 omi init:

![](http://images2015.cnblogs.com/blog/105416/201702/105416-20170227100554891-1802174132.png)

上面的成功的界面。注意：初始化项目会自动安装相关的 npm 依赖包，所以时间较长，请耐心等待。  
安装完成之后，在项目目录下你可以看到下面的目录结构：

![](http://images2015.cnblogs.com/blog/105416/201702/105416-20170227100755845-465268116.png)

开发 npm run dev:

![](http://images2015.cnblogs.com/blog/105416/201702/105416-20170227100601235-1477801934.png)

![](http://images2015.cnblogs.com/blog/105416/201702/105416-20170227100608985-921528126.png)

如果，你看到了上面的界面，说明一切 OK 了。创建出来的项目主要基于 Gulp + Webpack + Babel + BrowserSync 进行开发和部署。Gulp 用来串联整个流程，Webpack + Babel 让你可以写 ES6 和打包，BrowserSync 用来帮你刷浏览器，不用 F5 了。

## 组件开发

页面的组件都在 component 目录:

![](http://images2015.cnblogs.com/blog/105416/201703/105416-20170309091322484-527946546.png)

你可以把组件的 HTML、CSS 和 JS 分离成三个文件，然后通过 require 的方式使用，如：

```javascript
import Omi from "omi";
const tpl = require("./index.html");
const css = require("./index.css");
class Footer extends Omi.Component {
    constructor(data) {
        super(data);
    }
    style() {
        return css;
    }
    render() {
        return tpl;
    }
}
export default Footer;
```

也可以直接 all in js 的方式：

```html
import Omi from "omi";
class Header extends Omi.Component {
    constructor(data) {
        super(data);
    }
    style() {
        return `
        <style>
        .menu a:hover{
            color: white;
        }
        </style>
        `;
    }
    render() {
        return `
    <div class="head bord-btm">
        <div class="logo_box">
            <a href="https://github.com/AlloyTeam/omi"></a>
        </div>
        <ul class="menu">
            <li class="github_li"><a href="https://github.com/AlloyTeam/omi">Github</a>
            <li><a href="http://alloyteam.github.io/omi/example/playground/">Playground</a></li>
            <li><a href="https://github.com/AlloyTeam/omi/tree/master/docs">[Edit the Docs]</a></li>
            </li>
        </ul>
    </div>`;
    }
}
export default Header;
```

如果需要更多动态编程能力，可以 all in js。如果纯静态不怎么需要改动的话，直接分离成三个文件通过 require 进来便可。

## 后续

更多脚手架模板以及更多功能的命令正在开发中，如果有什么意见或者建议欢迎让我们知道。

## 相关

-   Omi 的 Github 地址 <https://github.com/AlloyTeam/omi>
-   如果想体验一下 Omi 框架，可以访问 [Omi Playground](http://alloyteam.github.io/omi/example/playground/)
-   如果想使用 Omi 框架或者开发完善 Omi 框架，可以访问 [Omi 使用文档](https://github.com/AlloyTeam/omi/tree/master/docs#omi使用文档)
-   如果你想获得更佳的阅读体验，可以访问 [Docs Website](http://alloyteam.github.io/omi/website/docs.html)
-   如果你懒得搭建项目脚手架，可以试试 [omi-cli](https://github.com/AlloyTeam/omi/tree/master/cli)
-   如果你有 Omi 相关的问题可以 [New issue](https://github.com/AlloyTeam/omi/issues/new)
-   如果想更加方便的交流关于 Omi 的一切可以加入 QQ 的 Omi 交流群 (256426170)

![](http://images2015.cnblogs.com/blog/105416/201702/105416-20170208095745213-1049686133.png)

<!-- {% endraw %} - for jekyll -->