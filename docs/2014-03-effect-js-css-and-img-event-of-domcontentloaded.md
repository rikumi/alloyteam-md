---
title: JS、CSS 以及 img 对 DOMContentLoaded 事件的影响
date: 2014-03-03
author: TAT.kerry95
source_link: http://www.alloyteam.com/2014/03/effect-js-css-and-img-event-of-domcontentloaded/
---

<!-- {% raw %} - for jekyll -->

最近在做性能有关的数据上报，发现了两个非常有意思的东西：Chrome 开发者工具的 Timeline 分析面板，以及 DOMContentLoaded 事件。一个是强大的令人发指的性能分析工具，一个是重要的性能指标，于是就用 Timeline 对 DOMContentLoaded 事件进行了一番研究。

## 前端的纯技术就是对规范的认知

什么是 DOMContentLoaded 事件？

首先想到的是查看 [W3C 的 HTML5 规范](http://www.w3.org/TR/html5/syntax.html#the-end)，DOMContentLoaded 事件在什么时候触发：

> Once the user agent stops parsing the document, the user agent must run the following steps:  
> 1. Set the current document readiness to "interactive" and the insertion point to undefined.  
> Pop all the nodes off the stack of open elements.  
> 2. If the list of scripts that will execute when the document has finished parsing is not empty, run these substeps:  
> 2.1 Spin the event loop until the first script in the list of scripts that will execute when the document has finished parsing has its "ready to be parser-executed" flag set and the parser's Document has no style sheet that is blocking scripts.  
> 2.2 Execute the first script in the list of scripts that will execute when the document has finished parsing.  
> 2.3 Remove the first script element from the list of scripts that will execute when the document has finished parsing (i.e. shift out the first entry in the list).  
> 2.4 If the list of scripts that will execute when the document has finished parsing is still not empty, repeat these substeps again from substep 1.  
> 3. Queue a task to fire a simple event that bubbles named **DOMContentLoaded** at the Document.

规范总是那么的晦涩，但至少有一点是可以明确了的，就是在 JS（不包括动态插入的 JS）执行完之后，才会触发 DOMContentLoaded 事件。

接下来看看 [MDN 上有关 DOMContentLoaded 事件的文档](https://developer.mozilla.org/en-US/docs/Web/Reference/Events/DOMContentLoaded)：

> The DOMContentLoaded event is fired when the document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading  
> Note: Stylesheet loads block script execution, so if you have a \`
>
> ```html
> <script>` after a `<link rel="stylesheet" ...>`, the page will not finish parsing - and DOMContentLoaded will not fire - until the stylesheet is loaded.
> ```

这么看来，至少可以得出这么一个理论：DOMContentLoaded 事件本身不会等待 CSS 文件、图片、iframe 加载完成。  
它的触发时机是：加载完页面，解析完所有标签（不包括执行 CSS 和 JS），并如规范中所说的设置 `interactive` 和执行每个静态的 script 标签中的 JS，然后触发。  
而 JS 的执行，需要等待位于它前面的 CSS 加载（如果是外联的话）、执行完成，因为 JS 可能会依赖位于它前面的 CSS 计算出来的样式。

## 实践是检验真理的唯一标准

### 实验 1：DOMContentLoaded 事件不直接等待 CSS 文件、图片的加载完成

index.html:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title></title>
    <link rel="stylesheet" type="text/css" href="./css/main.css">
</head>
<body>
    <p>Content</p>
    <img src="./img/chrome-girl.jpg">
</body>
</html>
```

[![71fca778-a249-11e3-8824-2aae4440c857](http://www.alloyteam.com/wp-content/uploads/2014/03/71fca778-a249-11e3-8824-2aae4440c857.png)](http://www.alloyteam.com/wp-content/uploads/2014/03/71fca778-a249-11e3-8824-2aae4440c857.png)  
图一

如果页面中没有 script 标签，DOMContentLoaded 事件并没有等待 CSS 文件、图片加载完成。

Chrome 开发者工具的 Timeline 面板可以帮我们记录下浏览器的一举一动。图一中红色小方框中的蓝线，表示 DOMContentLoaded 事件，它右边的红线和绿线分别表示 load 事件和 First paint，鼠标 hover 在这些线露出灰色方框下面的一小部分时就会出现带有说明文字的 tips（这交互够反人类的对吧！）。

### 实验 2：DOMContentLoaded 事件需要等待 JS 执行完才触发

index.html:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title></title>
    <script type="text/javascript">
        console.timeStamp('Inline script before link in head');
        window.addEventListener('DOMContentLoaded', function(){
            console.timeStamp('DOMContentLoaded event');
        });
    </script>
```

    <link rel="stylesheet" type="text/css" href="./css/main.css">

    

```html
<script type="text/javascript">
        console.timeStamp('Inline script after link in head');
    </script>
```

</head>
<body>
    <p>Content</p>
    <img src="./img/chrome-girl.jpg">
    
```html
<script type="text/javascript" src="./js/main.js"></script>
```

</body>
</html>
```

main.js:

    console.timeStamp('External script after link in body');

[![dcf399e8-a252-11e3-92c1-c3dbad820909](http://www.alloyteam.com/wp-content/uploads/2014/03/dcf399e8-a252-11e3-92c1-c3dbad820909.png)](http://www.alloyteam.com/wp-content/uploads/2014/03/dcf399e8-a252-11e3-92c1-c3dbad820909.png)

图二

如果页面中静态的写有 script 标签，DOMContentLoaded 事件需要等待 JS 执行完才触发。  
而 script 标签中的 JS 需要等待位于其前面的 CSS 的加载完成。

`console.timeStamp()` 可以向 Timeline 中添加一条记录，并对应上方的一条黄线。

从图二中可以看出，在 CSS 之前的 JS 立刻得到了执行，而在 CSS 之后的 JS，需要等待 CSS 加载完后才执行，比较明显的是 main.js 早就加载完了，但还是要等 main.css 加载完才能执行。而 DOMContentLoaded 事件，则是在 JS 执行完后才触发。滑动 Timeline 面板中表示展示区域的滑块，如图三，放大后即可看到表示 DOMContentLoaded 事件的蓝线（之前跟黄线和绿线靠的太近了），当然，通过 `console.timeStamp()` 向 TimeLine 中添加的记录也可证明其触发时间。

[![910b5c2c-a253-11e3-995d-e19fb254cf4e](http://www.alloyteam.com/wp-content/uploads/2014/03/910b5c2c-a253-11e3-995d-e19fb254cf4e.png)](http://www.alloyteam.com/wp-content/uploads/2014/03/910b5c2c-a253-11e3-995d-e19fb254cf4e.png)  
图三

现代浏览器会并发的预加载 CSS, JS，也就是一开始就并发的请求这些资源，但是，执行 CSS 和 JS 的顺序还是按原来的依赖顺序（JS 的执行要等待位于其前面的 CSS 和 JS 加载、执行完）。先加载完成的资源，如果其依赖还没加载、执行完，就只能等着。

### 实验 3：img 何时开始解码、绘制？

从图三中我们可以发现一个有趣的地方：img 的请求老早就发出了，但延迟了一段时间才开始解码。如图二、图三中的红框所示，截图中只框出了一部分表示解码的记录，而实际上这些表示解码的记录一直持续到 img 加载结束，如图四所示，img 是一边加载一边解码的：

[![7384a57a-a256-11e3-9c4a-b857956eaeed](http://www.alloyteam.com/wp-content/uploads/2014/03/7384a57a-a256-11e3-9c4a-b857956eaeed.png)](http://www.alloyteam.com/wp-content/uploads/2014/03/7384a57a-a256-11e3-9c4a-b857956eaeed.png)  
图四

抱着 “猜想 —— 验证” 的想法，我猜想这是因为 img 这个资源是否需要展现出来，需要等 **所有的 JS 和 CSS 的执行完** 才知道，因为 main.js 可能会执行某些 DOM 操作，比如删除这个 img 元素，或者修改其 src 属性，而 CSS 可能会将其 `display: none` 。

![image](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2014/03/084830tW2.jpg)  
图五

![image](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2014/03/084831TR6.jpg)  
图六

![image](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2014/03/084832Sa1.jpg)  
图七

图五中没有 JS 和 CSS，img 的数据一接收到就马上开始解码了。  
图六中没有 JS，但 img 要等到 CSS 加载完才开始解码。  
图七的代码跟图六的代码唯一的区别是 CSS 把 img 给 `display: none;` ，这使得 img 虽然请求了，但根本没有进行解码。  
这说明，img 是否需要解码、绘图（paint）出来，确实需要等 CSS 加载、执行完才能知道。也就是说，CSS 会阻塞 img 的展现！那么 JS 呢？

![image](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2014/03/084833Gpg.jpg)  
图八

图八对应的代码：

````html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title></title>
    
```html
<script type="text/javascript">
        console.timeStamp('Inline script in head');
        window.addEventListener('DOMContentLoaded', function(){
            console.timeStamp('DOMContentLoaded event');
        });
    </script>
````

</head>
<body>
    <p>Content</p>
    <img src="./img/chrome-girl.jpg">
    
```html
<script type="text/javascript" src="./js/main.js"></script>
```

</body>
</html>
```

非常令人惊讶，在有 JS 而没有 CSS 的页面中，img 居然能够在收到数据后就立刻开始解码、绘图（paint)，也就是说，JS 并没有阻塞 img 的展现！这跟我们以前理解的 JS 会阻塞 img 资源的传统观念不太一样，看来 Chrome 对 img 的加载和展现做了新的优化。

* * *

我们常用的 jQuery 的 `$(document).ready()` 方法，就是对 DOMContentLoaded 事件的监听（当然，其内部还会通过模拟 DOMContentLoaded 事件和监听 onload 事件来提供降级方案）。通常推荐在 DOMContentLoaded 事件触发的时候为 DOM 元素注册事件。所以尽快的让 DOMContentLoaded 事件触发，就意味着能够尽快让页面可交互：

1.  减小 CSS 文件体积，把单个 CSS 文件分成几个文件以并行加载，减少 CSS 对 JS 的阻塞时间
2.  次要的 JS 文件，通过动态插入 script 标签来加载（动态插入的 script 标签不阻塞 DOMContentLoaded 事件的触发）
3.  CSS 中使用的精灵图，可以利用对 img 的预加载，放在 html 中跟 CSS 文件一起加载

在做实验的过程中，感觉 Chrome 开发者工具的 Timeline 面板非常强大，浏览器的一举一动都记录下来。以前我们前端开发要想理解、探索浏览器的内部行为，或者摸着石头过河的做黑盒测试，或者事倍功半的研究浏览器源码，唯一高效点的做法就是学习别人的研究经验，看老外的文章，但浏览器的发展日新月异（比如这次实验发现的 JS 不阻塞 img 的展现），别人的经验始终不是最新、最适合的，关键是要结合自己的业务、需求场景，有针对性的做分析和优化。

* * *

PS.

以上测试环境为 windows/chrome，并用 Fiddler 模拟慢速网络


<!-- {% endraw %} - for jekyll -->