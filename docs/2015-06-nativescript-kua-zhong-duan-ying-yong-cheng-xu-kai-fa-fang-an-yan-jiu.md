---
title: Nativescript 跨终端应用程序开发方案研究
date: 2015-06-16
author: TAT.ouvenzhang
source_link: http://www.alloyteam.com/2015/06/nativescript-kua-zhong-duan-ying-yong-cheng-xu-kai-fa-fang-an-yan-jiu/
---

<!-- {% raw %} - for jekyll -->

### 1. 环境准备

-   安装 nodejs
-   安装 nativescript

```html
<span class="variable">$npm</span> install -g nativescript
 
```

或者下载 github 上项目代码进行构建 (不推荐)

-   安装 java JDK  
    jdk 是 Java 运行开发环境，按 android 开发必须的开发的环境

```javascript
JAVA_HOME   D:/program file/java/jdk_1.7.34/
path         D:/program file/java/jdk_1.7.34/bin
classpath   D:/program file/java/jdk_1.7.34/lib
 
```

测试方法：java -version

-   安装 Apache ant  
    Apache Ant, 是一个将软件编译、测试、部署等步骤联系在一起加以自动化的一个工具，大多用于 Java 环境中的软件开发。由 Apache 软件基金会所提供。这里用到的的是用于 android 签名证书等打包 (android 开发过程中 ide 使用 gradle 配置打包，早期都是用的 ant 打包，这里使用的方法比较原始)  
    <http://ant.apache.org/bindownload.cgi> 上下载最新版 apache-bin (可选择安装型或压缩包型)，然后添加系统环境变量

```javascript
ANT_HOME    C:/ apache-ant-1.9.5
path        C:/ apache-ant-1.9.5/bin
classpath   C:/apache-ant-1.9.5/lib
 
```

测试方法：ant -version

-   安装 Android sdk  
    下载最新的 adk，<http://developer.android.com/sdk/installing/index.html> 下载后解压到某个目录 (例如 D 盘)，然后添加系统环境变量

```javascript
ANDROID_HOME   D:/android-sdk-windows
path        D:/androidandroid-sdk-windowstools
classpath  D:/androidandroid-sdk-windowstoolslib
 
```

测试方法：android  
必须掌握的两个命令：abd start-server/adb kill-server，用于启动 android debug 服务，adb 使用与启动模拟器或是通过手机的自动安装调试，并可以看到 log 信息。这两个命令会经常用到  
然后 命令行运行一下 tns，如果看到以下提示信息，就可以开始第一个开发了。

```html
<span class="comment"># NativeScript</span>
┌─────────┬──────────────────�
```


<!-- {% endraw %} - for jekyll -->