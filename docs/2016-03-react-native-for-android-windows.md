---
title: React Native for Android Windows 环境搭建
date: 2016-03-05
author: TAT.simplehuang
source_link: http://www.alloyteam.com/2016/03/react-native-for-android-windows/
---

<!-- {% raw %} - for jekyll -->

**环境搭建**

**1. 准备工作**

 [AndroidStudio](http://www.android-studio.org/)  安卓开发 IDE  推荐下载含 SDK tools 版

 [JDK for Windows](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) Java 软件开发工具包

 [Nodejs](https://nodejs.org/) nodejs 环境

**2. 安装 ReactNative 步骤**

 1) 使用 npm 安装 ReactNative

在 cmd 命令工具中执行以下命令，注意并非 install react-native，装了 react-native 在后面 init 项目的时候会报错，需要卸掉再重装。

    npm install -g react-native-cli

 2) 可能遇到的问题：

报错：npm-install-save-react-native-failed

解决办法：升级 nodejs 及 npm 版本

报错：'xxx’ 不是内部或外部命令

解决办法：设置对应命令为环境变量或安装对应的命令工具

**3. 安卓环境搭建**

 1) JDK 安装

运行已下载的 jdk-xxxx-windows-x64.exe 进行安装，如本地已有 JDK 可跳过本条。

 2) AndroidStudio 安装

运行已下载的 android-studio-bundle-xxx-windows.exe 进行安装

 [![图片 1](http://www.alloyteam.com/wp-content/uploads/2016/03/图片11-300x232.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/图片11.png)

安装 Android Studio 完毕后，需要检查 Android SDK 是否齐全，对应需要的 SDK 如下所示：

[![图片 2](http://www.alloyteam.com/wp-content/uploads/2016/03/图片21-300x75.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/图片21.png)

[![图片 3](http://www.alloyteam.com/wp-content/uploads/2016/03/图片31-300x157.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/图片31.png)

**ReactNative 开发调试体验**

**1.HelloWorld 程序**

在 AndroidStudio 中创建一个 Android HelloWorld 程序：

[![图片 4](http://www.alloyteam.com/wp-content/uploads/2016/03/图片4-253x300.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/图片4.png)

 **2. 调试手机启用开发者模式并连接 USB 选择允许调试**

开启开发者模式方式以小米机型为例参考[小米手机示例](http://jingyan.baidu.com/article/e5c39bf5895e9139d760332c.html)。

 **3. 运行 HelloWorld**

[![图片 5](http://www.alloyteam.com/wp-content/uploads/2016/03/图片5-300x157.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/图片5.png)

        点击运行并在列表中选择调试的手机，确定后手机会自动安装我们的 HelloWorld 程序：

      [![图片 6](http://www.alloyteam.com/wp-content/uploads/2016/03/图片6-179x300.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/图片6.png)

    保持程序运行状态，我们可以在 AndroidStudio 控制台上查看程序输出的 log 日志及 CPU / 内存等占用情况。

      [![图片 7](http://www.alloyteam.com/wp-content/uploads/2016/03/图片7-300x137.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/图片7.png)

**4.HelloAndroid 程序**

    使用命令行工具运行命令：

    react-native init HelloAndroid

    完成目录结构：

      [![图片 8](http://www.alloyteam.com/wp-content/uploads/2016/03/图片8.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/图片8.png) 

    在 AndroidStudio 上打开 HelloAndroid/android 目录，等待 gradle 构建完毕后运行 HelloAndroid 程序，可以看到以下 ReactNatibe 经典报错 UI，这是因为我们还未连接上 react-native 的编译 bundle 文件而导致出现的错误页面。

      [![图片 9](http://www.alloyteam.com/wp-content/uploads/2016/03/图片9-167x300.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/图片9.png) 

    下面我们来运行 Android ReactNative 构建命令：

    react-native start

    注意这里不是使用 run-android，run-android 适用于直接在机器上运行调试 app。

      [![图片 10](http://www.alloyteam.com/wp-content/uploads/2016/03/图片10-300x132.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/图片10.png)

    当构建完毕，在浏览器中访问 http&#x3A;//localhost:8081/index.android.bundle?platform=android 可以看到我们编译好的 android bundle 文件。

**调试方式**

**1. 配置 host 方式:**

  摇晃手机调出 app debug 菜单选项 -> 选择 Dev Settings->  选择 Debug server host & port for device ->  填写 PC 局域网 IP 及端口 (命令行输入 ipconfig 可查看本机 ip)

      [![图片 11](http://www.alloyteam.com/wp-content/uploads/2016/03/图片111-300x61.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/图片111.png) 

  如上图，填写 192.168.1.100:8081 即可，回退到主界面，再次摇晃手机调出 app debug  菜单选项 -> 选择 Reload JS，此时可以看到 ReactNative 的应用首页：

      [![图片 12](http://www.alloyteam.com/wp-content/uploads/2016/03/图片12-244x300.png)](http://www.alloyteam.com/wp-content/uploads/2016/03/图片12.png) 

**2.Android5.0 以上版本命令方式：**

  打开 Android SDK 目录 xxx\\Android\\sdk\\platform-tools。在当前文件路径呼出命令行，输入：

    adb reverse tcp:8081 tcp:8081

  点击 Reload JS  即可成功拉取 ReactNative bundle。

  注意：adb 命令可以添加到 windows 全局变量中，这样无需在 xxx\\Android\\sdk\\platform-tools 目录下执行 adb 命令，可以在 AndroidStudio 的 Terminal 命令行工具下使用

**3. 模拟器调试方式**

  安卓模拟器在 win 平台上性能表现不是很好，我们可以安装[英特尔 ® 硬件加速执行管理器](https://software.intel.com/zh-cn/android/articles/intel-hardware-accelerated-execution-manager)来进行一些性能上的提升（需要 Intel 的 CPU），安装完毕后在 AndroidStudiao 的菜单点击打开虚拟设备管理器，选择创建一个 Android 虚拟设备（需求不同的 Android 版本需要下载对应的 SDK Tool）并启动。

  当 Android 虚拟设备启动成功后，运行 HelloAndroid 应用 app，选择已启动的虚拟设备即可在虚拟设备上打开我们的 HelloAndroid。


<!-- {% endraw %} - for jekyll -->