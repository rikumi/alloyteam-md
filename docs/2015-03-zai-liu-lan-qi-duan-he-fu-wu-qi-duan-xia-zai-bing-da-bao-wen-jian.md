---
title: 在浏览器端和服务器端下载并打包文件
date: 2015-03-24
author: TAT.felix
source_link: http://www.alloyteam.com/2015/03/zai-liu-lan-qi-duan-he-fu-wu-qi-duan-xia-zai-bing-da-bao-wen-jian/
---

<!-- {% raw %} - for jekyll -->

```html
假设我们有以下目录结构：
 
<a href="http://www.alloyteam.com/wp-content/uploads/2015/03/dir.png"><img class="alignnone size-full wp-image-6423" alt="dir" src="http://www.alloyteam.com/wp-content/uploads/2015/03/dir.png" width="330" height="258" /></a>
 
用户可能需要打包这个目录下的所有文件，或其中一些文件的组合（在定制组件的场景下）。
 
我们一般的做法是，提供一个页面，让用户进行选择，然后可以有两种做法：
 
1. 提交请求到服务器端，服务器对定制化的文件组合进行合并之后打包，返回给客户端进行下载。
2. 在客户端下载所需要的文件，自行进行合并之后打包，保存到本地。
 
在服务器端合并打包文件应该是比较常见的做法了，这里主要介绍一下浏览器端下载。
<!--more-->
我们先来了解一下 Blob 对象。
 
<strong>了解 Blob 对象</strong>
 
一个 Blob 对象一种原生数据的封装，只读，可以用于文件操作。基于 Blob 对象实现的有 File 对象。
 
创建一个 Blob 对象很简单，使用构造函数：
```

```javascript
// 参数 array 是 ArrayBuffer、ArrayBufferView、Blob、DOMString 对象的一种，或这些对象的混合。
// 参数 options 含两个属性：
var array = [
    '<div id="myId"><a href="http://alloyteam.com">Alloyteam</a></div>',
];
var options = {
    type: "", // 默认为空，指定 array 内容的 MIME 类型
    endings: "transparent", // 默认为 'transparent', 指定遇到包含结束符 '/n' 的字符串如何写入 // 'native' 表示结束符转化为与当前用户的系统相关的字符表示， // 'transparent' 表示结束符直接存储到 Blob 中，不做转换。
};
var myBlob = new Blob(array, options);
console.log(myBlob);
```

    创建了一个 Blob 实例后，它具有两个属性和一个方法
     
    - 两个属性： 
     
        - size - 大小，单位为字节 
     
        - type - MIME 类型，若构造时不指定则默认为空

```html
// DOMString 类型数据
var array = ['<div id="myId"><a href="http://alloyteam.com">Alloyteam</a></div>']
<
```


<!-- {% endraw %} - for jekyll -->