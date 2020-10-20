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
    if no overflow and new_pointer &lt; self.end_of_chunk:
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
        fn render&lt;'a, 'bump>(&'a self, bump: &'bump Bump) -> Node&lt;'bump>
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

```javascript
struct Counter {
    count: u32,
}
 
impl Render for Counter {
    fn render&lt;'a, 'bump>(&'a self, bump: &'bump Bump) -> Node&lt;'bump>
    where
        'a: 'bump,
    {
        let count = bumpalo::format!(in bump, "{}", self.count);
        div(bump)
            .children([
                text(count.into_bump_str()),
                button(bump)
                    .on("click", |root, vdom, _event| {
                        let counter = root.unwrap_mut::&lt;Counter>();
                        counter.count += 1;
                        vdom.schedule_render();
                    })
                    .children([text("+")])
                    .finish(),
            ])
            .finish()
    }
}
```

此外，Dodrio 还有用于在 JavaScript 中定义渲染组件的概念验证性 API（即为了验证能否跑通流程，不是成熟 api，译者注）。这说明 Rust 和 Wasm 生态易于与 JavaScript 集成，使得开发者既可以渐进地将 JavaScript 代码移植到 Rust，又可以构建异构、多语言的应用程序。在这些异构应用程序中，只有最性能敏感的部分是用 Rust 编写的。

一个使用 JavaScript 定义的 Dodrio 渲染组件:

```javascript
class Greeting {
    constructor(who) {
        this.who = who;
    }
    render() {
        return {
            tagName: "p",
            attributes: [{ name: "class", value: "greeting" }],
            listeners: [{ on: "click", callback: this.onClick.bind(this) }],
            children: [
                "Hello, ",
                {
                    tagName: "strong",
                    children: [this.who],
                },
            ],
        };
    }
    async onClick(vdom, event) {
        // Be more excited!
        this.who += "!"; // Schedule a re-render.
        await vdom.render();
        console.log("re-rendering finished!");
    }
}
```

在 wasm 环境（rust）中使用由 JavaScript 定义的渲染组件：

```javascript
#[wasm_bindgen]
extern "C" {
    // Import the JS `Greeting` class.
    #[wasm_bindgen(extends = Object)]
    type Greeting;
 
    // And the `Greeting` class's constructor.
    #[wasm_bindgen(constructor)]
    fn new(who: &str) -> Greeting;
}
 
// Construct a JS rendering component from a `Greeting` instance.
let js = JsRender::new(Greeting::new("World"));
```

最后，Dodrio 提供了一个安全的公共接口，并且在编写 Dodrio 渲染组件时我们从来没有遇到过必须使用 `unsafe` 关键字的场景。

## 内部实现

在 Dodrio 中，虚拟 DOM 树渲染和 diff 都利用了指针碰撞。渲染过程从组件状态构造基于指针碰撞分配的虚拟 DOM 树。diff 过程将多项 DOM 变更打包到基于指针碰撞分配的 “变更列表” 中，diff 完成后立即全部应用到实际 DOM 上。此设计旨在最大化内存分配的吞吐量（虚拟 DOM 库的常见性能瓶颈），并最大程度地减少 Wasm、JavaScript 和浏览器 DOM 方法之间的来回跨环境调用。这样应该能改善缓存的时间局部性（temporal cache locality）并避免越界调用（out-of-line calls）。（时间局部性指被引用过的存储器在近期被多次引用，空间局部性指被引用过的存储器的相邻存储器在近期被多次引用，为计算机硬件及缓存相关概念。译者注）

### 渲染到双缓存指针碰撞分配区域中

虚拟 DOM 渲染中有几个阶段可以通过指针碰撞分配来优化：

1.  虚拟 DOM 树由 Render 方法实现来构建
2.  它与旧的虚拟 DOM 树间进行 diff 计算
3.  然后被保存下来直到下一次渲染新的虚拟 DOM 树
4.  再与新的虚拟 DOM 树进行比较
5.  最后，它及其所有节点都被摧毁

此过程将无限循环。

虚拟 DOM 树的生命周期和相关操作：

