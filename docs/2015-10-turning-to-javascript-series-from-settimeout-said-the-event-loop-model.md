---
title: 【转向 Javascript 系列】从 setTimeout 说事件循环模型
date: 2015-10-19
author: TAT.ronnie
source_link: http://www.alloyteam.com/2015/10/turning-to-javascript-series-from-settimeout-said-the-event-loop-model/
---

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
        System.out.println("Time elapsed:"+(end - this.t)+ "ms");
    }
    
}
```

这里深究 setTimeout () 为什么出现这一差异之前，先说说 java.util.Timer 的实现原理。

上述代码几个关键要素为 Timer、TimerTask 类以及 Timer 类的 schedule 方法，通过阅读相关源码，可以了解其实现。

Timer：一个 Task 任务的调度类，和 TimerTask 任务一样，是供用户使用的 API 类，通过 schedule 方法安排 Task 的执行计划。该类通过 TaskQueue 任务队列和 TimerThread 类完成 Task 的调度。

TimerTask：实现 Runnable 接口，表明每一个任务均为一个独立的线程，通过 run () 方法提供用户定制自己任务。

TimerThread：继承于 Thread，是真正执行 Task 的类。

TaskQueue：存储 Task 任务的数据结构，内部由一个最小堆实现，堆的每个成员为 TimeTask，每个任务依靠 TimerTask 的 nextExecutionTime 属性值进行排序，nextExecutionTime 最小的任务在队列的最前端，从而能够现实最早执行。

[![Timer](http://www.alloyteam.com/wp-content/uploads/2015/10/Timer.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/Timer.png)

3. 根据结果找原因  

* * *

看过了 Java.util.Timer 对类似 setTimeout () 的实现方案，继续回到前文 Javascript 的 setTimeout () 方法中，再来看看之前的输出为什么与预期不符。

```javascript
var start = new Date();
setTimeout(function () {
    var end = new Date();
    console.log("Time elapsed:", end - start, "ms");
}, 500);
while (new Date() - start < 1000) {}
```

通过阅读代码不难看出，setTimeout () 方法执行在 while () 循环之前，它声明了 “ 希望” 在 500ms 之后执行一次匿名函数，这一声明，也即对匿名函数的注册，在 setTimeout () 方法执行后立即生效。代码最后一行的 while 循环会持续运行 1000ms，通过 setTimeout () 方法注册的匿名函数输出的延迟时间总是大于 1000ms，说明对这一匿名函数的实际调用被 while () 循环阻塞了，实际的调用在 while () 循环阻塞结束后才真正执行。

而在 Java.util.Timer 中，对于定时任务的解决方案是通过多线程手段实现的，任务对象存储在任务队列，由专门的调度线程，在新的子线程中完成任务的执行。通过 schedule () 方法注册一个异步任务时，调度线程在子线程立即开始工作，主线程不会阻塞任务的运行。

这就是 Javascript 与 Java/C# 之类语言的一大差异，即 Javascript 的单线程机制。在现有浏览器环境中，Javascript 执行引擎是单线程的，主线程的语句和方法，会阻塞定时任务的运行，执行引擎只有在执行完主线程的语句后，定时任务才会实际执行，这期间的时间，可能大于注册任务时设置的延时时间。在这一点上，Javascript 与 Java/C# 的机制很不同。

4. 事件循环模型  

* * *

在单线程的 Javascript 引擎中，setTimeout () 是如何运行的呢，这里就要提到浏览器内核中的事件循环模型了。简单的讲，在 Javascript 执行引擎之外，有一个任务队列，当在代码中调用 setTimeout () 方法时，注册的延时方法会交由浏览器内核其他模块（以 webkit 为例，是 webcore 模块）处理，当延时方法到达触发条件，即到达设置的延时时间时，这一延时方法被添加至任务队列里。这一过程由浏览器内核其他模块处理，与执行引擎主线程独立，执行引擎在主线程方法执行完毕，到达空闲状态时，会从任务队列中顺序获取任务来执行，这一过程是一个不断循环的过程，称为事件循环模型。

参考一个演讲中的资料，上述事件循环模型可以用下图描述。

[![eventloop](http://www.alloyteam.com/wp-content/uploads/2015/10/eventloop-300x263.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/eventloop.png)

Javascript 执行引擎的主线程运行的时候，产生堆（heap）和栈（stack）。程序中代码依次进入栈中等待执行，当调用 setTimeout () 方法时，即图中右侧 WebAPIs 方法时，浏览器内核相应模块开始延时方法的处理，当延时方法到达触发条件时，方法被添加到用于回调的任务队列，只要执行引擎栈中的代码执行完毕，主线程就会去读取任务队列，依次执行那些满足触发条件的回调函数。

以演讲中的示例进一步说明

[![s1](http://www.alloyteam.com/wp-content/uploads/2015/10/s1.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/s1.png)

[![s2](http://www.alloyteam.com/wp-content/uploads/2015/10/s2.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/s2.png)

以图中代码为例，执行引擎开始执行上述代码时，相当于先讲一个 main () 方法加入执行栈。继续往下开始 console.log ('Hi') 时，log ('Hi') 方法入栈，console.log 方法是一个 webkit 内核支持的普通方法，而不是前面图中 WebAPIs 涉及的方法，所以这里 log ('Hi') 方法立即出栈被引擎执行。

[![s3](http://www.alloyteam.com/wp-content/uploads/2015/10/s3.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/s3.png)

[![s4](http://www.alloyteam.com/wp-content/uploads/2015/10/s4.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/s4.png)

console.log ('Hi') 语句执行完成后，log () 方法出栈执行，输出了 Hi。引擎继续往下，将 setTimeout (callback,5000) 添加到执行栈。setTimeout () 方法属于事件循环模型中 WebAPIs 中的方法，引擎在将 setTimeout () 方法出栈执行时，将延时执行的函数交给了相应模块，即图右方的 timer 模块来处理。

[![s5](http://www.alloyteam.com/wp-content/uploads/2015/10/s5.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/s5.png)

执行引擎将 setTimeout 出栈执行时，将延时处理方法交由了 webkit timer 模块处理，然后立即继续往下处理后面代码，于是将 log ('SJS') 加入执行栈，接下来 log ('SJS') 出栈执行，输出 SJS。而执行引擎在执行万 console.log ('SJS') 后，程序处理完毕，main () 方法也出栈。

[![s6](http://www.alloyteam.com/wp-content/uploads/2015/10/s6.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/s6.png)

[![s7](http://www.alloyteam.com/wp-content/uploads/2015/10/s7.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/s7.png)

[![s8](http://www.alloyteam.com/wp-content/uploads/2015/10/s8.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/s8.png)

这时在在 setTimeout 方法执行 5 秒后，timer 模块检测到延时处理方法到达触发条件，于是将延时处理方法加入任务队列。而此时执行引擎的执行栈为空，所以引擎开始轮询检查任务队列是否有任务需要被执行，就检查到已经到达执行条件的延时方法，于是将延时方法加入执行栈。引擎发现延时方法调用了 log () 方法，于是又将 log () 方法入栈。然后对执行栈依次出栈执行，输出 there，清空执行栈。

清空执行栈后，执行引擎会继续去轮询任务队列，检查是否还有任务可执行。

5.webkit 中 timer 的实现  

* * *

到这里已经可以彻底理解下面代码的执行流程，执行引擎先将 setTimeout () 方法入栈被执行，执行时将延时方法交给内核相应模块处理。引擎继续处理后面代码，while 语句将引擎阻塞了 1 秒，而在这过程中，内核 timer 模块在 0.5 秒时已将延时方法添加到任务队列，在引擎执行栈清空后，引擎将延时方法入栈并处理，最终输出的时间超过预期设置的时间。

```javascript
var start = new Date();
setTimeout(function () {
    var end = new Date();
    console.log("Time elapsed:", end - start, "ms");
}, 500);
while (new Date() - start < 1000) {}
```

前面事件循环模型图中提到的 WebAPIs 部分，提到了 DOM 事件，AJAX 调用和 setTimeout 方法，图中简单的把它们总结为 WebAPIs，而且他们同样都把回调函数添加到任务队列等待引擎执行。这是一个简化的描述，实际上浏览器内核对 DOM 事件、AJAX 调用和 setTimeout 方法都有相应的模块来处理，webkit 内核在 Javasctipt 执行引擎之外，有一个重要的模块是 webcore 模块，html 的解析，css 样式的计算等都由 webcore 实现。对于图中 WebAPIs 提到的三种 API，webcore 分别提供了 DOM Binding、network、timer 模块来处理底层实现，这里还是继续以 setTimeout 为例，看下 timer 模块的实现。

Timer 类是 webkit 内核的一个必需的基础组件，通过阅读源码可以全面理解其原理，本文对其简化，分析其执行流程。

[![webkittimer](http://www.alloyteam.com/wp-content/uploads/2015/10/webkittimer.png)](http://www.alloyteam.com/wp-content/uploads/2015/10/webkittimer.png)

通过 setTimeout () 方法注册的延时方法，被传递给 webcore 组件 timer 模块处理。timer 中关键类为 TheadTimers 类，其包含两个重要成员，TimerHeap 任务队列和 SharedTimer 方法调度类。延时方法被封装为 timer 对象，存储在 TimerHeap 中。和 Java.util.Timer 任务队列一样，TimerHeap 同样采用最小堆的数据结构，以 nextFireTime 作为关键字排序。SharedTimer 作为 TimerHeap 调度类，在 timer 对象到达触发条件时，通过浏览器平台相关的接口，将延时方法添加到事件循环模型中提到的任务队列中。

TimerHeap 采用最小堆的数据结构，预期延时时间最小的任务最先被执行，同时，预期延时时间相同的两个任务，其执行顺序是按照注册的先后顺序执行。

```javascript
var start = new Date();
setTimeout(function () {
    console.log("fn1");
}, 20);
setTimeout(function () {
    console.log("fn2");
}, 30);
setTimeout(function () {
    console.log("another fn2");
}, 30);
setTimeout(function () {
    console.log("fn3");
}, 10);
console.log("start while");
while (new Date() - start < 1000) {}
console.log("end while");
```

上述代码输出依次为

    start while
    end while
    fn3
    fn1
    fn2
    another fn2

参考资料  

* * *

1.《Javascript 异步编程》

2.JavaScript 运行机制详解：再谈 Event Loop<http://www.ruanyifeng.com/blog/2014/10/event-loop.html>

3.Philip Roberts: Help, I'm stuck in an event-loop.<https://vimeo.com/96425312>

4.How JavaScript Timers Work.<http://ejohn.org/blog/how-javascript-timers-work/>

5.How WebKit’s event model works.<http://brrian.tumblr.com/post/13951629341/how-webkits-event-model-works>

6.Timer 实现.<http://blog.csdn.net/shunzi__1984/article/details/6193023>