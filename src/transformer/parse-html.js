const Turndown = require('turndown');
const gfm = require('turndown-plugin-gfm');

const td = new Turndown({
  codeBlockStyle: 'fenced',
});

td.use(gfm.gfm);

// turndown 中没有处理文本节点内出现 HTML 标签字样的转义，会导致这些 HTML 标签字样被解析成成真的 HTML 标签
// 例如 http://www.alloyteam.com/2012/05/pick-up-templates-speed-up/ 中出现的 <script type="text/plain"></script> 字样
const _escape = td.escape;
td.escape = (str) => _escape(str).replace(/</g, '&lt;');

const transformHTMLToMarkdown = (html) => td.turndown(html);
module.exports = transformHTMLToMarkdown;
