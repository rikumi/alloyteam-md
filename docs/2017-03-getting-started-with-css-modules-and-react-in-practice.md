---
title: CSS Modules 入门及 React 中实践
date: 2017-03-15
author: burlin
source_link: http://www.alloyteam.com/2017/03/getting-started-with-css-modules-and-react-in-practice/
---

<!-- {% raw %} - for jekyll -->

## 写在前面

读文先看此图，能先有个大体概念：

![](http://www.alloyteam.com/wp-content/uploads/2017/03/屏幕快照-2017-03-15-上午8.10.47.png)

阅读本文需要 11m 24s。

## CSS Modules 介绍

CSS Modules 是什么东西呢？首先，让我们从官方文档入手：  
[GitHub - css-modules/css-modules: Documentation about css-modules](https://github.com/css-modules/css-modules)

> A CSS Module is a CSS file in which all class names and animation names are scoped locally by default. CSS 模块就是所有的类名都只有局部作用域的 CSS 文件。

所以 CSS Modules 既不是官方标准，也不是浏览器的特性，而是在构建步骤（例如使用 Webpack 或 Browserify）中对 CSS 类名选择器限定作用域的一种方式（通过 hash 实现类似于命名空间的方法）。

> It doesn’t really matter in the end (although shorter class names mean shorter stylesheets) because the point is that they are dynamically generated, unique, and mapped to the correct styles. 在使用 CSS 模块时，类名是动态生成的，唯一的，并准确对应到源文件中的各个类的样式。

这也是实现样式作用域的原理。它们被限定在特定的模板里。例如我们在 buttons.js 里引入 buttons.css 文件，并使用.btn 的样式，在其他组件里是不会被.btn 影响的，除非它也引入了 buttons.css.

可我们是出于什么目的把 CSS 和 HTML 文件搞得这么零碎呢？我们为什么要使用 CSS 模块呢？

## 为什么我们需要 CSS 模块化

### CSS 全局作用域问题

CSS 的规则都是全局的，任何一个组件的样式规则，都对整个页面有效。相信写 css 的人都会遇到样式冲突（污染）的问题。

于是一般这么做（笔者都做过）：  
\* class 命名写长一点吧，降低冲突的几率  
\* 加个父元素的选择器，限制范围  
\* 重新命名个 class 吧，比较保险

所以亟待解决的问题就是 css 局部作用域避免全局样式冲突（污染）的问题

### JS CSS 无法共享变量

复杂组件要使用 JS 和 CSS 来共同处理样式，就会造成有些变量在 JS 和 CSS 中冗余，CSS 预处理器 / 后处理器 等都不提供跨 JS 和 CSS 共享变量这种能力。

### 健壮并且扩展方便的 CSS

作为有追求的工程师，编写健壮并且扩展方便的 CSS 一直是我们的目标。那么如何定义健壮并且扩展方便？有三个要点：

-   面向组件 - 处理 UI 复杂性的最佳实践就是将 UI 分割成一个个的小组件 [Locality_of_reference](https://www.wikiwand.com/en/Locality_of_reference) 。如果你正在使用一个合理的框架，JavaScript 方面就将原生支持（组件化）。举个例子，React 就鼓励高度组件化和分割。我们希望有一个 CSS 架构去匹配。
-   沙箱化（Sandboxed）- 如果一个组件的样式会对其他组件产生不必要以及意想不到的影响，那么将 UI 分割成组件并没有什么用。就这方面而言，CSS 的全局作用域会给你造成负担。
-   方便 - 我们想要所有好的东西，并且不想产生更多的工作。也就是说，我们不想因为采用这个架构而让我们的开发者体验变得更糟。可能的话，我们想开发者体验变得更好。

## CSS 模块化方案分类

CSS 模块化的解决方案有很多，但主要有三类。

### CSS 命名约定

规范化 CSS 的模块化解决方案（比如 BEM [BEM — Block Element Modifier](http://getbem.com/) ,OOCSS,AMCSS,SMACSS,SUITCSS)  
但存在以下问题：  
\* JS CSS 之间依然没有打通变量和选择器等  
\* 复杂的命名

### CSS in JS

彻底抛弃 CSS，用 JavaScript 写 CSS 规则，并内联样式。 [React: CSS in JS // Speaker Deck](https://speakerdeck.com/vjeux/react-css-in-js)。Radium，react-style 属于这一类。但存在以下问题：  
\* 无法使用伪类，媒体查询等  
\* 样式代码也会出现大量重复。  
\* 不能利用成熟的 CSS 预处理器（或后处理器）

#### 使用 JS 来管理样式模块

使用 JS 编译原生的 CSS 文件，使其具备模块化的能力，代表是 CSS Modules [GitHub - css-modules/css-modules: Documentation about css-modules](https://github.com/css-modules/css-modules) 。

CSS Modules 能最大化地结合现有 CSS 生态 (预处理器 / 后处理器等) 和 JS 模块化能力，几乎零学习成本。只要你使用 Webpack，可以在任何项目中使用。是笔者认为目前最好的 CSS 模块化解决方案。

## CSS Modules 使用教程

### 启用 CSS Modules

    // webpack.config.js
    css?modules&localIdentName=[name]__[local]-[hash:base64:5]
     

加上 `modules` 即为启用，`localIdentName` 是设置生成样式的命名规则。

    /* components/Button.css */
    .normal { /* normal 相关的所有样式 */ }
     

```javascript
// components/Button.js
import styles from "./Button.css";
console.log(styles);
buttonElem.outerHTML = `<button class=${styles.normal}>Submit</button>`;
```

生成的 HTML 是

```html
<button class="button--normal-abc53">Submit</button>;
```

注意到 `button--normal-abc53` 是 CSS Modules 按照 `localIdentName` 自动生成的 class 名。其中的 `abc53` 是按照给定算法生成的序列码。经过这样混淆处理后，class 名基本就是唯一的，大大降低了项目中样式覆盖的几率。同时在生产环境下修改规则，生成更短的 class 名，可以提高 CSS 的压缩率。

上例中 console 打印的结果是：

    Object {
      normal: 'button--normal-abc53',
      disabled: 'button--disabled-def886',
    }
     

CSS Modules 对 CSS 中的 class 名都做了处理，使用对象来保存原 class 和混淆后 class 的对应关系。

通过这些简单的处理，CSS Modules 实现了以下几点：  
\* 所有样式都是局部作用域 的，解决了全局污染问题  
\* class 名生成规则配置灵活，可以此来压缩 class 名  
\* 只需引用组件的 JS 就能搞定组件所有的 JS 和 CSS  
\* 依然是 CSS，几乎 0 学习成本

## CSS Modules 在 React 中的实践

那么我们在 React 中怎么使用？

### 手动引用解决

在 `className` 处直接使用 css 中 `class` 名即可。

```javascript
import React from "react";
import styles from "./table.css";
export default class Table extends React.Component {
    render() {
        return (
            <div className={styles.table}>
                            <div className={styles.row}>            </div>
                        
            </div>
        );
    }
}
```

渲染出来的组件出来

```c
<div class="table__table___32osj">
    <div class="table__row___2w27N">
    </div>
</div>
 
```

### react-css-modules

如果你不想频繁的输入 `styles.**`，有一个 [GitHub - gajus/react-css-modules: Seamless mapping of class names to CSS modules inside of React components.](https://github.com/gajus/react-css-modules)，它通过高阶函数的形式来生成 `className`，不过不推荐使用，后文会提到。

API 也很简单，给组件外包一个 CSSModules 即可。

```html
import React from "react";
import CSSModules from "react-css-modules";
import styles from "./table.css";
class Table extends React.Component {
    render() {
        return <div styleName="table">        </div>;
    }
}
export default CSSModules(Table, styles);
```

不过这样我们可以看到，它是需要运行时的依赖，而且需要在运行时才获取 className，性能损耗大，那么有没有方便又接近无损的方法呢？答案是有的，使用 babel 插件 `babel-plugin-react-css-modules` [GitHub - gajus/babel-plugin-react-css-modules: Transforms styleName to className using compile time CSS module resolution.](https://github.com/gajus/babel-plugin-react-css-modules) 把 `className` 获取前置到编译阶段。

### babel-plugin-react-css-modules

`babel-plugin-react-css-modules` 可以实现使用 `styleName` 属性自动加载 CSS 模块。我们通过该 babel 插件来进行语法树解析并最终生成 `className`。

来看看组件的写法，现在你只需要把 `className` 换成 `styleName` 即可获得 CSS 局部作用域的能力了，是不是非常简单。

```html
import React from 'react';
import styles from './table.css';
 
class Table extends React.Component {
    render () {
        return <div styleName='table'>
        </div>;
    }
}
 
export default Table；
 
```

#### 工作原理

那么该 babel 插件是怎么工作的呢？让我们从官方文档入手：

[GitHub - gajus/babel-plugin-react-css-modules: Transforms styleName to className using compile time CSS module resolution.](https://github.com/gajus/babel-plugin-react-css-modules#how-does-it-work)

笔者不才 ，稍作翻译如下：  
1. 构建每个文件的所有样式表导入的索引（导入具有`.css` 或`.scss` 扩展名的文件）。  
2. 使用 [postcss](https://github.com/postcss/postcss) 解析匹配到的 css 文件  
3. 遍历所有 [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html) 元素声明  
4. 把 `styleName` 属性解析成匿名和命名的局部 css 模块引用  
5. 查找与 CSS 模块引用相匹配的 CSS 类名称：  
\* 如果 `styleName` 的值是一个字符串字面值，生成一个字符串字面值。  
\* 如果是 JSXExpressionContainer，在运行时使用 helper 函数来构建如果 `styleName` 的值是一个 [`jSXExpressionContainer`](https://github.com/babel/babel/tree/master/packages/babel-types#jsxexpressioncontainer), 使用辅助函数（\[`getClassName`] 在运行时构造 `className` 值。  
6. 从元素上移除 `styleName` 属性。  
7. 将生成的 `className` 添加到现有的 `className` 值中（如果不存在则创建 `className` 属性）。

#### 使用实例

在成熟的项目中，一般都会用到 CSS 预处理器或者后处理器。

这里以使用了 `stylus`CSS 预处理器为例子，我们来看下如何使用。

-   安装依赖


    npm install -save-dev sugerss babel-plugin-react-css-modules 
     

-   编写 Webpack 配置

```javascript
// webpack.config.js
module: {
    loaders: [
        {
            test: /\.js?$/,
            loader: [
                [
                    "babel-plugin-react-css-modules",
                    {
                        generateScopedName: "[name]__[local]",
                        filetypes: {
                            ".styl": "sugerss",
                        },
                    },
                ],
            ],
        },
        {
            test: /\.module.styl$/,
            loader:
                "style!css?modules&localIdentName=[name]__[local]!styl?sourceMap=true",
        },
        {
            test: /\.styl$/,
            loader: "style!css!styl?sourceMap=true",
        },
    ];
}
```

-   组件写法

```html
import React from 'react';
import './table.module.styl';
 
class Table extends React.Component {
    render () {
        return <div styleName='table'>
        </div>;
    }
}
 
export default Table；
 
```

如上，你可以通过配置 Webpack 中 module.loaders 的 test 路径 [Webpack-module-loaders-configuration](https://webpack.github.io/docs/configuration.html#module-loaders)，来区分样式文件是否需要 CSS 模块化。  
搭配 `sugerss` 这个 `postcss` 插件作为 `stylus` 的语法加载器，来支持 babel 插件 `babel-plugin-react-css-modules` 的语法解析。

最后我们回过头来看下，我们 React 组件只需要把 `className` 换成 `styleName`，搭配以上构建配置，即可实现 CSS 模块化 。

## 最后

CSS Modules 很好的解决了 CSS 目前面临的模块化难题。支持与 CSS 处理器搭配使用，能充分利用现有技术积累。如果你的产品中正好遇到类似问题，非常值得一试。

希望大家都能写出健壮并且可扩展的 CSS，以上。

<!-- {% endraw %} - for jekyll -->