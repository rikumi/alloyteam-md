---
title: 八一下 LocalStorage 本地存储的卦
date: 2012-04-03
author: TAT.pel
source_link: http://www.alloyteam.com/2012/04/sth-about-localstorage/
---

<!-- {% raw %} - for jekyll -->

# 什么是本地存储

以下内容从网上抄来的

> HTML5 storage 提供了一种方式让网站能够把信息存储到你本地的计算机上，并再以后需要的时候进行获取。这个概念和 cookie 相似，区别是它是为了更大容量存储设计的。Cookie 的大小是受限的，并且每次你请求一个新的页面的时候 cookie 都会被发送过去。HTML5 的 storage 是存储在你的计算机上，网站在页面加载完毕后可以通过 Javascript 来获取这些数据。  
> 简单的说本地存储是 HTML5 的一部分。更为详细准确的说是本地存储过去是 HTML5 的标准中的一部分，而后来由于有些工作组的人表示 HTML5 太庞大了，于是就剥离出来作为一个单独的标准。这听起来好像是把一块馅饼分成很多块目的是为了减少总的卡路里……

# 为什么要用本地存储

其实前面已经提到了，用本地存储有这些好处

-   本地存储和 cookie 一样提供了把数据保存到本地的能力，页面刷新或者关掉浏览器后，数据依然存在
-   大！虽然不同浏览器的标准可能不一样，主流的一般都在 5~10M，比 cookie 的 4k 强多了
-   本地存储的数据不会被发到服务器，与 cookie 相比，节省带宽，加快响应速度

所以，如果需要保存一些数据到用户的浏览器，而这些数据又不需要每个请求都提交给服务器，不妨考虑使用本地存储。

# 如何使用

首先，得检查浏览器是否支持本地存储  
可以通过检测 window 下面是否有 localStorage 字段来判断，但是在 IE 下，本地文件是不能访问 localStorage 的，此时 localStorage 字段为空，所以还要加上判断

```javascript
"localStorage" in window && window["localStorage"] !== null;
```

还有一种情况，假如页面里有 id 为 localStorage 的元素，某些浏览器可以通过 window.localStorage 索引到这个元素 -\_\_\_,-||  
为了避免你的代码在遇到如此蛋疼的 DOM 时跪掉，我建议是使用特征检查

     window.localStorage && window.localStorage.getItem

确定浏览器支持 localStorage 后，我们就可以使用它的接口了，localStorage 的使用方法很简单，在 chrome 的控制台里面打印一下 localStorage，就能列出它的全部方法，我相信很多人一看就能明白了。  
![](http://www.alloyteam.com/wp-content/uploads/2012/04/ls.jpg "localStorage")  
我们主要用到的  
`  
length：本地存储数据的个数  
setItem (key,value)：向 key 字段写入 value 数据  
getItem (key)：去 key 字段的数据  
removeItem (key)：移除 key 字段  
clear ()：清空该域下的所有数据  
key (i)：获取第 i 个数据的 key   `  
我们还可以像操作一个 Object 一样操作 localStorage

```javascript
var ls = localStorage;
ls["user"] = "John";
ls.setItem("work", "codding");
console.info(ls.length); //2
console.info(ls.user + " is " + ls.work); //John is codding
ls["work"] = "debugging";
console.info(ls.user + " is " + ls.work); //John is debugging
delete ls["work"];
for (var i in ls) {
    console.info(i + " : " + ls.getItem(i)); //user : John
    ls.removeItem(i);
}
```

唯一不同的是，对于一个不存在的字段 notExist，localStorage.getItem ('notExist') 会返回 null，而 localStorage\['notExist'] 则返回 undefined。

# 一些细节

看到这里，你已经掌握了使用本地存储的方法了，下面的是我使用过程中的一些心得。  
本地存储只能存字符串数据，所有数据在写入的时候会被隐式调用 toString 方法转为字符串，即

```javascript
var ls = localStorage;
var data = {
    user: "John",
    sex: "female",
};
ls.setItem("data", data);
ls.setItem("realData", JSON.stringify(data));
console.info(ls.data); //[object Object]
console.info(ls.realData); //{"user":"John","sex":"female"}
```

因此，需要存储 json 之类的数据时，需要自己做转换。  
不同浏览器，分配给本地存储的空间是不一样的，譬如 chrome 是 5M。这 5M 是整个子域共享的，例如 [http://www.alloyteam.com/2012/04/codejam/ 和](http://www.alloyteam.com/2012/04/codejam/和) [http://www.alloyteam.com/2012/03/css3-checkbox / 两个页面同在](http://www.alloyteam.com/2012/03/css3-checkbox/两个页面同在) [www.alloyteam.com](http://www.alloyteam.com/) 域下，它们共享同一个本地存储空间，访问到的数据也是同一份；而 [http://csslib.alloyteam.com/ 在](http://csslib.alloyteam.com/在) csslib.alloyteam.com 域下，访问的是另一个存储空间。  
一个 unicode 字符占 2 个字节（英文和中文一样），所以 5M 可以存储 1024\*1024/2=524288 个字符，包括 key 和 value。也就是说，localStorage.setItem ('user','John') 向本地存储写进了 8 个字符（16Byte）。[这个网站](http://dev-test.nemikor.com/web-storage/support-test/)有一份各种浏览器分配给 localStorage 存储空间大小的表，你也可以在上面测试当前使用的浏览器支持多大的存储空间，不过它的数据有个问题，它没有考虑到一个 unicode 字符占 2 字节，因此它的数据应该全部乘 2。  
当本地存储满了，再往里面写数据，将会触发 error（这点和 cookie 的表现不一样），因此一个严谨的脚本应该捕捉写 localStorage 的错误

```c
var FIVE_MB=Array(5*1024*512).join('囧');
try{
  localStorage.setItem('x',FIVE_MB);
}catch(e){
  console.info('Oops');
}
```

当调用 localStorage.clear () 时，整个域的数据会被清空，包括和当前页面共享一个存储空间的其他页面。

# 浏览器不支持本地存储怎么办

对于 IE6 和 IE7，有 userData，可以提供最多 1024kb 的空间，虽然 userData 可以设置有效期，但是仍然存在写满报错的问题，并且 userData 创建的存储文件不能被枚举，因此需要人为地维护。  
另外还可以使用内嵌 flash 控件，使用 flash 的本地存储空间，flash 默认提供 100kb，使用更多需要用户授权。  
这两种方法的使用成本较高，本文就不再展开讨论了。


<!-- {% endraw %} - for jekyll -->