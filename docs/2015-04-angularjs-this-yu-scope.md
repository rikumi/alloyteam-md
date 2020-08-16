---
title: "AngularJS : this 与 $scope"
date: 2015-04-09
author: TAT.simplehuang
source_link: http://www.alloyteam.com/2015/04/angularjs-this-yu-scope/
---

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

```html
                <!-- vm为自己为当前控制器作的一个简略记号，也可以写作 BCtrl as b,
                     后面变量便可以在b中引出 如b.test -->
                <div ng-controller="BCtrl as vm">
                    {{vm.test}}
                </div>
```

作用范围：

 1) $scope  中的变量或数据对象我们可以全部拿到，并且上级控制器中的变量也可以在下级控制器中被获取到：

 controller:

```javascript
function ParentCtrl($scope) {
    $scope.test = "测试";
    $scope.cover = "覆盖测试";
}
function ChildCtrl($scope) {
    $scope.cover = "子覆盖测试";
    var test = $scope.test; //“测试”
}
```

 html:

```html
<div ng-controller="ParentCtrl">
                        <p>Parent-test : {{ test }}</p>
                        <p>Parent-cover : {{ cover }}</p>
                        
    <div ng-controller="ChildCtrl">
                                <p>Child-test : {{ test }}</p>
                                <p>Child-cover : {{ cover }}</p>
                            
    </div>
                    
</div>;
```

 我在父控制器 ParentCtrl 中声明的 test 变量并未在子控制器 ChildCtrl 中做声明，而在 ChildCtrl 作用范围内的 Child-test 中，test 却输出了” 测试”；基于此我再做了一次覆盖测试，检测结果显示，当父子控制器同时存在相同的变量时， 父子控制器各自范围内的值不会被覆盖；

 2) this  中的变量则只适用于当前控制器：

 controller:

```javascript
function ParentCtrl($scope) {
    var vm = this;
    vm.test = "测试";
    vm.cover = "覆盖测试";
}
function ChildCtrl($scope) {
    var vm = this;
    vm.cover = "子覆盖测试";
}
```

 html:

```html
                <div ng-controller="ParentCtrl as parent">
                    <p>Parent-test : {{parent.test}}</p>
                    <p>Parent-cover : {{parent.cover}}</p>
                    <div ng-controller="ChildCtrl as child">
                        <p>Child-test : {{child.test}}</p>
                        <p>Child-cover : {{child.cover}}</p>
                    </div>
                    <div ng-controller="ChildCtrl as parent">
                        <p>Child-test : {{parent.test}}</p>
                        <p>Child-cover : {{parent.cover}}</p>
                    </div>
                </div>
```

 在使用 this 的时候，各层级变量的命名空间是平行的状态，模板 html 中只可以拿到当前控制器下声明的变量。

对象对比：

 controller:

```javascript
function CCtrl($scope) {
    var vm = this;
    $scope.logThisAndScope = function () {
        console.log(vm === $scope);
    };
}
```

 vm 与 $scope 实际上是不相等的，在 console 中我们可以看到

 vm: Constructor;

 $scope: $get.Scope.$new.Child;

 而在 $scope 中又包含了一个变量 vm: Constructor

 实际结构是

```javascript
        $scope: {
            ...,
            vm: Constructor,
            ...
        }      
```

 那么我们可以整理如下：

 $scope 当控制器在写法上形成父子级关系时，子级没有的变量或方法父级会自动强加在子级身上，子级可以任意获取到当前父级的变量或方法，该种形式是不可逆的，即父级无法通过 $scope 获取到子级的任意变量或方法。

 this       则像一个独立的个体，所有东西都是由自己管理，也就不存在父子级变量混淆关系了。

 那数据共享该如何进行呢？数据业务逻辑我觉得还是交给更专业的 service 来处理吧。

 两种方式其实在性能上并无优劣之分，只有代码习惯的选择。

 这或许可以取决于我们观察的角度，其实可以理解为私用跟公用的区别！

参考资料：

<http://stackoverflow.com/questions/11605917/this-vs-scope-in-angularjs-controllers>

<http://codetunnel.io/angularjs-controller-as-or-scope/>