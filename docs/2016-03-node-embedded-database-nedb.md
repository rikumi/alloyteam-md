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

    net stop MongoDB
     
    sc delete MongoDB

NeDB  

=======

1、安装模块

    npm install nedb --save

2、使用

```javascript
// 加载模块
const nedb = require("nedb");
// 实例化连接对象（不带参数默认为内存数据库）
const db = new nedb({
    filename: "/data/save.db",
    autoload: true,
});
// 插入单项
db.insert(
    {
        name: "tom",
    },
    (err, ret) => {}
);
// 插入多项
db.insert([{ name: "tom" }, { name: "jerry" }], (err, ret) => {});
// 查询单项
db.findOne(
    {
        name: "tom",
    },
    (err, ret) => {}
);
// 查询多项
db.find({
    name: {
        $in: ["tom", "jerry"],
    },
})
    .sort({
        _id: -1,
    })
    .exec((err, ret) => {});
// 更新单项
db.update(
    {
        _id: "1",
    },
    {
        $set: {
            name: "kitty",
        },
    },
    (err, ret) => {}
);
// 更新多项
db.update(
    {},
    {
        $set: {
            name: "kitty",
        },
    },
    {
        multi: true,
    },
    (err, ret) => {}
);
// 删除单项
db.remove(
    {
        _id: "1",
    },
    (err, ret) => {}
);
// 删除多项
db.remove(
    {
        name: "kitty",
    },
    {
        multi: true,
    },
    (err, ret) => {}
);
```

通过对比，嵌入式数据库在使用上的优势一目了然，无需任何数据库服务器，也不用安装、配置、启动一个数据库服务，而且 NeDB 的 API 抽取了 MongoDB 常用的一些接口，在用法上大同小异，性能也不错。如果项目使用 Node 实现，并且存储数据量不大，又熟悉 MongoDB 语法，那么，NeDB 就值得一用。详细用法请参照官方文档或下方中文翻译文档。

注：对于习惯了关系型数据库的开发人员来说，有些术语以及坑需要重申一下：

1、“表” 对应 “ 集合 (collection)”，“ 行” 对应 “ 文档（document）”，一个 database 中可以有多个 collection，一个 collection 中又可以有多个 document；

2、NeDB 默认 utf-8 编码；

3、严格区分大小写，比如查询 db.find ({"name":"tom"}) 和 db.find ({"Name":"tom"}) 并不是用的同一字段做的条件；

如果您在使用过程中遇到其他问题，可以留言，我们一起补充。

四、选择  

=======

之所以写该节，是因为本文介绍 NeDB，但并不是推荐 NeDB。选取什么样的数据库主要取决于项目以及个人情感。由于涉及到 SQL 数据库与 NoSQL 数据库的概念，所以先从大的方面简单说一下，然后再介绍 Node 嵌入式数据库。

**先简单回顾下数据库的分类。**

数据库通常分为层次式数据库、网络式数据库和关系式数据库三种。而不同的数据库是按不同的数据结构来联系和组织的。在当今的互联网中，最常见的数据库模型主要有两种：关系型数据库和非关系型数据库。

关系型数据库  

=========

关系型数据库模型是把复杂的数据结构归结为简单的二元关系（即二维表格形式）。在关系型数据库中，对数据的操作几乎全部建立在一个或多个关系表格上，通过对这些关联的表格分类、合并、连接或选取等运算来实现数据库的管理。主流关系型数据库有 Oracle、MySQL、MariaDB、SqlServer、Access、PostgreSQL、DB2 等。其中个人感觉 PostgreSQL 功能十分强大，虽是关系型数据库，但支持 json 和 Hstore 字段，兼有事务和文档特性，只是性能就差了点。

非关系型数据库  

==========

NoSQL 意味着 Not only SQL。面对超大规模和高并发的 SNS (社交网络服务) 类型的 web2.0 纯动态网站，传统的关系型数据库显得有些力不从心，比如表的横向扩展等。NoSQL 数据库作为传统关系型数据库的有效补充，在特定的场景下可以发挥出难以想象的高效率和高性能。主流的非关系型数据库分为键值存储数据库 (Memcached、Redis 等)，列存储数据库 (HBase 等)，图形数据库 (Neo4j 等)，面向文档数据库 (MongoDB、CouchDB 等)。

由于 NeDB 属于面向文档数据库，这里提及一下该类数据库，了解其它类型数据库可以自行查询官方文档。面向文档数据库可以看做是键值数据库的一个升级，不但允许键值嵌套，还提高了查询效率。面向文档数据库会将数据以文档形式存储。每个文档都是自包含的数据单元，是一系列数据项的集合。每个数据项都有一个名词与对应值，值既可以是简单的数据类型，如字符串、数字和日期等；也可以是复杂的类型，如有序列表和关联对象。数据存储的最小单位是文档，同一个表中存储的文档属性可以是不同的，数据可以使用 XML、JSON 或 JSONB 等多种形式存储。

