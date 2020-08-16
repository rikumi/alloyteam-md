---
title: android:clipToPadding 和 android:clipChildren
date: 2014-10-14
author: TAT.zhipingfeng
source_link: http://www.alloyteam.com/2014/10/androidcliptopadding-he-androidclipchildren/
---

假设我们要做一个效果，界面最顶部是一个 ActionBar 并且是半透明的，ActionBar 下面是一个 ListView，在初始状态下，ListView 是 top 是在 ActionBar 的 bottom 位置的，但当 ListView 滚动的时候可以透过 ActionBar 看到下面的 ListView 的内容。如下面两张图所示：

正常态：

[![normal](http://www.alloyteam.com/wp-content/uploads/2014/10/normal.png)](http://www.alloyteam.com/wp-content/uploads/2014/10/normal.png)

滚动态:

[![scroll](http://www.alloyteam.com/wp-content/uploads/2014/10/scroll.png)](http://www.alloyteam.com/wp-content/uploads/2014/10/scroll.png)

乍一看，不是很简单吗，只要设置一下 marginTop 或者 paddingTop 就可以了，但问题是只用这两个其中一个属性的话，ListView 滑动的时候就不能滚到 paddingTop 或者 marginTop 那部分区域，有人说可以用 HeaderView 来解决，这是其中一个办法，但仅仅了为这个占空使用 HeadView 有点浪费而且会影响 onItemClick 的 position. 于是这里介绍可以到这个效果的两个属性，就是 android:clipToPadding 和 android:clipChildren, 这两个属性不是太多人用到，这里说明一下

clipToPadding 就是说控件的绘制区域是否在 padding 里面的，true 的情况下如果你设置了 padding 那么绘制的区域就往里缩，clipChildren 是指子控件是否超过 padding 区域，这两个属性默认是 true 的，所以在设置了 padding 情况下，默认滚动是在 padding 内部的，要达到上面的效果主要把这两个属性设置了 false 那么这样子控件就能画到 padding 的区域了。

```html
    <ListView
        android:layout_gravity="center_vertical"
        android:id="@+id/list"
        android:clipChildren="false"
        android:clipToPadding="false"
        android:paddingTop="50dip"
        android:layout_width="match_parent" 
        android:layout_height="match_parent">
```

Actionbar 半透明就不详细说了，只要设置 actionbarOverlay 为 true 并为 ActionBar 设置一个半透明的 background 即可.