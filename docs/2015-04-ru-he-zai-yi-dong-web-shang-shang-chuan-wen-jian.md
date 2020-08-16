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
function newBlob(data, datatype) {
    var out;
    try {
        out = new Blob([data], { type: datatype }); //一切正常,直接使用blob.
    } catch (e) {
        window.BlobBuilder =
            window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;
        if (e.name == "TypeError" && window.BlobBuilder) {
            var bb = new BlobBuilder();
            bb.append(data.buffer);
            out = bb.getBlob(datatype); //还可以抢救一下..使用blobbuilder来生成文件..
        } else {
            //没救了,放弃治疗.
        }
    }
    return out;
}
```

ok. 现在文件已经 ready 了.

我们创建一个 formadata

```javascript
var file = dataURLtoBlob(img);
fd.append("img", file);
```

愉快的上传.... 然后... 然后... 没有然后了... 抓包看下.

```html
<span style="color:rgb(0, 0, 0)">------</span><span style="color:rgb(43, 145, 175)">WebKitFormBoundarysToAVAYMLPFfJF96</span><span style="color:rgb(0, 0, 0)">
 </span><span style="color:rgb(43, 145, 175)">Content</span><span style="color:rgb(0, 0, 0)">-</span><span style="color:rgb(43, 145, 175)">Disposition</span><span style="color:rgb(0, 0, 0)">:</span><span style="color:rgb(0, 0, 0)"> form</span><span style="color:rgb(0, 0, 0)">-</span><span style="color:rgb(0, 0, 0)">data</span><span style="color:rgb(0, 0, 0)">;</span><span style="color:rgb(0, 0, 0)"> name</span><span style="color:rgb(0, 0, 0)">=</span><span style="color:rgb(128, 0, 0)">"img"</span><span style="color:rgb(0, 0, 0)">;</span><span style="color:rgb(0, 0, 0)"> filename</span><span style="color:rgb(0, 0, 0)">=</span><span style="color:rgb(128, 0, 0)">"blob"</span><span style="color:rgb(0, 0, 0)">
 </span><span style="color:rgb(43, 145, 175)">Content</span><span style="color:rgb(0, 0, 0)">-</span><span style="color:rgb(43, 145, 175)">Type</span><span style="color:rgb(0, 0, 0)">:</span><span style="color:rgb(0, 0, 0)"> application</span><span style="color:rgb(0, 0, 0)">/</span><span style="color:rgb(0, 0, 0)">octet</span><span style="color:rgb(0, 0, 0)">-</span><span style="color:rgb(0, 0, 0)">stream
 
 
 </span><span style="color:rgb(0, 0, 0)">------</span><span style="color:rgb(43, 145, 175)">WebKitFormBoundarysToAVAYMLPFfJF96</span><span style="color:rgb(0, 0, 0)">--</span>
```

文件的内容呢...

好吧.. 既然没法愉快用 formdata.. 那么就自己动手生成一个 post 的包体吧... 下面是相关的代码..

```javascript
function FormDataShim() {
    var o = this,
        parts = [], // Data to be sent
        boundary =
            Array(5).join("-") +
            (+new Date() * (1e16 * Math.random())).toString(32),
        oldSend = XMLHttpRequest.prototype.send;
    this.append = function (name, value, filename) {
        parts.push(
            "--" +
                boundary +
                '\r\nContent-Disposition: form-data; name="' +
                name +
                '"'
        );
        if (value instanceof Blob) {
            parts.push(
                '; filename="' +
                    (filename || "blob") +
                    '"\r\nContent-Type: ' +
                    value.type +
                    "\r\n\r\n"
            );
            parts.push(value);
        } else {
            parts.push("\r\n\r\n" + value);
        }
        parts.push("\r\n");
    }; //把xhr的send方法重写一下.
    XMLHttpRequest.prototype.send = function (val) {
        var fr,
            data,
            oXHR = this;
        if (val === o) {
            // 最后加一下boundary..注意这里一定要在最后加\r\n..否则服务器有可能会解析参数失败..
            parts.push("--" + boundary + "--\r\n");
            data = new XBlob(parts);
            fr = new FileReader();
            fr.onload = function () {
                oldSend.call(oXHR, fr.result);
            };
            fr.onerror = function (err) {
                throw err;
            };
            fr.readAsArrayBuffer(data); // 设置content-type
            this.setRequestHeader(
                "Content-Type",
                "multipart/form-data; boundary=" + boundary
            );
            XMLHttpRequest.prototype.send = oldSend;
        } else {
            oldSend.call(this, val);
        }
    };
}
```

最后完整的代码长这样.

```javascript
function newBlob(data, datatype) {
    var out;
    try {
        out = new Blob([data], { type: datatype });
    } catch (e) {
        window.BlobBuilder =
            window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;
        if (e.name == "TypeError" && window.BlobBuilder) {
            var bb = new BlobBuilder();
            bb.append(data.buffer);
            out = bb.getBlob(datatype);
        } else if (e.name == "InvalidStateError") {
            out = new Blob([data], { type: datatype });
        } else {
        }
    }
    return out;
}
// 判断是否需要blobbuilder
var needsFormDataShim = (function () {
        var bCheck =
            ~navigator.userAgent.indexOf("Android") &&
            ~navigator.vendor.indexOf("Google") &&
            !~navigator.userAgent.indexOf("Chrome");
        return (
            bCheck &&
            navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534
        );
    })(),
    blobConstruct = !!(function () {
        try {
            return new Blob();
        } catch (e) {}
    })(),
    XBlob = blobConstruct
        ? window.Blob
        : function (parts, opts) {
              var bb = new (window.BlobBuilder ||
                  window.WebKitBlobBuilder ||
                  window.MSBlobBuilder)();
              parts.forEach(function (p) {
                  bb.append(p);
              });
              return bb.getBlob(opts ? opts.type : undefined);
          };
