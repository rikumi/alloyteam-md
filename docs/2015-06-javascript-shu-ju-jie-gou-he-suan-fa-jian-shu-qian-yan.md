---
title: JavaScript 数据结构和算法简述 —— 前言
date: 2015-06-29
author: TAT.李强
source_link: http://www.alloyteam.com/2015/06/javascript-shu-ju-jie-gou-he-suan-fa-jian-shu-qian-yan/
---

<!-- {% raw %} - for jekyll -->

## 为什么要使用数据结构和算法（程序 = 数据结构 + 算法）

* * *

 **数据结构**是对在计算机内存中（有时在磁盘中）的数据的一种安排。包括数组、链表、栈、二叉树、哈希表等。

 **算法**是对这些结构中的数据进行各种处理。比如，查找一条特殊的数据项或对数据进行排序。

        举一个简单的索引卡的存储问题，每张卡片上写有某人的姓名、电话、住址等信息，可以想象成一本地址薄，那么当我们想要用计算机来处理的时候，问题来了：

-   如何在计算机内存中安放数据？
-   所用算法适用于 100 张卡片，很好，那 1000000 张呢？
-   所用算法能够快速插入和删除新的卡片吗？
-   能够快速查找某一张卡片吗？
-   如何将卡片按照字母进行排序呢？

        事实上，大多数程序比地址簿要复杂得多，想象一下航班预订系统的数据库，存储了旅客和航班的各种信息，需要许多数据结构组成。如果您很清楚这些问题，那么请您对我的博文给出宝贵意见，如果不清楚，那么在我的博文中可以给您一些适当的指引。

        随着 NodeJs 技术的发展，可以在服务器端使用 javascript，控制 MongoDB 进行持久化数据存储。这就需要一些复杂的数据结构和算法来提高程序的性能，仅仅使用数组和 for 循环来处理数据是远远不够的。

## 数据结构概述

* * *

| 数据结构    | 优点                         | 缺点                           |
| ------- | -------------------------- | ---------------------------- |
| 数组      | 插入快，如果知道下标，可以非常快的存取        | 查找慢，删除慢，大小固定                 |
| 有序数组    | 比无序数组查找快                   | 删除和插入慢，大小固定                  |
| 栈       | 提供 “后进先出” 的存取方式            | 存取其他项很慢                      |
| 队列      | 提供 “先进先出” 的存取方式            | 存取其他项很慢                      |
| 链表      | 插入快，删除快                    | 查找慢                          |
| 二叉树     | 如果树保持平衡，查找、插入、删除都很快        | 删除算法比较复杂                     |
| 红 - 黑树  | 树总是平衡的，查找、插入、删除都很快         | 算法比较复杂                       |
| 2-3-4 树 | 对磁盘存储有用，树总是平衡的，查找、插入、删除都很快 | 算法比较复杂                       |
| 哈希表     | 插入快，如果关键字已知则存取极快           | 删除慢，如果不知道关键字则存取很慢，对存储空间使用不充分 |
| 堆       | 插入、删除快，对最大数据项的存取很快         | 对其他数据项存取慢                    |
| 图       | 对现实世界建模                    | 有些算法慢且复杂                     |

## 算法概述

* * *

        对大多数数据结构来说，都需要知道如何：

-   插入一条新的数据项
-   查找某一个特定的数据项
-   删除某一个特定的数据项
-   遍历某一数据结构中的各数据项
-   排序

        另外，递归的概念在设计有些算法时，也是十分重要的。

## javascript 面向对象编程

* * *

        博文中的数据结构均被实现为对象，本节是为了给那些还没有接触过面向对象编程的读者准备的，但是，短短的一节并不能涵盖所有面向对象编程的思想，仅仅是让读者能够明白博文中的代码示例。  
        Javascript 是一种基于对象的语言，但是，又不是一种真正意义上的面向对象的语言，因为没有 class（类）的语法。

### 一、创建对象

        创建对象就是把属性（property）和方法（method）封装成一个对象，或者从原型对象中实例化一个对象。

        下面以实例化小狗对象为例，小狗具有名字和品种两个属性。

        1、原始模式

```javascript
var dog1 = {};
dog1.name = "二牛";
dog1.variety = "牛头梗";
var dog2 = {};
dog2.name = "二狗";
dog2.variety = "哈士奇";
```

        这样封装对象虽然简单，但是有两个缺点，一是如果要创建多个实例的话，写起来会比较麻烦，二是这种写法并不能看出实例和原型之间有什么关系。

        对原始模式进行改进，

