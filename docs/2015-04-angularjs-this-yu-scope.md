---
title: "AngularJS : this 与 $scope"
date: 2015-04-09
author: TAT.simplehuang
source_link: http://www.alloyteam.com/2015/04/angularjs-this-yu-scope/
---

<!-- {% raw %} - for jekyll -->

最近在 Angular 项目中遇到关于 controller 内使用 $scope&this  暴露数据的问题，下面来分析一下：

 “controller as” 是 Angular 在 1.2 版本后新增的语法，我将从引用方式，作用范围，对象对比三个方面做两者的比较：

引用方式：

 1) $scope  只需要在注入中声明，后面就可以直接在附加数据对象：

 controller:              

```javascript
function ACtrl($scope) {
    $scope.test = "一个例子"; //在$scope对象中加入test
}
```

 html:

```html
<div ng-controller="ACtrl">
                        {{ test }}
                    
</div>;
```

 2) this  则采用了 controller as (需要版本为 ng 1.2+) 写法：

 controller:

```javascript
function BCtrl() {
    var vm = this;
    this.test = "一个例子"; //在this对象中加入test
}
```

 html:


<!-- {% endraw %} - for jekyll -->