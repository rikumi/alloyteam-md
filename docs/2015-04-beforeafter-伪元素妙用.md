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
<span class="comment">//视频播放图标</span>
.course[data-type=<span class="string">"2"</span>] {
    .course__cover {
        &:before, &:after {
            content: <span class="string">''</span>;
            display: block;
            position: absolute;
            left: <span class="number">5</span>px;
            bottom: <span class="number">5</span>px;
        }
        &:after {   <span class="comment">//实现圈圈</span>
            width: <span class="number">20</span>px;
            height: <span class="number">20</span>px;
            border: <span class="number">2</span>px solid white;
            background: rgba(<span class="number">0</span>, <span class="number">0</span>, <span class="number">0</span>, .<span class="number">6</span>);
            border-radius: <span class="number">12</span>px;
            background-clip: padding-box;
        }
        &:before {  <span class="comment">//实现三角形</span>
            height: <span class="number">0</span>;
            width: <span class="number">0</span>;
            border-left: <span class="number">8</span>px solid white;
            border-top: <span class="number">5</span>px solid transparent;
            border-bottom: <span class="number">5</span>px solid transparent;
            margin-left: <span class="number">9</span>px;
            margin-bottom: <span class="number">7</span>px;
            z-index: <span class="number">5</span>;
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
<span class="comment">//利用这个样式可以把可点区域扩大为40px宽，高度原理一样</span>
&:before {
    content: <span class="string">""</span>;
    display: block;
    position: absolute;
    width: <span cl
```


<!-- {% endraw %} - for jekyll -->