---
title: 腾讯 Web 前端 JX 框架入门教程 (三)
date: 2013-09-24
author: TAT.pel
source_link: http://www.alloyteam.com/2013/09/jx-framework-tutorial-c/
---

<!-- {% raw %} - for jekyll -->

开发者问得比较多的一个问题是，JX 的 ui 组件怎么用。其实只要记住，JX 是遵循驼峰式命名法，“小驼峰式（小写字母开头）” 的是变量、方法名，“大驼峰式（大写字母开头）” 的是类名，这个问题就会简单明了了。

# 类和继承

原生 js 的类和继承是通过原型和原型链实现的，这是个很好玩的东西，我们可以想出很多很优雅很灵活的方法去声明我们的类，唯一的问题是看你代码的人（甚至是隔了一段时间之后的自己）可能看得云里雾里，这显然不是团队合作中希望遇到的。因此 JX 对类做了简单的封装，废话说得差不多了，直接上代码。

```javascript
var Person = J.Class({
    init: function (name) {
        this.name = name;
    },
    say: function (msg) {
        alert(this.name + ":" + msg);
    },
});
var p1 = new Person("Tom");
p1.say("Hello");
```

我们可以用 J.Class 去声明一个类，其中 init 是构造函数，其他的是类的方法和属性。

```javascript
var SmartPerson = J.Class(
    { extend: Person },
    {
        init: function (name, age) {
            SmartPerson.callSuper(this, "init", name);
            this.age = age;
        },
        sayHelloTo: function (person) {
            this.say("Hello " + person.name);
        },
    }
);
var p2 = new SmartPerson("Jim", 3);
p2.sayHelloTo(p1);
```

通过 extend，我们实现了对 Person 类的继承，在子类中，我们可以直接调用父类的方法。当子类重载了父类的方法而我们又想直接调用父类方法的时候，我们可以用子类的 callSuper 静态方法。

# 关于 UI 组件

现在再看 JX 的 ui 组件，以 Boxy 为例，

```javascript
var boxy = new J.ui.Boxy(); //创建对象
boxy.getPanel().setHtml("<h1>Message</h1><p>Welcome to alloyteam.com</p>"); //填入内容html
```

就是这样简单，点击[这里看运行结果](http://www.alloyteam.com/wp-content/uploads/2013/09/jx_ui_demo.html)。  
希望这个例子能给你一些启示。[更多活生生的 demo](http://alloyteam.github.io/JXLiveDemo/) 在这里。


<!-- {% endraw %} - for jekyll -->