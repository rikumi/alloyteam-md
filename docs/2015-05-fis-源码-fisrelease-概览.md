---
title: FIS 源码 - fisrelease 概览
date: 2015-05-08
author: TAT.casperchen
source_link: http://www.alloyteam.com/2015/05/fis%e6%ba%90%e7%a0%81-fisrelease%e6%a6%82%e8%a7%88/
---

<!-- {% raw %} - for jekyll -->

前面已经已 `fis server open` 为例，讲解了 FIS 的整体架构设计，以及命令解析 & 执行的过程。下面就进入 FIS 最核心的部分，看看执行 `fis release` 这个命令时，FIS 内部的代码逻辑。

这一看不打紧，基本把 `fis-kernel` 的核心模块翻了个遍，虽然大部分细节已经在脑海里里，但是要完整清晰的写出来不容易。于是决定放弃大而全的篇幅，先来个概要的分析，后续文章再针对涉及的各个环节的细节进行展开。

## 看看 `fis-command-release`

老规矩，献上精简版的 `release.js`，从函数名就大致知道干嘛的。`release(options)`是我们重点关注的对象。

```html
<span class="string">'use strict'</span>;
 
exports.register = <span class="keyword">function</span>(commander){
    
    <span class="comment">//  fis relase --watch 时，就会执行这个方法</span>
    <span class="keyword">function</span> watch(opt){
        <span class="comment">// ...</span>
    }
    
    <span class="comment">// 打点计时用，控制台里看到的一堆小点点就是这个方法输出的</span>
    <span class="keyword">function</span> time(fn){
        <span class="comment">// ...</span>
    }
    
    <span class="comment">// fis release --live 时，会进入这个方法，对浏览器进行实时刷新</span>
    <span class="keyword">function</span> reload(){
        <span class="comment">//...</span>
    }
    
    <span class="comment">// 高能预警！非常重要的方法，fis release 就靠这个方法走江湖了</span>
    <span class="keyword">function</span> release(opt){
        <span class="comment">// ...</span>
    }
    
    <span class="comment">// 可以看到有很多配置参数，每个参数的作用可参考对应的描述，或者看官方文档</span>
    commander
        .option(<span class="string">'-d, --dest <names>'</span>, <span class="string">'release output destination'</span>, String, <span class="string">'preview'</span>)
        .option(<span class="string">'-m, --md5 [level]'</span>, <span class="string">'md5 release option'</span>, Number)
        .option(<span class="string">'-D, --domains'</span>, <span class="string">'add domain name'</span>, Boolean, <span
```


<!-- {% endraw %} - for jekyll -->