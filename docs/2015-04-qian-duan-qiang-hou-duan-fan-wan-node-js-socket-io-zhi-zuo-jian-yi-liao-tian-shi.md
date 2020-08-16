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

```javascript
/**
 * index.js
 * @author LeeHey
 * @email lcxfs1991@gmail.com
 * @description
 * This file is to setup the basic Node.js server and require necessary server module
 */
//express.js framework
//express.js 框架
var express = require("express");
var app = express();
//create an http object based on express.js
//基于express.js新建http对象
var http = require("http").Server(app);
//module manage folder path
//这是一个管理文件路径的模块
var path = require("path");
//main processing file
//主要处理聊天室系统的文件，稍后详细解释
var chat = require("./routes/chat");
//set /public as the folder to serve static files
//设置/public作为存放静态文件（如模块，样式）的文件夹
app.use(express.static(path.join(__dirname, "public")));
//route / to /public/index.html
//使‘/’的请求都会输出./public/index.html文件内容
app.get("/", function (req, res) {
    res.sendFile("./public/index.html");
});
//initialize all http setting in chat object
//初始化聊天室
chat.initialize(http);
//listen to port 2501
//监听2501端口
http.listen(2501, function () {
    console.log("listening on *:2501");
});
```

新建 /chat/public 文件夹:

        mkdir public

接下来新建 /chat/routes 文件夹:

        mkdir routes

然后新建 /chat/routes/chat.js 以存放聊天室的基本业务逻辑。在 chat.js 里面，我们需要实现的有以下的几个基本的功能。

-   自动分配聊天室
-   更改聊天室
-   自动分配名字
-   更改名字
-   用户在相应聊天室里面发送消息
-   用户在加入、离开的时候会自动发送系统消息

网上大部份教程只会教怎么样搭建立一个消息发送的简单聊天室，而我今天打算包含更丰富的功能例如新建聊天室以及改名字。

首先在 chat.js 中加入以下代码:

```javascript
//express.js framework
//express.js框架
var express = require("express");
var app = express();
//socket io module
//socket io 模块
var socketIo = require("socket.io");
// create a new ojbect chat
//新建一个新的chat对象
var chat = {};
//chat property
//io object
chat.io = false;
//user name
chat.userName = {};
//name has been used
chat.usedName = [];
//user number
chat.userNum = 0;
//current room name
chat.currentRoom = {};
```

新建 initialize 方法来初始化

```javascript
//chat initialization with the passing http object
chat.initialize = function (http) {
    this.io = socketIo(http);
    this.ioListen();
};
```

新建 ioListen 方法作为最主要的监听方法

```javascript
// major socket listening method
chat.ioListen = function () {
    var that = this;
    this.io.on("connection", function (socket) {
        that.assignRoom(socket);
        that.changeRoom(socket);
        that.sysMsg(socket);
        that.userMsg(socket);
        that.assignGuestName(socket);
        that.changeName(socket);
        that.disconnect(socket);
    });
};
```

下面，我们对每个处理的方法进行剖析。

```javascript
//assign room 'Lobby' once they enter
chat.assignRoom = function (socket) {
    var that = this;
    socket.join("Lobby", function () {
        that.currentRoom[socket.id] = "Lobby";
    });
};
```

assignRoom 方法顾名思义就是自动给新加入的用户分配房间。有 socket.join 直接输入聊天室的名字就可以了，之后可以直接调 socket.io 自带的方法来得知道应该向用户所在的聊天室进行消息广播。然后用 currentRoom 存放用户聊天室的名字。

```javascript
//chat.js change room
chat.changeRoom = function (socket) {
    var that = this;
    socket.on("change room", function (msg) {
        var sysMsg =
            that.userName[socket.id] +
            " left room " +
            that.currentRoom[socket.id];
        that.io.to(that.currentRoom[socket.id]).emit("sys message", sysMsg);
        socket.leave(that.currentRoom[socket.id], function () {
            socket.join(msg);
            that.currentRoom[socket.id] = msg;
            sysMsg =
                that.userName[socket.id] +
                " join room " +
                that.currentRoom[socket.id];
            socket.emit("sys message", sysMsg);
            socket.emit("change room name", msg);
        });
    });
};
```

如果要更改房间，就可调用 changeRoom 方法。this.io.to (roomName) 就是利用 socket.io 自带的函数给用户所在的聊天室进行消息广播。然后 socket.leave 即是离开聊天室的意思。

