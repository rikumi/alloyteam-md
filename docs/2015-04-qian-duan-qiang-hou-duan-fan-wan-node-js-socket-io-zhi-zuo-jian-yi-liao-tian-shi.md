---
title: 前端抢后端饭碗 — Node.js + Socket.io 制作简易聊天室
date: 2015-04-21
author: TAT.heyli
source_link: http://www.alloyteam.com/2015/04/qian-duan-qiang-hou-duan-fan-wan-node-js-socket-io-zhi-zuo-jian-yi-liao-tian-shi/
---

<!-- {% raw %} - for jekyll -->

**1. 前言**

看到这个题目的时候干后端的别打我。在接触 Socket.io 之前曾经用 PHP + jQuery 写了一个低效的长轮询只有消息同步功能的小聊天室就已经耗尽心力，更不用说利用 PHP 的 Socket 接口写 WebSocket 的聊天室，那更是灾难。

刚才一口气说了一堆大家都困惑的术语，接下来等我解释一下。

一般来说，浏览器在接收到客户端请求 (request) 的时候，会发送给服务器端进行处理，服务器端处理完毕后会返回结果 (response), 这样就完整地完成了一次 HTTP 的请求。当客户端想再更新页面信息的时候，需要刷新浏览器，再完成一次 HTTP 请求。

后来， AJAX 的流行貌似使网站更加用户友好，增强了互动性，但实际上在效率上并没有提高，AJAX 与后台的交互实际也是在一次又一次地完成 HTTP 请求。终于， 人们为了更好地实现实时应用，想出了一些办法，老办法叫 Comet, 新办法叫 Websocket.

老办法 Comet 是改良自 AJAX（轮询）。拿 PHP 作为例子，其原理就是，利用 AJAX 给 PHP 后台发送请求，后台 PHP 设置运行时间为无限，并用一个死循环使 HTTP 请求不返回而达到持续监听后台的效果。一旦死循环里的代码检测发现数据 / 文件被修改，则跳出循环，返回更新后的数据。这种办法简明易懂，后台代码不需要写太多，但因为连接不断开而大量服务器资源。

新办法就是 HTML5 新的 API 叫做 WebSocket.WebSocket 采用了一些特殊的报头 (Header)，使得浏览器和服务器只需要做一个握手的动作，就可以在浏览器和服务器之间建立一条连接通道，而毋须消耗大量服务器资源。更进一步的原理，大家可以参考下面两篇文章:

(1) <https://github.com/xionglun/goWebBook/blob/master/docs/08.2.md>

(2) <http://www.html5rocks.com/zh/tutorials/websockets/basics/>

今天我们会介绍用 Node.js 和 Socket.io 来轻松完成这个任务。

Socket.io 是使用得非常普遍的前端调用 Websocket 的库，其[官方网站](http://socket.io/)里面还自带了后台实现的代码。我们用 Node.js 也是奔着这一点去的，因为你们会发其前后端代码居然一模一样，我们毋须再为 PHP，JAVA 那些繁杂的代码而忧心。

### **2. 基本知识**

-   Websocket 基础知识
-   Javascript
-   Node.js
-   Express.js（Node.js 中最流行的网页框架)

### **3. 正文**

[文章链接及源代码](https://github.com/lcxfs1991/chat-socket.io)

version1 Demo Page  [点击进入](http://128.199.194.125:8081/)

version2 Demo Page  [点击进入](http://128.199.194.125:8082/)

请多开几个浏览器窗口进行聊天模拟。

运行环境: Mac OSX 10.9.5

首先我们需要安装 Node.js 以及其包管理 npm。在此不赘述，请参考官方安装指南：

[官方官装指南](https://github.com/joyent/node/wiki/Installation)

安装完之后，我们要新建一个文件夹。

    mkdir chat
    cd chat

然后我们新建一个 /chat/package.json 文件，并输入以下代码。这个文件存放 Node.js 应用的依赖环境及模块。

```javascript
{
    "name": "chat",
    "version": "0.0.1",
    "description": "first socket.io app",
    "dependencies": {
       "express": "^4.9.6",
       "socket.io": "^1.1.0"
    }
}
```

然后输入以下命令，系统就会帮你自动安装所有需要的模块。并在 /chat 下面多出一个 node_modules 的文件夹存放所需的模块。

    npm install

/chat/index.js 文件，并输入以下代码。这个文件主要是 Node.js 主要的服务器搭建，模块处始化的地方。如果有 Node.js 基础的同学相信会比较熟悉。没有的同学也不要紧，可以先用着。


<!-- {% endraw %} - for jekyll -->