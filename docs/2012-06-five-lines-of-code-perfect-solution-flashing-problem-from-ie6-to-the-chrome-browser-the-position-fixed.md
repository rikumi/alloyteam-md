---
title: 五行代码终极完美解决从 IE6 到 Chrome 所有浏览器的 position:fixed; 以及闪动问题
date: 2012-06-29
author: TAT.Kinvix
source_link: http://www.alloyteam.com/2012/06/five-lines-of-code-perfect-solution-flashing-problem-from-ie6-to-the-chrome-browser-the-position-fixed/
---

<!-- {% raw %} - for jekyll -->

这个方法其实已经使用很久了，之前主要在嵌入式 WebQQ 等产品中用过，现在拿出来分享一下吧，是目前最简洁的方式来实现 ie6 的 position:fixed; 失效 bug，以及的其他方法的闪动问题，CSS 代码如下，很简单，自行修改调试即可：

`  
html {  
_background:url (about:blank); /* 阻止闪动 in IE6 , 把空文件换成 about:blank , 减少请求 */  
}`

/\* 你的图层 \*/  
.positionFixedLayer{  
position:fixed;  
\_position: absolute;  
\_top:expression(documentElement.scrollTop+documentElement.clientHeight-this.offsetHeight);  
\_left:expression(documentElement.scrollLeft+documentElement.clientWidth-this.offsetWidth-200);  
}

<!-- {% endraw %} - for jekyll -->