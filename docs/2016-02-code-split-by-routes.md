---
title: 在 Webpack 中使用 Code Splitting 实现按需加载
date: 2016-02-24
author: he, terence
source_link: http://www.alloyteam.com/2016/02/code-split-by-routes/
---

<!-- {% raw %} - for jekyll -->

随着移动设备的升级、网络速度的提高，用户对于 web 应用的要求越来越高，web 应用要提供的功能越来越。功能的增加导致的最直观的后果就是资源文件越来越大。为了维护越来越庞大的客户端代码，提出了模块化的概念来组织代码。webpack 作为一种模块化打包工具，随着 react 的流行也越来越流行。

webpack 在官方文档上解释为什么又做一个模块打包工具的时候，是这样说的：

> The most pressing reason for developing another module bundler was Code Splitting and that static assets should fit seamlessly together through modularization.

开发一个新的模块打包工具最重要的原因就是 Code Splitting，并且还要保证静态资源也可以无缝集成到模块化中。其中 Code Splitting 是 webpack 提供的一个重要功能，通过这个功能可以实现按需加载，减少首次加载时间。

Code Splitting  

* * *

翻译一下官方文档对于 Code Splitting 的介绍：

> 对于大型的 web 应用而言，把所有的代码放到一个文件的做法效率很差，特别是在加载了一些只有在特定环境下才会使用到的阻塞的代码的时候。Webpack 有个功能会把你的代码分离成 Chunk，后者可以按需加载。这个功能就是 Code Spliiting

Code Spliting 的具体做法就是一个分离点，在分离点中依赖的模块会被打包到一起，可以异步加载。一个分离点会产生一个打包文件。 

例如下面使用 CommonJS 风格的 require.ensure 作为分离点的代码：

```javascript
// 第一个参数是依赖列表，webpack会加载模块，但不会执行
// 第二个参数是一个回调，在其中可以使用require载入模块
// 下面的代码会把module-a，module-b，module-c打包一个文件中，虽然module-c没有在依赖列表里，但是在回调里调用了，一样会被打包进来
require.ensure(["module-a", "module-b"], function (require) {
    var a = require("module-a");
    var b = require("module-b");
    var c = require("module-c");
});
```

