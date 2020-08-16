---
title: FIS 源码 - fisrelease 概览
date: 2015-05-08
author: TAT.casperchen
source_link: http://www.alloyteam.com/2015/05/fis%e6%ba%90%e7%a0%81-fisrelease%e6%a6%82%e8%a7%88/
---

<!-- {% raw %} - for jekyll -->

前面已经已 `fis server open` 为例，讲解了 FIS 的整体架构设计，以及命令解析 & 执行的过程。下面就进入 FIS 最核心的部分，看看执行 `fis release` 这个命令时，FIS 内部的代码逻辑。

这一看不打紧，基本把 `fis-kernel` 的核心模块翻了个遍，虽然大部分细节已经在脑海里里，但是要完整清晰的写出来不容易。于是决定放弃大而全的篇幅，先来个概要的分析，后续文章再针对涉及的各个环节的细节进行展开。

## 看看 `fis-command-release`

老规矩，献上精简版的 `release.js`，从函数名就大致知道干嘛的。`release(options)`是我们重点关注的对象。

```html
<span class="string">'use strict'</span>;
 
exports.register = <span class="keyword">function</span>(commander){
    
    <span class="comment">//  fis relase --watch 时，就会执行这个方法</span>
    <span class="keyword">function</span> watch(opt){
        <span class="comment">// ...</span>
    }
    
    <span class="comment">// 打点计时用，控制台里看到的一堆小点点就是这个方法输出的</span>
    <span class="keyword">function</span> time(fn){
        <span class="comment">// ...</span>
    }
    
    <span class="comment">// fis release --live 时，会进入这个方法，对浏览器进行实时刷新</span>
    <span class="keyword">function</span> reload(){
        <span class="comment">//...</span>
    }
    
    <span class="comment">// 高能预警！非常重要的方法，fis release 就靠这个方法走江湖了</span>
    <span class="keyword">function</span> release(opt){
        <span class="comment">// ...</span>
    }
    
    <span class="comment">// 可以看到有很多配置参数，每个参数的作用可参考对应的描述，或者看官方文档</span>
    commander
        .option(<span class="string">'-d, --dest <names>'</span>, <span class="string">'release output destination'</span>, String, <span class="string">'preview'</span>)
        .option(<span class="string">'-m, --md5 [level]'</span>, <span class="string">'md5 release option'</span>, Number)
        .option(<span class="string">'-D, --domains'</span>, <span class="string">'add domain name'</span>, Boolean, <span class="keyword">false</span>)
        .option(<span class="string">'-l, --lint'</span>, <span class="string">'with lint'</span>, Boolean, <span class="keyword">false</span>)
        .option(<span class="string">'-t, --test'</span>, <span class="string">'with unit testing'</span>, Boolean, <span class="keyword">false</span>)
        .option(<span class="string">'-o, --optimize'</span>, <span class="string">'with optimizing'</span>, Boolean, <span class="keyword">false</span>)
        .option(<span class="string">'-p, --pack'</span>, <span class="string">'with package'</span>, Boolean, <span class="keyword">true</span>)
        .option(<span class="string">'-w, --watch'</span>, <span class="string">'monitor the changes of project'</span>)
        .option(<span class="string">'-L, --live'</span>, <span class="string">'automatically reload your browser'</span>)
        .option(<span class="string">'-c, --clean'</span>, <span class="string">'clean compile cache'</span>, Boolean, <span class="keyword">false</span>)
        .option(<span class="string">'-r, --root <path>'</span>, <span class="string">'set project root'</span>)
        .option(<span class="string">'-f, --file <filename>'</span>, <span class="string">'set fis-conf file'</span>)
        .option(<span class="string">'-u, --unique'</span>, <span class="string">'use unique compile caching'</span>, Boolean, <span class="keyword">false</span>)
        .option(<span class="string">'--verbose'</span>, <span class="string">'enable verbose output'</span>, Boolean, <span class="keyword">false</span>)
        .action(<span class="keyword">function</span>(){
            
            <span class="comment">// 省略一大堆代码</span>
            
            <span class="comment">// fis release 的两个核心分支，根据是否有加入 --watch 进行区分</span>
            <span class="keyword">if</span>(options.watch){
                watch(options); <span class="comment">// 有 --watch 参数</span>
            } <span class="keyword">else</span> {
                release(options);   <span class="comment">// 这里这里！重点关注！没有 --watch 参数</span>
            }
        });
};
 
 
```

## `release(options);` 做了些什么

用伪代码将逻辑抽象下，主要分为四个步骤。虽然最后一步才是本片文章想要重点讲述的，不过前三步是第四步的基础，所以这里还是花点篇幅介绍下。

```html
findFisConf();
<span class="comment">// 找到当前项目的fis-conf.js</span>;
setProjectRoot();
<span class="comment">
    // 设置项目根路径，需要编译的源文件就在这个根路径下
</span>;
mergeFisConf();
<span class="comment">// 导入项目自定义配置</span>;
readSourcesAndReleaseToDest(options);
<span class="comment">// 将项目编译到默认的目录下</span>;
```

下面简单对上面几个步骤进行一一讲解。

### findFisConf() + setProjectRoot()

由于这两步之间存在比较紧密的联系，所以这里就放一起讲。在没有任何运行参数的情况下，比较简单

1.  从命令运行时所在的工作目录开始，向上逐级查找 `fis-conf.js`，直到找到位置
2.  如果找到 `fis-conf.js`，则以它为项目配置文件。同时，将项目的根路径设置为 `fis-conf.js` 所在的目录。
3.  如果没有找到 `fis-conf.js`，则采用默认项目配置。同时，将项目的根路径，设置为当前命令运行时所在的工作目录。

