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
deferredModules.push(["./src/entryA.js", "commons"]);
// 缓存已完成的加载
var installedChunks = {
    entryA: 0,
};
function webpackJsonpCallback(data) {
    // 加载后标记完成
    installedChunks[chunkId] = 0;
}
// 检查是否都加载完成，如是，则开始执行业务逻辑
function checkDeferredModules() {
    // 判断 installedChunks 是否完整
    // ...
    if (fulfilled) {
        // 所有都加载，开始执行
        result = __webpack_require__(
            (__webpack_require__.s = deferredModule[0])
        );
    }
}
// 提供给 chunk 的全局回调方法
var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);
jsonpArray.push = webpackJsonpCallback;
```

### 2.1.2 在生成的 chunk 文件中

chunk 文件加载后，正常情况下将调用 entry 提供的全局回调方法，标记加载完成。而当 chunk 文件先于 entry 加载完成，则会先缓存记录，等 entry 文件加载后读取缓存并将其标记完成。

```javascript
// # chunk.js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
    ["commons"],
    {
        "./src/moduleA.js": function (
            module,
            __webpack_exports__,
            __webpack_require__
        ) {
            // ...
        },
    },
]);
```

### 2.1.3 小结

基于以上分析，可以看出 entry 和 chunk 文件加载顺序不会影响执行时机，只有在都加载完成后，才会执行业务逻辑。如下图示

![entrychunk](https://user-images.githubusercontent.com/10385585/62221634-8bbf5b80-b3e4-11e9-974d-e6f44a14d654.png)

## 2.2 等待 external 文件加载完成

项目引用第三方库，一般会配置 external 让库单独加载。通过 webpack 生成的代码可以看出，配置 external 的模块在业务代码执行前将被当作已存在环境中，不做任何判断。所以当 external 文件未加载完成或加载失败时，使用对应模块将会导致执行出错。

```javascript
"react":  (function(module, exports) {
     eval("(function() { module.exports = window[\"React\"]; }());");
})
```

### 2.2.1 添加等待 external 文件加载完成再执行逻辑

为了避免使用时出错，在执行前需先保证 external 文件已经加载完成。处理方式如下

-   将 entry 逻辑进行封装，不立即执行
-   external 模块不存在时，则监听等待文件加载完成后再判断执行
-   external 模块都存在后再执行 entry 逻辑

示意代码：

```javascript
(function () {
    var entryInit = function () {
        (function (modules) {
            // webpackBootstrap
            //  ...
        })({});
    };
    if (window["React"]) {
        entryInit();
    } else {
        var hasInit = false;
        var callback = function () {
            if (hasInit) return;
            if (window["React"]) {
                hasInit = true;
                document.removeEventListener("load", callback, true);
                entryInit();
            }
        };
        document.addEventListener("load", callback, true);
    }
})();
```

### 2.2.2 “自动” 生成等待 external 文件加载完成再执行逻辑

等待 external 加载完成逻辑是统一的，差异在于依赖的 external 或有不同。为了避免手动添加出错，我们可以通过以 webpack 插件的形式自动分析依赖，并生成相关代码。

-   获取依赖的 external Modules
-   分析 external 对应变量
-   生成并注入相关逻辑代码

具体实现可见插件 [wait-external-webpack-plugin](https://github.com/joeyguo/wait-external-webpack-plugin)

通过 [wait-external-webpack-plugin](https://github.com/joeyguo/wait-external-webpack-plugin) 插件，能够自动生成等待依赖的 external 文件加载完成再执行逻辑，对开发者透明，保证文件对正常执行。

欢迎使用，欢迎任何意见或建议，谢谢。

[查看更多文章 >>](https://github.com/joeyguo/blog)  
<https://github.com/joeyguo/blog>

<!-- {% endraw %} - for jekyll -->