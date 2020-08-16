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
    <span class="p">}</span>
<span class="p">})</span>
```

#### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#html%E6%A8%A1%E5%9D%97%E5%8C%96)HTML 模块化

HTML 模块指代 HTML 模版文件，通过 `requirejs-tmpl` 插件将 HTML 分模块管理，`requirejs-tmpl` 没有默认打包在 Qing 模版中，可手动下载  
[requirejs-tmpl](https://raw.github.com/modulejs/requirejs-tmpl/master/tmpl.js) 插件至 js 目录，或通过执行 `m download:tmpl`  
命令自动安装插件：

```html
<span class="c"><!-- tpl/headerTpl.html --></span>
<span class="nt"><header></span><span class="err"><</span>%= title %><span class="nt"></header></span>
<span class="c"><!-- HTMl模版可依赖其他HTML模块 --></span>
<span class="err"><</span>%@ ./navTpl.html %>
```

```html
<span class="c"><!-- tpl/navTpl.html --></span>
<span class="nt"><a</span> <span class="na">href=</span><span class="s">"<%= url %>"</span><span class="nt">></span>View On Github<span class="nt"></a></span>
```

```html
<span class="c"><!-- tpl/footerTpl.html --></span>
<span class="nt"><footer></span><span class="err"><</span>%= copyright %><span class="nt"></header></span>
```

在 HTML 模版的引入是基于 `requirejs` 的插件机制，所以在具体路径前需加上 `tmpl!` 前缀，表示其是 HTML 模版，例如：`tmpl!../tpl/headerTpl.html`。  
引用的模版已通过插件自动编译，得到的函数如 `headerTpl` 直接传入需要绑定的数据即可：

```html
<span class="c1">// js/app.js</span>
<span class="nx">define</span><span class="p">([</span><span class="s2">"tmpl!../tpl/headerTpl.html"</span><span class="p">,</span> <span class="s2">"tmpl!../tpl/footerTpl.html"</span><span class="p">],</span> <span class="kd">function</span><span class="p">(</span><span class="nx">headerTpl</span><span class="p">,</span> <span class="nx">footerTpl</span><span class="p">){</span>
    <span class="kd">var</span> <span class="nx">html1</span> <span class="o">=</span> <span class="nx">headerTpl</span><span class="p">({</span><span class="nx">title</span><span class="o">:</span> <span class="s2">"Hello Qing"</span><span class="p">,</span> <span class="nx">url</span><span class="o">:</span> <span class="s2">"http://github.com/AlloyTeam/Qing"</span><span class="p">})</span>
    <span class="kd">var</span> <span class="nx">html2</span> <span class="o">=</span> <span class="nx">footerTpl</span><span class="p">({</span><span class="nx">copyright</span><span class="o">:</span> <span class="s2">"AlloyTeam"</span><span class="p">})</span>
    <span class="c1">// balabala</span>
<span class="p">})</span>
```

### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#%E8%87%AA%E5%8A%A8%E5%8C%96%E5%B7%A5%E5%85%B7%E7%9A%84%E7%8E%AF%E5%A2%83%E5%AE%89%E8%A3%85)自动化工具的环境安装

1.  安装 [Node.js](http://nodejs.org/)
2.  安装 [Mod.js](http://madscript.com/modjs/)

Mod.js 是基于 Node.js 的工作流工具，安装 Node.js 环境后使用 NPM 安装 Mod.js:

```html
<span class="nv">$ </span>npm install modjs -g
```

### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#%E4%B8%80%E9%94%AE%E6%9E%84%E5%BB%BA)一键构建

成功安装 Mod.js 后，进入 Modfile 所在的项目根目录，只需执行 `m` 命令，一切如此简单，如假包换的一键构建：

```html
<span class="nv">$ </span>m
```

执行完成后会在当前目录下生成 `dist` 目录输出构建后的结果。

### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96)性能优化

浏览器第一次请求服务器的过程至少需经过 3RTTs：DNS 域名解析 1RTT；TCP 连接建立 1RTT；HTTP 请求并且返回第一个比特的数据 1RTT。  
而这在移动基站网络下请求则显得异常缓慢，在我们的监测中，在 2G 网络下仅 DNS 时间即可达到 200ms，性能不容乐观。  
所以尽可能快的完成页面加载在移动端显得更加重要，而如何合理的减少页面初始资源请求数是加快页面加载最有效的方式：

#### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#%E5%90%88%E5%B9%B6js%E6%A8%A1%E5%9D%97)合并 JS 模块

Qing 支持传统的手动模块加载管理与基于 AMD 的模块加载管理方式，同时我们推荐使用 Require.js 作为开发过程中的模块加载工具。

````html
<span class="c"><!-- JS模块模块手动管理 --></span>
<span class="nt">
```html
<script </span><span class="na">src=</span><span class="s">"js/fastclick.js"</span><span class="nt">></script>
````

