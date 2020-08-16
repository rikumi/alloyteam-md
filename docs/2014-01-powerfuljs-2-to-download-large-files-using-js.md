---
title: 【PowerfulJS】2~ 使用 JS 下载较大的文件
date: 2014-01-08
author: TAT.dorsywang
source_link: http://www.alloyteam.com/2014/01/powerfuljs-2-to-download-large-files-using-js/
---

**[先看 Demo 点击这里](http://alloyteam.github.io/AlloyPhoto/demos/download/)**  
康哥的 [《在浏览器端用 JS 创建和下载文件》](http://www.alloyteam.com/2014/01/use-js-file-download/), 这篇文章写的很不错，其中关于下载这部分，解决了一些困扰已久的问题，本文基于保存文件的基础上，做一些新的尝试（当然，老外比我们走得早一些，已经将此方法用在站点上）

直接切入正题。

**传统浏览器下载文件**  

传统浏览器下载文件，一般都是浏览器直接下载文件，我们以前无法做到

-   监控文件的下载进度和速度
-   控制文件下载的行为（暂时 or 停止）

如今，PowerfulJs 使我们做到了上述能力，可以预见，Web 版的类迅雷的工具也将会出现了

**实现原理**

其实原理也是很简单的，简单说来，我们使用 Ajax 来请求文件，并可以用事件来监测我们下载了多少，一共有多少需要下载，这样也可以算出下载的速度（当然这里还可以做 Web 版网速测试工具），然后再用文件保存方法将其保存下来就可以了

当然这些功能，是要依赖于 XHR2 的能力的

具体的实现细节如下

**设置 responseType 为 blob**

```javascript
var xhr = new XMLHttpRequest();
xhr.open("GET", url, true);
xhr.responseType = "blob";
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        if (success) success(xhr.response);
    }
};
```

然后监听下载的 process 事件

```javascript
xhr.addEventListener("progress", function (e) {
    //e.total就是文件的总字节 e.loaded就是文件已加载了多少字节了
});
xhr.send();
```

**下载文件**

这里下载文件的方法具体可以参考康哥的上篇文章，这里我们使用一个老外封装好的库 FileSaver.js 来下载文件

    //saveAs是FileSaver.js中的方法
    saveAs(blobData, "test.mp3");

**浏览器表现**

由于机器上没有 Firefox，没有 Firefox 的测试结果

**Chrome:**   显示下载进度，成功下载后，如果对于一般文件会直接保存，如下图，注意这里的顺序，这里是先下载完成，浏览器出现下图的时候是直接保存完成的！

对于一般的文件，chrome 不会有提示

[![下载完成](http://www.alloyteam.com/wp-content/uploads/2014/01/QQ截图20140108000452.png)](http://www.alloyteam.com/wp-content/uploads/2014/01/QQ截图20140108000452.png)

对于敏感的文件，chrome 会提示是否保留或放弃

[![QQ 截图 20140108000948](http://www.alloyteam.com/wp-content/uploads/2014/01/QQ截图20140108000948.png)](http://www.alloyteam.com/wp-content/uploads/2014/01/QQ截图20140108000948.png)

**IE11 下表现：**

IE11 下表现也是很乖的，完全可以运行，便其不管什么文件都会提示是否保存

[![ie11 下表现](http://www.alloyteam.com/wp-content/uploads/2014/01/QQ截图20140108001201.png)](http://www.alloyteam.com/wp-content/uploads/2014/01/QQ截图20140108001201.png)

**[具体 Demo 请点击这里](http://alloyteam.github.io/AlloyPhoto/demos/download/)**