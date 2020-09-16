---
title: 前端测试回顾及我们为什么选择 Karma
date: 2015-06-08
author: TAT.donaldyang
source_link: http://www.alloyteam.com/2015/06/qian-duan-ce-shi-hui-gu-ji-wo-men-wei-shi-me-xuan-ze-karma/
---

<!-- {% raw %} - for jekyll -->

> 前端测试，或者 UI 测试一直是业界一大难题。最近 `Q.js` 使用 [Karma](https://github.com/karma-runner/karma) 作为测试任务管理工具，本文在回顾前端测试方案的同时，也分析下为什么 `Q.js` 选用 Karma 而不是其他测试框架。

### 像素级全站对比

曾今有一批人做过这样的 UI 测试，即最终页面图像是否符合预期，通过图片差异对比来找出可能的问题。

![](http://7tszky.com1.z0.glb.clouddn.com/FvhK-IJ9cQi7tvPar02XdGKQA0EE)

如图所示，所谓像素级站点对比，即利用截屏图像前后对比来找出，站点前后差异，从而发现问题。

> Q: 为什么需要这种测试呢？

> A: CSS 容易被破坏，在大型响应式重构案例中，像素级全站对比是一个比较好的测试方案。

目前常用的两大工具：

-   [BackstopJS](http://garris.github.io/BackstopJS/)
-   [PahntomCSS](https://github.com/Huddle/PhantomCSS)

### 录制型测试

比较经典的有 [Selenium](https://github.com/SeleniumHQ/selenium)，本质上提供了编码型测试，但是因为提供了录制功能，所以广泛被用于录制测试。

### 编码测试

> 即通过编写代码来测试 UI，但由于各种兼容性问题，这里出现了各种方案。

##### JsTestDriver 式

即启用一个服务器，然后让测试浏览器链接该服务器，便可自动运行测试任务，下面是 [BusterJS](https://github.com/busterjs/buster) 中的一个演示：

-   启动服务器

![](http://docs.busterjs.org/en/latest/_images/buster-server-start.png)

-   打开测试浏览器，并连上服务器，按下按钮使得服务器捕获该浏览器

![](http://docs.busterjs.org/en/latest/_images/buster-server-capture-firefox.png)

-   在服务器发起一次测试，则每个被捕获的浏览器都会跑一次测试用例

![](http://docs.busterjs.org/en/latest/_images/buster-test-run-browsers.png)

##### 静态测试

即通常的打开一个页面进行测试，下面是 [Mocha](https://github.com/mochajs/mocha) 的静态测试页面例子：

![](http://mochajs.org/images/reporter-html.png)

##### 无头浏览器测试

即通过无头浏览器，如：[PhantomJS](https://github.com/ariya/phantomjs)、[SlimerJS](https://github.com/laurentj/slimerjs) 来进行测试

##### 持续集成测试

这个就需要看持续集成系统能提供什么浏览器支持了，一般至少可以提供 PhantomJS 来进行测试，比较优秀的持续集成系统有：

-   [Sauce Labs](https://saucelabs.com/)
-   [Travis](https://travis-ci.org/)

下面是 Backbone 在 Sauce Labs 里的测试，可见，可使用各种浏览器进行测试：

![](http://7tszky.com1.z0.glb.clouddn.com/Fm4kJBdJiiJDPFfH-aZdBHWFFmBt)

### Karma

Karma 是一个测试任务管理工具，可以很容易和 Jasmine、Mocha 等市面上常用的测试框架打通，通过其插件可以快速集成到各种环境中。例如：本地环境、持续集成环境。

她可以使我们只需输入一行命令就就行测试，并在文件进行修改后，重跑一次用例，过程就像用 NodeJS 进行测试一样一样的。

所以目前在各大开源项目中使用，下面是使用 `Q.js` 进行测试的完整输出：

    bogon:Q.js miniflycn$ gulp test
    [23:58:30] Using gulpfile ~/github/Q.js/gulpfile.js
    [23:58:30] Starting 'test'...
    INFO [framework.browserify]: 70617 bytes written (0.30 seconds)
    INFO [framework.browserify]: bundle built
    INFO [karma]: Karma v0.12.35 server started at http://localhost:9876/
    INFO [launcher]: Starting browser Chrome
    INFO [launcher]: Starting browser PhantomJS
    INFO [Chrome


<!-- {% endraw %} - for jekyll -->