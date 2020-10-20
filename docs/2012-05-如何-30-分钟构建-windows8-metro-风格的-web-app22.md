---
title: 如何 30 分钟构建 Windows8 Metro 风格的 Web App (2/2)
date: 2012-05-26
author: TAT.Kinvix
source_link: http://www.alloyteam.com/2012/05/%e5%a6%82%e4%bd%9530%e5%88%86%e9%92%9f%e6%9e%84%e5%bb%bawindows8-metro%e9%a3%8e%e6%a0%bc%e7%9a%84web-app22/
---

<!-- {% raw %} - for jekyll -->

We’re now going to see how to display the details of each article. We will use for that a **transition animation**, we will play with the**simulator** and we will continue to discover Blend to use **CSS3 Multi-columns** for instance.

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/1401465pN.png)

Like in the previous article, you’ll find a video as well as the source code to download at the end of the article.

This article is the second part of this one: [Windows 8 HTML5 Metro Style App: How to create a small RSS reader in 30min (part 1/2)](http://blogs.msdn.com/b/davrous/archive/2012/05/11/windows-8-html5-metro-style-app-how-to-create-a-small-rss-reader-in-30min-part-1-2.aspx)

During this article, we’ll see:

\- Step 1: using the simulator  
- [Step 2:  displaying the articles’ details](http://blogs.msdn.com/b/davrous/archive/2012/05/11/windows-8-html5-metro-style-app-how-to-create-a-small-rss-reader-in-30min-part-2-2.aspx?utm_source=html5weekly&utm_medium=email#etape2)  
- [Step 3: finishing the design of the detail view with Blend](http://blogs.msdn.com/b/davrous/archive/2012/05/11/windows-8-html5-metro-style-app-how-to-create-a-small-rss-reader-in-30min-part-2-2.aspx?utm_source=html5weekly&utm_medium=email#etape3)  
- [Step 4: video and source code to download](http://blogs.msdn.com/b/davrous/archive/2012/05/11/windows-8-html5-metro-style-app-how-to-create-a-small-rss-reader-in-30min-part-2-2.aspx?utm_source=html5weekly&utm_medium=email#etape4)

## Step 1: using the simulator

It’s important to know how your application behaves with touch devices and with the various resolutions of future Windows 8 tablets & PC.

We’re providing a cool tool that could help you doing your first tests: the simulator.

For instance, if you’re opening the project as it was at the end of the previous article, we can simulate some touch interactions by launching the simulator via this button:

[![clip_image001](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/140146n2q.png "clip_image001")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/8741.clip_5F00_image001_5F00_2130A188.png)

The simulator will then be launched. It is more or less simulating a RDP session on yourself. Here is the output you should have:

[![clip_image003](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/140147PUL.jpg "clip_image003")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/3073.clip_5F00_image003_5F00_19A7C2CC.jpg)

You can now click on this icon:

[![clip_image004](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/140147izc.png "clip_image004")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/1004.clip_5F00_image004_5F00_28748955.png)

It will simulate touch. Try to slide the virtual finger on the virtual display. You’ll then see that some inertia and bouncing effects are already implemented for you. In the same manner, if you touch an element and slide it down, you will select it. It’s the same action as doing a right-click on it with your mouse. You see here the benefits of using native WinJS controls that implement all this kind of logic for you.

Another useful button is the one handling the various resolutions:

[![clip_image005](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/140147Fbh.png "clip_image005")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/0250.clip_5F00_image005_5F00_7F6C7B09.png)

Try for instance to simulate a 23’’ monitor having a 1920x1080 resolution. You should now see this kind of layout:

[![clip_image007](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141844tHo.jpg "clip_image007")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/2806.clip_5F00_image007_5F00_17927616.jpg)

You may have noticed that we’re switching from 2 lines of elements to 3 lines in 1080p and from 5 visible columns to 7. The ListView control handles also the various form factors for you.

So even if WinJS is not mandatory inside HTML5 Metro projects, don’t underestimate all the benefits it may bring you for free!

## Step 2: displaying the articles’ details

In order to display the articles’ content, we need another piece of HTML. Navigate to the “_default.html_” page and insert this one:

```html
<div id="articlecontent"></div>;
```

We will insert the article’s content by code. Open “_default.js_”. Just above the Binding.List instantiation, insert this code:

```javascript
var articlelistElement = document.getElementById("articlelist");
articlelistElement.addEventListener("iteminvoked", itemInvoked);
backbutton.addEventListener("click", backButtonClick);
```

We’re targeting our “_articlelist_” element from the DOM that now must be a WinJS _ListView_ control thanks to the execution of the processAll function. This one is then now exposing an event named “_iteminvoked_”. It’s raised when you will click/touch one of the elements of the list. Moreover, we’re subscribing to the “click” event of the “back” button to be able to simply go back to the welcome screen.

We now need to create the associated event handlers. Here they are:

```javascript
function backButtonClick(e) {
    articlecontent.style.display = "none";
    articlelist.style.display = "";
}
function itemInvoked(e) {
    var currentArticle = articlesList.getAt(e.detail.itemIndex);
    setInnerHTMLUnsafe(articlecontent, currentArticle.content);
    articlelist.style.display = "none";
    articlecontent.style.display = "";
}
```

The concept is really simple here. When the user will click on one of the elements, we will retrieve in the collection the appropriate object with its index (_e.detail.itemIndex_). We’re injecting the HTML content into the innerHTML property of the div node just inserted in the main page via the **_setInnerHTMLUnsage()_** function. But why do we need to use this special function for that?

### Some quick notes about the Metro Style Apps security context

The security context of an HTML5 Metro application is different from a classical web page. In our case, trying to access directly to the innerHTML property is protected/scanned.

For instance, if you try to insert some HTML downloaded from the « public web » space, a security exception will be raised by default to protect you. I’m sure you don’t want to have some script injection taking control of your application. So by default, we’re preventing that.

But if you really know what you’re doing, you have the choice to “by-pass” this automatic check by calling the **_setInnerHTMLUnsafe()_**function.

Linked to the security context also, inserting an &lt;iframe> in your application is slightly different for instance. If you’re interested in the details, here are some articles to read:

\- [HTML, CSS, and JavaScript features and differences](http://msdn.microsoft.com/en-us/library/windows/apps/hh465380.aspx)  
- [Features and restrictions by context](http://msdn.microsoft.com/en-us/library/windows/apps/hh465373.aspx)  
- [Making HTML safer: details for toStaticHTML](http://msdn.microsoft.com/en-us/library/windows/apps/hh465388.aspx)

Ok, let’s go back to our main topic.

The way we’re displaying the content of the article is really simple. We’re hiding the list of our elements by switching its “_display_” to “_none_” and we’re displaying the “_articlecontent_” div. When pressing the “_back_” button, we’re doing the exact opposite.

Ok, press F5 and you should have something like that after clicking on one of the items:

[![clip_image009](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141845hj8.jpg "clip_image009")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/4503.clip_5F00_image009_5F00_49D2FF06.jpg)

You’ll notice that the layout is far from being cool but we’re going to work on that in a few moments with Blend.

In the meantime, I’d like to focus on something really annoying in the current version. The navigation inside an article and back to the welcome screen works fine. But the user experience is not optimal. The detail of the article arrives without any transition.

We’re then coming to an important point of the Metro Style Apps: the “_Fast & Fluid_” experience. You need to suggest performance to your user and tell them that your application is really alive. To do that, simply adding some slight transitions animations can totally change the perception. Technically, you can implement them in 2 manners.

You can implement them using pure CSS3 Transitions/Animations to display the content you’re interested in. It is then up to you to find the appropriate animations. If you’d like to discover how these new CSS3 features work, we’ve made some introduction articles David Catuhe and I here:

\- [Introduction to CSS3 Transitions](http://blogs.msdn.com/b/eternalcoding/archive/2011/12/06/css3-transitions.aspx)  
- [Introduction to CSS3 Animations](http://blogs.msdn.com/b/davrous/archive/2011/12/06/introduction-to-css3-animations.aspx)

Or you can use the WinJS library which exposes prebuilt animations to help following the Metro guidelines. Under the hood, you’ll find the usage of CSS Transform & transitions. But for us developers, we just have a simple line of JavaScript to call.

For instance, in the _itemInvoked()_ handler, insert this line of code at the end of the function:

    WinJS.UI.Animation.enterPage(articlecontent);

And please insert this one at the end of the second event handler:

    WinJS.UI.Animation.enterPage(articlelist);

Pressing F5, you should now have some subtle transitions while you’re navigating inside the application. Trust us, they will really make the difference in the user experience!

## Step 3: finishing the design of the detail view with Blend

Switch back to Blend. It will ask you again to reload all the changes you’ve done inside Visual Studio.

Question of the day: **how will you be able to design the detail view as we need to simulate a navigation action via an item selection?**

Well, you already had the answer in the previous article. Blend 5 is live running your HTML5 Metro application. But you’re maybe lacking an additional detail. You can switch into an “interactive” mode by clicking on this button:

[![clip_image010](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141845hwF.png "clip_image010")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/1263.clip_5F00_image010_5F00_31D1AF4F.png)

It should be named “**_Turn on Interactive Mode_**”. Once done, you should be able to interact with your application, navigate to the article content you’d like to review and switch back to the design surface by clicking on the same button. It my case, I’ve decided to use this article as a base:

[![clip_image012](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/1418453zD.jpg "clip_image012")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/3173.clip_5F00_image012_5F00_6CB8E218.jpg)

In the style section, under the appropriate _Media Query_, add a new rule targeting “**_#articlecontent_**” and select it immediately.

In the “**Sizing**“ section, fix the **width** & **height** to **100%**.

In the “**Layout**” part, put a left **padding** of **120px** to align the content with the title.

This raises a new problem. The layout our “_articlecontent_” div doesn’t fit anymore in the width of our screen.

To fix that, modify the “**_width_**” property and click to select a “**_custom expression_**”:

[![clip_image013](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141846kBC.png "clip_image013")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/3007.clip_5F00_image013_5F00_2FDFAD28.png)

We’re going to use the [CSS Calc() operator](http://www.w3.org/TR/css3-values/#calc0). Enter the following expression “**calc(100%-120px)**”.

We’re better following the Metro guidelines this way. We’ve got an ultimate task to do it in an even better way: allowing the user to slide horizontally the content and make it more readable.

Let’s start by readability. There is a very useful CSS3 feature for that easy to put in place: **CSS3 Multicolumns**.

Jump into the “**_Multicolumn_**” section of the “**_CSS Properties_**” panel. Modify the layout to create **480px columns width** with **gaps of 80px** between them.

[![clip_image015](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141956UdX.jpg "clip_image015")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/4062.clip_5F00_image015_5F00_1796678D.jpg)

It starts to look fine, isn’t it?

To conclude, we need to implement horizontal sliding. Go into the “**_Search Properties_**” textbox and type “**_over_**”. Blend will then filter all the properties containing the “over” keyword.

Set the “**overflow-x**” property to “**auto**” and “**overflow-y**” to “**hidden**”.

You can switch back to Visual Studio, accept the changes and press F5 to play with the final result.

### Special additional bonus level for warriors

Well, as I feel you still want to play with Blend, let’s add another feature. What is the most important thing for us while we’re reading a technical article? The source code of course!

Once you know that, don’t hesitate to put some emphasis on the code in a way or in another to catch the eye of the developers.

In the Channel9 case, they had the excellent idea to insert the code parts into &lt;pre> tags. It will simplify our life to style this part.

Add a new CSS rule “**#articlecontent pre**”.

Switch into the interactive mode and navigate into an article where some source code is visible enough.

Select the last rule you’ve just added and go into the “**_Background_**” section of the CSSS properties. Click to set a color:

[![clip_image016](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141957InK.png "clip_image016")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/7762.clip_5F00_image016_5F00_23BA7265.png)

You will then be able to use this wonderful color editor to make your choice:

[![clip_image017](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141957XZ8.png "clip_image017")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/7762.clip_5F00_image017_5F00_7CEEECD5.png)

But if you’re a poor developer like myself, you will probably have a natural tendency to choose the worst color ever. So, click on the color picked icon and choose the nearest Blend grey. It’s obviously a good grey.

To definitely conclude, on the &lt;pre>, set the “**overflow-x”** property to auto and the “**overflow-y”** to “**hidden”**.

Pressing F5 will bring you this kind of experience:

[![clip_image019](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141957Hqq.jpg "clip_image019")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/8836.clip_5F00_image019_5F00_0912F7AE.jpg)

## Step 4: video and source code to download

Well, I hope you’re now convinced I wasn’t lying. If you were focused enough, you should have spent 30 minutes to build this little application.

Here is the video to watch following these steps:

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/140150v3l.jpg)

And here is the source code to download: [Simple Channel9 Reader Article2](http://david.blob.core.windows.net/win8/SimpleChannel9ReaderArticle2.zip "http&#x3A;//david.blob.core.windows.net/win8/SimpleChannel9ReaderArticle2.zip")

Thanks for reading! If you’d like to go further, here are some good articles to read:

\- An excellent series done by David Catuhe: [How to cook a complete Windows 8 application with HTML5, CSS3 and JavaScript in a week](http://blogs.msdn.com/b/eternalcoding/archive/2012/04/16/how-to-cook-a-complete-windows-8-application-with-html5-css3-and-javascript-in-a-week-day-0.aspx "http&#x3A;//blogs.msdn.com/b/eternalcoding/archive/2012/04/16/how-to-cook-a-complete-windows-8-application-with-html5-css3-and-javascript-in-a-week-day-0.aspx"). You will discover how to support the snapped view, the search contract, the navigation framework and a lot of other cool Windows 8 features.  
- [Create your first Metro style app using JavaScript](http://msdn.microsoft.com/en-us/library/windows/apps/br211385.aspx) covering the same topic and complementary to these 2 articles.

David


<!-- {% endraw %} - for jekyll -->