---
title: 从工程化角度讨论如何快速构建可靠 React 组件
date: 2017-03-07
author: TAT.heyli
source_link: http://www.alloyteam.com/2017/03/from-an-engineering-point-of-view-discusses-how-to-construct-reliable-components-react/
---

<!-- {% raw %} - for jekyll -->

[原文链接](https://github.com/lcxfs1991/blog/issues/18)

## 前言

React 的开发也已经有 2 年时间了，先从 QQ 的家校群，转成做互动直播，主要是花样直播这一块。切换过来的时候，业务非常繁忙，接手过来的业务比较凌乱，也没有任何组件复用可言。

为了提高开发效率，去年 10 月份也开始有意识地私下封装一些组件，并且于今年年初在项目组里发起了百日效率提升计划，其中就包含组件化开发这一块。

本文并不是要谈如何去写一个 React 组件，这一块已经有不少精彩的文章。例如像这篇 [《重新设计 React 组件库》](http://mp.weixin.qq.com/s/8dZV0oKfBKp-jERguNxflw)，里面涉及一个组件设计的各方面，如粒度控制、接口设计、数据处理等等（不排除后续也写一篇介绍组件设计理念哈）。

本文关键词是三个，工程化、快速和可靠。我们是希望利用工程化手段去保障快速地开发可靠的组件，工程化是手段和工具，快速和可靠，是我们希望达到的目标。

前端工程化不外乎两点，规范和自动化。

读文先看此图，能先有个大体概念：  
![default](https://cloud.githubusercontent.com/assets/3348398/23621360/5abbdc42-02d5-11e7-9dbf-4b603fdee1ad.png)

## 规范

### 目录与命令规范

规范，主要就是目录规范和代码规范。跟同事合作，经过将近 20 个的组件开发后，我们大概形成了一定的目录规范，以下是我们大致的目录约定。哪里放源码，哪里放生产代码，哪里是构建工具，哪里是例子等。有了这些的约定，日后开发和使用并一目了然。

    __tests__ -- 测试用例
    |
    example -- 真实demo
    |
    dist -- 开发者使用代码
    |
    src -- 源代码
    |
    config -- 项目配置
    |------project.js -- 项目配置，主要被 webpack，gulp 等使用
    |      
    |   
    tools  -- 构建工具
    |  
    |——————start.js -- 开发环境执行命令
    |——————start.code.js -- 开发环境生成编译后代码命令
    |
    package.json
     

命令我们也进行了规范，如下，

    // 开发环境，服务器编译
    npm start 或者 npm run dev
     
    // 开发环境，生成代码
    npm run start.code
     
    // 生产环境
    npm run dist
     
    // 测试
    npm test
     
    // 测试覆盖率
    npm run coverage
     
    // 检查你的代码是否符合规范
    npm run lint
     
     

### 代码规范

代码规范，主要是写 `js`,`css` 和 `html` 的规范，基本我们都是沿用团队之前制定好的规范，如果之前并没有制定，例如 React 的 jsx 的写法，那么我们就参考业界比较优秀的标准，并进行微调，例如 `airbnb` 的 [JavaScript](https://github.com/airbnb/javascript) 规范，是不错的参考。

## 自动化

### 开发与发布自动化

规范是比较人性的东西，凭着人对之的熟悉就可以提高效率了，至于那些工作繁复的流程，单凭人的熟悉也会达到极限，那么我们就需要借助自动化的工具去突破这重极限。

例如代码规范，单凭人的肉眼难以识别所有不合规范的代码，而且效率低下，借助代码检测工具就可让人卸下这个重担。如 css ，我们推荐使用 [stylelint](https://github.com/stylelint/stylelint) ，js 则是 [eslint](http://eslint.org/)。有这种自动化的工具协助开发者进行检查，能更好地保障我们的代码质量。

自动化最为重要的任务是，去保证开发过程良好的体验还有发布生产代码。实际上，开发和发布组件的整个过程跟平时开发一个任务很像，但却又略有差异。

首先是开发过程中，我们希望一边开发的时候，我们开发的功能能够显示出来，这时最好能搭建一个 demo，我们把 demo 放到了 example 目录下，这点对 UI 组件（像 toast, tips 等组件）尤为重要，逻辑组件（像 ajax, utils 等组件），可以有 demo，也可以采取测试驱动开发的方式，先制定部份测试用例，然后边开发边进行测试验证。

开发过程中的这个 demo， 跟平时开发项目基本一致，我们就是通过配置，把 `html`,`js`, `css` 都搭建好，而且我们是开发 React 组件，引入热替换的功能令整个开发流程非常流畅。这里分别是 `webpack` 和配合 \`webpack 开发的静态资源服务器的两份配置： [webpack](https://github.com/SteamerTeam/steamer-react-component/blob/master/tools/webpack.example.js) & [server](https://github.com/SteamerTeam/steamer-react-component/blob/master/tools/webpack.server.js)。

但是发布组件的这个过程跟开发项目却又很不同。开发项目，我们需要把所有的依赖都打包好，然后一并发布。但对于组件来说，我们只需要单独将它的功能发布就好了，它的相关依赖可以在实际开发项目中引用时一并再打包。因此这里的 `package.json` 写的时候也要有所区分。跟只跟开发流程、构建、测试相关的，我们一律放在 `devDependencies` 中，组件实际依赖的库，则主要放在 `dependencies` 中。

鉴于我们项目一般采用 webpack 打包，因此我们一般只需要 es6 import 的引入方式，那我们直接用 babel 帮我们的项目进行生产代码的编译打包就可以了，这样能有效减少冗余代码。配置好 .babelrc，然后配置 `package.json` 的打包命令即可。要注意的是，你的组件可能含有样式文件，配置命令的时候要记得将样式文件也复制过去，像下面的命令，--copy-files 参数就是为了将样式文件直接拷贝到 dist 目录下。

    babel src --out-dir dist --copy-files
     

但有时候，你也想组件能兼容多种引用方式，即


<!-- {% endraw %} - for jekyll -->