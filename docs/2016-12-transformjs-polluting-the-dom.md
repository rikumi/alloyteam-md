---
title: transformjs 污染了 DOM?
date: 2016-12-28
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/12/transformjs-polluting-the-dom/
---

<!-- {% raw %} - for jekyll -->

原文链接: <https://github.com/AlloyTeam/AlloyTouch/wiki/Powerful-transformjs>

写在前面  

* * *

上星期在 React 微信群里，有小伙伴觉得 transformjs 直接给 DOM 添加属性太激进，不可取（由于不在那个微信群，不明白为什么 React 会谈到 transformjs？！）。关于这点，其实在一年半前腾讯内部就有相关声音，腾讯内部的小伙伴建议，不要污染那么多吧～～，给个总的 namespace，如：

```javascript
var element = document.querySelector("#test");
Transform(element);
element.transform.scaleX = 2;
element.transform.translateX = 100;
element.transform.rotateX = 30;
```

在腾讯内部，还有小伙伴建议，包裹一层把：

```javascript
var transform = new Transform(dom, {
    scaleX: 1,
    skewY: 30,
    translateY: 200,
});
transform.translateY = 100;
```

总之，就是不要这样子（transformjs 目前的姿势）：

```javascript
var element1 = document.querySelector("#test");
Transform(element);
element.rotateZ = 45;
```

那么上面这种做法会有什么问题？

-   既然 JS 里提供了动态属性并监听变更进行 callback 的能力为什么不能用？
-   违反哪条 JS 最佳实践？
-   违反哪条 Web 最佳实践？
-   违反哪条 DOM 最佳实践？

后来，我找到以前提修改意见的腾讯小伙伴，他给了这样的回答：

> 如果以后 w3c 需要给 DOM 元素扩展 translateX, translateY, translateZ, scaleX, scaleY, scaleZ, rotateX, rotateY, rotateZ, skewX, skewY, originX, originY, originZ，这就留下了巨大的隐患～～

对于这点，我认为，既然 domElment.style.transform 已经有了，扩展 translateX, translateY, translateZ, scaleX, scaleY, scaleZ, rotateX, rotateY, rotateZ, skewX, skewY, originX, originY, originZ 的可能性几乎没有，因为其实 domElment.style.transform 已经提供了足够的灵活性。就算扩展了，transformjs 打个补丁包或者 prolyfill 一下便可。

然后我又问了一些小伙伴，得到一个非常有趣的回答：

> 反正你污染了 DOM，反正你污染了 DOM，反正你污染了 DOM....

....

条条大路通罗马  

* * *

transformjs 不仅仅可以 mix CSS3 transform 到 DOM 元素，还能 mix 到任意的对象字面量，也可以把 transformjs 当作工具，他提供一些基础的数学能力。

> 这里需要特别注意，以前的姿势可以继续使用，这里另外三种使用姿势。

#### 语法 1

    Transform(obj, [notPerspective]);

如你所见，其他方式都不用变。只是第一个参数不仅仅可以传 DOM 元素，也可以传任意对象字面量等。

不卖关子，先看使用姿势


<!-- {% endraw %} - for jekyll -->