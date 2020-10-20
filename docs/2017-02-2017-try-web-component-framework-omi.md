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

```javascript
class Hello extends Omi.Component {
    constructor(data) {
        super(data);
    }
    style() {
        return `
            <style>
                h1{
                    cursor:pointer;
                }
            </style>
         `;
    }
    handleClick(target, evt) {
        alert(target.innerHTML);
    }
    render() {
        return `
        <div>
            <h1 onclick="handleClick(this, event)">Hello ,{{name}}!</h1>
        </div>
        `;
    }
}
Omi.render(new Hello({ name: "Omi" }), "body");
```

[\[点击这里 -> 在线试试\]](http://alloyteam.github.io/omi/website/redirect.html?type=hello)

你可以使用 Omi.makeHTML 来生成组件标签用于嵌套。

        Omi.makeHTML('Hello', Hello);
     

那么你就在其他组件中使用，并且通过 data-\*的方式可以给组件传参，如：

```html
  ...
  render() {
        return  `
        <div>
            <div>Test</div>
            <Hello data-name="Omi" />
        </div>
        `;
    }
    ...
 
```

注意，style 方法里面 return 包裹的`<style></style>` 不是必须的。主要是方便识别成 jsx 文件时候有 css 语法高亮。

[\[点击这里 -> 在线试试\]](http://alloyteam.github.io/omi/website/redirect.html?type=hello_nest)

你可以使用 [webpack](https://webpack.github.io/) + [babel](http://babeljs.io/)，在 webpack 配置的 module 设置 [babel-loader](https://github.com/babel/babel-loader)，立马就能使用 ES6 + 来编写你的 web 程序。

当然 Omi 没有抛弃 ES5 的用户，你可以使用 ES5 的方式编写 Omi。

## ES5 方式

```html
var Hello = Omi.create("Hello", {
    style: function () {
        return "<style>h1{ cursor:pointer }</style>";
    },
    handleClick: function (dom) {
        alert(dom.innerHTML);
    },
    render: function () {
        return ' <div><h1 onclick="handleClick(this, event)">Hello ,{{name}}!</h1></div>';
    },
});
var Test = Omi.create("Test", {
    render: function () {
        return '<div>\
                    <div>Test</div>\
                    <Hello data-name="Omi" />\
                </div>';
    },
});
Omi.render(new Test(), "#test");
```

和 ES6 + 的方式不同的是，不再需要 makeHTML 来制作标签用于嵌套，因为 Omi.create 的第一个参数的名称就是标签名。

[\[点击这里试试 ES5 写 Omi 程序\]](http://alloyteam.github.io/omi/website/redirect.html?type=hello_es5)

## 加入 Omi 吧！

Github: <https://github.com/AlloyTeam/omi>

I need you.


<!-- {% endraw %} - for jekyll -->