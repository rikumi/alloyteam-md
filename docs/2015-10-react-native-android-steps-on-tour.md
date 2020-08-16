---
title: React Native Android 踩坑之旅
date: 2015-10-25
author: TAT.tennylv
source_link: http://www.alloyteam.com/2015/10/react-native-android-steps-on-tour/
---

<!-- {% raw %} - for jekyll -->

**前言**

Facebook  在 2015.9.15 发布了 React Native for Android，把 JavaScript  开发技术扩展到了移动 Android 平台。基于 React 的 React Native  让前端开发者使用 JavaScript  和 React  编写应用，利用相同的核心代码就可以创建  基于 Web，iOS  和 Android  平台的原生应用。在 React Native for Android 出来之后，本人花了些时间从环境搭建到做出几个 demo，从体验来看都挺流畅，具体将此间遇到和问题和具体的新的体会，向大家分享一下。

**原理简介**

**1** React Native for Android 和 for IOS 的基本原理是一致的，通过 android 的 **JavaScriptCore** 来异步解析 js 代码 (jsbundle 文件)，然后根据引入的支持和配置，渲染成原生 native 组件。

**2 ** 复用 React 系统，也减少了一定学习和开发成本，更重要的是利用了 React 里面的分层和 diff 机制。js 层传给 Native 层的是一个 diff 后的 json，然后由 Native 将这个数据映射成真正的布局视图。

**环境搭建**

环境搭建的话，在网上也找到过很多教程，但是还是推荐还是去看官方文档 <https://facebook.github.io/react-native/docs/android-setup.html#content>，在搭建的过程中可能会遇到一些问题。

