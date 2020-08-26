---
title: 初探 Typescript 解析器
date: 2020-08-24
author: TAT.老教授
source_link: http://www.alloyteam.com/2020/08/%e5%88%9d%e6%8e%a2-typescript-%e8%a7%a3%e6%9e%90%e5%99%a8/
---

<!-- {% raw %} - for jekyll -->

### 前言

前段时间看了下开源组件 stryker 的源码，对 Typescript 的解析器产生了兴趣。这个开源组件是用来检查单测质量的，通过识别源码自动更改某些代码内容，然后看单测能否检测出来。Typescript 解析器做的，就是识别源码这一关键步骤。

于是花了些时间学了下 Typescript 解析器，感觉像打开一个新的大门，可以玩很多有趣的事情。

附：stryke ([https://github.com/stryker-mutator/stryker/tree/master](https://link.zhihu.com/?target=https%3A//github.com/stryker-mutator/stryker/tree/master))

### 最基础，生成 AST

翻了下 Stryker 的源码，发现应用 Typescript 解析器的关键语句如下：

```javascript
export function parseFile(file: File, target: ts.ScriptTarget | undefined) {
  return ts.createSourceFile(file.name, file.textContent, target || ts.ScriptTarget.ES5, /*setParentNodes*/ true);
}
```

而前面引入 ts 模块：

```js
import * as ts from 'typescript';
```

createSourceFile 函数参数一随便写就行，参数二传 Typescript 代码，后面两参数保持默认即可，最后输出来的就是一颗抽象语法树（AST）。

你可以通过 nodejs 的断点调试查看这个树每个节点的内容。不过我在网上四处翻了下，找到了可以语义化打出树结构的代码，更方便：

```js
// 打印 TS 的语法树
const printAllChildren = (node: ts.Node, depth = 0) => {
  console.log(new Array(depth + 1).join('----'), ts.SyntaxKind[node.kind], node.pos, node.end);
  node.getChildren().forEach((c) => printAllChildren(c, depth + 1));
};
```

此时我使用下面的源码测试：

```js
export const test = (a: number) => a + 2;
export const test2 = 0;
```

输出下图：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6a137b2cf5e4c4d9ddab0cec996848c~tplv-k3u1fbpfcp-zoom-1.image)

很容易一一对照理解这棵树。

而 Stryker 插件的原理就是生成 AST，深层遍历每个树节点，对特定树节点进行改造，再重新生成源码（生成回源码用的应该是 ts.createPrinter 的能力，[示例](https://link.zhihu.com/?target=https%3A//github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API%23creating-and-printing-a-typescript-ast)）。

既然现在掌握了生成 AST 和遍历 AST 的方法，那我们可以开始玩点花样了\\~

### 应用：谁写了最多的单测用例？

假设，项目用 Jest 写单测。

遍历目录找出单测文件和读取文件内容，这没什么好说的。拿到文件内容我们生成 Typescript 的 AST，开始遍历。

怎么判断节点是不是 describe 或 test/it ？可以这样

```js
if (ts.SyntaxKind[node.kind] === 'CallExpression') {
    const funcName = node.expression.escapedText;
    if (funcName === 'describe') {
        // TODO
    } else if (funcName === 'it' || funcName === 'test') {
        // TODO
    }
}
```

下一个问题，怎么知道这个单测用例代码块是在哪几行？AST 的每个节点是有对应源码的起始位置和结束位置的，那我们就可以算出是第几行（上一节打印 AST 有打印出来）。这时候要注意，直接使用 pos、end 两个取索引，如果树节点是行头行尾，那有可能把换行符、注释也给包含进去的。

方法 1：可以用下面的方法通过中间字段避开行头行尾来算行：

```js
else if (funcName === 'it' || funcName === 'test') {
    const testKeywordNode = node.getChildren()[0];
    parseInfoList.push({
        describeName: currDescribe,
        testName: node.arguments[0].text,
        lineBegin: getLineNumByPos(fileContent, testKeywordNode.end), // 不使用 pos，避免引入注释
        lineEnd: getLineNumByPos(fileContent, node.end),
        expectLines: getExpectLines(fileContent, node) || [],  // 获取所有 expect 所在的行
    });
    return;
}
```

而获取文件内容某个位置是在第几行，只要获取前面内容有多少个换行符即可：

```js
const getLineNumByPos = (fileContent, pos) => {
    const contentBefore = fileContent.slice(0, pos);
    // 统计有多少个换行符
    return (contentBefore.match(/\n/g) || []).length + 1;
};
```

方法 2：用 TS 封装的接口，TS 提供了 getStart\\getFullStart 等接口，它们的区别是 getFullStart 会含前面的换行和注释（如果有），getStart 不含。至于第几行也是有相应的 api（我为什么不直接用这个？因为我到后面才知道有这个 (╯‵□′)╯︵┻━┻）：

```js
const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
```

做到这里就把难点完成了，后面无非就是通过 git 的 blame 命令获取用例代码所在的行的作者来分析出用例的作者，不是本文重点不展开。

### 进阶：使用 Typescript 上层接口

createSourceFile 还是很好用的，通过分析 AST 树可以做很多事情，但是它的缺点也很明显：

1.  作为底层 API，关注的是底层的单个文件每一个 token 分别是什么类型，却没法得到上层的联系。比如 Typescript 的类型推断就没法通过只看一个 token 来得到，有些类型推断甚至需要跨文件，这是 AST 树没法获知到的；
2.  只能根据代码的层级逐层向下遍历，遇到同样功能多种写法的情况就要兼容辨别，而且还没提供 AST 树向上走的接口，对写相关功能造成了很多不便；

关于这个，Typescript 的解析器能力已经帮我们把整体架构好了，并不是刀耕火种从 AST 来撸代码。这是架构图（源自 Typescript 的 GitHub wiki）

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a38add5cee5442b292bf4712706b63e2~tplv-k3u1fbpfcp-zoom-1.image)

Wiki 地址是：[https://github.com/microsoft/TypeScript/wiki/Architectural-Overview](https://link.zhihu.com/?target=https%3A//github.com/microsoft/TypeScript/wiki/Architectural-Overview)，虽是英文但挺好懂的，推荐读一读。

里面有对整体解析流程做了介绍，生成 AST 只是最初的步骤，也讲了一些概念，个人觉得比较有意思的概念是下面几个：

#### Program

SourceTree 是单个文件的结构，多个 SourceTree 相互关联就组成一个 Program。可以通过一组源文件来创建 Program 也可以是单个源文件，此时类似 webpack 从主入口找文件一样，Typescript 会将源文件所有引用到的文件都给引入 Program 里面并做解析处理：

```js
this.program = ts.createProgram([this.srcFile], {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
});
```

因为相关文件都被引入进来了，于是就可以发现文件和文件的关联、代码和代码的关联，所以不少高级功能是基于 Program 的基础的。

#### TypeChecker

听名字就知道这是做类型检查的，类型推测功能就是它提供的。从 Program 里创建出来：

```js
this.checker = this.program.getTypeChecker();
```

然后就可以做各种类型事情了，比如获取某个函数的入参出参类型：

```js
const getFunctionTypeInfoFromSignature = (signature: ts.Signature, checker: ts.TypeChecker): IFunctionTypeInfo => {
  // 获取参数类型
  const paramTypeStrList = signature.parameters.map((parameter) => {
    return checker.typeToString(checker.getTypeOfSymbolAtLocation(parameter, parameter.valueDeclaration));
  });

  // 获取返回值类型
  const returnType = signature.getReturnType();
  const returnTypeStr = checker.typeToString(returnType);

  return {
    paramTypes: paramTypeStrList,
    returnType: returnTypeStr,
  };
};

export const getFunctionTypeInfoByNode = (
  node: ts.ArrowFunction | ts.FunctionDeclaration | ts.MethodDeclaration,
  checker: ts.TypeChecker,
): IFunctionTypeInfo => {
  const tsType = checker.getTypeAtLocation(node);
  return getFunctionTypeInfoFromSignature(tsType.getCallSignatures()[0], checker);
};
```

这里你会看到 getCallsignatures 返回一个数组，因为 Typescript 是支持函数重构的。

在使用 TypeChecker 的过程中你会注意到另一个重要的概念：

#### Symbol

AST 的每个节点是 Node，那 Symbol 和 Node 又是什么区别？

简单说，Node 就是代码的一个语法块，它可能是变量名，可能是 function 之类的关键字，可能是代码块，而 Symbol 正如其名就是一个标志，每一个 Symbol 就类似我们在控制台调试时输入的变量名。两个函数里面可能局部定义了名称相同的两个变量，但它们属于不同的 Symbol；A.ts 导出的变量 a 在 B.ts 里使用，对应的是同一个 Symbol。

个人觉得 Symbol 的作用主要是：

**上层解析**，比如一个变量定义，Node 数据结构可以理解为一堆初始数据，获取变量名还要去拿到 name 类型再拿到里面的 text，然后最好再 trim 一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7acaf10ba6144b889b094983f05dd90~tplv-k3u1fbpfcp-zoom-1.image)

而转为对应 Symbol 类似于变成高级结构，只需要调用上层接口如：

```js
const symbol = this.checker.getSymbolAtLocation(declaration.name)!;
const name = symbol.getName();
```

包括拿到 class 的 Symbol 就很容易可以通过调用一个接口拿到构造函数的数据，而不用管它藏得多深。

```js
const symbol = checker.getSymbolAtLocation(node.name);
if (!symbol) {
  return null;
}

const tsType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
const signature = tsType.getConstructSignatures()[0];
```

**类型关联**。同个 Symbol 它的类型是固定的，即使它在两个不同的文件使用到。不过我发现可以通过 Symbol 获取 Type，也可以通过 Node 获取 Type，那 Symbol 的这个作用感觉不太需要用到。

更多的 Typescript 解析器内容可深入阅读 Typescript 的 wiki，想要直接看代码来理解 wiki 里也有提供几个案例：[https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API](https://link.zhihu.com/?target=https%3A//github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)

理解了这些概念，相同的功能我们就不需要基于 AST 树写一堆代码，而是可以用更优雅的方式实现。

### 别急着开始写，先了解这个网站和这些 API

一开始我都是傻傻地用第一节那段代码打印 AST 树，直到我找到下面的网站：[https://ts-ast-viewer.com/#](https://link.zhihu.com/?target=https%3A//ts-ast-viewer.com/%23)

功能大致如下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bca769b611e4af5a88693ec6cff7b80~tplv-k3u1fbpfcp-zoom-1.image)

非常地好用，特别是最右侧的区域，你可以知道每一个 AST 节点有哪些属性和方法（不同种类的 AST 节点有差异），可以很方便地取到相关的数据而不是只能通过一层层遍历。

而左下侧的窗格你可以结合这个 demo 来看：[https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#creating-and-printing-a-typescript-ast](https://link.zhihu.com/?target=https%3A//github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API%23creating-and-printing-a-typescript-ast)

接着说说 Typescript 提供的解析器 API。总的来说，特别吐槽，因为没在 GitHub 上找到解析器的 API 列表，只能看示例及翻一翻 Typescript 的源码来了解。下面我介绍一些我用过觉得好用的：

-   类型识别类 API

参照上面 AST 网站的每一层节点的类型，都有对应的判断函数，如 ts.isClassDeclaration、ts.isArrowFunction 等。

当然你也可以参考第一节的 demo 用 ts.SyntaxKind\[node.kind] === 'VariableStatement' 的形式判断，但使用标准接口对 TS 更友好：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8f94ef1a3e54b32bc05fee9e77a27be~tplv-k3u1fbpfcp-zoom-1.image)

-   检测 modifierFlag 的 API

modifierFlag，可以简单理解为修饰标志，如 public、private、async 这些，可以在上面的 AST 查看网站上看到：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/368c2efa7f5047209a6f8d42701ebe8d~tplv-k3u1fbpfcp-zoom-1.image)

而要判断一个树节点是否有某个标志，可以参考下面的写法：

```js
export const isNodeExported = (node: ts.Node): boolean => {
  return (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0;
};
```

更多的好用 API 我还在探索中。

### 应用：获取一个类的所有成员及它们的类型定义

流程：

```js
private analyseExportNodeForClass(node: ts.ClassDeclaration) {
  const className = node.name?.getFullText().trim() || '';
  const classMemeberInfoList: IClassMemberInfo[] = [];

  node.members.forEach((member) => {
    if (!ts.isPropertyDeclaration(member) && !ts.isMethodDeclaration(member)) {
      return;
    }

    const { name, type, funcArgsType } = ts.isPropertyDeclaration(member)
      ? this.getBasicInfoFromVarDeclaration(member)
      : this.getBasicInfoFromFuncDeclaration(member);
    const accessibility = getClassAccessibility(member);

    console.log('name', name);
    console.log('type', type);
    console.log('funcArgsType', funcArgsType);
    console.log('');

    classMemeberInfoList.push({
      name,
      type,
      funcArgsType,
      accessibility,
    });
  });

  // 构造函数单独处理
  const constructorParamType = this.getConstructorParamType(node);

  // TODO 输出相关变量
  console.log(className, classMemeberInfoList, constructorParamType);
}
```

其中获取成员函数的定义和类型：

```js
private getBasicInfoFromFuncDeclaration(declaration: ts.FunctionDeclaration | ts.MethodDeclaration) {
  const symbol = this.checker.getSymbolAtLocation(declaration.name!)!;
  const name = symbol.getName();
  const typeInfo = getFunctionTypeInfoByNode(declaration, this.checker);
  const type = typeInfo.returnType;
  const funcArgsType = typeInfo.paramTypes;

  return {
    name,
    type,
    funcArgsType,
  };
}

// utils.ts
export const getFunctionTypeInfoByNode = (
  node: ts.ArrowFunction | ts.FunctionDeclaration | ts.MethodDeclaration,
  checker: ts.TypeChecker,
): IFunctionTypeInfo => {
  const tsType = checker.getTypeAtLocation(node);
  return getFunctionTypeInfoFromSignature(tsType.getCallSignatures()[0], checker);
};

const getFunctionTypeInfoFromSignature = (signature: ts.Signature, checker: ts.TypeChecker): IFunctionTypeInfo => {
  // 获取参数类型
  const paramTypeStrList = signature.parameters.map((parameter) => {
    return checker.typeToString(checker.getTypeOfSymbolAtLocation(parameter, parameter.valueDeclaration));
  });

  // 获取返回值类型
  const returnType = signature.getReturnType();
  const returnTypeStr = checker.typeToString(returnType);

  return {
    paramTypes: paramTypeStrList,
    returnType: returnTypeStr,
  };
};
```

获取成员属性就比较简单了，不赘述。

获取构造函数类型：

```js
private getConstructorParamType(node: ts.ClassDeclaration) {
  const constructorInfo = getConstructorInfo(node, this.checker);
  const constructorParamType: string[] = constructorInfo
    ? constructorInfo.paramTypes
    : [];

  return constructorParamType;
}

// utils.ts
export const getConstructorInfo = (node: ts.ClassDeclaration, checker: ts.TypeChecker): IFunctionTypeInfo | null => {
  if (!node.name) {
    return null;
  }

  const symbol = checker.getSymbolAtLocation(node.name);
  if (!symbol) {
    return null;
  }

  const tsType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
  const signature = tsType.getConstructSignatures()[0];

  if (!signature) {
    return null;
  }

  return getFunctionTypeInfoFromSignature(signature, checker);
};
```

而如果想知道每个成员的开放程度，可这样处理：

```js
export const getClassAccessibility = (node: ts.PropertyDeclaration | ts.MethodDeclaration) => {
  // const hasPublic = (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Public) !== 0;
  const hasPrivate = (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Private) !== 0;
  const hasProtect = (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Protected) !== 0;

  return hasProtect ? ts.ModifierFlags.Protected : hasPrivate ? ts.ModifierFlags.Private : ts.ModifierFlags.Public;
};
```

至此，一个类里面该有的信息都可以获取到了。当然实际情况还有一些特殊场景，如静态成员，如 getter 等，参照着 AST 查看网站的结构可以大致推断出该使用什么 API。

获取到类信息我们就可以做不少事情，比如全自动输出每个类的接口文档？全自动 mock 一个类的实例？可以想象的空间很多\\~

### 总结

侃了这么多，可能就摸到了 Typescript 解析器的冰山一角而已。随着 Typescript 的使用率越来越高，了解 Typescript 解析器并编写相关工具将变成一件又有意义又有些挑战性的事情，期待看到更多的工具\\~

注：相关参考文档

-   官方 wiki：[https://github.com/microsoft/TypeScript/wiki/Architectural-Overview](https://link.zhihu.com/?target=https%3A//github.com/microsoft/TypeScript/wiki/Architectural-Overview)
-   深入理解 Typescript：[https://jkchao.github.io/typescript-book-chinese/compiler/overview.html](https://link.zhihu.com/?target=https%3A//jkchao.github.io/typescript-book-chinese/compiler/overview.html)


<!-- {% endraw %} - for jekyll -->