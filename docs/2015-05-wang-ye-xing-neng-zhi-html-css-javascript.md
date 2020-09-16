---
title: 网页性能之 HTML,CSS,JavaScript
date: 2015-05-04
author: TAT.tennylv
source_link: http://www.alloyteam.com/2015/05/wang-ye-xing-neng-zhi-html-css-javascript/
---

<!-- {% raw %} - for jekyll -->

**前言**

html css javascript 可以算是前端必须掌握的东西了，但是我们的浏览器是怎样解析这些东西的呢 我们如何处理 html css javascript 这些东西来让我们的网页更加合理，在我这里做了一些实验，总结起来给大家看看。

**最简单的页面**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>test</title>
  </head>
  <body>
    <img src="download-button.png">
  </body>
</html>
```

我们打开 chrome 的控制台查看 timeline

[![1](http://www.alloyteam.com/wp-content/uploads/2015/04/11.png)](http://www.alloyteam.com/wp-content/uploads/2015/04/11.png)

由上图 可得结论

1 图中蓝色透明条标识浏览器从发起请求到接收到服务器返回第一个字节的时间，时间还是挺长的，而蓝色实体条则为真正的 html 页面下载的时间 还是很短的。

2 图中红框内的这部分时间则表示浏览器从下载完成 html 之后开始构建 dom，当发现一个 image 标签时所花费的时间，由此可见 dom 是顺序执行的，当发现 image 时便立即发起请求，而紫色透明条则是 image 发起请求时在网络传输时所消耗的时间。

3 图中 timeline 蓝色竖线所处的时间为 domComplete 时间，红色竖线为 dom 的 onload 时间，由此可见两种事件的差异。而浏览器构建 dom 树所花费的时间可以算出即 domComplete 时间 减去 html 下载完成后的时间大概 80ms。

* * *

**含有 css 的页面**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>test</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css" media="screen">
  </head>
  <body>
    <img src="download-button.png">
  </body>
</html>
```

我们打开 chrome 的控制台查看 timeline

[![2](http://www.alloyteam.com/wp-content/uploads/2015/04/2.png)](http://www.alloyteam.com/wp-content/uploads/2015/04/2.png)

1 在添加了外部引入 css 之后，并没有发现什么异常，但是有一点指的注意，也就是红色竖线和蓝色竖线挨得更进了，这表明 domComplete 时间必须等待 css 解析完成，也就是构建 dom 树必须等待 css 解析完成，这也就解释了下图

[![3](http://www.alloyteam.com/wp-content/uploads/2015/04/3.png)](http://www.alloyteam.com/wp-content/uploads/2015/04/3.png)

* * *

**含有 javascript 和 css 的页面**

````html
<!DOCTYPE html>
<html>
  <head>
    <title>test</title>
      <link rel="stylesheet" type="text/css" href="stylesheet.css" media="screen">
  </head>
  <body>
    <img src="download-button.png">
  
```html
<script type="text/javascript" src="H5FullscreenPage.js"></script>
````

  </body>

</html>
```

我们打开 chrome 的控制台查看 timeline

[![4](http://www.alloyteam.com/wp-content/uploads/2015/04/4.png)](http://www.alloyteam.com/wp-content/uploads/2015/04/4.png)

1 图上显示在引入外部的 js 文件之后 domComplete 时间又被延后了，结合上面的 renderTree，由于 javascript 代码可能会更改 css 属性或者是 dom 结构，所以在形成 renderTree 之前必须等待 javascript 解析完成才能接着构建 renderTree。

2 将 javascript 放在 head 内和 body 底部的区别也在于此，放在 head 里面，由于浏览器发现 head 里面有 javascript 标签就会暂时停止其他渲染行为，等待 javascript 下载并执行完成才能接着往下渲染，而这个时候由于在 head 里面这个时候页面是白的，如果将 javascript 放在页面底部，renderTree 已经完成大部分，所以此时页面有内容呈现，即使遇到 javascript 阻塞渲染，也不会有白屏出现。

* * *

**内嵌 javascript 的页面**

[![5](http://www.alloyteam.com/wp-content/uploads/2015/04/51.png)](http://www.alloyteam.com/wp-content/uploads/2015/04/51.png)

1 图上可以看到，由于内嵌了 javascript，页面上减少了一个请求，导致 html 文档变大�


<!-- {% endraw %} - for jekyll -->