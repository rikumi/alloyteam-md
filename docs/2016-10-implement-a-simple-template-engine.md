---
title: 实现一个简单的模板引擎
date: 2016-10-22
author: june01
source_link: http://www.alloyteam.com/2016/10/implement-a-simple-template-engine/
---

<!-- {% raw %} - for jekyll -->

简介  

* * *

模板引擎，其实就是一个根据模板和数据输出结果的一个工具。

我们要开发一个将模板文件转换成我们实际要使用的内容的工具，这个工具就是模板引擎。我们把模板文件里的内容当成字符串传入到模板引擎中，然后模板引擎根据一定语法对该字符串进行解析处理，然后返回一个函数，之后我们在执行函数时把数据传输进去，即可拿到根据模板和数据得到的新字符串。最后我们想怎么处理该字符串就看需求了，如果用于前端模板生成的话，则可以用 dom 的 innerHTML 这个属性来追加内容。

目前前端的模板引擎多得数不胜数，语法特性也花样百出，用行内的话来说，我们要实现的是一种基于字符串的模板引擎。

简要概述流程如下：

    模板 ----> 输入到模板引擎 ----> 生成函数 ----> 把数据当成参数，执行该函数 ----> 输出结果

优劣  

* * *

-   此模板引擎可用于任意一端，前端后端即插即用，不局限于生成内容的语法，只要生成内容为字符串文本即可。比如在合并 Sprite 图工具中要根据图片大小位置生成对应的 css 定位文件，我们也可以用该引擎生成而不需要另外再写一套引擎。
-   此模板引擎对于数据的更改，需要重新渲染一遍模板，所以在初次渲染和之后的模板更新需要耗费同样的资源。
-   应用于前端时，此模板引擎依赖于 innerHTML，存在注入问题。

需求  

* * *

而此次，我们希望实现一个基于字符串的模板引擎。提供的使用方式尽可能简单，比如类似如下的方式：

```javascript
// 前端
var html = window.parse("<div>${content}</div>", {
    content: "june",
});
// 后端
const parse = require("tpl");
var html = parse("<div>${content}</div>", {
    content: "june",
});
```

并且希望至少提供以下四种语法：

### 条件判断

    {if condition1}
      // code1
    {elseif condition2}
      // code2
    {else}
      // code3
    {/if}

### 数组遍历

    {list array as item}
      // code
      // PS：里面注入了一个变量item_index，指向item在遍历过程中的序号
    {/list}

### 变量定义

```javascript
{
    var var1 = 1;
}
```

### 插值

    // 直接插值
    ${var1}
     
    // 使用过滤器插值的方式
    ${var1|filter1|filter2:var2, var3}

开工  

* * *

### STEP 1

按照前面定下的需求，我们先实现一个对外的接口，代码如下：

```javascript
'use strict'; 
 
var __PARSE__  = (function() { 
 
  /** 
   * 默认的过滤器 
   */ 
  const defaultFilter = { 
    // some code 
  }; 
 
  /* 
   * 解析模板 
   */ 
  let doParseTemplate(content, data, filter) { 
    // some code 
  }; 
 
  return function(content, data, filter) { 
    try { 
      data = data||{}; 
      filter = Object.assign({}, defaultFilter, filter); 
      // 解析模板生成代码生成器 
      let f = doParseTemplate(content, data, filter); 
      return f(data, filter); 
    } catch(ex) { 
      return ex.stack; 
    } 
  }; 
})(); 
 
if(typeof module !== 'undefined' && typeof exports === 'object') { 
  module.exports = __PARSE__; 
} else { 
  window.parse = __PARSE__; 
}
```

此处，f 即是我们生成的函数，而生成该函数的函数我命名为 doParseTemplate，接收三个参数，content 是我们输入的模板文件的字符串内容，data 是我们要传入的数据，而 filter 即为模板中可传入的过滤器。目前 doParseTemplate 这个函数还未实现，接下来就来实现此函数。

### STEP 2

为了生成一个可用的函数，我们要通过 new Function ('DATA', 'FILTER', content); 这样的方法来构造一个函数，其中 content 即是函数体的字符串内容。

我们先设定要生成的函数 f 的结构如下：

```javascript
function(DATA, FILTER) { 
  try { 
    var OUT = []; 
    // 处理变量 
    // some code 
    // 处理过滤器 
    // some code 
    // 处理内容 
    // other code 
    return OUT.join(''); 
  } catch(e) { 
    throw new Error('parse template error!'); 
  } 
}
```

事实上，注释中处理变量、处理过滤器和处理内容这部分是由外部传入决定的，所以只有这部分是可变的，其余的代码都是固定的。为此我们可以使用数组来存放相关的内容，然后在可变部分留一个占位符，在解析到处理变量、处理过滤器和处理内容部分时再把语句塞进去即可。代码如下：

```javascript
let doParseTemplate = function(content, data, filter) { 
  content = content.replace(/\\t/g, '  ').replace(/\\n/g, '\\\\n').replace(/\\r/g, '\\\\r'); 
 
  // 初始化模板生成器结构 
  var struct = [ 
    'try { var OUT = [];', 
    '', //放置模板生成器占位符 
    'return OUT.join(\\'\\'); } catch(e) { throw new Error("parse template error!"); }' 
  ]; 
 
  // some code 
 
  return new Function('DATA', 'FILTER', struct.join('')); 
}
```

