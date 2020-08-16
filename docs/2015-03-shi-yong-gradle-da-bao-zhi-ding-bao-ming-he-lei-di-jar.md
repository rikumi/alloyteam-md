---
title: 使用 gradle 打包指定包名和类的 jar
date: 2015-03-04
author: TAT.zhipingfeng
source_link: http://www.alloyteam.com/2015/03/shi-yong-gradle-da-bao-zhi-ding-bao-ming-he-lei-di-jar/
---

<!-- {% raw %} - for jekyll -->

```javascript
在开发sdk生成jar在eclipse里相对比较容易操作，只要导出class时指定哪里导出就可以，
但在用AndroidStudio开发时要导出jar就没那么容易，需要写gradle脚本，但gradle脚本
的入门成本还是比较高，网上也有打包jar的脚本参考，但大多是通过生成classes.jar重命名
来生成，这样生成的jar是包含工程里所有类的，有时我们需要指定一些包和类来生成jar。
下面是参考脚本：
```

    task clearJar(type: Delete) { 
        delete 'libs/sdk.jar' 
    } 
     
    task makeJar(type:org.gradle.api.tasks.bundling.Jar) {
        //指定生成的jar名
        baseName 'sdk'
        //从哪里打包class文件
        from('build/intermediates/classes/debug/org/cmdmac/cloud/pluginsdk/')
        //打包到jar后的目录结构 
        into('org/cmdmac/cloud/pluginsdk/')
        //去掉不需要打包的目录和文件 
        exclude('test/', 'BuildConfig.class', 'R.class')
        //去掉R$开头的文件 
        exclude{ it.name.startsWith('R$');} 
    } 
     
    makeJar.dependsOn(clearJar, build)

    在build.gradle写上后，只要在命令行执行gradle makeJar就可以在build/libs目录下找到这个jar

上面是个简单的例子，只能打包某个包下面的所有文件，如果要实现只打某个包下面的某些子包或者文件可参考如下示例：

    task makeSdkJar(type:org.gradle.api.tasks.bundling.Jar) {
        baseName 'pluginsdk'
        //只打包org.cmdmac下的org.cmdmac.pluginsdk.impl和org.cmdmac.gamecenter,其他子包不会被打包进去
        from('build/intermediates/classes/debug/org/cmdmac/') {
            include 'pluginsdk/impl'
            include 'gamecenter'
        }
        into('org/cmdmac/')
    //    exclude('R.class')
    //    exclude{ it.name.startsWith('R$');}
    }


<!-- {% endraw %} - for jekyll -->