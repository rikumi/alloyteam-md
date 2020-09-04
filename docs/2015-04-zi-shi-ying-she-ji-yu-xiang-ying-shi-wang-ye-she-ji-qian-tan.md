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
 
<link rel="stylesheet" media="all and (orientation:landscape)" 
```


<!-- {% endraw %} - for jekyll -->