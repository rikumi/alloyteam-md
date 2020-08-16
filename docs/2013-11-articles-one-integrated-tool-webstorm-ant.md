---
title: 【WebStorm 工具篇】之一 整合 ant
date: 2013-11-30
author: TAT.woshayawo
source_link: http://www.alloyteam.com/2013/11/articles-one-integrated-tool-webstorm-ant/
---

<!-- {% raw %} - for jekyll -->

前端项目越做越大，自然就少不了自动化工具，种种好就不废话了，各种自动化工具也不一一对比了，（ps：稍后我们会推出前端自动化工具的视频教程）这里就单说说 ant。

前提是你电脑上已经安装了 ant，并且运行正常。

1.Webstorm - settings

2. 打开 external-tools

[![ant-1](http://www.alloyteam.com/wp-content/uploads/2013/11/ant-1.png)](http://www.alloyteam.com/wp-content/uploads/2013/11/ant-1.png)

3. 点击添加

4. 按照图示配置

[![ant-2](http://www.alloyteam.com/wp-content/uploads/2013/11/ant-2.png)](http://www.alloyteam.com/wp-content/uploads/2013/11/ant-2.png)

各配置项的含义解释一下：

Name：就是添加的工具的名字

Group：就是把它归类到哪一组里边

Descripton: 不多说

Options: 分别表示的意思是：

1.          如果每次运行完这个额外的工具，文件发生了变化，则同步过来。
2.          运行的时候打开 webstorm 的 console
3.          如果这个工具向标准输出输出则把显示内容显示在 console 里
4.          如果这个工具向标准错误输出则把显示内容显示在 console 里

Show in： 不多说，就是这个工具显示在 webstorm 的哪里

Tool settings： 

1.          program： 找到你本机的 ant 的安装目录
2.          parameters：一般不需要
3.          working directory： ant 的工作目录，这里插入宏，选择当前项目目录

Ok

5. 回到主界面：点击 tools：

[![ant-3](http://www.alloyteam.com/wp-content/uploads/2013/11/ant-3.png)](http://www.alloyteam.com/wp-content/uploads/2013/11/ant-3.png)

发现已经多了一个 ant

6. 点击 ant 直接运行，前提是你项目的根目录下有 build.xml 文件哦。

<!-- {% endraw %} - for jekyll -->