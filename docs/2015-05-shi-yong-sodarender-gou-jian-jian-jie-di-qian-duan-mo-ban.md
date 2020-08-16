---
title: 使用 sodaRender 构建简洁的前端模板
date: 2015-05-19
author: TAT.dorsywang
source_link: http://www.alloyteam.com/2015/05/shi-yong-sodarender-gou-jian-jian-jie-di-qian-duan-mo-ban/
---

\[

## SodaRender

](<https://github.com/AlloyTeam/SodaRender>)

* * *

SodaRender 是一款具有类似 Angular 模板写法的模板引擎，使用 SodaRender 模板引擎会带来更直观的优点：

-   轻量，代码少
-   模板清晰，可读性强
-   防止意外的 XSS
-   防止因 cgi 字段丢失导致的错误

## 使用 SodaRender

假如你还在使用 JS 和模板混杂的前端模板引擎，在它不至于使你的模板变得一团遭的时候，它们看起来是这样的

```javascript
<% for(var i = 0; i < data.length; i ++){
   var item = data[i];
%>
<li id="<%=item.id%>"><%=item.name%></li>
<% } %>
```

在使用 sodaRender 重构之后，你的代码看起来是这样的

```html
<li soda-repeat="item in data" id="{{item.id}}">{{item.name}}</li>
```

如果你还想继续为一大堆的 % 噩梦所揪挠，那你的模板可能看起来是这样的

```javascript
<div class="<% if(item.status === 'curr'){ %>active<% }else{ %>common<% }%>">
    <%=item.name%>
</div>
```

如果你希望更简洁的阅读，你可能会选择 sodaRender

```html
<div soda-class="item.status === 'curr' ? 'active': 'common'">
     {{item.name}}
</div>
```

如果还想在你的模板中混合函数，那么你的模板会更糟糕，如下

```javascript
<% for(var i = 0; i < data.length; i ++){
   var item = data[i];
   var formatTime = function(time){
       if(item < + new Date()){
       }else{
         // .....
       }
   }
%>
<li id="<%=item.id%>"><%=formatTime(item.time)%></li>
<% } %>
```

这样几乎要把后来的人逼疯了，这时候如果考虑 sodaRender

```html
<li soda-repeat="item in data" id="{{item.id}}">{{item.time|formatTime}}</li>
```

如果你希望改善你的模板中的这些状况，或者你不幸被我说中了，那么请移步这里吧 [SodaRender](https://github.com/AlloyTeam/SodaRender)