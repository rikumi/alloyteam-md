---
title: 【Hour 级学习成本】Javascript 单元测试工具 “抹茶”——Mocha 和 Chai
date: 2013-12-04
author: TAT.bizai
source_link: http://www.alloyteam.com/2013/12/hour-class-learning-costs-javascript-unit-testing-tool-matcha-mocha-and-chai/
---

<!-- {% raw %} - for jekyll -->

# 基本介绍

mocha 是一个 javascript 的测试框架，chai 是一个断言库，两者搭配使用更佳，所以合称 “抹茶”（其实 mocha 是咖啡）。“抹茶” 特点是： 简单，Hour 级学习成本，node 和浏览器都可运行，有趣。

关于吹水，充字数的内容我放到了 blog 最后，因为 “抹茶” 上手非常的简单，看完 blog 再阅览一下官网就可以实际动手敲代码了，不足一个小时就可以基本掌握他们了。

Mocha  
<http://visionmedia.github.io/mocha/>

[![mocha](http://www.alloyteam.com/wp-content/uploads/2013/12/mocha.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/mocha.png)

Mocha 是一个功能丰富的 JavaScript 测试框架，他可以跑在 node 和浏览器上，使异步测试变得简单和有趣。Mocha 在运行测试用例过程中，当捕获到错误时，依旧能够灵活地运行精确的报告。

Chai 断言库  
<http://chaijs.com/>

[![chai](http://www.alloyteam.com/wp-content/uploads/2013/12/chai.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/chai.png)

Chai 是一个 BDD/TDD 模式的断言库，可以再 node 和浏览器环境运行，可以高效的和任何 js 测试框架搭配使用。

BDD，行为驱动开发（注重测试逻辑），TDD 是测试驱动开发（注重输出结果）。我们这里的例子都以使用 BDD，想扩展这方面知识同学可以搜索更多资料查阅。

二者都可以运行在 node 和浏览器上，所以后台 node 单元测试，和前端逻辑 js（甚至测试 css 显示）都可以使用。

# 在 node 环境上安装使用

    # npm install -g mocha
    # npm install chai

## Mocha

* * *

###  start

这是官网上的一段示例代码

```javascript
var assert = require("assert");
describe("Array", function () {
    describe("#indexOf()", function () {
        it("should return -1 when the value is not present", function () {
            assert.equal(-1, [1, 2, 3].indexOf(5));
            assert.equal(-1, [1, 2, 3].indexOf(0));
        });
    });
});
```

如果我们的测试文件名字为 test.js，运行 mocha 就

    # mocha test

上面的代码有三个陌生的方法，也正是这三个基本方法构成 mocha 测试框架的基本使用方式。

**describe（moduleName, function）**  
顾名思义，描述一句测试用例是否正确。首先 describe 是可以嵌套的，多个 describe 嵌套的使用用于描述模块下的子模块的关系，上面的代码的意思就是测试 Array 这个类下面的 #indexOf () 方法，moduleName 是可以随便定义的，即是是中文也可以。 “#” 的使用也是一般约定，不喜欢你也会换个或不用也可以。

**it(info, function)**  
真正的测试语句是在 it 函数的 function 里面，info 也是一句描述性的说明，看得懂就行。function 里面的断言决定这条测试是否正确。如果 fail 的话控制台会把 log 打印出来。一个 it 对应一个测试用例，里面可以有多条断言或一条断言。

**assert.equal（exp1,exp2）**  
mocha 的断言语句，exp1 是否等于 exp2. 其他更多用法可以查考 mocha 的文档，但是这里一般我们使用 chai 来作为断言库。更加友好的实现我们的断言方式。

### 异步代码测试

上面的官方例子是同步的代码测试，下面看看异步代码如何测试

```javascript
describe("User", function () {
    describe("#save()", function () {
        it("should save without error", function (done) {
            var user = new User("Luna");
            user.save(done);
        });
    });
});
```

user.save（）是要链接数据库，是个异步操作。

跟第一段代码不同，使用了**done**。done 表示你回调的最深处，也是嵌套回调函数的末端。done () 函数如果接受一个 error 的 callback，这句测试为 fail。

注意一个 it 里面应该只能有一个 done，如果非要有两个异步分叉，那建议用两个 it。

### before(), after(),beforeEach(),afterEach()

介绍了异步的单元测试，还有一些列方便的辅助方法，方法非常简单明了，我贴个代码出来，大家看看就知道什么意思了。

```javascript
describe("Connection", function () {
    var db = new Connection(),
        tobi = new User("tobi"),
        loki = new User("loki"),
        jane = new User("jane");
    beforeEach(function (done) {
        db.clear(function (err) {
            if (err) return done(err);
            db.save([tobi, loki, jane], done);
        });
    });
    describe("#find()", function () {
        it("respond with matching records", function (done) {
            db.find({ type: "User" }, function (err, res) {
                if (err) return done(err);
                res.should.have.length(3);
                done();
            });
        });
    });
});
```

### Pending

```javascript
describe("Array", function () {
    describe("#indexOf()", function () {
        it("should return -1 when the value is not present", function () {});
    });
});
```

就是 it 里面的 function 留空。mocha 默认会 pass 这条测试。这样的用法其实相当于，某项目负责人定义好了要测试什么内容，之后由相应的开发去实现具体。

### only 和 skip

```javascript
describe("Array", function () {
    describe("#indexOf()", function () {
        it.only("should return -1 unless present", function () {});
        it("should return the index when present", function () {});
    });
});
```

使用了 only 之后，这条 descibe 就只执行 only，其他的忽略。skip 作用相反，其他会执行，自己会被忽略。两者一起，自己想想都知道。

mocha 这个测试框架大体都介绍得差不多，最后你会惊奇的发现！！！ 控制台输出的内容好丑啊！！为什么？？为什么？因为你是个没有 Mac 的死穷吊！

如果想输出测试结果好看点，可以 - R 指令来选择一些输出样式。个人建议这样运行【mocha -R spec yourFile】（为什么我知道？不要说了，泪水啊～～）

## **Chai**

* * *

 上面说的都是 mocha 的测试框架，我们是不是漏了 Chai，结合 Chai 非常非常的简单。

chai 这里我们只介绍 BDD 模式的 should 风格。来看一段官网代码

```javascript
var should = require("chai").should(), //actually call the the function
    foo = "bar",
    beverages = { tea: ["chai", "matcha", "oolong"] };
foo.should.be.a("string");
foo.should.equal("bar");
foo.should.have.length(3);
beverages.should.have.property("tea").with.length(3);
```

should 的风格非常接近自然语言。bizai.should.be.a ('HandsomeBody') = bizai 应该是个帅哥。

这样的 should 断言风格去代替 mocha 的 assert。这样两个结合起来，更加友好和方便。

-   should.exist
-   should.not.exist
-   should.equal
-   should.not.equal
-   should.Throw
-   should.not.Throw

剩下需要扩展学习的可以去官网详细学习。

# 浏览器上使用 “抹茶”

首先需要下载 mocha.js，chai.js，mocha.css 三个文件。

把三者引入，进行一些设置， 看代码即可。

```html
&lt;!doctype html>
&lt;html lang="en">
&lt;head>
&lt;meta charset="UTF-8">
&lt;title>Unit Testing with Mocha and Chai&lt;/title>
 
&lt;!-- Mocha -->
&lt;link rel="stylesheet" href="lib/mocha.css">
&lt;script src="lib/mocha.js">&lt;/script>
&lt;script>mocha.setup('bdd'); //设置单元测试模式为BDD模式 &lt;/script>
 
&lt;!-- Chai -->
&lt;script src="lib/chai.js">&lt;/script>
&lt;script>chai.Should(); //设置断言模式为 Should模式 &lt;/script>
 
&lt;/head>
&lt;body>
 
&lt;div id="mocha">&lt;/div>
&lt;!--  这里可以引入你的测试js，或直接写在下面 -->
&lt;script>
describe('My first Unit Test',function(){
    before(function(){
        console.log('AAAAAAAa')
    });
    it('should return true for array',function(){
        var a = [],b = {};
        (a instanceof Array).should.equal(true);
        (typeof b == 'object').should.equal(true);
    });
    it('should pending when the value is not present',function(){
    });
    it('should pending when the value is undfined');
 
});
 
//或者...root级别的hooks..在全局状态下..每次的测试用例都执行了(以it为单位)..
beforeEach(function(){
    console.log('before every test');
});
 
&lt;/script>
&lt;script>
mocha.run();  //  注意不要漏了这个，在js最后启动mocha
&lt;/script>
 
&lt;/body>
&lt;/html>
```

# 反思

Javascript 单元测试，我们真的需要吗？

单元测试，又名模块测试，是开发者在开发过程中，对项目中某个单元模块内部逻辑的检验。这在后台开发中颇为常见，但是在前端领域较为少见。如果我告诉你单元测试什么什么优点啊，你肯定第一时间反驳的第一句就是 “花时间写这玩意，有必要吗？” 基于 web 的特性就是快速迭代，一个项目需求时间往往都是快速的，完全没有多余的时间给你去写测试用例，但对于大型的或者需求变更频繁的项目，单元测试就能体验出他的价值。

“怎么单元测试写起来这么麻烦”

\---- 说明项目模块之间存在耦合度高，依赖性强的问题。

“怎么要写这么长的测试代码啊”

\---- 这是一劳永逸的，并且每次需求变更后，你都可通过单元测试来验证，逻辑代码是否依旧正确。

“我的模块没问题的，是你的模块出了问题”

\---- 程序中每一项功能我们都用测试来验证的它的正确性，快速定位出现问题的某一环。

“上次修复的 bug 怎么又出现了”

\--- 单元测试能够避免代码出现回归，编写完成后，可快速运行测试。

接触 "抹茶" 的起因是项目驱动需要写些单元测试用例，knight 大哥推荐了 Mocha 和 Chai 组合来实现我们单元测试的需求。Javascripte 单元测试工具比较著名的还有 Qunit，JsUnit，JsTestDriver 等等，笔者也是刚刚接触，上面的也是基础学习的分享，不敢乱下定论哪款框架好，花时间去研究哪款框架好用，不如试试 “抹茶” 这种 Hour 级的学习成本，值得你们尝试学习。


<!-- {% endraw %} - for jekyll -->