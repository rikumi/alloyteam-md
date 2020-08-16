---
title: 【高性能前端 1】高性能 HTML
date: 2012-10-10
author: TAT.yuanyan
source_link: http://www.alloyteam.com/2012/10/high-performance-html/
---

<!-- {% raw %} - for jekyll -->

## 避免使用 Iframe

Iframe 也叫内联 frame，可以把一个 HTML 文档嵌入到另一个文档中。使用 iframe 的好处是被嵌入的文档可以完全独立于其父文档，凭借此特点我们通常可以使浏览器模拟多线程，需要注意的是使用 iframe 并不会增加同域名下的并行下载数，浏览器对同域名的连接总是共享浏览器级别的连接池，即使是跨窗口或跨标签页，这在所有主流浏览器都是如此。也因为这样这让 iframe 带来的好处大打折扣。

在页面加载过程中 iframe 元素会阻塞父文档 onload 事件的触发，而开发者程序通常会在 onload 事件触发时初始化 UI 操作。例如，设置登录区域的焦点。因为用户习惯等待这一操作，所以尽可能的让 onload 事件触发从而使用户的等待时间变短是非常重要的。另外开发者会把一些重要的行为绑定在 unload 事件上，而不幸的是在一些浏览器中，只有当 onload 事件触发后 unload 事件才能触发，如果 onload 事件长时间未触发，而用户已经离开当前页面，那么 unload 事件也将永远得不到触发。  
那是否有方案可以让 onload 事件不被 iframe 阻塞吗？有个简单的解决方案来避免 onload 事件被阻塞，使用 JavaScript 动态的加载 iframe 元素或动态设置 iframe 的 src 属性：

```c
 <iframe id=iframe1 ></iframe>
 document.getElementById(‘iframe1’).setAttribute(‘src’， ‘url’);
```

但其仅在高级浏览器 中有效，对于 Internet Explorer 8 及以下的浏览器无效。除此之外我们必须知道 iframe 是文档内最消耗资源的元素之一，在 [Steve Souders 的测试中](http://stevesouders.com/efws/costofelements.php) ，在测试页面中分别加载 100 个 A、DIV、SCRIPT、STYLE 和 IFRAME 元素，并且分别在 Chrome、Firefox、Internet Explorer、Opera、Safari 中运行了 10 次。结果显示创建 iframe 元素的开销比创建其他类型的 DOM 元素要高 1~2 个数量级。在测试中所有的 DOM 元素都是空的，如加载大的脚本或样式块可能比加载某些 iframe 元素耗时更长，但从基准测试结果来看，即使是空的 iframe，其开销也是非常昂贵的，鉴于 iframe 的高开销，我们应尽量避免使用。尤其是对于移动设备，对于目前大部分还是只有有限的 CPU 与内存的情况下，更应避免使用 iframe。

# 避免空链接属性

空的链接属性是指 img、link、script、ifrrame 元素的 src 或 href 属性被设置了，但是属性却为空。如<img src=””>，我们创建了一个图片，并且暂时设置图片的地址为空，希望在未来动态的去修改它。但是即使图片的地址为空，浏览器依旧会以默认的规则去请求空地址：

1.  Internet Explorer 8 及以下版本浏览器只在 img 类型元素上出现问题，IE 会把 img 的空地址解析为当前页面地址的目录地址。例如：如果当前页面地址为 <http://example.com/dir/page.html，IE> 会把空地址解析为 [http://example.com/dir/ 地址并请求。](http://example.com/dir/地址并请求。)
2.  早些版本的 Webkit 内核浏览器 与 Firefox 会把空地址解析为当前页面的地址。如果页面内有多个空链接属性元素，当前页面的服务器则会被请求多次，增加服务器的负载。相较桌面浏览器对内核的更新升级较积极，这个问题在 ios 与 android 系统的移动浏览器上问题可能较严重。
3.  幸运的是所有主流浏览器面对 iframe 的 src 属性为空时，会把空地址解析为 about:blank 地址，而不会向服务器发出额外的请求。

## 避免节点深层级嵌套

深层级嵌套的节点在初始化构建时往往需要更多的内存占用，并且在遍历节点时也会更慢些，这与浏览器构建 DOM 文档的机制有关。例如下面 HTML 代码：

```html
<html>
    <body>
        <p>Hello World</p>
        <div>
            {" "}
            <img src="example.png" />
        </div>
    </body>
</html>;
```

通过浏览器 HTML 解析器的解析，浏览器会把整个 HTML 文档的结构存储为 DOM 树结构。当文档节点的嵌套层次越深，构建的 DOM 树层次也会越深。

## 缩减 HTML 文档大小

提高下载速度最显而易见的方式就是减少文件的大小，特别是压缩内嵌在 HTML 文档中的 JavaScript 和 CSS 代码，这能使得页面体积大幅精简。除此之外减少 HTML 文档大小还可以采取下面几种方法：

1.  删掉 HTM 文档对执行结果无影响的空格空行和注释
2.  避免 Table 布局
3.  使用 HTML5

## 显式指定文档字符集

HTML 页面开始时指定字符集，有助于浏览器可以立即开始解析 HTML 代码。HTML 文档通常被解析为一序列的带字符集编码信息的字符串通过 internet 传送。字符集编码在 HTTP 响应头中，或者 HTML 标记中指定。浏览器根据获得的字符集，把编码解析为可以显示在屏幕上的字符。如果浏览器不能获知页面的编码字符集，一般都会在执行脚本和渲染页面前，把字节流缓存，然后再搜索可进行解析的字符集，或以默认的字符集来解析页面代码，这会导致消耗不必要的时间。为了避免浏览器把时间花费在搜寻合适的字符集来进行解码，所以最好在文档中总是显式的指定页面字符集。

## 显式设置图片的宽高

当浏览器加载页面的 HTML 代码时，有时候需要在图片下载完成前就对页面布局进行定位。如果 HTML 里的图片没有指定尺寸（宽和高），或者代码描述的尺寸与实际图片的尺寸不符时，浏览器则要在图片下载完成后再 “回溯” 该图片并重新显示，这会消耗额外时间。所以，最好为页面里的每一张图片都指定尺寸，不管是在页面 HTML 里的<img> 标签，还是在 CSS 里。

```html
<img src="hello.png" width="400" height="300">
```

## 避免脚本阻塞加载

当浏览器在解析常规的 script 标签时，它需要等待 script 下载完毕，再解析执行，而后续的 HTML 代码只能等待。为了避免阻塞加载，应把脚步放到文档的末尾，如把 script 标签插入在 body 结束标签之前：

````html
 
```html
<script src="example.js" ></script>
````

 </body>
```


<!-- {% endraw %} - for jekyll -->