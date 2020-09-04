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

```c
<span class="nx">module</span><span class="p">.</span><span class="nx">exports</span> <span class="o">=</span> <span class
```


<!-- {% endraw %} - for jekyll -->