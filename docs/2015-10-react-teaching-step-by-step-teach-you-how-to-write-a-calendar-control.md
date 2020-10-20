---
title: 【React 教学】Step by Step 教你写一个日历控件
date: 2015-10-22
author: TAT.sheran
source_link: http://www.alloyteam.com/2015/10/react-teaching-step-by-step-teach-you-how-to-write-a-calendar-control/
---

<!-- {% raw %} - for jekyll -->

 [React](https://facebook.github.io/react/) 是一个用于构建用户界面的 javascript 库 (官网定义)，很多人认为 React  是 [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)  中的 V（视图），React  采用下面几个主要的思想

**简单**

仅仅只要表达出你的应用程序在任一个时间点应该长的样子，然后当底层的数据变了，React  会自动处理所有用户界面的更新。

**声明式 (Declarative)**

数据变化后，React  概念上与点击 “刷新” 按钮类似，但仅会更新变化的部分。

**构建可组合的组件**

React  都是关于构建可复用的组件。事实上，通过 React  你唯一要做的事情就是构建组件。得益于其良好的封装性，组件使代码复用、测试和关注分离（separation of concerns）更加简单。

**疯狂**

React  挑战了很多传统的知识，第一眼看上去可能很多想法有点疯狂。当你阅读完这篇教程，你会对 React  的产生更多的喜爱。

下面就直奔主题一步一步为大家讲解怎么用 React 构建一个简单的日历控件，最终结果如下图所示：

[![图片 1](http://www.alloyteam.com/wp-content/uploads/2015/10/图片1.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/图片1.png)

          为了便于讲解，后续增加的 js 和 css 都写在这个 CalendarControl.html 文件里，[点击这里查看 demo](http://www.alloyteam.com/wp-content/uploads/2015/10/CalendarControl.html)。

**Step1：搭建页面**

   为了运行 React，首先你需要搭建一个页面，结构大致如下：

CalendarControl.html：

```html
<!DOCTYPE  html>
<html>
<head>
1 <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
2 <script src="./build/react.js"></script>
3 <script src="./build/browser.min.js"></script>
<style type="text/css"></style>
4 <script type="text/babel"></script>
</head>
<body></body>
</html>
```

下面对标行逐一做个解释：

line1   支持中文编码

line2  react.js 是运行 React 的框架，请自行去官网下载：<https://facebook.github.io/react/downloads.html>

line3  browser.min.js 的作用是将 JSX  语法转为 JavaScript  语法

line4  script  标签的 type  属性为 text/babel 。这是因为 React  独有的 JSX  语法，跟 JavaScript  不兼容。凡是使用 JSX  的地方，都要加    上 type="text/babel" 

其次，上面代码一共用了两个库： react.js  和 Browser.js ，它们必须首先加载。其中，Browser.js  的作用是将 JSX  语法转为 JavaScript。这一步很消耗时间，实际上线的时候，应该将它放到服务器完成。

**Step2: 将界面分解**

[![２](http://www.alloyteam.com/wp-content/uploads/2015/10/２.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/２.jpg)

将代码分解后，代码结构如下：

```html
<script type="text/babel">	
		var CalendarHeader = React.createClass({
			render:function(){
				return(
					<div className="headerborder">
						<p>20月</p>
						<p>2015年</p>
						<p className="triangle-left"> </p>
						<p className="triangle-right"> </p>
					</div>
				)
			}
		});	
		var CalendarBody = React.createClass({
			render:function(){
				return(
					<div>
						<div className="weekday">
							<ul>		
								<li>SUN</li>
								<li>MON</li>
								<li>TUE</li>
								<li>WED</li>
								<li>THU</li>
								<li>FRI</li>
								<li>SAT</li>
							</ul>
						</div>
						<div className="CalendarDay">
							<ul>
								<li>1</li>
								<li>2</li>
								<li>3</li>
								<li>4</li>
								<li>5</li>
								<li>6</li>
								<li>7</li>
							</ul>
						</div>
					</div>
				)
			}
		});
		var CalendarControl = React.createClass({
			render:function(){
				return(
					<div>
						<CalendarHeader  />
						<CalendarBody  />
					</div>
				)
			}
		});
		React.render(
			<CalendarControl />,
			document.body
		);
	</script>
```

注：

1、React 允许将代码封装成组件（component），然后像插入普通 HTML 标签一样，在网页中插入这个组件。React.createClass  方法就用于生成一个组件类。上面代码中一共有 3 个组件：CalendarHeader 、CalendarBody 、CalendarControl  其中 CalendarHeader 、CalendarBody 是子组件，CalendarControl  是父组件。

2、组件的用法与原生的 HTML  标签完全一致，可以任意加入属性，比如 &lt;CalendarBody  year="2015" /> ，就是 CalendarBody  组件加入一个 year 属性，值为 2015。组件的属性可以在组件类的 this.props  对象上获取，比如 year 属性就可以通过 this.props.year 读取。

3、React.render  是 React  的最基本方法，用于将模板转为 HTML  语言，并插入指定的 DOM  节点。所有组件类都必须有自己的 render  方法，用于输出组件。

4、HTML  语言直接写在 JavaScript  语言之中，不加任何引号，这就是 JSX 语法，它允许 HTML  与 JavaScript  的混写， JSX  的基本语法规则：遇到 HTML  标签（以 &lt;  开头），就用 HTML  规则解析；遇到代码块（以 {  开头），就用 JavaScript  规则解析。

这是运行结果如下所示：

[![图片 2](http://www.alloyteam.com/wp-content/uploads/2015/10/图片2.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/图片2.png)

**Step3   加上 css 样式**

注意：添加组件属性，有一个地方需要注意，就是 class  属性需要写成 className ，for  属性需要写成 htmlFor ，这是因为 class  和 for  是 JavaScript  的保留字。加上 CSS 样式后展示如下：

[![图片 3](http://www.alloyteam.com/wp-content/uploads/2015/10/图片3.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/图片3.png)

看了上面的教程，你会发现用 react 搭建一个 UI 界面非常简单快捷。目前这只是个静态页面，这个静态页面是用 react 框架搭建出来的，下面就为他们加上一些交互事件。

**Step4  添加左右箭头事件**

React  在组件上增加事件也是非常简单的，跟 HTML 代码中为某个标签添加事件一样，React 指定事件处理函数的方式是一样的，但事件名称必须使用驼峰命名法（如 onClick）。

```html
var CalendarHeader = React.createClass({
    handleLeftClick: function () {
        alert("left");
    },
    handleRightClick: function () {
        alert("right");
    },
    render: function () {
        return (
            <div className="headerborder">
                <p style={{ "line-height": 30 }}>20月</p>
                <p>2015年</p>
                <p className="triangle-left" onClick={this.handleLeftClick}>
                    {" "}
                </p>
                <p className="triangle-right" onClick={this.handleRightClick}>
                    {" "}
                </p>
            </div>
        );
    },
});
```

更多事件可以参考：<https://facebook.github.io/react/docs/events.html>

**Step5  点击左右箭头，实现改变年月**

如何实现月份年份的转变？首先获取当前年月，再根据左右箭头改变年月。

```javascript
var CalendarHeader = React.createClass({
    getInitialState: function () {
        var newDate = new Date();
        return {
            year: this.formatDate(newDate, "yyyy"),
            month: parseInt(this.formatDate(newDate, "MM")),
        };
    },
    handleLeftClick: function () {
        var newMonth = parseInt(this.state.month) - 1;
        var year = this.state.year;
        if (newMonth < 1) {
            year--;
            newMonth = 12;
        }
        this.state.month = newMonth;
        this.state.year = year;
        this.setState(this.state);
    },
    handleRightClick: function () {
        var newMonth = parseInt(this.state.month) + 1;
        var year = this.state.year;
        if (newMonth > 12) {
            year++;
            newMonth = 1;
        }
        this.state.month = newMonth;
        this.state.year = year;
        this.setState(this.state);
    },
    render: function () {
        return (
            <div className="headerborder">
                <p style={{ "line-height": 30 }}>{this.state.month}月</p>
                <p>{this.state.year}年</p>
                <p className="triangle-left" onClick={this.handleLeftClick}>
                    {" "}
                </p>
                <p className="triangle-right" onClick={this.handleRightClick}>
                    {" "}
                </p>
            </div>
        );
    },
});
```

this.formatDate () 是一个封装的日期格式转换函数，这里就不作讲解了，可以去源代码里看。

这里要重点介绍 state 状态：

     组件免不了要与用户互动，React  的一大创新，就是将组件看成是一个状态机，一开始有一个初始状态，然后用户互动，导致状态变化，从而触发重新渲染 UI。

上面上面代码是一个 CalendarHeader  组件，它的 getInitialState  方法用于定义初始状态，也就是一个对象，这个对象可以通过 this.state  属性读取。当用户点击组件，导致状态变化，this.setState  方法就修改状态值，每次修改以后，自动调用 this.render  方法，再次渲染组件。

**Step6 改变月份，渲染日历表**

我们知道要渲染一个日历表，需要算出

1、当年当月有多少天

2、每月的 1 号是星期几

在仔细看下这张图，如果改变月份，渲染日历表，那么就需要在 CalendarHeader

和 CalendarBody 之间进行通信。

[![２](http://www.alloyteam.com/wp-content/uploads/2015/10/２.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/２.jpg)

现在的问题是：怎么进行子组件间的通信？

  1、其实在 React 中只要父组件状态值（this.state）发生改变，子组件也会重新渲染，这样我们想到的是：

如果子组件 CalendarHeader 状态值改变后，同时也改变父组件 CalendarControlr 的状态，使父组件 CalendarControlr 状态值也发生改变，一旦父组件 CalendarControlr 状态发生改变后，那么 CalendarControlr 下的子组件 CalendarBody 也会重新渲染。

 2、所以在父组件 CalendarControlr 传一个回调函数给子组件 CalendarHeader，这样当子组件 CalendarHeader 的值改变时，调用这个回调函数，改变父组件 CalendarHeader 的状态值，这样就可以渲染到 CalendarBody 子组件了，这是比较通常的实现两个子组件之间通信的做法：核心是把父组件作为中间组件来传递。如下面示意图:

[![QQ 截图 20151022111354](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ截图20151022111354.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/10/QQ截图20151022111354.jpg)

具体步骤：

1、把初始状态从子组件 CalendarHeader 放到父组件 CalendarControl：

```javascript
                       getInitialState:function(){
				var newDate =  new Date();
				return {
					year:util.formatDate(newDate,'yyyy'),
					month:parseInt(util.formatDate(newDate,'MM')),
				};
			}
```

2、然后在父组件 CalendarControl 添加一个回调函数

```javascript
handleFilterUpdate: function(filterYear,filterMonth) {
    this.setState({
     year: filterYear,
     month: filterMonth
    });
}
```

3、然后把回调传给子组件 CalendarHeader：

```javascript
	render:function(){
				return(
					<div className="calendarBorder"  >
						<CalendarHeader 
							year = {this.state.year}
							month = {this.state.month}
							updateFilter={this.handleFilterUpdate}   />
						<CalendarBody 
							year = {this.state.year}
							month = {this.state.month}
							day = {this.state.day} />
					</div>
				)
			}
```

4、然后在子组件 CalendarHeader 的 handleLeftClick 和 handleRightClick 事件中调用这个回调函数。

```javascript
                     handleLeftClick:function(){
				var newMonth = parseInt(this.state.month) - 1;
				var year = this.state.year;
				if(newMonth < 1){
					year --;
					newMonth = 12;
				}
				this.state.month = newMonth;
				this.state.year=year;
				this.setState(this.state);
				this.props.updateFilter(year,newMonth);
 
			},
			handleRightClick:function(){
				var newMonth = parseInt(this.state.month) + 1;
				var year = this.state.year;
				if( newMonth > 12 ){
					year ++;
					newMonth = 1;
				}
				this.state.month = newMonth;
				this.state.year=year;
				this.setState(this.state);
				this.props.updateFilter(year,newMonth);
                       }
```

这样就实现子→ 父 → 子之间的通信，然后就可以很顺利的渲染日期了（见下一步）。

     this.props  对象的属性与组件的属性一一对应，组件的属性可以在组件类的 this.props  对象上获取，比如 year 属性就可以通过 this.props.year 读取。由于 this.props  和 this.state  都用于描述组件的特性，可能会产生混淆。一个简单的区分方法是，this.props  表示那些一旦定义，就不再改变的特性，而 this.state  是会随着用户互动而产生变化的特性。

**Step7  最后加上渲染日期函数**

算出当年当月有多少天，以及每月的 1 号是星期几，在 CalendarBody 里加上：

```javascript
                       getMonthDays:function(){
		       //根据月份获取当前天数
		        var year = this.props.year,
				    month = this.props.month;
				var temp = new Date(year,month,0); 
				return temp.getDate(); 
			},	
			getFirstDayWeek:function(){
                        //根据年月返回当月1号是星期几
				var year = this.props.year,
				    month = this.props.month;	
 
				var dt = new Date(year+'/'+month+'/1');//new Date(year,month,1);
				var Weekdays = dt.getDay();
			
				return Weekdays; 	
			}
```

并在 CalendarControl 的 render 里渲染：

      这里渲染要注意了，改变父组件的状态值，需要在其 render 里渲染才有效果，并且返回的的应该是 html 标签而不是字符串：

```html
                    render:function(){
				var arry1 =[],arry2 = [];
				var getDays = this.getMonthDays(),
					FirstDayWeek = this.getFirstDayWeek(),
					day = this.props.day ;
					for(var i = 0 ;i < FirstDayWeek; i++ ){
						arry1[i] = i;
					}
					for(var i = 0 ;i < getDays; i++ ){
						arry2[i] = (i+1);
					}
					
				var node1 = arry1.map(function(item){return <li></li>})
				var node2 = arry2.map(function(item){return (day == item)?<li style={{"background-color": "#eee"}}>{item}</li>: <li>{item}</li>})
				return(
					<div>
						<div className="weekday">
							<ul>		
								<li>SUN</li>
								<li>MON</li>
								<li>TUE</li>
								<li>WED</li>
								<li>THU</li>
								<li>FRI</li>
								<li>SAT</li>
							</ul>
						</div>
						<div className="CalendarDay">
							<ul>{node1}{node2}</ul>
						</div>
					</div>
				)
			}
```

最后显示结果如下：

[![图片 1](http://www.alloyteam.com/wp-content/uploads/2015/10/图片1.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/图片1.png)

最后留一个问题给大家：为什么要把返回的 getDays  和 FirstDayWeek  值转化成一个数组后，再循环生成一个日期列表，欢迎大家多多讨论。

```javascript
var arry1 = [],
    arry2 = [];
var getDays = this.getMonthDays(),
    FirstDayWeek = this.getFirstDayWeek(),
    day = this.props.day;
for (var i = 0; i < FirstDayWeek; i++) {
    arry1[i] = i;
}
for (var i = 0; i < getDays; i++) {
    arry2[i] = i + 1;
}

var node1 = arry1.map(function (item) {
    return <li></li>;
});
var node2 = arry2.map(function (item) {
    return day == item ? (
        <li style={{ "background-color": "#eee" }}>{item}</li>
    ) : (
        <li>{item}</li>
    );
});
```

**总结**

    这样我们就用 react 完成了一个简单的日历控件，我通过这个控件我们对 react 已经有了比较系统的了解。如果需要更基础的了解，推荐看这篇教程：<http://www.ruanyifeng.com/blog/2015/03/react.html>

    学习 react 需要理论和实践结合，如果需要对 react 有更深入的了解，大家可以试着做一些小 demo，比如用 react 写一个跟 iphone 手机上那样的计算器。欢迎小伙伴投稿写教程，我会把优秀文章到时候发布到 alloyteam 博客平台上，分享给更多的小伙伴。

    最后感谢大家阅读！


<!-- {% endraw %} - for jekyll -->