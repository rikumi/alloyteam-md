---
title: Javascript,C++,C#,Java,Lua,Python,Ruby,F# 语言渲染性能评测
date: 2012-06-08
author: TAT.Kinvix
source_link: http://www.alloyteam.com/2012/06/javascriptc-speed/
---

<!-- {% raw %} - for jekyll -->

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/06/035346uKN.jpg)  
512x512 像素，每像素 10000 个采样，Intel C++ OpenMP 版本渲染时间为 18 分 36 秒。估计 Ruby 版本約需 351 天。

本人陆续移植了 C++ 代码至 Java、JavaScript、Lua、Python 和 Ruby，赵姐夫亦尝试了 F#。本文提供[**测试源代码**](http://files.cnblogs.com/miloyip/smallpt20100706.zip)、测试结果、简单分析、以及个人体会。

## 声明

首先，为免误会，再次重申，本测试有其局限，只能测试某一应用、某一实现的结果，并不能反映编程语言及其运行时的综合性能，亦无意尝试这样做。而实验环境也只限于某机器、某操作系统上，并不全面。而且，本测试只提供运行时间的结果，不考虑、不比较语言 / 平台间的技术性和非技术性优缺点，也没有测试运行期内存。世界上的软件应用林林总总，性能需求也完全不同，本测试只供参考。

由于本人第一次使用 Python 和 Ruby，若代码有不当之处，敬请告之。当然也非常乐见其他意见。

## 测试内容

