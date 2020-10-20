---
title: 初涉 Angular：认识与使用 $location 服务
date: 2015-04-22
author: TAT.yunsheng
source_link: http://www.alloyteam.com/2015/04/angular-location/
---

<!-- {% raw %} - for jekyll -->

前言  

* * *

笔者驽钝，最近由于工作关系才去学习了 Angular，发现在合适的项目下使用 Angular 开发真是非常畅快！MVC 框架需要一些学习成本才能上手，再加上 Angular 采用现在通行的[约定优于配置（convention over configuration）](http://zh.wikipedia.org/zh/%E7%BA%A6%E5%AE%9A%E4%BC%98%E4%BA%8E%E9%85%8D%E7%BD%AE)理念，框架本身做了很多封装，所以实现起来需要开发人员对框架足够的熟悉。

Angular 一个典型的使用场景就是单页应用，那么如何在一个单页面中改变 URL，请与笔者一同学习。

$location  

* * *

Angular 中使用内置的 $location 服务来监听、操作 URL，包括如下功能：

-   获取、监听、改变地址栏的 URL
-   与 URL 实现双向数据绑定（地址栏变动、前进后退或者点击页面的链接均会触发）。
-   将 URL 对象封装成了一套方法（protocol、host、port、path、search 和 hash）

相对于 BOM 原生的 window.location，使用 $location 更利于测试用例的编写（通过 $location 来注入假数据），提供的接口也更友好（官方一直强调是 **jQuery-style getters and setters**，我的理解就是支持链式写法），与 URL 实现了双向绑定，内部集成了 HTML5 的 History API，所以建议使用 $location 服务。

如果想实现类似 history.replaceState () 的功能，可以使用 replace 方法，代码如下。本方法只会实现一次 replace 历史记录的功能。

```javascript
$location.path("/someNewPath");
$location.replace();
// or you can chain these as:
$location.path("/someNewPath").replace();
```

$location 处于 Angular 的生命周期内，单个周期内的改变会统一在周期结束时生效，所以不必担心每次改变了 $location，URL 都会立刻变化。

**注意：**$location 无法使整个页面重新加载。如果改变 URL 后希望重新加载页面，请使用 $window.location.href。

配置 $location  

* * *

配置 $location 服务，需要用 $locationProvider 设置参数：

-   html5Mode(mode): {boolean|Object}

    -   true or enabled:true - 设置为 HTML5 mode
    -   false or enabled:false - 设置为 Hashbang mode
    -   requireBase:true - 不需要根目录 default: enabled:false
-   hashPrefix (prefix): {string} Hashbang 风格的 URL 中 #号前面的前缀，习惯上用 "!"，虽然默认是 ""(没有！的 #怎么能叫 shebang 呢。。)

```javascript
$locationProvider.html5Mode(true).hashPrefix("!");
```

$locationProvider 用于配置应用中 [Deep Linking](http://en.wikipedia.org/wiki/Deep_linking) 的存储方式，就提供了上述两个配置接口。

Hashbang 模式  

* * *

$location 服务支持配置两种 URL 格式：Hashbang 模式（默认）和 HTML5 模式。两种模式下的 API 都是通用的。如下图

![image](https://docs.angularjs.org/img/guide/hashbang_vs_regular_url.jpg)

所谓的 Hashbang 就是在 URL 里会看到 #，所有的路由变化都是在 hash 里面控制的，具体到 URL 长这样：<https://docs.angularjs.org/#!/guide/introduction?search=test>

如果我们用原生的 window.location 打印，会发现变化的部分其实都是在 hash 里，略 eggache。

![image](http://www.alloyteam.com/wp-content/uploads/2015/04/QQ%E6%88%AA%E5%9B%BE20150421223846.png)

好处是各个浏览器都兼容，坏处是 URL 长相奇特，SEO 也不友好。

HTML5 模式  

* * *

所以 Angular 提供了 HTML5 模式。使用了 HTML5 的 History API 来控制 URL 的变化，不再有啰嗦的 #。浏览器的兼容性可参考[这里](http://caniuse.com/#search=history)。鉴于兼容性和 Angular 内部的封装，建议采用本模式。

Angular 内部做了向下兼容，采用本模式后，在低版本的浏览器仍会用 Hashbang 来降级处理，两种模式的 URL 也能自动实现相互转换，无需开发者关注。不过，以下三种情况，Angular 不会做转换：

-   带有 target 的链接 &lt;a href="/ext/link?a=b" target="\_self">link&lt;/a>
-   跳往其他域名的绝对路径 &lt;a href="[http://angularjs.org/">link&lt;/a>](http://angularjs.org/%22%3Elink%3C/a%3E)
-   非当前根路径下的链接 &lt;a href="/not-my-base/link">link&lt;/a>

**记得设置页面的根目录**。

如果你的应用挂在根目录（<https://myapp.com/），则设置为：>

```html
&lt;head>
  &lt;base href="/">
  ...
&lt;/head>
```

如果挂在子目录（<https://myapp.com/subapp/），则设置为：>

```html
&lt;head>
  &lt;base href="/subapp/">
  ...
&lt;/head>
```

不设置会导致 Angular 无法正确处理相对链接和回退到 hashbang 模式。

**服务端也要做相应的配置！**

因为是单页应用，所以其他链接请求到服务器时，根本找不到对应的 html，就会忧伤的返回 404。所以需要将所有到应用根路径下的请求都重定向到某个页面（比如 index.html）。这样浏览器里先由 index.html 启动应用，Angular 发现 URL 变化了再定位到真正请求的路由上。


<!-- {% endraw %} - for jekyll -->