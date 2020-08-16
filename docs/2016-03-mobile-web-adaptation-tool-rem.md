---
title: 移动 web 适配利器 - rem
date: 2016-03-27
author: TAT.tennylv
source_link: http://www.alloyteam.com/2016/03/mobile-web-adaptation-tool-rem/
---

前言  

* * *

提到 rem，大家首先会想到的是 em，px，pt 这类的词语，大多数人眼中这些单位是用于设置字体的大小的，没错这的确是用来设置字体大小的，但是对于 rem 来说它可以用来做移动端的响应式适配哦。

兼容性  

* * *

![](http://7jpp2v.com1.z0.glb.clouddn.com/0a269f05e4fb51f561d060eb24e864b11458889628.png)

  先看看兼容性，关于移动端

ios：6.1 系统以上都支持

android：2.1 系统以上都支持

大部分主流浏览器都支持，可以安心的往下看了。

rem 设置字体大小  

* * *

rem 是（font size of the root element），官方解释

![](http://7jpp2v.com1.z0.glb.clouddn.com/QQ%E5%9B%BE%E7%89%8720160313181850.png)，

意思就是根据网页的根元素来设置字体大小，和 em（font size of the element）的区别是，em 是根据其父元素的字体大小来设置，而 rem 是根据网页的跟元素（html）来设置字体大小的，举一个简单的例子，

现在大部分浏览器 IE9+，Firefox、Chrome、Safari、Opera ，如果我们不修改相关的字体配置，都是默认显示 font-size 是 16px 即

```css
html {
    font-size:16px;
}
```

那么如果我们想给一个 P 标签设置 12px 的字体大小那么用 rem 来写就是

```css
p {
    font-size: 0.75rem; //12÷16=0.75（rem）
}
```

基本上使用 rem 这个单位来设置字体大小基本上是这个套路，好处是假如用户自己修改了浏览器的默认字体大小，那么使用 rem 时就可以根据用户的调整的大小来显示了。 但是 rem 不仅可以适用于字体，同样可以用于 width height margin 这些样式的单位。下面来具体说一下

rem 进行屏幕适配  

* * *

在讲 rem 屏幕适配之前，先说一下一般做移动端适配的方法，一般可以分为： 

**1**  简单一点的页面，一般高度直接设置成固定值，宽度一般撑满整个屏幕。

**2**  稍复杂一些的是利用百分比设置元素的大小来进行适配，或者利用 flex 等 css 去设置一些需要定制的宽度。

**3**  再复杂一些的响应式页面，需要利用 css3 的 media query 属性来进行适配，大致思路是根据屏幕不同大小，来设置对应的 css 样式。

上面的一些方法，其实也可以解决屏幕适配等问题，但是既然出来的 rem 这个新东西，也一定能兼顾到这些方面，下面具体使用 rem：

**rem 适配**

先看一个简单的例子：

```css
.con {
      width: 10rem;
      height: 10rem;
      background-color: red;
 }
<div class="con">
        
</div>
```

![](http://7jpp2v.com1.z0.glb.clouddn.com/div.png)

这是一个 div，宽度和高度都用 rem 来设置了，在浏览器里面是这样显示的，   可以看到，在浏览器里面 width 和 height 分别是 160px，正好是 16px \* 10, 那么如果将 html 根元素的默认 font-size 修改一下呢？

```css
html {
    font-size: 17px;
}
.con {
      width: 10rem;
      height: 10rem;
      background-color: red;
 }
<div class="con">
        
</div>
```

再来看看结果：

![](http://7jpp2v.com1.z0.glb.clouddn.com/div2.png)

这时 width 和 height 都是 170px，这就说明了将 rem 应用与 width 和 height 时，同样适用 rem 的特性，根据根元素的 font-size 值来改变自身的值，由此我们应该可以联想到我们可以给 html 设定不同的值，从而达到我们 css 样式中的适配效果。

**rem 数值计算**

如果利用 rem 来设置 css 的值，一般要通过一层计算才行，比如如果要设置一个长宽为 100px 的 div，那么就需要计算出 100px 对应的 rem 值是 100 / 16 =6.25rem，这在我们写 css 中，其实算比较繁琐的一步操作了。

对于没有使用 sass 的工程：

为了方便起见，可以将 html 的 font-size 设置成 100px，这样在写单位时，直接将数值除以 100 在加上 rem 的单位就可以了。

对于使用 sass 的工程：

前端构建中，完全可以利用 scss 来解决这个问题，例如我们可以写一个 scss 的 function px2rem 即：

```javascript
@function px2rem($px){
    $rem : 37.5px;
    @return ($px/$rem) + rem;
}
```

这样，当我们写具体数值的时候就可以写成：

```css
height: px2rem(90px);
width: px2rem(90px);;
```

看到这里，你可能会发现一些不理解的地方，就是上面那个 rem:37.5px 是怎么来的，正常情况下不是默认的 16px 么，这个其实就是页面的基准值，和 html 的 font-size 有关。

**rem 基准值计算**

关于 rem 的基准值，也就是上面那个 37.5px 其实是根据我们所拿到的视觉稿来决定的，主要有以下几点原因：

**1**  由于我们所写出的页面是要在不同的屏幕大小设备上运行的

**2**  所以我们在写样式的时候必须要先以一个确定的屏幕来作为参考，这个就由我们拿到的视觉稿来定

**3**  假如我们拿到的视觉稿是以 iphone6 的屏幕为基准设计的

**4** iPhone6 的屏幕大小是 375px，

    rem = window.innerWidth  / 10

这样计算出来的 rem 基准值就是 37.5（iphone6 的视觉稿），这里为什么要除以 10 呢，其实这个值是随便定义的，因为不想让 html 的 font-size 太大，当然也可以选择不除，只要在后面动态 js 计算时保证一样的值就可以，在这里列举一下其他手机的

iphone3gs: 320px / 10 = 32px

iphone4/5: 320px  / 10 = 32px

iphone6: 375px  / 10 =37.5px

**动态设置 html 的 font-size**

现在关键问题来了，我们该如何通过不同的屏幕去动态设置 html 的 font-size 呢，这里一般分为两种办法

**1**  利用 css 的 media query 来设置即

```css
@media (min-device-width : 375px) and (max-device-width : 667px) and (-webkit-min-device-pixel-ratio : 2){
      html{font-size: 37.5px;}
}
```

**2**  利用 javascript 来动态设置 根据我们之前算出的基准值，我们可以利用 js 动态算出当前屏幕所适配的 font-size 即：

    document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 10 + 'px';

然后我们看一下之前那个 demo 展示的效果

```css
.con {
      width: px2rem(200px);
      height: px2rem(200px);
      background-color: red;
}
<div class="con">
        
</div>
document.addEventListener('DOMContentLoaded', function(e) {
                document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 10 + 'px';
}, false);
```

iPhone6 下，正常显示 200px

![](http://7jpp2v.com1.z0.glb.clouddn.com/div3.png)

在 iphone4 下，显示 169px

![](http://7jpp2v.com1.z0.glb.clouddn.com/div4.png)

由此可见我们可以通过设置不同的 html 基础值来达到在不同页面适配的目的，当然在使用 js 来设置时，需要绑定页面的 resize 事件来达到变化时更新 html 的 font-size。

rem 适配进阶  

* * *

我们知道，一般我们获取到的视觉稿大部分是 iphone6 的，所以我们看到的尺寸一般是双倍大小的，在使用 rem 之前，我们一般会自觉的将标注 / 2，其实这也并无道理，但是当我们配合 rem 使用时，完全可以按照视觉稿上的尺寸来设置。

**1**  设计给的稿子双倍的原因是 iphone6 这种屏幕属于高清屏，也即是设备像素比 (device pixel ratio) dpr 比较大，所以显示的像素较为清晰。

**2**  一般手机的 dpr 是 1，iphone4，iphone5 这种高清屏是 2，iphone6s plus 这种高清屏是 3，可以通过 js 的 window.devicePixelRatio 获取到当前设备的 dpr，所以 iphone6 给的视觉稿大小是（\*2）750×1334 了。

**3**  拿到了 dpr 之后，我们就可以在 viewport meta 头里，取消让浏览器自动缩放页面，而自己去设置 viewport 的 content 例如（这里之所以要设置 viewport 是因为我们要实现 border1px 的效果，加入我给 border 设置了 1px，在 scale 的影响下，高清屏中就会显示成 0.5px 的效果）

```html
meta.setAttribute(
    "content",
    "initial-scale=" +
        1 / dpr +
        ", maximum-scale=" +
        1 / dpr +
        ", minimum-scale=" +
        1 / dpr +
        ", user-scalable=no"
);
```

 4 设置完之后配合 rem，修改

```javascript
@function px2rem($px){
    $rem : 75px;
    @return ($px/$rem) + rem;
}
```

  双倍 75，这样就可以完全按照视觉稿上的尺寸来了。不用在 / 2 了，这样做的好处是：

**1**  解决了图片高清问题。

**2**  解决了 border 1px 问题（我们设置的 1px，在 iphone 上，由于 viewport 的 scale 是 0.5，所以就自然缩放成 0.5px）

在 iphone6 下的例子：

我们使用动态设置 viewport，在 iphone6 下，scale 会被设置成 1/2 即 0.5，其他手机是 1/1 即 1.

```html
meta.setAttribute(
    "content",
    "initial-scale=" +
        1 / dpr +
        ", maximum-scale=" +
        1 / dpr +
        ", minimum-scale=" +
        1 / dpr +
        ", user-scalable=no"
);
```

  我们的 css 代码，注意这里设置了 1px 的边框

```css
.con {
            margin-top: 200px;
            width: 5.3rem;
            height: 5.3rem;
            border-top:1px solid #000;
 }
```

  在 iphone6 下的显示：

![](http://7jpp2v.com1.z0.glb.clouddn.com/1459062170_41_w430_h247.png)

在 android 下的显示：

![](http://7jpp2v.com1.z0.glb.clouddn.com/1459062178_38_w432_h376.png)

   

* * *

rem 进行屏幕适配总结  

* * *

下面这个网址是针对 rem 来写的一个简单的 demo 页面，大家可以在不同的手机上看一下效果

![](http://7jpp2v.com1.z0.glb.clouddn.com/democode.png)

但是 rem 也并不是万能的，下面也有一些场景是不适于使用 rem 的

**1**  当用作图片或者一些不能缩放的展示时，必须要使用固定的 px 值，因为缩放可能会导致图片压缩变形等。

在列举几个使用 rem 的线上网站：

网易新闻：<http://3g.163.com/touch/news/subchannel/all?version=v_standard>

聚划算：<https://jhs.m.taobao.com/m/index.htm#!all>

参考资料：<http://www.nihaoshijie.com.cn/index.php/archives/593>