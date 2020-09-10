---
title: mvvm 学习 & vue 实践小结
date: 2015-06-27
author: TAT.lqlongli
source_link: http://www.alloyteam.com/2015/06/mvvm-xue-xi-vue-shi-jian-xiao-jie/
---

<!-- {% raw %} - for jekyll -->

## 1 mvvm 学习

### 1.1 实现原理

mvvm 类框架的实现原理不复杂，大致如下：

-   模板分析得到依赖的属性
-   通过某种变动监测手段监测这些依赖的属性
-   当属性变动的时候，触发相应的 directive 的处理逻辑即可

> 实际上，directive 的处理逻辑不一定是对 view 进行操作，比如上报。但是，在 mv 的思想下，建议对 view 的操作都集中在 directive 里实现

> 从最核心上看，mv 思想仅仅是一个观察者模式的具体应用于延展而已

### 1.2 核心技术点

#### 1.2.1 模板分析

模板分析是比较基础的，凡是和 view 相关的基本都会涉及模板，这是原始资料，这里的关键点是**模板来源**的问题，实际上，它应该可以是**任何字符串**

这里暗示了框架需要一个模板解析器，不管这个解析器复杂还是简单，它都处于一个模式：【输入 --> 模板引擎 --> 输出】

于是，mvvm 的模板解析器特点如下：

-   输入：任何符合规则的字符串
-   输出：需要监听的 data.attr，directive，filter

在设计一个框架的时候，如果想要有更好的可扩展性，则

**输入应该足够灵活**，从来源上来说，模板可以是 someDomHere.html ()，也可以是动态输入，那就更有可适用性；从内容上来说，如果引擎可以识别更高级的语法，那就更有功能性

**输出应该足够收敛**，收敛的意思是有限并规则，像 mvvm 框架，最后出来的只是 directive 和 filter，具体的处理都集中在这两个概念中，仅扩展这两个概念，即可对系统进行扩展

#### 1.2.2 变动监测

在众多 mvvm 类框架中，实现变动监测有 3 种：

1.  门面方法 setter，getter：比如 knockout，q。限定可以变动的入口，并且让入口使用权放给用户来决定。
2.  利用 defineProperty：比如 vue，avalon。本质上也是 setter，getter，但是没有把入口使用权放给用户来决定。
3.  dirty check：比如 angular。对 angular 的研究够多了，这里也不赘述了。

```html
<span class="comment">//方式1 vs. 方式2</span>
<span class="comment">//方式1：</span>
vm.<span class="variable">$set</span>(aaa, <span class="number">1</span>);    <span class="comment">//会触发变动逻辑</span>
vm._data.aaa = <span class="number">2</span>;   <span class="comment">//不会触发变动逻辑，不过这不是框架希望的操作，可以被hack</span>
vm.<span class="variable">$get</span>(aaa);       <span class="comment">//2</span>
 
<span class="comment">//方式2：</span>
vm.aaa = <span class="number">1</span>;         <span class="comment">//一定会触发变动逻辑</span>
vm._data.aaa = <span class="number">2</span>;   <span class="comment">//也可以找到内部的data进行修改，但是没用</span>
vm.aaa;             <span class="comment">//1</span>
 
```

#### 1.2.3 小结与延伸

对一类复杂并且常见的问题进行分析，解耦，抽象，在实践的过程中获得广泛的认可，那就形成了一种模式，mvvm 也是一种模式，它不一定叫 mvvm 模式，这也不是笔者能决定的

对于这个模式的核心，笔者理解如下：系统根据**配置**得到了对某些**数据源**的某些**处理规则**，当数据源变动时就会引发相应的处理规则。模式的扩展是双向性，这由系统实现来决定，当符合某些规则的时候，可以对数据源进行更新。

我们跳出 view 的概念禁锢，联想实现一个监控系统，其实这个模式非常适合用在监控系统上面。

一般的监控系统的处理逻辑是：由收集源对监控数据进行收集整理，然后存储到数据库中，监控系统实时监控数据源，绘制实时的图线（反馈），当数据源发生了符合某些规则的变动时，就会触发相应的动作，比如报警。

