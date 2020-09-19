---
title: observejs 改善组件编程体验
date: 2015-05-17
author: TAT.dnt
source_link: http://www.alloyteam.com/2015/05/observejs-gai-shan-zu-jian-kai-fa-ti-yan/
---

<!-- {% raw %} - for jekyll -->

传送门  

* * *

observejs：<https://github.com/kmdjs/observejs>  
本文演示：<http://kmdjs.github.io/observejs/list/>  
本文代码：<https://github.com/kmdjs/observejs/tree/master/example/list>

写在前面  

* * *

javascript 的编程体验一直被改善，从未停止过。从最早的 Jscex (现在的 windjs), 改善异步编程体验。如今 ES6 的 Generator 改善异步编程体验。还有类似的 seajs、requirejs 提供极致的模块化开发体验；五花八门的 Class.js 改善面向对象编程体验；kmdjs 同时改善模块化编程、面向对象编程和构建体验；各式各样的 template.js 改善数据 -> 标记的体验。  
所有的改善，使代码更直观、友好，使程序易维护、可扩展。

最近使用 observejs 开发组件，发现有几大优点：

\- Dom 操作几乎绝迹  
-  专注于数据操作  
-  视图全自动更新  
-  性能棒棒的  
-  仅一行代码搞定上面四点

本文使用世界上最简单的 List 组件作为例子，大家通过该例子感受一下 observejs 组件开发改善之处。

组件代码  

* * *

```javascript
var List = function (option) {
    this.option = option;
    this.data = option.data;
    this.parent = document.querySelector(this.option.renderTo);
    this.tpl =
        '<div class="list-group" style="  text-align: center;width:<%=typeof width === "number"?width+"px":width%>;" >' +
        "            <% for ( var i = 0, len = data.length; i < len; i++) { %>" +
        "<%     var item = data[i]; %>" +
        '<a class="list-group-item <%=item.active ? "active" : ""%> <%=item.disabled ? "disabled" : ""%>" href="<%=item.href%>" target="<%=item.target?item.target:""%>"><%=item.text%></a>' +
        "<% } %>" +
        "</div>";
    this.render(); //list.render建议使用debounce来控制执行频率提高性能,或者和react一样在下次执行requestAnimFrame的时候更新
    observe(this, "option", this._debounce(this.render, 200));
};
List.prototype = {
    render: function () {
        if (this.node) this.parent.removeChild(this.node);
        this.parent.innerHTML += this._tpl(this.tpl, this.option);
        this.node = this.parent.lastChild;
    },
    clear: function () {
        this.data.size(0);
    },
    remove: function (index) {
        this.data.splice(index, 1);
    },
    add: function (item) {
        this.data.push(item);
    },
    edit: function (index, item) {
        this.data[index] = item;
    },
    disable: function (index) {
        this.data[index].disabled = true;
    },
    _tpl: function (str, data) {
        var tmpl =
                "var __p=[];" +
                "with(obj||{}){__p.push('" +
                str
                    .replace(/\\/g, "\\\\")
                    .replace(/'/g, "\\'")
                    .replace(/<%=([\s\S]+?)%>/g, function (match, code) {
                        return "'," + code.replace(/\\'/, "'") + ",'";
                    })
                    .replace(/<%([\s\S]+?)%>/g, function (match, code) {
                        return (
                            "');" +
                            code.replace(/\\'/, "'").replace(/[\r\n\t]/g, " ") +
                            "__p.push('"
                        );
                    })
                    .replace(/\r/g, "\\r")
                    .replace(/\n/g, "\\n")
                    .replace(/\t/g, "\\t") +
                '\');}return __p.join("");',
            func = new Function("obj", tmpl);
        return data ? func(data) : func;
    },
    _debounce: function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
};
```

ps: 模版引擎来自 [GMU](https://github.com/fex-team/GMU/blob/master/src/extend/parseTpl.js)，当然你可以使用任何你喜欢的额模版引擎

组件使用  

* * *

```javascript
var list = new List({
    data: [
        { text: "天下太贰", disabled: true, active: true },
        { text: "魔兽争霸", href: "##", target: "_blank" },
        { text: "魔兽世界" },
        { text: "坦克世界" },
        { text: "超级玛丽", disabled: true },
    ],
    width: 150,
    renderTo: "body",
});
list.edit(1, { text: "haha" });
list.add({ text: "aaaa" });
list.remove(2, 1);
list.disable(2);
list.remove(1);
//操作数据等于操作dom
list.data[0].text = "aaaaaaa";
```

组件分析  

* * *

其中仅需要一行

 observe(this, "option", this.\_debounce(this.render, 100));

就可以实现 option 的监听，option 包含组件的配置，以及数据，数据的变换都能够通知 render 方法的调用。

可以看到 render 方法摧毁了整个 dom，然后根据数据重新渲染 dom。所以控制 render 的执行频率变得尤其重要。

如果数据变化频繁，render 方法调用频繁，从而降低性能，所以，可以看到上面使用 debounce 控制 render 执行的频率。

如果不使用 debounce，也有第二种方案控制 render 频率。该方案和 react 一样，在 requestAnimateFrame 下次循环的时候去 check 组件是否要 re-render，需要的话就重新渲染。如果一个页面有一百个组件，都统一在 requestAnimateFrame 循环中 check 是否 re-render。

可以看到，只有 render 方法里有 dom 操作。clear、remove、add、edit、disable 都只关心数据，数据变了自动会通知到 render。

改善的地方在哪里？分两处地方：

   1\. 组件内部代码，内部的增删改查都只关注数据就行

   2\. 组件使用代码，操作数据等同于操作 dom。当然如果不使用赋值又没有 observejs 的情况下可以使用方法调用的方式，使得一行代码什么都能干，但是如果属性太多，你得定义非常多 setXXX 方法。但是你必须知道：赋值胜于 method (即【obj.name=xx】>【obj.setName (xx)】)、约定胜于配置：)。

如果你不是很适应 react 激进虚拟 dom 和 jsx，如果你反感 react 放弃了 HTML+CSS 大量优秀特性功能，如果以后 dom 性能好了，全世界都 i78 核 + ssd 了，那么 HTML+CSS 才是王道啊。

observejs 也许是你的另一选择，欢迎尝试，感谢对 observejs 提出那么多宝贵建议和意见的童鞋。

observejs：<https://github.com/kmdjs/observejs>  
本文演示：<http://kmdjs.github.io/observejs/list/>  
本文代码：<https://github.com/kmdjs/observejs/tree/master/example/list>


<!-- {% endraw %} - for jekyll -->