---
title: 致我们终将组件化的 Web
date: 2015-11-24
author: TAT.bizai
source_link: http://www.alloyteam.com/2015/11/we-will-be-componentized-web-long-text/
---

<!-- {% raw %} - for jekyll -->

这篇文章将从两年前的一次技术争论开始。争论的聚焦就是下图的两个目录分层结构。我说按模块划分好，他说你傻逼啊，当然是按资源划分。

[![mulu_left](http://www.alloyteam.com/wp-content/uploads/2015/11/mulu_left.png)](http://www.alloyteam.com/wp-content/uploads/2015/11/mulu_left.png) 《=》[![mulu_right](http://www.alloyteam.com/wp-content/uploads/2015/11/mulu_right.png)](http://www.alloyteam.com/wp-content/uploads/2015/11/mulu_right.png)

” 按模块划分 “目录结构，把当前模块下的所有逻辑和资源都放一起了，这对于多人独自开发和维护个人模块不是很好吗？当然了，那争论的结果是我乖乖地改回主流的” 按资源划分 “ 的目录结构。因为，没有做到 JS 模块化和资源模块化，仅仅物理位置上的模块划分是没有意义的，只会增加构建的成本而已。

虽然他说得好有道理我无言以对，但是我心不甘，等待他日前端组件化成熟了，再来一战！

而今天就是我重申正义的日子！只是当年那个跟你撕逼的人不在。

**##   模块化的不足**

     模块一般指能够独立拆分且通用的代码单元。由于 JavaScript 语言本身没有内置的模块机制（ES6 有了！！），我们一般会使用 CMD 或 ADM 建立起模块机制。现在大部分稍微大型一点的项目，都会使用 requirejs 或者 seajs 来实现 JS 的模块化。多人分工合作开发，其各自定义依赖和暴露接口，维护功能模块间独立性，对于项目的开发效率和项目后期扩展和维护，都是是有很大的帮助作用。

     但，麻烦大家稍微略读一下下面的代码

```javascript
require([
    'Tmpl!../tmpl/list.html','lib/qqapi','module/position','module/refresh','module/page','module/net'
], function(listTmpl, QQapi, Position, Refresh, Page, NET){
    var foo = '',
        bar = [];
    QQapi.report();
    Position.getLocaiton(function(data){
        //...
    });
    var init = function(){
        bind();
        NET.get('/cgi-bin/xxx/xxx',function(data){
            renderA(data.banner);
            renderB(data.list);
        });
    };
    var processData = function(){
    };
    var bind = function(){
    };
    var renderA = function(){
    };
    var renderB = function(data){
        listTmpl.render('#listContent',processData(
```


<!-- {% endraw %} - for jekyll -->