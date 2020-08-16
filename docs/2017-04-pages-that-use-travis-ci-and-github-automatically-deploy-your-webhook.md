---
title: 使用 Travis-CI 与 Github Webhook 自动部署你的页面
date: 2017-04-16
author: TAT.heyli
source_link: http://www.alloyteam.com/2017/04/pages-that-use-travis-ci-and-github-automatically-deploy-your-webhook/
---

[原文链接](https://github.com/lcxfs1991/blog/issues/19)

—— 以 webpack 文档部署为例子

## Overview

Some friends and I have been running [webpack-china](https://github.com/webpack-china) for a few months.  
After a few months effort, most [doc translation](https://doc.webpack-china.org/) job have also been done. We keep tracking the master and you will see Chinese version does not lag behind too much.

![pretty much the same and http2 is also applied](https://cloud.githubusercontent.com/assets/3348398/25069674/c09d483e-22ba-11e7-846b-70e857f06a70.png)

> (pretty much the same and http2 is also applied)

However it has been a while that we need to manually deploy the site. With the help of Travis-Ci and Github webhook,  
we finally make it an auto process.

Travis-CI is used for building your code that you need to publish and push them to your gh-pages branch. Github webhook then takes over the job and sends a request to your hosting server. When your server gets the request, it would run a script to pull the latest code from gh-page. The site then finish all the updating steps.

![Sample process](https://cloud.githubusercontent.com/assets/3348398/25069680/de36c294-22ba-11e7-8b5f-ff6258a02f71.png)

> (Sample process)

## Travis-CI

Here I will use webpack-china/webpack.js.org as an example. The repository is forked from webpack/webpack.js.org. But we have to modify it a bit.

![.travis.yml](https://cloud.githubusercontent.com/assets/3348398/25069681/ec110848-22ba-11e7-93cf-cc64661c6f0d.png)

> (.travis.yml)

This file is the configuration for Travis-CI. Not much difference from other project, branches means which branches will be watched by Travis-Ci. Node.js is used as the major programing language. Node 6.0 environment will be set up. The most important file should be [**deploy.sh**](https://github.com/webpack-china/webpack.js.org/blob/cn/scripts/deploy.sh). This file contains the commands used for deployment.

![1st part of deploy.sh](https://cloud.githubusercontent.com/assets/3348398/25069684/f7cd484a-22ba-11e7-97c1-a2c7e4634f19.png)

> (1st part of deploy.sh)

The 1st part of deploy.sh script is used for building the site. Ready releasing code will be put under **build** folder when you run

    npm run build
     

![2nd part of deploy.sh](https://cloud.githubusercontent.com/assets/3348398/25069686/0a7dd43c-22bb-11e7-8842-72d5f308ee7c.png)

> (2nd part of deploy.sh)

The 2nd part of the script is aiming for pushing code to gh-pages branch. But how does Travis-CI know get the permission to access your repo?  
SSH Key does the trick for you. Please follow this guide, [Generating a new SSH key to generate SSH Key](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/#platform-mac). (Please do it under your local repository folder)

example code:

```ruby
ssh-keygen -t rsa -b 4096 -C ci@travis-ci.org
 
Enter file in which to save the key (/var/root/.ssh/id_rsa): deploy_key
 
```

When you are asked to enter passphrase, please type enter to skip.

    Enter passphrase (empty for no passphrase):
     

Then open **deploy_key.pub** and copy whole file content. Add that deploy key to your repository at `https://github.com/<your name>/<your repo>/settings/keys`.

![deploy keys in github](https://cloud.githubusercontent.com/assets/3348398/25069705/ba001bae-22bb-11e7-9a26-d120acc259ce.png)  
(deploy keys in github)

Next, install [travis client tool](https://github.com/travis-ci/travis.rb#installation) to upload SSH Key information to the Travis-CI.

After installation, run

    travis encrypt-file deploy_key
     

![travis encrypt-file result](https://cloud.githubusercontent.com/assets/3348398/25069712/e76167c4-22bb-11e7-939f-2897f97937ba.png)  
(travis encrypt-file result)

Add the script to deploy.sh under scripts folder and also add deploy_key.enc to scripts folder. Append scripts/ to delopy_key and deploy_key in this script as follows,

```javascript
openssl aes-256-cbc -K $encrypted_7562052d3e34_key -iv $encrypted_7562052d3e34_iv -in scripts/deploy_key.enc -out scripts/deploy_key -d
 
```

Please do not to upload **deploy_key.pub**.

If it prompts login info, try

    travis login
     

Then you can push everything to the repository and Travis-CI will build and push things for you.  
One more thing to note is that `npm run deploy` in deploy.sh is used here which use gh-pages library to push code to [gh-pages](https://www.npmjs.com/package/gh-pages).

## GitHub Webhook

![1st part Github Webhook](https://cloud.githubusercontent.com/assets/3348398/25069725/485518aa-22bc-11e7-8695-781140412f68.png)  
(1st part Github Webhook)

![2nd part of Github Webhook](https://cloud.githubusercontent.com/assets/3348398/25069730/4df543e8-22bc-11e7-9de5-fba7a2b9d509.png)  
(2nd part of Github Webhook)

Add a webhook in your project (1st part of Github Webhook) and you can specify when Github will send the request (2nd part of Github Webhook).

![app to receive Github Webhook Request](https://cloud.githubusercontent.com/assets/3348398/25069734/6e9617b2-22bc-11e7-8ad6-d4a3f707b8f3.png)  
(app to receive Github Webhook Request)

Then you need to deploy a small app ([pm2](https://www.npmjs.com/package/pm2) is recommended to persist the app process) to respond to Github Webhook.

**codePath** is the path where accommodate production code from gh-pages branch.

**updateCommand**,

    cd ${codePath};sudo git fetch — all;sudo git reset — hard origin/gh-pages;
     

is to fetch all stuff from gh-pages branch and only show the latest record.  
Don’t forget to configure your **nginx/apache** to serve your static files in codePath.

## Reference

[Auto-deploying built products to gh-pages with Travis](https://gist.github.com/domenic/ec8b0fc8ab45f39403dd)