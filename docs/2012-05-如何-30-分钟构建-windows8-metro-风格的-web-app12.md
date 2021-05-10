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

```css
#main
{
    width: 100%;
    height: 100%;
}
 
#banner
{
    width: 100%;
    height: 100%;
}
 
#backbutton
{
}
 
#maintitle
{
}
 
#content
{
    width: 100%;
    height: 100%;
}
```

This simply indicates that we’d like to take all the available space for our 3 main containers.

Run your application by pressing the F5 key or by clicking on the following button:

[![clip_image003](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/1406487qd.png "clip_image003")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/7674.clip_5F00_image003_5F00_39DE6AF6.png)

Logically, you should now see this screen:

[![clip_image005](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/140648S09.jpg "clip_image005")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/8267.clip_5F00_image005_5F00_4BBD8F74.jpg)

And you should also see an obvious design problem: the back button and the title are not aligned. Let’s resolve this by using Blend 5!

## Step 3: first contact with Blend

Launch Blend and navigate to the folder where your SimpleChannel9Reader project is. Blend will then show that:

[![clip_image007](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/140649Ta9.jpg "clip_image007")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/0160.clip_5F00_image007_5F00_73EFC886.jpg)

The goal here is to create 2 grids. The first one will be for the main container. It will be defined by 1 column that will take all the available width & by 2 lines. The 2nd one will be defined by 1 line & 2 columns for the back button and the title.

Let’s start by the select the “main” element by using the “**Live DOM**” window:

[![clip_image008](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/140649bOI.png "clip_image008")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/5050.clip_5F00_image008_5F00_54D1CD08.png)

Jump to the “**Layout**” window and switch the display to “**_-ms-grid_**”:

[![clip_image009](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141007Erh.png "clip_image009")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/2804.clip_5F00_image009_5F00_0F4F5D8E.png)

