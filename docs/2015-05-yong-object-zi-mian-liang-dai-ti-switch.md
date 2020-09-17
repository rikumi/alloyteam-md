---
title: 用 Object 字面量代替 switch
date: 2015-05-31
author: TAT.mandyluo
source_link: http://www.alloyteam.com/2015/05/yong-object-zi-mian-liang-dai-ti-switch/
---

<!-- {% raw %} - for jekyll -->

有时候我们的代码有很多的条件判断，我们只能用 switch 语句来让代码更好看一点。

```javascript
function getDrink(type) {
    if (type === "coke") {
        type = "Coke";
    } else if (type === "pepsi") {
        type = "Pepsi";
    } else if (type === "mountain dew") {
        type = "Mountain Dew";
    } else if (type === "lemonade") {
        type = "Lemonade";
    } else if (type === "fanta") {
        type = "Fanta";
    } else {
        // acts as our "default"
        type = "Unknown drink!";
    }
    return "You've picked a " + type;
}
```

像上面介样子的代码，看起来是很头疼滴。而用 switch 语句，代码会更直观简洁。

```javascript
var type = "coke";
var drink;
switch (type) {
    case "coke":
        drink = "Coke";
        break;
    case "pepsi":
        drink = "Pepsi";
        break;
    default:
        drink = "Unknown drink!";
}
console.log(drink); // 'Coke'
```

但是我们有时候不太喜欢用 switch 语句，它那程式化的写法并不是那么舒适，而且代码块不能用大括号包起来，看起来很别扭。

我们经常用 Object 来查找，而 switch 在某种意义上也是查找，所以我们可以试着用 Object 来代替 switch。object 应该会给我带来更大的灵活性。就像写配置文件的时候一样，object 的 hash 查找真是很方便的呦。

```javascript
function getDrink(type) {
    var drinks = {
        coke: "Coke",
        pepsi: "Pepsi",
        lemonade: "Lemonade",
        default: "Default item",
    };
    return "The drink I chose was " + (drinks[type] || drinks["default"]);
}
var drink = getDrink("coke");
// The drink I chose was Coke
console.log(drink);
```

当然，我们可能会写一些代码片段，只需要这样子


<!-- {% endraw %} - for jekyll -->