**介绍完分类，接下来就简单说一下各自的使用场景。**

RDBMS  

========

特点：

-   提供事务，使两个或两个以上的成功或失败的数据更改作为一个原子单元；
-   高度组织化结构化数据；
-   数据和关系都存储在单独的表中；
-   需要预先定义表模式；
-   鼓励标准化减少数据冗余；
-   支持多表查询；
-   强制数据完整性；
-   严格的一致性；
-   支持扩展（横向扩展有些痛苦）；
-   结构化查询语言（SQL）；
-   诞生 40 年之多，十分成熟，有足够的支持；

从其特点分析，可看出其适合有明确的定义，规范比较明确的项目。比如在线商城和银行系统等。该类系统需要具备强制数据完整性以及事务支持的健壮存储系统。可以试想一下如果去 ATM 机取钱，ATM 机没有吐钱，但是后台数据库已经把钱减掉了，会是一种什么样的体验呢？

NoSQL  

========

特点：

-   Not only SQL；
-   没有声明性查询语言；
-   没有预定义的模式；
-   键 - 值对存储，列存储，文档存储，图形数据库；
-   最终一致性，而非 ACID 属性；
-   非结构化和不可预知的数据；
-   CAP 定理 ；
-   高性能，高可用性和可伸缩性；
-   是一个新的、令人兴奋的技术，并不是十分成熟；

从其特点分析，最适合无固定要求的组织数据。比如社交网络、客户管理和网络监控系统等。

就客户管理系统来说，假如刚开始使用关系型数据库建一个联系人的表，表字段有主键 id、姓名 name、电话 telephone、邮箱 email、地址 address。那么问题来了，现在有联系人有三个电话号码（住宅座机、移动电话、工作电话）需要输入，这时就要考虑单独创建一个 telephone 表，这样就不受限制了，也让我们的数据标准化了。新建 telephone 表结构：联系人 contact_id、号码类型 name、号码 num。email 与 address 也存在同样的问题，address 的情况更加复杂，这里不再展开。对关系型数据库来说，**Schema 是固定不变的**，而我们事先是不能预测所有字段的，比如刚才的联系人表，很快我们会发现当前字段不能满足，比如要添加性别 gender、年龄 age、生日 birthday 等字段，那么最后就导致需要加一个 otherdata 表。**数据又是碎片化的**，当查询一个联系人时，如果该联系人有 3 个电话号码、2 个 email 地址和 5 个地址，那么 SQL 查询需要检查所有表，并将产生 3\*2\*5=30 条结果，使得全文搜索很困难。

面对这种情况，如果选择 NoSQL 数据库，联系人列表将从中受益。数据库将一个联系人的所有数据存储在一个单独的文档里的 contacts 集合里。

```javascript
[
    {
        name: "tom",
        telephone: {
            home: "123456",
            mobile: "123456789",
            work: "1234567890"
        },
        ...
    },
    ...
]
```

如果这时需要添加一些数据，这些数据没有必要应用到之前的联系人，NoSQL 数据库就可以随意添加或移除字段。联系人数据存储在单独的文档中，也使得全文搜索变得简单。

**介绍完 SQL 与 NoSQL 数据库的基本概念，就该回到正题啦，介绍下 Node 嵌入式数据库，SQLite 同样也有 SQL 与 NoSQL 之分。**

Nodejs 可用的 SQLite 有 node-sqlite,node-sqlite3,NeDB,nStore 以及 final-db 等。其中 node-sqlite,node-sqlite3 属于 SQL 数据库，NeDB,nStore 以及 final-db 属于 NoSQL 数据库。如需详细了解各个模块，可以去看相应的官方文档。

其中使用最多的应该算 node-sqlite3 和 NeDB 了，两者的区别很明显，前者是 SQL 数据库，后者是 NoSQL 数据库。另外，sqlite3 相对 NeDB 要重一些，性能也要差一点，使用 SQL 语句失去了 js 直接操作 json 的简便，API 也相对复杂很多。而 NeDB 只提供了基本的 CURD 操作，只能用于小型应用，大场景并不适用，数据加载到内存中进行操作，不适合内存非常紧张的应用，目前作者也没有给出具体的内存控制方法。。

### 五、源码简析

想要更深入的理解 NeDB，就需要了解它是如何实现的。我这里给出一些我阅读源码时记忆比较深刻的几个点。

1、所有改变数据的操作 (indert,update,remove)，都会触发 persistence.persistNewState 方法，比如可以看一下 datastore.js 第 265-268 行的 Datastore.prototype.\_insert 方法。该方法决定数据的去处，如果是当作内存数据库来用，该方法会提前返回，如果是本地文档持久化存储，则会将数据经过 utf-8 编码序列化之后追加到备份数据库的文档中。