</span>
<span class="nt">
```html
<script </span><span class="na">src=</span><span class="s">"js/spin.js"</span><span class="nt">></script>
```
</span>
<span class="nt">
```html
<script </span><span class="na">src=</span><span class="s">"js/main.js"</span><span class="nt">></script>
```
</span>
```

传统的手动添加模块会自动合并，其按照合并连续引入资源的规则进行，最终输出：

````html
<span class="nt">
```html
<script </span><span class="na">src=</span><span class="s">"js/89ef9b6e.fastclick_main_3_520.js"</span><span class="nt">></script>
````

</span>
```

````html
<span class="c"><!-- data-main属性值为执行入口JS文件地址 --></span>
<span class="nt">
```html
<script </span><span class="na">data-main=</span><span class="s">"js/main"</span> <span class="na">src=</span><span class="s">"http://requirejs.org/docs/release/2.1.6/minified/require.js"</span><span class="nt">></script>
````

</span>
```

通过模块加载器方式，Qing 会自动移除模块加载器本身，其并不打包进最终输出的文件：

````c
<span class="nt">
```html
<script </span><span class="na">src=</span><span class="s">"js/89ef9b6e.main.js"</span><span class="nt">></script>
````

</span>
```

Qing 默认开启的是移除 `define` 生成模块管理器无依赖代码的 `stripDefine` 优化模式。`stripDefine` 优化模式的配置在 `Modfile.js` 的 build 任务中：

```html
<span class="nx">build</span><span class="o">:</span> <span class="p">{</span>
    <span class="nx">src</span><span class="o">:</span> <span class="s2">"./index.html"</span><span class="p">,</span>
    <span class="nx">stripDefine</span><span class="o">:</span> <span class="kc">true</span>
<span class="p">}</span>
```

在 `stripDefine` 优化模式下，基于 AMD 规范文件：

```html
<span class="c1">// base/clone.js</span>
<span class="nx">define</span><span class="p">(</span><span class="kd">function</span><span class="p">(){</span>
    <span class="k">return</span> <span class="kd">function</span><span class="p">(</span><span class="nx">obj</span><span class="p">){</span>
        <span class="k">return</span> <span class="nb">Object</span><span class="p">.</span><span class="nx">create</span><span class="p">(</span><span class="nx">obj</span><span class="p">)</span>
    <span class="p">}</span>
<span class="p">})</span>
```

```html
<span class="c1">// foo.js</span>
<span class="nx">define</span><span class="p">([</span><span class="s1">'./base/clone'</span><span class="p">],</span> <span class="kd">function</span><span class="p">(</span><span class="nx">clone</span><span class="p">){</span>
    <span class="k">return</span> <span class="nx">clone</span><span class="p">({</span><span class="nx">foo</span><span class="o">:</span><span class="mi">1</span><span class="p">})</span>
<span class="p">})</span>
```

```html
<span class="c1">// bar.js</span>
<span class="nx">define</span><span class="p">([</span><span class="s1">'./base/clone'</span><span class="p">],</span> <span class="kd">function</span><span class="p">(</span><span class="nx">clone</span><span class="p">){</span>
    <span class="k">return</span> <span class="nx">clone</span><span class="p">({</span><span class="nx">bar</span><span class="o">:</span><span class="mi">2</span><span class="p">})</span>
<span class="p">})</span>
```

```html
<span class="c1">// main.js</span>
<span class="nx">define</span><span class="p">(</span><span class="s1">'./foo'</span><span class="p">,</span> <span class="s1">'./bar'</span><span class="p">],</span> <span class="kd">function</span><span class="p">(</span><span class="nx">foo</span><span class="p">,</span> <span class="nx">bar</span><span class="p">){</span>
    <span class="nx">foo</span><span class="p">.</span><span class="nx">bar</span> <span class="o">=</span> <span class="mi">2</span><span class="p">;</span>
    <span class="nx">bar</span><span class="p">.</span><span class="nx">foo</span> <span class="o">=</span> <span class="mi">1</span><span class="p">;</span>
<span class="p">})</span>
```

编译后会在移除 define 的同时将模块代码转换为变量声明格式的代码：

```html
<span class="p">(</span><span class="kd">function</span><span class="p">(</span><span class="nb">window</span><span class="p">,</span> <span class="kc">undefined</span><span class="p">){</span>
    <span class="kd">var</span> <span class="nx">base_clone</span> <span class="o">=</span> <span class="p">(</span><span class="kd">function</span><span class="p">(){</span>
         <span class="k">return</span> <span class="kd">function</span><span class="p">(</span><span class="nx">obj</span><span class="p">){</span>
             <span class="k">return</span> <span class="nb">Object</span><span class="p">.</span><span class="nx">create</span><span class="p">(</span><span class="nx">obj</span><span class="p">)</span>
         <span class="p">}</span>
    <span class="p">})();</span>
 
    <span class="kd">var</span> <span class="nx">foo</span> <span class="o">=</span> <span class="p">(</span><span class="kd">function</span><span class="p">(</span><span class="nx">clone</span><span class="p">){</span>
        <span class="k">return</span> <span class="nx">clone</span><span class="p">({</span><span class="nx">bar</span><span class="o">:</span><span class="mi">2</span><span class="p">})</span>
    <span class="p">})(</span><span class="nx">base_clone</span><span class="p">);</span>
 
    <span class="kd">var</span> <span class="nx">foo</span> <span class="o">=</span> <span class="p">(</span><span class="kd">function</span><span class="p">(</span><span class="nx">clone</span><span class="p">){</span>
        <span class="k">return</span> <span class="nx">clone</span><span class="p">({</span><span class="nx">foo</span><span class="o">:</span><span class="mi">1</span><span class="p">})</span>
    <span class="p">})(</span><span class="nx">base_clone</span><span class="p">);</span>
 
    <span class="kd">var</span> <span class="nx">main</span> <span class="o">=</span> <span class="p">(</span><span class="kd">function</span><span class="p">(</span><span class="nx">foo</span><span class="p">,</span> <span class="nx">bar</span><span class="p">){</span>
        <span class="nx">foo</span><span class="p">.</span><span class="nx">bar</span> <span class="o">=</span> <span class="mi">2</span><span class="p">;</span>
        <span class="nx">bar</span><span class="p">.</span><span class="nx">foo</span> <span class="o">=</span> <span class="mi">1</span><span class="p">;</span>
    <span class="p">})(</span><span class="nx">foo</span><span class="p">,</span> <span class="nx">bar</span><span class="p">);</span>
 
<span class="p">})(</span><span class="k">this</span><span class="p">)</span>
```

#### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#%E5%90%88%E5%B9%B6css-imports)合并 CSS @imports

在页面中引入了样式文件 `css/main.css`：

```html
<span class="nt"><link</span> <span class="na">rel=</span><span class="s">"stylesheet"</span> <span class="na">href=</span><span class="s">"css/main.css"</span><span class="nt">></span>
```

而 `css/main.css` 中使用了 CSS`@import` 机制来引入其他模块的样式文件：

```ruby
<span class="k">@import</span> <span class="s2">"foo.css"</span><span class="p">;</span>
<span class="k">@import</span> <span class="s2">"bar.css"</span><span class="p">;</span>
<span class="k">@import</span> <span class="s2">"baz.css"</span><span class="p">;</span>
```

使用 CSS 原生 `@import` 机制模块化开发 CSS 是 Qing 推荐的方式，然不做优化直接发布到线上必然有性能问题，这是绝不允许的。

Qing 在构建的时候会自动侦测所有引入的样式文件是否使用了 `@import`，并进行合并优化。

#### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#%E5%90%88%E5%B9%B6%E8%BF%9E%E7%BB%AD%E5%BC%95%E5%85%A5%E8%B5%84%E6%BA%90)合并连续引入资源

当页面中引入了多个样式文件或脚本文件：

````html
<span class="nt"><link</span> <span class="na">rel=</span><span class="s">"stylesheet"</span> <span class="na">href=</span><span class="s">"css/base.css"</span><span class="nt">></span>
<span class="nt"><link</span> <span class="na">rel=</span><span class="s">"stylesheet"</span> <span class="na">href=</span><span class="s">"css/typo.css"</span><span class="nt">></span>
<span class="nt"><link</span> <span class="na">rel=</span><span class="s">"stylesheet"</span> <span class="na">href=</span><span class="s">"css/main.css"</span><span class="nt">></span>
 
<span class="nt">
```html
<script </span><span class="na">src=</span><span class="s">"js/fastclick.js"</span><span class="nt">></script>
````

