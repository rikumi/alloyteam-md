---
title: 2017 年试试 Web 组件化框架 Omi
date: 2017-02-08
author: TAT.dnt
source_link: http://www.alloyteam.com/2017/02/2017-try-web-component-framework-omi/
---

<!-- {% raw %} - for jekyll -->

[![Omi](http://images2015.cnblogs.com/blog/105416/201701/105416-20170120114244046-622856943.png)](https://github.com/AlloyTeam/omi)

Open and modern framework for building user interfaces.

* * *

-   Omi 的 Github 地址 <https://github.com/AlloyTeam/omi>
-   如果想体验一下 Omi 框架，可以访问 [Omi Playground](http://alloyteam.github.io/omi/example/playground/)
-   如果想使用 Omi 框架或者开发完善 Omi 框架，可以访问 [Omi 使用文档](https://github.com/AlloyTeam/omi/tree/master/docs#omi使用文档)
-   如果你想获得更佳的阅读体验，可以访问 [Docs Website](http://alloyteam.github.io/omi/website/docs.html)
-   如果你懒得搭建项目脚手架，可以试试 [omi-cli](https://github.com/AlloyTeam/omi/tree/master/cli)
-   如果你有 Omi 相关的问题可以 [New issue](https://github.com/AlloyTeam/omi/issues/new)
-   如果想更加方便的交流关于 Omi 的一切可以加入 QQ 的 Omi 交流群 (256426170)

![](http://images2015.cnblogs.com/blog/105416/201702/105416-20170208095745213-1049686133.png)

## 特性

-   超小的尺寸，7 kb (gzip)
-   局部 CSS，HTML+ Scoped CSS + JS 组成可复用的组件。不用担心组件的 CSS 会污染组件外的，Omi 会帮你处理好一切
-   更自由的更新，每个组件都有 update 方法，自由选择时机进行更新。你也可以和 obajs 或者 mobx 一起使用来实现自动更新。
-   模板引擎可替换，开发者可以重写 Omi.template 方法来使用任意模板引擎
-   完全面向对象，函数式和面向对象各有优劣，Omi 使用完全的面向对象的方式来构建 Web 程序。
-   ES6+ 和 ES5 都可以，Omi 提供了 ES6 + 和 ES5 的两种开发方案。你可以自有选择你喜爱的方式。

## 通过 npm 安装

    npm install omi
     

## Hello World

```html
class Hello extends Omi.Component {
    constructor(data) {
        super(data);
    }
    style () {
        return  `
            <style>
                h1{
                    cursor:pointer;
                }
            </style>
         `;
    }
    handleClick(target, evt){
        alert(target.innerHTML);
    }
    render() {
        return  `
        <div>
            <h1 onclick="handleClick(this, event)">Hello ,{{name}}!</h1>
        </div>
        `;
 
    }
}
 
Omi.render(new Hello(
```


<!-- {% endraw %} - for jekyll -->