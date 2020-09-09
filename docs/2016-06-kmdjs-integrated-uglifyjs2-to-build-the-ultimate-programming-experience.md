---
title: kmdjs 集成 uglifyjs2 打造极致的编程体验
date: 2016-06-14
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/06/kmdjs-integrated-uglifyjs2-to-build-the-ultimate-programming-experience/
---

<!-- {% raw %} - for jekyll -->

### 回顾

[上篇](http://www.cnblogs.com/iamzhanglei/p/5581606.html)文章大概展示了 kmdjs0.1.x 时期的编程范式：  
如下面所示，可以直接依赖注入到 function 里，

```javascript
kmdjs.define("main", ["util.bom", "app.Ball", "util.dom.test"], function (
    bom,
    Ball,
    test
) {
    var ball = new Ball(0, 0, 28, 1, -2, "kmdjs");
    var vp = bom.getViewport();
});
```

也可以直接在代码里把 full namespace 加上来调用，如：

```javascript
kmdjs.define("main", ["util.bom", "app.Ball", "util.dom.test"], function () {
    var ball = new app.Ball(0, 0, 28, 1, -2, "kmdjs");
    var vp = util.bom.getViewport();
});
```

而且，在循环依赖的场景，因为执行顺序的问题，会导致第一种方式注入 undefined，所以循环依赖的情况下只能用 full namespace 的方式来调用。

这种编程体验虽然已经足够好，但是可以更好。怎样才算更好？

1.  不用依赖注入 function
2.  不用写 full namespace，自动匹配依赖

如下所示：

```javascript
kmdjs.define("main", ["util.bom", "app.Ball", "util.dom.test"], function () {
    var ball = new Ball(0, 0, 28, 1, -2, "kmdjs");
    var vp = bom.getViewport();
});
```

这就要借助 uglifyjs 能力，把 function 的字符串替换成带有 namespace 就可以实现上面的效果。

### uglifyjs 依赖分析和代码重构


<!-- {% endraw %} - for jekyll -->