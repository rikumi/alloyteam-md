---
title: 用 AOP 改善 javascript 代码
date: 2013-08-12
author: TAT.svenzeng
source_link: http://www.alloyteam.com/2013/08/yong-aop-gai-shan-javascript-dai-ma/
---

<!-- {% raw %} - for jekyll -->

Aop 又叫面向切面编程，用过 spring 的同学肯定对它非常熟悉，而在 js 中，AOP 是一个被严重忽视的技术点，这篇就通过下面这几个小例子，来说说 AOP 在 js 中的妙用.

1, 防止 window.onload 被二次覆盖.  
2，无侵入的统计代码.  
3, 分离表单请求和校验.  
4，给 ajax 请求动态添加参数.  
5，职责链模式.  
6, 组合代替继承.

先给出 before 和 after 这 2 个 “切面” 函数。顾名思义，就是让一个函数在另一个函数之前或者之后执行，巧妙的是，before 或者 after 都可以和当前的函数公用 this 和 arguments, 这样一来供我们发挥的地方就多着了.

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/15.gif "1")](http://www.alloyteam.com/wp-content/uploads/2013/08/15.gif)

处理 window.onload 被二次覆盖.

前段时间看到 QQ 群里有个人问问题，要改写 window.onload, 怎么才能不把以前的 window.onload 函数覆盖掉.

最原始的方案肯定是直接在原来的 window.onload 里添上你的新代码.

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/21.gif "2")](http://www.alloyteam.com/wp-content/uploads/2013/08/21.gif)

这样的坏处非常明显，需要去改动原有的函数，是侵入性最强的一种做法.

另外一种稍微好点的方案是用中间变量保存以前的 window.onload;

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/31.gif "3")](http://www.alloyteam.com/wp-content/uploads/2013/08/31.gif)

这样一来，多了一个讨厌的中间变量\_\_onload, 来管理它也要花费一些额外的成本.

试想一下这个场景，当人觉得天气冷，出门的时候很自然选择穿上一件貂皮大衣，而不是把自己的皮扯掉换成貂皮。动态装饰的好处就体现出来了，完全不会侵入之前的函数.

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/4.gif "4")](http://www.alloyteam.com/wp-content/uploads/2013/08/4.gif)

无侵入的统计代码

本身跟逻辑没有任何关联的统计代码要被硬插进函数里，这点相信很多搞过上报的同学都很不爽。比如下面这段代码，用来统计一个创建 1000 个节点的函数在用户的电脑上要花费多少时间.

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/41.gif "4")](http://www.alloyteam.com/wp-content/uploads/2013/08/41.gif)

用 aop 的方式，不再需要在函数内部做改动，先定义一个通用的包装器.

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/5.gif "5")](http://www.alloyteam.com/wp-content/uploads/2013/08/5.gif)

只要一行代码，便能给任何函数都加上统计时间的功能.

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/6.gif "6")](http://www.alloyteam.com/wp-content/uploads/2013/08/6.gif)

分离表单请求和校验

我们在提交表单之前经常会做一些校验工作，来确定表单是不是应该正常提交。最糟糕的写法是把验证的逻辑都放在 send 函数里面.

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/7.gif "7")](http://www.alloyteam.com/wp-content/uploads/2013/08/7.gif)

而更好的方式是把所有的校验规则用策略模式放到一个集合里，返回 false 或者 true 来决定是否通过验证。这样可以随意的选择和更换校验规则.

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/81.gif "8")](http://www.alloyteam.com/wp-content/uploads/2013/08/81.gif)

这样还有一个缺点，校验和发送请求这 2 个请求耦合到了一个函数里面，我们用 aop 来把它们分离开来，把 validata 做成插件化，真正的即插即用。只需把 send 函数改成:

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/9.gif "9")](http://www.alloyteam.com/wp-content/uploads/2013/08/9.gif)

过最前面 Function.prototype.before 的代码不难看出，我们约定，当前一个函数返回 false, 就会阻断下一个函数的执行，所以当 validata 返回 false 的时候，便不再继续执行 send. 而因为之前提到的 before 函数可以和当前函数公用 this 和 arguments, 所以 value 参数也能顺利的传递到 validata 函数里.

给 ajax 请求动态添加参数

第一个例子里 window.onload 是用的 after 后置装饰，这里是用 before 前置装饰。在 ajax 请求之前动态添加一些参数.

我们遇到过很多跨域的请求，jsonp 和 iframe 都是很常用的方式。之前在我们的项目里，用参数 retype=jsonp 表示是 jsonp 请求，retype=iframe 表示是 iframe 请求。除此之外这 2 个请求的参数没有任何区别。那么可以用 before 把 retype 参数动态装饰进去.

先定义一个 ajax 请求的代理函数.[![](http://www.alloyteam.com/wp-content/uploads/2013/08/101.gif "10")](http://www.alloyteam.com/wp-content/uploads/2013/08/101.gif)

这个函数里面没有逻辑处理和分支语句，它也不关心自己是 jsonp 请求还是 iframe 请求。它只负责发送数据，是一个单一职责的好函数.

接下来在发送请求前放置一个 before 装饰器.

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/111.gif "11")](http://www.alloyteam.com/wp-content/uploads/2013/08/111.gif)

开始发送请求:

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/121.gif "12")](http://www.alloyteam.com/wp-content/uploads/2013/08/121.gif)

职责链模式.

职责链模式在 js 中典型的应用场景是事件冒泡。将所有子节点和父节点连成一条链，并沿着这条链传递事件，直到有一个节点能够处理它为止。职责链模式是消除过多的 if else 语句的神器.

拿最近做的一个需求来举例，有个文件上传的功能，提供了控件，html5, flash, 表单上传这 4 种上传方式。根据它们的优先级以及浏览器支持情况来判断当前选择哪种上传方式。在我进行改造之前，它的伪代码大概是这样:

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/141.gif "14")](http://www.alloyteam.com/wp-content/uploads/2013/08/141.gif)

当然实际的代码远不只这么多，其中还包括了各种控件初始化，容错等情况。有天我需要屏蔽掉 flash，看起来是很简单的需求，但难度实际跟在心脏旁边拆掉一根毛线血管类似.

如果试试职责链模式呢，看看事情将变得多简单:

第一步先改写之前的 after 函数，使得返回一个对象时阻断职责链的传递，而返回 null 时继续传递请求。

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/151.gif "15")](http://www.alloyteam.com/wp-content/uploads/2013/08/151.gif)

接下来把每种控件的创建方式都包裹在各自的函数中，确保没有逻辑交叉和相互污染.

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/16.gif "16")](http://www.alloyteam.com/wp-content/uploads/2013/08/16.gif)

最后用职责链把它们串起来:

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/17.gif "17")](http://www.alloyteam.com/wp-content/uploads/2013/08/17.gif)

可以预见，某天我又需要屏蔽掉 flash, 那时的我只需要改动这一行代码。改成:

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/18.gif "18")](http://www.alloyteam.com/wp-content/uploads/2013/08/18.gif)

组合代替继承

很多时候我们在设计程序的时候，会遇到使用组合还是继承的问题。通常来讲，使用组合更灵活轻巧。还是拿之前文件上传来举例.

我定义了一个超类 Upload, 衍生出 4 个子类.  
Plugin_Upload, Html5_Upload, Flash_Upload 以及 Form_Upload.

Plugin_Upload 会继承父类，得到 Upload 的大部分功能，然后对控件上传的一些特性进行个性定制。比如其它 3 种上传方式都是选择文件后便开始上传。而控件上传在开始上传之前会经过一轮文件扫描.

第一种做法是 Plugin_Upload 继承 Upload, 然后重写它的 start_upload 方法.

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/19.gif "19")](http://www.alloyteam.com/wp-content/uploads/2013/08/19.gif)

用更轻的组合方式，可以直接给原来的 start_upload 函数装饰上扫描功能，甚至不需要衍生一个额外的子类.

[![](http://www.alloyteam.com/wp-content/uploads/2013/08/20.gif "20")](http://www.alloyteam.com/wp-content/uploads/2013/08/20.gif)


<!-- {% endraw %} - for jekyll -->