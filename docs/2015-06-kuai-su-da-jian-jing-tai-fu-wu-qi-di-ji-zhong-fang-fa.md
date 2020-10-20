---
title: 快速搭建静态服务器的几种方法
date: 2015-06-30
author: TAT.Fujun
source_link: http://www.alloyteam.com/2015/06/kuai-su-da-jian-jing-tai-fu-wu-qi-di-ji-zhong-fang-fa/
---

<!-- {% raw %} - for jekyll -->

作为一名前端开发人员，经常也是需要有一个静态服务器的。下面让我们来分分钟搭建自己的静态服务器吧

**一：使用 http-server**

http-server 基于 Node，所以得先确保有 Node 环境。

1. 安装 http-server

    npm install http-server -g

2. 启动

    http-server -a 127.0.0.1 -p 9999

上面的命令表示在本机的 9999 端口上启动一个静态服务器，应用根目录为执行上面命令的所在目录[![2](http://www.alloyteam.com/wp-content/uploads/2015/06/211.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/211.png)

优点：简单，快速  
缺点：命令行一关，服务就中止了。每次开机都要再启一次，麻烦

**二：使用 ApmServer/XAMPP**  
两者都是 PHP 的集成环境，这里以 ApmServer 为例（只有用过 ApmServer）。

首先在网上下载 ApmServer 的压缩包（免安装），解压到一个盘的根目录（建议是根目录，因为路径有空格可能造成一些不必要的麻烦），下面是其解压后的目录结构：

[![3](http://www.alloyteam.com/wp-content/uploads/2015/06/31.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/06/31.jpg)

双击 APMServ.exe 启动应用，可以看到下面的界面：

[![4](http://www.alloyteam.com/wp-content/uploads/2015/06/4.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/06/4.jpg)  
因为我们只需要一个静态服务器，所以把 MySQL 和 SSL 等选项都去掉，然后点击 “启动 APMServ” 就完成我们的静态服务器了。这时要部署应用，只需要把文件放到 apmServer/www/htdocs 目录下面就可以访问到了。这里想说的是其虚拟目录配置，即映射硬盘上任一目录作为服务器的一个子目录。有了虚拟目录，我们就可以定制出多个不同的服务器了。

[![12](http://www.alloyteam.com/wp-content/uploads/2015/06/12.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/06/12.jpg)

打开虚拟目录的配置界面，填写虚拟目录名称（英文），中文备注，选择网页根目录，然后保存虚拟目录，重启 ApmServer 后，就可以访问我们的虚拟目录了。

优点：简单，快速，集成 PHP 开发环境（PHP，MySQL 等）, 支持虚拟目录等许多实用功能  
缺点：用着用着就启动不了

**三：使用 Tomcat**  
Tomcat 是 Java 应用服务器，当然也可以用来作静态服务器。但 Tomcat 默认的一些配置不太友好，所以我们要定制一些配置。首先就是让 Tomcat 支持显示目录文件。打开 Tomcat/conf/web.xml，修改 listings 为 true。

[![9](http://www.alloyteam.com/wp-content/uploads/2015/06/91.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/91.png)

Tomcat 中虚拟目录配置是位于 Tomcat/conf/server.xml。在在 host 标签中增加如下格式的配置：

```html
<Context path="虚拟目录名" docBase="文件所在根目录" crossContext="true" />;
```

如：&lt;Context path="/test" docBase="G:/Test" crossContext="true" />

完成上面配置后，双击 Tomcat/bin/startup.bat 即可以启动 Tomcate 服务器，在浏览器中就可以正常访问到刚我们配好的目录了。

[![10](http://www.alloyteam.com/wp-content/uploads/2015/06/101.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/101.png)

优点：功能强大  
缺点：配置复杂

**小结：**  
如果没有特别要求，使用 http-server 基本就能满足我们前端对服务器的要求了


<!-- {% endraw %} - for jekyll -->