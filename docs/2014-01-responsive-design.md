---
title: 响应式设计
date: 2014-01-23
author: TAT.Minren
source_link: http://www.alloyteam.com/2014/01/responsive-design/
---

<!-- {% raw %} - for jekyll -->

网上的教程好复杂，我写一个简版的。

简单说呢就针对不同的屏幕分辨率应用不同的 CSS 样式。比如在电脑、Pad 设备上，屏幕比较宽，就可以一行放 2 个 Div。

到了手机上，或者 Pad 竖着拿的的时候，一行就只放 1 个 Div。

这里有 2 个关键点：

一是如何在不修改 Dom 结构的前提下调整布局。

二是如何判断屏幕分辨率并应用对应的 CSS。

以上两点都应该不依赖与 JS。

实现第一点依靠的是流式布局。就是所有参与布局的 DIV 都用 float:left，宽度都用百分比表示。比如下图，黄色部分的宽度是 60%，橘色宽度是 40%。

[![宽](http://www.alloyteam.com/wp-content/uploads/2014/01/宽.jpg)](http://www.alloyteam.com/wp-content/uploads/2014/01/宽.jpg)

如果将黄色和橘色的宽度都 width=100%, 那么从 1 行变成 2 行了，如下图。从而实现不修改 Dom 实现布局变化。

[![窄](http://www.alloyteam.com/wp-content/uploads/2014/01/窄.jpg)](http://www.alloyteam.com/wp-content/uploads/2014/01/窄.jpg)

那么如何不使用 JS 而实现动态调整 CSS 样式就是第二个关键点。

HTML5 中提供了一种新的 CSS 语法 ——@media，学名是 Media Query，可以为不同的分辨率设定不同的样式。

```css
/* Phone Portrait (320px) */
@media only screen and (max-width: 320px) {
	#head { width: 100%; }
	#main { width: 100%; }
	#foot { width: 100%; }
	#left { width: 100%; }
	#right { width: 100%; }
}
```

上面这段代码的含义就是当屏幕宽度小于等于 320 像素时应用大括号中的样式。下图是在 CSS 生效时在浏览器中的效果：

[![css](http://www.alloyteam.com/wp-content/uploads/2014/01/css.jpg)](http://www.alloyteam.com/wp-content/uploads/2014/01/css.jpg)

@media 还有一些更复杂的用法，比如：

```ruby
/* Phone Landscape (480px) */
@media only screen and (min-width: 321px) and (max-width: 480px) and (orientation: landscape) {
```

这段语句就是针对 iPhone 横屏的。即，浏览器宽度在 321-480 像素之间，且方向是 “横向” 时生效。

不过自从 Retina 这中妖艳的屏幕推出，分辨率已经不能代表世界的真相了。小小的 Note3 的分辨率比一些 17“显示的分辨率还高。

所以还有必要判断一下设备的像素密度 - device-pixel-ratio。

```ruby
@media only screen and (-moz-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)
```

比如上面的语句就是判断终端的像素比是 2 的话，所渲染的样式。可以适用于 iPhone4，iPhone5 等设备。

除了上述两点，还需要在页面上增加一个 viewport 的 meta 标签，否则在手机上可能会有页面自动缩放的情况。例如：

```html
<meta name="viewport" content="width=device-width; initial-scale=1.0">
```

总结一下：响应式布局有三个关键点：

1、流式布局 Liquid Layout

2、Media Query

3、viewport

具体细节就请大家自己研究相关的语法了。

Media Query 的语法比较复杂，这里个大家推荐一个工具，可以方便的设计布局，并可以针对各种设备自动生成 Media Query 的语句：

<http://www.responsivewebcss.com/>

![](http://www.responsivewebcss.com/content/images/home/step1.png)![](http://www.responsivewebcss.com/content/images/home/step2.png)![](http://www.responsivewebcss.com/content/images/home/step3.png)


<!-- {% endraw %} - for jekyll -->