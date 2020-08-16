---
title: 关于 angular 和 react
date: 2015-05-31
author: TAT.vienwu
source_link: http://www.alloyteam.com/2015/05/%e5%85%b3%e4%ba%8eangular%e5%92%8creact/
---

<!-- {% raw %} - for jekyll -->

* * *

react 是 facebook 推出一个用来构建用户界面的 js 库。官方介绍的三大特性如下：

#### just the ui

把 react 只当作一个 ui 组件就好，等同于传统 mvc 中的 view。

#### virtual dom

react 在编程模型和传统 dom 之间添加了一层，称之为虚拟 dom。好处非常多，性能更好，可以在 node 环境下完成渲染（解决 seo 问题），可以更好的用于开发 native apps。

#### data flow

反应式的单向数据绑定，比传统数据绑定更简单，简单的使用 js 事件触发改变组件状态也可以实现双向绑定的效果。

# 什么是 angularjs

angularjs 是 google 推出的一个前端 js 框架，面世已有几年时间，非常成熟，目前已经有非常多的第三方模块，基本上可以解决前端工程领域的各方面的问题。网上的资料也非常多，这里就不做过多介绍。

# reactjs 和 angularjs

* * *

reactjs 是非常纯粹的组件式开发，所有的页面元素均由各大小组件组合而成。再插上虚拟 dom 的翅膀，实现了一处代码多平台执行的效果，关键是这货性能还不错。但是呢，除了组件以外，这货其他什么功能也没有，你需要重新造出所有的缺失的轮子或者选择第三方的轮子。

angularjs 则是一个完整的框架，意味着不需要太多的工作，就可以使用于大部分的业务场景。  
简单好用的 module 和依赖注入系统，controller 中定义的数据和事件，service 实现不同组件之间共享数据，filter 处理筛选数据，forms 支持表单和复杂的表单验证，简单的动画模块 animations，强大的 directive 实现指令和指令的嵌套，可以很轻松的实现 reactjs 的组件及组件组合功能。ui 组件有 bootstrap for angular，路由有 ui-router，还有 promise 模块 $q，还有原生的 $resource 模块直接支持标准的 restful 接口，集成的单元测试，等等，哇哇，功能好多的样子，又到但是的环节，话说很多初学者会被很多 angularjs 的名词折磨的晕头转向。。。

如果要拿 reactjs 来开发应用，你还需要做很多额外的工作。而如果使用 angularjs 的话，就可以直接开始工作了。

两者之间其实无法直接拿来比较，毕竟 react 只是 view 的解决方案，而 angularjs 是包含 mv\*的完整框架。

抛开跨平台和性能因素，就功能而言，angularjs 已经包含了 reactjs 的功能，只需要一个自定义 directive 加 controller 就可以轻松实现组件效果。

如果是一个大型项目，使用 angularjs 无疑更可靠。强大的功能带来一定的学习成本，但这一切都是值得的。  
而使用 react 的话，你首先需要考虑一个问题，数据怎么管理？用哪个 mvc 库？接下来还有一堆问题等着你。

如果只是一个小型项目，那就看心情吧。

再单独说下关于数据的问题，react 还搞出了一个叫做 flux 的概念。简单看了一下 react 的 flux 模型，这不就是个观察者模式嘛。而 angular 至少支持了三种数据共享方式，包括 service，事件，rootScope 直接添加一个 object，可以分别适应各种不同的场景。

我们来看看 react 和 angular 实现组件的方式有什么不一样。。

# 组件实现

* * *

很多人包括我刚看到 jsx 时会想一个问题，我靠，这货是什么玩意？

js 已经有了 coffeescript、typescript 等，以后还有 es6，难道还要学一个这玩意？

还好，除了 jsx 外，我们也可以直接用 js 甚至 coffee 来编写，虽然麻烦了点。

你只要记住，在 react 的世界，jsx 的语法比 js 写起来更方便更容易理解就好了，具体用什么取决于你自己。

    注1：为了便于没有jsx基础的jser理解，本文所有react示例均使用编译后的js代码。
     
    注2：用coffee写更爽。
     

第一个组件，hello 系列，先看 react 的实现

