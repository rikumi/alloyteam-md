---
title: 用 CSS 和第三方库来提升图片浏览体验
date: 2013-12-05
author: TAT.zerozheng
source_link: http://www.alloyteam.com/2013/12/css-and-third-party-libraries-used-to-improve-image-browsing-experience/
---

<!-- {% raw %} - for jekyll -->

你是否关注过浏览、点击图片这个微妙的过程，不同的图片展现、交互方式各带来什么样的观感？本文聚焦于图片浏览这个过程以及如何使用 CSS3 和第三方库来提升体验。

先看下 Pinterest、Flickr 等时下热门图片分享类网站。

**Pinterest**

    采用瀑布流式，设计者本意大概是用户对于图片这类非文本信息本身就是非线性浏览的，交错排列的图片集合使焦点最大化分散在页面各个部分。

用户实施了 pin 这一动作后，图片信息以 board 形式集合，每个 board 里的图片呈现规矩的网格布局，这种布局适合于有限集合的排列。

让我们停下想想，为了 “分散” 的注意力而采用了瀑布流式，那么究竟每张图片用多大尺寸合适，能够降低用户面对满屏图片时的不适感？不同尺寸图片如何排放？在移动端又需要采用什么布局？怎么解决多张图片加载的性能问题？这些问题留待思考。

Pinterest 每张图的宽度是固定的，高度也可获取，这样在渲染页面的时候就可以先确定位置而不是等加载到图片资源。

[![图片 4](http://www.alloyteam.com/wp-content/uploads/2013/12/图片4.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/图片4.png)

**Flickr**  

个人感觉体验有差距。页面采用网格布局，评论等文字都采取隐藏措施，页面整体整洁大方。但是，单张图片浏览的体验完全不在这个水平上。点击图片后页面跳转到对应图片的页面（此处设置浮层进行显示不是更优？），页面放置了左右导航来浏览相片集里前后的图，导航没有集合更多的效果例如预览，最让我感觉不适的是返回相册的入口较为隐蔽，找不到这个入口的情况下只能一步步点击浏览器的返回键，如果打开了一个相片集的多张图片，回到相册的步骤相应增加到两步以上。

[![图片 5](http://www.alloyteam.com/wp-content/uploads/2013/12/图片5.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/图片5.png)

**Facebook**

Facebook 用时间轴来组织信息，相比 Pinterest、Flickr 这些内容型网站，fb 更具 sns 属性。双栏加瀑布流布局，采用瀑布流可以避免双栏布局下不同高度内容单元带来的空白区域。

个人相册用网格布局紧凑整洁清晰，点击图片后浮层展示大图和赞、评论、圈图等功能，点击浮层关闭按钮返回相册，感觉布局略显小但也符合 “够用就好” 主义。

[![图片 6](http://www.alloyteam.com/wp-content/uploads/2013/12/图片6.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/图片6.png)

/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*华丽丽的分割线\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/

**css3**极大丰富了用户体验，本文下半篇聚焦于使用 css3 及部分优秀的第三方库来帮助提升图片浏览的体验，让图片浏览这个过程更美一点～

一、图片展示

1、层叠

通过设置 transform ：translate3d 样式可实现层叠的立体效果

```javascript
function setTransformStyle(el, tval) {
    el.style.WebkitTransform = tval;
    el.style.msTransform = tval;
    el.style.transform = tval;
}
```

如下图：分别设 transform 样式的值为 translate3d (0，0，0)，translate3d (0，0，-60px)，translate3d (0，0，-120px)

在点击单张图片改变三个向量的值来调整当前显示在最前端的图片

[![图片 1](http://www.alloyteam.com/wp-content/uploads/2013/12/图片1.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/图片1.png)

2、铺放

铺放可以通过 transform: rotate 实现，同时加上 transition 样式增强动画效果。

展开：

为不同图片设相应 z-index、ransform: rotate

```css
{
 
z-index: 10;
 
-webkit-transform-origin: 25% 100%;
 
-webkit-transform:
```


<!-- {% endraw %} - for jekyll -->