---
title: 【译】编写高性能 JavaScript
date: 2012-11-20
author: TAT.JohnnyAddy Osmani
source_link: http://www.alloyteam.com/2012/11/performance-writing-efficient-javascript/
---

原文：<http://coding.smashingmagazine.com/2012/11/05/writing-fast-memory-efficient-javascript/>

作者：[Addy Osmani](http://coding.smashingmagazine.com/author/addy-osmani/?rel=author "Posts by Addy Osmani")

译者按：本人第一次翻译外文，言语难免有些晦涩，但尽量表达了作者的原意，未经过多的润色，欢迎批评指正。另本文篇幅较长、信息量大，可能难以消化，欢迎留言探讨细节问题。本文主要关注 V8 的性能优化，部分内容并不适用于所有 JS 引擎。最后，转载请注明出处: )

\\======================== 译文分割线 ===========================

很多 JavaScript 引擎，如 Google 的 [V8](http://code.google.com/p/v8/) 引擎（被 Chrome 和 Node 所用），是专门为需要[快速执行](http://www.html5rocks.com/en/tutorials/speed/v8/)的大型 JavaScript 应用所设计的。如果你是一个开发者，并且关心内存使用情况与页面性能，你应该了解用户浏览器中的 JavaScript 引擎是如何运作的。无论是 V8，[SpiderMonkey](https://developer.mozilla.org/en-US/docs/SpiderMonkey) 的（Firefox）的 [Carakan](http://my.opera.com/ODIN/blog/carakan-faq)（Opera），[Chakra](http://en.wikipedia.org/wiki/Chakra_(JScript_engine))（IE）或其他引擎，这样做可以帮助你**更好地优化你的应用程序**。这并不是说应该专门为某一浏览器或引擎做优化，千万别这么做。

但是，你应该问自己几个问题：

-   在我的代码里，是否可以使代码更高效一些
-   主流的 JavaScript 引擎都做了哪些优化
-   什么是引擎无法优化的，垃圾回收器（GC）是否能回收我所期望的东西

[![fast_memory](http://www.alloyteam.com/wp-content/uploads/2012/11/fast_memory.jpg)](http://www.alloyteam.com/wp-content/uploads/2012/11/fast_memory.jpg)

_加载\_\_快速的网站就像是一辆快速的跑车，需要用到特别定制的零件。图片来源: [dHybridcars](http://dhybridcars.com/toyota-hybrid/2013-scion-fr-s-sexy-sport-car/media/2013-scion-fr-s-speed-gauge-img-8/)._

编写高性能代码时有一些常见的陷阱，在这篇文章中，我们将展示一些经过验证的、更好的编写代码方式。

## **那么，JavaScript 在 V8 里是如何工作的？**

如果你对 JS 引擎没有较深的了解，开发一个大型 Web 应用也没啥问题，就好比会开车的人也只是看过引擎盖而没有看过车盖内的引擎一样。鉴于 Chrome 是我的浏览器首选，所以谈一下它的 JavaScript 引擎。V8 是由以下几个核心部分组成：

-   **一个基本的编译器**，它会在代码执行前解析 JavaScript 代码并生成本地机器码，而不是执行字节码或简单地解释它。这些代码最开始并不是高度优化的。
-   V8 将对象构建为**对象模型**。在 JavaScript 中对象表现为关联数组，但是在 V8 中对象被看作是隐藏的类，一个为了优化查询的内部类型系统。
-   **运行时分析器**监视正在运行的系统，并标识了 “hot” 的函数（例如花费很长时间运行的代码）。
-   **优化编译器**重新编译和优化那些被运行时分析器标识为 “hot” 的代码，并进行 “内联” 等优化（例如用被调用者的主体替换函数调用的位置）。
-   V8 支持**去优化**，这意味着优化编译器如果发现对于代码优化的假设过于乐观，它会舍弃优化过的代码。
-   V8 有个**垃圾收集器**，了解它是如何工作的和优化 JavaScript 一样重要。

## **垃圾回收**

垃圾回收是**内存管理的一种形式**，其实就是一个收集器的概念，尝试回收不再被使用的对象所占用的内存。在 JavaScript 这种垃圾回收语言中，应用程序中仍在被引用的对象不会被清除。

手动消除对象引用在大多数情况下是没有必要的。通过简单地把变量放在需要它们的地方（理想情况下，尽可能是局部作用域，即它们被使用的函数里而不是函数外层），一切将运作地很好。

[![robot-cleaner](http://www.alloyteam.com/wp-content/uploads/2012/11/robot-cleaner.jpg)](http://www.alloyteam.com/wp-content/uploads/2012/11/robot-cleaner.jpg)

_垃圾回收器尝试回收内存。图片来源: [Valtteri Mäki](http://www.flickr.com/photos/26817893@N05/2864644153/)._

在 JavaScript 中，是不可能强制进行垃圾回收的。你不应该这么做，因为垃圾收集过程是由运行时控制的，它知道什么是最好的清理时机。

### **“消除引用” 的误解**

网上有许多关于 JavaScript 内存回收的讨论都谈到 delete 这个关键字，虽然它可以被用来删除对象（map）中的属性（key），但有部分开发者认为它可以用来强制 “消除引用”。建议尽可能避免使用 delete，在下面的例子中 `delete o.x 的弊大于利，因为它改变了 o 的隐藏类，并使它成为一个 "慢对象"。`

```javascript
var o = { x: 1 };
delete o.x; // true
o.x; // undefined
```

你会很容易地在流行的 JS 库中找到引用删除 —— 这是具有语言目的性的。这里需要注意的是避免在运行时修改 "hot" 对象的结构。JavaScript 引擎可以检测出这种 “hot” 的对象，并尝试对其进行优化。如果对象在生命周期中其结构没有较大的改变，引擎将会更容易优化对象，而 delete 操作实际上会触发这种较大的结构改变，因此不利于引擎的优化。

对于 null 是如何工作也是有误解的。将一个对象引用设置为 null，并没有使对象变 “空”，只是将它的引用设置为空而已。使用 o.x= null 比使用 delete 会更好些，但可能也不是很必要。

```javascript
var o = { x: 1 };
o = null;
o; // null
o.x; // TypeError
```

如果此引用是当前对象的最后引用，那么该对象将被作为垃圾回收。如果此引用不是当前对象的最后引用，则该对象是可访问的且不会被垃圾回收。

另外需要注意的是，全局变量在页面的生命周期里是不被垃圾回收器清理的。无论页面打开多久，JavaScript 运行时全局对象作用域中的变量会一直存在。

```javascript
var myGlobalNamespace = {};
```

全局对象只会在刷新页面、导航到其他页面、关闭标签页或退出浏览器时才会被清理。函数作用域的变量将在超出作用域时被清理，即退出函数时，已经没有任何引用，这样的变量就被清理了。

### 经验法则

为了使垃圾回收器尽早收集尽可能多的对象，**不要 hold 着不再使用的对象**。这里有几件事需要记住：

-   正如前面提到的，在合适的范围内使用变量是手动消除引用的更好选择。即一个变量只在一个函数作用域中使用，就不要在全局作用域声明它。这意味着更干净省心的代码。
-   确保解绑那些不再需要的事件监听器，尤其是那些即将被销毁的 DOM 对象所绑定的事件监听器。
-   如果使用的数据缓存在本地，确保清理一下缓存或使用老化机制，以避免大量不被重用的数据被存储。

### 函数

接下来，我们谈谈函数。正如我们已经说过，垃圾收集的工作原理，是通过回收不再是访问的内存块（对象）。为了更好地说明这一点，这里有一些例子。

```javascript
function foo() {
    var bar = new LargeObject();
    bar.someCall();
}
```

当 foo 返回时，bar 指向的对象将会被垃圾收集器自动回收，因为它已没有任何存在的引用了。

对比一下：

```javascript
function foo() {
    var bar = new LargeObject();
    bar.someCall();
    return bar;
}
// somewhere else
var b = foo();
```

现在我们有一个引用指向 bar 对象，这样 bar 对象的生存周期就从 foo 的调用一直持续到调用者指定别的变量 b（或 b 超出范围）。

### 闭包（CLOSURES）

当你看到一个函数，返回一个内部函数，该内部函数将获得范围外的访问权，即使在外部函数执行之后。这是一个基本的[闭包](http://robertnyman.com/2008/10/09/explaining-javascript-scope-and-closures/) —— 可以在特定的上下文中设置的变量的表达式。例如：

```javascript
function sum(x) {
    function sumIt(y) {
        return x + y;
    }
    return sumIt;
}
// Usage
var sumA = sum(4);
var sumB = sumA(3);
console.log(sumB); // Returns 7
```

在 sum 调用上下文中生成的函数对象（sumIt）是无法被回收的，它被全局变量（sumA）所引用，并且可以通过 sumA (n) 调用。

让我们来看看另外一个例子，这里我们可以访问变量 largeStr 吗？

```javascript
var a = (function () {
    var largeStr = new Array(1000000).join("x");
    return function () {
        return largeStr;
    };
})();
```

是的，我们可以通过 a () 访问 largeStr，所以它没有被回收。下面这个呢？

```javascript
var a = (function () {
    var smallStr = "x";
    var largeStr = new Array(1000000).join("x");
    return function (n) {
        return smallStr;
    };
})();
```

我们不能再访问 largeStr 了，它已经是垃圾回收候选人了。【译者注：因为 largeStr 已不存在外部引用了】

### 定时器

最糟的内存泄漏地方之一是在循环中，或者在 setTimeout ()/setInterval () 中，但这是相当常见的。思考下面的例子:

```javascript
var myObj = {
    callMeMaybe: function () {
        var myRef = this;
        var val = setTimeout(function () {
            console.log("Time is running out!");
            myRef.callMeMaybe();
        }, 1000);
    },
};
```

如果我们运行 myObj.callMeMaybe (); 来启动定时器，可以看到控制台每秒打印出 “Time is running out!”。如果接着运行 `myObj =` `null，定时器依旧处于激活状态。为了能够持续执行，闭包将 myObj 传递给 setTimeout，这样 myObj 是无法被回收的。相反，它引用到 myObj 的因为它捕获了 myRef。这跟我们为了保持引用将闭包传给其他的函数是一样的。`

同样值得牢记的是，setTimeout/setInterval 调用 (如函数) 中的引用，将需要执行和完成，才可以被垃圾收集。

## 当心性能陷阱

永远不要优化代码，直到你真正需要。现在经常可以看到一些基准测试，显示 N 比 M 在 V8 中更为优化，但是在模块代码或应用中测试一下会发现，这些优化真正的效果比你期望的要小的多。

[![speed-trap](http://www.alloyteam.com/wp-content/uploads/2012/11/speed-trap.jpg)](http://www.alloyteam.com/wp-content/uploads/2012/11/speed-trap.jpg)

_做的过多还不如什么都不做。图片来源: [Tim Sheerman-Chase](http://www.flickr.com/photos/tim_uk/7717078488/sizes/c/in/photostream/)._

比如我们想要创建这样一个模块：

-   需要一个本地的数据源包含数字 ID
-   绘制包含这些数据的表格
-   添加事件处理程序，当用户点击的任何单元格时切换单元格的 css class

这个问题有几个不同的因素，虽然也很容易解决。我们如何存储数据，如何高效地绘制表格并且 append 到 DOM 中，如何更优地处理表格事件？

面对这些问题最开始（天真）的做法是使用对象存储数据并放入数组中，使用 jQuery 遍历数据绘制表格并 append 到 DOM 中，最后使用事件绑定我们期望地点击行为。

**注意：这不是你应该做的**

```javascript
var moduleA = (function () {
    return {
        data: dataArrayObject,
        init: function () {
            this.addTable();
            this.addEvents();
        },
        addTable: function () {
            for (var i = 0; i < rows; i++) {
                $tr = $("<tr></tr>");
                for (var j = 0; j < this.data.length; j++) {
                    $tr.append("<td>" + this.data[j]["id"] + "</td>");
                }
                $tr.appendTo($tbody);
            }
        },
        addEvents: function () {
            $("table td").on("click", function () {
                $(this).toggleClass("active");
            });
        },
    };
})();
```

这段代码简单有效地完成了任务。

但在这种情况下，我们遍历的数据只是本应该简单地存放在数组中的数字型属性 ID。有趣的是，直接使用 DocumentFragment 和本地 DOM 方法比使用 jQuery（以这种方式）来生成表格是更优的选择，当然，事件代理比单独绑定每个 td 具有更高的性能。

要注意虽然 jQuery 在内部使用 DocumentFragment，但是在我们的例子中，代码在循环内调用 append 并且这些调用涉及到一些其他的小知识，因此在这里起到的优化作用不大。希望这不会是一个痛点，但请务必进行基准测试，以确保自己代码 ok。

对于我们的例子，上述的做法带来了（期望的）性能提升。事件代理对简单的绑定是一种改进，可选的 DocumentFragment 也起到了助推作用。

```javascript
var moduleD = (function () {
    return {
        data: dataArray,
        init: function () {
            this.addTable();
            this.addEvents();
        },
        addTable: function () {
            var td, tr;
            var frag = document.createDocumentFragment();
            var frag2 = document.createDocumentFragment();
            for (var i = 0; i < rows; i++) {
                tr = document.createElement("tr");
                for (var j = 0; j < this.data.length; j++) {
                    td = document.createElement("td");
                    td.appendChild(document.createTextNode(this.data[j]));
                    frag2.appendChild(td);
                }
                tr.appendChild(frag2);
                frag.appendChild(tr);
            }
            tbody.appendChild(frag);
        },
        addEvents: function () {
            $("table").on("click", "td", function () {
                $(this).toggleClass("active");
            });
        },
    };
})();
```

接下来看看其他提升性能的方式。你也许曾经在哪读到过使用原型模式比模块模式更优，或听说过使用 JS 模版框架性能更好。有时的确如此，不过使用它们其实是为了代码更具可读性。对了，还有预编译！让我们看看在实践中表现的如何？

```javascript
moduleG = function () {};
moduleG.prototype.data = dataArray;
moduleG.prototype.init = function () {
    this.addTable();
    this.addEvents();
};
moduleG.prototype.addTable = function () {
    var template = _.template($("#template").text());
    var html = template({ data: this.data });
    $tbody.append(html);
};
moduleG.prototype.addEvents = function () {
    $("table").on("click", "td", function () {
        $(this).toggleClass("active");
    });
};
var modG = new moduleG();
```

事实证明，在这种情况下的带来的性能提升可以忽略不计。[模板和原型的选择](http://jsperf.com/second-pass)并没有真正提供更多的东西。也就是说，性能并不是开发者使用它们的原因，给代码带来的可读性、继承模型和可维护性才是真正的原因。

更复杂的问题包括[高效地在 canvas 上绘制图片](http://jsperf.com/canvas-drawimage-vs-webgl-drawarrays/6)和操作带或不带类型数组的像素数据。

在将一些方法用在你自己的应用之前，一定要多了解这些方案的基准测试。也许有人还记得 [JS 模版的 shoot-off](http://jsperf.com/dom-vs-innerhtml-based-templating/473) 和[随后的扩展版](http://jsperf.com/javascript-templating-shootoff-extended/26)。你要搞清楚基准测试不是存在于你看不到的那些虚拟应用，而是应该在你的实际代码中去测试带来的优化。

## V8 优化技巧

详细介绍了每个 V8 引擎的优化点在本文讨论范围之外，当然这里也有许多值得一提的技巧。记住这些技巧你就能减少那些性能低下的代码了。

-   特定模式可以使 V8 摆脱优化的困境，比如说 try-catch。欲了解更多有关哪些函数能或不能进行优化，你可以在 V8 的脚本工具 d8 中使用 --trace-opt file.js 命令。
-   如果你关心速度，尽量使你的函数职责单一，即确保变量（包括属性，数组，函数参数）只使用相同隐藏类包含的对象。举个例子，别这么干：  

    ```javascript
    function add(x, y) {
        return x + y;
    }
    add(1, 2);
    add("a", "b");
    add(my_custom_object, undefined);
    ```
-   不要加载未初始化或已删除的元素。如果这么做也不会出现什么错误，但是这样会使速度变慢。
-   不要使函数体过大，这样会使得优化更加困难。

更多内容可以去看 Daniel Clifford 在 Google I/O 的分享 [Breaking the JavaScript Speed Limit with V8](http://www.youtube.com/watch?v=UJPdhx5zTaw)。 [Optimizing For V8 — A Series](http://floitsch.blogspot.co.uk/2012/03/optimizing-for-v8-introduction.html) 也非常值得一读。

### 对象 VS 数组：我应该用哪个？

-   如果你想存储一串数字，或者一些相同类型的对象，使用一个数组。
-   如果你语义上需要的是一堆的对象的属性（不同类型的），使用一个对象和属性。这在内存方面非常高效，速度也相当快。
-   整数索引的元素，无论存储在一个数组或对象中，都要[比遍历对象的属性快得多](http://jsperf.com/performance-of-array-vs-object/3)。
-   对象的属性比较复杂：它们可以被 setter 们创建，具有不同的枚举性和可写性。数组中则不具有如此的定制性，而只存在有和无这两种状态。在引擎层面，这允许更多存储结构方面的优化。特别是当数组中存在数字时，例如当你需要容器时，不用定义具有 x,y,z 属性的类，而只用数组就可以了。

JavaScript 中对象和数组之间只有一个的主要区别，那就是数组神奇的 length 属性。如果你自己来维护这个属性，那么 V8 中对象和数组的速度是一样快的。

### 使用对象时的技巧

-   使用一个构造函数来创建对象。这将确保它创建的所有对象具有相同的隐藏类，并有助于避免更改这些类。作为一个额外的好处，它也[略快于 Object.create ()](http://jsperf.com/object-create-vs-constructor-vs-object-literal/7)
-   你的应用中，对于使用不同类型的对象和其复杂度（在合理的范围内：长原型链往往是有害的，呈现只有一个极少数属性的对象比大对象会快一点）是有没限制的。对于 “hot” 对象，尽量保持短原型链，并且少属性。

#### 对象克隆

对于应用程序开发人员，对象克隆是一个常见的问题。虽然各种基准测试可以证明 V8 对这个问题处理得很好，但仍要小心。复制大的东西通常是较慢的 —— 不要这么做。JS 中的 for..in 循环尤其糟糕，因为它有着恶魔般的规范，并且无论是在哪个引擎中，都可能永远不会比任何对象快。

当你一定要在关键性能代码路径上复制对象时，使用数组或一个自定义的 “拷贝构造函数” 功能明确地复制每个属性。这可能是最快的方式：

```javascript
function clone(original) {
    this.foo = original.foo;
    this.bar = original.bar;
}
var copy = new clone(original);
```

#### 模块模式中缓存函数

使用模块模式时缓存函数，可能会导致性能方面的提升。参阅下面的例子，因为它总是创建成员函数的新副本，你看到的变化可能会比较慢。

另外请注意，使用这种方法明显更优，不仅仅是依靠原型模式（经过 jsPerf 测试确认）。

[![Screen-Shot-2012-11-06-at-10.42.10](http://www.alloyteam.com/wp-content/uploads/2012/11/Screen-Shot-2012-11-06-at-10.42.10.png)](http://www.alloyteam.com/wp-content/uploads/2012/11/Screen-Shot-2012-11-06-at-10.42.10.png)

_使用模块模式或原型模式时的性能提升_

这是一个[原型模式与模块模式的性能对比测试](http://jsperf.com/prototypal-performance/12)：

```javascript
// Prototypal pattern
Klass1 = function () {};
Klass1.prototype.foo = function () {
    log("foo");
};
Klass1.prototype.bar = function () {
    log("bar");
}; // Module pattern
Klass2 = function () {
    var foo = function () {
            log("foo");
        },
        bar = function () {
            log("bar");
        };
    return {
        foo: foo,
        bar: bar,
    };
}; // Module pattern with cached functions
var FooFunction = function () {
    log("foo");
};
var BarFunction = function () {
    log("bar");
};
Klass3 = function () {
    return {
        foo: FooFunction,
        bar: BarFunction,
    };
}; // Iteration tests // Prototypal
var i = 1000,
    objs = [];
while (i--) {
    var o = new Klass1();
    objs.push(new Klass1());
    o.bar;
    o.foo;
} // Module pattern
var i = 1000,
    objs = [];
while (i--) {
    var o = Klass2();
    objs.push(Klass2());
    o.bar;
    o.foo;
} // Module pattern with cached functions
var i = 1000,
    objs = [];
while (i--) {
    var o = Klass3();
    objs.push(Klass3());
    o.bar;
    o.foo;
}
// See the test for full details
```

### 使用数组时的技巧

接下来说说数组相关的技巧。在一般情况下，**不要删除数组元素**，这样将使数组过渡到较慢的内部表示。当索引变得稀疏，V8 将会使元素转为更慢的字典模式。

#### 数组字面量

数组字面量非常有用，它可以暗示 VM 数组的大小和类型。它通常用在体积不大的数组中。

```javascript
// Here V8 can see that you want a 4-element array containing numbers:
var a = [1, 2, 3, 4];
// Don't do this:
a = []; // Here V8 knows nothing about the array
for (var i = 1; i <= 4; i++) {
    a.push(i);
}
```

#### 存储单一类型 VS 多类型

将混合类型（比如数字、字符串、undefined、true/false）的数据存在数组中绝不是一个好想法。例如 var arr = \[1, “1”, undefined, true, “true”]

[类型推断的性能测试](http://jsperf.com/type-inference-performance/2)

正如我们所看到的结果，整数的数组是最快的。

#### 稀疏数组与满数组

当你使用稀疏数组时，要注意访问元素将远远慢于满数组。因为 V8 不会分配一整块空间给只用到部分空间的数组。取而代之的是，它被管理在字典中，既节约了空间，但花费访问的时间。

[稀疏数组与满数组的测试](http://jsperf.com/sparse-arrays-vs-full-arrays)

#### 预分配空间 VS 动态分配

不要预分配大数组（如大于 64K 的元素），其最大的大小，而应该动态分配。在我们这篇文章的性能测试之前，请记住这只适用部分 JavaScript 引擎。

[![graph2](http://www.alloyteam.com/wp-content/uploads/2012/11/graph2.jpg)](http://www.alloyteam.com/wp-content/uploads/2012/11/graph2.jpg)

空字面量与预分配数组在不同的浏览器进行测试

Nitro (Safari) 对预分配的数组更有利。而在其他引擎（V8，SpiderMonkey）中，预先分配并不是高效的。

[预分配数组测试](http://jsperf.com/pre-allocated-arrays)

```javascript
// Empty array
var arr = [];
for (var i = 0; i < 1000000; i++) {
    arr[i] = i;
}
// Pre-allocated array
var arr = new Array(1000000);
for (var i = 0; i < 1000000; i++) {
    arr[i] = i;
}
```

## 优化你的应用

在 Web 应用的世界中，速度就是一切。没有用户希望用一个要花几秒钟计算某列总数或花几分钟汇总信息的表格应用。这是为什么你要在代码中压榨每一点性能的重要原因。

[![improving-apps](http://www.alloyteam.com/wp-content/uploads/2012/11/improving-apps.jpg)](http://www.alloyteam.com/wp-content/uploads/2012/11/improving-apps.jpg)

_图片来源: [Per Olof Forsberg](http://www.flickr.com/photos/perolofforsberg/6691744587/in/photostream/)._

理解和提高应用程序的性能是非常有用的同时，它也是困难的。我们推荐以下的步骤来解决性能的痛点：

-   测量：在您的应用程序中找到慢的地方（约 45％）
-   理解：找出实际的问题是什么（约 45％）
-   修复它！（约 10％）

下面推荐的一些工具和技术可以协助你。

### 基准化（BENCHMARKING）

有很多方式来运行 JavaScript 代码片段的基准测试其性能 —— 一般的假设是，基准简单地比较两个时间戳。这中模式被 [jsPerf](http://jsperf.com/) 团队指出，并在 [SunSpider](http://www.webkit.org/perf/sunspider/sunspider.html) 和 [Kraken](http://krakenbenchmark.mozilla.org/) 的基准套件中使用：

```javascript
var totalTime,
    start = new Date(),
    iterations = 1000;
while (iterations--) {
    // Code snippet goes here
}
// totalTime → the number of milliseconds taken
// to execute the code snippet 1000 times
totalTime = new Date() - start;
```

在这里，要测试的代码被放置在一个循环中，并运行一个设定的次数（例如 6 次）。在此之后，开始日期减去结束日期，就得出在循环中执行操作所花费的时间。

然而，这种基准测试做的事情过于简单了，特别是如果你想运行在多个浏览器和环境的基准。垃圾收集器本身对结果是有一定影响的。即使你使用 window.performance 这样的解决方案，也必须考虑到这些缺陷。

不管你是否只运行基准部分的代码，编写一个测试套件或编码基准库，JavaScript 基准其实比你想象的更多。如需更详细的指南基准，我强烈建议你阅读由 Mathias Bynens 和 John-David Dalton 提供的 [Javascript 基准测试](http://mathiasbynens.be/notes/javascript-benchmarking)。

### 分析（PROFILING）

Chrome 开发者工具为 [JavaScript 分析](https://developers.google.com/chrome-developer-tools/docs/profiles)有很好的支持。可以使用此功能检测哪些函数占用了大部分时间，这样你就可以去优化它们。这很重要，即使是代码很小的改变会对整体表现产生重要的影响。

[![profiling](http://www.alloyteam.com/wp-content/uploads/2012/11/profiling.jpg)](http://www.alloyteam.com/wp-content/uploads/2012/11/profiling.jpg)

Chrome 开发者工具的分析面板

分析过程开始获取代码性能基线，然后以时间线的形式体现。这将告诉我们代码需要多长时间运行。“Profiles” 选项卡给了我们一个更好的视角来了解应用程序中发生了什么。JavaScript CPU 分析文件展示了多少 CPU 时间被用于我们的代码，CSS 选择器分析文件展示了多少时间花费在处理选择器上，堆快照显示多少内存正被用于我们的对象。

利用这些工具，我们可以分离、调整和重新分析来衡量我们的功能或操作性能优化是否真的起到了效果。

[![profiling2](http://www.alloyteam.com/wp-content/uploads/2012/11/profiling2.jpg)](http://www.alloyteam.com/wp-content/uploads/2012/11/profiling2.jpg)

_“Profile” 选项卡展示了代码性能信息。_

一个很好的分析介绍，阅读 Zack Grossbart 的 [JavaScript Profiling With The Chrome Developer Tools](http://coding.smashingmagazine.com/2012/06/12/javascript-profiling-chrome-developer-tools/)。

提示：在理想情况下，若想确保你的分析并未受到已安装的应用程序或扩展的任何影响，可以使用`--user-data-dir <empty_directory>` 标志来启动 Chrome。在大多数情况下，这种方法优化测试应该是足够的，但也需要你更多的时间。这是 V8 标志能有所帮助的。

### 避免内存泄漏 ——3 快照技术

在谷歌内部，Chrome 开发者工具被 Gmail 等团队大量使用，用来帮助发现和排除内存泄漏。

[![devtools](http://www.alloyteam.com/wp-content/uploads/2012/11/devtools.jpg)](http://www.alloyteam.com/wp-content/uploads/2012/11/devtools.jpg)

_Chrome 开发者工具中的内存统计_

内存统计出我们团队所关心的私有内存使用、JavaScript 堆的大小、DOM 节点数量、存储清理、事件监听计数器和垃圾收集器正要回收的东西。推荐阅读 Loreena Lee 的 [“3 快照” 技术](https://docs.google.com/presentation/d/1wUVmf78gG-ra5aOxvTfYdiLkdGaR9OhXRnOlIcEmu2s/pub?start=false&loop=false&delayms=3000#slide=id.g1d65bdf6_0_0)。该技术的要点是，在你的应用程序中记录一些行为，强制垃圾回收，检查 DOM 节点的数量有没有恢复到预期的基线，然后分析三个堆的快照来确定是否有内存泄漏。

### 单页面应用的内存管理

单页面应用程序（例如 AngularJS，Backbone，Ember）的内存管理是非常重要的，它们几乎永远不会刷新页面。这意味着内存泄漏可能相当明显。移动终端上的单页面应用充满了陷阱，因为设备的内存有限，并在长期运行 Email 客户端或社交网络等应用程序。**能力愈大责任愈重。**

有很多办法解决这个问题。在 Backbone 中，确保使用 dispose () 来处理旧视图和引用（目前在 [Backbone(Edge)](https://github.com/documentcloud/backbone/blob/master/backbone.js#L1234)中可用）。这个函数是最近加上的，移除添加到视图 “event” 对象中的处理函数，以及通过传给 view 的第三个参数（回调上下文）的 model 或 collection 的事件监听器。dispose () 也会被视图的 remove () 调用，处理当元素被移除时的主要清理工作。Ember 等其他的库当检测到元素被移除时，会清理监听器以避免内存泄漏。

Derick Bailey 的一些明智的建议：

> 与其了解事件与引用是如何工作的，不如遵循的标准规则来管理 JavaScript 中的内存。如果你想加载数据到的一个存满用户对象的 Backbone 集合中，你要清空这个集合使它不再占用内存，那必须这个集合的所有引用以及集合内对象的引用。一旦清除了所用的引用，资源就会被回收。这就是标准的 JavaScript 垃圾回收规则。

在文章中，Derick 涵盖了许多使用 Backbone.js 时的常见[内存缺陷](http://lostechies.com/derickbailey/2012/03/19/backbone-js-and-javascript-garbage-collection/)，以及如何解决这些问题。

Felix Geisendörfer 的[在 Node 中调试内存泄漏](https://github.com/felixge/node-memory-leak-tutorial)的教程也值得一读，尤其是当它形成了更广泛 SPA 堆栈的一部分。

### 减少回流（REFLOWS）

当浏览器重新渲染文档中的元素时需要 重新计算它们的位置和几何形状，我们称之为[回流](https://www.youtube.com/watch?feature=player_embedded&v=ZHxbs5WEQzE)。回流会阻塞用户在浏览器中的操作，因此理解提升回流时间是非常有帮助的。

[![reflow](http://www.alloyteam.com/wp-content/uploads/2012/11/reflow.jpg)](http://www.alloyteam.com/wp-content/uploads/2012/11/reflow.jpg)

_回流时间图表_

你应该批量地触发回流或重绘，但是要节制地使用这些方法。尽量不处理 DOM 也很重要。可以使用 [DocumentFragment](http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-B63ED1A3)，一个轻量级的文档对象。你可以把它作为一种方法来提取文档树的一部分，或创建一个新的文档 “片段”。与其不断地添加 DOM 节点，不如使用文档片段后只执行一次 DOM 插入操作，以避免过多的回流。

例如，我们写一个函数给一个元素添加 20 个 div。如果只是简单地每次 append 一个 div 到元素中，这会触发 20 次回流。

```javascript
function addDivs(element) {
    var div;
    for (var i = 0; i < 20; i++) {
        div = document.createElement("div");
        div.innerHTML = "Heya!";
        element.appendChild(div);
    }
}
```

要解决这个问题，可以使用 DocumentFragment 来代替，我们可以每次添加一个新的 div 到里面。完成后将 DocumentFragment 添加到 DOM 中只会触发一次回流。

```javascript
function addDivs(element) {
    var div; // Creates a new empty DocumentFragment.
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < 20; i++) {
        div = document.createElement("a");
        div.innerHTML = "Heya!";
        fragment.appendChild(div);
    }
    element.appendChild(fragment);
}
```

可以参阅 [Make the Web Faster](https://developers.google.com/speed/articles/javascript-dom)，[JavaScript Memory Optimization](http://blog.tojicode.com/2012/03/javascript-memory-optimization-and.html) 和 [Finding Memory Leaks](http://gent.ilcore.com/2011/08/finding-memory-leaks.html)。

### JS 内存泄漏探测器

为了帮助发现 JavaScript 内存泄漏，谷歌的开发人员（(Marja Hölttä 和 Jochen Eisinger）开发了一种工具，它与 Chrome 开发人员工具结合使用，检索堆的快照并检测出是什么对象导致了内存泄漏。

[![leak](http://www.alloyteam.com/wp-content/uploads/2012/11/leak.jpg)](http://www.alloyteam.com/wp-content/uploads/2012/11/leak.jpg)

_一个 JavaScript 内存泄漏检测工具_

有完整的文章介绍了[如何使用这个工具](http://google-opensource.blogspot.de/2012/08/leak-finder-new-tool-for-javascript.html)，建议你自己到[内存泄漏探测器项目页面](http://code.google.com/p/leak-finder-for-javascript/)看看。

如果你想知道为什么这样的工具还没集成到我们的开发工具，其原因有二。它最初是在 Closure 库中帮助我们捕捉一些特定的内存场景，它更适合作为一个外部工具。

### V8 优化调试和垃圾回收的标志位

Chrome 支持直接通过传递一些标志给 V8，以获得更详细的引擎优化输出结果。例如，这样可以追踪 V8 的优化：

```html
"/Applications/Google Chrome/Google Chrome" --js-flags="--trace-opt --trace-deopt"
```

Windows 用户可以这样运行 chrome.exe --js-flags="--trace-opt --trace-deopt"

在开发应用程序时，下面的 V8 标志都可以使用。

-   trace-opt —— 记录优化函数的名称，并显示跳过的代码，因为优化器不知道如何优化。
-   trace-deopt —— 记录运行时将要 “去优化” 的代码。
-   trace-gc —— 记录每次的垃圾回收。

V8 的处理脚本用\*（星号）标识优化过的函数，用～（波浪号）表示未优化的函数。

如果你有兴趣了解更多关于 V8 的标志和 V8 的内部是如何工作的，强烈建议 阅读 Vyacheslav Egorov 的 [excellent post on V8 internals](http://mrale.ph/blog/2011/12/18/v8-optimization-checklist.html)。

### HIGH-RESOLUTION TIME 和 NAVIGATION TIMING API

[高精度时间](http://www.w3.org/TR/hr-time/)（HRT）是一个提供不受系统时间和用户调整影响的亚毫秒级高精度时间接口，可以把它当做是比 new Date 和 Date.now () 更精准的度量方法。这对我们编写基准测试帮助很大。

[![perfnow](http://www.alloyteam.com/wp-content/uploads/2012/11/perfnow.jpg)](http://www.alloyteam.com/wp-content/uploads/2012/11/perfnow.jpg)

高精度时间（HRT）提供了当前亚毫秒级的时间精度

目前 HRT 在 Chrome（稳定版）中是以 window.performance.webkitNow () 方式使用，但在 Chrome Canary 中前缀被丢弃了，这使得它可以通过 window.performance.now () 方式调用。Paul Irish 在 HTML5Rocks 上了[关于 HRT 更多内容](http://updates.html5rocks.com/2012/08/When-milliseconds-are-not-enough-performance-now)的文章。

现在我们知道当前的精准时间，那有可以准确测量页面性能的 API 吗？好吧，现在有个 [Navigation Timing API](http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/NavigationTiming/Overview.html) 可以使用，这个 API 提供了一种简单的方式，来获取网页在加载呈现给用户时，精确和详细的时间测量记录。可以在 console 中使用 window.performance.timing 来获取时间信息：

[![performance](http://www.alloyteam.com/wp-content/uploads/2012/11/performance.jpg)](http://www.alloyteam.com/wp-content/uploads/2012/11/performance.jpg)

_显示在控制台中的时间信息_

我们可以从上面的数据获取很多有用的信息，例如网络延时为 responseEnd - fetchStart，页面加载时间为 loadEventEnd - responseEnd，处理导航和页面加载的时间为 loadEventEnd - navigationStart。

正如你所看到的，perfomance.memory 的属性也能显示 JavaScript 的内存数据使用情况，如总的堆大小。

更多 Navigation Timing API 的细节，阅读 Sam Dutton 的 [Measuring Page Load Speed With Navigation Timing](http://www.html5rocks.com/en/tutorials/webperformance/basics/)。

### ABOUT:MEMORY 和 ABOUT:TRACING

Chrome 中的 about:tracing 提供了浏览器的性能视图，记录了 Chrome 的所有线程、tab 页和进程。

[![tracing](http://www.alloyteam.com/wp-content/uploads/2012/11/tracing.jpg)](http://www.alloyteam.com/wp-content/uploads/2012/11/tracing.jpg)

_`About:Tracing 提供了浏览器的性能视图`_

这个工具的真正用处是允许你捕获 Chrome 的运行数据，这样你就可以适当地调整 JavaScript 执行，或优化资源加载。

Lilli Thompson 有一篇[写给游戏开发者](http://www.html5rocks.com/en/tutorials/games/abouttracing/)的使用 about:tracing 分析 WebGL 游戏的文章，同时也适合 JavaScript 的开发者。

在 Chrome 的导航栏里可以输入 about:memory，同样十分实用，可以获得每个 tab 页的内存使用情况，对定位内存泄漏很有帮助。

## 总结

我们看到，**JavaScript 的世界中有很多隐藏的陷阱**，且并没有提升性能的银弹。只有把一些优化方案综合使用到（现实世界）测试环境，才能获得最大的性能收益。即便如此，了解引擎是如何解释和优化代码，可以帮助你调整应用程序。

**测量，理解，修复。**不断重复这个过程。

[![barometer](http://www.alloyteam.com/wp-content/uploads/2012/11/barometer.jpg)](http://www.alloyteam.com/wp-content/uploads/2012/11/barometer.jpg)

_图片来源: [Sally Hunter](http://www.flickr.com/photos/38891164@N02/4266609887/)_

谨记关注优化，但为了便利可以舍弃一些很小的优化。例如，有些开发者选择.forEach 和 Object.keys 代替 for 和 for..in 循环，尽管这会更慢但使用更方便。要保证清醒的头脑，知道什么优化是需要的，什么优化是不需要的。

同时注意，虽然 JavaScript 引擎越来越快，但下一个真正的瓶颈是 DOM。回流和重绘的减少也是重要的，所以必要时再去动 DOM。还有就是要关注网络，HTTP 请求是珍贵的，特别是移动终端上，因此要使用 HTTP 的缓存去减少资源的加载。

记住这几点可以保证你获取了本文的大部分信息，希望对你有所帮助！