---
title: JS 计算字符串所占字节数
date: 2013-12-31
author: TAT.iAzrael
source_link: http://www.alloyteam.com/2013/12/js-calculate-the-number-of-bytes-occupied-by-a-string/
---

<!-- {% raw %} - for jekyll -->

废话不说，直接正题吧。

最近项目有个需求要用 js 计算一串字符串写入到 localStorage 里所占的内存，众所周知的，js 是使用 Unicode 编码的。而 Unicode 的实现有 N 种，其中用的最多的就是 UTF-8 和 UTF-16。因此本文只对这两种编码进行讨论。

下面这个定义摘自维基百科（<http://zh.wikipedia.org/zh-cn/UTF-8>），做了部分删减。

> UTF-8（8-bit Unicode Transformation Format）是一种针对 Unicode 的可变长度字符编码，可以表示 Unicode 标准中的任何字符，且其编码中的第一个字节仍与 ASCII 相容，使用一至四个字节为每个字符编码

其编码规则如下：

1.  字符代码在 000000 - 00007F 之间的，用一个字节编码；
2.  000080 - 0007FF 之间的字符用两个字节；
3.  000800 - 00D7FF 和 00E000 - 00FFFF 之间的用三个字节，注: Unicode 在范围 D800-DFFF 中不存在任何字符；
4.  010000 - 10FFFF 之间的用 4 个字节。

而 [UTF-16](http://zh.wikipedia.org/zh-cn/UTF-16) 则是定长的字符编码，大部分字符使用两个字节编码，字符代码超出 65535 的使用四个字节，如下：

1.  000000 - 00FFFF 两个字节；
2.  010000 - 10FFFF 四个字节。

一开始认为既然页面用的是 UTF-8 编码，那么存入 localStorage 的字符串，应该也是用 UTF-8 编码的。但后来测试发现，明明计算出的 size 是不到 5MB，存入 localStorage 却抛异常了。想了想，页面的编码是可以改的。如果 localStorage 按照页面的编码存字符串，不就乱套了？浏览器应该都是使用 UTF-16 编码的。用 UTF-16 编码计算出 5MB 的字符串，果然顺利写进去了。超过则失败了。

好了，附上代码实现。计算规则就是上面写的，为了计算速度，把两个 for 循环分开写了。

```ruby
    /**
     * 计算字符串所占的内存字节数，默认使用UTF-8的编码方式计算，也可制定为UTF-16
     * UTF-8 是一种可变长度的 Unicode 编码格式，使用一至四个字节为每个字符编码
     * 
     * 000000 - 00007F(128个代码)      0zzzzzzz(00-7F)                             一个字节
     * 000080 - 0007FF(1920个代码)     110yyyyy(C0-DF) 10zzzzzz(80-BF)             两个字节
     * 000800 - 00D7FF 
       00E000 - 00FFFF(61440个代码)    1110xxxx(E0-EF) 10yyyyyy 10zzzzzz           三个字节
     * 010000 - 10FFFF(1048576个代码)  11110www(F0-F7) 10xxxxxx 10yyyyyy 10zzzzzz  四个字节
     * 
     * 注: Unicode在范围 D800-DFFF 中不存在任何字符
     * {@link http://zh.wikipedia.org/wiki/UTF-8}
     * 
     * UTF-16 大部分使用两个字节编码，编码超出 65535 的使用四个字节
     * 000000 - 00FFFF  两个字节
     * 010000 - 10FFFF  四个字节
     * 
     * {@link http://zh.wikipedia.org/wiki/UTF-16}
     * @param  {String} str 
     * @param  {String} charset utf-8, utf-16
     * @return {Number}
     */
    var sizeof = function(str, charset){
        var total = 0,
            charCode,
            i,
            len;
        charset = charset ? charset.toLowerCase() : '';
        if(charset === 'utf-16' || charset === 'utf16'){
            for(i = 0, len = str.length; i &lt; len; i++){
                charCode = str.charCodeAt(i);
                if(charCode &lt;= 0xffff){
                    total += 2;
                }else{
                    total += 4;
                }
            }
        }else{
            for(i = 0, len = str.length; i &lt; len; i++){
                charCode = str.charCodeAt(i);
                if(charCode &lt;= 0x007f) {
                    total += 1;
                }else if(charCode &lt;= 0x07ff){
                    total += 2;
                }else if(charCode &lt;= 0xffff){
                    total += 3;
                }else{
                    total += 4;
                }
            }
        }
        return total;
    }
```


<!-- {% endraw %} - for jekyll -->