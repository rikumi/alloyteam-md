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
&lt;span style="font-family: sans-serif, Arial, Verdana, 'Trebuchet MS'; line-height: 1.6;">init为构造函数，通过this._super()访问&lt;/span>&lt;strong style="font-family: sans-serif, Arial, Verdana, 'Trebuchet MS'; line-height: 1.6;">父类同名方法&lt;/strong>&lt;span style="font-family: sans-serif, Arial, Verdana, 'Trebuchet MS'; line-height: 1.6;">。&lt;/span>
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

```javascript
class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y); // 等同于parent.constructor(x, y)
        this.color = color;
    }
    toString() {
        return this.color + " " + super.toString(); // 等同于parent.toString()
    }
}
```

上面代码中，constructor 方法和 toString 方法之中，都出现了 super 关键字，它指代父类的实例（即父类的 this 对象）。

上面来自 ruanyifeng 的 es6 入门：<http://es6.ruanyifeng.com/#docs/class>

**Class.js**  

* * *

下面是向 ES6 靠齐的 Class.js

```javascript
//所有类的基类
var Class = function () {};
//基类增加一个extend方法
Class.extend = function (prop) {
    var _super = this.prototype; //父类的实例赋给变量prototype
    var prototype = new this(); //把要扩展的属性复制到prototype变量上
    for (var name in prop) {
        //下面代码是让ctor里可以直接访问使用this._super访问父类构造函数，除了ctor的其他方法，this._super都是访问父类的实例
        prototype[name] =
            name == "ctor" &&
            typeof prop[name] == "function" &&
            typeof _super[name] == "function"
                ? (function (name, fn) {
                      return function () {
                          //备份一下this._super
                          var tmp = this._super; //替换成父类的同名ctor方法
                          this._super = _super[name]; //执行，此时fn中的this里面的this._super已经换成了_super[name],即父类的同名方法
                          var ret = fn.apply(this, arguments); //把备份的还原回去
                          this._super = tmp;
                          return ret;
                      };
                  })(name, prop[name])
                : prop[name];
    } //假的构造函数
    function Class() {
        //执行真正的ctor构造函数
        this.ctor.apply(this, arguments);
    } //继承父类的静态属性
    for (var key in this) {
        if (this.hasOwnProperty(key) && key != "extend") Class[key] = this[key];
    } // 子类的原型指向父类的实例
    Class.prototype = prototype; //这里一定要用new this //不能Class.prototype._super = prototype;（这里明显错误，prototype这时已经被copy进去了新的属性） //或者Class.prototype._super = _super;（这里会导致_super instanceof 不准确 ）
    Class.prototype._super = new this(); //覆盖父类的静态属性
    if (prop.statics) {
        for (var name in prop.statics) {
            if (prop.statics.hasOwnProperty(name)) {
                Class[name] = prop.statics[name];
                if (name == "ctor") {
                    Class[name]();
                }
            }
        }
    }
    Class.prototype.constructor = Class; //原型可扩展
    Class.extendPrototype = function (prop) {
        for (var name in prop) {
            prototype[name] = prop[name];
        }
    }; //任何Class.extend的返回对象都将具备extend方法
    Class.extend = arguments.callee;
    return Class;
};
```

