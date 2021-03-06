---
title: Html5 音乐播放器（一）
date: 2011-10-31
author: TAT.pel
source_link: http://www.alloyteam.com/2011/10/html5-player-part1/
---

<!-- {% raw %} - for jekyll -->

过去在网页上播放声音一般使用 wmp（windows media player）控件，但是 wmp 控件提供的 js 接口非常有限，更致命的是 IE only。如果不想接受 wmp 的界面，又或者想要跨平台，只能借助于 flash 了。现在 html5 标准已经原生支持音频播放，并且各大浏览器都不同程度地实现了。  
![](http://alloyteam.com/wp-content/uploads/2011/10/audio-player-img1.png)  

要做一个最简单的播放器，我们首先需要一些可操作的元素，譬如：一个播放按钮、一个播放进度条、一个音量进度条

```html
<div id="container">
    <div id="title"></div>
    <div id="time"></div>
    <input id="range" type="range" min="0" max="1" step="any" value="0" />
    <a id="play" class="button" href="###"></a>
    音量:
    <input id="volume" type="range" min="0" max="1" step="any" value="0.5" />
</div>;
```

其中的 input\[type=range] 是 html5 新增的表单控件，后续可以在自定义 UI 的时候替换掉，不在本文探讨之列。

回到正题，dom 准备好了，可以初始化音频了。在 html5 里，音频资源可以用 audio 标签插入，这里没有直接写到 html 里，一则是因为需要判断浏览器是否支持，二则是写在 html 里的 audio 标签必须带有 src 属性，这样就不能达到先绑定事件，后加载的目的。要通过 js 创建 audio 对象，可以使用 new Audio ()，就像 new Image () 一样。判断浏览器是否支持播放 mp3，可以使用以下条件：

```javascript
window["Audio"] && new Audio().canPlayType("audio/mpeg");
```

“audio/mpeg” 是 mp3 的 MINE type，canPlayType 有三个可能的返回值：probably、maybe、空字符串，代表的情况跟字母意思一样，空字符串对应不支持的格式。不过就我看来，浏览器还是相当谨慎，到目前为止，我还没见过它说 “probably”，而总是羞涩地返回 “maybe”。

对象创建好了就要绑定事件了，我们需要对以下事件进行侦听：

-   canplay —— 媒体文件加载到能够开始播放
-   play —— 将要开始播放
-   pause —— 媒体暂停播放
-   ended —— 播放到媒体末尾
-   error —— 在加载过程中发生错误
-   timeupdate —— 播放位置发生变化，包括正常播放和手动改变播放进度

绑定完事件，就可以加载 mp3 了，这里非常简单，直接对 audio 对象的 src 赋值就可以了。大部分浏览器在改变 src 之后会自动加载新的音频文件（标准也是这样规定的），但是如果你想兼容 mobileSafari，你还需要手动调用 audio 对象的 load 方法。

说得差不多了，直接看代码和 [demo](http://alloyteam.com/wp-content/uploads/2011/10/audio-player-demo1.html) 吧：

```javascript
function initAudio() {
    var _audio;
    if (audioEl) {
        return;
    } //如果存在,说明已经初始化
    if (window["Audio"] && (_audio = new Audio()).canPlayType("audio/mpeg")) {
        _audio.addEventListener("canplay", onCanPlay, false);
        _audio.addEventListener("play", onPlay, false);
        _audio.addEventListener("pause", onPause, false);
        _audio.addEventListener("ended", onEnded, false);
        _audio.addEventListener("error", onError, false);
        _audio.addEventListener("timeupdate", onTimeUpdate, false);
        _audio.volume = 0.5;
        document.getElementById("container").appendChild(_audio);
        audioEl = _audio;
        titleEl = document.getElementById("title");
        timeEl = document.getElementById("time");
        rangeEl = document.getElementById("range");
        playEl = document.getElementById("play");
        volumeEl = document.getElementById("volume");
        volumeEl.addEventListener("change", onVolumeChange, false);
        rangeEl.addEventListener("change", onRangeChange, false);
        playEl.addEventListener("click", onPlayButtonClick, false);
    } else {
        alert("Oops, nice browser.");
        return;
    }
}
function loadAudio(url, title) {
    if (!audioEl) {
        return;
    }
    var name =
        title || url.replace(/^.*\//, "").replace(/[#\?].*$/, "") || "Unknown";
    titleEl.innerHTML = name;
    rangeEl.value = 0;
    rangeEl.disabled = true;
    timeEl.innerHTML = "--:-- / --:--";
    playEl.innerHTML = "加载中";
    audioEl.autoplay = true;
    audioEl.src = url;
    //audioEl.load();
}
function onCanPlay() {
    rangeEl.disabled = false;
}
function onPlay() {
    playEl.innerHTML = "暂停";
}
function onPause() {
    playEl.innerHTML = "播放";
}
function onEnded() {
    audioEl.pause();
    audioEl.currentTime = 0;
}
function onError() {
    rangeEl.disabled = true;
    titleEl.innerHTML =
        '<span style="color:red">加载错误:' + titleEl.innerHTML + "</span>";
    playEl.innerHTML = "已停止";
}
function onTimeUpdate() {
    var pos = audioEl.currentTime,
        dora = audioEl.duration;
    timeEl.innerHTML = formatTime(pos) + " / " + formatTime(dora);
    //console.info(pos,dora);
    if (isFinite(dora) && dora > 0) {
        rangeEl.value = pos / dora;
    }
}
function onVolumeChange() {
    if (!audioEl) {
        return;
    }
    audioEl.volume = volumeEl.value;
}
function onRangeChange() {
    if (!audioEl) {
        return;
    }
    var buf = audioEl.buffered.length ? audioEl.buffered.end(0) : 0,
        dora = audioEl.duration;
    if (isFinite(dora) && dora > 0) {
        var value = rangeEl.value,
            pos = value * dora;
        if (pos > buf) {
            pos = buf;
        }
        audioEl.currentTime = pos;
    }
}
function onPlayButtonClick() {
    if (!audioEl) {
        return;
    }
    if (audioEl.error) {
        //加载错误
        return;
    } else if (audioEl.readyState < 2) {
        //还没可以播放
        audioEl.autoplay ^= true; //切换是否autoplay
    } else if (audioEl.paused) {
        audioEl.play();
    } else {
        audioEl.pause();
    }
}
```


<!-- {% endraw %} - for jekyll -->