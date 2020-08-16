---
title: 【AlloyTeam Web 前端工具系列 2】开源跨平台的 Web 抓包分析工具 Rythem (2012-09-19 更新)
date: 2012-05-17
author: TAT.iptton
source_link: http://www.alloyteam.com/2012/05/web-front-end-tool-rythem-1/
---

# **Rythem 是什么**

Rythem 是一个与 [Fiddler](http://fiddler2.com/fiddler2/) 同类的软件，和 Fiddler 一样具有 **代理抓包 / 替换** 功能，与 Fiddler 最大的不同是 Rythem 是**跨平台**&**[开源](https://github.com/AlloyTeam/Rythem)**的。

**下载地址及源码：**

-   Windows 绿色版： <https://github.com/AlloyTeam/Rythem/releases/download/Rythem_for_mac_remote_listen_bug_fix/Rythem-2013-11-15.7z>
-   MacOS 安装包：<https://github.com/AlloyTeam/Rythem/releases/tag/filter>  
    已知此包在 MacOS 10.6.x (或以下) 下无法运行  
    ~ 旧版用户如果是安装在 / Applications 目录，可下载 [updater](https://github.com/downloads/AlloyTeam/Rythem/RytheUpdater0921.zip)(425KB) 进行更新，下载解压后运行 update 即可～
-   Rythem 以 Qt 为基础框架，你可以到 github 上获取其源代码：<https://github.com/AlloyTeam/Rythem>

以下为 Rythem 运行的截图：(MacOS 与 windows 平台下略有不同)

[![Rythem 截图 1](http://www.alloyteam.com/wp-content/uploads/2012/05/Rythem.png "Rythem")](http://www.alloyteam.com/wp-content/uploads/2012/05/Rythem.png)

Rythem 目前已实现以下功能：

-   http 代理服务
-   https tunnel 透传 (https 抓包需求似乎不是很大，暂不实现)
-   规则替换  

        匹配模式包括`wildcard`类型及全匹配两种
        以替换后内容区分有本地及远程两种。
        本地替换有三种：目录式，单个文件式，多文件合并成一文件
        远程替换暂时只支持一个文件对应一个远程路径
-   host 设置
-   替换规则远程及本地导入。
-   替换规则增删改。
-   颜色标记已被替换的请求
-   导入 / 导出 每条请求（兼容 fiddler \*.saz 文件)
-   批量导出 response body（可用于整站保存）
-   过滤显示请求

# **如何使用**

1）Windows 平台下，点击左上角 “开始抓包” 按钮（非 Windows 平台下手动将系统代理设为 127.0.0.1:8889)

2) 在 Rythem 右侧选中 “替换规则” tab  （见下图）

[![](http://www.alloyteam.com/wp-content/uploads/2012/05/Rythem-2-1.png "Rythem-2-1")](http://www.alloyteam.com/wp-content/uploads/2012/05/Rythem-2-1.png)

3) 在此 tab 下点击 “添加本地分组” 并填写分组名后点 OK（见上图）

4) 点击刚建立的分组下的 + 号，在弹出的窗口中填入相应信息，这里以 local File 类规则为例：

如下图，规则意为：遇到 <http://test.com/> 的请求 时返回 replacement 里指定的文件的内容 (replacement 下的输入框可手动输入也可点其下的 -F 按钮选择。

[![](http://www.alloyteam.com/wp-content/uploads/2012/05/Rythem-3.png "Rythem-3")](http://www.alloyteam.com/wp-content/uploads/2012/05/Rythem-3.png)

5）打开浏览器访问 <http://test.com/> 得到以下效果：（本例中 replacement 被设为一个.h 文件）

[![替换效果](http://www.alloyteam.com/wp-content/uploads/2012/05/http___test.com_.png "http___test.com_")](http://www.alloyteam.com/wp-content/uploads/2012/05/http___test.com_.png)[![](http://www.alloyteam.com/wp-content/uploads/2012/05/Rythem-4.png "Rythem-4")](http://www.alloyteam.com/wp-content/uploads/2012/05/Rythem-4.png)

# 替换规则简介：

目前 Rythem 实现了五种规则：

**1. 单个请求对应单个文件替换**

如上例

**2. 目录级别替换**

例： pattern 为： /myfolder/  replacement 为 /my/path/

则访问  <http://every.host.name/every/path/to**/myfolder/**subpath/everyfile.html> 会被转到 **/my/path/**subpath/everyfile.html

**3.Host 替换**

例  patern 为 w.qq.com  replacement 为 127.0.0.1 效果等同于在 hosts 文件里设置 w.qq.com 127.0.0.1 (前提是访问者通过本代理软件访问）

**4. 远程内容替换**（由于远程替换发现有严重 bug，暂时屏蔽）

例 pattern 为： <http://myhost.com/cgi/no/ready>   replacement 为 <http://myhost2.com/cgi/already/ready>

则访问 <http://myhost.com/cgi/no/ready> 时，内容返回为 <http://myhost2.com/cgi/already/ready> 所返回的内容

**5. 单个请求对应多个文件组合替换**

适用于多个 js 合并规则

转载请注明本文永久网址：<http://www.alloyteam.com/?p=789>  
遇到问题请与 ip 反馈 iptton (at) gmail.com，或在此文后回复 🙂

\--------------------------------------

**2012.5.21 更新**

增加源代码使用方法及代码阅读提示： <https://github.com/AlloyTeam/Rythem/wiki>  
已实现拖动 @[流年](http://liunian.info/) 所提及的拖动生成规则功能（已提交源代码，暂未打包新安装包）  
**今天有了第一次来自非团队内的 pull request～非常感谢 qhwa 的修正 ( <https://github.com/qhwa>)**

**2012.5.23 更新**

使用 linguist 支持多语言  
修复一个严重 bug (会导致某些请求不能正常执行)  (已更新安装包)  
TODO: 增加版本更新功能

**2012.5.31 更新**

增加更新检查  
增加单例运行检查 (只允许同时运行一个 Rythem)

**2012.8.22 更新**

MacOS 下增加设置代理功能  
不需手动设置代理，仅在 MacOS 10.8 上测试通过  

修改 Windows 下代理设置方式，解决部分 windows+ie 组合下设置代理失效问题

Windows 下启动时自动开启抓包  
MacOS 下由于设置及取消都需输入密码，所以设成需手动点 “开始抓包” 按钮）  

支持 HTHML5 audio 音频替换  
旧版本的 Rythem 或 fiddler 替换 audio 标签播放的文件 只能播放一次，Rythem 在一开始就支持了 HTML5 的 manifest 返回 content-type，后面大家开发中遇到需修改 header 的问题也可和 ip 反馈 

支持目录级的淘宝 ComboUrl  【来自 [xhowhy](https://github.com/xhowhy) 的贡献】(由于本人疏忽，忘更新主线到分支，导致昨天所发布版本中未含有 ComboURL 替换功能，看下载量已有 5 个下载，这里说声抱歉～目前 windows 版已重新 build，~mac 版稍后更新～已更新)

2012.08.28 更新  
由于测试不全面，导致如果系统本身有代理情况下，如果在启动时执行抓包会出错。

2012.09.19 更新  
MacOS 版增加对系统原代理支持（pac/http/https）  
MacOS 版抓包只需要输入一次密码即可

2013.11.14 更新  
MacOS 版增加远程监听能力（远程 ip 地址显示在状态栏） MacOS 10.9 不支持 Qt5 , 又要回滚到 Qt 4.8 了。。~(Windows 版本呢？等我重新搭好 windows 环境再编译一个吧..)~ windows 版已更新

2014.2.21 更新  
增加请求根据 host 过滤能力，  
过滤例子：  
如需只显示 host 中含有 qq.com 和 alloyteam.com 的请求，过滤输入框填  qq.com|alloyteam.com