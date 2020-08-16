const fs = require('fs');
const url = require('url');
const path = require('path');
const uuid = require('uuid');
const mime = require('mime');
const axios = require('axios').default;
const pangu = require('pangu');
const mkdirp = require('mkdirp');
const dotenv = require('dotenv');
const remark = require('remark');
const cheerio = require('cheerio');
const Turndown = require('turndown');
const prettier = require('prettier');
const COS = require('cos-nodejs-sdk-v5');
const visit = require('unist-util-visit');
const axiosRetry = require('axios-retry');
const htmlEscape = require('html-escaper');
const gfm = require('turndown-plugin-gfm');
const remarkPangu = require('remark-pangu');
const detectLang = require('lang-detector');

const POST_ZERO = 'http://www.alloyteam.com/2011/10/we_forever/';

process.on('uncaughtException', (e) => console.trace(e));
process.on('unhandledRejection', (e) => { throw e });

dotenv.config();

axiosRetry(axios, { retries: 3 });

const td = new Turndown({
  codeBlockStyle: 'fenced',
});

td.use(gfm.gfm);

const enableCOS = !!process.env.COS_SECRET_ID;
const cos = enableCOS ? new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
}) : null;

/**
 * 抓取文章页面
 */
const fetchDocument = (url) => axios.get(url).then(({ data }) => cheerio.load(data, { decodeEntities: true }));

/**
 * 转换文章正文
 */
const getContent = async ($) => {
  const content = $('.content_banner .text');

  // 处理万恶的后端代码高亮
  // 去掉代码里的行号
  content.find('.crayon-syntax .crayon-nums').remove();

  // 抽取出纯文本代码，替换掉代码区
  content.find('.crayon-syntax').toArray().map((el) => {
    el = $(el);
    let code = el.find('.crayon-line').toArray().map((el) => $(el).text()).join('\n');

    // 探测语言，把 java 修正为 JS
    const language = detectLang(code).toLowerCase()
      .replace(/^unknown$/, '')
      .replace(/^java$/, 'javascript');

    // 格式化 JS 代码
    if (language === 'javascript' || language === 'html' || language === 'css') {
      try {
        code = prettier.format(code, { parser: 'babel', tabWidth: 4 });
      } catch (e) { }
    }

    // 把语言记录在 class 里，turndown 会从里面拿
    el.replaceWith(`<pre><code class="language-${language}">${htmlEscape.escape(code)}</code></pre>`);
  });

  const parsedMD = td.turndown(content.html());
  const formattedMD = (
    await remark()
      // 盘古之白
      .use(remarkPangu)

      // 图片和链接附件自动抓取并上传 COS
      .use(() => async (tree, _, done) => {
        const attachmentNodes = [];
        visit(tree, 'image', (node) => attachmentNodes.push(node));
        visit(tree, 'link', (node) => attachmentNodes.push(node));
        await Promise.all(attachmentNodes.map(async (node) => {
          if (node.type === 'image' || ~node.url.indexOf('/wp-content/uploads/')) {
            node.url = await transformAttachment(node.url);
          }
        }));
        done();
      })
      .process(parsedMD)
  ).toString();

  return formattedMD;
};

/**
 * 获取文章标题、日期和下一篇文章 url
 */
const getTitle = ($) => pangu.spacing($('.blogTitle').text());
const getDate = ($) => /\d+年\d+月\d+/.exec($('.blogPs').text())[0].replace(/[年月]/g, '-');
const getAuthor = ($) => $('[rel="author"]').text();
const getNext = ($) => $('link[rel="next"]').attr('href');

/**
 * 下载文件并上传到 COS
 */
const transformAttachment = async (src) => {
  if (!enableCOS) return src;
  try {
    const { data, headers } = await axios.get(src, { responseType: 'arraybuffer' });
    const contentType = headers['Content-Type'] || headers['content-type'] || 'image/jpeg';
    const ext = mime.getExtension(contentType);
    const res = await new Promise((resolve, reject) => cos.putObject({
      Bucket: process.env.COS_BUCKET,
      Region: process.env.COS_REGION,
      Key: uuid.v4() + '.' + ext,
      ContentType: contentType,
      Body: Buffer.from(data),
    }, (err, data) => err ? reject(err) : resolve(data)));
    return 'https://' + res.Location;
  } catch (e) {
    return '#';
  }
}

/**
 * 生成最终的文件名和文件内容
 */
const formatFileName = (src) => {
  return decodeURIComponent(url.parse(src).path)
    .replace(/(?<![-/])\b(?![-/])/g, '-')
    .replace(/^\/|\/$/g, '')
    .replace(/[/_]/g, '-') + '.md';
}

const formatFile = ({ src, title, date, author, content }) => (`
---
title: ${title}
date: ${date}
author: ${author}
source_link: ${src}
---

${content}
`.trim());

/**
 * 解析文件
 */
const processFile = async (src) => {
  const $ = await fetchDocument(src);
  const title = getTitle($);
  const date = getDate($);
  const author = getAuthor($);
  const content = await getContent($);
  const next = getNext($);
  const file = path.join(__dirname, '../posts', formatFileName(src));

  mkdirp.sync(path.dirname(file));
  fs.writeFileSync(file, formatFile({ src, title, date, author, content }));
  return { next };
};

/**
 * main
 */
(async () => {
  let url = POST_ZERO;
  while (url) {
    console.log(`Processing ${url}...`);
    url = (await processFile(url)).next;
  }
})();
