---
title: Node.js 中的测量时间和内存函数
date: 2015-05-21
author: TAT.Perlt
source_link: http://www.alloyteam.com/2015/05/nodejs-ce-liang-shi-jian-he-nei-cun-han-shu/
---

<!-- {% raw %} - for jekyll -->

本篇文章用来介绍在 nodejs 中，用来测量[时间](http://baike.baidu.com/subview/4019/7140954.htm)和内存的函数

process.memoryUsage  

* * *

返回描述以字节为单位的节点进程的内存使用量的对象。相应执行代码例子如下：

```javascript
var util = require("util");
console.log(util.inspect(process.memoryUsage()));
```

相应执行结果如下：

    { 
      rss: 4935680,
      heapTotal: 1826816,
      heapUsed: 650472 
    }

heapTotal 和 heapUsed 参考 V8 的内存使用情况。rss 为驻留集大小，相应说明可以参考[驻留集](http://baike.baidu.com/view/3319068.htm "驻留集")

相应 api 链接为 [http://nodejs.org/docs/v0.4.10/api/process.html#process.memoryUsage](http://nodejs.org/docs/v0.4.10/api/process.html#process.memoryUsage "process.memoryUsage")

process.hrtime  

* * *

返回当前高分辨率实时在 \[秒，纳秒] 元组。它是相对于过去任意的时间。它和一天中的时间不相关，因此，不会受到[时钟偏移](http://zh.wikipedia.org/wiki/%E6%97%B6%E9%92%9F%E5%81%8F%E7%A7%BB "时钟偏移")影响。主要用途是用于测量时间间隔之间的性能。

相应执行代码例子如下：

```javascript
var time = process.hrtime();
// [ 1800216, 25 ]
setTimeout(function () {
    var diff = process.hrtime(time); // [ 1, 552 ]
    console.log("benchmark took %d nanoseconds", diff[0] * 1e9 + diff[1]); // benchmark took 1000000527 nanoseconds
}, 1000);
```

相应执行结果如下：

    benchmark took 1000000527 nanoseconds

相应 api 链接为 [https://nodejs.org/api/process.html#process_process_hrtime](https://nodejs.org/api/process.html#process_process_hrtime "process.hrtime")

<!-- {% endraw %} - for jekyll -->