2、数据在 model.js 中通过 serialize 方法被序列化，该方法使用 JSON.stringfy 序列化 json 数据，在回调函数中将 undefined 类型值映射为 null，并且使用与 mongoDB 相同的规则 (不能以 "$" 开头，也不能包含 ".") 校验属性的有效性。

3、数据从硬盘上加载到内存时，使用了 async 模块的 waterfall 方法。该方法参数是由方法组成的数组，并且先执行的方法会将执行结果传入下一个方法，方法按顺序执行，并且当其中一个方法报错，就会导致后面的方法不再执行，直接在主方法回调抛出异常。

4、包括当持久层初始化时从磁盘上加载数据在内的所有的操作命令都会通过 Executor 类的实例，将方法传入队列，保证命令可以按序执行（包括同步与异步方法）。

源码并不难理解，通过以上几点，希望可以让大家更容易解读源码。通读 NeDB 的源码，对 Node 异步 I/O 以及基于事件编程的思想会有进一步的认识。

为了方便大家理解，对官方文档做了简单翻译，如有不当的地方希望大家指正，中文 API 文档如下：

### 六、API

**_1、new Datastore(options)_**

**作用：**

初始化一个数据存储，相当于 MongoDB 的一个集合、Mysql 的一张表。

**options 对象配置参数：**

① filename (可选): 数据存储文件路径。如果为空，数据将会自动存储在内存中。注意路径不能以 “~” 结尾。

② inMemoryOnly (可选，默认 false): 数据存储方式。是否只存在于内存中。

③ loadDatabase: 将数据加载到内存中。

④ timestampData (可选，默认 false): 自动生成时间戳，字段为 createdAt 和 updateAt，用来记录文档插入和更新操作的时间点。

⑤ autoload (可选，默认 false): 如果使用 autoload，当数据存储被创建时，数据将自动从文件中加载到内存，不必去调用 loadDatabase。注意所有命令操作只有在数据加载完成后才会被执行。

⑥ onload (可选): 在数据加载完成后被调用，也就是在 loadDatabase 方法调用后触发。该方法有一个 error 参数，如果试用了 autoload，而且没有定义该方法，在数据加载过程中出错将默认会抛出该错误。

⑦ afterSerialization (可选): 在数据被序列化成字符串之后和被写入磁盘前，可以使用该方法对数据进行转换。比如可以做一些数据加密工作。该方法入参为一个字符串 (绝对不能含有字符 “\\n”，否则数据会丢失)，返回转换后的字符串。

⑧ beforeDeserialization (可选): 与 afterSerialization 相反。两个必须成对出现，否则会引起数据丢失，可以理解为一个加密解密的过程。

⑨ corruptAlertThreshold (可选): 默认 10%, 取值在 0-1 之间。如果数据文件损坏率超过这个百分比，NeDB 将不会启动。取 0，意味着不能容忍任何数据损坏；取 1，意味着忽略数据损坏问题。

⑩ compareStrings (可选): compareStrings (a, b) 比较两个字符串，返回 - 1、0 或者 1。如果被定义，将会覆盖默认的字符串比较方法，用来兼容默认方法不能比较非 US 字符的缺点。

注：如果使用本地存储，而且没有配置 autoload 参数，需要手动调用 loadDatabase 方法，所有操作 (insert, find, update, remove) 在该方法被调用前都不会执行。还有就是，如果 loadDatabase 失败，所有命令也将不会执行。

**示例**

```javascript
// 示例 1: 内存数据库(没有必要调用loadDatabase方法)
var Datastore = require("nedb"),
    db = new Datastore();
// 示例 2: 本地存储需要手动调用loadDatabase方法
var Datastore = require("nedb"),
    db = new Datastore({ filename: "path/to/datafile" });
db.loadDatabase(function (err) {
    // 回调函数(可选)
    // Now commands will be executed
});
// 示例 3: 带有autoload配置项的本地存储
var Datastore = require("nedb"),
    db = new Datastore({ filename: "path/to/datafile", autoload: true });
// You can issue commands right away
// 示例 4: 创建多个数据存储
db = {};
db.users = new Datastore("path/to/users.db");
db.robots = new Datastore("path/to/robots.db");
// 如果不配置autoload，需要加载数据库(该方法是异步的)
db.users.loadDatabase();
db.robots.loadDatabase();
```

**_2、db.insert(doc, callback)_**

**作用：**

插入文档数据 (文档相当于 mysql 表中的一条记录)。如果文档不包含\_id 字段，NeDB 会自动生成一个，该字段是 16 个字符长度的数字字符串。该字段一旦确定，就不能被更改。

**参数：**