```javascript
function Dog(name, variety) {
    return {
        name: name,
        variety: variety,
    };
}
var dog1 = Dog("二牛", "牛头梗");
var dog2 = Dog("二狗", "哈士奇");
```

        改进后解决了代码重复的问题，但是 dog1 和 dog2 之间并没有内在联系，不是来自于同一个原型对象。

        2、构造函数模式

        构造函数，是内部使用了 this 的函数。通过 new 构造函数就能生成对象实例，并且 this 变量会绑定在实例对象上。使用构造函数可以解决从原型对象构建实例的问题。

```javascript
function Dog(name, variety) {
    this.name = name;
    this.variety = variety;
}
var dog1 = new Dog("二牛", "牛头梗");
var dog2 = new Dog("二狗", "哈士奇");
print(dog1.name); // 二牛
print(dog2.name); // 二狗
```

        验证实例对象与原型对象之间的关系：

```python
print(dog1.cunstructor === Dog); // true
print(dog2.cunstructor === Dog); // true
 
print(dog1 instanceof Dog); // true
print(dog2 instanceof Dog); // true
 
```

        这样看来构造函数模式解决了原始模式的缺点，但是它自己又引入了新的缺点，就是有些时候存在浪费内存的问题。比如说，我们现在要给小狗这个对象添加一个公共的属性 “type”（种类）和一个公共方法 “bark”（吠）：

```javascript
function Dog(name, variety) {
    this.name = name;
    this.variety = variety;
    this.type = "犬科";
    this.bark = function () {
        print("汪汪汪");
    };
}
```

        再去实例化对象，

```javascript
var dog1 = new Dog("二牛", "牛头梗");
var dog2 = new Dog("二狗", "哈士奇");
print(dog1.type); // 犬科
dog1.bark(); // 汪汪汪
print(dog2.type); // 犬科
dog2.bark(); // 汪汪汪
```

        这样看似没有问题，那么我写另一段代码来看一下问题所在，

```javascript
print(dog1.bark() === dog2.bark()); // false
```

        从中我们可以看出问题，那就是对于每个实例对象而言，type 属性和 bark 方法都是一样的，但是每次创建新的实例，都要为其分配新的内存空间，这样做就会降低性能，浪费空间，缺乏效率。

        接下来我们就要思考怎样让这些所有实例对象都相同的内容在内存中只生成一次，并且让所有实例的这些相同内容都指向那个内存地址？

        3、Prototype 模式

        每一个构造函数都有一个 prototype 属性，指向另一个对象。这个对象的所有属性和方法，都会被构造函数的实例继承。可以利用这一点，把那些不变的属性和方法，定义在 prototype 对象上。

```javascript
function Dog(name, variety) {
    this.name = name;
    this.variety = variety;
}
Dog.prototype.type = "犬科";
Dog.prototype.bark = function () {
    print("汪汪汪");
};
var dog1 = new Dog("二牛", "牛头梗");
var dog2 = new Dog("二狗", "哈士奇");
print(dog1.type); // 犬科
dog1.bark(); // 汪汪汪
print(dog2.type); // 犬科
dog2.bark(); // 汪汪汪
print(dog1.bark() === dog2.bark()); // true
```

这里所有实例对象的 type 属性和 bark 方法，都指向 prototype 对象，都是同一个内存地址。

### 二、继承

现在有一个动物的构造函数：

```javascript
function Animal() {
    this.feeling = "happy";
}
```

有一个小狗的构造函数：

```javascript
function Dog(name, variety) {
    this.name = name;
    this.variety = variety;
}
```

以下如不对 Animal 和 Dog 对象进行重写，则使用该代码进行代入，示例代码中不再重复。  
1、原型链继承

```javascript
Dog.prototype = new Animal();
Dog.prototype.constructor = Dog;
var dog = new Dog("二狗", "哈士奇");
print(dog.feeling); // happy
```

原型链继承存在两个问题：第一点是当被继承对象中包含引用类型的属性时，该属性会被所有实例对象共享，示例代码如下；

```javascript
function Animal() {
    this.colors = ["red", "green", "blue"];
}
function Dog() {}
// 继承Animal
Dog.prototype = new Animal();
Dog.prototype.constructor = Dog;
var dog1 = new Dog();
dog1.colors.push("black");
print(dog1.colors); // red,green,blue,black
var dog2 = new Dog();
print(dog2.colors); // red,green,blue,black
```

第二点是不能在不影响所有实例对象的情况下，向父级构造函数传递参数，这一点不做示例，大家可以自行验证下；

2、构造函数继承

```javascript
function Dog(name, variety) {
    Animal.apply(this, arguments);
    this.name = name;
    this.variety = variety;
}
var dog = new Dog("二狗", "哈士奇");
print(dog.feeling); // happy
```

