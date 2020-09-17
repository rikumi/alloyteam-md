---
title: ReactNative Animated 动画详解
date: 2016-01-21
author: TAT.will
source_link: http://www.alloyteam.com/2016/01/reactnative-animated/
---

<!-- {% raw %} - for jekyll -->

   

====

最近 ReactNative（以下简称 RN）在前端的热度越来越高，不少同学开始在业务中尝试使用 RN，这里着重介绍一下 RN 中动画的使用与实现原理。

* * *

使用篇  

* * *

### 举个简单的栗子

```javascript
var React = require("react-native");
var { Animated, Easing, View, StyleSheet, Text } = React;
var Demo = React.createClass({
    getInitialState() {
        return {
            fadeInOpacity: new Animated.Value(0), // 初始值
        };
    },
    componentDidMount() {
        Animated.timing(this.state.fadeInOpacity, {
            toValue: 1, // 目标值
            duration: 2500, // 动画时间
            easing: Easing.linear, // 缓动函数
        }).start();
    },
    render() {
        return (
            <Animated.View
                style={[
                    styles.demo,
                    {
                        opacity: this.state.fadeInOpacity,
                    },
                ]}
            >
                                
                <Text style={styles.text}>悄悄的，我出现了</Text>
                            
            </Animated.View>
        );
    },
});
var styles = StyleSheet.create({
    demo: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    text: {
        fontSize: 30,
    },
});
```

[![demo1](http://www.alloyteam.com/wp-content/uploads/2016/01/demo1.gif)](http://www.alloyteam.com/wp-content/uploads/2016/01/demo1.gif)

是不是很简单易懂 &lt;(▰˘◡˘▰)> 和 JQuery 的 Animation 用法很类似。

### 步骤拆解

一个 RN 的动画，可以按照以下步骤进行。

1.  使用基本的 Animated 组件，如 Animated.View Animated.Image Animated.Text（**重要！不加 Animated 的后果就是一个看不懂的报错，然后查半天动画参数，最后怀疑人生**）
2.  使用 Animated.Value 设定一个或多个初始化值（透明度，位置等等）。
3.  将初始化值绑定到动画目标的属性上（如 style）
4.  通过 Animated.timing 等函数设定动画参数
5.  调用 start 启动动画。

### 栗子敢再复杂一点吗？

显然，一个简单的渐显是无法满足各位观众老爷们的好奇心的。我们试一试加上多个动画


<!-- {% endraw %} - for jekyll -->