doc: 支持 String, Number, Boolean, Date, null, array 以及 object 类型。如果该字段是 undefined 类型，将不会被保存，这里和 MongoDB 处理方式有点不同，MongoDB 会将 undefined 转换为 null 进行存储。字段名称不能以 "$" 开始，也不能包含 "."。

callback (可选): 回调函数，包含参数 err 以及 newDoc，err 是报错，newDoc 是新插入的文档，包含它的\_id 字段。

**示例**

```javascript
var doc = {
    hello: "world",
    n: 5,
    today: new Date(),
    nedbIsAwesome: true,
    notthere: null,
    notToBeSaved: undefined, // 该字段不会被保存
    fruits: ["apple", "orange", "pear"],
    infos: { name: "nedb" },
};
db.insert(doc, function (err, newDoc) {
    // Callback is optional
    // newDoc is the newly inserted document, including its _id
    // newDoc has no key called notToBeSaved since its value was undefined
});
// 使用array，实现批量插入。一旦其中一个操作失败，所有改变将会回滚。
db.insert([{ a: 5 }, { a: 42 }], function (err, newDocs) {
    // Two documents were inserted in the database
    // newDocs is an array with these documents, augmented with their _id
});
// 如果a字段有唯一性约束，该操作将会执行失败。
db.insert([{ a: 5 }, { a: 42 }, { a: 5 }], function (err) {
    // err is a 'uniqueViolated' error
    // The database was not modified
});
```

**_3、db.find(query, callback)_**

**作用：**

查询符合条件的文档集。

**参数：**

query： object 类型，查询条件。支持使用比较运算符 ($lt, $lte, $gt, $gte, $in, $nin, $ne), 逻辑运算符 ($or, $and, $not, $where), 正则表达式进行查询。

callback (可选): 回调函数，包含参数 err 以及 docs，err 是报错，docs 是查询到的文档集。

**示例：**

