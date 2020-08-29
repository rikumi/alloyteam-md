---
title: 翻译：Node.js 十大常见的开发者错误
date: 2015-04-01
author: TAT.polar
source_link: http://www.alloyteam.com/2015/04/translate-top-10-common-nodejs-developer-mistakes/
---

<!-- {% raw %} - for jekyll -->

.text p {line-height: 1.7 !important;}

原文地址：[http://www.toptal.com/nodejs/top-10-common-nodejs-developer-mistakes](http://www.toptal.com/nodejs/top-10-common-nodejs-developer-mistakes?utm_source=javascriptweekly&utm_medium=email)

原文作者：MAHMUD RIDWAN

转载此译文请注明原文及译文出处，如译文有翻译不当之处还请各位看官指出。

自 Node.js 面世以来，它获得了大量的赞美和批判。这种争论会一直持续，短时间内都不会结束。而在这些争论中，我们常常会忽略掉所有语言和平台都是基于一些核心问题来批判的，就是我们怎么去使用这些平台。无论使用 Node.js 编写可靠的代码有多难，而编写高并发代码又是多么的简单，这个平台终究是有那么一段时间了，而且被用来创建了大量的健壮而又复杂的 web 服务。这些 web 服务不仅拥有良好的扩展性，而且通过在互联网上持续的时间证明了它们的健壮性。

然而就像其它平台一样，Node.js 很容易令开发者犯错。这些错误有些会降低程序性能，有些则会导致 Node.js 不可用。在本文中，我们会看到 Node.js 新手常犯的十种错误，以及如何去避免它们。

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2015/03/182001yjl.jpg)

**错误 #1：阻塞事件循环**

Node.js（正如浏览器）里的 JavaScript 提供了一种单线程环境。这意味着你的程序不会有两块东西同时在运行，取而代之的是异步处理 I/O 密集操作所带来的并发。比如说 Node.js 给数据库发起一个请求去获取一些数据时，Node.js 可以集中精力在程序的其他地方：

```javascript
// Trying to fetch an user object from the database. Node.js is free to run other parts of the code from the moment this function is invoked..
db.User.get(userId, function (err, user) {
    // .. until the moment the user object has been retrieved here
});
```

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2015/03/182001Dm1.jpg)

然而，在一个有上千个客户端连接的 Node.js 实例里，一小段 CPU 计算密集的代码会阻塞住事件循环，导致所有客户端都得等待。CPU 计算密集型代码包括了尝试排序一个巨大的数组、跑一个耗时很长的函数等等。例如：

```javascript
function sortUsersByAge(users) {
    users.sort(function (a, b) {
        return a.age & lt;
        b.age ? -1 : 1;
    });
}
```

在一个小的 “users” 数组上调用 “sortUsersByAge” 方法是没有任何问题的，但如果是在一个大数组上，它会对整体性能造成巨大的影响。如果这种事情不得不做，而且你能确保事件循环上没有其他事件在等待（比如这只是一个 Node.js 命令行工具，而且它不在乎所有事情都是同步工作的）的话，那这没有问题。但是，在一个 Node.js 服务器试图给上千用户同时提供服务的情况下，它就会引发问题。

如果这个 users 数组是从数据库获取的，那么理想的解决方案是从数据库里拿出已排好序的数据。如果事件循环被一个计算金融交易数据历史总和的循环所阻塞，这个计算循环应该被推到事件循环外的队列中执行以免占用事件循环。

正如你所见，解决这类错误没有银弹，只有针对每种情况单独解决。基本理念是不要在处理客户端并发连接的 Node.js 实例上做 CPU 计算密集型工作。


<!-- {% endraw %} - for jekyll -->