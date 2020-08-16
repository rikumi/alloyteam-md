---
title: 透过 Text 标签看 ReactNative 的设计理念
date: 2015-05-31
author: TAT.bizai
source_link: http://www.alloyteam.com/2015/05/tou-guo-text-biao-qian-kan-reactnative-di-she-ji-li-nian/
---

<!-- {% raw %} - for jekyll -->

现在前端圈子最热的莫过于 ReactNative。以 Web 的开发方式来开发 Native，并且仗这 facebook 这个国际互联网公司做保证，这种革命性的产品都让前端 coder 和客户端 coder 都炸开了。本文打算以 ReactNative 的 Text 标签的角度，这个最基本的标签，来带你跨入入 ReactNative 的世界的第一步。

如果把 React Native 上的 View 标签对应成 web 的 div 标签，那么想把 Text 标签对应为 web 的 Span 标签或者 P 标签真是大错特错。严格来说，你应该把 Text 当初一个 ReactNative 的组件！（是的，本身就是！）Text 标签在 ReactNative 上非常非常的常用，其属性方法，内部细节为开发者所必须掌握的。同时我们能透过 Text 标签，也能理解 ReactNative 上的一些设计理念。

# **一，文本输出必须用 Text 标签包起来**

这点大家应该都比较清楚，如果使用 View 标签输出文本，ReactNative 是会直接报错的，我们必须用 Text 标签包起来。

    // 直接编译不通过，少年
    <View>  Some text </View>
     
    // success
    <View> <Text>Some text </Text></View>

**二，关于 Text 的嵌套**

Text 元素是一种特殊的相对布局。如果 Text 标签嵌套 Text 标签，Text 内层的不再是 flexbox 布局，而是纯文本布局。即是，内层 Text 元素设置长宽间距都是没有效果的。另外，一点注意的是，Text 元素内层也只能是 Tex 元素而已，其他元素会直接编译报错。但是如果 Text 元素的外层嵌套元素是 View 的话，这时候 Text 元素却又是块级元素，是能够使用 flexbox 布局。

看官方的一个 Demo：

```c
<Text style={{marginBottom: 20}}>
     <Text >你的所言所行，全都闪烁着光芒，太过刺目，于是我闭上了眼睛，，，</Text>
     <Text style={{width:300,height:40,containerBackgroundColor:'#454545',color:'#ECD011'}}>但是内心还是无法停止对你的憧憬</Text>
</Text>
 
<View style={{marginBottom: 20}}>
    <Text>你的所言所行，全都闪烁着光芒，太过刺目，于是我闭上了眼睛，，，</Text>
    <Text style={{width: 300,height:40,containerBackgroundColor:'#454545',color:'#ECD011'}}>但是内心还是无法停止对你的憧憬</Text>
</View>
```