现在固定结构有了，接下来我们要处理模板相关的内容，即在放置生成器占位符的那个位置上追加内容。首先，我们要先把输入的变量和过滤器处理好，即在占位符的位置加入诸如 var a = 1; 这样的内容：

```javascript
doParseTemplate = function(content, data) { 
  content = content.replace(/\\t/g, '  ').replace(/\\n/g, '\\\\n').replace(/\\r/g, '\\\\r'); 
 
  // 初始化模板生成器结构 
  let out = []; 
  let struct = [ 
    'try { var OUT = [];', 
    '', //放置模板生成器占位符 
    'return OUT.join(\\'\\'); } catch(e) { throw e; }' 
  ]; 
 
  // 初始化模板变量 
  let vars = []; 
  Object.keys(data).forEach((name) => { 
    vars.push(`var ${name} = DATA['${name}'];`); 
  }); 
  out.push(vars.join('')); 
 
  // 初始化过滤器 
  let filters = ['var FILTERS = {};']; 
  Object.keys(filter).forEach((name) => { 
    if(typeof filter[name] === 'function') { 
      filters.push(`FILTERS['${name}'] = FILTER['${name}'];`); 
    } 
  }); 
  out.push(filters.join('')); 
 
  // some code for parse content 
 
  // 合并内容 
  struct[1] = out.join(''); 
  return new Function('DATA', 'FILTER', struct.join('')); 
}
```

如上，在处理变量和过滤器时需要的值直接从传入的 DATA 和 FILTER 变量里获取，需要注意的点就是过滤器我们单独存在一个 FILTERS 对象里面去，主要是为了防止传入的 FILTER 对象变化带来的一些不必要的影响。之后我们要对模板内容进行解析，鉴于代码越来越长，接下来直接贴上面注释 some code for parse content 里面的内容，其他部分暂且省略。

```javascript
// 解析模板内容 
let beg = 0; // 解析文段起始位置 
let stmbeg = 0;  // 表达式起始位置 
let stmend = 0; // 表达式结束位置 
let len = content.length; 
let preCode = ''; // 表达式前的代码 
let endCode = ''; // 最后一段代码 
let stmJs = ''; // 表达式 
while(beg < len) { 
  /* 开始符 */ 
  stmbeg = content.indexOf('{', beg); 
  while(content.charAt(stmbeg - 1) === '\\\\') { 
    // 遇到转义的情况 
    stmbeg = content.indexOf('{', stmbeg + 1); 
  } 
  if(stmbeg === -1) { 
    // 到达最后一段代码 
    endCode = content.substr(beg); 
    out.push('OUT.push(\\'' + endCode + '\\');'); 
    break; 
  } 
 
  /* 结束符 */ 
  stmend = content.indexOf('}', stmbeg); 
  while(content.charAt(stmend - 1) === '\\\\') { 
    // 遇到转义的情况 
    stmend = content.indexOf('}', stmend + 1); 
  } 
  if(stmend === -1) { 
    // 没有结束符 
    break; 
  } 
 
  // 开始符之前代码  
  preCode = content.substring(beg, stmbeg); 
 
  if(content.charAt(stmbeg - 1) === '$') { 
    // 针对变量取值 
    out.push(`OUT.push(\\'${preCode.substr(0, preCode.length-1)}\\');`); 
    stmJs = content.substring(stmbeg + 1, stmend); 
 
    // 处理过滤器 
    let tmp = ''; 
    stmJs.split('|').forEach((item, index) => { 
      if(index === 0) { 
        // 变量，强制转码 
        tmp = item; 
      } else { 
        // 过滤器 
        let farr = item.split(':'); 
        tmp = `FILTERS['${farr[0]}'](${tmp}`; 
 
        if(farr[1]) { 
          // 带变量的过滤器 
          farr[1].split(',').forEach((fitem) => { 
            tmp = `${tmp}, ${fitem}`; 
          });  
        } 
 
        tmp = `${tmp})`; // 追加结尾 
      } 
    }); 
 
    out.push(`OUT.push((${tmp}).toString());`); 
  } else { 
    // 针对js语句 
    out.push(`OUT.push(\\'${preCode}\\');`); 
    stmJs = content.substring(stmbeg + 1, stmend); 
    out.push(transStm(stmJs)); 
  } 
  beg = stmend + 1; 
}
```

对于模板内容的解析，因为语法相对简单，此处直接使用 while 循环遍历。在我们上面定义的语法中，有关结构相关的语法都用 {和} 来包围，插值则是 ${和}，因此针对这两种语法需要分开处理。整个流程的判断如下：

