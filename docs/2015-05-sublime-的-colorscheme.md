---
title: sublime 的 colorscheme
date: 2015-05-07
author: TAT.jerojiang
source_link: http://www.alloyteam.com/2015/05/sublime%e7%9a%84colorscheme/
---

<!-- {% raw %} - for jekyll -->

想让 `markdown` 高亮，找了点插件，比如

[https://github.com/jonschlinkert/sublime-markdown-extended](http://www.alloyteam.com/2015/05/sublime%e7%9a%84colorscheme/sublime-markdown-extended)

可以让**代码块**高亮。但没有达到我想要的效果，我想让 `markdown` 的每个部分高亮，比如 **# 标题** 高亮。

然后找到了

[sublime-monokai-extended](https://github.com/jonschlinkert/sublime-monokai-extended)

这个达到了我的效果，但是将整个的 `color scheme` 都改了，自然不行。

现在的问题是 ——

## 在当前的 color scheme 高亮 markdown

继续寻找，然后找了这个

[markdown.xml](https://gist.github.com/CrazyApi/2354062)

按照上面说的，将代码复制到我的 `Obsidian.tmTheme` ，成功了。在现有 `color scheme` 上高亮了 `markdown` 。

但是头疼的是，我不喜欢他的 **标题** 颜色，想改。看了代码，摘录一段：

```html
<dict>
  <key>name</key>
  <string>Markup: Underline</string>
  <key>scope</key>
  <string>markup.underline</string>
  <key>settings</key>
  <dict>
      <key>fontStyle</key>
      <string>underline</string>
      <key>foreground</key>
      <string><span class="comment">#839496</string></span>
  </dict>
</dict>
 
```

一头雾水，完全不知道 `how does it working` ，也就无从改起。

没有解决不了的问题，找了半天，这篇博客

[Tips For Creating Sublime Text Color Schemes](http://www.jisaacks.com/tips-for-creating-sublime-color-schemes)

解决了我的问题。其中的 `tip1` 尤其好 ——

> Sublime text color schemes work by defining colors for scopes. A syntax definition matches the different parts of the file’s text (e.g. functions, classes, keywords, etc.) and maps them to a named scope. Then the color scheme specifies what colors to use for what scopes.  
> The hard part comes when you see a particular piece of syntax you want to style a specific way, but you do not know what scope it is. I did a lot of guess work until I discovered the ScopeHunter plugin.  
> The ScopeHunter plugin allows you to select some text and it tells you what scope it matches. This removes the guess work and allows you to quickly color the pieces you want to.

sublime text 的 color scheme 是通过 `scopes` 来定义 `color` 的，我们可以安装插件 `ScopeHunter` 来查看光标出的 `scopes` ，从而可以自定义颜色。

```html
<dict>
  <key>name</key>
  <string>Markup: Underline</string>
  <key>scope</key>  <!-- 这里就是 scope，知道了这个，其他就好办 -->
  <string>markup.underline</string>
  <key>settings</key>
  <dict>
      <key>fontStyle</key>
      <string>underline</string>
      <key>foreground</key>
      <string><span class="comment">#839496</string></span>
  </dict>
</dict>
 
```

至此，已经可以修改 `markdown` 到我想要的状态了。但是我又想，能不能把 `markdown.md` 的背景也改了，  
甚至模仿 `github` 的样式。

少说多做，幸福一生。

```html
<dict>
    <key>name</key>
    <string>Markdown</string>
    <key>scope</key>
    <string>text.html.markdown</string>
    <key>settings</key>
    <dict>
        <key>background</key>
        <string><span class="comment">#ffffff</string></span>
        <key>foreground</key>
        <string><span class="comment">#666666</string></span>
    </dict>
</dict>
 
```

马上把上面的代码加入 `color scheme`，有效果，嗯，现在比较大的问题是 `lineHighlight`（鼠标所在行高亮）比较突兀。

是个问题，并且 `lineHighlight` 没有 `scope` ，蛋疼了。

解决方式是调整全局 `lineHighlight` 的值，使其用**透明度**达到效果。

Perfect!

参考：

<http://stackoverflow.com/questions/10636410/modifying-sublime-text-2-for-js>

附上我的 `color scheme` `Obsidian.tmTheme` ：

```html
<?xml version=<span class="string">"1.0"</span> encoding=<span class="string">"UTF-8"</span><span class="preprocessor">?></span>
<!DOCTYPE plist <span class="keyword">PUBLIC</span> <span class="string">"-//Apple//DTD PLIST 1.0//EN"</span> <span class="string">"http://www.apple.com/DTDs/PropertyList-1.0.dtd"</span>>
<plist version=<span class="string">"1.0"</span>>
<dict>
    <key>author</key>
    <string>Marcus Ekwall</string>
    <key>modify</key>
    <string>jerry</string>
    <key>name</key>
    <string>Obsidian</string>
    <key>version</key>
    <string><span class="number">0.1</span></string>
    <key>settings</key>
    <<span class="keyword">array</span>>
        <!-- <span class="keyword">global</span> -->
        <dict>
            <key>settings</key>
            <dict>
                <key>background</key>
                <string><span class="comment">#293134</string></span>
                <key>caret</key>
                <string><span class="comment">#E0E2E4</string></span>
                <key>foreground</key>
                <string><span class="comment">#81969A</string></span>
                <key>invisibles</key>
                <string><span class="comment">#BFBFBF</string></span>
                <key>lineHighlight</key>
                <string><span class="comment">#E5E5E520</string></span>
                <key>selection</key>
                <string><span class="comment">#0D0F0F</string></span>
            </dict>
        </dict>
        <dict>
          <key>name</key>
          <string>Text base</string>
          <key>scope</key>
          <string>text</string>
          <key>settings</key>
          <dict>
            <key>background</key>
            <string><span class="comment">#293134</string></span>
            <key>foreground</key>
            <string><span class="comment">#E0E2E4</string></span>
          </dict>
        </dict>
        <dict>
          <key>name</key>
          <string>Source base</string>
          <key>scope</key>
          <string>source</string>
          <key>settings</key>
          <dict>
            <key>background</key>
            <string><span class="comment">#293134</string></span>
            <key>foreground</key>
            <string><span class="comment">#E0E2E4</string></span>
          </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Comment</string>
            <key>scope</key>
            <string>comment</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#66747B</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Comment Block</string>
            <key>scope</key>
            <string>comment.block</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string>italic</string>
                <key>foreground</key>
                <string><span class="comment">#66747B</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Comment Doc</string>
            <key>scope</key>
            <string>comment.documentation</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#66747B</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>String</string>
            <key>scope</key>
            <string>string</string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#EC7600</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Number</string>
            <key>scope</key>
            <string>constant.numeric</string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#FFCD22</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Built-in constant</string>
            <key>scope</key>
            <string>constant.language</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string>bold</string>
                <key>foreground</key>
                <string><span class="comment">#93C763</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>User-defined constant</string>
            <key>scope</key>
            <string>constant.character, constant.other</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Variable</string>
            <key>scope</key>
            <string>variable.language, variable.other</string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#678CB1</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>JavaScript: Variable</string>
            <key>scope</key>
            <string>variable.language.js</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string>bold</string>
                <key>foreground</key>
                <string><span class="comment">#93C763</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Keyword</string>
            <key>scope</key>
            <string>keyword</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string>bold</string>
                <key>foreground</key>
                <string><span class="comment">#93C763</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Operator</string>
            <key>scope</key>
            <string>keyword.operator</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#E0E2E4</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Storage</string>
            <key>scope</key>
            <string>storage</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string>bold</string>
                <key>foreground</key>
                <string><span class="comment">#93C763</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string><span class="keyword">Class</span> name</string>
            <key>scope</key>
            <string>entity.name.<span class="keyword">class</span></string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Inherited <span class="keyword">class</span></string>
            <key>scope</key>
            <string>entity.other.inherited-<span class="keyword">class</span></string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string><span class="keyword">Function</span> name</string>
            <key>scope</key>
            <string>entity.name.<span class="keyword">function</span></string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string>bold</string>
                <key>foreground</key>
                <string><span class="comment">#678CB1</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string><span class="keyword">Function</span> argument</string>
            <key>scope</key>
            <string>variable.parameter</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Tag name</string>
            <key>scope</key>
            <string>entity.name.tag</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string>bold</string>
                <key>foreground</key>
                <string><span class="comment">#408080</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Tag attribute</string>
            <key>scope</key>
            <string>entity.other.attribute-name</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string>bold</string>
                <key>foreground</key>
                <string><span class="comment">#808040</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Library <span class="keyword">function</span></string>
            <key>scope</key>
            <string>support.<span class="keyword">function</span></string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Library constant</string>
            <key>scope</key>
            <string>support.constant</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Library <span class="keyword">class</span>/type</string>
            <key>scope</key>
            <string>support.type, support.<span class="keyword">class</span></string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Library variable</string>
            <key>scope</key>
            <string>support.other.variable</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Invalid</string>
            <key>scope</key>
            <string>invalid</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Embedded section</string>
            <key>scope</key>
            <string>punctuation.section.embedded</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string>bold</string>
                <key>foreground</key>
                <string><span class="comment">#D955C1</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Keyword Operator <span class="keyword">Class</span></string>
            <key>scope</key>
            <string>keyword.operator.<span class="keyword">class</span></string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#96989A</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Delimiter</string>
            <key>scope</key>
            <string>meta.delimiter</string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#96979A</string></span>
            </dict>
        </dict>
        <dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Round brace</string>
            <key>scope</key>
            <string>meta.brace</string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#E8E2B7</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Curly brace</string>
            <key>scope</key>
            <string>meta.brace.curly</string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#96979A</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>JavaScript: Embedded</string>
            <key>scope</key>
            <string>source.js.embedded</string>
            <key>settings</key>
            <dict>
                <key>background</key>
                <string><span class="comment">#262C2F</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>JavaScript: Variable</string>
            <key>scope</key>
            <string>variable.language.js</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string>bold</string>
                <key>foreground</key>
                <string><span class="comment">#93C763</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>JavaScript: <span class="keyword">Function</span> name</string>
            <key>scope</key>
            <string>entity.name.<span class="keyword">function</span>.js</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#E0E2E4</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>JavaScript: Instance</string>
            <key>scope</key>
            <string>entity.name.type.instance.js</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string>underline, bold</string>
                <key>foreground</key>
                <string><span class="comment">#AFC0E5</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>JavaScript: <span class="keyword">Class</span></string>
            <key>scope</key>
            <string>support.<span class="keyword">class</span>.js</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#78D023</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>JavaScript: Modifier</string>
            <key>scope</key>
            <string>storage.modifier.js</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#78D023</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>JavaScript: Constant</string>
            <key>scope</key>
            <string>support.constant.js, support.constant.dom.js</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#78D023</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>JavaScript: Operator <span class="keyword">and</span> terminator</string>
            <key>scope</key>
            <string>keyword.operator.js, punctuation.terminator.statement.js</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#E0E2E4</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>JavaScript: Console</string>
            <key>scope</key>
            <string>entity.name.type.object.js.firebug, keyword.other.js</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#DA4236</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>CSS: Embedded</string>
            <key>scope</key>
            <string>source.css.embedded</string>
            <key>settings</key>
            <dict>
                <key>background</key>
                <string><span class="comment">#262C2F</string></span>
                <key>foreground</key>
                <string><span class="comment">#E0E2E4</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>CSS: Directive</string>
            <key>scope</key>
            <string>keyword.control.at-rule.import.css</string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#A082BD</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>CSS: <span class="keyword">Class</span></string>
            <key>scope</key>
            <string>entity.other.attribute-name.<span class="keyword">class</span>.css</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#93C763</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>CSS: Tag</string>
            <key>scope</key>
            <string>entity.name.tag.css</string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#B3B689</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>CSS: Property</string>
            <key>scope</key>
            <string>support.type.property-name.css, meta.property-name.css</string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#678CB1</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>CSS: Unit</string>
            <key>scope</key>
            <string>keyword.other.unit.css</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#E0E2E4</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>CSS: Parameter</string>
            <key>scope</key>
            <string>variable.parameter.misc.css</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#EC7600</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>CSS: ID</string>
            <key>scope</key>
            <string>entity.other.attribute-name.id.css</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#D5AB55</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>CSS: Definition</string>
            <key>scope</key>
            <string>punctuation.definition.entity.css</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#9CB4AA</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>HTML/XML: String</string>
            <key>scope</key>
            <string>string.quoted.double.html, string.quoted.single.html, string.quoted.double.xml, string.quoted.single.xml</string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#E1E2CF</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>HTML/XML: Definition</string>
            <key>scope</key>
            <string>punctuation.definition.tag.begin.html, punctuation.definition.tag.end.html, punctuation.definition.tag.html, punctuation.definition.tag.begin.xml, punctuation.definition.tag.end.xml, punctuation.definition.tag.xml, meta.tag.no-content</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#557182</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>XML: Tag</string>
            <key>scope</key>
            <string>entity.name.tag.xml, entity.name.tag.localname.xml</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string>bold</string>
                <key>foreground</key>
                <string><span class="comment">#678CB1</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>XML: Definition</string>
            <key>scope</key>
            <string>meta.tag.preprocessor.xml punctuation.definition.tag.xml</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#557182</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>XML: Value</string>
            <key>scope</key>
            <string>constant.other.name.xml, string.quoted.other.xml</string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#E0E2E4</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>DocType HTML: Tag</string>
            <key>scope</key>
            <string>meta.tag.sgml.doctype</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#557182</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>DocType: Root</string>
            <key>scope</key>
            <string>meta.tag.sgml.doctype variable.documentroot.xml, meta.tag.sgml.doctype.html</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#D5AB55</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>DocType: Keyword</string>
            <key>scope</key>
            <string>keyword.doctype, entity.name.tag.doctype</string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#557182</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>DocType: Variable</string>
            <key>scope</key>
            <string>variable.documentroot</string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#E0E2E4</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>PHP: Embedded</string>
            <key>scope</key>
            <string>source.php.embedded</string>
            <key>settings</key>
            <dict>
                <key>background</key>
                <string><span class="comment">#252C30</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>PHP: Word</string>
            <key>scope</key>
            <string>support.<span class="keyword">function</span>.construct.php</string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#93C763</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>PHP: Constant</string>
            <key>scope</key>
            <string>constant.other.php</string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#D39745</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>PHP: Operator</string>
            <key>scope</key>
            <string>keyword.operator.string.php, keyword.operator.<span class="keyword">class</span>.php, keyword.operator.comparison.php, punctuation.definition.<span class="keyword">array</span>.begin.php, punctuation.definition.<span class="keyword">array</span>.end.php, punctuation.terminator.expression.php</string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#E8E2B7</string></span>
            </dict>
        </dict>
 
        <!-- markdown -->
        <dict>
            <key>name</key>
            <string>diff: deleted</string>
            <key>scope</key>
            <string>markup.deleted</string>
            <key>settings</key>
            <dict>
                <key>background</key>
                <string><span class="comment">#EAE3CA</string></span>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#D3201F</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>diff: changed</string>
            <key>scope</key>
            <string>markup.changed</string>
            <key>settings</key>
            <dict>
                <key>background</key>
                <string><span class="comment">#EAE3CA</string></span>
                <key>fontStyle</key>
                <string></string>
                <key>foreground</key>
                <string><span class="comment">#BF3904</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>diff: inserted</string>
            <key>scope</key>
            <string>markup.inserted</string>
            <key>settings</key>
            <dict>
                <key>background</key>
                <string><span class="comment">#EAE3CA</string></span>
                <key>foreground</key>
                <string><span class="comment">#219186</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Markdown</string>
            <key>scope</key>
            <string>text.html.markdown</string>
            <key>settings</key>
            <dict>
                <key>background</key>
                <string><span class="comment">#ffffff</string></span>
                <key>foreground</key>
                <string><span class="comment">#666666</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Markdown</string>
            <key>scope</key>
            <string>text.html.markdown</string>
            <key>settings</key>
            <dict>
                <key>background</key>
                <string><span class="comment">#ffffff</string></span>
                <key>foreground</key>
                <string><span class="comment">#666666</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Markdown: Linebreak</string>
            <key>scope</key>
            <string>text.html.markdown meta.dummy.line-<span class="keyword">break</span></string>
            <key>settings</key>
            <dict>
                <key>background</key>
                <string><span class="comment">#A57706</string></span>
                <key>foreground</key>
                <string><span class="comment">#E0EDDD</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Markdown: Raw</string>
            <key>scope</key>
            <string>text.html.markdown markup.raw.inline</string>
            <key>settings</key>
            <dict>
                <key>background</key>
                <string><span class="comment">#F8F8F8</string></span>
                <key>foreground</key>
                <string><span class="comment">#269186</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Markup: Heading</string>
            <key>scope</key>
            <string>markup.heading</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string>bold</string>
                <key>foreground</key>
                <string><span class="comment">#000000</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Markup: Italic</string>
            <key>scope</key>
            <string>markup.italic</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string>italic</string>
                <key>foreground</key>
                <string><span class="comment">#839496</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Markup: Bold</string>
            <key>scope</key>
            <string>markup.bold</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string>bold</string>
                <key>foreground</key>
                <string><span class="comment">#ec7600</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Markup: Underline</string>
            <key>scope</key>
            <string>markup.underline</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string>underline</string>
                <key>foreground</key>
                <string><span class="comment">#839496</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Markup: Quote</string>
            <key>scope</key>
            <string>markup.quote</string>
            <key>settings</key>
            <dict>
                <key>fontStyle</key>
                <string>italic</string>
                <key>foreground</key>
                <string><span class="comment">#268bd2</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Markup: <span class="keyword">List</span></string>
            <key>scope</key>
            <string>markup.<span class="keyword">list</span></string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#afc0e5</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Markup: Raw</string>
            <key>scope</key>
            <string>markup.raw</string>
            <key>settings</key>
            <dict>
                <key>foreground</key>
                <string><span class="comment">#b58900</string></span>
            </dict>
        </dict>
        <dict>
            <key>name</key>
            <string>Markup: Separator</string>
            <key>scope</key>
            <string>meta.separator</string>
            <key>settings</key>
            <dict>
                <key>background</key>
                <string><span class="comment">#eee8d5</string></span>
                <key>fontStyle</key>
                <string>bold</string>
                <key>foreground</key>
                <string><span class="comment">#268bd2</string></span>
            </dict>
        </dict>
    </<span class="keyword">array</span>>
    <key>uuid</key>
    <string><span class="number">70442</span>A54-<span class="number">7505</span>-<span class="number">46</span>E2-AAD8-<span class="number">44691</span>BBC53DF</string>
</dict>
</plist>
 
```


<!-- {% endraw %} - for jekyll -->