这是一种十分简单的方法，使用 apply 或者 call 方法改变构造函数作用域，将父函数的构造函数绑定到子对象上。虽然解决了子对象向父对象传递参数的目的，但是借助构造函数，方法都在构造函数中定义，函数的复用就无从谈起。

3、构造函数和原型链组合继承

利用构造函数实现对实例属性的继承，使用原型链完成对原型属性和方法的继承，避免了原型链和构造函数的缺陷。

```javascript
function Animal(name) {
    this.name = name;
    this.colors = ["red", "green", "blue"];
}
Animal.prototype.sayName = function () {
    print(this.name);
};
function Dog(name, age) {
    // 继承属性
    Animal.call(this, name);
    this.age = age;
}
// 继承方法
Dog.prototype = new Animal();
Dog.prototype.constructor = Dog;
Dog.prototype.sayAge = function () {
    print(this.age);
};
var dog1 = new Dog("二狗", 1);
dog1.colors.push("black");
print(dog1.colors); // red,green,blue,black
dog1.sayName(); // 二狗
dog1.sayAge(); // 1
var dog2 = new Dog("二牛", 2);
print(dog2.colors); // red,green,blue
dog2.sayName(); // 二牛
dog2.sayAge(); // 2
```

4、YUI 式继承

由原型链继承延伸而来，避免了实例对象的 prototype 指向同一个对象的缺点（Dog.prototype 包含一内部指针指向 Animal.prototype，同时 Dog 的所有实例也都包含一内部指针指向 Dog.prototype，那么任何对 Dog 实例上继承自 Animal 的属性或方法的修改，都会反映到 Dog.prototype）。让 Dog 跳过 Animal，直接继承 Animal.prototype，这样省去执行和创建 Animal 实例，提高了效率。利用一个空对象作为媒介，空对象几乎不占用内存，示例如下：

```javascript
function Animal() {}
Animal.prototype.feeling = "happy";
function extend(Child, Parent) {
    var F = function () {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
}
extend(Dog, Animal);
var dog = new Dog("二狗", "哈士奇");
print(dog.feeling); // happy
```

5、拷贝继承（浅拷贝和深拷贝）

把父对象的属性和方法，全部拷贝给子对象，也能实现继承。

① 浅复制

```javascript
function Animal() {}
Animal.prototype.feeling = "happy";
function extend(Child, Parent) {
    var p = Parent.prototype;
    var c = Child.prototype;
    for (var i in p) {
        c[i] = p[i];
    }
}
extend(Dog, Animal);
var dog = new Dog("二狗", "哈士奇");
print(dog.feeling); // happy
```

但是，这样的拷贝有一个问题。那就是，如果父对象的属性等于数组或另一个对象，那么实际上，子对象获得的只是一个内存地址，而不是真正拷贝，因此存在父对象被篡改的可能，比如在上例中适当位置添加如下代码会发现：

```python
Animal.prototype.colors = ['red', 'green', 'blue'];
 
Dog.colors.push('black');
 
print(Dog.colors); // red,green,blue,black
print(Animal.colors); // red,green,blue,black
 
```

当然，这也是 jquery 早期实现继承的方式。

② 深复制

```javascript
function Animal() {}
Animal.prototype.feeling = "happy";
function deepCopy(Child, Parent) {
    var p = Parent.prototype;
    var c = Child.prototype;
    for (var i in p) {
        if (typeof p[i] === "object") {
            c[i] = p[i].constructor === Array ? [] : {};
            deepCopy(p[i], c[i]);
        } else {
            c[i] = p[i];
        }
    }
}
deepCopy(Dog, Animal);
var dog = new Dog("二狗", "哈士奇");
print(dog.feeling); // happy
```

深拷贝，能够实现真正意义上的数组和对象的拷贝。这时，在子对象上修改属性（引用类型），就不会影响到父元素了。这也是目前 jquery 使用的继承方式。

## JavaScript 数据结构实现

* * *

可以下载 [javascript shell](http://ftp.mozilla.org/pub/mozilla.org/firefox/nightly/latest-trunk/)（进入该页面并滚动到底部，选择系统版本进行下载）使用 shell 交互模式编写代码并执行。博文中主要利用 javascript 中数组和对象的特性对数据结构和算法进行描述，在描述原理的同时，使用 javascript 实现示例代码。只有真正明白数据结构的基础，才能对其应用自如。

【未完待续 JavaScript 数据结构和算法简述 —— 数组】

<!-- {% endraw %} - for jekyll -->