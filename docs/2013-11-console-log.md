---
title: 从 console.log 说起（上）
date: 2013-11-30
author: TAT.老教授
source_link: http://www.alloyteam.com/2013/11/console-log/
---

<!-- {% raw %} - for jekyll -->

[![控制台美女](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131130-1@2x.jpg)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131130-1@2x.jpg)

`console.log`，作为一个前端开发者，可能每天都会用它来分析调试，但这个简单函数背后不简单那一面，你未必知道……

### 基础

首先，简单科普这个函数的作用。前端开发者可以在 js 代码的任何部分调用 console.log，然后你就可以在浏览器的开发者控制台里，看到这个函数调用的那一瞬间你指定的变量或表达式的值。

最基本的调用方法：

```javascript
console.log("123");
// 123
console.log("1", "2", "3");
// 1 2 3
console.log("1\n2\n3\n");
// 1
// 2
// 3
```

我们可以通过上面的方式进行单个变量（表达式）、多个变量以及换行输出。而这对于日常开发的大多数情况算是够用了。

### 格式化输出

```javascript
console.log("%d + %d = %d", 1, 1, 2);
// 1 + 1 = 2
```

写过 C 语言的童鞋肯定对上面这种写法不陌生，这种写法在复杂的输出时，能保证模板和数据分离，结构更加清晰。不过简单的输出就不那么方便了。

console.log 支持的格式标志有:

[![格式化](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131130-2@2x1.jpg)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131130-2@2x1.jpg)

前三种格式不用多说，% o、% O 都是用来输出 Object 对象的，对普通的 Object 对象，两者没区别，但是打印 dom 节点时就不一样了：  
[![% o 和 % O](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-7@2x.png)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-7@2x.png)

使用 % o 输出和不使用格式化输出打印出来的结果一样，你可以查看这个 dom 节点的内容、子节点等；而使用 % O，你看到的则是该 dom 节点各个对象属性。对应我们平时把数据寄放到 dom 节点的两种方式：

BTW，格式化输出还可以和普通输出混合着来：

```javascript
console.log("%d + %d =", 1, 1, 2);
// 1 + 1 = 2
```

### 丰富样式输出

大家等待已久的高潮来了，鼓掌，再看下妹子：  
[![控制台美女 2](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131130-3@2x.jpg)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131130-3@2x.jpg)

这是怎么做到的呢？其实看了上一节肯定有童鞋猜到了，那就是用 % c 进行 css 样式格式化输出。常见的富样式输出有两种：文字样式、图片输出。

#### 文字样式

[![QQ20131111-10@2x](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-10@2x.jpg)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-10@2x.jpg)

很简单对吧？这是最简单的写法，其实 % c 可以写在任何地方，不限于开头，然后 % c **后面所有的**输出会应用我们指定的样式。

那如果我想单独对我输出的一句话中间某几个字进行样式处理呢？一般来说，没办法，不过有变通的手段：

[![替代方案](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131129-1@2x.png)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131129-1@2x.png)

附：console.log 输出的超链接会被自动识别并加上灰色字体颜色和下划线的样式，而这个无法用 % c 覆盖

#### 图片输出

[![图片输出](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-11@2x.jpg)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131111-11@2x.jpg)

严格来讲，console.log 不支持直接图片输出，但我们可以用背景图曲线救国。但，你真正去试了才发现没那么简单，你没法像平时那样输出背景图，原因呢，就是你没法直接设置 `width` 和 `height` 样式。

就好像上面的示例，要输出一张 438x166 的图片，我用 padding 来把整个区域撑开到我要的大小，然后还要设置 line-height 才行。关于这些属性的值大家估计会困惑，我一一说明：

-   line-height 的值我取图片高度
-   background 就不需多说，但你会发现 no-repeat 设置了没生效。。。
-   padding 左右两边的值显然是图片宽度的一半
-   最头痛的是 padding 上下的值，我试过高度一半的值，结果输出的大小比我想象的高！所以建议：**用我这种方法输出，padding 上下的值你要一点点的调整直到达到你要的输出**

之所以强调我的方法，是因为还有其他方法可以控制背景图输出。有兴趣的童鞋还可以参考一个叫 [console.image](https://github.com/dunxrion/console.image) 的插件：  
[![console.image](http://www.alloyteam.com/wp-content/uploads/2013/11/console.image_.png)](http://www.alloyteam.com/wp-content/uploads/2013/11/console.image_.png)

关于富样式输出说了这么多，现在不得不提下浏览器兼容性：

[![浏览器支持](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131130-4@2x.jpg)](http://www.alloyteam.com/wp-content/uploads/2013/11/QQ20131130-4@2x.jpg)

个人感觉，控制台富样式输出虽然最后输出看到起来很上流，但开发者会写得很纠结，毕竟没法控制 dom 节点应用正常的 css 样式。其中图片输出真是一个非 (sang) 常 (xin) 强 (bing) 大 (kuang) 的功能。

[下集入口](http://www.alloyteam.com/2013/11/console-log-2/)

<!-- {% endraw %} - for jekyll -->