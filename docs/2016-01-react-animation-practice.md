---
title: React 动画实践
date: 2016-01-21
author: TAT.李强
source_link: http://www.alloyteam.com/2016/01/react-animation-practice/
---

<!-- {% raw %} - for jekyll -->

**一、 动画重要性**  

===============

        世界上最难的学问就是研究人。在你的动画不会过于耗费资源，以至拖慢用户的设备的前提下，动画可以显著改善用户界面体验。

        可以简单的把页面动画分为以下几个类型：

        1、页面元素动画：比如轮播图等，由用户操作催化；

        2、loading 动画：减少用户视觉等待时间；

        3、装饰动画：尽量避免，会分散用户注意力，值得也不值得；

        4、广告动画：增加广告的转化率；

        5、情节动画：多用于 SPA；

        以 loading 动画为例说明动画的重要性：为了提升用户体验、增加用户粘性，大家从开发的角度看首先想到的会是从前到后的性能优化，从而减少用户打开页面时的等待时间，你或许考虑到了要增加带宽、减少页面的 http 请求、使用数据缓存、优化数据库、使用负载均衡等，但是由于业务限制和用户复杂的体验环境，总会遇到一些瓶颈。这时候，我们需要做的就是如何减少用户的视觉等待时间，哪怕是给一朵转动的菊花，但千万不要不理她，让人盲目的等待就是你业务流失的方式。不客气的说，有时候一朵性感菊花的作用并不亚于你去优化数据库。

二、 动画实现原则  

============

        在实现动画时，我个人一直遵循以下几个原则：

       1、性能，性能，还是性能：这方面的建议就是在有选择时，一定要使用基于 CSS 的动画，将 JS 作为备选，因为考虑到硬件加速和性能之后，CSS 几乎总是优于原生 JS 实现的动画；

       2、微小低调的动画往往表现更好；

       3、大而绚丽的动画需要带有目的性：不能只为了 “好看”；

       4、动画持续时间要短；

       5、让动画具有弹性：或者说缓动效果；

       6、动画不要突然停止；

        大家可以想一下看看是不是这么回事。

三、 React 动画  

==============

（一）实现方式  

==========

      书归正传，React 实现动画有两种方式：

      1、CSS 渐变组；

      2、间隔动画；

      CSS 渐变组： 简化了将 CSS 动画应用于渐变的过程，在合适的渲染和重绘时间点有策略的添加和移除元素的 class。

      间隔动画： 以牺牲性能为代价，提供更多的可扩展性和可控性。需要更多次的渲染，但同时也允许为 css 之外的内容（比如滚动条位置以及 canvas 绘图）添加动画。

（二）CSS 渐变组  

=============

      ReactCSStransitionGroup 是在插件类 ReactTransitionGroup 这个底层 API 基础上进一步封装的高级 API，来简单的实现基本的 CSS 动画和过渡。

### 1、快速开始

      以一个简单的图片轮播图为例：

```javascript
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Carousel = React.createClass({
    propTypes: {
        transitionName: React.PropTypes.string.isRequired,
        imageSrc: React.PropTypes.string.isRequired,
    },
    render: function () {
        return (
            <div className="carousel">
                                    
                <ReactCSSTransitionGroup
                    transitionName={this.props.transitionName}
                >
                                            
                    <img src={this.props.imageSrc} key={this.props.imageSrc} />
                                        
                </ReactCSSTransitionGroup>
                                
            </div>
        );
    },
});
```

      剩下的就是在父组件中为其传入合适的 transitionName 以及 imageSrc 即可。效果如下：

