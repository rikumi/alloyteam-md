---
title: 用 Volley 踩过的坑
date: 2015-06-11
author: TAT.zhipingfeng
source_link: http://www.alloyteam.com/2015/06/yong-volley-cai-di-keng/
---

<!-- {% raw %} - for jekyll -->

　　相信 volley 绝大部分做 android 的人已经知道了，关于 volley 的使用网上也是一抓一大把，都是说 volley 如何如何好用，下面分享下自己在使用 volley 过程中踩过的坑。

　　volley 好用的一个原因是封装的 api 看起来也比较直接，但是其回调的 api 做的是一般般，其中有一个 JsonObjectRequest 类，网上的使用说明也一大把，基本上都是最简单的情形：

Get 请求示例：

```javascript
RequestQueue queue = Volley.newRequestQueue(this);
String url = "http://m.weather.com.cn/data/101201401.html";
JsonObjectRequest objRequest = new JsonObjectRequest(url, null,
        new Response.Listener&amp;amp;lt;JSONObject&amp;amp;gt;() {
            @Override
            public void onResponse(JSONObject obj) {
                System.out.println("----------:" + obj);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.getMessage();
            }
 
        });
objRequest.setTag("obj");
queue.add(objRequest);
```

Post 请求示例:

```javascript
Map&lt;String,String&gt; map=new HashMap&lt;String,String&gt;();
map.put("token", "AbCdEfGh123456");
JSONObject params=new JSONObject(map);
         
RequestQueue queue = Volley.newRequestQueue(this);
String url = "http://m.weather.com.cn/data/101201401.html";
JsonObjectRequest objRequest = new JsonObjectRequest(url, params,
        new Response.Listener&amp;amp;lt;JSONObject&amp;amp;gt;() {
            @Override
            public void onResponse(JSONObject obj) {
                System.out.println("----------:" +
```


<!-- {% endraw %} - for jekyll -->