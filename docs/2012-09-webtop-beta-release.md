---
title: Webtop——HTML5 桌面 App 开发引擎最新 beta 版发布
date: 2012-09-09
author: TAT.melody
source_link: http://www.alloyteam.com/2012/09/webtop-beta-release/
---

[![](http://www.alloyteam.com/wp-content/uploads/2012/09/1.png "1")](http://www.alloyteam.com/wp-content/uploads/2012/09/1.png)  
Webtop——html5 桌面 app 开发引擎。基于 webtop，你可以使用 html5 和 css3 等新技术构建桌面 app，即开发直接运行于 windows 上的软件，使用透明渲染模式能将网页直接渲染在桌面上，轻松实现透明阴影等特效。而且，提供了大量的本地 api，使你的 app 能达到跟本地 app 一样的体验。基于它，你可以开发诸如浏览器，QQ，PS，桌面 widget 等桌面 app。这种开发软件的方式，相比传统桌面软件开发方式的开发效率，个人认为至少是其的 10 倍。

-   官网：[http://webtop.alloyteam.com](http://webtop.alloyteam.com/)
-   下载地址：<http://download.alloyteam.com/webtop.zip>
-   官方群：257960168

[![](http://www.alloyteam.com/wp-content/uploads/2012/09/screen.png "screen")](http://www.alloyteam.com/wp-content/uploads/2012/09/screen.png)透明浏览器

[![](http://www.alloyteam.com/wp-content/uploads/2012/09/12.png "1")](http://www.alloyteam.com/wp-content/uploads/2012/09/12.png)音乐 widget

[![](http://www.alloyteam.com/wp-content/uploads/2012/09/13.png "1")](http://www.alloyteam.com/wp-content/uploads/2012/09/13.png)屏幕尺子

……

其中的透明浏览器可用来在开发阶段进行调试。点击[![](http://www.alloyteam.com/wp-content/uploads/2012/09/glass_ball.png "glass_ball")](http://www.alloyteam.com/wp-content/uploads/2012/09/glass_ball.png)按钮切换网页渲染模式，默认使用不透明模式渲染。点击[![](http://www.alloyteam.com/wp-content/uploads/2012/09/setting.png "setting")](http://www.alloyteam.com/wp-content/uploads/2012/09/setting.png)按钮或按 F12 或 F9 可打开开发者工具，[![](http://www.alloyteam.com/wp-content/uploads/2012/09/refresh.png "refresh")](http://www.alloyteam.com/wp-content/uploads/2012/09/refresh.png)强制刷新。点击浏览器右上角[![](http://www.alloyteam.com/wp-content/uploads/2012/07/apps1.png "apps")](http://www.alloyteam.com/wp-content/uploads/2012/07/apps1.png)按钮可生成默认.app 文件，app 文件可双击直接运行 app 文件为一配置文件，可使用记事本打开，注意不要设为默认打开。可使用的配置项如下：

-   url：网页地址
-   name：程序名字
-   icon：程序图标
-   width：初始化窗口宽度
-   height：初始化窗口高度
-   x：初始化窗口 x 坐标（相对于屏幕）
-   y：初始化窗口 y 坐标（相对于屏幕）
-   enableDrag：是否允许全窗口拖拽，仅对透明窗口有效，1 为真，0 为假，以下同
-   enableResize：是否允许改变窗口大小
-   disableTransparent：是否禁用透明渲染
-   disableRefresh：禁止按 F5 刷新
-   disableDevelop：禁止按 F12 打开开发者工具
-   hasBorder：是否使用默认边框
-   max：初始化时是否最大化窗口，如果为真，则忽略 width，height，x，y 四个参数
-   exStyle：高级参数，设置窗口额外属性，诸如置顶，去掉任务栏图标等

以下为 webtop 的 API 文档

**API 文档**

注：以下函数的最后一个参数都为 handler，代表窗口句柄，不传则使用本窗口的句柄，只有在操作其他窗口时才有作用。请不要在全局变量中使用 handler 这个变量名。

**窗口相关**

-   bringToTop (handler);// 窗口移到最顶层
-   browse (url,handler);// 在新进程中使用默认的透明浏览器浏览网页，url 为网页路径
-   close (handler);// 关闭窗口
-   createBrowser (url,handler);// 在新进程中打开一个 webtop 窗口，url 为网页路径
-   createWindow (url,exStyle,isTransparent,readyHandler,handler)// 在当前进程中创建一个窗口，并返回窗口句柄，readyHandler 为窗口网页加载后要执行的 js 代码，此函数或将废弃
-   createWindowBase (url,exstyle,isTransparent,readyHandler,handler);// 同上，区别在于使用本地相对路径，此函数或将废弃
-   drag (handler);// 拖拽窗口
-   enableDrag (handler);// 允许拖拽窗口，同配置参数 enableDrag=1 作用相同。
-   focus (handler);// 使窗口获得焦点
-   getPos (handler);// 获得窗口位置，返回值为一 object，格式如下 {x:13,y:54}
-   getScreenSize (handler);// 获取屏幕大小，返回值为一 object，格式如下 {width:130,height:54}
-   getSize (handler);// 获得窗口大小，返回值为一 object，格式如下 {width:130,height:54}
-   hide (handler);// 隐藏窗口
-   loadUrl (url,handler);// 加载网页，url 为网页路径
-   max (handler);// 最大化窗口
-   mini (hander);// 最小化窗口
-   move (x,y,handler);// 移动窗口
-   ready (handler);// 只对被创建出来的窗口有用，执行父窗口闯过来的 js 代码 readyHandler
-   reload (handler);// 重新加载当前页面
-   reloadIgnoreCache (handler);// 重新加载当前页面并忽略缓存
-   restore (handler);// 还原窗口，对应于 hide 函数
-   runApp (appName,param,handler);// 运行一个 app，appName 为.app 文件路径，param 为参数，会带在 url 上，格式如 param=xxx，在 app 中可通过获取当前网页 url 从中提取出该参数。此函数不太稳定，请尽量使用 runAppEx。
-   runAppEx (appName,param,handler);// 也是运行一个 app，同 runApp 的区别是会新起一个进程运行 app
-   setSize (w,h,handler);//w 为窗口宽度，h 为窗口高度
-   setTitle (title,handler);// 设置窗口标题
-   setTopMost (handler);// 窗口置顶，此函数跟 bringToTop 的区别在于此函数会使窗口永远置顶，除非有另外一个窗口调用了置顶函数
-   setWindowStyle (exStyle,handler);// 高级函数，设置窗口额外属性，诸如置顶之类。
-   showDev (handler);// 打开开发者工具
-   stopDrag (handler);// 停止窗口拖拽

**图像相关**

-   saveImageFromBase64 (s,path,handler);//s 为 base64 字符串，可通过 canvas 的 toDataURL 函数生成，path 为保存路径，可以使用相对路径，即相对主网页文件的路径，以下同
-   saveImageFromStream (id,width,height,path,handler);//id 为二进制流 id, 下面会讲到如何创建二进制流，width 为图像宽度，height 为图像高度，path 为图像保存路径
-   toImage (path,handler);// 把当前网页存为一张图片，支持透明，path 为图像保存路径
-   toImageEx (path,x,y,width,height,handler);// 把当前网页的某一矩形区域存为图像，x 和 y 为左上角坐标，width 和 height 为宽度跟高度，ptah 为图像保存路径

**系统相关**

-   setTaskIcon (id,path,title,handler);// 设置一托盘图标，id 自己指定，确保不重复即可，path 为图标文件所在路径，暂时只支持本地图标，title 为鼠标移到图标上所要显示的文字
-   delTaskIcon (id,handler);// 删除一托盘图标，id 为创建图标时使用的 id
-   findFiles (path,flag,handler);// 查找文件，path 为文件路径，支持通配符，flag 为 true 则查找子目录，返回格式为一数组，格式如下 "\["1.txt","AmfStream.cpp","AmfStream.h",{"name":"base","list":\["2.txt"]}]，其中 name 为目录名，list 为目录下的文件
-   getOpenName (filename,handler);// 打开 “打开文件” 对话框，filename 为对话框中要显示的默认名字
-   getSaveName (filename,handler);// 打开 “打开文件” 对话框，filename 为对话框中要显示的默认名字
-   readFile (path,handler);// 读取一文本文件的所有内容，返回值为文件内容的字符串
-   writeFile (path,s,handler);// 写一文本文件，s 为要写入的字符串
-   logOff (flag,handler);// 注销 windows 系统，flag 为 true 表示强制执行，以下同
-   reboot (flag,handler);// 重启系统
-   quit (handler);// 退出当前进程
-   shutdown (flag,handler);// 关闭系统
-   createMemory (name,filename,size,handler);// 创建一共享内存块，供二进制流读写使用，name 为内存块命名，不同进程可通过此名字进行共享内存操作，filename 文件路径，如果不为空，则建立一磁盘文件，所有二进制操作将会写入此文件中，为空的话则不创建文件，所有的二进制流只在内存中进行，size 为文件大小，返回值为代表内存块的 id
-   createStream (id,handler);// 创建一二进制文件流，id 为调用 createMemory 函数创建内存块的返回值，返回值为代表二进制流的 id
-   deleteMemory (id,handler);// 释放一内存块，id 为 createMemory 函数的返回值。使用 createMemory 之后要记得调用此函数释放内存，否则会造成内存泄漏。
-   deleteStream (id,handler);// 释放一二进制流，id 为 createStream 函数的返回值。使用 createStream 之后要记得调用此函数释放内存，否则会造成内存泄漏。
-   getSharePos (handler);// 获取默认共享内存块的二进制流读写指针位置。注：此内存块为所有进程共享，默认创建的
-   setSharePos (i); 设置共享内存块的二进制流读写指针位置
-   getStreamPos (id,handler);// 获取一二进制流的读写指针位置，id 为二进制流 id，单位为字节，id 为二进制流 id，不传则使用上面提到的默认的共享内存的二进制流，以下同
-   setStreamPos (pos,id,handler);// 设置一二进制流读写指针的位置，单位为字节
-   readByte (id,handler);// 读取一字节
-   readBytes (l,id,handler);// 读取连续内存块，l 为内存块的长度，返回一二进制数组
-   readInt (id,handler);// 写入一占四位字节的整数
-   readString (l,id,handler);// 读取固定长度的字符串，l 为字符串长度，以下同，注意一个汉字的长度为 3
-   readStringEx (l,id,handler);// 读取固定长度的字符串，对应于 writeStringEx。
-   readWString (l,id,handler);// 读取固定长度的宽字符串，一个宽字符占两个字节，无论英文或是中文，但是传递长度的参数时无需乘以 2，只需传字数即可
-   readWStringEx (l,id,handler);// 读取固定长度的宽字符串，对应于 writeWStringEx
-   writeByte (b,id,handler);// 向一二进制流写入一字节，b 为要写入的数字
-   writeBytes (arr,id,handler);// 向二进制流写入固定长度的连续字节，arr 为存储要写进去的数据的数组
-   writeInt (i,id,handler);// 读写一占四字节的整数
-   writeString (s,id,handler);// 写入一字符串
-   writeStringEx (s,id,handler);// 写入一字符串，与 writeString 不同的是此函数会在字符串前面写入三个字节，标明字符串的长度。
-   writeWString (s,id,handler);// 写入一宽字符串
-   writeWStringEx (s,id,handler);// 写入一宽字符串，与 writeWString 不同的是此函数会在字符串前面写入三个字节，标明字符串的长度。

**P2P 相关**

-   connect (ip,uid,handler);// 连接到服务器，ip 为服务器地址，uid 为用户名，服务器在内网则使用内网地址，在外网就使用外网地址
-   getIPAndPort;// 获取当前 webtop 窗口所使用的 ip 和端口号，返回值为一 object，结构如下：{ip:'192.169.0.102',port:65345}
-   getUsers (handler);// 获取所有用户列表，该函数不会同步返回用户列表，调用后请监听 webtopP2PUpdateUserList 事件来得到用户列表，下面关于自定义事件部分会详细谈到。
-   connectByHost (hostName,uid,handler);// 连接到服务器，hostName 为服务器名称，可以为局域网机器名字或者域名，uid 为用户名
-   sendMessage (userName,msg,handler);// 向一用户发送消息，userName 为用户名称，msg 为要发送的消息
-   sendMsgToIP (ip,port,msg,handler);// 向某一 ip 地址发送消息，参数 ip 为 ip 地址，port 为端口号，msg 为要发送的消息
-   sendMsgToServer (msg,handler);// 向 server 发送消息

**自定义事件**

webtop 中定义了一些自定义事件，如下

注，所有事件的回调函数都只有一个参数 e，代表事件对象，其中 e.detail 对象为一 object，包含事件的相关信息

-   webtopReady 事件，webtop 对象创建完成之后触发，有关 webtop 的初始化调用请放在此事件触发之后。  
    监听代码：addEventListener ("webtopReady",readyHandler);// 其中 webtopReady 为事件名，readyHandler 为事件的回调函数。以下事件的监听方法与此相同。注：对 webtopReady 事件的监听请放在 onload 之前。
-   webtopWindowResize：webtop 窗口改变大小之后触发，e.detail 的结构如下 {width:243,heigh:234}。width 和 height 为窗口的宽度和高度
-   webtopWindowMove：webtop 窗口移动后触发，e.detail 结构如下 {x:34,y:43}，x 和 y 为窗口的坐标，相对于屏幕
-   webtopDragDrop：当拖拽文件到窗口时触发，仅在透明渲染模式下有效（因为在此模式下 html5 的拖拽功能会失效）。e.detail 的结构如下 {list:\["E:/webtop/1.png","E:/webtop/2.png"]}。list 为文件列表，存储各个文件的路径
-   webtopWindowActive：窗口激活时触发
-   webtopWindowFocus：窗口获得焦点时触发
-   webtopRefresh：// 在用户按下 F5 时触发，仅在配置项 disableRefresh=0 时才会触发
-   webtopShowDev：// 在用户按下 F12 时触发，仅在配置项 disableDevelop=0 时才会触发
-   webtopTaskMouse：在托盘图标上进行相关的鼠标操作后触发，e.detail 的结构如下 {type:34}，其中 type 代表鼠标动作的类型，为一整数，在实际开发中可通过打 log 来获取相关数值代表的鼠标类型
-   webtopWindowClose：webtop 窗口被关闭时触发
-   webtopMouseLeaver：鼠标离开 webtop 窗口时触发
-   webtopShowTip：在鼠标移到具有 title 属性的 dom 元素上面时触发（webtop 没有实现默认的 tips）
-   webtopP2PRecieveMessage：在 webtop 窗口收到 p2p 消息时触发，e.detail 的结构如下：{ip:'192.168.0.102',port:64656,msg:'sfsdfsfasdf'}。ip 为发送方的 ip，port 为发送方的端口，msg 为对方发送的消息
-   webtopP2PInitInfo：调用 connect 之后，p2p 初始化之后触发，e.detail 的结构如下：{ip:'192.168.0.102',port:64656}。ip 为当前 webtop 窗口使用的 ip，port 当前 webtop 窗口使用的端口
-   webtopP2PUpdateUserList：调用 getUsers 函数之后的回调事件。e.detail 的结构如下 {list:\['192.168.0.102:55654_melody','192.168.0.101:55354_yukin'],ip:'192.168.0.102',port:64656}。其中 192.168.0.102 为该用户的 ip，55654 为该用户的端口，melody 为该用户的用户名。ip 为当前 webtop 窗口使用的 ip，port 当前 webtop 窗口使用的端口