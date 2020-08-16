---
title: 千方百计加速 Web 之加速 DNS 解析
date: 2013-10-30
author: TAT.iAzrael
source_link: http://www.alloyteam.com/2013/10/do-everything-possible-to-speed-up-dns-resolution-speed-web/
---

通常情况下，做移动开发时，如果要向后台请求数据，都会直接使用 TCP 通信。但实际上一来 HTTP 比 TCP 简单易用多了，二来有很多现有 CGI 如果要进行改造得花很大功夫。还是会有使用 HTTP 请求来拉取数据。

在做 Android QQ 二维码时，扫描到二维码字符串，就是把该字符串用 HTTP 传给后台，后台解析后返回给客户端，客户端再进行下一步处理。在提交测试后，测试同事发现，在移动网络上，DNS 解析会经常失败，导致二维码扫描功能不可用。功能测试不通过，导致无法发布。同时测试喜欢在清空 DNS 缓存和屏蔽了 DNS 解析的情况下，二维码解析功能仍然可用。因此这里增加了如下处理：  
1. 进入 “扫一扫” 的界面时，客户端就开始对 CGI 所在域名进行解析，并把解析结果缓存到本地文件；  
2. 发起 CGI 请求时，还是使用原域名进行请求，如果 DNS 解析失败，则用第一步缓存的 IP 替换掉 CGI 中的域名再发起一次请求。

由于国内有好几个网络运营商，公司在不同的网络环境都有不一样的出口 IP，因此选择最近的 IP 才能快速访问 CGI。所以缓存域名结果时，需要区分网络分别保存。

这样，当用户的手机上至少成功使用了一次二维码扫描时，CGI 对应的 IP 就保存下来了（至少有一个出口 IP）。下次访问（同一次登录或者关闭手机 QQ 后再打开）时，即使 DNS 解析失败，还是能使用上一次保存的 IP 进行访问，可能会相应比较慢（用户从 A 网络切换到了 B 网络），但起码保证了功能的可用性。

实现起来也不难，Java 都有现成的接口了。  
主动发起 DNS 解析只要调用 InetAddress 的接口即可，把获取到的结果保存到 SharedPreferences 供下次使用：

```javascript
public static void lookupIP(Context context, String host){
     SharedPreferences preferences = context.getSharedPreferences("host", 0);
     String ip;
     try {
          InetAddress address = InetAddress.getByName(host);
          ip = address.getHostAddress();
          SharedPreferences.Editor editor = preferences.edit();
          editor.putString(host, ip);
          editor.commit();
          QLog.d(TAG, "lookup address: " + host + ", ip: " + ip);
     } catch (UnknownHostException e) {
     }
}
```

然后在 HTTP 请求出现 DNS 解析错误的时候，用 IP 替换掉 URL 中的域名即可：

```javascript
HttpResponse response = null;
try{
     response = openRequest(context, url, host, method, params, header);
}catch (IOException e){
     //DNS错误改用ip重新发一次
     String ip = getIP(context, host);
     if(ip != null){
          url = url.replace(host, ip);
     }
     response = openRequest(context, url, host, method, params, header);
}
```

这里之所以不直接用上次保存的 IP 来替换域名进行访问，是因为在正常情况下，进入 “扫一扫” 的界面时，已经预先对所用域名进行了预解析，如果解析成功，调用 openRequest 时就不用 DNS 查询了；而如果预解析失败了，openRequest 的时候还能再尝试一次，失败时才使用 IP 访问。同时，很多用户都会在移动网络和 WIFI 网络中切换，如果直接用 IP 替换域名，会出现用户当前是移动网络，而是用的域名 IP 是在教育网 IP（上一次使用的是教育网 WIFI）的情况，导致 CGI 响应变得更慢。

当然，更好的解决方法是：先检测当前用户的网络环境，如果本地保存了对应网络的 IP，直接使用 IP 请求；如果没有，再改用域名来请求。

还有更进阶的方案：第一次登陆时，从服务器拉取一份 host 列表（每个域名包括各个网络环境的出口 IP），把所有 HTTP 请求的域名都替换成相应 IP，这样就能完美解决 DNS 不可用、DNS 解析失败的情况了。之后维护 host 文件的更新即可。