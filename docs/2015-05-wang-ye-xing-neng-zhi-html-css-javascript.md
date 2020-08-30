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

1 图上可以看到，由于内嵌了 javascript，页面上减少了一个请求，导致 html 文档变大，消耗时间增多，但是 domComplete 时间提升的并不多。

* * *

**使用 async 的 javascript**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>test</title>
      <link rel="stylesheet" type="text/css" href="stylesheet.css" media="screen">
  </head>
  <body>
    <img src="download-button.png">
      <script async src="H5FullscreenPage.js" type ="text/javascript" ></script >
  </body>
</html>
```

[![6](http://www.alloyteam.com/wp-content/uploads/2015/05/6.png)](http://www.alloyteam.com/wp-content/uploads/2015/05/6.png)

1 可以看到 domComplete 时间被大大提前 javascript 也没有阻塞 css 和 body 里面 img 元素的并行下载。

2 使用 [async](http://www.w3school.com.cn/tags/att_script_async.asp) 标识的 script，浏览器将异步执行这中 script 不会阻塞正常的 dom 渲染，这时 html5 所支持的属性，另外 [defer](http://www.w3school.com.cn/tags/att_script_defer.asp) 也可以达到这种效果。

* * *

**head 里面 js 和 css 加载的关系**

**外联 js 在 css 前面**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>test</title>
      <script src="H5FullscreenPage.js" type ="text/javascript" ></script >
      <link rel="stylesheet" type="text/css" href="stylesheet.css" media="screen">
      <link rel="stylesheet" type="text/css" href="page-animation.css" media="screen">
  </head>
  <body>
    <img src="download-button.png">
  </body>
</html>
```

![](http://1.lvming6816077.sinaapp.com/testaa/xx1.png)

1 没有阻止 css 的并行加载但是影响了 body 里面 img 的并行加载

* * *

**外联 js 在 css 中间**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>test</title>
      <link rel="stylesheet" type="text/css" href="stylesheet.css" media="screen">
      <script src="H5FullscreenPage.js" type ="text/javascript" ></script >
      <link rel="stylesheet" type="text/css" href="page-animation.css" media="screen">
  </head>
  <body>
    <img src="download-button.png">
  </body>
</html>
```

![](http://1.lvming6816077.sinaapp.com/testaa/xx2.png)

1 影响了 css 的并行加载和 body 里面 img 的并行加载

* * *

**外联 js 在 css 最后**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>test</title>
      <link rel="stylesheet" type="text/css" href="stylesheet.css" media="screen">
      <link rel="stylesheet" type="text/css" href="page-animation.css" media="screen">
      <script src="H5FullscreenPage.js" type ="text/javascript" ></script >
  </head>
  <body>
    <img src="download-button.png">
  </body>
</html>
```

![](http://1.lvming6816077.sinaapp.com/testaa/xx3.png)

1 影响了 css 的并行加载和 body 里面 img 的并行加载

* * *

**内嵌 js 在 css 前面**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>test</title>
      <script type ="text/javascript" >
      	var f = 1;
          f++;
      </script >
      <link rel="stylesheet" type="text/css" href="stylesheet.css" media="screen">
      <link rel="stylesheet" type="text/css" href="page-animation.css" media="screen">
  </head>
  <body>
    <img src="download-button.png">
  </body>
</html>
```

![](http://1.lvming6816077.sinaapp.com/testaa/xx4.png)

1 没有影响 css 的并行加载也没有影响 body 里面 img 的并行加载

* * *

**内嵌 js 在 css 中间**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>test</title>
      <link rel="stylesheet" type="text/css" href="stylesheet.css" media="screen">
      <script type ="text/javascript" >
      	var f = 1;
          f++;
      </script >
      <link rel="stylesheet" type="text/css" href="page-animation.css" media="screen">
  </head>
  <body>
    <img src="download-button.png">
  </body>
</html>
```

![](http://1.lvming6816077.sinaapp.com/testaa/xx5.png)

1 影响了 css 的并行加载没有英雄 body 里面 img 的并行加载

* * *

**内嵌 js 在 css 最后**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>test</title>
      <link rel="stylesheet" type="text/css" href="stylesheet.css" media="screen">
      <link rel="stylesheet" type="text/css" href="page-animation.css" media="screen">
      <script type ="text/javascript" >
      	var f = 1;
          f++;
      </script >
  </head>
  <body>
    <img src="download-button.png">
  </body>
</html>
```

![](http://1.lvming6816077.sinaapp.com/testaa/xx6.png)

1 影响了 css 和 body 里面 img 的并行加载。

* * *

**综上所述：**

当浏览器从服务器接收到了 HTML 文档，并把 HTML 在内存中转换成 DOM 树，在转换的过程中如果发现某个节点 (node) 上引用了 CSS 或者 IMAGE，就会再发 1 个 request 去请求 CSS 或 image, 然后继续执行下面的转换，而不需要等待 request 的返回，当 request 返回 后，只需要把返回的内容放入到 DOM 树中对应的位置就 OK。但当引用了 JS 的时候，浏览器发送 1 个 js request 就会一直等待该 request 的返回。因为浏览器需要 1 个稳定的 DOM 树结构，而 JS 中很有可能有代码直接改变了 DOM 树结构，浏览器为了防止出现 JS 修改 DOM 树，需要重新构建 DOM 树的情况，所以 就会阻塞其他的下载和呈现.

这里的结论：

1 在 head 里面尽量不要引入 javascript.

2 如果要在 head 引入 js 尽量将 js 内嵌.

3 把内嵌 js 放在所有 css 的前面.

**后记**

1 本次的测试页面 <http://1.lvming6816077.sinaapp.com/testaa/demo.html>

2 测试所用浏览器 chrome

3 参考资料：<http://www.zhihu.com/question/20357435/answer/14878543>

<http://www.haorooms.com/post/web_xnyh_jscss>

4 如果有哪里说的不清楚或者错误的地方，欢迎留言反馈。


<!-- {% endraw %} - for jekyll -->