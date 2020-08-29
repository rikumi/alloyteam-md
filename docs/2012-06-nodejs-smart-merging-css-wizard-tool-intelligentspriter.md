---
title: NodeJs 智能合并 CSS 精灵图工具 iSpriter
date: 2012-06-16
author: TAT.iAzrael
source_link: http://www.alloyteam.com/2012/06/nodejs-smart-merging-css-wizard-tool-intelligentspriter/
---

<!-- {% raw %} - for jekyll -->

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


<!-- {% endraw %} - for jekyll -->