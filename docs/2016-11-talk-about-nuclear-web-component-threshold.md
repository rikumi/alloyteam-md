---
title: 漫谈 Nuclear Web 组件化入门篇
date: 2016-11-05
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/11/talk-about-nuclear-web-component-threshold/
---

<!-- {% raw %} - for jekyll -->

目前来看，团队内部前端项目已全面实施组件化开发。组件化的好处太多，如：按需加载、可复用、易维护、可扩展、少挖坑、不改组件代码直接切成服务器端渲染（如 [Nuclear](https://github.com/AlloyTeam/Nuclear) 组件化可以做到，大家叫同构)...  
怎么做到这么强大的优势，来回忆下以前见过的坑，或者现有项目里的坑。

CSS 层叠样式？保佑不要污染别的 HTML!  

* * *

在 web 前端，一般一个组件必须要有骨架 HTML 和装饰的 CSS 以及 JS 逻辑。而 CSS 要是可以是局部作用域那就再好不过了！就不用写长长的前缀了，浪费带宽不说，而且费劲。  
如

    .ui-popup-arrow-xx-xxxxx-xxxx-container {
     
    }

这回够长了吧，不会污染别的 HTML 了吧。真的太长了，没有办法，因为 CSS 不是局部的，怕污染其他的 HTML，规划好长长的 namespace、module 是以前的最佳实践。

怎么优雅绑定事件？只能定义在 window 下？  

* * *

如果 HTML 绑定的事件是局部作用域那就再好不过了！我真的见过模版代码里出现下面的代码：

```html
<div onclick="xxx()"></div>;
```

然后在 js 里找到了下面的代码：

````javascript

```html
<script>    window.xxx = function(){}</script>
````

;

````

要绑定的事件一多，得污染多少全局变量啊。所以还有的工程师这么干：

```html
<div onclick="ns.xxx()"></div>
<div onclick="ns.xxxx()"></div>
````

然后在 js 里找到了下面的代码：

````javascript

```html
<script>
        window.ns = {};       ns.xx = function(){}
             ns.xxx = function(){}
</script>
````

;

```

这里貌似比不设定 namespace 好很多，但是还是妥协的结果。一般希望能封装成组件，组件的 HTML 里绑定的事件就是组件内定义的事件，内聚内聚！！  
通过 js 动态绑定事件的坏处我以前专门写了一篇文章来阐述，主要是 lazy bind 会导致用户看到了页面，但是页面确无法响应用户的交互，这里不再阐述。

需求变更？找不到在哪改代码？  

-----------------

大型项目如游戏什么的为啥都是面向对象式的写法？如果一个组件刚好又能是一个 Class 那就再好不过，Class base 可以更方便地抽象现实世界的物体及其属性或者逻辑算法，所以甚至有些编程语言都是面向对象的 (这里逆向逻辑)，如 JAVA、C#... 整体过程式的代码对于大型项目几乎没法维护（如基于 jQuery 就能容易写出整体都是过程式的组织结构），整体 OO，局部过程式是可以接受的。

组件需要嵌套？只能复制粘贴原组件？  

--------------------

扁平无嵌套组件还是比较简单，对模板的字符串处理下，把绑定的事件全指向组件自身定义的方法，生命周期也好处理。在真正的业务里经常需要组件嵌套，这样也更利于复用。虽然大量模板引擎支持引用子模板、共享数据等，但是组件是有生命周期的，模板嵌套不能真正解决组件嵌套的问题。能支持组件嵌套并且声明式嵌套就那就再好不过了！

数据变了？重新生成 HTML 替换一下？  

-----------------------

怎么替换？先查找 dom？什么？你还在查找 dom？你还在背诵 CSS 选择器？替换一下？不能增量更新吗？或者 diff 一下吧？不要每次全部替换啊！

首屏太慢？以前抽象的组件没法复用？  

--------------------

什么？首屏太慢？改成直出（服务器渲染）？以前代码没法复用？要推翻重写？什么？怎么搞？排期？产品不给排期？需求没变为什么要给排期？

下面来看下 [Nuclear](https://github.com/AlloyTeam/Nuclear) 怎么解决上面问题。

![](http://www.alloyteam.com/wp-content/uploads/2016/11/QQ截图20161104161541.png)

install Nuclear  

------------------

```

npm install alloynuclear

````

Hello,Nuclear!  

-----------------

```javascript
var HelloNuclear = Nuclear.create({
    render: function () {
        return "<div>Hello , {{name}} !</div>";
    },
});
new HelloNuclear({ name: "Nuclear" }, "body");
````

内置了 mustache.js 无逻辑模板。

事件绑定  

* * *


<!-- {% endraw %} - for jekyll -->