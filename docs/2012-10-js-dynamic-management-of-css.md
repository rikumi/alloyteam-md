---
title: 使用 Javascript 动态管理 CSS
date: 2012-10-23
author: TAT.Minren
source_link: http://www.alloyteam.com/2012/10/js-dynamic-management-of-css/
---

<!-- {% raw %} - for jekyll -->

#  添加 CSS

通常情况 CSS 不论是内嵌还是外联，都是预先定义好的。其实利用 JavaScript，我们也可以动态在页面中插入或删除 CSS。

比较常见的场景是：CSS 动画。由于我们在设计网页时不能预知动画的具体细节，所以需要在运行时进行定制。比如，我们想让一个元素从右侧飞出屏幕，如果用 keyframe 动画实现，我们必须知道屏幕的宽度，这个信息只有在运行才知道。  
例如下面的 1026px，是运行时浏览器窗口的宽度。

```css
@-webkit-keyframes slide-right {
  0% {
    -webkit-transform: translateX(0px) scale(1);
    -webkit-transform-origin:50% 50%;
  }
  100% {
    -webkit-transform: translateX(1026px) scale(1);
    -webkit-transform-origin:50% 50%;
  }
}
```

如果要运行这个动画，我们需要将这个 keyframe 的 css 加入到页面的 Style 节点中。

我们可以在页面的 document 对象的 styleSheets 中查找第一个可用的 style 节点，如果当前页面没有 style 节点我们就需要新建一个：

```javascript
            /**
             * Insert CSS keyframe rule
             */
            insertCSS: function (rule) {
                if (document.styleSheets && document.styleSheets.length) {
                    try {
                     document.styleSheets[0].insertRule(rule, 0);
                    }
                    catch (ex) {
                        console.warn(ex.message, rule);
                    }
                }
                else {
                    var style = document.createElement("style");
                    style.innerHTML = rule;
                    document.head.appendChild(style);
                }
                return;
            }
```

参数 rule 就是要添加 css 文本。

如果我们想在一个元素上应用以上动画，我们可以动态定义一个 css class：

```css
.animateSlideRight {
    -webkit-animation-name: slide-right;
    -webkit-animation-delay:0ms;
    -webkit-animation-duration:1s;
    -webkit-animation-timing-function:linear;
    -webkit-animation-iteration-count:1;
    -webkit-animation-direction:normal;
    -webkit-perspective:1000px;
    -webkit-perspective-origin:50% 50%;
    -webkit-backface-visibility:visible;
}
```

我们也可以用 insertCSS 方法将 css 插入到 style 节点中。这里要注意，以上函数每次只能加入一条 css 规则，如果 rule 中包含 2 条或 2 条以上规则，则以 insertRule 方法会出现异常。这也是为什么参数名叫 rule 而不是 cssText 的原因。

对于本例，我们需要执行 2 次 insertCSS 函数，第一次插入 keyframe 的 CSS，第二次插入 class 的 CSS。

然后我们可以用以下语句设置元素的 class，播放元素的动画效果：

```javascript
elem.className += " " + className;
```

# 删除 CSS

如果动画是临时播放的，那么我们还需要在动画结束后将添加的 keyframe 的 css 和 class 的 css 删除，避免在页面中制造垃圾。

删除 CSS 还是需要访问 document 的 styleSheets。由于之前我们一直将 CSS 添加到 styleSheet\[0] 中，所以在删除的时候我们只访问 styleSheets 中的第一个 CSSStyleSheet 实例就可以了。

我们添加的 css 和原有的 css 都保存在 CSSStyleSheet 对象的 cssrules 列表中：

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/image001.png "image001")](http://www.alloyteam.com/wp-content/uploads/2012/10/image001.png)

如果要删除 keyframe 的 css，可以通过 rule 的 name 属性判断：

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/image003.png "image003")](http://www.alloyteam.com/wp-content/uploads/2012/10/image003.png)

如果要删除的是 class 的 css，则需要通过 rule 的 selectorText 来判断

[![](http://www.alloyteam.com/wp-content/uploads/2012/10/image005.png "image005")](http://www.alloyteam.com/wp-content/uploads/2012/10/image005.png)

我们通过以下 deleteCSS 函数实现这个功能：

```javascript
             /**
             * Delete CSS keyframe rule
             */
            deleteCSS: function (ruleName) {
                var cssrules = (document.all) ? "rules" : "cssRules",
                    i;
                for (i = 0; i < document.styleSheets[0][cssrules].length; i += 1) {
                    var rule = document.styleSheets[0][cssrules][i];
                    if (rule.name === ruleName || rule.selectorText === '.'+ruleName) {
                        document.styleSheets[0].deleteRule(i);
                        if (this.debug) {
                            console.log("Deleted keyframe: " + ruleName);
                        }
                        break;
                    }
                }
                return;
            },
```

这个函数中并没有考虑其他情况，比如 #elementCSS 的情况。读者可以自行扩展该函数。


<!-- {% endraw %} - for jekyll -->