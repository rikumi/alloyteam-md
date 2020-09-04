---
title: Node 嵌入式数据库 ——NeDB
date: 2016-03-30
author: TAT.李强
source_link: http://www.alloyteam.com/2016/03/node-embedded-database-nedb/
---

<!-- {% raw %} - for jekyll -->

一、简介  

=======

NeDB 是使用 Nodejs 实现的一个 NoSQL 嵌入式数据库操作模块，可以充当内存数据库，也可以用来实现本地存储，甚至可以在浏览器中使用。查询方式比较灵活，支持使用正则、比较运算符、逻辑运算符、索引以及 JSON 深度查询等。

NeDB 嵌入到了应用程序进程中，消除了与客户机服务器配置相关的开销，在运行时，也只需要较少的内存开销，使用精简代码编写，速度更快。其 API 是 MongoDB 的一个子集，可以通过这些接口轻松管理应用程序数据，而不依靠原始的文档文件。

具有简单、轻量、速度快等特点，由于嵌入式数据库存储总数据量最好要控制在 1GB 以内，所以适合在不需要大量数据处理的应用系统中使用（比如使用 nw.js 等实现的桌面应用程序、并发量不大的系统等）。

二、Git 地址  

===========

<https://github.com/louischatriot/nedb>

三、快速上手  

=========

由于 NeDB 可以看作是精简版的 MongoDB，这里和 MongoDB 的使用做一下对比，以便可以更直观的感受 NeDB 的简便。

MongoDB  

==========

1、下载安装包；（<http://www.mongodb.org/downloads>）

2、解压缩文件；

3、设置系统变量；

4、配置 mongodb 运行环境；

5、启动 mongodb 服务；

6、连接 mongodb；

7、添加 mongodb 为 windows 服务；

8、启动服务；

    net start MongoDB

9、安装 mongoose 模块（mongoose 官网 <http://mongoosejs.com/>）

    npm install mongoose --save

10、使用（以 express 为例）

```javascript
var mongoose = require("mongoose");
exports.index = function (req, res) {
    var db = mongoose.createConnection("localhost", "test");
    var schema = mongoose.Schema({ name: "string" });
    var User = db.model("User", schema);
    var user = new User({ name: "tom" });
    user.save(function (err) {
        if (err)
            // ...
            res.end();
    });
    User.find({ name: "tom" }, function (err, docs) {
        res.render("index", { title: docs });
    });
};
```

11、停止或删除服务；


<!-- {% endraw %} - for jekyll -->