```javascript
        ------------------ Time ------------------->
Tree 0: [ render | ------ | diff ]
Tree 1:          [ render | diff | ------ | diff ]
Tree 2:                          [ render | diff | ------ | diff ]
Tree 3:                                          [ render | diff | ------ | diff ]
...
```

在任意时间点，只有两个虚拟 DOM 树处于活跃状态。因此，我们可以双缓冲两个指针碰撞区域，在包含新的或旧的虚拟 DOM 树的角色之间来回切换：

1.  虚拟 DOM 树被渲染到指针碰撞区域 A 中
2.  将指针碰撞区域 A 中的新虚拟 DOM 树与指针碰撞区域 B 中的旧虚拟 DOM 树进行比较
3.  重置指针碰撞区域 B 的指针
4.  交换指针碰撞区域 A 和 B。

用于虚拟 DOM 树渲染的双缓冲指针碰撞分配区域:

```javascript
        ------------------- Time ------------------->
Arena A: [ render | ------ | diff | reset | render | diff | -------------- | diff | reset | render | diff ...
Arena B:          [ render | diff | -------------- | diff | reset | render | diff | -------------- | diff ...
```

这种用于虚拟 DOM 树构建的指针碰撞分配方法类似于分代垃圾回收器的工作方式，不同的是，在我们的情况下，一旦我们完成了一帧渲染，我们便知道整个旧的虚拟 DOM 树都是垃圾。这意味着我们可以摆脱分代垃圾回收器要做的任何记录工作，例如写障碍（write barriers）、记忆集（remembered sets）和跟踪指针（tracing pointers）。每帧结束后，我们只需重置旧的分配区域的指针即可。此外，分配新的虚拟 DOM 时，我们不会有错将本应被立即回收的旧虚拟 DOM 节点提升到年老代对象空间（tenured object space）中的风险。（分代垃圾回收算法中，新创建的对象会先放置到年轻代对象空间中（Eden），经历多次垃圾回收依然没有被回收掉的对象会被提升到年老代对象空间（Tenured），minor GC 过程只清理年轻代对象，major GC 过程只清理年老代对象，full GC 过程则清理所有区域。译者注）

### Diff 和变更列表

Dodrio 使用简单的单趟算法来比较虚拟 DOM 树。它同时遍历新树和新树，当新树和新树之间的属性、事件处理器或子元素不同时，就创建 DOM 变更操作的列表。它目前不使用任何复杂的算法来最小化变更列表中的操作数，例如最长公共子序列算法或耐心比较算法（patience diffing）。

变更列表是在 diff 期间构建的，应用于实际 DOM，然后销毁。下次我们渲染新的虚拟 DOM 树时，将重复此过程。由于任何时候最多只存在一个变更列表，因此我们对所有变更列表使用一个指针碰撞分配区域。

