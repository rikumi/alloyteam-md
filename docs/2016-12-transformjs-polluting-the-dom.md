---
title: transformjs 污染了 DOM?
date: 2016-12-28
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/12/transformjs-polluting-the-dom/
---

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

```javascript
var element = document.querySelector("#test"),
    obj = {};
Transform(obj);
obj.rotateZ = 90;
element.style.transform = element.style.msTransform = element.style.OTransform = element.style.MozTransform = element.style.webkitTransform =
    obj.transform;
```

看到了没有，你不仅可以传 DOM 元素进去，也可以传对象字面量。你可以把 obj.transform 打印出来，上面是选择了 90 度，所以它生成出来的 matrix 是：

    perspective(500px) matrix3d(0,1,0,0,-1,0,0,0,0,0,1,0,0,0,0,1)

你同样也可以关闭透视投影，如：

```javascript
var element = document.querySelector("#test"),
    obj = {};
//关闭透视投影
Transform(obj, true);
obj.rotateZ = 90;
element.style.transform = element.style.msTransform = element.style.OTransform = element.style.MozTransform = element.style.webkitTransform =
    obj.transform;
```

生成出来的 matrix 是：

    matrix3d(0,1,0,0,-1,0,0,0,0,0,1,0,0,0,0,1)

那么运动的姿势呢？这里配合 [tween.js](https://github.com/tweenjs/tween.js) 的示例如下：

```javascript
var element = document.querySelector("#test"),
    obj = { translateX: 0, translateY: 0 };
Transform(obj);
var tween = new TWEEN.Tween(obj)
    .to({ translateX: 100, translateY: 100 }, 1000)
    .onUpdate(function () {
        element.style.transform = element.style.msTransform = element.style.OTransform = element.style.MozTransform = element.style.webkitTransform =
            obj.transform;
    })
    .start();
requestAnimationFrame(animate);
function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}
```

那么如果用传统的姿势是？

```javascript
var element = document.querySelector("#test");
Transform(element);
var tween = new TWEEN.Tween({
    translateX: element.translateX,
    translateY: element.translateY,
})
    .to({ translateX: 100, translateY: 100 }, 1000)
    .onUpdate(function () {
        element.translateX = this.translateX;
        element.translateY = this.translateY;
    })
    .start();
requestAnimationFrame(animate);
function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}
```

这里由于 TWEEN.Tween 会去遍历所以的属性并且设置初始值，如 tween 里面的代码：

```javascript
// Set all starting values present on the target object
for (var field in object) {
    _valuesStart[field] = parseFloat(object[field], 10);
}
```

所以不能直接把 new TWEEN.Tween (element)。  
因为在 start 之前，程序其实已经可以完全收集到所有需要 to 的属性，去运动便可以。我们可以自己封装一个 tween 去支持这种简便的方式。如：

```javascript
var Tween = function (obj) {
    this.obj = obj;
    return this;
};
Tween.prototype = {
    to: function (targets, duration, easing) {
        this.duration = duration;
        this.targets = targets;
        return this;
    },
    start: function () {
        this.startTime = new Date();
        this._beginTick();
    },
    _beginTick: function () {
        var _startValues = {},
            targets = this.targets;
        for (var key in targets) {
            if (targets.hasOwnProperty(key)) {
                _startValues[key] = this.obj[key];
            }
        }
        var self = this;
        this._interval = setInterval(function () {
            var dt = new Date() - self.startTime;
            for (var key in targets) {
                if (targets.hasOwnProperty(key)) {
                    if (dt >= self.duration) {
                        clearInterval(self._interval);
                    } else {
                        var p = dt / self.duration;
                        var dv = targets[key] - self.obj[key];
                        self.obj[key] += dv * p;
                    }
                }
            }
        }, 15);
    },
};
```

这里为了简便使用 setInterval 去进行 loop，当然可以换成其他方式。现在便可以使用如下方式：

```javascript
var element = document.querySelector("#test");
Transform(element);
var tween = new Tween(element)
    .to({ translateX: 100, translateY: 100 }, 1000)
    .start();
```

当然这有点跑题了。这里只是对比直接使用 DOM 挂载和使用第三方对象挂载的区别。第三方挂载有点隔山打牛的感觉。  
当然..，还没有完，不仅仅可以上面那个样子。那还可以把 transformjs 完全当作一个计算工具来用。

#### 语法 2

     Transform.getMatrix3D(option)

#### 姿势

```javascript
var matrix3d = Transform.getMatrix3D({
    translateX: 0,
    translateY: 100,
    scaleX: 2,
});
console.log(matrix3d);
```

打印出来你将得到下面的值：

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161226090617570-717633085.png)

你想用这个值来干什么就干什么吧。看 transformjs 源码可以得到 Transform.getMatrix3D 一共支持的属性：

```javascript
Transform.getMatrix3D = function (option) {
    var defaultOption = {
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        skewX: 0,
        skewY: 0,
        originX: 0,
        originY: 0,
        originZ: 0,
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1
    };
    for (var key in option) {
    ...
    ...
    ...
 
}
```

