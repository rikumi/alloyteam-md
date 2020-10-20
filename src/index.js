const fs = require('fs');
const url = require('url');
const path = require('path');
const yaml = require('yaml');
const pangu = require('pangu');
const mkdirp = require('mkdirp');
const cheerio = require('cheerio');

const axios = require('./utils/axios');
const transformAllCodesInPost = require('./transformer/code');
const transformHTMLToMarkdown = require('./transformer/parse-html');
const formatMarkdown = require('./transformer/format-markdown');

const POST_ZERO = 'http://www.alloyteam.com/2011/10/we_forever/';

process.on('uncaughtException', (e) => console.trace(e));
process.on('unhandledRejection', (e) => { throw e });

/**
 * 抓取文章页面
 */
const fetchDocument = (url) => axios.get(url).then(({ data }) => cheerio.load(data, { decodeEntities: true }));

/**
 * 从文章里提取信息
 */
const getTitle = ($) => pangu.spacing($('.blogTitle').text());
const getDate = ($) => /\d+年\d+月\d+/.exec($('.blogPs').text())[0].replace(/[年月]/g, '-');
const getAuthor = ($) => $('[rel="author"]').text();
const getNext = ($) => $('link[rel="next"]').attr('href');
const getContent = async ($, baseURL) => {
  const content = $('.content_banner .text');
  transformAllCodesInPost($, content);
  const parsedMD = transformHTMLToMarkdown(content.html())
  return await formatMarkdown(parsedMD, baseURL);
};

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
title: ${yaml.stringify(title).trim()}
date: ${yaml.stringify(date).trim()}
author: ${yaml.stringify(author).trim()}
source_link: ${yaml.stringify(src).trim()}
---

<!-- {% raw %} - for jekyll -->

${content}

<!-- {% endraw %} - for jekyll -->
`.trim());

const dir = path.join(__dirname, '../docs');
mkdirp.sync(dir);

const indexFile = path.join(dir, 'index.md');
let indexContent = '';

/**
 * 解析文件
 */
const processFile = async (src) => {
  const $ = await fetchDocument(src);
  const title = getTitle($);
  const date = getDate($);
  const author = getAuthor($);
  const next = getNext($);
  getContent($, src).then(content => {
    const relative = formatFileName(src);
    const file = path.join(dir, relative);
    fs.writeFileSync(file, formatFile({ src, title, date, author, content }));
    indexContent = `# [${title}](./${relative})\n${date} by ${author}\n\n` + indexContent;
    fs.writeFileSync(indexFile, indexContent);
  });
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
