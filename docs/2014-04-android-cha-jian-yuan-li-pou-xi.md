---
title: Android 插件原理剖析
date: 2014-04-17
author: TAT.zhipingfeng
source_link: http://www.alloyteam.com/2014/04/android-cha-jian-yuan-li-pou-xi/
---

<!-- {% raw %} - for jekyll -->

### 前言

关于插件，已经在各大平台上出现过很多，eclipse 插件、chrome 插件、3dmax 插件，所有这些插件大概都为了在一个主程序中实现比较通用的功能，把业务相关或者让可以让用户自定义扩展的功能不附加在主程序中，主程序可在运行时安装和卸载。

在 android 如何实现插件也已经被广泛传播，实现的原理都是实现一套插件接口，把插件实现编成 apk 或者 dex，然后在运行时使用 DexClassLoader 动态加载进来，这里分享一下 DexClassLoader 加载原理和分析在实现插件时不同操作造成错误的原因。

### 插件 Sample

先来回顾一下如何在 Android 平台下做插件吧，首先定义一个插件接口 IPlugin（其实不使用接口也可以，在加载类的时候直接使用反射调用相关类，但写代码来比较蛋疼）：

```javascript
    public interface IPlugin {
        public String getName();
        public String getVersion();
        public void show();
    }
```

```javascript
    public interface IPlugin {
        public String getName();
        public String getVersion();
        public void show();
    }
```

```javascript
   public abstract class AbsPlugin {
        public abstract String getName();
        public abstract String getVersion();
        public abstract void show();
   }
```

写好这个接口后，导出这个 IPlugin 生成 jar 包，这个相当于 SDK 了，然后新建一个工程并，这个工程以引用方式（即 eclipse 中 external library）引用这个包后，实现这个接口:

```javascript
  public class PluginImp extends AbsPlugin {
        public String getName() {
           return "PluginImp";
        }
 
        public String getVersion() {
            return "1.0";
        }
 
        public void show() {
           android.util.Log.("PluginImp", "ha ha I'm pluginimp");
        }
  }
```

编译这个工程并生成 apk 或者导出实现类生成 dex , 这时就做好了我们的插件实体，最后在我们的主工程里把插件接口的 jar（即插件 SDK）放在 lib 目录下在 apk 编译时打包进来，同时用下面的代码在需要的时候加载进来调用:

```javascript
try {    
    ClassLoader classLoader= context.getClassLoader() ; 
    DexClassLoader localDexClass Loader = new DexClassLoader("/sdcard/plugin.apk", dexoutputpath, null ,classLoader) ;  
 </
```


<!-- {% endraw %} - for jekyll -->