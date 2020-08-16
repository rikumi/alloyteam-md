---
title: canvas 保存为 data:image 扩展功能的实现
date: 2012-02-09
author: TAT.岑安
source_link: http://www.alloyteam.com/2012/02/canvas%e4%bf%9d%e5%ad%98%e4%b8%badataimage%e6%89%a9%e5%b1%95%e5%8a%9f%e8%83%bd%e7%9a%84%e5%ae%9e%e7%8e%b0/
---

<!-- {% raw %} - for jekyll -->

【已知】  
canvas 提供了 toDataURL 的接口，可以方便的将 canvas 画布转化成 base64 编码的 image。目前支持的最好的是 png 格式，jpeg 格式的现代浏览器基本也支持，但是支持的不是很好。

【想要的】  
往往这么简单直接的接口通常都满足不了需求。我想要的不仅是简单的通过画布生成一个 png，我不想新开一个 tab，然后还要右键另存为...

我还需要更方便的自由的配置生成的图片的大小，比例等。

另外如果我还要别的图片格式，比如位图 bmp，gif 等怎么办...

【解决办法】  
a) 想直接把图片生成后 download 到本地，其实办法也很简单。直接改图片的 mimeType，强制改成 steam 流类型的。比如 ‘image/octet-stream’，浏览器就会自动帮我们另存为..

b) 图片大小，及比例的可控倒也好办，我们新建一个我们想要大小的 canvas，把之前的 canvas 画布重新按照所要的比例，及大小 draw 到新的 canvas 上，然后用新的 canvas 来 toDataURL 即可。

c) 想要 bmp 位图会麻烦些... 没有直接的接口，需要我们自己来生成。生成图片的响应头和响应体有一定的规则，略显麻烦。不过还能接受。剩下的就是性能问题，按像素级别来操作，对于一个大图来说计算量很有压力。  
【实现】

