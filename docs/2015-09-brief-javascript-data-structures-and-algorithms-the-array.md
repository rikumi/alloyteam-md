---
title: JavaScript 数据结构和算法简述 —— 数组
date: 2015-09-15
author: TAT.李强
source_link: http://www.alloyteam.com/2015/09/brief-javascript-data-structures-and-algorithms-the-array/
---

<!-- {% raw %} - for jekyll -->

# 为什么先讲数组

* * *

数据结构可以简单的被分为线性结构和非线性结构。

线性结构大致包括：

1.  数组（连续存储）；
2.  链表（离散存储）；
3.  栈（线性结构常见应用，由链表或数组增删和改进功能实现）；
4.  队列（线性结构常见应用，由链表或数组增删和改进功能实现）；

非线性结构大致包括：

1.  树；
2.  图；

其中，数组是应用最广泛的数据存储结构。它被植入到大部分编程语言中。由于数组十分容易懂，所以它被用来作为介绍数据结构的起点非常合适。

# JavaScript 数组基础知识

* * *

在 ECMAScript 中数组是非常常用的引用类型了。ECMAScript 所定义的数组和其他语言中的数组有着很大的区别。那么首先要说的就是数组在 js 中是一种特殊的对象。

特点：

1.  数组是一组数据的线性集合；
2.  js 数组更加类似 java 中的容器。长度可变，元素类型也可以不同；
3.  数组的长度可以随时修改（length 属性）；

常用操作方法：

-   push、pop
-   shift、unshift
-   splice、slice
-   concat、join、sort、reverse 等

# JavaScript 数组操作

* * *

**一、 数组方法：**

**_1、 数组的创建_**

```javascript
var array = [];
 
var array = new Array();　//创建一个数组
 
var array = new Array([size]);　//创建一个数组并指定长度，注意不是上限，是长度
 
var array = new Array([element0[, element1[, ...[, elementN]]]]);　//创建一个数组并赋值
 
```

注意：虽然第三种方法创建数组指定了长度，但实际上所有情况下数组都是变长的，也就是说即使指定了长度为 5，仍然可以将元素存储在规定长度以外的，并且这时长度会随之改变。

**_2、 数组元素的访问_**

```javascript
var getArrItem = array[1]; //获取数组的元素值
array[1] = "new value"; //给数组元素赋予新的值
```

**_3、 数组元素的添加_**

    array. push([item1 [item2 [. . . [itemN ]]]]);// 将一个或多个新元素添加到数组结尾，并返回数组新长度
     
    array.unshift([item1 [item2 [. . . [itemN ]]]]);// 将一个或多个新元素添加到数组开始，数组中的元素自动后移，返回数组新长度
     
    array.splice(insertPos,0,[item1[, item2[, . . . [,itemN]]]]);//将一个或多个新元素插入到数组的指定位置，插入位置的元素自动后移，返回""。
     

**_4、 数组元素的删除_**

    array.pop(); //移除最后一个元素并返回该元素值
     
    array.shift(); //移除最前一个元素并返回该元素值，数组中元素自动前移
     
    array.splice(deletePos,deleteCount); //删除从指定位置deletePos开始的指定数量deleteCount的元素，数组形式返回所移除的元素
     
    array.slice(start, [end]); //以数组的形式返回数组的一部分，注意不包括 end 对应的元素，如果省略 end 将复制 start 之后的所有元素
     

**_5、 数组的合并_**


<!-- {% endraw %} - for jekyll -->