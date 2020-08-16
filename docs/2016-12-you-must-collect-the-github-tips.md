---
title: 你必须收藏的 Github 技巧
date: 2016-12-16
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/12/you-must-collect-the-github-tips/
---

一秒钟把 Github 项目变成前端网站  

* * *

GitHub Pages 大家可能都知道，常用的做法，是建立一个 gh-pages 的分支，通过 setting 里的设置的 GitHub Pages 模块可以自动创建该项目的网站。  
这里经常遇到的痛点是，master 遇到变更，经常需要去 sync 到 gh-pages，特别是纯 web 前端项目，这样的痛点是非常地痛。  
Github 官方可能嗅觉到了该痛点，出了个 master 当作网站是选项，太有用了。

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161214091942948-905452621.png)

选择完 master branch 之后，master 自动变成了网站。master 所有的提交会自动更新到网站。

精准分享关键代码  

* * *

比如你有一个文件里的某一行代码写得非常酷炫或者关键，想分享一下。  
可以在 url 后面加上  
**#L 行号**  
比如，点击下面这个 url：  
<https://github.com/AlloyTeam/AlloyTouch/blob/master/alloy_touch.js#L240>  
你便会跳到 alloy_touch.js 的第 240 行。

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161214091956464-209006748.png)

那么问题来了？如果我是一段代码，即多行代码想分享呢？也很简单：url 后面加上  
**#L 开始行号 - L 结束行号**  
比如，[AlloyTouch](https://github.com/AlloyTeam/AlloyTouch) 的运动缓动和逆向缓动函数如下面代码段所示：  
<https://github.com/AlloyTeam/AlloyTouch/blob/master/alloy_touch.js#L39-L45>

其实也不用记忆你直接在网址后面操作，github 自动会帮你生成 url。比如你点击 39 行，url 变成了  
<https://github.com/AlloyTeam/AlloyTouch/blob/master/alloy_touch.js#L39>  
再按住 shift 点击 45 行，url 变成了  
<https://github.com/AlloyTeam/AlloyTouch/blob/master/alloy_touch.js#L39-L45>  
然后你这个 url 就可以复制分享出去了，点击这个 url 的人自动会跳到 39 行，并且 39-45 行高亮。

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161214092008729-2108420774.png)

通过提交的 msg 自动关闭 issues  

* * *

比如有人提交了个 issues <https://github.com/AlloyTeam/AlloyTouch/issues/6>  
然后你去主干上改代码，改完之后提交填 msg 的时候，填入：

    fix  https://github.com/AlloyTeam/AlloyTouch/issues/6

这个 issues 会自动被关闭。当然不仅仅是 fix 这个关键字。下面这些关键字也可以：

-   close
-   closes
-   closed
-   fixes
-   fixed
-   resolve
-   resolves
-   resolved

通过 HTML 方式嵌入 Github  

* * *

如下面所示，user 和 repo 改成你想要展示的便可以

```html
<iframe
    src="//ghbtns.com/github-btn.html?user=alloyteam&repo=alloytouch&type=watch&count=true"
    allowtransparency="true"
    frameborder="0"
    scrolling="0"
    width="110"
    height="20"
></iframe>;
```

插入之后你便可以看到这样的展示：

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161214092017573-607852822.png)

gitattributes 设置项目语言  

* * *

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161214092334917-885550227.png)

如上图所示，github 会根据相关文件代码的数量来自动识别你这个项目是 HTML 项目还是 Javascript 项目。  
这就带来了一个问题，比如 [AlloyTouch](https://github.com/AlloyTeam/AlloyTouch) 最开始被识别成 HTML 项目。  
因为 HTML 例子比 JS 文件多。怎么办呢？gitattributes 来帮助你搞定。在项目的根目录下添加如下.gitattributes 文件便可，  
<https://github.com/AlloyTeam/AlloyTouch/blob/master/.gitattributes>  
里面的：

```python
*.html linguist-language=JavaScript
```

主要意思是把所有 html 文件后缀的代码识别成 js 文件。

查看自己项目的访问数据  

* * *

在自己的项目下，点击 Graphs，然后再点击 Traffic 如下所示：

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161214092041886-1510406234.png)

里面有 Referring sites 和 Popular content 的详细数据和排名。如：Referring sites

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161214092146198-1995195515.png)

其中 Referring sites 代表大家都是从什么网站来到你的项目的，Popular content 代表大家经常看你项目的哪些文件。

trending 排行榜  

* * *

上面教大家设置语言了，下面可以看看怎么查看某类型语言的每日排行榜。比如 js 每日排行榜：

<https://github.com/trending/javascript?since=daily>

<https://github.com/trending/html?since=daily>

<https://github.com/trending/css?since=daily>

Github 推荐：<https://github.com/explore>

其他  

* * *

-   issue 中输入冒号：添加表情
-   任意界面，shift + ？显示快捷键
-   issue 中选中文字，R 键快速引用

最后  

* * *

好了，我就会这么多，也是我经常使用的技巧。欢迎补充**实用的技巧**\~~ 我会持续更新上去...  
我们团队的 Github: <http://alloyteam.github.io/>  
