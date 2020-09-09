---
title: 玩转 npm
date: 2016-03-10
author: TAT.云中飞扬
source_link: http://www.alloyteam.com/2016/03/master-npm/
---

<!-- {% raw %} - for jekyll -->

[![NPM](https://camo.githubusercontent.com/3fd81ee99a8ca86aee5e7450cb41b40b0d6f8da5/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031362f30332f6e706d2e706e67)](https://camo.githubusercontent.com/3fd81ee99a8ca86aee5e7450cb41b40b0d6f8da5/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031362f30332f6e706d2e706e67)

[npm](https://www.npmjs.com/) 本来是 Node.js 的包管理工具，但随着 JS 这几年的蓬勃发展，现在的 npm 已经成了几乎所有跟 JS 相关的工具和软件包的管理工具了，并且还在不断发展完善中。

本文从笔者的经验，总结了 npm 安装 / 卸载、更新、发布这几个最主要功能的正确使用姿势和一些小技巧，顺便从官网搬来了 npm3 处理依赖的重大变化。

npm3  

=======

npm 团队已经发布了 npm3，近期有小伙伴吐槽 npm3 安装软件包的时候很慢，一开始笔者也感觉相比 npm2 慢了不少，但经过了几个版本的迭代，速度似乎又快起来了。

慢的同学是时候更新你的 npm 啦，而且之前安装进度条模糊成一坨的问题也已经修复了。

##### npm v3.0 安装 react 的截图

[![npm 3.0](https://camo.githubusercontent.com/6fc5efba05f7d4ab3e760e3a7027ca69151d7511/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031362f30332f6e706d332e302e706e67)](https://camo.githubusercontent.com/6fc5efba05f7d4ab3e760e3a7027ca69151d7511/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031362f30332f6e706d332e302e706e67)

##### npm v3.8 安装 react 的截图

[![npm 3.8](https://camo.githubusercontent.com/b271181fdaa5eacb04ad7b8739e1349541dde66d/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031362f30332f6e706d332e382e706e67)](https://camo.githubusercontent.com/b271181fdaa5eacb04ad7b8739e1349541dde66d/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031362f30332f6e706d332e382e706e67)

npm 提供了大量的命令，所有的命令几乎都可以通过 npm cmd \[options] 的方式使用。

npm -h  

=========

学习一个命令行工具，最简单直接的方式就是查看它的用户手册，npm 提供了并不算很详细的命令行手册，可以通过 npm -h 查看（unix 用户还可以通过 man npm 查看，相对来说比 windows 详细多了），需要某个 npm 命令更详细的文档则需要通过 npm help cmd 如 npm help install 来查看，注意不是 npm install help ，这样将会安装 help 包。

另外 npm cmd -h 也是一个快速查看命令可以怎么使用和搭配哪些常用选项的方法。

npm init  

===========

说到 npm 就不得不说 package.json，每一个 npm 包都必须有一个 package.json 文件，年轻时候的我还傻乎乎的从其他地方拷贝 package.json 过来然后修改，为了自动化还写了个自动生成的脚本。

后来才发现原来 npm 自带此功能，官方原厂功能更好更强大，只需要执行 npm init 即可，以交互方式完成 package.json 的创建。

如果想生成默认 package.json，可以执行 npm init -y，连交互式界面都不会出现。

另外需要注意，npm init 的时候需要输入用户字段，如果还没有设置 npm 用户，需要通过 npm addUser 设置。

事实上，最小单位的 npm 包就是只包含一个 package.json 文件的包，这样的话 npm init 就完成了一个 npm 包的创建。

npm install/uninstall  

========================

npm install 作为 npm 最重要的功能和最常用的功能，不用过多说明，这里只介绍三个非常有用的选项 --global，--save，--save-dev。

想必读者肯定知道 --global 可以简写成 - g，其实另外两个选项也有简写形式，--save 可以简写成 - S，--save-dev 可以简写成 - D，注意大写。

另外 npm install 也可以简写成 npm i，相应的卸载命令 npm uninstall 可以简写成 npm un，事实上 npm 的很多命令和选项在设计上都非常类似 unix 上的命令行功能，这里指的是命令和选项都可以极大化地简写，只要在不混淆的情况下。

npm uninstall 和 npm install 接受同样的选项和参数。

\--save 的作用是在 packaje.json 的 dependencies 字段增加或者修改一个安装包和版本号名值对，--save-dev 则是修改 devDependencies，这样就不用安装了某个包之后手动修改 package.json，npm 已经帮我们把包依赖和版本管理做好了。

以安装 react 为例，

npm i react -S 将为 package.json 增加

```javascript
"dependencies": {
  "react": "^0.14.7"
}
```

npm i react -D 将增加

```javascript
"devDependencies": {
  "react": "^0.14.7"
}
```

npm update  

=============

假如 react@15（版本号，下同）发布了，想尝鲜的小伙伴该怎么更新呢？

首先得知道 npm 上是否已经更新，npm info react 可以查看到 react 在 npm 上发布过哪些版本以及最新的版本，但是内容太多，让人眼花缭乱，配合 grep 会好一些。

其实我们只想知道 react 最新的版本，使用 npm dist-tags ls react 直接列出 react 发布过哪些 tag，

    > npm dist-tags ls react
    0.10.0-rc1: 0.10.0-rc1
    0.11.0-rc1: 0.11.0-rc1
    latest: 0.14.7
    next: 15.0.0-rc.1

以及这些 tag 目前最新是哪些版本，比如最常用的 latest，也是默认 tag。

next tag 已经发布了 react@15 的第一个 rc 版了，尝鲜的朋友可以试一试了。

另外一个命令 npm outdated，会检测当前安装的所有 npm 包是否有更新，并列出可以更新的包，如果没有任何输出，那么恭喜你，所有的包都是不需要更新的。

如果之前安装的 react 版本是 0.14.3，同时还安装了 [redux@3.2.0](mailto:redux@3.2.0)，执行 npm outdated 会输出

    Package  Current  Wanted  Latest  Location
    react     0.14.3  0.14.7  0.14.7  example
    redux      3.2.0   3.3.1


<!-- {% endraw %} - for jekyll -->