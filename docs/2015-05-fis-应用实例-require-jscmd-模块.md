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

```html
<!DOCTYPE html>
<html>
<head>
    <title>CMD to AMD</title>
</head>
<body>
 
<script type=<span class="string">"text/javascript"</span> src=<span class="string">"lib/require.min.js"</span>></script>
<script type=<span class="string">"text/javascript"</span>>
    <span class="keyword">require</span>([<span class="string">'modules/index'</span>], <span class="keyword">function</span>(mod){
        mod(<span class="string">'capser'</span>);
    });
</script>
</body>
</html>
 
```

接下来，我们看下 `index.js`。也很简单，加载依赖的模块 `modules/util`，接着暴露出本身模块，其实就是调用 `Utill` 模块的方法 deubg。

```html
<span class="keyword">var</span> Util = <span class="keyword">require</span>(<span class="string">'modules/util'</span>);
 
module.exports = <span class="keyword">function</span>(nick) {
    
    Util.debug(nick);
};
 
```

再看看 `uti.js`，不赘述。

```html
module.exports = {
    debug: <span class="keyword">function</span>(msg){
        alert(<span class="string">'Message is: '</span> + msg);
    }
};
 
```

如果换成熟悉的 AMD，`index.js` 应该是这样子的。那么思路就很清晰了。对 CMD 模块进行 `define` 包裹，同时将模块的依赖添加进去。

```html
defind([<span class="string">"modules/util"</span>], <span class="keyword">function</span>(Util){
 
    <span class="keyword">return</span> <span class="keyword">function</span>(msg){
        Util.debug(msg)
    };
});
 
```

作为一枚贴近前端实践的集成解决方案，FIS 早已看穿一切。下面进入实战编码环节。

## 实战：修改 fis-conf.js

首先，打开 `fis-conf.js`，加入如下配置。配置大致意思是：

1.  在 `postprocessor` 环节，针对 `js` 文件，调用 [fis-postprocessor-jswrapper](https://www.npmjs.com/package/fis-postprocessor-require-async) 进行处理。
2.  `postprocessor` 插件的配置看 `settings.postprocessor`，`type` 为 `AMD`，表示对模块进行 `AMD` 包裹。

```javascript
fis.config.merge({
    modules: {
        postprocessor: {
            js: [<span class="string">'jswrapper'</span>],
        },
    },
    settings: {
        postprocessor: {
            jswrapper: {
                type: <span class="string">'amd'</span>,
                wrapAll: <span class="keyword">false</span>,
            },
        },
    },
});
```

接着，添加 `roadmap.path` 配置。直接看注释，如果对配置不熟悉，可参考[官方文档](http://fis.baidu.com/docs/api/fis-conf.html#roadmap)。

```html
fis.config.merge({
    roadmap: {      
        path: [
            {
                reg : /^/(modules/.+).(js)$/i,   <span class="comment">// modules目录下的所有js文件</span>
                isMod : <span class="keyword">true</span>,  <span class="comment">// isMod为true，表示资源是模块资源，需要进行模块化包裹</span>
                id : <span class="string">'$1'</span>,  <span class="comment">// 这里这里！！将资源的id替换成 reg 第一个子表达式匹配到的字符串，比如 /modules/index.js，id则为 modules/index</span>
                release : <span class="string">'$&'</span>  <span class="comment">// 发布路径，跟当前路径是一样的，看正则。。</span>
            }           
        ]
    },
    modules: {
        postprocessor: {
            js: [<span class="string">'jswrapper'</span>]
        }
    },
    settings: {
        postprocessor : {
            jswrapper : {
                type: <span class="string">'amd'</span>,
                wrapAll: <span class="keyword">false</span>
            }
        }
    }
});
 
```

## 写在后面

本文简单介绍 CMD 到 AMD 的转换，距离实战还有很多事情要做，比如 `require.js` 的配置支持，打包部署等，这里也就抛个思路，感兴趣的童鞋可以进一步扩展。

文章: casperchen


<!-- {% endraw %} - for jekyll -->