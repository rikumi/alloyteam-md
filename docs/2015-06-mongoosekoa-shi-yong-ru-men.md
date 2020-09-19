---
title: Mongoose&KOA 使用入门
date: 2015-06-30
author: TAT.simplehuang
source_link: http://www.alloyteam.com/2015/06/mongoosekoa-shi-yong-ru-men/
---

<!-- {% raw %} - for jekyll -->

## 一、概念解析：

### Mongoose:

Let's face it, **writing MongoDB validation, casting and business logic boilerplate is a drag**. That's why we wrote Mongoose.

Mongoose 简单来说就是数据库操作 ORM

### createConnection 与 connect:

许多入门学徒在看到这两个函数的时候都会有一定疑惑，但是这两个函数其实并不是一个东西，

createConnection 创建的并非一个默认的数据库连接，它返回的是一个 Connection。我们需要通过这个 Connection 来创建 Model、Instance，然后进行数据表操作，这通常是在程序需要连接多个数据库的情况下使用，否则一般使用 connect 来打开默认的数据库连接，这时候我们就可以用 mongoose.model 来创建我们的 Model 了。

```javascript
var conn = mongoose.createConnection("mongodb://localhost:27017/test"),
    MyModel = conn.model("project", projectSchema),
    m = new MyModel();
m.save();
```

VS

```javascript
var conn = mongoose.connect("mongodb://localhost:27017/test"),
    MyModel = mongoose.model("project", projectSchema),
    m = new MyModel();
m.save();
```

### 必解名词：

Schema ： 数据库存储格式的约定协议，可以理解为数据表的字段类型声明。

Model ：  由 Schema 转化的数据模型，具有抽象属性和行为的数据库操作，可以进行查询操作

Instance： 由 Model 创建的实体操作对象，可以对数据库表进行完整的 CRUD 操作

## 二、Mongoose 使用

1.  安装 mongoose


        $ npm install mongoose

2.  连接数据库

```css
var mongoose = require("mongoose"),
    url = "mongodb://" + dbHost + ":" + dbPort + "/" + dbName;
mongoose.connect(url); //mongoose.connect('mongodb://localhost:port/databaseName');
```

3.  声明一个 Schema 模型

```javascript
var Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId; // 用户模型
var userSchema = new Schema({
    uid: String, // 用户 id
    nick: String, // 用户昵称
    pwd: String, // 用户密码
    project: [
        {
            type: ObjectId,
            ref: "Project",
        },
    ], // 这个用户对应的作品
});
```

4.  将声明的 Schema 转化为 Model

```javascript
// 建立Model
var User = mongoose.model("User", userSchema);
```

5.  将 Model 实例化为 Instance

```javascript
var user = {
    uid: "545183867",
    nick: "哈哈哈",
};
var newUser = new User(user);
console.log(newUser.nick);
```

6.  Instance 进行数据库 CRUD 操作


        newUser.save(); // 执行完成后，数据库就有该数据了

7.  使用 Modal 进行表查询操作

```javascript
User.find(function (err, users) {
    //查询到的所有User
});
```

## 三、结合 KOA 框架

在 KOA 中，回调已经基本被抛弃了，所以我们还是来看下 KOA 中 mongoose 活得怎么样吧。

CRUD 操作如今需要加入 yield 来确保我们主调调能耐心等待 newUser.save ()/User.find () 的完成，那我们就去掉回调加上 yield 吧:

```javascript
    var user = {
            uid: '545183867',
            nick: '哈哈哈'
        },
        newUser = new User(user),
        userInfo;
 
    yield newUser.save();
    userInfo = yield User.find({
        uid: '545183867'
    });
```

既然没了错误处理，那么我们以回调实现的错误上报怎么办呢？别忘了，我们还有 try catch, 好了，套上他们就可以完成错误捕获了：

```javascript
    try {
        this.data = yield User.find({
            uid: '545183867'
        });
        
    } catch (e) {
        console.log(e);
    }
```

以上是 Mongoose 与 KOA 框架结合的一个简单入门，因为时间关系就只介绍到这里了，希望能对 mongoose 新手有所帮助。


<!-- {% endraw %} - for jekyll -->