We’re going to use the **CSS Grid Layout** specification currently only supported by IE10 but that should soon land in other browser. If you’d like to know more about the type of layout supported in the Metro mode, you can read this article: [Choosing a CSS3 layout for your app](http://msdn.microsoft.com/en-us/library/windows/apps/hh465327.aspx).

If you simply want to discover the CSS3 Grid specification, feel free to play with this IE Test Drive demo: [Hands On: CSS3 Grid Layout](http://ie.microsoft.com/testdrive/Graphics/hands-on-css3/hands-on_grid.htm "http&#x3A;//ie.microsoft.com/testdrive/Graphics/hands-on-css3/hands-on_grid.htm")

Ok, now that the display is properly switched into grid, we need to define our grid. For that, jump to the “**Grid**” part and declare the following properties:

[![clip_image010](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141007FlA.png "clip_image010")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/0741.clip_5F00_image010_5F00_697BC7DB.png)

We will have a unique column spanning through the complete width of the screen (whatever the resolution will be) and 2 lines. The first line will have a “fixed” height size of 132px and the other one will take the remaining space. You can see this inside the Blend designer surface:

[![clip_image012](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141008MOW.jpg "clip_image012")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/7266.clip_5F00_image012_5F00_6FC52F1A.jpg)

Now, we’re going to move the “**content**” element into the 2nd line. Select it into the “**Live DOM**” and move to its “**Grid**” properties. Change the “**-ms-grid-row**” value to 2. You can also move the “**banner**” element to the row 1 but it will be there by default otherwise.

We’re now going to split our first line into 2 columns in order to move each element in the right places. Select the “**banner**” element, switch its display property to “-ms-grid” and define 1fr line & 2 columns of 120px and 1fr:

[![clip_image013](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141008Ac5.png "clip_image013")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/2388.clip_5F00_image013_5F00_42D4EDA1.png)

Move the “**maintitle**” element into column 2 and center it vertically thanks to the “**-ms-grid-row-align**” property changed to “**center**”:

[![clip_image014](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141008Kc8.png "clip_image014")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/4861.clip_5F00_image014_5F00_342CD26D.png)

Select the “**backbutton**” and jump to the “**Layout**” part. Set a **54px** top margin and a **40px** left margin. If you haven’t missed something, you should now see that on the design surface:

[![clip_image016](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/1411313Rn.jpg "clip_image016")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/7585.clip_5F00_image016_5F00_23B6F223.jpg)

Save all changes via “_File_” à “_Save All_” and go back to Visual Studio. Open “_default.css_” and you’ll see that Blend has generated some “clean” CSS in the right rules:

```css
@media screen and (-ms-view-state: fullscreen-landscape)
{
 
    #main
    {
        width: 100%;
        height: 100%;
        display: -ms-grid;
        -ms-grid-columns: 1fr;
        -ms-grid-rows: 132px 1fr;
    }
 
    #banner
    {
        width: 100%;
        height: 100%;
        display: -ms-grid;
        -ms-grid-columns: 120px 1fr;
        -ms-grid-rows: 1fr;
    }
 
    #backbutton
    {
        margin-top: 54px;
        margin-left: 40px;
    }
 
    #maintitle
    {
        -ms-grid-column: 2;
        -ms-grid-row-align: center;
    }
 
    #content
    {
        width: 100%;
        height: 100%;
        -ms-grid-row: 2;
    }
}
```

Simply check that the application works fine by pressing F5.

## Step 4: loading the data with XHR and bind them to the ListView control

Ok, let’s now dig a little bit into the code.

First thing to do is to insert the control that will be in charge of displaying our articles’ thumbnails on the welcome screen. We’re going to use WinJS for that.

The WinJS library or “**Microsoft Window Library for JavaScript SDK**” is made to help the JavaScript developers implementing the Windows 8 Metro experience in an easy way. It provides a set of Metro controls, a templating engine, a binding engine, Promises to handle the asynchronous calls, helpers to handle Namespaces, etc.

For instance, if you’d like to learn more about the controls part, you can read this article: [Quickstart: adding WinJS controls and styles](http://msdn.microsoft.com/en-us/library/windows/apps/hh465493)

In Windows 8 Metro projects, you’ll find this library in the references section of the “**Solution Explorer**”:

[![image](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141132juW.png "image")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/8461.image_5F00_1E6A2512.png)

Inside, you’ll find the default style sheets with the 2 _dark_ & _light_ themes provided as well as the JavaScript code. Feel free to have a look to it. It could be interesting to learn by reading the code.

In our case, we’re going to use the ListView control which creates a grid layout to display the list of elements.

Open “**_default.html_**” and inside the section tag, type this piece of HTML:

```html
<div id="articlelist" data-win-control="WinJS.UI.ListView"></div>;
```

Currently, it’s only a simple classical div. However, it’s annotated with the **data-win-control** attribute which indicates that we’d like to use the **WinJS** library to transform this simple div into a JavaScript **ListView** control.

This operation is done thanks to a magical line of JavaScript code you’ll find into “_default.js_”. Here it is:

    WinJS.UI.processAll();

This asynchronous operation will parse the DOM to find all the elements tagged with “data-win-control” attributes to transform them into real WinJS controls implementing the Metro experience for you. If you remove this line by mistake, all your div will become again some simple div.

We now need to feed this _ListView_ with some data grabbed from the RSS feed. In the function bind to the “**onactivated**” event, add this piece of code just above the **processAll()** line:

```javascript
articlesList = new WinJS.Binding.List();
var publicMembers = { ItemList: articlesList };
WinJS.Namespace.define("C9Data", publicMembers);
```

You’ll need then to declare the “_articlesList_” variable at the top of the function just below the “_app_” one for instance.

We’re declaring here a **Binding.List()** type. It’s the type to use to bind your data to the WinJS controls. It contains for instance some methods that will help you to add some data in background and thanks to the binding mechanism; it will be reflected into the view automatically.

Moreover, you may have noticed that we’re using some clean JavaScript code by using modern patterns like the “**module pattern**” for instance. For that, we have an anonymous self-executed JS function into “_default.js_”. We then need to find a way to expose some public data to external functions. That’s why we’re implementing the **Namespace** concept into the associated WinJS helper. It helps us to easily define what we’d like to expose. In our case, we will have a public “**C9Data**” object that will have an “**ItemList**” property containing our future elements to display.

We now need a function that’ll grad the data from the RSS feed, parse them and create some JS objects on the fly to push them into the famous binding list. Here is mine:

```javascript
function downloadC9BlogFeed() {
    WinJS.xhr({ url: "http://channel9.msdn.com/coding4fun/articles/RSS" }).then(
        function (rss) {}
    );
}
```

This function starts by running an asynchronous **XmlHttpRequest** to the specified URL. The code defined into the **Promise** (into the .then() if you want) will then be executed only once the request will be finished and the data received. It’s then here that we need to filter the data via this piece of code you have to insert into the anonymous function:

```javascript
var items = rss.responseXML.selectNodes("//item");
for (var n = 0; n < items.length; n++) {
    var article = {};
    article.title = items[n].selectSingleNode("title").text;
    var thumbs = items[n].selectNodes("media:thumbnail");
    if (thumbs.length > 1) {
        article.thumbnail = thumbs[1].attributes.getNamedItem("url").text;
        article.content = items[n].text;
        articlesList.push(article);
    }
}
```

I hope that this code will be self-explicit. It selects the “_item_” nodes, access to their interesting properties to map them to an “article” object created on the fly on the “_title_”, “_thumbs_” & “_content_” properties. Please keep in mind the name of those properties; we will use them later on. At last, this function finishes by adding this new object to the binding collection.

We now need to run this function during the starting phase of our application. This code should run once the DOM parsing will be done to build the WinJS controls. So, to do that, use this line of code:

    WinJS.UI.processAll().then(downloadC9BlogFeed);

We have to specify to the control its data source. Jump back into the HTML code and modify the div associated to the ListView to change its options:

```html
<div
    id="articlelist"
    data-win-control="WinJS.UI.ListView"
    data-win-options="{ itemDataSource: C9Data.ItemList.dataSource }"
></div>;
```

At last, we need some basic CSS to help the control to know how to draw each of its items. Jump to the “_default.css_” file and add these 2 rules:

```css
#articlelist
{
    width: 100%;
    height: 100%;
}
 
#articlelist .win-item
{
    width: 150px;
    height: 150px;
}
```

This CSS indicates that our ListView control should take all the available space of its container and that each of its items (via the “**.win-item**” class”) should take 150 by 150 pixels.

Run the solution by pressing F5. You’ll have something as ugly as that:

[![clip_image018](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141132GXI.jpg "clip_image018")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/4540.clip_5F00_image018_5F00_5DC84FB3.jpg)

But don’t panic, this ugly output is the expected behavior!  ![Clignement d'œil](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141252jlz.png) We still have a bit of design to work on. But you can already see that the binding works correctly and that the control works fine with touch’ & mouse experiences. Moreover, the control automatically scales to the various resolutions. You’ll then not have the exact layout (number of columns & lines displayed) that the above screen in your case.

## Step 5: using a template and modifying the design with Blend

We now need to change the way each element is drawn. This is exactly the purpose of the templating engine. A template is only a piece of HTML marked with WinJS attributes.

Navigate to the “_default.html_” page and add this piece of HTML just above the “_main_” part:

```html
<div
    id="C9ItemTemplate"
    data-win-control="WinJS.Binding.Template"
    style="display: none;"
>
        
    <div class="listItemTemplate">
                
        <div class="listItemImage">
                        
            <img data-win-bind="src: thumbnail" />
                    
        </div>
                
        <div class="listItemTitle" data-win-bind="innerText: title">
                    
        </div>
            
    </div>
</div>;
```

It’s an HTML template marked with the “**WinJS.Binding.Template**” value. This will help WinJS to know what to do with this special piece of HTML after the **processAll()** execution. You’ll find also the usage of “**_data-win-bind_**” to define binding expressions. It will help the binding engine to know which JavaScript properties from the data source to map to the appropriate HTML nodes. Except that, you can use some classic HTML.

We now need to configure the WinJS control to not use the default template anymore but to use the new one above instead. It’s done by simply changing the options:

```html
<div
    id="articlelist"
    data-win-control="WinJS.UI.ListView"
    data-win-options="{ itemDataSource: C9Data.ItemList.dataSource, itemTemplate: C9ItemTemplate }"
></div>;
```

If you now run the application, you should have this screen:

[![clip_image020](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141252q6Y.jpg "clip_image020")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/4846.clip_5F00_image020_5F00_6A7FC986.jpg)

It’s better but we’re not done yet. To go further in the design review, we need the help of our friend Blend.

So, let’s go back into Blend. It will ask you to reload all the modifications you’ve done inside Visual Studio. Once done, you’ll have that:

[![clip_image022](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141253OQ7.jpg "clip_image022")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/3823.clip_5F00_image022_5F00_12D93E9F.jpg)

Aren’t you surprised? You should! Indeed, we see here the same visual output you will have when you’ll press F5 in Visual Studio. This means that **Blend 5 is dynamically executing the JavaScript** part of your application directly inside the designer! This is an awesome feature.

Thanks to that, you will be able to directly work on real data without being forced to put in place what we call “_mocking_”. It’s the cool part of JavaScript. Blend was able to execute the JS code that launch the XHR request and build the WinJS objects.

Under “_default.css_”, let’s add 2 new CSS rules. Click on the “+” button on the main media query:

[![clip_image023](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/1412531Pm.png "clip_image023")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/5001.clip_5F00_image023_5F00_059A679F.png)

And add these new selectors:

**_.listItemTemplate_** and **_.listItemTemplate img_**

Select the **#articlelist .win-item** rule that will highlight each element of the ListView control with the “_articlelist_” ID.

Change the size of these elements to go from 150px by 150px to **250px by 250px**. You simply need to jump into the “**Sizing**” part of the right panel.

Force a refresh of the design surface by clicking on the dedicated button:

[![clip_image024](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141638kkc.png "clip_image024")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/6175.clip_5F00_image024_5F00_0FF0AD61.png)

And here is the result you should have:

[![clip_image026](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/1416389Xv.jpg "clip_image026")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/4503.clip_5F00_image026_5F00_73E27F26.jpg)

We’re now going to resize the template’s images. For that, select the “**Direct Selection**” pointer and click on one of the images:

[![clip_image028](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141639JBD.jpg "clip_image028")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/3581.clip_5F00_image028_5F00_1588EABC.jpg)

You can see the current applied CSS rules in the “**Applied Rules**” section. Click on “**.listItemTemplate img**” and resize with your mouse the image you’ve just selected. All the other images matching the same selector will then dynamically reflect the changes in real time.

Rather than searching the appropriate size, I’m going to help you. Jump into the “**Sizing**” section and fix the following size: **234px width** and **165px height**.

To enhance a bit more our design, we need some more space between each element and to align our ListView control with the title.

Click on the “**.listItemTemplate**” selector, navigate to the “**Layout**” section and click on the “**Lock**” icon at the right of the “**Margin**” area. Select any margin and type **8px**.

At last, to align the grid of the ListView control with the title, we need to move it from the left by 120px – 8px of the element margin we’ve just set.

Add a new selector by pressing on the “+” button and name it “**.win-surface**”. Fix a left margin of **112px**.

Go back to Visual Studio, accept the changes done and press F5. You should now have this kind of layout:

[![clip_image030](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/141639mlL.jpg "clip_image030")](http://blogs.msdn.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-01-10-46-metablogapi/3581.clip_5F00_image030_5F00_6EE21081.jpg)

## Step 6: video demonstrating all the steps & source code to download

Here are 2 HTML5 videos where I’m playing all these steps for you:

The first one will show you the **steps 1, 2 & 3**:

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/140652LuF.jpg)

The 2nd one will do the **steps 4 and 5**:

![](http://www.alloyteam.com/wp-content/uploads/auto_save_image/2012/05/140653aK3.jpg)

We’ve made good progress so far. We now need to display the detail of each article, to continue discovering the power of Blend as well as a couple of new cool CSS3 features. You can download the solution associated to this first article here: [Simple Channel9 Reader Article1](http://david.blob.core.windows.net/win8/SimpleChannel9ReaderArticle1.zip "http&#x3A;//david.blob.core.windows.net/win8/SimpleChannel9ReaderArticle1.zip")

See you in the next article for that.

David


<!-- {% endraw %} - for jekyll -->