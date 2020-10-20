---
title: React 直出实现与原理
date: 2015-05-04
author: TAT.donaldyang
source_link: http://www.alloyteam.com/2015/05/react-zhi-chu-shi-xian-yu-yuan-li/
---

<!-- {% raw %} - for jekyll -->

> [前一篇文章](https://github.com/miniflycn/qvd/issues/1)我们介绍了虚拟 DOM 的实现与原理，这篇文章我们来讲讲 React 的直出。  
> 比起 MVVM，React 比较容易实现直出，那么 React 的直出是如何实现，有什么值得我们学习的呢？

### 为什么 MVVM 不能做直出？

对于 MVVM，HTML 片段即为配置，而直出后的 HTML 无法还原配置，所以问题不是 MVVM 能否直出，而是在于直出后的片段能否还原原来的配置。下面是一个简单的例子：

```html
&lt;sapn>Hello {name}!&lt;/span>;
```

上面这段 HTML 配置和数据在一起，直出后会变成：

```html
&lt;span>Hello world!&lt;/span>;
```

这时候当我们失去了 name 的值改变的时候会导致页面渲染这个细节。当然，如果为了实现 MVVM 直出我们可能有另外的方法来解决，例如直出结果变成这样：

```html
&lt;span>
    Hello &lt;span q-text="name">world&lt;/span>!
&lt;/span>;
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
&lt;span class="comment">// https://github.com/DavidWells/isomorphic-react-example/blob/master/app/routes/coreRoutes.js&lt;/span>
 
&lt;span class="keyword">var&lt;/span> React = &lt;span class="keyword">require&lt;/span>(&lt;span class="string">'react/addons'&lt;/span>);
&lt;span class="keyword">var&lt;/span> ReactApp = React.createFactory(&lt;span class="keyword">require&lt;/span>(&lt;span class="string">'../components/ReactApp'&lt;/span>).ReactApp);
 
module.exports = &lt;span class="keyword">function&lt;/span>(app) {
 
    app.get(&lt;span class="string">'/'&lt;/span>, &lt;span class="keyword">function&lt;/span>(req, res){
        &lt;span class="comment">// React.renderToString takes your component&lt;/span>
        &lt;span class="comment">// and generates the markup&lt;/span>
        &lt;span class="keyword">var&lt;/span> reactHtml = React.renderToString(ReactApp({}));
        &lt;span class="comment">// Output html rendered by react&lt;/span>
        &lt;span class="comment">// console.log(myAppHtml);&lt;/span>
        res.render(&lt;span class="string">'index.ejs'&lt;/span>, {reactOutput: reactHtml});
    });
 
};
 
```

OK，我们现在知道如何利用 React 实现直出，以及如何前后端代码复用。

但还有下面几个问题有待解决：

-   如何渲染文字节点，每个虚拟 DOM 节点是需要对应实际的节点，但无法通过 html 文件生成相邻的 Text Node，例如下面例子应当如何渲染：

```html
React.createClass({
    render: &lt;span class="keyword">function&lt;/span> () {
        &lt;span class="keyword">return&lt;/span> (
            &lt;p>
                Hello {name}!           
            &lt;/p>
        );
    }
})
 
```

-   如何避免直出的页面被 React 重新渲染一遍？或者直出的页面和前端的数据是不对应的怎么办？

### 相邻的 Text Node，想多了相邻的 span 而已

![1](https://cloud.githubusercontent.com/assets/2239584/7455582/1d689db2-f2b0-11e4-824a-a0aaaf97927e.png)

通过一个简单的例子，我们可以发现，实际上 React 根本没用 Text Node，而是使用 span 来代替 Text Node，这样就可以实现虚拟 DOM 和直出 DOM 的一一映射关系。

### 重复渲染？没门

刚刚的例子，如果我们通过 React.renderToString 拿到`&lt;Test />` 可以发现是：

```html
&lt;p data-reactid=".0" data-react-checksum="-793171045">
    &lt;span data-reactid=".0.0">Hello &lt;/span>
    &lt;span data-reactid=".0.1">world&lt;/span>
    &lt;span data-reactid=".0.2">!&lt;/span>
&lt;/p>;
```

我们可以发现一个有趣的属性 `data-react-checksum`，这是啥？实际上这是上面这段 HTML 片段的 adler32 算法值。实际上调用 `React.render(&lt;MyComponent />, container);` 时候做了下面一些事情：

-   看看 container 是否为空，不为空则认为有可能是直出了结果。
-   接下来第一个元素是否有 `data-react-checksum` 属性，如果有则通过 React.renderToString 拿到前端的，通过 adler32 算法得到的值和 `data-react-checksum` 对比，如果一致则表示，无需渲染，否则重新渲染，下面是 adler32 算法实现：

```html
&lt;span class="keyword">var&lt;/span> MOD = &lt;span class="number">65521&lt;/span>;
 
&lt;span class="comment">// This is a clean-room implementation of adler32 designed for detecting&lt;/span>
&lt;span class="comment">// if markup is not what we expect it to be. It does not need to be&lt;/span>
&lt;span class="comment">// cryptographically strong, only reasonably good at detecting if markup&lt;/span>
&lt;span class="comment">// generated on the server is different than that on the client.&lt;/span>
&lt;span class="keyword">function&lt;/span> adler32(data) {
  &lt;span class="keyword">var&lt;/span> a = &lt;span class="number">1&lt;/span>;
  &lt;span class="keyword">var&lt;/span> b = &lt;span class="number">0&lt;/span>;
  &lt;span class="keyword">for&lt;/span> (&lt;span class="keyword">var&lt;/span> i = &lt;span class="number">0&lt;/span>; i &lt; data.length; i++) {
    a = (a + data.charCodeAt(i)) % MOD;
    b = (b + a) % MOD;
  }
  &lt;span class="keyword">return&lt;/span> a | (b &lt;&lt; &lt;span class="number">16&lt;/span>);
}
 
```

-   如果需要重新渲染，先通过下面简单的差异算法找到差异在哪里，打印出错误：

```html
&lt;span class="comment">/**
 * Finds the index of the first character
 * that's not common between the two given strings.
 *
 *&lt;span class="phpdoc"> @return&lt;/span> {number} the index of the character where the strings diverge
 */&lt;/span>
&lt;span class="keyword">function&lt;/span> firstDifferenceIndex(string1, string2) {
  &lt;span class="keyword">var&lt;/span> minLen = Math.min(string1.length, string2.length);
  &lt;span class="keyword">for&lt;/span> (&lt;span class="keyword">var&lt;/span> i = &lt;span class="number">0&lt;/span>; i &lt; minLen; i++) {
    &lt;span class="keyword">if&lt;/span> (string1.charAt(i) !== string2.charAt(i)) {
      &lt;span class="keyword">return&lt;/span> i;
    }
  }
  &lt;span class="keyword">return&lt;/span> string1.length === string2.length ? -&lt;span class="number">1&lt;/span> : minLen;
}
 
```

下面是首屏渲染时的主要逻辑，可以发现 React 对首屏实际上也是通过 innerHTML 来渲染的：

```html
_mountImageIntoNode: &lt;span class="keyword">function&lt;/span>(markup, container, shouldReuseMarkup) {
    (&lt;span class="string">"production"&lt;/span> !== process.env.NODE_ENV ? invariant(
      container && (
        (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE)
      ),
      &lt;span class="string">'mountComponentIntoNode(...): Target container is not valid.'&lt;/span>
    ) : invariant(container && (
      (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE)
    )));
 
    &lt;span class="keyword">if&lt;/span> (shouldReuseMarkup) {
      &lt;span class="keyword">var&lt;/span> rootElement = getReactRootElementInContainer(container);
      &lt;span class="keyword">if&lt;/span> (ReactMarkupChecksum.canReuseMarkup(markup, rootElement)) {
        &lt;span class="keyword">return&lt;/span>;
      } &lt;span class="keyword">else&lt;/span> {
        &lt;span class="keyword">var&lt;/span> checksum = rootElement.getAttribute(
          ReactMarkupChecksum.CHECKSUM_ATTR_NAME
        );
        rootElement.removeAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);
 
        &lt;span class="keyword">var&lt;/span> rootMarkup = rootElement.outerHTML;
        rootElement.setAttribute(
          ReactMarkupChecksum.CHECKSUM_ATTR_NAME,
          checksum
        );
 
        &lt;span class="keyword">var&lt;/span> diffIndex = firstDifferenceIndex(markup, rootMarkup);
        &lt;span class="keyword">var&lt;/span> difference = &lt;span class="string">' (client) '&lt;/span> +
          markup.substring(diffIndex - &lt;span class="number">20&lt;/span>, diffIndex + &lt;span class="number">20&lt;/span>) +
          &lt;span class="string">'n (server) '&lt;/span> + rootMarkup.substring(diffIndex - &lt;span class="number">20&lt;/span>, diffIndex + &lt;span class="number">20&lt;/span>);
 
        (&lt;span class="string">"production"&lt;/span> !== process.env.NODE_ENV ? invariant(
          container.nodeType !== DOC_NODE_TYPE,
          &lt;span class="string">'You're trying to render a component to the document using '&lt;/span> +
          &lt;span class="string">'server rendering but the checksum was invalid. This usually '&lt;/span> +
          &lt;span class="string">'means you rendered a different component type or props on '&lt;/span> +
          &lt;span class="string">'the client from the one on the server, or your render() '&lt;/span> +
          &lt;span class="string">'methods are impure. React cannot handle this case due to '&lt;/span> +
          &lt;span class="string">'cross-browser quirks by rendering at the document root. You '&lt;/span> +
          &lt;span class="string">'should look for environment dependent code in your components '&lt;/span> +
          &lt;span class="string">'and ensure the props are the same client and server side:n%s'&lt;/span>,
          difference
        ) : invariant(container.nodeType !== DOC_NODE_TYPE));
 
        &lt;span class="keyword">if&lt;/span> (&lt;span class="string">"production"&lt;/span> !== process.env.NODE_ENV) {
          (&lt;span class="string">"production"&lt;/span> !== process.env.NODE_ENV ? warning(
            &lt;span class="keyword">false&lt;/span>,
            &lt;span class="string">'React attempted to reuse markup in a container but the '&lt;/span> +
            &lt;span class="string">'checksum was invalid. This generally means that you are '&lt;/span> +
            &lt;span class="string">'using server rendering and the markup generated on the '&lt;/span> +
            &lt;span class="string">'server was not what the client was expecting. React injected '&lt;/span> +
            &lt;span class="string">'new markup to compensate which works but you have lost many '&lt;/span> +
            &lt;span class="string">'of the benefits of server rendering. Instead, figure out '&lt;/span> +
            &lt;span class="string">'why the markup being generated is different on the client '&lt;/span> +
            &lt;span class="string">'or server:n%s'&lt;/span>,
            difference
          ) : &lt;span class="keyword">null&lt;/span>);
        }
      }
    }
 
    (&lt;span class="string">"production"&lt;/span> !== process.env.NODE_ENV ? invariant(
      container.nodeType !== DOC_NODE_TYPE,
      &lt;span class="string">'You're trying to render a component to the document but '&lt;/span> +
        &lt;span class="string">'you didn't use server rendering. We can't do this '&lt;/span> +
        &lt;span class="string">'without using server rendering due to cross-browser quirks. '&lt;/span> +
        &lt;span class="string">'See React.renderToString() for server rendering.'&lt;/span>
    ) : invariant(container.nodeType !== DOC_NODE_TYPE));
 
    setInnerHTML(container, markup);
  }
 
```

### 最后

尝试一下下面的代码，想想 React 为啥认为这是错误的？

```html
&lt;span class="keyword">var&lt;/span> Test = React.createClass({
  getInitialState: &lt;span class="keyword">function&lt;/span>() {
    &lt;span class="keyword">return&lt;/span> {name: &lt;span class="string">'world'&lt;/span>};
  },
  render: &lt;span class="keyword">function&lt;/span>() {
    &lt;span class="keyword">return&lt;/span> (
        &lt;p>Hello&lt;/p>
        &lt;p>
            Hello {&lt;span class="keyword">this&lt;/span>.state.name}!
        &lt;/p>
    );
  }
});
 
React.render(
  &lt;Test />,
  document.getElementById(&lt;span class="string">'content'&lt;/span>)
);
 
 
```


<!-- {% endraw %} - for jekyll -->