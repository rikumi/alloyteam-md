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


<!-- {% endraw %} - for jekyll -->