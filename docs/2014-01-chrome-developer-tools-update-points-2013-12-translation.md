---
title: Chrome 开发者工具更新要点（2013.12）【译】
date: 2014-01-07
author: TAT.gctang
source_link: http://www.alloyteam.com/2014/01/chrome-developer-tools-update-points-2013-12-translation/
---

在 2013 年 12 月份里 Chrome 开发者工具更新了一些大小不一的特性。

接下来我们将开始讨论查看元素面板还有控制台 (console)，时间线等等的更新。

### 1. 停用的样式规则复制之后会变成注释

现在在样式面板中复制完整的 CSS 规则将会把去掉勾的样式也复制进去，这些样式面板中没有打勾的样式将以注释的形式存在你的剪贴板里面。

[![QQ 图片 20140105200723](http://www.alloyteam.com/wp-content/uploads/2014/01/QQ图片20140105200723.jpg)](http://www.alloyteam.com/wp-content/uploads/2014/01/QQ图片20140105200723.jpg)

[![QQ 图片 20140105200749](http://www.alloyteam.com/wp-content/uploads/2014/01/QQ图片20140105200749.jpg)](http://www.alloyteam.com/wp-content/uploads/2014/01/QQ图片20140105200749.jpg)

### 2. 复制 CSS 路径

现在在查看元素面板的 DOM 节点菜单中增加了”Copy CSS Path“ 的选项（类似于 ‘Copy XPath’ 选项）。

[![AMIfv95185jJiijbsmNm9-6ixteI2B1XXGbIJ4YZzJwGjE4c2f-ff9vSwA_kkNwqVu4hBs6w85iPl5nRziXA8e8HN9dDWrKP94tO6Alt-R_dhNf0wFj1leWwxkBjnw_39GALo7xTHqadqKRe_YsSZ_A9GVf0As0Yjx3i_QrdC943KjQjG5W91RI](http://www.alloyteam.com/wp-content/uploads/2014/01/AMIfv95185jJiijbsmNm9-6ixteI2B1XXGbIJ4YZzJwGjE4c2f-ff9vSwA_kkNwqVu4hBs6w85iPl5nRziXA8e8HN9dDWrKP94tO6Alt-R_dhNf0wFj1leWwxkBjnw_39GALo7xTHqadqKRe_YsSZ_A9GVf0As0Yjx3i_QrdC943KjQjG5W91RI.png)](http://www.alloyteam.com/wp-content/uploads/2014/01/AMIfv95185jJiijbsmNm9-6ixteI2B1XXGbIJ4YZzJwGjE4c2f-ff9vSwA_kkNwqVu4hBs6w85iPl5nRziXA8e8HN9dDWrKP94tO6Alt-R_dhNf0wFj1leWwxkBjnw_39GALo7xTHqadqKRe_YsSZ_A9GVf0As0Yjx3i_QrdC943KjQjG5W91RI.png)

生成的 CSS 选择器将不再限制于你的样式或者 JavaScript，它们也能被在 [WebDriver](http://www.seleniumhq.org/docs/03_webdriver.jsp#by-css) 测试中的定位策略所代替。

### 3. 通过扩展插件可以设置开发者工具的主题

用户样式表现在可以通过开发者工具试验（选择框："Allow custom UI themes"）即允许一个 Chrome 扩展  来实现开发者工具样式的自定义。可以看看这个[作为例子的开发者工具扩展](https://github.com/paulirish/sample-devtools-theme-extension)。

[![unnamed](http://www.alloyteam.com/wp-content/uploads/2014/01/unnamed.jpg)](http://www.alloyteam.com/wp-content/uploads/2014/01/unnamed.jpg)

### 4.history 的 [popstate](http://www.whatwg.org/specs/web-apps/current-work/#event-popstate) 监听事件可以设置断点

'popstate' 现在可以在源码面板侧边栏中设置一个事件监听断点。

### 5. 控制台的正则过滤

在 console 面板中可以使用正则表达式来过滤 console 的信息。

### 6. 容易移除事件监听器

### 7. 去除无效 CSS 警告

### 8. 图像 resize 事件详情

[![AMIfv94BWaMZ3gqzavJEMObw_L8d_P5UusoB6sQji4J9EewmTS6N_JzEhsweSY_jjBR2QwILW7s-8e1jQH9Rj2oFeiz1M-Tsbfr1X43EdF2xbWhllAAkTX2AyWJ6alryzLMQYayZIj3wYZJ1vV72_JKWFKW_aQIUeBf6B0djM6QlzDzwSD8I5nQ](http://www.alloyteam.com/wp-content/uploads/2014/01/AMIfv94BWaMZ3gqzavJEMObw_L8d_P5UusoB6sQji4J9EewmTS6N_JzEhsweSY_jjBR2QwILW7s-8e1jQH9Rj2oFeiz1M-Tsbfr1X43EdF2xbWhllAAkTX2AyWJ6alryzLMQYayZIj3wYZJ1vV72_JKWFKW_aQIUeBf6B0djM6QlzDzwSD8I5nQ.png)](http://www.alloyteam.com/wp-content/uploads/2014/01/AMIfv94BWaMZ3gqzavJEMObw_L8d_P5UusoB6sQji4J9EewmTS6N_JzEhsweSY_jjBR2QwILW7s-8e1jQH9Rj2oFeiz1M-Tsbfr1X43EdF2xbWhllAAkTX2AyWJ6alryzLMQYayZIj3wYZJ1vV72_JKWFKW_aQIUeBf6B0djM6QlzDzwSD8I5nQ.png)

### 9. 以数据 URL 形式复制图像 (Copy image as data URL)

[![AMIfv97-nkjke3aVPpNpWLw0jr8bKKbwP4SkmEEeYGiANKkVJlIqKrl8fheXFU0moWxlspQqYs5aq3G8D441h2vRGivXzToe0zQJcXEv23rt5ZRIn2f6-bqLTGdYDXZx9F7agLn_rVNsY-XzLtRGZzIwQDyijcFJM6ZdCJN-gRwwLDpNPWvlzqw](http://www.alloyteam.com/wp-content/uploads/2014/01/AMIfv97-nkjke3aVPpNpWLw0jr8bKKbwP4SkmEEeYGiANKkVJlIqKrl8fheXFU0moWxlspQqYs5aq3G8D441h2vRGivXzToe0zQJcXEv23rt5ZRIn2f6-bqLTGdYDXZx9F7agLn_rVNsY-XzLtRGZzIwQDyijcFJM6ZdCJN-gRwwLDpNPWvlzqw.png)](http://www.alloyteam.com/wp-content/uploads/2014/01/AMIfv97-nkjke3aVPpNpWLw0jr8bKKbwP4SkmEEeYGiANKkVJlIqKrl8fheXFU0moWxlspQqYs5aq3G8D441h2vRGivXzToe0zQJcXEv23rt5ZRIn2f6-bqLTGdYDXZx9F7agLn_rVNsY-XzLtRGZzIwQDyijcFJM6ZdCJN-gRwwLDpNPWvlzqw.png)

### 10. 数据 URI 过滤

[![AMIfv95zJ7I2mIMqp8WwqjIVUB1xUXTPG9NcPmw6_FlQQWFgfNknnXOhs3N3CtjcJA6ekXa3NuFB62MWY_YJHaZpljVAbqLpvslEPWixV_oBqnFE_SupZauQ9oJH0DMhMTc2Sl7r9ev6zLPodhqRh_UbMbEAdjCwtQ](http://www.alloyteam.com/wp-content/uploads/2014/01/AMIfv95zJ7I2mIMqp8WwqjIVUB1xUXTPG9NcPmw6_FlQQWFgfNknnXOhs3N3CtjcJA6ekXa3NuFB62MWY_YJHaZpljVAbqLpvslEPWixV_oBqnFE_SupZauQ9oJH0DMhMTc2Sl7r9ev6zLPodhqRh_UbMbEAdjCwtQ.png)](http://www.alloyteam.com/wp-content/uploads/2014/01/AMIfv95zJ7I2mIMqp8WwqjIVUB1xUXTPG9NcPmw6_FlQQWFgfNknnXOhs3N3CtjcJA6ekXa3NuFB62MWY_YJHaZpljVAbqLpvslEPWixV_oBqnFE_SupZauQ9oJH0DMhMTc2Sl7r9ev6zLPodhqRh_UbMbEAdjCwtQ.png)

英文原文地址：<http://updates.html5rocks.com/2013/12/DevTools-Digest-December-2013>

近期项目比较紧急的缘故，目前只做摘要翻译，后续继续更多的补全更新