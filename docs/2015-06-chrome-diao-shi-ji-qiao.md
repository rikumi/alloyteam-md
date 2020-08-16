---
title: Chrome 调试小技巧
date: 2015-06-30
author: TAT.joeyguo
source_link: http://www.alloyteam.com/2015/06/chrome-diao-shi-ji-qiao/
---

## **前言：**

除了我们日常使用的调试方法，在 Chrome 中，其含有一些有意思的方法，有助于提高我们的开发调试效率。

## **Sources 页**

### **command + p  文件跳转**

使用 Sublime 的人或习惯用 command + p 进行文件的跳转，在 chrome dev tools 中其实也有类似的跳转方法。

    command + p  
     
    command + p + 文件名 + : + 数字

![j5](http://www.alloyteam.com/wp-content/uploads/2015/06/j5.png)

### **command + shift + o  任意方法跳转**

Sublime 中使用 command +R 进行方法跳转，而在 dev tools 中，可以使用 command + shift + o  进行任意方法的跳转。

    command + shift + o  // 跳转到任意方法

[![j8](http://www.alloyteam.com/wp-content/uploads/2015/06/j8.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/j8.png)

_注： 查找某文件中的方法，使用 command + p 和  command + shift + o 更配哦～_

## **Elements 页**

-   使用方向键快，上下键导航，左右键收起展开；
-   H 键快速隐藏 dom（效果相当于给 DOM 加入 visibility: hidden 属性，有别于 display:none）
-   Enter 进行快速编辑属性；
-   鼠标右击使用各类方法...

## **Console 页**

### **$\_   表示上次的计算结果**

举个栗子

```c
15 * 15  
 
$_ * 10 
```

![屏幕快照 2015-06-30 下午 10.43.04](http://www.alloyteam.com/wp-content/uploads/2015/06/屏幕快照-2015-06-30-下午10.43.04.png)

### **$0   获取当前选中的 DOM**

选中 DOM 之后，在控制台输入 $0。

```javascript
$0;
```

[![屏幕快照 2015-07-01 上午 12.03.53](http://www.alloyteam.com/wp-content/uploads/2015/06/屏幕快照-2015-07-01-上午12.03.53.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/屏幕快照-2015-07-01-上午12.03.53.png)

_注：$1 $2 $3 是获取前几次选的 dom，不常用_

### **$(selector) 与 $$(selector)  获取当前选中的 DOM**

当页面没有引入 jQuery 等类库的时候，这是我们一般会用  
document.querySelector () 或是 document.querySelectorAll () 来作用 dom 选择器。  
而在 Chrome 调试中我们可以使用是 $(selector) 与 $$(selector) 来作为选择器，省去大串代码，如下。

    $('body')
     
    $$('body')

### ![j7](http://www.alloyteam.com/wp-content/uploads/2015/06/j7.png)

由上图实际结果看出，$() 和 $$() 获取得到的都是满足选中条件元素的一个集合，相当于 document.querySelectorAll ()

_注：实验所用 chrome 版本：40.0.2214.111 (64-bit)_

**copy (Object)   拷贝对象**

```javascript
copy(document.body);
copy($0);
```

![屏幕快照 2015-06-30 下午 10.58.01](http://www.alloyteam.com/wp-content/uploads/2015/06/屏幕快照-2015-06-30-下午10.58.01.png)

_注：可搭配 $0 来拷贝当前选择的 dom，记得手动黏贴～_

**console.time & console.timeEnd  计算耗时**

对代码执行的耗时情况进行测试时，处理手工在代码中创建前后两个时间戳进行对比，在 dev tools 中，我们可以使用 console.time 与 console.timeEnd 实现。

```javascript
console.time("测试用时");
var array = new Array(1000000);
for (var i = array.length - 1; i >= 0; i--) {
    array[i] = new Object();
}
console.timeEnd("测试用时");
```

[![j9](http://www.alloyteam.com/wp-content/uploads/2015/06/j9.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/j9.png)

**关闭 Console 界面** 

ESC...