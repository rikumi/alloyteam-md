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
&lt;span class="keyword">var&lt;/span> page = &lt;span class="keyword">require&lt;/span>(&lt;span class="string">'webpage'&lt;/span>).create();
&lt;span class="keyword">var&lt;/span> url = &lt;span class="string">'http://ke.qq.com'&lt;/span>;
page.open(url, &lt;span class="keyword">function&lt;/span> (status) {
  page.render(&lt;span class="string">'index.png'&lt;/span>);
  phantom.&lt;span class="keyword">exit&lt;/span>();
});
 
```

保存文件为 capture.js，在终端运行 phantomjs catpure.js ，然后就可以在同目录下看到高大上的腾讯课堂首页的图片了。

## phantomjs 实现登录

在写一些爬虫程序的时候，可能会需要先登录系统，获取登录的 cookie。如果有 node request 或是 java 写的话，需要去了解系统本身的登录逻辑，实现起来比较困难，特别是登录设计复杂的时候。用 phantomjs 实现登录要简单很多，加载登录页面后，在 evalutae 包裹的沙箱内，直接对页面进行登录信息的写入，并模拟登记的行为，之后的跳转、cookie set 等就直接交给 phantomjs 完成。

下面是一个用 phantomjs 实现小米商城登录的栗子：

```html
 
&lt;span class="keyword">var&lt;/span> page = &lt;span class="keyword">require&lt;/span>(&lt;span class="string">'webpage'&lt;/span>).create(),
    testindex = &lt;span class="number">0&lt;/span>,
    loadInProgress = &lt;span class="keyword">false&lt;/span>;
    
page.onLoadStarted = &lt;span class="keyword">function&lt;/span>() {
    loadInProgress = &lt;span class="keyword">true&lt;/span>;
    console.log(&lt;span class="string">"load started"&lt;/span>);
};
 
page.onLoadFinished = &lt;span class="keyword">function&lt;/span>() {
    loadInProgress = &lt;span class="keyword">false&lt;/span>;
    console.log(&lt;span class="string">"load finished"&lt;/span>);
};
 
&lt;span class="keyword">var&lt;/span> steps = [
    &lt;span class="keyword">function&lt;/span>() {
      &lt;span class="comment">//Load Login Page&lt;/span>
      page.open(&lt;span class="string">"https://account.xiaomi.com/pass/serviceLogin"&lt;/span>);
    },
    &lt;span class="keyword">function&lt;/span>() {
        page.evaluate(&lt;span class="keyword">function&lt;/span>(obj) {
            &lt;span class="keyword">var&lt;/span> form = document.getElementById(&lt;span class="string">"miniLogin"&lt;/span>);
            form.elements[&lt;span class="string">"miniLogin_username"&lt;/span>].value = &lt;span class="string">'用户名'&lt;/span>;
            form.elements[&lt;span class="string">"miniLogin_pwd"&lt;/span>].value = &lt;span class="string">'密码'&lt;/span>;
            form.elements[&lt;span class="string">'message_LOGIN_IMMEDIATELY'&lt;/span>].click();
            &lt;span class="keyword">return&lt;/span> document.title;
        });
        loadInProgress = &lt;span class="keyword">true&lt;/span>;
    },
    &lt;span class="keyword">function&lt;/span>() {
        page.render(&lt;span class="string">'login-succ.png'&lt;/span>);
    }
];
 
&lt;span class="keyword">var&lt;/span> interval = setInterval(&lt;span class="keyword">function&lt;/span>() {
    &lt;span class="keyword">if&lt;/span> (!loadInProgress && typeof steps[testindex] == &lt;span class="string">"function"&lt;/span>) {
        steps[testindex]();
        testindex++;
    }
    &lt;span class="keyword">if&lt;/span> (typeof steps[testindex] != &lt;span class="string">"function"&lt;/span>) {
        phantom.&lt;span class="keyword">exit&lt;/span>();
    }
}, &lt;span class="number">10&lt;/span>);
 
```

在终端执行 phantomjs 命令，最后，可以看到登录后的页面截图

![](http://7tszky.com1.z0.glb.clouddn.com/FkC9rkEdkLGE1b-DAA_l0FyGo8-l)

## 延伸阅读

[CasperJS](http://casperjs.org/)：一个开源的导航脚本处理和高级测试工具


<!-- {% endraw %} - for jekyll -->