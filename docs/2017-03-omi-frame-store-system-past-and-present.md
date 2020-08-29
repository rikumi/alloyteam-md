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
import Omi from 'omi'
 
class TodoStore extends Omi.Store {
    constructor(data , isReady) {
        super(isReady)
 
   
```


<!-- {% endraw %} - for jekyll -->