---
title: phantomjs 小试
date: 2015-06-01
author: TAT.dongdongli
source_link: http://www.alloyteam.com/2015/06/phantomjs-xiao-shi/
---

<!-- {% raw %} - for jekyll -->

简单来说，phantomjs 就是一个运行在 node 上的 webkit 内核，支持 DOM 渲染，css 选择器，Canvas，SVG 等，在浏览器上能做的事情，理论上，phantomjs 都能模拟做到。

## phantomjs 使用场景：

**页面自动化测试：** 无需浏览器的情况下进行快速的 Web 测试，且支持很多测试框架，如 YUI Test、Jasmine、WebDriver、Capybara、QUnit、Mocha 等。  
**网页监控：** 定期打开页面，检查网站是否正常加载，加载结果是否符合预期等  

**页面截图：**以编程方式抓起 CSS、SVG 和 Canvas 等页面内容  
**网络爬虫：**抓取网络页面

## start

在官网直接下载 phantomjs。windows 环境直接下载 exe 文件，解压，运行

<http://phantomjs.org/download.html>

## 来个截图小 demo

由于 phantomjs 相当于一个没有 UI 的浏览器，可以抓取 url 下的所有内容，并渲染。因此，网络截图，对于 phantomjs 来说，就不费劲了。

```html
<span class="keyword">var</span> page = <span class="keyword">require</span>(<span class="string">'webpage'</span>).create();
<span class="keyword">var</span> url = <span class="string">'http://ke.qq.com'</span>;
page.open(url, <span class="keyword">function</span> (status) {
  page.render(<span class="string">'index.png'</span>);
  phantom.<span class="keyword">exit</span>();
});
 
```

保存文件为 capture.js，在终端运行 phantomjs catpure.js ，然后就可以在同目录下看到高大上的腾讯课堂首页的图片了。

## phantomjs 实现登录

在写一些爬虫程序的时候，可能会需要先登录系统，获取登录的 cookie。如果有 node request 或是 java 写的话，需要去了解系统本身的登录逻辑，实现起来比较困难，特别是登录设计复杂的时候。用 phantomjs 实现登录要简单很多，加载登录页面后，在 evalutae 包裹的沙箱内，直接对页面进行登录信息的写入，并模拟登记的行为，之后的跳转、cookie set 等就直接交给 phantomjs 完成。

下面是一个用 phantomjs 实现小米商城登录的栗子：

```html
 
<span class="keyword">var</span> page = <span class="keyword">require</span>(<span class="string">'webpage'</span>).create(),
    testindex = <span class="number">0</span>,
    loadInProgress = <span class="keyword">false</span>;
    
page.onLoadStarted = <span class="keyword">function</span>() {
    loadInProgress = <span class="keyword">true</span>;
    console.log(<span class="string">"load started"</span>);
};
 
page.onLoadFinished = <span class="keyword">function</span>() {
    loadInProgress = <span class="keyword">false</span>;
    console.log(<span class="string">"load finished"</span>);
};
 
<span class="keyword">var</span> steps = [
    <span class="keyword">function</span>() {
      <span class="comment">//Load Login Page</span>
      page.open(<span class="string">"https://account.xiaomi.com/pass/serviceLogin"</span>);
    },
    <span class="keyword">function</span>() {
        page.evaluate(<span class="keyword">function</span>(obj) {
            <span class="keyword">var</span> form = document.getElementById(<span class="string">"miniLogin"</span>);
            form.elements[<span class="string">"miniLogin_username"</span>].value = <span class="string">'用户名'</span>;
            form.elements[<span class="string">"miniLogin_pwd"</span>].value = <span class="string">'密码'</span>;
            form.elements[<span class="string">'message_LOGIN_IMMEDIATELY'</span>].click();
            <span class="keyword">return</span> document.title;
        });
        loadInProgress = <span class="keyword">true</span>;
    },
    <span class="keyword">function</span>() {
        page.render(<span class="string">'login-succ.png'</span>);
    }
];
 
<span class="keyword">var</span> interval = setInterval(<span class="keyword">function</span>() {
    <span class="keyword">if</span> (!loadInProgress && typeof steps[testindex] == <span class="string">"function"</span>) {
        steps[testindex]();
        testindex++;
    }
    <span class="keyword">if</span> (typeof steps[testindex] != <span class="string">"function"</span>) {
        phantom.<span class="keyword">exit</span>();
    }
}, <span class="number">10</span>);
 
```

在终端执行 phantomjs 命令，最后，可以看到登录后的页面截图

![](http://7tszky.com1.z0.glb.clouddn.com/FkC9rkEdkLGE1b-DAA_l0FyGo8-l)

## 延伸阅读

[CasperJS](http://casperjs.org/)：一个开源的导航脚本处理和高级测试工具

<!-- {% endraw %} - for jekyll -->