```javascript
// 数据存储集合
 
// { _id: 'id1', planet: 'Mars', system: 'solar', inhabited: false, satellites: ['Phobos', 'Deimos'] }
// { _id: 'id2', planet: 'Earth', system: 'solar', inhabited: true, humans: { genders: 2, eyes: true } }
// { _id: 'id3', planet: 'Jupiter', system: 'solar', inhabited: false }
// { _id: 'id4', planet: 'Omicron Persei 8', system: 'futurama', inhabited: true, humans: { genders: 7 } }
// { _id: 'id5', completeData: { planets: [ { name: 'Earth', number: 3 }, { name: 'Mars', number: 2 }, { name: 'Pluton', number: 9 } ] } }
 
// 示例1： 基本查询。可以使用正则表达式匹配字符串。使用“.”匹配对象或者数组里面的元素。
 
// 单字段查询
db.find({ system: 'solar' }, function (err, docs) {
  // docs is an array containing documents Mars, Earth, Jupiter
  // If no document is found, docs is equal to []
});
 
// 正则表达式查询
db.find({ planet: /ar/ }, function (err, docs) {
  // docs contains Mars and Earth
});
 
// 多条件查询
db.find({ system: 'solar', inhabited: true }, function (err, docs) {
  // docs is an array containing document Earth only
});
 
// 根据对象属性查询
db.find({ "humans.genders": 2 }, function (err, docs) {
  // docs contains Earth
});
 
// 根据数组对象属性查询
db.find({ "completeData.planets.name": "Mars" }, function (err, docs) {
  // docs contains document 5
});
 
db.find({ "completeData.planets.name": "Jupiter" }, function (err, docs) {
  // docs is empty
});
 
db.find({ "completeData.planets.0.name": "Earth" }, function (err, docs) {
  // docs contains document 5
  // If we had tested against "Mars" docs would be empty because we are matching against a specific array element
});
 
 
// 对象深度比较查询，不要与"."使用混淆
db.find({ humans: { genders: 2 } }, function (err, docs) {
  // docs is empty, because { genders: 2 } is not equal to { genders: 2, eyes: true }
});
 
// 查询所有结果集
db.find({}, function (err, docs) {
});
 
// 查询某一个文档
db.findOne({ _id: 'id1' }, function (err, doc) {
  // doc is the document Mars
  // If no document is found, doc is null
});
 
 
// 示例2： {field: {$op: value}} ($op代表任意比较运算符)
// $lt, $lte: 小于，小于等于
// $gt, $gte: 大于，大于等于
// $in: 属于
// $ne, $nin: 不等于，不属于
// $exists: 取值为true或者false，用于检测文档是否具有某一字段
// $regex: 检测字符串是否与正则表达式相匹配
 
// $lt, $lte, $gt and $gte 只能用于数字和字符串类型
db.find({ "humans.genders": { $gt: 5 } }, function (err, docs) {
  // docs contains Omicron Persei 8, whose humans have more than 5 genders (7).
});
 
// 当进行字符串比较的时候，将使用字典序。
db.find({ planet: { $gt: 'Mercury' }}, function (err, docs) {
  // docs contains Omicron Persei 8
})
 
// Using $in. $nin is used in the same way
db.find({ planet: { $in: ['Earth', 'Jupiter'] }}, function (err, docs) {
  // docs contains Earth and Jupiter
});
 
// Using $exists
db.find({ satellites: { $exists: true } }, function (err, docs) {
  // docs contains only Mars
});
 
// Using $regex with another operator
db.find({ planet: { $regex: /ar/, $nin: ['Jupiter', 'Earth'] } }, function (err, docs) {
  // docs only contains Mars because Earth was excluded from the match by $nin
});
 
 
// 示例3： 当文档中有一个字段是数组，NeDB将首先判断查询值是否为数组，如果是数组的话将执行精确查找，然后再去判断是否存在数组比较方法(现在只支持$size和$elemMatch)。如果都没有，将会对所有元素进行查询。
// $size: 匹配数组的大小
// $elemMatch: 匹配至少一个数组元素
 
// 精确查找
db.find({ satellites: ['Phobos', 'Deimos'] }, function (err, docs) {
  // docs contains Mars
})
db.find({ satellites: ['Deimos', 'Phobos'] }, function (err, docs) {
  // docs is empty
})
 
// 使用数组比较方法
// $elemMatch 运算符将匹配数组中满足所有条件的元素
db.find({ completeData: { planets: { $elemMatch: { name: 'Earth', number: 3 } } } }, function (err, docs) {
  // docs contains documents with id 5 (completeData)
});
 
db.find({ completeData: { planets: { $elemMatch: { name: 'Earth', number: 5 } } } }, function (err, docs) {
  // docs is empty
});
 
// 在$elemMatch中使用比较运算符
db.find({ completeData: { planets: { $elemMatch: { name: 'Earth', number: { $gt: 2 } } } } }, function (err, docs) {
  // docs contains documents with id 5 (completeData)
});
 
// 注意不能使用嵌套的运算符, e.g. { $size: { $lt: 5 } } 将会抛出异常
db.find({ satellites: { $size: 2 } }, function (err, docs) {
  // docs contains Mars
});
 
db.find({ satellites: { $size: 1 } }, function (err, docs) {
  // docs is empty
});
 
// If a document's field is an array, matching it means matching any element of the array
db.find({ satellites: 'Phobos' }, function (err, docs) {
  // docs contains Mars. Result would have been the same if query had been { satellites: 'Deimos' }
});
 
// This also works for queries that use comparison operators
db.find({ satellites: { $lt: 'Amos' } }, function (err, docs) {
  // docs is empty since Phobos and Deimos are after Amos in lexicographical order
});
 
// This also works with the $in and $nin operator
db.find({ satellites: { $in: ['Moon', 'Deimos'] } }, function (err, docs) {
  // docs contains Mars (the Earth document is not complete!)
});
 
// 示例4： 逻辑运算符 $or, $and, $not, $where
// $or, $and: 并集，交集 { $op: [query1, query2, ...] }
// $not: 取非 { $not: query }
// $where: 条件 { $where: function () { /* object is "this", return a boolean */ } }
 
db.find({ $or: [{ planet: 'Earth' }, { planet: 'Mars' }] }, function (err, docs) {
  // docs contains Earth and Mars
});
 
db.find({ $not: { planet: 'Earth' } }, function (err, docs) {
  // docs contains Mars, Jupiter, Omicron Persei 8
});
 
db.find({ $where: function () { return Object.keys(this) > 6; } }, function (err, docs) {
  // docs with more than 6 properties
});
 
// You can mix normal queries, comparison queries and logical operators
db.find({ $or: [{ planet: 'Earth' }, { planet: 'Mars' }], inhabited: true }, function (err, docs) {
  // docs contains Earth
});
 
// 示例5: Projections
// 在第二个参数传入projections对象，来规定返回字段。比如： {a:1, b:1}指定只返回a和b字段，{a:0, b:0}指定省略a和b这两个字段。
// _id默认返回，不需要返回设置_id: 0
 
// Same database as above
 
// Keeping only the given fields
db.find({ planet: 'Mars' }, { planet: 1, system: 1 }, function (err, docs) {
  // docs is [{ planet: 'Mars', system: 'solar', _id: 'id1' }]
});
 
// Keeping only the given fields but removing _id
db.find({ planet: 'Mars' }, { planet: 1, system: 1, _id: 0 }, function (err, docs) {
  // docs is [{ planet: 'Mars', system: 'solar' }]
});
 
// Omitting only the given fields and removing _id
db.find({ planet: 'Mars' }, { planet: 0, system: 0, _id: 0 }, function (err, docs) {
  // docs is [{ inhabited: false, satellites: ['Phobos', 'Deimos'] }]
});
 
// Failure: using both modes at the same time
db.find({ planet: 'Mars' }, { planet: 0, system: 1 }, function (err, docs) {
  // err is the error message, docs is undefined
});
 
// You can also use it in a Cursor way but this syntax is not compatible with MongoDB
db.find({ planet: 'Mars' }).projection({ planet: 1, system: 1 }).exec(function (err, docs) {
  // docs is [{ planet: 'Mars', system: 'solar', _id: 'id1' }]
});
 
// Project on a nested document
db.findOne({ planet: 'Earth' }).projection({ planet: 1, 'humans.genders': 1 }).exec(function (err, doc) {
  // doc is { planet: 'Earth', _id: 'id2', humans: { genders: 2 } }
});
 
// 示例6：排序和分页
 
// 文档集
// doc1 = { _id: 'id1', planet: 'Mars', system: 'solar', inhabited: false, satellites: ['Phobos', 'Deimos'] }
// doc2 = { _id: 'id2', planet: 'Earth', system: 'solar', inhabited: true, humans: { genders: 2, eyes: true } }
// doc3 = { _id: 'id3', planet: 'Jupiter', system: 'solar', inhabited: false }
// doc4 = { _id: 'id4', planet: 'Omicron Persei 8', system: 'futurama', inhabited: true, humans: { genders: 7 } }
 
// No query used means all results are returned (before the Cursor modifiers)
db.find({}).sort({ planet: 1 }).skip(1).limit(2).exec(function (err, docs) {
  // docs is [doc3, doc1]
});
 
// You can sort in reverse order like this
db.find({ system: 'solar' }).sort({ planet: -1 }).exec(function (err, docs) {
  // docs is [doc1, doc3, doc2]
});
 
// You can sort on one field, then another, and so on like this:
db.find({}).sort({ firstField: 1, secondField: -1 }) ...   // You understand how this works!
```

