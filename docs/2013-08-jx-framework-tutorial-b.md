---
title: 腾讯 Web 前端 JX 框架入门教程 (二)
date: 2013-08-31
author: TAT.pel
source_link: http://www.alloyteam.com/2013/08/jx-framework-tutorial-b/
---

<!-- {% raw %} - for jekyll -->

# Ajax 和模版

当你需要不刷新页面而加载更多数据，ajax 是个不错的选择，怎么把 ajax 异步加载的数据优雅地拼接起来，就需要用到模版引擎了。复杂的交互都离不开 ajax 和模版，下面介绍如何在 JX 中使用 ajax 和模版。  
处理 ajax，我们主要用到 http 包的 ajax 方法：_J.http.ajax(uri, option)_  
第一个参数是 ajax 请求的 url，第二个参数是一个包括请求选项的 Object。  
示例代码  

```javascript
J.http.ajax("vcard.json", {
    method: "GET",
    data: null,
    arguments: null,
    onSuccess: function () {},
    onError: function () {},
    onComplete: function () {},
    onTimeout: function () {},
    isAsync: true,
    timeout: 30000,
    contentType: "utf-8",
});
```

处理 js 模版，我们主要用到 string 包的 template 方法：_J.string.template(string, data)_  
第一个参数是 “模版字符串” 或 “模版 id”，第二个参数是模版填充的数据。  
下面我们通过一个程序演示其用法。

# 第二个程序

这是一个展示名片的程序，由于用到 ajax，不支持 file 协议，你需要一个服务器（能用 http 协议访问你的网页即可）。  
首先，新建一个 html 文件，在里面加入以下代码：  

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>VCard</title>
  <style type="text/css">
    .card{ width:240px; height:160px; border:1px solid #999; background:#fff; overflow:hidden; }
    .avatar{ width:50px; height:50px; margin:18px; float:left; overflow:hidden; }
    .avatar img{ max-width:50px; max-height:50px; }
    
```


<!-- {% endraw %} - for jekyll -->