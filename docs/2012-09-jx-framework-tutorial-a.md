---
title: 腾讯 Web 前端 JX 框架入门教程 (一)
date: 2012-09-05
author: TAT.pel
source_link: http://www.alloyteam.com/2012/09/jx-framework-tutorial-a/
---

<!-- {% raw %} - for jekyll -->

# 什么是 JX 框架

JX 框架 (Javascript eXtension tools) 是模块化的非侵入式 Web 前端框架，适用于 Web Page 和 Web App 项目的开发，特别适合构建和组织大规模、工业级的 Web App，腾讯 WebQQ、腾讯 Q + 等产品都是采用 JX 框架开发，兼容目前所有主流浏览器。  
JX 框架具有以下特点：

-   微内核设计，内核可完全分离出来
-   原生对象零污染，随着 Web App 越来越复杂，对原生对象的零污染也体现的越来越重要了
-   模块封包，采用命名空间、闭包等方式建立了模块封包的体系，模块自身做了良好的架构分离，各个模块之间可以自由拼装组合
-   原子级封装，最大限度保留了代码的执行效率，接近原生的接口，降低了学习门槛
-   无缝集成各种 js 框架：jQuery, YUI, Mootools, Prototype.js，Mini，Sizzle，cssQuery，xpath，JSON 等等

# 第一个程序

没错，正如你所想的，我们要写的第一个程序是 “hello world”，通过这个程序，你可以对使用 JX 框架有个概括的了解。  

新建一个 html 文件，在里面加入以下代码：  

````html
<!DOCTYPE html>
<html>
<head>
  <title>Hello world</title>
</head>
<body>
  <input type="button" id="myButton" value="Click me" />
  
```html
<script type="text/javascript" src="http://pub.idqqimg.com/lib/jx/1.0.1/jx-uiless.js" charset="UTF-8"></script>
````

  

```html
<script type="text/javascript">
  Jx().$package("helloWorld",function(J){
    function handler(e){
      alert('Hello world!');
    }
    var el=J.dom.id('myButton');
    J.event.on(el,'click',handler);
  });
  </script>
```

</body>
</html>
```

然后保存，我们的 “hello world” 就完成了。[直接看 demo](http://www.alloyteam.com/wp-content/uploads/2012/08/helloworld.html)

# 逐行解释

```html
<input type="button" id="myButton" value="Click me" />;
```

我们加入了一个 id 为 “myButton” 的按钮（通过 id，我们可以很高效地取得一个元素的引用）。  

````html

```html
<script
    type="text/javascript"
    src="http://pub.idqqimg.com/lib/jx/1.0.1/jx-uiless.js"
    charset="UTF-8"
></script>
````

;

````

  
我们从腾讯的 CDN 引入了 JX 框架的代码，通过 charset 声明引入代码的编码是 UTF-8。我们也可以从自己的路径引入 JX，根据需要定制引入的模块，后文会阐述。  

```javascript
Jx().$package("helloWorld",function(J){...});
````

这一行我们做了两个事情，通过全局方法 “Jx ()” 获得了一个 Jx 对象，然后调用了 Jx 对象的 $package 方法。  
$package 方法的调用参数为：_$package(name, func)_  
第一个参数是命名空间，第二个参数是一个 function，其中的代码会在指定的命名空间中执行（即 func 的上下文对象 this 指向 name）。JX 支持以 “.” 分隔的多级命名空间，如果这个参数不传，只传一个 func 参数，则代码的上下文对象 this 指向 window。  
我们的 function 接收了参数 J，这是一个 Jx 对象，我们可以通过这个对象调用 Jx 的全部方法。  

    function handler(e){...}

我们定义了一个 handler 方法。  

```javascript
var el = J.dom.id("myButton");
```

我们调用了 Jx 的 dom 包的 id 方法，通过元素的 id 取得元素的引用，并赋值给 el。  

    J.event.on(el,'click',handler);

我们调用了 Jx 的 event 包的 on 方法，给 el 元素绑定了 click 事件，指定 el 被点击后执行 handler。  
到此，我们的 hello world 讲解完毕。

# 获得 JX

JX 的源码目前开源在 Github，可以从 [http://alloyteam.github.com/JX/#download](http://alloyteam.github.com/JX/#download "下载 JX") 获取。

下一篇：[JX 框架入门教程 (二)](http://www.alloyteam.com/2013/08/jx-framework-tutorial-b/ "JX 框架入门教程 (二)")


<!-- {% endraw %} - for jekyll -->