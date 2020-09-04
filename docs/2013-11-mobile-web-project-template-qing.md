---
title: 面向工程的移动 Web 开发模版 Qing
date: 2013-11-28
author: TAT.yuanyan
source_link: http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/
---

<!-- {% raw %} - for jekyll -->

什么是 [Qing](https://github.com/AlloyTeam/Qing)？Qing 是一套基础开发模版，来源于我们在手机与 PC 端上的大量工程实践。Qing 所提供不是冷冰冰的文件，  
而是一套 Web 前端解决方案，所以 Qing 不只是关注项目的初始状态，而是整体的工作流程，  
这是 Qing 与现有开源的开发模版显著差异的一点。Qing 的体验必须是高效且愉悦的，拒绝繁琐与重复。  
其足够的 Qing 量，只需 30 分钟内即可掌握最先进的 Web 开发技能。以下是 Qing 所基于的开发理念：

1.  移动端优先，兼容 PC 端
2.  向前看齐，基于 ES5 开发
3.  模块化 Web 开发过程
4.  自动构建与部署集成，基于 [Mod.js](https://github.com/modulejs/modjs) 工具

基于未来趋势的开发理念，Qing 旨在提供工程化方案。

平台与浏览器版本兼容：

-   iOS 4.0+
-   Android 2.2+
-   IE 6+
-   Chrome
-   Firefox
-   Safari

### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#%E5%BC%80%E5%A7%8B%E4%BD%BF%E7%94%A8)开始使用

可以通过以下任意一种方式开始使用 Qing 模版：

1.  [下载最新 Qing 模版包](https://github.com/AlloyTeam/Qing/archive/master.zip), 解压至目标目录
2.  如果已安装 git，可使用 git clone 源码至目标目录：

    ```html
    <span class="nv">$ </span>git clone https://github.com/AlloyTeam/Qing.git
    ```
3.  如果已安装了 Mod.js, 推荐在目标目录执行：

    ```c
    <span class="nv">$ </span>m download AlloyTeam/Qing
    ```

    第一次使用 `m download` 命令，需要先安装 `mod-tar` 插件：

    ```html
    <span class="nv">$ </span>npm install mod-tar -g
    ```
4.  如果您是一位女开发，请忽略下文直接联系笔者，深圳优先。

### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#%E6%A8%A1%E7%89%88%E7%BB%93%E6%9E%84)模版结构

团队的协作离不开一些基本的约定，Qing 约定以下文件目录结构：

    .
    ├── css
    │   ├── main.css
    │   └── normalize.css
    ├── img
    ├── js
    │   ├── main.js
    │   └── vendor
    ├── tpl
    ├── .editorconfig
    ├── index.html
    └── Modfile.js
     

-   目录 `css` 托管样式文件
-   目录 `img` 托管图片文件
-   目录 `js` 托管 JavaScript 文件
-   目录 `tpl` 托管模版文件
-   `.editorconfig` 约定团队基础代码风格
-   `index.html` 是入口 HTML 文件
-   `Modfile.js` 是 Mod.js 配置文件

### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#%E6%A8%A1%E5%9D%97%E5%8C%96%E7%BC%96%E7%A8%8B%E6%8C%87%E5%BC%95)模块化编程指引

Qing 推荐模块化的开发过程，模块化开发后无论在代码可维护性与复用，还是团队协作上都将变的更加直观、轻松与高效。

#### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#css%E6%A8%A1%E5%9D%97%E5%8C%96)CSS 模块化

通过原生 CSS 内置的 @import 机制管理 CSS 模块，在构建过程中会自动合并压缩（在下文的优化章节也有说明）：

```html
<span class="k">@import</span> <span class="s2">"normalize.css"</span><span class="p">;</span>
<span class="k">@import</span> <span class="s2">"widget1.css"</span><span class="p">;</span>
<span class="k">@import</span> <span class="s2">"widget2.css"</span><span class="p">;</span>
<span class="k">@import</span> <span class="s2">"widget3.css"</span><span class="p">;</span>
```

#### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#js%E6%A8%A1%E5%9D%97%E5%8C%96)JS 模块化

约定引入 AMD 规范来管理 JS 模块，关于第一次接触 AMD 的读者，笔者推荐可以先 Google 了解后再进行下一步：

```html
<span class="c1">// main.js</span>
<span class="nx">define</span><span class="p">([</span><span class="s2">"./app"</span><span class="p">],</span> <span class="kd">function</span><span class="p">(</span><span class="nx">app</span><span class="p">){</span>
    <span class="nx">app</span><span class="p">.</span><span class="nx">init</span><span class="p">()</span>
<span class="p">})</span>
```

```html
<span class="c1">// app.js</span>
<span class="nx">define</span><span class="p">(</span><span class="kd">function</span><span class="p">(){</span>
    <span class="k">return</span> <span class="p">{</span>
        <span class="nx">init</span><span class="o">:</span> <span class="kd">function</span><span class="p">(){}</span>
    <span class="p">}
```


<!-- {% endraw %} - for jekyll -->