</span>
<span class="nt">
```html
<script </span><span class="na">src=</span><span class="s">"js/spin.js"</span><span class="nt">></script>
```
</span>
<span class="nt">
```html
<script </span><span class="na">src=</span><span class="s">"js/main.js"</span><span class="nt">></script>
```
</span>
```

构建程序会将多个连续的静态资源文件进行合并：

````html
<span class="nt"><link</span> <span class="na">rel=</span><span class="s">"stylesheet"</span> <span class="na">href=</span><span class="s">"css/89ef9b6e.base_main_3_630.css"</span><span class="nt">></span>
 
<span class="nt">
```html
<script </span><span class="na">src=</span><span class="s">"js/89ef9b6e.fastclick_main_3_520.js"</span><span class="nt">></script>
````

</span>
```

#### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#data-rev%E9%85%8D%E7%BD%AE)data-rev 配置

Qing 会自动给所有优化后的静态资源加上类似 `89ef9b6e.` 的指纹标示前缀来区分版本，此行为是默认打开，  
可以通过 `data-no-rev` 声明来关闭，也可以 `data-rev` 声明开启。

````html
<span class="nt"><html</span> <span class="na">data-no-rev</span><span class="nt">></span>
<span class="nt"><link</span> <span class="na">rel=</span><span class="s">"stylesheet"</span> <span class="na">href=</span><span class="s">"css/main.css"</span><span class="nt">></span>
<span class="nt">
```html
<script </span><span class="na">data-rev</span> <span class="na">src=</span><span class="s">"js/main.js"</span><span class="nt">></script>
````

