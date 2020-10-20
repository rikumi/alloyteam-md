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
            &lt;Animated.View
                style={[
                    styles.demo,
                    {
                        opacity: this.state.fadeInOpacity,
                    },
                ]}
            >
                                
                &lt;Text style={styles.text}>悄悄的，我出现了&lt;/Text>
                            
            &lt;/Animated.View>
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

是不是很简单易懂&lt;(▰˘◡˘▰)> 和 JQuery 的 Animation 用法很类似。

### 步骤拆解

一个 RN 的动画，可以按照以下步骤进行。

1.  使用基本的 Animated 组件，如 Animated.View Animated.Image Animated.Text（**重要！不加 Animated 的后果就是一个看不懂的报错，然后查半天动画参数，最后怀疑人生**）
2.  使用 Animated.Value 设定一个或多个初始化值（透明度，位置等等）。
3.  将初始化值绑定到动画目标的属性上（如 style）
4.  通过 Animated.timing 等函数设定动画参数
5.  调用 start 启动动画。

### 栗子敢再复杂一点吗？

显然，一个简单的渐显是无法满足各位观众老爷们的好奇心的。我们试一试加上多个动画

```javascript
getInitialState() {
    return (
        fadeInOpacity: new Animated.Value(0),
            rotation: new Animated.Value(0),
            fontSize: new Animated.Value(0)
    );
},
componentDidMount() {
    var timing = Animated.timing;
    Animated.parallel(['fadeInOpacity', 'rotation', 'fontSize'].map(property => {
                return timing(this.state[property], {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear
            });
        })).start();
}，
render() {
    return (&lt;Animated.View style={[styles.demo, {
            opacity: this.state.fadeInOpacity,
                transform: [{
                    rotateZ: this.state.rotation.interpolate({
                        inputRange: [0,1],
                        outputRange: ['0deg', '360deg']
                    })
                }]
            }]}>&lt;Animated.Text style={{
                fontSize: this.state.fontSize.interpolate({
                    inputRange: [0,1],
                    outputRange: [12,26]
                })
            }}>我骑着七彩祥云出现了😈💨&lt;/Animated.Text>
            &lt;/Animated.View>
    );
}
```

注意到我们给文字区域加上了字体增大的动画效果，相应地，也要修改 Text 为 Animated.Text

