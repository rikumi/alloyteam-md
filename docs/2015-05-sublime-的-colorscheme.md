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
&lt;dict>
      &lt;key>name&lt;/key>
      &lt;string>Markup: Underline&lt;/string>
      &lt;key>scope&lt;/key>
      &lt;string>markup.underline&lt;/string>
      &lt;key>settings&lt;/key>
      
    &lt;dict>
              &lt;key>fontStyle&lt;/key>
              &lt;string>underline&lt;/string>
              &lt;key>foreground&lt;/key>
              
        &lt;string>
            &lt;span class="comment">#839496&lt;/string>
        &lt;/span>
          
    &lt;/dict>
&lt;/dict>;
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
&lt;dict>
  &lt;key>name&lt;/key>
  &lt;string>Markup: Underline&lt;/string>
  &lt;key>scope&lt;/key>  &lt;!-- 这里就是 scope，知道了这个，其他就好办 -->
  &lt;string>markup.underline&lt;/string>
  &lt;key>settings&lt;/key>
  &lt;dict>
      &lt;key>fontStyle&lt;/key>
      &lt;string>underline&lt;/string>
      &lt;key>foreground&lt;/key>
      &lt;string>&lt;span class="comment">#839496&lt;/string>&lt;/span>
  &lt;/dict>
&lt;/dict>
 
```

至此，已经可以修改 `markdown` 到我想要的状态了。但是我又想，能不能把 `markdown.md` 的背景也改了，  
甚至模仿 `github` 的样式。

少说多做，幸福一生。

```html
&lt;dict>
        &lt;key>name&lt;/key>
        &lt;string>Markdown&lt;/string>
        &lt;key>scope&lt;/key>
        &lt;string>text.html.markdown&lt;/string>
        &lt;key>settings&lt;/key>
        
    &lt;dict>
                &lt;key>background&lt;/key>
                
        &lt;string>
            &lt;span class="comment">#ffffff&lt;/string>
        &lt;/span>
                &lt;key>foreground&lt;/key>
                
        &lt;string>
            &lt;span class="comment">#666666&lt;/string>
        &lt;/span>
            
    &lt;/dict>