`// 所有类的基类 var Class = function () {}; // 基类增加一个 extend 方法 Class.extend = function (prop) { var _super = this.prototype; // 父类的实例赋给变量 prototype var prototype = new this (); // 把要扩展的属性复制到 prototype 变量上 for (var name in prop) { // 下面代码是让 ctor 里可以直接访问使用 this._super 访问父类构造函数，除了 ctor 的其他方法，this._super 都是访问父类的实例 prototype [name] = name == "ctor" && typeof prop [name] == "function" && typeof _super [name] == "function" ? (function (name, fn) { return function () { // 备份一下 this._super var tmp = this._super; // 替换成父类的同名 ctor 方法 this._super = _super [name]; // 执行，此时 fn 中的 this 里面的 this._super 已经换成了_super [name], 即父类的同名方法 var ret = fn.apply (this, arguments); // 把备份的还原回去 this._super = tmp; return ret; }; })(name, prop [name]) : prop [name]; } // 假的构造函数 function Class () { // 执行真正的 ctor 构造函数 this.ctor.apply (this, arguments); } // 继承父类的静态属性 for (var key in this) { if (this.hasOwnProperty (key) && key != "extend") Class [key] = this [key]; } // 子类的原型指向父类的实例 Class.prototype = prototype; // 这里一定要用 new this // 不能 Class.prototype._super = prototype;（这里明显错误，prototype 这时已经被 copy 进去了新的属性）// 或者 Class.prototype._super = _super;（这里会导致_super instanceof 不准确）Class.prototype._super = new this (); // 覆盖父类的静态属性 if (prop.statics) { for (var name in prop.statics) { if (prop.statics.hasOwnProperty (name)) { Class [name] = prop.statics [name]; if (name == "ctor") { Class [name](); } } } } Class.prototype.constructor = Class; // 原型可扩展 Class.extendPrototype = function (prop) { for (var name in prop) { prototype [name] = prop [name]; } }; // 任何 Class.extend 的返回对象都将具备 extend 方法 Class.extend = arguments.callee; return Class; };`

没有想说的，都在注释里...

**测试**  

* * *

```javascript
var Animal = Class.extend({
    statics: {
        TestStaticsProperty: 1,
        TestStaticsProperty2: 2,
        TestStaticsMethod: function () {
            return 2;
        },
        TestStaticsMethod2: function () {
            return 33;
        },
    },
    ctor: function (age) {
        this.age = age;
        this.testProp = "animal";
    },
    eat: function () {
        return "nice";
    },
    dirnk: function () {
        return "good";
    },
});
var Pig = Animal.extend({
    statics: {
        TestStaticsProperty2: 3,
        TestStaticsMethod2: function () {
            return 3;
        },
    },
    ctor: function (age, name) {
        this._super(age);
        this.name = name;
    },
    climbTree: function () {
        return this._super.eat();
    },
    eat: function () {
        return "very nice";
    },
});
var BigPig = Pig.extend({
    ctor: function () {
        //测试通过this._super访问父类构造函数
        console.log(typeof this._super === "function");
    },
    getSuper: function () {
        return this._super;
    },
});
//测试静态属性
console.log(Animal.TestStaticsProperty === 1); //true
//测试静态方法
console.log(Animal.TestStaticsMethod() === 2); //true
//测试子类访问父类静态属性
console.log(Pig.TestStaticsProperty === 1); //true
//测试子类重写父类静态属性
console.log(Pig.TestStaticsProperty2 === 3); //true
//测试子类访问父类静态属性
console.log(Pig.TestStaticsMethod() === 2); //true
//测试子类重写父类静态属性
console.log(Pig.TestStaticsMethod2() === 3); //true
//测试父类静态方法未被覆盖
console.log(Animal.TestStaticsMethod2() === 33); //true
//测试父类静态属性未被覆盖
console.log(Animal.TestStaticsProperty2 === 2); //true
var animal = new Animal(11);
//测试构造函数
console.log(animal.age === 11); //true
console.log(animal.eat() === "nice"); //true
var pig = new Pig(1, 11); //true
console.log(pig.testProp === "animal"); //true
console.log(pig.climbTree() === "nice"); //true
console.log(pig.eat() === "very nice"); //true
console.log(pig instanceof Pig); //true
var bigPig = new BigPig();
//测试孙类访问祖先方法（原型链）
console.log(bigPig.dirnk() === "good"); //true
//测试孙类访问祖先属性
console.log(bigPig.testProp === "animal"); //true
console.log(bigPig instanceof BigPig); //true
//测试通过this._super访问父类
console.log(bigPig.getSuper() instanceof Pig); //true
console.log(bigPig instanceof Animal); //true
```

使用和 ES6 一样，除了构造函数 ctor 方法可以直接通过 this.\_super 方法去访问 parent.ctor,  
其余的方法可通过 this.\_super. 方法名 (xxxx) 去访问父类方法，如果自身没有定义父类同名的方法，也可以直接通过 this. 方法名去访问父类的方法。  
欢迎使用，玩得愉快。


<!-- {% endraw %} - for jekyll -->