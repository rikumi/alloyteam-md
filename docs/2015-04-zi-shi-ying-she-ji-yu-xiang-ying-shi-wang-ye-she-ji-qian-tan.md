---
title: 自适应设计与响应式网页设计
date: 2015-04-14
author: TAT.sheran
source_link: http://www.alloyteam.com/2015/04/zi-shi-ying-she-ji-yu-xiang-ying-shi-wang-ye-she-ji-qian-tan/
---

<!-- {% raw %} - for jekyll -->

目前非常流行自适应设计与响应式设计，而且经常让人混淆，自适应设计不应与自适应布局混为一谈，它们是完全不一样的概念。

**在这先说明下这两者的异同：**  

* * *

自从移动终端飞速发展以来，各种各样的机型突飞猛进，很多网站的解决方法，是为不同的设备提供不同的网页，比如专门提供一个 mobile 版本，或者 iPhone/iPad 版本。这样做固然保证了效果，但是比较麻烦，同时要维护好几个版本，而且如果一个网站有多个 portal（入口），会大大增加架构设计的复杂度。

于是，很早就有人设想，能不能 "一次设计，普遍适用"，让同一张网页自动适应不同大小的屏幕，根据屏幕宽度，自动调整布局（layout）？

2010 年，Ethan Marcotte 提出了**["自适应网页设计"](http://www.alistapart.com/articles/responsive-web-design/)**（Responsive Web Design）这个名词，指可以自动识别屏幕宽度、并做出相应调整的网页设计。

[![图片 2](http://www.alloyteam.com/wp-content/uploads/2015/04/图片2.png)](http://www.alloyteam.com/wp-content/uploads/2015/04/图片2.png)

图片来源 <http://mashable.com/2012/12/11/responsive-web-design/>

如图所示就叫做自适应布局。自适应布局有它的使用价值，在于它能够提供一种更加实用的解决方案，使得项目的实现成本更低，并且更加易于测试。一个自适应布局可以被看作是响应式布局的一个更加廉价的替代品，会在项目资源紧缺的情况下更具有吸引力。

**而在响应式布局中你却要考虑上百种不同的状态:**  

* * *

响应式网页设计是自适应网页设计的子集。响应式网页设计指的是页面的布局（流动网格、灵活的图像及媒介查询）。总体目标就是去解决设备多样化问题。

响应式布局等于流动网格布局，而自适应布局等于使用固定分割点来进行布局。

当固定宽度与流动宽度结合起来时，自适应布局就是一种响应式设计，而不仅仅是它的一种替代方法。[​](http://www.mrmu.com.tw/2011/04/06/css3-media-queries-liquid-layout/)

**那么如何进行响应式布局呢？下面就一步步为你揭开响应式布局的面纱：**  

* * *

### **Skill 1  学会运用 Css3 Media Queries，根据不同的屏幕分辨率，选择应用不同的 Css 规则**

#### **Media Queries 语法简介：**

**max-width：**若浏览区域的宽度小于 400 像素，则下方的 CSS 描述就会立即被套用：

```css
@media screen and (max-width:400px){ 
    .class  {
         background:#ccc; 
     }
 }
```

也可以把要套用的描述独立成外部档案：

```html
<link rel="stylesheet" media="screen and (max-width: 400px)" href="mini.css" />;
```

**Min Width：**若浏览区域的宽度大于 800 像素，则下方的 CSS 描述就会立即被套用：

```css
@media screen and (min-width:800px){
  .class
  {
    background:#666;
  }
}
```

**Device Width：**若浏览设备的可视范围最大为 480px，则下方的 CSS 描述就会立即被套用：(注：移动手机目前常见最大宽度为 480px，如 iPhone or Android Phone)

```css
@media screen and (max-device-width:480px){
  .class
  {
    background:#000;
  }
}
```

**针对 iPhone4 提供专用的 css 设定档：**

```c
<link rel= "stylesheet"  media= "only screen and (-webkit-min-device-pixel-ratio: 2)"  type= "text/css"  href= "iphone4.css"  />
```

针对 iPad 的 Portrait Mode (直立) 与 Landscape Mode (横躺) 两种浏览模式给予不同的 css 设定档：

```html
<link rel="stylesheet" media="all and (orientation:portrait)" href="portrait.css">
 
<link rel="stylesheet" media="all and (orientation:landscape)" href="landscape.css">
```

### **Skill 2  在网页头部加上 viewport 标签**

```c
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

浏览器推出了 “viewport meta” 标签，许多移动浏览器现在都支持这个标签，W3C  协议定义 [viewport meta](http://www.w3.org/TR/css-device-adapt/)  目前还属于草案，很多人都會在 html head  处加上 viewport  这个 meta data，一个典型的移动端 viewport 如下所示：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

该属性可以控制视窗口宽度的大小。它可以被设置为实际的具体像素 width= 600 或为特殊设备设置宽度值。

**viewport 设置属性如下：**

width：可设定数值，或者指定为 device-width

height：可设定数值，或者指定為 device-height

initial-scale：第一次进入页面的初始比例

minimum-scale：允许缩小最小比例

maximum-scale：允许放大最大比例

user-scalable：允许使用者缩放，1 or 0 (yes or no)

编译过程会转化成如下的语义：

```css
@viewport {
 
    width: device-width;
 
    initial-scale: 1.0
 
}
```

device-width ，主要是为了让整个页面宽度与手机可视宽度相同，这样就可以简单相容于不同机型屏幕大小，如果这边 width 沒有设定的话，就会依照 html/css 给予的 width 当作预设值。

因为解析度不同，device-width 有时候不一定是 view width，所以在类似 iphone 4 高解析度机器上，device-width=320 ，可是实际解析度为 480，这时候就需要利用 javascript 针对 UA 下去做动态调整。

user-scalable，这个属性可以让使用者能否放大、缩小页面，如果页面不允许手机使用者缩放，就直接设定 0 或者 no，反之要启动缩放功能，就设置 1 或者是 yes。

接下来将说明几种常用的方式，以及具体例子提供给大家參考。  
如果在手机端我们希望网页呈现固定，不希望使用者随意缩放，直接设定如下

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

如果希望在不同 **device** 使用不同缩放大小，就必须使用 javascript，检测 UA (User agent)，动态设定 viewport，如下：

    viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute('content', 'width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;');

### **Skill 3 不使用绝对宽度**

由于网页会根据屏幕宽度调整布局，所以不能使用绝对宽度（margin-left:5px）的布局，也不能使用具有绝对宽度 (例如：width：200px) 的元素，而最好使用百分比宽度 width:20%; 或者 with:auto;

### **Skill 4 字体最好不要用绝对大小 (px)，而使用相对大小 (em)**

```css
body { font: normal 100% Helvetica, Arial, sans-serif; } 
```

上面的代码指定，字体大小是页面默认大小的 100%，即 16 像素。

```css
h1 { font-size: 1.5em; }  
```

h1 的大小是默认大小的 1.5 倍，即 24 像素（24/16=1.5）

```css
.small { font-size: 0.875em; } 
```

small 元素的大小是默认大小的 0.875 倍，即 14 像素（14/16=0.875）

 **这里顺便说说 px  pt em  rem 区别：**

px 是 pixel，像素，是屏幕上显示数据的最基本的点，在 HTML 中，默认的单位就是 px；

pt 是 point，是印刷行业常用单位，等于 1/72 英寸。

em 才是真正的 “相对单位”（百分比嘛，当然是相对），而 px 和 pt 都是绝对单位（都有固定值）。所以，一般移动终端布局用 em 比较合适。

rem 是 css3 的出现，同时引进新的[单位](http://www.w3.org/TR/css3-values/#rem-unit), 而[rem](http://www.w3.org/TR/css3-values/#rem-unit)是相对于根元素<html>，这样就意味着，我们只需要在根元素确定一个参考值，在根元素中设置多大的字体，这完全可以根据您自己的需要。

### **Skill 5  流动布局（fluid grid）**

流动布局的含义是各个位置都是浮动的，不是固定不变的

```css
.main { float: right; width: 70%; } 
 
.leftBar { float: left; width: 25%; } 
```

float 的好处是，如果宽度太小，放不下两个元素，后面的元素会自动滚动到前面元素的下方，不会在水平方向 overflow（溢出），避免了水平滚动条的出现。

### **Skill 6 图片的自动缩放，等比缩放**

```css
 img{
 
    max-width: 100%;
 
 }
```

要使图片按等比缩放，一般不需要规定图片高度。且最好不用 background-image, 因为这样不会按照等比缩放。

**最后请欣赏基于 Media Queries 的响应式布局优秀案例，请手机扫一扫：**  

* * *

[![图片 3](http://www.alloyteam.com/wp-content/uploads/2015/04/图片3.png)](http://www.alloyteam.com/wp-content/uploads/2015/04/图片3.png) [![图片 4](http://www.alloyteam.com/wp-content/uploads/2015/04/图片4.png)](http://www.alloyteam.com/wp-content/uploads/2015/04/图片4.png) [![图片 5](http://www.alloyteam.com/wp-content/uploads/2015/04/图片5.png)](http://www.alloyteam.com/wp-content/uploads/2015/04/图片5.png)

上诉网页你可以用浏览器和手机打开浏览。发现在 PC 和移动端显示有很大变化。简单说呢就针对不同的屏幕分辨率应用不同的 CSS 样式。

最好感谢大家阅读～如有疑问欢迎留言 ^\_^！


<!-- {% endraw %} - for jekyll -->