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


<!-- {% endraw %} - for jekyll -->