</span>
<span class="nt"><img</span> <span class="na">src=</span><span class="s">"img/foo.png"</span><span class="nt">></span>
```

如上通过在 HTML 标签中`<html data-no-rev>` 设置全局的策略，同时可在具体的标签上覆盖全局设置，如上构建后的结果：

````html
<span class="nt"><html></span>
<span class="nt"><link</span> <span class="na">rel=</span><span class="s">"stylesheet"</span> <span class="na">href=</span><span class="s">"css/main.css"</span><span class="nt">></span>
<span class="nt">
```html
<script </span><span class="na">src=</span><span class="s">"js/89ef9b6e.main.js"</span><span class="nt">></script>
````

</span>
<span class="nt"><img</span> <span class="na">src=</span><span class="s">"img/foo.png"</span><span class="nt">></span>
```

#### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#data-stand-alone%E9%85%8D%E7%BD%AE)data-stand-alone 配置

有时要求某个基础库文件如 jQuery 能被不同页面复用引入，而不是分别被打包在页面级别的资源包内，  
如此利用浏览器天然的缓存机制使无需重新请求相同的资源内容，  
Qing 在默认构建约定的基础上同时提供了基于 DOM 的 `data-stand-alone` 配置。

````html
<span class="nt">
```html
<script </span><span class="na">data-stand-alone</span> <span class="na">src=</span><span class="s">"vendor/jquery-2.0.3.js"</span><span class="nt">></script>
````

</span>
<span class="nt">
```html
<script </span><span class="na">src=</span><span class="s">"js/foo.js"</span><span class="nt">></script>
```
</span>
<span class="nt">
```html
<script </span><span class="na">src=</span><span class="s">"js/bar.js"</span><span class="nt">></script>
```
</span>
<span class="nt">
```html
<script </span><span class="na">src=</span><span class="s">"js/baz.js"</span><span class="nt">></script>
```
</span>
```

构建结果：

````html
<span class="nt">
```html
<script </span><span class="na">data-stand-alone</span> <span class="na">src=</span><span class="s">"vendor/92cf6237.jquery-2.0.3.js"</span><span class="nt">></script>
````

