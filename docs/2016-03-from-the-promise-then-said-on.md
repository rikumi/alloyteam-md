---
title: 从 Promise 的 Then 说起
date: 2016-03-25
author: TAT.dorsywang
source_link: http://www.alloyteam.com/2016/03/from-the-promise-then-said-on/
---

<!-- {% raw %} - for jekyll -->

**Promise 让代码变得更人性化**

曾经我一直在思考，为什么代码会比较难读。后来发现，我们平时要阅读的所有媒体：报纸、书、新闻，我们在阅读的时候，都是从上到下一直读下去的，然而，我们的在读代码的时候，经常要跳着去读，这种阅读方式其实是反人类的，如果我们能在读代码的时候，也可以从上往下一直读下去，那么，代码就会变得可读性提高很多。

对比 JS 中，callback 是让我们跳来跳去读代码最大的罪魁祸首，它让我们的流程变得混乱，Promise 正是为了解决这一问题而产生的。我们来对比一下这个过程

```javascript
var render = function (data) {};
var getData = function (callback) {
    $.ajax({
        success: function () {
            callback(data);
        },
    });
};
var init = function () {
    getData(function (data) {
        render(data);
        getData(function (data) {
            render(data);
        });
    });
};
init();
```

使用 Promise 之后

```javascript
var init = function () {
    getData({})
        .then(function (data) {
            render(data);
            return getData({});
        })
        .then(function (data) {
            render(data);
        });
};
```

很明显看出，代码就变成线性的了，逻辑也变得更加清晰可读

**Promise 流程再优化**

promse 出来之后，大家都有很多的想法，在 Promise 之上再封装一层，使用异步流程更清晰可读。下面是 Abstract-fence 2.0 (开发中) 的一种解决方案 (规范)

Abstract-fence 中，function 会被分解为多个 task


<!-- {% endraw %} - for jekyll -->