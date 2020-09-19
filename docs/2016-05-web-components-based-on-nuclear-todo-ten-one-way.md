---
title: 基于 Nuclear 的 Web 组件 - Todo 的十一种写法
date: 2016-05-16
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/05/web-components-based-on-nuclear-todo-ten-one-way/
---

<!-- {% raw %} - for jekyll -->

### 刀耕火种

    刀耕火种是新石器时代残留的农业经营方式。又称迁移农业，为原始生荒耕作制。

```javascript
var TodoApp = Nuclear.create({
    add: function (evt) {
        evt.preventDefault();
        var textBox = this.node.querySelector("input");
        this.option.items.push(textBox.value);
    },
    installed: function () {
        var form = this.node.querySelector("form");
        form.addEventListener("submit", this.add.bind(this), false);
    },
    render: function () {
        return '<div>\
                 <h3>TODO</h3>\
                 <ul> {{#items}} <li>{{.}}</li> {{/items}}</ul>\
                  <form >\
                   <input type="text"  />\
                   <button>Add #{{items.length}}</button>\
                 </form>\
                </div>';
    },
});
new TodoApp({ items: [] }, "#container");
```

这种书写方式依赖延续了 jQuery 时代的思维方式：

-   js 里查找 dom
-   js 里绑定事件

在以前的文章里写过，如果不使用组件化编程，js 里查找 dom 以及在 js 里绑定事件可能会带来如下问题：

-   浪费带宽
-   用户反馈无响应
-   脚本错误
-   页面短暂错乱

上面的书写方式粗暴、原始、落后，即：刀耕火种。

### 石器锄耕

    “石器锄耕”是奴隶社会时期的主要耕作方式，这一时期农业已经有了很大的发展。

```html
var TodoApp = Nuclear.create(
    {
        onRefresh: function () {
            this.form.addEventListener(
                "submit",
                function (evt) {
                    evt.preventDefault();
                    this.option.items.push(this.textBox.value);
                }.bind(this),
                false
            );
        },
        render: function () {
            return '<div>\
                 <h3>TODO</h3>\
                 <ul> {{#items}} <li>{{.}}</li> {{/items}}</ul>\
                 <form nc-id="form" >\
                   <input nc-id="textBox" type="text"  />\
                   <button>Add #{{items.length}}</button>\
                 </form>\
               </div>';
        },
    },
    {
        diff: false,
    }
);
new TodoApp({ items: [] }, "#container");
```

会发现，查找 dom 的代码已销声匿迹。直接标记 nc-id，就自动挂载在 this 下。  
值得注意的是，传入了第二参数关闭了 DOM diff。关掉 diff 的结果就是，每次组件 HTML 会全部重新替换渲染，绑定的事件全部丢失，所以需要将绑定事件的代码写入 onRefresh 里，这样每次重新渲染都会再绑定一次。  
比刀耕火种先进一点：石器锄耕。

### 直捣黄龙

    黄龙：即黄龙府，辖地在今吉林一带，应该是指长春市农安县，为金人腹地。一直打到黄龙府。指捣毁敌人的巢穴。指杀敌取胜。

```html
var TodoApp = Nuclear.create({
    add: function (evt) {
        evt.preventDefault();
        this.option.items.push(this.textBox.value);
    },
    render: function () {
        return '<div>\
                 <h3>TODO</h3>\
                 <ul> {{#items}} <li>{{.}}</li> {{/items}}</ul>\
                 <form onsubmit="add(event)" >\
                   <input nc-id="textBox" type="text"  />\
                   <button>Add #{{items.length}}</button>\
                </form>\
               </div>';
    },
});
new TodoApp({ items: [] }, "#container");
```

会发现，查找 dom 和绑定的代码同时销声匿迹！！

-   需要使用 input，直接标记 nc-id 为 textBox，就可以 this.textBox 访问
-   需要绑定事件，直接在 HTML 内声明事件和回调 onsubmit="add (event)"

也可以通过 add (event,this) 拿到 event 和触发该事件的 dom 元素。

代码通俗简洁干净直接，目的直观明确。故：直捣黄龙。

### 子承父业

    宋·释道原《景德传灯录·利山和尚》：“僧问：不历僧只获法身，请师直指。师云：子承父业。”

