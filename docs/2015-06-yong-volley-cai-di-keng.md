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
                System.out.println("----------:" + obj);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.getMessage();
            }
        });
```

上面的两个例子是使用的最简单的情形，就是 Get 和 Post 请求都没有带上参数，于是百度这个问题得到的答案都是说通过 JsonObjectRequest 的 JsonObject jsonRequest 这个参数来指定，官方的文档对这个参数说的也是不清不楚的，这个地方看了半天也想不通参数为什么会是用 json 对象来传递，不应该是 key=value 的形式吗？又多百度了几遍，说是通过自定义 JsonObjectRequest 然后通过 override 其 getParams 函数来指定，但照做后这个函数�


<!-- {% endraw %} - for jekyll -->