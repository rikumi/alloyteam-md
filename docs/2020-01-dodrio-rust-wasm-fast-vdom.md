---
title: 译：使用 rust 和 wasm 实现基于指针碰撞的高效 virtual dom 运算
date: 2020-01-05
author: TAT.haoyue
source_link: http://www.alloyteam.com/2020/01/dodrio-rust-wasm-fast-vdom/
---

<!-- {% raw %} - for jekyll -->

> [英文原文链接](https://hacks.mozilla.org/2019/03/fast-bump-allocated-virtual-doms-with-rust-and-wasm/)

[Dodrio](https://github.com/fitzgen/dodrio) 是一个用 Rust 和 WebAssembly 编写的虚拟 DOM 库。它利用了 Wasm 的线性内存和 Rust 的低层次控制 api ，围绕指针碰撞（bump allocation）的方式来设计虚拟 DOM 渲染机制。初步的基准测试结果表明它比现有的虚拟 DOM 库性能都高。

## 背景

### 虚拟 DOM 库

虚拟 DOM 库为 Web 的命令式 DOM api 提供了声明式接口。用户通过生成虚拟 DOM 树结构来描述所需的 DOM 状态，虚拟 DOM 库再将虚拟 DOM 树映射成网页的真实 DOM。它们通过实现差异（diff）算法来尽可能少地调用性能低下的 DOM 变更方法。此外，它们倾向于实现缓存功能，以避免重新渲染没有变更的组件以及重新 diff 完全相同的子树。

### 指针碰撞

指针碰撞是一种高效但应用场景有限的内存分配算法。分配器维护一块内存以及一个指向这块内存中某个地址的指针。要为一个对象分配内存时，分配器会将指针移动到对象的对齐地址，再加上对象的大小，然后快速检查指针没有溢出并且仍然指向内存块内的地址。这样分配内存只需要很少几条指令。同样，一次性收回所有对象占有的内存的速度也很快：将指针重置回到块的起始位置即可。

指针碰撞的缺点是，没有通用的方法来在保留其他对象的同时，收回单个对象的内存区域。

这些设计取舍使得指针碰撞非常适合于面向阶段的内存分配（phase-oriented allocations）。也就是说，一组对象将全部在同一程序阶段创建，一起使用，最后一起释放。

指针碰撞的伪码表示：

```python
bump_allocate(size, align):
    aligned_pointer = round_up_to(self.pointer, align)
    new_pointer = aligned_pointer + size
    if no overflow and new_pointer < self.end_of_chunk:
        self.pointer = new_pointer
        return aligned_pointer
    else:
        handle_allocation_failure()
```

## 从用户角度看 Dodrio

首先，我们应该确定好 Dodrio 做什么，不做什么。Dodrio 只是一个虚拟 DOM 库。它不是一个完整的框架。它不提供状态管理，例如 Redux store 和 action 或双向绑定。它不是一个大而全的解决构建 Web 应用程序时遇到的所有问题的解决方案。

使用 Dodrio 对于以前使用过 Rust 或虚拟 DOM 库的人而言应该并不陌生。用户通过实现 `dodrio::Render` 接口，来定义如何将一个结构体（struct）渲染为 HTML。该接口接受对 `self` 的不变（immutable）引用并返回虚拟 DOM 树。

Dodrio 使用建造者模式（builder pattern）来创建虚拟 DOM 节点。我们打算通过编译时宏（macro）来支持可选的 JSX 风格内联 HTML 模板语法，但这一点留待以后来实现。

`dodrio::Render` 接口的 `'a` 和 `'bump` 生命周期以及 `where'a：'bump` 子句强制要求 `self` 引用的生命周期超过 `bump` 分配区域和返回的虚拟 DOM 树。这意味着，例如，如果 `self` 包含字符串，则返回的虚拟 DOM 可以通过引用安全地使用该字符串，而不是将其复制到指针碰撞区域。Rust 的生命周期和借用特性使我们在性能优化上可以更加激进，同时在编译期即确保内存安全性。

Dodrio “Hello, World!” 例子：

    struct Hello {
        who: String,
    }
     
    impl Render for Hello {
        fn render<'a, 'bump>(&'a self, bump: &'bump Bump) -> Node<'bump>
        where
            'a: 'bump,
        {
            span(bump)
                .children([text("Hello, "), text(&self.who), text("!")])
                .finish()
        }
    }

在事件处理程序里可以访问到根 `dodrio::Render` 组件、处理虚拟 DOM 实例的句柄（handle）（可用于调度重新渲染）以及 DOM 事件本身。

Dodrio counter 例子：

    struct Counter {
        count: u32,
    }
     
    impl Render for Counter {
        fn render<'a, 'bump>(&'a self, bump: &'<


<!-- {% endraw %} - for jekyll -->