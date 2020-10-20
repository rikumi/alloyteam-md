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
            add: &lt;span class="keyword">function&lt;/span>() {
            &lt;span class="keyword">Array&lt;/span>.prototype.push.apply(&lt;span class="keyword">this&lt;/span>._queueArr, arguments);
            &lt;span class="comment">// 定时发送消息&lt;/span>
            clock.start();
 
            &lt;span class="comment">//队列达到阈值就触发上传&lt;/span>
            &lt;span class="keyword">if&lt;/span> (&lt;span class="keyword">this&lt;/span>._queueArr.length >= THRESHOLD) {
                &lt;span class="keyword">this&lt;/span>._post(&lt;span class="keyword">this&lt;/span>._queueArr.splice(&lt;span class="number">0&lt;/span>, &lt;span class="keyword">this&lt;/span>._queueArr.length));
                &lt;span class="keyword">return&lt;/span>;
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

```html
&lt;script src="http://jsconsole.com/remote.js?FAE031CD-74A0-46D3-AE36-757BAB262BEA">&lt;/script>;
```

##### 原理

-   引入的 remote.js 脚本创建一个隐藏的 iframe，Url 指向了 `http://jsconsole.com/remote.html`，并且把上面的 GUID 带上
-   重写 console 中的方法，这里的问题是：`如何把消息 push 到 jsconsole.com`？
-   页面调用 console 等方法时，实际通过 postMessage 是向 iframe 发送了一条消息。

```html
        log: &lt;span class="keyword">function&lt;/span> () {
         &lt;span class="keyword">var&lt;/span> argsObj = stringify(arguments.length == &lt;span class="number">1&lt;/span> ? 
                  arguments[&lt;span class="number">0&lt;/span>] : [].slice.call(arguments, &lt;span class="number">0&lt;/span>));
        ar response = [];
        [].&lt;span class="keyword">forEach&lt;/span>.call(arguments, &lt;span class="keyword">function&lt;/span> (args) {
            response.push(stringify(args, &lt;span class="keyword">true&lt;/span>));
        });
 
        &lt;span class="keyword">var&lt;/span> msg = JSON.stringify({ response: response, 
              cmd: &lt;span class="string">'remote console.log'&lt;/span>, type: msgType });
 
        &lt;span class="keyword">if&lt;/span> (remoteWindow) {
        remoteWindow.postMessage(msg, origin);
        } &lt;span class="keyword">else&lt;/span> {
            queue.push(msg);
        }    
        msgType = &lt;span class="string">''&lt;/span>;
        }
 
```

-   iframe 中内嵌的页面收到消息后，通过 EventSource 向 server 发送信息内容（类似于 socket）
-   日志显示在 jsconsole.com 上面


<!-- {% endraw %} - for jekyll -->