```javascript
 
/**
 * covert canvas to image
 * and save the image file
 */
 
var Canvas2Image = function () {
 
    // check if support sth.
    var $support = function () {
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
 
        return {
            canvas: !!ctx,
            imageData: !!ctx.getImageData,
            dataURL: !!canvas.toDataURL,
            btoa: !!window.btoa
        };
    }();
 
    var downloadMime = 'image/octet-stream';
 
    function scaleCanvas (canvas, width, height) {
        var w = canvas.width,
            h = canvas.height;
        if (width == undefined) {
            width = w;
        }
        if (height == undefined) {
            height = h;
        }
 
        var retCanvas = document.createElement('canvas');
        var retCtx = retCanvas.getContext('2d');
        retCanvas.width = width;
        retCanvas.height = height;
        retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
        return retCanvas;
    }
 
    function getDataURL (canvas, type, width, height) {
        canvas = scaleCanvas(canvas, width, height);
        return canvas.toDataURL(type);
    }
 
    function saveFile (strData) {
        document.location.href = strData;
    }
 
    function genImage(strData) {
        var img = document.createElement('img');
        img.src = strData;
        return img;
    }
    function fixType (type) {
        type = type.toLowerCase().replace(/jpg/i, 'jpeg');
        var r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
    }
    function encodeData (data) {
        if (!window.btoa) { throw 'btoa undefined' }
        var str = '';
        if (typeof data == 'string') {
            str = data;
        } else {
            for (var i = 0; i  B
        imgHeader.push(0x4d); // 77 -> M
 
        var fsize = width * height * 3 + 54; // header size:54 bytes
        imgHeader.push(fsize % 256); // r
        fsize = Math.floor(fsize / 256);
        imgHeader.push(fsize % 256); // g
        fsize = Math.floor(fsize / 256);
        imgHeader.push(fsize % 256); // b
        fsize = Math.floor(fsize / 256);
        imgHeader.push(fsize % 256); // a
 
        imgHeader.push(0);
        imgHeader.push(0);
        imgHeader.push(0);
        imgHeader.push(0);
 
        imgHeader.push(54); // offset -> 6
        imgHeader.push(0);
        imgHeader.push(0);
        imgHeader.push(0);
 
        // info header
        imgInfoHeader.push(40); // info header size
        imgInfoHeader.push(0);
        imgInfoHeader.push(0);
        imgInfoHeader.push(0);
 
        // 横向info
        var _width = width;
        imgInfoHeader.push(_width % 256);
        _width = Math.floor(_width / 256);
        imgInfoHeader.push(_width % 256);
        _width = Math.floor(_width / 256);
        imgInfoHeader.push(_width % 256);
        _width = Math.floor(_width / 256);
        imgInfoHeader.push(_width % 256);
 
        // 纵向info
        var _height = height;
        imgInfoHeader.push(_height % 256);
        _height = Math.floor(_height / 256);
        imgInfoHeader.push(_height % 256);
        _height = Math.floor(_height / 256);
        imgInfoHeader.push(_height % 256);
        _height = Math.floor(_height / 256);
        imgInfoHeader.push(_height % 256);
 
        imgInfoHeader.push(1);
        imgInfoHeader.push(0);
        imgInfoHeader.push(24); // 24位bitmap
        imgInfoHeader.push(0);
 
        // no compression
        imgInfoHeader.push(0);
        imgInfoHeader.push(0);
        imgInfoHeader.push(0);
        imgInfoHeader.push(0);
 
        // pixel data
        var dataSize = width * height * 3;
        imgInfoHeader.push(dataSize % 256);
        dataSize = Math.floor(dataSize / 256);
        imgInfoHeader.push(dataSize % 256);
        dataSize = Math.floor(dataSize / 256);
        imgInfoHeader.push(dataSize % 256);
        dataSize = Math.floor(dataSize / 256);
        imgInfoHeader.push(dataSize % 256);
 
        // blank space
        for (var i = 0; i < 16; i ++) {
            imgInfoHeader.push(0);
        }
 
        var padding = (4 - ((width * 3) % 4)) % 4;
        var imgData = data.data;
        var strPixelData = '';
        var y = height;
        do {
            var offsetY = width * (y - 1) * 4;
            var strPixelRow = '';
            for (var x = 0; x < width; x ++) {
                var offsetX = 4 * x;
                strPixelRow += String.fromCharCode(imgData[offsetY + offsetX + 2]);
                strPixelRow += String.fromCharCode(imgData[offsetY + offsetX + 1]);
                strPixelRow += String.fromCharCode(imgData[offsetY + offsetX]);
            }
            for (var n = 0; n < padding; n ++) {
                strPixelRow += String.fromCharCode(0);
            }
 
            strPixelData += strPixelRow;
        } while(-- y);
 
        return (encodeData(imgHeader.concat(imgInfoHeader)) + encodeData(strPixelData));
 
    };
 
    /**
     * saveAsImage
     * @param canvasElement
     * @param {String} image type
     * @param {Number} [optional] png width
     * @param {Number} [optional] png height
     */
    var saveAsImage = function (canvas, width, height, type) {
        if ($support.canvas && $support.dataURL) {
            if (type == undefined) { type = 'png'; }
            type = fixType(type);
            if (/bmp/.test(type)) {
                var data = getImageData(scaleCanvas(canvas, width, height));
                var strData = genBitmapImage(data);
                saveFile(makeURI(strData, downloadMime));
            } else {
                var strData = getDataURL(canvas, type, width, height);
                saveFile(strData.replace(type, downloadMime));
            }
        
        }
    }
 
    var convertToImage = function (canvas, width, height, type) {
        if ($support.canvas && $support.dataURL) {
            if (type == undefined) { type = 'png'; }
            type = fixType(type);
 
            if (/bmp/.test(type)) {
                var data = getImageData(scaleCanvas(canvas, width, height));
                var strData = genBitmapImage(data);
                return genImage(makeURI(strData, 'image/bmp'));
            } else {
                var strData = getDataURL(canvas, type, width, height);
                return genImage(strData);
            }
        }
    }
 
 
    return {
        saveAsImage: saveAsImage,
        saveAsPNG: function (canvas, width, height) {
            return saveAsImage(canvas, width, height, 'png');
        },
        saveAsJPEG: function (canvas, width, height) {
            return saveAsImage(canvas, width, height, 'jpeg');            
        },
        saveAsGIF: function (canvas, width, height) {
            return saveAsImage(canvas, width, height, 'gif')           
        },
        saveAsBMP: function (canvas, width, height) {
            return saveAsImage(canvas, width, height, 'bmp');           
        },
        
        convertToImage: convertToImage,
        convertToPNG: function (canvas, width, height) {
            return convertToImage(canvas, width, height, 'png');
        },
        convertToJPEG: function (canvas, width, height) {
            return convertToImage(canvas, width, height, 'jpeg');               
        },
        convertToGIF: function (canvas, width, height) {
            return convertToImage(canvas, width, height, 'gif');              
        },
        convertToBMP: function (canvas, width, height) {
            return convertToImage(canvas, width, height, 'bmp');              
        }
    };
 
}();
 
```

【Demo】  
<http://hongru.github.com/proj/canvas2image/index.html>  
可以试着在 canvas 上涂涂画画，然后保存看看。如果用 bmp 格式的话，需要支持 btoa 的 base64 编码，关于 base64 编码规则可看上一篇博文

【不完美的地方】  
1）jpeg 接口本身就不完善，当 canvas 没有填充颜色或图片时，保存的 jpeg 由于是直接由 png 的 alpha 通道强制转换过来的，所以在 png 的透明部分在 jpeg 里面就是黑色的。

2）gif 的限制太多。且可用性不大，有 png 就够了

3）bmp 位图生成，计算量稍显大了。

4）由于是强制改 mimeType 来实现的自动下载，所以下载的时候文件类型不会自动识别。

本文也同步发表到博主另一个 [blog](http://hongru.cnblogs.com/) 中


<!-- {% endraw %} - for jekyll -->