[![8706026](http://www.alloyteam.com/wp-content/uploads/2015/05/8706026.png)](http://www.alloyteam.com/wp-content/uploads/2015/05/8706026.png)

可以发现，Text 内嵌 Text 可以理解为一个大 Text 元素，内部的 Text 元素都只是用于设置独立的文本样式。其设置了 containerBackgroundColor 由于只能作用于块级元素，而不生效。

使用 View 内嵌 Text，内嵌的 Text 元素是个正常的块级元素（两个 Text 元素自动换行），并且可以设置长宽。containerBackgroundColor 也正常。

再来举个看个例子

    <View style={{padding: 0, backgroundColor: '#454545', flexDirection: 'row'}}>
       <Text style={[ {backgroundColor: 'red', padding: 30, flex: 1}]}>
         	设置padding和flex
       </Text>
       <Text style={[ {backgroundColor: 'red', margin: 30, flex: 1}]}>
         	设置margin和flex
       </Text>
    </View>

[![1277332](http://www.alloyteam.com/wp-content/uploads/2015/05/1277332.png)](http://www.alloyteam.com/wp-content/uploads/2015/05/1277332.png)

可以是看出，View 元素的内嵌 Text 设置 padding，margin 甚至 flex 都是没有问题的。

**三，Text 的样式继承**

废话不多说，我们直接看个例子。

    <View style={{color: 'red'}}><Text>你好，我的父层是View</Text></View>
    <Text style={{color: 'red'}}><Text>你好，我的父层是Text</Text></Text>

[![12201882](http://www.alloyteam.com/wp-content/uploads/2015/05/12201882.png)](http://www.alloyteam.com/wp-content/uploads/2015/05/12201882.png)

我们可以发现，父层是 Text 标签的时候，样式能够进行继承的。但当父层时 View 的时候，却不行。在 Web 上，如果我们在 body 标签上设置 font-family，font-size，或者 color 等等，我们在任何一个没有覆盖这些样式的的 Dom 上面，是能够继承这些 CSS 属性的。但是在 ReactNative 上是却没有这样的样式继承机制的！要想实现 Web 上常用的全局定义字体样式的方式，我们在最外层的 View 上面赋值是没有效果的。

**或者换句话说：ReactNative 中没有样式继承！只有嵌套的 Text 才能有 font 相关属性的继承能力。**

**四，设置全局文本样式**

我们理解了 Text 的样式继承，及其元素嵌套对 Text 元素的影响。但是很快就发现了我们实际项目开发中非常常见的问题：如何设置全局文本样式？

我就不卖关子，解决方案是：**Component + Text 标签内联**

根据 React 的 Component 设计，让每一公共的文本样式定义一个 Component！是的，你没有听错，为一个公共的文本样式或者一个 Class 定义一个 Component。React 框架的设计是希望一个 App 就是一个大的 Component，各个功能模块又是由 Component 组成，而每个功能模块 Component 又能划分各个小的 Component 的，而在 ReactNative 的世界里，你可能需要为一段文本样式定义一个这样的 Component。可见其 Component 划分的粒度之细。

[![94EC6BE1-DF6C-4D6E-AEA3-28D3BA90BC67](http://www.alloyteam.com/wp-content/uploads/2015/05/94EC6BE1-DF6C-4D6E-AEA3-28D3BA90BC67.jpg)](http://www.alloyteam.com/wp-content/uploads/2015/05/94EC6BE1-DF6C-4D6E-AEA3-28D3BA90BC67.jpg)

**五，为什么这样设计？ For Component**

我们先来另外一个问题： 为什么要设置 Text 标签（组件）

当浏览器尝试渲染一个 text node 节点，会遍历 dom 树的上层直到遇到有 font-size 的属性，然后渲染。而这个过程中，任何的 dom 节点都是可以有 font-size 属性，而 Web 的这种设计是方便易用性，img 标签也是可以的，即使语义是不正确的。

而在 ReactNative 中，将严格控制这点。你必须包裹文本使用 Text 标签，不能使用 View 及其它标签组件。也是正是这一规定，我们不能在全局设置文本样式。但是我们推荐你封装一个 Component 来定义你的全局样式！是的，你可以设置一个 MyAppText 来设置全局文本样式，同时再设置一个 MyTitleText，MyDescText 等来设置不同组件，实现不同的样式继承问题。在 ReactNative 上，全民组件，即使是一个 Class 也可以封装成一个 Component，这也是 react 的设计思想。

这种严谨的约束的文本风格，将会产生更好的应用。

一方面，React 组件设计时考虑到更加严谨的独立隔离环境，这一你的这个组件就能够在任何应用程序上应用而不带有任何依赖，包括样式。只要相信组件传递的属性是相同的，组件渲染和行为都是一样的。如果我们的文本风格按照 Web 上的继承关系，组件间的样式将会相互影响，而违背组件的独立性。而**这样严谨的独立性，对于组件的复用和可移植性来讲是必不可少的**

另一方面，这一的设计对代码实现是简单的。我们不需要遍历整个 Dom 树来决定要显示的每一个文本节点。文本样式继承只是在组件内部，不影响其他组件和系统本身。这样在 ReactNative 的实现机制上，**简单而又高效**，一举两得。


<!-- {% endraw %} - for jekyll -->