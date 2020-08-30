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

````

上面打印的信息的是 undefined。所以迫切地希望能够有个这样的事件，这样就能拿到 Timer，也就能够调用它的相关方法：

```javascript
React.jsReady(function () {
    console.log(Timer); //希望这里可以拿到Timer
});
````

主要是为了让封装的多个组件能够更加直接的调用，希望 jsx 以外的 js 文件能够拿到 jsx 内部定义的对象，或者 React.render 的返回值（React.render 的返回值就是该对象的实例）。如:

```javascript
var tt = React.render(<Timer />, document.getElementById("timerExample"));
```

```javascript
上面的tt其实就是Timer的实例（也就是new Timer..）。
 
需要监听jsx已经编译执行完成，编译执行完成就可以使用jsx内部的变量。那么如果扩展？
```

react_jsready.js  

* * *

```javascript
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["react", "JSXTransformer"], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require("react"), require("JSXTransformer"));
    } else {
        root.returnExports = factory(root.React, root.JSXTransformer);
    }
})(this, function (React, JSXTransformer) {
    React.jsReady = function (fn) {
        React.jsReady._readyCallbacks.push(fn);
    };
    React.jsReady._readyCallbacks = [];
    if (window.addEventListener) {
        window.addEventListener("DOMContentLoaded", runScripts, false);
    } else {
        window.attachEvent("onload", runScripts);
    }
    function runScripts() {
        JSXTransformer.runScripts(React.jsReady._readyCallbacks);
    }
});
```

上面是 UMD 的写法，据说现在已经有 AMD\\CMD\\UMD\\KMD 了 = =！

第一步：在 react 和 JSXTransformer 下方引用 react_jsready.js

````html
    
```html
<script src="js/react.js"></script>
````

  

    

```html
<script src="js/JSXTransformer.js"></script>
```

 

     

```html
<script src="js/react_jsready.js"></script>
```

````

第二步: 注释掉 JSXTransformer.js 中的

```javascript
if (window.addEventListener) {
    window.addEventListener("DOMContentLoaded", runScripts, false);
} else {
    window.attachEvent("onload", runScripts);
}
````

第三步：JSXTransformer.js 中

```javascript
//171行加上
var  _loadedScriptCount = 0;
 
//run方法加上（180行左右）
if (_loadedScriptCount === count) {
  var i = 0, len = callbacks.length;
  for (; i < len; i++) {
      callbacks[i]();
  }
}
 
//270行左右
      load(script.src, function(content) {
        result[i].loaded = true;
        result[i].content = content;
        _loadedScriptCount++;
        check();
      }, function() {
          result[i].error = true;
          _loadedScriptCount++;
        check();
      });
    } else {
        _loadedScriptCount++;
   ...
   ...
```

这里就不依依列举了，下方了提供演示地址，可自行下载 JSXTransformer.js。  
这里的基本原理就是计数，当执行了的 jsx 和页面的 jsx（包括页面内嵌和外链的）的个数相等的时候，去执行注册的回调函数。  
这里需要注意的是：如果不需要 jsready 这功能，也需要引用该 js，因为已经把 JSXTransformer.js 中的 runScripts 禁用掉了暴露给外部调用：)，改由 jsready 触发。

地址  

* * *

点击这里: [jsready demo](http://kmdjs.github.io/jsready/)  
React 的 Class base 的风格还是非常讨人喜欢的，自我感觉 jsready 这个特性非常重要，刚接触 reactjs 半天 = =!，欢迎吐槽：)


<!-- {% endraw %} - for jekyll -->