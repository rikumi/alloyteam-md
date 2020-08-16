---
title: fis3 初步学习体验
date: 2016-01-05
author: TAT.yana
source_link: http://www.alloyteam.com/2016/01/fis3-preliminary-learning-experiences/
---

作为前端开发，或多或少都会接触很多前端构建工具，最近的业务使用到了百度 FIS 团队的 fis3，想和大家分享下我所理解的 fis3。

**使用方法简单说**

首先，你需要安装 node 和 npm

然后，使用 **npm install -g fis3**  命令安装 fis3，安装完成是这样的

[![图片 1](http://www.alloyteam.com/wp-content/uploads/2015/12/图片12-300x125.png)](http://www.alloyteam.com/wp-content/uploads/2015/12/图片12.png)表示安装成功。

然后我们可以通过 **fis3 release -w** 来对代码进行监听。

注：fis3 默认内置了 fis3-command-release 插件，提供了文件监听和浏览器自动刷新功能，在 release 的时候添加 - w 或 - L 参数就可以，这样可以很方便的部署代码。

当你需要使用插件的时候，可以用 **fis3 install -g 插件名** 进行安装。

与其他构件工具一样，fis3 也需要配置 fis-conf.js 文件。

**添加 MD5 戳以及资源的合并压缩**（配置**useHash: true**即可添加 MD5 戳）

    fis.media('offpack')
        .match('**.{js,tpl}', {
            optimizer: fis.plugin('uglify-js'),
            useHash: true
        })
        .match('**.{css,scss,sass}', {
            optimizer: fis.plugin('clean-css'),
            useHash: true
        })
        .match('**.png', {
            optimizer: fis.plugin('png-compressor')
        })
    });

**CssSprite 图片合并**

    .match('::package', {
            spriter: fis.plugin('csssprites')
        })
        .match('*.css', {
            useSprite: true
            })

**对 sass 文件进行编译**

```javascript
 .match('**.{scss,sass}', {
        parser: fis.plugin('sass', {
            include_paths: ['modules/common/sass']
        }),
        rExt: '.css'
    })
```

这样我们就可以使用基本的 fis3 了。

**fis 三种编译能力**

fis3 可以做到以下几点：

