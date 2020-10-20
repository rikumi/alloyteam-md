---
title: 使用 Xposed 强制 androidwebView 开启 debug 模式
date: 2015-04-01
author: TAT.fishineyuan
source_link: http://www.alloyteam.com/2015/04/%e4%bd%bf%e7%94%a8xposed%e5%bc%ba%e5%88%b6androidwebview%e5%bc%80%e5%90%afdebug%e6%a8%a1%e5%bc%8f/
---

<!-- {% raw %} - for jekyll -->

从 <https://developer.chrome.com/devtools/docs/remote-debugging> 我们可以知道在 android 4.4 + 可以通过在 apk 中使用下面的代码开启 webview 的 chrome 远程调试

```html
WebView.setWebContentsDebuggingEnabled(&lt;span class="keyword">true&lt;/span>);
```

但我们开发中接触的 apk 往往是第三方的，没谁会为我们开启 webContentsDebuggingEnabled。而 Xposed 能强制做到这一点

## [Xposed](https://github.com/rovo89/XposedBridge/wiki/Development-tutorial)

Xposed 能够勾住 (Hook) Android 应用程序对象的方法，实现 AOP，一个简单的例子：

```html
&lt;span class="keyword">public&lt;/span> &lt;span class="keyword">class&lt;/span> WebViewHook &lt;span class="keyword">implements&lt;/span> IXposedHookLoadPackage {
    &lt;span class="comment">// handleLoadPackage 会在android加载每一个apk后执行&lt;/span>
    &lt;span class="keyword">public&lt;/span> void handleLoadPackage(LoadPackageParam lpparam) throws Throwable {
        &lt;span class="comment">// 可以从lpparam中获取当前apk的名字&lt;/span>
        &lt;span class="keyword">if&lt;/span> (! lpparam.packageName.equals(&lt;span class="string">"com.tencent.mobileqq"&lt;/span>)) {
            &lt;span class="keyword">return&lt;/span>;
        }
        XposedBridge.log(&lt;span class="string">"WebViewHook handleLoadPackage: "&lt;/span> + lpparam.packageName);
        &lt;span class="comment">// 勾住 WebView 所有的构造器&lt;/span>
        XposedBridge.hookAllConstructors(WebView.&lt;span class="keyword">class&lt;/span>, &lt;span class="keyword">new&lt;/span> XC_MethodHook() {
            @Override
            &lt;span class="keyword">protected&lt;/span> void beforeHookedMethod(MethodHookParam param) throws Throwable {
                &lt;span class="comment">// 打开webContentsDebuggingEnabled&lt;/span>
                XposedHelpers.callStaticMethod(WebView.&lt;span class="keyword">class&lt;/span>, &lt;span class="string">"setWebContentsDebuggingEnabled"&lt;/span>, &lt;span class="keyword">true&lt;/span>);
                XposedBridge.log(&lt;span class="string">"WebViewHook new WebView(): "&lt;/span> + packageName);
            }
        });
    }
}
 
```

上面的代码可以为 QQ 打开 WebView 的 webContentsDebuggingEnabled

Xposed 工作原理可以参考文档： <https://github.com/rovo89/XposedBridge/wiki/Development-tutorial>

没有详细的 API 页面， 因为 API 也就几个，可以查看源代码： <https://github.com/rovo89/XposedBridge/tree/master/src/de/robv/android/xposed>

## 馋图

![](http://7tszky.com1.z0.glb.clouddn.com/FkOLG2-Oi_AM2jOIIpWJZS3Kg9XT)

![](http://7tszky.com1.z0.glb.clouddn.com/FiIdSVKqGFHg3xPEXdZG8wQCXPJI)

![](http://7tszky.com1.z0.glb.clouddn.com/FuP8cOgJccKFlEUn8DERk-owE0Ub)

## 拿来主义

1、需要 android 4.4+ Root 手机

2、安装 Xposed 框架

3、已开启 QQ WebView 的 Apk： [webviewdebughook.Apk](http://7tszky.com1.z0.glb.clouddn.com/FkA_G7UGdW8X4DZ2IKsRjVG0gEpz)


<!-- {% endraw %} - for jekyll -->