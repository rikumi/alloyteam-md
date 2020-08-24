---
title: AlloyRenderingEngine 继承
date: 2015-04-28
author: TAT.dnt
source_link: http://www.alloyteam.com/2015/04/alloyrenderingengine-ji-cheng/
---

<!-- {% raw %} - for jekyll -->

写在前面  

* * *

不读文章，只对代码感兴趣可以直接跳转到这里 <https://github.com/AlloyTeam/AlloyGameEngine>  
然后 star 一下，多谢支持：)。

前几天发了篇[向 ES6 靠齐的 Class.js](http://www.alloyteam.com/2015/04/xiang-es6-kao-qi-di-class-js/)，当初 jr 为什么不把父类的实例暴露给子类，其原因还是为了延续原型继承的习惯，子类重写就会覆盖掉父类的方法，父类的方法就会丢，如下面的代码，就堆栈溢出了：

```javascript
var Parent = function () {};
Parent.prototype.a = function () {};
var Child = function () {};
Child.prototype = new Parent();
Child.prototype.a = function () {
    this.a();
};
var child = new Child();
child.a();
```

而 jr 的 Class.js 可以让你通过 this.\_super 访问父类同类方法，修复了原型继承同名无法访问父类的弱点，当然也可以 hack 一下，先赋给变量或者某个属性。如：

```javascript
var Parent = function () {};
Parent.prototype.a = function () {
    alert(1);
};
var Child = function () {};
Child.prototype = new Parent();
Child.prototype.parentA = Child.prototype.a;
Child.prototype.a = function () {
    this.parentA();
};
var child = new Child();
child.a();
```

但是这样的话，代码不就很丑陋了吗！？  
所以 AlloyRenderingEngine 选择使用了 JR 的 Class.js，然后在其基础之上扩展了静态方法和属性，以及**静态构造函数**。

所以就变成了这样：

```javascript
var Person = Class.extend({
    statics: {
        //静态构造函数会直接被Class.js执行
        ctor: function () {
            //这里的this相当于Person
        },
        Version: "1.0.0",
        GetVersion: function () {
            return Person.Version;
        },
    },
    ctor: function (isDancing) {
        this.dancing = isDancing;
    },
    dance: function () {
        return this.dancing;
    },
});
var Ninja = Person.extend({
    ctor: function () {
        this._super(false);
    },
    dance: function () {
        // Call the inherited version of dance()
        return this._super();
    },
    swingSword: function () {
        return true;
    },
});
```

AlloyRenderingEngine 继承  

* * *

AlloyRenderingEngine 内置了 Container 对象，用来管理元素，Stage 对象也是继承自 Container 对象，  
还有，Container 对象继承自 DisplayObject，所以 Container 对象也能够设置 scale、x、y、alpha、rotation、compositeOperation… 等，设置的属性能够叠加到子元素上。

x、y、rotation、scaleX、scaleY、skewX、skewY… 等直接矩阵叠加，也就是子元素的呈现跟父容器、父容器的父容器、父容器的父容器的父容器… 都有关系；  
其实 alpha 是乘法叠加 (如：容器的透明度是 0.5，容器内部的元素透明度为 0.9，最后容器内部元素呈现的透明度就是 0.45);；  
compositeOperation 先查找自己，自己没定义，再向上查找，直到找到定义了 compositeOperation 的，就使用该 compositeOperation，有点类似决定定位元素找父容器的感觉。  
很多情况下，我们需要继承 Container 对象来封装一些自定义的对象。  
比如封装一个按钮：

```javascript
var Button = Container.extend({
    ctor: function (image) {
        this._super();
        this.bitmap = new Bitmap(image);
        this.bitmap.originX = this.bitmap.originY = 0.5;
        this.add(this.bitmap); //鼠标指针的形状
        this.cursor = "pointer";
        this._bindEvent();
    },
    _bindEvent: function () {
        this.onHover(
            function () {
                this.scale = 1.1;
            },
            function () {
                this.scale = 1.0;
            }
        );
        this.onMouseDown(function () {
            this.scale = 0.9;
        });
        this.onMouseUp(function () {
            this.scale = 1.1;
        });
    },
});
```

使用这个 button 就很方便了：

```javascript
var stage = new Stage("#ourCanvas");
var button = new Button("button.png");
button.x = 100;
button.y = 100;
button.onClick(function () {
    console.log("你点击我了");
});
stage.add(button);
```

简单吧！

## [](http://www.alloyteam.com/2015/04/alloyrenderingengine-ji-cheng/#在线演示)在线演示

; (function () { var img = new Image(); img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAMw0lEQVR42u2de3BU5RnGf+fsyWUTAggkhku4FQqooAUtjpd6GaUj1jrVqi1Da8eKUzq17VRtbftvp1fr9DZDW21nLA624xTUtrRjHSIIWBCBJNwvQUgAITHZbDa7e7J7ztc/3rPhJOzmspvds5vkmWGG7NnLOc/zXd/3/d5XI4/QuHYFgA8YD8wE5gBXAfOBGqASmAhMAPxAEUDMNGNmNBIBOoB24CLQBJwADgOngDNAELCWbNjt9aP2QPPyxx3CAcqA2cAy4EbgOoTwyUApoPf3PTHTxIxGkl2ygSjwESLIfuB/wPvAB0AYwEtBci6Ai/QSYAFwJ3A3QnolTqseCvoRIOnbgRZEjP8CW4CjgAm5FyNnAriIrwRuBx4EPgVUZ3ofQxTADQV8CGwD/g68jYiTMyGyLoCL+OnAA8AqpLWXDtdvZCCAG1GkV2wANgJnIftCZE0AF/FVwEPAY8ASwBju3xomARKIA/XAn4FXkQk9a0JkRQCH/DJgJfAtZGIdduITGGYBEogjE/avgc1AOBsiDKsArlZ/DfA0Ms6PG/a77oMsCZBACJkfngMOwPD2hmETwCG/FHgE+AHw8Wwx0hdZFiCBY8CPgb8B0eESIWMBXK1+BvB94FGgPNtsuJEjAQC6gJeAnwDNkHlvyEgAF/nXAz8D7sj0O9NBDgUAWbrWAt8D9kBmIujpftAhXwc+A7yMbKg83VnnCJrzrC87z67Xr/pk2l+WlgAum82XgD8gO9rRhgXAHx0OfOmKMGQBHPINYA3wPDDNayY8xFSHgzWAkY4IQxLA1fIfRyaiSV4zkAeYhHDxOGn0hEEL4JCvAauBHyFm4TEIJiKcrAa0oYgwKAFcq537gJ8iZuIx9MZkhJvPAgxWhAEFcJF/A/BzxHo5huSoRpbjN8DgROhXABf5Nc4Xj8bVzlCxAGmoNTCwCIMZgkqRHe7tXj9ZAeF24FkGYXJPKYCr9X8R+DKjY5M1nHgU+AL03wsG6gGLkS13Tm07IwTlSC9Y3N+bkgrgtH4/8BRj434mWIBw6E/VCy4TwDX03Iu4EMeQGR5AuEw6FKUagiqBJ4EKr+9+BKAC4bIq2cVeArha/8PATTm/VWWDUs7/FdiuvwsbNyF+8ct6QTI/7QzEgZ41H24qFNfMo3zZbRiTqrACHxE9Xk/0xAHscAh0jQJeiBkIp6/jOHIS6HkiV+v/BvArxOiWGyibktkLqXz0GYqqZ156uTtK9HgDwe2biRzei4qGkwqRY4dMurCAbwO/g0tOnL6tfAqy7s8d+QA+g4qb7+lFPoBWXIr/6hsonbeYyJG9BLdvJnqsDmVGQU/bl+QVfAi3fwVa3S/2Xfl8nVwOP0qhl41jwt0PY0xMbuPTDIOi6hrKFi+neNps7EgIq6MV4nHQNGzLworHPWF1iKhEgr8OrV08nXUNZ3sRXYKEkQxbxNpgoek+9NKyAd+n+8spX3Yb/kVLCdfvonPHZswPjqBsG3HV5v0cUYpw/AZOLKpbgAVIrGbeQy+rYNyNd+G/+nrCdTtpq32N7mMN0iPyf2j6FLAQqIPeAtyJuNgKBr6KiVTcshL/NcsZt+st2t7+B9GmE2BZ+SzEVCR6pA7A5wojfBY5CJFz6CWlVNz0aXzjxqf3+dIyyuZdw/hP3IwxYTKxQAtWZ0D2FVpeDksK2LR28fRYopnMRiKWCxpFk6+k8r7VzH76ea58cA3F1TNlI6dsr2+tL64D5sKlnfD1pNgqFx40iqumU/W5rzL7meepvP8rFFVOc4TIm111FXIaCN35l9XoZU+gaZRMnUX1Q19j9tO/ZMrKVRRNqsoX84YPWI4zU00ArvX6jrIGXae0Zh7Vq55k1lPPMWnFQxgTJuWDENcCEwxgFo7/ciRD03345yxk2sx5XHHLPbTVvkbw/W3EgwE0TfNisq4BZhnIZDDFa4JyBc1nUDZ/Mf45C7ni1ntp27KJzn07iHcF0TQ9l0JMAeYawCJkFzyqoBlFlC9aiv9jV9N1ZB9tWzYRatiFFQ6h6TkxhZUAiwxgHhlESRc69OISKpbcSPmCawkd3EPbWxsJHXwPFevOdm/QgfkGo2D8Hwz0Ej/jl97KuEVLad/+by5u+hPxwEfZFmGGjljoxuBA95cz+a4HufLzT6AVZ31krtQZC7K9HJrG+GW3UTJtlmNpzRomJvYBY+gDrbQMzT8OMdtkDRN0JP5nDH0Q6grRbZrZ9jD4DdJIjjGSoZQi2NlJy8UWbNsmy06eopFl/8kASikikQjt7e2EQiHsWCwnv2sg6VuKvSbAKyiliEajBAIBOjs7sSwrlz8fM4AIo1AApRSmafYQH/fGqR8xkDRfo2ollCA+GAwmJ17TwLbAyrooHQYQQPKzjXh0d3fT0dFBR0cHsVRjvKaBAvvgLtSFpmz7lgMGToaokYxYLNZDfHd3d4p3aRJ1Fw1j1+/Afud16I5m2xTRYiDJ7EYkYrEYwWCQjo4OTNNM/UZdBzOKOnUQe28t6tQhiMdyYZpuNpDUjjYjyCIaj8fp7OwkEAgQjUZTv1HXodtEnTkqxDcehGhYXs8++TZw3EDyapqMgB2xZVk9xEci/QTr6jrEYqjTR7D3vo06UQeRLhmCchdPZAKHDaARCRYtWLO0ZVmEQqEe4lUqX6+mgxVHNZ9A7duKfWwfhIPS2nMfyNUKNBrAaWQeKDgBbNvuIT4cDmPbtvh3+0LTwbZQ5xtR+7dhH9kDoQCgyTVv0AScTuwD6vDiREyasG2bcDhMe3s7XV1dPcRfRr6mgVKoC2dQde9gH9oFwXbnmudTXh3OPsBGsgOuwaPYIAXYg4heU0r1It6yrP6Jbz2HqtuBffBdCLReuuY9LGAXYCcI34Pkx/Qk949t25hRM2VkQF9DWb/EA6rtIqphB6phJ6rtQq9reYKLSP7qnhb/AXJwwBMBlLIJBAL443GKDMP1enJDWSri6WjFPrALVb8d1XpOAq/yi/gE9iMZ3THmrnuTxrUrwkgi65Xe3I9GOBLm3LlzjK+ooKioiHg8Tjgc7mnxyT/mnBfrbMc+tBtVtw11oRmUJWN8fpIP8CbQtWTD7l5jfi1wHg/PCITDYcJdXWiahlIKpVSKVY0Qr4WD6CfrsfdtxT5zHOy4Q7znE2x/OI9wDfSedI8gWcQf8eS2XEv3xDr+cvIlhFCLhtBPHcR3YCf6hTPEwiHnLEBeE5/ANoRroLcAJpKi935yeU5MA2wLLRZFoZHSCa7pYIbxnT4sxJ9vdOw1ed/i3YgiHPcYpnSAueveTPxdC+zN7T1paN0mWsvZ5O5XTYdYN76TdRT/5yWK3tqA3nRUjiEVDvEJ7MUZflKdE24FXkFi13N3Vti28B14F3vqXNTkqT3reGJR9LMn8R3Yia/pqGMeLqgW74aFcNvqfrFXm3POi81AjtQvzfUdqinTseZfh6qYhNbVgX72BPq5RjDD/ZJeICfl9yLDe7M71XGynW8zUrwgK8UW+oPW0ozR0nypB+Cs4wuzxbsRRzht7nuh15O55oJXgZ05v033QYke4vN2LT8U7EQ4vSzRd6qmdRH4LVK8YAyZIYRweTHZxcsEcPWCfyHFbMaQGTYiXCZNc5+0BzgiRJCyHUe9foICxjGEw0iqGgMDzW4NSBLSLq+fpADRhSS7bejvTSkFcA1FrwB/Ictx2iMMCuHsFei/wsZg1ncRJD37Vq+fqoCwFeFswM1JvwK4ekET8F3G5oPB4CiS7LYJBq4vM2APcInwnvPFH3r9hHmMDxGOdsPgivsMaovpEuENJJF3m9dPmodoQ7h5AwZfWWnQe3xHBAWsB36IBPWOQRBAOFkPqKGUtRqSkcURwQJeZKwnJJBo+S+SRrXuIVu5HBHiwAvAdxAX22jFeYeDF4B4OgXd0jIzunrCeuAJRufq6Kjz7OvJoE592nZeRwQb+CdSPWgLo2OzlihluNp5dtuTUobQa3W0B6kYsY6RbbboAn6PVBTJuI4kjJWzHQrys5ytG30KOj+DFC8YCQWdNwK/IJ8LOrvhykV6L/BNCruk+W8Qe37+lzR3w9UbqpDiBY+RJT/zMAsQB+oRH+6rOJ6sbJAPOXC4uoSYjgxJq5DEpcMW/DVMAkSRoNkNyJBzFrJHfAI583i7hKhEcic/gCSyrs70PjIQQCEGtG0I6bU4x3azTXwCOQ85cAlRgmQRvwNYgfSKStIYooYoQBwheT8SpVyLxGqakDviE/A05sMlRhkwB0mhvBxJalqDpHYsYYD9Sj8C2AixrYh9vg45mbIHic8PQ+5JdyOvgm5cBaPHI+kT5gBXIXuKGUgPucK57keSjNgx0+w2oxETCALtyMR5BjgJHELIPuNcT9tskA38H/FXEZyb726IAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE0LTAyLTIxVDIzOjEzOjMyKzA4OjAwgoE57QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNC0wMi0yMVQyMzoxMzozMiswODowMPPcgVEAAABNdEVYdHNvZnR3YXJlAEltYWdlTWFnaWNrIDYuOC44LTcgUTE2IHg4Nl82NCAyMDE0LTAyLTI4IGh0dHA6Ly93d3cuaW1hZ2VtYWdpY2sub3JnWaRffwAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABh0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQAMjQ4F2BYXwAAABd0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAAyNDiEkQgCAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADEzOTI5OTU2MTIuEd96AAAAE3RFWHRUaHVtYjo6U2l6ZQA3LjI1S0JCWq8W2QAAAGJ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2hvbWUvZnRwLzE1MjAvZWFzeWljb24uY24vZWFzeWljb24uY24vY2RuLWltZy5lYXN5aWNvbi5jbi9wbmcvMTEzNzUvMTEzNzU4MS5wbmfci11fAAAAAElFTkSuQmCC"; img.onload = function () { var Stage = ARE.Stage, Bitmap = ARE.Bitmap, Container = ARE.Container; var Button = Container.extend({ ctor: function (image) { this.\_super (); this.bitmap = new Bitmap (image); this.bitmap.originX = this.bitmap.originY = 0.5; this.add (this.bitmap); // 鼠标指针的形状 this.cursor = "pointer"; this.\_bindEvent(); }, \_bindEvent: function () { this.onHover (function () { this.scale = 1.1; }, function () { this.scale = 1.0; }) this.onMouseDown (function () { this.scale = 0.9; }) this.onMouseUp (function () { this.scale = 1.1; }) } }); var stage = new Stage ("#ourCanvas"); var button = new Button (img); button.x = 100; button.y = 100; button.onClick (function () { console.log ("你点击我了"); }) stage.add (button); stage.fps=30; stage.onTick (function (){ stage.offset = stage.\_getXY(stage.canvas); }) } })();

地址  

* * *

演示地址:<http://alloyteam.github.io/AlloyGameEngine/tutorial/lesson2.html>  
Class.js:<https://github.com/AlloyTeam/AlloyGameEngine/blob/master/src/are/base.js>  
AlloyGameEngine:<https://github.com/AlloyTeam/AlloyGameEngine>


<!-- {% endraw %} - for jekyll -->