**_4、db.findOne(query, callback)_**

**作用：**

查询符合条件的一个文档。与 db.find 使用相同。

**_5、db.update(query, update, options, callback)_**

**作用：**

根据 update 参数的规则，更新匹配到 query 的结果集。

**参数：**

query: 与 find 和 findOne 中 query 参数的用法一致

update: 指定文档更改规则。该参数可以是一个新的文档，也可以是一套修饰符，两者不能同时使用。使用修饰符时，如果需要更改的字段不存在，将会自动创建。可用的修饰符有 $set (改变字段值), $unset (删除某一字段), $inc (增加某一字段), $min/$max (改变字段值，传入值需要小于 / 大于当前值), 还有一些用在数组上的修饰符，$push, $pop, $addTopSet, $pull, $each, $slice，具体用法如下示例。

options: object 类型。muti (默认 false)，是否允许修改多条文档；upsert (默认为 false)，如果 query 没有匹配到结果集，有两种情况需要考虑，一个是 update 是一个简单的对象 (不包含任何修饰符)，另一种情况是带有修饰符，对第一种情况会直接将该文档插入，对第二种情况会将通过修饰符更改后的文档插入；

callback (可选): 参数 (err, numAffected, affectedDocuments, upsert)。numAffected：被影响的文档个数；affectedDocuments：更新后的文档。

注意：\_id 不能被修改

**示例：**

