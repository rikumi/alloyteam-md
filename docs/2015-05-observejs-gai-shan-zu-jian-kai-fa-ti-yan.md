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
        '<div class="list-group" style="  text-align: center;width:<%=typeof width === "number"?width+"px":width%>;" >'
        + '            <% for ( var i = 0, len = data.length; i < len; i++) { %>'
        + '<%     var item = data[i]; %>'
        + '<a class="list-group-item <%=item.active ? "active" : ""%> <%=item.disabled ? "disabled" : ""%>" href="<%=item
```


<!-- {% endraw %} - for jekyll -->