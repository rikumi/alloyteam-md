---
title: 哈希函数介绍
date: 2017-05-15
author: lin, dongpeng
source_link: http://www.alloyteam.com/2017/05/hash-functions-introduction/
---

<!-- {% raw %} - for jekyll -->

# 哈希函数介绍

## 什么是哈希

在记录的关键字与记录的存储地址之间建立的一种对应关系叫哈希函数。  
哈希函数就是一种**映射**，是从关键字到存储地址的映射。  
通常，包含哈希函数的算法的算法复杂度都假设为 O (1)，这就是为什么在哈希表中搜索数据的时间复杂度会被认为是 "平均为 O (1) 的复杂度".

## 基本概念

在讲解具体内容前，首先我们要清楚以下几个概念：  
1. 冲突（碰撞）  
对于不同的关键字 ki、kj，若 ki != kj，但 H (ki) = H (kj) 的现象叫**冲突**(collision) ，即不同的输入却有相同的输出。我们应该尽量避免冲突，因为冲突不仅会使我们在查找的时候效率变慢，还甚至会被攻击者利用从而大量消耗系统资源。  
至于冲突的解决方案有很多种，具体可以参考这篇[哈希表针对冲突的两种方式优缺点是什么？](https://www.zhihu.com/question/47258682)。

## 哈希函数的应用

哈希算法广泛应用于很多场景，例如安全加密和数据结构中哈希表的查找，布隆过滤器和负载均衡（一致性哈希）等等。  
下面介绍几个常用的哈希算法。

### 加密哈希算法

在安全方面应用主要体现在以下三个方面：  
（1) 文件校验  
（2) 数字签名  
（3) 鉴权协议

在 nodejs 中我们可以使用原生 crypto 模块对数据进行加密，crypto.getHashes () 查看支持的哈希算法。

```javascript
const crypto = require("crypto");
console.log(crypto.getHashes());
/*
[ 'DSA',
  'DSA-SHA',
  'DSA-SHA1',
  'DSA-SHA1-old',
  'RSA-MD4',
  'RSA-MD5',
  'RSA-MDC2',
  'RSA-RIPEMD160',
  'RSA-SHA',
  'RSA-SHA1',
  'RSA-SHA1-2',
  'RSA-SHA224',
  'RSA-SHA256',
  'RSA-SHA384',
  'RSA-SHA512',
  'dsaEncryption',
  'dsaWithSHA',
  'dsaWithSHA1',
  'dss1',
  'ecdsa-with-SHA1',
  'md4',
  'md4WithRSAEncryption',
  'md5',
  'md5WithRSAEncryption',
  'mdc2',
  'mdc2WithRSA',
  'ripemd',
  'ripemd160',
  'ripemd160WithRSA',
  'rmd160',
  'sha',
  'sha1',
  'sha1WithRSAEncryption',
  'sha224',
  'sha224WithRSAEncryption',
  'sha256',
  'sha256WithRSAEncryption',
  'sha384',
  'sha384WithRSAEncryption',
  'sha512',
  'sha512WithRSAEncryption',
  'shaWithRSAEncryption',
  'ssl2-md5',
  'ssl3-md5',
  'ssl3-sha1',
  'whirlpool' ]
*/
```

除了我们常用的 md5，sha-1，sha-2 族外，还有像 DSA-SHA1，RSA-SHA1，sha1WithRSAEncryption，其中 sha1WithRSAEncryption 和 RSA-SHA1 等价，DSA 和 RSA 都是加密算法，DSA 和 RSA 的区别在于，**DSA 用于签名，而 RSA 可用于签名和加密**。

下面简单介绍下几种比较常用的加密哈希算法：

1、 MD5  
MD5 即 Message-Digest Algorithm 5（信息 - 摘要算法 5），用于确保信息传输完整一致。是计算机广泛使用的杂凑算法之一，主流编程语言普遍已有 MD5 实现。将数据（如汉字）运算为另一固定长度值，是杂凑算法的基础原理，MD5 的前身有 MD2、MD3 和 MD4。  
MD5 是输入不定长度信息，输出固定长度 128-bits 的算法。经过程序流程，生成四个 32 位数据，最后联合起来成为一个 128-bits 散列。基本方式为，求余、取余、调整长度、与链接变�


<!-- {% endraw %} - for jekyll -->