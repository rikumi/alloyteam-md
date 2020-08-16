---
title: Omi 应用 md2site 发布 - markdown 转网站利器
date: 2017-03-06
author: TAT.dnt
source_link: http://www.alloyteam.com/2017/03/omi-md2site-release-markdown-go-web-site-tool/
---

<!-- {% raw %} - for jekyll -->

## 写在前面

Md2site 是基于 [Omi](https://github.com/AlloyTeam/omi) 的一款 Markdown 转网站工具，使用简单，生成的文件轻巧，功能强大。  
当我们想把一堆 markdown 文档转成网站时，你可能有许多选择，倘若选择 md2site ，你一定会爱上她。

-   官网：<http://alloyteam.github.io/omi/md2site/>
-   Github: <https://github.com/AlloyTeam/omi/tree/master/md2site>
-   真实案例:<http://alloyteam.github.io/omi/website/docs-cn.html>

## 特性

-   超轻巧，生成的网站除了 Omi 不依赖其他第三方库，超级小的尺寸让你加载更快
-   完整支持 Markdown，使用 markdown 写你的文档或者网站，完整支持 markdown 所有语法
-   响应式，生成的网站是响应式的，手机和 PC 都有不错的阅读体验
-   多语言，天生支持多语言，只需增加修改配置便可。让世界了解你的网站
-   代码美，请记住：不仅仅是代码高亮，使用 md2site 轻松可以让代码内的某些代码高亮
-   超方便，npm run dev 预览，npm run dist 一键生成网站。不满足现有布局或样式可轻松进行二次开发

## 快速开始

    $ npm install md2site -g
     

安装完之后就可以使用 md2site 命令了。

    $ md2site init your_project_name
     

比如我创建一个 omi 的文档：

![](http://images2015.cnblogs.com/blog/105416/201703/105416-20170306125028469-1292183468.png)

这个时间比较长，因为还会安装相关的 npm 依赖包。安装成功可以看到：

![](http://images2015.cnblogs.com/blog/105416/201703/105416-20170306125105234-1733626893.png)

    $ cd your_project_name
     

转到对应的项目目录。

找到 your_project_name 目录下的 docs 目录：

![](http://images2015.cnblogs.com/blog/105416/201703/105416-20170306125123063-1498730937.png)

在里面写你的 markdown 文档。在 config.js 中配置对应的目录树：

```javascript
let config = {
    menus: {
        cn: [
            {
                active: true,
                title: "快速开始",
                currentIndex: 0,
                list: [
                    { name: "安装", md: "installation" },
                    { name: "组件", md: "components" },
                    { name: "组件通讯", md: "communication" },
                ],
            },
        ],
        en: [
            {
                active: true,
                title: "QUICK START",
                currentIndex: 0,
                list: [
                    { name: "Installation", md: "installation" },
                    { name: "Components", md: "components" },
                    { name: "Communication", md: "communication" },
                ],
            },
        ],
    },
};
export default config;
```

写的过程中可以通过下面的命令可以进行网站预览

    $ npm run dev
     

也可发布部署：

    $ npm run dist
     

一款漂亮的多语言响应式无刷新的精明文档网站就这么搞定了！简单吧～～

![](http://images2015.cnblogs.com/blog/105416/201703/105416-20170306125633969-867005358.png)

![](http://images2015.cnblogs.com/blog/105416/201703/105416-20170306125639469-340450991.png)

## Markdown 语法扩展

如果你想让代码块中的某些行高亮，比如这个样子：

![](http://images2015.cnblogs.com/blog/105416/201703/105416-20170306125132563-920645893.png)

你可以使用这种语法来标记需要高亮的行：

![](http://images2015.cnblogs.com/blog/105416/201703/105416-20170306125137750-1566013213.png)

上面代表：1 到 3 行以及 26 行高亮。

## Github

-   <https://github.com/AlloyTeam/omi/tree/master/md2site>
-   真实案例:<http://alloyteam.github.io/omi/website/docs-cn.html>
-   欢迎使用，愉快地书写精美的网站吧～～

<!-- {% endraw %} - for jekyll -->