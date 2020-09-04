---
title: 为 React 扩展 jsReady
date: 2015-04-29
author: TAT.dnt
source_link: http://www.alloyteam.com/2015/04/wei-react-kuo-zhan-jsready/
---

<!-- {% raw %} - for jekyll -->

写在前面  

* * *

因为用 React 就会需要写[jsx](https://facebook.github.io/react/docs/jsx-in-depth.html)。  
React 会将 jsx 编译成 js。然后 append 到 head 当中。从 fiddler 的请求和 JSXTransformer 源码来看，当在页面使用下面的 html 时候：

````html

```html
<script type="text/jsx" src="js/react_test.js"></script>
````

;

````

会发送两次请求 react\_test.js 文件，一次是 JSXTransformer 发送的，一次是浏览器识别 script 标签自动发送的。  
上面的 react\_test.js 里面全是[jsx](https://facebook.github.io/react/docs/jsx-in-depth.html)语法，和 javascript 有点像，如：

```javascript
var Timer = React.createClass({
    getInitialState: function () {
        return { secondsElapsed: 0 };
    },
    tick: function () {
        this.setState({ secondsElapsed: this.state.secondsElapsed + 1 });
    },
    componentDidMount: function () {
        this.interval = setInterval(this.tick, 1000);
    },
    componentWillUnmount: function () {
        clearInterval(this.interval);
    },
    render: function () {
        return <div>Seconds Elapsed: {this.state.secondsElapsed}</div>;
    },
});
````

    React.render(<Timer />, document.getElementById('timerExample'));

现在问题来了：

````html

```html
<script type="text/jsx"  src="js/react_test.js"></script>
````

```html
<script>
  console.log(Timer) //这里居然是undefined
</script>
```

```

上面打印的信息的是 undefined。所以迫切地希望能够有个这样的事件，这样就能拿到 Timer，也就能够调用它的相关方法：
```


<!-- {% endraw %} - for jekyll -->