</span>
<span class="nt">
```html
<script </span><span class="na">src=</span><span class="s">"js/92cf6237.foo_baz_3_168.js"</span><span class="nt">></script>
```
</span>
```

#### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#data-group%E9%85%8D%E7%BD%AE)data-group 配置

如何重复利用浏览器的并发请求数但同时考虑不至于有过多请求数上的负载，在不同场景下优化策略会有不同：  
当需兼容 IE 老版本的情况下，初始并发请求数不推荐超过 2 个，但同时我们推荐单个资源包的大小 Gzip 前不超过 200k，  
所以通常如何来控制打包粒度是需要监控数据来支撑的。Qing 在构建中提供了 `data-group` 分组参数来辅助打包粒度的控制：

````html
<span class="nt">
```html
<script </span><span class="na">data-group=</span><span class="s">1</span> <span class="na">src=</span><span class="s">"js/foo.js"</span><span class="nt">></script>
````

</span>
<span class="nt">
```html
<script </span><span class="na">data-group=</span><span class="s">1</span> <span class="na">src=</span><span class="s">"js/bar.js"</span><span class="nt">></script>
```
</span>
<span class="nt">
```html
<script </span><span class="na">data-group=</span><span class="s">1</span> <span class="na">src=</span><span class="s">"js/baz.js"</span><span class="nt">></script>
```
</span>
<span class="nt">
```html
<script </span><span class="na">data-group=</span><span class="s">2</span> <span class="na">src=</span><span class="s">"js/qux.js"</span><span class="nt">></script>
```
</span>
<span class="nt">
```html
<script </span><span class="na">data-group=</span><span class="s">2</span> <span class="na">src=</span><span class="s">"js/quux.js"</span><span class="nt">></script>
```
</span>
<span class="nt">
```html
<script </span><span class="na">data-group=</span><span class="s">2</span> <span class="na">src=</span><span class="s">"js/corge.js"</span><span class="nt">></script>
```
</span>
```

构建结果：

````html
<span class="nt">
```html
<script </span><span class="na">data-group=</span><span class="s">1</span> <span class="na">src=</span><span class="s">"js/92cf6237.foo_baz_3_168.js"</span><span class="nt">></script>
````

</span>
<span class="nt">
```html
<script </span><span class="na">data-group=</span><span class="s">2</span> <span class="na">src=</span><span class="s">"js/090430cf.qux_corge_3_171.js"</span><span class="nt">></script>
```
</span>
```

#### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#data-url-prepend%E9%85%8D%E7%BD%AE)data-url-prepend 配置

资源 CDN 化是基本的优化策略，

````html
<span class="nt"><html</span> <span class="na">data-url-prepend=</span><span class="s">"http://cdn1.qq.com/"</span><span class="nt">></span>
<span class="nt">
```html
<script </span><span class="na">data-group=</span><span class="s">1</span> <span class="na">src=</span><span class="s">"js/foo.js"</span><span class="nt">></script>
````

</span>
<span class="nt">
```html
<script </span><span class="na">data-group=</span><span class="s">1</span> <span class="na">src=</span><span class="s">"js/bar.js"</span><span class="nt">></script>
```
</span>
<span class="nt">
```html
<script </span><span class="na">data-group=</span><span class="s">1</span> <span class="na">src=</span><span class="s">"js/baz.js"</span><span class="nt">></script>
```
</span>
<span class="nt">
```html
<script </span><span class="na">data-group=</span><span class="s">2</span> <span class="na">data-url-prepend=</span><span class="s">"http://cdn2.qq.com/"</span> <span class="na">src=</span><span class="s">"js/qux.js"</span><span class="nt">></script>
```
</span>
<span class="nt">
```html
<script </span><span class="na">data-group=</span><span class="s">2</span> <span class="na">src=</span><span class="s">"js/quux.js"</span><span class="nt">></script>
```
</span>
<span class="nt">
```html
<script </span><span class="na">data-group=</span><span class="s">2</span> <span class="na">src=</span><span class="s">"js/corge.js"</span><span class="nt">></script>
```
</span>
```

构建结果：

````c
<html>

```html
<script data-group=1 src="http://cdn1.qq.com/js/92cf6237.foo_baz_3_168.js"></script>
````

