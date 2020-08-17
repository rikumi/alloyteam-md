const prettier = require('prettier');
const htmlEscape = require('html-escaper');
const detectLang = require('lang-detector');

const transformAllCodesInPost = ($, contentEl) => {
  // 处理万恶的后端代码高亮
  // 去掉代码里的行号
  contentEl.find('.crayon-syntax .crayon-nums').remove();

  // 抽取出纯文本代码，替换掉代码区
  contentEl.find('.crayon-syntax').toArray().map((el) => {
    el = $(el);
    let code = el.find('.crayon-line').toArray().map((el) => $(el).text()).join('\n');

    // 探测语言，把 java/php/c++ 修正为 JS
    const language = detectLang(code).toLowerCase()
      .replace(/^unknown$/, '')
      .replace(/^(java|php|c\+\+)$/, 'javascript');

    // 格式化 JS 代码
    if (language === 'javascript' || language === 'html' || language === 'css') {
      try {
        code = prettier.format(code, { parser: 'babel', tabWidth: 4 });
      } catch (e) { }
    }

    // 把语言记录在 class 里，turndown 会从里面拿
    el.replaceWith(`<pre><code class="language-${language}">${htmlEscape.escape(code)}</code></pre>`);
  });
}

module.exports = transformAllCodesInPost;