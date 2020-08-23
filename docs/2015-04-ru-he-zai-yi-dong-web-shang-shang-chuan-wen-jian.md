---
title: 如何在移动 web 上上传文件..
date: 2015-04-02
author: TAT.horde
source_link: http://www.alloyteam.com/2015/04/ru-he-zai-yi-dong-web-shang-shang-chuan-wen-jian/
---

<!-- {% raw %} - for jekyll -->

xmlhttprequest2.0 可以支持文件上传。这东东很方便，但是在实际使用中碰到了一些问题。这里记录下.

正常情况下我们是这样生成 2 进制文件的.

```javascript
//data为文件的base64编码
function dataURLtoBlob(data) {
    var tmp = data.split(",");
    tmp[1] = tmp[1].replace(/\s/g, "");
    var binary = atob(tmp[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: "image/jpeg" });
}
```

但是在 android 手机上可能会由于没有 blob 对象导致无法生成 blob. 怎么办捏。可以使用以下代码:

```javascript
function newBlob(data, datatype){
    var out;
    try {
        out = new Blob([data], {type: datatype});
        //一切正常,直接使用blob.
    } catch (e) {
        window.BlobBuilder = window.BlobBuilder ||
                window.WebKitBlobBuilder ||
                window.MozBlobBuilder ||
         &n
```


<!-- {% endraw %} - for jekyll -->