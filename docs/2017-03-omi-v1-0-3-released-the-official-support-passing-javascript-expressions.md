---
title: Omi v1.0.3 发布 – 正式支持传递 javascript 表达式
date: 2017-03-22
author: TAT.dnt
source_link: http://www.alloyteam.com/2017/03/omi-v1-0-3-released-the-official-support-passing-javascript-expressions/
---

<!-- {% raw %} - for jekyll -->

[原文链接](https://github.com/AlloyTeam/omi/blob/master/tutorial/js-expression.md)

## 写在前面

[Omi 框架](https://github.com/AlloyTeam/omi)可以通过在组件上声明 data-\* 把属性传递给子节点。  
Omi 从设计之初，就是往标准的 DOM 标签的标准传递方式靠齐。比如：

-   下划线自动转驼峰， data-page-index 传到子组件就变成 this.data.pageIndex
-   data-xx 传递到子节点全都变成字符串，如 data-page-index="1" 到子节点中 this.data.pageIndex 就是字符串 "1"  
    这样会有什么局限性和问题？如：
-   无法传递 JSON
-   无法传递 number 类型
-   无法传递 bool 类型

那么支持传递 javascript 表达式就能解决这些痛点。

废话不多说，来看神器的冒号。

## 冒号标记

看下面例子：

```html
import Hello from "hello.js";
Omi.makeHTML("Hello", Hello);
class App extends Omi.Component {
    render() {
        return `
        <div>
            <Hello :data-user="{ name : 'Dntzhang', favorite : 'Omi' }" />
        </div>
        `;
    }
}
Omi.render(new App(), "#container");
```

在 data-user 前面加上冒号即:data-user，就代表传递的是 js 表达式，够方便吧。

然后在 Hello 组件内就可以直接使用。

```javascript
class Hello extends Omi.Component {
    render() {
        return `
      <div>
        <h1>{{user.name}} love {{user.favorite}}.</h1>
      </div>
        `;
    }
}
```

你也可以在 hello 组件内打印出 this.data.user 试试。

## 传递其他类型

上面的例子展示了传递 JSON，其他类型也支持。比如：

```html
 <Hello :data-age="18" /
```


<!-- {% endraw %} - for jekyll -->