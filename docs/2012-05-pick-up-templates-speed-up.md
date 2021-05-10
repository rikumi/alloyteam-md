---
title: 剥离模板代码加速 Web 页面加载
date: 2012-05-13
author: TAT.iAzrael
source_link: http://www.alloyteam.com/2012/05/pick-up-templates-speed-up/
---

<!-- {% raw %} - for jekyll -->

### 开篇

现在 Web 富应用越来越多，越来越多网站朝单页面发展，所有功能模块都在一个页面中创建。作为一个合格的前端，所负责的模块一定是逻辑跟 UI 分离的，通常的做法就是页面代码编写成模板，然后往模板填充数据并输出到页面上。关于前端模板的介绍和使用我就不说了，不了解的可以先看看这篇文章 (<http://www.css88.com/archives/4564>), 这里讨论下使用模板引擎引入的另外一个问题 (也不是 Bug 啦～) -- 页面模板代码放哪？

### 页面模板代码放哪

呼～～总算到正题了 (- -||). 说回来，页面模板的代码到底要放哪呢？

1.  放在 js 文件中；
2.  放在页面不可见的地方，比如 &lt;script type="text/plain">&lt;/script> 标签内；

话说很久很久以前，我也是把模板写在 js 里面的，然后需要修改的时候就崩溃了～在一堆字符串里面找到想要改动的地方就像是在一坨黄色的屎里面找个金戒指 (恶...). 过了不久学乖了，把模板像写 html 那样换行和缩进，就跟下面一样.

```html
var html =
    '\
    <div id="container">\
    <div>...</div>\
    <div>...</div>\
</div>';
```

然后代价是 -- 要给会混淆的引号转义以及每行末尾都要一个反斜杠！oh~ 天啊，我可是程序员啊，为什么要做这种重复无趣的工作！

于是很久很久以前的以后，我又学乖了一次，咱这次把模板写在 html 页面里面，放到一个特殊的 script 标签内，用到的时候根据 id 找到这个 script, 读取 innerHTML 拿来用。哇，简直是 perfect!~~吼吼~~

```javascript
/**
 * shot of getElementById
 * @param {String} id
 */
this.get = function (id) {
    return document.getElementById(id);
};
var templateList = {};
/**
 * 获取页面的一个 html 模板
 * @param {String} tmplId 模板的 dom id
 */
this.getTemplate = function (tmplId) {
    var tmpl = templateList[tmplId];
    if (!tmpl) {
        var tmplNode = this.get(tmplId);
        tmpl = tmplNode.innerHTML;
        tmplNode.parentNode.removeChild(tmplNode);
        templateList[tmplId] = tmpl; //缓存起来, 避免再次查找dom
    }
    if (!tmpl) {
        throw new Error('no such template. [id="' + tmplId + '"]');
    }
    return tmpl;
};
```

### 模板的飞来横祸

从此，模板和页面过着幸福快乐的生活... 然后直到有一天...

A: 为什么打开页面的那个菊花转那么久！

我:...

然后就如五雷轰顶般的醒悟，由于是单页面，模板都堆积到页面，大大增加了首页的大小，没什么逻辑的页面竟然有 37KB (gzip 前). 更因为 js/css/images 等都放到了多台 cdn, 读取速度快而且可以设置和利用浏览器 cache. 而 html 页面则只放在一台 web server, 而且因为版本迭代比较快，不能给 html 设置缓存策略 (那样会导致用户那里不能及时更新).

王子和公主就这样被硬生生拆散了～T_T

### 模板该放哪里

如果现在要我把模板都改成 js 变量，放到 js 文件里，我一定死给他看，哼～

然而，只是，可是，但是，加载速度还是得优化啊。既然开发的时候要方便，发布之后要速度，那发布前用脚本把模板抽取到 js 文件中不就结了？顿时感觉柳暗花明又一村呀~~呼啦啦啦~~

抽取的步骤为:

1.  在 js 文件中增加一个变量 templateList, 值为 {/\*HtmlTemplates\*/} (注：其实什么都行啦，这样只是为了可以正常运行以及不让编辑器报错...);
2.  编写脚本 (nodejs/python/shell/etc.), 用正则把作为模板的 script 的 id 和 innerHTML 都匹配出来，拼装成一个 json 字符串，如: { "templateId1": "value.....", "templateId2":"xxxx"} ;
3.  读取该 js 文件，把 " {/\*HtmlTemplates\*/} " 替换成生成的 json 字符串；
4.  修改 getTemplate 方法，优先从 templateList 查找模板；

至于抽取用什么语言写都没所谓啦，仅仅是正则和文件操作，推荐用 nodejs, 真是太方便了。不过大部分机器都木有装，需要自己装。有些环境不能随便装新程序，那也可以用 python 写个，花半个钟现学现用就够了。附上个 NodeJs 版的.

```javascript
var fs = require("fs");
var inputHtmlFile = "./index.html";
var outputHtmlFile = "./out/index.html";
var inputJsFile = "./js/mb.templates.js";
var outputJsFile = "./out/js/mb.templates.js";
var content = fs.readFileSync(inputHtmlFile).toString();
var regex =
    /<script\s*id="(\w+)"\s*type="text\/plain"\s*>([\s\S]*?)<\/script>/gi;
var result = {};
content = content.replace(regex, function (m, $1, $2) {
    result[$1] = $2.replace(/\n|\r/g, "");
    return "";
});
fs.writeFileSync(outputHtmlFile, content);
content = fs.readFileSync(inputJsFile).toString();
var templateStr = JSON.stringify(result);
content = content.replace("{%HtmlTemplates%}", templateStr);
fs.writeFileSync(outputJsFile, content);
```

### 收尾

经过这么一搞，把模板代码抽出来之后，首页的大小立马从 37KB 降到 1.7KB. 虽然是个小技巧，也足以成大谋。那感觉，可是跟涨薪一样爽哇～～


<!-- {% endraw %} - for jekyll -->