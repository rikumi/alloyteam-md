---
title: Webpack 打包后代码执行时机分析与优化
date: 2019-07-31
author: TAT.joeyguo
source_link: http://www.alloyteam.com/2019/07/wait-external-webpack-plugin/
---

<!-- {% raw %} - for jekyll -->

代码执行时机将决定着是否能够正常执行，当依赖文件没加载完成就开始执行、使用对应模块，那么将会导致执行异常。这在 “**存在资源加载失败时，加载重试影响原来文件的执行顺序**” 的场景下尤为常见。

webpack 构建除了进行模块依赖管理，实际上，也天然地管理了 entry 与 chunk 多文件的执行时机，但缺少了对 external 文件管理，当 external 文件加载失败或未完成时，执行、使用对应模块同样将导致异常。为此，[wait-external-webpack-plugin](https://github.com/joeyguo/wait-external-webpack-plugin) 应运而生，以 webpack 插件的形式，补充 external 的执行管理。本文将进行简要说明。

# 一、单文件

将 webpack 打包后的代码进行简化，其实就是一个立即调用函数；传入 “模块”，使用 \_\_webpack_require\_\_ 进行调用。在单文件下，文件加载后将立即执行业务逻辑。

```javascript
(function (modules) {
    // webpackBootstrap
    function __webpack_require__(moduleId) {
        // ...
        // 执行模块代码
        modules[moduleId].call(
            module.exports,
            module,
            module.exports,
            __webpack_require__
        );
    } // 引用入口
    return __webpack_require__((__webpack_require__.s = "./src/entryB.js"));
})({
    "./entryB.js": function (module, __webpack_exports__, __webpack_require__) {
        // ...
    },
});
```

# 二、多文件

为了 “抽取公共模块进行单独打包避免重复加载” 或 “增加并发请求数减少总加载时间” 等原因，一般会将代码拆分成多文件，可使用如下形式：

-   使用 webpack 的 splitChunks 插件，将代码拆分成多个 chunk 文件；
-   通过配置 external，将第三方库单独加载；

拆分成多个文件后，为了避免业务逻辑执行时相关文件还没加载完成导致执行出错，需要等待相关文件都加载完成后再开始执行。

## 2.1 等待 entry 与 chunk 文件都加载完成

entry 与 其他 chunk 文件的 “等待 - 执行” 的逻辑，webpack 其实已经帮我们自动生成了。

### 2.1.1 在生成的 entry 文件中

-   声明了依赖的 chunk 文件列表
-   当 chunk 文件加载后进行标记完成
-   文件加载后将检查相关文件是否都加载完成，如是，则开始执行业务逻辑
-   提供给 chunk 文件加载后的回调方法

```javascript
// # entry.js
 
// 声明依赖列表
deferredModules.push(["./src/entryA.js","commons"]);
 
// 缓存已完成的加载
var installedChunks = {
    "entryA": 0
};
 
function webpackJsonpCallback(data) {
    // 加载后标记完成
    installedChunks[chunkId] = 0;
}
 
// 检查是否都加载完成，如是，则开始执行业务逻辑
function
```


<!-- {% endraw %} - for jekyll -->