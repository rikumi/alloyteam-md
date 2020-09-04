---
title: zepto/jQuery、AngularJS、React、Nuclear 的演化
date: 2016-04-27
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/04/zepto-jquery-angularjs-react-and-nuclear-evolution/
---

<!-- {% raw %} - for jekyll -->

写在前面  

* * *

因为 zepto、jQuery2.x.x 和 Nuclear 都是为现代浏览器而出现，不兼容 IE8，适合现代浏览器的 web 开发或者移动 web/hybrid 开发。每个框架类库被大量用户大规模使用都说明其戳中了开发者的刚需。本文将对比 zepto/jQuery 到 Nuclear 的设计和演化的过程。

无框架时代  

* * *

互联网的春风刚刮来的时候，人们当时利用三剑客制作网页。

````html
<div onclick="showMsg()"></div>
 

```html
<script>
    function showMsg(){
        alert("恭喜你实现第一个人机交互程序");
    }
</script>
````

````

这里会发现 showMsg 必须是全局的，onclick 触发才能访问，这样就会导致每绑一个事件就要污染一个全局变量。这点问题难不倒前端工程师，加个超级 namespace，所有的事件挂在它下面:

```html
<div onclick="SuperNamespce.showMsg1()"></div>
<div onclick="SuperNamespce.showMsg2()"></div>

```html
<script>
    var SuperNamespce={};
    SuperNamespce.showMsg1=function(){
    }
    SuperNamespce.showMsg2=function(){
    }
</script>
````

````

但是也有问题，比如这样的场景：

```javascript
var SuperNamespce = {};
setTimeout(function () {
    SuperNamespce.showMsg1 = function () {};
    SuperNamespce.showMsg2 = function () {};
}, 4000);
````

或者更真实一点：

```javascript
var SuperNamespce = {};
ajax({
    url: "xxx",
    succ
```


<!-- {% endraw %} - for jekyll -->