```html
<span class="keyword">var</span> HelloMessage = React.createClass({displayName: <span class="string">"HelloMessage"</span>,
  render: <span class="keyword">function</span>() {
    <span class="keyword">return</span> React.createElement(<span class="string">"div"</span>, <span class="keyword">null</span>, <span class="string">"Hello "</span>, <span class="keyword">this</span>.props.name);
  }
});
 
React.render(
    React.createElement(HelloMessage, {name: <span class="string">"John"</span>}), 
    document.getElementById(<span class="string">'container'</span>)
);
 
```

看一看 angular 正常的方式：

template.html

```html
<div>Hello {{ name }} </div>;
```

controller

```html
<span class="keyword">var</span> app = angular.module(<span class="string">'app'</span>);
app.controller(<span class="string">'testController'</span>,[<span class="string">"$scope"</span>,<span class="keyword">function</span>(<span class="variable">$scope</span>){
    <span class="variable">$scope</span>.name = <span class="string">'John'</span>;
}]);
 
```

再看一看用 angular 式组件，使用 directive

```html
<span class="keyword">var</span> app = angular.module(<span class="string">'app'</span>);
app.directive(<span class="string">'myComponent'</span>,<span class="keyword">function</span>(){
    <span class="keyword">return</span> {
        link:<span class="keyword">function</span>(scope,element,attrs){
            <span class="keyword">var</span> name = attrs.name;
            element.text(<span class="string">'Hello '</span> + name);
        }
    }
});
 
```

html:

```html
<myComponent name="John"></myComponent>;
```

# 组件组合

* * *

react 的组件组合非常简单，使用 `React.createElement` 方法即可。  
例如给上面定义的 `HelloMessage` 的外层添加一个 `div`，可以这样写：

```html
<span class="keyword">var</span> HelloMessageWithDiv = React.createClass({
    displayName:<span class="string">'HelloMessageWithDiv'</span>,
    render:<span class="keyword">function</span>(){
        <span class="keyword">return</span> React.createElement(
            <span class="string">'div'</span>,
            <span class="keyword">null</span>,
            React.createElement(HelloMessage, {name: <span class="string">"John"</span>})
        );
    }
});
 
```

angular 也很简单，直接写 html 即可

```html
<div>
    <myComponent name="John"></myComponent>
</div>;
```

react 对 dom 的封装都在 React.DOM 命名空间下，而 coffeescipt 支持解构赋值语法，所以用 coffee 的写法也可以媲美 jsx 的语法，例如：

```html
{div,h1,h2,h3,h4,input,span} = React.DOM
React.render(
    div <span class="keyword">null</span>,<span class="string">'head.'</span>,
        div <span class="keyword">null</span>,<span class="string">'nav'</span>,
            ul <span class="keyword">null</span>,
                li <span class="keyword">null</span>,<span class="string">'li1'</span>
                li <span class="keyword">null</span>,<span class="string">'li2'</span>
        div <span class="keyword">null</span>,<span class="string">'container'</span>,
            h1 <span class="keyword">null</span>,<span class="string">'title'</span>
            div <span class="keyword">null</span>,<span class="string">'content'</span>
                h2 <span class="keyword">null</span>,<span class="string">'h2'</span>
,document.getElementById <span class="string">'container'</span> )
 
```

# 为什么用 react

* * *

虽然目前 react 非常之火爆，但说实话，我也不知道在现在环境中用 react 有什么意义。  
在使用 angularjs 开发几个项目之后，如果需要转向 react，只有以下几点可能会吸引我：

1.  足够好的性能
2.  跨平台开发的统一体验。这个还得等 react-android 出来后才知道。
3.  兼容其他 js 库，在现有项目中就可以使用

而对于 angularjs，我认为目前 angularjs 已经足够好用了，除了以下几个显著的问题：

1.  性能问题，目前 angularjs 在移动端的性能确实不够，因为它实在太大了。这个问题是最致命的。
2.  只能在 angular 的框架下开发，第三方库要兼容 angular 都需要做一些工作。

对于 angularjs 其他所谓的缺点，其实大多可以解决，只是难易程度不同，例如 SEO / 构建等都可以解决。  
上手难易程度来说，angularjs 确实比 react 难很多，但这和一个工具是否好用没有关系，例如正则。

网上看到大家都在鼓吹 react 如何如何，又有很多人抛弃了 angular 投向 react 的怀抱。说实话有点吹的太过了。  
react 只是让组件式开发和复用更加简单好用，外加逆天的性能，仅此而已。

最后，到底应该用什么，看你的心情吧，我要赶去改 bug 了。。

<!-- {% endraw %} - for jekyll -->