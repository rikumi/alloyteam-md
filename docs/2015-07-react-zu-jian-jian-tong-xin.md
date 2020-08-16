---
title: react 组件间通信
date: 2015-07-30
author: TAT.Fujun
source_link: http://www.alloyteam.com/2015/07/react-zu-jian-jian-tong-xin/
---

<!-- {% raw %} - for jekyll -->

通信是发送者通过某种媒体以某种格式来传递信息到收信者以达致某个目的（摘至维基百科）。

前两天为了练习 react，自己写了如下一个 Demo，功能很简单，展示学生成绩列表，支持按性别和姓名筛选。效果如下：

[![demo1](http://www.alloyteam.com/wp-content/uploads/2015/07/demo1.gif)](http://www.alloyteam.com/wp-content/uploads/2015/07/demo1.gif)

从上面的效果图，我们也可以看到如下的组件树结构：

[![structure](http://www.alloyteam.com/wp-content/uploads/2015/07/structure.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/structure.png)

StudentScoreTable 有三个子组件：GenderFilter, NameFilter, ScoreTable。其中，ScoreTable 又包含若干个子组件 ScoreItem。从功能上，我们知道：

1.  当选择性别后，要对 ScoreItem 做筛选
2.  当输入姓名后，要对 ScoreItem 做筛选
3.  当同时选择性别，输入姓名，两个筛选条件对 ScoreItem 生效
4.  点击某 ScoreItem 的删除按钮后，删除此 ScoreItem

也就是说：

1.  当 GenderFilter 发生改变（change）时，ScoreItem 要能感知到这个变化并做出相应反馈（进行筛选）
2.  当 NameFilter 发生改变时，ScoreItem 也要能感知这个变化并做出相应反馈
3.  当某 ScoreItem 删除后，可能 StudentScoreTable, GenderFilter, NameFilter 要做出相应反馈，即以后筛选，少了一个 ScoreItem

下面是我的第一版本实现

```javascript
// 测试数据
var _score = [
    { name: "张三", gender: "男", chinese: 85, math: 98, _id: 0 },
    { name: "张三", gender: "女", chinese: 95, math: 90, _id: 1 },
    { name: "李四", gender: "男", chinese: 65, math: 48, _id: 2 },
    { name: "大妹", gender: "女", chinese: 95, math: 100, _id: 3 },
    { name: "王五", gender: "男", chinese: 75, math: 88, _id: 4 },
    { name: "赵钱", gender: "男", chinese: 75, math: 98, _id: 5 },
    { name: "二妹", gender: "女", chinese: 90, math: 98, _id: 6 },
];
var StudentScoreTable = React.createClass({
    getInitialState: function () {
        return {
            genderFilter: 0,
            nameFilter: "",
            data: _score,
            modifyScore: null,
            className: "dialog modify",
        };
    },
    onGenderChange: function (gender) {
        this.setState({ genderFilter: gender });
    },
    onDeleteScoreItem: function (id) {
        var data = this.state.data.map(function (item) {
            if (item._id === id) {
                item.deleteFlag = true;
            }
            return item;
        });
        this.setState(data, data);
    },
    onNameChange: function (name) {
        this.setState({ nameFilter: name });
    },
    render: function () {
        return (
            <div>
                              {" "}
                <GenderFilter
                    onGenderChange={this.onGenderChange}
                    genderFilter={this.state.genderFilter}
                />
                              {" "}
                <NameFilter
                    onNameChange={this.onNameChange}
                    nameFilter={this.state.nameFilter}
                />
                              {" "}
                <ScoreTable
                    scoreNotes={this.state.data}
                    genderFilter={this.state.genderFilter}
                    nameFilter={this.state.nameFilter}
                    deleteScoreItem={this.onDeleteScoreItem}
                    modifyItem={this.onModify}
                />
                          {" "}
            </div>
        );
    },
});
var GenderFilter = React.createClass({
    genderChangeHandler: function () {
        this.props.onGenderChange(this.refs.genderFilter.getDOMNode().value);
    },
    render: function () {
        return (
            <div className="condition-item">
                                
                <label>
                                        <span>按性别筛选</span>
                                        
                    <select
                        onChange={this.genderChangeHandler}
                        ref="genderFilter"
                    >
                                                <option value="0">All</option>
                                                <option value="1">男生</option>
                                                <option value="2">女生</option>
                                            
                    </select>
                                    
                </label>
                            
            </div>
        );
    },
});
var NameFilter = React.createClass({
    nameChangeHandler: function () {
        this.props.onNameChange(this.refs.nameFilter.getDOMNode().value);
    },
    render: function () {
        return (
            <div className="condition-item">
                                
                <label>
                                        <span>按姓名筛选</span>
                                        
                    <input
                        type="text"
                        ref="nameFilter"
                        onChange={this.nameChangeHandler}
                        value={this.props.nameFilter}
                    />
                                    
                </label>
                            
            </div>
        );
    },
});
var ScoreTable = React.createClass({
    deleteItemHandler: function (id) {
        this.props.deleteScoreItem(id);
    },
    modifyItem: function (id) {
        this.props.modifyItem(id);
    },
    render: function () {
        var scoreNotes = [];
        var genderFilter = +this.props.genderFilter,
            nameFilter = this.props.nameFilter,
            GENDER = ["", "男", "女"],
            _this = this;
        this.props.scoreNotes.map(function (scoreItem) {
            if (genderFilter !== 0 && nameFilter === "") {
                // 仅genderfilter生效
                if (GENDER[genderFilter] === scoreItem.gender) {
                    !scoreItem.deleteFlag &&
                        scoreNotes.push(
                            <ScoreItem
                                score={scoreItem}
                                onDelete={_this.deleteItemHandler}
                                onModify={_this.modifyItem}
                            />
                        );
                }
                return;
            }
            if (genderFilter === 0 && nameFilter !== "") {
                // 仅nameFilter生效
                if (scoreItem.name === nameFilter) {
                    !scoreItem.deleteFlag &&
                        scoreNotes.push(
                            <ScoreItem
                                score={scoreItem}
                                onDelete={_this.deleteItemHandler}
                                onModify={_this.modifyItem}
                            />
                        );
                }
                return;
            }
            if (genderFilter !== 0 && nameFilter !== "") {
                // 两个filter都生效
                if (
                    GENDER[genderFilter] === scoreItem.gender &&
                    scoreItem.name === nameFilter
                ) {
                    !scoreItem.deleteFlag &&
                        scoreNotes.push(
                            <ScoreItem
                                score={scoreItem}
                                onDelete={_this.deleteItemHandler}
                                onModify={_this.modifyItem}
                            />
                        );
                }
                return;
            }
            !scoreItem.deleteFlag &&
                scoreNotes.push(
                    <ScoreItem
                        score={scoreItem}
                        onDelete={_this.deleteItemHandler}
                        onModify={_this.modifyItem}
                    />
                );
        });
        return (
            <table>
                                
                <thead>
                                        
                    <tr>
                                                <th>姓名</th>
                                                <th>性别</th>
                                                <th>语文</th>
                                                <th>数学</th>
                                                <th>操作</th>
                                            
                    </tr>
                                    
                </thead>
                                
                <tbody>
                                        {scoreNotes}
                                    
                </tbody>
                            
            </table>
        );
    },
});
var ScoreItem = React.createClass({
    deleteHandler: function (e, id) {
        this.props.onDelete(this.props.score._id);
    },
    modifyHandler: function () {
        this.props.onModify(this.props.score._id);
    },
    render: function () {
        var score = this.props.score;
        return (
            <tr>
                                <td>{score.name}</td>
                                <td>{score.gender}</td>
                                <td>{score.chinese}</td>
                                <td>{score.math}</td>
                                
                <td>
                    <span className="trigger" onClick={this.modifyHandler}>
                        修改
                    </span>
                    <span className="trigger" onClick={this.deleteHandler}>
                        删除
                    </span>
                </td>
                            
            </tr>
        );
    },
});
React.render(<StudentScoreTable />, document.querySelector(".j-score"));
```

当然，功能都是实现了。但我却感觉非常不舒服。首先，让我们来看看数据在这些组件间是怎么通信的（数据怎么在这些组件间传递的）。StudentScoreTable 拥有数据模型，由于这些数据会变，所以使用 state 储存。为了让数据能够传到其子组件，使用了 props，如：

```c
<div>
               <GenderFilter onGenderChange={this.onGenderChange} genderFilter={this.state.genderFilter}/>
               <NameFilter onNameChange={this.onNameChange} nameFilter={this.state.nameFilter}/>
               <ScoreTable
                    scoreNotes={this.state.data}
                    genderFilter={this.state.genderFilter}
                    nameFilter={this.state.nameFilter}
                    deleteScoreItem={this.onDeleteScoreItem}
                    modifyItem={this.onModify}
               />
           </div>
```

再往下看，就会知道，整个数据从 StudentScoreTable 到其包含的组件，都是使用 props 一层一层传下去的。当 ScoreItem 删除时，为了使用 StudentScoreTable 能够感知到，还利用 props 建立了一个事件传递链接：

ScoreItem 的 click 事件，调用其本身的 deleteHandler ->ScoreTable 的 onDelete –>ScoreTable 自身的 deleteItemHandler –> StudentScoreTable 的 deleteItem –> StudentScoreTable 的 onDeleteScoreItem，更新 state，完成 ScoreItem 的删除

从上面的数据，事件传递链，可以看出，都是一层一层传递，为了建立数据或事件的通信链，写了很多没用的 props 属性。这还不是问题的关键，毕竟这里只有三级组件嵌套，如果有 6 级，10 级呢？很显示，再这样一层一层地进行组件通信，是不可行的。

那么有没有一种方法，可以跨级调用组件的方法呢？比如可以直接通过 ScoreItem 直接调用 StudentScoreTable 的方法，让其更新其 state，这样就可以省掉中间的 ScoreTable 组件。在同事的提醒下，有了第二版实现：

```javascript
// 测试数据
var _score = 略;
var StudentScoreTable,
    GenderFilter,
    NameFilter,
    ScoreTable,
    ScoreItem,
    _StudentScoreTable,
    _GenderFilter,
    _NameFilter,
    _ScoreItem;
StudentScoreTable = React.createClass({
    getInitialState: function () {
        _StudentScoreTable = this; // 把StudentScoreTable组件赋值给一个变量，以便在其它组件中可以使用此组件的方法
        return {
            genderFilter: 0,
            nameFilter: "",
            data: _score,
            modifyScore: null,
            className: "dialog modify",
        };
    },
    onGenderChange: function (gender) {
        this.setState({ genderFilter: gender });
    },
    onDeleteScoreItem: function (id) {
        var data = this.state.data.map(function (item) {
            if (item._id === id) {
                item.deleteFlag = true;
            }
            return item;
        });
        this.setState(data, data);
    },
    onNameChange: function (name) {
        this.setState({ nameFilter: name });
    },
    render: function () {
        return (
            <div>
                              {" "}
                <GenderFilter genderFilter={this.state.genderFilter} />
                               <NameFilter nameFilter={this.state.nameFilter} />
                               <ScoreTable scoreNotes={this.state.data} />
                          {" "}
            </div>
        );
    },
});
GenderFilter = React.createClass({
    getInitialState: function () {
        _GenderFilter = this;
        return null;
    },
    genderChangeHandler: function () {
        _StudentScoreTable.onGenderChange(
            this.refs.genderFilter.getDOMNode().value
        );
    },
    render: function () {
        return (
            <div className="condition-item">
                                
                <label>
                                        <span>按性别筛选</span>
                                        
                    <select
                        onChange={this.genderChangeHandler}
                        ref="genderFilter"
                    >
                                                <option value="0">All</option>
                                                <option value="1">男生</option>
                                                <option value="2">女生</option>
                                            
                    </select>
                                    
                </label>
                            
            </div>
        );
    },
});
NameFilter = React.createClass({
    getInitialState: function () {
        _NameFilter = this;
        return null;
    },
    nameChangeHandler: function () {
        _StudentScoreTable.onNameChange(
            this.refs.nameFilter.getDOMNode().value
        );
    },
    render: function () {
        return (
            <div className="condition-item">
                                
                <label>
                                        <span>按姓名筛选</span>
                                        
                    <input
                        type="text"
                        ref="nameFilter"
                        onChange={this.nameChangeHandler}
                        value={this.props.nameFilter}
                    />
                                    
                </label>
                            
            </div>
        );
    },
});
ScoreTable = React.createClass({
    render: function () {
        var scoreNotes = [];
        var genderFilter = +_StudentScoreTable.state.genderFilter,
            nameFilter = _StudentScoreTable.state.nameFilter,
            GENDER = ["", "男", "女"],
            _this = this;
        this.props.scoreNotes.map(function (scoreItem) {
            if (genderFilter !== 0 && nameFilter === "") {
                // 仅genderfilter生效
                if (GENDER[genderFilter] === scoreItem.gender) {
                    !scoreItem.deleteFlag &&
                        scoreNotes.push(<ScoreItem score={scoreItem} />);
                }
                return;
            }
            if (genderFilter === 0 && nameFilter !== "") {
                // 仅nameFilter生效
                if (scoreItem.name === nameFilter) {
                    !scoreItem.deleteFlag &&
                        scoreNotes.push(<ScoreItem score={scoreItem} />);
                }
                return;
            }
            if (genderFilter !== 0 && nameFilter !== "") {
                // 两个filter都生效
                if (
                    GENDER[genderFilter] === scoreItem.gender &&
                    scoreItem.name === nameFilter
                ) {
                    !scoreItem.deleteFlag &&
                        scoreNotes.push(<ScoreItem score={scoreItem} />);
                }
                return;
            }
            !scoreItem.deleteFlag &&
                scoreNotes.push(<ScoreItem score={scoreItem} />);
        });
        return (
            <table>
                                
                <thead>
                                        
                    <tr>
                                                <th>姓名</th>
                                                <th>性别</th>
                                                <th>语文</th>
                                                <th>数学</th>
                                                <th>操作</th>
                                            
                    </tr>
                                    
                </thead>
                                
                <tbody>
                                        {scoreNotes}
                                    
                </tbody>
                            
            </table>
        );
    },
});
ScoreItem = React.createClass({
    getInitialState: function () {
        _ScoreItem = this;
        return null;
    },
    deleteHandler: function (e, id) {
        _StudentScoreTable.onDeleteScoreItem(this.props.score._id);
    },
    render: function () {
        var score = this.props.score;
        return (
            <tr>
                                <td>{score.name}</td>
                                <td>{score.gender}</td>
                                <td>{score.chinese}</td>
                                <td>{score.math}</td>
                                
                <td>
                    <span className="trigger">修改</span>
                    <span className="trigger" onClick={this.deleteHandler}>
                        删除
                    </span>
                </td>
                            
            </tr>
        );
    },
});
React.render(<StudentScoreTable />, document.querySelector(".j-score"));
```

这主要的变化就是要通信的两个组件，直接通过其组件句柄去直接访问其方法，没有了中间环节，代码也简洁了很多。

React 的官网上有这样一段话：

For communication between two components that don't have a parent-child relationship, you can set up your own global event system. Subscribe to events in componentDidMount(), unsubscribe in componentWillUnmount(), and call setState() when you receive an event.

大意就是说，可以使用观察者模式来解决组件间的通信。在这之上，学生成绩表的第三个版本出来了 (得先实现一个 PubSub，网上有很多，随便找一个)：

```javascript
// 测试数据
var _score = 略;
var StudentScoreTable,
    _StudentScoreTable,
    GenderFilter,
    NameFilter,
    ScoreTable,
    ScoreItem,
    ScoreItemDeleteEvt = "scoreitem delete event",
    GenderFilterChangeEvt = "genderFilter change event",
    NameFilterChangeEvt = "nameFilter change event";
StudentScoreTable = React.createClass({
    getInitialState: function () {
        _StudentScoreTable = this;
        return {
            genderFilter: 0,
            nameFilter: "",
            data: _score,
            modifyScore: null,
            className: "dialog modify",
        };
    },
    componentDidMount: function () {
        // 订阅ScoreItem的删除事件
        PubSub.subscribe(ScoreItemDeleteEvt, this.onDeleteScoreItem); // 订阅GenderFilter的改变事件
        PubSub.subscribe(GenderFilterChangeEvt, this.onGenderChange); // 订阅NameFilter的改变事件
        PubSub.subscribe(NameFilterChangeEvt, this.onNameChange);
    },
    onGenderChange: function (gender) {
        this.setState({ genderFilter: gender });
    },
    onDeleteScoreItem: function (id) {
        var data = this.state.data.map(function (item) {
            if (item._id === id) {
                item.deleteFlag = true;
            }
            return item;
        });
        this.setState(data, data);
    },
    onNameChange: function (name) {
        this.setState({ nameFilter: name });
    },
    render: function () {
        return (
            <div>
                              {" "}
                <GenderFilter genderFilter={this.state.genderFilter} />
                               <NameFilter nameFilter={this.state.nameFilter} />
                               <ScoreTable scoreNotes={this.state.data} />
                          {" "}
            </div>
        );
    },
});
GenderFilter = React.createClass({
    genderChangeHandler: function () {
        // 发布GenderChange事件
        PubSub.publish(
            GenderFilterChangeEvt,
            this.refs.genderFilter.getDOMNode().value
        );
    },
    render: function () {
        return (
            <div className="condition-item">
                                
                <label>
                                        <span>按性别筛选</span>
                                        
                    <select
                        onChange={this.genderChangeHandler}
                        ref="genderFilter"
                    >
                                                <option value="0">All</option>
                                                <option value="1">男生</option>
                                                <option value="2">女生</option>
                                            
                    </select>
                                    
                </label>
                            
            </div>
        );
    },
});
NameFilter = React.createClass({
    nameChangeHandler: function () {
        PubSub.publish(
            NameFilterChangeEvt,
            this.refs.nameFilter.getDOMNode().value
        );
    },
    render: function () {
        return (
            <div className="condition-item">
                                
                <label>
                                        <span>按姓名筛选</span>
                                        
                    <input
                        type="text"
                        ref="nameFilter"
                        onChange={this.nameChangeHandler}
                        value={this.props.nameFilter}
                    />
                                    
                </label>
                            
            </div>
        );
    },
});
ScoreTable = React.createClass({
    render: function () {
        var scoreNotes = [];
        var genderFilter = +_StudentScoreTable.state.genderFilter,
            nameFilter = _StudentScoreTable.state.nameFilter,
            GENDER = ["", "男", "女"],
            _this = this;
        this.props.scoreNotes.map(function (scoreItem) {
            if (genderFilter !== 0 && nameFilter === "") {
                // 仅genderfilter生效
                if (GENDER[genderFilter] === scoreItem.gender) {
                    !scoreItem.deleteFlag &&
                        scoreNotes.push(<ScoreItem score={scoreItem} />);
                }
                return;
            }
            if (genderFilter === 0 && nameFilter !== "") {
                // 仅nameFilter生效
                if (scoreItem.name === nameFilter) {
                    !scoreItem.deleteFlag &&
                        scoreNotes.push(<ScoreItem score={scoreItem} />);
                }
                return;
            }
            if (genderFilter !== 0 && nameFilter !== "") {
                // 两个filter都生效
                if (
                    GENDER[genderFilter] === scoreItem.gender &&
                    scoreItem.name === nameFilter
                ) {
                    !scoreItem.deleteFlag &&
                        scoreNotes.push(<ScoreItem score={scoreItem} />);
                }
                return;
            }
            !scoreItem.deleteFlag &&
                scoreNotes.push(<ScoreItem score={scoreItem} />);
        });
        return (
            <table>
                                
                <thead>
                                        
                    <tr>
                                                <th>姓名</th>
                                                <th>性别</th>
                                                <th>语文</th>
                                                <th>数学</th>
                                                <th>操作</th>
                                            
                    </tr>
                                    
                </thead>
                                
                <tbody>
                                        {scoreNotes}
                                    
                </tbody>
                            
            </table>
        );
    },
});
ScoreItem = React.createClass({
    deleteHandler: function (e, id) {
        PubSub.publish(ScoreItemDeleteEvt, this.props.score._id);
    },
    render: function () {
        var score = this.props.score;
        return (
            <tr>
                                <td>{score.name}</td>
                                <td>{score.gender}</td>
                                <td>{score.chinese}</td>
                                <td>{score.math}</td>
                                
                <td>
                    <span className="trigger">修改</span>
                    <span className="trigger" onClick={this.deleteHandler}>
                        删除
                    </span>
                </td>
                            
            </tr>
        );
    },
});
React.render(<StudentScoreTable />, document.querySelector(".j-score"));
```

在使用 PubSub 后，代码就更清晰明了，而且大家都知道，PubSub 有助于解藕，这非常有助于组织代码结构。

**小结：**

本文通过一个实际小例子讨论了 React 中组件通信的三种方法：

1.  使用 props，构建通信链
2.  在组件初始化的时候，保存组件的句柄，在其它组件中，使用此句柄达到直接访问组件的目的，完成通信
3.  使用 PubSub 模式

其中，第 1 种方式，在组件嵌套较深时，显示不适用。第 2 种在组件很多时，也得定义维护很多变量。相比之下，PubSub 模式有助于解藕和代码组织，在 React 的组件通信时，推荐使用此方法。

最后，由于本人水平有限，也缺少 React 实战经验，有不严谨或不对的地方，还望大家指正。

附上源代码：<http://share.weiyun.com/08ee52ccec9e21897d9f56ec0e62ec17>

<!-- {% endraw %} - for jekyll -->