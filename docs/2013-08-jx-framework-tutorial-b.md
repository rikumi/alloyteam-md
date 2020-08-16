---
title: 腾讯 Web 前端 JX 框架入门教程 (二)
date: 2013-08-31
author: TAT.pel
source_link: http://www.alloyteam.com/2013/08/jx-framework-tutorial-b/
---

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

````html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>VCard</title>
  <style type="text/css">
    .card{ width:240px; height:160px; border:1px solid #999; background:#fff; overflow:hidden; }
    .avatar{ width:50px; height:50px; margin:18px; float:left; overflow:hidden; }
    .avatar img{ max-width:50px; max-height:50px; }
    .card p{ font:14px/25px "Microsoft Yahei", Arial, Simsun; margin:12px 18px; color:#000; }
    .detail{ color:#ccc; word-break:break-all; }
  </style>
</head>
<body>
  <div id="wrap">Loading...</div>
  
```html
<script type="text/javascript" src="http://pub.idqqimg.com/lib/jx/1.0.1/jx-uiless.js" charset="UTF-8"></script>
````

  

```html
<script type="text/javascript" src="vcard.js"></script>
```

  

```html
<script id="vcardTmpl" type="text/template">
  <div class="card">
    <div class="avatar"><img src="<%=avatar%>" /></div>
    <p>昵称：<%=nick%></p>
    <p>性别：<%=sex=='M'?'男':sex=='F'?'女':'其他'%></p>
    <p class="detail">简介：<%=detail || '这个家伙很懒，什么也没有留下'%></p>
  </div>
  </script>
```

</body>
</html>
```

然后，新建一个 vcard.js 文件，在里面加入以下代码：  

```javascript
Jx().$package("vCard", function (J) {
    function callback(data) {
        if (data.status == 200 && data.responseJSON) {
            var wrapEl = J.dom.id("wrap");
            wrapEl.innerHTML = J.string.template(
                "vcardTmpl",
                data.responseJSON
            );
        } else {
            alert("出错了");
        }
    }
    J.http.ajax("vcard.json", {
        data: {
            id: 12345,
        },
        onSuccess: callback,
        onError: callback,
        onTimeout: callback,
        type: "json",
    });
});
```

好了，我们还差数据，新建一个 vcard.json 文件，在里面加入以下代码：  

    {
      "id":12345,
      "avatar":"http://0.gravatar.com/avatar/ef1f0d589d3f5c05b623a9786ce792be?s=50&d=wavatar&r=G",
      "nick":"Sheran",
      "sex":"F",
      "detail":"真实，大方，豁达~~~~~~~"
    }

现在把以上三个文件放到你的服务器上，就可以看效果了。你也可以猛击这里[直接看 demo](http://www.alloyteam.com/wp-content/uploads/2012/08/vcard.html)

# 代码解释

```html
<div id="wrap">Loading...</div>;
```

我们加入了一个容器  

````html

```html
<script id="vcardTmpl" type="text/template">
<div class="card">
<div class="avatar"><img src="<%=avatar%>" /></div>
<p>昵称：<%=nick%></p>
<p>性别：<%=sex=='M'?'男':sex=='F'?'女':'其他'%></p>
<p class="detail">简介：<%=detail || '这个家伙很懒，什么也没有留下'%></p>
</div>
</script>
````

````

  
这是我们的模版，type 为 “text/template” 的 script 标签不会被浏览器显示或者执行，我们可以通过 id 引用它，并取得它的 innerHTML。在模版里，我们用标识 js 代码，用标识变量，外的是 html 代码，我们甚至可以在模版里写表达式写 for 语句等。  

```javascript
J.http.ajax("vcard.json", {
    data: {
        id: 12345,
    },
    onSuccess: callback,
    onError: callback,
    onTimeout: callback,
    type: "json",
});
````

通过 ajax 请求了 [vcard.json?id=12345](http://www.alloyteam.com/wp-content/uploads/2012/08/vcard.txt?id=12345)，默认使用 GET 方法，指定 callback 为回调方法。  

```javascript
var wrapEl = J.dom.id("wrap");
wrapEl.innerHTML = J.string.template("vcardTmpl", data.responseJSON);
```

我们把模版的 id 和 ajax 请求返回的数据传给模版引擎，把渲染结果填到 wrap。

# 温馨提示

设置 innerHTML 需要注意对变量进行转义，避免 xss 和排版错乱，JX 的 string 包提供了几个常用的转义方法，可以直接作为参数传给模版引擎使用，例如：

    J.string.template('Hello <%=html(nick)%>',{
      nick:'LiLei<(▰˘◡˘▰)>',
      html:J.string.encodeHtmlSimple
    });

更多 JX 框架活生生的 Demo，请猛戳 [JX Live Demo](http://alloyteam.github.io/JXLiveDemo/ "JX Live Demo")。