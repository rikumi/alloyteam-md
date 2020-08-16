---
title: 快速制作多倍图帧动画方式及原理:gka [–ratio]
date: 2018-04-25
author: TAT.joeyguo
source_link: http://www.alloyteam.com/2018/04/gka-ratio/
---

[原文地址](https://github.com/gkajs/gka/wiki/%E5%BF%AB%E9%80%9F%E5%88%B6%E4%BD%9C%E5%A4%9A%E5%80%8D%E5%9B%BE%E5%B8%A7%E5%8A%A8%E7%94%BB%E6%96%B9%E5%BC%8F%E5%8F%8A%E5%8E%9F%E7%90%86:gka%5B--ratio%5D)

![gka](https://user-images.githubusercontent.com/10385585/28303811-86f0aad0-6bc7-11e7-82da-8ee3a412eb43.jpg)

多倍图的适配在前端开发还是比较常见的，像在 Retina 屏幕，一般会使用二倍图从而让图片保持清晰，而在开发帧动画中使用的图片实际上同样需要做这样的适配处理。gka 提供一键式的制作多倍图帧动画的方式。

[gka](https://github.com/joeyguo/gka) 是一款简单的、高效的帧动画生成工具，图片处理工具。

官方文档：[https://gka.js.org](https://gka.js.org/)

Github：<https://github.com/gkajs/gka>

# 使用 gka 生成多倍图帧动画的方式

## 方式一：对单一文件夹图片进行处理

举例，2 倍图的图片文件夹地址为 /workspace/img/

| 文件夹：/workspace/img/ |
| ------------------- |

\| 

     
    ./img
    ├── gka_1.png
    ├── gka_2.png
    ├── gka_3.png
    └── ...
     

 \|

使用 gka 命令及 --ratio 参数，生成 2 倍图动画

    gka /workspace/img/ --ratio 2
     

| 文件夹：/workspace/gka-img-css-2x/ |
| ------------------------------ |

\| 

     
    ./gka-img-css-2x
    └── gka.html
    └── gka.css
    └── img
        └── 2x
            ├── gka_1.png
            ├── gka_2.png
            ├── gka_3.png
            └── ...
     

 \|

生成的代码中将会把 2 倍图大小的图片，进行正常的 1 倍展示，使得帧动画在 retina 屏下能够清晰展示。

## 方式二：对多文件夹图片进行处理

举例，图片文件夹地址为 /workspace/img/ 中包含 1 倍图和 2 倍图的图片文件夹 name@1x，name@2x

| 文件夹：/workspace/img/ |
| ------------------- |

\| 

```ruby
 
./img
    └── name@1x
        ├── gka_1.png
        ├── gka_2.png
        ├── gka_3.png
        └── ...
    └── name@2x
        ├── gka_1.png
        ├── gka_2.png
        ├── gka_3.png
        └── ...
 
```

 \|

使用下方命令，gka 将自动识别文件夹名 (1x 为 1 倍图的目录，2x 为 2 倍图的目录，依此类推。)，一键生成 1 倍图和 2 倍图动画。并在不同的设备下自动选择播放对应动画，保持清晰。

    gka /workspace/img/
     

| 文件夹：/workspace/gka-img-css/ |
| --------------------------- |

\| 

     
    ./gka-img-css
    └── gka.html
    └── gka.css
    └── img
        ├── gka_1.png
        ├── gka_2.png
        ├── gka_3.png
        └── ...
        └── 2x
            ├── gka_1.png
            ├── gka_2.png
            ├── gka_3.png
            └── ...
     

 \|

## 其他方式

结合 gka 提供的其他参数一同使用，如 -u 进行图片去重，-s 进行合图处理等等

    gka /workspace/img/ --ratio 2 -us
     

# 多倍图帧动画原理

当背景图片设置 background-size 为具体值时，图片将以该值的大小进行填充展示。二倍图的处理其实就是按照这个原理来实现的。举个例子，二倍图的宽高为 80px 60px，那么可以通过缩小一倍，即设置 background-size 为 40px 30px 来得到展示中需要的宽高，这样在 retina 屏幕下，图片将保持清晰。示例代码如下

```html
<style>
.bg {
  background-size: 40px 30px;
  background: url(./img.png)
</style>
<div class="bg"></div>
 
```

当图片是取自合图时，可以通过 background-position 来定位到图片在合图中的位置。而当设置 2 倍图的 background-size 进行 1 倍展示时，我们将需要把对应的 background-position 也进行对应的缩小倍数处理。紧接着就是大量的计算与代码编写了。

这一切，就交给 [gka](https://github.com/gkajs/gka) 来处理吧！

欢迎使用 gka ，欢迎任何意见或建议，谢谢 ：D

GitHub: <https://github.com/gkajs/gka>