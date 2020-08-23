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
    {name: '张三', gender: '男', chinese: 85, math: 98, _id:0},
    {name: '张三', gender: '女', chinese: 95, 
```


<!-- {% endraw %} - for jekyll -->