&lt;/dict>;
```

马上把上面的代码加入 `color scheme`，有效果，嗯，现在比较大的问题是 `lineHighlight`（鼠标所在行高亮）比较突兀。

是个问题，并且 `lineHighlight` 没有 `scope` ，蛋疼了。

解决方式是调整全局 `lineHighlight` 的值，使其用**透明度**达到效果。

Perfect!

参考：

<http://stackoverflow.com/questions/10636410/modifying-sublime-text-2-for-js>

附上我的 `color scheme` `Obsidian.tmTheme` ：

```html
&lt;?xml version=&lt;span class="string">"1.0"&lt;/span> encoding=&lt;span class="string">"UTF-8"&lt;/span>&lt;span class="preprocessor">?>&lt;/span>
&lt;!DOCTYPE plist &lt;span class="keyword">PUBLIC&lt;/span> &lt;span class="string">"-//Apple//DTD PLIST 1.0//EN"&lt;/span> &lt;span class="string">"http://www.apple.com/DTDs/PropertyList-1.0.dtd"&lt;/span>>
&lt;plist version=&lt;span class="string">"1.0"&lt;/span>>
&lt;dict>
    &lt;key>author&lt;/key>
    &lt;string>Marcus Ekwall&lt;/string>
    &lt;key>modify&lt;/key>
    &lt;string>jerry&lt;/string>
    &lt;key>name&lt;/key>
    &lt;string>Obsidian&lt;/string>
    &lt;key>version&lt;/key>
    &lt;string>&lt;span class="number">0.1&lt;/span>&lt;/string>
    &lt;key>settings&lt;/key>
    &lt;&lt;span class="keyword">array&lt;/span>>
        &lt;!-- &lt;span class="keyword">global&lt;/span> -->
        &lt;dict>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>background&lt;/key>
                &lt;string>&lt;span class="comment">#293134&lt;/string>&lt;/span>
                &lt;key>caret&lt;/key>
                &lt;string>&lt;span class="comment">#E0E2E4&lt;/string>&lt;/span>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#81969A&lt;/string>&lt;/span>
                &lt;key>invisibles&lt;/key>
                &lt;string>&lt;span class="comment">#BFBFBF&lt;/string>&lt;/span>
                &lt;key>lineHighlight&lt;/key>
                &lt;string>&lt;span class="comment">#E5E5E520&lt;/string>&lt;/span>
                &lt;key>selection&lt;/key>
                &lt;string>&lt;span class="comment">#0D0F0F&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
          &lt;key>name&lt;/key>
          &lt;string>Text base&lt;/string>
          &lt;key>scope&lt;/key>
          &lt;string>text&lt;/string>
          &lt;key>settings&lt;/key>
          &lt;dict>
            &lt;key>background&lt;/key>
            &lt;string>&lt;span class="comment">#293134&lt;/string>&lt;/span>
            &lt;key>foreground&lt;/key>
            &lt;string>&lt;span class="comment">#E0E2E4&lt;/string>&lt;/span>
          &lt;/dict>
        &lt;/dict>
        &lt;dict>
          &lt;key>name&lt;/key>
          &lt;string>Source base&lt;/string>
          &lt;key>scope&lt;/key>
          &lt;string>source&lt;/string>
          &lt;key>settings&lt;/key>
          &lt;dict>
            &lt;key>background&lt;/key>
            &lt;string>&lt;span class="comment">#293134&lt;/string>&lt;/span>
            &lt;key>foreground&lt;/key>
            &lt;string>&lt;span class="comment">#E0E2E4&lt;/string>&lt;/span>
          &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Comment&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>comment&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#66747B&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Comment Block&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>comment.block&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>italic&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#66747B&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Comment Doc&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>comment.documentation&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#66747B&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>String&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>string&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#EC7600&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Number&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>constant.numeric&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#FFCD22&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Built-in constant&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>constant.language&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>bold&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#93C763&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>User-defined constant&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>constant.character, constant.other&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Variable&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>variable.language, variable.other&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#678CB1&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>JavaScript: Variable&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>variable.language.js&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>bold&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#93C763&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Keyword&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>keyword&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>bold&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#93C763&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Operator&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>keyword.operator&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#E0E2E4&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Storage&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>storage&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>bold&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#93C763&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>&lt;span class="keyword">Class&lt;/span> name&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>entity.name.&lt;span class="keyword">class&lt;/span>&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Inherited &lt;span class="keyword">class&lt;/span>&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>entity.other.inherited-&lt;span class="keyword">class&lt;/span>&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>&lt;span class="keyword">Function&lt;/span> name&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>entity.name.&lt;span class="keyword">function&lt;/span>&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>bold&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#678CB1&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>&lt;span class="keyword">Function&lt;/span> argument&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>variable.parameter&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Tag name&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>entity.name.tag&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>bold&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#408080&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Tag attribute&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>entity.other.attribute-name&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>bold&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#808040&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Library &lt;span class="keyword">function&lt;/span>&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>support.&lt;span class="keyword">function&lt;/span>&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Library constant&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>support.constant&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Library &lt;span class="keyword">class&lt;/span>/type&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>support.type, support.&lt;span class="keyword">class&lt;/span>&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Library variable&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>support.other.variable&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Invalid&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>invalid&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Embedded section&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>punctuation.section.embedded&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>bold&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#D955C1&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Keyword Operator &lt;span class="keyword">Class&lt;/span>&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>keyword.operator.&lt;span class="keyword">class&lt;/span>&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#96989A&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Delimiter&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>meta.delimiter&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#96979A&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Round brace&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>meta.brace&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#E8E2B7&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Curly brace&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>meta.brace.curly&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#96979A&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>JavaScript: Embedded&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>source.js.embedded&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>background&lt;/key>
                &lt;string>&lt;span class="comment">#262C2F&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>JavaScript: Variable&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>variable.language.js&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>bold&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#93C763&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>JavaScript: &lt;span class="keyword">Function&lt;/span> name&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>entity.name.&lt;span class="keyword">function&lt;/span>.js&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#E0E2E4&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>JavaScript: Instance&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>entity.name.type.instance.js&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>underline, bold&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#AFC0E5&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>JavaScript: &lt;span class="keyword">Class&lt;/span>&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>support.&lt;span class="keyword">class&lt;/span>.js&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#78D023&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>JavaScript: Modifier&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>storage.modifier.js&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#78D023&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>JavaScript: Constant&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>support.constant.js, support.constant.dom.js&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#78D023&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>JavaScript: Operator &lt;span class="keyword">and&lt;/span> terminator&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>keyword.operator.js, punctuation.terminator.statement.js&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#E0E2E4&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>JavaScript: Console&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>entity.name.type.object.js.firebug, keyword.other.js&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#DA4236&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>CSS: Embedded&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>source.css.embedded&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>background&lt;/key>
                &lt;string>&lt;span class="comment">#262C2F&lt;/string>&lt;/span>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#E0E2E4&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>CSS: Directive&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>keyword.control.at-rule.import.css&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#A082BD&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>CSS: &lt;span class="keyword">Class&lt;/span>&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>entity.other.attribute-name.&lt;span class="keyword">class&lt;/span>.css&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#93C763&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>CSS: Tag&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>entity.name.tag.css&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#B3B689&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>CSS: Property&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>support.type.property-name.css, meta.property-name.css&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#678CB1&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>CSS: Unit&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>keyword.other.unit.css&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#E0E2E4&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>CSS: Parameter&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>variable.parameter.misc.css&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#EC7600&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>CSS: ID&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>entity.other.attribute-name.id.css&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#D5AB55&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>CSS: Definition&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>punctuation.definition.entity.css&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#9CB4AA&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>HTML/XML: String&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>string.quoted.double.html, string.quoted.single.html, string.quoted.double.xml, string.quoted.single.xml&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#E1E2CF&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>HTML/XML: Definition&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>punctuation.definition.tag.begin.html, punctuation.definition.tag.end.html, punctuation.definition.tag.html, punctuation.definition.tag.begin.xml, punctuation.definition.tag.end.xml, punctuation.definition.tag.xml, meta.tag.no-content&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#557182&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>XML: Tag&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>entity.name.tag.xml, entity.name.tag.localname.xml&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>bold&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#678CB1&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>XML: Definition&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>meta.tag.preprocessor.xml punctuation.definition.tag.xml&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#557182&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>XML: Value&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>constant.other.name.xml, string.quoted.other.xml&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#E0E2E4&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>DocType HTML: Tag&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>meta.tag.sgml.doctype&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#557182&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>DocType: Root&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>meta.tag.sgml.doctype variable.documentroot.xml, meta.tag.sgml.doctype.html&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#D5AB55&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>DocType: Keyword&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>keyword.doctype, entity.name.tag.doctype&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#557182&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>DocType: Variable&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>variable.documentroot&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#E0E2E4&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>PHP: Embedded&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>source.php.embedded&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>background&lt;/key>
                &lt;string>&lt;span class="comment">#252C30&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>PHP: Word&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>support.&lt;span class="keyword">function&lt;/span>.construct.php&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#93C763&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>PHP: Constant&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>constant.other.php&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#D39745&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>PHP: Operator&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>keyword.operator.string.php, keyword.operator.&lt;span class="keyword">class&lt;/span>.php, keyword.operator.comparison.php, punctuation.definition.&lt;span class="keyword">array&lt;/span>.begin.php, punctuation.definition.&lt;span class="keyword">array&lt;/span>.end.php, punctuation.terminator.expression.php&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#E8E2B7&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
 
        &lt;!-- markdown -->
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>diff: deleted&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>markup.deleted&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>background&lt;/key>
                &lt;string>&lt;span class="comment">#EAE3CA&lt;/string>&lt;/span>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#D3201F&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>diff: changed&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>markup.changed&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>background&lt;/key>
                &lt;string>&lt;span class="comment">#EAE3CA&lt;/string>&lt;/span>
                &lt;key>fontStyle&lt;/key>
                &lt;string>&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#BF3904&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>diff: inserted&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>markup.inserted&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>background&lt;/key>
                &lt;string>&lt;span class="comment">#EAE3CA&lt;/string>&lt;/span>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#219186&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Markdown&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>text.html.markdown&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>background&lt;/key>
                &lt;string>&lt;span class="comment">#ffffff&lt;/string>&lt;/span>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#666666&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Markdown&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>text.html.markdown&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>background&lt;/key>
                &lt;string>&lt;span class="comment">#ffffff&lt;/string>&lt;/span>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#666666&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Markdown: Linebreak&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>text.html.markdown meta.dummy.line-&lt;span class="keyword">break&lt;/span>&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>background&lt;/key>
                &lt;string>&lt;span class="comment">#A57706&lt;/string>&lt;/span>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#E0EDDD&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Markdown: Raw&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>text.html.markdown markup.raw.inline&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>background&lt;/key>
                &lt;string>&lt;span class="comment">#F8F8F8&lt;/string>&lt;/span>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#269186&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Markup: Heading&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>markup.heading&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>bold&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#000000&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Markup: Italic&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>markup.italic&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>italic&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#839496&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Markup: Bold&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>markup.bold&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>bold&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#ec7600&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Markup: Underline&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>markup.underline&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>underline&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#839496&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Markup: Quote&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>markup.quote&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>fontStyle&lt;/key>
                &lt;string>italic&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#268bd2&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Markup: &lt;span class="keyword">List&lt;/span>&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>markup.&lt;span class="keyword">list&lt;/span>&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#afc0e5&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Markup: Raw&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>markup.raw&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#b58900&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
        &lt;dict>
            &lt;key>name&lt;/key>
            &lt;string>Markup: Separator&lt;/string>
            &lt;key>scope&lt;/key>
            &lt;string>meta.separator&lt;/string>
            &lt;key>settings&lt;/key>
            &lt;dict>
                &lt;key>background&lt;/key>
                &lt;string>&lt;span class="comment">#eee8d5&lt;/string>&lt;/span>
                &lt;key>fontStyle&lt;/key>
                &lt;string>bold&lt;/string>
                &lt;key>foreground&lt;/key>
                &lt;string>&lt;span class="comment">#268bd2&lt;/string>&lt;/span>
            &lt;/dict>
        &lt;/dict>
    &lt;/&lt;span class="keyword">array&lt;/span>>
    &lt;key>uuid&lt;/key>
    &lt;string>&lt;span class="number">70442&lt;/span>A54-&lt;span class="number">7505&lt;/span>-&lt;span class="number">46&lt;/span>E2-AAD8-&lt;span class="number">44691&lt;/span>BBC53DF&lt;/string>
&lt;/dict>
&lt;/plist>
 
```


<!-- {% endraw %} - for jekyll -->