[![a](http://www.alloyteam.com/wp-content/uploads/2016/01/a-300x294.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/a.png)

其主要功能基本都是围绕着前端开发所需要的三种编译能力：资源定位、内容嵌入、依赖声明。

**1、资源定位**

HTML 中的资源定位

    fis.match('*.css', {
        packTo: '../demo/demo.css'
    })

js 中的资源定位

```javascript
var img = _uri("img/inline/star-full.png");
```

  编译后

```javascript
var img = "http://pub.idqqimg.com/.../img/inline/star-full.png";
```

css 中的资源定位

```ruby
@import url('seed.css');
```

  编译后

```css
@import url('http://pub.idqqimg.com/.../index/seed.css');
```

**2、内容嵌入**

````html

```html
<script src="partial/common/mod.js?__inline"></script>
````

;

```

```

\_\_inline('demo.js');

````

**3、依赖声明**

```ruby
/**
 * index.css
 * @require main.css
 */
````

fis3 的设计原则是 “基于依赖关系表的静态资源管理系统与模块化框架设计”，所以我们就从静态资源管理和模块化两方面来理解下 fis3。

**静态资源管理**

关于性能优化是前端经久不衰的必须思考的问题，一个网站如果想要做到响应快高并发，那其中一个很有效的办法就是尽量让网站静态化。做到动静分离。我们可以使用 CDN 技术，将静态资源保存在 CDN 上，可以用静态资源的 CDN 路径拉取到资源，减轻服务器的压力。fis3 实现了一套 “静态资源管理系统”，在开发页面的时候只需要用相对路径开发，构建后会生成带有 hash 静态资源版本号的文件，避免发布后页面错乱。

静态资源的大小也会影响网络传输效率，fis3 也提供了很多插件来对图片进行合并、对 HTML、js、css 文件进行合并，fis3 会对路径中带有**?\_\_sprite**的图片进行合并，减少了请求数量。但单纯的资源合并是没有办法按需加载资源的，然而静态资源按需加载也是减少资源冗余的很重要的方式。使用 fis3 会生成静态资源映射表，是记录文件依赖等信息的表，虽然不会生成 map.json，但当文件包含 “**\_\_RESOURCE_MAP\_\_**” 字符，就会用表结构数据替换这里的字符。静态资源系统可以根据表结构数据中对应对的信息进行加载。这样就解决了按需加载的问题。

**模块化开发**

前端模块化开发对开发人员来说具有很重要的意义，模块化可以方便代码复用，提升可维护性。我们熟悉的模块化开发有 commonjs、AMD、CMD，模块化框架有 mod.js、require.js、sea.js 等。

Fis3 默认不支持模块化开发，所以需要 **fis3-hook-commonjs/fis3-hook-amd/fis3-hook-cmd、fis3-postpackager-loader 以及 fis3-deploy-wsd-cdn-upload** 插件的支持。

配置 fis-conf.js 的流程：

**1、使用 fis3-postpackager-loader 插件分析依赖**

```javascript
.match('::package', {
        postpackager: [fis.plugin('loader', {
            resourceType: 'mod',
            obtainScript: false,
            allInOne: true,
            useInlineMap: true // 资源映射表内嵌
        })]
    })
```

**2、合并资源**

    fis.media('dist')
        .match('**.{js,tpl}', {
            optimizer: fis.plugin('uglify-js'),
            useHash: true
        })

**3、将静态资源发布到 CDN**

    .match('**.{js,tpl}', {
        domain: 'http://xxx.com/xxx/xxx'
    })

**4、文件入口**

````html

```html
<script>require('pages/xxx/main');</script>
````

;

````

**5、js 引用**

```javascript
var hello = require("./canvas.js");
````

除了依赖声明内置语法中资源间相互依赖的语法，fis3 还可以解析以下几种语法。

    // AMD
    require([]);
    require('');
     
    // seajs
    require('');
    sea.use([]);
     
    // mod.js
    require('');
    require.async('');
    require.async([]);

fis3 可以综合处理各种资源的模块化，我们不用纠结于 JavaScript 模块化或是 CSS 模块化等单独资源的模块化，这样就可以提升开发体验，为性能优化提供良好的支持。这种一体化的模块化方案的目录划分与我们平常按照资源类型划分不同，其目录分为 modules（子系统），包括 common 子系统（可为其他资源提供服务的通用模块）和业务子系统；page，我们实际输出的内容子系统，包含了各种资源的文件。一般来说，JS 组件可以封装 CSS 组件的代码，template 模块可以处理 HTML、JavaScript 和 CSS 等各种模块化资源。

[![图片 18](http://www.alloyteam.com/wp-content/uploads/2015/12/图片18-129x300.png)](http://www.alloyteam.com/wp-content/uploads/2015/12/图片18.png)

**在 js 中加载模块**

```javascript
var hello = require("./canvas.js");
```

```javascript
define("pages/index/index", function (require, exports, module) {
    var hello = require("pages/index/canvas");
});
```

**在 css 中声明依赖关系**

```ruby
/**
 * index.css
 * @require main.css
 */
```

前端模块化需要将 js、CSS 和 tpl 同时都考虑进去，所以相对其他语言来说更加复杂。拿 commonJS 举例，commonJS 定义的模块有 require（引入外部模块）、exports（导出当前模块的方法或变量）以及 module（模块本身），只要能提供 module、exports、require 和 global 这四个变量，浏览器就能够加载 CommonJS 模块

构建后，文件会自动加上如下代码

```javascript
define("pages/index/timeDegree-list-tmpl_tpl", function (
    require,
    exports,
    module
) {});
```

**与其他构建工具对比**

和 fis3 一样基于 nodejs 的构建工具有 grunt、gulp 等，那么 fis3 与这些热门工具对比有哪些区别呢？

<table border="1" cellpadding="1" cellspacing="1" style="width:550px"><tbody><tr><td>&nbsp;</td><td><p>grunt</p></td><td><p>gulp</p></td><td>fis3</td></tr><tr><td><p>插件</p></td><td><p>大约 4560 个，插件功能齐全，但选择合适的插件相对困难</p></td><td><p>少于 grunt，插件功能不全，但是插件易于编写</p></td><td><p>可用插件一千多个，开发团队在国内，易于咨询沟通，但自己编写插件相对 gulp 困难</p></td></tr><tr><td><p>配置文件</p></td><td><p>Gruntfile.js，配置起来最复杂，代码要放到 exports 函数里</p></td><td><p>Gulpfile.js，只有五个 API，配置相对 grunt 简单</p></td><td><p>fis-conf.js，配置起来最简单，直接执行几个命令即可，使用非常方便</p></td></tr><tr><td><p>使用情况</p></td><td><p>适合小任务，项目越大 grunt 的构建时间就越长，比较影响开发时间</p></td><td><p>相对 grunt 好一些，也比较适合小任务，构建速度快</p></td><td><p>内置了 php 和 java 开发环境，可以做线上环境复杂的系统</p></td></tr></tbody></table>

就个人感受而言，**grun**t 真的是太慢了，项目越大，构建时间就越慢，大大拖延了开发速度。grunt 有四千多个插件可供选择。

**gulp** 是轻量级的，定制性会更强，想要什么功能就装什么插件，但现有的插件并不一定能满足开发需求，所以可能也需要自己写插件，gulp 插件的编写相对其他工具来说可能更方便。gulp 有近七百个插件。gulp 学习成本较低，只有五个 API，也是一个非常方便的构建工具。

**fis3** 相对来说并没有那么轻量，因此可以做的事情会比较多，所以整个项目都可以使用 fis3。感觉 fis3 相比其他工具更着重性能优化方向。fis3 现有可用插件有一千多个，基本足够我们开发使用，如果想要自己开发插件也是非常方便的。总体来说，fis3 为前端开发带来了很多方便。

以下为同一个项目用这三种工具构建的结果：

**grunt**： 

[![2](http://www.alloyteam.com/wp-content/uploads/2016/01/2-300x42.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/2.png)

**gulp**:

[![1](http://www.alloyteam.com/wp-content/uploads/2016/01/1-300x286.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/1.png)

**fis3**:

[![3](http://www.alloyteam.com/wp-content/uploads/2016/01/3-300x66.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/3.png)

可见构建输出时间 grunt>fis3>gulp，这只是我做的初步试验，具体选择哪种工具进行构建还需要开发人员仔细斟酌。