---
title: 前端逻辑和 Node 直出复用与重构
date: 2015-07-31
author: burlin
source_link: http://www.alloyteam.com/2015/07/qian-duan-luo-ji-he-node-zhi-chu-fu-yong-yu-zhong-gou-2/
---

<!-- {% raw %} - for jekyll -->

### 不得不聊到的重构简介

要实现软件演化基本准则，最关键的策略就是重构，Martin Fowler 将其定义为” 在不改版软件外部行为的前提下，对其内部结构进行改变，使之更容易理解并便于修改 “。

### [](http://www.alloyteam.com/2015/07/qian-duan-luo-ji-he-node-zhi-chu-fu-yong-yu-zhong-gou-2/#_2)复用的理由

重复的代码，几乎是代表着对最初设计彻底分解方面的一个失误。无论何时，如果需要对某个地方进行修改，你都不得不在另一个地方进行完成同样的修改，这样你就陷入了两线作战的境地。重复的代码同样违背了代码哲学 DRY 原则：”Don’t Repeat Yourself“  

### [](http://www.alloyteam.com/2015/07/qian-duan-luo-ji-he-node-zhi-chu-fu-yong-yu-zhong-gou-2/#_3)复用的例子

举个例子，现在很多第三方库已经默认支持不同规范的引用，开放给第三方使用的组件能兼容不同的规范。然而很多时候如果我们引用第三方组件或者自己的组件时，并没有采用模块化开发抑或单一支持一种模块化，通常我们自己需要包装一下支持模块化引用依赖，如下示例：

使用 seajs 规范进行模块化加载，所以定义的模块都是以这样的形式加载，该模块 c 依赖 a,b

```javascript
define(["./a", "./b"], function (require, exports, module) {
    // dosometing
});
```

那么，在服务器做 node 直出的时候，如何使用同一个文件进行复用呢

```javascript
(function (root, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var a = require("./a");
        var b = require("./b");
        module.exports = factory(root);
        return;
    }
    if (typeof define === "function" && (define.amd || define.cmd)) {
        define(["./a", "./b"], function (require, exports, module) {
            var a = require("a");
            var b = require("b");
            return factory(root);
        });
    } else {
        root.c = factory(root);
    }
})(this, function (root) {
    // dosometing
});
```

这里会有个立即调用的匿名函数，判断模块加载器的类型，采用不同的模块化定义规范，如果没有的话，就直接暴露在全局。

### [](http://www.alloyteam.com/2015/07/qian-duan-luo-ji-he-node-zhi-chu-fu-yong-yu-zhong-gou-2/#_4)重构的例子

由于 Node 直出只需要获取处理数据，并把数据渲染在模板上，返回 html 字符串即可。  
这就需要我们抽离 Model，Controller  
重构，这里就举个简单例子了

```javascript
var model = new Model({
    cgi: "/cgi-bin/bottom_info",
    param: {
        a: 1
    },
    renderer: function(data){
        handle(data);
        tmpl(data);
    }
}
 
```

然后注入 NodeOut 状态变量来标注是否直出，然后做相应的兼容，例如 client 端数据需要更新 page，不再拉取本地缓存或者线上数据。

node 端

    res.body += ('
    ```html
    <script>var NodeOut=true;');
    res.body += ('</script>

');

 

````

浏览器端

```javascript
if (typeof nodeOut !== "undefined") {
    //事件绑定
    EventBind(); //不再拉取数据
    return;
}
````

<!-- {% endraw %} - for jekyll -->