---
title: 复制粘贴的高级玩法
date: 2015-04-26
author: TAT.老教授
source_link: http://www.alloyteam.com/2015/04/how-to-paste-zhuangbility/
---

想做一个好用的在线编辑器，不管是地图编辑器、PPT 创作平台还是通过拖拽快速创建活动页面的编辑器等等，必然要给用户提供各种快捷的操作方法。如非常常用的复制粘贴功能。

举个例子，在 iPresst 创作平台，我们的作品在好几页都要用到同一张图片，总不能每次都点击上传一次图片吧？右键复制粘贴或者直接按快捷键无疑是最符合用户预期的操作方式，然而我们编辑器用到的元素一般比较特别，而且我们复制粘贴的时候经常要做一些特殊处理，此时我们就需要覆盖浏览器给我们提供的复制粘贴功能了。

[![QQ20150426-1@2x](http://www.alloyteam.com/wp-content/uploads/2015/04/QQ20150426-1@2x1.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/04/QQ20150426-1@2x1.jpg)

实现的原理也挺简单：

方法 1：监听键盘事件

```javascript
document.addEventListener(
    "keydown",
    function (e) {
        if (e.ctrlKey) {
            switch (e.keyCode) {
                case 88:
                    console.log("Ctrl + X, cutting");
                    break;
                case 67:
                    console.log("Ctrl + C, copying");
                    break;
                case 86:
                    console.log("Ctrl + V, pasting");
                    break;
                default:
            }
        }
    },
    false
);
```

此时我们要覆盖掉浏览器的默认右键菜单，不然快捷键和右键菜单的复制粘贴操作效果不一致。这并不奇怪，一般的稍复杂的编辑器都有定制自己的右键菜单。

```javascript
document.addEventListener(
    "contextmenu",
    function (e) {
        e.preventDefault();
        console.log("show my context menu");
    },
    false
);
```

方法 2：直接覆盖剪切复制粘贴事件

```javascript
document.addEventListener(
    "cut",
    function (e) {
        e.preventDefault();
        console.log("Ctrl + X, cutting");
    },
    false
);
document.addEventListener(
    "copy",
    function (e) {
        e.preventDefault();
        console.log("Ctrl + C, copying");
    },
    false
);
document.addEventListener(
    "paste",
    function (e) {
        e.preventDefault();
        console.log("Ctrl + V, pasting");
    },
    false
);
```

如此我们就可以定制我们编辑器的特色复制粘贴功能。

（完）

开玩笑，如果就这样结束那也太水了，前面那些只是铺垫，铺垫，咳咳。

上面的代码只是实现了编辑器的内部元素复制粘贴的闭环，那来自外部的元素呢？如别的地方拷贝的一段文本，如用 QQ 截了一张图，能否直接粘贴在我们的编辑器生成特有的文本元素、图片元素？

这就是接下去要讲的高级玩法，Clipboard API。

其实访问剪贴板的数据这并不新鲜，早在多年前 IE 就支持了，我们可以通过下面的方式访问：

    window.clipboardData.clearData();  
    window.clipboardData.setData('Text', 'abcd');
    // window.clipboardData.setData('Text');

但这种接口注定沦为历史的尘埃。为什么？不安全！如果用户打开一个网页，在他不知不觉中 JavaScript 就访问了系统剪贴板的数据，然后上传到服务器或者做各种猥琐的操作，那用户会泄露多少的隐私。所以在新的浏览器如 chrome 是不支持这种接口的，一般情况下 js 代码是访问不到系统的剪贴板，我们在网上看到的点击复制网址之类的功能，基本都是用 Flash 来实现。

那如果用户点击了浏览器右键菜单的复制粘贴或按下相应快捷键，此时访问剪贴板就合理了，而浏览器确实是这么做的。前面提到的方法 1 监听键盘事件是不行的，此时必须使用方法 2，我们可以通过下面代码获取到剪贴板里的图片或者文本：

```javascript
document.addEventListener('paste', function(e){
    var clipboard = e.clipboardData;
    // 有无内容
    if(!clipboard.items || !clipboard.items.length){
        clear();
        return;
    }
    
    var temp;
    if((temp = clipboard.items[0]) &amp;&amp; temp.kind === 'file' &amp;&amp; temp.type.indexOf('image') === 0){
        // 获取图片文件
        var imgFile = temp.getAsFile();
        // TODO: 做爱做的事
    } else if(temp = clipboard.getData('text/plain')){
        // 将文本预格式化
        var splitList = temp.split(/\n/);
        temp = '';
        for(var i = 0, len = splitList.length; i &lt; len; i++){
            temp += splitList[i].replace(/\t/g, '&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;')
                .replace(/ /g, '&amp;nbsp;') + '&lt;br&gt;';
        }
        // TODO: 做爱做的事
    }
}, false);
```

要注意两个小点，第一，我们通过上面获取到的图片文件是一个 file 对象，这跟我们从一个 type=file 的上传文件节点监听 change 事件，通过 e.target.files\[0] 拿到的 file 对象是一样的（之所以监听 change 是为了实现选择文件即时上传的效果不用额外点击上传按钮）。从 file 对象中可以获取到图片的 base64 编码：

```javascript
var reader = new FileReader();
reader.onload = function (e) {
    var src = e.target.result; // Todo
};
reader.readAsDataURL(imgFile);
```

file 对象中还可以获取到文件类型等信息，大家想更深入了解可以搜索 e.target.files 。

第二个要注意的点是从剪贴板获取到的文本是系统格式的，如果我们不做处理直接通过类似 innerHTML 的方法使用，会导致换行丢失等显示问题。

Ok，大家可以在 iPresst 的编辑创作页面体验效果，QQ 截完图可以直接粘贴进来的感觉就是爽！

但是这时候有另外一个问题，怎么保持内部元素的复制和外部元素复制的统一？简单讲，我在编辑器里面复制了我的特有元素，此时系统的剪贴板不管有什么都应该被覆盖，反之亦然，我在编辑器里面复制一个特有元素，然后在别的地方复制了一段文本，那此时我在编辑器里面粘贴应该是粘贴这段文本而不是粘贴之前的特有元素。

要做到这一点，只要处理好两个事情：在编辑器里剪切复制的时候覆盖剪贴板、在编辑器里粘贴时区分要粘贴的是内部元素还是外部元素。程序员嘛，直接上代码：

```javascript
var defaultText = "iPresst，一个性感的网站";
document.addEventListener(
    "paste",
    function (e) {
        e.clipboardData.setData("text/plain", defaultText);
        e.clipboardData.setData("text/ipresst", "ipresst");
        eventType = "cut"; // TODO: 获取要剪切的内部元素
    },
    false
);
document.addEventListener(
    "paste",
    function (e) {
        e.clipboardData.setData("text/plain", defaultText);
        e.clipboardData.setData("text/ipresst", "ipresst");
        eventType = "copy"; // TODO: 获取要复制的内部元素
    },
    false
);
document.addEventListener(
    "paste",
    function (e) {
        var clipboard = e.clipboardData; // 有无内容
        if (!clipboard.items || !clipboard.items.length) {
            clear();
            return;
        } // 先区分是内部粘贴还是外部粘贴
        if (clipboard.getData("text/ipresst") === "ipresst") {
            if (!eventType || !elList.length) {
                // TODO: 清空标志位
                return;
            } // 粘贴
            if (eventType === "cut") {
                // TODO: 剪切粘贴
            } else {
                // TODO: 复制粘贴
            }
        } else {
            var temp; // …… // 此处略去N行前面贴过的代码
        }
    },
    false
);
```

我们在剪贴板里面设置了我们的特色数据 text/ipresst ，如果用户在其他地方剪切复制了东西，剪贴板会被清空这个标志位就不存在，所以可以用来区分内部粘贴和外部粘贴。而这行代码

    e.clipboardData.setData('text/plain', defaultText);

则让我们复制了内部元素然后在外面如 QQ 聊天窗口粘贴时（显然在聊天窗口没法粘贴我们编辑器的内部特有元素），贴出文本：iPresst，一个性感的网站。so cool！

此时我们内部和外部的闭环就打通了。只是很遗憾地，为了保持交互逻辑的一致性，我不得不把 iPresst 的自定义右键菜单中剪切、复制、粘贴这几项去掉，因为点击事件没法访问到剪贴板对象（只有 cut\\copy\\paste 可以访问到），也就说没法粘贴外部元素，和按下快捷键的表现是不一致的。这一点没有更好的解决方案，当然你放弃自定义右键菜单就不会有这个问题。

或许有人会说：那我们可以点击右键菜单的复制粘贴时，通过 execCommand 或者模拟键盘事件来触发 cut、copy、paste 事件，那不就可以访问到剪贴板了？我只能说：朋友，你想多了。那样会跟前面讨论的 IE 的接口一样，有安全风险的，我自测过在 chrome 是行不通的。在 caniuse.com 上面也是这样写：

[![QQ20150426-5@2x](http://www.alloyteam.com/wp-content/uploads/2015/04/QQ20150426-5@2x.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/04/QQ20150426-5@2x.jpg)

至此，复制粘贴的高级玩法讲完了，虽说还有点小不满意的点，但还是一个比较推荐的实用性挺高的实践。

（完）

（真的完了）