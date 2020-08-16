---
title: 【PowerfulJS】1~ 使用 JS 操作 HTML 文档
date: 2013-12-06
author: TAT.dorsywang
source_link: http://www.alloyteam.com/2013/12/powerfuljs-1-to-operate-an-html-document-using-js/
---

<!-- {% raw %} - for jekyll -->

blockquote { background:#f9f9f9; border-left:10px solid #ccc; margin:1.5em 10px; padding:.5em 10px; quotes:"\\201C""\\201D""\\2018""\\2019"; } blockquote:before { color:#ccc; content:open-quote; font-size:4em; line-height:.1em; margin-right:.25em; vertical-align:-.4em; } blockquote p { display:inline; font-style: italic; } em{ font-style: italic; }

> 做为一个刚吃过肉的人，看过大海，思考过人生，决定还是要静下心做点总结。

最近在做 Web 工具，做为一个在 Web 中运行的工具，想要做强大的事情，在不依赖于 Server 端的支持、不依赖插件下，还要完成这些事情，有时候想想，确实是一件很难的事情。取决于

浏览器是服务端的代码运行于客户端，出于安全性的考虑，做了很多限制。浏览器是一个相对封闭的环境，说白了，能力有限。  

> 但是，想想人生，虽然很艰难，还是要快乐的走下去。

比如

-   把对 JS 对 DOM 修改保存到文档中，JS 只能望洋兴叹
-   比如一个很好的图片，保存到本地指定路径，JS 也只能泪水满地

因为

-   浏览器的 JS 运行在一个封闭的环境

但想想做了这么多年的前端，JS 还是蛮强大的，它的封闭或许会给我们一些其他的解决方案。

## 使用 JS 来操作 CSS

> 现在的需求是，我要做一个类似 F12 的工具，查看当前元素被应用上 CSS 规则并可以修改它，然后实时生效这些规则，并且给出在相应文档中做出的修改。

这个需求有两个难点，

1.  要把 CSS 文档中命中的规则找出来（甚至告诉我们它在哪个 CSS 文档的第几行代码做的定义）。
2.  要给出修改后的整齐的文档

> 所幸依赖于 Chrome 这样的老爸，JS 也变的很有能力。

命中 CSS 的规则只需要使用挂载在 Window 上的全局函数 getMatchedCSSRules 就能拿到通过命中的 CSS 规则，getMatchedCSSRules 函数接受一个 dom 元素做为参数，返回一个 CSSRuleList 集合

返回的 CSSRuleList 类似 \[CSSStyleRule, CSSStyleRule, ....]  
而 CSSStyleRule 定义如下

```javascript
" ]{
    cssText: ".t{ color: red;}" , //命中的CSS规则
    parentRule: null, //返回包含规则（如果有的话）， 如在@media中定义的
    parentStyleSheet: null, //返回包含的styleSheet对象
    selectorText: ".t", //命中的选择器,
    style: CSSStyleDeclaration, //css声明对象
    type: 1 //规则类型 比如 style声明、media声等、charset声明等
}
```

其实拿到 cssText，我们可以做一些简单的解析

css 上下文无关文法是  
_cssBlockDefition_ -> _selectorText_{_styleDefition_}_cssBlockDefition_ | 空串  
_styleDefition_ -> _name_:_value_;_styleDefition_ | 空串  
......

其中，斜体是非终结符  
这里只列我们关心的串定义，可见还是很简单的，由于使用 JS，正则已经把我们写好，而且命中的规则都是通过语法检查的，所以直接用正则去匹配就可以了，根据上述文法，简单写一个 demo 如下

```javascript
" ]
//复制直接在Console中运行
var css = "body{color: red; font-size: 12px;} .banner{ width: 12px; height: 16px; background: url(img/banner.png);}";
 
function cssFormat(c){
  //块级定义
  var cssBlockDefitionReg = /[^{]*\s*{([^}]*)}\s*/g;
  var cssBlockDefition;
 
  //样式定义
  var styleDefition;
  var styleDefitionReg = /([^:\{\}\s]+)\s*:\s*([^;]+);/g;
  var styleClaration;
 
  //拿到块级定义
  while(cssBlockDefition = cssBlockDefitionReg.exec(c)){
    //拿到样式定义
    styleDefition = cssBlockDefition[1];
 
    console.log("样式定义块是: " + cssBlockDefition[0]);
 
    while(styleClaration = styleDefitionReg.exec(styleDefition)){
      console.log("属性是： " + styleClaration[1]);
      console.log("值是： " + styleClaration[2]);
    }
 
    console.log("\n\n");
  }
}
 
cssFormat(css);
```

OK，通过解析 CSS String，我们可以拿到我们想要的东西，但问题并非要走这条路，其实对于 CSSStyleRule 中，style 是标准的 CSSStyleDeclaration 对象，直接可以拿到命中规则的 styleDefition，这时候你可以选择去解析 styleDefition 字符串，或者选择直接用 CSSStyleDeclaration 对象中有值属性来显示出来。

拿到命中的 CSS 的规则后，通过修改相应的 CSS 规则，要使规则应用到文档中，直接可以使用 CSSStyleDeclaration 对象的 setProperty 方法来设置修改属性，设置完成后通常文档还不会立即生效，这时候就需要触发文档的 layout 使应用生效，示例代码如下

```javascript
" ]       var style = getMatchedCSSRules(el)[index].style;
        style.setProperty(proname, value);
 
        //触发layout
        el.style.zoom = 1;
```

这时候就完成了对 CSS 文档的读取与修改

但请注意

-   getMatchedCSSRules 同样受限于同源安全限制（跨域限制)，对于跨域的文档的 CSS 会返回 null
-   getMatchedCSSRules 并没有将内联 style 算在内，所以还要考虑内联 Style 的定义，但这个相对读取与修改比较简单

任务并没有完成，遗留的问题

-   对于定位文档的中 CSS 修改代码的位置，可能通过 ajax 请求 css 文档搜寻更改位置
-   对于 ie 系的几个倔强大哥们，都不支持 getMatchedCSSRules 方法，鉴于 CSS 语法的简单性，可以尝试通过 ajax 请求文档 CSS 文档来进行解析 CSS 语法，然后拿到对应的命中规则。

肉消化的差不多，CSS 篇也写完了，有问题还请指教～


<!-- {% endraw %} - for jekyll -->