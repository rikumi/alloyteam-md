---
title: 自动生成 HTML5 离线 App 应用的 Manifest
date: 2012-11-21
author: TAT.iAzrael
source_link: http://www.alloyteam.com/2012/11/automatically-generate-html5-offline-application-manifest/
---

<!-- {% raw %} - for jekyll -->

## 碎碎念

HTML5 的离线应用（[Offline Application](http://www.w3.org/TR/offline-webapps/)）已经广为人知了。无论是用来给 WebApp 提供离线使用的功能，还是仅仅用来加速页面加载，离线应用都是个让人很爽的特性。

离线应用的原理什么的就不在赘述了，google 一下就有很多介绍。这里主要谈下怎么生成离线应用的配置文件。离线应用需要根据服务器上的 manifest 配置来决定时候要离线和更新，以及判断有哪些文件需要离线。

在小型 WebApp 中，可以人工一个个的添加文件路径，理论上是没啥大问题。当项目大了之后，会引用很多资源、图片等，特别是图片，必须人工从 css 文件中找出所有 url 添加到 manifest 中。个人觉得这是件相当无聊和浪费生命的事。我自己一直在坚持着：凡是程序能自动完成的工作，绝对不人工完成。

因此，写了这个自动生成 manifest 的脚本 ioffline。

本项目托管在 Githup 上（<https://github.com/iazrael/ioffline>），感兴趣的同学可以用用。其原理很简单，根据传入的 html 文件，分析里面的 js 和 css 引用，并把 css 里面的所有图片 url 都提取出来，写入到 manifest 中。这样只要发布的时候执行一下这个脚本，就可以完成 manifest 的编写，还能自动生成个时间戳，让客户端去更新离线缓存。是不是很爽咧？^\_^

## 使用方法

1. 安装

    npm install ioffline

2. 配置

创建个配置文件 manifest.config.json，配置项如下：

```javascript
{
	//css 文件中, 如果图片url是写了绝对路径, 也就是说 html 跟 css 或 图片不在一个域名下
	//就要设置下面这个属性
	"linkPrefix": "http://cdn.xxx.com/",//optional
	"manifestSuffix": "manifest", // optional
	"outputRoot": "./output/", //optional 默认在当前目录输出 "./", 建议填入
	"cache": { //required 必须
		"offline": [//offline 是 输出的manifest的名字,跟 manifestSuffix 组合成文件名
			"index.html"
		],
		"offline2": [
			"index.html",
			"main.html"
		]
	},
	"network": [  "*"  ],//optional
	"fallback": [ // optional
		"/ fallback.html"
	]
}
```

配置信息中有很多都是可选的，所以可以只用最简配置：

```javascript
{
	"cache": { 
		"offline": [
			"index.html"
		],
		"offline2": [
			"index.html",
			"main.html"
		]
	}
}
```

**PS：输出目录 “outputRoot” 最好填一下，否者会在当前目录输出，可能会替换掉原文件。**

3. 使用

    require('ioffline').generate('./manifest.config.json');
    //或者
    require('ioffline').generate({ /*一些配置*/ });

好了，把麻烦事抛给电脑，现在可以尽情的去玩咯。哇哈哈哈～～


<!-- {% endraw %} - for jekyll -->