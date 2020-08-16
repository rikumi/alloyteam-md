---
title: source map 版本 3 介绍
date: 2014-01-20
author: TAT.Perlt
source_link: http://www.alloyteam.com/2014/01/source-map-version-3-introduction/
---

## 背景

source map 提案的作用在于可以在浏览器中的开发者工具 Closure Inspector 中像调试源代码一样地调试生成后的 Javascript 代码。

source map 是一个记录代码转换前和转换后的位置信息文件，利用 [Closure Compiler](https://code.google.com/p/closure-compiler/) 生成。

source map 经历了 3 个版本，第三版本的 source map 代码量大量减少。

## [](https://github.com/perltzhu/source-map-version3-description#%E6%9C%AF%E8%AF%AD)术语

-   生成后的代码： 指的是那些被编译器压缩过后的代码
-   源代码：指的是没有被编译器压缩过的代码
-   [VLQ](http://en.wikipedia.org/wiki/Variable-length_quantity)：变量长度量，一个 [base64](http://zh.wikipedia.org/zh-cn/Base64) 值。相应转换规则请[点击链接](https://github.com/mozilla/source-map)。
-   Source Mapping URL：生成后的代码的 source map 文件 URL 地址

## [](https://github.com/perltzhu/source-map-version3-description#%E7%89%88%E6%9C%AC3%E6%A0%BC%E5%BC%8F)版本 3 格式

### [](https://github.com/perltzhu/source-map-version3-description#%E7%89%B9%E7%82%B9)特点

-   减少代码量，减少了解析时间，减少内存消耗，减少下载时间
-   利用双向映射，支持源代码级的调试
-   支持反混淆

### [](https://github.com/perltzhu/source-map-version3-description#%E6%A0%BC%E5%BC%8F)格式

-   1.{
-   2. "version":3,
-   3. "file": "target.js",
-   4. "sourceRoot": "",
-   5. "sources":\["map-test.js","map-test2.js"],
-   6. "sourceContent": \[null,null],
-   7. "names":\["a","b","c","d","global","global2","ss","aa","cc","dd","globa11l","globa2l2"],
-   8. "mappings":"AAAAA,QAASA,EAAC,EAAE,EAEZC,QAASA,EAAC,EAAE,EAEZC,QAASA,EAAC,EAAE,EAOZC,QAASA,EAAC,EAAE,EAUZ,IAAIC,OAAO,CAAX,CACIC,QAAQ,C,CCtBZC,QAASA,GAAE,EAAE,EAEbC,QAASA,GAAE,EAAE,EAEbC,QAASA,GAAE,EAAE,EAObC,QAASA,GAAE,EAAE,EAUb,IAAIC,SAAS,CAAb,CACIC,SAAS;"
-   9.}

[target.js](https://github.com/perltzhu/source-map-version3-description/blob/master/target.js "target.js"),[map-test.js](https://github.com/perltzhu/source-map-version3-description/blob/master/map-test.js "map-test.js"),[map-test2.js](https://github.com/perltzhu/source-map-version3-description/blob/master/map-test2.js "map-test2.js"),[target.js.map](https://github.com/perltzhu/source-map-version3-description/blob/master/target.js.map "target.js.map")

[demo 文件](https://github.com/perltzhu/source-map-version3-description/blob/master/test.html)，具体实际效果可下载到本地调试

第一行:source map 的 [JSON](http://baike.baidu.com/view/136475.htm) 对象

第二行: version: 文件版本，必须是个正整数

第三行: file: 编译器生成后的文件

第四行: sourceRoot: 源文件相对路径。如果都在当前路径上，则为空

第五行: sources: 源文件列表

第六行: sourceContent: 源文件配置，当没有配置 source 的时候则使用这个

第七行: names: 变量列表

第八行: mappings: 映射表

mappings 数据结构如下:

-   生成后的文件，每一行的映射片段块都会以分号 (;) 分隔开来
-   每个片段以逗号 (,) 分隔
-   每个片段是有 1,4 或 5 个变量长度的字段组成

片段代表着每个位置的映射，其中片段的每一个字段的含义:

-   第一个值，代表这个位置开始于编译后文件的第几列
-   第二个值，代表这个位置属于 sources 中的哪个文件
-   第三个值，表示这个位置开始于源代码的第几行
-   第四个值，代表这个位置开始于源代码的第几列
-   第五个值，代表这个位置在于 names 中的哪个变量

### [](https://github.com/perltzhu/source-map-version3-description#%E7%BC%96%E7%A0%81%E7%B1%BB%E5%9E%8B)编码类型

默认的编码类型为 UTF-8

### [](https://github.com/perltzhu/source-map-version3-description#%E5%8E%8B%E7%BC%A9)压缩

source map 文件允许 GZIP 压缩

### [](https://github.com/perltzhu/source-map-version3-description#%E6%8B%93%E5%B1%95)拓展

额外的字段可以被添加到 source map，用来提供拓展的功能，通常它们以 "x\_" 开头。不过建议的命名规范是以域名为标准，举个例子，x_com_google_gwt_linecount

### [](https://github.com/perltzhu/source-map-version3-description#%E5%B7%B2%E7%9F%A5%E6%8B%93%E5%B1%95)已知拓展

"x_google_linecount"- source map 行的数量

## [](https://github.com/perltzhu/source-map-version3-description#%E7%BA%A6%E5%AE%9A)约定

### [](https://github.com/perltzhu/source-map-version3-description#source-map-%E5%91%BD%E5%90%8D)Source Map 命名

通常来说，一个 source map 文件都会以源文件名作为文件吗，以 ".map" 为拓展文件类型。举个例子，对于 "page.js" 源文件，source map 以 "page.js.map" 命名

### [](https://github.com/perltzhu/source-map-version3-description#%E9%93%BE%E6%8E%A5%E7%94%9F%E6%88%90%E5%90%8E%E7%9A%84%E6%96%87%E4%BB%B6%E5%92%8C%E6%BA%90%E6%96%87%E4%BB%B6)链接生成后的文件和源文件

在生成后的文件的结尾加入如下代码，可以使生成后的文件和源文件进行链接:

> //@ sourceMappingURL=target.js.map

例子: <http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js>

## [](https://github.com/perltzhu/source-map-version3-description#json-%E9%80%9A%E8%BF%87http-%E4%BC%A0%E8%BE%93)JSON 通过 HTTP 传输

通过重写 Array 构造器，直接利用 script src 引用一个 source map，可以造成 [XSSI](http://googleonlinesecurity.blogspot.com/2011/05/website-security-for-webmasters.html) 攻击。而服务器可以通过在响应内容前面添加 ")]}" 字符串可以有效的阻止 XSSI 攻击。

对于加载 sourcemap 文件，每次需要进行一次替换再转换为 JSON 对象，例子：

> JSON.parse(aSourceMap.replace(/^)]}'/, ''))

## [](https://github.com/perltzhu/source-map-version3-description#source-map%E4%BD%BF%E7%94%A8)source map 使用

### [](https://github.com/perltzhu/source-map-version3-description#%E7%BC%96%E8%AF%91%E5%91%BD%E4%BB%A4)编译命令

> java -jar /tools/clourse-compiler/compiler.jar --js map-test.js map-test2.js --create_source_map ./target.js.map --source_map_format=V3 --js_output_file target.js

### [](https://github.com/perltzhu/source-map-version3-description#%E5%90%AF%E7%94%A8)启用

Chrome 开发者工具中勾选 enable javascript source maps 开启。另外，如果想要生成后文件不支持 source map, 请去掉生成后的代码的 sourceMappingURL 注释

## [](https://github.com/perltzhu/source-map-version3-description#%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3)参考文档

-   [Source Map Revision 3 Proposal](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#)
-   [Closure Compiler](https://code.google.com/p/closure-compiler/)
-   [Source Map](https://github.com/mozilla/source-map)
-   [JavaScript Source Map 详解](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)
-   [Introduction to JavaScript Source Maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)
-   [website-security-for-webmasters](http://googleonlinesecurity.blogspot.com/2011/05/website-security-for-webmasters.html)