---
title: 初识 NodeJS 服务端开发（Express+MySQL）
date: 2015-03-09
author: TAT.Fujun
source_link: http://www.alloyteam.com/2015/03/sexpressmysql/
---

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

```c
// dao/userSqlMapping.js
// CRUD SQL语句
var user = {
	insert:'INSERT INTO user(id, name, age) VALUES(0,?,?)',
	update:'update user set name=?, age=? where id=?',
	delete: 'delete from user where id=?',
	queryById: 'select * from user where id=?',
	queryAll: 'select * from user'
};
 
module.exports = user;
```

3. 增加路由及实现数据库的 CRUD

以 C（新增）的具体实现举例，在 /routes/users.js 中增加一个路由

```javascript
// 增加用户
router.get("/addUser", function (req, res, next) {
    userDao.add(req, res, next);
});
```

在 userDao 中实现 add 方法

```javascript
// dao/userDao.js
// 实现与MySQL交互
var mysql = require("mysql");
var $conf = require("../conf/conf");
var $util = require("../util/util");
var $sql = require("./userSqlMapping");
// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, $conf.mysql));
// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
    if (typeof ret === "undefined") {
        res.json({
            code: "1",
            msg: "操作失败",
        });
    } else {
        res.json(ret);
    }
};
module.exports = {
    add: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            // 建立连接，向表中插入值
            // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
            connection.query($sql.insert, [param.name, param.age], function (
                err,
                result
            ) {
                if (result) {
                    result = {
                        code: 200,
                        msg: "增加成功",
                    };
                }
                // 以json形式，把操作结果返回给前台页面
                jsonWrite(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
};
```

4. 测试整合是否成功

因为前面实现的是一个 get 请求的 add 方法， 所以可以在浏览器中直接使用地址访问，进入路由， http&#x3A;//localhost:3000/users/addUser?name=xyz&age=18. 如果你得到如下 JSON 返回或看到数据表中有上面的数据插入，表示整合成功了

[![6](http://www.alloyteam.com/wp-content/uploads/2015/03/6.png)](http://www.alloyteam.com/wp-content/uploads/2015/03/6.png)

[![7](http://www.alloyteam.com/wp-content/uploads/2015/03/7.png)](http://www.alloyteam.com/wp-content/uploads/2015/03/7.png)

5. 同理，实现 CRUD 其它的方法，最终完整的的 routes/user.js 为：

```javascript
var express = require("express");
var router = express.Router();
var userDao = require("../dao/userDao");
/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});
// 增加用户
//TODO 同时支持get,post
router.get("/addUser", function (req, res, next) {
    userDao.add(req, res, next);
});
router.get("/queryAll", function (req, res, next) {
    userDao.queryAll(req, res, next);
});
router.get("/query", function (req, res, next) {
    userDao.queryById(req, res, next);
});
router.get("/deleteUser", function (req, res, next) {
    userDao.delete(req, res, next);
});
router.post("/updateUser", function (req, res, next) {
    userDao.update(req, res, next);
});
module.exports = router;
```

完整的 userDao.js 为

```javascript
// dao/userDao.js
// 实现与MySQL交互
var mysql = require("mysql");
var $conf = require("../conf/db");
var $util = require("../util/util");
var $sql = require("./userSqlMapping");
// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, $conf.mysql));
// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
    if (typeof ret === "undefined") {
        res.json({
            code: "1",
            msg: "操作失败",
        });
    } else {
        res.json(ret);
    }
};
module.exports = {
    add: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            // 建立连接，向表中插入值
            // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
            connection.query($sql.insert, [param.name, param.age], function (
                err,
                result
            ) {
                if (result) {
                    result = {
                        code: 200,
                        msg: "增加成功",
                    };
                }
                // 以json形式，把操作结果返回给前台页面
                jsonWrite(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    delete: function (req, res, next) {
        // delete by Id
        pool.getConnection(function (err, connection) {
            var id = +req.query.id;
            connection.query($sql.delete, id, function (err, result) {
                if (result.affectedRows > 0) {
                    result = {
                        code: 200,
                        msg: "删除成功",
                    };
                } else {
                    result = void 0;
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    update: function (req, res, next) {
        // update by id
        // 为了简单，要求同时传name和age两个参数
        var param = req.body;
        if (param.name == null || param.age == null || param.id == null) {
            jsonWrite(res, undefined);
            return;
        }
        pool.getConnection(function (err, connection) {
            connection.query(
                $sql.update,
                [param.name, param.age, +param.id],
                function (err, result) {
                    // 使用页面进行跳转提示
                    if (result.affectedRows > 0) {
                        res.render("suc", {
                            result: result,
                        }); // 第二个参数可以直接在jade中使用
                    } else {
                        res.render("fail", {
                            result: result,
                        });
                    }
                    connection.release();
                }
            );
        });
    },
    queryById: function (req, res, next) {
        var id = +req.query.id; // 为了拼凑正确的sql语句，这里要转下整数
        pool.getConnection(function (err, connection) {
            connection.query($sql.queryById, id, function (err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    queryAll: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            connection.query($sql.queryAll, function (err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
};
```

除了 update 测试外，其它 get 请求都可以直接在浏览器中使用地址 + 参数完成测试。为了模拟 post 请求，同时简单使用下 jade 模板（Express 支持的一种模板引擎），  
我们在 /views 目录新建三个 jade 文件

updateUser.jade

```html
extends layout
 
block content
    h1 更新用户资料
    form(method='post', action='/p/users/updateUser')
        div.form-row
            label
                span ID:
                input(type='text',name='id')
        div.form-row
            label
                span name:
                input(type='text',name='name')
        div.form-row
            label
                span age:
                input(type='text',name='age')
        div.form-row
            input(type='submit')
```

suc.jade

    block content
      h1 操作成功！
      pre #{JSON.stringify(result)}

fail.jade

    block content
      h1 操作失败！
      pre #{JSON.stringify(result)}

以下是更新测试结果

[![9](http://www.alloyteam.com/wp-content/uploads/2015/03/9.png)](http://www.alloyteam.com/wp-content/uploads/2015/03/9.png)

最后，如果你使用的是 idea 或 webStrom 这样的 IDE，你就不需要安装 express 和 express 项目种子生成器了。这两个 IDE 是可以直接创建 NodeJS 项目

[![10](http://www.alloyteam.com/wp-content/uploads/2015/03/10.png)](http://www.alloyteam.com/wp-content/uploads/2015/03/10.png)

[![11](http://www.alloyteam.com/wp-content/uploads/2015/03/11.png)](http://www.alloyteam.com/wp-content/uploads/2015/03/11.png)

[![12](http://www.alloyteam.com/wp-content/uploads/2015/03/12.png)](http://www.alloyteam.com/wp-content/uploads/2015/03/12.png)

[![13](http://www.alloyteam.com/wp-content/uploads/2015/03/13.png)](http://www.alloyteam.com/wp-content/uploads/2015/03/13.png)

小结：

一个 Express 的 helloWorld 就差不多完成了，可以通过这个链接下载此例子源代码 <http://pan.baidu.com/s/1jGvd4Bc。更多> Express 的功能（如日志，自动化测试等），等待大家去解锁，愿玩得愉快！