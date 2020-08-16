---
title: Date 对象的那些事儿
date: 2016-05-26
author: TAT.yana
source_link: http://www.alloyteam.com/2016/05/date-object/
---

<!-- {% raw %} - for jekyll -->

前两天做了个需求需要 Unix 时间戳和北京时间的各种转换，其中 Date 对象用到的极多，今天就来讲讲我所了解到的 Date 对象。

#### 这就开始了

hin 简单～

```javascript
var date = new Date();
```

这时的时间是当前时间。

那么 Date 都可以用什么来作为**参数**呢？

1、Date 对象可以使用指定时间到 1970 年 1 月 1 日 00:00:00 UTC 的**毫秒数**做参数。

      [![1](http://www.alloyteam.com/wp-content/uploads/2016/05/1.png)](http://www.alloyteam.com/wp-content/uploads/2016/05/1.png)

看到上面的结果是不是有点奇怪，当参数为 0 时返回的不应该是 1970 年 1 月 1 日 00:00:00 吗？这里应该是使用了格林尼治标准时间作为计时标准，中国的时间比格林威治标准时间快 8 个小时，所以就是 8 点，而不是 0 点啦。（突然想到周董的一段歌词，“我占据格林威治守候着你，在时间标准起点回忆过去，你却在永夜了的极地旅行”，格林威治是世界计算时间和地理经度的起点，但是现在 GMT 时间已经不再被科学界确定，还有一个最接近 GMT 的世界时间标准，就是 UTC 啦）

2、参数也可以是（**年，月，日，时，分，秒**），其中至少需要两个整数，否则就会被当做 1 中例子里的毫秒数了。

这里的月份是 0～11，所以下面的例子月份为 5 时是 June 六月

      [![2](http://www.alloyteam.com/wp-content/uploads/2016/05/2.png)](http://www.alloyteam.com/wp-content/uploads/2016/05/2.png)

当然，这里的参数也可以是**负数**，就表示相对当前设定时间扣掉的时间。比如下图第一个例子，月份使用了负数，于是就从 2015 年 1 月 1 日为基准，扣掉五个月，变为了 2014 年 8 月

      [![2.2](http://www.alloyteam.com/wp-content/uploads/2016/05/2.2.png)](http://www.alloyteam.com/wp-content/uploads/2016/05/2.2.png)

3、我们再看看 0,1，-1 这三个特殊数字做参数的情况。如果年份使用 0，则表示的是 1900 年，为负数就变成了公元前。

      [![6](http://www.alloyteam.com/wp-content/uploads/2016/05/61.png)](http://www.alloyteam.com/wp-content/uploads/2016/05/61.png)

4、当然，除了整数，还可以用**日期的字符串**作为参数

      [![4](http://www.alloyteam.com/wp-content/uploads/2016/05/4.png)](http://www.alloyteam.com/wp-content/uploads/2016/05/4.png)

任意搭配都可以得到正确的时间，棒棒哒！

Date 对象中有很多**方法**，这里我只挑一些常用的来说下。

1、**Date()**     返回当前的时间

      [![date](http://www.alloyteam.com/wp-content/uploads/2016/05/date.png)](http://www.alloyteam.com/wp-content/uploads/2016/05/date.png)

无论你在中间加什么参数，永远返回当前时间

      [![1.2](http://www.alloyteam.com/wp-content/uploads/2016/05/1.2.png)](http://www.alloyteam.com/wp-content/uploads/2016/05/1.2.png)

2、**getDate()**                返回指定时间的某一天（1～31）

      **getDay()**                返回指定时间的星期数（0～6）

      **getMonth()**           返回指定时间的月份（0～11）

      **getFullYear()**         返回指定时间的四位数年份

    **getHours()**             返回指定时间的小时（0～23）

      **getMinutes()**         返回指定时间的分钟数（0～59）

      **getSeconds()**         返回指定时间的秒数（0～59）

      **getMilliseconds()** 返回指定时间的毫秒数（0～999）

      [![11](http://www.alloyteam.com/wp-content/uploads/2016/05/11.png)](http://www.alloyteam.com/wp-content/uploads/2016/05/11.png)

3、**getTime()**     返回 1970 年 1 月 1 日 00:00:00 到指定时间的毫秒数，就是 UNIX 时间数的 1000 倍

      [![12](http://www.alloyteam.com/wp-content/uploads/2016/05/12.png)](http://www.alloyteam.com/wp-content/uploads/2016/05/12.png)

也就是说，UNIX 时间和时间字符串相互转换可以这样

[![13](http://www.alloyteam.com/wp-content/uploads/2016/05/13.png)](http://www.alloyteam.com/wp-content/uploads/2016/05/13.png)

除了 getTime ()，将时间字符串转换成毫秒数的方法还有**+Date()**、**Number(Date)**和 **Date.parse()**

[![QQ 截图 20160526110803](http://www.alloyteam.com/wp-content/uploads/2016/05/QQ截图20160526110803.png)](http://www.alloyteam.com/wp-content/uploads/2016/05/QQ截图20160526110803.png)

Date () 和 new Date ()  

* * *

上面的例子里有用到 Date () 和 new Date ()，返回结果的状态也是不同的，在这里总结一下。

[![14](http://www.alloyteam.com/wp-content/uploads/2016/05/14.png)](http://www.alloyteam.com/wp-content/uploads/2016/05/14.png)

可以看出，Date () 无论有没有参数都是返回的当前时间的字符串，而 new Date () 会根据参数返回对应时间的字符串

分分钟写个小日历  

* * *

使用 Date () 对象的一个简单的应用当然就是写日历了～

首先，我们需要判断当前月份的第一天是星期几

```javascript
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth();
var firstDay, getFirstDay;
function getFirstDay(year, month) {
    firstDay = new Date(year, month, 1);
    getFirstDay = firstDay.getDay();
}
```

然后再判断当前月份的天数。选用的办法是使用当前月份下个月的 1 日的时间减去 1 个小时，这样就回到了当前月份最后一天，再获取当前日期即可。

```javascript
function getMonthDays(year, month) {
    var nextMonth = new Date(year, month + 1, 1),
        getMonthDays;
    nextMonth.setHours(nextMonth.getHours() - 1);
    getMonthDays = nextMonth.getDate();
}
```

剩下的就是将数据填充到表格里就可以啦～

但是日历并不只能看当前月份，还可以查前一个月后一个月，那么只需要加两个按钮，点击后月份减 1 或加 1 即可。

具体代码在下面～

<https://github.com/yanagao/Date.git>

###### 1970 年的元旦

众所周知，所有的编程语言都是要从 1970 年 1 月 1 日开始计算时间，这个时间是有什么特殊的含义吗？在 1970 年的元旦 0 点 0 分 0 秒到底发生了什么？

上面我们提到了一个 UNIX 时间，就是指从 1970 年 1 月 1 日 0 时 0 分 0 秒起至现在的总秒数。我们都知道，系统有 32 位也有 64 位，那么如果把 UNIX 时间用 32 位二进制数表示，只能够表示到 2147483647 秒，也就是到 **Tue Jan 19 2038 11:14:07** 这个时间就是极限了，超过这个时间，就会变成负数，系统就挂了。在以前那个只有 32 位操作系统的年代，可能觉得 38 年之前就会有解决办法吧 (⊙﹏⊙) b。年初的时候流传了 iPhone 变砖的方法，如果你把 iPhone 的系统时间调到 1970 年 1 月 1 日，重启手机就变砖了，不舍得用自己手机试验的同学纷纷去了苹果体验店。有网友就猜测，因为中国在东 8 区，比格林威治时间快 8 个小时，也就是说北京时间 1970 年 1 月 1 日 00:00:00 对应的是 1969 年 12 月 31 日 16:00:00，UNIX 时间为负，所以手机变砖，但是没法证实这个猜测的正确性┑(￣Д ￣)┍。

现在的操作系统大部分都为 64 位，可以表示至少到 263，经过各种不严密计算，可以算出 64 位二进制至少可以表示 2924.7 亿年，应该就不用担心系统挂掉的问题了┑(￣Д ￣)┍。

<!-- {% endraw %} - for jekyll -->