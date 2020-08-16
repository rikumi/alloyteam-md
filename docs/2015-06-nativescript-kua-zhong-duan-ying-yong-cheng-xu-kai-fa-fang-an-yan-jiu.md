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
┌─────────┬─────────────────────────────
───────────────────────────────────┐
│ Usage   │ Synopsis                                                       │
│ General │ $ tns <Command> [Command Parameters] [--command <Options>]     │
│ Alias   │ $ nativescript <Command> [Command Parameters] [--command       │
│         │ <Options>]                                                     │
└─────────┴─────────────────────────────
───────────────────────────────────┘
 
```

### 2. 开始项目

-   创建项目

```html
$ tns create demo
$ cd demo
$ tns platform add andrdoi/ios
├── app     <span class="comment">// bower dependencies</span>
        ├── App_Resources    <span class="comment">// bower dependencies</span>
                        ├── Android  <span class="comment">// android项目的drawble静态图片等文件，项目转换的时候直接拷贝到android项目下</span>
                        ├── iOS        <span class="comment">//ios项目用到的图片文件</span>
        ├── tns_modules    <span class="comment">//tns node模块，可以用来调用移动设备功能</span>
        ├── app.css    <span class="comment">// 内部控件样式</span>
        ├── app.js    <span class="comment">// 页面配置入口配置</span>
        ├── LICENSE
        ├── main-page.js    <span class="comment">// 页面js文件</span>
        ├── main-page.xml    <span class="comment">// 页面布局文件</span>
        ├── main-view-model.js    <span class="comment">// vm对象生成文件</span>
        ├── package.json    <span class="comment">// bower dependencies</span>
├── node_module     <span class="comment">// node插件忽略</span>
├── platforms           <span class="comment">// 转换后的移动端平台代码</span>
        ├── android           <span class="comment">// 标准的可移植android项目代码</span>
        ├── ios                  <span class="comment">//标准的可移植ios项目代码</span>
└──package.json           <span class="comment">//项目信息配置文件 </span>
 
```

从项目的结构可以看出，项目代码使用的 mvvm 结构，而且它的 viewmodel 是通过方法操作的。

-   配置移动平台


    $ tns platform add ios/android
    $ tns run android/ios (真机启动) 或者  tns run android/ios --emulator(启动模拟器)
     

如果没问题的话就可以看到手机或模拟器上启动了应用程序  
来自： <http://docs.nativescript.org/hello-world/hello-world-ns-cli.html>

### 3. 项目分析与实例

分析一下页面主要的代码结构

-   app.js，页面的预处理入口，表示启动 main-page 这个页面

```html
<span class="keyword">var</span> application = <span class="keyword">require</span>(<span class="string">"application"</span>);
application.mainModule = <span class="string">"main-page"</span>;
application.cssFile = <span class="string">"./app.css"</span>;
application.start();
 
```

-   main-page.js 页面的数据绑定处理，将 vm 和方法绑定，也可认为是把 vm 和对象关联绑定

```html
<span class="keyword">var</span> vmModule = <span class="keyword">require</span>(<span class="string">"./main-view-model"</span>);
<span class="keyword">function</span> pageLoaded(args) {
    <span class="keyword">var</span> page = args.object;
    page.bindingContext = vmModule.mainViewModel;
}
exports.pageLoaded = pageLoaded;
 
```

-   main-view-model.js 页面的 vm 定义模块，申明方法和数据

```html
<span class="keyword">var</span> __<span class="keyword">extends</span> = <span class="keyword">this</span>.__<span class="keyword">extends</span> || <span class="keyword">function</span> (d, b) {
    <span class="keyword">for</span> (<span class="keyword">var</span> p in b) <span class="keyword">if</span> (b.hasOwnProperty(p)) d[p] = b[p];
    <span class="keyword">function</span> __() { <span class="keyword">this</span>.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = <span class="keyword">new</span> __();
};
<span class="keyword">var</span> observable = <span class="keyword">require</span>(<span class="string">"data/observable"</span>);
 
<span class="keyword">var</span> HelloWorldModel = (<span class="keyword">function</span> (_super) {
    __<span class="keyword">extends</span>(HelloWorldModel, _super);
 
    <span class="keyword">function</span> HelloWorldModel() {
        _super.call(<span class="keyword">this</span>);
        <span class="keyword">this</span>.counter = <span class="number">42</span>;
        <span class="keyword">this</span>.set(<span class="string">"message"</span>, <span class="keyword">this</span>.counter + <span class="string">" taps left"</span>);
    }
 
    HelloWorldModel.prototype.tapAction = <span class="keyword">function</span> () {
        <span class="keyword">this</span>.counter--;
        <span class="keyword">if</span> (<span class="keyword">this</span>.counter <= <span class="number">0</span>) {
            <span class="keyword">this</span>.set(<span class="string">"message"</span>, <span class="string">"Hoorraaay! You unlocked the NativeScript clicker achievement!"</span>);
        }
        <span class="keyword">else</span> {
            <span class="keyword">this</span>.set(<span class="string">"message"</span>, <span class="keyword">this</span>.counter + <span class="string">" taps left"</span>);
        }
    };
    <span class="keyword">return</span> HelloWorldModel;
})(observable.Observable);
exports.HelloWorldModel = HelloWorldModel;
exports.mainViewModel = <span class="keyword">new</span> HelloWorldModel();
 
```

-   app.css

```html
.title {
    font-size: <span class="number">30</span>;
    horizontal-align: center;
    margin:<span class="number">20</span>;
}
 
button {
    font-size: <span class="number">42</span>;
    horizontal-align: center;
}
 
.message {
    font-size: <span class="number">20</span>;
    color: <span class="comment">#284848;</span>
    horizontal-align: center;
}
 
```

main-page.xml android 上布局的文件，类似 vm 模板，注意，是 xml 的，不是 html

```html
<Page xmlns="http://www.nativescript.org/tns.xsd" loaded="pageLoaded">
      
    <StackLayout>
            
        <Label text="Tap the button" cssClass="title" />
            
        <Button text="TAP" tap="{{ tapAction }}" />
            
        <Label text="{{ message }}" cssClass="message" textWrap="true" />
          
    </StackLayout>
</Page>;
```

### 4. 总结分析

1.  核心是用 JavaScript 来写代码，然后预处理成 android/ios 项目进行打包安装
2.  开发模式基本遵循前端的 mvvm 思想来实现，只是实现和表现不一样
3.  参考文档完善，整理来说是一个不错的 native 开发方案
4.  开发使用 commonJs 的规范，容易理解
5.  但是不足之处也很明显，很难做现有单页面的改造，迭代不方便，功能上线必须像客户端那样发布审核，某些程度上还是需要 web 页面的支持

当然这次只分析了个简单的例子，后面自己搞个复杂的例子来分享下，敬请期待 (类似的还有 samurai-native 和 react-native，坐等 android 支持)~

<!-- {% endraw %} - for jekyll -->