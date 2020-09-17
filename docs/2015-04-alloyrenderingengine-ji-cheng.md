---
title: AlloyRenderingEngine 继承
date: 2015-04-28
author: TAT.dnt
source_link: http://www.alloyteam.com/2015/04/alloyrenderingengine-ji-cheng/
---

<!-- {% raw %} - for jekyll -->

写在前面  

* * *

不读文章，只对代码感兴趣可以直接跳转到这里 <https://github.com/AlloyTeam/AlloyGameEngine>  
然后 star 一下，多谢支持：)。

前几天发了篇[向 ES6 靠齐的 Class.js](http://www.alloyteam.com/2015/04/xiang-es6-kao-qi-di-class-js/)，当初 jr 为什么不把父类的实例暴露给子类，其原因还是为了延续原型继承的习惯，子类重写就会覆盖掉父类的方法，父类的方法就会丢，如下面的代码，就堆栈溢出了：

```javascript
var Parent = function () {};
Parent.prototype.a = function () {};
var Child = function () {};
Child.prototype = new Parent();
Child.prototype.a = function () {
    this.a();
};
var child = new Child();
child.a();
```

而 jr 的 Class.js 可以让你通过 this.\_super 访问父类同类方法，修复了原型继承同名无法访问父类的弱点，当然也可以 hack 一下，先赋给变量或者某个属性。如：

```javascript
var Parent = function () {};
Parent.prototype.a = function () {
    alert(1);
};
var Child = function () {};
Child.prototype = new Parent();
Child.prototype.parentA = Child.prototype.a;
Child.prototype.a = function () {
    this.parentA();
};
var child = new Child();
child.a();
```

但是这样的话，代码不就很丑陋了吗！？  
所以 AlloyRenderingEngine 选择使用了 JR 的 Class.js，然后在其基础之上扩展了静态方法和属性，以及**静态构造函数**。

所以就变成了这样：

```javascript
var Person = Class.extend({
  statics:{
   //静态构造函数会直接被Class.js执行
   ctor:function(){
      //这里的this相当于Person
   },
   Version:"1.0.0",
   GetVersion:function(){
     return Person.Version;
   }
  },
  ctor: function(isDancing){
    this.dancing = isDancing;
  },
  dance: function(){
```


<!-- {% endraw %} - for jekyll -->