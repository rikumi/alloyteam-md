---
title: H5 交互页编辑器 AEditor 介绍
date: 2015-06-30
author: TAT.Cson
source_link: http://www.alloyteam.com/2015/06/h5-jiao-hu-ye-bian-ji-qi-aeditor-jie-shao/
---

<!-- {% raw %} - for jekyll -->

### **AEditor 是什么？**

AEditor 是一个方便广大 web 开发者进行 H5 动画交互页开发的工具，开发者可以在 AEditor 上对交互动画以进行编辑，最终导出页面项目。与面向大众的 H5 交互页编辑平台（如玉兔，易企秀等）不同的是，AEditor 面向开发者，在提供预设动画模式的同时，支持对动画进行帧的编辑，事件通知模型，以及可二次开发的特性，从而让开发者能更灵活地实现各种自定义的动画交互需求。

**访问地址：<http://aeditor.alloyteam.com/>**

**浏览器支持：**只支持 chrome 浏览器

**快速上手教程：<http://www.alloyteam.com/2015/07/aeditor-kuai-su-shang-shou-jiao-cheng/>**

**概览**

AEditor 主要由五部分组成，分别是：基础操作栏、时间轴管理栏、元素属性编辑栏、精灵管理栏以及预览区域。

[![1](http://www.alloyteam.com/wp-content/uploads/2015/06/111.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/111.png)

### **基础操作栏**

**场景分类：**

**新建：**打开一个全新的作品。

**保存：**把作品内容保存下来，需要定义作品名称（双击可编辑），默认为 ‘暂无标题’。

[![2](http://www.alloyteam.com/wp-content/uploads/2015/06/2.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/2.png)

**载入：**点击载入会打开作品列表，我们可以从已保存的作品列表中选择载入指定作品。

[![3](http://www.alloyteam.com/wp-content/uploads/2015/06/3.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/3.png)

**导出：**把已完成的作品进行导出，下载一个压缩包，里面包含了页面的项目结构，我们可以直接打开 index.html 看到生成的页面，并且可以在此基础上进行二次开发（例如监听事件进行数据上报等）。

[![4](http://www.alloyteam.com/wp-content/uploads/2015/06/4.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/4.png)

**基本对象分类：**

基本对象包括图片，文字，图层三种。

**图片：**

用户需要上传需要用到的图片，图片上传之后在编辑器中可进行编辑，并且图片上传后会对体积进行压缩，最终导出之后会被放置到 img 目录下被生成的页面引用。

**文字：**

可对文字内容以及样式进行编辑，富文本编辑器提供一定程度的样式修改，如果需要进行完全定制化编辑，可在元素属性中对文本内容增加自定义 css 属性（详见 ‘元素属性编辑部分’）。

[![5](http://www.alloyteam.com/wp-content/uploads/2015/06/5.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/5.png)

**图层：**

图层相当于一个没有内容的容器，我们可以对一个空图层进行动画操作，并且在二次开发的时候再为容器填充完全自定义的 html 内容（详见 ‘二次开发’ 部分）。

**元件分类：**

AEditor 的元件与 flash 的元件比较类似，元件的作用在于把一组动画作为一个整体，然后再把在该整体的基础上进行其他动画的叠加。

例如，我们需要一个人从左边走到右边的动画，那么我们就可以把人走路四肢的运动封装成一个元件，再对其叠加从左到右移动的动画，元件的作用在于减少我们对每一个动画细节进行动画叠加的繁琐工作。

**新建元件：**新建一个元件，点击之后需要输入新元件的名称和尺寸，点击确定之后会进入**元件模式**，元件模式下我们可以编辑元件的大小，名称，并且为元件添加动画元素，最终保存为一个新的元件。

[![6](http://www.alloyteam.com/wp-content/uploads/2015/06/6.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/6.png)

**元件模式：**

[![7](http://www.alloyteam.com/wp-content/uploads/2015/06/7.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/7.png)

元件模式下所有对动画的编辑，最终都会保存为一个新的元件。

**新建逐帧元件：**逐帧元件让我们可以生成基于 css3 的逐帧动画，生成的帧动画同样可以进行二次编辑。所谓逐帧动画就是我们是根据一张连续动画动作的图片，切换图片的可视部分从而生成的动画。

示例图片：

[![8](http://www.alloyteam.com/wp-content/uploads/2015/06/8.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/8.png)

[![9](http://www.alloyteam.com/wp-content/uploads/2015/06/9.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/9.png)

点击新建逐帧元件，会打开编辑窗口，需要填写元件名称，帧数，动画方向，每帧时间间隔以及是否重复播放。点击预览可以在预览区域看到效果：

[![10](http://www.alloyteam.com/wp-content/uploads/2015/06/10.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/10.png)

点击确定，进入元件模式，并自动生成逐帧动画关键帧：

[![11](http://www.alloyteam.com/wp-content/uploads/2015/06/11.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/11.png)

**插入元件：**点击插入元件，打开元件列表，我们可以从元件列表中选择保存过的元件，添加到作品中，在列表右侧，可以预览元件的效果。

[![12](http://www.alloyteam.com/wp-content/uploads/2015/06/12.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/12.png)

**预设动画分类：**

预设动画是 AEditor 默认提供的一些预设置关键帧的动画效果，我们可以从中挑选动画从而生成关键帧，然后再根据需要对关键帧进行微调。

**插入预设动画：**打开预设动画选择界面，可以从数十种预设动画中挑选想要添加的动画效果应用到精灵上，列表右边是动画预览区域。

[![13](http://www.alloyteam.com/wp-content/uploads/2015/06/13.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/13.png)

点击确定之后，自动生成预设动画对应的关键帧：

[![14](http://www.alloyteam.com/wp-content/uploads/2015/06/14.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/14.png)

**分页分类：**

提供对每一页的管理，包括翻页的方向，翻页动画的效果，每一页的增加 / 删除，顺序控制，页的属性编辑等。

**翻页方向：**

翻页方向允许我们选择是上下方向还是左右方向的翻页：

[![15](http://www.alloyteam.com/wp-content/uploads/2015/06/15.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/15.png)[![16](http://www.alloyteam.com/wp-content/uploads/2015/06/16.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/16.png)

**翻页动画：**

AEditor 提供四种翻页动画模式：移动，渐变移动，缩放，旋转。

**增加页：**

增加页按钮可以新增一个新的页面。

**页属性配置：**

页属性配置方便我们控制每一页的特性：

[![17](http://www.alloyteam.com/wp-content/uploads/2015/06/17.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/17.png)

**手形按钮：**配置该页是否可以返回上一页。

**循环按钮：**配置改页动画是否可重复播放（例如从上一页返回该页，是否重新播放该页动画）。

**箭头按钮：**配置该页动画播放完毕后，是否自动跳到下一页。

### **时间轴管理栏**

时间轴管理栏由播放控制，时间轴以及事件时间轴三部分组成。

[![18](http://www.alloyteam.com/wp-content/uploads/2015/06/18.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/18.png)

**播放控制：**

控制所有精灵的动画播放。

[![19](http://www.alloyteam.com/wp-content/uploads/2015/06/19.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/19.png)

播放整个作品的动画，包括翻页交互等，相当于导出的页面的预览效果。

[![20](http://www.alloyteam.com/wp-content/uploads/2015/06/20.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/20.png)

播放所选时间轴内的动画，可能是普通时间轴或事件时间轴。

[![21](http://www.alloyteam.com/wp-content/uploads/2015/06/21.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/21.png)

结束当前动画的播放。

[![22](http://www.alloyteam.com/wp-content/uploads/2015/06/22.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/22.png)

编辑当前所选时间轴的动画时长。

[![23](http://www.alloyteam.com/wp-content/uploads/2015/06/23.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/23.png)

如果所选精灵为元件，配置是否在播放该时间轴动画的同时播放元件自身的动画。

[![24](http://www.alloyteam.com/wp-content/uploads/2015/06/24.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/24.png)

是否显示精灵的名字标识（仅仅用于调试）。

[![25](http://www.alloyteam.com/wp-content/uploads/2015/06/25.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/25.png)

**时间轴：**

[![26](http://www.alloyteam.com/wp-content/uploads/2015/06/26.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/26.png)

**精灵名：**时间轴对应的精灵的名字。

**删除按钮：**删除该时间轴

**关键帧：**时间轴上的关键帧，拖拽可进行移动，右击出现关键帧编辑菜单。

**关键帧编辑菜单：**包含各种对关键帧的操作：

[![27](http://www.alloyteam.com/wp-content/uploads/2015/06/27.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/27.png)

**复制：**复制一个关键帧。

**删除：**删除一个关键帧。

**插入预设动画：**在当前帧的位置插入一个预设动画，点击打开预设动画选择框。

**删除时间轴：**删除该时间轴。

**设置动画结束行为：**设置该时间轴动画播放完毕的行为，点击打开行为设置窗口：

[![28](http://www.alloyteam.com/wp-content/uploads/2015/06/28.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/28.png)

**触发自定义事件：**添加该动画播放完毕要触发的事件名，其他精灵可以监听该事件并播放对应的动画。添加完成后，会看到时间轴上出现事件名标识：

[![29](http://www.alloyteam.com/wp-content/uploads/2015/06/29.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/29.png)

**跳到下一页：**配置该动画结束之后自动跳到第一页。配置完成后，会看到时间轴上出现跳到下一页的标识：

[![30](http://www.alloyteam.com/wp-content/uploads/2015/06/30.png)](http://www.alloyteam.com/wp-content/uploads/2015/06/30.png)

**事件时间轴：**


<!-- {% endraw %} - for jekyll -->