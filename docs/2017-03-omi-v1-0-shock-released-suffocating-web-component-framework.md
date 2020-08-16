---
title: Omi v1.0 震撼发布 – 开放现代的 Web 组件化框架
date: 2017-03-20
author: TAT.dnt
source_link: http://www.alloyteam.com/2017/03/omi-v1-0-shock-released-suffocating-web-component-framework/
---

[原文链接](https://github.com/AlloyTeam/omi/blob/master/tutorial/omi-v1.0-release.md)

## 写在前面

[Omi 框架](https://github.com/AlloyTeam/omi)经过几十个版本的迭代，越来越简便易用和强大。  
经过周末的连续通宵加班加点，Omi v1.0 版本终于问世。虽然版本遵循小步快跑、频繁迭代，但是 Omi 团队成员都有着克制之心，处女座占了半壁江山，所以 Omi 的 API 除了增量的 API，其他的历史 API 没有任何变化。

-   Github：<https://github.com/AlloyTeam/omi>

废话不多说，这就为大家介绍到目前 1.0 版本为止，关于 Omi，你必须知道的点点滴滴。  

## 强大的 Store 系统

先说说 Store 系统是干什么的！

当我们组件之间，拥有共享的数据的时候，经常需要进行组件通讯。在 Omi 框架里，组件通讯非常方便：

-   通过在组件上声明 data-\* 传递给子节点
-   通过在组件上声明 data 传递给子节点（支持复杂数据类型的映射）
-   声明 group-data 把数组里的 data 传给一堆组件传递（支持复杂数据类型的映射）
-   完全面向对象，可以非常容易地拿到对象的实例，之后可以设置实例属性和调用实例的方法。比如 (标记 name、标记 omi-id)

当然你也可以使用 event emitter /pubsub 库在组件之间通讯，比如这个只有 200b 的超小库 [mitt](https://github.com/developit/mitt) 。但是需要注意 mitt 兼容到 IE9+，Omi 兼容 IE8。

虽然组件通讯非常方便，但是各种数据传递、组件实例互操作或者循环依赖，让代码非常难看且难以维护。所以：

Omi.Store 是为了让 组件通讯几乎绝迹 。虽然：

    Redux 的作者 Dan Abramov 说过：Flux 架构就像眼镜：您自会知道什么时候需要它。
     

但是，我不会告诉你

    Omi Store 系统就像眼镜：您自会知道什么时候需要它。
     

因为，Omi Store 使用足够简便，对架构入侵性极极极小 (3 个极代表比极小还要小)，让数据、数据逻辑和 UI 展现彻底分离，所以我的观点是：

```go
如果使用Omi，请使用Omi.Store架构。
 
```

比如连这个 [Todo 例子](https://github.com/AlloyTeam/omi/tree/master/example/todo-store)都能使用 Omi.Store 架构。如果连复杂度都达不到 Todo，那么 Omi 其实都没有必要使用，你可能只需要一个模板引擎便可。

关于 Store 详细的用法，后续再写文章阐述。

## 简易的插件体系

-   [omi-finger](https://github.com/AlloyTeam/omi/tree/master/plugins/omi-finger) Omi 的 [AlloyFinger](https://github.com/AlloyTeam/AlloyFinger) 插件，支持各种触摸事件和手势
-   [omi-transform](https://github.com/AlloyTeam/omi/tree/master/plugins/omi-transform) Omi 的 [transformjs](http://alloyteam.github.io/AlloyTouch/transformjs/) 插件，快速方便地设置 DOM 的 CSS3 Transform 属性
-   [omi-touch](https://github.com/AlloyTeam/omi/tree/master/plugins/omi-touch) Omi 的 [AlloyTouch](https://github.com/AlloyTeam/AlloyTouch) 插件，Omi 项目的触摸运动解决方案（支持触摸滚动、旋转、翻页、选择等等）
-   [omi-jquery-date-picker](https://github.com/AlloyTeam/omi/tree/master/plugins/omi-jquery-date-picker) Omi 的时间选择插件，支持各种时间或者时间区域选择

omi 插件主要是赋予 dom 能力，并且能和 instance 关联。如果主要是结构行组件，就写成 Omi 组件，和插件也没有太大关系。所以 omi 的插件不会有太多。

## 完善的脚手架

你可以安装 omi-cli，用来初始化项目脚手架。

    $ npm install omi-cli -g       //安装cli
    $ omi init your_project_name   //初始化项目
    $ cd your_project_name         //转到项目目录
    $ npm run dev                  //开发
    $ npm run dist                 //部署发布
     

项目脚手架基于 Gulp + Webpack + Babel + BrowserSync ，并且[支持 sass 生成组件局部 CSS](https://github.com/AlloyTeam/omi/blob/master/tutorial/webpack2-sass-support.md)

支持 HTML、JS、CSS/Sass 文件分离的目录方式，也支持 HTML、JS、CSS 全都写在 JS 里的方式，两种方式可以同时出现在项目里，按需选择。

## 其他

-   大量的示范例子 (md2site、qq-nearby 实战、各种 example)
-   双版本支持，(omi.js 和 omi.lite.js)

其中 omi.lite.js 是不包含 mustache.js 模板引擎的 omi.js。Omi 团队认为：

1. 随着 ES 的发展，模板字符串和 ES 语法强大到可以不使用模板引擎（仅限于 all in js 的代码目录组织方式）  
2. 让开发者重写 Omi.template 去使用任意模板引擎

-   良好的兼容性，支持 IE8（请自行引用 es5-shim 或 es5-sham）

本来没有支持 IE8 的打算，后来发现 babel 加两个插件便可以支持 IE8:

```javascript
query: {
    presets: 'es2015',
    plugins : [
        "transform-es3-property-literals",
        "transform-es3-member-expression-literals"
    ]
}
 
```

-   轻量迅速的 DOM Diff 和 HTML Parser
-   更智能的事件绑定，如：

```javascript
class Hello extends Omi.Component {
    handleClick(evt) {
        alert(evt.target.innerHTML);
    }
    render() {
        return `
      <div>
        <h1 onclick="handleClick">Hello ,{{name}}!</h1>
      </div>
        `;
    }
}
```

你可以传递任意参数:

```html
class Hello extends Omi.Component {
    handleClick(str, num) {}
    render() {
        return `
      <div>
        <h1 onclick="handleClick('test', 1)">Hello ,{{name}}!</h1>
      </div>
        `;
    }
}
```

## 强大的 Omi 团队

![](http://images2015.cnblogs.com/blog/105416/201703/105416-20170320095955971-1939070926.jpg)

-   来自 AlloyTeam、Mars Holding、腾讯、TalkingCoder、阿里、微软的优秀的工程师会协商规划好 Omi 发展路线，跟进优秀的思想和模式
-   来自 AlloyTeam 的工程师会跟进 Omi 使用者的任何问题

## 相关

-   Omi 的 Github 地址 <https://github.com/AlloyTeam/omi>
-   如果想体验一下 Omi 框架，可以访问 [Omi Playground](http://alloyteam.github.io/omi/example/playground/)
-   如果想使用 Omi 框架或者开发完善 Omi 框架，可以访问 [Omi 使用文档](https://github.com/AlloyTeam/omi/tree/master/docs#omi使用文档)
-   如果你想获得更佳的阅读体验，可以访问 [Docs Website](http://alloyteam.github.io/omi/website/docs.html)
-   如果你懒得搭建项目脚手架，可以试试 [omi-cli](https://github.com/AlloyTeam/omi/tree/master/cli)
-   如果你有 Omi 相关的问题可以 [New issue](https://github.com/AlloyTeam/omi/issues/new)
-   如果想更加方便的交流关于 Omi 的一切可以加入 QQ 的 Omi 交流群 (256426170)

![](http://images2015.cnblogs.com/blog/105416/201702/105416-20170208095745213-1049686133.png)