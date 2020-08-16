---
title: React 移动 web 极致优化
date: 2016-05-30
author: TAT.heyli
source_link: http://www.alloyteam.com/2016/05/react-mobile-web-optimization/
---

<!-- {% raw %} - for jekyll -->

[原文地址](https://github.com/lcxfs1991/blog/issues/8)

最近一个季度，我们都在为手 Q 家校群做重构优化，将原有那套问题不断的框架换掉。经过一些斟酌，决定使用 react 进行重构。选择 react，其实也主要是因为它具有下面的三大特性。

React 的特性  

* * *

### 1. Learn once, write anywhere

学习 React 的好处就是，学了一遍之后，能够写 web, node 直出，以及 native，能够适应各种纷繁复杂的业务。需要轻量快捷的，直接可以用 Reactjs；需要提升首屏时间的，可以结合 React Server Render；需要更好的性能的，可以上 React Native。

但是，这其实暗示学习的曲线非常陡峭。单单是 Webpack+ React + Redux 就已够一个入门者够呛，更何况还要兼顾直出和手机客户端。不是一般人能 hold 住所有端。

### 2. Virtual Dom

Virtual Dom（下称 vd）算是 React 的一个重大的特色，因为 Facebook 宣称由于 vd 的帮助，React 能够达到很好的性能。是的，Facebook 说的没错，但只说了一半，它说漏的一半是：“除非你能正确的采用一系列优化手段”。

### 3. 组件化

另一个被大家所推崇的 React 优势在于，它能令到你的代码组织更清晰，维护起来更容易。我们在写的时候也有同感，但那是直到我们踩了一些坑，并且渐渐熟悉 React+ Redux 所推崇的那套代码组织规范之后。

### 那么？

上面的描述不免有些先扬后抑的感觉，那是因为往往作为 React 的刚入门者，都会像我们初入的时候一样，对 React 满怀希望，指意它帮我们做好一切，但随着了解的深入，发现需要做一些额外的事情来达到我们的期待。

对 React 的期待  

* * *

初学者对 React 可能满怀期待，觉得 React 可能完爆其它一切框架，甚至不切实际地认为 React 可能连原生的渲染都能完爆 —— 对框架的狂热确实会出现这样的不切实际的期待。让我们来看看 React 的官方是怎么说的。React 官方文档在 Advanced Performanec 这一节，这样写道：

    One of the first questions people ask when considering React for a project is whether their application will be as fast and responsive as an equivalent non-React version

显然 React 自己也其实只是想尽量达到跟非 React 版本相若的性能。React 在减少重复渲染方面确实是有一套独特的处理办法，那就是 vd，但显示在首次渲染的时候 React 绝无可能超越原生的速度，或者一定能将其它的框架比下去。因此，我们在做优化的时候，可的期待的东西有：

-   首屏时间可能会比较原生的慢一些，但可以尝试用 React Server Render (又称 Isomorphic) 去提高效率
-   用户进行交互的时候，有可能会比原生的响应快一些，前提是你做了一些优化避免了浪费性能的重复渲染。

以手 Q 家校群功能页 React 重构优化为例  

* * *

手 Q 家校群功能页主要由三个页面构成，分别是列表页、布置页和详情页。列表页已经重构完成并已发布，布置页已重构完毕准备提测，详情页正在重构。与此同时我们已完成对列表页的同构直出优化，并已正在做 React Native 优化的铺垫。

这三个页面的重构其实覆盖了不少页面的案例，所以还是蛮有代表性的，我们会将重构之中遇到的一些经验穿插在文章里论述。

在手 Q 家校群重构之前，其实我们已经做了一版 PC 家校群。当时将 native 的页面全部 web 化，直接就采用了 React 比较常用的全家桶套装：

-   构建工具 => gulp + webpack
-   开发效率提升 => redux-dev-tools + hot-reload
-   统一数据管理 => redux
-   性能提升 => immutable + purerender
-   路由控制器 => react-router (手 Q 暂时没采用)

为什么我们在优化的时候主要讲手 Q 呢？毕竟 PC 的性能在大部份情况下已经很好，在 PC 上一些存在的问题都被 PC 良好的性能掩盖下去。手机的性能不如 PC，因此有更多有价值的东西深挖。开发的时候我就跟同事开玩笑说：“ 没做过手机 web 优化的都真不好意思说自己做过性能优化啊 “。

构建针对 React 做的优化  

* * *

我在《性能优化三部曲之一 —— 构建篇》提出，“通过构建，我们可以达成开发效率的提升，以及对项目最基本的优化”。在进行 React 重构优化的过程中，构建对项目的优化作用必不可少。在本文暂时不赘述，我另外开辟了一篇 [《webpack 使用优化（react 篇）》](https://github.com/lcxfs1991/blog/issues/7)进行具体论述。

开发效率提升工具  

* * *

![](https://segmentfault.com/image?src=https://cloud.githubusercontent.com/assets/3348398/15649370/ab4db266-26a3-11e6-909d-958c3c795975.png&objectId=1190000005599249&token=2571e1b37a91d86108e4bd6b99d73cb1)

在 PC 端使用 Redux 的时候，我们都很喜欢使用 Redux-Devtools 来查看 Redux 触发的 action，以及对应的数据变化。PC 端使用的时候，我们习惯摆在右边。但移动端的屏幕较少，因此家校群项目使用的时候放在底部，而且由于性能问题，我们在 constant 里设一个 debug 参数，然后在 chrome 调试时打开，移动端非必须的时候关闭。否则，它会导致移动 web 的渲染比较低下。

数据管理及性能优化  

* * *

### Redux 统一管理数据

这一部份算是重头戏吧。React 作为 View 层的框架，已经通过 vd 帮助我们解决重复渲染的问题。但 vd 是通过看数据的前后差异去判断是否要重复渲染的，但 React 并没有帮助我们去做这层比较。因此我们需要使用一整套数据管理工具及对应的优化方法去达成。在这方法，我们选择了 Redux。

Redux 整个数据流大体可以用下图来描述：

![](https://segmentfault.com/image?src=https://cloud.githubusercontent.com/assets/3348398/15649583/41f46b46-26a5-11e6-9da9-71d90b2b4e04.png&objectId=1190000005599249&token=7f4de6271c436c2a8659f5786bc0ca99)

Redux 这个框架的好处在于能够统一在自己定义的 reducer 函数里面去进行数据处理，在 View 层中只需要通过事件去处触发一些 action 就可以改变地应的数据，这样能够使数据处理和 dom 渲染更好地分离，而避免手动地去设置 state。

在重构的时候，我们倾向于将功能类似的数据归类到一起，并建立对应的 reducer 文件对数据进行处理。如下图，是手 Q 家校群布置页的数据结构。有些大型的 SPA 项目可能会将初始数据分开在不同的 reducer 文件里，但这里我们倾向于归到一个 store 文件，这样能够清晰地知道整个文件的数据结构，也符合 Redux 想统一管理数据的想法。然后数据的每个层级与 reducer 文件都是一一对应的关系。

![](https://segmentfault.com/image?src=https://cloud.githubusercontent.com/assets/3348398/15649727/4fa31034-26a6-11e6-9e9a-3220eed40bab.png&objectId=1190000005599249&token=d7ba3c8ef589acad01de73b28cc6208a)

### 重复渲染导致卡顿

这套 React + Redux 的东西在 PC 家校群页面上用得很欢乐， 以至于不用怎么写 shouldComponentUpdate 都没遇到过什么性能问题。但放到移动端上，我们在列表页重构的时候就马上遇到卡顿的问题了。

什么原因呢？是重复渲染导致的！！！！！！

说好的 React vd 可以减少重复渲染呢？！！！

请别忘记前提条件！！！！

你可以在每个 component 的 render 里，放一个 console.log ("xxx component")。然后触发一个 action，在优化之前，几乎全部的 component 都打出这个 log，表明都重复渲染了。

### React 性能的救星 Immutablejs

![](https://sf-static.b0.upaiyun.com/v-57481e79/global/img/squares.svg) (网图，引用的文章太多以致于不知道哪篇才是出处)

上图是 React 的生命周期，还没熟悉的同学可以去熟悉一下。因为其中的 shouldComponentUpdate 是优化的关键。React 的重复渲染优化的核心其实就是在 shouldComponentUpdate 里面做数据比较。在优化之前，shouldComponentUpdate 是默认返回 true 的，这导致任何时候触发任何的数据变化都会使 component 重新渲染。这必然会导致资源的浪费和性能的低下 —— 你可能会感觉比较原生的响应更慢。

这时你开始怀疑这世界 —— 是不是 Facebook 在骗我。

当时遇到这个问题我的开始翻阅文档，也是在 Facebook 的 Advanced Performance 一节中找到答案：Immutablejs。这个框架已被吹了有一年多了吧，吹这些框架的人理解它的原理，但不一定实践过 —— 因为作为一线移动端开发者，打开它的 github 主页看 dist 文件，50kb，我就已经打退堂鼓了。只是遇到了性能问题，我们才再认真地去了解一遍。

Immutable 这个的意思就是不可变，Immutablejs 就是一个生成数据不可变的框架。一开始你并不理解不可变有什么用。最开始的时候 Immutable 这种数据结构是为了解决数据锁的问题，而对于 js，就可以借用来解决前后数据比较的问题 —— 因为同时 Immutablejs 还提供了很好的数据比较方法 ——Immutable.is ()。小结一下就是：

-   Immutablejs 本身就能生成不可变数据，这样就不需要开发者自己去做数据深拷贝，可以直接拿 prevProps/prevState 和 nextProps/nextState 来比较。
-   Immutable 本身还提供了数据的比较方法，这样开发者也不用自己去写数据深比较的方法。

说到这里，已万事俱备了。那东风呢？我们还欠的东风就是应该在哪里写这个比较。答案就是 shouldComponentUpdate。这个生命周期会传入 nextProps 和 nextState，可以跟 component 当前的 props 和 state 直接比较。这个就可以参考 pure-render 的做法，去重写 shouldComponentUpdate，在里面写数据比较的逻辑。

其中一位同事 polarjiang 利用 Immutablejs 的 is 方法，参考 pure-render-decorator 写了一个 [immutable-pure-render-decorator](https://github.com/lcxfs1991/pure-render-deepCompare-decorator/blob/master/src/immutable-pure-render-decorator)。

那具体怎么使用 immutable + pure-render 呢？

对于 immutable，我们需要改写一下 reducer functions 里面的处理逻辑，一律换成 Immutable 的 api。

至于 pure-render，若是 es5 写法，可以用使 mixin；若是 es6/es7 写法，需要使用 decorator，在 js 的 babel loader 里面，新增 plugins: \[‘transform-decorators-legacy’]。其 es6 的写法是

```javascript
@pureRender
export default class List extends Component { ... }
```

### Immutablejs 带来的一些问题

#### 不重新渲染

你可能会想到 Immutable 能减少无谓的重新渲染，但可能没想过会导致页面不能正确地重新渲染。目前列表页在老师进入的时候是有 2 个 tab 的，tab 的切换会让列表也切换。目前手 Q 的列表页学习 PC 的列表页，两个列表共用一套 dom 结构（因为除了作业布置者名字之外，两个列表一模一样）。上了 Immutablejs 之后，当碰巧 “我发布的 “ 列表和” 全部 “ 列表开头的几个作业都是同一个人布置的时候，列表切换就不重新渲染了。

引入 immutable 和 pureRender 后，render 里的 JSX 注意一定不要有同样的 key（如两个列表，有重复的数据，此时以数据 id 来作为 key 就不太合适，应该要用数据 id + 列表类型作为 key），会造成不渲染新数据情况。列表页目前的处理办法是将 key 值换成 id + listType。

![](https://segmentfault.com/image?src=https://cloud.githubusercontent.com/assets/3348398/15650651/aefcb0ac-26ac-11e6-920a-c429200a8137.png&objectId=1190000005599249&token=2f54f0590a1e6ebff00629f7abdf79a9)(列表页两个列表的切换)

这样写除了保证在父元素那一层知晓数据 (key 值）不同需要重新渲染之外，也保证了 React 底层渲染知道这是两组不同的数据。在 React 源文件里有一个 ReactChildReconciler.js 主要是写 children 的渲染逻辑。其中的 updateChildren 里面有具体如何比较前后 children，然后再决定是否要重新渲染。在比较的时候它调用了 shouldUpdateReactComponent 方法。我们看到它有对 key 值做比较。在两个列表中有不同的 key，在数据相似的情况下，能保证两者切换的时候能重新渲染。

```javascript
function shouldUpdateReactComponent(prevElement, nextElement) {
    var prevEmpty = prevElement === null || prevElement === false;
    var nextEmpty = nextElement === null || nextElement === false;
    if (prevEmpty || nextEmpty) {
        return prevEmpty === nextEmpty;
    }
    var prevType = typeof prevElement;
    var nextType = typeof nextElement;
    if (prevType === "string" || prevType === "number") {
        return nextType === "string" || nextType === "number";
    } else {
        return (
            nextType === "object" &&
            prevElement.type === nextElement.type &&
            prevElement.key === nextElement.key
        );
    }
}
```

#### Immutablejs 太大了

上文也提到 Immutablejs 编译后的包也有 50kb。对于 PC 端来说可能无所谓，网速足够快，但对于移动端来说压力就大了。有人写了个 [seamless-immutable](https://github.com/rtfeldman/seamless-immutable)，算是简易版的 Immutablejs，只有 2kb，只支持 Object 和 Array。

但其实数据比较逻辑写起来也并不难，因此再去 review 代码的时候，我决定尝试自己写一个，也是这个决定让我发现了更多的奥秘。

针对 React 的这个数据比较的深比较 deepCompare，要点有 2 个：

-   尽量使传入的数据扁平化一点
-   比较的时候做一些限制，避免溢出栈

先上一下列表页的代码，如下图。这里当时是学习了 PC 家校群的做法，将 component 作为 props 传入。这里的<Scroll> 封装的是滚动检测的逻辑，而<List> 则是列表页的渲染，<Empty> 是列表为空的时候展示的内容，<Loading> 是列表底部加载的显示横条。

![](https://segmentfault.com/image?src=https://cloud.githubusercontent.com/assets/3348398/15650834/f629ef0c-26ad-11e6-8aae-6826ed95134f.png&objectId=1190000005599249&token=9103fba897d5ce056eaad83839f9a1dc)

针对 deepCompare 的第 1 个要点，扁平化数据，我们很明显就能定位出其中一个问题了。例如<Empty>，我们传入了 props.hw，这个 props 包括了两个列表的数据。但这样的结构就会是这样

```javascript
props.hw = {
    listMine: [
        {...}, {...}, ...
    ],
    listAll: [
        {...}, {...}, ...
    ],
}
```

但如果我们提前在传入之前判断当前在哪个列表，然后传入对应列表的数量，则会像这样：  
props.hw = 20;

两者比较起来，显示是后者简单得多。

针对 deepCompare 第 2 点，限制比较的条件。首先让我们想到的是比较的深度。一般而言，对于 Object 和 Array 数据，我们都需要递归去进行比较，出于性能的考虑，我们都会限制比较的深度。

除此之外，我们回顾一下上面的代码，我们将几个 React component 作为 props 传进去了，这会在 shouldComponentUpdate 里面显示出来。这些 component 的结构大概如下：

![](https://segmentfault.com/image?src=https://cloud.githubusercontent.com/assets/3348398/15651086/d9a3e6ce-26af-11e6-84b8-724b7c35a7e4.png&objectId=1190000005599249&token=de0c849a91cf68f48bb5b048a096d75f)

```javascript
$$typeof // 类型
_owner // 父组件
_self: // 仅开发模式出现
_source: //  仅开发模式出现
_store //  仅开发模式出现
key // 组件的key属性值
props // 从传入的props
ref // 组件的ref属性值
type 本组件ReactComponent
```

因此，针对 component 的比较，有一些是可以忽略的，例如 $$typeof, \_store, \_self, \_source, \_owner。type 这个比较复杂，可以比较，但仅限于我们定好的比较深度。如果不做这些忽略，这个深比较将会比较消耗性能。关于这个 deepCompare 的代码，我放在了 [pure-render-deepCompare-decorator](https://github.com/lcxfs1991/pure-render-deepCompare-decorator)。

不过其实，将 component 当作 props 传入更为灵活，而且能够增加组件的复用性，但从上面看来，是比较消耗性能的。看了官方文档之后，我们尝试换种写法，主要就是采用<Scroll> 包裹<List> 的做法，然后用 this.props.children 在<Scroll> 里面渲染，并将<Empty>, <Loading> 抽出来。

![](https://segmentfault.com/image?src=https://cloud.githubusercontent.com/assets/3348398/15651574/0a952a24-26b3-11e6-9b35-b6dc3f2407ee.png&objectId=1190000005599249&token=f153386699e0751f74e0d1f3ca38ed6a)

![](https://segmentfault.com/image?src=https://cloud.githubusercontent.com/assets/3348398/15651568/06274ff8-26b3-11e6-9310-26f7d71cb67e.png&objectId=1190000005599249&token=0e0e6a883891082e897bc2b69fcfe6e3)

本以为 React 可能会对 children 这个 props 有什么特殊处理，但它依然是将 children 当作 props，传和 shouldComponentUpdate，这就迫使父元素<Scroll> 要去判断是否要重新渲染，进而跳到子无素<List> 再去判断是否要进入步判断。

那<Scroll> 究竟要不要去做这重判断呢？针对列表页这种情况，我们觉得可以暂时不做，由于<Scroll> 包裹的元素不多，<Scroll> 可以先重复渲染，然后再交由子元素<List> 自己再去判断。这样我们对 [pure-render-deepCompare-decorator](https://github.com/lcxfs1991/pure-render-deepCompare-decorator) 要进行一些修改，当轮到 props.children 判断的时候，我们要求父元素直接重新渲染，这样就能交给子元素去做下一步的处理。

如果<Scroll> 包裹的只有<List> 还好，如果还有像<Empty>, <Loading> 甚至其它更多的子元素，那<Scroll> 重新渲染会触发其它子元素去运算，判断自己是否要做重新渲染，这就造成了浪费。react 的官方论坛上已经有人提出，React 的将父子元素的重复渲染的决策都放在 shouldComponentUpdate，可能导致了耦合 [Shouldcomponentupdate And Children](https://discuss.reactjs.org/t/shouldcomponentupdate-and-children/2055)。

性能优化小 Tips  

* * *

这里归纳了一些其它性能优化的小 Tips

### 请慎用 setState，因其容易导致重新渲染

既然将数据主要交给了 Redux 来管理，那就尽量使用 Redux 管理你的数据和状态 state，除了少数情况外，别忘了 shouldComponentUpdate 也需要比较 state。

### 请将方法的 bind 一律置于 constructor

Component 的 render 里不动态 bind 方法，方法都在 constructor 里 bind 好，如果要动态传参，方法可使用闭包返回一个最终可执行函数。如：showDelBtn (item) { return (e) => {}; }。如果每次都在 render 里面的 jsx 去 bind 这个方法，每次都要绑定会消耗性能。

### 请只传递 component 需要的 props

传得太多，或者层次传得太深，都会加重 shouldComponentUpdate 里面的数据比较负担，因此，也请慎用 spread attributes（&lt;Component {...props} />）。

### 请尽量使用 const element

这个用法是工业聚在 React 讨论微信群里教会的，我们可以将不怎么变动，或者不需要传入状态的 component 写成 const element 的形式，这样能加快这个 element 的初始渲染速度。

路由控制与拆包  

* * *

当项目变得更大规模与复杂的时候，我们需要设计成 SPA，这时路由管理就非常重要了，这使特定 url 参数能够对应一个页面。

![](https://segmentfault.com/image?src=https://cloud.githubusercontent.com/assets/3348398/15652361/41e198b4-26b8-11e6-8e11-6a82e6878c81.png&objectId=1190000005599249&token=779fdcc529d17f4a023ad53f4b2dd143)

PC 家校群整个设计是一个中型的 SPA，当 js bundle 太大的时候，需要拆分成几个小的 bundle，进行异步加载。这时可以用到 webpack 的异步加载打包功能，require。

![](https://segmentfault.com/image?src=https://cloud.githubusercontent.com/assets/3348398/15652396/7cceff34-26b8-11e6-886f-755d7fe6d1cc.png&objectId=1190000005599249&token=ec2c95aba462e054e2dd903be95ac911)

在重构手 Q 家校群布置页的时候，我们有不少的浮层，列表有布置页内容主浮层、同步到多群浮层、科目管理浮层以及指定群成员浮层。这些完全可以使用 react-router 进行管理。但是由于当时一早使用了 Immutablejs，js bundle 已经比较大，我们就不打算使用 react-router 了。但后面仍然发现包比重构前要大一些，因此为了保证首屏时间不慢于重构前，我们希望在不用 react-router 的情况下进行分包，其实也并不难，如下面 2 幅图：

![](https://segmentfault.com/image?src=https://cloud.githubusercontent.com/assets/3348398/15652452/e5c08490-26b8-11e6-9210-83128fea8064.png&objectId=1190000005599249&token=d691bfbd7247bb7e1b4f07051e984209)

![](https://segmentfault.com/image?src=https://cloud.githubusercontent.com/assets/3348398/15652444/d628272c-26b8-11e6-8524-4fa8321aa9ce.png&objectId=1190000005599249&token=ddbf28e79327800b57f6f335680a9a02)

首先在切换浮层方法里面，使用 require.ensure，指定要加载哪个包。  
在 setComponent 方法里，将 component 存在 state 里面。  
在父元素的渲染方法里，当 state 有值的时候，就会自动渲染加载回来的 component。

性能数据  

* * *

### 首屏可交互时间

目前只有列表页发布外网了，我们比较了优化前后的首屏可交互时间，分别有 18% 和 5.3% 的提升。

![](https://segmentfault.com/image?src=https://cloud.githubusercontent.com/assets/3348398/15652517/4c911874-26b9-11e6-8316-aa45bbe254c8.png&objectId=1190000005599249&token=eedb95a96fef6b696629fe9f55d9d3bb)

![](https://segmentfault.com/image?src=https://cloud.githubusercontent.com/assets/3348398/15652518/4c986bba-26b9-11e6-8f03-c0eb0870c736.png&objectId=1190000005599249&token=dd78e5601da53ad03a99d532badf1715)

### FPS 时间

稍后补上

React 性能优化军规  

* * *

我们在开发的过程中，将上面所论述的内容，总结成一个基本的军规，铭记于心，就可以保证 React 应用的性能不至于太差。

### 渲染相关

-   提升级项目性能，请使用 immutable (props、state、store)
-   请 pure-render-decorator 与 immutablejs 搭配使用
-   请慎用 setState，因其容易导致重新渲染
-   谨慎将 component 当作 props 传入
-   请将方法的 bind 一律置于 constructor
-   请只传递 component 需要的 props，避免其它 props 变化导致重新渲染（慎用 spread attributes）
-   请在你希望发生重新渲染的 dom 上设置可被 react 识别的同级唯一 key，否则 react 在某些情况可能不会重新渲染。
-   请尽量使用 const element

### tap 事件

-   简单的 tap 事件，请使用 react-tap-event-plugin  
    开发环境时，最好引入 webpack 的环境变量（仅在开发环境中初始化），在 container 中初始化。生产环境的时候，请将 plugin 跟 react 打包到一起（需要打包在一起才能正常使用，因为 plugin 对 react 有好多依赖），外链引入。

目前参考了这个项目的打包方案：  
<https://github.com/hartmamt/react-with-tap-events>  
Facebook 官方 issue:<https://github.com/facebook/react/blob/bef45b0b1a98ea9b472ba664d955a039cf2f8068/src/renderers/dom/client/eventPlugins/TapEventPlugin.js>  
React-tap-event-plugin github:  
<https://github.com/zilverline/react-tap-event-plugin>

-   复杂的 tap 事件，建议使用 tap component  
    家校群列表页的每个作业的 tap 交互都比较复杂，出了普通的 tap 之外，还需要 long tap 和 swipe。因此我们只好自己封装了一个 tap component

### Debug 相关

-   移动端请慎用 redux-devtools，易造成卡顿
-   Webpack 慎用 devtools 的 inline-source-map 模式  
    使用此模式会内联一大段便于定位 bug 的字符串，查错时可以开启，不是查错时建议关闭，否则开发时加载的包会非常大。

### 其它

-   慎用太新的 es6 语法。  
    Object.assign 等较新的类库避免在移动端上使用，会报错。

Object.assign 目前使用 object-assign 包。

或者使用 babel-plugin-transform-object-assign 插件。会转换成一个 extends 的函数：

```javascript
var _extends = ...;
 
_extends(a, b);
```

如有错误，请斧正！

<!-- {% endraw %} - for jekyll -->