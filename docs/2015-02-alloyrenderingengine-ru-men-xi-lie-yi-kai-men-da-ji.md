---
title: AlloyRenderingEngine 开门大吉
date: 2015-02-28
author: TAT.dnt
source_link: http://www.alloyteam.com/2015/02/alloyrenderingengine-ru-men-xi-lie-yi-kai-men-da-ji/
---

## 快速入口

不读文章可以直接拐向这里：

github:<https://github.com/AlloyTeam/AlloyGameEngine>

## 开门大吉

每次输入 kmdj 输入法自动提示【开门大吉】，输入 kmdjs 提示【开幕倒计时】，所以说 kmdjs 不仅仅是满满的血腥味  
(kill all module define lib/framework, kill amd and cmd)，还有着美好的寓意。  
一定要提 kmdjs 是因为 AlloyRenderingEngine 是基于 kmdjs 进行模块化开发（其实使用 kmdjs 已经没有模块的概念了），只要 class 和 namespace。  
kmdjs 的核心的核心就是 ｛｝，class 全部挂在 ｛｝ 上。｛｝ 属于 namespace。所以很自然而然得轻松实现循环依赖。当然 kmdjs 还有很多优点，如：

-   支持依赖可视
-   支持循环依赖
-   支持命名重复
-   支持压缩打包
-   支持代码美化
-   支持远程加载
-   支持延迟加载
-   支持模块共享
-   支持平铺依赖
-   支持断点调试
-   支持独立打包
-   支持一键下载

github:<https://github.com/kmdjs/kmdjs>

## 再造轮子

看过一些 flash 团队的 html5 开源项目，也读了读很多 opengl 转 webgl 的工程师的游戏引擎教程，他们视野够广，图形方面经验也很丰富，  
但是项目的组织架构千奇百怪，一个人一个花样，一个团队一个花样。所以，kmdjs 要出手了（当然也可以认为又多了一个新花样，  
当至少是我觉得很满意、很清晰简洁的花样），去组织每一行没有归宿感的 js 代码。

## 目录结构

先看顶级目录结构

![are](https://raw.githubusercontent.com/AlloyTeam/AlloyRenderingEngine/gh-pages/asset/ls1-1.png)

再看 build 里的目录结构

![are](https://raw.githubusercontent.com/AlloyTeam/AlloyRenderingEngine/gh-pages/asset/ls1-2.png)

其中 main.js：

```c
kmdjs.config({
    name: "BuildARE",
    baseUrl: "../src",
    classes: [
          { name: "ARE.DisplayObject", url: "are/display" },
          { name: "ARE.Bitmap", url: "are/display" },
          { name: "ARE.Sprite", url: "are/display" },
          { name: "ARE.Stage", url: "are/display" },
          { name: "ARE.Shape", url: "are/display" },
          { name: "ARE.Container", url: "are/display" },
          { name: "ARE.Txt", url: "are/display" },
          { name: "ARE.Matrix2D", url: "are/util" },
          { name: "ARE.Loader", url: "are/util" },
          { name: "ARE.UID", url: "are/util" },
          { name: "ARE.CanvasRenderer", url: "are/renderer" },
          { name: "ARE.WebGLRenderer", url: "are/renderer" },
          { name: "ARE.GLMatrix", url: "are/util" },
          { name: "ARE.RAF", url: "are/util" },
          { name: "ARE.FPS", url: "are/util" },
          { name: "ARE.Particle", url: "are/display" },
          { name: "ARE.Util", url: "are/util" },
          { name: "ARE.Vector2", url: "are/util" },
          { name: "ARE.ParticleSystem", url: "are/display" }
    ]
});
 
define("Main", ["ARE"], {
    ctor: function () {
        this instanceof DisplayObject;
        this instanceof Bitmap;
        this instanceof Sprite;
        this instanceof Stage;
        this instanceof Shape;
        this instanceof Container;
        this instanceof Txt;
        this instanceof Matrix2D;
        this instanceof Loader;
        this instanceof UID;
        this instanceof CanvasRenderer;
        this instanceof WebGLRenderer;
        this instanceof GLMatrix;
        this instanceof RAF;
        this instanceof FPS;
        this instanceof Particle;
        this instanceof Util;
        this instanceof Vector2;
        this instanceof ParticleSystem;
    }
})
```

ctor 是 Main 的构造函数，也是唯一一个会自动去 new 的构造函数，其余文件里面 difine 的 class 都需要自行去 new 才能执行。  
ctor 里面的一大堆 instanceof 代码主要是为了产生依赖，所以需要合并提取的 class 都需要写进去。  
最后直接打开 index 就能导出代码。

且看导出后的 are.js 的最后几行：

```javascript
if (typeof module != "undefined" && module.exports && this.module !== module) {
    module.exports = ARE;
} else if (typeof define === "function" && define.amd) {
    define(ARE);
} else {
    win.ARE = ARE;
}
```

这样的话，你就可以随意码了，比如：

```javascript
var stage = new ARE.Stage("#ourCanvas", localStorage.webgl == "1");
var txt = new ARE.Txt({
    txt: "Alloy Rendering Engine",
    fontSize: 25,
    fontFamily: "arial",
});
stage.add(txt);
```

为了避免打点，js 工程师一般这么干：

```javascript
with (ARE) {
    var stage = new Stage("#ourCanvas");
    var txt = new Txt({
        txt: "Alloy Rendering Engine",
        fontSize: 25,
        fontFamily: "arial",
    });
    stage.add(txt);
}
(function (Stage, Txt) {
    var stage = new Stage("#ourCanvas");
    var txt = new Txt({
        txt: "Alloy Rendering Engine",
        fontSize: 25,
        fontFamily: "arial",
    });
    stage.add(txt);
})(
    ARE.Stage,
    ARE.Txt
)(function (ARE) {
    var Stage = ARE.Stage,
        Txt = ARE.Txt;
    var stage = new Stage("#ourCanvas");
    var txt = new Txt({
        txt: "Alloy Rendering Engine",
        fontSize: 25,
        fontFamily: "arial",
    });
    stage.add(txt);
})(ARE);
require(["./ARE"], function (ARE) {
    var Stage = ARE.Stage,
        Txt = ARE.Txt;
    var stage = new Stage("#ourCanvas");
    var txt = new Txt({
        txt: "Alloy Rendering Engine",
        fontSize: 25,
        fontFamily: "arial",
    });
    stage.add(txt);
});
define(function (require) {
    var ARE = require("./ARE");
    var Stage = ARE.Stage,
        Txt = ARE.Txt;
    var stage = new Stage("#ourCanvas");
    var txt = new Txt({
        txt: "Alloy Rendering Engine",
        fontSize: 25,
        fontFamily: "arial",
    });
    stage.add(txt);
});
```

终于知道 js 的世界有多混乱了吧？！  
写一段程序需要频繁打点是不对的，一是慢，二是麻烦。js 工程师为了避免打点几乎绞尽脑汁。  
上面是避免打点的一些手段，如果使用 kmdjs，妈妈再也不用担心打点了：

```javascript
define("Main", ["ARE"], {
    ctor: function () {
        var stage = new Stage("#ourCanvas");
        var txt = new Txt({
            txt: "Alloy Rendering Engine",
            fontSize: 25,
            fontFamily: "arial",
        });
        stage.add(txt);
    },
});
```

## Next

这篇主要讲了下目录结构以及 kmdjs 在 are 中的作用，还有 are 的 build 工具的使用以及模块化的看法，确切说还没有进入主题，甚至跑题，  
但是非常重要，待续。