[![demo2](http://www.alloyteam.com/wp-content/uploads/2016/01/demo2.gif)](http://www.alloyteam.com/wp-content/uploads/2016/01/demo2.gif)

#### 强大的 interpolate

上面的栗子使用了 interpolate 函数，也就是插值函数。这个函数很强大，实现了数值大小、单位的映射转换，比如

```javascript
{   
    inputRange: [0,1],
    outPutRange: ['0deg','180deg']
}
```

当 setValue (0.5) 时，会自动映射成 90deg。 inputRange 并不局限于 \[0,1] 区间，可以画出多段。 interpolate 一般用于多个动画共用一个 Animated.Value，只需要在每个属性里面映射好对应的值，就可以用一个变量控制多个动画。 事实上，上例中的 fadeInOpacityfontSizerotation 用一个变量来声明就可以了。（那你写那么多变量逗我吗 (╯‵□′)╯︵┻━┻）（因为我要强行使用 parallel ┬─┬ ノ ( ' - ' ノ)）

#### 流程控制

在刚才的栗子中，我们使用了 Parallel 来实现多个动画的并行渲染，其它用于流程控制的 API 还有：

-   sequence 接受一系列动画数组为参数，并依次执行
-   stagger 接受一系列动画数组和一个延迟时间，按照序列，每隔一个延迟时间后执行下一个动画（其实就是插入了 delay 的 parrllel）
-   delay 生成一个延迟时间 (基于 timing 的 delay 参数生成）

例 3

```javascript
getInitialState() {
    return (
        anim: [1,2,3].map(() => new Animated.Value(0)) // 初始化3个值
    );
},
 
componentDidMount() {
    var timing = Animated.timing;
    Animated.sequence([
        Animated.stagger(200, this.state.anim.map(left => {
            return timing(left, {
                toValue: 1,
              });
            }).concat(
                this.state.anim.map(left => {
                    return timing(left, {
                        toValue: 0,
                    });
                })
            )), // 三个view滚到右边再还原，每个动作间隔200ms
            Animated.delay(400), // 延迟400ms，配合sequence使用
            timing(this.state.anim[0], {
                toValue: 1 
            }),
            timing(this.state.anim[1], {
                toValue: -1
            }),
            timing(this.state.anim[2], {
                toValue: 0.5
            }),
            Animated.delay(400),
            Animated.parallel(this.state.anim.map((anim) => timing(anim, {
                toValue: 0
            }))) // 同时回到原位置
        ]
    ).start();
},
render() {
    var views = this.state.anim.map(function(value, i) {
        return (
            &lt;Animated.View
                key={i}
                style={[styles.demo, styles['demo' + i], {
                    left: value.interpolate({
                        inputRange: [0,1],
                        outputRange: [0,200]
                    })
                }]}>
                &lt;Text style={styles.text}>我是第{i + 1}个View&lt;/Text>
 
            &lt;/Animated.View>
        );
    });
    return &lt;View style={styles.container}>
               &lt;Text>sequence/delay/stagger/parallel演示&lt;/Text>
               {views}
           &lt;/View>;
}
```

[![demo3](http://www.alloyteam.com/wp-content/uploads/2016/01/demo3.gif)](http://www.alloyteam.com/wp-content/uploads/2016/01/demo3.gif)

#### Spring/Decay/Timing

前面的几个动画都是基于时间实现的，事实上，在日常的手势操作中，基于时间的动画往往难以满足复杂的交互动画。对此，RN 还提供了另外两种动画模式。

-   Spring 弹簧效果

    -   friction 摩擦系数，默认 40
    -   tension 张力系数，默认 7
    -   bounciness
    -   speed
-   Decay 衰变效果

    -   velocity 初速率
    -   deceleration 衰减系数 默认 0.997

Spring 支持 friction 与 tension 或者 bounciness 与 speed 两种组合模式，这两种模式不能并存。 其中 friction 与 tension 模型来源于 [origami](https://facebook.github.io/origami/), 一款 F 家自制的动画原型设计工具，而 bounciness 与 speed 则是传统的弹簧模型参数。

### Track && Event

RN 动画支持跟踪功能，这也是日常交互中很常见的需求，比如跟踪用户的手势变化，跟踪另一个动画。而跟踪的用法也很简单，只需要指定 toValue 到另一个 Animated.Value 就可以了。 交互动画需要跟踪用户的手势操作，Animated 也很贴心地提供了事件接口的封装，示例：

```javascript
// Animated.event 封装手势事件等值映射到对应的Animated.Value
onPanResponderMove: Animated.event(
    [null, { dx: this.state.x, dy: this.state.y }] // map gesture to leader
);
```

在官方的 demo 上改了一下，加了一张费玉污的图，效果图如下 代码太长，就不贴出来了，可以参考[官方 Github 代码](https://github.com/facebook/react-native/blob/master/Examples/UIExplorer/AnimatedGratuitousApp/AnExChained.js#L39)

[![demo4](http://www.alloyteam.com/wp-content/uploads/2016/01/demo4.gif)](http://www.alloyteam.com/wp-content/uploads/2016/01/demo4.gif)

### 动画循环

Animated 的 start 方法是支持回调函数的，在动画或某个流程结束的时候执行，这样子就可以很简单地实现循环动画了。

```javascript
startAnimation() {
    this.state.rotateValue.setValue(0);
    Animated.timing(this.state.rotateValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear
    }).start(() => this.startAnimation());
}
```

[![demo5](http://www.alloyteam.com/wp-content/uploads/2016/01/demo5.gif)](http://www.alloyteam.com/wp-content/uploads/2016/01/demo5.gif)

是不是很魔性？\[doge]

原理篇  

* * *

首先感谢能看到这里的小伙伴们：)

在上面的文章中，我们已经基本掌握了 RN Animated 的各种常用 API，接下来我们来了解一下这些 API 是如何设计出来的。

声明： 以下内容参考自 Animated 原作者的[分享视频](https://www.youtube.com/watch?v=xtqUJVqpKNo)

首先，从 React 的生命周期来编程的话，一个动画大概是这样子写：

```css
getInitialState() {
    return {left: 0};
}
 
render(){
    return (
        &lt;div style={{left: this.state.left}}>
            &lt;Child />
        &lt;/div>
    );
}
 
onChange(value) {
    this.setState({left: value});
}
```

只需要通过 requestAnimationFrame 调用 onChange，输入对应的 value，动画就简单粗暴地跑起来了｡◕‿◕，全剧终。

然而事实总是没那么简单，问题在哪？

我们看到，上述动画基本是以毫秒级的频率在调用 setState，而 React 的每次 setState 都会重新调用 render 方法，并切遍历子元素进行渲染，即使有 Dom Diff 也可能扛不住这么大的计算量和 UI 渲染。

[![demo6](http://www.alloyteam.com/wp-content/uploads/2016/01/demo6.gif)](http://www.alloyteam.com/wp-content/uploads/2016/01/demo6.gif)

那么该如何优化呢？

-   关键词：

    -   ShouldComponentUpdate
    -   &lt;StaticContainer>（静态容器）
    -   Element Caching（元素缓存）
    -   Raw DOM Mutation（原生 DOM 操作）
    -   ↑↑↓↓←→←→BA（秘籍）

### ShouldComponentUpdate

学过 React 的都知道，ShouldComponentUpdate 是性能优化利器，只需要在子组件的 shouldComponentUpdate 返回 false，分分钟渲染性能爆表。

[![demo7](http://www.alloyteam.com/wp-content/uploads/2016/01/demo7-300x277.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/demo7.png)

然而并非所有的子元素都是一成不变的，粗暴地返回 false 的话子元素就变成一滩死水了。而且组件间应该是独立的，子组件很可能是其他人写的，父元素不能依赖于子元素的实现。

### &lt;StaticContainer>（静态容器）

这时候可以考虑封装一个容器，管理 ShouldCompontUpdate，如图示：

[![demo8](http://www.alloyteam.com/wp-content/uploads/2016/01/demo8-300x163.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/demo8.png)

小明和老王再也不用关心父元素的动画实现啦。

一个简单的\\&lt;StaticContainer\\> 实现如下：

```javascript
class StaticContainer extends React.Component {
    render(){
        return this.props.children; 
    }
    shouldComponentUpdate(nextProps){
        return nextProps.shouldUpdate; // 父元素控制是否更新
    }
}
 
// 父元素嵌入StaticContainer
render() {
    return (
        &lt;div style={{left: this.state.left}}>
            &lt;StaticContainer
            shouldUpdate={!this.state.isAnimating}>
                &lt;ExpensiveChild />
            &lt;/StaticContainer>
        &lt;/div>
    );
}
```

### Element Caching 缓存元素

还有另一种思路优化子元素的渲染，那就是缓存子元素的渲染结果到局地变量。

```c
render(){
    this._child = this._child || &lt;ExpensiveChild />;
    return (
        &lt;div style={{left:this.state.left}}>
            {this._child}
        &lt;/div>
    );
}
```

缓存之后，每次 setState 时，React 通过 DOM Diff 就不再渲染子元素了。

上面的方法都有弊端，就是_条件竞争_。当动画在进行的时候，子元素恰好获得了新的 state，而这时候动画无视了这个更新，最后就会导致状态不一致，或者动画结束的时候子元素发生了闪动，这些都是影响用户操作的问题。

### Raw DOM Mutation 原生 DOM 操作

刚刚都是在 React 的生命周期里实现动画，事实上，我们只想要变更这个元素的 left 值，并不希望各种重新渲染、DOM DIFF 等等发生。

“React，我知道自己要干啥，你一边凉快去 “

如果我们跳出这个生命周期，直接找到元素进行变更，是不是更简单呢？

[![demo9](http://www.alloyteam.com/wp-content/uploads/2016/01/demo9-300x102.png)](http://www.alloyteam.com/wp-content/uploads/2016/01/demo9.png)

简单易懂，性能彪悍，有木有？！

然而弊端也很明显，比如这个组件 unmount 之后，动画就报错了。

_Uncaught Exception: Cannot call ‘style’ of null_

而且这种方法照样避不开_条件竞争_—— 动画值改变的时候，有可能发生 setState 之后，left 又回到初始值之类的情况。

再者，我们使用 React，就是因为不想去关心 dom 元素的操作，而是交给 React 管理，直接使用 Dom 操作显然违背了初衷。

### ↑↑↓↓←→←→BA（秘籍）

唠叨了这么多，这也不行，那也不行，什么才是真理？

我们既想要原生 DOM 操作的高性能，又想要 React 完善的生命周期管理，如何把两者优势结合到一起呢？答案就是 _Data Binding (数据绑定）_

```css
render(){
    return(
        &lt;Animated.div style={{left: this.state.left}}>
             &lt;ExpensiveChild />
        &lt;/Animated.div>
    );
}
 
getInitialState(){
    return {left: new Animated.Value(0)}; // 实现了数据绑定的类
}
 
onUpdate(value){
    this.state.left.setValue(value); // 不是setState
}
```

首先，需要实现一个具有数据绑定功能的类 Animated.Value，提供 setValueonChange 等接口。 其次，由于原生的组件并不能识别 Value，需要将动画元素用 Animated 包裹起来，在内部处理数据变更与 DOM 操作。

一个简单的动画组件实现如下：

```javascript
Animated.div = class extends React.Component{
    componentWillUnmount() {
        nextProps.style.left.removeAllListeners();
    },
    // componentWillMount需要完成与componentWillReceiveProps同样的操作，此处略
    componentWillReceiveProps(nextProps) {
        nextProps.style.left.removeAllListeners();
        nextProps.style.left.onChange(value => {
            React.findDOMNode(this).style.left = value + 'px';
        });
        
        // 将动画值解析为普通数值传给原生div
        this._props = React.addons.update(
            nextProps,
            {style:{left:{$set: nextProps.style.left.getValue()}}}
        );
    },
    render() {
        return &lt;div ...{this._props} />;
    }
}
```

代码很简短，做的事情有：

1.  遍历传入的 props，查找是否有 Animated.Value 的实例，并绑定相应的 DOM 操作。
2.  每次 props 变更或者组件 unmount 的时候，停止监听数据绑定事件，避免了条件竞争和内存泄露问题。
3.  将初始传入的 Animated.Value 值逐个转化为普通数值，再交给原生的 React 组件进行渲染。

综上，通过封装一个 Animated 的元素，内部通过数据绑定和 DOM 操作变更元素，结合 React 的生命周期完善内存管理，解决条件竞争问题，对外表现则与原生组件相同，实现了高效流畅的动画效果。

读到这里，应该知道为什么 ImageText 等做动画一定要使用 Animated 加持过的元素了吧？

-   参考资料

    -   [React Addons Update](https://facebook.github.io/react/docs/update.html)
    -   [React Component Lifecycle](https://facebook.github.io/react/docs/component-specs.html)
    -   [Christopher Chedeau - Animated](https://www.youtube.com/watch?v=xtqUJVqpKNo)

[![1846.743](http://cdn.alloyteam.com/wp-content/uploads/2016/03/1846.743.jpg)](http://www.ituring.com.cn/book/1846)

好书推荐 [《](http://www.ituring.com.cn/book/1846)[React Native 开发指南》](http://www.ituring.com.cn/book/1846)


<!-- {% endraw %} - for jekyll -->