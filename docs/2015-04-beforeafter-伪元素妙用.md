---
title: :before,:after 伪元素妙用
date: 2015-04-29
author: TAT.lqlongli
source_link: http://www.alloyteam.com/2015/04/beforeafter%e4%bc%aa%e5%85%83%e7%b4%a0%e5%a6%99%e7%94%a8/
---

<!-- {% raw %} - for jekyll -->

这两个伪元素分别表示元素内容的【前】【后】，利用这两个伪元素可以在元素内容的前后添加内容，其实这没有什么前后的概念，如果应用了 absolute 的特性之后，你可以把这些伪元素放在任何位置，有了这两个伪元素，就代表每个元素都有两个助手可供使用，灵活运用它们的话将会得到很多有趣的实现，简化许多实现。

> 伪元素特性（目前已经遇到的）
>
> -   它不存在于文档中，所以 js 无法操作它
> -   它属于主元素本身，有些伪类仅仅是代表元素内容的一部分，譬如:first-letter 代表第一个字母；因此当伪元素被点击的时候触发的是主元素的 click 事件
> -   块级元素才能有:before, :after，譬如 img 就不能设置，亦即某些元素是没有:before, :after 的，只要知道一般的块级元素都可以用就行了

> 注：css3 中，为了与伪类区分，伪元素前应该使用两个冒号，即:hover 伪类，::before 伪元素。当然为了向下兼容，用一个冒号也是可以的，不过建议尽量使用规范的写法。

### 各种图标

利用这两个伪类，可以实现需要简单的图标，例如搜索的放大镜，叉叉，箭头等等

```html
&lt;span class="comment">//视频播放图标&lt;/span>
.course[data-type=&lt;span class="string">"2"&lt;/span>] {
    .course__cover {
        &:before, &:after {
            content: &lt;span class="string">''&lt;/span>;
            display: block;
            position: absolute;
            left: &lt;span class="number">5&lt;/span>px;
            bottom: &lt;span class="number">5&lt;/span>px;
        }
        &:after {   &lt;span class="comment">//实现圈圈&lt;/span>
            width: &lt;span class="number">20&lt;/span>px;
            height: &lt;span class="number">20&lt;/span>px;
            border: &lt;span class="number">2&lt;/span>px solid white;
            background: rgba(&lt;span class="number">0&lt;/span>, &lt;span class="number">0&lt;/span>, &lt;span class="number">0&lt;/span>, .&lt;span class="number">6&lt;/span>);
            border-radius: &lt;span class="number">12&lt;/span>px;
            background-clip: padding-box;
        }
        &:before {  &lt;span class="comment">//实现三角形&lt;/span>
            height: &lt;span class="number">0&lt;/span>;
            width: &lt;span class="number">0&lt;/span>;
            border-left: &lt;span class="number">8&lt;/span>px solid white;
            border-top: &lt;span class="number">5&lt;/span>px solid transparent;
            border-bottom: &lt;span class="number">5&lt;/span>px solid transparent;
            margin-left: &lt;span class="number">9&lt;/span>px;
            margin-bottom: &lt;span class="number">7&lt;/span>px;
            z-index: &lt;span class="number">5&lt;/span>;
        }
    }
}
 
```

上述图标的效果如下图：

