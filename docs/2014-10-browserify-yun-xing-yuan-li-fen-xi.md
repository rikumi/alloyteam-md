---
title: browserify 运行原理分析
date: 2014-10-21
author: TAT.Cson
source_link: http://www.alloyteam.com/2014/10/browserify-yun-xing-yuan-li-fen-xi/
---

<!-- {% raw %} - for jekyll -->

目前对于前端工程师而言，如果只针对浏览器编写代码，那么很简单，只需要在页面的 script 脚本中引入所用 js 就可以了。

但是某些情况下，我们可能需要在服务端也跑一套类似的逻辑代码，考虑如下这些情景（以 node 作为后端为例）：

1.spa 的应用，需要同时支持服务端直出页面以及客户端 pjax 拉取数据渲染，客户端和服务器公用一套渲染模板并执行大部分类似的逻辑。

2. 一个通过 websocket 对战的游戏，客户端和服务端可能需要进行类似的逻辑计算，两套代码分别用于对用户客户端的展示以及服务端实际数值的计算。

这些情况下，很可能希望我们客户端代码的逻辑能够同时无缝运行在服务端。

**解决方法 1：UMD**

一种解决方法是使用 UMD 的方式，前端使用 requirejs，同时兼容 nodejs 的情况，例如：

```javascript
(function (window, factory) {
    if (typeod exports === 'object') {
 
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
 
        define(factory);
    } else {
 
        window.eventUtil = factory();
    }
})(this, function () {
    //module ...
});
```

**解决方案 2：使用 browserify，使代码能同时运行于服务端和浏览器端。**

**什么是 browserify？**

Browserify 可以让你使用类似于 node 的 require () 的方式来组织浏览器端的 Javascript 代码，通过预编译让前端 Javascript 可以直接使用 Node NPM 安装的一些库。

例如我们可以这样写 js，同时运行在服务端和浏览器中：  
mo2.js:  

```javascript
exports.write2 = function () {
    //write2
};
```

mo.js:

```javascript
var t = require("./mo2.js");
exports.write = function () {
    t.write2();
};
```

test.js:

```javascript
var mo = require("./mo.js");
mo.write();
```

代码可以完全以 node 的形式编写。

**原理分析：**

总体过程其实可以分为以下几个步骤：

**阶段 1：预编译阶段**

1. 从入口模块开始，分析代码中 require 函数的调用

2. 生成 AST

3. 根据 AST 找到每个模块 require 的模块名

4. 得到每个模块的依赖关系，生成一个依赖字典

5. 包装每个模块（传入依赖字典以及自己实现的 export 和 require 函数），生成用于执行的 js

**阶段 2：执行阶段**

从入口模块开始执行，递归执行所 require 的模块，得到依赖对象。

具体步骤分析：

1. 从入口模块开始，分析代码中 require 函数的调用

由于浏览器端并没有原生的 require 函数，所以所有 require 函数都是需要我们自己实现的。因此第一步我们需要知道一个模块的代码中，哪些地方用了 require 函数，依赖了什么模块。

browerify 实现的原理是为代码文件生成 AST，然后根据 AST 找到 require 函数依赖的模块。

2. 生成 AST

文件代码：

```javascript
var t = require("b");
t.write();
```

生成的 js 描述的 AST 为：

```javascript
{
    "type": "Program",
    "body": [
        {
            "type": "VariableDeclaration",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "name": "t"
                    },
                    "init": {
                        "type": "CallExpression",
                        "callee": {
                            "type": "Identifier",
                            "name": "require"
                        },
                        "arguments": [
                            {
                                "type": "Literal",
                                "value": "b",
                                "raw": "\"b\""
                            }
                        ]
                    }
                }
            ],
            "kind": "var"
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "CallExpression",
                "callee": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "Identifier",
                        "name": "t"
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "write"
                    }
                },
                "arguments": []
            }
        }
    ]
}
```

可以看到我们代码中调用的 require 函数，对应 AST 中的对象为上面 CallExpression 部分。

3. 根据 AST 找到每个模块 require 的模块名

生成了 AST 之后，我们下一部就需要根据 AST 找到 require 依赖的模块名了。再次看看上面生成的 AST 对象，要找到 require 的模块名，实质上就是要：

**找到 type 为 callExpression，callee 的 name 为 require 所对应的第一个 argument 的 value。**

关于生成 js 描述的 AST 以及解析 AST 对象，可以参考：

<https://github.com/ariya/esprima> 代码生成 AST

<https://github.com/substack/node-detective> 从 AST 中提取 reqiure

<https://github.com/Constellation/escodegen> AST 生成代码

4. 得到每个模块的依赖关系，生成一个依赖字典

从上面的步骤，我们已经可以获取到每个模块的依赖关系，因此可以生成一个以 id 为键的模块依赖字典，browerify 生成的字典示例如下（根据之前的范例代码生成）：

```javascript
{
    1:[
    function(require,module,exports){
        var t = require("./mo2.js");
        exports.write = function(){
            document.write("test1");
            t.write2();
        }
    },
    {"./mo2.js":2}
    ],
    2:[
    function(require,module,exports){
        exports.write2 = function(){
            document.write("=2=");
        }
    },
    {}
    ],
    3:[
    function(require,module,exports){
        var mo = require("./mo.js");
        mo.write();
    },
    {"./mo.js":1}
    ]}
```

字典记录了拥有那些模块，以及模块各自依赖的模块。

5. 包装每个模块（传入依赖字典以及自己实现的 export 和 require 函数），生成用于执行的 js

拥有了上面的依赖字典之后，我们相当于知道了代码中的依赖关系。为了让代码能执行，最后一步就是实现浏览器中并不支持的 export 和 require。因此我们需要对原有的模块代码进行包装，就像上面的代码那样，外层会传入自己实现的 export 和 require 函数。

然而，应该怎样实现 export 和 require 呢？

export 很简单，我们只要创建一个对象作为该模块的 export 就可以。

对于 require，其实我们已经拥有了依赖字典，所以要做的也很简单了，只需要根据传入的模块名，根据依赖字典找到所依赖的模块函数，然后执行，一直重复下去（递归执行这个过程）。

在 browerify 生成的 js 中，会添加以下 require 的实现代码，并传递给每个模块函数：

```javascript
(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw ((f.code = "MODULE_NOT_FOUND"), f);
            }
            var l = (n[o] = { exports: {} });
            t[o][0].call(
                l.exports,
                function (e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                },
                l,
                l.exports,
                e,
                t,
                n,
                r
            );
        }
        return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o &lt; r.length; o++) s(r[o]);
    return s;
});
```

我们主要关注这部分：

```javascript
var l = (n[o] = { exports: {} });
t[o][0].call(
    l.exports,
    function (e) {
        var n = t[o][1][e];
        return s(n ? n : e);
    },
    l,
    l.exports,
    e,
    t,
    n,
    r
);
```

其中 t 是传入的依赖字典（之前提到的那块代码），n 是一个空对象，用于保存所有新创建的模块（export 对象），对比之前的依赖字典来看就比较清晰了：

首先我们创建 module 对象（包含一个空对象 export），并分别把 module 和 export 传入模块函数作为浏览器自己实现的 module 和 export，然后，我们自己实现一个 require 函数，该函数获取模块名，并递归寻找依赖的模块执行，最后获取到所有被依赖到的模块对象，这个也是 browerify 生成的 js 在运行中的整个执行过程。

此文同步更新在：  
<http://www.cnblogs.com/Cson/p/4039144.html>


<!-- {% endraw %} - for jekyll -->