# alloyteam-md

一个 AlloyTeam 博客文章本地备份爬虫，自动加盘古之白，自动格式化代码，图片和附件自动上传 COS，转换为带 FrontMatter 的精美的 Markdown，博客迁移时有备无患。

## 使用

创建 .env 文件：

```ini
COS_SECRET_ID=<COS 的 SecretId>
COS_SECRET_KEY=<COS 的 SecretKey>
COS_BUCKET=<COS 的 Bucket>
COS_REGION=<COS 的 Region>
```

然后运行 `npm run start` 即可在 `posts` 里看到生成的文章。

## 效果

![image](https://user-images.githubusercontent.com/5051300/90339708-16d9b680-e025-11ea-9df8-4af58bba4daa.png)
