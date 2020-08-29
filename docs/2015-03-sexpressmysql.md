---
title: 初识 NodeJS 服务端开发（Express+MySQL）
date: 2015-03-09
author: TAT.Fujun
source_link: http://www.alloyteam.com/2015/03/sexpressmysql/
---

<!-- {% raw %} - for jekyll -->

NodeJS 对前端来说无疑具有里程碑意义，在其越来越流行的今天，掌握 NodeJS 已经不再是加分项，而是前端攻城师们必须要掌握的技能。本文将与同志们一起完成一个基于 Express+MySQL 的入门级服务端应用，即可以对数据库中的一张表进行简单的 CRUD 操作。但本人还是斗胆认为，通过这个应用，可以让没怎么接触后端开发的同志对使用 Node 进行后端开发有一个大致了解。

**Express 工程环境准备**

1. 安装 express，和 express 项目种子生成器（什么？你问第 1 步为什么不是安装 NodeJS，我也只能呵呵..）

安装 express

    npm install express -g

安装 express

    npm install express-generator -g

2. 创建工程。进入工程目录，运行命令

    express projectName

expresst 项目种子生成器会帮我们生成 express 相应的工程结构，如下

[![1](http://www.alloyteam.com/wp-content/uploads/2015/03/1.png)](http://www.alloyteam.com/wp-content/uploads/2015/03/1.png)

/bin: 用于应用启动  
/public: 静态资源目录  
/routes：可以认为是 controller（控制器）目录  
/views: jade 模板目录，可以认为是 view (视图) 目录  
app.js 程序 main 文件

3. 进入工程，安装依赖，然后启动应用  
在工程根目录，使用 npm install 安装依赖，使用 npm start 启动应用。完成后，你在命令行工具里会看出如下界面，在浏览器中访问会得到我们应用的默认页面

[![2](http://www.alloyteam.com/wp-content/uploads/2015/03/2.png)](http://www.alloyteam.com/wp-content/uploads/2015/03/2.png)

[![3](http://www.alloyteam.com/wp-content/uploads/2015/03/3.png)](http://www.alloyteam.com/wp-content/uploads/2015/03/3.png)

**MySQL 环境准备**

1. 当然，首先你要准备好 MySQL 环境。可以参看 <http://supportopensource.iteye.com/blog/1415527> 进行安装，同时也建议安装一个数据库管理工具，如 navicat for mysql, 方便操作

2. 创建表  
MySQL 安装好了后，进入到数据库，创建要用到的表 (如 user), 结构如下

[![4](http://www.alloyteam.com/wp-content/uploads/2015/03/4.png)](http://www.alloyteam.com/wp-content/uploads/2015/03/4.png)

3. 安装 Node 的 MySQL 驱动（请允许装 X 一下...）  
在 package.json 的 dependencies 中新增，"mysql" : "latest"， 并执行 npm install 安装依赖

**编写相关代码，整合 Express+MySQL**

1. 首先，我们先建几个目录，简单分下层（看出我还是很用心木有？）

在工程根目录新增三个目录：  
util - 工具方法  
conf - 配置  
dao - 与数据库交互

完成后的工程结构

[![5](http://www.alloyteam.com/wp-content/uploads/2015/03/5.png)](http://www.alloyteam.com/wp-content/uploads/2015/03/5.png)

2. 在 conf 目录中，编写 mySQL 数据库连接配置

```javascript
// conf/db.js
// MySQL数据库联接配置
module.exports = {
    mysql: {
        host: "127.0.0.1",
        user: "root",
        password: "",
        database: "test", // 前面建的user表位于这个数据库中
        port: 3306,
    },
};
```

2. 编写 CRUD SQL 语句

```javascript
// dao/userSqlMapping.js
// CRUD SQL语句
var user = {
	insert:'INSERT INTO user(id, name, age) VALUES(0,?,?)',
	</
```


<!-- {% endraw %} - for jekyll -->