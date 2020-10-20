---
title: 经常在各种框架之间切换使用是种什么体验？
date: 2016-01-13
author: TAT.finlay
source_link: http://www.alloyteam.com/2016/01/often-switching-between-the-various-frameworks-use-what-is-experience/
---

<!-- {% raw %} - for jekyll -->

前言:

在一个喜欢尝鲜的团队里面工作，总会碰到这种情况。前一个项目用的这个框架这种构建，下一个项目就变成新的框架那种构建，上来就 blablabla 先学一通，刚觉得安心，接到个另外需求，到手一看。又变了一套 T,T ， 又要重复上述步骤.. 如果能在各种框架和开发思路里面游刃有余，当然是最好的，可是多少总会对开发同学产生一些影响，那么各个框架之间的差异到底有多大呢？切换来去又会影响到哪些开发体验呢？且看我边做示例边分解…

正文:

我挑选了三个我认为比较有代表性的框架来实现同一个 todo list 的小项目，项目基本介绍如下:

示意图:  
[![todo_list_intro](http://www.alloyteam.com/wp-content/uploads/2016/01/todo_list_intro.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/todo_list_intro.png)  
主要功能是协助记录一些计划，防止遗忘，完成后有直观反馈。  
共有 4 需要个交互的地方:

-   \- 可输入的计划内容的区域。
-   \- 确认新增计划到，计划列表上的行为。
-   \- 每个计划需要一个可改变状态的行为，让计划在’ 完成 / 未完成’ 的状态切换。
-   \- 有可以清理已实现所有的计划的行为。

每个交互直接对应到了上图中的几个箭头。其中列表的状态展示会改变其样式。下面介绍用各种不同框架时的开发思路以及代码:

backbonejs  

=============

[backbonejs](http://backbonejs.org/) 的特点是其推荐使用 MVC 的方式来分层和组织代码。依赖 [jQuery](http://jquery.com/),[underscore](http://underscorejs.org/)  
这里虽然是个单页应用，但并没有明显的操作路径，交互点和功能都是通过事件触发来推进，所以这里 Controller 层的概念会被淡化到事件中去。没有一个总控制器，基本数据流模型就如下图：

[![b3](http://www.alloyteam.com/wp-content/uploads/2016/01/b3-300x101.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/b3.png)

官网上还有其它数据流模型，有兴趣的同学可以去看看，下面是我的目录结构，lib 里面是基础公共库，app 里面是业务文件

[![menuTree](http://www.alloyteam.com/wp-content/uploads/2016/01/menuTree-300x201.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/menuTree.png)

在保证项目结构清晰的情况下。我会尽量拆分文件，这样便于管理和扩展，业务文件我按照 model 和 view 做了下拆分。程序入口则是 todo.html, 如下，文档结构非常简单

```c
&lt;— todo.html —>
&lt;!DOCTYPE html>
&lt;html>
&lt;head>
    &lt;meta charset=’utf-8’ > 
    &lt;title>BtoDo&lt;/title>
    &lt;script type=’text/javascript’ src=’lib/underscore.min.js’>&lt;/script>
    &lt;script type=’text/javascript’ src=’lib/jquery-2.1.4.min.js’>&lt;/script>
    &lt;script type=’text/javascript’ src=’lib/backbone.min.js’>&lt;/script>
    &lt;style type=’text/css’>
        .list-wrapper{
            margin: 20px auto ;
            width: 300px;
        }
        .done-true {
          text-decoration: line-through;
          color: grey;
        }
        input[type=’checkbox’]{
            vertical-align: middle;
        }
        .archive-btn{
            color: blue;
            cursor: pointer;
        }
    &lt;/style>
&lt;/head>
&lt;body>
    &lt;div class=’list-wrapper’ id=’todo_panel’>
        &lt;h2>Todo&lt;/h2>
        &lt;span id=’remaining’>&lt;/span> remaining [archive]
        &lt;ul id=’todo_list’ >
        &lt;/ul>
        &lt;form onsubmit=”return false” >
            &lt;input placeHolder=’foo foo’  type=’text’> &lt;button class=’add_btn’ >Add&lt;/button>
        &lt;/form>
    &lt;/div>
    &lt;script type=’text/template’ id=’list_template’ >
        &lt;% for( var p in data ){%>
        &lt;li &lt;%if(data[p].done){%>class=’done-true’&lt;%}%> >’  &lt;%if(data[p].done){%>checked&lt;%}%> >&lt;%=data[p].todo%>&lt;/li>
        &lt;%}%>
    &lt;/script>
    &lt;script type=’text/javascript’ src=’app/todo.model.js’>&lt;/script>
    &lt;script type=’text/javascript’ src=’app/todo.view.js’>&lt;/script>
&lt;/body>
&lt;/html>
```

下面是 Model,Model 可以看成一个描述业务的数据模型，描述越详细，越原子越好，而在此项目中，最原子的数据单元，就是每条计划，所有的需求交互都是围绕每一条计划来行动。而计划是批量的，每个计划都具有相同的行为和操作，所以我声明了一个 Collection_Collection 是所有相同 Model 的一个集合_, 用一个 Collection 来描述业务数据。声明里给了两个默认计划。全局上挂载这个对象，方便外部文件存取.(项目简单，就直接写了，一般会建议包装一个方法来导出单个文件内部方法或者变量。便于全局管理)

```javascript
/**
 * [todo backbone model file]
 * 
 */
(function( global , Backbone ) {
    var todoCollection = new Backbone.Collection( [{ todo : ‘some demos’ , done : false } , { todo :’some other todo’ , done :true  }]);
        global.todoCollection = todoCollection ;
})( window ,Backbone );
```

再来看看 View , 我定义了一个基础类型的 View 叫 BaseView , BaseView 的数据源是刚才我导出的 todoCollection, 然后实例化当前类时候会侦听该数据源的动作。然后定义了 RemainView ,ListView,PanelView 具体作用见下面我的注释。  
值得注意的是 RemainView 会覆盖 initialize 方法，这里稍微特别。

```javascript
/**
 * [todo backbone view files]
 * 
 */
(function( global , Backbone ) {
    var todoCollection = global.todoCollection ;
    /**
     * BaseView
     * 基础视图，指定了默认数据源，初始化行为
     */
    var BaseView = Backbone.View.extend({
            collection: todoCollection ,
            initialize: function() {
                this.listenTo(this.collection, ‘add’, this.render);
                this.listenTo(this.collection, ‘remove’, this.render);
            }
        }) ,
        /**
         * RemainView
         * 当前剩余计划数与总计划数的视图
         * 方便用户了解当前所有任务完成状态。
         */
        RemainView = BaseView.extend({
            /**
             * RemainView表示列表计划的完成状况，需要在状态改变时也做出对应
             * 行为，所以它有特别的初始化行为。
             * changed事件本来也可以归到父类的初始化函数当中，但这个事件其
             * 实只在此视图中有使用，这样可以减少渲染函数调用次数.
             */
            initialize : function(){
                BaseView.prototype.initialize.apply( this , [] );
                this.listenTo(this.collection, ‘changed’, this.render);
            } ,
            render: function( model , collection ) {
                var tpl = _.template(‘&lt;%= rest %> of &lt;%= total %> ‘) ,
                    rest = 0  , 
                    p ,
                    data = collection.toJSON() ;
                    for( p in data ){
                        if( !data[p].done ){
                            ++rest ;
                        }
                    }
                this.$el.html( tpl({ rest : rest , total : data.length }) );
            }
        }) ,
        /**
         * ListView
         * 展示具体计划的列表视图
         */
        ListView = BaseView.extend({
            events: {
              ‘click .check_box’ : ‘checked’
            } ,
            render: function( model , collection ) {
                var tpl = _.template($(‘#list_template’).html());
                this.$el.html( tpl({ data: collection.toJSON() }) );
            },
            checked : function( e ){
                var target = e.target,
                    key = target.getAttribute(‘data-index’) ,
                    model = this.collection.at( key ) ;
                    model.set(‘done’ , target.checked );
                    /**
                     * 手动触发
                     */
                    this.collection.trigger(‘changed’ , {} , this.collection );
            }
        }) ,
        /**
         * PanelView
         * 操作面板视图,这里决定新增以及完成动作的行为引起的视图变化
         */
        PanelView = BaseView.extend({
            events: {
              ‘click .add_btn’ : ‘add’ ,
              ‘click .arc_btn’ : ‘archived’
            } ,
            add : function( e ){
                var target = e.target ,
                    $input = $(target.parentNode).find(‘input’);
                this.collection.add({
                    todo : $input.val() ,
                    done : false
                });
                $input.val(‘’);
            } ,
            archived : function(){
                this.collection.remove( this.collection.where({ done : true }) );
            }
        });
        /**
         * 文档加载完全后开始实例化各个类
         */
        global.onload = function(){
            var list = new ListView({
                el: $(‘#todo_list’) 
            }) ,
            remaining = new RemainView({
                el: $(‘#remaining’)
            }) ,
            Panel = new PanelView({
                el: $(‘#todo_panel’)
            });
            /**
             * 放入默认数据
             */
            todoCollection.add( [{ todo : ‘some demos’ , done : false } , { todo :’some other todo’ , done :true  }] );
        };
})( window , Backbone );
```

angularjs  

============

 angularjs  自身集成了一套数据视图双向绑定的模版语法，同时约定了一个大致的应用开发流程.

一些基本概念如下：

[![angluarjs](http://www.alloyteam.com/wp-content/uploads/2016/01/angluarjs.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/angluarjs.png)

```c
&lt;–!html–>
&lt;!doctype html>
&lt;html ng-app=”todoApp”>
  &lt;head>
    &lt;script type=”text/javascript” src=’lib/angular.min.js’>&lt;/script>
    &lt;script src=”app/todo.js”>&lt;/script>
    &lt;style type=”text/css”>
    .done-true {
      text-decoration: line-through;
      color: grey;
    }
    .list-wrapper{
        margin: 20px auto ;
        width: 300px;
    }
    &lt;/style>
  &lt;/head> 
  &lt;body>
    &lt;div class=’list-wrapper’>
        &lt;h2>Todo&lt;/h2>
        &lt;div ng-controller=”TodoListController as todoList”>
          &lt;span>{{todoList.remaining()}} of {{todoList.todos.length}} remaining&lt;/span>
          [&lt;a href="””">archive&lt;/a>]
          &lt;ul class=”unstyled”>
            &lt;li ng-repeat=”todo in todoList.todos”>
              &lt;input type=”checkbox” ng-model=”todo.done”>
              &lt;span class=”done-{{todo.done}}”>{{todo.text}}&lt;/span>
            &lt;/li>
          &lt;/ul>
          &lt;form ng-submit=”todoList.addTodo()”>
            &lt;input type=”text” ng-model=”todoList.todoText”  size=”30”
                   placeholder=”foo foo”>
            &lt;input class=”btn-primary” type=”submit” value=”add”>
          &lt;/form>
        &lt;/div>
    &lt;/div>
&lt;/body>
```

这是个取自官网的示例图，可以看到代码非常精简，基本流程如下。声明了一个 module 容器，然后在 controller 中处理几个行为，界面行为完全在 html 模版中来处理，controller 里面不再耦合任何 dom 操作。

```javascript
//app.js
angular.module(‘todoApp’, [])
    .controller(‘TodoListController’, function() {
        var todoList = this;
        todoList.todos = [
            {text:’learn angular’, done:true},
            {text:’build an angular app’, done:false}];
 
        todoList.addTodo = function() {
            todoList.todos.push({text:todoList.todoText, done:false});
            todoList.todoText = ‘’;
        };
 
        todoList.remaining = function() {
            var count = 0;
            angular.forEach(todoList.todos, function(todo) {
              count += todo.done ? 0 : 1;
            });
            return count;
        };
 
        todoList.archive = function() {
            var oldTodos = todoList.todos;
            todoList.todos = [];
            angular.forEach(oldTodos, function(todo) {
                if (!todo.done) todoList.todos.push(todo);
            });
        };
    });
```

Reactjs  

==========

[Reactjs](https://facebook.github.io/react/) 官网上说明了它的几个基本特点，  
[![reactjs](http://www.alloyteam.com/wp-content/uploads/2016/01/reactjs.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/reactjs.png)

1.  专注于 UI，都是前端库，强调专注于 UI 又如何理解呢，与 backbone,angular 相比又有哪点更 UI 呢？

2.  等我放完代码后再简单分析。

3.   VIRTUAL DOM, 为了方便打字，我简称它为 vdom,React 提供了一种新的 html 模版语法形式，和一整套新的接口来支持这个 vdom 的特性，通过新语法编译和接口调用，来覆盖视图渲染的过程。让界面渲染变得相对透明，这样才可以衍生出服务端渲染和 ReactNative 的玩法，不用做大改动的前提下，同一套代码能在各种载体中渲染。

4.  DATA FLOW, 数据流的规范，推荐和弱强制使用的单向数据流方式来约束代码和界面模块组织，顺着这个思路来确实会有些不同的编码体验。特别是在我刚用前面两个框架写完 demo 后立即开始写这个的时候，感受比较明显。

下面进入正题看代码，文档并没有特别需要说明的地方，为了方便和我没有配置整套的 React 环境，只是用了 demo 环境，引入了一个翻译 jsx 的库:

```c
&lt;!–html–>
&lt;!DOCTYPE html>
&lt;html>
  &lt;head>
    &lt;title>Hello React&lt;/title>
    &lt;script src=”lib/react.js”>&lt;/script>
    &lt;script src=”lib/JSXTransformer.js”>&lt;/script>
    &lt;style type=”text/css”>
        .done-true {
          text-decoration: line-through;
          color: grey;
        }
        .list-wrapper{
            margin: 20px auto ;
            width: 300px;
        }
        input[type=’checkbox’]{
            vertical-align: middle;
        }
        .archive-btn{
            color: blue;
            cursor: pointer;
        }
    &lt;/style>
  &lt;/head>
  &lt;body>
    &lt;div class=’list-wrapper’ id=”example”>&lt;/div>
    &lt;script type=”text/jsx” src=”app/todo.js”>&lt;/script>
  &lt;/body>
&lt;/html>
```

业务代码，专注于 UI 的库，首先需要的是拆分视图，这点与其它库并无太大区别。但是如何拆，如何确定各个视图之间的关系则是有套路的，且大致过下下面的代码.

```javascript
// todo.js文件
/**
 * ToDoTips 剩余与总计计数展示视图
 */
var ToDoTips = React.createClass({
    render : function(){
        var items = this.props.items ,
            remains = 0 ;
            items.map( function( item ){
                if( !item.done ){
                    ++remains ;
                }
            } );
        return &lt;span>{remains}/{items.length}&lt;/span>;
    }
});
/**
 * TodoList 
 *      计划列表展示视图
 *      包含了两个行为状态,切换计划状态，以及清理已完成计划数   
 */
var TodoList = React.createClass({
    getInitialState: function() {
        return {items: this.props.items };
    },
    shouldComponentUpdate  : function( nextProps ){
        this.state.items.push( nextProps.nextItem );
        return true ;
    },
    archived : function(){
        var items = this.state.items.concat([]) ,
            remainItems = [] ;
            items.forEach( function( item ){
                if( !item.done ){
                    remainItems.push(item);
                }
            } );
            this.setState({items: remainItems});
    },
    toggle: function( e ){
        var index = e.target.getAttribute(‘data-index’) ,  
            items = this.state.items.concat([]) ;
            items[index].done = !items[index].done ; 
            this.setState({items: items});
    } ,
    render:function() {
        var that = this ;
        var createItem = function( item , index ) {
            var itemClass = item.done ? ‘done-true’ : ‘’ ; 
            return &lt;li className={itemClass} >&lt;input type=’checkbox’ data-index={index} onClick={that.toggle} checked = {item.done} />{item.todo}&lt;/li>;
        };
        return (
            &lt;div>
                &lt;span>remaining &lt;ToDoTips items = {this.state.items} /> [archive]&lt;/span>
                &lt;ul>{ this.state.items.map(createItem)}&lt;/ul>
            &lt;/div>
        );
    }
});
/**
 *  TodoApp 面板入口
 *  新增计划行为以及状态。
 */
var TodoApp = React.createClass({
    getInitialState: function() {
        return {items: this.props.sourceData};
    },
    handleSubmit: function(e) {
      e.preventDefault();
        var texts = e.target[‘text’].value  ;
        this.setState({
            nextItem : {
                todo : texts ,
                done : false
            }
        });
        e.target[‘text’].value = ‘’;
    },
    render: function() {
        return (
            &lt;div>
                &lt;h3>TODO&lt;/h3>
                &lt;TodoList items = {this.state.items} nextItem={this.state.nextItem}  />
                &lt;form onSubmit={this.handleSubmit} >
                  &lt;input 
                    placeholder=’foo foo’
                    name=’text’   />
                  &lt;button>{‘Add #’ + (this.state.items.length + 1)}&lt;/button>
                &lt;/form>
            &lt;/div>
          );
    }
});
/**
 * [sourceData 初始数据]
 * @type {Array}
 */
var sourceData = [
            {todo:’learn React’, done:true},
            {todo:’build an React app’, done:false}];
React.render(
            &lt;TodoApp  sourceData = {sourceData} />, 
            document.getElementById(‘example’)
            );
```

以上是基本视图切分，没看到任何 MVC 的影子，可以看出基本代码组织方式就是这样，像是一个一个相对高内聚的小型界面组件。然后下面是数据流，顺序是从左到右。这个顺序是由什么来决定的呢？  
[![reactDataFlow](http://www.alloyteam.com/wp-content/uploads/2016/01/reactDataFlow.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/reactDataFlow.png)  
其实在 render 方法里面就能发现蛛丝马迹，下面我用一条直观的图来描述这个顺序的诞生。  
[![reactdflow](http://www.alloyteam.com/wp-content/uploads/2016/01/reactdflow.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/reactdflow.png)  
render 方法的调用条件是当前组件数据改变而调用 setState 时。每个组件内部会保有自己的 state,state 决定组件的展示状态。可以看到，每个引起状态改变的行为都会相对上层，最原子的状态界面是在最下层，所以在编码初始就需要想清楚哪些行为驱动数据发生变化，才能系统有条理的拆分组件。

为何更强调 UI，我个人理解，React 基本不提供任何关于 url 路径的处理方式，  
以前 B/S 架构下出来的模式理念也被淡化成了强调组件，我个人更倾向于把它看成更偏客户端的一种代码组合方式，同时 React 比较新，工程化痕迹相比前面两个框架会更重。

总结:  

======

几种代码都已经浏览到，个人觉得非常影响编码体验主要在以下几点:

-   _代码写法_
-   逻辑分层方式
-   _默认约定_
-   模版语法

上述框架并没有优劣之分。框架我认为都是经验的聚合，总是诞生于自身业务开发中，带着一些业务痕迹，去照顾到各种团队的开发习惯和效率。

最后这篇文章的目的，有需要的时候，为大家的技术选型提供一些其它的思路。  
欢迎大家探讨和拍砖 。


<!-- {% endraw %} - for jekyll -->