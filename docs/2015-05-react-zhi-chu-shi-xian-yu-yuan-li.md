---
title: React 直出实现与原理
date: 2015-05-04
author: TAT.donaldyang
source_link: http://www.alloyteam.com/2015/05/react-zhi-chu-shi-xian-yu-yuan-li/
---

> [前一篇文章](https://github.com/miniflycn/qvd/issues/1)我们介绍了虚拟 DOM 的实现与原理，这篇文章我们来讲讲 React 的直出。  
> 比起 MVVM，React 比较容易实现直出，那么 React 的直出是如何实现，有什么值得我们学习的呢？

### 为什么 MVVM 不能做直出？

对于 MVVM，HTML 片段即为配置，而直出后的 HTML 无法还原配置，所以问题不是 MVVM 能否直出，而是在于直出后的片段能否还原原来的配置。下面是一个简单的例子：

```html
<sapn>Hello {name}!</span>;
```

上面这段 HTML 配置和数据在一起，直出后会变成：

```html
<span>Hello world!</span>;
```

这时候当我们失去了 name 的值改变的时候会导致页面渲染这个细节。当然，如果为了实现 MVVM 直出我们可能有另外的方法来解决，例如直出结果变成这样：

```html
<span>
    Hello <span q-text="name">world</span>!
</span>;
```

这时候我们是可以把丢失的信息找回来的，当然结构可能和我们想象的有些差别。当然还有其他问题，例如直出 HTML 不一定能反向还原数据，由于篇幅问题，这里不展开讨论。

### React 如何直出？

![2](https://cloud.githubusercontent.com/assets/2239584/7455572/118cdd64-f2b0-11e4-8146-a57930197985.png)

如图：

-   React 的虚拟 DOM 的生成是可以在任何支持 Javascript 的环境生成的，所以可以在 NodeJS 或 Iojs 环境生成
-   虚拟 DOM 可以直接转成 String
-   然后插入到 html 文件中输出给浏览器便可

具体例子可以参考，<https://github.com/DavidWells/isomorphic-react-example/>，下面是其渲染路由的写法：

```html
<span class="comment">// https://github.com/DavidWells/isomorphic-react-example/blob/master/app/routes/coreRoutes.js</span>
 
<span class="keyword">var</span> React = <span class="keyword">require</span>(<span class="string">'react/addons'</span>);
<span class="keyword">var</span> ReactApp = React.createFactory(<span class="keyword">require</span>(<span class="string">'../components/ReactApp'</span>).ReactApp);
 
module.exports = <span class="keyword">function</span>(app) {
 
    app.get(<span class="string">'/'</span>, <span class="keyword">function</span>(req, res){
        <span class="comment">// React.renderToString takes your component</span>
        <span class="comment">// and generates the markup</span>
        <span class="keyword">var</span> reactHtml = React.renderToString(ReactApp({}));
        <span class="comment">// Output html rendered by react</span>
        <span class="comment">// console.log(myAppHtml);</span>
        res.render(<span class="string">'index.ejs'</span>, {reactOutput: reactHtml});
    });
 
};
 
```

OK，我们现在知道如何利用 React 实现直出，以及如何前后端代码复用。

但还有下面几个问题有待解决：

-   如何渲染文字节点，每个虚拟 DOM 节点是需要对应实际的节点，但无法通过 html 文件生成相邻的 Text Node，例如下面例子应当如何渲染：

```html
React.createClass({
    render: <span class="keyword">function</span> () {
        <span class="keyword">return</span> (
            <p>
                Hello {name}!           
            </p>
        );
    }
})
 
```

-   如何避免直出的页面被 React 重新渲染一遍？或者直出的页面和前端的数据是不对应的怎么办？

### 相邻的 Text Node，想多了相邻的 span 而已

![1](https://cloud.githubusercontent.com/assets/2239584/7455582/1d689db2-f2b0-11e4-824a-a0aaaf97927e.png)

通过一个简单的例子，我们可以发现，实际上 React 根本没用 Text Node，而是使用 span 来代替 Text Node，这样就可以实现虚拟 DOM 和直出 DOM 的一一映射关系。

### 重复渲染？没门

刚刚的例子，如果我们通过 React.renderToString 拿到`<Test />` 可以发现是：

```html
<p data-reactid=".0" data-react-checksum="-793171045">
    <span data-reactid=".0.0">Hello </span>
    <span data-reactid=".0.1">world</span>
    <span data-reactid=".0.2">!</span>
</p>;
```

我们可以发现一个有趣的属性 `data-react-checksum`，这是啥？实际上这是上面这段 HTML 片段的 adler32 算法值。实际上调用 `React.render(<MyComponent />, container);` 时候做了下面一些事情：

-   看看 container 是否为空，不为空则认为有可能是直出了结果。
-   接下来第一个元素是否有 `data-react-checksum` 属性，如果有则通过 React.renderToString 拿到前端的，通过 adler32 算法得到的值和 `data-react-checksum` 对比，如果一致则表示，无需渲染，否则重新渲染，下面是 adler32 算法实现：

```html
<span class="keyword">var</span> MOD = <span class="number">65521</span>;
 
<span class="comment">// This is a clean-room implementation of adler32 designed for detecting</span>
<span class="comment">// if markup is not what we expect it to be. It does not need to be</span>
<span class="comment">// cryptographically strong, only reasonably good at detecting if markup</span>
<span class="comment">// generated on the server is different than that on the client.</span>
<span class="keyword">function</span> adler32(data) {
  <span class="keyword">var</span> a = <span class="number">1</span>;
  <span class="keyword">var</span> b = <span class="number">0</span>;
  <span class="keyword">for</span> (<span class="keyword">var</span> i = <span class="number">0</span>; i < data.length; i++) {
    a = (a + data.charCodeAt(i)) % MOD;
    b = (b + a) % MOD;
  }
  <span class="keyword">return</span> a | (b << <span class="number">16</span>);
}
 
```

-   如果需要重新渲染，先通过下面简单的差异算法找到差异在哪里，打印出错误：

```html
<span class="comment">/**
 * Finds the index of the first character
 * that's not common between the two given strings.
 *
 *<span class="phpdoc"> @return</span> {number} the index of the character where the strings diverge
 */</span>
<span class="keyword">function</span> firstDifferenceIndex(string1, string2) {
  <span class="keyword">var</span> minLen = Math.min(string1.length, string2.length);
  <span class="keyword">for</span> (<span class="keyword">var</span> i = <span class="number">0</span>; i < minLen; i++) {
    <span class="keyword">if</span> (string1.charAt(i) !== string2.charAt(i)) {
      <span class="keyword">return</span> i;
    }
  }
  <span class="keyword">return</span> string1.length === string2.length ? -<span class="number">1</span> : minLen;
}
 
```

下面是首屏渲染时的主要逻辑，可以发现 React 对首屏实际上也是通过 innerHTML 来渲染的：

```html
_mountImageIntoNode: <span class="keyword">function</span>(markup, container, shouldReuseMarkup) {
    (<span class="string">"production"</span> !== process.env.NODE_ENV ? invariant(
      container && (
        (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE)
      ),
      <span class="string">'mountComponentIntoNode(...): Target container is not valid.'</span>
    ) : invariant(container && (
      (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE)
    )));
 
    <span class="keyword">if</span> (shouldReuseMarkup) {
      <span class="keyword">var</span> rootElement = getReactRootElementInContainer(container);
      <span class="keyword">if</span> (ReactMarkupChecksum.canReuseMarkup(markup, rootElement)) {
        <span class="keyword">return</span>;
      } <span class="keyword">else</span> {
        <span class="keyword">var</span> checksum = rootElement.getAttribute(
          ReactMarkupChecksum.CHECKSUM_ATTR_NAME
        );
        rootElement.removeAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);
 
        <span class="keyword">var</span> rootMarkup = rootElement.outerHTML;
        rootElement.setAttribute(
          ReactMarkupChecksum.CHECKSUM_ATTR_NAME,
          checksum
        );
 
        <span class="keyword">var</span> diffIndex = firstDifferenceIndex(markup, rootMarkup);
        <span class="keyword">var</span> difference = <span class="string">' (client) '</span> +
          markup.substring(diffIndex - <span class="number">20</span>, diffIndex + <span class="number">20</span>) +
          <span class="string">'n (server) '</span> + rootMarkup.substring(diffIndex - <span class="number">20</span>, diffIndex + <span class="number">20</span>);
 
        (<span class="string">"production"</span> !== process.env.NODE_ENV ? invariant(
          container.nodeType !== DOC_NODE_TYPE,
          <span class="string">'You're trying to render a component to the document using '</span> +
          <span class="string">'server rendering but the checksum was invalid. This usually '</span> +
          <span class="string">'means you rendered a different component type or props on '</span> +
          <span class="string">'the client from the one on the server, or your render() '</span> +
          <span class="string">'methods are impure. React cannot handle this case due to '</span> +
          <span class="string">'cross-browser quirks by rendering at the document root. You '</span> +
          <span class="string">'should look for environment dependent code in your components '</span> +
          <span class="string">'and ensure the props are the same client and server side:n%s'</span>,
          difference
        ) : invariant(container.nodeType !== DOC_NODE_TYPE));
 
        <span class="keyword">if</span> (<span class="string">"production"</span> !== process.env.NODE_ENV) {
          (<span class="string">"production"</span> !== process.env.NODE_ENV ? warning(
            <span class="keyword">false</span>,
            <span class="string">'React attempted to reuse markup in a container but the '</span> +
            <span class="string">'checksum was invalid. This generally means that you are '</span> +
            <span class="string">'using server rendering and the markup generated on the '</span> +
            <span class="string">'server was not what the client was expecting. React injected '</span> +
            <span class="string">'new markup to compensate which works but you have lost many '</span> +
            <span class="string">'of the benefits of server rendering. Instead, figure out '</span> +
            <span class="string">'why the markup being generated is different on the client '</span> +
            <span class="string">'or server:n%s'</span>,
            difference
          ) : <span class="keyword">null</span>);
        }
      }
    }
 
    (<span class="string">"production"</span> !== process.env.NODE_ENV ? invariant(
      container.nodeType !== DOC_NODE_TYPE,
      <span class="string">'You're trying to render a component to the document but '</span> +
        <span class="string">'you didn't use server rendering. We can't do this '</span> +
        <span class="string">'without using server rendering due to cross-browser quirks. '</span> +
        <span class="string">'See React.renderToString() for server rendering.'</span>
    ) : invariant(container.nodeType !== DOC_NODE_TYPE));
 
    setInnerHTML(container, markup);
  }
 
```

### 最后

尝试一下下面的代码，想想 React 为啥认为这是错误的？

```html
<span class="keyword">var</span> Test = React.createClass({
  getInitialState: <span class="keyword">function</span>() {
    <span class="keyword">return</span> {name: <span class="string">'world'</span>};
  },
  render: <span class="keyword">function</span>() {
    <span class="keyword">return</span> (
        <p>Hello</p>
        <p>
            Hello {<span class="keyword">this</span>.state.name}!
        </p>
    );
  }
});
 
React.render(
  <Test />,
  document.getElementById(<span class="string">'content'</span>)
);
 
 
```