从 `fis release` 的支持的配置参数可以知道，可以分别通过：

1.  `--file`：指定 `fis-conf.js` 的路径（比如多个项目公用编译配置）
2.  `--root`：指定项目根路径（在 A 工作目录，编译 B 工作目录）

由本小节前面的介绍得知，`--file`、`--root` 两个配置参数之间是存在联系的，有可能同时存在。下面用伪代码来说明下

```html
<span class="keyword">if</span>(options.root){
    
    <span class="keyword">if</span>(options.file){
        <span class="comment">// 项目根路径，为 options.root 指定的路径</span>
        <span class="comment">// fis-conf.js路径，为 options.file 指定的路径</span>
    }<span class="keyword">else</span>{
        <span class="comment">// 项目根路径，为 options.root 指定的路径</span>
        <span class="comment">// fis-conf.js路径，为 options.root/fis-conf.js </span>
    }
}<span class="keyword">else</span>{
    
    <span class="keyword">if</span>(options.file){
        <span class="comment">// fis-conf.js路径，为 options.file 指定的路径</span>
        <span class="comment">// 项目根路径，为 fis-conf.js 所在的目录        </span>
    }<span class="keyword">else</span>{
        <span class="comment">// fis-conf.js路径，为 逐层向上遍历后，找到的 fis-conf.js 路径</span>
        <span class="comment">// 项目根路径，为 fis-conf.js 所在的目录</span>
    }
}
 
```

### mergeFisConf()

合并项目配置文件。从源码可以清楚的看到，包含两个步骤：

1.  为 `fis-conf.js` 创建缓存。除了配置文件，FIS 还会为项目的所有源文件建立缓存，实现增量编译，加快编译速度。缓存的细节后面再讲，这里知道有这么回事就行。
2.  合并项目自定义配置

```html
<span class="comment">// 如果找到了 fis-conf.js</span>
<span class="keyword">if</span>(conf){
    <span class="keyword">var</span> cache = fis.cache(conf, <span class="string">'conf'</span>); 
    <span class="keyword">if</span>(!cache.revert()){
        options.clean = <span class="keyword">true</span>;
        cache.save();
    }
    <span class="keyword">require</span>(conf);  <span class="comment">// 加载 fis-conf.js，其实就是合并配置</span>
} <span class="keyword">else</span> {
    <span class="comment">// 还是没有找到 fis-conf.js</span>
    fis.log.warning(<span class="string">'missing config file ['</span> + filename + <span class="string">']'</span>);
}
 
```

### readSourcesAndReleaseToDest()

通过这个死长的伪函数名，就知道这个步骤的作用了，非常关键。根据当前项目配置，读取项目的源文件，编译后输出到目标目录。

编译过程的细节，下一节会讲到。

## 项目编译大致流程

项目编译发布的细节，主要是在 `release` 这个方法里完成。细节非常的多，主要在 `fis.release()`这个调用里完成，基本上用到了 `fis-kernel` 里所有的模块，如 `release`、`compile`、`cache` 等。

1.  读取项目源文件，并将每个源文件抽象为一个 File 实例。
2.  读取项目配置，并根据项目配置，初始化 File 实例。
3.  为 File 实例建立编译缓存，提高编译速度。
4.  根据文件类型、配置等编译源文件。（File 实例各种属性的修改）
5.  项目部署：将编译结果实际写到本地磁盘。

伪代码流程如下：`fis-command-release/release.js`

```html
<span class="keyword">var</span> collection = {};    <span class="comment">// 跟total一样，key=>value 为 “编译的源文件路径”＝》"对应的file对象"</span>
    <span class="keyword">var</span> total = {};
    <span class="keyword">var</span> deploy = <span class="keyword">require</span>(<span class="string">'./lib/deploy.js'</span>);    <span class="comment">// 文件部署模块，完成从 src -> dest 的最后一棒</span>
    
<span class="keyword">function</span> release(opt){
    
    opt.beforeEach = <span class="keyword">function</span>(file){
        <span class="comment">// 用compile模块编译源文件前调用，往 total 上挂 key=>value</span>
        total[file.subpath] = file;
    };
    opt.afterEach = <span class="keyword">function</span>(file){
        <span class="comment">// 用compile模块编译源文件后调用，往 collection 上挂 key=>value</span>
        collection[file.subpath] = file;
    };
    
    opt.beforeCompile = <span class="keyword">function</span>(file){
        <span class="comment">// 在compile内部，对源文件进行编译前调用（好绕。。。）</span>
        collection[file.subpath] = file;        
    };
    
    <span class="keyword">try</span> {
        <span class="comment">//release</span>
        <span class="comment">// 在fis-kernel里，fis.release = require('./lib/release.js');</span>
        <span class="comment">// 在fis.release里完成除了最终部署之外的文件编译操作，比如文件标准化等</span>
        fis.release(opt, <span class="keyword">function</span>(ret){
            
            deploy(opt, collection, total); <span class="comment">// 项目部署（本例子里特指将编译后的文件写到某个特定的路径下）</span>
        });
    } <span class="keyword">catch</span>(e) {
        <span class="comment">// 异常处理，暂时忽略</span>
    }
}
 
```

## 至于 `fis.release()`

前面说了，细节非常多，后续文章继续展开。。。

文章: casperchen


<!-- {% endraw %} - for jekyll -->