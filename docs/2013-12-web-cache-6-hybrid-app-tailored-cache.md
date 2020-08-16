---
title: 【Web 缓存机制系列】6 – 进击的 Hybrid App，量身定做缓存机制
date: 2013-12-05
author: TAT.Rehorn
source_link: http://www.alloyteam.com/2013/12/web-cache-6-hybrid-app-tailored-cache/
---

<!-- {% raw %} - for jekyll -->

\\==== 索引 =====

[【Web 缓存机制系列】1 – Web 缓存的作用与类型](http://alloyteam.com/2012/03/web-cache-1-web-cache-overview/)

[【Web 缓存机制系列】2 – Web 浏览器的缓存机制](http://alloyteam.com/2012/03/web-cache-2-browser-cache/) 

[【Web 缓存机制系列】3 – 如何构建可缓存站点](http://alloyteam.com/2012/03/web-cache-3-how-to-build-cacheable-website/)

[【Web 缓存机制系列】4 – HTML5 时代的 Web 缓存机制](http://alloyteam.com/2012/03/web-cache-4-html5-web-cache/)

[【Web 缓存机制系列】5 – Web App 时代的缓存机制新思路](http://alloyteam.com/2012/03/web-cache-5-web-app-cache/)

[【Web 缓存机制系列】6 - 进击的 Hybrid App，量身定做缓存机制](http://www.alloyteam.com/2013/12/web-cache-6-hybrid-app-tailored-cache/)

\\============

# **前言**

前面的文章分别简述了 Web 缓存、相关机制、以及 html5 和 Web App 时代我们可以选择的缓存思路。转眼过了很长时间，这期间移动互联网成为大家讨论和学习的焦点，部门也有很多同学陆续接触 Mobile Native App 和 Mobile Web App 的开发。同时，还有部分同学专注 QQ 内嵌 Webkit + Client 这种 Hybrid App 模式的开发，继续推动 QQ 客户端 Web 化的进程。

引用张图，简单粗俗的解释下 Native App、Web App 和 Hybrid App

[![hybrid-app](http://www.alloyteam.com/wp-content/uploads/2013/12/hybrid-app.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/hybrid-app.png)

**Navtie App：** 使用平台系统提供的原生语言来编写的 App，如果 Android 用 java，ios 用 objective-c，windows c++ 等

**Web App：**主要使用 Web 技术 js/html/css 进行编写，运行在各平台系统浏览器或浏览器组件中

**Hybrid App：**混合使用前面两种技术，部分代码以 Web 技术编写，部分代码由某些 Native Container 承担（如 Phongap 插件，PC / 手机 QQ 客户端等）

# 现有的缓存机制及问题

移动互联网网速慢、QQ 客户端对 Web 模块可用性要求高，使得我们不管做 Mobile Web App 开发、还是 PC Web App 开发，都必须对 Web 缓存有更深入的理解和利用。PC QQ 和 手机 QQ 都有基本 Webkit 的 Webview，除了传统常规提到的缓存外，参阅《[Web 浏览器的缓存机制](http://alloyteam.com/2012/03/web-cache-2-browser-cache/) 》，我们最先想到的优化方案就是前面文章提到的 Html5 App Cache，Web Storage，详细请参阅《[HTML5 时代的 Web 缓存机制](http://alloyteam.com/2012/03/web-cache-4-html5-web-cache/)》 和《[Web App 时代的缓存机制新思路](http://alloyteam.com/2012/03/web-cache-5-web-app-cache/)》。

但，使用的过程中，我们发现了一些关于 html5 app cache 的问题：

1、第一次必须联网，在移动网络下首次打开效果非常不理想

2、http 头设置会导致 manifest 无法正常更新，见 <http://www.alloyteam.com/2012/01/html5-offline-app-update-problem/>

3、Manifest 中缓存文件一旦下载出错，后续的文件将不再下载，抛出错误事件，见：<http://stackoverflow.com/questions/6666513/html5-manifest-caching-error>

4、Android 系统版本众多，较低版本的浏览器对 manifest 支持不完善

5、引用 manifest 的 html 页面本身也会被缓存

6、《[慎用 manifest](http://mweb.baidu.com/?p=220)》一文提到的如：页面的参数传递、manifest 的发布、回滚、下线等问题

从上面可以看出，html5 虽然提供基于 manifest 这种离线缓存的机制，但在实际运用过程中还是会遇到非常多的问题，于是，我们开始思考，既然是 hybrid app，与其花大量时间踩坑，有资源有条件，不如更激进一点，尝试利用客户端能力来量身定做一套自己适用的缓存机制。于是 Alloykit 诞生了。

# 关于 Alloykit

Alloykit 是 PC / 手机 QQ 上基于 Webview 开发的一个方便易用的开发组件，能够使基于 Webkit 开发的模块，快速拥有 Web 资源本地化、Common Api、自动种入登录态和续期、诊断上报、DNS 管理、开发者工具支持、关键性能数据上报等特性。

**Alloykit 各模块及主要功能：**

**本地化模块：**把静态资源下载到本地，然后通过访问本地资源代替去服务器请求

**Common Api 模块：**对常用共性的 Client 接口进行封装，Web 可以内嵌 Commonapi.js 进行方便调用

**登录态管理模块：**web 登录态自动续期，登录态拉取失败走 Pt 跳转

**诊断上报模块：**诊断修复用户问题（清缓存，DNS，重新加载页面），截屏并收集用户本机网络信息，上报到后台进行分析。

**DNS 管理模块：**域名预加载，域名 ip 验证等

**开发模式：**开发模式开关，开发者调试工具支持

**数据上报：**通用控件在不同业务中的关键上报点

下面主要介绍一下本地化缓存模块的设计思路，后面有机会再单独介绍其它的模块。

# 本地化模块

用一张图大致示意如下：

[![cache2](http://www.alloyteam.com/wp-content/uploads/2013/12/cache2.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/cache2.png)

由上图可以看出，本地化模块主要由下面两个子模块组成：

1、拦截器：采用的一种类似 Fiddler AutoResponse 的本地替换思路，通过拦截所有 web 请求，进行本地化资源匹配，命中则用本地资源直接替换，否则，正常发起请求。

2、更新器：根据更新策略进行新版本资源检测，负责下载和维护本地缓存目录中的资源，并将更新过程关键点通过事件通知到 Web 页面备用。

原理很简单，使用也很简单，主要分为以下几个步骤：

1、客户端开发阶段：新建窗口的时候，只需要通过配置文件，将窗口类型声明为 AlloykitWindow

2、前端开发阶段：开发过程透明，不需要任何特殊处理

3、前端发布阶段：打包静态资源 zip 包

把业务涉及到并且希望离线的域名和资源打包，假设你的页面用到了 web.qq.com、cdn.qq.com、test.statics.qq.com 等域名，如下图所示，为每个域名建一个目录（若只有一个域名，则只建立一个目录），然后按照资源的 url 建立各级子目录并把资源放到相应的子目录下。

比如你有这样一个 html 页面：<http://web.qq.com/module1/helloworld.html>

把需要离线的页面文件和图片资源放到目录 web.qq.com/module1 下即可，如图：

[![pack-zip](http://www.alloyteam.com/wp-content/uploads/2013/12/pack-zip.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/pack-zip.png)

使用 zip 压缩软件，将所有资源打包为一个 zip 包。

4、运维发布阶段：

-   正常发布线上资源
-   登录资源包管理平台，提交对应 zip 包
-   需要打包到客户端安装包的资源，单独提交给客户端开发负责打包

**Alloykit 本地化 和 H5 manifest 对比**

1、Alloykit 可以选择将关键页面直接打包到客户端或 App 安装包，首次打开不需要依赖网络条件

2、对于没有打包到安装包的页面，也可以通过配置，让客户端启动后提前加载资源包

3、Alloykit 开发过程体验更简单，基本透明

4、Alloykit 把所有资源打包为一个 zip 包进行下载，更高效

5、Alloykit 通过客户端提供的基于 tcp 的下载通道进行下载，并有重试机制，更加稳定可靠

6、Alloykit 可以通过自身封装，支持多平台，避免开发者兼容多平台带来的麻烦

7、Alloykit 可以通过协议的设计，轻松实现刷新缓存、封版、下线离线特性等功能

这个本地化机制目前已有模块开始试用，在享受量身定制的缓存机制带来的性能提升和开发便利的同时，我们开始遇到并思考本地化之后的一些问题。

# 本地化之后

**1、本地化文件的安全问题**

缓存目录中本地文件，第三方是有办法找到并进行强制修改，可能存在不安全的因素。有同学可能会说这个担心其实多此一举，比如 Chrome Cache 文件写入磁盘的算法是开源的，如果第三方（类似 ChromeCacheView）软件实现了这个算法，就能对缓存文件进行修改，也存在类似安全问题。话虽如此，可是还是要做最坏的打算，说不定哪天数字搞你一下。要设计一种机制做保障。这种提供两种思路：

1）设计一种类似 Chrome Cache 闭源算法，把获取的资源包以这种算法读写入本地磁盘上。

2）使用非对称加密算法

客户端开发的时候，内嵌私钥

资源包 zip 中加入一个包含所有文件 md5 信息的 json 文件，并使用对应的公钥进行加密

客户端获取 zip 包后，使用私钥对 json 文件解密，获取 md5 信息，逐个进行校验

**2、Web 项目运营思路转变**

Web 项目一旦使用了本地化特性，不管是 H5 的 manifest 还是 Alloykit ，都会存在滞后一次更新，所以始终都会存在旧版本的长尾问题。所以这类型的项目给运营提出了更高的要求：

1）后台 CGI 接口，尽量考虑向前兼容，保证协议结构不变，如果确实需要改动，建议启用新路径

2）前端资源文件，建议采用增量的形式发布，比如 main.js ，发布的时候建议编译成 main-\*\*\*\*.js（一般使用时间戳或 md5 后 8 位）

这样做的好处很明显，可以最大限度避免发布引起的波动，同时也可以支持 web 项目多版本并存，避免多版本相互影响。使用 grunt 或 modjs 可以轻松完成这个自动化构建编译工作。

3）Web 版本的铺量速度有所下降，所以对版本质量的要求更高，不建议太频繁、未经严格测试的版本发布

可见是否使用本地化，也需要做慎重的考虑，在性能和各个方面做权衡。

**3、本地化之后的可用性问题**

Alloykit 本地化之后，理论上在断网的情况下，页面也是打开的。但是要保证页面可用，其实还有很长的路要走。

针对那种单机的 h5 游戏或者简单页面，其实无需任何处理就能保证离线的访问效果。但，目前完全单机的 Web App 基本是不存在，大量的动态的数据和社会化的交互。如果本地化之后不做任何处理，那么在离线的情况下，基本也是只有页面框架，大量的页面空白和 ajax 请求超时，基本也相当于不可用。那么，花了这么大力气定制的本地化机制就仅仅保证打开的时候可看不可用吗？有什么办法可以改善吗？

答案是有的，这时 Web Storage 和 Web Database 就可以派上用场了，详细使用可以 Google 或者参考索引中的第 4、5 篇文章。

一些典型的离线场景及处理方案：

1）离线写操作：将 Ajax 请求以及相关参数保存到 localStorage 队列中，网络上线后，触发执行队列中的操作

2）离线读操作：页面上有需要通过 Ajax 获取动态的数据或远程图片进行渲染的块，可以通过前端 hardcode 一些默认数据，并且将最近一次 ajax 结果存储到 localStorage 中，图片可以转为 base64 字符串才用同样的方式处理

localStorage 有同源限制，大小也有限制，并且只能存储字符串，需要存储图片需要进行转化，比较繁琐耗性能。可否跟激进一些，由客户端提供模拟 localStorage，自行开辟存储空间，提供接口进行存取和校验？完全是可行的，并且现在在一些 Mobile 的项目中进行了相关尝试，接口整合到 CommonApi 模块中。

# 总结

独立于标准之外重复制造轮子，本身不是太推荐的做法。在目前标准和平台支持未完善，以及在特定场景下有欠缺的情形下，资源允许，我们选择了尝试新方法，针对 Hybrid App 这种特殊的运用场景定制了一种本地化缓存和存储的实现方案。时间仓促，方案本身仍处于测试阶段，某些方面考虑难免会有欠考虑，非常欢迎同学们留言指出、改进。

<!-- {% endraw %} - for jekyll -->