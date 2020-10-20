---
title: Csp Nonce – 守护你的 inline Script
date: 2020-08-31
author: TAT.joeyguo
source_link: http://www.alloyteam.com/2020/08/csp-nonce/
---

<!-- {% raw %} - for jekyll -->

在 [《XSS 终结者 - CSP 理论与实践》](https://github.com/joeyguo/blog/issues/5) 中，讲述了 CSP 基础语法组成与使用方式。通过一步步的方案制定，最终我们利用 CSP 提供的域名白名单机制，有效地将异常的外联脚本拦在门外。然而在线上环境千千万万，虽然我们限制了外联脚本，但却仍被内联脚本钻了空子。

## CSP unsafe-inline

CSP 的默认策略是不允许 inline 脚本执行，所以当我们没有必要进行脚本 inline 时，CSP 域名白名单的机制足以防范注入脚本的问题。然而在实际项目中，我们还是会因为一些场景需要将部分脚本进行 inline。于是需要在 CSP 的规则中增加 script-src 'unsafe-inline' 配置，允许了 inline 资源执行。但也带来了新的安全隐患。

允许 inline 资源执行，也意味着当恶意代码通过 inline 的方式注入到页面中执行时，页面将变得不再安全。如富文本中被插入一段 script 代码（没被转义），或者是通过浏览器插件的方式进行代码注入等方式。

    Content-Security-Policy: script-src 'unsafe-inline'

## CSP nonce

为了避免上述问题，我们可以使用 nonce 方式加强的 CSP 策略。nonce 方式是指每次页面访问都产生一个唯一 id，通过给内联脚本增加一个 nonce 属性，并且使其属性值 (id) 与返回的 CSP nonce-{id} 对应。只有当两者一致时，对应的内联脚本才被允许执行。于是，即使网页被注入异常的脚本，因为攻击者不知道当时 nonce 的随机 id 值，所以注入的脚本不会被执行。从而让网页变得更加安全。

```html
Content-Security-Policy: script-src 'nonce-5fAifFSghuhdf'
<script nonce="5fAifFSghuhdf">
// ...
</script>
```

那么，当我们通过动态生成脚本并进行插入时，nonce 也会将我们的正常代码拦截在外。所以在这种场景下，我们需要配套使用 CSP 提供的'strict-dynamic'，'strict-dynamic' 模式允许让被信任的脚本插入并放行正常脚本执行。

    Content-Security-Policy: script-src 'nonce-5fAifFSghuhdf' 'strict-dynamic'

## Nonce 的部署方式

### 前端

**scirpt 标签增加 nonce 属性**

我们可以通过构建的方式为页面中 script 标签添加 nonce 属性，并添加一个占位符，如

```html
<script nonce="NONCE_TOKEN">// ...</script>;
```

### 后端

**生产唯一 id，在 CSP 返回头中添加 nonce-{id} 并将 id 替换 html 上的 nonce 占位符**

方式一：服务端处理

-   当页面在服务端渲染时，html 作为模板在服务端进行处理后输出，我们可以在后端生产唯一 id
-   通过模板变量将 id 注入到 html 中实现替换 NONCE_TOKEN 占位符
-   与此同时，将 CSP 返回头进行对应设置

方式二：Nginx 处理

-   Nginx 中可以使用内置变量的 $request_id 作为唯一 id，而当 nginx 版本不支持时，则可以借助 lua 去生产一个 uuid；
-   接着通过 Nginx 的 sub_filter NONCE_TOKEN 'id' 将页面中的 NONCE_TOKEN 占位符替换为 id，或者使用 lua 进行替换；
-   最后使用 add_header Content-Security-Policy "script-src 'nonce-{id}' ... 添加对应的 CSP 返回头。

当然，为了避免攻击者提前注入一段脚本，并在 script 标签上同样添加了 nonce="NONCE_TOKEN" ，后端的 “误” 替换，导致这段提前注入的脚本进行执行。我们需要保密好项目的占位符，取一个特殊的占位符，并行动起来吧！

## 小结

CSP 的应用场景越来越多，逐步地优化策略才能更好地守护我们的项目安全。

[查看更多文章 >>](https://github.com/joeyguo/blog)  
<https://github.com/joeyguo/blog>


<!-- {% endraw %} - for jekyll -->