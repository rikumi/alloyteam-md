---
title: 【开源项目】LivePool：基于 NodeJs 的跨平台 Web 抓包替换工具
date: 2014-07-15
author: TAT.Rehorn
source_link: http://www.alloyteam.com/2014/07/nodejs-debug-proxy-livepool/
---

<!-- {% raw %} - for jekyll -->

[**LivePool**](http://rehorn.github.io/livepool/ "LivePool HomePage")

LivePool 是一个基于 NodeJS，类似 Fiddler 能够支持抓包和本地替换的 Web 开发调试工具，是 [Tencent AlloyTeam](http://www.alloyteam.com/2014/07/nodejs-debug-proxy-livepool/alloyteam.github.io) 在开发实践过程总结出的一套的便捷的 WorkFlow 以及调试方案。

![](http://raw.github.com/rehorn/livepool/master/test/screenshot/shot1.png)

### **背景**

在 Windows 平台上，[Fiddler](http://www.telerik.com/fiddler) 作为一款非常便捷好用的 Web 调试工具，深受广大开发者的喜爱。而在 Mac 上，类似的工具，比如 [Charles](http://www.charlesproxy.com/) 等，收费并且功能非常有限，着实让很多陆续把工作环境迁移到 Mac 的小伙伴刚到非常的不方便。难道真的要在 Mac 上装个 Windows 或者开虚拟机跑 Fiddler 吗？

Alloyteam 其实很早就开始实践跨平台的抓包和替换工具，基于 QT 的 [Rythem](https://github.com/AlloyTeam/Rythem)，功能上基本能满足要求，但是由于后续没有熟悉 QT 平台的人力投入，没有持续更新和支持。出于折腾精神，决定用比较熟悉的 NodeJS 进行开发一款类似的代理替换工具，并尝试借助 Web 便捷快速的 UI 能力搭建更美观强大的管理界面。

### **特性**

1.  基于 NodeJS, 跨平台
2.  便捷的 UI 界面，跟 Fiddler 类似，降低学习成本
3.  支持 http 抓包和本地替换调试，Https/WebSockets 直接代理转发，暂不支持本地替换
4.  基于项目的替换规则管理，方便高效，规则支持拖曳排序
5.  支持基于请求路径的本地文件替换，支持基于请求路径的路由转发（host 配置）
6.  替换类型支持：文件 / 文件夹替换，combo 合并替换，qzmin 替换（批量 combo)，delay 延时等
7.  支持自动设置系统代理
8.  支持规则过滤，只显示关注的请求
9.  提供构建 http get/post 请求界面，方便接口调试
10. 特色功能：模拟 gprs/3g 等低网速（mac only）
11. 特色功能：支持离线站点到本地，并自动代码格式化

### **主要功能**

### 1. 抓包分析

实现原理：通过拦截系统 web 代理将浏览器或者其他应用的请求转发到 Livepool，Livepool 通过拦截获取 http 请求的相关信息，比如 http 头，内容等，并将结果缓存下来，便于后面进行分析。

### ![](https://raw.githubusercontent.com/rehorn/livepool/master/test/screenshot/shot2.png)

### 2. 本地替换和规则管理

实现原理：livepool 拦截到请求后，对请求的路径进行分析，将命中规则的请求进行适当处理，替换为对应内容。目前替换类型支持：文件 / 文件夹替换，combo 合并替换，qzmin 替换（批量 combo)，delay 延时等。提供便捷的基于项目的规则管理。

![](http://raw.github.com/rehorn/livepool/master/test/screenshot/shot8.png)

### 3. 构建调试请求

便捷的模拟 http 请求，方便接口调试

![](http://raw.github.com/rehorn/livepool/master/test/screenshot/shot11.png)

### 4. 模拟低网速【mac only】

GPRS: 48kbit/s  
Edge: 64kbit/s  
3g: 348kbit/s  
ADSL: 768kbit/s  
WIFI: 2048kbit/s

### 5. 离线站点

将站点内容离线到本地，并自动代码格式化，便于查看  
站点保存到当前文件夹 Sites 下

![](http://raw.github.com/rehorn/livepool/master/test/screenshot/shot13.png)

### **更多**

项目官网：[http://rehorn.github.io/livepool](http://rehorn.github.io/livepool/)

github: <https://github.com/rehorn/livepool>

讨论 & bug: <https://github.com/rehorn/livepool/issues>

### **还在内测，未经过大量测试，欢迎提建议，star & fork & issue**

<!-- {% endraw %} - for jekyll -->