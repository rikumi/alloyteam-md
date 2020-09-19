---
title: Omi 框架 Store 体系的前世今生
date: 2017-03-30
author: TAT.dnt
source_link: http://www.alloyteam.com/2017/03/omi-frame-store-system-past-and-present/
---

<!-- {% raw %} - for jekyll -->

[原文链接](https://github.com/AlloyTeam/omi/tree/master/tutorial)

## 写在前面

先说说 Store 系统是干什么的！为什么要造这样一个东西？能够给系统架构带来什么？

当我们组件之间，拥有共享的数据的时候，经常需要进行组件通讯。在 Omi 框架里，父组件传递数据给子组件非常方便：

-   通过在组件上声明 data-\* 或者 :data-\* 传递给子节点
-   通过在组件上声明 data 或者 :data 传递给子节点（支持复杂数据类型的映射）
-   声明 group-data 把数组里的 data 传给一堆组件传递（支持复杂数据类型的映射）

注：上面带有冒号的是[传递 javascript 表达式](https://github.com/AlloyTeam/omi/blob/master/tutorial/js-expression.md)  

通过声明 onXxx="xxxx" 可以让子组件内执行父组件的方法。具体的如下图所示：

![](http://images2015.cnblogs.com/blog/105416/201703/105416-20170323100946955-1938506287.jpg)

如果还不明白的话，那... 我就直接上代码了：

```html
class Main extends Omi.Component {
    handlePageChange(index) {
        this.content.goto(index + 1);
        this.update();
    }
    render() {
        return `<div>
                    <h1>Pagination Example</h1>
                    <Content name="content" />
                    <Pagination
                        name="pagination"
                        :data-total="100"
                        :data-page-size="10"
                        :data-num-edge="1"
                        :data-num-display="4"　　　　　
                        onPageChange="handlePageChange" />
                </div>`;
    }
}
```

上面的例子中，

-   父组件的 render 方法里，通过 data-✽ 传递数据给子组件 Pagination
-   通过 onPageChange="handlePageChange" 实现子组件与父组件通讯

详细代码可以点击： [分页例子地址](https://github.com/AlloyTeam/omi/tree/master/example/pagination)

当然你也可以使用 event emitter /pubsub 库在组件之间通讯，比如这个只有 200b 的超小库 [mitt](https://github.com/developit/mitt) 。但是需要注意 mitt 兼容到 IE9+，Omi 兼容 IE8。但是，使用 event emitter /pubsub 库会对组件代码进行入侵，所以非常不建议在基础非业务组件使用这类代码库。

虽然组件通讯非常方便，但是在真实的业务场景中，不仅仅是父子、爷孙、爷爷和堂兄、嫂子和堂弟...  
onXxx="xxxx" 就显得无能为力，力不从心了，各种数据传递、组件实例互操作、 emitter/pubsub 或者循环依赖，让代码非常难看且难以维护。所以：

```go
Omi.Store是用来管理共享数据以及共享数据的逻辑 。
 
```

Omi Store 使用足够简便，对架构入侵性极极极小 (3 个极代表比极小还要小)。下面一步一步从 todo 的例子看下 Store 体系怎么使用。

### 定义 Omi.Store

Omi.Store 是基类，我们可以继承 Omi.Store 来定义自己的 Store，比如下面的 TodoStore。

```javascript
import Omi from "omi";
class TodoStore extends Omi.Store {
    constructor(data, isReady) {
        super(isReady);
        this.data = Object.assign(
            {
                items: [],
                length: 0,
            },
            data
        );
        this.data.length = this.data.items.length;
    }
    add(value) {
        this.data.items.push(value);
        this.data.length = this.data.items.length;
        this.update();
    }
    clear() {
        this.data.items.length = 0;
        this.data.length = 0;
        this.update();
    }
}
export default TodoStore;
```

TodoStore 定义了数据的基本格式和数据模型的逻辑。  
比如 this.data 就是数据的基本格式：

```javascript
{
    items:[],
    length:0
}
 
```

add 和 clear 就是共享数据相关的逻辑。

值得注意的是，在 add 和 clear 方法里都有调用 this.update (); 这个是用来更新组件的，this.update 并不会更新所有组件。但是他到底会更新哪些组件呢？等讲到 store 的 addView 方法你就明白了。

### 创建 Omi.Store

通过 new 关键字来使用 TodoStore 对象的实例。

```javascript
let store = new TodoStore({ /* 初始化数据 */ ，/* 数据是否准备好 */  })
 
```

上面可以传入一些初始化配置信息，store 里面便包含了整个应用程序共享的状态数据以及贡献数据逻辑方法 (add,clear)。

当然，这些初始化配置信息可能是异步拉取的。所以，有两种方法解决异步拉取 store 配置的问题：

-   拉取数据，然后 new TodoStore ()，再 Omi.render
-   先 let store = new TodoStore (), 再 Omi.render, 组件内部监听 store.ready，拉取数据更改 store 的 data 信息，然后执行 store.beReady ()

### 根组件注入 store

为了让组件树能够使用到 store，可以通过 Omi.render 的第三个参数给根组件注入 store:

```javascript
Omi.render(new Todo(), "body", {
    store: store,
});
```

当然 ES2015 已经允许你这样写了:

```javascript
Omi.render(new Todo(), "body", {
    store,
});
```

两份代码同样的效果。

通过 Omi.render 注入之后，在组件树的**所有组件**都可以通过 this.$store 访问到 store。

### 利用 beforeRender

为什么要说 beforeRender 这个函数？ 因为通过 beforeRender 转换 store 的 data 到组件的 data，这样 store 的数据和组件的数据就解耦开了。

beforeRender 是生命周期的一部分。且看下面这张图:

![beforeRender](http://images2015.cnblogs.com/blog/105416/201703/105416-20170322083548924-1871234168.jpg)

不管是实例化或者存在期间，在 render 之前，会去执行 beforeRender 方法。所以可以利用该方法写 store 的 data 到组件 data 的转换逻辑。比如：

```html
import Omi from "../../src/index.js";
import List from "./list.js";
Omi.makeHTML("List", List);
class Todo extends Omi.Component {
    constructor(data) {
        super(data);
    }
    install() {
        this.$store.addView(this);
    }
    beforeRender() {
        this.data.length = this.$store.data.items.length;
    }
    add(evt) {
        evt.preventDefault();
        let value = this.data.text;
        this.data.text = "";
        this.$store.add(value);
    }
    style() {
        return `
        h3 { color:red; }
        button{ color:green;}
        `;
    }
    clear() {
        this.data.text = "";
        this.$store.clear();
    }
    handleChange(evt) {
        this.data.text = evt.target.value;
    }
    render() {
        return `<div>
                    <h3>TODO</h3>
                    <button onclick="clear">Clear</button>
                    <List name="list" data="$store.data" />
                    <form onsubmit="add" >
                        <input type="text" onchange="handleChange"  value="{{text}}"  />
                        <button>Add #{{length}}</button>
                    </form>
 
                </div>`;
    }
}
export default Todo;
```

为什么要去写 beforeRender 方法？因为 render 只会使用 this.data 去渲染页面而不会去使用 this.$store.data，所以需要把数据转移到组件的 this.data 下。这样组件既能使用自身的 data，也能使用全局放 this.$store.data 了，不会耦合在一起。

注意看上面的：

```javascript
    install(){
        this.$store.addView(this)
    }
 
```

通过 addView 可以让 store 和 view（也就是组件的实例）关联起来，以后 store 执行 update 方法的时候，关联的 view 都会自动更新！

再看上面的子组件声明:

```html
<List name="list" data="$store.data" />;
```

这样相当于把 this.$store.data 传递给了 List 组件。所以在 List 内部，就不再需要写 beforeRender 方法转换了。

```javascript
class List extends Omi.Component {
    constructor(data) {
        super(data);
    }
    render() {
        return ` <ul> {{#items}} <li>{{.}}</li> {{/items}}</ul>`;
    }
}
```

    这里需要特别强调，不需要把所有的数据提取到store里，只提取共享数据就好了，组件自身的数据还是放在组件自己进行管理。
     

## 异步数据

通常，在真实的业务需求中，数据并不是马上能够拿到。所以这里模拟的异步拉取的 todo 数据：

```javascript
let todoStore = new TodoStore();
setTimeout(() => {
    todoStore.data.items = ["omi", "store"];
    todoStore.data.length = todoStore.data.items.length;
    todoStore.beReady();
}, 2000);
```

上面的 beReady 就是代码已经准备就绪，在组件内部可以监听 ready 方法：

```javascript
class Todo extends Omi.Component {
    constructor(data) {
        super(data)
    }
 
    install(){
        this.$store.addView(this)
    }
 
    installed(){
        this.$store.ready(()=>this.$store.update())
    }
 
    add (evt) {
        evt.preventDefault()
        if(!this.$store.isReady){
            return
        }
        let value = this.data.text
        this.data.text = ''
        this.$store.add(value)
    }
 
```

可以看到上面的 add 方法可以通过 this.$store.isReady 获取组件 store 是否准备就绪。

你可以通过 Omi.createStore 快捷创建 store。如:

```javascript
export default Omi.createStore({
    data: {
        items: ["omi", "store"],
    },
    methods: {
        add: function (value) {
            this.data.items.push(value);
            this.data.length = this.data.items.length;
            this.update();
        },
        clear: function () {
            this.data.items.length = 0;
            this.data.length = 0;
            this.update();
        },
    },
});
```

也支持省略 Omi.createStore 的形式创建 store。如:

```javascript
export default {
    data: {
        items: ["omi", "store"],
    },
    methods: {
        add: function (value) {
            this.data.items.push(value);
            this.data.length = this.data.items.length;
            this.update();
        },
        clear: function () {
            this.data.items.length = 0;
            this.data.length = 0;
            this.update();
        },
    },
};
```

## Omi Store update

Omi Store 的 update 方法会更新所有关联的视图。  
Omi Store 体系以前通过 addView 进行视图收集，store 进行 update 的时候会调用组件的 update。

与此同时，Omi Store 体系也新增了 addSelfView 的 API。

-   addView 收集该组件视图，store 进行 update 的时候会调用组件的 update
-   addSelfView 收集该组件本身的视图，store 进行 update 的时候会调用组件的 updateSelf

当然，store 内部会对视图进行合并，比如 addView 里面加进去的所有视图有父子关系的，会把子组件去掉。爷孙关系的会把孙组件去掉。addSelfView 收集的组件在 addView 里已经收集的也去进行合并去重，等等一系列合并优化。

## 源码地址

-   更为详细的代码可以[点击这里](https://github.com/AlloyTeam/omi/tree/master/example/todo-store)
-   异步拉取的代码可以[点击这里](https://github.com/AlloyTeam/omi/tree/master/example/todo-store-async)

## 相关

-   Omi 官网 [omijs.org](http://www.omijs.org/)
-   Omi 的 Github 地址 <https://github.com/AlloyTeam/omi>
-   如果想体验一下 Omi 框架，可以访问 [Omi Playground](http://alloyteam.github.io/omi/example/playground/)
-   如果想使用 Omi 框架或者开发完善 Omi 框架，可以访问 [Omi 使用文档](https://github.com/AlloyTeam/omi/tree/master/docs#omi使用文档)
-   如果你想获得更佳的阅读体验，可以访问 [Docs Website](http://alloyteam.github.io/omi/website/docs.html)
-   如果你懒得搭建项目脚手架，可以试试 [omi-cli](https://github.com/AlloyTeam/omi/tree/master/cli)
-   如果你有 Omi 相关的问题可以 [New issue](https://github.com/AlloyTeam/omi/issues/new)
-   如果想更加方便的交流关于 Omi 的一切可以加入 QQ 的 Omi 交流群 (256426170)

![](http://images2015.cnblogs.com/blog/105416/201702/105416-20170208095745213-1049686133.png)


<!-- {% endraw %} - for jekyll -->