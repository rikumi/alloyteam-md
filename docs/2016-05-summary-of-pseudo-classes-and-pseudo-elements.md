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

如果想要给第一项添加样式，可以在为第一个<li> 添加一个类，并在该类中定义对应样式：

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

如果不用添加类的方法，我们可以通过给设置第一个<li> 的:first-child 伪类来为其添加样式。这个时候，被修饰的<li> 元素依然处于文档树中。

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

如果想要给该段落的第一个字母添加样式，可以在第一个字母中包裹一个<span> 元素，并设置该 span 元素的样式：

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

如果不创建一个<span> 元素，我们可以通过设置<p> 的:first-letter 伪元素来为其添加样式。这个时候，看起来好像是创建了一个虚拟的<span> 元素并添加了样式，但实际上文档树中并不存在这个<span> 元素。

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

如下例，除了第一个<li> 元素外，其他<li> 元素的文本都会变为橙色。

**HTML:**

```html
<ul>
    <li class="first-item">一些文本</li>
    <li>一些文本</
```


<!-- {% endraw %} - for jekyll -->