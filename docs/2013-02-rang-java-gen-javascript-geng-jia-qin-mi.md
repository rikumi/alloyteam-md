---
title: 让 Java 跟 Javascript 更加亲密
date: 2013-02-20
author: TAT.iAzrael
source_link: http://www.alloyteam.com/2013/02/rang-java-gen-javascript-geng-jia-qin-mi/
---

<!-- {% raw %} - for jekyll -->

在移动 App 开发中，为了快速迭代，通常都会使用 Native+Web 的模式开发。具体来说就是使用 Java 提供接口，使用 WebView 控件嵌套 Web 页面来实现 UI 和交互。

在 Android 中，Java 可以很方便的提供接口给 WebView 中的 Js 进行调用，只要以下一行代码就能搞定：

```javascript
mWebView.addJavascriptInterface(new JavascriptInterface(), "custom_name");
```

这样，JavascriptInterface 的所有声明为 public 的方法，都能被 mWebView 中的 Js 通过以下方式调用：

    window.custom_name.xxx();//xxx为JavascriptInterface的公有方法

而 Java 需要调用 Js 时，则是通过 WebView 实例的 loadUrl 方法调用：

```css
mWebView.loadUrl("javascript:xxx(yyy)");
```

这其实跟你在浏览器的地址栏敲下 “javascript：alert（1）” 的原理是一样的。

一切看起来都是那么的美好，只是……

当 Java 需要传递大量字符串给 Js 时，URL 就力不从心了。另外，从 URL 执行的 Js，在页面没加载完成时，是有可能导致页面出现 undefined 错误（因为要执行的那个方法可能还没有声明呢），会引发各种奇形怪状的错误。

那要怎么办呢？

再回看上面 Js 调用 Java 接口的地方，可以发现，Js 是可以直接调用 Java 方法并取得 Java 给的返回值的（必须是可序列化的数据）。那么，为何不试试把 Java 需要执行的 Js 方法，保存起来，让 Js 来读取、执行、并把结果写回？

步骤如下：

1.  Java 把 Js 调用（命令）和回调缓存，如保存到 ArrayList；
2.  Js 定时轮询 Java 提供的 getCommandList 接口；
3.  Js 读取到要执行命令，执行它，并把结果通过 setResult 写回给 Java；
4.  Java 把对应命令的回调取出并执行。

如此即完成了 Java 调用 Js 的流程。

为了方便使用，简单的封装了下，名为 [AndroidJavascriptBridge](https://github.com/iazrael/AndroidJavascriptBridge)，可移步到 [Github](https://github.com/iazrael/AndroidJavascriptBridge) 查看源码和示例（MainActivity.java 和 test.js）。

### 使用方法

Android 端调用，加入 com.imatlas.jsb 和 com.imatlas.util 包，按如下步骤调用

```javascript
//1. 创建JavascriptBridge实例  
final JavascriptBridge jsb = new JavascriptBridge(webView); 
 
//2. 调用Javascript方法
Bundle params = new Bundle();
params.putString("asdfasdf", "123123");
jsb.require("alert", params, new JavascriptBridge.Callback() {
    @Override
    public void onComplate(JSONObject response, String cmd, Bundle params) {
        Log.i("js response",response.toString());
    }
});
 
//3. 提供Java方法给Javascript调用
//添加个 messagebox 方法给js
jsb.addJavaMethod("messagebox", new JavascriptBridge.Function() {
    @Override
    public Object execute(JSONObject params) {
        Toast.makeText(getApplicationContext(), params.toString(), Toast.LENGTH_LONG)
                .show();
        return "{\"ret\":123}";
    }
});
```

Javascript 端的调用，须先引入 web/js/jsb.js, 之后按如下方式调用

```javascript
//1. 调用Java方法
jsb.require("messagebox", { text: "你好, messagebox!" }, function (response) {
    alert("调用messagebox回来啦\n" + JSON.stringify(response));
});
//2. 提供Javascript方法给Java调用
jsb.addJavascriptMethod("alert", function (params) {
    alert("------\n" + JSON.stringify(params) + "\n========\n");
    return { text: "alert ok" };
});
```

IOS 的话就要反过来了，要改成由 Objective-C 来轮询 Js，来实现 Js 对 Native 的调用。

嗯，等改天有时间了，就把 IOS 也封装进来，用起来就简单多了。

<!-- {% endraw %} - for jekyll -->