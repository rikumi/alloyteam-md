---
title: angular 应用如何实现按需加载
date: 2015-10-13
author: TAT.mandyluo
source_link: http://www.alloyteam.com/2015/10/angular-application-how-to-load-on-demand/
---

<!-- {% raw %} - for jekyll -->

KindEditor

html {margin:0;padding:0;} a {cursor:pointer} body {margin:0;padding:5px;} body.edit-mode {background:url (style/editor-inner-glow.jpg) no-repeat center top} body, td {font:12px/1.5 "宋体","sans serif",tahoma,verdana,helvetica;} body, p, div {word-wrap: break-word;} p {margin:0 0 5px;} table {border-collapse:collapse;} img {border:0;} table.ke-zeroborder td {border:1px dotted #AAA;} table {font-size: inherit; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; display: table; } table td, table th { word-break: break-all; border: 1px solid #999; padding: 5px 10px; min-height: 25px; min-width: 25px; height: 25px; } table td>div {min-width: 2px;} img.ke-flash { border:1px solid #AAA; background-image:url (themes/common/flash.gif); background-position:center center; background-repeat:no-repeat; width:100px; height:100px; } img.ke-rm { border:1px solid #AAA; background-image:url (themes/common/rm.gif); background-position:center center; background-repeat:no-repeat; width:100px; height:100px; } img.ke-media { border:1px solid #AAA; background-image:url (themes/common/media.gif); background-position:center center; background-repeat:no-repeat; width:100px; height:100px; } img.ke-anchor { border:1px dashed #666; width:16px; height:16px; } .ke-script { display:none; font-size:0; width:0; height:0; } .ke-pagebreak { border:1px dotted #AAA; font-size:0; height:2px; } .ke-content { font-family: "微软雅黑", "Microsoft Yahei", Helvetica Neue, Hiragino Sans GB,"宋体", simsun, "黑体", Arial, sans-serif; font-size: 16px; word-break: break-all; word-wrap: break-word; min-height:300px } div.remind-wrap { width:550px; min-height:18px; font-size:14px; border:none; display:inline-block; position:relative; vertical-align:top; } div.remind-wrap.selected, div.remind-wrap.mover, div.remind-wrap:hover { background:#ffffd6; } div.remind-wrap.mover .remind-text { background:#ffffd6; } .remind-textarea:focus { background:#ffffd6; } div.remind-mask { position:absolute!important; width:550px; display:block; height:18px; z-index:999; background:white; opacity:0; filter:progid:DXImageTransform.Microsoft.Alpha (Opacity=0); } div.remind-content { padding-left:50px; line-height:18px; height:18px; overflow:hidden; } div.remind-content .remind-textarea { resize: none; height: 18px; font-size: 13px; line-height: 18px; width:100%; display:inline-block; padding:0px; outline:none; z-index:3; font:inherit; letter-spacing:inherit; word-spacing:inherit; border:none; white-space:nowrap; background:inherit; } .remind-content .remind-textarea-holder { z-index:-1!important; position:absolute; display:none; top:0px; left:9999px; } .view-mode .remind-textarea { display:none; } span.original-todo { display:none; } input.remind-checked { position:absolute; left: 5px; top: 2px; \*top: -2px; margin:0px; padding:0px; } i.remind-watch { position:absolute; left: 25px; width: 16px; height: 16px; cursor: pointer; top: -1px; background: url(style/remind.png); background-position: -26px -2px; } .expired i.remind-watch { background-position: -5px -2px; } .invalid i.remind-watch { background-position: -48px -2px; } .remind-text { overflow:hidden; display:none; width:100%; height:100%; text-overflow:ellipsis; cursor:default; white-space:nowrap; background:inherit; border:none; font:inherit; letter-spacing:inherit; word-spacing:inherit; border:none; white-space:nowrap; } .view-mode .remind-text { display:inline-block; } .invalid .remind-text { color:#999; text-decoration:line-through; } .lt-550 .remind-wrap{ width:100%; } .from-tcWeiboShare a{ color: #006A92; text-decoration: none; }

我们有个系统是用 angular 开发的，是一个单页面应用，随着系统的迭代，首屏代码已经过于庞大，所以对系统进行改造。

我们主要面临 3 个问题

1. 是否需要模块加载框架？

2. 异步加载回来的页面组件，如何注册？

3. 在什么时机加载页面组件？

针对第一个问题，由于 angular 自身已经有一套模块化方案，再引入模块加载框架有点冗余，而且整体改造量比较大，所以不考虑。

因此只是实现了一个 loadscript 方法，用来加载组件。稍微需要注意的是加载多个文件时候的串并行，和避免页面重复切换时的重复加载。

第二个问题比较蛋疼，angular 有 “启动” 的说法，“启动” 发生在 domcontentloaded 之后，会把所有注入到主模块中的依赖编译一遍。

![QQ 图片 20151013120836.png](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ图片20151013120836.png)

启动之后再想使用 controller、deractive 等 api，会直接报错

![QQ 图片 20151013144848.png](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ图片20151013144848.png)

目前来看，解决这个问题，只有一个方法，就是利用主模块的 provider 主动注册 controller，但是由于 provider 不能直接使用，所以我们把它存在主模块下面。

![QQ 图片 20151012202840.png](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ图片20151012202840.png)

通过存下来的方法，可以用来注册异步加载回来的页面组件。缺点就是这样子所有子页面都挂在主模块下了。

针对第三个问题，由于运营平台是单页面应用，最好的加载时机应该是路由监听到哈希变化时，但是由于我们的路由是写死的静态配置，一开始没找到什么好的办法。

后来发现了这样一个 api

![QQ 图片 20151013150020.png](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ图片20151013150020.png)

大概是说，在 [$routeChangeSuccess](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeSuccess) 之前，我们还可以做些东西，把加载时机放在这里最适合不过啦

具体实现大概是这样子

![QQ 图片 20151013150414.png](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ图片20151013150414.png)

至此，这个方案已经通了，剩下什么工作？

1. 整理代码，使代码更通用化，我们以后开发新页面，只需要在路由配置里这样写就可以啦

![QQ 图片 20151013150806.png](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ图片20151013150806.png)

2. 把现有页面都改造一下，由于之前没有按需加载，不同页面之间的 service 耦合严重，今后我们开发新页面，就要注意不同页面之间共用的 service 最好放在 component 下面

3. 改构建，给路由里的 js 引用换成 cdn 路径。

<!-- {% endraw %} - for jekyll -->