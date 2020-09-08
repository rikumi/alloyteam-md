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
 
    //load class
    Class localClass = localDexClassLoader.loadClass("org.cmdmac.plugin.PluginImpl");
 
    //construct instance
    Constructor localConstructor = localClass.getConstructor(new Class[] {});  
 
    Object instance = localConstructor.newInstance(new Object[] {});  
 
    //call method
    IPlugin plugin  = (IPlugin)instance;
    plugin.show ();
} catch (Excpetion e) {
    //To do something
}
```

### 原理剖析

好，这样我们就实现了一个简单的插件，现在来问两个问题：

1. 为什么插件 SDK 要放在 lib 目录？放在 lib 目录和非 lib 目录以 external 方式引用的区别是什么？

2. 为什么插件 SDK 只能导出接口，在插件工程里要以 external 方式引用又不是放在 lib 目录了？

在回答这两个问题之前，我们来做下实验：

1. 主工程不把插件 sdk 放在 lib 目录下，而是以 external 方式引用，插件 SDK 和插件工程引用的方式不变。这时在运行时会产生如下错误:

java.lang.ClassNotFoundException: PluginImpl  
at dalvik.system.BaseDexClassLoader.findClass(BaseDexClassLoader.java:61)  
at java.lang.ClassLoader.loadClass(ClassLoader.java:501)  
at java.lang.ClassLoader.loadClass(ClassLoader.java:461)  
at org.cmdmac.host.MainActivity.onCreate(MainActivity.java:23)  
at android.app.Activity.performCreate(Activity.java:5084)  
at android.app.Instrumentation.callActivityOnCreate(Instrumentation.java:1079)  
at  
......

2. 在插件工程里把 SDK 放到 lib 目录下，主工程引用方式不变，会出现下面的错误

java.lang.IllegalAccessError: Class ref in pre-verified class resolved to unexpected implementation  
dalvik.system.DexFile.defineClass(Native Method)  
dalvik.system.DexFile.loadClassBinaryName(DexFile.java:211)  
dalvik.system.DexPathList.findClass(DexPathList.java:315)  
dalvik.system.BaseDexClassLoader.findClass(BaseDexClassLoader.j

3. 在插件工程把 SDK 放到 lib 目录下，加载的 classloader 改为：

 ClassLoader classLoader= ClassLoader.getSystemClassLoader(); 

会出现下面的错误

java.lang.ClassCastException: org.cmdmac.plugin.PluginImp cannot be cast to org.cmdmac.pluginsdk.AbsPlugin  
com.example.org.cmdmac.host.test.MainActivity.onCreate(MainActivity.java:30)  
android.app.Activity.performCreate(Activity.java:5084)  
android.app.Instrumentation.callActivityOnCreate(Instrumentation.java:1079)  
com.lbe.security.service.core.client.internal.InstrumentationDelegate.callActivityOnCreate(InstrumentationDelegate.java:76)  
android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2044)

这些错误是怎么来的？解析答案得从 JAVA 类加载原理出发：

Java 的类加载器一般为 URLClassLoader，在 Android 里是不能用的，取而代之的是 DexClassLoader 和 PathClassLoader。

Java 中的类加载器大致可以分成两类，一类是系统提供的，另外一类则是由 Java 应用开发人员编写的。系统提供的类加载器主要有下面三个：

引导类加载器（bootstrap class loader）：它用来加载 Java 的核心库，是用原生代码来实现的，并不继承自 java.lang.ClassLoader。

扩展类加载器（extensions class loader）：它用来加载 Java 的扩展库。Java 虚拟机的实现会提供一个扩展库目录。该类加载器在此目录里面查找并加载 Java 类。

系统类加载器（system class loader）：它根据 Java 应用的类路径（CLASSPATH）来加载 Java 类。一般来说，Java 应用的类都是由它来完成加载的。可以通过 ClassLoader.getSystemClassLoader () 来获取它。

类加载器在尝试自己去查找某个类的字节代码并定义它时，会先代理给其父类加载器，由父类加载器先去尝试加载这个类，依次类推。在介绍代理模式背后的动机之前，首先需要说明一下 Java 虚拟机是如何判定两个 Java 类是相同的。Java 虚拟机不仅要看类的全名是否相同，还要看加载此类的类加载器是否一样。只有两者都相同的情况，才认为两个类是相同的。即便是同样的字节代码，被不同的类加载器加载之后所得到的类，也是不同的。比如一个 Java 类 com.example.Sample，编译之后生成了字节代码文件 Sample.class。两个不同的类加载器 ClassLoaderA 和 ClassLoaderB 分别读取了这个 Sample.class 文件，并定义出两个 java.lang.Class 类的实例来表示这个类。这两个实例是不相同的。对于 Java 虚拟机来说，它们是不同的类。试图对这两个类的对象进行相互赋值，会抛出运行时异常 ClassCastException。

由 java 类加载器原理可以得到如下答案：

关于第一个错误：

Android 默认的类加载器是 PathClassLoader 那么：

ClassLoader classLoader= context.getClassLoader() ;

这个得到的结果就是 PathClassLoader，它加载了一个 apk 或者 dex 里的所有类，当以 exteral 方式引用时，由于生成的主工程的 apk 是没有把接口类打包进来的，这时使用 PathClassLoader 去加载时也是没有加载到 Impl 的，由于 PathClassLoader 是父加载器，它找不到就会使用类加载器本身（即 DexClassLoader）去查找，他去查找时发现需要引用 AbsPlugin 和 IPlugin，这时再去找了一圈，也是没有找到，因此出现 ClasNotFound 错误。

关于第二个错误：

第二个错误是由于主工程和插件都包含和插件的接口，这时使用 PathClassLoader 在主工程查找时找到 AbsPlugin 和 IPlguin，用 DexClassLoader 加载 Impl 时因为也会加载 AbsPlugin 和 IPlugin, 但这时使用 DexClassLoader 在 plugin.apk 也找到了，因此出现两个相同类的但是由不同的类加载器加载的，就出现了这个错误，这个错误类型出错的代码可以查看 Resolve.cpp 的 dvmResolveClass 函数。

关于第三个错误：

这个错误是在类型转换的时候出现，原因也是两个不同的基类，但原因不同，是因为使用 SystemClassLoader 加载时只能在 plugin.apk 里找到，但在进行类型转换时查找 AbsPlugin 和 IPlugin 是在主工程中查找的，这时的情况下，主工程的 AbsPlugin 和 Impl 继承的 AbsPlugin 是在不同的类加载器加载的，不能进行类型转换了。

### 总结与思考：

好了，到现在为止，如何实现插件还有使用不同方式编译加载出现的错误原因我们也知道了也就是 JAVA 是用类加载器来加载类的，加载类时会先使用父的加载器加载后再从使用自己的父加载器去加载，同一个类不同的加载器加载的类也被认为不同的类。

下面探讨另一个问题，有没有可能在主程序里不打包插件 SDK 也可以实现动态加载但现在的逻辑代码不变？还有上面的例子做成插件的是普通的类，Activity 能不能也一样可以做到，升级插件了怎么办？答案是两个都可以实现，原理也是使用 DexClassLoader，篇幅和利益关系这里不做介绍。


<!-- {% endraw %} - for jekyll -->