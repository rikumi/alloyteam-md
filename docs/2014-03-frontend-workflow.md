---
title: 停不下来的前端，自动化流程
date: 2014-03-01
author: TAT.yuanyan
source_link: http://www.alloyteam.com/2014/03/frontend-workflow/
---

<!-- {% raw %} - for jekyll -->

[![2014-03-04_171121](http://www.alloyteam.com/wp-content/uploads/2014/03/2014-03-04_171121.png)](http://www.alloyteam.com/wp-content/uploads/2014/03/2014-03-04_171121.png)

## 流程

关于流程，是从项目启动到发布的过程。在前端通常我们都做些什么？

1.  切图，即从设计稿中获取需要的素材，并不是所有前端开发都被要求切图，也不是所有前端开发都会切图，但请享受学习新知识的过程吧。
2.  创建模版（html、jade、haml）、脚本（javascript、coffeescript）、样式（css、less、sass、stylus）文件，搭建基础的项目骨架。
3.  文件（jade、coffeescript、less、sass...）编译
4.  执行测试用例
5.  代码检测
6.  移除调试代码
7.  静态资源合并与优化
8.  静态资源通过 hash 计算指纹化
9.  部署测试环境
10. 灰度发布现网

## [](http://www.alloyteam.com/2014/03/frontend-workflow/#%E5%B7%A5%E5%85%B7%E5%8C%96)工具化

每个流程中的过程单元，我们抽象为一个 Task，即任务。把可重复规则的过程进行工具化，如把 JavaScript 代码压缩过程工具化，而 UglifyJS 是具体执行任务的工具，CSS 代码压缩器 CleanCSS 是具体执行任务的工具。

工具文化几乎是大平台互联网公司共有的特质，我们无法确定是工具文化驱动了 Google、Facebook 这类互联网公司的快速发展，还是快速发展的需要使其在内推广工具文化，但可以明确的是工具文化必不可少。在 Facebook 第二位中国籍工程师王淮的书中也提到提到：  
当时招聘他进 Facebook 的总监黄易山，是对内部工具的最有力倡导者：

    他极度建议，公司要把最好的人才放到工具开发那一块，因为工具做好了，可以达到事半功倍的效果，所有人的效率都可以得到提高，而不仅仅是工程师。
     

在腾讯，工具文化虽没有被明确指出，但大平台公司对工具化的坚持是一致的：凡是被不断重复的过程，将其工具化，绑定到自动化流程之中。技术产品也需要 `Don’t make me think` 的方式来推广最佳实践。总而言之：依靠工具，而不是经验。

## [](http://www.alloyteam.com/2014/03/frontend-workflow/#%E8%87%AA%E5%8A%A8%E5%8C%96%E6%B5%81%E7%A8%8B)自动化流程

任务工具化是自动化流程的基础，我想你已经听说过任务运行器 Grunt。Grunt 帮助开发者把任务单元建立连接，如代码编译 Task 执行完后执行检测 Task，检测 Task 执行完后执行压缩 Task。虽然 Grunt 是基于 Node.js 平台，但其定位是个通用任务管理器，通用往往意味着更高的学习与实施成本。专注于 Web 开发领域腾讯有 Mod.js 来实施前端自动化，通过 Mod.js 有效的简化 Web 开发自动化流程实施成本。

## [](http://www.alloyteam.com/2014/03/frontend-workflow/#%E5%AE%9E%E6%96%BDmodjs)实施 Mod.js

Mod.js 并不是简单的任务运行器，其内置集成了 Web 前端开发常用的工具集，覆盖了 80% 的前端使用场景，而另外的 20% 则可通过 Mod.js 的插件机制来扩展。

### [](http://www.alloyteam.com/2014/03/frontend-workflow/#%E7%9B%B8%E9%81%87)相遇

Mod.js:<https://github.com/modjs/mod> 可通过 [NPM](https://npmjs.org/) 来安装最新的版本，在你来到 [Node.js](http://nodejs.org/) 的编程世界时已同时附带了 NPM，当前 Mod.js 最新版本 `0.4.x` 要求 Node.js 要求`>= 0.8.0`：

```html
<span class="nv">$ </span>npm install modjs -g
```

`-g` 参数表示把 Mod.js 安装到全局，如此 `mod` 命令将会在 `system path` 内，方便在任何一个目录启动 Mod.js 任务。

### [](http://www.alloyteam.com/2014/03/frontend-workflow/#%E7%9B%B8%E8%AF%86)相识

Mod.js 通过 Modfile.js 文件驱动任务执行，可以手动创建一个 Modfile.js 文件，也可以通过模版初始化一个 Modfile.js 文件：

```c
<span class="nv">$ </span>mod init modfile
```

Modfile.js 是一个 Plain Node Module, 通过 `Runner` 对象来描述任务的具体执行过程：

```html
<span class="c1">// 暴露Runner对象</span>
<span class="nx">module</span><span class="p">.</span><span class="nx">exports</span> <span class="o">=</span> <span class="p">{}</span>
```

如是异步配置，则可通过回调模式传递 Runner 对象：

```html
<span class="nx">module</span><span class="p">.</span><span class="nx">exports</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">options</span><span class="p">,</span> <span class="nx">done</span><span class="p">){</span>
    <span class="nx">setTimeout</span><span class="p">(</span> <span class="kd">function</span><span class="p">(){</span>
        <span class="c1">// 回调Runner对象</span>
        <span class="kd">var</span> <span class="nx">runner</span> <span class="o">=</span> <span class="p">{};</span>
        <span class="nx">done</span><span class="p">(</span><span class="nx">runner</span><span class="p">);</span>
    <span class="p">},</span> <span class="mi">1000</span><span class="p">)</span>
<span class="p">}</span>
```

借此一瞥通常 `Runner` 对象的全貌：

```html
<span class="nx">module</span><span class="p">.</span><span class="nx">exports</span> <span class="o">=</span> <span class="p">{</span>
    <span class="nx">version</span><span class="o">:</span> <span class="s2">">=0.4.3"</span><span class="p">,</span>
    <span class="nx">plugins</span><span class="o">:</span> <span class="p">{</span>
        <span class="nx">pngcompressor</span> <span class="o">:</span> <span class="s2">"mod-png-compressor"</span><span class="p">,</span>
        <span class="nx">compress</span>      <span class="o">:</span> <span class="s2">"grunt-contrib-compress"</span>
    <span class="p">},</span>
    <span class="nx">tasks</span><span class="o">:</span> <span class="p">{</span>
        <span class="nx">asset</span><span class="o">:</span> <span class="s2">"asset"</span><span class="p">,</span>
        <span class="nx">online</span><span class="o">:</span> <span class="s2">"online_dist"</span><span class="p">,</span>
        <span class="nx">offline</span><span class="o">:</span> <span class="s2">"offline_dist"</span><span class="p">,</span>
        <span class="nx">offlinePackage</span><span class="o">:</span> <span class="s2">"{{offline}}/package.zip"</span><span class="p">,</span>
        <span class="nx">rm</span><span class="o">:</span> <span class="p">{</span>
            <span class="nx">online</span><span class="o">:</span> <span class="p">{</span>
                <span class="nx">dest</span><span class="o">:</span> <span class="s2">"{{online}}"</span>
            <span class="p">},</span>
            <span class="nx">offline</span><span class="o">:</span> <span class="p">{</span>
                <span class="nx">dest</span><span class="o">:</span> <span class="s2">"{{offline}}"</span>
            <span class="p">}</span>
        <span class="p">},</span>
        <span class="nx">replace</span><span class="o">:</span> <span class="p">{</span>
            <span class="nx">src</span><span class="o">:</span> <span class="s1">'./js/**/*.js'</span><span class="p">,</span>
            <span class="nx">search</span><span class="o">:</span> <span class="s2">"@VERSION"</span><span class="p">,</span>
            <span class="nx">replace</span><span class="o">:</span> <span class="nx">require</span><span class="p">(</span><span class="s1">'./package.json'</span><span class="p">).</span><span class="nx">version</span>
        <span class="p">},</span>
        <span class="nx">build</span><span class="o">:</span> <span class="p">{</span>
            <span class="nx">options</span><span class="o">:</span> <span class="p">{</span>
                <span class="nx">src</span><span class="o">:</span> <span class="p">[</span><span class="s2">"*.html"</span><span class="p">]</span>
            <span class="p">},</span>
            <span class="nx">online</span><span class="o">:</span> <span class="p">{</span>
                <span class="nx">dest</span><span class="o">:</span> <span class="s2">"{{online}}"</span><span class="p">,</span>
                <span class="nx">rev</span><span class="o">:</span> <span class="kc">true</span>
            <span class="p">},</span>
            <span class="nx">offline</span><span class="o">:</span> <span class="p">{</span>
                <span class="nx">dest</span><span class="o">:</span> <span class="s2">"{{offline}}"</span><span class="p">,</span>
                <span class="nx">rev</span><span class="o">:</span> <span class="kc">false</span>
            <span class="p">}</span>
        <span class="p">},</span>
        <span class="nx">cp</span><span class="o">:</span> <span class="p">{</span>
            <span class="nx">options</span><span class="o">:</span> <span class="p">{</span>
                <span class="nx">src</span><span class="o">:</span> <span class="p">[</span><span class="s2">"./img/**"</span><span class="p">]</span>
            <span class="p">},</span>
            <span class="nx">online</span><span class="o">:</span> <span class="p">{</span>
                <span class="nx">dest</span><span class="o">:</span> <span class="s2">"{{online}}/img/"</span><span class="p">,</span>
                <span class="nx">rev</span><span class="o">:</span> <span class="kc">true</span>
            <span class="p">},</span>
            <span class="nx">offline</span><span class="o">:</span> <span class="p">{</span>
                <span class="nx">dest</span><span class="o">:</span> <span class="s2">"{{offline}}/img/"</span><span class="p">,</span>
                <span class="nx">rev</span><span class="o">:</span> <span class="kc">false</span>
            <span class="p">}</span>
        <span class="p">},</span>
        <span class="nx">pngcompressor</span><span class="o">:</span> <span class="p">{</span>
            <span class="nx">src</span><span class="o">:</span> <span class="s2">"./img/**/*.png"</span>
        <span class="p">},</span>
        <span class="nx">compress</span><span class="o">:</span> <span class="p">{</span>
            <span class="nx">dist</span><span class="o">:</span> <span class="p">{</span>
                <span class="nx">options</span><span class="o">:</span> <span class="p">{</span>
                    <span class="nx">archive</span><span class="o">:</span> <span class="s1">'{{offlinePackage}}'</span>
                <span class="p">},</span>
                <span class="c1">// includes files in path</span>
                <span class="nx">files</span><span class="o">:</span> <span class="p">[</span>
                    <span class="p">{</span>
                        <span class="nx">expand</span><span class="o">:</span> <span class="kc">true</span><span class="p">,</span>
                        <span class="nx">cwd</span><span class="o">:</span> <span class="s1">'{{online}}/'</span><span class="p">,</span>
                        <span class="nx">src</span><span class="o">:</span> <span class="p">[</span><span class="s1">'*.html'</span><span class="p">],</span>
                        <span class="nx">dest</span><span class="o">:</span> <span class="s1">'qq.com/web'</span>
                    <span class="p">},</span>
                    <span class="p">{</span>
                        <span class="nx">expand</span><span class="o">:</span> <span class="kc">true</span><span class="p">,</span>
                        <span class="nx">cwd</span><span class="o">:</span> <span class="s1">'{{online}}/img'</span><span class="p">,</span>
                        <span class="nx">src</span><span class="o">:</span> <span class="p">[</span><span class="s1">'**'</span><span class="p">],</span>
                        <span class="nx">dest</span><span class="o">:</span> <span class="s1">'cdn.qq.com/img'</span>
 
                    <span class="p">}</span>
                <span class="p">]</span>
            <span class="p">}</span>
        <span class="p">}</span>
    <span class="p">},</span>
    <span class="nx">targets</span><span class="o">:</span> <span class="p">{</span>
        <span class="k">default</span><span class="o">:</span> <span class="p">[</span><span class="s2">"rm"</span><span class="p">,</span> <span class="s2">"pngcompressor"</span><span class="p">,</span> <span class="s2">"replace"</span><span class="p">,</span> <span class="s2">"build"</span><span class="p">,</span> <span class="s2">"cp"</span><span class="p">],</span>
        <span class="nx">offline</span><span class="o">:</span> <span class="p">[</span><span class="s2">"default"</span><span class="p">,</span> <span class="s2">"compress:dist"</span><span class="p">]</span>
    <span class="p">}</span>
<span class="p">}</span>
```

-   `version` 描述依赖的 Mod.js 版本
-   `plugins` 描述依赖的插件，支持 Mod.js 插件与 Grunt 插件
-   `tasks` 描述不同类别任务的执行
-   `targets` 描述不同组合的目标，目标是需执行任务的集合

Mod.js 的配置项追究极简易懂，即使不懂 JavaScript 语法也能看懂配置与修改配置。

### [](http://www.alloyteam.com/2014/03/frontend-workflow/#%E7%9B%B8%E7%9F%A5)相知

在执行 mod 命令时，Mod.js 会在当前目录下查找是否存在 Modfile.js 文件。当找到 Modfile.js 文件时，Mod.js 将读取 Modfile.js 里的配置信息，如识别到有配置 Mod.js 插件，会自动安装没有安装过的插件，插件不仅可以是发布到 NPM 的包，也可以是存在本地的自定义任务。  
Mod.js 加载插件的方式是通过 Node 的 require 机制，然后执行暴露的 exports.run，这与 Mod.js 内置任务的完全一样的机制。

在命令行下，通常执行 mod 时是需指定 Modfile.js 中某一特定目标，但当存在命名为 default 的目标或配置中只有一个独立目标时，此时目标的指定是可选的，Mod.js 会自动识别唯一的存在或 default 的目标：

```html
targets: <span class="o">{</span>
    dist: <span class="o">[</span><span class="s2">"rm"</span>, <span class="s2">"cp"</span><span class="o">]</span>
<span class="o">}</span>
```

```html
<span class="c"># 等价于 mod dist</span>
<span class="nv">$ </span>mod
```

配置有 default 目标的场景：

```html
targets: <span class="o">{</span>
    default: <span class="o">[</span><span class="s2">"rm"</span>, <span class="s2">"cp"</span><span class="o">]</span>,
    other: <span class="o">[</span><span class="s2">"compress"</span><span class="o">]</span>
<span class="o">}</span>
```

```html
<span class="c"># 等价于 mod default</span>
<span class="nv">$ </span>mod
```

#### [](http://www.alloyteam.com/2014/03/frontend-workflow/#%E6%B7%B1%E5%85%A5%E4%BB%BB%E5%8A%A1)深入任务

任务是具体执行的类别，从配置示例开始阐述：

```html
<span class="nx">tasks</span><span class="o">:</span> <span class="p">{</span>
    <span class="nx">min</span><span class="o">:</span> <span class="p">{</span>
        <span class="nx">src</span><span class="o">:</span> <span class="s2">"./js/*.js"</span>
    <span class="p">}</span>
<span class="p">}</span>
```

以上配置了一个文件压缩的 `min` 类别任务，`src` 描述需要压缩的文件：`js` 目录的所有 js 文件。`src` 支持 unix `glob` 语法来描述输入文件集，其匹配规则如下：

匹配符：

-   "\*" 匹配 0 个或多个字符
-   "?" 匹配单个字符
-   "！" 匹配除此之外的字符
-   "\[]" 匹配指定范围内的字符，如：\[0-9] 匹配数字 0-9 \[a-z] 配置字母 a-z
-   "{x,y}" 匹配指定组中某项，如 a {d,c,b} e 匹配 ade ace abe

示例：

```html
c/ab.min.js <span class="o">=</span>>  c/ab.min.js
*.js        <span class="o">=</span>>  a.js b.js c.js
c/a*.js     <span class="o">=</span>>  c/a.js  c/ab.js c/ab.min.js
c/<span class="o">[</span>a-z<span class="o">]</span>.js  <span class="o">=</span>>  c/a.js c/b.js c/c.js
c/<span class="o">[</span>!abe<span class="o">]</span>.js <span class="o">=</span>>  c/c.js c/d.js
c/a?.js     <span class="o">=</span>>  c/ab.js c/ac.js
c/ab???.js  <span class="o">=</span>>  c/abdef.js c/abccc.js
c/<span class="o">[</span>bdz<span class="o">]</span>.js  <span class="o">=</span>>  c/b.js c/d.js c/z.js
<span class="o">{</span>a,b,c<span class="o">}</span>.js  <span class="o">=</span>>  a.js b.js c.js
a<span class="o">{</span>b,c<span class="o">{</span>d,e<span class="o">}}</span>x<span class="o">{</span>y,z<span class="o">}</span>.js  <span class="o">=</span>> abxy.js abxz.js  acdxy.js acdxz.js acexy.js acexz.js
```

更多任务配置规则深入:<https://github.com/modjs/mod/blob/master/doc/tutorial/configuring-tasks.md>

如任务没有配置 `dest`，默认在输入文件同级目录下输出`.min` 后缀的文件：

    uglifyjs Minifying ./js/unminify.js -> js/unminify.min.js
    uglifyjs Original size: 1,393. Minified size: 449. Savings: 944 (210.24%)
     

内置的 `min` 任务支持三种文件类别的压缩，JavaScript、CSS 与 HTML，是对 `uglifyjs`、`cleancss` 与 `htmlminfier` 任务的代理。`min` 通过识别文件后缀进行具体任务的分发。所以 `min` 任务的 `src` 选项需指定具体的后缀。通常每个不同类别的任务都支持 `src` 与 `dest`，且 Mod.js 会结合实际项目中常见的场景，`dest` 往往都是可选的，如上 `min` 任务默认的 `dest` 是在当前目录下输出待`.min` 后缀的文件，同时后缀名是支持通常 `suffix` 选项配置的。

每个内置任务支持的所有参数选项可通过 `Mod.js` 的在线文档查看：<https://github.com/modjs/mod/tree/master/doc>  
同时有丰富的演示项目来辅助不同任务的配置：

-   [合并 JS 文件](https://github.com/modjs/mod/tree/master/example/catjs)
-   [合并 CSS 文件，自动合并 import 文件](https://github.com/modjs/mod/tree/master/example/catcss)
-   [AMD 模块文件编译](https://github.com/modjs/mod/tree/master/example/compileamd)
-   [CMD 模块文件编译](https://github.com/modjs/mod/tree/master/example/compilecmd)
-   [多页面项目中 AMD 模块编译](https://github.com/modjs/mod/tree/master/example/compilemultipage)
-   [JS 文件条件编译](https://github.com/modjs/mod/tree/master/example/compilejs)
-   [CSS 文件条件编译](https://github.com/modjs/mod/tree/master/example/compilecss)
-   [HTML 文件条件编译](https://github.com/modjs/mod/tree/master/example/compilehtml)
-   [JS 文件压缩](https://github.com/modjs/mod/tree/master/example/minjs)
-   [CSS 文件压缩](https://github.com/modjs/mod/tree/master/example/mincss)
-   [HTML 文件压缩](https://github.com/modjs/mod/tree/master/example/minhtml)
-   [代码移除，如 alert、console](https://github.com/modjs/mod/tree/master/example/stripcode)
-   [文件 EOL 移除](https://github.com/modjs/mod/tree/master/example/stripeol)
-   [文件 Tab 移除](https://github.com/modjs/mod/tree/master/example/striptab)
-   [图片 DataURI](https://github.com/modjs/mod/tree/master/example/datauri)
-   [创建目录](https://github.com/modjs/mod/tree/master/example/mkdir)
-   [复制文件或目录](https://github.com/modjs/mod/tree/master/example/cp)
-   [规则替换，如版本号累加](https://github.com/modjs/mod/tree/master/example/replace)

#### [](http://www.alloyteam.com/2014/03/frontend-workflow/#%E4%B8%8D%E5%8F%AF%E6%88%96%E7%BC%BA%E7%9A%84%E6%8F%92%E4%BB%B6%E6%9C%BA%E5%88%B6)不可或缺的插件机制

Mod.js 支持 2 种生态的插件：Mod.js 与 Grunt。插件的配置同样是在 Runner 对象下：

```html
<span class="nx">plugins</span><span class="o">:</span> <span class="p">{</span>
    <span class="c1">// Mod.js NPM 插件</span>
    <span class="nx">sprite</span><span class="o">:</span> <span class="s2">"mod-stylus"</span><span class="p">,</span>
    <span class="c1">// Mod.js 本地插件</span>
    <span class="nx">mytask</span><span class="o">:</span> <span class="s2">"./tasks/mytask"</span>
    <span class="c1">// Grunt NPM 插件</span>
    <span class="nx">compress</span><span class="o">:</span> <span class="s2">"grunt-contrib-compress"</span>
<span class="p">}</span>
```

同样附上演示项目来辅助不同插件的配置：

-   [Mod.js NPM 插件: mod-stylus](https://github.com/modjs/mod/tree/master/example/pluginnpmtask)
-   [Mod.js 本地插件: mytask.js](https://github.com/modjs/mod/tree/master/example/pluginlocaltask)
-   [Grunt NPM 插件: grunt-contrib-concat](https://github.com/modjs/mod/tree/master/example/plugingrunttask)

如插件未安装在项目目录下或与 Mod.js 同级的全局目录下，Mod.js 会自动通过 NPM 安装配置的插件。什么情况需要手动把插件安装在全局下？在实际项目开发中我们往往会对同一项目拉不同的分支进行开发，他们依赖的插件版本是相同的，此时如果在不同分支都安装一个冗余的插件版本项目是多余的，所以当你确定这是个插件是共享的，可以手动通过 `npm install -g mod-stylus` 来安装到全局。同时项目目录中插件版本权重永远是高于全局的，如需避免加载全局的版本，只需手动在项目安装即可。

限于篇幅，更多插件相关说明可访问以下主题页面：

-   [创建插件](https://github.com/modjs/mod/tree/master/doc/tutorial/creating-plugins.md)
-   [API 文档](https://github.com/modjs/mod/tree/master/doc/api)

#### [](http://www.alloyteam.com/2014/03/frontend-workflow/#%E9%9B%B6%E9%85%8D%E7%BD%AE%E5%BF%AB%E9%80%9F%E9%A1%B9%E7%9B%AE%E6%9E%84%E5%BB%BA)零配置快速项目构建

虽说是零配置构建项目，不如称之为基于 DOM 的项目构建，这个主题的内容与我之前在 [Qing](https://github.com/AlloyTeam/Qing) 项目中讨论的主题的一致的，在此只附上示例：

-   [普通项目构建](https://github.com/modjs/mod/tree/master/example/buildnormal)
-   [移动项目构建](https://github.com/modjs/mod/tree/master/example/buildmobile)
-   [RequireJS 项目构建](https://github.com/modjs/mod/tree/master/example/buildrequirejs)

另外免配置文件对 Sea.js 2.1 + 项目的支持正在开发中，会下 Mod.js 的下一迭代中支持。

## [](http://www.alloyteam.com/2014/03/frontend-workflow/#%E6%9C%8D%E5%8A%A1%E5%8C%96)服务化

了解完如何实施 Mod.js 进行自动化时，仅是停留在工具的层面，如何将其进一步的提升？了解一个事实，服务优于工具。如何将其封装成服务，用户无需安装 Mod.js，无需执行命令，只需做一次事情：提交代码，中间的过程无需关注，最终把持续构建的结果反馈给用户。这是下一步需要去完善的，建立接入机制，让工具以服务的形式完全融入流程中。

<!-- {% endraw %} - for jekyll -->