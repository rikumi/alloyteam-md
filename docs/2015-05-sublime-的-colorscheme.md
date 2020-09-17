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
              
        <string>
            <span class="comment">#839496</string>
        </span>
          
    </dict>
</dict>;
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
                
        <string>
            <span class="comment">#ffffff</string>
        </span>
                <key>foreground</key>
                
        <string>
            <span class="comment">#666666</string>
        </span>
            
    </dict>
</dict>;
```

马上把上面的代码加入 `color scheme`，有效果，嗯，现在比较大的问题是 `lineHighlight`（鼠标所在行高亮）比较突兀。

是个问题，并且 `lineHighlight` 没有 `scope` ，蛋疼了。

解决方式是调整全局 `lineHighlight` 的值，使其用**透明度**达到效果。

Perfect!

参考：

<http://stackoverflow.com/questions/10636410/modifying-sublime-text-2-for-js>

附上我的 `color scheme` `Obsidian.tmTheme` ：


<!-- {% endraw %} - for jekyll -->