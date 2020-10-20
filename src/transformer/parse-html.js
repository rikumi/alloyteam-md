const Turndown = require('turndown');
const gfm = require('turndown-plugin-gfm');

const td = new Turndown({
  codeBlockStyle: 'fenced',
});

td.use(gfm.gfm);

const transformHTMLToMarkdown = (html) => {
  // 正文中被转义的 HTML 标签在输出的时候不知道为啥会被解除转义，这里多转义一次
  return td.turndown(html.replace(/&lt;/g, '&amp;lt;'));
};

module.exports = transformHTMLToMarkdown;