![](http://www.alloyteam.com/wp-content/uploads/2016/01/31.gif)

        聪明的你一定发现了：在这个组件当中，当一个新的列表项被添加到 ReactCSSTransitionGroup，它将会被添加 transitionName-enter 对应的 css 类，然后在下一时刻被添加 transitionName-enter-active 对应的 CSS 类；当一个列表项要从 ReactCSSTransitionGroup 中移除时，他也将会被添加 transitionName-leave 对应的 css 类，然后在下一时刻被添加 transitionName-leave-active 对应的 CSS 类，这里要注意的是，当你尝试移除一项的时候，ReactCSSTransitionGroup 仍会保持该项在 DOM 里，直至动画结束；

        示例中演示的两个切换效果只需要修改 transitionName 属性对应的 CSS 动画类即可：

        透明度切换效果：

```css
.carousel1-enter {
    opacity: 0;
}
.carousel1-enter-active {
    opacity: 1;
    transition: opacity 300ms ease-in;
}
.carousel1-leave {
    opacity: 1;
}
.carousel1-leave-active {
    opacity: 0;
    transition: opacity 300ms ease-in;
}
```

        位移切换效果：

```css
.carousel2-enter {
    left: 100%;
}
.carousel2-enter-active {
    left: 0;
    transition: left 300ms ease-in;
}
.carousel2-leave {
    left: 0;
}
.carousel2-leave-active {
    left: -100%;
    transition: left 300ms ease-in;
}
```

-           大家都注意到了，我一直在提 transitionName 这个属性，其实对于 ReactCSStransitionGroup 来说，一个属性是完全不够的，下面来详细介绍下它的属性们。
-   ### 2、属性们
-   #### （1）、transitionName

      {oneOfType(\[React.PropTypes.string,React.PropTypes.object]).isRequired}

      作用：关联 CSS 类：

      例如：

    transitionName-appear;
    transitionName-appear-active;
    transitionName-enter;
    transitionName-enter-active;
    transitionName-leave;
    transitionName-leave-active;

      制定 CSS 类：

       transitionName={ { 
             enter: ‘enter’,
             enterActive: ‘enterActive’,
             leave: ‘leave’, 
             leaveActive: ‘leaveActive’, 
             appear: ‘appear’, 
             appearActive: ‘appearActive’ 
       } }

#### （2）、transitionAppear

      {React.PropTypes.bool} {false}

      作用：初始化挂载动画。来为在组件初始挂载添加一个额外的过渡阶段。 通常在初始化挂载时没有过渡阶段因为 transitionAppear 的默认值为 false。

      例如：

```html
render: function() { 
      return ( 
           <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} > 
		<h1>Fading at Initial Mount</h1> 
           </ReactCSSTransitionGroup> 
      ); 
}
```

#### （3）、transitionEnter

      {React.PropTypes.bool} {true}

      作用：用来禁用 enter 动画

#### （4）、transitionLeave

      {React.PropTypes.bool} {true}

      作用：用来禁止 leave 动画 ReactCSSTransitionGroup 会在移除你的 DOM 节点之前等待一个动画完成。你可以添加 transitionLeave={false} 到 ReactCSSTransitionGroup 来禁用这些动画。

#### （5）、component

      {React.PropTypes.any} {‘span’}

      作用：默认情况下 ReactTransitionGroup 渲染为一个 span。你可以通过提供一个 component prop 来改变这种行为。组件不需要是一个 DOM 组件，它可以是任何你想要的 React 组件，甚至是你自己写的。

#### （6）、className

      { React.PropTypes.string }

      作用：给当前的 component 设置样式类

      例如：

```javascript
<ReactTransitionGroup component=“ul” className="example" > 
	... 
</ReactTransitionGroup>
```

### 3、 生命周期

      当子级被声明式的从其中添加或移除（就像上面的例子）时，特殊的生命周期挂钩会在它们上面被调用。

![](http://www.alloyteam.com/wp-content/uploads/2016/01/6D0A535B-F9F8-402A-AF03-D14DFE198A53.png)

**componentWillAppear(callback)**

      对于被初始化挂载到 CSSTransitionGroup 的组件，它和 componentDidMount () 在相同时间被调用 。它将会阻塞其它动画发生，直到 callback 被调用。它只会在 CSS TransitionGroup 初始化渲染时被调用。

**componentDidAppear()**

      在 传给 componentWillAppear 的 回调 函数被调用后调用。

**componentWillEnter(callback)**

      对于被添加到已存在的 CSSTransitionGroup 的组件，它和 componentDidUpdate () 在相同时间被调用 。它将会阻塞其它动画发生，直到 callback 被调用。它不会在 CSSTransitionGroup 初始化渲染时被调用。

**componentDidEnter()**

      在传给 componentWillEnter 的回调函数被调用之后调用。

**componentWillLeave(callback)**

      在子级从 ReactCSSTransitionGroup 中移除时调用。虽然子级被移除了，ReactTransitionGroup 将会保持它在 DOM 中，直到 callback 被调用。

**componentDidLeave()**

      在 willLeave callback 被调用的时候调用（与 componentWillUnmount 同一时间）。

1.  ### 4、原理简述

      以 componentWillEnter 为例，伪代码如下：

```javascript
componentWillEnter (callback) {
     let el = ReactDOM.findDOMNode(this);
     el.classList.add(styles.enter);
     requestAnimationFrame(() => { 
          el.classList.add(styles.active);
     });
    el.addEventListener('transitionend', () => {
         callback && callback();
         el.classList.remove(styles.enter);
         el.classList.remove(styles.active);
    });
}
```

      在 componentWillEnter 里给 Animation 组件添加了 styles.enter 样式类，然后在浏览器下一个 tick 加入 styles.active 样式类 – 这里使用了 requestAnimationFrame，也可以使用 setTimeout，另外还监听 ‘transitionend’ 事件，transitionend 事件发生时执行回调 callback 并移除 styles.enter 与 styles.active 两个样式类

### 5、 注意事项

      ①. 一定要为 ReactCSSTransitionGroup 的所有子级提供 key 属性。即使只渲染一个项目。React 靠 key 来决定哪一个子级进入，离开，或者停留。

![](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ图片20151210181039.jpg)

      ②、动画持续时间需要被同时在 CSS 和渲染方法里被指定。这告诉 React 什么时候从元素中移除动画类，并且如果它正在离开，决定何时从 DOM 移除元素。

![](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ图片20151210181301.jpg)

      ③、ReactCSSTransitionGroup 必须已经挂载到了 DOM 才能工作。为了使过渡效果应用到子级上，ReactCSSTransitionGroup 必须已经挂载到了 DOM 或者 prop transitionAppear 必须被设置为 true。ReactCSSTransitionGroup 不能随同新项目被挂载，而是新项目应该在它内部被挂载。

![](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ图片201512101816241.jpg)

### 6、 劣势

      ReactCSSTransitionGroup 的优势是非常明显的，简化代码、提高性能等，但是其劣势我们也需要了解，以在做实际项目时进行适当的取舍。

      ① 不兼容较老的、不支持 CSS3 的浏览器；

      ② 不支持为 CSS 属性之外的东西（比如滚动条位置或 canvas 绘画）添加动画；

      ③ 可控粒度不够细。CSS3 动画只支持 start、end、iteration 三个事件，不支持对中间状态进行处理。

      ④ transitionEnd 和 animationEnd 事件不稳定。

### 7、 V0.14 动画新特性

      新增属性：     

    transitionAppearTimeout
    transitionEnterTimeout
    transitionLeaveTimeout

      控制动画持续时间，解决 animationend transitionend 事件不稳定、时有时没有的现象，v0.15 版本将彻底放弃监听 animationend transitionend 事件。

      官方原话是： To improve reliability, CSSTransitionGroup will no longer listen to transition events. Instead, you should specify transition durations manually using props such as transitionEnterTimeout={500}.

      原理上其实是简化了，还是以 componentWillEnter 为例，伪代码如下：

```javascript
componentWillEnter (callback) {
     let el = ReactDOM.findDOMNode(this);
     el.classList.add(styles.enter);
     requestAnimationFrame(() => { 
          el.classList.add(styles.active);
     });
    setTimeout( () => {
         callback && callback();
         el.classList.remove(styles.enter);
         el.classList.remove(styles.active);
    }, props.transitionEnterTimeout);
}
```

      所以我们的轮播图就要改为这样实现：

```c
<ReactCSSTransitionGroup transitionName={this.props.transitionName} transitionEnterTimeout={300} transitionLeaveTimeout={300} >
         <img src={this.props.imageSrc} key={this.props.imageSrc} />
</ReactCSSTransitionGroup>
```

（三）间隔动画  

==========

      深入了解了 CSS 渐变组，大家也看到了它并不是万能的，所以需要间隔动画来做辅助，或者说是第二选择。

      间隔动画实现方式很简单，有两种：

      1、 requestAnimationFrame

      2、 setTimeout

      requestAnimationFrame 可以以最小的性能损耗实现最流畅的动画，它被调用的次数频繁度超出你想象。在 requestAnimationFrame 不支持或不可用的情况下，就要考虑降级到不那么智能的 setTimeout 了。

      间隔动画在实现原理上其实很简单，就是周期性的触发组件的状态更新，通过在组件的 render 方法中加入这个状态值，组件能够在每次状态更新触发的重渲染中正确表示当前的动态阶段。

      以实现元素右移 100px 为例，代码实现如下所示：

      1、requestAnimationFrame 实现

```javascript
var Todo = React.createClass(
	getInitialState: function() {
		return {
			left: 0
		};
	},
	componentWillUpdate: function() {
		requestAnimationFrame(this. resolveAnimationFrame);
	},
	render: function() {
		return <div style={{left: this.state.left}}>This will animate!</div>;
	},
	resolveAnimationFrame: function() {
		if(this.state.left <= 100) {
			this.setState({
				left: this.state.left + 1
			});
		}
	}
);
```

      2、requestAnimationFrame 实现

```javascript
var Todo = React.createClass(
	getInitialState: function() {
		return {
			left: 0
		};
	},
	componentWillUpdate: function() {
		setTimeout(this. resolveAnimationFrame, this.props.tick);
	},
	render: function() {
		return <div style={{left: this.state.left}}>This will animate!</div>;
	},
	resolveAnimationFrame: function() {
		if(this.state.left <= 100) {
			this.setState({
				left: this.state.left + 1
			});
		}
	}
);
```

      是不是很简单呢？

      大家一定会想，React 也提供了我们可以直接操作 DOM 的接口，我还是不习惯 React 的写法，为什么不能像原生 js 那样实现动画效果呢？那么我可以明确的告诉你，React 就是不允许你这么做，它就是要规避前端这种肆无忌惮的写法，规范你的代码，降低维护成本。

      至于性能，这里顺便简单提一下 React 的渲染过程，大家可以体会下。

      首次渲染时，从 JSX 渲染成真实 DOM 的大体过程如下：

![](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ图片20151211120315.png)

      1、parse 过程将 JSX 解析成 Virtual DOM，是一种抽象语法树（AST）；

      2、compile 过程则将 AST 通过 DOM API 编译成页面真实的 DOM。

      二次渲染过程如下：

![](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ图片20151211131153.png)

      1、每次生成的页面 DOM 渲染后，其对应的 Virtual Dom 也会缓存起来；

      2、当 JSX 发生变化，，会首先根据新的 JSX 生成一个全新的 Virtual Dom；

      3、新的 Virtual Dom 生成后，会检测是否存在旧的 Virtual Dom；

      4、发现存在，则通过 react diff 算法比较新旧 Virtual Dom 之间的差异，得出一个从旧 Virtual Dom 转换到新 Virtual Dom 的最少操作（minimum operating）；

      5、最后，页面旧的真实 Dom，根据刚刚 react diff 算法得出的最少操作，通过 Dom api 进行节点的增、删、改，得出新的真实 Dom；

      大家一定在怀疑 diff 算法的性能，因为传统的用递归算法来比较两棵树的时间复杂度是 O (n^3)，真是烂到了极致，但是，React 通过几个先验条件将 diff 的算法复杂度控制在了 O (n)。下面讲一下这几个条件：

      1、 只在同层级做比较

      在 React 的 diff 算法中，两个 virtual dom 树的比较只在同层级进行。这样，只需一遍，即可遍历整棵树。这样做，是忽略了节点的跨层移动，因为 web 中节点的跨层操作较少。同时我们在使用 React 时，也要尽量避免这样做。

      示例如下：

![](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ图片20151211132620.png)

      算法计算得出的操作是：删除 body 的子节点 p 及其子节点，创建 div 的子节点 p，创建 p 的子节点 a。

      通过 react 的 diff 算法，两个 Virtual Dom 比较后，因移动节点不同级，因此不做移动操作，而是直接删除重建。

      2、 基于组件比较

      在 React 的 diff 算法中，virtual dom 树的比较只在同组件进行。对于不同组件，即使结构相似，也不进行比较，而是直接执行删除 + 重建操作。这样做，是强化组件的概念，因为正常情况下，不同组件的页面结构是不一样的。

      示例如下：

![](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ图片20151211132904.png)

      算法计算得出的操作是：删除 body 的子节点 div 及其子节点，创建 body 子节点 div 及其子节点 p 和子节点 input。

      如使用传统的 diff 算法，会计算出只需删除 div 的子节点 a，并创建 div 子节点 input。

      而采用 react 的 diff 算法，两个 Virtual Dom 比较时，发现绿框内结构为不同的组件，则绿框内容不做比较，直接删除重建。

      3、节点使用唯一属性 key

      在 React 的 diff 算法中，virtual dom 树的节点可以通过 key 标识其身份，提高节点同级同组移动时的性能。增加身份标识来作为节点是否需要修改的一个条件。

![](http://www.alloyteam.com/wp-content/uploads/2016/01/QQ图片20151211133406.png)

        算法计算得出的操作只需要：移动 div 节点到最后即可。

        若使用传统的 diff 算法，判断 body 第一个子节点，旧的为 div，新的为 p，节点不一样，则删除 div 节点，新增插入 p 节点。之后节点操作类似，因此总的需要进行三次节点删除和新增。

        而采用 react 的 diff 算法，因为节点多了 key 来标识，两个 Virtual Dom 比较时，发现 level1 下的三个节点其实是一样的（key=1、key=2、key=3）。

        相信通过上面的介绍，大家对 React 有了更进一步的了解。

四、 总结  

========

        1、 使用 React 实现动画效果时，首先考虑 CSS 渐变组，实在不行，再去考虑使用间隔渲染实现。

        2、 需要定制的功能比较多的话，建议不要使用 React 自带额 CSSTransitionGroup 插件。比如说我们想在动画结束传入一个 onEnd 回调，如果修改 React 源码，有一万多行，CSSTransitionGroup 依赖 transitionGroup，transitionGroup 又依赖其他插件和方法，很难改，也很容易改出问题来。我自己实现了一套 CSSTransitionGroup 插件，后续会做进一步的分享。

谢谢阅读


<!-- {% endraw %} - for jekyll -->