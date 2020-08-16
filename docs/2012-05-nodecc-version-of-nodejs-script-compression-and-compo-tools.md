---
title: 【NodeCC】NodeJs 开发的脚本压缩和 combo 工具
date: 2012-05-28
author: TAT.岑安
source_link: http://www.alloyteam.com/2012/05/nodecc-version-of-nodejs-script-compression-and-compo-tools/
---

对于 Web 前端的开发而言，为了降低文件大小，js 文件和 css 文件的压缩和组合几乎是默认的规矩。

我们利用 YUI Compressor 和 google Compiler 可以很容易的完成文件的压缩。 甚至 yui compressor 本身都已经支持 多文件的批量压缩。

但是，为了更好的处理这些机械化的事情，我们通常还是需要脚本来辅助，让这些工作可以更好的自动化，可配置化。

网上有很多类似的脚本工具，或者有的也已经编译成了可视化的工具来使用。

我自己以前也写过 python 版本的，也用过同事写的类似的脚本，基本也都是 python 版本的。鉴于大多数前端的攻城师们对 js 更为熟悉，所以，这里也提供一个简易的 nodejs 版本的。下午花了 3 个小时写的。

**NodeCC --> Node Compressor and Comboer**

代码很简单，基本就是读文件，写文件，调用系统 jar 命令 使用 yuicompressor 压缩文件。  
源码托管在：[github.com/hongru/nodeCC](https://github.com/hongru/nodeCC) 上，100 行左右。

**编码中需要注意的几个地方：**

-   nodejs 中 fileSystem buffer 的概念，简单的可以理解成文本数据流，所以，为了得到我们常见的文本，注意 readFile 后 toString 的使用。
-   生成新文件时，路径是否存在的判断，如果不存在，生成指定目录时，由于 node 本身的 mkdir 不支持多级目录，所以这里需要自己来处理多级目录的递归生成。  
    有两种方式，一种是利用 child_process 创建一个子进程调用系统命令 mkdir -p.  
    另一种就是分析路径，一级一级递归创建目录。代码参考 <https://gist.github.com/2817910>  

    ```javascript
    /* mkdir -p for node */
    var fs = require("fs"),
        path = require("path");
    function mkdirpSync(pathes, mode) {
        mode = mode || 0777;
        var dirs = pathes.trim().split("/");
        if (dirs[0] == ".") {
            // ./aaa
            dirs.shift();
        }
        if (dirs[0] == "..") {
            // ../aaa
            dirs.splice(0, 2, dirs[0] + "/" + dirs[1]);
        }
        dirs.length && mkdir(dirs.shift()); // mkdir
        function mkdir(d) {
            if (!path.existsSync(d)) {
                fs.mkdirSync(d, mode);
            }
            dirs.length && mkdir(d + "/" + dirs.shift());
        }
    }
    // eg
    //mkdirpSync('hongru/me');
    ```
-   通过 child_process 的 spawn 来调用系统命令，比如 ls， java 等。然后通过 stdout 和 stderr 来监听获得 命令所返回的 log 或者 error 信息。

【使用方法】

1.  当然，因为是 nodejs 版本的，所以自然需要安装 nodejs，官方有提供详细说明
2.  因为用了 jar 包 yuicompressor.jar， 所以，需要安装 JAVA 的 sdk，安装过程也很简单，不会的搜一下即可。
3.  最后，关于 config.json 文件的配置，很简单，都是两个字段，“source” 和 “target”，source 代表源路径文件，target 表示压缩之后生成的文件路径。  
    支持目录级别。  
    另外，如果 source 字段为一个数组的话，会将这个数组里面的文件按照顺序合并，然后压缩生成到指定 target 的路径。所以，config.json 看起来会像是这个样子：  

    ```javascript
    {
        "css-test": {
            "source": "test/css/",
            "target": "test/public/css/"
        },
        "normal-file-compress": {
            "source": "test/test.js",
            "target": "test/test.min.js"
        },
        "normal-dir-compress": {
            "source": "test/js/",
            "target": "test/public/js/"
        },
        "compress-and-merge": {
            "source": [
                "test/js/a.js",
                "test/js/b.js"
            ],
            "target": "test/public/js/ab.js"
        }
    }
    ```
4.  将带有 yuicompressor.jar 的 tools/ , 主脚本 nodecc.js, 以及配置好的 config.json 放置在同一目录下，然后执行  

        node nodecc.js

    即可。

好了，工具很简单，代码也很简单，希望能给有需要的同学提供一点点帮助 🙂