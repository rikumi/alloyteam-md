---
title: canvas 保存为 data:image 扩展功能的实现
date: 2012-02-09
author: TAT.岑安
source_link: http://www.alloyteam.com/2012/02/canvas%e4%bf%9d%e5%ad%98%e4%b8%badataimage%e6%89%a9%e5%b1%95%e5%8a%9f%e8%83%bd%e7%9a%84%e5%ae%9e%e7%8e%b0/
---

<!-- {% raw %} - for jekyll -->

【已知】  
canvas 提供了 toDataURL 的接口，可以方便的将 canvas 画布转化成 base64 编码的 image。目前支持的最好的是 png 格式，jpeg 格式的现代浏览器基本也支持，但是支持的不是很好。

【想要的】  
往往这么简单直接的接口通常都满足不了需求。我想要的不仅是简单的通过画布生成一个 png，我不想新开一个 tab，然后还要右键另存为...

我还需要更方便的自由的配置生成的图片的大小，比例等。

另外如果我还要别的图片格式，比如位图 bmp，gif 等怎么办...

【解决办法】  
a) 想直接把图片生成后 download 到本地，其实办法也很简单。直接改图片的 mimeType，强制改成 steam 流类型的。比如 ‘image/octet-stream’，浏览器就会自动帮我们另存为..

b) 图片大小，及比例的可控倒也好办，我们新建一个我们想要大小的 canvas，把之前的 canvas 画布重新按照所要的比例，及大小 draw 到新的 canvas 上，然后用新的 canvas 来 toDataURL 即可。

c) 想要 bmp 位图会麻烦些... 没有直接的接口，需要我们自己来生成。生成图片的响应头和响应体有一定的规则，略显麻烦。不过还能接受。剩下的就是性能问题，按像素级别来操作，对于一个大图来说计算量很有压力。  
【实现】


<!-- {% endraw %} - for jekyll -->