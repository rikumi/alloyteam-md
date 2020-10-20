---
title: CSS3 模拟 Checkbox
date: 2012-03-27
author: TAT.iAzrael
source_link: http://www.alloyteam.com/2012/03/css3-checkbox/
---

<!-- {% raw %} - for jekyll -->

话说，很久很久以前，一直到不久前，浏览器原生的 checkbox (复选框) 的样式大部分都不能改的，在各个浏览器中的外观和行为都不一致，这是一件相当让人蛋疼的事.

而在那个远古的蛮荒时代，还生活着一种叫攻城师的生物，每天被产品经理们强迫着，想方设法让 checkbox 外观一统江湖，苦不堪言.

在那个时代，css2 和 dom level2 风行，却对 checkbox 束手无策，苦逼的攻城师们只能用 JS 来模拟 checkbox 的行为，无辜的 checkbox 只能灰溜溜的束之高阁～.~

终于，新时代还是来临了～攻城师的救世主 ——CSS3, 就像十字军东征一样，所向披靡，一往直前的来到我们面前，依靠 CSS3 的得力大将 (:checked 伪类 和 +,~ 选择符), 攻城师们终于可以抛开万恶 (阿弥陀佛，形势所逼，勿怪勿怪...) 的 JS, 把 checkbox 迎接了回来.

\\================== 我是时间的分割线 ==================================

好了，欢迎回到 21 世纪，^\_^.  话说我们这次还是模拟 checkbox, 但是却没抛开 checkbox, 利用:checked 伪类和兄弟选择符 (+/~), 用另外一个节点实现一个统一外观的 checkbox, 而真正的 checkbox 这是用来保存选中态，而且，完全没用用到 js 哦亲～

嗯，其实上面的都是废话，代码才是王道。好，见证奇迹的时刻～～

\\================== 我是华丽丽的代码分割线 ==============================

```css
.checkbox{
    display: none;
}
.checkbox + label{
    width: 24px;
    height: 12px;
    display: inline-block;
    border: 1px solid #959595;
    margin: 3px;
    vertical-align: middle;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
}
.checkbox + label span{
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
 
    background: -webkit-linear-gradient(top, #5071F5, #0E38E7);
    -webkit-transition: left 0.1s;
    border-radius: 2px 0 0 2px;
}
.checkbox ~ select{
    vertical-align: middle;
    display: none;
}
.checkbox ~ .cate-1{
    display: inline-block;
}
.checkbox:checked + label span{
    left: 50%;
    border-radius: 0 2px 2px 0 ;
}
.checkbox:checked ~ .cate-2{
    display: inline-block;
}
.checkbox:checked ~ .cate-1{
    display: none;
}
```

下面是 html 代码

```html
<div class="content">
<span class="tips">请狠狠的点击我吧 --&gt;</span>
<input id="imCheckbox" type="checkbox" class="checkbox">
<label for="imCheckbox"><span></span></label>
<select class="cate-1"><option>我是分类1~啦啦啦啦</option></select>
<select class="cate-2"><option>我是分类2~hohoho~~</option></select>
</div>
```

其实也就是多了一个 label 标签，用 label 模拟 checkbox, 然后把 checkbox 偷偷的藏起来. 当点击 label 的时候，会触发 checkbox 的选中态的变更。当 checkbox 被选中的时候，:checked 伪类就会起作用. + 选择符是用来选择跟着 checkbox 屁股的兄弟的，也就是 label. 而～选择符则是选择跟在他屁股后面的所有兄弟，如 select 等.

如果你还不相信，可以点击这里[&lt;&lt;这里 >>](http://www.alloyteam.com/wp-content/uploads/2012/03/css3-checkbox-demo.html)看活生生血淋淋的例子.

这里为了装逼，我模拟了 ios 上面的 checkbox, 带滑块的，如果你只是要模拟原生的 checkbox , 连 label 里面的 span 标签都可以省掉.

另外，利用:checked 和兄弟选择符还能做更多的事哦，比如，checkbox 没选中的时候显示一个下拉框，没选中的时候显示另一个下拉框，效果还是看例子吧.

故事到此为止，后面就由你续写啦～～


<!-- {% endraw %} - for jekyll -->