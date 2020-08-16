---
title: "如何解决 compass 中遇到的：Errno::EACCES on line [“897”] of C: Permission denied 问题。"
date: 2014-03-24
author: TAT.Minren
source_link: http://www.alloyteam.com/2014/03/ru-he-jie-jue-compass-zhong-yu-dao-di-errnoeacces-on-line-897-of-c-permission-denied-wen-ti/
---

<!-- {% raw %} - for jekyll -->

如果你在 3 月 23 日左右升级了 compass，你可能会遇到这样的错误：

```javascript
Errno::EACCES on line ["897"] of C: Permission denied
具体原因不清楚，应该是与新版的sass有关。
 
比如当我使用下面版本时就会有问题：
```

**sass - 3.2.18**

**compass - 0.12.4**

 所以目前的处理方法就是安装原来的版本

gem uninstall compass

gem uninstall sass

gem install sass --version "3.2.10"

gem install compass --version "0.12.2"

这样就可以消除上述错误了。


<!-- {% endraw %} - for jekyll -->