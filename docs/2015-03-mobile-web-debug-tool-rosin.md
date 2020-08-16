---
title: 移动 WEB 调试利器 ——Rosin
date: 2015-03-30
author: TAT.jessedeng
source_link: http://www.alloyteam.com/2015/03/mobile-web-debug-tool-rosin/
---

## 前言

随着 Web 前端开发由 PC 转向 Mobile，作为前端工程师，除了需要去学习掌握移动端的新特性外，还需要面对大量移动端特有的难题，其中之一就是 —— 怎么调试移动端页面？ 针对调试的问题，现在已经有一些很好的解决方案，比如：weinre、chrome remote、手 Q 浏览器 Inspector，不过这些方案的门槛都较高，需要满足一些额外的条件。目前，在日常的开发调试工作中，打日志依然是一种常见的调试手段，通过日志内容来判断当前页面运行的状态，而日志的输出形式又有很多种，有 img 请求、dialog 弹窗、alert 等等，但这些输出方式都不能很好的满足我们的需要，甚至存在一些问题，所以 Rosin 诞生了。

## 关于 Rosin

Rosin 是一个 Fiddler 插件，它能接收页面中的 console 的输出，将内容持久存储在本地，并展现在 Fiddler 面板。 如果你的项目是通过 Fiddler 代理来开发调试手机页面，那么 Rosin 将会是你的好帮手。  
项目地址：  <http://alloyteam.github.io/Rosin/>

## 特性

-   基于 Fiddler 实现
-   页面规则可配置
-   无需额外代码，直接 console
-   日志文件本地存储
-   日志内容管理、搜索、过滤
-   复杂对象解析，生成 JOSN 树
-   javascript 脚本运行错误捕获，支持跨域

## 版本

v1.0.0

## 下载安装

下载对应 Fiddler 版本的 Rosin，解压之后运行 RosinInstall.exe 安装。  
(如果电脑有权限控制，请 "右键 -> 以管理员身份运行" )  
[Roisn for Fiddler2](http://alloyteam.github.io/Rosin/download/1.0.1/Rosin-v1-for-fiddler2.zip)  
[Roisn for Fiddler4](http://alloyteam.github.io/Rosin/download/1.0.1/Rosin-v1-for-fiddler4.zip)

## 使用方法

1.  打开 Fiddler，切换到 Rosin Tab
2.  点击 “Add Rule” 按钮，打开规则添加面板  
    ![step-1](http://alloyteam.github.io/Rosin/images/step-1.jpg)
3.  选择规则匹配类型，支持三种匹配类型：
    -   Host—— 域名，如：qq.com
    -   Path—— 路径或者具体的页面地址，如：<http://web.p.qq.com/coupon> 或者 <http://web.p.qq.com/coupon/demo.html>
    -   Regex—— 正则表达式，如：^http&#x3A;\\/\\/web.p.qq.com
4.  输入具体的规则内容  
    ![step-2](http://alloyteam.github.io/Rosin/images/step-2.jpg)
5.  打开测试页面，在测试页面代码中调用 console 打日志，或者在 PC 控制台模拟  
    ![step-3](http://alloyteam.github.io/Rosin/images/step-3.jpg)
6.  回到 Fiddler，切换到 Rosin 的 Log 选项卡，选择我们的测试页面，查看日志
7.  对于复杂对象，双击 Object 字符区域选中，然后右键  
    ![step-4](http://alloyteam.github.io/Rosin/images/step-4.jpg)
8.  复杂对象都会被转为 JSON 对象，生成一个 JSON View  
    ![step-5](http://alloyteam.github.io/Rosin/images/step-5.jpg)
9.  功能区，一些功能按钮，包括：日志文件导出、日志清空、日志文件删除
10. 搜索功能，搜索框中输入文本，会自动高亮匹配结果，按 Enter 切换匹配区域  
    ![step-6](http://alloyteam.github.io/Rosin/images/step-6.jpg)
11. javascript 运行时错误信息捕获，并且支持跨域情况下的捕获（还记得那些 Script.error 0 的错误吗）  
    ![step-7](http://alloyteam.github.io/Rosin/images/step-7.jpg)

## 更新日志

v1.0.0 -- 2015.01.20  
\* 支持日志级别按颜色区分  
\* 支持按级别筛选日志  
\* 支持日志文件导出  
\* 支持日志内容清除  
\* 支持日志文件删除  
\* 支持日志记录自动清理  
\* 支持日志内容 JSON 对象解析  
\* 支持 script error 信息输出  
\* 支持跨域 script error 信息获取  
\* 优化日志展示

v0.0.1 -- 2014.12.03  
\* 支持 console 日志接收  
\* 支持 fiddler 日志展示  
\* 支持页面规则配置  
\* 支持日志列表展示