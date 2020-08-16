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

上面的两个例子是使用的最简单的情形，就是 Get 和 Post 请求都没有带上参数，于是百度这个问题得到的答案都是说通过 JsonObjectRequest 的 JsonObject jsonRequest 这个参数来指定，官方的文档对这个参数说的也是不清不楚的，这个地方看了半天也想不通参数为什么会是用 json 对象来传递，不应该是 key=value 的形式吗？又多百度了几遍，说是通过自定义 JsonObjectRequest 然后通过 override 其 getParams 函数来指定，但照做后这个函数不会被调用。。。百般无奈下只能看源码了，看了源码才发现 JsonObjectRequest 的构造函数里的 jsonRequest 参数其实最终把 JsonObject 转换成 String，如果这个对象是空的，那么会默认以 get 请求（除非你指定是用 post), 否则这个参数会当做是 post 的参数！看源码：

```javascript
//JsonRequest.java
@Override
public byte[] getBody() {
    try {
        return mRequestBody == null ? null : mRequestBody.getBytes(PROTOCOL_CHARSET);
    } catch (UnsupportedEncodingException uee) {
        VolleyLog.wtf("Unsupported Encoding while trying to get the bytes of %s using %s",
        mRequestBody, PROTOCOL_CHARSET);
        return null;
    }
}
```

具体 getBody 在哪里被调用就不具体来培析，有兴趣的可自己研究源码，看到这个，如果是说想继承 JsonOjectRequest 又想用 key=value&key1=value1 的形式来做参数的话肯定是想到了自定义的类里构造 mRequestBody 也就是 JsonObject 转换成 String 的地方用 String（key=value 形式）来代替用 JsonObject 来传递。于是做了如下修改：

```javascript
String query = "";
if (mParams != null) {
    Uri uri = Uri.parse(mUrl);
    Uri.Builder builder = uri.buildUpon();
    for (HashMap.Entry&amp;amp;lt;String, String&amp;amp;gt; entry : mParams.entrySet()) {
         builder.appendQueryParameter(entry.getKey(), entry.getValue());
    }
    query  = builder.build().getEncodedQuery();
} else {
}
mRequest = new MyJsonObjectRequest(mUrl, query, this, this);
//MyJsonObjectRequest.java 继承JsonObjectRequest
public MyJsonObjectRequest(String url, String params, Response.Listener&amp;amp;lt;JSONObject&amp;amp;gt; listener, Response.ErrorListener errorListener) {
       super(Method.POST, url, params, listener, errorListener);
}
```

但最终还是不行！为什么？ 参数传递没有错误啊？事实上这里忘了一个非常重要的地方，也就是 post 请求的 header, 在发起 key=value 形式的参数时，我们请求的 Content-Type 应该是 application/x-www-form-urlencoded 的，而 JsonRequest 默认是 application/json; charset=% s，这就是真相，于是重写 getBodyContentType

```javascript
@Override
public String getBodyContentType() {
    if (getMethod() == Method.POST) {
        return "application/x-www-form-urlencoded";
    }
    return super.getBodyContentType();
}
```

搞定了！

这里是不是还有人在想 get 请求如何传参数的？用这种方式怎么 get 请求不能传参，其实也是非常简单，在请求时 url 就带上 key=value 就好！如：

```c
 if (mParams != null) {
        Uri uri = Uri.parse(url);
        Uri.Builder builder = uri.buildUpon();
         for (HashMap.Entry<String, String> entry : mParams.entrySet()) {
            builder.appendQueryParameter(entry.getKey(), entry.getValue());
        }
        mUrl = builder.build().toString();
} else {
        mUrl = url;
}
```

聪明的你肯定想到了吧，希望给同样用 volley 的同学有帮助～～

<!-- {% endraw %} - for jekyll -->