```html
<script data-group=2 src="http://cdn2.qq.com/js/090430cf.qux_corge_3_171.js"></script>
```

 

````

#### [](#%E5%86%85%E5%B5%8C%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90)内嵌静态资源

所谓减少请求数最优的目标就是没有请求，Qing 提供了基于 QueryString 的 `embed` 配置使支持在构建时将静态资源内嵌于 HTML 中，  
如此便可优化至最理想的情况：只需下载必不可少的 HTML 资源文件。

##### [](#%E5%86%85%E5%B5%8C%E6%A0%B7%E5%BC%8F)内嵌样式

```html
<span class="nt"><link</span> <span class="na">rel=</span><span class="s">"stylesheet"</span> <span class="na">href=</span><span class="s">"css/base.css?embed"</span><span class="nt">></span>
<span class="nt"><link</span> <span class="na">rel=</span><span class="s">"stylesheet"</span> <span class="na">href=</span><span class="s">"css/typo.css"</span><span class="nt">></span>
<span class="nt"><link</span> <span class="na">rel=</span><span class="s">"stylesheet"</span> <span class="na">href=</span><span class="s">"css/main.css"</span><span class="nt">></span>
````

构建结果：

```html
<span class="nt">
    <style></span>
    <span class="nt">css</span>
    <span class="o">/</span>
    <span class="nt">base</span>
    <span class="nc">.css</span>
    <span class="o">...</span>
    <span class="nt">css</span>
    <span class="o">/</span>
    <span class="nt">typo</span>
    <span class="nc">.css</span>
    <span class="o">...</span>
    <span class="nt">css</span>
    <span class="o">/</span>
    <span class="nt">main</span>
    <span class="nc">.css</span>
    <span class="o">...</span>
    <span class="nt"></style>
</span>;
```

##### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#%E5%86%85%E5%B5%8C%E8%84%9A%E6%9C%AC)内嵌脚本

````html
<span class="nt">
```html
<script </span><span class="na">src=</span><span class="s">"js/fastclick.js?embed"</span><span class="nt">></script>
````

</span>
<span class="nt">
```html
<script </span><span class="na">src=</span><span class="s">"js/spin.js"</span><span class="nt">></script>
```
</span>
<span class="nt">
```html
<script </span><span class="na">src=</span><span class="s">"js/main.js"</span><span class="nt">></script>
```
</span>
```

构建结果：

````html
<span class="nt">
    
```html
<script></span>
    <span class="nx">js</span>
    <span class="o">/</span>
    <span class="nx">fastclick</span>
    <span class="p">.</span>
    <span class="nx">js</span>
    <span class="p">...</span>
    <span class="nx">js</span>
    <span class="o">/</span>
    <span class="nx">spin</span>
    <span class="p">.</span>
    <span class="nx">js</span>
    <span class="p">...</span>
    <span class="nx">js</span>
    <span class="o">/</span>
    <span class="nx">main</span>
    <span class="p">.</span>
    <span class="nx">js</span>
    <span class="p">...</span>
    <span class="nt"></script>
````

</span>;

````

##### [](#%E5%86%85%E5%B5%8C%E5%9B%BE%E7%89%87)内嵌图片

###### [](#%E5%86%85%E5%B5%8Ccss%E9%87%8C)内嵌 CSS 里

```html
<span class="nf">#foo</span> <span class="p">{</span>
    <span class="k">background</span><span class="o">:</span> <span class="sx">url('../img/icon.png?embed')</span> <span class="k">no-repeat</span><span class="p">;</span>
    <span class="k">height</span><span class="o">:</span> <span class="m">24px</span><span class="p">;</span>
    <span class="k">width</span><span class="o">:</span> <span class="m">24px</span>
<span class="p">}</span>
````

构建结果：

```html
<span class="nf">#foo</span> <span class="p">{</span>
    <span class="k">background</span><span class="o">:</span> <span class="sx">url(data:image/png;base64,iVBORw0...)</span> <span class="k">no-repeat</span><span class="p">;</span>
    <span class="k">height</span><span class="o">:</span> <span class="m">24px</span><span class="p">;</span>
    <span class="k">width</span><span class="o">:</span> <span class="m">24px</span>
