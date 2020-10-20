---
title: 完美实现溢出文本省略
date: 2011-10-25
author: TAT.iAzrael
source_link: http://www.alloyteam.com/2011/10/js-text-overflow/
---

<!-- {% raw %} - for jekyll -->

文本溢出展示省略号的需求经常都会用到，而对于新式的浏览器，这完全不是问题，因为 css3 里面已经有实现 text-overflow：ellipsis，但是最新 w3c 文档中却移除了这个属性，即使这样，也有不少浏览器实现了这个特性。其浏览器支持情况如下：

    IE	Firefox	Opera	Safari	Chrome
    6+	-	11.0+	3.0+	1.0+

可以看到，只有 firefox 和 opera11 一下的版本不支持这个浏览器，以此也可以放心大胆的用了。但是遇到要求高的产品经理时（╮(╯\_╰)╭），就不得不考虑 firefox 等不支持的浏览器了，唯有使用 js 进行字符截断。

比较简单的截断方式就是按字符个数截断，以一个中文宽度等于两个英文宽度为前提，根据给定字符个数进行截取。但是字符在页面显示的时候，其宽度并不是一定的，会根据不同的字体和字体大小的不同而不同，更何况字母 i 和 A 的宽度是不一样的，存在 bug 且不够精确。

这里使用一种方法，通过给需要截取字符的节点附加一个兄弟节点（使用同样的 class 和 style），通过计算各个字符在这个兄弟节点里面所占的宽度来限制字符个数。

代码如下：

```javascript
var ellipsis = function (element) {
    var limitWidth = element.clientWidth;
    var ellipsisText = "…";
    var temp = element.cloneNode(true);
    temp.id = "checkTextLengthNode";
    temp.className = "check-text-length-node";
    element.parentNode.appendChild(temp);
    var realWidth = temp.clientWidth;
    if (realWidth &lt;= limitWidth) {
        return;
    }
    temp.innerHTML = ellipsisText;
    var elliWidth = temp.clientWidth;
    var str = element.innerHTML;
    str = str.replace(/\s+/g, " ");
    var s,
        totalWidth = 0;
    for (var i = 0, len = str.length; i &lt; len; i++) {
        s = str.charAt(i);
        temp.innerHTML = s === " " ? "&nbsp;" : s;
        totalWidth += temp.clientWidth;
        if (totalWidth + elliWidth > limitWidth) {
            str = str.substr(0, i);
            break;
        }
    }
    element.innerHTML = str + ellipsisText;
    temp.parentNode.removeChild(temp);
};
```

处理字符的时候需要注意的两个个地方就是：

1.  在页面中连续的空格是会被当成一个空格处理的，因此要把连续的空格合并成一个；
2.  直接给 innerHTML 赋值空格 ' '，其是不会占宽度的，因此要转换成 html 的空格表示。

通过不断添加新字符并监测添加后的宽度，就可以做到自适应不同的字体和字体大小了。具体例子[点击](http://alloyteam.com/demo/text-overflow-ellipsis-demo.html "text-overflow-ellipsis-demo")这里查看，这个 demo 对 text-overflow 的支持进行了检测，如果支持 ellipsis，就直接使用 css 的，毕竟 js 计算能省一点是一点。检测 css 属性及其支持情况可以查看[这篇文章](http://alloyteam.com/2011/10/%e5%88%a4%e6%96%ad%e6%b5%8f%e8%a7%88%e5%99%a8%e6%98%af%e5%90%a6%e6%94%af%e6%8c%81%e6%8c%87%e5%ae%9acss%e5%b1%9e%e6%80%a7%e5%92%8c%e6%8c%87%e5%ae%9a%e5%80%bc/ "判断浏览器是否支持指定 CSS 属性和指定值")。


<!-- {% endraw %} - for jekyll -->