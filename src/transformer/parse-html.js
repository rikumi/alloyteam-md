const Turndown = require('turndown');
const gfm = require('turndown-plugin-gfm');

const td = new Turndown({
  codeBlockStyle: 'fenced',
});

td.use(gfm.gfm);

const transformHTMLToMarkdown = (html) => {
  return td.turndown(html)
    // 普通文本中的 script 标签不知道为啥不会被转义，先手动加上代码块
    .replace(/(<script\b[\s\S]*?>[\s\S]*?<\/\s*script>)/ig, '\n```html\n$1\n```\n');
};

module.exports = transformHTMLToMarkdown;