如何实现这个系统，让系统具有更高的扩展性？参考 mvvm 模式，可以这样：

收集系统独立于监控系统，各不相同，暂且不论。监控系统通过某些配置文件取得需要监控的数据源与相应的处理逻辑规则，当数据源发生变动时触发相应的处理。

按照 mvvm 模式，进行一些抽象。

-   数据源不一定限定在数据库中，他可以在任何地方，只需要系统可以通过某些可配置的规则获取得到
-   处理规则进行抽象，让它更容易被扩展，比如发邮件，发短信，发微信，发 qq 消息等等

对应前端的 mvvm 框架，模板就是配置文件，directive 就是处理规则，data 对应数据源。

-   当系统需要新增一个数据源的时候，只需要更新配置文件，让系统读取即可启动数据监控
-   当需要新增一个处理规则的时候，可以通过一个热插拔的处理规则插件系统，扩展一个新的处理规则，再更新配置文件，系统即可接受新的处理规则

## 2 vue 实践

vue 介绍就不用了，太多资源了。这里讲述一下 vue 实践过程中的一些收获

### 2.1 组织结构

     + src
         +-- common
               +-- vue
                    +-- coms
                    +-- directives
                    +-- filters
                    +-- vue.js
                    +-- vue.ext.js
         +-- pages
               +-- index
                     +-- index.js
                     +-- vue.ext.js
                     +-- xxx.mixin.js
     

### 2.2 Vue 扩展

vue 的扩展非常方便，与 vue 相关的资源都放置在 src/common/vue/ 下面，比如 coms（组件），directive，filter

