const markdownIt = require("markdown-it");
const md = markdownIt();

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("MyPostContent", function (content) {
    const [leftColumnContent, rightColumnContent] = content.split('@@@');
    const leftColumnHtml = md.render(leftColumnContent);
    const rightColumnHtml = md.render(rightColumnContent);

    return `
      <article class="case row">
        <div class="col-sm-4">
          ${leftColumnHtml}
        </div>
        <div class="col-sm-8">
          ${rightColumnHtml}
        </div>
      </article>`;
  });
};