---
title: Node 直出理论与实践总结
date: 2016-07-04
author: TAT.joeyguo
source_link: http://www.alloyteam.com/2016/07/node-straight-out/
---

<!-- {% raw %} - for jekyll -->

[原文地址](https://github.com/joeyguo/blog/issues/8)

直出是什么？到底是怎样的性能优化？本文将结合从在浏览器输入 url，到展示最终页面的过程来对其进行一步步分析，并将在手 Q web 中的实际应用实践进行总结。

模式 1 - 前后分离  

==============

从用户输入 url　到展示最终页面的过程，这种模式可简单的分为以下 5 部分

1.  用户输入 url，开始拉取静态页面
2.  静态页面加载完成后，解析文档标签，并开始拉取 CSS（一般 CSS 放于头部）
3.  接着拉取 JS 文件（一般 JS 文件放于尾部）
4.  当 JS 加载完成，便开始执行 JS 内容，发出请求并拿到数据
5.  将数据与资源渲染到页面上，得到最终展示效果

具体流程图如下

[![1](https://cloud.githubusercontent.com/assets/10385585/15772984/0cc47cfe-29a7-11e6-94ad-3cd4b82daabb.png)](https://cloud.githubusercontent.com/assets/10385585/15772984/0cc47cfe-29a7-11e6-94ad-3cd4b82daabb.png)

这种处理形式应该占据大多数，然而也很容易发现一个问题就是**请求数多，前后依赖大**，如必须等待 JS 加载完成后执行时才会发起 数据请求，等待数据回来用户才可以展示最终页面，这种强依赖的关系使得整个应用的首屏渲染耗时增加不少。

模式 2 - 数据直出  

==============

> 数据请求在 server 端上提前获取，并和 html 一同返回，页面模板和数据的渲染在浏览器端上执行

在模式 1 中，第 1 点用户输入 url 时 server 端不做其他处理直接返回 html ，在第 4 点向 server 请求获取数据。那么，同样都是向 server 请求获取，如果在第 1 点中将请求数据放在 server 上，将拿到的数据拼接到 HTML 上一并返回，那么可减少在前端页面上的一次数据请求时间。 这就是模式 2 - 数据直出所做的事，处理方式也很简单

1.  用户输入 url ，在 server 返回 HTML 前去请求获取页面需要的数据
2.  将数据拼接到 HTML 上 并 一起返回给前端（可以插入 script 标签将数据添加到全局变量上，或放到某个标签的 data 属性中，如 &lt;body data-serverData = '{list:\[1,2,3]}' >）
3.  在前端的 JS 代码中判断是否已在服务端拿到数据，直接拿该数据进行渲染页面，不再做数据请求

具体可下面的流程图看出这种模式下

[![2](https://cloud.githubusercontent.com/assets/10385585/15772992/15b38562-29a7-11e6-903a-2bd118303b10.png)](https://cloud.githubusercontent.com/assets/10385585/15772992/15b38562-29a7-11e6-903a-2bd118303b10.png)

这种模式与模式 1 相比，减少了这两种模式请求数据的耗时差距。这块差距有多少呢？

### 发起一个 HTTP 的网络请求过程

    DNS解析（100~200ms可以缓存）
             |
             |
            建立TCP链接 (三次握手100~200ms )
                    |
                    |
                HTTP Request( 半个RTT ) 
                       |
                       |
                  HTTP Response( RTT 不确定优化空间 )

注: RTT 为 Round-trip time 缩写，表示一个数据包从发出到返回所用的时间。

### HTTP 请求在前后端发出，差距有多少？

由上面对 HTTP 的网络请求过程可看到建立一次完整的请求返回在耗时上明显的，特别是外网用户在进行 HTTP 请求时，由于网络等因素的影响，在网络连接及传输上将花费很多时间。而在服务端进行数据拉取，即使同样是 HTTP 请求，由于后端之间是处于同一个内网上的，所以传输十分高效，这是差距来源的大头，是优化的刚需。

模式 3 - 直出 (服务端渲染)  

====================

> 数据请求在 server 端上提前获取，页面模板结合数据的渲染处理也在 server 上完成，输出最终 HTML

模式 2 中将依赖于 JS 文件加载回来才能去发起的数据请求挪到 server 中，数据随着 HTML 一并返回。然后等待 JS 文件加载完成，JS 将服务端已给到的数据与 HTML 结合处理，生成最终的页面文档。

数据请求能放到 server 上，对于数据与 HTML 结合处理也可以在 server 上做，从而减少等待 JS 文件的加载时间。 这就是模式 3 - 直出 (服务端渲染)，主要处理如下

1.  server 上获取数据并将数据与页面模板结合，在服务端渲染成最终的 HTML
2.  返回最终的 HTML 展示

可以从下图看出，页面的首屏展示不再需要等待 JS 文件回来，优化减少了这块时间

[![3](https://cloud.githubusercontent.com/assets/10385585/15772996/1c5f64bc-29a7-11e6-800a-bd8b4af30b0f.png)](https://cloud.githubusercontent.com/assets/10385585/15772996/1c5f64bc-29a7-11e6-800a-bd8b4af30b0f.png)

通过以上模式，将模式 1 - 常用模式中的第 3 和 4 点耗时进行了优化，那么可以再继续优化吗？  
在页面文档不大情况下，可将 CSS 内联到 HTML 中，这是优化请求量的做法。直出稍微不同的是需要考虑的是服务端最终渲染出来的文档的大小，在范围内也可将 CSS 文件内联到 HTML 中。这样的话，便优化了 CSS 的获取时间，如下图

[![4](https://cloud.githubusercontent.com/assets/10385585/15773007/2b09bc10-29a7-11e6-8fa9-6dc12579b1aa.png)](https://cloud.githubusercontent.com/assets/10385585/15773007/2b09bc10-29a7-11e6-8fa9-6dc12579b1aa.png)

小结  

* * *

直出能够将常用模式优化到剩下了一次 HTML 请求，加快首屏渲染时间，使用服务端渲染，还能够优化前端渲染难以克服的 SEO 问题。而不管是简单的 数据直出 或是 服务端渲染直出 都能使页面的性能优化得到较大提高，以下将从实际应用中进行说明。

以手 Q 家校群的数据直出优化为例  

====================

由于项目上线时间紧，所以在第一次优化上使用了数据直出的简单方式来优化首屏渲染时间。具体处理与 模式 2 数据直出方式 一致，与其不同的是这里使用了由 AlloyTeam 开发的 基于 KOA 的玄武直出服务 来作为前端与服务端间的中间层。形式如下

[![default](https://cloud.githubusercontent.com/assets/10385585/15769260/e4a53e5e-298b-11e6-90de-7ba11e492d9d.png)](https://cloud.githubusercontent.com/assets/10385585/15769260/e4a53e5e-298b-11e6-90de-7ba11e492d9d.png)

使用这种中间层的方式，在项目的开发过程中依然可使用前后端分离的方式，开发完后再将页面请求指向这个中间层服务上。中间层服务主要做了上述 模式 2 - 数据直出 中的处理

1.  使用前端文件及调用服务端做好的拉取数据接口
2.  将数据与前端文件结合并返回给请求来源

由于该中间层服务与具体 server 部署在相同的内网上，所以它们直接的数据交互是十分高效的，从而可达到 模式 2 - 数据直出 中所述的优化。  
另一点，做为中间层玄武直出服务通过公司的 L5 负载均衡服务，完美兼容直出与非直出版本，即当直出服务挂掉了，也可以顺利走非直出版本，确保基本的用户体验，也能够更好的支持 A/BTest。

性能数据  

=======

简单的数据方式直出同样迎来了较大的性能提升，手 Q 家校群列表页在首屏渲染完成时间上，相比于优化前的版本，数据直出有大概 650ms 的优化，提升约 35% 的性能。

[![12](https://cloud.githubusercontent.com/assets/10385585/15775925/489e637e-29b7-11e6-8442-8a4cea15816c.png)](https://cloud.githubusercontent.com/assets/10385585/15775925/489e637e-29b7-11e6-8442-8a4cea15816c.png)

总结  

=====

在前后端没有分离时 使用后端渲染出模板的方式是与文中所述的直出方案效果是一致的，前后端分离后淡化了这种思想，Node 的发展让更多的前端开始做后端事情，直出的方式也越来越被重视了。

历史的车轮滚滚向前，直出方案看似回到了服务端渲染的原点，实际上是在以前的基础上盘旋上升。有了更多的能力，便可以有更多的思考。期待前端会越来越强大，这不，react-native 也让前端开始着手客户端的事儿了～

后记  

=====

手 Q 家校群使用 React + Redux + Webpack 架构，既然是 React，肯定不可忽略 **React 同构** （服务端渲染）关于 React 同构直出的具体实践，我将其总结在另外一篇文章上，可点击查看 [React 同构直出优化总结](https://github.com/joeyguo/blog/issues/9)

对于文章一开始提及的前端路由，对路由的实现原理感兴趣的也可点击查看  [前端路由实现与 react-router 源码分析](https://github.com/joeyguo/blog/issues/2)

感谢指教！


<!-- {% endraw %} - for jekyll -->