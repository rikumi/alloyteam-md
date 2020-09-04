---
title: 如何 30 分钟构建 Windows8 Metro 风格的 Web App (1/2)
date: 2012-05-26
author: TAT.Kinvix
source_link: http://www.alloyteam.com/2012/05/%e5%a6%82%e4%bd%9530%e5%88%86%e9%92%9f%e6%9e%84%e5%bb%bawindows8-metro%e9%a3%8e%e6%a0%bc%e7%9a%84web-app12/
---

<!-- {% raw %} - for jekyll -->

Starting from scratch, we’re going to learn through these 2 tutorials how to build a small RSS reader with **HTML5**, **CSS3** and **WinJS**, the Microsoft JavaScript framework for Windows 8 Metro Style Apps. We’ll try also to follow the Metro design guidelines by using**Expression Blend 5**. If everything goes fine, you should be able to follow these 2 articles in 30 minutes.

This first article will help you to create the welcome screen that will use a WinJS ListView control. This control will display all the blog posts recently published via nice thumbnails. The 2nd one will work on the detail view displayed when you’ll click on one of the items. At last, you’ll find a video at the end of this article playing in real-time the following steps as well as the final solution to download. See them as useful complementary resources if you need to clarify some parts of this article.

**Pre-requisites:** to follow these tutorials, you need first to:

1 – Download & install **Windows 8 Consumer Preview** on your machine: [http://preview.windows.com](http://preview.windows.com/)  
2 – Download & install **Visual Studio 11 Express** for Windows 8: [http://msdn.microsoft.com/en-us/windows/apps/br229516](http://msdn.microsoft.com/en-us/windows/apps/br229516 "http&#x3A;//msdn.microsoft.com/en-us/windows/apps/br229516")

**Note:** If you’ve got a Mac, it works perfectly fine thanks to BootCamp or inside a virtual machine handled by Parallels for instance

Here is a brief summary of what we’re going to see in this article:

\- Step 1: creating a blank application  
- [Step 2: creating the HTML & CSS base of our main page](http://blogs.msdn.com/b/davrous/archive/2012/05/11/windows-8-html5-metro-style-app-how-to-create-a-small-rss-reader-in-30min-part-1-2.aspx?utm_source=html5weekly&utm_medium=email#etape2)  
- [Step 3: first contact with Blend](http://blogs.msdn.com/b/davrous/archive/2012/05/11/windows-8-html5-metro-style-app-how-to-create-a-small-rss-reader-in-30min-part-1-2.aspx?utm_source=html5weekly&utm_medium=email#etape3)  
- [Step 4: loading the data with XHR and bind them to the ListView control](http://blogs.msdn.com/b/davrous/archive/2012/05/11/windows-8-html5-metro-style-app-how-to-create-a-small-rss-reader-in-30min-part-1-2.aspx?utm_source=html5weekly&utm_medium=email#etape4)  
- [Step 5: using a template and modifying the design with Blend](http://blogs.msdn.com/b/davrous/archive/2012/05/11/windows-8-html5-metro-style-app-how-to-create-a-small-rss-reader-in-30min-part-1-2.aspx?utm_source=html5weekly&utm_medium=email#etape5)  
- [Step 6: video demonstrating all the steps & source code to download](http://blogs.msdn.com/b/davrous/archive/2012/05/11/windows-8-html5-metro-style-app-how-to-create-a-small-rss-reader-in-30min-part-1-2.aspx?utm_source=html5weekly&utm_medium=email#etape6)

**Note:** these tutorials are based on the [Tools for building Metro style apps](http://channel9.msdn.com/events/BUILD/BUILD2011/BPS-1006) session of the BUILD delivered by Chris Sell & Kieran Mockford. I’ve simply updated it for Windows 8 CP.

## Step 1: creating a blank application

First thing you need to do is to launch Visual Studio 11 and create a new JavaScript Windows Metro Style project via “File –>  New Project”:

[![clip_image002](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/140648xYS.jpg "clip_image002")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/1323.clip_5F00_image002_5F00_37E6D929.jpg)

Name it “**SimpleChannel9Reader** ” as we’re going to download the RSS stream of the Coding4Fun section of Channel9 available here:<http://channel9.msdn.com/coding4fun/articles/RSS>

## Step 2: creating the HTML & CSS base of our main page

Open the “default.html” file which describes the first page that will be displayed when you’ll launch the application. Instead of the following HTML part:

```html
<p>Content goes here</p>;
```

Insert this one:

```html
<div id="main">
        
    <header id="banner">
                
        <button id="backbutton" class="win-backbutton">
                    
        </button>
                
        <h1 id="maintitle" class="win-title">
                        Welcome to Channel 9!
        </h1>
            
    </header>
        <section id="content">    </section>
</div>;
```

We now have a global div container with the “main” id embedding 2 sub-containers named “banner” and “content”. The header will be obviously displayed at the top of the page and the content section will be displayed just below.

Let’s add a bit of CSS to that by opening the “default.css” file stored in the “css” directory. You’ll see that there is already some predefined CSS to handle the various available Windows 8 views thanks to **Media Queries**.

In these 2 articles, we will concentrate our efforts only on the “**fullscreen-landscape**“ state. So jump into this section and insert the following piece of CSS:


<!-- {% endraw %} - for jekyll -->