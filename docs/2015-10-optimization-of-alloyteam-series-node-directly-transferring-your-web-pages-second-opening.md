---
title: 【AlloyTeam 优化系列】Node 直出让你的网页秒开
date: 2015-10-12
author: TAT.heyli
source_link: http://www.alloyteam.com/2015/10/optimization-of-alloyteam-series-node-directly-transferring-your-web-pages-second-opening/
---

<!-- {% raw %} - for jekyll -->

**项目： 手 Q 群成员分布直出**

**基本概念：**

直出其实并不算是新概念。只不过在 Web2.0 单页应用流行的年代，一直被人遗忘在身后。其实在 Web1.0 时代，前后端没有分离的时候，程序员直接用后台程序渲染出模板，这便是直出。而到了今天，当 Node 大大提高了前端开发者的能力时，前端人员也可以做一些后台的事情，通过 Node 来实现模板的渲染和数据的吞吐。

**框架及技术：**

由 AlloyTeam 开发的，建基于 Koa 之上的玄武直出框架。该框架的优势在于：

(1) 安装与本地开发简单：只需要几行命令安装和几行代码部署本地开发环境。

(2) 完善的文档和规范的开发实践：经过数个项目的试验，文档已经日臻完善，并总结出一套可供大部份业务使用的实践方案。

(3) 部署测试和发布成熟：目前已有兴趣部落、群搜索等数个项目成功发布。

(4) 较好的容错功能： 通过公司的 L5 负载均衡服务，完美兼容直出与非直出版本，即使直出挂了，也能顺利走非直出版本，让前端可以安心睡大觉。

**注：即使不使用这套框架，还是可以利用 Koa 或者 Express 这些 Node 的 web 框架轻松实现直出的。**

**直出方案：**

**1. 数据拉取**

玄武框架提供一个封装了开源 request 库的一个同名 request 框架，并且提供异步拉取数据方案。文档代码如下：

```javascript
function(req, res, next) {
 
        var hander = function(error,response,body){
	    var data = JSON.parse(body);
 	    res.body = body;
 	    next();
        };
        ajax.request(opt,hander); 
}
```

也有不少人认为写异步比较不优雅，因此会使用 promise, bluebird 等第三方库。我在实践手 Q 群成员分布的时候，经过对 generator 的学习之后，探索出一个简易的同步写法，这种写法简单易懂，而且大大减少了对第三方库的依赖。如下面代码：

```javascript
function*(req, res) {
    var opt = {
        url : 'xxxxxxxxx',
        method: 'POST',
        form: {
           bkn: getBkn(skey),
           gc: gc,
        },
        headers : {
           'host' : 'web.qun.qq.com',
           'Referer' : 'web.qun.qq.com'
        }
    };
    function requestSync(opt) {
        return function(callback) {
            ajax.request(opt, function(error, response, body) {
                callback(error, response);
            });
       }
    }
    var content = yield requestSync(opt);
}
```

**只要像上面代码一样进行简单的封装，就可以写出同步的写法。具体代码的分析和理解可以看文章的附录一部份。**

**2. 模板渲染**

除了数据拉取，模板如何渲染也是直出的重要环节。下面有三种方案提供：

（1）在服务器中搭建一个浏览器，渲染好所有东西然后传给前台

这种方案应该是最快的办法，但由于需要在服务器中搭建浏览器进行渲染，因此会消耗服务器大量性能，因此并不可取。

（2）通过玄武写主要逻辑，然后吐给前台再渲染

这种方案的性能也是非常好的，但由于要将原本代码的部份逻辑放到服务器写，因此需要对后台和前台都做容错，会耗费一些开发时间。

（3）只给前台吐出数据，然后完全由前台渲染

这种方案的改动小，而且容错比较容易实现。例如，我在手 Q 群成员分布中，在 html 里加入如下代码：

````

```html
<script>
    {{'xw-data'}}
</script>
````

```

然后在直出入口文件做替换：
```


<!-- {% endraw %} - for jekyll -->