function FormDataShim() {
    // Store a reference to this
    var o = this,
        parts = [], // Data to be sent
        boundary =
            Array(5).join("-") +
            (+new Date() * (1e16 * Math.random())).toString(32),
        oldSend = XMLHttpRequest.prototype.send;
    this.append = function (name, value, filename) {
        parts.push(
            "--" +
                boundary +
                '\r\nContent-Disposition: form-data; name="' +
                name +
                '"'
        );
        if (value instanceof Blob) {
            parts.push(
                '; filename="' +
                    (filename || "blob") +
                    '"\r\nContent-Type: ' +
                    value.type +
                    "\r\n\r\n"
            );
            parts.push(value);
        } else {
            parts.push("\r\n\r\n" + value);
        }
        parts.push("\r\n");
    }; // Override XHR send()
    XMLHttpRequest.prototype.send = function (val) {
        var fr,
            data,
            oXHR = this;
        if (val === o) {
            //注意不能漏最后的\r\n ,否则有可能服务器解析不到参数.
            parts.push("--" + boundary + "--\r\n");
            data = new XBlob(parts);
            fr = new FileReader();
            fr.onload = function () {
                oldSend.call(oXHR, fr.result);
            };
            fr.onerror = function (err) {
                throw err;
            };
            fr.readAsArrayBuffer(data);
            this.setRequestHeader(
                "Content-Type",
                "multipart/form-data; boundary=" + boundary
            );
            XMLHttpRequest.prototype.send = oldSend;
        } else {
            oldSend.call(this, val);
        }
    };
}
//把图片转成formdata 可以使用的数据...
//这里要把\s替换掉..要不然atob的时候会出错....
function dataURLtoBlob(data) {
    var tmp = data.split(",");
    tmp[1] = tmp[1].replace(/\s/g, "");
    var binary = atob(tmp[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new newBlob(new Uint8Array(array), "image/jpeg");
}
function uploadFile(img) {
    var fd = needsFormDataShim ? new FormDataShim() : new FormData();
    var file = dataURLtoBlob(img);
    fd.append("img", file);
    var prog = function (e) {
        /*你的逻辑*/
    };
    var load = function (e) {
        /*你的逻辑*/
    };
    var error = function (e) {
        /*你的逻辑*/
    };
    var abort = function (e) {
        /*你的逻辑*/
    };
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", prog, false);
    xhr.addEventListener("load", load, false);
    xhr.addEventListener("error", error, false);
    xhr.addEventListener("abort", abort, false);
    xhr.onreadystatechange = function () {
        /*你的逻辑*/
    };
    xhr.open("POST", "/upload", true);
    xhr.send(fd);
}
```

参考:

<http://stackoverflow.com/questions/15639070/empty-files-uploaded-in-android-native-browser/28809955#28809955>

<!-- {% endraw %} - for jekyll -->