#### 语法 3

     Transform.getMatrix2D(option)

不仅仅是 3D matrix， transformjs 也提供了 2D 的工具函数支持。

#### 姿势

```javascript
var matrix2d = Transform.getMatrix2D({
    translateX: 0,
    translateY: 100,
    scaleX: 2,
});
console.log(matrix2d);
```

打印出来你将得到下面的值：

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161226090636632-555683397.png)

-   a 水平缩放
-   b 水平拉伸
-   c 垂直拉伸
-   d 垂直缩放
-   tx 水平位移
-   ty 垂直位移

那么得到这个 Matrix2D 有什么用？

-   缩放：scale (sx, sy) 等同于 matrix (sx, 0, 0, sy, 0, 0);
-   平移：translate (tx, ty) 等同于 matrix (1, 0, 0, 1, tx, ty);
-   旋转：rotate (deg) 等同于 matrix (cos (deg), sin (deg), -sin (deg), cos (deg), 0, 0);
-   拉伸：skew (degx, degy) 等同于 matrix (1, tan (degy), tan (degx), 1, 0, 0);

看 transformjs 源码可以得到 Transform.getMatrix2D 一共支持的属性：

```javascript
Transform.getMatrix2D = function(option){
    var defaultOption = {
        translateX: 0,
        translateY: 0,
        rotation: 0,
        skewX: 0,
        skewY: 0,
        originX: 0,
        originY: 0,
        scaleX: 1,
        scaleY: 1
    };
    ...
    ...
    ...
}
```

特别注意事项  

* * *

Transform.getMatrix2D 和 Transform.getMatrix3D 都是支持 origin 特性，请和 transform-origin 说拜拜  
Transform.getMatrix2D 和 Transform.getMatrix3D 没有使用传统的 Math.tan 去实现 shew，取而代之的是 half of rotation

如 2d 的 skew：

    Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX)

以前腾讯 IEG 的同学问过为什么使用 half of rotation，而不使用 Math.tan？  
原因很简单，Math.tan 扭曲力度特别大，而且会有无穷大的值导致扭曲横跨整个屏幕。

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161226090647429-876071005.png)

而 half of rotation 则不会。

getMatrix2D 有用吗？  

* * *

**用于 Dom Transformation 时候，可以用于兼容不支持 CSS3 3D Transforms 的浏览器**

如，我们可以很轻松的把一些 transformation 属性转换成 CSS3 属性赋给 DOM:

```javascript
var matrix = Transform.getMatrix2D({
    rotation: 30,
    scaleX: 0.5,
    scaleY: 0.5,
    translateX: 100,
});
ele.style.transform = ele.style.msTransform = ele.style.OTransform = ele.style.MozTransform = ele.style.webkitTransform =
    "matrix(" +
    [matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty].join(",") +
    ")";
```

**用于 Canvas 和 SVG Transformation**

什么？还能用于 Canvas 和 SVG? 是的，举个例子，在 Canvas 画一个旋转 30 度、缩小成 0.5 倍，并且平移（200,200）的图片：

```c
var canvas = document.getElementById("ourCanvas"),
    ctx = canvas.getContext("2d"),
    img = new Image(),
    rotation = 30 * Math.PI / 180;
 
img.onload = function () {
    ctx.sava();
    ctx.setTransform(
        0.5 * Math.cos(rotation), 0.5 * Math.sin(rotation),
        -0.5 * Math.sin(rotation), 0.5 * Math.cos(rotation),
        200, 200
    );
    ctx.drawImage(img, 0, 0);
    ctx.restore();
};
 
img.src = "asset/img/test.png";
```

上面是我们传统的姿势。使用 Transform.getMatrix2D 之后，变成这个样子：

```javascript
var canvas = document.getElementById("ourCanvas"),
    ctx = canvas.getContext("2d"),
    img = new Image();
var matrix = Transform.getMatrix2D({
    rotation: 30,
    scaleX: 0.5,
    scaleY: 0.5,
    translateX: 200,
    translateY: 200,
});
img.onload = function () {
    ctx.sava();
    ctx.setTransform(
        matrix.a,
        matrix.b,
        matrix.c,
        matrix.d,
        matrix.tx,
        matrix.ty
    );
    ctx.drawImage(img, 0, 0);
    ctx.restore();
};
img.src = "asset/img/test.png";
```

可以看到，这里让开发者不用自己去拼凑 matrix。SVG 的粒子就不再举例，和用于 DOM 的例子差不多，相信大家能够很快搞定。

开始使用吧  

* * *

-   官方网站：<http://alloyteam.github.io/AlloyTouch/transformjs/>
-   Github 地址：<https://github.com/AlloyTeam/AlloyTouch/tree/master/transformjs>

最后，多谢大家对 transformjs 的建议，有了你们中肯建议和意见，才让它变得更好更灵活更强大。  
