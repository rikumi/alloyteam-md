---
title: 使用 AlloyImage 工具函数构建 Win8.1 Metro 传统磁贴
date: 2013-11-07
author: TAT.dorsywang
source_link: http://www.alloyteam.com/2013/11/use-alloyimage-utility-function-constructed-win8-1-metro-traditional-magnetic-stickers/
---

<!-- {% raw %} - for jekyll -->

&lt;!-- h2 {font-family: Michroma,'Segoe UI Light','Segoe UI','Segoe UI WP','Microsoft Jhenghei',' 微软雅黑 ',sans-serif,Times; font-weight: bold;} -->

## 扁平化的设计

扁平化的设计是现今流行的一种趋势，Windows 系统也自 Windows Phone 开始，大胆的引入 Metro 设计的元素，Metro 设计扁平化，最为代表就是其磁贴设计。磁贴设计使用一个纯色的卡片，将简明的白色 Icon 放在中间。其形象如下。

[![](http://www.alloyteam.com/wp-content/uploads/2013/11/icons.png "icons")](http://www.alloyteam.com/wp-content/uploads/2013/11/icons.png)

## 传统对接的烦恼

Metro 设计引入桌面系统后，传统的开始菜单被 Metro 设计所取带，但是，开始菜单承载的历始任务要继续传承，从应用商店安装的应用将会以一种很好的 Metro 界面展示给大家，但是，原来传统的桌面图标显示，却成了一种设计上包袱。在 Win8 系统中其样子如下

[![](http://www.alloyteam.com/wp-content/uploads/2013/11/icon2.png "icon2")](http://www.alloyteam.com/wp-content/uploads/2013/11/icon2.png)

可见，原来的桌面图标，由一个单一的背景色，放置一个小图标，整体看起来并不是那么的和谐，舒服。

## Win8.1 的改进

Win8.1，其实相较 Win8 的改进并不是太大，但在一些细节和体验上，更加的关注于用户体验。在处理传统桌面图标显示的问题，它的改进是把传统桌面的图标的背景设置成与图标相近的颜色。效果如下

[![](http://www.alloyteam.com/wp-content/uploads/2013/11/icon3.png "icon3")](http://www.alloyteam.com/wp-content/uploads/2013/11/icon3.png)

可以看到，这样的改进会让图标看起来更舒服一些，下面我们就使用 AlloyImage 的 V1.2 版本的新特性 --- 图像工具函数来做这样子的图标。

## AlloyImage 工具函数

工具函数是 AlloyImage 是在 V1.2 版本 (开发中) 之后引入的新的特性，其目的，是集成一些方便快捷的图像工具操作，其原型是

```go
AlloyImageObj.Tools(String method, Args arg);
或者
AlloyImageObj.Tools[method](Args arg);
```

这里我们使用 色系提取 工具  
色系提取工具是把当前图层的主颜色提取出来，其用法也很简单

```javascript
//返回图像主色系
var color = AlloyImageObj.Tools.getColor();
```

这里用三个图标，在没有涂相近背景色的情况，它们是这样的效果

[![](http://www.alloyteam.com/wp-content/uploads/2013/11/icon4.png "icon4")](http://www.alloyteam.com/wp-content/uploads/2013/11/icon4.png)

我们用 AlloyImage 将其背景色涂上相近的颜色，核心代码如下

```javascript
//...some code here
var img = icons[i]; //取到Icon的图层
var layer = $AI(img); //取到颜色
var color = layer.Tools("getColor"); //设置背景色
icons[i].parentNode.style.background = color;
```

运行代码，效果如下

[![](http://www.alloyteam.com/wp-content/uploads/2013/11/icon5.png "icon5")](http://www.alloyteam.com/wp-content/uploads/2013/11/icon5.png)

## [在线 Demo](http://alloyteam.github.io/AlloyPhoto/demos/demoForTools.html)

AlloyImage V1.2 版本，更多功能，敬请期待！


<!-- {% endraw %} - for jekyll -->