```javascript
// 文档集
// { _id: 'id1', planet: 'Mars', system: 'solar', inhabited: false }
// { _id: 'id2', planet: 'Earth', system: 'solar', inhabited: true }
// { _id: 'id3', planet: 'Jupiter', system: 'solar', inhabited: false }
// { _id: 'id4', planet: 'Omicron Persia 8', system: 'futurama', inhabited: true }
 
// 用一个文档替换另一个文档
db.update({ planet: 'Jupiter' }, { planet: 'Pluton'}, {}, function (err, numReplaced) {
  // numReplaced = 1
  // The doc #3 has been replaced by { _id: 'id3', planet: 'Pluton' }
  // Note that the _id is kept unchanged, and the document has been replaced
  // (the 'system' and inhabited fields are not here anymore)
});
 
// 设定一个已存字段的值
db.update({ system: 'solar' }, { $set: { system: 'solar system' } }, { multi: true }, function (err, numReplaced) {
  // numReplaced = 3
  // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
});
 
// 设定一个不存在字段的值
db.update({ planet: 'Mars' }, { $set: { "data.satellites": 2, "data.red": true } }, {}, function () {
  // Mars document now is { _id: 'id1', system: 'solar', inhabited: false
  //                      , data: { satellites: 2, red: true }
  //                      }
  // Not that to set fields in subdocuments, you HAVE to use dot-notation
  // Using object-notation will just replace the top-level field
  db.update({ planet: 'Mars' }, { $set: { data: { satellites: 3 } } }, {}, function () {
    // Mars document now is { _id: 'id1', system: 'solar', inhabited: false
    //                      , data: { satellites: 3 }
    //                      }
    // You lost the "data.red" field which is probably not the intended behavior
  });
});
 
// 删除一个字段
db.update({ planet: 'Mars' }, { $unset: { planet: true } }, {}, function () {
  // Now the document for Mars doesn't contain the planet field
  // You can unset nested fields with the dot notation of course
});
 
// 设置upsert
db.update({ planet: 'Pluton' }, { planet: 'Pluton', inhabited: false }, { upsert: true }, function (err, numReplaced, upsert) {
  // numReplaced = 1, upsert = { _id: 'id5', planet: 'Pluton', inhabited: false }
  // A new document { _id: 'id5', planet: 'Pluton', inhabited: false } has been added to the collection
});
 
// If you upsert with a modifier, the upserted doc is the query modified by the modifier
// This is simpler than it sounds :)
db.update({ planet: 'Pluton' }, { $inc: { distance: 38 } }, { upsert: true }, function () {
  // A new document { _id: 'id5', planet: 'Pluton', distance: 38 } has been added to the collection  
});
 
// If we insert a new document { _id: 'id6', fruits: ['apple', 'orange', 'pear'] } in the collection,
// let's see how we can modify the array field atomically
 
// $push inserts new elements at the end of the array
db.update({ _id: 'id6' }, { $push: { fruits: 'banana' } }, {}, function () {
  // Now the fruits array is ['apple', 'orange', 'pear', 'banana']
});
 
// $pop removes an element from the end (if used with 1) or the front (if used with -1) of the array
db.update({ _id: 'id6' }, { $pop: { fruits: 1 } }, {}, function () {
  // Now the fruits array is ['apple', 'orange']
  // With { $pop: { fruits: -1 } }, it would have been ['orange', 'pear']
});
 
// $addToSet adds an element to an array only if it isn't already in it
// Equality is deep-checked (i.e. $addToSet will not insert an object in an array already containing the same object)
// Note that it doesn't check whether the array contained duplicates before or not
db.update({ _id: 'id6' }, { $addToSet: { fruits: 'apple' } }, {}, function () {
  // The fruits array didn't change
  // If we had used a fruit not in the array, e.g. 'banana', it would have been added to the array
});
 
// $pull removes all values matching a value or even any NeDB query from the array
db.update({ _id: 'id6' }, { $pull: { fruits: 'apple' } }, {}, function () {
  // Now the fruits array is ['orange', 'pear']
});
db.update({ _id: 'id6' }, { $pull: { fruits: $in: ['apple', 'pear'] } }, {}, function () {
  // Now the fruits array is ['orange']
});
 
// $each can be used to $push or $addToSet multiple values at once
// This example works the same way with $addToSet
db.update({ _id: 'id6' }, { $push: { fruits: { $each: ['banana', 'orange'] } } }, {}, function () {
  // Now the fruits array is ['apple', 'orange', 'pear', 'banana', 'orange']
});
 
// $slice can be used in cunjunction with $push and $each to limit the size of the resulting array.
// A value of 0 will update the array to an empty array. A positive value n will keep only the n first elements
// A negative value -n will keep only the last n elements.
// If $slice is specified but not $each, $each is set to []
db.update({ _id: 'id6' }, { $push: { fruits: { $each: ['banana'], $slice: 2 } } }, {}, function () {
  // Now the fruits array is ['apple', 'orange']
});
 
// $min/$max to update only if provided value is less/greater than current value
// Let's say the database contains this document
// doc = { _id: 'id', name: 'Name', value: 5 }
db.update({ _id: 'id1' }, { $min: { value: 2 } }, {}, function () {
  // The document will be updated to { _id: 'id', name: 'Name', value: 2 }
});
 
db.update({ _id: 'id1' }, { $min: { value: 8 } }, {}, function () {
  // The document will not be modified
});
```

**_6、db.remove(query, options, callback)_**

**作用：**

根据 options 配置删除所有 query 匹配到的文档集。

**参数：**

query: 与 find 和 findOne 中 query 参数的用法一致

options: 只有一个可用。muti (默认 false)，允许删除多个文档。

callback: 可选，参数: err, numRemoved

**示例：**

```javascript
// 文档集
// { _id: 'id1', planet: 'Mars', system: 'solar', inhabited: false }
// { _id: 'id2', planet: 'Earth', system: 'solar', inhabited: true }
// { _id: 'id3', planet: 'Jupiter', system: 'solar', inhabited: false }
// { _id: 'id4', planet: 'Omicron Persia 8', system: 'futurama', inhabited: true }
// 删除一条记录
// options set to {} since the default for multi is false
db.remove({ _id: "id2" }, {}, function (err, numRemoved) {
    // numRemoved = 1
});
// 删除多条记录
db.remove({ system: "solar" }, { multi: true }, function (err, numRemoved) {
    // numRemoved = 3
    // All planets from the solar system were removed
});
// 删除所有记录
db.remove({}, { multi: true }, function (err, numRemoved) {});
```

