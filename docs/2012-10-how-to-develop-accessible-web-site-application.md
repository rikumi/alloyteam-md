---
title: 如何开发无障碍的 Web 网页应用详细手册教程指南
date: 2012-10-19
author: TAT.Kinvix
source_link: http://www.alloyteam.com/2012/10/how-to-develop-accessible-web-site-application/
---

<!-- {% raw %} - for jekyll -->

Web 无障碍设计（Accessibility in Web design，也叫网站可及性 ）是要让所创建的网站对所有用户都可用 / 可访问，不管用户的生理 / 身体能力如何、不管用户是以何种方式访问网站。

## 为什么无障碍如此重要（帮助残障人士）

为什么不是所有网站都能无障碍访问？你可能也会问自己为什么存在 “无障碍” 的问题，为什么不是所有网站都能让所有用户无障碍访问？要进行无障碍设计有许多不同原因，其中包括残疾人用户的需求、不同的人访问和使用互联网的不同途径和方式。

#### **视障用户**

视障用户包括色盲用户、完全失明用户（盲人）。如果图片不带有相关文字描述，则视障用户在理解图片方面会存在问题。如果图片没有文字描述，看不见图片的盲人用户就无法知道图片表达的是什么。色盲用户在识别设计元素（包括文字）方面也会存在问题，因为色盲用户所能识别的色彩不足以辨别所有的设计元素（包括背景色和页面颜色）。