本文测试程序为[一个全局光照渲染器](http://kevinbeason.com/smallpt/)，是一个 CPU 运算密集的控制台应用程序 (console application)，功能详见[前文](http://www.cnblogs.com/miloyip/archive/2010/06/23/cpp_vs_cs_GI.html)。在前文刊出后，本人进行了一点 profiling、优化，并把代码重新格式化。本渲染器除了有大量数学运算，亦会产生大量临时对象，并进行极多的方法调用 (非虚函数)。本测试有别于人工合成的测试 (synthetic tests，例如个别测试运算、字串操作、输入输出等)，是一个有实际用途的程序。

移植时尽量维持原代码的逻辑，主要采用面向对象范式。优化方面，不进行人手内联函数 (inline function)，但优化了一些不必要的重复运算。

## 测试配置

-   硬件: Intel Core i7 [920@2.67Ghz](mailto:920@2.67ghz)(4 core, HyperThread), 12GB RAM
-   操作系统: Microsoft Windows 7 64-bit

<table id="t-d:" width="100%" border="1" cellspacing="0" cellpadding="3"><tbody><tr><td width="20%">测试名称</td><td width="40%">编译器/解译器</td><td width="40%">编译/运行选项</td></tr><tr><td width="20%">VC++</td><td width="40%">Visual C++ 2008 (32-bit)</td><td width="40%">/Ox /Ob2 /Oi /Ot /GL /FD /MD /GS- /Gy /arch:SSE /fp:fast</td></tr><tr><td width="20%">VC++_OpenMP</td><td width="40%">Visual C++ 2008 (32-bit)</td><td width="40%">/Ox /Ob2 /Oi /Ot /GL /FD /MD /GS- /Gy /arch:SSE /fp:fast /openmp</td></tr><tr><td width="20%">IC++</td><td width="40%">Intel C++ Compiler (32-bit)</td><td width="40%">/Ox /Og /Ob2 /Oi /Ot /Qipo /GA /MD /GS- /Gy /arch:SSE2 /fp:fast /Zi /QxHost</td></tr><tr><td width="20%">IC++_OpenMP</td><td width="40%">Intel C++ Compiler (32-bit)</td><td width="40%">/Ox /Og /Ob2 /Oi /Ot /Qipo /GA /MD /GS- /Gy /arch:SSE2 /fp:fast /Zi /QxHost /Qopenmp</td></tr><tr><td width="20%">GCC</td><td width="40%">GCC 4.3.4 in Cygwin (32-bit)</td><td width="40%">-O3 -march=native -ffast-math</td></tr><tr><td width="20%">GCC_OpenMP</td><td width="40%">GCC 4.3.4 in Cygwin (32-bit)</td><td width="40%">-O3 -march=native -ffast-math -fopenmp</td></tr><tr><td width="20%">C++/CLI</td><td width="40%">Visual C++ 2008 (32-bit), .Net Framework 3.5</td><td width="40%">/Ox /Ob2 /Oi /Ot /GL /FD /MD /GS- /fp:fast /Zi /clr /TP</td></tr><tr><td width="20%">C++/CLI_OpenMP</td><td width="40%">Visual C++ 2008 (32-bit), .Net Framework 3.5</td><td width="40%">/Ox /Ob2 /Oi /Ot /GL /FD /MD /GS- /fp:fast /Zi /clr /TP /openmp</td></tr><tr><td width="20%">C#</td><td width="40%">Visual C# 2008 (32-bit), .Net Framework 3.5</td><td width="40%"></td></tr><tr><td width="20%">*C#_outref</td><td width="40%">Visual C# 2008 (32-bit), .Net Framework 3.5</td><td width="40%"></td></tr><tr><td width="20%">F#</td><td width="40%">F# 2.0 (32-bit), .Net Framework 3.5</td><td width="40%"></td></tr><tr><td width="20%">Java</td><td width="40%">Java SE 1.6.0_17</td><td width="40%">-server</td></tr><tr><td width="20%">JsChrome</td><td width="40%">Chrome 5.0.375.86</td><td width="40%"></td></tr><tr><td width="20%">JsFirefox</td><td width="40%">Firefox 3.6</td><td width="40%"></td></tr><tr><td width="20%">LuaJIT</td><td width="40%">LuaJIT 2.0.0-beta4 (32-bit)</td><td width="40%"></td></tr><tr><td width="20%">Lua</td><td width="40%">LuaJIT (32-bit)</td><td width="40%">-joff</td></tr><tr><td width="20%">Python</td><td width="40%">Python 3.1.2 (32-bit)</td><td width="40%"></td></tr><tr><td width="20%">*IronPython</td><td width="40%">IronPython 2.6 for .Net 4</td><td width="40%"></td></tr><tr><td width="20%">*Jython</td><td width="40%">Jython 2.5.1</td><td width="40%"></td></tr><tr><td width="20%">Ruby</td><td width="40%">Ruby 1.9.1p378</td><td width="40%"></td></tr></tbody></table>

\* 见本文最后的 "7. 更新" 一节

渲染的解像度为 256x256，每象素作 100 次采样。

## 结果及分析

下表中预设的相对时间以最快的单线程测试 (IC++) 作基准，用鼠标按列可改变基准。由于 Ruby 运行时间太长，只每象素作 4 次采样，把时间乘上 25。另外，因为各测试的渲染时间相差很远，所以用了两个棒形图去显示数据，分别显示时间少于 4000 秒和少于 60 秒的测试 (Ruby 是 4000 秒以外，不予显示)。

<table cellspacing="0"><tbody><tr><td>Test</td><td>Time(sec)</td><td>Relative time</td></tr><tr><td>IC++_OpenMP</td><td>2.861</td><td>0.19x</td></tr><tr><td>VC++_OpenMP</td><td>3.140</td><td>0.21x</td></tr><tr><td>GCC_OpenMP</td><td>3.359</td><td>0.23x</td></tr><tr><td>C++/CLI_OpenMP</td><td>5.147</td><td>0.35x</td></tr><tr><td>IC++</td><td>14.761</td><td>1.00x</td></tr><tr><td>VC++</td><td>17.632</td><td>1.19x</td></tr><tr><td>GCC</td><td>19.500</td><td>1.32x</td></tr><tr><td>C++/CLI</td><td>27.634</td><td>1.87x</td></tr><tr><td>Java</td><td>30.527</td><td>2.07x</td></tr><tr><td>C#_outref</td><td>44.220</td><td>3.00x</td></tr><tr><td>F#</td><td>47.172</td><td>3.20x</td></tr><tr><td>C#</td><td>48.194</td><td>3.26x</td></tr><tr><td>JsChrome</td><td>237.880</td><td>16.12x</td></tr><tr><td>LuaJIT</td><td>829.777</td><td>56.21x</td></tr><tr><td>Lua</td><td>1,227.656</td><td>83.17x</td></tr><tr><td>IronPython</td><td>2,921.573</td><td>197.93x</td></tr><tr><td>JsFirefox</td><td>3,588.778</td><td>243.13x</td></tr><tr><td>Python</td><td>3,920.556</td><td>265.60x</td></tr><tr><td>Jython</td><td>6,211.550</td><td>420.81x</td></tr><tr><td>Ruby</td><td>77,859.653</td><td>5,274.69x</td></tr></tbody></table>

[![](http://www.alloyteam.com/wp-content/uploads/2012/06/1111.jpg "性能测试 2")](http://www.alloyteam.com/wp-content/uploads/2012/06/1111.jpg)

[![](http://www.alloyteam.com/wp-content/uploads/2012/06/2222.jpg "性能测试 1")](http://www.alloyteam.com/wp-content/uploads/2012/06/2222.jpg)

## C++/.Net/Java 组别

静态语言和动态语言在此测试下的性能不在同一数量级。先比较静态语言。

C++ 和.Net 的测试结果和上一篇博文相若，而 C# 和 F# 无显著区别。但是，C++/CLI 虽然同样产生 IL，于括管的.Net 平台上执行，其渲染时间却只是 C#/F# 的 55% 左右。为什么呢？使用 ildasm 去反汇编 C++/CLI 和 C# 的可执行文件后，可以发现，程序的热点函数 Sphere.Intersect () 在两个版本中，C++/CLI 版本的代码大小 (code size) 为 201 字节， C# 则为 125 字节！ C++/CLI 版本在编译时，已把函数内所有 Vec 类的方法调用全部内联，而 C# 版本则使用 callvirt 调用 Vec 的方法。估计 JIT 没有把这函数进行内联，做成这个性能差异。另外，C++/CLI 版本使用了值类型，并使用指针 (代码中为引用) 作参数传送。若把 C# 的版本的 Vec 方法改写为:

<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div></td><td><div><div><code>//class Vec</code></div><div><code>//{</code></div><div><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>//public static Vec operator +(Vec a, Vec b)</code></div><div><code>//}</code></div><div></div><div><code>struct</code> <code>Vec</code></div><div><code>{</code></div><div><code>&nbsp;&nbsp;&nbsp;&nbsp;</code><code>void</code> <code>Add(</code><code>ref</code> <code>Vec a, </code><code>ref</code> <code>Vec b, </code><code>out</code> <code>Vec c);</code></div><div><code>}</code></div></div></td></tr></tbody></table>

那么，struct 不用 GC，同时 ref/out 不用复制，其性能会比较高。但是代码会变得很难看:

<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div></td><td><div><div><code>// 原来用运算符重载 (operator overloading):</code></div><div><code>a = b * c + d;</code></div><div></div><div><code>// 改用 ref/out</code></div><div><code>Vec e;</code></div><div><code>Vec.Mul(</code><code>ref</code> <code>b, </code><code>ref</code><code>, c, </code><code>out</code> <code>e);</code></div><div><code>Vec.Add(</code><code>ref</code> <code>e, </code><code>ref</code> <code>d, </code><code>out</code> <code>a);</code></div></div></td></tr></tbody></table>

为了维持让语言 "正常" 的使用方法，本实验不采用这种 API 风格 (更新：加入了 C#\_outref 测试，詳見文末)。

然而，托管代码 (C++/CLI) 的渲染时间，仅为原生非括管代码 (IC++) 的 1.91 倍，个人觉得.Net 的 JIT 已经非常不错。

另一方面，Java 的性能表现非常突出，只比 C++/CLI 稍慢一点，Java 版本的渲染时间为 C#/F# 的 65% 左右。以前一直认为，C# 不少设计会使其性能高于 Java，例如 C# 的方法预设为非虚，Java 则预设为虚；又例如 C# 支持 struct 作值类型 (value type)，Java 则只有 class 引用类型 (reference type)，后者必须使用 GC。但是，这个测试显示，Java VM 应该在 JIT 中做了大量优化，估计也应用了内联，才能使其性能逼近 C++/CLI。

纯 C++ 方面，Intel C++ 编译器最快，Visual C++ 慢一点点 (1.19x)，GCC 再慢一点点 (1.32x)。这结果符合本人预期。 Intel C++ 的 OpenMP 版本和单线程比较，达 5.16 加速比 (speedup)，对于 4 核 Hyper Threading 来说算是不错的结果。读者若有兴趣，也可以自行测试 C# 4.0 的并行新特性。

### 动态语言组别

首先，要说一句，Google 太强了，难以想像 JsChome 的渲染时间仅是 IC++ 的 16.12 倍，C# 的 4.94 倍。我有信心用 JavaScript 继续写图形、物理方面的博文了。

以下比较各动态语言的相对时间，以 JsChrome 为基准。 Chrome 的 V8 JavaScript 引擎 (1.00x) 大幅抛离 Firefox 的 SpiderMonkey 引擎 (15.09x)。而 LuaJIT (3.49x) 和 Lua (5.16x) 则排第二和第三名。 Lua 的 JIT 版本是没有 JIT 的 68%，并没有想像中的快，但是也比 Python (16.48x) 快得多。曾听说过 Ruby 有效能问题，没想到问题竟然如此严重 (327.31x)，其渲染时间差不多是 Python 的 20 倍。

我认为，本实验中，不同语言的性能差异，并非在于数值运算，而是对象生成及函数调用。我使用 Python 内建的 profiling 功能:

<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div>1</div></td><td><div><div><code>python -m profile smallpt.py</code></div></div></td></tr></tbody></table>

从结果发现，Vec 类共产生约 15 亿个实例，Vec 的方法调用约 17.5 亿次，intersect () 共调用 5.7 亿次，产生随机数 5.7 亿个，radiance () 调用 (即追踪的路径线段) 6.5 百万次。这些庞大数字，放大了对象生成和函数调用的常数开销 (overhead)。

## 结语

也许本博文的意义不大 (yet-another-unfair-biased-performance-comparison-among-programming-languages)，但对本人而言，此次实验加深了对各种语言性能的了解，或应该是消除了一些误解。简单总括运行性能方面的体验和感想:

1.  C++ 和 VM 类静态语言可以大约只差 2~4 倍，JVM 和 CLR 差异不大。
2.  C++ 和动态语言之比，则可以是 15~5000 倍，不同动态语言的差异很大。
3.  一直以为 Lua (JIT) 会是最快的通用脚本语言，没想到此测试中败给 JavaScript (V8)，或许应该多点研究嵌入 V8 引擎 (SWIG 能支持就最理想了)。
4.  以为 Python 和 Ruby 的性能相差不远，但测试结果两者大相径庭。暂时不太了解 Ruby 的特长，或许之后再研究其优点是否能盖过其性能问题。

最后建议读者，若要为某应用挑选语言，又要顾及性能，那么应该自己做实验去比较。不要盲目相信一些流言或评测 (包括本文)。

## 更新

-   2010/7/7: 新增的 C#\_outref 测试，按 [noremorse](http://www.cnblogs.com/noremorse/) 的[建议](http://www.cnblogs.com/miloyip/archive/2010/07/07/%20//www.cnblogs.com/miloyip/archive/2010/07/07/languages_brawl_GI.html#1865842)，把 Vec 和 Ray 变作 struct，所有函数传送这两种对象改为 ref/out。 [源代码](http://files.cnblogs.com/miloyip/smallpt_csref20100707.zip)。
-   2010/7/8: 新增 IronPython 和 Jython。
-   2010/7/8: 园友猫粮撰文 [《AS3 的光线跟踪极限测试》，看来 AS3 性能不太好。](http://bbs.9ria.com/thread-58209-1-1.html)
-   [2010/7/10: 园友 Domslab 撰文](http://bbs.9ria.com/thread-58209-1-1.html)《对《C++/C#/F#/Java/JS/Lua/Python/Ruby 渲染比试》一文的补充 —— 增加 Mono 测试》，比较了 gcc/mono C#/Java 在 Windows/Linux 的性能。
-   2010/7/11: 园友 noremorse 撰文 [《Swifter C# 之 inline 还是不 inline，这是个问题》](http://www.cnblogs.com/noremorse/archive/2010/07/10/inline_or_not.html)，以本例研究.Net Runtime 的内联机制。

出处：Milo 的游戏开发


<!-- {% endraw %} - for jekyll -->