变更列表中的 DOM 变更操作被编码为 [自定义栈机（custom stack machine）的指令](https://github.com/fitzgen/dodrio/blob/ef4fb9a4895695fe3ea50c936d163da4506390d6/src/change_list.rs#L101-L241)。指令的判别式（discriminant）始终是 32 位整数，但指令的大小却可变，因为有些指令具有立即数（immediates）（一条指令只需要其中几位（取决于指令集大小）来表示指令的类型，剩下的位可以用来存一到多个可以立即读取使用的参数（而不是存在栈中），被称为立即数，译者注），而另一些指令没有。该机器的栈包含实际 DOM 节点（文本节点和元素），而立即数中编码了 UTF-8 字符串的长度和指针（即字符串起始地址，译者注）。

指令在 [Rust 和 Wasm 端发出](https://github.com/fitzgen/dodrio/blob/ef4fb9a4895695fe3ea50c936d163da4506390d6/src/change_list.rs#L267-L379)，然后在 [JavaScript 端批量解释并应用于实际 DOM 上](https://github.com/fitzgen/dodrio/blob/ef4fb9a4895695fe3ea50c936d163da4506390d6/js/change-list.js#L12-L173)。每个解释特定指令的 JavaScript 函数都带有四个参数：

1.  对代表自定义栈机的 JavaScript `ChangeList` 类的引用
2.  一块以 `Uint8Array` 形式表示的 Wasm 内存，其中存有字符串
3.  一块以 `Uint32Array` 形式表示的 Wasm 内存，其中存有立即数
4.  指令的立即数（如果有）所在的偏移量 `i`。

该函数返回以 32 位为间距计算的下一条指令在 wasm 内存中存放的偏移量。

有以下几种指令：

-   创建、删除和替换元素和文本节点
-   添加、删除和更新属性和事件监听器
-   遍历 DOM

例如，`AppendChild` 指令没有立即数，但是期望两个节点位于栈的顶部。它从栈中弹出第一个节点，然后调用 `Node.prototype.appendChild`，其中弹出的节点作为子节点，现在位于栈顶的节点作为父节点。

发出 `AppendChild` 指令:

```javascript
// Allocate an instruction with zero immediates.
fn op0(&self, discriminant: ChangeDiscriminant) {
    self.bump.alloc(discriminant as u32);
}
 
/// Immediates: `()`
///
/// Stack: `[... Node Node] -> [... Node]`
pub fn emit_append_child(&self) {
    self.op0(ChangeDiscriminant::AppendChild);
}
```

解释 `AppendChild` 指令:

```javascript
function appendChild(changeList, mem8, mem32, i) {
    const child = changeList.stack.pop();
    top(changeList.stack).appendChild(child);
    return i;
}
```

另一方面，`SetText` 指令期望在栈顶有一个文本节点，并且不会修改栈。它有一个被编码为指针和长度立即数的字符串。它将解码字符串，然后调用 `Node.prototype.textContent` setter 函数更新文本节点的文本内容。

发出 `SetText` 指令:

```javascript
// Allocate an instruction with two immediates.
fn op2(&self, discriminant: ChangeDiscriminant, a: u32, b: u32) {
    self.bump.alloc([discriminant as u32, a, b]);
}
 
/// Immediates: `(pointer, length)`
///
/// Stack: `[... TextNode] -> [... TextNode]`
pub fn emit_set_text(&self, text: &str) {
    self.op2(
        ChangeDiscriminant::SetText,
        text.as_ptr() as u32,
        text.len() as u32,
    );
}
```

解释 `SetText` 指令:

```javascript
function setText(changeList, mem8, mem32, i) {
    const pointer = mem32[i++];
    const length = mem32[i++];
    const str = string(mem8, pointer, length);
    top(changeList.stack).textContent = str;
    return i;
}
```

## 初步基准测试

为了了解 Dodrio 相对于其他库的速度，我们将其添加到 [Elm 的 Blazing Fast HTML 基准测试](https://elm-lang.org/news/blazing-fast-html-round-two) 中，该测试会比较通过不同库实现的 TodoMVC 应用的渲染速度。他们声称测试方法是公平的，基准测试结果具有一般性。他们还主观地评估了通过优化以提高性能的容易程度（例如，通过在 React 中添加适当的 `shouldComponentUpdate` 和在 Elm 中添加 `lazy` 包装器）。我们采用了相同的方法，并禁用了 Dodrio 的默认设置（默认渲染频率被限制为每动画帧一次），将它放到与 Elm 实现同样的限制条件下。

尽管如此，看基准测试结果前我们还是有一些警告要说在前面。React 实现中的 bug 导致其无法完成测试，因此下面不包含 React 的数据。如果您感到好奇，可以查看原始 Elm 基准测试结果，以了解它相对于被测的其他库的总体表现如何。其次，我们刚开始时尝试将每个库更新到最新版本，但是很快就陷入了困境，因此该基准测试未使用每个库的最新版本。

让我们来看看基准测试结果。我们在 Linux 上的 Firefox 67 中运行了基准测试。数字越小越好，表示更快的渲染时间。

基准测试结果：  
![](http://www.alloyteam.com/wp-content/uploads/2020/01/Screenshot_2019-03-05-Performance-Comparison-300x150.png)

| 库                     | 是否优化？ | 毫秒   |
| --------------------- | ----- | ---- |
| Ember 2.6.3           | No    | 3542 |
| Angular 1.5.8         | No    | 2856 |
| Angular 2             | No    | 2743 |
| Elm 0.16              | No    | 4295 |
| Elm 0.17              | No    | 3170 |
| Dodrio 0.1-prerelease | No    | 2181 |
| Angular 1.5.8         | Yes   | 3175 |
| Angular 2             | Yes   | 2371 |
| Elm 0.16              | Yes   | 4229 |
| Elm 0.17              | Yes   | 2696 |

**Dodrio 是基准测试中最快的库**。这并不是说 Dodrio 在每种情况下都将始终是最快的 - 无疑是错误的。但是这些结果验证了 Dodrio 的设计，并表明它已经具有同类最佳的性能。此外，还有使其更快的空间：

-   Dodrio 是全新的，还没有像其他库那样投入多年的精力。我们尚未在 Dodrio 上进行任何认真的性能分析或优化工作！
-   基准测试中使用的 Dodrio TodoMVC 实现未像其他实现那样使用 shouldComponentUpdate 风格的优化。这些技术仍对 Dodrio 用户可用，但是您应该减少接触它们（SCU）的频率，因为惯用的实现已经非常快。

## 未来的工作

到目前为止，我们还没有投入完善 Dodrio 的开发体验。我们想探索添加能被转化成 Dodrio 虚拟 DOM 树构建器函数调用的 [类型安全的 HTML 模板](https://crates.io/crates/typed-html)。

此外，还有其他几种方法可以改善 Dodrio 的性能：

-   [我们可以为常见的 DOM 变更操作创建新的指令](https://github.com/fitzgen/dodrio/issues/27)。例如，如果我们有直接设置最常用属性的指令（例如 `id`，`class` 等），则可以避免从立即数中解码属性名称字符串。
-   [我们可以研究更智能的 diff 算法](https://github.com/fitzgen/dodrio/issues/28)。初步分析表明，Dodrio 花在应用 diff 变更上的时间比生成 diff 变更或构建虚拟 DOM 树要多得多。改进差异算法可能会产生能更快被应用的更小 diff 差异。
-   Dodrio 的缓存机制（类似于 React 的 `shouldComponentUpdate`）[目前避免重建虚拟 DOM 子树，但还没有避免对其进行重新 diff](https://github.com/fitzgen/dodrio/issues/31)。扩展缓存机制以避免再次 diff 是理所当然的，并且在缓存命中时会提高性能。

我们希望先开始收集实际使用情况下的反馈信息，再投入更多精力改进开发体验和性能。

Evan Czaplicki 向我们指出了另一个可以用来进一步评估 Dodrio 的性能基准测试 -[krausest / js-framework-benchmark](https://github.com/krausest/js-framework-benchmark)。我们期待将 Dodrio 加入该基准测试中，以获得更多的测试用例和对性能的见解。

将来，[WebAssembly host bindings 提案](https://github.com/WebAssembly/host-bindings/blob/master/proposals/host-bindings/Overview.md)（现已变更为更加宽泛的 [interface types 提案](https://github.com/WebAssembly/interface-types/blob/master/proposals/interface-types/Explainer.md)，译者注）将使我们能够直接在 Rust 和 Wasm 中解释变更列表的操作，而无需通过 JavaScript 中转来调用 DOM 方法。

## 结论

Dodrio 是一个新的虚拟 DOM 库，旨在通过广泛使用快速指针碰撞分配来利用 Wasm 线性内存和 Rust 的低层级控制的优势。如果您想了解有关 Dodrio 的更多信息，建议您查看其 github 仓库和示例！

感谢 Luke Wagner 和 Alex Crichton 为 Dodrio 的设计做出了贡献，并参加了头脑风暴和橡皮鸭环节。我们还与 React、Elm 和 Ember 团队的核心开发人员一起讨论，我们感谢他们的知识和理解，使得这些讨论成果最终进入了 Dodrio 的设计中。最后感谢 Jason Orendorff，Lin Clark，Till Schneidereit，Alex Crichton，Luke Wagner，Evan Czaplicki 和 Robin Heggelund Hansen 提供的对本文早期草稿的宝贵反馈。


<!-- {% endraw %} - for jekyll -->