![](http://7tszky.com1.z0.glb.clouddn.com/Fv_HjtNCbR13N7bdbkeZY5RaSOTb)

### 扩大可点区域

在 mobile，特别是小屏手机，可点区域一般需要大一点，这样对用户友好一点。  
当主元素实在没办法扩大自身的时候，可以利用:before, :after 来实现可点区域的扩大，还记得伪元素的特性之一，伪元素属于主元素，点伪元素就是点击主元素。

```html
&lt;span class="comment">//利用这个样式可以把可点区域扩大为40px宽，高度原理一样&lt;/span>
&:before {
    content: &lt;span class="string">""&lt;/span>;
    display: block;
    position: absolute;
    width: &lt;span class="number">40&lt;/span>px；
    left: &lt;span class="number">50&lt;/span>%;
    margin-left: -&lt;span class="number">20&lt;/span>px;
    top: &lt;span class="number">0&lt;/span>;
    height: &lt;span class="number">50&lt;/span>px;   &lt;span class="comment">//随便&lt;/span>
}
 
```

实现效果如下图：

![](http://7tszky.com1.z0.glb.clouddn.com/FuEk1oYgYkJG7qCqhbMfRiw_3erf)

这个算是个综合例子，应用了多种技巧。这是一个收藏按钮，两种状态：已收藏和未收藏，正好符合 checkbox，因此应用了 checkbox，修改了样式给了一个底图。然后下面的文字是:after，利用了动态 label 的技巧（详见 1.4），然后:before 应用了扩大可点区域技巧，使得 40\*50 的区域内点击都有效。

### 实现 label

对于一些静态的文字，说明性的文字，譬如最常见的上图下字单元，完全可以用:after 实现那个文字。  
还记得 form 家族的 label 标签吗？它的特性是 label 和 input 的联动，点击 label 元素就等同于点击 input，这个效果和伪元素的特性是一模一样的，用:before 完全可以替代 label。

> 唯有一点是 label 独有的，就是 label 元素和 input 元素的位置相距较远，这种联动是伪元素无法实现的，毕竟伪元素还是要围绕主元素存在的，远距离 absolute 将会引发灾难的。

```css
.empty__bg {
    display: inline-block;
    width: &lt;span class="number">95&lt;/span>px;
    height: &lt;span class="number">92&lt;/span>px;
    background: url(../../img/bg_empty_center@&lt;span class="number">2&lt;/span>x.png) no-repeat;
    background-size: &lt;span class="number">95&lt;/span>px &lt;span class="number">92&lt;/span>px;
    position: relative;
    margin-bottom: &lt;span class="number">16&lt;/span>px;    &lt;span class="comment">//注意这里需要留好位置放置after元素（它是absolute进去的）&lt;/span>
    &:after {
        content: &lt;span class="string">"暂无学习计划"&lt;/span>;
        display: block;
        font-size: &lt;span class="number">14&lt;/span>px;
        line-height: &lt;span class="number">24&lt;/span>px;
        text-align: center;
        width: &lt;span class="number">100&lt;/span>%;
        color: &lt;span class="comment">#909090;&lt;/span>
        position: absolute;
        top: &lt;span class="number">100&lt;/span>%;
        left: &lt;span class="number">0&lt;/span>;
    }
}
 
```

实现效果如下图：

![](http://7tszky.com1.z0.glb.clouddn.com/FvD_sYY4Fmp_yKS0E07H-5jhuKTB)

### 实现动态信息

如果你认为伪元素只能实现静态 label，那就把 CSS3 想得简单了。  
:before, :after 的 content 属性的值除了是静态字符串之外，还有其他的一些特殊值，其中一个是 attr (…)，这个特性的作用是用主元素的某个属性的值作为 content 的值，当这个属性的值改变的时候，伪元素的值也会跟着改变，利用这个特性就可以实现动态信息了。

> 可以有两种动态方案：
>
> 1.  用 js 动态修改主元素的属性值，这个很直观
> 2.  修改伪元素 content 关联的属性

下面看一个例子：

```html
&lt;span class="comment">//html:&lt;/span>
&lt;span class="comment">//&lt;a class="datepicker__link z-today" href="javascript:void(0)" data-monthstr="04月" data-weekstr="周三" data-k="2015422">&lt;span>22&lt;/span>&lt;/a>&lt;/span>
&lt;span class="comment">//&lt;li class="datepicker__item">&lt;a class="datepicker__link" href="javascript:void(0)" data-monthstr="04月" data-weekstr="周四" data-k="2015423">&lt;span>23&lt;/span>&lt;/a>&lt;/li>&lt;/span>
&lt;span class="comment">//&lt;a class="datepicker__link z-active" href="javascript:void(0)" data-monthstr="04月" data-weekstr="周五" data-k="2015424">&lt;span>24&lt;/span>&lt;/a>&lt;/span>
 
&lt;span class="comment">//core css&lt;/span>
.datepicker__link {
    &:before {
        content: attr(data-monthStr);
    }
    &.z-active {
        &:before {
            content: attr(data-weekStr);
        }
    }
}
 
```

实现的效果如下图：

![](http://7tszky.com1.z0.glb.clouddn.com/FvAgycjSwhWigLJThiWQyxS5IM_-)

这里用到第二种动态方案，日期列表里面，日期上面默认显示月份信息，但是选中态需要显示星期信息。  
预先把每个单元用到的月份信息和星期信息放到主元素的 data 属性上面（缓存的思想），选中的时候一般都是要添加一个选中态样式，这时，除了基本的凸显性样式外，同时切换伪元素关联的 data 属性即可轻松地解决这个问题，而不用通过 js 去找到 label 元素，然后修改 text。

### 小结

伪元素帮助我们选择那些有特殊意义，但是却无法具体定位的 “东西”，它们对这些 “东西” 不做任何限制，它们只是代表这些特殊意义，譬如:first-letter，不限制首字母是哪一个字母，只是代表了首字母元素。

通过伪元素，可以让 CSS 更好的处理一些有特殊意义的元素，这些元素一般很难定位，甚至有些是代表状态的元素，譬如:target。

结合伪元素的特点，利用它们的灵活性，可以为我们提供更多的特性，下面总结一下目前想到的伪元素的优缺点：

#### 优点 / 用途

-   减少 dom 节点数
-   让 css 帮助解决一部分 js 问题，让问题变得简单

#### 缺点

-   不利于 SEO
-   代码读起来 “可能” 会有疑惑


<!-- {% endraw %} - for jekyll -->