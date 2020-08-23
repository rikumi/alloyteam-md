---
title: 浅谈 flexbox 的弹性盒子布局
date: 2015-05-19
author: TAT.sheran
source_link: http://www.alloyteam.com/2015/05/xi-shuo-flexbox-dan-xing-he-zi-bu-ju/
---

<!-- {% raw %} - for jekyll -->

 flexbox 是一个新的盒子模型，当你给一个元素使用了 flexbox 模块，那么它的子元素就会指定的方向在水平或者纵向方向排列。这些子元素会按照一定的比例进行扩展或收缩来填补容器的可用空间。flexbox 有许多很好用的地方，下面就着重讲述一下它的一些使用场景：

**Example 1： flexbox 等分布局**

 如果你要实现以下所示的样式，你可能首先想到的是用 float：

 [![图片 1](http://www.alloyteam.com/wp-content/uploads/2015/05/图片1.png)](http://www.alloyteam.com/wp-content/uploads/2015/05/图片1.png) 

```html
<ul id="ranktop3">
        {" "}
    <li>
               <div class="ranktab">1</div>       <p>fdeg</p>      {" "}
        <p>霸气值：170</p>    {" "}
    </li>
           {" "}
    <li>
               <div class="ranktab">2</div>       <p>bling</p>      {" "}
        <p>霸气值：160</p>    {" "}
    </li>
        {" "}
    <li>
               <div class="ranktab">3</div>       <p>lea</p>      {" "}
        <p>霸气值：150</p>    {" "}
    </li>
     
</ul>;
```


<!-- {% endraw %} - for jekyll -->