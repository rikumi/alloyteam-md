---
title: 编程小技巧分享 (队列回调)
date: 2015-07-25
author: TAT.finlay
source_link: http://www.alloyteam.com/2015/07/bian-cheng-xiao-ji-qiao-fen-xiang-dui-lie-hui-diao/
---

<!-- {% raw %} - for jekyll -->

# 场景描述

> 有时候我们会碰到这样的任务场景，需要在一个界面上展示，许多图表内容，而获取图表数据的 CGI 做得非常原子化，也不方便更改，那么只能发很多个请求来拉取数据，展示图表，大致像下面的界面。  
> [![liushui](http://www.alloyteam.com/wp-content/uploads/2015/07/liushui.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/liushui.png)  
> 或者有时候，希望一系列函数按照一定顺序自动执行，但里面内嵌各种回调，完全不知道函数何时执行。可能不得不使用标志位来记录执行阶段。(当然可以使用 promise, 这里是尝试给出另外一种解决方案和思路), 这样代码看来一团糟，作为有处女座潜质的程序员多少有些纠结。

背景交代完毕，现在是正题，小技巧分享。  
其实呢，我们需要的只是一个有加载顺序的队列来完成任务。  
但是这里有个思维难点是程序执行流程并非线性推进，而是通过事件推进，不符合常规的线性思维方式。

我就想了一种可以让代码看起来更线性的一种方案.

代码如下:

```javascript
var queuePool = (function(){
var pools = [] , 
    isRunning = false ;
    function walk(){
        var runner = pools.shift();
        if( runner ){
            runner( walk );
        }else{
            isRunning = false ;
        }
    }
    return {
        add : function( fn ){
            pools.push( fn );
        } ,
        run : function(){
            if( !isRunning ){
                isRunning = true ;
                walk();
```


<!-- {% endraw %} - for jekyll -->