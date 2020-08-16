---
title: 剖析 Babel——Babel 总览
date: 2017-04-06
author: TAT.dorsywang
source_link: http://www.alloyteam.com/2017/04/analysis-of-babel-babel-overview/
---

<!-- {% raw %} - for jekyll -->

**名词解释**

**AST：**Abstract Syntax Tree, 抽象语法树

**DI:** Dependency Injection, 依赖注入

\\===============================================================

## Babel 的解析引擎

Babel 使用的引擎是 babylon，babylon 并非由 babel 团队自己开发的，而是 fork 的 acorn 项目，acorn 的项目本人在很早之前在兴趣部落 1.0 在构建中使用，为了是做一些代码的转换，是很不错的一款引擎，不过 acorn 引擎只提供基本的解析 ast 的能力，遍历还需要配套的 acorn-travesal, 替换节点需要使用 acorn-，而这些开发，在 Babel 的插件体系开发下，变得一体化了

## Babel 的工作过程

Babel 会将源码转换 AST 之后，通过便利 AST 树，对树做一些修改，然后再将 AST 转成 code，即成源码。  
![](http://www.alloyteam.com/wp-content/uploads/2017/04/1490858489_75_w920_h326.png)

上面提到 Babel 是 fork acon 项目，我们先来看一个来自兴趣部落项目的，简单的 ACON 示例

## 一个简单的 ACON 转换示例

解决的问题

将

```javascript
Model.task("getData", function ($scope, dbService) {});
```

转换成

```javascript
Model.task("getData", ["$scope", "dbService", function ($scope, dbService) {}]);
```

熟悉 angular 的同学都能看到这段代码做的是对 DI 的自动提取功能，使用 ACON 手动撸代码

```javascript
var code = "let a = 1; // ....";
var acorn = require("acorn");
var traverse = require("ast-traverse");
var alter = require("alter");
var ast = acorn.parse(code);
var ctx = [];
traverse(ast, {
    pre: function (node, parent, prop, idx) {
        if (node.type === "MemberExpression") {
            var object = node.object;
            var objectName = object.name;
            var property = node.property;
            var propertyName = property.name; // 这里要进行替换
            if (
                objectName === "Model" &&
                (propertyName === "service" || propertyName === "task")
            ) {
                // 第一个就为serviceName 第二个是function
                var arg = parent.arguments;
                var serviceName = arg[0];
                var serviceFunc = arg[1];
                for (var i = 0; i < arg.length; i++) {
                    if (arg[i].type === "FunctionExpression") {
                        serviceFunc = arg[i];
                        break;
                    }
                }
                if (serviceFunc.type === "FunctionExpression") {
                    var params = serviceFunc.params;
                    var body = serviceFunc.body;
                    var start = serviceFunc.start;
                    var end = serviceFunc.end;
                    var funcStr = source.substring(start, end); //params里是注入的代码
                    var injectArr = [];
                    for (var j = 0; j < params.length; j++) {
                        injectArr.push(params[j].name);
                    }
                    var injectStr = injectArr.join('","');
                    var replaceString =
                        '["' + injectStr + '", ' + funcStr + "]";
                    if (params.length) {
                        ctx.push({
                            start: start,
                            end: end,
                            str: replaceString,
                        });
                    }
                }
            }
        }
    },
});
var distStr = alter(code, ctx);
console.log(distStr);
```

具体的流程如下  
![](http://www.alloyteam.com/wp-content/uploads/2017/04/1490860154_83_w739_h407.png)

可以从上面的过程看到 acorn 的特点

1.acorn 做为一款优秀的源码解析器

2.acorn 并不提供对 AST 树的修改能力

3.acorn 并不提供 AST 树的还原能力

4. 修改源码仍然靠源码修改字符串的方式

Babel 正是扩展了 acorn 的能力，使得转换变得更一体化

## Babel 的前序工作 ——Babylon、babel-types：code 转换为 AST

Babel 转 AST 树的过程涉及到语法的问题，转 AST 树一定有对就的语法，如果在解析过程中，出现了不符合 Babel 语法的代码，就会报错，Babel 转 AST 的解析过程在 Babylon 中完成

解析成 AST 树使用 babylon.parse 方法

```javascript
import babylon from "babylon";
let code = `
     let a = 1, b = 2;
     function sum(a, b){
          return a + b;
     }
 
    sum(a, b);
`;
let ast = babylon.parse(code);
console.log(ast);
```

结果如下  
![](http://www.alloyteam.com/wp-content/uploads/2017/04/1490861463_4_w294_h745.png)

AST 如下

![](http://www.alloyteam.com/wp-content/uploads/2017/04/1490862194_22_w989_h723.png)

### 关于 AST 树的详细定义 Babel 有文档

<https://github.com/babel/babylon/blob/master/ast/spec.md>

### 关于 AST 树的定义

```css
interface Node {
    type: string;
    loc: SourceLocation | null;
}
```

ast 中的节点都是继承自 Node 节点，Node 节点有 type 和 loc 两个属性，分别代表类型和位置，

其中位置定义如下

```css
interface SourceLocation {
    source: string | null;
    start: Position;
    end: Position;
}
```

位置节点又是由 source (源码 string), 开始位置，结束位置组成，start,end 又是 Position 类型

```css
interface Position {
    line: number; // >= 1
    column: number; // >= 0
}
```

节点又包含行号和列号

再看 Program 的定义

```css
interface Program <: Node {
  type: "Program";
  sourceType: "script" | "module";
  body: [ Statement | ModuleDeclaration ];
  directives: [ Directive ];
}
 
```

Program 是继承自 Node 节点，类型是 Program, sourceType 有两种，一种是 script，一种是 module，程序体是一个声明体 Statement 或者模块声明体 ModuleDeclaration 节点数组

### Babylon 支持的语法

Babel 或者说 Babylon 支持的语法现阶段是不可以第三方扩展的，也就是说我们不可以使用 babylon 做一些奇奇怪的语法，换句话说

**不要希望通过 babel 的插件体系来转换自己定义的语法规则**

那么 babylon 支持的语法有哪些呢，除了常规的 js 语法之外，babel 暂时只支持如下的语法

#### Plugins

-   estree
-   jsx
-   flow
-   doExpressions
-   objectRestSpread
-   decorators (Based on an outdated version of the Decorators proposal. Will be removed in a future version of Babylon)
-   classProperties
-   exportExtensions
-   asyncGenerators
-   functionBind
-   functionSent
-   dynamicImport

如果要真要自定义语法，可以在 babylon 的 plugins 目录下自定义语法

<https://github.com/babel/babylon/tree/master/src/plugins>

### Babel-types，扩展的 AST 树

上面提到的 babel 的 AST 文档中，并没有提到 JSX 的语法树，那么 JSX 的语法树在哪里定义呢，同样 jsx 的 AST 树也应该在这个文档中指名，然而 babel 团队还没精力准备出来

![](http://www.alloyteam.com/wp-content/uploads/2017/04/1490864143_70_w594_h331.png)

实际上，babel-types 有扩展 AST 树，babel-types 的 definitions 就是天然的文档，具体的源码定义在这里

![](http://www.alloyteam.com/wp-content/uploads/2017/04/1491462315_67_w572_h530-1.png)

举例一个 AST 节点如查是 JSXElement，那么它的定义可以在 jsx.js 中找到

```javascript
defineType("JSXElement", {
    builder: ["openingElement", "closingElement", "children", "selfClosing"],
    visitor: ["openingElement", "children", "closingElement"],
    aliases: ["JSX", "Immutable", "Expression"],
    fields: {
        openingElement: {
            validate: assertNodeType("JSXOpeningElement"),
        },
        closingElement: {
            optional: true,
            validate: assertNodeType("JSXClosingElement"),
        },
        children: {
            validate: chain(
                assertValueType("array"),
                assertEach(
                    assertNodeType(
                        "JSXText",
                        "JSXExpressionContainer",
                        "JSXSpreadChild",
                        "JSXElement"
                    )
                )
            ),
        },
    },
});
```

JSXElement 的 builder 字段指明要构造一个这样的节点需要 4 个参数，这四个参数分别对应在 fields 字段中，四个参数的定义如下

**openingElement:** 必须是一个 JSXOpeningElement 节点

**closingElement:** 必须是一个 JSXClosingElement 节点

**children:** 必须是一个数组，数组元素必须是 JSXText、JSXExpressionContainer、JSXSpreadChild 中的一种类型

**selfClosing:** 未指明验证

使用 babel-types.\[TYPE] 方法就可以构造这样的一个 AST 节点

```javascript
var types = require('babel-types');
 
var jsxElement = types.JSXElement(
            types.OpeningElement(...),
            types.JSXClosingElement(...),
            [...],
            true
);
 
```

构造了一个 jsxElement 类型的节点，这在 Babel 插件开发中是很重要的

同样验证是否一个 JSXElement 节点，也可以使用 babel-types.isTYPE 方法

比如

```javascript
var types = require("babel-types");
types.isJSXElement(astNode);
```

所以用 JSXElement 语法定义可以直接看该文件，简单做个梳理如下

![](http://www.alloyteam.com/wp-content/uploads/2017/04/1491464624_40_w1567_h726.png)

其中，斜体代表非终结符，粗体为终结符

## Babel 的中序工作 ——Babel-traverse、遍历 AST 树，插件体系

-   **遍历的方法**  
    一旦按照 AST 中的定义，解析成一颗 AST 树之后，接下来的工作就是遍历树，并且在遍历的过程中进行转换

Babel 负责便利工作的是 Babel-traverse 包，使用方法

```javascript
import traverse from "babel-traverse";
traverse(ast, {
    enter(path) {
        if (path.node.type === "Identifier" && path.node.name === "n") {
            path.node.name = "x";
        }
    },
});
```

遍历结点让我们可以获取到我们想要操作的结点的可能，在遍历一个节点时，存在 enter 和 exit 两个时刻，一个是进入结点时，这个时候节点的子节点还没触达，遍历子节点完成的时刻，会离开该节点，所以会有 exit 方法触发

访问节点，可以使用的参数是 path 参数，path 这个参数并不直接等同于节点，path 的属性有几个重要的组成，如下

![](http://www.alloyteam.com/wp-content/uploads/2017/04/1491466252_26_w899_h884.png)

举个栗子，如下的代码会将所有 function 变成另外的 function

```javascript
import traverse from "babel-traverse";
import types from "babel-types";
traverse(ast, {
    enter(path) {
        let node = path.node;
        if (types.isFunctionDeclaration(node)) {
            path.replaceWithSourceString(`function add(a, b) {
            return a + b;
         }`);
        }
    },
});
```

结果如下

```c
- function square(n) {
-   return n * n;
+ function add(a, b) {
+   return a + b;
  }
 
```

注意这里我们使用 babel-types 来判别 node 的类型，使用 path 的 replaceWithSourceString 方法来替换节点

但这里在 babel 的文档中也有提示，尽量少用 replaceWithSourceString 方法，该方法一定会调用 babylon.parse 解析代码，在遍历中解析代码，不如将解析代码放到遍历外面去做

其实上面的过程只是定义了如何遍历节点的时候转换节点

babel 将上面的便利操作对外开放出去了，这就构成了 babel 的插件体系

### babel 的插件体系 —— 结点的转换定义

babel 的插件就是定义如何转换当前结点，所以从这里可以看出 babel 的插件能做的事情，只能转换 ast 树，而不能在作用在前序阶段（语法分析）

这里不得不提下 babel 的插件体系是怎么样的，babel 的插件分为两部分

-   babel-preset-xxx
-   babel-plugin-xxx

preset: 预设，preset 和 plugin 其实是一个东西，preset 定义了一堆 plugin list

这里值得一提的是，preset 的顺序是倒着的，plugin 的顺序是正的，也就是说

preset: \['es2015', 'react'], 其实是先使用 react 插件再用 es2015

plugin: \['transform-react', 'transfrom-async-function'] 的顺序是正的遍历节点的时候先用 transform-react 再用 transfrom-async-function

### babel 插件编写

如果是自定义插件，还在开发阶段，要先在 babel 的配置文件指明 babel 插件的路径

```javascript
{
    "extensions": [".jsx", ".js"],
    "presets": ["react", "es2015"],
    "plugins": [ 
         [
            path.resolve(SERVER_PATH, "pourout/babel-plugin-transform-xxx"), 
            {}
         ],
 
     ]
}
 
```

babel 的自定义插件写法是多样，上面只是一个例子，可以传入 option，具体可以参考 babel 的配置文档

上面的代码写成 babel 的插件如下

```javascript
module.exports = function (babel) {
    var types = babel.types; // plugin contents
    return {
        visitor: {
            FunctionDeclaration: {
                enter: function (path) {
                    path.replaceWithSourceString(
                        `function add(a, b){ return a + b}`
                    );
                },
            },
        },
    };
};
```

Babel 的插件包 return 一个 function, 包含 babel 的参数，function 运行后返回一个包含 visitor 的对象，对象的属性是遍历节点匹配到该类型的处理方法，该方法依然包含 enter 和 exit 方法

### 一些 AST 树的创建方法

在写插件的过程中，经常要创建一些 AST 树，常用的方法如下

-   使用 babel-types 定义的创建方法创建  
    比如创建一个 var a = 1;

```go
types.VariableDeclaration(
     'var',
     [
        types.VariableDeclarator(
                types.Identifier('a'), 
                types.NumericLiteral(1)
        )
     ]
)
 
```

如果使用这样创建一个 ast 节点，肯定要累死了

-   使用 replaceWithSourceString 方法创建替换
-   使用 template 方法来创建 AST 结点  
    template 方法其实也是 babel 体系中的一部分，它允许使用一些模板来创建 ast 节点

比如上面的 var a = 1 可以使用

```javascript
var gen = babel.template(`var NAME = VALUE;`);
var ast = gen({
    NAME: t.Identifier("a"),
    VALUE: t.NumberLiteral(1),
});
```

当然也可以简单写

```javascript
var gen = babel.template(`var a = 1;`);
var ast = gen({});
```

接下来就可以用 path 的增、删、改操作进行转换了

## Babel 的后序工作 ——Babel-generator、AST 树转换成源码

Babel-generator 的工作就是将一颗 ast 树转回来，具体操作如下

```javascript
import generator from "babel-generator";
let code = generator(ast);
```

至此，代码转换就算完成了

## Babel 的外围工作 ——Babel-register，动态编译

通常我们都是使用 webpack 编译后代码再执行代码的，使用 Babel-register 允许我们不提前编译代码就可以运行代码，这在 node 端是非常便利的

在 node 端，babel-regiser 的核心实现是下面这两个代码

```javascript
function loader(m, filename) {
    m._compile(compile(filename), filename);
}
function registerExtension(ext) {
    var old =
        oldHandlers[ext] || oldHandlers[".js"] || require.extensions[".js"];
    require.extensions[ext] = function (m, filename) {
        if (shouldIgnore(filename)) {
            old(m, filename);
        } else {
            loader(m, filename, old);
        }
    };
}
```

通过定义 require.extensions 方法，可以覆盖 require 方法，这样调用 require 的时候，就可以走 babel 的编译，然后使用 m.\_compile 方法运行代码

但这个方法在 node 是不稳定的方法

## 结语

最后，就像 babylon 官网感觉 acorn 一样，babel 为前端界做了一件 awesome 的工作，有了 babel，不仅仅可以让我们的新技术的普及提前几年，我们可以通过写插件做更多的事情，比如做自定义规则的验证，做 node 的直出 node 端的适配工作等等。

#### 参考资料

babel 官网： [https://babeljs.io](https://babeljs.io/)

babel-github: <https://github.com/babel>

babylon: <https://github.com/babel/babylon>

acorn: <https://github.com/marijnh/acorn>

babel-ast 文档： <https://github.com/babel/babylon/blob/master/ast/spec.md>

babel 插件 cookbook: <https://github.com/thejameskyle/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md>

babel-packages: <https://github.com/babel/babel/tree/7.0/packages>

babel-types-definitions: <https://github.com/babel/babel/tree/7.0/packages/babel-types/src/definitions>

<!-- {% endraw %} - for jekyll -->