src/common/vue/vue.ext.js 是对 vue 进行全局公共的扩展，对于所有页面共有的扩展放在这个文件下面，内容如下：  
![](http://7tszky.com1.z0.glb.clouddn.com/FuA2rjp5OSyt-X2Je8Gl5sxQldqM)

可以看到，扩展 vue 库本身有 4 个扩展点：

-   扩展 Vue 库的全局方法 / 属性，方式：Vue.xxx = …
-   扩展 Vue 实例的方法 / 属性，方式：Vue.prototype = …
-   扩展 directive，方式：Vue.directive ('directiveName’, options);
-   扩展 filter，方式：Vue.filter ('filterName’, function (){});

对于页面单独需要的扩展，集中在 src/pages/pageName/vue.ext.js 里面，形式与全局的 vue.ext.js 一样

在实例化 Vue 的过程中也有许多可以扩展与优化的地方，在实践过程中只是应用了 mixin 功能，其他的可以慢慢深入

mixin 的作用是在实例化 Vue 的时候混入一些功能，它可以混入许多特性，格式与实例化 Vue 时用到的 option 格式一样，比如 index 页面的 mixin.js 的内容如下：

![](http://7tszky.com1.z0.glb.clouddn.com/FgjhliZsMCdcS4m8qgaG_s-R46tz)

这个 mixin 混入了两个方法，多个 Vue 实例共享的 options 可以放置到 mixin 中，从而避免了代码重，比如在实例化 Vue 的时候这样使用 mixin：  
![](http://7tszky.com1.z0.glb.clouddn.com/FjbdQAd69MgckMGxyhtIJQDF3UIH)

可以看到 mixin 是个数组，因此可以同时使用多个 mixin

实际上这里的 mixin 主要不是为了避免代码重复（实践的时候只是这样用），mixin 是一种模式，一个 mixin 内聚了实现一项功能的方法 / 属性集合，在定义 / 生成实例的时候，通过混入 mixin 就可以让该实例拥有某项功能，归根结底是组合 vs 继承问题的产物

### 2.3 vue 组件插入问题

#### 2.3.1 首屏

对于首屏的 vue 组件，直接把模板放在主页面中即可，初始化的时候只需要把 el 参数传入，Vue 就会用 el 的 html 作为模板来初始化 Vue 实例:

![](http://7tszky.com1.z0.glb.clouddn.com/FhnYXU-4Z7dDeo5QY2Dp9YD1SrKQ)

这里需要注意的是在模板中不能使用 {{}}，否则在还没初始化之前，页面会显示奇怪的东西，比如：

```html
<p>hello, {{name}}</p>      <!--初始化前，页面会直接展示hello, {{name}}-->
<img src=<span class="string">"{{imgSrc}}"</span> />    <!--初始化前，会报错，can not find http:<span class="comment">//xxx.com/{{imgSrc}}--></span>
 
<!--正确的写法：-->
<p v-text=<span class="string">"'hello, '+name"</span>>hello</p>
<img v-attr=<span class="string">"src: imgSrc"</span> />
 
```

> {{}} 只是一个语法糖，不建议使用

#### 2.3.2 非首屏

对于非首屏的组件，使用 vue 的方式和原始方式差不多，先生成节点，然后 append，譬如：

![](http://7tszky.com1.z0.glb.clouddn.com/Fg9RtoHKgA3m9V1a1Rcy8vKtv1wa)

el 参数可以接收 query string，也可以直接是一个 dom 节点，如果是 dom 节点则直接编译 dom 的内容。如果 dom 节点不在文档树中，则利用 vueObj.$appendTo 方法将 vue 实例的根节点插入到文档树中

上面这种方式是在页面中没有组件的【坑】的情况下使用的，如果页面为组件留了【坑】，比如：

```html
<section <span class="keyword">class</span>=<span class="string">"hotRecord"</span> id=<span class="string">"js-hotRecord"</span>></section>
 
```

那么，我们可以这样初始化 vue 实例：

![](http://7tszky.com1.z0.glb.clouddn.com/FucpdRp10isif1qKH7l_ZfHo2tUH)

利用 template 参数传入模板，并指定 el，那么 vue 实例在初始化之后就会自动把内容插入到 el 中

> 通过 vue 实现组件的主要核心也就这些，更方便的组件写法也只是对这些进行封装

### 2.4 自定义 directive

在 vue 中自定义 directive 是非常简单明了的，要自定义一个 directive，可以注册 3 个钩子函数：

-   bind：仅调用一次，当指令第一次绑定元素的时候。
-   update：第一次调用是在 bind 之后，用的是初始值；以后每当绑定的值发生变化就会被调用，新值与旧值作为参数。
-   unbind：仅调用一次，当指令解绑元素的时候。

下面简单介绍一个自定义 directive——lazyload：

```html
<span class="keyword">function</span> addSrc(){}
<span class="keyword">function</span> load(){}
 
module.exports = {
    bind: <span class="keyword">function</span>() {
        <span class="keyword">if</span> (!hasBind) { <span class="comment">//全局事件只绑定一次</span>
            hasBind = <span class="keyword">true</span>;
            (document.querySelector(<span class="string">'.z-scroller'</span>) || window).addEventListener(<span class="string">'scroll'</span>, T.debounce(load, <span class="number">100</span>), <span class="keyword">false</span>);
        }
        <span class="comment">//这里也可以使用data属性来获取</span>
        <span class="keyword">var</span> defaultSrc = <span class="keyword">this</span>.el.getAttribute(<span class="string">'data-defaultsrc'</span>);
        <span class="keyword">if</span> (defaultSrc) addSrc(<span class="keyword">this</span>.el, defaultSrc);    <span class="comment">//先使用默认图片</span>
    },
    update: <span class="keyword">function</span>(src) {
        <span class="comment">//directive初始化时，会调用一次bind和update，bind没有传入src，只有update才会传入src</span>
        <span class="comment">//因此只能在update这里拿到需要lazyload的src</span>
        <span class="comment">//lazyload不允许修改src，这里限制只会执行一次update，防止src被修改造成的影响</span>
        <span class="comment">//注：接受src改变可以实现，只是需要一些复杂的处理，这里为了简单起见不让src改变</span>
        <span class="keyword">if</span> (<span class="keyword">this</span>.init) <span class="keyword">return</span>;  
        <span class="keyword">this</span>.init = <span class="keyword">true</span>;
 
        <span class="comment">//如果图片已经加载了，就不需要注册了，这里也可以使用data属性来区分</span>
        <span class="keyword">var</span> isLoad = parseInt(<span class="keyword">this</span>.el.getAttribute(<span class="string">'data-isload'</span>));
        <span class="keyword">if</span> (isLoad) <span class="keyword">return</span>;
 
        <span class="comment">//注册需要lazyload的图片</span>
        <span class="keyword">list</span>[index++] = <span class="keyword">this</span>;
        <span class="keyword">list</span>[index++] = src;
    }
    <span class="comment">//这里有一个最大的问题：由于有local的存在，会创建两个一模一样的lazyload directive</span>
    <span class="comment">//按理说应该定义一个unbind，但是在unbind中找到并除掉local创建出来的lazyload directive会比较麻烦</span>
    <span class="comment">//因此在load函数里面做了一个处理：如果发现需要lazyload的节点不在文档树中，则剔除掉这个lazyload</span>
    <span class="comment">//通过这个直接省掉了unbind函数</span>
};
 
```

自定义 filter 也很简单，只是定义一个处理函数而已，这里就不多介绍了

### 2.5 实践过程中的痛点与小技巧

#### 2.5.1 没有事件代理

用习惯了事件代理，突然没有了会有点不习惯，但是回头想想，事件代理真的很重要吗？还是说我们只是习惯了事件代理而已？

通过 vue 注册相同的事件并不费事。另一个问题，只要事件不多，大约不超过 50，100，也不至于耗掉很大的内存，因此有时候还真不需要事件代理。如果真的需要，也只是实现一个 contain 方法而已

#### 2.5.2 没有 if-else 的奇怪

最初看到下面的代码真的会觉得很奇怪

```html
<h3 v-<span class="keyword">if</span>=<span class="string">"hasTitle"</span>>xxx</h3>
<p v-<span class="keyword">if</span>=<span class="string">"!hasTitle"</span>>xxx</p>
 
```

#### 2.5.3 单值

虽然 vue 有语法解析器，可以在 directive 的值中使用表达式，但是当出现一个复杂的表达式时，会污染模板，让代码可读性变得很差，又或者，表达式完成不了这个任务的时候。

因此，在 mvvm 实践的过程中，深深地发现，利用单值（最多只用一个？: 表达式）来写模板会让代码变得很清晰，更加可读，增加代码的可维护性，而且这也更符合 mvvm 的核心思想：f (state) = view

有些库连语法解析器都没有，比如 q，但也能很好的工作。

那么，复杂的操作放在哪里呢？

-   对于不会变的值来说，也就是常量，要在初始化之前完成处理
-   对于会变的值来说，把复杂的操作放在 filter 里面，在 filter 里面不仅可以进行复杂处理，甚至可以同时应用到其他字段，这不完全等同于 computed attribute

#### 2.5.4 替代 $(document).on

用 jquery/zepto 的时候，习惯了用 $(document).on 来充当一个全局的事件代理，在使用 vue 的时候，需要抛弃 zepto，因此需要解决这个问题

因为 vue 实例本身就有 event 功能，因此这里解决的办法是创建一个全局的空 vue 对象，把它作为全局的事件代理：

```html
<span class="comment">//common/vue/vue.ext.js 回头看前面对该文件的介绍可以看到这句</span>
Vue.noopVue = <span class="keyword">new</span> Vue({});
 
<span class="comment">//a.js</span>
Vue.noopVue.<span class="variable">$on</span>(<span class="string">'someEvent'</span>, <span class="keyword">function</span>() {});
 
<span class="comment">//b.js</span>
Vue.noopVue.<span class="variable">$emit</span>(<span class="string">'someEvent'</span>, [opts]);
 
```

## 3 总结

虽然，最后在付出产出比权衡中放弃了对现有项目的 vue 改造，但是这并不妨碍我们研究 mvvm 类框架

mvvm 模式还是值得我们去深入学习的，而在实践中，我们也能学习到许多

用一种不一样的思想和思维去开发的体验也会令我们在看待问题，处理问题的道路上有所收获

最后，期待 q 的发展，我已经整装待发了哟


<!-- {% endraw %} - for jekyll -->