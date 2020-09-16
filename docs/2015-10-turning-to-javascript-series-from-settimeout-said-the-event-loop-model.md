---
title: 【转向 Javascript 系列】从 setTimeout 说事件循环模型
date: 2015-10-19
author: TAT.ronnie
source_link: http://www.alloyteam.com/2015/10/turning-to-javascript-series-from-settimeout-said-the-event-loop-model/
---

<!-- {% raw %} - for jekyll -->

作为一个从其他编程语言（C#/Java）转到 Javascript 的开发人员，在学习 Javascript 过程中，setTimeout () 方法的运行原理是我遇到的一个不太好理解的部分，本文尝试结合其他编程语言的实现，从 setTimeout 说事件循环模型

1. 从 setTimeout 说起  

* * *

setTimeout () 方法不是 ecmascript 规范定义的内容，而是属于 BOM 提供的功能。查看 w3school 对 setTimeout () 方法的定义，setTimeout () 方法用于在指定的毫秒数后调用函数或计算表达式。

语法 setTimeout (fn,millisec)，其中 fn 表示要执行的代码，可以是一个包含 javascript 代码的字符串，也可以是一个函数。第二个参数 millisec 是以毫秒表示的时间，表示 fn 需推迟多长时间执行。

调用 setTimeout () 方法之后，该方法返回一个数字，这个数字是计划执行代码的唯一标识符，可以通过它来取消超时调用。

起初我对 setTimeout () 的使用比较简单，对其运行机理也没有深入的理解，直到看到下面代码

```javascript
var start = new Date();
setTimeout(function () {
    var end = new Date();
    console.log("Time elapsed:", end - start, "ms");
}, 500);
while (new Date() - start < 1000) {}
```

在我最初对 setTimeout () 的认识中，延时设置为 500ms，所以输出应该为 Time elapsed: 500 ms。因为在直观的理解中，Javascript 执行引擎，在执行上述代码过程中，应当是一个由上往下的顺序执行过程，setTimeout 函数是先于 while 语句执行的。可是实际上，上述代码运行多次后，输出至少是延迟了 1000ms。

2.Java 对 setTimeout 的实现  

* * *

联想起以往学习 Java 的经验，上述 Javascript 的 setTimeout () 让我困惑。Java 对 setTimeout 的实现有多种 API 实现，这里我们以 java.util.Timer 包为例。使用 Timer 在 Java 中实现上述逻辑，运行多次，输出都是 Time elapsed: 501 ms。

```javascript
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;
 
public class TimerTest {
 
    public static void main(String[] args) {
        // TODO Auto-generated method stub
        long start = System.currentTimeMillis();
        Timer timer = new Timer();
        timer.schedule(new MyTask(start), 500);
        while (System.currentTimeMillis() - start < 1000) {};
    }
 
}
 
class MyTask extends TimerTask {
    private long t;
 
    public MyTask(long start) {
        // TODO Auto-generated constructor stub
        t=start;
    }
 
    @Override
    public void run() {
        // TODO Auto-generated method stub
        long end = System.currentTimeMillis();
```


<!-- {% endraw %} - for jekyll -->