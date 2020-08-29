---
title: 向 ES6 靠齐的 Class.js
date: 2015-04-19
author: TAT.dnt
source_link: http://www.alloyteam.com/2015/04/xiang-es6-kao-qi-di-class-js/
---

<!-- {% raw %} - for jekyll -->

**写在前面**  

* * *

在 2008 年的时候，John Resig 写了一 [Class.js](http://ejohn.org/blog/simple-javascript-inheritance/)，使用的方式如下：

```javascript
var Person = Class.extend({
    init: function (isDancing) {
        this.dancing = isDancing;
    },
    dance: function () {
        return this.dancing;
    },
});

var Ninja = Person.extend({
    init: function () {
        this._super(false);
    },
    dance: function () {
        // Call the inherited version of dance()
        return this._super();
    },
    swingSword: function () {
        return true;
    },
});
```

```html
<span style="font-family: sans-serif, Arial, Verdana, 'Trebuchet MS'; line-height: 1.6;">init为构造函数，通过this._super()访问</span><strong style="font-family: sans-serif, Arial, Verdana, 'Trebuchet MS'; line-height: 1.6;">父类同名方法</strong><span style="font-family: sans-serif, Arial, Verdana, 'Trebuchet MS'; line-height: 1.6;">。</span>
```

这种看上去很酷很方便的继承方式，居然有一个致命的缺陷。那就是：

当父类 A 有一个方法 a, 子类 B 也有一个方法 a 的时候，仅仅只有子类 B 中的方法 a 才能访问父类 A 中的方法 a，子类 B 中的其他方法从此就无法访问到父类 A 中的方法 a。虽然这种场景很少，但是不完美啊不完美！！ 所以就有了今天向 ES6 看齐的 Class.js。

### **ES6 class**

先来看看 ES6 中的 class 继承：

Class 之间可以通过 extends 关键字，实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。

```javascript
class ColorPoint extends Point {}
```

`class ColorPoint extends Point {}`

上面代码定义了一个 ColorPoint 类，该类通过 extends 关键字，继承了 Point 类的所有属性和方法。但是由于没有部署任何代码，所以这两个类完全一样，等于复制了一个 Point 类。下面，我们在 ColorPoint 内部加上代码。


<!-- {% endraw %} - for jekyll -->