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
var React = require('react-native');
var {
    Animated,
    Easing,
    View,
    StyleSheet,
    Text
} = React;
 
var Demo = React.createClass({
    getInitialState() {
        return {
            fadeInOpacity: new Animated.Value(0) // 初始值
        };
    },
    componentDidMount() {
        Animated.timing(this.state.fadeInOpacity, {
            toValue: 1, // 目标值
            duration: 2500, // 动画时间
            easing: Easing.linear // 缓动函数
        }).start();
    },
    render() {
        return (
            <Animated.View style={[styles.demo, {
                    opacity: this.state.fadeInOpacity
                }]}>
                <Text style={styles.text}>悄悄的，我出现了</Text>
            </Animated.View>
        );
```


<!-- {% endraw %} - for jekyll -->