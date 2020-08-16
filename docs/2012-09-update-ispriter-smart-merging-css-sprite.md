---
title: 【更新】iSpriter – 智能合并 CSS 精灵图
date: 2012-09-30
author: TAT.iAzrael
source_link: http://www.alloyteam.com/2012/09/update-ispriter-smart-merging-css-sprite/
---

<!-- {% raw %} - for jekyll -->

号外号外，iSpriter 更新啦！

什么？你不知道 iSpriter 是什么？那你太 out 啦，必须先看看[这个文章](http://www.alloyteam.com/2012/06/nodejs-smart-merging-css-wizard-tool-intelligentspriter/ "NodeJs 智能合并 CSS 精灵图工具 iSpriter")了。简单的一句话介绍：基于 NodeJs 的开源 CSS 精灵图合并工具，不用改变原有的 css 编写方式，就能自动帮你解决 css sprite 的合并问题。目前源码托管在 github（[https://github.com/iazrael/ispriter](https://github.com/iazrael/ispriter "智能合并 CSS 精灵图")），欢迎各位同学来一起完善。

由于最初写的时候不怎么注意代码自量，写得比较搓。在应用在几个项目之后，修复了一些 bug，发现再加新功能比较困难。最近终于下决心重构了下，并在重构的基础上增加了一些新特性。

目前 iSpriter 的特性有：

1.  智能提取 background 的 url 和 position 等信息
2.  智能判断使用了 background-position（暂时只支持使用 px 为单位）定位的图片并重新定位
3.  兼容已经合并了的图片，并重新定位
4.  多个 css 文件合并时，排除并重用已经合并的图片
5.  智能设置被合并图片的宽高
6.  **支持设定合并后图片的最大大小**【新】
7.  支持设置合并后的图片间距【新】
8.  跳过 background-position 是 right、center、bottom 的图片【新】
9.  跳过显式的设置平铺方式为 repreat 的图片【新】
10. 跳过设置了 background-size 的图片【新】

最新版本支持限制合并后的图片大小啦。比如限制合并后的图片最大 60KB，则可以把原本合并成一张 100KB 的图拆成两张。这样老大检查的时候就不会抓住你问：嗯？为什么这张图超过了 60KB 了？检讨检讨！…… 哈哈，所以这绝对是个延年益寿的新功能 ^\_^。

## 使用方法

在命令行输入以下命令即可安装 /  更新：

    npm install ispriter

配置文件也进行了更新，参数更加清晰了：

```javascript
{
    "algorithm": "growingpacker",//optional 目前只有 growingpacker
    "input": {
        "cssRoot": "./../test/css/", //required
        "imageRoot": "",//optional 默认 cssRoot
        "format": "png"//optional
    },
    "output": {
        "cssRoot": "./../test/sprite_output/css/",//required
        "imageRoot": "../images/",//optional 相对于 cssRoot 的路径, 默认 "./image/", 最终会变成合并后的的图片路径写在css文件中
        "maxSize": 60,//optional 图片容量的最大大小, 单位 KB, 默认 0
        "margin": 5,//optional 合成之后, 图片间的空隙, 默认 0
        "prefix": "sprite_",//optional 
        "format": "png"//optional 输出的图片格式
    }
}
```

大部分参数都可以省略，最简单的配置只有两项：

    {
        "input":  "./../test/css/", // input cssRoot
        "output": "./../test/sprite_output/css/" // output cssRoot
    }

**【重要】**新的配置参数跟旧有的不兼容，需要进行修改。不过 config.example.json 的注释已经很清晰了，就不再细说了。

之后的调用方式就跟以前一样了，可以新建 NodeJs 文件调用：

```javascript
var spriter = require("ispriter");
var configFile = "../src/config.example.json";
spriter.merge(configFile);
```

或者集成到你的编译脚本，一句命令行调用搞定：

    node -e "require('ispriter').merge('../src/config.example.json')"

## 运行环境搭建

由于 iSpriter 使用了 node-canvas，而 node-canvas 依赖了 [Cairo](http://cairographics.org/) 图形库，对初学者来说，安装 Cairo 和 node-canvas 是挺痛苦的。

不过人生就是贵在折腾啦，经亲身体验，在三大平台都能正确的安装上并使用 canvas 了。另外，node-canvas 的 wiki 也给出了安装方法，[详见这里](https://github.com/LearnBoost/node-canvas/wiki)。

其中：ubuntu /os x 的安装是简单的不能再简单的了，完全可以写个 shell 自动安装啊有木有；windows 的安装步骤有点多，但也是能装上并跑起来的（有些机器编译 canvas 还是出错，原因不明）。

安装好 canvas ，其他问题都不在话下了，尽情的使用 iSpriter 提高你的工作效率吧～～

—————- 2013-8-15 update ————————

感谢 [node-pngjs](https://github.com/niegowski/node-pngjs) 的作者，现在 ispriter 把 node-canvas 替换成了跟平台无关的 node-pngjs，再也不用费劲心机的安装 node-canvas 啦！

鼓掌，哗啦啦 O (∩\_∩) O 哈哈～


<!-- {% endraw %} - for jekyll -->