**_7、db.ensureIndex(options, callback)_**

**作用：**

NeDB 支持索引。索引可以提高查询速度以及保证字段的唯一性。索引可以用在任何字段，包括嵌套很深的字段。目前，索引只能用来加速基本查询以及使用 $in, $lt, $lte, $gt 和 $gte 运算符的查询，如上 find 接口中示例所示。保证索引不为数组对象。方法可以在任何时候被调用，推荐在应用启动时就调用 (该方法是同步的，为 1000 个文档添加索引仅需 35ms)。

**参数：**

fieldName (必须): 索引字段，使用 “.” 给嵌套的字段加索引。

unique (可选，默认 false): 字段唯一性约束。注意：唯一性约束会增加为两个文档中没有定义的字段添加索引的错误。

sparse (可选，默认 false): 不能为没有定义的字段加索引。如果接受给多个文档中没有定义的字段添加索引，给需要该配置参数与 unique 一起使用。

expireAfterSeconds (可选，秒数): TTL 索引，设置自动过期时间。

删除索引： db.removeIndex (fieldName, cb)

注意：\_id 字段会自动加索引和唯一性约束，不必再为它使用 ensureIndex。如果使用本地存储，索引也将保存在数据文件中，当第二次加载数据库时，索引也将自动被添加。如果加载一个已经有索引的数据库，删除索引将不起任何作用。

```javascript
db.ensureIndex({ fieldName: "somefield" }, function (err) {
    // If there was an error, err is not null
});
// 对索引设置唯一性约束
db.ensureIndex({ fieldName: "somefield", unique: true }, function (err) {});
// Using a sparse unique index
db.ensureIndex(
    { fieldName: "somefield", unique: true, sparse: true },
    function (err) {}
);
// 使用唯一性约束制造错误，查看err的格式
db.insert({ somefield: "nedb" }, function (err) {
    // err is null
    db.insert({ somefield: "nedb" }, function (err) {
        // err is { errorType: 'uniqueViolated'
        //        , key: 'name'
        //        , message: 'Unique constraint violated for key name' }
    });
});
// 移除somefield字段的索引
db.removeIndex("somefield", function (err) {});
// Example of using expireAfterSeconds to remove documents 1 hour
// after their creation (db's timestampData option is true here)
db.ensureIndex({ fieldName: "createdAt", expireAfterSeconds: 3600 }, function (
    err
) {});
// You can also use the option to set an expiration date like so
db.ensureIndex(
    { fieldName: "expirationDate", expireAfterSeconds: 0 },
    function (err) {
        // Now all documents will expire when system time reaches the date in their
        // expirationDate field
    }
);
```

**_8、db.count(query, callback)_**

**作用：**

计数。与 find 用法相同。

**示例：**

```javascript
// Count all planets in the solar system
db.count({ system: "solar" }, function (err, count) {
    // count equals to 3
});
// Count all documents in the datastore
db.count({}, function (err, count) {
    // count equals to 4
});
```

**_9、db.persistence.compactDatafile_**

**作用：**

为了性能考虑，NeDB 存储使用 append-only 格式，意味着所有的更改和删除操作其实都是被添加到了文件末尾。每次加载数据库时，数据库会自动被压缩，才能拿到规范的文档集。

也可以手动调用压缩方法 db.persistence.compactDatafile (该方法没有参数)。函数内部有队列机制，保证命令按顺序执行。执行完成后，会触发 compaction.done 事件。

也可以设置自动压缩方法 db.persistence.setAutocompactionInterval (interval) 来定时执行。interval 是毫秒级别 (大于 5000ms)。停止自动压缩使用方法 db.persistence.stopAutocompaction ()。

压缩会花费一些时间 (在普通机器上，5w 条记录花费 130ms 处理，并不会耗费太久)。在压缩执行期间，其他操作将不能执行，所以大部分项目不需要使用它。

假设不受 corruptAlertThreshold 参数的限制，压缩将会把损坏的记录全部移除掉。

压缩会强制系统将数据写入磁盘，这就保证了服务崩溃不会引起数据的全部丢失。最坏的情况就是崩溃发生在两个压缩同步操作之间，会导致全部数据的丢失。

性能  

=====

在普通机器上，对于 1 万条记录

NeDB 吞吐量 (带索引)：

Insert: 5950 ops

Find: 25440 ops

Update: 4490 ops

Remove: 6620 ops

<!-- {% endraw %} - for jekyll -->