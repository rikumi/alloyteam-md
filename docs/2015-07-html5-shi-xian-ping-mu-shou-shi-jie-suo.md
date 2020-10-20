---
title: HTML5 实现屏幕手势解锁
date: 2015-07-17
author: TAT.tennylv
source_link: http://www.alloyteam.com/2015/07/html5-shi-xian-ping-mu-shou-shi-jie-suo/
---

<!-- {% raw %} - for jekyll -->

**效果展示**

![](http://7jpp2v.com1.z0.glb.clouddn.com/testh5lock.gif)  

**实现原理** 利用 HTML5 的 canvas，将解锁的圈圈划出，利用 touch 事件解锁这些圈圈，直接看代码。

```c
function createCircle() {// 创建解锁点的坐标，根据canvas的大小来平均分配半径
 
        var n = chooseType;// 画出n*n的矩阵 
        lastPoint = [];
        arr = [];
        restPoint = [];
        r = ctx.canvas.width / (2 + 4 * n);// 公式计算 半径和canvas的大小有关
        for (var i = 0 ; i &lt; n ; i++) {
            for (var j = 0 ; j &lt; n ; j++) {
                arr.push({
                    x: j * 4 * r + 3 * r,
                    y: i * 4 * r + 3 * r
                });
                restPoint.push({
                    x: j * 4 * r + 3 * r,
                    y: i * 4 * r + 3 * r
                });
            }
        }
        //return arr;
    }
```

canvas 里的圆圈画好之后可以进行事件绑定

```javascript
function bindEvent() {
    can.addEventListener(
        "touchstart",
        function (e) {
            var po = getPosition(e);
            console.log(po);
            for (var i = 0; i &lt; arr.length; i++) {
                if (
                    Math.abs(po.x - arr[i].x) &lt; r &&
                    Math.abs(po.y - arr[i].y) &lt; r
                ) {
                    // 用来判断起始点是否在圈圈内部
                    touchFlag = true;
                    drawPoint(arr[i].x, arr[i].y);
                    lastPoint.push(arr[i]);
                    restPoint.splice(i, 1);
                    break;
                }
            }
        },
        false
    );
    can.addEventListener(
        "touchmove",
        function (e) {
            if (touchFlag) {
                update(getPosition(e));
            }
        },
        false
    );
    can.addEventListener(
        "touchend",
        function (e) {
            if (touchFlag) {
                touchFlag = false;
                storePass(lastPoint);
                setTimeout(function () {
                    init();
                }, 300);
            }
        },
        false
    );
}
```

接着到了最关键的步骤绘制解锁路径逻辑，通过 touchmove 事件的不断触发，调用 canvas 的 moveTo 方法和 lineTo 方法来画出折现，同时判断是否达到我们所画的圈圈里面，其中 lastPoint 保存正确的圈圈路径，restPoint 保存全部圈圈去除正确路径之后剩余的。 Update 方法：

```javascript
function update(po) {
    // 核心变换方法在touchmove时候调用
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (var i = 0; i &lt; arr.length; i++) {
        // 每帧先把面板画出来
        drawCle(arr[i].x, arr[i].y);
    }
    drawPoint(lastPoint); // 每帧花轨迹
    drawLine(po, lastPoint); // 每帧画圆心
    for (var i = 0; i &lt; restPoint.length; i++) {
        if (
            Math.abs(po.x - restPoint[i].x) &lt; r &&
            Math.abs(po.y - restPoint[i].y) &lt; r
        ) {
            drawPoint(restPoint[i].x, restPoint[i].y);
            lastPoint.push(restPoint[i]);
            restPoint.splice(i, 1);
            break;
        }
    }
}
```

最后就是收尾工作，把路径里面的 lastPoint 保存的数组变成密码存在 localstorage 里面，之后就用来处理解锁验证逻辑了

```javascript
function storePass(psw) {
    // touchend结束之后对密码和状态的处理
    if (pswObj.step == 1) {
        if (checkPass(pswObj.fpassword, psw)) {
            pswObj.step = 2;
            pswObj.spassword = psw;
            document.getElementById("title").innerHTML = "密码保存成功";
            drawStatusPoint("#2CFF26");
            window.localStorage.setItem(
                "passwordx",
                JSON.stringify(pswObj.spassword)
            );
            window.localStorage.setItem("chooseType", chooseType);
        } else {
            document.getElementById("title").innerHTML = "两次不一致，重新输入";
            drawStatusPoint("red");
            delete pswObj.step;
        }
    } else if (pswObj.step == 2) {
        if (checkPass(pswObj.spassword, psw)) {
            document.getElementById("title").innerHTML = "解锁成功";
            drawStatusPoint("#2CFF26");
        } else {
            drawStatusPoint("red");
            document.getElementById("title").innerHTML = "解锁失败";
        }
    } else {
        pswObj.step = 1;
        pswObj.fpassword = psw;
        document.getElementById("title").innerHTML = "再次输入";
    }
}
```

**解锁组件**

将这个 HTML5 解锁写成了一个组件，放在 <https://github.com/lvming6816077/H5lock>

二维码体验： ![](https://camo.githubusercontent.com/7f4c6fe6bd74d440af5f03240c4c67a23dcd0f7a/687474703a2f2f6c766d696e67363831363037372e6769746875622e696f2f483546756c6c73637265656e506167652f48356c6f636b64656d6f2f313433363731333937352e706e67)

参考资料：<http://www.nihaoshijie.com.cn/index.php/archives/537>


<!-- {% endraw %} - for jekyll -->