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

```css
ul li {
 
    width: 32.9%;
 
    float: left;
 
    border-right: 1px solid #fa9900;
 
    padding: 5px 0;
 
}
```

但当只有 2 个排名后，少了一个 li 节点后，就会展示如下：

 [![图片 2](http://www.alloyteam.com/wp-content/uploads/2015/05/图片2.png)](http://www.alloyteam.com/wp-content/uploads/2015/05/图片2.png) 

删除两个 li 节点后如下：

[![图片 3](http://www.alloyteam.com/wp-content/uploads/2015/05/图片3.png)](http://www.alloyteam.com/wp-content/uploads/2015/05/图片3.png)

但是用户以及设计师肯定不希望看到这样的界面。他们肯定希望界面是这样的：

减少一个 li 节点后：

[![图片 4](http://www.alloyteam.com/wp-content/uploads/2015/05/图片4.png)](http://www.alloyteam.com/wp-content/uploads/2015/05/图片4.png)

删除两个 li 节点后如下：

[![图片 5](http://www.alloyteam.com/wp-content/uploads/2015/05/图片5.png)](http://www.alloyteam.com/wp-content/uploads/2015/05/图片5.png)

那么这里用 display:flex 布局是最好不过的了，新的 flexbox 布局模式被用来重新定义 CSS 中的布局方式：

    ul {
     


<!-- {% endraw %} - for jekyll -->