```javascript
// send user message
chat.userMsg = function (socket) {
    var that = this;
    socket.on("chat message", function (msg) {
        msg = that.userName[socket.id] + " said: " + msg;
        that.io.to(that.currentRoom[socket.id]).emit("chat message", msg);
    });
};
//send system message
chat.sysMsg = function (socket) {
    var that = this;
    socket.on("sys message", function (msg) {
        that.io.to(that.currentRoom[socket.id]).emit("sys message", msg);
    });
};
```

chat.userMsg 和 chat.sysMsg 分别是发送用户消息和系统消息的方法。他们都用到了上文提到的 this.io.to 进行聊天室广播。

```javascript
//assign a guest name to new joining user
chat.assignGuestName = function (socket) {
    this.userName[socket.id] = "Guest" + this.userNum;
    this.usedName.push("Guest" + this.userNum);
    this.userNum++;
    var msg = this.userName[socket.id] + " enter the room! Welcome!";
    this.io.emit("new user", msg);
};
//change user name
chat.changeName = function (socket) {
    var that = this;
    socket.on("change name", function (msg) {
        if (that.usedName.indexOf(msg) == -1) {
            var nameIndex = that.usedName.indexOf(that.userName[socket.id]);
            that.userName[socket.id] = msg;
            that.usedName[nameIndex] = msg;
            socket.emit("sys message", "Your name has been changed as " + msg);
        } else {
            socket.emit("sys message", "Your name has been used");
        }
    });
};
```

assignGuestName 和 changeName 和之后 assignRoom 的 changeRoom 相当类似，。通过 userName 存放用户姓名，usedName 判断是否有重名，然后利用 this.io.emit 去解放系统消息。

后台 chat.js 的代码基本介绍完毕。然后我们将处理前端的代码。

然后新建 /chat/public/index.html 并录入 HTML 代码（由于 github 会过滤部份 HTML 的关系，请到代码管理的 /public/html/ 里面抓取代码。

前后端的代码基本录入完成后，我们将结合两者进行说明。首先，我们要理解，方法 socket.emit 和 socket.on 是相对应而存在的，on 是对 event 的监听，emit 是对 event 的触发。例如，在前端，我们通过

    socket.emit('chat message', msg);

触发聊天消息的事件。 在后端我们通过

```javascript
socket.on("chat message", function (msg) {
    that.userMsg(socket, msg);
});
```

进行聊天消息事件的监听。在 chat.userMsg 中，我们通过

    this.io.to(this.currentRoom[socket.id]).emit('chat message', msg);

进行聊天消息事件的触发，在前端的代码中，我们通过

```javascript
socket.on("chat message", function (msg) {
    showMsg(msg);
});
```

进行聊天消息的监听并显示到浏览器中。socket.emit 和 socket.on 是一一对应的，上面前后端代码结合起来形成了整个消息从前端输入到后台处理，再从后台推送到其它用户前台的整个流程。

### **4. 坑，坑，还是坑**

在做的过程中，我还是遇到不少坑值得大家以后留意的。

#### 坑 1. 对于 socket 以及 io 两种对象的理解

能过下面语句其实我们可以发现 socket 实质是 io.socket。所以 socket 其实只是 io 对象的一个子对象。Socket 中文译作插座的意思，实质上只是负责监听 io 对象的某一通道而已。

```javascript
this.io.on("connection", function (socket) {
    // doing something
});
```

通过下面代码相信大家可以知道两者区别

        this.io.emit('xxx', msg);
        //触发对所有通道发送信息的事件

        this.io.socket('xxx', msg);
        //触发仅对自己通道的事件

        this.io.to(room).emit('xxx', msg);
        //触发对某一房间的事件

####  

#### 坑 2. 对输入内容的处理

由于这是一个需要处理用户输入输出的聊天室，因此，非常需要对用户的输入输出进行过滤，否则很容易会受到 xss 攻击。这里 socket.io 似乎已经对用户的输入输出过滤，但并不代表开发者不需要注意这一点。尤其是前端的同学，可能会忽略这个通常由后端进行处理的点。

#### 坑 3. 并不是所有浏览器都支持 Websocket

虽然 socket.io 自诩支持所有浏览器，其实只是支持比较新的现代浏览器，如果想测试你的浏览器是否支持 websocket 可以访问下面网站进行测试。如果不支持，只好用 comet 作为替代方案。<http://www.websocket.org/aboutwebsocket.html>

[![](https://github.com/lcxfs1991/chat-socket.io/raw/master/websocket_support.png)](https://github.com/lcxfs1991/chat-socket.io/blob/master/websocket_support.png)


<!-- {% endraw %} - for jekyll -->