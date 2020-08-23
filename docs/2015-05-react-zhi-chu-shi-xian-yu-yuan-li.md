---
title: React 直出实现与原理
date: 2015-05-04
author: TAT.donaldyang
source_link: http://www.alloyteam.com/2015/05/react-zhi-chu-shi-xian-yu-yuan-li/
---

<!-- {% raw %} - for jekyll -->

> [前一篇文章](https://github.com/miniflycn/qvd/issues/1)我们介绍了虚拟 DOM 的实现与原理，这篇文章我们来讲讲 React 的直出。  
> 比起 MVVM，React 比较容易实现直出，那么 React 的直出是如何实现，有什么值得我们学习的呢？

### 为什么 MVVM 不能做直出？

对于 MVVM，HTML 片段即为配置，而直出后的 HTML 无法还原配置，所以问题不是 MVVM 能否直出，而是在于直出后的片段能否还原原来的配置。下面是一个简单的例子：

    <sapn>Hello {name}!</span>
     

上面这段 HTML 配置和数据在一起，直出后会变成：

```html
<span>Hello world!</span>;
```

这时候当我们失去了 name 的值改变的时候会导致页面渲染这个细节。当然，如果为了实现 MVVM 直出我们可能有另外的方法来解决，例如直出结果变成这样：

```html
<span>
    Hello <span q-text="name">world</span>!
</span>;
```

这时候我们是可以把丢失的信息找回来的，当然结构可能和我们想象的有些差别。当然还有其他问题，例如直出 HTML 不一定能反向还原数据，由于篇幅问题，这里不展开讨论。

### React 如何直出？

![2](https://cloud.githubusercontent.com/assets/2239584/7455572/118cdd64-f2b0-11e4-8146-a57930197985.png)

如图：

-   React 的虚拟 DOM 的生成是可以在任何支持 Javascript 的环境生成的，所以可以在 NodeJS 或 Iojs 环境生成
-   虚拟 DOM 可以直接转成 String
-   然后插入到 html 文件中输出给浏览器便可

具体例子可以参考，<https://github.com/DavidWells/isomorphic-react-example/>，下面是其渲染路由的写法：

```html
<span class="comment">// https://github.com/DavidWells/isomorphic-react-example/blob/master/app/routes/coreRoutes.js</span>
 
<span class="keyword">var</span> React = <span class="keyword">require</span>(<span class="string">'react/addons'</span>);
<span class="keyword">var</span> ReactApp = React.createFactory(<span class="keyword">require</span>(<span class="string">'../components/ReactApp'</span>).ReactApp);
 
module.exports = <span class="keyword">function</span>(app) {
 
    app.get(<span class="string">'/'</span>, <span class="keyword">function</span>(req, res){
        <span class="comment">// React.renderToString takes your component</span>
        <span class="comment">// and generates the markup</span>
        <
```


<!-- {% endraw %} - for jekyll -->