---
title: Vim 常用插件 —— 前端开发工具系列
date: 2013-12-02
author: TAT.gctang
source_link: http://www.alloyteam.com/2013/12/front-end-development-tools-vim-introduce-common-plug-ins/
---

作为一名开发者，应该对编辑器之神 [Vim](http://en.wikipedia.org/wiki/Vim_(text_editor) "vim wiki") 与神之编辑器 [Emacs](http://en.wikipedia.org/wiki/Emacs "Emacs wiki") 有所耳闻吧。编辑器之战的具体细节有兴趣的童鞋可以 google 之。

Vim 最大的特点是打开速度快，功能强大，一旦掌握了其中的命令，编程过程双手就不需要离开键盘了。

用习惯了 Vim 的另一个好处是在 linux 下可以很轻松地用 vi 来处理文件，当然 emacs 也可以做默认编辑器，但是不是每台机器都有安装 Emacs。

今天主要给大家介绍 Vim 在前端领域的一些常用插件：  

## 1.mark.vim

[mark.vim](http://www.vim.org/scripts/script.php?script_id=1238) 主要的功能是变量的高亮。

选中要高亮的词，使用 \\m 来使其高亮，多个词的高亮会显示为不同的颜色，在不需要查找的时候以及代码 review 的时候使用效果还是挺不错的，

使用\\n 可以去除所选的词的高亮。

更多详情可以点击插件主页了解。

ps: 查找单词可以使用 \* 这个命令来进行快速搜索

## 2.zencoding.vim

[zencoding.vim](http://www.vim.org/scripts/script.php?script_id=2981) 后来改名为 Emmet.vim，主要功能是实现代码的快速编写。

具体教程可以参见[官方的网站](https://raw.github.com/mattn/emmet-vim/master/TUTORIAL)

个人感受是做页面重构的时候用得比较多，通过命令可以快速生成 html 的结构，提高了前端开发的生产力。

## 3.ctrlp.vim

[ctrlp.vim](http://kien.github.io/ctrlp.vim/) 主要功能是对文件以及 buffer 进行模糊查询，快速打开文件。

操作实例如下图所示：

[![ctrlp](http://www.alloyteam.com/wp-content/uploads/2013/12/ctrlp.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/ctrlp.png)

[![ctrlp-vim-demo](http://www.alloyteam.com/wp-content/uploads/2013/12/ctrlp-vim-demo.gif)](http://www.alloyteam.com/wp-content/uploads/2013/12/ctrlp-vim-demo.gif)

在知道文件名的情况下，使用 ctrl + p 打开此插件，输入文件名，实则是文件名开头几个字母就可以快速打开文件。

ps：如果当前的文件已经保存好，那么会直接替换成搜索到的文件，如果没有保存的，会进行窗口的分隔类似与 sp 的命令。

所以在对比文件的情况下我一般会用 vsp 来分割窗口或者 tabnew 一个新的 tab，再打开新的文件。

如果需要查其他目录或者忘记了文件名的话，就可以使用下面的插件 NERD_tree 了。

## 4.NERD_tree.vim

[NERD_tree.vim](http://www.vim.org/scripts/script.php?script_id=1658) 主要功能是一款文件浏览器，可以查看文件目录结构打开相应的文件。

具体演示如下图所示:

![nerd](http://farm4.staticflickr.com/3001/2862367534_53cd90855e_o.gif)

nerd

我是使用绑定的快捷键 F4 来打开文件浏览器，光标在文件浏览器中可以用 jk 来移动，回车键可以打开文件，按 q 可以退出文件浏览器。

## 5.neocomplcache.vim

[neocomplcache.vim](https://github.com/Shougo/neocomplcache.vim) 主要功能是进行代码补全，

优点是对上下文进行索引，结果保存到缓存中，自动补全的效率比较高，另外匹配的也比较精准。

补全效果如下图展示：

[![omni_complete](http://www.alloyteam.com/wp-content/uploads/2013/12/omni_complete.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/omni_complete.png)

[![vim_complete](http://www.alloyteam.com/wp-content/uploads/2013/12/vim_complete.png)](http://www.alloyteam.com/wp-content/uploads/2013/12/vim_complete.png)

Vim 中的代码补全插件比较多，一般补全的智能性依赖于插件的字典，变量缓存机制。

从这点看 neocomplcache 也是挺不错的，另外智能读读取路径的功能也是挺赞的。

## 6.multiple_cursors.vim

[multiple_cursors.vim](https://github.com/terryma/vim-multiple-cursors) 的主要功能是多光标多行编辑。

主要效果可以见下面的图片：

[![example1](http://www.alloyteam.com/wp-content/uploads/2013/12/example1.gif)](http://www.alloyteam.com/wp-content/uploads/2013/12/example1.gif)

[![example3](http://www.alloyteam.com/wp-content/uploads/2013/12/example3.gif)](http://www.alloyteam.com/wp-content/uploads/2013/12/example3.gif)

在没有这款插件前，原生命令一般是进行块操作，在可视模式下对多行进行操作。步骤比较冗长，也容易出错，

这款插件可真谓利器啊，同时它还支持正则的操作呢。

## 7.commentary.vim

[commentary.vim](https://github.com/tpope/vim-commentary) 主要功能是可以批量注释单行或多行以及去除注释；

绑定退格键，选择多行可以直接以 /\*\*/ 的形式注释代码

最后，几款插件都是在前端开发中经常用到的，还有很多功能，原生的一些命令还是可以做的，

另外用 Vim 还有一个好处是从写 C 到写 PHP 再到写 JS，都可以用同一个编辑器，还是挺方便的。

快捷键神马的自己在 vimrc 中配置即可，

打造自己的 IDE 的过程虽然折腾，但是之后使用的过程还是挺爽的呢~~~~