---
title: AEditor 快速上手教程
date: 2015-07-12
author: TAT.Cson
source_link: http://www.alloyteam.com/2015/07/aeditor-kuai-su-shang-shou-jiao-cheng/
---

本教程演示如何使用 AEditor 制作一个简单的 H5 交互页 demo:

[![37](http://www.alloyteam.com/wp-content/uploads/2015/07/37.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/37.jpg)

交互页 demo 地址：

[点击打开 H5 交互页 demo](http://aeditor.alloyteam.com/demo/index.html)

AEditor 访问地址：

[http://aeditor.alloyteam.com](http://aeditor.alloyteam.com/)  

**Step1：设置页面背景颜色**

首先我们设置页面的背景颜色，右击舞台点击 “设置背景”：

[![1](http://www.alloyteam.com/wp-content/uploads/2015/07/1.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/1.jpg)

然后在背景颜色中填上色值 rgb (38, 61, 102)，或者选择自己喜欢的颜色：

![](http://images.cnblogs.com/cnblogs_com/Cson/711216/o_2.jpg)![](http://images.cnblogs.com/cnblogs_com/Cson/711216/o_2.jpg)[![2](http://www.alloyteam.com/wp-content/uploads/2015/07/2.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/2.jpg)

点击确定，设置页面背景颜色成功。

**Step2：AEditor 标题文字动画制作**

首先，点击 “文字” 按钮，添加文本到 AEditor，并改变输入内容为 AEditor：

[![4](http://www.alloyteam.com/wp-content/uploads/2015/07/4.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/4.jpg)

[![3](http://www.alloyteam.com/wp-content/uploads/2015/07/3.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/3.jpg)

设置文字的颜色为浅蓝，并且设置大小为 33px，此时文字样式初始化完成：

[![4](http://www.alloyteam.com/wp-content/uploads/2015/07/42.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/42.png)

要对文字应用渐变向下的动画，我们需要把文字添加到时间轴。右击文字，选择” 添加到时间轴 “：

[![5](http://www.alloyteam.com/wp-content/uploads/2015/07/5.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/5.png)

点击后会发现顶部多了对应该文字的时间轴：

[![5](http://www.alloyteam.com/wp-content/uploads/2015/07/5.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/5.jpg)

此时我们就可以开始具体到帧的动画编辑了。

帧动画的时长默认是 6s，我们并不需要这么长的动画时间。所以我们选中该时间轴，把时长改成 1s，发现此时时间轴变短了，只有 1s 的动画时长：

[![6](http://www.alloyteam.com/wp-content/uploads/2015/07/6.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/6.png)

选择第一个关键帧，把透明度设置为 0，缓动选择 easeout：

[![7](http://www.alloyteam.com/wp-content/uploads/2015/07/7.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/7.jpg)

再选择最后一个帧，把右则属性编辑器的 Y 值设置为 60（此时会生成新的关键帧）：

[![6](http://www.alloyteam.com/wp-content/uploads/2015/07/6.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/6.jpg)

然后点击播放，则可看到文字渐变向下出现的动画。

[![9](http://www.alloyteam.com/wp-content/uploads/2015/07/9.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/9.jpg)

另外描述部分的动画制作过程大同小异，就不详述了，描述部分添加到 AEditor 的效果：

[![20](http://www.alloyteam.com/wp-content/uploads/2015/07/20.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/20.jpg)

**Step2：制作企鹅 logo 动画**

图片素材：

[![alloy](http://www.alloyteam.com/wp-content/uploads/2015/07/alloy.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/alloy.png)

点击 “图片” 按钮，上传企鹅 logo：

[![7](http://www.alloyteam.com/wp-content/uploads/2015/07/7.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/7.png)

图片添加到 AEditor：

[![8](http://www.alloyteam.com/wp-content/uploads/2015/07/8.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/8.png)

由于图片要应用动画，一样右击添加到时间轴，时长设置为 1.2s。

然后选择第一个关键帧，透明度设置为 0，缓动设置为 easeout：

[![10](http://www.alloyteam.com/wp-content/uploads/2015/07/10.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/10.jpg)

由于我们想让动画延迟 0.2s 开始，所以把第一个关键帧右击 “复制”：

[![11](http://www.alloyteam.com/wp-content/uploads/2015/07/11.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/11.jpg)

然后右击 0.2s 处的帧，选择 “粘贴”，此时就把第一个关键帧复制到 0.2s 处了：

![12](http://www.alloyteam.com/wp-content/uploads/2015/07/12.jpg)

粘贴完成：

[![9](http://www.alloyteam.com/wp-content/uploads/2015/07/9.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/9.png)

此时再选择最后一个帧，设置选装 rotateZ 为 720 度，透明度为 1：

[![14](http://www.alloyteam.com/wp-content/uploads/2015/07/14.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/14.jpg) [![13](http://www.alloyteam.com/wp-content/uploads/2015/07/13.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/13.jpg)

再次点击播放动画，则可看到翻转动画播放。

**Step3：制作企鹅 logo 点击翻转动画**

接下来我们制作点击企鹅 logo，logo 播放翻转动画。

首先设置企鹅 logo 的点击行为，右击企鹅 Logo，选择 “设置点击行为”：

[![11](http://www.alloyteam.com/wp-content/uploads/2015/07/11.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/11.png)

勾上触发自定义事件，然后填入要触发的事件名 “rotate”：

[![16](http://www.alloyteam.com/wp-content/uploads/2015/07/16.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/16.jpg)

点击确定，此时可以看到企鹅 Logo 上有点击事件标识，点击企鹅会触发 rotate 事件：

[![13](http://www.alloyteam.com/wp-content/uploads/2015/07/13.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/13.png)

此时我们需要建立事件监听播放翻转动画，右击企鹅 Logo，选择添加事件动画：

[![15](http://www.alloyteam.com/wp-content/uploads/2015/07/15.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/15.jpg)

填入需要监听的事件名，所以我们填入 “rotate”：

[![12](http://www.alloyteam.com/wp-content/uploads/2015/07/12.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/12.png)

点击确定，此时会看到生成的对应事件的动画时间轴，并看到 “rotate” 的事件标识：

[![17](http://www.alloyteam.com/wp-content/uploads/2015/07/17.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/17.jpg)

然后选择第一个关键帧，透明度设置为 1，最后创建一个关键帧旋转 rotateY 设置为 720，中间创建一个关键帧，透明度设置为 0：

[![17](http://www.alloyteam.com/wp-content/uploads/2015/07/17.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/17.png)

此时点击 “播放全部” 按钮，并且点击企鹅 Logo，会播放对应翻转动画：

[![19](http://www.alloyteam.com/wp-content/uploads/2015/07/19.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/19.jpg)

**Step4：添加新的一页**

此时第一页交互动画已制作完毕，点击页控制的 “+” 按钮，添加新的一页，并设置背景颜色同上一页：

[![21](http://www.alloyteam.com/wp-content/uploads/2015/07/21.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/21.jpg)

另外改变一下翻页动画的类型，设置为 “渐变移动”：

[![22](http://www.alloyteam.com/wp-content/uploads/2015/07/22.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/22.jpg)

点击 “播放全部” 按钮，可以通过鼠标上下滑动看到翻页效果：

[![23](http://www.alloyteam.com/wp-content/uploads/2015/07/23.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/23.jpg)

**Step5：创建多行文本，添加预设动画**

对于单行文本，我们使用 “文本” 按钮添加对应文字，但对于多行文本，我们可以添加图层，然后在图层上编辑添加文字。

点击 “图层” 按钮添加图层：

[![24](http://www.alloyteam.com/wp-content/uploads/2015/07/24.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/24.jpg)

通过手柄把图层尺寸拉到一定大小并居中：

[![14](http://www.alloyteam.com/wp-content/uploads/2015/07/14.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/14.png)

双击图层，进入文字编辑状态，此时可往图层中填充文字：

[![15](http://www.alloyteam.com/wp-content/uploads/2015/07/15.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/15.png)

同样我们要为文字添加动画效果，所以编辑文字完成之后，右击文字区域，添加到时间轴。

此时我们准备从预设动画中选择一个从下向上的动画，应用到文字区域中，选择第一个关键帧，点击插入预设动画：

[![25](http://www.alloyteam.com/wp-content/uploads/2015/07/25.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/25.jpg)

此时会看到弹出的预设动画选择框，从中选择动画 “从下弹入”：

[![26](http://www.alloyteam.com/wp-content/uploads/2015/07/26.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/26.jpg)

右则预览窗口可以预览预设动画的效果，点击确定，此时会自动创建对应预设动画的所有关键帧：

[![27](http://www.alloyteam.com/wp-content/uploads/2015/07/27.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/27.jpg)

点击播放按钮，可以看到文字从下往上弹入的动画效果。

此时我们选择 1.5s 处的帧，再次添加预设动画 “橡皮筋”，点击确定，再次自动生成对应的所有关键帧：

[![28](http://www.alloyteam.com/wp-content/uploads/2015/07/28.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/28.jpg)

点击播放按钮预留动画，在从下弹入后会再播放橡皮筋效果动画，如果希望对预设动画进行微调，可以手动对关键帧进行二次编辑。

**Step6：建立元件，创建文字的组合动画**

最后是 “By AlloyTeam” 这行文字的动画，这个动画有点特殊，文字边闪烁边往右移动。

如果用上面的方式编辑动画的话，可想而知就很麻烦了，闪烁的位置以及对应移动的位置都要手动设置对应关键帧，难以控制的同时也带来了多个难以维护的关键帧。

因此我们使用元件的方式创建该动画。

我们首先把闪烁的文字作为一个元件创建，再为元件整体创建从左到右移动的动画。

点击 “新建元件” 按钮，进入元件模式创建元件：

[![29](http://www.alloyteam.com/wp-content/uploads/2015/07/29.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/29.jpg)

元件名称设置为 “text”，元件尺寸设置为 150\*40：

[![16](http://www.alloyteam.com/wp-content/uploads/2015/07/16.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/16.png)

进入元件模式之后添加文字并设置为 “By Alloyteam”，文字颜色设置为淡黄，同时添加到时间轴。

然后动画时长设置为 1s，选择中间关键帧设置透明度为 0，最后一个关键帧透明度为 1：

[![17](http://www.alloyteam.com/wp-content/uploads/2015/07/171.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/171.png)

点击播放，此时可以看到文字的一次闪烁动画。

然而，我们希望文字在动画期间连续闪烁 3 次，此时我们可以选择该时间轴，勾上 “重复播放” 选项，并且设置 “播放次数” 为 3：

[![18](http://www.alloyteam.com/wp-content/uploads/2015/07/18.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/18.png)

点击播放按钮，此时可以看到动画播放了 3 次。

点击 “保存元件” 把元件保存下来，再点击 "回到场景"：

[![30](http://www.alloyteam.com/wp-content/uploads/2015/07/30.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/30.jpg)

此时我们需要使用刚才创建的元件，点击” 插入元件 “:

[![31](http://www.alloyteam.com/wp-content/uploads/2015/07/31.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/31.jpg)

然后在元件选择栏中选择刚刚创建的元件，右则预览窗口可以预览元件动画效果：

[![19](http://www.alloyteam.com/wp-content/uploads/2015/07/19.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/19.png)

点击确定，此时元件已经被添加到舞台上了：

![32](http://www.alloyteam.com/wp-content/uploads/2015/07/32.jpg)

此时再为元件整体创建从左到右的动画，首先把元件添加到时间轴，动画时长设置为 2s，然后对第一个帧的 X 值设置为 - 180，缓动设置为 ease，最后一个关键帧设置 X 值为 85：

[![33](http://www.alloyteam.com/wp-content/uploads/2015/07/33.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/33.jpg)

点击播放按钮，可以看到文字边闪烁边从左滑动到右边的动画过程。

**Step7：设置每页动画可重复播放**

当前状态下，播放了一页动画之后，再回到该页，动画并不会再次播放，如果我们希望可以多次播放页的动画，可以开启页动画的重复播放设置：

[![22](http://www.alloyteam.com/wp-content/uploads/2015/07/22.png)](http://www.alloyteam.com/wp-content/uploads/2015/07/22.png)

这样每次跳到一页的时候，该页的动画都会再次播放。

**Step8：导出交互页**

此时整个 demo 页面的动画完成了，可以点击播放全部预览整体效果。

效果满意之后，点击 “导出” 按钮，导出该页面的项目结构（zip 压缩包）：

[![34](http://www.alloyteam.com/wp-content/uploads/2015/07/34.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/34.jpg)

生成的压缩包包含了整个交互页的项目结构：

[![35](http://www.alloyteam.com/wp-content/uploads/2015/07/35.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/35.jpg)

解压到目录，mobile 模式下打开 index.html 即可看到创建的交互页效果：

[![36](http://www.alloyteam.com/wp-content/uploads/2015/07/36.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/07/36.jpg)

更多关于 AEditor 的详细教程：

<http://www.alloyteam.com/2015/06/h5-jiao-hu-ye-bian-ji-qi-aeditor-jie-shao/>