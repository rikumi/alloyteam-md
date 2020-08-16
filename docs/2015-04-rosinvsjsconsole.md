---
title: RosinVSJSConsole
date: 2015-04-29
author: TAT.helondeng
source_link: http://www.alloyteam.com/2015/04/rosinvsjsconsole/
---

<!-- {% raw %} - for jekyll -->

Rosin 是一个 Fiddler 插件，协助开发者进行移动端页面开发调试。

##### 特性

-   可配置的页面匹配规则
-   拦截 console
-   日志内容的存储，展示，过滤
-   脚本运行错误捕获

##### 原理

-   首先在 fiddler 里面配置了匹配规则
-   访问的页面进过 fiddler 之后，匹配规则会生效，如命中，则在返回的内容中注入脚本。
-   脚本重写了 console 的各种方式（也监听了 onerror 事件）
-   将 console 打出的各种消息 push 到消息队列
-   队列达到阈值或者间隔的时间到，就将消息通过 xhr 发送到 `http://__rosin__.qq.com`
-   rosin 插件在 fiddler 中捕获上面的请求（并且隐藏了，所以看不到这个请求），将请求的 body 部分显示到面板上面
-   将 log 存储到本地 `D:Program Files (x86)Fiddler2ScriptsRosinLog`

```html
            add: <span class="keyword">function</span>() {
            <span class="keyword">Array</span>.prototype.push.apply(<span class="keyword">this</span>._queueArr, arguments);
            <span class="comment">// 定时发送消息</span>
            clock.start();
 
            <span class="comment">//队列达到阈值就触发上传</span>
            <span class="keyword">if</span> (<span class="keyword">this</span>._queueArr.length >= THRESHOLD) {
                <span class="keyword">this</span>._post(<span class="keyword">this</span>._queueArr.splice(<span class="number">0</span>, <span class="keyword">this</span>._queueArr.length));
                <span class="keyword">return</span>;
            }
        }
 
```

Log 格式：

![log](https://cloud.githubusercontent.com/assets/3880323/7385889/ad9570de-ee7f-11e4-91ea-2fe0eec730e2.png)

### JSConsole

JSConsole 是一个 JS 命令行调试工具。

##### 如何使用

-   在 `http://jsconsole.com/`中输入`:listen` 创建一个 session（主要是生成一个 GUID）
-   在页面中引入脚本

````html

```html
<script src="http://jsconsole.com/remote.js?FAE031CD-74A0-46D3-AE36-757BAB262BEA"></script>
````

;

````

##### 原理

*   引入的 remote.js 脚本创建一个隐藏的 iframe，Url 指向了 `http://jsconsole.com/remote.html`，并且把上面的 GUID 带上
*   重写 console 中的方法，这里的问题是：`如何把消息 push 到 jsconsole.com`？
*   页面调用 console 等方法时，实际通过 postMessage 是向 iframe 发送了一条消息。

```html
        log: <span class="keyword">function</span> () {
         <span class="keyword">var</span> argsObj = stringify(arguments.length == <span class="number">1</span> ? 
                  arguments[<span class="number">0</span>] : [].slice.call(arguments, <span class="number">0</span>));
        ar response = [];
        [].<span class="keyword">forEach</span>.call(arguments, <span class="keyword">function</span> (args) {
            response.push(stringify(args, <span class="keyword">true</span>));
        });
 
        <span class="keyword">var</span> msg = JSON.stringify({ response: response, 
              cmd: <span class="string">'remote console.log'</span>, type: msgType });
 
        <span class="keyword">if</span> (remoteWindow) {
        remoteWindow.postMessage(msg, origin);
        } <span class="keyword">else</span> {
            queue.push(msg);
        }    
        msgType = <span class="string">''</span>;
        }
 
````

-   iframe 中内嵌的页面收到消息后，通过 EventSource 向 server 发送信息内容（类似于 socket）
-   日志显示在 jsconsole.com 上面

<!-- {% endraw %} - for jekyll -->