1.  搜索语句开始符 {；
2.  判断 {前面是否有转义符\\；
3.  搜索语句结束符}；
4.  判断} 前面是否有转义符\\；
5.  判断 {前面是否带有取值符号 $；
6.  提取语句内容，即 {和} 里面的内容；
7.  将语句之前，即 {或 ${之前未放入缓存区的内容放入缓存区；
8.  解析语句，并把解析结果放入缓存区；
9.  循环上述 1-8 的过程，直到搜索不到语句开始符 {，则判断为结尾，把剩下的内容放入缓存区；
10. 把目前缓存区的的内容存到需要输出的数组中。

以上提到的缓存区，即是上面代码中的 out 数组。当遍历完模板内容后，把缓存区合并成一个字符串，然后追加到占位符末尾。其中关于语句的解析用到的函数 transStm 目前接下来将要实现。

### STEP 3

transStm 函数实现比较简单，因为我们需求中设定的语法也不复杂。代码如下：

```javascript
/*
 * 转换模板语句
 */ let transStm = function (stmJs) {
    stmJs = stmJs.trim();
    for (let item of regmap) {
        if (item.reg.test(stmJs)) {
            return typeof item.val === "function"
                ? stmJs.replace(item.reg, item.val)
                : item.val;
        }
    }
};
```

如上，其实只是把语句中的内容逐一用正则去匹配，当匹配到属于某种规则的语句，则针对性处理并返回结果。比如我有一个语句 {if a> 1}，然后正则去匹配，会匹配出是条件判断中的 if 语句，然后会处理成 js 代码 if (a > 1) {并返回。而语句 {/if} 则会处理成} 并返回。因此如下代码：

```python
{if a > 1}.css{margin: 0;}{/if}
```

会处理成：

```css
if (a > 1) {
    out.push(".css{margin: 0;}"); // 此处是输出模板内容
}
```

其中关于语法匹配的正则和返回处理如下：

```css
/* 
 * 语法正则 
 */ 
const regmap = [ 
  // if语句开始 
  {reg: /^if\\s+(.+)/i, val: (all, condition) => {return `if(${condition}) {`;}}, 
  // elseif 语句开始 
  {reg: /^elseif\\s+(.+)/i, val: (all, condition) => {return `} else if(${condition}) {`}}, 
  // else语句结束 
  {reg: /^else/i, val: '} else {'}, 
  // if语句结束 
  {reg: /^\\/\\s*if/i, val: '}'}, 
  // list语句开始 
  {reg: /^list\\s+([\\S]+)\\s+as\\s+([\\S]+)/i, val: (all, arr, item) => {return `for(var __INDEX__=0;__INDEX__<${arr}.length;__INDEX__++) {var ${item}=${arr}[__INDEX__];var ${item}_index=__INDEX__;`;}}, 
  // list语句结束 
  {reg: /^\\/\\s*list/i, val: '}'}, 
  // var 语句 
  {reg: /^var\\s+(.+)/i, val: (all, expr) => {return `var ${expr};`;}} 
];
```

其中 reg 字段是正则表达式，若匹配成功，则执行或直接返回 val 字段的值。

### STEP 4

如果有仔细看前面贴出来的代码，发现上面有用到一个变量 defaultFilter，这是用来定义模板引擎需要自带的过滤器的。常用 ejs 的朋友们估计就会清楚，ejs 里就自带了很多很实用的过滤器，我在下面例子就贴出一个常用的过滤器方法：

    /** 
     * 默认的过滤器 
     */ 
    const defaultFilter = { 
      // 防注入用 
      escape: (str) => { 
        // 防注入转码映射表 
        var escapeMap = { 
          '<': '&lt;', 
          '>': '&gt;', 
          '&': '&amp;', 
          ' ': '&nbsp;', 
          '"': '&quot;', 
          "'": '&#39;', 
          '\\n': '<br/>', 
          '\\r': '' 
        }; 
     
        return str.replace(/\\<|\\>|\\&|\\r|\\n|\\s|\\'|\\"/g, (one) => { 
          return escapeMap[one]; 
        }); 
      } 
    };

用法很简单，当我们有一个变量 a，内容为&lt;div style="color: red;">red&lt;/div> 时，因为我们经常将模板引擎生成的内容直接用 innerHTML 塞进节点之中，而假如我们像 ${a} 这种方式直接使用这个变量的时候，在页面中就只会显示一个红色的 red。

为了防止此类注入的情况发生，我在上面实现了一个叫 escape 的过滤器，将使用方式改为 ${a|escape} 就可以进行特殊符号的转义，在页面上直接显示变量 a 的内容&lt;div style="color: red;">red&lt;/div>。

尾声  

* * *

至此，一个完整的基于字符串的模板引擎就完成了，上面的代码使用了 es6 语法的部分特性来编写，如果需要兼容的话可以使用 babel 来将代码转成 es5 语法，在做一下压缩混淆的话，实际的代码不足 3k。

前面也提到过，基于字符串的模板引擎最大的好处在于语法自由，你可以做到完全不需要关心模板的类型，你可以写一个 css 文件的模板，也可以写一个 html 文件的模板，只要有对应的模板就会有相应的输出，并且前后端可以共用。

如果你想要看完整的代码的话，请戳[这里](https://github.com/JuneAndGreen/demos/blob/master/template_engine/string_base/src/tpl.js)。


<!-- {% endraw %} - for jekyll -->