<span class="p">}</span>
```

###### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#%E5%86%85%E5%B5%8Chtml%E9%87%8C)内嵌 HTML 里

```html
<span class="nt"><img</span> <span class="na">src=</span><span class="s">"./img/icon.png?embed"</span><span class="nt">></span>
```

构建结果：

```html
<span class="nt"><img</span> <span class="na">src=</span><span class="s">"data:image/png;base64,iVBORw0..."</span><span class="nt">></span>
```

### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#%E5%9F%BA%E7%A1%80%E5%BA%93)基础库

Qing 总是想法设法的让开发过程更自动更流畅，在 Qing 模版的 `Modfile.js` 中提供了以下第三方库的下载配置：

-   FastClick
-   Spin.js
-   Zepto
-   jQuery 1.x
-   jQuery 2.x
-   require.js 2.1.9
-   requirejs-tmpl

截取 `Modfile.js` 中关于第三方库的配置，src 表示源地址，dest 表示下载目录，  
除了 tmpl 插件下载至 `js/`目录其他所有第三方库都默认下载至 `js/vendor/`目录：

```html
<span class="p">{</span>
    <span class="nx">options</span><span class="o">:</span> <span class="p">{</span>
        <span class="nx">dest</span><span class="o">:</span> <span class="s2">"js/vendor/"</span>
    <span class="p">},</span>
    <span class="nx">fastclick</span><span class="o">:</span> <span class="p">{</span>
        <span class="nx">src</span><span class="o">:</span> <span class="s2">"https://raw.github.com/ftlabs/fastclick/master/lib/fastclick.js"</span>
    <span class="p">},</span>
    <span class="nx">spin</span><span class="o">:</span> <span class="p">{</span>
        <span class="nx">src</span><span class="o">:</span> <span class="s2">"https://raw.github.com/fgnass/spin.js/gh-pages/dist/spin.js"</span>
    <span class="p">},</span>
    <span class="nx">zepto</span><span class="o">:</span> <span class="p">{</span>
        <span class="nx">src</span><span class="o">:</span> <span class="s2">"http://zeptojs.com/zepto.js"</span>
    <span class="p">},</span>
    <span class="nx">jquery1</span><span class="o">:</span> <span class="p">{</span>
        <span class="nx">src</span><span class="o">:</span> <span class="s2">"http://code.jquery.com/jquery-1.10.2.js"</span>
    <span class="p">},</span>
    <span class="nx">jquery2</span><span class="o">:</span> <span class="p">{</span>
        <span class="nx">src</span><span class="o">:</span> <span class="s2">"http://code.jquery.com/jquery-2.0.3.js"</span>
    <span class="p">},</span>
    <span class="nx">requirejs</span><span class="o">:</span> <span class="p">{</span>
        <span class="nx">src</span><span class="o">:</span> <span class="s2">"http://requirejs.org/docs/release/2.1.9/comments/require.js"</span>
    <span class="p">},</span>
    <span class="nx">tmpl</span><span class="o">:</span> <span class="p">{</span>
        <span class="nx">dest</span><span class="o">:</span> <span class="s1">'js/'</span><span class="p">,</span>
        <span class="nx">src</span><span class="o">:</span> <span class="s2">"https://raw.github.com/modulejs/requirejs-tmpl/master/tmpl.js"</span>
    <span class="p">}</span>
<span class="p">}</span>
```

下载全部库至本地方式非常简单，只需在根目录下执行：

```html
<span class="nv">$ </span>m vendor
```

如只需下载 Zepto：

```c
<span class="nv">$ </span>m download:zepto
```

### [](http://www.alloyteam.com/2013/11/mobile-web-project-template-qing/#%E7%A4%BE%E5%8C%BA)社区

需求、改进与建议，可在 [Github issues](https://github.com/AlloyTeam/Qing/issues) 提单，会一一解答。同时 Qing 是面向社区的开源项目，  
邀请社区朋友共同参与贡献，如你觉得 Qing 很棒很酷，也可以帮助我们在微博与博客中推广与传播。

<!-- {% endraw %} - for jekyll -->