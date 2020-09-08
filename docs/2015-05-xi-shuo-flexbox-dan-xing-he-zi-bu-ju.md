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

```css
ul {
 
    display:flex;//表示改直接子元素用flex布局，默认横向布局
 
}
 
ul li {
 
     /*width: 32.9%;*/
 
     /*float: left;*/
 
     border-right: 1px solid #fa9900;
 
     padding: 5px 0;
 
     flex: 1;表示子元素之间平均分配
 
}
```

可见用 flex 布局非常完美，这就是 flex 布局的牛逼之处。很遗憾的是最近规范变动过多，导致各个浏览器对它的实现也有所不同。为了兼容更多的浏览器，也可以这样写：

```css
ul {
 
   /* display: flex;*/
 
    display: -webkit-box;
 
}
 
ul  li {
 
    border-right: 1px solid #fa9900;
 
    padding: 5px 0;
 
    /*flex: 1;*/
 
    -webkit-box-flex: 1;
 
}
```

display: flex;display: -webkit-box; 这两个属性的方法作用相同。

**Example 2： flexbox 不等分布局**

```html
<div class="container">
        
    <section class="initial">
              
        <p>
                      空间足够的时候，我的宽度是200px，如果空间不足，  
                        我会变窄到100px，但不会再窄了。       
        </p>
            
    </section>
        
    <section class="none">
              <p>         无论窗口如何变化，我的宽度一直是200px。       </p>    
    </section>
        
    <section class="flex1">
              <p>        我会占满剩余宽度的1/3。       </p>    
    </section>
        
    <section class="flex2">
              <p>        我会占满剩余宽度的2/3。       </p>    
    </section>
     
</div>;
```

```css
.container {
 
  display: -webkit-flex;
 
  display: flex;
 
}
 
.initial {  
 
-webkit-flex: initial; 
 
          flex: initial;
 
  width: 200px;
 
  min-width: 100px;
 
/*空间足够的时候，该div的宽度是200px，如果空间不足，该div会变窄到100px，但不会再窄了。*/
 
}
 
.none {
 
  -webkit-flex: none;
 
          flex: none;
 
  width: 200px;
 
/*无论窗口如何变化，我的宽度一直是200px。*/
 
}
 
.flex1 {
 
  -webkit-flex: 1;
 
          flex: 1;
 
     /*改div会占满剩余宽度的1/3。*/
 
}
 
.flex2 {
 
  -webkit-flex: 2;
 
          flex: 2;
 
  /*改div会占满剩余宽度的2/3。*/
 
}
```

效果如下图所示：

[![图片 7](http://www.alloyteam.com/wp-content/uploads/2015/05/图片7.png)](http://www.alloyteam.com/wp-content/uploads/2015/05/图片7.png)

**Example 3： flexbox 基本页面布局**

```html
<div class="container">
      <nav>
<div class="container">
      <nav>
        <ul>
          <li>
         <a href="http://www.alloyteam.com/">menu1</a>
          </li>
       </ul>
     </nav>
   <div class="content">
      <section >
         ...
     </section>
         <section>
       ...
      </section>
   </div>
 </div>
```

```css
.container {
    display: -webkit-flex;
    display: flex;
}
nav {
      width: 200px; /*固定宽度*/
}
.content{
  -webkit-flex: 1; /*除去nav的固定宽度后，剩下的宽度都是属于content的*/
            flex: 1;
}
```

效果如下图所示：

[![图片 6](http://www.alloyteam.com/wp-content/uploads/2015/05/图片6.png)](http://www.alloyteam.com/wp-content/uploads/2015/05/图片6.png)

Example 4： flexbox 的居中布局  

* * *

```c
<div class="vertical-container">
  <section class="vertically-centered">
    <p>
      CSS里总算是有了一种简单的垂直居中布局的方法了！
    </p>
  </section>
</div>
```

```css
.vertical-container {
  display: -webkit-flex;
  display: flex;
  height: 300px;
}
.vertically-centered {
  margin: auto;
}
```

[![图片 8](http://www.alloyteam.com/wp-content/uploads/2015/05/图片8.png)](http://www.alloyteam.com/wp-content/uploads/2015/05/图片8.png)

使用 flexbox 你还可以做的更多，这里只是一些让你了解概念的例子，想了解更多请看：<https://css-tricks.com/snippets/css/a-guide-to-flexbox/>


<!-- {% endraw %} - for jekyll -->