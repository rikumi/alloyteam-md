---
title: Google 推荐的 HTML5 代码规范
date: 2012-07-09
author: TAT.Kinvix
source_link: http://www.alloyteam.com/2012/07/google-recommends-the-html5-code-specifications/
---

<!-- {% raw %} - for jekyll -->

Google 作为业界的领头羊，为 HTML5 代码规范作出了详尽实用的规范，一起来学习吧！

**1. 协议头：**

建议在指向图片或其他媒体文件、样式表和脚本的 URL 地址中省略 http：https&#x3A; 协议部分，除非已知相应文件不能同时兼容 2 个协议。

&lt;br>  
&lt;!-- Not recommended 不推荐 -->&lt;br>  
&lt;script src="[http://www.google.com/js/gweb/analytics/autotrack.js">&lt;/script>&lt;br>](http://www.google.com/js/gweb/analytics/autotrack.js%22%3E%3C/script%3E%3Cbr%3E)  
&lt;!-- Recommended 推荐 -->&lt;br>  
&lt;script src="//[www.google.com/js/gweb/analytics/autotrack.js">&lt;/script>&lt;br>](http://www.google.com/js/gweb/analytics/autotrack.js%22%3E%3C/script%3E%3Cbr%3E)  
/\* Not recommended 不推荐 \*/&lt;br>  
.example {&lt;br>  
background: url([http://www.google.com/images/example);&lt;br>](<http://www.google.com/images/example);%3Cbr%3E>)  
}&lt;br>  
/\* Recommended 推荐 \*/&lt;br>  
.example {&lt;br>  
background: url(//[www.google.com/images/example);&lt;br>](<http://www.google.com/images/example);%3Cbr%3E>)  
}

注：这个倒是真正平日不注意的，只要是绝对地址，http：总是带着。如果仔细想一想，还真有道理。

**2. 缩进：每次缩进使用双空格  
**不要使用 tab 制表符或制表符加空格的混合方式缩进

[?](http://www.mxria.com/html5/h201205111471.htm#)

<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div></td><td><div><div><code>&lt;ul&gt;&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>&lt;li&gt;mxria.com&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>&lt;li&gt;www.mxria.com&lt;br&gt;</code></div><div><code>&lt;/ul&gt;&lt;br&gt;</code></div><div><code>.example {&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>color</code><code>: </code><code>blue</code><code>;&lt;br&gt;</code></div><div><code>}</code></div></div></td></tr></tbody></table>

**3. 大小写：只使用小写**

所有的代码都应是小写的，包括元素名称、属性，属性值（除非 text 或 CDATA 的内容）、选择器、css 属性、属性值（字符串除外）

[?](http://www.mxria.com/html5/h201205111471.htm#)

<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div></td><td><div><div><code>&lt;br&gt;</code></div><div><code>&lt;!-- Not recommended 不推荐--&gt;&lt;br&gt;</code></div><div><code>&lt;A HREF=</code><code>"/"</code><code>&gt;Home&lt;/A&gt;&lt;br&gt;</code></div><div><code>&lt;!-- Recommended 推荐--&gt;&lt;br&gt;</code></div><div><code>&lt;img src=</code><code>"mxria.png"</code> <code>alt=</code><code>"MXRIA"</code><code>&gt;</code></div></div></td></tr></tbody></table>

**4. 尾随空格  
**尾随空格是不必要的，容易搞复杂 diff 文件。这个绝对是经验教训的总结！！！

[?](http://www.mxria.com/html5/h201205111471.htm#)

<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div>1</div><div>2</div><div>3</div><div>4</div></td><td><div><div><code>&lt;!-- Not recommended --&gt;&lt;br&gt;</code></div><div><code>&lt;p&gt;What?_&lt;br&gt;</code></div><div><code>&lt;!-- Recommended --&gt;&lt;br&gt;</code></div><div><code>&lt;p&gt;Yes please.</code></div></div></td></tr></tbody></table>

**5. 编码格式：使用 UTF-8**

请确保您的编辑器使用的字符编码？？为 UTF-8，没有字节顺序标记。在 html 模板或文档中通过 &lt;meta charset="utf-8"> 来

定义编码格式。关于编码格式参考 Character Sets & Encodings in XHTML, HTML and CSS

**6. 注释  
**根据需要解释代码，这个就不多说了，团队开发这个非常重要，尽管很多时候大家不愿意遵守，但确实重要！！！

**7.TODO 待定项  
**尚未实现的或待定的内容一定要标识强调出来，利用 TODO 辨识，而非其他诸如 @@来强调。  
在 todo 项中如果有必要列明联系人，比如负责人  
在 TODO 后追加一个冒号作为行动内容，例如 TODO：为美瑞网增加 html5 模板

**8. 文档类型：使用 HTML5**

使用&lt;!DOCTYPE html>.HTML（text/html）类型文件相对 XHTML（alication/xhtml+xml）文件，在浏览器及框架支持上和优化空间上都要好很多。  
**9.HTML 合法性验证**

合法的使用 HTML，并利用 w3c 的工具（W3C HTML validator）进行检查。唯一例外就是因为性能原因需要压缩文件大小。  
原文如下：Use valid HTML code unless that is not possible due to otherwise unattainable performance goals  regarding file size. 但这个确实很难想象，省略标签节省的文件大小能有多少字节？但带来的问题可是风险居高哦！

[?](http://www.mxria.com/html5/h201205111471.htm#)

<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div></td><td><div><div><code>&lt;br&gt;</code></div><div><code>&lt;!-- Not recommended 不推荐--&gt;&lt;br&gt;</code></div><div><code>&lt;title&gt;Test&lt;/title&gt;&lt;br&gt;</code></div><div><code>&lt;article&gt;This is only a test.&lt;br&gt;</code></div><div><code>&lt;!-- Recommended 推荐--&gt;&lt;br&gt;</code></div><div><code>&lt;!DOCTYPE html&gt;&lt;br&gt;</code></div><div><code>&lt;meta charset=</code><code>"utf-8"</code><code>&gt;&lt;br&gt;</code></div><div><code>&lt;title&gt;Test&lt;/title&gt;&lt;br&gt;</code></div><div><code>&lt;article&gt;This is only a test.&lt;/article&gt;</code></div></div></td></tr></tbody></table>

**10. 语义性  
**根据目的来合理使用 HTML，这点对于 HTML5 而言尤为重要。下面例子可以对比，能实现同样的结果，但效率和可读性却有很大差别。

[?](http://www.mxria.com/html5/h201205111471.htm#)

<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div></td><td><div><div><code>&lt;br&gt;</code></div><div><code>&lt;!-- Not recommended --&gt;&lt;br&gt;</code></div><div><code>&lt;div onclick=</code><code>"goToRecommendations();"</code><code>&gt;All recommendations&lt;/div&gt;&lt;br&gt;</code></div><div><code>&lt;!-- Recommended --&gt;&lt;br&gt;</code></div><div><code>&lt;a href=</code><code>"recommendations/"</code><code>&gt;All recommendations&lt;/a&gt;</code></div></div></td></tr></tbody></table>

对于 HTML5 而言，例如 header、footer、nav、section 等跟 div 能实现的功能基本类似，但是语义性上有着天壤之别。

**11. 多媒体后备：为多媒体提供备选内容**

这个属于老生长谈的内容，典型就是为 img 添加 alt 内容。

**12. 关注点分离  
**这点很重要，严格遵守将组织结构 (markup)、表现样式 (style) 和行为动作 (script) 分开处理的原则，并且尽量使三者之间的关联度降到最小。这主要是基于维护性的考虑，通常，更新 style 文件或脚本文件比更改 HTML 文件的代价要小很多，试想一下，对于一个有超过 10 万页面的网站进行局部颜色调整，是每个 html 文件修改容易还是修改一个 style 文件容易？

**12. 可选 Tags：省略可选的标签**

[?](http://www.mxria.com/html5/h201205111471.htm#)

<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div><div>11</div><div>12</div><div>13</div><div>14</div><div>15</div></td><td><div><div><code>&lt;strong&gt;&lt;br&gt;</code></div><div><code>&lt;/strong&gt;&lt;!-- Not recommended --&gt;&lt;br&gt;</code></div><div><code>&lt;!DOCTYPE html&gt;&lt;br&gt;</code></div><div><code>&lt;html&gt;&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>&lt;head&gt;&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;title&gt;Spending money, spending bytes&lt;/title&gt;&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>&lt;/head&gt;&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>&lt;body&gt;&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;p&gt;Sic.&lt;/p&gt;&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>&lt;/body&gt;&lt;br&gt;</code></div><div><code>&lt;/html&gt;&lt;br&gt;</code></div><div><code>&lt;!-- Recommended --&gt;&lt;br&gt;</code></div><div><code>&lt;!DOCTYPE html&gt;&lt;br&gt;</code></div><div><code>&lt;title&gt;Saving money, saving bytes&lt;/title&gt;&lt;br&gt;</code></div><div><code>&lt;p&gt;Qed.</code></div></div></td></tr></tbody></table>

**13. 实体引用  
**假定开发团队内，文件和编辑器都是使用同样的编码格式（UTF-8），则没有必要使用实体引用的方式，例如—,

”, or ☺ 除非一些 HTML 中具有特定含义的字符，如 "&lt;", 或不可见字符如空格

**14.Type 属性：省略  
**将样式表和脚本中的 Type 省略，除非你不是用的 css 或 javascript，在 HTML5 中，该值默认是 text/css 和 text/javascript

[?](http://www.mxria.com/html5/h201205111471.htm#)

<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div><div>11</div></td><td><div><div><code>&lt;br&gt;</code></div><div><code>&lt;!-- Not recommended --&gt;&lt;br&gt;</code></div><div><code>&lt;link rel=</code><code>"stylesheet"</code> <code>href=</code><code>"//www.google.com/css/maia.css"</code><code>&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>type=</code><code>"text/css"</code><code>&gt;&lt;br&gt;</code></div><div><code>&lt;!-- Recommended --&gt;&lt;br&gt;</code></div><div><code>&lt;link rel=</code><code>"stylesheet"</code> <code>href=</code><code>"//www.google.com/css/maia.css"</code><code>&gt;&lt;br&gt;</code></div><div><code>&lt;!-- Not recommended --&gt;&lt;br&gt;</code></div><div><code>&lt;script src=</code><code>"//www.google.com/js/gweb/analytics/autotrack.js"</code><code>&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>type=</code><code>"text/javascript"</code><code>&gt;&lt;/script&gt;&lt;br&gt;</code></div><div><code>&lt;!-- Recommended --&gt;&lt;br&gt;</code></div><div><code>&lt;script src=</code><code>"//www.google.com/js/gweb/analytics/autotrack.js"</code><code>&gt;&lt;/script&gt;</code></div></div></td></tr></tbody></table>

**15.block，list 或 table 元素  
**针对每个 block，list 或 table 元素另起一行，并在每个子元素前缩进。这样可读性好，例如：

[?](http://www.mxria.com/html5/h201205111471.htm#)

<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div><div>11</div><div>12</div><div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div></td><td><div><div><code>&lt;blockquote&gt;&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>&lt;p&gt;&lt;em&gt;Space&lt;/em&gt;, the final frontier.&lt;/p&gt;&lt;br&gt;</code></div><div><code>&lt;/blockquote&gt;&lt;br&gt;</code></div><div><code>&lt;ul&gt;&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>&lt;li&gt;Moe&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>&lt;li&gt;Larry&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>&lt;li&gt;Curly&lt;br&gt;</code></div><div><code>&lt;/ul&gt;&lt;br&gt;</code></div><div><code>&lt;table&gt;&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>&lt;thead&gt;&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;tr&gt;&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;th scope=</code><code>"col"</code><code>&gt;Income&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;th scope=</code><code>"col"</code><code>&gt;Taxes&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;</code><code>&lt;tbody&gt;&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;tr&gt;&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;td&gt;$ 5.00&lt;br&gt;</code></div><div><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><code>&lt;td&gt;$ 4.50&lt;br&gt;</code></div><div><code>&lt;/table&gt;</code></div></div></td></tr></tbody></table>

对于使用 HTML5 的朋友，可以参考。当然，不同团队还会整理出适合自己的代码规范，上述应该来说属于比较基本的规则内容。


<!-- {% endraw %} - for jekyll -->