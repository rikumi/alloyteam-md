const url = require('url');
const remark = require('remark');
const remarkPangu = require('remark-pangu');
const visit = require('unist-util-visit');
const cos = require('../utils/cos');

// 图片和链接附件自动抓取并上传 COS
const remarkCOS = (baseURL) => () => async (tree, _, done) => {
  const attachmentNodes = [];
  visit(tree, 'image', (node) => attachmentNodes.push(node));
  visit(tree, 'link', (node) => attachmentNodes.push(node));
  await Promise.all(attachmentNodes.map(async (node) => {
    node.url = url.resolve(baseURL, node.url);
    if (node.type === 'image' || ~node.url.indexOf('/wp-content/uploads/')) {
      node.url = await cos.putRemote(node.url);
    }
  }));
  done();
}

const formatMarkdown = async (source, baseURL) => {
  return (await remark().use(remarkPangu).use(remarkCOS(baseURL)).process(source)).toString()
}

module.exports = formatMarkdown;