---
title: stepify：轻松整合 Node.js 异步工作流
date: 2014-01-09
author: TAT.dmyang
source_link: http://www.alloyteam.com/2014/01/node-stepify-module/
---

<!-- {% raw %} - for jekyll -->

Node.js 中基本都是异步编程，我们回想下为什么初学者很容易写出深度嵌套 callback 的代码？因为直观啊，一眼即懂。当然实际写的时候肯定不推荐 callback 套 callback，需要一个工具来把一个任务完整的串起来。

我们知道，在项目管理里面有一个很出名的理论，叫番茄工作法（不知道的自行 google），它所做的事情是把未来一段时间要做的事情都按照时间段拆分成一个个很小的任务，然后逐个完成。

stepify 设计思路和番茄工作法有些类似，都是先定义好了任务最后再执行，不同的是前者以单个异步操作作粒度划分，后者只是以时间划分。

想想现实中我们怎么去做事的：比如做饭这件不大不小的事儿，因为只有一个煤气灶，所以炒菜只能炒完一个炒下一个菜，但是同时我们有个电饭煲，所以可以在炒菜的同时煮饭。这样子下来，做一顿饭的总时间就是 max (煮饭的时间，烧菜的时间)。而在炒菜的过程中，没有规定一定要先西红柿炒蛋完了之后再蛋炒番茄。这个做饭的过程，可以类比成上文所说的工作流，煮饭和烧菜是两个并行的 task，每烧一个菜算是完成一个 step。

stepify 中的每一个异步任务执行的时机是前一个异步操作执行完而且没遇到异常，如果遇到异常，则把异常交给事先定义好的异常处理函数，在异常处理函数里可以决定是否继续执行下一个任务（比如烧菜时发现没了酱油，你可以决定是否还继续炒这道菜还是换下一道）。

抽象了？直接看代码文档吧，代码托管在 [github](https://github.com/chemdemo/node-stepify "stepify")。

stepify 目前已经发布到 [npm](https://npmjs.org/package/stepify "stepify")，可以使用 npm 直接安装：

    $ npm install stepify

**用法：**

**假设有一个工作（**work**）需要完成，它分解为** task1**、**task2**、**task3**。。。几个任务，每个任务分为好几个步骤（**step**），使用** stepify **实现的伪代码如下：**

```javascript
var workflow = Stepify()
    .task("t1")
    .step("t1s1", fn) // t1s1的执行结果可以通过fn内部的`this.done`方法传给t1s2，下同
    .step("t1s2", fn)
    .step("s", fn)
    .task("t2")
    .step("t2s1", fn)
    .step("t2s2", fn)
    .step("s", fn) // 定义任务t2的异常处理函数
    .error(fn)
    .task("t3")
    .step("t3s1", fn)
    .step("t3s2", fn) // pend是指结束一个task的定义，接下来定义下一个task或者一些公共方法 // task里边其实会先调用下pend以自动结束上一个task的定义
    .pend() // 处理work中每一个task的每一个（异步）step异常
    .error(fn) // 处理最终结果，result()是可选的（不需要关注输出的情况）
    .result(fn)
    .run();
```

这里可以看到，工作原理很简单，就是\*\*先定义好后执行\*\*。

解释下，pend 的作用是分割 task 的定义，表示这个 task 要具体怎么做已经定义好了。里边还有两个 `error()`的调用，跟在 t2 后面 error 调用的表明 t2 的异常由传入这个 error 的函数来处理，t1 和 t3 没有显示定义 error，所以它们的异常将交给后面一个 error 定义的函数来处理，这个是不是很像 js 的时间冒泡？

默认情况下，work 的执行是按照 task 定义的顺序来串行执行的，所以还可以这样简化：

```javascript
var workflow = Stepify()
    .step('t1s1', fn)
    .step('t1s2', fn)
    .step('s', fn)
    .pend()
    .step('t2s1'
```


<!-- {% endraw %} - for jekyll -->