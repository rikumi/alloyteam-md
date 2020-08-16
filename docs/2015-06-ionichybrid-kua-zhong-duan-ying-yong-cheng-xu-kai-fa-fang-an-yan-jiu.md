---
title: IonicHybrid 跨终端应用程序开发方案研究
date: 2015-06-16
author: TAT.ouvenzhang
source_link: http://www.alloyteam.com/2015/06/ionichybrid-kua-zhong-duan-ying-yong-cheng-xu-kai-fa-fang-an-yan-jiu/
---

ionic 是最近一个很流行的 Hybird 移动开发解决方案，个人兴趣研究了一下，还是不错的  
<https://github.com/driftyco/ionic>

### 1. 环境准备

-   安装 nodejs
-   安装 cordova 和 ionic

```html
<span class="variable">$npm</span> install -g cordova ionic
 
```

或者下载 github 上项目代码进行构建 (不推荐)

-   安装 java JDK  
    jdk 是 Java 运行开发环境，按 android 开发必须的开发的环境

```javascript
JAVA_HOME D:/program file/java/jdk_1.7.34/
path D:/program file/java/jdk_1.7.34/bin
classpath   C:/apache-ant-1.8.1/lib
 
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
┌─────────┬─────────────────────────────
───────────────────────────────────┐
│ Usage   │ Synopsis                                                       │
│ General │ $ tns <Command> [Command Parameters] [--command <Options>]     │
│ Alias   │ $ nativescript <Command> [Command Parameters] [--command       │
│         │ <Options>]                                                     │
└─────────┴─────────────────────────────
───────────────────────────────────┘
 
```

### 2. 开始开发

-   创建项目

```html
$ ionic start projectName tabs
$ cd projectName
├── bower.json     <span class="comment">// bower dependencies</span>
├── config.xml        <span class="comment">// cordova configuration，例如标题和入口页面</span>
├── gulpfile.js        <span class="comment">// gulp tasks</span>
├── hooks              <span class="comment">// custom cordova hooks to execute on specific commands</span>
├── resources         <span class="comment">// custom static files such as icon</span>
├── ionic.project    <span class="comment">// ionic configuration</span>
├── package.json   <span class="comment">// node dependencies</span>
├── platforms      <span class="comment">// iOS/Android specific builds will reside here</span>
├── plugins         <span class="comment">// where your cordova/ionic plugins will be installed</span>
├── scss               <span class="comment">// scss code, which will output to www/css/</span>
└── www            <span class="comment">// application - what we need pay attention。JS code and libs, CSS, images, etc.</span>
 
```

-   配置移动平台


    $ ionic platform add ios
    $ ionic platform add android
    $ ionic build android/ios
    $ ionic emulator/run android/ios (emulator将在模拟器上启动，run将在真实手机上启动)
     

如果能够正常启动，就可以任性的开发了。

### 3. 项目代码结构分析

对于前端开发来说，只要关注 www / 下的项目代码就可以了，打包编译后 www 将会到 android 项目的 asset 目录下面。而客户端的主页面是通过一个入口 html 来开始运行的，如下：

```html
package com.ionicframework.demo862117;
 
import android.os.Bundle;
import org.apache.cordova.*;
<span class="keyword">public</span> <span class="keyword">class</span> MainActivity <span class="keyword">extends</span> CordovaActivity
{
    @Override
    <span class="keyword">public</span> void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.init();
        <span class="comment">// Set by <content src="index.html" /> in config.xml</span>
        loadUrl(launchUrl);
    }
}
 
```

这里主页面打包后会生成带上主要的 android/ios 外壳，界面产生的所有内容由 H5 实现。

### 4.angular 与组件化

ionic 使用了 angular 作为基础开发库，并用组件化的方案来管理自己的一套前端库，主要用到 angular，angular-ui，iconfont，svg 等前端技术知识，这里不一一展开了。  
<http://www.ionicframework.com/docs/components/> ，当然这里有了一套完整的前端开发框架很文档。即如果我们用它来开发应用的话，是需要用它的框架来写代码就可以了。

### 5. 总结分析

#### 优势

1.  大量可参考的组件和文档，使得开发入门成本比较低
2.  兼容 angular (当然自己也可以用其他的，只是默认创建项目时引入了 angular)
3.  整理来说，ionic 的方案仍然集中在 hybrid 开发的集成化，对于快速开发内嵌页面来说是很好的选择
4.  前端人员除了搭环境，不需要了解过多客户端的知识，就可以开发 hybrid 跨终端的 app 了

#### 可能存在的不足：

1.  直接将页面打包发布会使得迭代不好解决，如果使用离线包机制可以解决这一问题，但是客户端的定制化仍然我们对预 - - 处理后的代码进行较大的二次修改
2.  依然停留在 webview 开发阶段，不能突破 webview 解析 dom 的性能问题
3.  目前没有自动化调试，需借助外部工具来做