除了这样的写法，还可以在配置文件中使用 [CommonChunkPlugin](http://webpack.github.io/docs/code-splitting.html#split-app-and-vendor-code) 合并文件

问题  

* * *

现在进入正题，本文不会针对 React 或者 Vue 做示例，因为这两个框架有很成熟的按需加载方案。   
下面这个例子用 Backbone Router 做路由，但是其中提到的按需加载方式可以用到大多数路由系统中。 

假设应用有三个路由：

-   主页
-   关于
-   支付

开始时的代码 (index.js)：

```javascript
import Backbone from 'backbone'
import $ from 'jquery'
var Route = export default Backbone.Router.extend({
   routes: {
       '': 'home',
       'about': 'about',
       'pay': 'pay'
   },
    home() {
        $('#app').html('it is home');
    },
    about() {
        $('#app').html('it is about');
    },
    pay() {
        $('#app').html('it is pay');
    }
});
new Route();
Backbone.history.start();
```

这里有三个 url 路径：index, about, pay，对应了三个很简单的 handler。这样的代码量的时候，这样写是没问题的。   
但是随着功能的增加，handler 里的内容会越来越多，所以要先把 handler 分离到不同的模块里。

逻辑分离  

* * *

把 about 的 handler 放在新的目录下 (about/index.js):

```javascript
import $ from "jquery";
export default () => {
    $("#app").html("it is about");
};
```

index,pay 也按照同样的办法分离出去。   
在 index.js 中修改一下代码:

```javascript
import Backbone from "backbone";
import home from "./home/index";
import about from "./about/index";
import pay from "./pay/index";
var Route = Backbone.Router.extend({
    routes: {
        "": "home",
        about: "about",
        pay: "pay",
    },
    home,
    about,
    pay,
});
Backbone.history.start();
```

这样分离之后对于开发而言减轻了痛苦，模块化的好处显而易见。但是分离出去的文件最终还是需要再引入的，最终生成的打包文件还是会非常大，用户从而不得去花很长时间加载一整个大文件。 

打开浏览器的主页，可以看到请求了一个 bundle.js 文件，里面包含了这个应用的全部模块。   
也就是说这样只是减少了开发的痛苦，对用户而言不会有改善。

使用 Code Splitting 进行第一次优化  

* * *

为了不让用户一次加载整个大文件，稍微好点的做法是让用户分开一次一次加载文件。   
正好 Code Splitting 可以把在分离点中依赖的模块会被打包到一起，然后异步加载。   
修改一下 index.js

```javascript
import Backbone from "backbone";
import home from "./home/index";
// 直接写路由的原因是主页访问频率高，直接打包会加快访问速度
var HomeRoute = Backbone.Router.extend({
    routes: {
        "": "home",
    },
    home,
});
require.ensure([], function (require) {
    var about = require("./about/index").default;
    var AboutRoute = Backbone.Router.extend({
        routes: {
            about: "about",
        },
        about,
    });
    new AboutRoute();
});
require.ensure([], function (require) {
    var pay = require("./pay/index").default;
    var PayRoute = Backbone.Router.extend({
        routes: {
            pay: "pay",
        },
        pay,
    });
    new PayRoute();
});
Backbone.history.start();
```

因为 require.ensure 会生成一个小的打包文件，这样可以保证用户不一次加载全部文件，而是先加载 bundle.js，再加载两个小的 js 文件。   
打开浏览器可以看到加载了三个 js 文件 

![](http://7xp2la.com1.z0.glb.clouddn.com/code-split-1.png)

现在浏览器要加载三个文件，增加了 http 请求数量。但是对于访问频率比较高的主页而言，因为主页的内容是直接打包的，会首先加载，用户看到主页的速度变快了。对于访问 about 和 pay 的用户而言，因为 http 请求数量变多，理论上会更慢的看到内容。是否分割代码应该根据实际情况来分析，因为这篇文章主要说的是代码分割，所以就先假设分离开之后对用户访问更有利。  
然而类似 about 和 pay 这两个页面用户不会每次都访问，在打开主页的时候就加载 about 和 pay 页面的 handler 是一种浪费，应该等到用户访问 about 和 pay 链接的时候再加载对应的 js 文件。

第二次优化  

* * *

想法很简单：初始时只规定主页的路由，而对于 about 和 pay 这种访问频率比较低的路由就动态加载。动态加载的方式：在处理未定义路由的 handler 中，通过匹配当前的路径，增加 router，然后重新解析页面。   
首先增加一个新路由：'\*AllMissing': 'pathFinder'   
pathFinder 函数的思路是：先定义好 about 和 pay 页面和路由和入口，然后把路由解析成正则表达式，通过正则表达式可以判断出来当前的路径符合哪条路由，然后增加新路由。   
routes.js

    // 路由:入口
    export default {
      'about': './about/index.js',
      'pay': './pay/index.js'
    }

router.js，具体的思路在代码注释中：

```javascript
import Backbone from "backbone";
import $ from "jquery";
import routes from "./routes";
import home from "./home/index";
var routesIndex = [];
export default Backbone.Router.extend({
    routes: {
        "": "home",
        "*allMissing": "pathFinder",
    },
    home,
    pathFinder,
});
// 把路由解析成正则表达式，例如about会被解析成/^about(?:\?([\s\S]*))?$/,通过这个表达式可以确定当前路径是那个路由
function routeToRegExp(route) {
    return Backbone.Router.prototype._routeToRegExp.call(null, route);
}
// 把路由列表映射到新的数组
Object.keys(routes).forEach((key) => {
    routesIndex.push({
        entry: routes[key], // 入口
        regex: routeToRegExp(key), // 解析后的正则表达式
        route: key, //路由
    });
});
function pathFinder() {
    // 循环遍历所有路由索引，如果找到了对应的路由就加载新路由
    for (var i = 0, l = routesIndex.length; i < l; i++) {
        if (routesIndex[i].regex.test(path)) {
            var route = {};
            var entry = routesIndex[i].entry;
            require.ensure([], function (require) {
                var app = require(entry).default; // 添加新的路由，重新解析当前url
                route[routesIndex[i].route] = "app";
                var Router = Backbone.Router.extend({
                    routes: route,
                    app,
                });
                new Router();
                Backbone.history.loadUrl();
            });
            return;
        }
    }
    $("#app").html("404");
}
```

然后在 index.js 引入 router.js，路由就可以工作了 

在我们看来，路由现在是动态解析，动态加载文件的。打开浏览器，再看一下网络面板。 

打开主页，只请求了 bundle.js, 文件内容也是只包含了主页的代码。 

再打开 about 页面，请求了一个 1.bundle.js，看一下 1.bundle.js 的内容就会发现，里面包含了 about 和 pay 两个页面的内容。这是 webpack 强大的地方，前文提到过，一个分离点会产生一个打包文件，而我们因为只有一个 require.ensure，所以 webpack 通过自己的分析就只产生了一个打包文件，精准的包含了我们需要的内容。不得不说，webpack 分析代码的功能有点厉害。

直接使用 require.ensure 是不能保证完全按需加载了，好在有 loader 可以帮助解决这个问题：bundle-loader.   
只用改变一点点就可以按需加载了：

```javascript
function pathFinder(path) {
    for (var i = 0, l = routesIndex.length; i < l; i++) {
        if (routesIndex[i].regex.test(path)) {
            var route = {};
            var entry = routesIndex[i].entry;
            if (entry.startsWith("./")) {
                entry = entry.substr(2, entry.length);
            } // 这里使用bundle-loader加载文件，依赖的文件不会全部打包到一个文件里。
            var handler = require("bundle!./" + entry);
            handler((bundle) => {
                var app = bundle.default;
                route[routesIndex[i].route] = "app";
                var Router = Backbone.Router.extend({
                    routes: route,
                    app,
                });
                new Router();
                Backbone.history.loadUrl();
            });
            return;
        }
    }
    $("#app").html("404");
}
```

bundle-loader 是一个用来在运行时异步加载模块的 loader，使用了 bundle-loader 加载的文件可以动态的加载。  
例如下面的官方示例:

```javascript
// 在require bundle时，浏览器会加载它
var waitForChunk = require("bundle!./file.js");
// 等待加载，在回调中使用
waitForChunk(function (file) {
    // 这里可以使用file，就像是用下面的代码require进来一样
    // var file = require("./file.js");
});
```

因为 webpack 在编译阶段会遍历到所有可能会使用到的文件，而 bundle-loader 就是在所有文件的外层加了一层 wraper:

```javascript
module.exports = function (cb) {
    require.ensure([], function (require) {
        var app = require("./file.js");
        cb(app);
    });
};
```

这样，在 require 文件的时候只是引入了 wraper，而且因为每个文件都会产生一个分离点，导致产生了多个打包文件，而打包文件的载入只有在条件命中的情况下才产生，也就可以按需加载。

经过这样的修改，浏览器就可以在不同的路径下加载不同的依赖文件了

总结  

* * *

在单页应用中使用这样的方式按需加载文件，对于路由库的要求也很简单： 

-   建立从路由到正则表达式的映射，如果没有的话，自己写也可以 
-   能够动态的添加路由 
-   能够加载指定的路由 

大多数路由库都可以做到上面三点，所以这篇文章提出的是比较普遍的办法。当然，如果你用 React 或者 Vue，他们配套的路由会比这个优化的更全面。

注：这篇文章的内容参考了 <https://medium.com/@somebody32/how-to-split-your-apps-by-routes-with-webpack-36b7a8a6231#.ncyca72ms>，但是最后作者提出的方案也比较复杂，所以就自己写了一篇，最后的办法比较简单。

<!-- {% endraw %} - for jekyll -->