```html
var TodoList = Nuclear.create({
    render: function () {
        return "<ul> {{#items}} <li>{{.}}</li> {{/items}}</ul>";
    },
});
var TodoApp = TodoList.create({
    add: function (evt) {
        evt.preventDefault();
        this.option.items.push(this.textBox.value);
    },
    render: function () {
        return (
            "<div>\
                 <h3>TODO</h3>" +
            this._super.render() +
            '<form  onsubmit="add(event)" >\
                   <input nc-id="textBox" type="text"  />\
                   <button>Add #{{items.length}}</button>\
                 </form>\
               </div>'
        );
    },
});
new TodoApp({ items: [] }, "#container");
```

TodoApp 不过是 TodoList 的炎黄子孙，故 TodoApp 可以通过 this.\_super 访问父辈。也可访问父辈任何方法。有人会说：“组合” 优于 “ 继承” 的。一定要明白：OOP 既能组合也能继承，是不冲突的。且看下面例子。

### 万夫一力

    明·刘基 《郁离子·省敌》：“万夫一力，天下无敌。”

```javascript
var TodoList = Nuclear.create({
    render: function () {
        return "<ul> {{#items}} <li>{{.}}</li> {{/items}}</ul>";
    },
});
var TodoApp = Nuclear.create({
    install: function () {
        this.todoList = new TodoList({ items: [] });
    },
    add: function (evt) {
        evt.preventDefault();
        this.todoList.option.items.push(this.textBox.value);
        this.refresh();
    },
    render: function () {
        return (
            "<div>\
                 <h3>TODO</h3>" +
            this.todoList.render() +
            '<form onsubmit="add(event)" >\
                   <input nc-id="textBox" type="text"  />\
                   <button>Add #' +
            this.todoList.option.items.length +
            "</button>\
                 </form>\
               </div>"
        );
    },
});
new TodoApp({}, "#todo2Container");
```

前一个例子的继承，这个例子是组合。不能说你的框架是 Class base 就不能使用组合，这是天大的误解。而我依稀记得极限编程关于面向对象设计的推论是：**优先使用对象组合，而不是类继承**。作为框架的设计者，虽然会有一些约束，但是如果连组合和继承都不能共存，那就是设计的最大败笔。  
使用 Nuclear 既能继承也能组合，关键看程序逻辑该怎么抽象和实现复杂度。

### 藕断丝连

    唐·孟郊《去妇》诗：“妾心藕中丝；虽断犹牵连。”

```javascript
var TodoList = Nuclear.create({
    render: function () {
        return "<ul> {{#items}} <li>{{.}}</li> {{/items}}</ul>";
    },
});
var TodoApp = Nuclear.create({
    install: function () {
        this.todoList = new TodoList(this.option);
    },
    add: function (evt) {
        evt.preventDefault();
        this.option.items.push(this.textBox.value);
    },
    render: function () {
        return (
            "<div>\
                 <h3>TODO</h3>" +
            this.todoList.render() +
            '<form  onsubmit="add(event)"  >\
                   <input nc-id="textBox" type="text"  />\
                   <button>Add #{{items.length}}</button>\
                 </form>\
               </div>'
        );
    },
});
new TodoApp({ items: [] }, "#container");
```

这个例子和上个例子的区别是：共用 option。option 的变更会自动更新依赖 option 的组件。

### 四海为家

     《汉书·高帝记》：“且夫天子以四海为家。”

```html
var TodoApp = Nuclear.create({
    add: function (evt) {
        evt.preventDefault();
        this.option.items.push(this.textBox.value);
    },
    render: function () {
        return '<div>\
             <h3>TODO</h3>\
             <ul> {{#items}} <li>{{.}}</li> {{/items}}</ul>\
             <form onsubmit="add(event)" >\
               <input nc-id="textBox" type="text"  />\
               <button>Add #{{items.length}}</button>\
             </form>\
           </div>';
    },
});
var todo = new TodoApp({ items: [] });
todo.setNuclearContainer("#container");
```

且看上面的 new TopApp 没传第二个参数指定容器。后面使用 setNuclearContainer 指定容器。这个场景还是比较常见，创建游离态组件，后续根据需要指定容器。AlloyLever 就是这么干的： <https://github.com/AlloyTeam/AlloyLever/blob/master/src/js/main.js>

### 如虎添翼

    三国·蜀·诸葛亮《心书·兵机》：“将能执兵之权，操兵之势，而临群下，臂如猛虎加之羽翼，而翱翔四海。”