**1** 在 React Native for Android 刚出来的时候，官方称是不支持在 windows 系统上安装的，只有在 mac 上才可以使用![](http://7jpp2v.com1.z0.glb.clouddn.com/1.png)，但是最新版的 React Native for Android 已经支持在 windows 上使用，![](http://7jpp2v.com1.z0.glb.clouddn.com/2.png)更新 React Native 的方法：下载最新版的 react-native-cli 即 npm install -g react-native-cli，并且保证 node 是最新版的即 > 4.0。

**2** 在执行 react-native init AwesomeProject 命令时，由于这个命令会去下载一些 node module 所以要根据自己的实际情况设置 npm 的代理和镜像，本人就曾经因为这个问题搞了很久才成功，可以安装 nrm (npm install -g nrm) 来便捷设置 npm 的代理和镜像，其次是执行这个命令必须现在**机器上装有 git**，并且设置好 git 的环境变量，另外这个命令需要等待一些时间，不要提前取消。

**3** 在调用 react-native run-android 的命令时，有时会报出找不到 android-sdk 环境变量的错误（自己确实已经正确设置环境变量）提示例如![](http://7jpp2v.com1.z0.glb.clouddn.com/33.png)

的错误时，可以单独在项目根目录下，**也就是 AwesomeProject / 新建一个 local.propertites 文件**，添加 sdk.dir = 你的 android 的 sdk 目录，然后在运行 react-native run-android。

**4** 在调用 react-native run-android 命令时，其实这个命令就是执行的两部分操作一是是构建你的 android 项目并生成 apk，另外一个是打开 react-native 的 package 管理工具同时编译你的 js 文件，其实可以在项目根目录的 package.json 下找到

![](http://7jpp2v.com1.z0.glb.clouddn.com/44.png)

其实是执行了另外一条命令 **node node_modules\\react-native\\packager\\packager.js** 来打开 package 的管理工具，有些可能没打开一个新的命令行窗口，自己手动执行这条 node 命令也是可以的。在这条命令执行完之后，node 就会开启一个服务，同时把 js 文件编译成 jsbundle 文件，我们可以通过 <http://localhost:8081/index.android.bundle?platform=android> 来访问到这个文件，可以简单将这个文件理解成一个 html，**android 就是通过解析这个 html 来达到渲染的目的，将该文件部署到 CDN 可供 android app 从网络获取，即可实现不用发版本让 app 的 UI 随时更新，并且可获得接近 native 的体验，这也是 react-native 最吸引开发者的亮点之一。**

**5** 用 react native 命令生成的 android 项目是基于 **gradle** 构建和部署的 (不清楚 gradle 的可以 google)，这个以前一些搞用 eclipse 来 android 开发的可能不太一样，gradle 是用在 google 主推的一款 android 开发 IDE，android statio 里面默认的项目构建方式，所以我们的项目里会看到一些 build.gradle 的文件，这些都是配置文件。

**6** 我们在根据教程搭环境时会碰到需要安装 android 模拟器的步骤，这个步骤会提示你安装一个 **HAXM** 的东西![](http://7jpp2v.com1.z0.glb.clouddn.com/55.png)可以看到这个安装不是必须的，其实这个是一个 android 模拟器的加速程序，按了这个你的模拟器可能会跑的更快，但是在安装这个程序时，会遇到![](http://7jpp2v.com1.z0.glb.clouddn.com/66.png)的错误是由于 CPU 的**虚拟化未开启**，需要重新开机在 bios 上设置一下，具体怎么设置，可以自行 google。

**7** react-native android 在本地调试开发时，你只需要修改 js 文件，然后刷新你的项目，所以在创建 android 模拟器时要记得选择带有 android 键盘的模拟器，这样才能在模拟器上刷新你的更改。

**与现有的 android 项目集成**

**1** 想要在现有的 android 项目里添加 react native 支持，你必须要先创建一个基于 gradle 的 android 项目，推荐使用 android studio 来创建项目，要记得创建的项目要高于 **Android 4.1 (API 16)**的 android 项目。

**2** 用 android studio 创建一个项目 并且能跑起来，这段教程可以直接去网上少，一般配置无误的情况下，很容易跑出一个 android helloword 来，你只需要保持之前的 node package 服务开启，程序依然会去寻找 <http://localhost:8081/index.android.bundle?platform=android> 这个文件的。只是你的 android 模拟器是通过 android studio 来管理了。

**3** 在按照 <http://facebook.github.io/react-native/docs/embedded-app-android.html#content> 配置你的结合项目时，还要注意在 AndroidManifest.xml 文件里面添加**<activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />** 这样才能开启调试模式。

**4** 对于 android 项目来说，react native 的支持也是就在 Activity 里面创建了一个 ReactRootView![](http://7jpp2v.com1.z0.glb.clouddn.com/77.png)，对这不是 webview，然后将 Activity 的其他事件生命周期等等都交给 react manager 来管理，所以对于 react native 的 android 页面，就可以简单理解成一个 activety 里面套一个 reactrootview 这个 view 去加载并 jsbundle 文件，渲染出原生 native 的 ui 组件。

**远程加载 jsbundle 文件**

**1** 目前在 react android 的官方文档里面，还没有找到如何远程加载 jsbundle 文件的地方，只能是事先把 jsbundle 文件放在 assets 目录下面，**一起打包成 apk，也就是 release apk 文件**，可以参考 <https://facebook.github.io/react-native/docs/signed-apk-android.html>。

**样式和布局**

**1** react native 的代码和 react 基本一样，组件的生命周期，jsx 语法都支持，只是在使用 jsx 时要经常调用官方提供的组件。

**2** react native 里面的样式大部分是可以利用 css 语法来写的，只有文档里面有的属性才能用，不是所有的 css 都可以在 react native 里面用的，采用 obj 的形式将 css 属性横杠后面的第一个字母大写即可。

![](http://7jpp2v.com1.z0.glb.clouddn.com/88.png)

**3** react 的宽高度不支持百分比，设置宽高度时不需要带单位，在 react native 里面默认使用 pt 为单位，注意在给 image 设置大小时要根据 [PixelRatio](https://facebook.github.io/react-native/docs/pixelratio.html#content) 设置合适的值。

**4** 使用 dimensions.get ("window") 可以获取到当前 viewport 的大小，这个值可能会根据屏幕横竖来动态改变。

**5** react native 里面没有 float 的用法，是根据 flex 来布局，alignItems 和 justifyContent 分别决定子元素的布局，而 flexDirection 决定子元素的排列方式垂直还是水平，flex:number 决定子元素所占的比例，alignSelf 决定元素本事的布局，子 view 会默认根据父 view 来 absolute，这里有个技巧，如果想让子 view 实现 100% 的效果可以设置 left：0 ,right :0, 同理 height 可以用 top:0,bottom:0。

**6** 使用 text 的 numberOfLines 可以实现文本截取省略号，即 css 的 text-overflow 属性。

**7** 默认情况下如果元素超过了父元素，是不可以滚动的，必须在外部套一个<ScrollView> 才可以。

**8** react native 里面没有 z-index 的概念，是根据 jsx 语法里面定义组件的顺序来实现的，后写的组件会覆盖在先写的组件上。

**总结**

**1** react native android 和 ios 相比，由于出现的还比较晚一些功能还没有非常完善，所以一些文档里面没有写的东西还需要自己摸索，例如 android 上使用 borderTopLeftRadius 没起作用。

**2** react native android 在性能上要比 web 来的好很多，毕竟渲染出来的是原生的组件，尤其是在一些低端 android 机型上，但是跟真正的 native 相比还是要逊色一些，但是 react native 的优势在于一套代码可以跨平台复用，而且可以通过更新远端 JS，直接更新 app，并且对于前端工程师来说用 js 的语法写 native 的组件也并没有很难。

**3 ** 本人用 react native android 做出的 demo，大家可以体验一下。<http://7jpp2v.com1.z0.glb.clouddn.com/app-release.apk>

不断跟新中

参考资料：<http://www.nihaoshijie.com.cn/index.php/archives/550>


<!-- {% endraw %} - for jekyll -->