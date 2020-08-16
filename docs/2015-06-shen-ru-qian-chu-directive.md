---
title: 深入浅出 directive
date: 2015-06-30
author: TAT.mandyluo
source_link: http://www.alloyteam.com/2015/06/shen-ru-qian-chu-directive/
---

在 Angular, Vue.js 等 MVVM 框架中，都涉及到指令（directive）的概念，directive 实际上是一种针对 DOM 操作的抽象封装，并通过框架处理，将 DOM 操作逻辑与 DOM 元素进行自动化绑定，用一个简单的声明式语法简化了 DOM 操作逻辑中的 “_给元素命名”_，“_查询目标元素_”，“_进行 DOM 操作”_步骤。  

举个小例子，比如我们有一个 header 组件，它的 HTML 片段内容是：  

```html
<div class="header">
    <button>按钮</button>
</div>;
```

如果我们希望给这里的按钮添加一个高亮的 class，用 zepto 的代码是这样写的：

```javascript
var $ = require("zepto");
var $btn = $(".header button");
$btn.addClass("highlight");
```

由以上小例子可以看出，我们在写 JS 交互逻辑的时候，几乎所有的 JS 交互逻辑都像以下流程一样：

    初始化／数据变更／事件触发 --> 给目标元素命名（或者使用DOM树结构）--> 用选择器选中目标元素 --> 进行DOM操作

为此，封装 DOM 操作并自动化将 DOM 操作与元素绑定，可以减少 1/2 的交互逻辑代码（1 个步骤替换 3 步骤），甚至做到根据 DOM 操作与元素与及数据进行绑定，那就可以用一个绑定声明减少了全部的手动步骤。

根据这一思路，我们先实现 DOM 操作封装与与元素绑定  
我们使用 “binding-class” 作为动态添加 class 的绑定声明：

```html
<div class="header">
        <button binding-class="highlight:isOn">按钮</button>
</div>;
```

实现该绑定声明：

```javascript
// 绑定时依赖的数据
var data = {
    isOn: true,
};
// 封装DOM操作
function addClassOrRemove(el, clazz, cnd) {
    var $el = $(el);
    cnd ? $el.addClass(clazz) : $el.removeClass(clazz);
}
// 将DOM操作与元素绑定，返回操作步骤
function classBinding() {
    var tar = document.querySelector("[binding-class]");
    var dec = $(tar).attr("binding-class");
    var clazz = desc.split(":")[0];
    var field = desc.split(":")[1].trim();
    return function () {
        addClassOrRemove(tar, clazz, data[field]);
    };
}
// 进行绑定操作，获取绑定后的操作方法
var updateClassAction = classBinding();
// 初始化时更新
updateClassAction();
```

显然，在完成 DOM 操作与 DOM 元素的绑定后，以后的每次更新触发场景中一个步骤就可以完成 DOM 元素的更新。  
我们需要更懒惰一点，把手动触发更新的操作也省略了，如何？  
那么我们需要现实监听数据的变更，在不考虑兼容 IE9 以下浏览器的情况下，我们可以使用 ES5 的 `defineProperty` 方法来实现：

```javascript
var data = {};
var _isOn;
Object.defineProperty(data, "isOn", {
    get: function () {
        return _isOn;
    },
    set: function (nextValue) {
        _isOn = nextValue; // 在监听到数据变更后立即触发UI更新
        updateClassAction();
    },
});
```

这就是 MVVM 的数据绑定的实现，在框架帮助下完成以上一系列的绑定行为，要完成根据状态给按钮添加／移除高亮的 class，我们只需要这样一个属性标志：  

```html
<div class="header">
        <button binding-class="highlight: isOn">按钮</button>
</div>;
```

个人认为，使用属性声明的方式自动化绑定优于具名选择器的方式操作 DOM 元素。从开发效率角度，我们省去了 “_给元素命名”_／“_查询目标元素_”／“_进行 DOM 操作_” 这 3 步操作，从维护性角度，我们也省却了 “_知道文档结构”_／“_知道选择器标志_”2 个步骤。