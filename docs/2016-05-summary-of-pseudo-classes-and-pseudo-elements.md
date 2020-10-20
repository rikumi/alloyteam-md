---
title: 总结伪类与伪元素
date: 2016-05-09
author: TAT.rocket
source_link: http://www.alloyteam.com/2016/05/summary-of-pseudo-classes-and-pseudo-elements/
---

<!-- {% raw %} - for jekyll -->

熟悉前端的人都会听过 css 的伪类与伪元素，然而大多数的人都会将这两者混淆。本文从解析伪类与伪元素的含义出发，区分这两者的区别，并且列出大部分伪类与伪元素的具体用法，即使你有用过伪类与伪元素，但里面总有一两个你没见过的吧。

**1. 伪类与伪元素**

先说一说为什么 css 要引入伪元素和伪类，以下是 [css2.1 Selectors 章节中对伪类与伪元素的描述](https://www.w3.org/TR/CSS2/selector.html#pseudo-elements)：

_CSS introduces the concepts of pseudo-elements and pseudo-classes  to permit formatting based on information that lies outside the document tree._

直译过来就是：css 引入伪类和伪元素概念是为了格式化文档树以外的信息。也就是说，伪类和伪元素是用来修饰不在文档树中的部分，比如，一句话中的第一个字母，或者是列表中的第一个元素。下面分别对伪类和伪元素进行解释：

伪类用于当已有元素处于的某个状态时，为其添加对应的样式，这个状态是根据用户行为而动态变化的。比如说，当用户悬停在指定的元素时，我们可以通过:hover 来描述这个元素的状态。虽然它和普通的 css 类相似，可以为已有的元素添加样式，但是它只有处于 dom 树无法描述的状态下才能为元素添加样式，所以将其称为伪类。

伪元素用于创建一些不在文档树中的元素，并为其添加样式。比如说，我们可以通过:before 来在一个元素前增加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。

**2. 伪类与伪元素的区别**

这里通过两个例子来说明两者的区别。

下面是一个简单的 html 列表片段：

```html
<ul>
        <li>我是第一个</li>
        <li>我是第二个</li>
</ul>;
```

如果想要给第一项添加样式，可以在为第一个&lt;li> 添加一个类，并在该类中定义对应样式：

**HTML:**

```html
<ul>
        <li class="first-item">我是第一个</li>
        <li>我是第二个</li>
</ul>;
```

**CSS:**

    li.first-item {
        color: orange
    }

如果不用添加类的方法，我们可以通过给设置第一个&lt;li> 的:first-child 伪类来为其添加样式。这个时候，被修饰的&lt;li> 元素依然处于文档树中。

**HTML:**

```html
<ul>
        <li>我是第一个</li>
        <li>我是第二个</li>
</ul>;
```

**CSS:**

    li:first-child {
        color: orange
    }

下面是另一个简单的 html 段落片段：

```html
<p>Hello World, and wish you have a good day!</p>;
```

如果想要给该段落的第一个字母添加样式，可以在第一个字母中包裹一个&lt;span> 元素，并设置该 span 元素的样式：

**HTML:**

```html
<p>
    <span class="first">H</span>ello World, and wish you have a good day!
</p>;
```

**CSS:**

```css
.first {
    font-size: 5em;
}
```

如果不创建一个&lt;span> 元素，我们可以通过设置&lt;p> 的:first-letter 伪元素来为其添加样式。这个时候，看起来好像是创建了一个虚拟的&lt;span> 元素并添加了样式，但实际上文档树中并不存在这个&lt;span> 元素。

**HTML:**

```html
<p>Hello World, and wish you have a good day!</p>;
```

**CSS:**

```css
p:first-letter {
    font-size: 5em;
}
```

从上述例子中可以看出，伪类的操作对象是文档树中已有的元素，而伪元素则创建了一个文档数外的元素。因此，伪类与伪元素的区别在于：有没有创建一个文档树之外的元素。

**3. 伪元素是使用单冒号还是双冒号？**

CSS3 规范中的要求使用双冒号 (::) 表示伪元素，以此来区分伪元素和伪类，比如::before 和::after 等伪元素使用双冒号 (::)，:hover 和:active 等伪类使用单冒号 (:)。除了一些低于 IE8 版本的浏览器外，大部分浏览器都支持伪元素的双冒号 (::) 表示方法。

然而，除了少部分伪元素，如::backdrop 必须使用双冒号，大部分伪元素都支持单冒号和双冒号的写法，比如::after，写成:after 也可以正确运行。

对于[伪元素是使用单冒号还是双冒号的问题](https://www.w3.org/community/webed/wiki/Advanced_CSS_selectors#CSS3_pseudo-element_double_colon_syntax)，w3c 标准中的描述如下：

_Please note that the new CSS3 way of writing pseudo-elements is to use a double colon, eg a::after { ... }, to set them apart from pseudo-classes. You may see this sometimes in CSS. CSS3 however also still allows for single colon pseudo-elements, for the sake of backwards compatibility, and we would advise that you stick with this syntax for the time being._

大概的意思就是：虽然 CSS3 标准要求伪元素使用双冒号的写法，但也依然支持单冒号的写法。为了向后兼容，我们建议你在目前还是使用单冒号的写法。

实际上，伪元素使用单冒号还是双冒号很难说得清谁对谁错，你可以按照个人的喜好来选择某一种写法。

**4. 伪类与伪元素的具体用法**

这一章以含义解析和例子的方式列出大部分的伪类和伪元素的具体用法。下面是根据用途分类的伪类总结图和根据冒号分类的伪元素总结图：

[![伪类](http://www.alloyteam.com/wp-content/uploads/2016/05/伪类.png)](http://www.alloyteam.com/wp-content/uploads/2016/05/伪类.png)

[![伪元素](http://www.alloyteam.com/wp-content/uploads/2016/05/伪元素.png)](http://www.alloyteam.com/wp-content/uploads/2016/05/伪元素.png)

某些伪类或伪元素仍然处于试验阶段，在使用前建议先在 [Can I Use](http://caniuse.com/) 等网站查一查其浏览器兼容性。处于试验阶段的伪类或伪元素会在标题中标注。

**伪类**

**状态**

由于状态伪类的用法大家都十分熟悉，这里就不用例子说明了。

**1 :link**

选择未访问的链接

**2 :visited**

选择已访问的链接

**3 :hover**

选择鼠标指针浮动在其上的元素

**4 :active**

选择活动的链接

**5 :focus**

选择获取焦点的输入字段

**结构化**

**1 :not**

一个否定伪类，用于匹配不符合参数选择器的元素。

如下例，除了第一个&lt;li> 元素外，其他&lt;li> 元素的文本都会变为橙色。

**HTML:**

```html
<ul>
        <li class="first-item">一些文本</li>
        <li>一些文本</li>
        <li>一些文本</li>
        <li>一些文本</li>
</ul>;
```

**CSS:**

```css
li:not(.first-item) {
    color: orange;
}
```

**2 :first-child**

匹配元素的第一个子元素。

如下例，第一个&lt;li> 元素的文本会变为橙色。

**HTML:**

```html
<ul>
        <li>这里的文本是橙色的</li>
        <li>一些文本</li>
        <li>一些文本</li>
</ul>;
```

**CSS:**

```css
li:first-child {
    color: orange;
}
```

**3 : last-child**

匹配元素的最后一个子元素。

如下例，最后一个&lt;li> 元素的文本会变为橙色。

**HTML:**

```html
<ul>
        <li>一些文本</li>
        <li>一些文本</li>
        <li>这里的文本是橙色的</li>
</ul>;
```

**CSS:**

```css
li:last-child {
    color: orange;
}
```

**4 first-of-type**

匹配属于其父元素的首个特定类型的子元素的每个元素。

如下例，第一个&lt;li> 元素和第一个&lt;span> 元素的文本会变为橙色。

**HTML:**

```html
<ul>
        <li>这里的文本是橙色的</li>
        
    <li>
        一些文本 <span>这里的文本是橙色的</span>
    </li>
        <li>一些文本</li>
</ul>;
```

**CSS:**

```css
ul :first-of-type {
    color: orange;
}
```

**5 :last-of-type**

匹配元素的最后一个子元素。

如下例，最后一个&lt;li> 元素的文本会变为橙色。

**HTML:**

```html
<ul>
        
    <li>
        一些文本<span>一些文本</span> <span>这里的文本是橙色的</span>
    </li>
        <li>一些文本</li>
        <li>这里的文本是橙色的</li>
</ul>;
```

**CSS:**

```css
ul :last-of-type {
    color: orange;
}
```

**6 :nth-child**

:nth-child 根据元素的位置匹配一个或者多个元素，它接受一个 an+b 形式的参数，an+b 匹配到的元素示例如下：

-   1n+0，或 n，匹配每一个子元素。
-   2n+0，或 2n，匹配位置为 2、4、6、8… 的子元素，该表达式与关键字 even 等价。
-   2n+1 匹配位置为 1、3、5、7… 的子元素、该表达式与关键字 odd 等价。
-   3n+4 匹配位置为 4、7、10、13… 的子元素。

如下例，有以下 HTML 列表：

```html
<ol>
        <li>Alpha</li>
        <li>Beta</li>
        <li>Gamma</li>
        <li>Delta</li>
        <li>Epsilon</li>
        <li>Zeta</li>
        <li>Eta</li>
        <li>Theta</li>
        <li>Iota</li>
        <li>Kappa</li>
</ol>;
```

**CSS:**

选择第二个元素，”Beta” 会变成橙色：

```css
ol :nth-child(2) {
    color: orange;
}
```

选择位置序号是 2 的倍数的元素，”Beta”, “Delta”, “Zeta”, “kappa” 会变成橙色:

```css
ol :nth-child(2n) {
    color: orange;
}
```

选择位置序号为偶数的元素：

```css
ol :nth-child(even) {
    color: orange;
}
```

选择从第 6 个开始，位置序号是 2 的倍数的元素，”Zeta”, “Theta”, “Kappa” 会变成橙色：

```css
ol :nth-child(2n+6) {
    color: orange;
}
```

**7 :nth-last-child**

:nth-last-child 与:nth-child 相似，不同之处在于它是从最后一个子元素开始计数的。

**8 :nth-of-type**

:nth-of-type 与 nth-child 相似，不同之处在于它是只匹配特定类型的元素。

如下例，第二个&lt;p> 元素会变为橙色。

**HTML:**

```html
<article>
    <h1>我是标题</h1>
    <p>一些文本</p>
    <a href=""><img src="images/rwd.png" alt="Mastering RWD"></a>
    <p>这里的文本是橙色的</p>
</article>
```

**CSS:**

```css
p:nth-of-type(2) {
    color: orange;
}
```

**9 :nth-last-type**

:nth-last-of-type 与 nth-of-type 相似，不同之处在于它是从最后一个子元素开始计数的。

**10 :only-child**

当元素是其父元素中唯一一个子元素时，:only-child 匹配该元素。

**HTML:**

```html
<ul>
    <li>这里的文本是橙色的</li>
</ul>
 
<ul>
    <li>一些文本</li>
    <li>一些文本</li>
</ul>
```

**CSS:**

```css
ul :only-child {
    color: orange;
}
```

**11 :only-of-type**

当元素是其父元素中唯一一个特定类型的子元素时，:only-child 匹配该元素。

如下例，第一个 ul 元素只有一个 li 类型的元素，该 li 元素的文本会变为橙色。

**HTML:**

```html
<ul>
    <li>这里的文本是橙色的</li>
    <p>这里不是橙色</p>
</ul>
 
<ul>
    <li>一些文本</li>
    <li>一些文本</li>
</ul>
```

**CSS:**

```css
li:only-of-type {
    color: orange;
}
```

**12 :target**

当 URL 带有锚名称，指向文档内某个具体的元素时，:target 匹配该元素。

如下例，url 中的 target 命中 id 值为 target 的 article 元素，article 元素的背景会变为黄色。

**URL:**

<http://example.com/#target>

**HTML:**

```html
<article id="target">
        
    <h1>
        <code>:target</code> pseudo-class
    </h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit!</p>
</article>;
```

**CSS:**

```css
:target {
    background: yellow;
}
```

**表单相关**

**1 :checked**

:checked 匹配被选中的 input 元素，这个 input 元素包括 radio 和 checkbox。

如下例，当复选框被选中时，与其相邻的&lt;label> 元素的背景会变成黄色。

**HTML:**

```html
<input type="checkbox"/>
<label>我同意</label>
```

**CSS:**

```css
input:checked + label {
    background: yellow;
}
```

**2 :default**

:default 匹配默认选中的元素，例如：提交按钮总是表单的默认按钮。

如下例，只有提交按钮的背景变成了黄色。

**HTML:**

```html
<form action="#">
        <button>重置</button>
        <button type="submit">提交</button>
</form>;
```

**CSS:**

```css
:default  {
    background: yellow;
}
```

**3 :disabled**

:disabled 匹配禁用的表单元素。

如下例，被禁用 input 输入框的透明度会变成 50%。

**HTML:**

```html
<input type="text" disabled />;
```

**CSS:**

```css
:disabled {
    opacity: .5;
}
```

**4 :empty**

:empty 匹配没有子元素的元素。如果元素中含有文本节点、HTML 元素或者一个空格，则:empty 不能匹配这个元素。

如下例，:empty 能匹配的元素会变为黄色。

第一个元素中有文本节点，所以其背景不会变成黄色；

第二个元素中有一个空格，有空格则该元素不为空，所以其背景不会变成黄色；

第三个元素中没有任何内容，所以其背景会变成黄色；

第四个元素中只有一个注释，此时该元素是空的，所以其背景会变成黄色；

**HTML:**

```html
<div>这个容器里的背景是橙色的</div>
<div> </div>
<div></div>
<div><!-- This comment is not considered content --></div>
```

**CSS:**

```css
div {
    background: orange;
    height: 30px;
    width: 200px;
}
 
div:empty {
    background: yellow;
}
```

**5 :enabled**

:enabled 匹配没有设置 disabled 属性的表单元素。

**6 :in-range**

:in-range 匹配在指定区域内元素。

如下例，当数字选择器的数字在 5 到 10 是，数字选择器的边框会设为绿色。

**HTML:**

```html
<input type="number" min="5" max="10">
```

**CSS:**

```css
input[type=number] {
    border: 5px solid orange;
}
 
input[type=number]:in-range {
    border: 5px solid green;
}
```

**7 :out-of-range**

:out-of-range 与:in-range 相反，它匹配不在指定区域内的元素。

**8 :indeterminate**

indeterminate 的英文意思是 “不确定的”。当某组中的单选框或复选框还没有选取状态时，:indeterminate 匹配该组中所有的单选框或复选框。

如下例，当下面的一组单选框没有一个处于被选中时，与 input 相邻的 label 元素的背景会被设为橙色。

**HTML:**

```html
<ul>
    <li>
        <input type="radio" name="list" id="option1">
        <label for="option1">Option 1</label>
    </li>
    <li>
        <input type="radio" name="list" id="option2">
        <label for="option2">Option 2</label>
    </li>
    <li>
        <input type="radio" name="list" id="option3">
        <label for="option3">Option 3</label>
    </li>
</ul>
```

**CSS:**

```css
:indeterminate + label {
    background: orange;
}
```

**9 :valid**

:valid 匹配条件验证正确的表单元素。

如下例，当 email 输入框内的值符合 email 格式时，输入框的边框会被设为绿色。

**HTML:**

```html
<input type="email" />;
```

**CSS:**

```css
input[type=email]:valid {
    border: 1px solid green;
}
```

**10 :invalid**

:invalid 与:valid 相反，匹配条件验证错误的表单元素。

**11 :optional**

:optional 匹配是具有 optional 属性的表单元素。当表单元素没有设置为 required 时，即为 optional 属性。

如下例，第一个 input 的背景不会被设为黄色，第二个 input 的背景会被设为黄色。

**HTML:**

```c
<input type="text" required />
<input type="text" />
```

**CSS:**

```css
:optional {
    background: yellow;
}
```

**12 :required**

:required 与:optional 相反匹配设置了 required 属性的表单元素。

**13 :read-only**

:read-only 匹配设置了只读属性的元素，表单元素可以通过设置 “readonly” 属性来定义元素只读。

如下例，input 元素的背景会被设为黄色。

**HTML:**

```html
<input type="text" value="I am read only" readonly>
```

**CSS:**

```css
input:read-only {
    background-color: yellow;
}
```

**14 :read-write**

:read-write 匹配处于编辑状态的元素。input，textarea 和设置了 contenteditable 的 HTML 元素获取焦点时即处于编辑状态。

如下例，input 输入框和富文本框获取焦点时，背景变成黄色。

**HTML:**

```html
<input type="text" value="获取焦点时背景变黄"/>
 
<div class="editable" contenteditable>
    <h1>点击这里可以编辑</h1>
    <p>获取焦点时背景变黄</p>
</div>
```

**CSS:**

```css
:read-write:focus {
    background: yellow;
}
```

**15 :scope (处于试验阶段)**

:scope 匹配处于 style 作用域下的元素。当 style 没有设置 scope 属性时，style 内的样式会对整个 html 起作用。

如下例，第二个 section 中的元素的文本会变为斜体。

**HTML:**

```html
<article>
    <section>
        <h1>很正常的一些文本</h1>
        <p>很正常的一些文本</p>
    </section>
    <section>
        <style scoped>
            :scope {
                font-style: italic;
            }
        </style>
        <h1>这里的文本是斜体的</h1>
        <p>这里的文本是斜体的</p>
    </section>
</article>
```

注：目前支持这个伪类的浏览器只有火狐。

**语言相关**

**1 :dir (处于实验阶段)**

:dir 匹配指定阅读方向的元素，当 HTML 元素中设置了 dir 属性时该伪类才能生效。现时支持的阅读方向有两种：ltr（从左往右）和 rtl（从右往左）。目前，只有火狐浏览器支持:dir 伪类，并在火狐浏览器中使用时需要添加前缀 (-moz-dir () )。

如下例，p 元素中的阿拉伯语（阿拉伯语是从右往左阅读的）文本会变成橙色。

**HTML:**

```html
<article dir="rtl">
    <p>
        التدليك واحد من أقدم العلوم الصحية التي عرفها الانسان والذي يتم استخدامه
        لأغراض الشفاء منذ ولاده الطفل.
    </p>
</article>;
```

**CSS:**

```css
/* prefixed */
article :-moz-dir(rtl) {
    color: orange;
}
 
/* unprefixed */
article :dir(rtl) {
    color: orange;
}
```

如下例，p 元素中的英语文本会变成蓝色

**HTML:**

```html
<article dir="ltr">
        
    <p>
        اIf you already know some HTML and CSS and understand the principles of
        responsive web design, then this book is for you.
    </p>
</article>;
```

**CSS:**

```css
article :-moz-dir(ltr) {
    color: blue;
}
 
/* unprefixed */
article :dir(ltr) {
    color: blue;
}
```

**2 :lang**

:lang 匹配设置了特定语言的元素，设置特定语言可以通过为了 HTML 元素设置 lang=”” 属性，设置 meta 元素的 charset=”” 属性，或者是在 http 头部上设置语言属性。

实际上，lang=”” 属性不只可以在 html 标签上设置，也可以在其他的元素上设置。

如下例，分别给不同的语言设置不同的引用样式：

**HTML:**

```html
<article lang="en">
    <q>Lorem ipsum dolor sit amet.</q>
</article>
<article lang="fr">
    <q>Lorem ipsum dolor sit amet.</q>
</article>
<article lang="de">
    <q>Lorem ipsum dolor sit amet.</q>
</article>
```

**CSS:**

```css
:lang(en) q { quotes: '“' '”'; }
:lang(fr) q { quotes: '«' '»'; }
:lang(de) q { quotes: '»' '«'; }
```

**其他**

**1 :root**

:root 匹配文档的根元素。一般的 html 文件的根元素是 html 元素，而 SVG 或 XML 文件的根元素则可能是其他元素。

如下例，将 html 元素的背景设置为橙色

```css
:root {
    background: orange;
}
```

**2.:fullscreen**

:fullscreen 匹配处于全屏模式下的元素。全屏模式不是通过按 F11 来打开的全屏模式，而是通过 Javascript 的 Fullscreen API 来打开的，不同的浏览器有不同的 Fullscreen API。目前，:fullscreen 需要添加前缀才能使用。

如下例，当处于全屏模式时，h1 元素的背景会变成橙色

**HTML:**

```html
<h1 id="element">在全屏模式下，这里的文本的背景会变成橙色.</h1>
<button>进入全屏模式!</button>
```

**JAVASCRIPT:**

```javascript
var docelem = document.getElementById("element");
var button = document.querySelector("button");
button.onclick = function () {
    if (docelem.requestFullscreen) {
        docelem.requestFullscreen();
    } else if (docelem.webkitRequestFullscreen) {
        docelem.webkitRequestFullscreen();
    } else if (docelem.mozRequestFullScreen) {
        docelem.mozRequestFullScreen();
    } else if (docelem.msRequestFullscreen) {
        docelem.msRequestFullscreen();
    }
};
```

**CSS:**

```css
h1:fullscreen {
    background: orange;
}
 
h1:-webkit-full-screen {
    background: orange;
}
 
h1:-moz-full-screen {
    background: orange;
}
 
h1:-ms-fullscreen {
    background: orange;
}
```

**伪元素**

**1 ::before/:before**

:before 在被选元素前插入内容。需要使用 content 属性来指定要插入的内容。被插入的内容实际上不在文档树中。

**HTML:**

```html
<h1>World</h1>;
```

**CSS:**

```css
h1:before {
    content: "Hello ";
}
```

**2 ::after/:after**

:after 在被元素后插入内容，其用法和特性与:before 相似。

**3 ::first-letter/:first-letter**

:first-letter 匹配元素中文本的首字母。被修饰的首字母不在文档树中。

**CSS:**

```css
h1:first-letter  {
    font-size: 5em;
}
```

**4 ::first-line/:first-line**

:first-line 匹配元素中第一行的文本。这个伪元素只能用在块元素中，不能用在内联元素中。

**CSS:**

```css
p:first-line {
    background: orange;
}
```

**5 ::selection**

::selection 匹配用户被用户选中或者处于高亮状态的部分。在火狐浏览器使用时需要添加 - moz 前缀。该伪元素只支持双冒号的形式。

**CSS:**

```css
::-moz-selection {
    color: orange;
    background: #333;
}
 
::selection  {
    color: orange;
    background: #333;
}
```

**6 ::placeholder**

::placeholder 匹配占位符的文本，只有元素设置了 placeholder 属性时，该伪元素才能生效。

该伪元素不是 CSS 的标准，它的实现可能在将来会有所改变，所以要决定使用时必须谨慎。

在一些浏览器中（IE10 和 Firefox18 及其以下版本）会使用单冒号的形式。

**HTML:**

```html
<input type="email" placeholder="name@domain.com">
```

**CSS:**

```css
input::-moz-placeholder {
    color:#666;
}
 
input::-webkit-input-placeholder {
    color:#666;
}
 
/* IE 10 only */
input:-ms-input-placeholder {
    color:#666;
}
 
/* Firefox 18 and below */
input:-moz-input-placeholder {
    color:#666;
}
```

**7 ::backdrop (处于试验阶段)**

::backdrop 用于改变全屏模式下的背景颜色，全屏模式的默认颜色为黑色。该伪元素只支持双冒号的形式

**HTML:**

```html
<h1 id="element">This heading will have a solid background color in full-screen mode.</h1>
<button onclick="var el = document.getElementById('element'); el.webkitRequestFullscreen();">Trigger full screen!</button>
```

**CSS:**

```css
h1:fullscreen::backdrop {
    background: orange;
}
```

**参考文章**

1. [An Ultimate Guide To CSS Pseudo-Classes And Pseudo-Elements](https://www.smashingmagazine.com/2016/05/an-ultimate-guide-to-css-pseudo-classes-and-pseudo-elements/#disabled)

2. [CSS 伪类与 CSS 伪元素的区别及由来](http://swordair.com/origin-and-difference-between-css-pseudo-classes-and-pseudo-elements/)


<!-- {% endraw %} - for jekyll -->