---
title: 多个动画间存在部分相同动画的优化方案:gka
date: 2018-04-29
author: TAT.joeyguo
source_link: http://www.alloyteam.com/2018/04/gka-optimize/
---

[原文地址](https://github.com/gkajs/gka/wiki/%E5%A4%9A%E4%B8%AA%E5%8A%A8%E7%94%BB%E9%97%B4%E5%AD%98%E5%9C%A8%E9%83%A8%E5%88%86%E7%9B%B8%E5%90%8C%E5%8A%A8%E7%94%BB%E7%9A%84%E4%BC%98%E5%8C%96%E6%96%B9%E6%A1%88:gka)

![gka-animation](https://user-images.githubusercontent.com/10385585/39403647-31b92066-4bb3-11e8-9881-f181bb125354.gif)

“抓娃娃” 并不陌生，存在两种结果：抓到与抓不到。在 Web 动画中，如上图，“抓到” 与 “抓不到” 对应着两个动画，可以使用不同的动画图片资源来实现，似乎毫无异义。

细做观察，不难发现：两个动画中 “动画初始到抓取” 及 “抓取结束到动画结束” 的区间中存在相同动画 (滑动和晃动抓杆)。既然动画相同，那么可以通过引用同一份动画图片资源，不做相同图片的重复加载，从而减少总资源大小。

> “两个动画间存在部分相同的动画，相同部分可以引用同一份动画图片资源，来减少图片的总大小。”

肉眼进行辨别哪些动画是一样的？那是不可能的。gka 提供一键式制作多个动画的方式，支持多种图片优化方案 (含图片去重)。

[gka](https://github.com/joeyguo/gka) 是一款简单的、高效的帧动画生成工具，图片处理工具。

官方文档：[https://gka.js.org](https://gka.js.org/)

Github：<https://github.com/gkajs/gka>

# 使用 gka 处理多个帧动画的方式

举例，图片文件夹地址为 /workspace/img/ 中包含抓取 “失败” 和 “成功” 的动画图片文件夹 fail，succeed

| 文件夹：/workspace/img/ |
| ------------------- |

\| 

     
    ./img
        └── fail
            ├── fail_1.png
            ├── fail_2.png
            ├── fail_3.png
            └── ...
        └── succeed
            ├── succeed_1.png
            ├── succeed_2.png
            ├── succeed_3.png
            └── ...
     

 \|

使用下方命令，gka 将会把这两个动画图片进行统一处理，并生成对应的动画文件。

    gka /workspace/img/
     

| 文件夹：/workspace/gka-img-css/ |
| --------------------------- |

\| 

     
    ./gka-img-css
    └── fail-gka.html
    └── fail-gka.css
    └── succeed-gka.html
    └── succeed-gka.css
    └── ...
    └── img
        ├── fail_1.png
        ├── fail_2.png
        ├── fail_3.png
        ├── succeed_1.png
        ├── succeed_2.png
        └── ...
     

 \|

结合 gka 提供的其他参数一同使用，如 -u 进行图片去重，那么两个动画中相同部分的动画便引用同样的图片资源，图片总大小将大大减少！

    gka /workspace/img/ -u
     

欢迎使用 gka ，欢迎任何意见或建议，谢谢 ：D

GitHub: <https://github.com/gkajs/gka>