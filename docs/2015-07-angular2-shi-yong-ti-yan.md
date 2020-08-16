---
title: Angular2 使用体验
date: 2015-07-31
author: TAT.simplehuang
source_link: http://www.alloyteam.com/2015/07/angular2-shi-yong-ti-yan/
---

Angular2 开发者预览版出来已有一段时间，这个以速度与移动性能为目的的框架到底如何，今天我们来尝试一下。

在官网有一段号称 5 分钟入门的教程：

quick start： <https://angular.io/docs/js/latest/quickstart.html>

Angular 团队在这个版本上所做的改变可以用激进来形容，我们可以看得到无论是在代码书写亦或是结构组织上都有了非常大的差异，那么，既然 Angular1.x 已经如此成熟了，那为何我们还需要 Angular2 这样大的改变呢？

其实无论是 Angular2 还是 ReactNative，他们都肩负了前端许多的愿景，既然目前的前端环境调优已经基本达到巅峰，那么从原生、另一门语言的角度去审视改良只是我们突破与超越的小小尝试而已。

那么 Angular2 与 1.x 对比在写法与上手难度上到底有什么区别呢？

下面我将用 Angular2 来制作一个 Todo 示例应用：

在完成了初始化任务后，首先，确保我们的 TypeScript 编译监控处于启用状态，以下语句是作为 ts 文件修改编译监控：

    $ tsc --watch -m commonjs -t es5 --emitDecoratorMetadata app.ts

整理一下我们的思路，文件结构应该是这样的：

[![QQ 图片 20150731233155](http://www.alloyteam.com/wp-content/uploads/2015/07/QQ图片20150731233155.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/QQ图片20150731233155.png)

我们看到了熟悉的 app.js 文件，这是以 app.ts 编译过后的产物，app.ts:

```html
/// <reference path="../../typings/angular2/angular2.d.ts" />
import { Component, View, bootstrap, For, If } from "angular2/angular2";
import { TodoStore } from "services/todo/TodoStore";
@Component({
    selector: "app",
    injectables: [TodoStore], //注入TodoStore
})
@View({
    template: `<div class="page-header">
                <div class="form-group">
                 <div class="input-group">
                  <div class="input-group-addon">Todo</div>
                  <input type="text" class="form-control" 
                   placeholder="输入TodoItem" autofocus #newtodo 
                   (keyup)="add($event,newtodo)">
                 </div>
                </div>
                <ul class="list-group">
                 <li class="list-group-item" *for="#todo of todoStore.todoList">
                  <input type="checkbox" [checked]="todo.done" 
                   (click)="toggleTodoState(todo)"/> 
                  <span [class.done]="todo.done">{{todo.text}}</span>
                 </li>
                </ul>
               </div>`,
    directives: [For, If],
})
class AppComponent {
    todoStore: TodoStore;
    constructor(todoStore: TodoStore) {
        this.todoStore = todoStore;
    }
    add($event, newtodo) {
        if ($event.which === 13) {
            //判断是否回车键
            this.todoStore.add(newtodo.value);
            newtodo.value = "";
        }
    }
    toggleTodoState(todo) {
        todo.done = !todo.done; //反转done值
    }
}
bootstrap(AppComponent);
```

在当前版本中，Template 关键字已经被替换为 View 关键字，文档传送门：[View](https://angular.io/docs/js/latest/api/annotations/ViewAnnotation-class.html)

inde.html（墙内用户推荐将 traceur-runtime.js/system.src.js/angular2.dev.js 这几个文件保存在本地，这样可以不必忍受各种 404，超时加载）:

````html
<html>
<head>
    <title>Angular 2 Test</title>
    <link rel="stylesheet" type="text/css" href="styles/bootstrap.min.css">
    
```html
<script src="lib/traceur-runtime.js"></script>
````

    

```html
<script src="lib/system.src.js"></script>
```

    

```html
<script src="lib/angular2.dev.js"></script>
```

</head>
 
<body>
    <!-- The app component created in app.ts -->
    <app></app>
    
```html
<script>
    System.import('app');
    </script>
```

</body>
</html>
```

services/todo/todo.ts:

```css
export class TodoStore {
    constructor() {
        this.todoList = [];
    }
    add(item) {
        this.todoList.unshift({ text: item, done: false, style: "bg-success" });
    }
}
```

运行示例：

[![QQ 图片 20150731233925](http://www.alloyteam.com/wp-content/uploads/2015/07/QQ图片20150731233925.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/QQ图片20150731233925.png)