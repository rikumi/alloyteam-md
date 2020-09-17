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
.carousel1-leave
```


<!-- {% endraw %} - for jekyll -->