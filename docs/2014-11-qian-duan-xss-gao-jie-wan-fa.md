---
title: 前端 XSS 高阶玩法
date: 2014-11-30
author: TAT.gctang
source_link: http://www.alloyteam.com/2014/11/qian-duan-xss-gao-jie-wan-fa/
---

<!-- {% raw %} - for jekyll -->

故事源于某一天，笔者的一位后台同事突然在 RTX 找到了我，然后抛出了一道一看就要跪的题，

以下是他给我的原题：

````html
(function escape(input) {
    input = input.replace(/[;\\\/<>a-zA-Z]/g, "_").slice(0, 1500);
    return (
        "
```html
<script>[][([![]]+[])[++[++[++[[]][+[]]][+[]]][+[]]]+([]+{})[++[[]][+[]]]+([!![]]+[])[++[[]][+[]]]+([!![]]+[])[+[]]]" +
        input +
        "</script>
````

 "
    );
})("?");
要求可以弹出 alert 框；

````

初略看了一下，感觉这是在逗我么。。。这么搞，js 都 [Brainfuck](http://en.wikipedia.org/wiki/Brainfuck "Brainfuck wiki") 化了啊。

再仔细一看，好像在哪见过类似的题目啊。

于是乎笔者脑海不断地往前翻看记录，终于想起之前在 [wtfjs](http://wtfjs.com/) 里面看到的 [obfuscated fibonacci](http://wtfjs.com/2013/02/12/obfuscated-fibonacci)，一道求斐波那契数列的题，

代码如下：

```javascript
  var fib = function (_) {
      for(_=[+[],++[[]][+[]],+[],_],_[++[++[++[[]][+[]]][+[]]][+[]]]=(((_[++[++[++[[]][+[]]][+[]]][+[]]]-(++[[]][+[]]))&(((--[[<
````


<!-- {% endraw %} - for jekyll -->