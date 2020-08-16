---
title: flow–facebook 出品的 javascript 静态类型检查器
date: 2015-07-31
author: TAT.will
source_link: http://www.alloyteam.com/2015/07/flow-a-static-type-checker-for-javascript-from-facebook/
---

<!-- {% raw %} - for jekyll -->

## 起源

众所周知，js 是一门弱类型的语言，类型转换往往隐含在各种业务代码中，同时也埋下了不少的坑。比如以下代码

```javascript
// return string
function getEnvVersion() {
    return "1.1.1";
}
// '1.1.1' > 0 => false, so nothing happen
if (getEnvVersion() > 0) {
    // doSthAwesome();
}
```

```javascript
function size(obj) {
    return obj.length;
}
// uncaught error
size(null);
```

类似的情况数不胜数，通过 jshint 工具做一些编码规范可以规避一些问题，但由于 js 过于灵活，还是有许多无法检查到的隐患。

## FLOW

于是 flow 出现了。[flow](http://flowtype.org/) 是 facebook 推出的 js 类型检查工具，可以在编码时检查到类型错误并做出提示，避免将问题带上线。

### 安装

目前 flow 仅支持 MacOS 与 Linux，可以直接在官网 wget 最新的二进制包到本地运行。

#### MacOS

Mac 用户推荐使用 `brew install flow` 完成安装。

### 快速上手

只需要在待检查的 js 文件头部添加一行注释`/* @flow */`，然后在同一目录下运行 `flow check` 即可。  
[![flow1](http://www.alloyteam.com/wp-content/uploads/2015/07/flow1.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/flow1.png)

[![flow2](http://www.alloyteam.com/wp-content/uploads/2015/07/flow2.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/flow2.png)  
代码中增加类型检查，即可通过 flow 的检测了。  
[![flow3](http://www.alloyteam.com/wp-content/uploads/2015/07/flow3.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/flow3.png)

## 详细使用

### 类型标注

正如前文所说，js 的类型转换很灵活，比如如下代码

```javascript
function add(num1, num2) {
    return num1 + num2;
}
add(3, "0");
```

结果会是多少呢？3? '30'? 相信很多人知道，结果是 '30'。绝大多数情况下，这不是我们想要的结果。如果让 flow 来检测这段代码，会是什么结果呢？  
[![flow4](http://www.alloyteam.com/wp-content/uploads/2015/07/flow4.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/flow4.png)  
是的，flow 不会报错，因为`+`操作符对于字符串和数字都是完全适用的，而且 `add` 函数也没有声明参数必须是数字。  
加上类型标注之后，flow 就检测到了。  
[![flow5](http://www.alloyteam.com/wp-content/uploads/2015/07/flow5.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/flow5.png)  
是不是隐隐觉得有什么地方不对？没错，js 不支持类型声明啊 (/= \_ =)/~┴┴ 这玩意上线怎么跑啊？  
别急，这里使用了 JSX 的语法，使用对应的转换工具即可去掉类型声明用于生产环境。

    npm install -g jstransform
    jstransform --strip-types --harmony --watch src/ build/

以上命令可以让 `jstransform` 在后台检测 src 目录下的文件，并实时编译到 build 目录下。

### 开发环境与持续集成

#### flow server

如果每次一点代码小改动，都手动运行 `flow check` 来检查所有文件，想想都觉得蛋疼。  
flow 提供了后台静默运行的方式，可以只检测改变的文件部分。  
首先运行 `flow`，此时会启动 flow server，并展示当前所有文件的错误。当修改了文件之后，再次运行 `flow`，即可展示最新的错误列表。  
相比 `flow check`，flow server 省去了每次检查全部项目文件的开销，也可以更好地与 IDE 工具结合。  
当不需要 flow server 时，运行 `flow stop` 即可关闭。

#### 持续集成

既然使用了 flow 做代码检查，自然也希望在构建工具中添加 flow 检查的步骤。grunt 和 gulp 都有对应的 flow 插件。  
也可以在 package.json 声明依赖，直接 `npm run [task]`运行。由于 flow 是用 [OCaml](http://ocaml.org/) 语言写的，npm 上只有对应的二进制包。  
`npm install flow-bin`

#### Windows

目前 flow 暂时没有 windows 的支持，不过最近官方貌似在 [issues](https://github.com/facebook/flow/issues/6) 宣布开始准备支持了。所以耐心等待吧～

### 结语

对于 js 越来越复杂的应用场景，类型检查的优势也渐渐凸显。flow 的目标是通过一点点代码的改动就发现文件中的类型错误，功能上确实很强大。  
本文仅是 flow 工具的简单介绍，更多使用帮助请戳 <http://flowtype.org/docs/getting-started.html>

参考文档：<http://flowtype.org/docs/getting-started.html>  
<https://code.facebook.com/posts/1505962329687926/flow-a-new-static-type-checker-for-javascript/>

<!-- {% endraw %} - for jekyll -->