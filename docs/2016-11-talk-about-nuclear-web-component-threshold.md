---
title: 漫谈 Nuclear Web 组件化入门篇
date: 2016-11-05
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/11/talk-about-nuclear-web-component-threshold/
---

<!-- {% raw %} - for jekyll -->

目前来看，团队内部前端项目已全面实施组件化开发。组件化的好处太多，如：按需加载、可复用、易维护、可扩展、少挖坑、不改组件代码直接切成服务器端渲染（如 [Nuclear](https://github.com/AlloyTeam/Nuclear) 组件化可以做到，大家叫同构)...  
怎么做到这么强大的优势，来回忆下以前见过的坑，或者现有项目里的坑。

CSS 层叠样式？保佑不要污染别的 HTML!  

* * *

在 web 前端，一般一个组件必须要有骨架 HTML 和装饰的 CSS 以及 JS 逻辑。而 CSS 要是可以是局部作用域那就再好不过了！就不用写长长的前缀了，浪费带宽不说，而且费劲。  
如

    .ui-popup-arrow-xx-xxxxx-xxxx-container {
     
    }

这回够长了吧，不会污染别的 HTML 了吧。真的太长了，没有办法，因为 CSS 不是局部的，怕污染其他的 HTML，规划好长长的 namespace、module 是以前的最佳实践。

怎么优雅绑定事件？只能定义在 window 下？  

* * *

如果 HTML 绑定的事件是局部作用域那就再好不过了！我真的见过模版代码里出现下面的代码：

```html
<div onclick="xxx()"></div>;
```

然后在 js 里找到了下面的代码：

````javascript

```html
<script>    window.xxx = function(){}</script>
````

;

````

要绑定的事件一多，得污染多少全局变量啊。所以还有的工程师这么干：

```html
<div onclick="ns.xxx()"></div>
<div onclick="ns.xxxx()"></div>
````

然后在 js 里找到了下面的代码：

````javascript

```html
<script>
        window.ns = {};       ns.xx = function(){}
             ns.xxx = function(){}
</script>
````

;

```

这里貌似比不设定 namespace 好很多，但是还是妥协的结果。一般希望能封装成组件，组件的 HTML 里绑定的事件就是组件内定义的事件，内聚内聚！！  
通过 js 动态绑定事件的坏处我以前专门写了一篇文章来阐述，主要是 lazy bind 会导致用户看到了页面，但是页面确无法响应用户的交互，这里不再阐述。

需求变更？找不到在哪改代码？  

-----------------

大型项目如游戏什么的为啥都是面向对象式的写法？如果一个组件刚好又能是一个 Class 那就再好不过，Class base 可以更方便地抽象现实世界的物体及其属性或者逻辑算法，所以甚至有些编程语言都是面向对象的 (这里逆向逻辑)，如 JAVA、C#... 整体过程式的代码对于大型项目几乎没法维护（如基于 jQuery 就能容易写出整体都是过程式的组织结构），整体 OO，局部过程式是可以接受的。

组件需要嵌套？只能复制粘贴原组件？  

--------------------

扁平无嵌套组件还是比较简单，对模板的字符串处理下，把绑定的事件全指向组件自身定义的方法，生命周期也好处理。在真正的业务里经常需要组件嵌套，这样也更利于复用。虽然大量模板引擎支持引用子模板、共享数据等，但是组件是有生命周期的，模板嵌套不能真正解决组件嵌套的问题。能支持组件嵌套并且声明式嵌套就那就再好不过了！

数据变了？重新生成 HTML 替换一下？  

-----------------------

怎么替换？先查找 dom？什么？你还在查找 dom？你还在背诵 CSS 选择器？替换一下？不能增量更新吗？或者 diff 一下吧？不要每次全部替换啊！

首屏太慢？以前抽象的组件没法复用？  

--------------------

什么？首屏太慢？改成直出（服务器渲染）？以前代码没法复用？要推翻重写？什么？怎么搞？排期？产品不给排期？需求没变为什么要给排期？

下面来看下 [Nuclear](https://github.com/AlloyTeam/Nuclear) 怎么解决上面问题。

![](http://www.alloyteam.com/wp-content/uploads/2016/11/QQ截图20161104161541.png)

install Nuclear  

------------------

```

npm install alloynuclear

````

Hello,Nuclear!  

-----------------

```javascript
var HelloNuclear = Nuclear.create({
    render: function () {
        return "<div>Hello , {{name}} !</div>";
    },
});
new HelloNuclear({ name: "Nuclear" }, "body");
````

内置了 mustache.js 无逻辑模板。

事件绑定  

* * *

```javascript
var EventDemo = Nuclear.create({
    clickHandler: function (evt, target, other1, other2) {
        //MouseEvent {isTrusted: true, screenX: 51, screenY: 87, clientX: 51, clientY: 21…}
        console.log(evt); //<div onclick="Nuclear.instances[0].clickHandler(event,this,'otherParameter1','otherParameter2')">Click Me!</div>
        console.log(target); //otherParameter1
        console.log(other1); //otherParameter2
        console.log(other2);
        alert("Hello Nuclear!");
    },
    render: function () {
        return "<div onclick=\"clickHandler(event,this,'otherParameter1','otherParameter2')\">Click Me!</div>";
    },
});
new EventDemo({ seen: true }, "body");
```

条件判断  

* * *

```javascript
var ConditionDemo = Nuclear.create({
    render: function () {
        return "{{#seen}}\
                    <div>\
                        you can see me\
                    </div>\
                {{/seen}}\
                {{^seen}}\
                    <div>\
                        yan can not see me\
                    </div>\
                {{/seen}}";
    },
});
var cd = new ConditionDemo({ seen: true }, "body");
setTimeout(function () {
    cd.option.seen = false;
}, 2000);
```

2 秒后改变 seen，dom 会自动变更。

循环  

* * *

```javascript
var LoopDemo = Nuclear.create({
    render: function () {
        return "<ul>{{#list}}<li>姓名:{{name}} 年龄:{{age}}</li>{{/list}}</ul>";
    },
});
var ld = new LoopDemo(
    {
        list: [
            { name: "dntzhang", age: 18 },
            { name: "vorshen", age: 17 },
        ],
    },
    "body"
);
setTimeout(function () {
    //增加
    ld.option.list.push({ name: "lisi", age: 38 });
}, 1000);
setTimeout(function () {
    //修改
    ld.option.list[0].age = 19;
}, 2000);
setTimeout(function () {
    //移除
    ld.option.list.splice(0, 1);
}, 3000);
```

Array 的变更也能监听到，能够自动触发 Dom 的变更。

局部 CSS  

* * *

````html
<body>
 
    <div>I'm other div!! my color is not red!!</div>
 
    
```html
<script src="../dist/nuclear.js"></script>
````

 

    

```html
<script type="text/javascript">
        var ScopedCSSDemo = Nuclear.create({
            clickHandler: function () {
                alert("my color is red!");
            },
            render: function () {
                return '<div onclick="clickHandler()">my color is red!</div>'
            },
            style: function () {
                return 'div { cursor:pointer; color:red }';
            }
        })
        //第三个参数true代表 增量（increment）到body里，而非替换（replace）body里的
        new ScopedCSSDemo ({ seen: true }, "body" ,true);
 
    </script>
```

 

</body>
```

组件外的 div 不会被组件内的 CSS 污染。

讨厌反斜杠？  

* * *

讨厌反斜杠可以使用 ES20XX template literals、或者 split to js、css 和 html 文件然后通过构建组装使用。也可以用 template 标签或者 textare 存放模板。

````html
<template id="myTemplate">
    <style>
        h3 {
            color: red;
        }
 
        button {
            color: green;
        }
    </style>
 
    <div>
        <div>
            <h3>TODO</h3>
            <ul>{{#items}}<li>{{.}}</li>{{/items}}</ul>
            <form onsubmit="add(event)">
                <input nc-id="textBox" value="{{inputValue}}" type="text">
                <button>Add #{{items.length}}</button>
            </form>
        </div>
    </div>
</template>
 

```html
<script>
    var TodoApp = Nuclear.create({
        install: function () {
            this.todoTpl = document.querySelector("#myTemplate").innerHTML;
        },
        add: function (evt) {
            evt.preventDefault();
            this.inputValue = "";
            this.option.items.push(this.textBox.value);
        },
        render: function () {
            return this.todoTpl;
        }
    });
 
    new TodoApp({ inputValue: "", items: [] }, "body");
 
</script>
````

````

组件嵌套  

-------

```html

```html
<script>
    var TodoList = Nuclear.create({
        render: function () {
            return '<ul> {{#items}} <li>{{.}}</li> {{/items}}</ul>';
        }
    });
 
</script>
````

 

```html
<script>
    var TodoTitle = Nuclear.create({
        render: function () {
            return '<h3>{{title}}</h3>';
        }
    });
</script>
```

 

```html
<script>
 
    var TodoApp = Nuclear.create({
        install: function () {
            //pass options to children
            this.childrenOptions = [{ title: "Todo" }, { items: [] }];
            this.length = 0;
        },
        add: function (evt) {
            evt.preventDefault();
 
            //this.nulcearChildren[1].option.items.push(this.textBox.value);
            //or
            this.list.option.items.push(this.textBox.value);
 
            this.length = this.list.option.items.length;
            this.textBox.value = "";
        },
        render: function () {
            //or  any_namespace.xx.xxx.TodoList 对应的 nc-constructor="any_namespace.xx.xxx.TodoList"
            return '<div>\
                        <child nc-constructor="TodoTitle"></child>\
                        <child nc-constructor="TodoList"  nc-name="list"></child>\
                        <form onsubmit="add(event)" >\
                          <input nc-id="textBox" value="{{inputValue}}" type="text"  />\
                          <button>Add #'+ this.length + '</button>\
                         </form>\
                   </div>';
        }
    });
 
    new TodoApp({ inputValue: "" }, "body");
</script>
```

````

通过在父对象的 install 里设置 this.childrenOptions 来把 option 传给子节点。

服务器端渲染  

---------

```html
function todo(Nuclear, server) {
    var Todo = Nuclear.create(
        {
            add: function (evt) {
                evt.preventDefault();
                this.option.items.push(this.textBox.value);
            },
            render: function () {
                return `<div>
                      <h3>TODO</h3>
                      <ul> {{#items}} <li>{{.}}</li> {{/items}}</ul>
                      <form onsubmit="add(event)" >
                          <input nc-id="textBox" type="text"  value="" />
                          <button>Add #{{items.length}}</button>
                      </form>
                    </div>`;
            },
            style: function () {
                return `h3 { color:red; }
                   button{ color:green;}`;
            },
        },
        {
            server: server,
        }
    );
    return Todo;
}
if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = todo;
} else {
    this.todo = todo;
}
````

通过第二个参数 server 来决定是服务器端渲染还是客户端渲染。server 使用的代码也很简单：

```javascript
var koa = require("koa");
var serve = require("koa-static");
var router = require("koa-route");
var app = koa();
var jsdom = require("jsdom");
var Nuclear = require("alloynuclear")(jsdom.jsdom().defaultView);
var Todo = require("./component/todo")(Nuclear, true);
app.use(serve(__dirname + "/component"));
app.use(
    router.get("/todos", function* () {
        var str = require("fs").readFileSync(
            __dirname + "/view/index.html",
            "utf8"
        );
        var todo = new Todo({ items: ["Nuclear2", "koa", "ejs"] });
        this.body = Nuclear.Tpl.render(str, {
            todo: todo.HTML,
        });
        Nuclear.destroy(todo);
    })
);
app.listen(3000);
```

浏览器端使用的代码：

````html
<!DOCTYPE html>
<html>
<head>
</head>
<body>
 {{{todo}}}
 
 
```html
<script src="./nuclear.js"></script>
````

```html
<script src="./todo.js"></script>
```

```html
<script>
    var Todo= todo(Nuclear);
    new Todo('body');
 </script>
```

</body>
</html>
```

这样，组件的代码不需要任何变更就可以在 server 和 client 同时使用。

Nuclear 如何做到同构的？  

* * *

内置三条管线如下所示：

![](http://www.alloyteam.com/wp-content/uploads/2016/11/图片11.png)

比如一般前后端分离的开发方式，仅仅会走中间那条管线。而同构的管线如下所示：

![](http://www.alloyteam.com/wp-content/uploads/2016/11/图片23.png)

这里前后后端会共用 option，所以不仅仅需要直出 HTML,option 也会一并支持给前端用来二次渲染初始一些东西。

Nuclear 优势  

* * *

1. 节约流量  
2. 提升用户体验  
3. 加载更加灵活  
4.Dom 查找几乎绝迹  
5. 搭积木一样写页面  
6. 提升代码复用性  
7. 可插拔的模板引擎  
8.Lazy CSS 首屏更轻松  
9.Nuclear 文件大小 6KB (gzip)  
10. 零行代码修改无缝切到同构直出  
...  
...

Nuclear Github  

* * *

<https://github.com/AlloyTeam/Nuclear>

<!-- {% endraw %} - for jekyll -->