---
title: 开源 JavaScript 执行热图生成工具
date: 2012-06-12
author: TAT.yuanyan
source_link: http://www.alloyteam.com/2012/06/javascript-the-profiler/
---

<!-- {% raw %} - for jekyll -->

**每一字节代码都有其温度，而我们提供代码的温度计。**

```javascript
for (var i = 0; i < 100; i++) {
    console.log(i);
}
```

这个是 javascript 中一个简单 for 循环，声明 i 初始值为 0，判断 i 是否小于 100，若是则执行语句，然后 i 增加 1。所以 _var i=0_ 只执行 1 次，条件条件表达式  _i&lt;100_  会执行 101 次，增量 _i++_ 执行 100 次，_console.log(i)_ 执行 100 次。

<table><tbody><tr><td>语句</td><td>次数</td></tr><tr><td>var i=0</td><td>1</td></tr><tr><td>i&lt;100</td><td>101</td></tr><tr><td>i++</td><td>100</td></tr><tr><td>console.log(i)</td><td>100</td></tr></tbody></table>

转换语句代码与执行次数的映射数据我们得到一份其代码执行热度图，非常形象生动的呈现了代码的真实执行情况，标示出了每一语句的执行热度，我们说这是每一个字节代码的真实温度。

[![for 循环执行热图](http://www.alloyteam.com/wp-content/uploads/2012/06/QQ截图20120609213522-300x89.png "for 循环执行热图")](http://www.alloyteam.com/wp-content/uploads/2012/06/QQ截图20120609213522.png)

下面快速排序的代码生成的热图，并且在右下角显示执行的 javascript 代码覆盖率：

[![](http://www.alloyteam.com/wp-content/uploads/2012/06/QQ截图20120612233225-1024x498.png "jsprofiler")](http://www.alloyteam.com/wp-content/uploads/2012/06/QQ截图20120612233225.png)

-   在线地址：[http://madscript.com/jsprofiler](http://madscript.com/jsprofiler/)
-   Github 开源：<https://github.com/yuanyan/jsprofiler>

转载请注明原文地址：<http://www.alloyteam.com/2012/06/javascript-the-profiler>

<!-- {% endraw %} - for jekyll -->