```html
var TodoApp = Nuclear.create({
    add: function (evt) {
        evt.preventDefault();
        this.option.items.push(this.textBox.value);
    },
    render: function () {
        return '<div>\
                  <h3>TODO</h3>\
                  <ul> {{#items}} <li>{{.}}</li> {{/items}}</ul>\
                  <form onsubmit="add(event)" >\
                   <input nc-id="textBox" type="text"  />\
                   <button>Add #{{items.length}}</button>\
                 </form>\
               </div>';
    },
    style: function () {
        return "h3 { color:red; }\
                button{ color:green;}";
    },
});
var todoApp = new TodoApp({ items: [] }, "#container");
todoApp.option.items.push("Nuclear");
todoApp.option.items.push("Hello World!");
```

style 方法内的样式自会对自身生效，不会污染其他组件。可以操作对象实例 option，option 的变更会自动更新组件，属性设置 > 方法调用。  
双向绑定的好处以前写过一篇文章专门介绍，从上面的例子也能可出：

-   组件内部的代码更简洁
-   组件外部的代码更简洁

### 壁垒森严

    壁垒:古代军营四周的围墙;森严:整齐,严肃。原指军事戒备严密。现也用来比喻彼此界限划得很分明。

````html
<template id="myTemplate">
    <style scoped>
        h3 { color:red; }
        button{ color:green;}
    </style>
 
    <div>
        <div>
            <h3>TODO</h3>
            <ul>{{#items}}<li>{{.}}</li>{{/items}}</ul>
            <form onsubmit="add(event)">
                <input nc-id="textBox" type="text">
                <button>Add #{{items.length}}</button>
            </form>
        </div>
    </div>
</template>
 

```html
<script>
    var TodoApp = Nuclear.create({
        install:function() {
            this.todoTpl = document.querySelector("#myTemplate").innerHTML;
        },
        add: function (evt) {
            evt.preventDefault();
            this.option.items.push(this.textBox.value);
        },
        render: function () {
            return this.todoTpl;
        }
    });
 
    new TodoApp({ items: [] }, "#todoListContainer");
</script>
````

```

不用担心 template 标签的兼容性问题，Nuclear 帮你处理好了。支持所有现代浏览器 (包括 IE9+)。  
Nuclear 也在 js 里进行了动态插入了 template { display: none !important; }。但是 js 还没执行到且浏览器不兼容 template 的话，用户会看到一闪而过的模板原始代码。  
所以为了避免 IE9 一闪而过的模板原始代码直接显示，建议在 head 中加入。

```

<style>
    template { 
        display: none !important; 
    }
</style>

```

如果你像手 Q hybrid 应用那样只需要兼容 webkit 的话，天生支持 template，就不用加入上面的兼容样式。

### 鬼斧神工  

```

《庄子・达生》：“梓庆削木为鐻，鐻成，见者惊忧鬼神。”

````

```html
var TodoApp = Nuclear.create({
    add: function (evt) {
        evt.preventDefault();
        this.option.items.push(this.textBox.value);
    },
    render: function () {
        return `<div>
                  <h3>TODO</h3>
                  <ul> {{#items}} <li>{{.}}</li> {{/items}}</ul>
                  <form onsubmit="add(event)" >
                   <input nc-id="textBox" type="text"  />
                   <button>Add #{{items.length}}</button>
                 </form>
               </div>`;
    },
    style: function () {
        return `h3 { color:red; }
                button{ color:green;}`;
    },
});
````

使用 ES6 Template literals 解决多行文本问题。

### 人剑合一

    剑修者最高境界，人既是剑，剑既是人，剑随心发，人随剑杀

```html
var TodoApp = Nuclear.create({
    add: function (evt) {
        evt.preventDefault();
        this.option.items.push(this.textBox.value);
    },
    render: function () {
        return `<style scoped>
                  h3 { color:red; }
                  button{ color:green;}
                </style>
                <div>
                  <h3>TODO</h3>
                  <ul> {{#items}} <li>{{.}}</li> {{/items}}</ul>
                  <form onsubmit="add(event)" >
                   <input nc-id="textBox" type="text"  />
                   <button>Add #{{items.length}}</button>
                 </form>
                </div>`;
    },
});
```

使用 ES6 Template literals 解决多行文本问题，style 和 html 当然可以合在一起。

Nuclear 从出生，API 简单稳定，几乎没怎么变动，内部是实现在不断的完善，API 驱动非常重要，不能因为实现某些 API 困难而做任何妥协，比如让使用框架的着多传个参数、多调用一次方法，这都是设计的缺陷。

Nuclear 就是不妥协的结果。因为简单的设计，所以可以有很多强大的玩法，待续...

### 广而告之

Nuclear Github： <https://github.com/AlloyTeam/Nuclear>

加入 Nuclear，一起让组件化开发体验更加惬意、舒适..


<!-- {% endraw %} - for jekyll -->