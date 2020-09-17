---
title: ReactJS 组件间沟通的一些方法
date: 2016-01-13
author: TAT.rocket
source_link: http://www.alloyteam.com/2016/01/some-methods-of-reactjs-communication-between-components/
---

<!-- {% raw %} - for jekyll -->

刚入门 React 可能会因为 React 的单向数据流的特性而遇到组件间沟通的麻烦，这篇文章主要就说一说如何解决组件间沟通的问题。

* * *

**1. 组件间的关系**

**1.1 父子组件**

ReactJS 中数据的流动是单向的，父组件的数据可以通过设置子组件的 props 传递数据给子组件。如果想让子组件改变父组件的数据，可以在父组件中传一个 callback (回调函数) 给子组件，子组件内调用这个 callback 即可改变父组件的数据。

```javascript
var MyContainer = React.createClass({
	getInitialState: function(){
		return {
			list: ['item1', 'item2'],
			curItem: 'item1'
		}
	},
	// 改变curItem的回调函数
	changeItem: function(item){
		this.setState({
			curItem: item
		});
	},
	render: function(){
		return (
			<div>
				The curItem is: {this.state.curItem}
				<List list={this.state.list} changeItem={this.changeItem}/>
			</div>
		)
	}
});
 
var List = React.createClass({
	onClickItem: function(item){
		this.props.changeItem(item);
	},
	render: function(){
		return (
			<ul>
				{
					(function(){
						var self = this;
						return this.props.list.map(function(item){
							return (
								<li onClick={self.onClickItem.bind(self, item)}>I am {item}, click me!</li>		
							)
						});
					}.bind(
```


<!-- {% endraw %} - for jekyll -->