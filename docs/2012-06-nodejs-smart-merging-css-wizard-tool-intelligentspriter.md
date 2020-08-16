---
title: NodeJs 智能合并 CSS 精灵图工具 iSpriter
date: 2012-06-16
author: TAT.iAzrael
source_link: http://www.alloyteam.com/2012/06/nodejs-smart-merging-css-wizard-tool-intelligentspriter/
---

## 一、引子

根据雅虎的网站优化准则，合并页面用到的图片，可以减少加载时发起的 http 请求数目，可以加速页面加载。具体能提速多少，本人没测试过，也就不好说了。

话说这排手上的项目里用到的图片都怎么合并，并不是不想合并，而是一个个图片去拼实在是太累了啊。另外桂总做的 [autosprite](https://github.com/rehorn/autosprite) 又还没成型，未能支持旧有项目；自己做的 [AutoSprites](https://github.com/iazrael/AutoSprites) 也是一个烂摊子 ——java 写脚本功能的代码真不是一般的痛苦啊；至于炜哥的 [GoPng](http://www.alloyteam.com/2012/05/gopng-sprite-figure-synthesis-tool-another-html5-app/) 在线合图工具，说实话，这类需要人工定位图片的工具，我着实不喜欢。还是那句话，我可是个程序员呐，这种机械化无趣的工作就该交给电脑来完成，不然电脑是拿来干嘛的？

## 二、所谓智能

回到主题，智能合并 CSS 精灵图，何谓智能？对我来说是以下三点：

1.  已有的项目基本不用修改即可使用该工具；
2.  新项目还是能怎么爽怎么写，使用注释标注神马的一边去；
3.  图片定位，css 文件修改神马的都不用管。

嗯，综上所述，加上项目发布了，该优化性能了，今天花了一天把 AutoSprites 的烂摊子收拾了下，用 NodeJs 整了个 [iSpriter](https://github.com/iazrael/ispriter)，有点出乎我的预料的快…… 是不是反证了 java 的开发效率慢？

## 三、特色功能

目前基本实现了原有项目不用修改的需求，css 写法、图片定位、css 文件修改都不用 care，写好配置文件之后就可以一劳永逸。

所支持的 css 写法如下：

1.  普通的 css 写法：  

    ```css
    div{
        background: url(../images/tips_icons.png) ;
    }
    ```

    \\====>  

    ```css
    div{
        background: url(../images/sprite_1.png) -48px -48px;
    }
    ```
2.  文艺的 css 写法：  

    ```css
    div{
        background: url(../images/tips_icons.png) -42px 0;
    }
    ```

    \\====>  

    ```css
    div{
       background: url(../images/sprite_1.png) -48px -48px;
    }
    ```
3.  二逼的 css 写法：  

    ```css
    div{
       background-image: url(../images/tips_icons.png);
       background-position: -42px 0;
    }
    ```

    \\====>  

    ```css
    div{
       background: url(../images/sprite_1.png) -48px -48px;
    }
    ```
4.  二逼 est 的 css 写法：  

    ```css
    div{
        background-image: url(../images/tips_icons.png);
        background-color: #fff;
        background-position: 0 -40px;
        background-repeat: no-repeat;
        background-origin: border-box;
        background-clip: content-box;
    }
    ```

    \\====>  

    ```css
    div{
        background: #fff url(../images/sprite_1.png) -48px -48px no-repeat border-box content-box;
    }
    ```

## 四、实现原理

该脚本使用了使用 nodejs 实现，依赖 [CSSOM](https://github.com/NV/CSSOM)、[node-canvas](https://github.com/learnboost/node-canvas) 两个模块，排列图片的算法选用了 [bin-packing](https://github.com/jakesgordon/bin-packing) 算法，后续支持选择其他算法。具体实现代码就不展示了，请移步到 github（<https://github.com/iazrael/ispriter>）查看。这里看下主要的执行步骤，代码写的比较块，方法名都是随便想了个差不多意思的，反正能运行就行了，对不对？哈哈 ^\_^

```javascript
var main = function () {
    var //...
        configFile = process.argv[2]; //1.读取配置文件
    config = readConfig(configFile); //2.读取所有css文件， readFiles方法已经把不合规定的文件过滤了
    cssFileNameList = readFiles(config.cssRoot); //...
    for (var i = 0, fileName; (fileName = cssFileNameList[i]); i++) {
        cssContent = readFile(config.cssRoot + fileName); //3.用cssom.parse把cssText转换成js对象
        styleSheet = parseCssToStyleSheet(cssContent); //4.把需要合并的图片url和cssRule收集起来
        imageList = collectCSSRulesAndImages(styleSheet); //... //5.读取图片文件以及其大小
        readImages(imageList); //6.使用bin-packing算法计算图片的位置
        positionResult = positionImages(imageList); //... //7.输出合并后的图片 sprite，并修改cssRule的background属性
        drawImageAndPositionBackground(
            config.cssOutput,
            spriteName,
            canvasWidth,
            canvasHeight,
            imageList
        ); //... //8.到最后了，输出修改后的css文件
        writeFile(newFileName, styleSheet);
    }
};
```

省略了些无关紧要的 abc，主要步骤就是上面的 8 步了（天龙八部～～哈哈）。

## 五、使用方法

1.  把源代码拷下来（需要先安装 [CSSOM](https://github.com/NV/CSSOM) 和 [node-canvas](https://github.com/learnboost/node-canvas)）：  

        git clone https://github.com/iazrael/ispriter.git
2.  拷贝 src 下面的内容到项目目录，最好能改个名字如：spriter；
3.  把 spriter 下的 config.example.json 拷贝出来，改成 config.json，并修改里面的配置；
4.  在项目目录运行：  

        node ./spriter/spriter.js config.json
5.  嗯，可以执行后续的编译脚本了，就这么简单～

可能这里改的比较多一点的就是 config.json 了，其实里面也没几个参数：

    {
        "cssRoot": "./../test/css/",//需要合并图片的css所在目录
        "format": "png",//要合并的图片格式，可以这样写："png,jpg"
        "algorithm": "growingpacker",//图片排列算法，目前只有这个一个...
        "cssOutput": "./../test/output/css/",//css文件的输出目录
        "imageOutput": "../images/",//图片的输出目录，相对于cssOutput
        "outputPrefix": "sprite_",//合并后图片的名字前缀，其余字段用自增方式
        "outputFormat": "png"//合并后的图片格式
    }

如何？基本不用怎么改吧，啦啦啦～

## 六、不足与后续优化

总的来说，基本上没什么大问题，只是 nodejs 的环境在 windows 下比较难搞，主要就是 node-canvas 的安装。cssom 是纯 js 实现的，因此可以放到项目目录；node-canvas 就得想想办法了。或许搞个 Web 在线版的法子不错。

另外参数的配置可能还不够灵活，主要是自己用，没相应的需求难免有遗漏。还有参数名字也得斟酌下，免得歧义。

哦，漏了几点：

1.  图片大小是自增的，不支持设置；
2.  不支持使用了 background-repeat：repeat-x or repeat-y 的图片分类合并；
3.  这个年代还有下载源代码来执行这么二逼的事，要想法子打个包一步就位；

这么一写，貌似还缺点还不少，呃，汗 - -||。不过在够用的基础上，后面有时间在优化啦～～

欢迎踊跃提 bug～～

\---------------- 2012-6-17 update ------------------------

已经把所有依赖都打包到项目中，并已发到 npm（<http://search.npmjs.org/#/ispriter>）

可以直接用下面的命令安装啦。

    npm install ispriter

使用方法：

```javascript
var spriter = require("ispriter");
spriter.merge(configFileName);
```

BTW：isptriter 已经更新啦，请转向这里继续了解：[【更新】iSpriter – 智能合并 CSS 精灵图](http://www.alloyteam.com/2012/09/update-ispriter-smart-merging-css-sprite/ "【更新】iSpriter – 智能合并 CSS 精灵图")。