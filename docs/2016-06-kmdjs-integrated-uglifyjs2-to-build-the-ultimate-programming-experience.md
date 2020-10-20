---
title: kmdjs 集成 uglifyjs2 打造极致的编程体验
date: 2016-06-14
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/06/kmdjs-integrated-uglifyjs2-to-build-the-ultimate-programming-experience/
---

<!-- {% raw %} - for jekyll -->

### 回顾

[上篇](http://www.cnblogs.com/iamzhanglei/p/5581606.html)文章大概展示了 kmdjs0.1.x 时期的编程范式：  
如下面所示，可以直接依赖注入到 function 里，

```javascript
kmdjs.define("main", ["util.bom", "app.Ball", "util.dom.test"], function (
    bom,
    Ball,
    test
) {
    var ball = new Ball(0, 0, 28, 1, -2, "kmdjs");
    var vp = bom.getViewport();
});
```

也可以直接在代码里把 full namespace 加上来调用，如：

```javascript
kmdjs.define("main", ["util.bom", "app.Ball", "util.dom.test"], function () {
    var ball = new app.Ball(0, 0, 28, 1, -2, "kmdjs");
    var vp = util.bom.getViewport();
});
```

而且，在循环依赖的场景，因为执行顺序的问题，会导致第一种方式注入 undefined，所以循环依赖的情况下只能用 full namespace 的方式来调用。

这种编程体验虽然已经足够好，但是可以更好。怎样才算更好？

1.  不用依赖注入 function
2.  不用写 full namespace，自动匹配依赖

如下所示：

```javascript
kmdjs.define("main", ["util.bom", "app.Ball", "util.dom.test"], function () {
    var ball = new Ball(0, 0, 28, 1, -2, "kmdjs");
    var vp = bom.getViewport();
});
```

这就要借助 uglifyjs 能力，把 function 的字符串替换成带有 namespace 就可以实现上面的效果。

### uglifyjs 依赖分析和代码重构

```javascript
function fixDeps(fn, deps) {
    var U2 = UglifyJS; //uglify2不支持匿名转ast
    var code = fn.toString().replace("function", "function ___kmdjs_temp");
    var ast = U2.parse(code);
    ast.figure_out_scope();
    var nodes = [];
    ast.walk(
        new U2.TreeWalker(function (node) {
            if (node instanceof U2.AST_New) {
                var ex = node.expression;
                var name = ex.name;
                isInWindow(name) ||
                    isInArray(nodes, node) ||
                    isInScopeChainVariables(ex.scope, name) ||
                    nodes.push({ name: name, node: node });
            }
            if (node instanceof U2.AST_Dot) {
                var ex = node.expression;
                var name = ex.name;
                var scope = ex.scope;
                if (scope) {
                    isInWindow(name) ||
                        isInArray(nodes, node) ||
                        isInScopeChainVariables(ex.scope, name) ||
                        nodes.push({ name: name, node: node });
                }
            }
            if (node instanceof U2.AST_SymbolRef) {
                var name = node.name;
                isInWindow(name) ||
                    isInArray(nodes, node) ||
                    isInScopeChainVariables(node.scope, name) ||
                    nodes.push({ name: name, node: node });
            }
        })
    );
    var cloneNodes = [].concat(nodes); //过滤new nodes 中的symbo nodes
    for (var i = 0, len = nodes.length; i &lt; len; i++) {
        var nodeA = nodes[i].node;
        for (var j = 0, cLen = cloneNodes.length; j &lt; cLen; j++) {
            var nodeB = cloneNodes[j].node;
            if (nodeB.expression === nodeA) {
                nodes.splice(i, 1);
                i--;
                len--;
            }
        }
    }
    for (var i = nodes.length; --i >= 0; ) {
        var item = nodes[i],
            node = item.node,
            name = item.name;
        var fullName = getFullName(deps, name);
        var replacement;
        if (node instanceof U2.AST_New) {
            replacement = new U2.AST_New({
                expression: new U2.AST_SymbolRef({
                    name: fullName,
                }),
                args: node.args,
            });
        } else if (node instanceof U2.AST_Dot) {
            replacement = new U2.AST_Dot({
                expression: new U2.AST_SymbolRef({
                    name: fullName,
                }),
                property: node.property,
            });
        } else if (node instanceof U2.AST_SymbolRef) {
            replacement = new U2.AST_SymbolRef({
                name: fullName,
            });
        }
        var start_pos = node.start.pos;
        var end_pos = node.end.endpos;
        code = splice_string(
            code,
            start_pos,
            end_pos,
            replacement.print_to_string({
                beautify: true,
            })
        );
    }
    return code.replace("function ___kmdjs_temp", "function");
}
function getFullName(deps, name) {
    var i = 0,
        len = deps.length,
        matchCount = 0,
        result = [];
    for (; i &lt; len; i++) {
        var fullName = deps[i];
        if (fullName.split(".").pop() === name) {
            matchCount++;
            if (!isInArray(result, fullName)) result.push(fullName);
        }
    }
    if (matchCount > 1) {
        throw "the same name conflict: " + result.join(" and ");
    } else if (matchCount === 1) {
        return result[0];
    } else {
        throw " can not find module [" + name + "]";
    }
}
function splice_string(str, begin, end, replacement) {
    return str.substr(0, begin) + replacement + str.substr(end);
}
function isInScopeChainVariables(scope, name) {
    var vars = scope.variables._values;
    if (Object.prototype.hasOwnProperty.call(vars, "$" + name)) {
        return true;
    }
    if (scope.parent_scope) {
        return isInScopeChainVariables(scope.parent_scope, name);
    }
    return false;
}
function isInArray(arr, name) {
    var i = 0,
        len = arr.length;
    for (; i &lt; len; i++) {
        if (arr[i] === name) {
            return true;
        }
    }
    return false;
}
function isInWindow(name) {
    if (name === "this") return true;
    return name in window;
}
```

通过上面的 fixDeps，可以对代码就行变换。如：

```javascript
console.log(
    fixDeps(
        function (A) {
            var eee = m;
            var b = new A();
            var b = new B();
            var c = new C();
            var d = G.a;
        },
        ["c.B", "AAA.G", "SFSF.C", "AAAA.m"]
    )
);
```

输出：

```javascript
function (A) {
        var eee = AAAA.m;
        var b = new A();
        var b = new c.B();
        var c = new SFSF.C();
        var d = AAA.G.a;
}
```

这样，kmdjs 在执行模块 function 的时候，只需要 fixDeps 加上 full namespace 就行：

```javascript
function buildBundler() {
    var topNsStr = "";
    each(kmdjs.factories, function (item) {
        nsToCode(item[0]);
    });
    topNsStr += kmdjs.nsList.join("\n") + "\n\n";
    each(kmdjs.factories, function (item) {
        topNsStr += item[0] + " = (" + fixDeps(item[2], item[1]) + ")();\n\n";
    });
    if (kmdjs.buildEnd) kmdjs.buildEnd(topNsStr);
    return topNsStr;
}
```

build 出来的包，当然全都加上了 namespace。再也不用区分循环依赖和非循环依赖了～～～

### Github

上面的所有代码可以 Github 上找到：  
<https://github.com/kmdjs/kmdjs>


<!-- {% endraw %} - for jekyll -->