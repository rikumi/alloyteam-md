---
title: 更快的异步执行
date: 2014-03-03
author: TAT.Cson
source_link: http://www.alloyteam.com/2014/03/faster-asynchronous-execution/
---

如果要异步执行一个函数，我们最先想到的方法肯定会是 setTimeout  
例如：setTimeout (function ( /\* 1s 后做点什么 \*/){},1000}

那如果说要最快速地异步执行一个函数呢？  
是否会是：

```javascript
setTimeout(function( /* 尽快做点什么 */){},0}
```

可惜的是，浏览器为了避免 setTimeout 嵌套可能出现卡死 ui 线程的情况，为 setTimeout 设置了最小的执行时间间隔，不同浏览器的最小执行时间间隔都不一样。chrome 下测试 setTimeout 0 的实际执行时间间隔大概在 12ms 左右。  

那么如果想最快地异步执行一个函数，有没有什么可以提速的方法呢？

先来看看浏览器端，有哪些常用的异步执行方法

setImmediate：该方法去实现比 setTimeout 0 更快的异步执行，执行时间更接近 0ms，但是只有 IE/node 支持。

requestAnimationFrame：做动画循环的时候经常会用到这个方法，该方法只会在浏览器刷新 ui 的时候执行，刷新 ui 的频率最大一般为 60fps，所以 requestAnimationFrame 一般情况下比 setTimeout 0 更慢一些。

除了使用异步函数外，还有一些方法可以实现异步调用

利用 onmessage：  
和 iframe 通信时常常会使用到 onmessage 方法，但是如果同一个 window postMessage 给自身，会怎样呢？其实也相当于异步执行了一个 function  
例如：

```javascript
var doSth = function () {};
window.addEventListener("message", doSth, true);
window.postMessage("", "*");
```

另外，还可以利用 script 标签，实现函数异步执行，例如：  

```javascript
var newScript = document.createElement("script");
newScript.onreadystatechange = doSth;
document.documentElement.appendChild(newScript);
```

把 script 添加到文档也会执行 onreadystatechange 但是该方法只能在 IE 下浏览器里使用。

那么 这几种方法，谁最快？

测试了一下，

chrome 下：

setImmediate：不可用。  
setTimeout 0：12ms  
onmessage：6ms  
onreadystatechange：不支持

chrome 下，onmessage 比 setTimeout 0 更快。

firefox 下：

setImmediate：不可用。  
setTimeout 0：7ms  
onmessage：7ms  
onreadystatechange：不支持

firefox 下，onmessage 和 setTimeout 0 速度相当。

IE9：

setImmediate：不可用。  
setTimeout 0：11ms  
onmessage：7ms 10ms  
onreadystatechange：2ms

IE9 下，onreadystatechange 的时间比另外两者要快得多。

总体情况下，setImmediate &lt; readystatechange &lt; onmessage &lt; setTimeout 0 &lt; requestAnimationFrame  
因此我们可以简单封装一个快速执行异步 function 的方法：

```javascript
var setZeroTimeout = (function () {
    if (window.setImmediate) {
        //IE10+版本，使用原生setImmediate
        return window.setImmediate;
    } else if ("onreadystatechange" in document.createElement("script")) {
        return function () {
            /* 使用onreadystatechange的版本 */
        };
    } else if (window.postMessage) {
        return function () {
            /* 使用onmessage的异步执行版本 */
        };
    } else {
        return window.setTimeout;
    }
})();
```