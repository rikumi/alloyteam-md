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

<table width="10%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-css"> .selectedIcon{ 
	 border:5px solid #ACC6F3; 
 } 
 .unSelectedIcon{ 
	 border:5px solid #C0D4F7; 
 }</code></pre></td></tr></tbody></table>

但这样的一个实现实际上违反了可访问检查列表中的一项：不能仅仅通过颜色来区分不同的元素，因为在高对比度下只有黑色或白色，这样的区分在高对比度下是没有任何作用的。我们很容易想到的一种办法就是只有选中的时候才加边框，未选中时则没有边框，这样就可以区分出来了。修改如下：

**清单 7. 图片被选中时修改后的 CSS**

<table width="10%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-css"> .selectedIcon{ 
	 border:5px solid #ACC6F3; 
 } 
 .unSelectedIcon{ 
	 border:0 none; 
 }</code></pre></td></tr></tbody></table>

这样引起的问题是，图片的布局在选中的时候会浮动，增加了 5px 的边框，看起来效果就很差。那么怎么保证布局又满足可访问性的要求呢？ 可以在上面 CSS 的基础上通过 padding 属性使得布局正确：

**清单 8. 图片被选中时正确的 CSS**

<table width="10%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-css"> .selectedIcon {border:1px solid #ACC6F3; 	 padding:4px;} 
 .unSelectedIcon {border:0 none; 	 padding:5px;}</code></pre></td></tr></tbody></table>

这样保证整体的边界都是 5px，在高对比度下的效果如图 9 所示：

**图 9. 图片被选中时的高对比度效果图**  
![Image](http://www.ibm.com/developerworks/cn/web/1003_sunqy_access/imageselectedh.gif)

### 关于 Table

Table 分为两类：一类是做布局的 table，一类是数据 table。对于布局用的 table，读屏软件没必要知道这是一个表，可以通过设置 role=presentation 使 JAWS 忽略这个表，只关注里面的内容。对于数据表格，则需要设置 caption 属性，说明整个表是用来做什么的，使得 JAWS 可以告诉用户这个表的作用。对于每一个单元内的数据，还应该通过 th 属性使得 JAWS 能识别这个数据的表头是什么。对于复杂表，可以通过 id 和 header 属性来标识。如图 10 所示 :

**图 10. 数据图表**  
![Image](http://www.ibm.com/developerworks/cn/web/1003_sunqy_access/table.gif)

以第一行的数字 5 为例，正常人可以很容易得看出 5 指的是一年级 Mr.Henry 老师这个班的男生有 5 个，但当 JAWS 面对这个数字 5 的时候，怎么能识别出来呢？通过 header 来标识表头，header 的值就指向对应表头的 id。对应的 HTML 如下：

**清单 9. 数据图表**

<table width="10%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html"> &lt;tr&gt; 
	 &lt;th id="class"&gt; Class &lt;/th&gt; 
	 &lt;th id="teacher"&gt; Teacher &lt;/th&gt; 
	 &lt;th id="boys"&gt; #of Boys &lt;/th&gt; 
	 &lt;th id="girls"&gt; #of Girls &lt;/th&gt; 
 &lt;/tr&gt; 
 &lt;tr&gt; 
	 &lt;th id="1stgrade" rowspan="2"&gt; 1st Grade &lt;/th&gt; 
	 &lt;th id="MrHenry" headers="1stgrade teacher"&gt; Mr . Henry &lt;/th&gt; 
	 &lt;td headers="1stgrade MrHenry boys"&gt; 5 &lt;/td&gt; 
	 &lt;td headers="1stgrade MrHenry girls"&gt; 4 &lt;/td&gt; 
 &lt;/tr&gt; 
 &lt;tr&gt; 
	 &lt;th id="MrsSmith" headers="1stgrade teacher"&gt; Mrs . Smith &lt;/th&gt; 
	 &lt;td headers="1stgrade MrsSmith boys"&gt; 7 &lt;/td&gt; 
	 &lt;td headers="1stgrade MrsSmith girls"&gt; 9 &lt;/td&gt; 
 &lt;/tr&gt; 
 &lt;tr&gt; 
	 &lt;th id="2ndgrade" rowspan="3"&gt; 2nd Grade &lt;/th&gt; 
	 &lt;th id="MrJones" headers="2ndgrade teacher"&gt; Mr . Jones &lt;/th&gt; 
	 &lt;td headers="2ndgrade MrJones boys"&gt; 3 &lt;/td&gt; 
	 &lt;td headers="2ndgrade MrJones girls"&gt; 9 &lt;/td&gt; 
 &lt;/tr&gt; 
 &lt;tr&gt; 
	 &lt;th id="MrsSmith" headers="2ndgrade teacher"&gt; Mrs . Smith &lt;/th&gt; 
	 &lt;td headers="2ndgrade MrsSmith boys"&gt; 4 &lt;/td&gt; 
	 &lt;td headers="2ndgrade MrsSmith girls"&gt; 3 &lt;/td&gt; 
 &lt;/tr&gt; 
 &lt;tr&gt; 
	 &lt;th id="MrsKelly" headers="2ndgrade teacher"&gt; Mrs . Kelly &lt;/th&gt; 
	 &lt;td headers="2ndgrade MrsKelly boys"&gt; 6 &lt;/td&gt; 
	 &lt;td headers="2ndgrade MrsKelly girls"&gt; 9 &lt;/td&gt; 
 &lt;/tr&gt;</code></pre></td></tr></tbody></table>

### 关于 Form

Form 元素需要关联一个 label 元素，所有的 button 都已经有了一个隐含的 label，所以不再需要显示关联。对于 Input，Select， Checkbox， Radio button 则都需要显示一个 label 元素。这样 JAWS 在面对这个表单元素的时候才能告诉用户这个表单的作用。例如下面清单 10 中的 input， JAWS 会告诉用户这个是需要输入名字的一个输入框。当 label 属性不方便使用的时候，还可以通过 title 属性达到相同的效果，也可以满足 Webking 检查的需要。清单 10 中的两种写法都可以。但前提是 Name 不需要被显示出来。当 title 和 label 都设置的时候 title 会被 JAWS 忽略。

**清单 10. Form 元素示例**

<table width="10%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html"> &lt;label for="name1"&gt;Name:&lt;/label&gt; 
 &lt;input name="name" id="name1" size="30" /&gt; 
或 
 &lt;input name=”name” id=”name1” size=”30” title=”name”&gt;</code></pre></td></tr></tbody></table>

当一个表单元素如果前后都需要描述的时候， label 就显得力不从心了。ARIA 规范的出现解决了这一问题。aria-labelledby 属性可以设置多个值，说明这个表单元素是被那些值所描述的，aria-describedby 属性则更详细的扩展了这个描述。如图 11 所示：

**图 11. 需要多个 Label 描述的输入框**  
![Image](http://www.ibm.com/developerworks/cn/web/1003_sunqy_access/refresh.gif)

当 JAWS 把焦点放在 10 上的时候，会告诉用户 10 表示的是 10 分钟刷新一次。对应的 HTML 代码如清单 11 所示。aria-required 的属性标识这个元素是必须的，JAWS 识别此元素并告知用户必须输入此元素。我们可以看到中间的 input 元素被多个元素来描述（aria-labelledby 中的几个 id 值），这样 JAWS 就能够识别这个标签，并且按照这个标签的顺序读出前后的 label， 并且提示用户如果还有更详细的描述以及如何获取这个更详细的描述。当用户需要时，aria-describedby 所对应的元素信息就会被读出来。增强了视力有障碍人士与普通人了解内容的一致性。

**清单 11. 需要多个 Label 描述的输入框**

<table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-c"> &lt;div&gt; 
	 &lt;span id="labelRefresh"&gt; 
		&nbsp;&nbsp;&lt;label for=“refreshTime"&gt;Refresh after&lt;/label&gt; 
	 &lt;/span&gt; 
	 &lt;input id=“refreshTime" type="text" aria-describedby=“refreshDescriptor" 
	 aria-labelledby=" labelRefresh refreshTime refreshUnit" value="10"/&gt; 
	 &lt;span id=“refreshUnit"&gt; minutes&lt;/span&gt; 
 &lt;/div&gt; 
 &lt;div id=“refreshDescriptor"&gt;Allows you to specify the number of minutes of 
 refresh time.&lt;/div&gt;</code></pre></td></tr></tbody></table>

### 关于 Tabindex 与获取焦点的顺序

Tabindex 属性的使用可以使得原本无法取得焦点的元素获取焦点。目的是为了使用户可以用键盘访问任何可以用鼠标访问的元素。我们知道，使用 Tab 键可以按文档顺序 tab 到所有可以获取焦点的元素。Tabindex 可以设置为 -1， 0 或者是任何自然数。

-   Tabindex = 0 就使原本无法获取焦点的元素可以在用户 tab 的时候获取焦点，并且按照文档顺序排列。
-   Tabindex = -1 使得元素可以获取焦点，但当用户用 tab 键访问的时候并不出现在 tab 的列表里面。可以方便的通过 Javascript 设置上下左右键的响应事件。非常有利于应用小部件（widget）内部的键盘访问。
-   Tabindex 设置为大于 0 的数字则可以控制用户 Tab 时候的顺序，一般很少用。

当用户使用 Tab 键浏览页面时，元素获取焦点的顺序是按照 HTML 代码里面元素出现的顺序排列的，有时跟实际看到的页面顺序并不一致。例如图 12 所示的页面：

**图 12. 图片被选中时的高对比度效果图**  
![Image](http://www.ibm.com/developerworks/cn/web/1003_sunqy_access/page.gif)

按照页面顺序，tab 的顺序为自左向右，可实际上操作的时候却发现 “search all” 出现在了 “go to edit” 的前面。对应的 HTML 代码如清单 12 所示：

**清单 12. 页面获取 focus 的顺序**

<table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-css"> &lt;div&gt; 
&nbsp;&nbsp; &lt;span style=”float:left;”&gt; 
			 welcome page 
&nbsp;&nbsp; &lt;/span&gt; 
&nbsp;&nbsp; &lt;span style=”float:right;margin-left:6em;”&gt; 
			 search all 
&nbsp;&nbsp; &lt;/span&gt; 
&nbsp;&nbsp; &lt;span style=”float:right;”&gt; 
		&nbsp;&nbsp; go to edit 
&nbsp;&nbsp; &lt;/span&gt; 
 &lt;/div&gt;</code></pre></td></tr></tbody></table>

原来是通过 float:right 达到了布局上的效果，实际文档顺序确实是 search all 在前面的。所以为了不引起混淆，最后能保持代码的顺序与实际呈现出来的页面上的顺序一致。可以修改上面的代码为清单 13 所示：

**清单 13. 页面获取 focus 的顺序 -- 调整后**

<table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-css"> &lt;div&gt; 
&nbsp;&nbsp; &lt;span style=”float:left;”&gt; 
			 welcome page 
	 &lt;/span&gt; 
	 &lt;span style=”float:right;width:15em;”&gt; 
		&lt;span style=”float:left;”&gt; 
				&nbsp;&nbsp; go to edit 
	&nbsp;&nbsp;&nbsp;&nbsp;&lt;/span&gt; 
		&lt;span style=”float:right;”&gt; 
				&nbsp;&nbsp;search all 
	&nbsp;&nbsp;&nbsp;&nbsp;&lt;/span&gt; 
	 &lt;/span&gt; 
 &lt;/div&gt;</code></pre></td></tr></tbody></table>

### 关于隐藏的内容

隐藏的内容分为两种，一种是为了布局的需要，在条件满足的情况下才会显示出来；另一种是只给读屏软件读的内容：有时候我们为了使读屏软件更准确的读取信息，会提供一些额外的描述来达到此效果，但为了不给正常用户带来困扰，这些内容对正常用户来说是隐藏起来的。隐藏内容我们通常用 display：none 或者 visibility:hidden 来表示，但读屏软件同样也会忽略这类内容。那如何隐藏内容又能使读屏软件读出来呢？另外一种隐藏内容的方式是使用绝对定位使得内容不出现在当前屏幕上，如：{position:absolute;top:-30000px;} 所以在选择使用哪种方式隐藏内容时就需要慎重考虑，display:none visibility:hidden 对任何人都是隐藏的，如果想只给读屏软件读到就需要使用上面的绝对定位方式。例如在图 13 所示的菜单的选中项上加上如下的 css：  
**清单 14. 只给读屏软件读的内容**

<table width="10%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-css"> &lt;span&gt;&nbsp;&nbsp;is selected&lt;/span&gt; 
 .access{
 position:absolute;
 top:-30000px;
 }</code></pre></td></tr></tbody></table>

**图 13. 菜单**  
![Image](http://www.ibm.com/developerworks/cn/web/1003_sunqy_access/menu.gif)

这样当用户使用 JAWS 浏览每一个菜单项时，在选中项上就能听到哪一项是当前的所选中。

高对比度模式的小技巧

系统切换到高对比度模式，只有黑白两色，很多在正常模式下依靠颜色来区分的（如界面边界）都无法辨识了，写在 CSS 里面的很多图片也都无法显示出来。此时就需要在高对比度下增加边界或者另外 DOM 节点来显示同样的内容。Dojo 的 WAIState Api 提供了一种方式来判断系统是否处于高对比模式，如果是则在 body 上增加 dijit_a11y 的一个 CSS。这样可以在正常模式下显示一个 DOM 节点在高对比度下显示另外一个 DOM 节点，从而方便的区分。如图 14 所展示的正常模式与高对比模式下的对比：

**图 14. 高对比模式与正常模式的对比**  
![Image](http://www.ibm.com/developerworks/cn/web/1003_sunqy_access/contrast.gif)

正常模式下如左图所示，子菜单通过一个图片标识，但这个图片是在 CSS 里面设置的，切换到高对比度模式即无法显示出来。此时，我们增加一个在高对比度模式下才显示出来的节点，达到如图右所示的效果，在高对比度下显示一个 + 号。代码清单如清单 15 所示，在高对比模式下，dijit_a11y 加在 body 上，dijitMenuExpandA11y 所对应的 DOM 即应用右面的 CSS 得以显示出来。

**清单 15. 正常模式与高对比模式显示不同的 Dom 节点**

<table width="10%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-css">&lt;td waiRole="presentation"&gt;
&lt;div dojoAttachPoint="arrowWrapper" style="visibility: hidden"&gt;
&lt;img src="${_blankGif}" alt=""&gt;
&lt;span&gt;+&lt;/span&gt;
&lt;/div&gt; 
&lt;/td&gt;&nbsp;&nbsp;
&nbsp;
tundra .dijitMenuExpand { 
width: 7px; 
height: 7px; 
background-image: url('images/spriteArrows.png'); 
background-position: -14px 0px; 
} 
.dijitMenuExpandA11y {display: none; } 
.dijit_a11y .dijitMenuExpandA11y {display: inline; }</code></pre></td></tr></tbody></table>

### 快速链接到主要内容

为了使屏幕阅读器可以略过页面中的一些普通元素快速跳到页面的功能区域，开发人员需要在页面中添加一些链接。在下面的页面中，主要内容即为左侧的导航栏，用户可以通过点击导航栏中的链接打开相应的页面。清单 4 和清单 5 列出的代码可以帮助有视力障碍的用户快速定位到导航栏。  
**图 1. 示例页面**  
![图 1. 示例页面](http://www.ibm.com/developerworks/cn/web/1106_yucm_web20access/image003.jpg)

**清单 4. HTML 代码片段**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html"> &lt;div&gt;&lt;a href="#ibm-content"&gt;Skip to main content&lt;/a&gt;&lt;/div&gt; 
 ... 
 &lt;!-- CONTENT_BEGIN --&gt; 
 &lt;div id="ibm-content"&gt; 
&nbsp;
 &lt;!-- TITLE_BEGIN --&gt; 
 &lt;div id="ibm-content-head"&gt; 
	 &lt;ul id="ibm-navigation-trail"&gt; 
		 &lt;li&gt;&lt;a href="/able/index.html"&gt;
		 Human Ability and Accessibility Center&lt;/a&gt;&lt;/li&gt; 
		 &lt;li&gt;&lt;a href="/able/guidelines/index.html"&gt;Developer guidelines&lt;/a&gt;&lt;/li&gt; 
	 &lt;/ul&gt; 
	 &lt;h1&gt;Web checklist&lt;/h1&gt;&lt;br /&gt; 	
 &lt;/div&gt; 
 .....</code></pre></td></tr></tbody></table>

**清单 5. CSS 代码片段**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-css"> div.ibm-access { 
	 position: absolute; 	 margin-top: -9999px; 
 }</code></pre></td></tr></tbody></table>

无障碍访问的表单控件

-   标签控件与标题属性

在 Web 页面中经常会用到表单进行信息的录入与更新。大部分的表单控件可以自动与一个标签控件建立关联，使得屏幕阅读器可以将标签中的文字内容作为表单录入控件的说明信息，比如提交按钮。但是诸如文本框，下拉菜单，复选框以及单选按钮这样的控件则需要开发人员为其指定一个标签控件，同时设置标签控件的 for 属性值为与其建立关联的控件的 id 属性值。清单 6 与清单 7 分别列举了如何为文本框与下拉列表添加与其关联的标签控件。

**清单 6. 为文本框的标签控件设置 for 属性**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html"> &lt;label for="name1"&gt;Name&lt;/label&gt;&lt;input name="name" id="name1" size="30" /&gt;</code></pre></td></tr></tbody></table>

**清单 7. 为下拉列表的标签控件设置 for 属性**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-c"> &lt;label for="shiptype"&gt;Select your shipping method&lt;/label&gt;&lt;select id="shiptype" 
 name="ship_method" size="1"&gt;&lt;option selected value=""&gt;
 Ground – 7 business days&lt;/option&gt;&lt;option value="air"&gt;
 Air – 3 business days&lt;/option&gt;&lt;option value="nextday"&gt;
 Next day air – 1 business day&lt;/option&gt;&lt;/select&gt;</code></pre></td></tr></tbody></table>

然而并不是所有的表单控件都适合采用上述方式添加标签以保证其可读性，单选按钮通常是一组按钮具有同一个 id 属性值，所以我们无法通过上述方法为每一个按钮添加标签，我们可以利用 title 属性来保证其可读性。例如：

**清单 8. 为复选框设置 title 属性**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html"> &lt;input type="radio" id="ERP ID" title="Select All" value="defaultSectionValueAll" checked/&gt; 
|-------10--------20--------30--------40--------50--------60--------70--------80--------9|
|-------- XML error:&nbsp;&nbsp;The previous line is longer than the max of 90 characters ---------|</code></pre></td></tr></tbody></table>

提示：无需为隐藏控件添加与其关联的标签控件。

-   必输字段

为了使得屏幕阅读器可以将必须输入的字段限制信息传达给用户，开发人员可以使用 WAI-ARIA 提供的属性，示例如下：  
**清单 9. 设置属性限制字段必须输入**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html"> &lt;label for="phone"&gt;* Phone number:&lt;/label&gt; 
 &lt;input type="text" id="phone" name="phone" aria-required="true" &gt;</code></pre></td></tr></tbody></table>

但是目前 IE8 还不支持这种属性，由于屏幕阅读器可以读出用于录入信息的表单控件的 title 属性，所以我们可以将限制信息写在 title 中。如清单 10 所示：  
**清单 10. 利用 title 属性标识字段为必输项**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html"> &lt;label for="phone"&gt;* Phone number:&lt;/label&gt; 
 &lt;input type="text" id="phone" name="phone" title="required" &gt;</code></pre></td></tr></tbody></table>

可 “读” 的图片

随着 Web 页面的友好性不断提高，图片的使用也越来越广泛。然而对于无法亲眼看到页面的用户需要借助屏幕阅读器才能够知晓当前阅读的内容是一张图片以及该图片的作用，对于页面中所有有意义的图片，尤其是一些动态的图片，比如链接或是按钮，开发人员必须要给出其 alt 属性值。如清单 11 所示：  
**清单 11. 为图片设置 alt 属性**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-c"> &lt;img src="sam.jpg" alt="Sam Palmisano" width="150" height="175" /&gt;</code></pre></td></tr></tbody></table>

提示：请尽量避免使用图片作为背景，如果需要，请在 CSS 文件中指定。

创建无障碍访问的数据表格

在 Web 页面中通常有两种用途的表格，一种用于页面布局，另外一种用于显示数据。

数据表格需要用 <th> 指定行或列的标题行，同时还需要显式地指定 summary 属性值，使得屏幕阅读器可以读出表的主要用途。如清单 12 所示：  
**清单 12. 数据表格**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html"> &lt;table border="1" summary=”A example simple data table”&lt;caption&gt;
 Boys and Girls in Elementary School Classes&lt;/caption&gt; 
&nbsp;&nbsp;&nbsp;&nbsp;&lt;tr&gt; 
&nbsp;&nbsp; &lt;th scope="col"&gt;Class&lt;/th&gt; 
&nbsp;&nbsp; &lt;th scope="col"&gt;# of Boys&lt;/th&gt; 
&nbsp;&nbsp; &lt;th scope="col"&gt;# of Girls&lt;/th&gt; 
&nbsp;&nbsp;&lt;/tr&gt; 
&nbsp;&nbsp; &lt;tr&gt; 
&nbsp;&nbsp; &lt;th scope="row"&gt;1st Grade&lt;/th&gt; 
&nbsp;&nbsp; &lt;td&gt;11&lt;/td&gt; 
&nbsp;&nbsp;&nbsp;&nbsp;&lt;td&gt;10&lt;/td&gt; 
&nbsp;&nbsp;&nbsp;&nbsp;&lt;/tr&gt;.. 
 &lt;/table&gt;</code></pre></td></tr></tbody></table>

布局表格的用途是为了页面布局美观而使用的，所以在其定义中不应该包含行或列标题行，同时设定 summary 的属性值为空。布局表格对于屏幕阅读器应该是透明的。通常情况下，如果表格有至少两行两列四个单元格，同时其大小在 200 到 16000 平方像素之间，在 JAWS 中会默认为是数据表。所以如果一个表格是为布局而设置的，请避免为其指定 summary 属性值。有些屏幕阅读器偶尔会混淆数据表格与布局表格，为了避免混淆我们可以指定 WAI-ARIA 的 role 属性值为 presentation。如清单 13 所示：

**清单 13. 设置表格的 role 属性**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html">&lt;table role="presentation"&gt;...&lt;/table&gt;;
</code></pre></td></tr></tbody></table>

然而并非所有的浏览器都支持 WAI-ARIA 属性，这种情形下，我们可以设定表格的 datatable 属性值为 0, 这样 JAWS 也会将其视为布局表格。

**清单 14. 设置表格的 datatable 属性**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-c"> &lt;table datatable="0"&gt;...&lt;/table&gt;</code></pre></td></tr></tbody></table>

Id 属性值唯一

在 Web 页面中必须保证每个元素的 id 属性值在页面中是唯一的，如果有重复 id 值，WebKing 会提示出错。

提供必要的指导信息

页面中隐式的添加一些必要的指导信息可以使得无法看到 Web 页面的用户在屏幕阅读器的帮助下清楚的了解页面的功能以及如何快速使用这些功能。如清单 15 所示：

**清单 15. 利用 <h2> 标签设置提示信息**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html">&lt;h2 style="position: absolute;left: -3000px;width: 500px;"&gt;
    Start of left navigation
&lt;/h2&gt;;
</code></pre></td></tr></tbody></table>

在 Web 页面中，为了保证表单中录入的数据真实有效，需要对表单中的一些输入字段加以验证，为保证验证生成的反馈信息可以被无障碍的访问即屏幕阅读器可以在表单验证后的第一时间将反馈信息传达给用户，需要对页面代码做一些修饰。表单验证可以分为客户端验证与服务器端验证。以下将分别讨论这两种场景。

来自客户端验证的信息

-   Dojo 输入域的验证

随着对表单控件功能性需求的不断提高，Dojo 控件得以广泛使用。大部分的 Dojo 控件都实现了无障碍访问，当输入不符合输入字段限制的数据时，屏幕阅读器可以快速捕捉并阅读错误信息。如清单 16、17 所示：

**清单 16. HTML 中加入 Dojo 输入域**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html"> &lt;label for="income1"&gt; U.S. Dollars &lt;/label&gt; 
&nbsp;
 &lt;input type="text" name="income1" id="income1" value="54775.53" 
 dojoType="dijit.form.CurrencyTextBox" 
 required="true" constraints="{fractional:true}" currency="USD" 
 invalidMessage="Invalid amount. Cents are required."&gt;</code></pre></td></tr></tbody></table>

**清单 17. 借助 JavaScript 实现验证**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html">&lt;script type="text/javascript"&gt;
    {" "}
    dojo.require("dijit.form.CurrencyTextBox");{" "}
&lt;/script&gt;;
</code></pre></td></tr></tbody></table>

在上述实例中，当输入无效的数据时，JAWS 就会阅读 invalidMessage 属性值的内容。

-   使用 WAI-ARIA 属性实现输入域验证

我们可以使用 WAI-ARIA 提供的属性使得 JAWS 可以读出验证消息。以下是一个应用场景示例，使用 JavaScript 将 **div** 的 role 属性值设置为 alert。

**清单 18. 借助 JavaScript 设置 div 的 role 属性**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-javascript"> function showErrorMsg(msg){ 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; var msgContainer = document.createElement('div'); 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;msgContainer.setAttribute('role', 'alert'); 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;msgContainer.setAttribute('id', 'alert'); 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var msg = document.createTextNode( ‘ Error Message ’ ); 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;msgContainer.appendChild(msg); 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;document.body.appendChild(msgContainer);}</code></pre></td></tr></tbody></table>

或者，开发人员可以在 html 代码中为用于错误信息显式的元素设置 role ＝ alert，在 JavaScript 代码中更新错误信息。如清单 19、20 所示：

**清单 19. HTML 代码片段**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html">&lt;p id="errorMessage" role="alert"&gt;&lt;/p&gt;;
</code></pre></td></tr></tbody></table>

**清单 20. 在 JavaScript 中设置错误信息**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-javascript"> function testAlert() 
 { 
……
 document.getElementById("errorMessage").innerText = "Invalid format"; 
……
 }</code></pre></td></tr></tbody></table>

当验证后错误信息会显示在页面中指定的位置，JAWS 会立即阅读错误信息，帮助用户快速定位到不满足输入条件限制的输入域。

来自服务器端验证的信息

服务器端验证的反馈信息与客户端有所不同，当页面提交经过服务器端验证后会重新生成页面，所以 WAI-ARIA 所提供的 role=alert 无法支持屏幕阅读器去阅读验证信息。对于服务器端验证的场景，在这里给出几种实现方案。

-   借助页面标题提示信息

页面重新加载后，JAWS 会首先阅读页面的标题，所以我们可以在页面标题中加入提示信息提醒用户当前页面校验存在错误信息。在下面的示例中，错误信息是在服务器端校验后动态生成的。

**清单 21. 在 <p> 中显示错误信息**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html">……
 &lt;p id="errorMessage"&gt;&lt;/p&gt; ……</code></pre></td></tr></tbody></table>

**清单 22. 借助 JavaScript 修改页面标题**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-c">……
 if(document.getElementById("errorMessage").innerText!="") 
 document.title +=" - Please Using arrow key to read error message"; 
……</code></pre></td></tr></tbody></table>

-   借助焦点定位提示信息

当页面重新载入时，JAWS 会首先阅读第一个获得焦点的页面元素。但是有些页面元素是无法获取焦点的，比如 &lt;**div**> 和 &lt;**p**>。如果错误信息是在 div 中显示，我们可以通过设置 tabindex 的值为 -1 使得 div 可以在 JavaScript 中设置其获取焦点。如清单 23、24 所示：

**清单 23. 在 <div> 中显示错误信息**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html">&lt;div id="errorMessage" tabindex="-1"&gt;
    ……
&lt;/div&gt;;
</code></pre></td></tr></tbody></table>

**清单 24. 在 JavaScript 中设置焦点**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-">…
 document.getElementById(“errorMessage”).focus 
……</code></pre></td></tr></tbody></table>

当页面元素的 tabindex 值为 -1 时，这个元素并不会被包含在 tab 队列中。开发人员只能通过代码控制其获取焦点。如果用户需要将其包含在 tab 队列中，可以将其 tabindex 值设置为 0.

多个验证消息的处理

如果有几个输入字段同时验证出错，我们可以以链接的形式显示错误信息，屏幕阅读器通过阅读链接帮助视力有障碍的用户快速定位到出错字段进行更正。每个需要校验的输入字段都需要有与其关联的 <label>。如清单 25、26 所示：

**清单 25. HTML 页面中的输入域示例**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-html"> &lt;label for="phone"&gt;* Phone number:&lt;/label&gt; 
 &lt;input type="text" id="phone" name="phone" aria-required="true" &gt;</code></pre></td></tr></tbody></table>

**清单 26. 在 JavaScript 中设置错误信息的链接目标**

<table summary="This table contains a code listing." width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><pre><code class="language-javascript"> function testError() 
 { 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; var msgContainer = document.createElement("div"); 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; var summaryMsg = document.createTextNode(“There is one error message”); 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var msg = document.createElement("a"); 
	 msg.setAttribute("href","#phone"); 
	 msg.innerText = "Phone number is required"; 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;msgContainer.appendChild(msg); 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;document.body.appendChild(msgContainer); 
 }</code></pre></td></tr></tbody></table>

提示 ：从上述示例中可以看到如果在当前页面显示错误信息并且保证其可读，会增加代码的复杂性。在满足需求的情况下可以尝试在特定的错误页面中显示错误信息，这样可以降低代码的复杂性。

伴随页面功能性需求的不断提高，人们也越来越关注页面的美观性。但是在设置页面的颜色方案时要保证页面的字体颜色与其相应背景色的深浅度对比要至少达到 5：1，开发人员可以利用 Contrast Analyser 验证当前页面的颜色对比度是否满足这个比例。

**图 2.Contrast Analyser 验证**  
![Contrast Analyser 验证](http://www.ibm.com/developerworks/cn/web/1106_yucm_web20access/image007.jpg)

## 如何测试无障碍的 Web 网站应用

目前有很多用于测试无障碍访问（AVT，Accessibility Verification Test）Web 应用的工具，较为常用的有

-   **[NVDA](http://www.nvda-project.org/)**：绝大部分读屏软件都是收费的，而 [NVDA](http://www.nvda-project.org/) 是一个免费开源的读屏软件，而且做的很不错，[NVDA 2011.2 中文用户指南](http://www.topcss.org/demo/nvda-2011.2-user-guide.html "NVDA 2011.2 用户指南")
-   **WebKing**：是由 Parasoft 发布的一款静态扫描工具，用户可以在该工具中指定需要扫描的 web 页面文件的目录实现批量扫描。
-   **JAWS**：是由 Freedom Scientific 发布的一款屏幕阅读器， 它通过阅读页面的文字帮助使用者快速了解页面功能，完成相关操作。

Web 开发人员可以借助这几种工具验证所开发的 Web 页面是否可以实现无障碍访问。

## 总结

本文介绍了开发测试可访问无障碍的 Web 应用的工具，步骤以及开发中的最佳实践。应用这些最佳实践与小技巧能帮助您在开发中迅速的为您的 Web 应用提供 A11Y 的支持。

文：IBM


<!-- {% endraw %} - for jekyll -->