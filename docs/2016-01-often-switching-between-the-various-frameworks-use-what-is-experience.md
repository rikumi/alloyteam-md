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

````c
<— todo.html —>
<!DOCTYPE html>
<html>
<head>
    <meta charset=’utf-8’ > 
    <title>BtoDo</title>
    
```html
<script type=’text/javascript’ src=’lib/underscore.min.js’></script>
````

    

```html
<script type=’text/javascript’ src=’lib/jquery-2.1.4.min.js’></script>
```

    

```html
<script type=’text/javascript’ src=’lib/backbone.min.js’></script>
```

    <style type=’text/css’>
        .list-wrapper{
            margin: 20px auto ;
            width: 300px;
        }
        .done-true {
          text-decoration:

```

```


<!-- {% endraw %} - for jekyll -->