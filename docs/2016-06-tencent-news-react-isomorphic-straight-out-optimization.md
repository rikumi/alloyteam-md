---
title: 腾讯新闻 React 同构直出优化实践
date: 2016-06-27
author: TAT.heyli
source_link: http://www.alloyteam.com/2016/06/tencent-news-react-isomorphic-straight-out-optimization/
---

<!-- {% raw %} - for jekyll -->

[原文地址](https://github.com/lcxfs1991/blog/issues/10)  
[本文 start kit: steamer-react](https://github.com/SteamerTeam/steamer-react)

为什么做直出  

* * *

就是为了 “性能”！！！  
按照经验来说，直出，能够减少 20% - 50% 不等的首屏时间，因此尽管增加一定维护成本，前端们还是前赴后继地在搞直出。

除此之外，有些特定的业务做直出能够弥补前后端分离带来的 SEO 问题。像这次选取的腾讯新闻，大多数页面首屏其实都是直出的（但肯定不是 React 直出）。

性能指标  

* * *

刚提到的首屏时间，只是单纯内容的渲染，另外还有首屏可交互时间，即除了内容渲染之余，还能够让用户能够对首屏的内容进行交互，如点击、滚动等等。现在市面上有关 React 的性能报告，尤其是那些截了 Chrome 渲染映像的，都归到首屏时间。

为什么选择腾讯新闻  

* * *

-   我并非腾讯新闻的业务相关方，可以比较大胆地作为例子使用
-   腾讯新闻页面更为丰富，可以做更多场景的实践
-   验证全套脱胎手 Q 家校群 react 的优化策略、实践方案和开发工具

由于只是实验，数据都是拉取腾讯新闻现网提供的，而样式简单地仿照了一下，做得略粗糙，请见谅。

参考的资料和使用的工具  

* * *

做这次实践阅读了不少文章，文章提到过的内容我这里就不再赘述了，后文主要是做补充。  
这次同构直出实践，我们使用的是脱胎于手 Q 家校群的 react start kit，名曰 [steamer-react](https://github.com/SteamerTeam/steamer-react)。目前可以试用。它有 2 个分支，一个是 react 分支，目前只是提供纯前端的 boilerplate。另一个是 react-isomorphic，同时包括前端和后台的 boilerplate。有什么问题可以给我提 issue。

文章：

-   [React+Redux 同构应用开发](http://www.aliued.com/?p=3077)
-   [React 同构实践与思考](https://segmentfault.com/a/1190000004671209#articleHeader2)
-   [React 同构直出优化总结](https://github.com/joeyguo/blog/issues/9)
-   [ReactJS 服务端同构实践 QQ 音乐 web 团队](http://toutiao.com/i6284121573897011714/)
-   [How to Implement Node + React Isomorphic JavaScript & Why it Matters](https://strongloop.com/strongblog/node-js-react-isomorphic-javascript-why-it-matters/)
-   [性能优化三部曲之三 ——Node 直出让你的网页秒开](https://github.com/lcxfs1991/blog/issues/6)

分析场景  

* * *

这次我们选取的是腾讯新闻的列表页、详情页和评论页。平时我们浏览腾讯新闻的时候，都会发现从列表页进详情页，或者从详情页进入评论页，都需要跳转，就像 steamer-react 中，访问 index.html 页一样。这样对于用户体验欠佳，因此我做了另外一版，spa.html，使用 react + react-router 做了一版无跳转的单页面应用。

-   列表页  
    ![](https://segmentfault.com/img/bVyxmZ)
-   详情页  
    ![](https://segmentfault.com/img/bVyxnf)
-   评论页  
    ![](https://segmentfault.com/img/bVyxnj)

可是单页面应用在 SEO 的优化方面，处于略势，因此对于新闻类业务来说，需要做直出来弥补。下面我们逐步来拆解 React 同构直出的步骤。

用 Koa 搭建后台  

* * *

AlloyTeam 团队目前以 Koa 为基础搭建了玄武直出平台，目前不少手 Q 基础的 web 业务也有接入，包括早前做过同构优化的手 Q 家校群列表页。是次实践，在 steamer-react 下面新建了一个 node 文件夹，存放后台服务。后台服务包括返回数据的 api，还有直出的 controller 层。controller 层仿照玄武的写法，对于腾讯内的同事，做适当修改便可以快速接入玄武直出平台，对于腾讯外的，也可以作有用的参照，嵌入自己的业务也不费什么功夫。

那直出的 controller 层具体怎么写呢？

直出 controller 层和数据返回的 api 都一律写在 controller.js 里面，然后去 require 存放在 node/asset/ 下面具体直出逻辑文件，然后将 yield 出来的值直接吐出来：

```javascript
exports.spa = function* () {
    let dir = path.dirname(path.resolve()),
        appPath = path.join(dir, "/pub/node/index.js");
    if (fs.existsSync(appPath)) {
        // 若asset中无此文件，则输出其它值
        var ReactRender = require(appPath);
        yield ReactRender(this.request, this.response); // 给ReactRender函数传入request和response
        this.body = this.response.body;
    } else {
        this.body = "spa list";
    }
};
```

而 ReactRender 函数，大概长这样，其实就是一个 generator function，具体拉取数据和 React 同构渲染的逻辑都写在这里面。

```javascript
module.exports = function* (req, res) {
    // some code
｝
```

你直接写好的逻辑，有不少可能 node 并不识别，例如 import, window 对象等，这些需要构建去处理，后文会有论述。

其实整个直出过程非常简单。基本就是三部曲，拉数据、存数据和吐内容。

### 拉数据

拉数据这里封装了一个 requestSync 的库，可以直接通过 yield 对 request 库做同步的写法：

```javascript
// requestSync.js
var request = require('request');
 
exports.requestSync = function(option) 
```


<!-- {% endraw %} - for jekyll -->