所开发的网站，如果没有考虑到适应于屏幕发音阅读器（[读屏软件](http://baike.baidu.com/view/1271302.htm), 如 JAWS）或 “非可视” 浏览器（或叫声音浏览器、读屏浏览器，如 [MozBraille](http://mozbraille.mozdev.org/installation.html)）。读屏浏览器是一个可以发音阅读出网站的浏览器，帮助有视觉障碍的用户访问网站。一个在可视浏览器（如 IE）上看起来良好的网站，在读屏浏览器下可能听起来非常糟糕。

#### **听障用户**

听障用户在听觉上存在问题。用声音传达的信息无法被听障用户所理解，简单解决方法是提供另外途径的信息传达方式，而不仅仅是声音，例如用文字描述、用图片。

#### **残障用户（肢体伤残的用户）**

如果你不是残障用户，你无法想象他们（残疾人）的网络体验。例如，你曾经试过不使用鼠标去访问网站吗？除非你很幸运的遇到一个无障碍访问良好的网站，否则你肯定觉得非常困难。残障用户经常无法使用鼠标，除非创建网站的导航和输入方式的需求中就考虑残障人士的需求，否则残障人士可能完全无法使用你的网站。

#### **认知和神经障碍用户**

网站往往比较复杂，要想找到我们所想要的信息经常不太容易。如果网站设计的过于复杂、导航不一致、存在让人分心（抓狂）的重复性动画，情况会更加糟糕。这些设计元素会导致认知和神经有障碍的用户的使用问题，甚至会让这些用户完全无法使用网站。

## 残障人士之外（所有用户都能受益）

前面我们知道如果我们存在某方面残障，使用互联网是件困难的事情。然后，web 无障碍访问不仅仅帮助到残障人士，良好理解和遵循 Web 无障碍设计，可以让所有用户都受益、更好的服务用户。

Web 无障碍设计还可以让通过以下方式使用你的网站的用户受益：

-   使用移动手机、Web-TV 和信息岗亭的用户
-   低带宽的用户
-   在吵杂环境下使用网站的用户
-   容易被 “屏幕眩光” 伤到眼睛的用户
-   开车时的用户
-   低文化水平的用户
-   第二语言访问的用户（国外用户）
-   不同学习方式和习惯的用户

处理好 Web 无障碍访问问题也可以改善：

-   页面传输和网站维护
-   内容索引
-   内容搜索

#### **市场机会**

让你的网站具有可及性还有其它原因。根据目前数据，在许多国家残疾人用户占到人口的 10%~20%，如果能吸收前面提到的残障人士成为你的网站的用户，可以提高你网站的市场占有率。

许多国家的老龄化人口都在增加，年龄的增大会带来更多的无障碍访问问题，包括视觉障碍、听觉障碍、记忆力下降等。如果你的网站能吸收老年人用户，也会大大提升你网站的市场占有率。

所以，无障碍访问是可以直接带来经济效益的。

#### 无障碍 Web 标准

Web 无障碍指南（WCAG）2.0 定义了如何使残疾人士更方便地使用 Web 内容的方法。无障碍涉及广泛的残疾症状，包括视觉，听觉，身体，语言，认知，语言，学习以及神经残疾。尽管这些指南内容广泛，但它无法有效地满足所有类型的人群和残疾程度的人的需要。这些指南也适合老年人上网，还可让普通用户更好的使用。  
WCAG 2.0 文档旨在满足需要稳定的，可参考的技术标准的人群。被称为支持文档的其他文档以 WCAG 2.0 文档为基础，可用于其他重要的用途，包括可进行更新的能力，以说明如何将 WCAG 用于新技术的应用。支持文档包括：

1.  **[如何符合 WCAG 2.0](http://www.w3.org/WAI/WCAG20/quickref/)** - WCAG 2.0 的可定制的快速参考，包括所有的指南、成功标准以及作者正在开发和评估网页内容时可用到的技巧。
2.  **[理解 WCAG 2.0](http://www.w3.org/TR/UNDERSTANDING-WCAG20/)** - 理解和实施 WCAG 2.0 的指南。对于 WCAG 2.0 的每一个准则和成功标准，这些主要议题都有一个简短的 “理解” 文档。
3.  **[WCAG 2.0 技巧](http://www.w3.org/TR/WCAG20-TECHS/)** - - 技术和常见失败集，对于每个技巧和常见失败，另附一份文档，其中包括描述，例子，代码和测试。
4.  **[WCAG 2.0 文档](http://www.w3.org/WAI/intro/wcag20)** - 对于如何关联和链接技术文档，给出 图示和说明。

参见 [Web 内容无障碍指南（WCAG）概述](http://www.w3.org/WAI/intro/wcag.php) 里关于 WCAG 2.0 支持材料的描述，包括 WCAG 2.0 相关的教育资源。附加资源包括了以下主题，Web 无障碍商业案例，改善网站无障碍的规划实施，和无障碍政策。

## 开发无障碍可访问的 Web 网页应用

开发和测试可访问的 Web 应用主要的有以下几个步骤：

-   Webking 进行静态检查，通常由开发人员在单元测试时进行，检查 HTML 页面中不满足 CI162 所对应列表的项。目前由于 WebKing 不支持 ARIA，很多 ARIA 的标签不能被正确的识别，所以 WebKing 检查出的错误需要一一去检查区别是真正的违反 Checklist 还是由于 WebKing 不能识别 ARIA 的标签引起的。
-   键盘支持，要求所有能通过鼠标完成的操作用键盘都能达到同样的效果。
-   高对比度的支持：在高对比度模式下，屏幕只有黑白两色，要保证 Web 应用在这种模式下不丢失信息。
-   读屏软件的支持，通常由测试人员完成。测试人员模拟盲人使用读屏软件，要保证页面上的内容基本都能为读屏软件所识别，并且能完成各种操作。

### 页面头部必须包含的内容

为了保证页面的无障碍访问，首先需要在页面的头部加上 DTD 的声明以及页面默认的语言。清单 1 列出了如何在 HTML 页面中加入 DTD 声明及默认语言属性，清单 2 列出了如何在 XHTML 页面中加入 DTD 声明及默认语言属性。

**清单 1. HTML 页面中加入 DTD 声明及默认语言属性**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html"> &lt;!DOCTYPE html&gt; 
 &lt;html lang="zh-CN"&gt;</code></pre></td></tr></tbody></table>

**清单 2. XML 页面中加入 DTD 声明及默认语言属性**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html"> &lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt; 
 &lt;html xmlns="http://www.w3.org/1999/xhtml" lang="fr" xml:lang="fr"&gt;</code></pre></td></tr></tbody></table>

此外，页面的 title 属性值也是必须的，如清单 3 所示。

**清单 3. 设置 title 属性**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html"> &lt;head&gt; 
 &lt;title&gt;&lt;bean:message key="createFolder.title" /&gt;&lt;/title&gt;</code></pre></td></tr></tbody></table>

### 关于 Image

1. 图片或者动画均需提供 Alt 信息，使得读屏软件可以将图片动画的内容清楚的读出来。如图 4 所示：

**图 4.Cat 图片**  
![Image](http://www.ibm.com/developerworks/cn/web/1003_sunqy_access/cat.gif)

对应的 HTML 如下：

**清单 1. Image 的 HTML**

<table width="10%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-c"> &lt;img src="cat.gif" alt="Image about cat" /&gt;</code></pre></td></tr></tbody></table>

2. 对于某些用于装饰性的图片，则需设置 alt 为空，使得读屏软件可以忽略此元素。如图 5 的用于装饰页头的图片，实际并没有传递有价值的信息。

**图 5. 装饰性图片**  
![Image](http://www.ibm.com/developerworks/cn/web/1003_sunqy_access/decoration.gif)

对应的 HTML 如下：

**清单 2. 装饰性 Image 的 HTML**

<table width="10%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html">&lt;img src="ring.gif" alt="" /&gt;;
</code></pre></td></tr></tbody></table>

必须设置一个空 alt 属性的目的是为了能通过 Webking 的检查，并且使得读屏软件能够忽略此元素。

3. 对于图表文件，alt 属性的设置则需要简明扼要的表达出图表的信息，并不用把里面的细节都详细得描述出来。例如下面的图 6：alt 信息设置为销售额从 1996 年到 2004 年间持续稳定增长，从 400 万增长到了 1600 万。并不需要把每一年的增长额都详细得描述出来。

**图 6. Image 图表**  
![Image](http://www.ibm.com/developerworks/cn/web/1003_sunqy_access/imagetable.gif)

4. 对于放在链接里面的图片，如果已经有文字的说明，alt 也设置为空，这样避免读屏软件重复同样的内容。如下面的 HTML：

**清单 3. 无需重复设置 alt 的 Image**

<table width="10%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-c"> &lt;a href=”http://apple.com/iphone/”&gt; 
	 &lt;img src=”iphone.jpg” alt=””&gt;Apple iPhone 
 &lt;/a&gt;</code></pre></td></tr></tbody></table>

A 的内容已经指明了这是个苹果手机，IMG 的 alt 属性就没必要再设置一次了。否则读屏软件会连续读两次重复的内容，引起混乱。

5.CSS 将样式跟结构分离，使得 HTML 代码结构清晰。很多装饰性的图片也都放在 CSS 里面来加载，带来的一个问题就是在 CSS 里面的图片在高对比度模式下都无法显示。如果这个图片并不仅仅是装饰性的，还可以触发功能，那就需要从 CSS 里面拿出来，当成一个独立的 IMG 或者 INPUT 元素。例如下面的一个提示保存的图片

**图 7. 保存图片**  
![Image](http://www.ibm.com/developerworks/cn/web/1003_sunqy_access/save.gif)

写在 CSS 里面的做法是：

**清单 4. 图片写在 CSS 里面**

<table width="10%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-css"> &lt;div class=” save_button” /&gt; 
 .save_button{ 
	 background: url("images/save_button.png"); 
	 width: 33px; 
	 height: 33px; 
	 vertical-align:middle; 	
 }</code></pre></td></tr></tbody></table>

这样当用户切换到高对比度模式，这个图片就是一片空白，用户无法再去点击保存。修改如下：

**清单 5. 将 CSS 里面的图片拿出来**

<table width="10%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-c"> &lt;img src=“images/save_button.png” alt=“save”/&gt; 
 &lt;input type=“image” src=“images/save_button.png” alt=“save”/&gt;</code></pre></td></tr></tbody></table>

6. 在一个图片列表里面选中某个图片，区别选中去否我们通常的做法是用边框的颜色来标识。如下图，选中的图片边框为蓝色

**图 8. 图片被选中的正常效果图**  
![Image](http://www.ibm.com/developerworks/cn/web/1003_sunqy_access/imageselected.gif)

**清单 6. 图片被选中时对应的 CSS**


<!-- {% endraw %} - for jekyll -->