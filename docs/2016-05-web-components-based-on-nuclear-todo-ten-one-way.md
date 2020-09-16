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

```javascript
var TodoApp = Nuclear.create({
    onRefresh: function () {   
        this.form.addEventListener("submit", function (evt) {
         &n
```


<!-- {% endraw %} - for jekyll -->