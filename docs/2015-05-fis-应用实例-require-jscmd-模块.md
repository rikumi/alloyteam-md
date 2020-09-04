---
title: FIS 应用实例 - require.js+CMD 模块
date: 2015-05-13
author: TAT.casperchen
source_link: http://www.alloyteam.com/2015/05/fis%e5%ba%94%e7%94%a8%e5%ae%9e%e4%be%8b-require-jscmd%e6%a8%a1%e5%9d%97/
---

<!-- {% raw %} - for jekyll -->

前面文章讲了 FIS 的源码实现细节，这篇文章偏实战一些，给出 `FIS` 跟 `require.js` 结合的简单例子。

## FIS 编译流程

如果已熟悉了 `FIS` 的编译设计，可以跳过这一节，直接进入下一小结。FIS 的编译主要有三步：

> 命令解析–> 资源编译–> 资源部署

1.  **资源编译**：FIS 将文件资源抽象成 `File` 实例，该实例上有文件资源类型、id、内容、部署路径等的属性。对于文件的编译，实际上都是对 `File` 实例进行操作，比如修改资源的部署路径等（内存里操作）。
2.  **资源部署**：根据 `File` 实例的属性，进行实际的部署动作（磁盘写操作）。

FIS 的这套编译体系，使得基于 FIS 的扩展相对比较容易。在扩展的同时，还可以确保编译的高性能。针对**资源编译环节**的扩展，除非是设计不合理，不然一般情况下不会导致性能的急剧降低。

## getting started

啰嗦的讲了一大通，下面来点半干货。喜欢 `require.js`，但又喜欢用 `CMD` 编写模块的朋友有福了，下面会简单介绍如何整合 `require.js` 与 `FIS`。

demo 已经放在 github，下载请[猛戳](https://github.com/chyingp/blog/tree/master/demo/2015.05.13-fis-cmd-to-amd)。

首先看下项目结构。`modules` 目录里的是模块化的资源，`lib` 目录里的是非模块化资源。其中：

1.  index.html 依赖 require.js 来实现模块化管理
2.  index.js 模块依赖 util.js 模块
3.  index.js、util.js 均采用 CMD 规范

也就是说，本例子主要实现的，就是 CMD 到 AMD 的转换。

```html
.
├── fis-conf.js
├── index.html
├── lib
│   └── <span class="keyword">require</span>.min.js
└── modules
    ├── index.js
    └── util.js
 
```

## 资源概览

首先，我们看下 `index.html`，引用了 `require.min.js`，并加载了 `modules/index` 模块，跟着执行回调，没了。

````html
<!DOCTYPE html>
<html>
<head>
    <title>CMD to AMD</title>
</head>
<body>
 

```html
<script type=<span class="string">"text/javascript"</span> src=<span class="string">"lib/require.min.js"</span>></script>
````

```html
<script type=<span class="string">"text/javascript"</span>>
    <span class="keyword">require</span>([<span class="string">'modules/index'</span>], <span class="keyword">function</span>(mod){
        mod(<span class="string">'capser'</span>);
    });
</script>
```

</body>
</html>
 
```

接下来，我们看下 `index.js`。也很简单，加载依赖的模块 `modules/util`，接着暴露出本身模块，其实就是调用 `Utill` 模块的方法 deubg。


<!-- {% endraw %} - for jekyll -->